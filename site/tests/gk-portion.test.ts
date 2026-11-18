import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadReviewedPortions, portionPreparationHash, projectPortionEvidence } from "../scripts/gk-portion-projection";
import { countGkPortionCoverage, originalPortionGk, verbalGkForPortion } from "../src/features/recipes/gk-portion";
import { originalGlycemicLoadCategory } from "../scripts/glycemic-load-filter";
import { recipeBindingHash } from "../scripts/glycemic-load-recipe-binding";

const root = path.resolve(import.meta.dirname, "../..");

test("rounded UI values cannot change the original GK category", () => {
  const candidate = {
    recipeId: "example", status: "CALCULATED" as const, confidence: "LOW" as const,
    glycemicLoadPerServing: 10, glycemicLoadRangePerServing: null,
    unroundedGlycemicLoadPerServing: 10.004, sourceReferences: [],
  };
  assert.equal(originalGlycemicLoadCategory(candidate), "medium");
  assert.equal(originalPortionGk(candidate, 1).category, "MEDIUM");
  assert.equal(originalPortionGk(candidate, 2).category, "HIGH");
  const contradictoryRange = { ...candidate, glycemicLoadPerServing: 9.99,
    unroundedGlycemicLoadPerServing: 9.99, glycemicLoadRangePerServing: { min: 10.01, max: 10.02 } };
  assert.equal(originalPortionGk(contradictoryRange).category, null);
  assert.equal(originalPortionGk(contradictoryRange).inconsistent, true);
  assert.equal(originalGlycemicLoadCategory(contradictoryRange), null);
  const withOmission = { ...candidate, omittedAvailableCarbohydratePerServingG: 0.4 };
  assert.equal(originalGlycemicLoadCategory(withOmission), null);
  assert.equal(originalPortionGk(withOmission, 1).omissionLimitsClass, true);
  assert.equal(originalPortionGk(withOmission, 2).omissionLimitsClass, false);
  const roundedStandard = { ...candidate, unroundedGlycemicLoadPerServing: null, glycemicLoadPerServing: 4 };
  assert.deepEqual(originalPortionGk(roundedStandard, 1).estimate, { type: "EXACT_MODEL", value: 4 });
  assert.equal(originalPortionGk(roundedStandard, 2).standardServingOnly, true);
  assert.equal(originalPortionGk(roundedStandard, 2).category, null);
  const withRange = { ...roundedStandard, glycemicLoadRangePerServing: { min: 4, max: 5 } };
  assert.deepEqual(originalPortionGk(withRange, 2).estimate, { type: "ESTIMATED_RANGE", range: { min: 8, max: 10 } });
});

test("reviewed verbal GK only applies to the approved recipe portion and current evidence", async () => {
  const recipeId = "taytetyt-kananmunat-yrteilla";
  const markdown = await readFile(path.join(root, "reseptit/valipalat", recipeId + ".md"), "utf8");
  const reviews = JSON.parse(await readFile(path.join(root, "docs/nutrition/gk-reviewed-portions.json"), "utf8"));
  const { portion } = await projectPortionEvidence(root, recipeId, markdown, reviews[recipeId]);
  assert.deepEqual(portion.availableCarbs, { min: 0.5, max: 0.5 });
  assert.equal(portion.reviewedSource, "https://glycemicindex.com/faqs/");
  assert.equal(verbalGkForPortion(portion.verbal, 1), "LOW");
  assert.equal(verbalGkForPortion(portion.verbal, 1.5), null);
  assert.equal(originalGlycemicLoadCategory(undefined, portion), "low");
  assert.equal(originalGlycemicLoadCategory(undefined, { availableCarbs: portion.availableCarbs }), null);
  assert.equal(recipeBindingHash(markdown.replace(/^title: .+$/m, 'title: "Toimitettu kuvaus"')), recipeBindingHash(markdown));
  const changedInstructions = markdown.replace("## Valmistus", "## Valmistus\n\nLisää tarjoiluun leipä.");
  assert.equal(recipeBindingHash(changedInstructions), recipeBindingHash(markdown));
  assert.notEqual(portionPreparationHash(changedInstructions), portionPreparationHash(markdown));
  await assert.rejects(projectPortionEvidence(root, recipeId, changedInstructions, reviews[recipeId]), /preparation or serving notes changed/);
  await assert.rejects(projectPortionEvidence(root, recipeId, markdown.replace("servings: 6", "servings: 7"), reviews[recipeId]), /no longer matches the recipe/);
  await assert.rejects(projectPortionEvidence(root, recipeId, markdown, {
    ...reviews[recipeId], nutritionSha256: createHash("sha256").update("changed").digest("hex"),
  }), /nutrition evidence changed/);
  await assert.rejects(projectPortionEvidence(root, recipeId, markdown, {
    ...reviews[recipeId], verbal: undefined, verbalNoteEdits: { fi: { before: "GK", after: "Numeerinen GK" } },
  }), /notice requires a current verbal estimate/);
});

test("partial ingredient quantities remain separate from the whole portion and its GK class", async () => {
  const reviews = await loadReviewedPortions(root);
  const bananaId = "malesialainen-kookos-banaanikulho";
  const banana = readFile(path.join(root, "reseptit/aamupalat", `${bananaId}.md`), "utf8");
  const brikId = "tunisialainen-brik";
  const brik = readFile(path.join(root, "reseptit/alkuruoat", `${brikId}.md`), "utf8");
  const [bananaSource, brikSource] = await Promise.all([banana, brik]);
  const { portion } = await projectPortionEvidence(root, bananaId, bananaSource, reviews[bananaId]);
  const { portion: brikPortion } = await projectPortionEvidence(root, brikId, brikSource, reviews[brikId]);
  assert.equal(portion.ingredientPortion?.amountPerServing, 100);
  assert.equal(portion.ingredientPortion?.unit, "g");
  assert.equal(portion.ingredientPortion?.availableCarbsGPerServing, 18.3);
  assert.equal(brikPortion.ingredientPortion?.amountPerServing, 1);
  assert.equal(brikPortion.ingredientPortion?.unit, "arkkia");
  assert.equal(brikPortion.ingredientPortion?.availableCarbsGPerServing, undefined);
  assert.equal(portion.availableCarbs, undefined);
  assert.equal(originalGlycemicLoadCategory(undefined, portion), null);
  const coverage = countGkPortionCoverage([{ numeric: false, carbs: null, evidence: portion, pending: true }]);
  assert.equal(coverage.foodNoteOnly, 1);
  assert.equal(coverage.wholePortionCarbs, 0);
  assert.equal(coverage.pending, 1);
  const review = reviews[bananaId];
  const ingredient = review.ingredientPortion!;
  await assert.rejects(projectPortionEvidence(root, bananaId, bananaSource, {
    ...review, ingredientPortion: { ...ingredient, ingredientSha256: "changed" },
  }), /partial ingredient amount no longer matches/);
  await assert.rejects(projectPortionEvidence(root, bananaId, bananaSource, {
    ...review, ingredientPortion: { ...ingredient, sourceReview: { ...ingredient.sourceReview!, sha256: "changed" } },
  }), /source review for the partial ingredient changed/);
});

test("a package label projects only the named ingredient's carbohydrate", async () => {
  const id = "gluteeniton-siemenvuokaleipa";
  const [reviews, markdown] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/leivonnaiset", id + ".md"), "utf8"),
  ]);
  const review = reviews[id];
  const ingredient = review.ingredientPortion!;
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.equal(portion.ingredientPortion?.amountPerServing, 17.5);
  assert.equal(portion.ingredientPortion?.declaredCarbsGPerServing, 13.125);
  assert.equal(portion.ingredientPortion?.availableCarbsGPerServing, undefined);
  assert.equal(portion.availableCarbs, undefined);
  assert.equal(originalGlycemicLoadCategory(undefined, portion), null);
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, ingredientPortion: { ...ingredient, availableCarbsGPer100g: 60 },
  }), /must use one composition basis/);
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, ingredientPortion: { ...ingredient, declaredCarbsGPer100g: 101 },
  }), /invalid partial ingredient carbohydrate composition/);
});

test("a standalone carbohydrate estimate requires a proved zero bound on every omitted ingredient", async (t) => {
  const id = "indonesialainen-bakwan-jagung-kotiversio";
  const calculationPath = path.join("docs/nutrition/calculations", id + ".json");
  const [reviews, markdown, raw] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/aamupalat", id + ".md"), "utf8"),
    readFile(path.join(root, calculationPath), "utf8"),
  ]);
  const review = reviews[id];
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.deepEqual(portion.availableCarbs, { min: 42.38, max: 42.38 });
  assert.equal(portion.verbal, undefined);
  const { portion: historical } = await projectPortionEvidence(root, id, markdown, {
    ...review, wholeCarbohydrateOnly: undefined,
  });
  assert.equal(historical.availableCarbs, undefined);

  const fixture = await mkdtemp(path.join(tmpdir(), "recipavo-carbohydrate-"));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  const file = path.join(fixture, calculationPath);
  await mkdir(path.dirname(file), { recursive: true });
  const evidence = JSON.parse(raw);
  const oil = evidence.ingredients.find((ingredient: { item: string }) => ingredient.item === "rypsiöljyä paistamiseen");
  oil.omissionImpactUpperBoundPerServing.totalCarbohydrate = 0.1;
  const changed = JSON.stringify(evidence);
  await writeFile(file, changed, "utf8");
  await assert.rejects(projectPortionEvidence(fixture, id, markdown, {
    ...review, nutritionSha256: createHash("sha256").update(changed).digest("hex"),
  }), /reviewed standalone carbohydrate requires evidence for every ingredient/);
});

test("a missing polyol value is safe only when normalization yields available carbohydrate", async (t) => {
  const id = "uuniriisipuuro";
  const calculationPath = path.join("docs/nutrition/calculations", id + ".json");
  const [reviews, markdown, raw] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/aamupalat", id + ".md"), "utf8"),
    readFile(path.join(root, calculationPath), "utf8"),
  ]);
  const review = reviews[id];
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.deepEqual(portion.availableCarbs, { min: 44.15, max: 44.15 });
  assert.deepEqual(portion.driver, { ingredientIndex: 1, coversMajority: true });
  assert.equal(portion.verbal, undefined);

  const fixture = await mkdtemp(path.join(tmpdir(), "recipavo-unknown-polyols-"));
  t.after(() => rm(fixture, { recursive: true, force: true }));
  const file = path.join(fixture, calculationPath);
  await mkdir(path.dirname(file), { recursive: true });
  const evidence = JSON.parse(raw);
  evidence.ingredients[1].record.carbohydrateDefinition = "EU_TOTAL_INCLUDING_POLYOLS";
  const changed = JSON.stringify(evidence);
  await writeFile(file, changed, "utf8");
  await assert.rejects(projectPortionEvidence(fixture, id, markdown, {
    ...review, nutritionSha256: createHash("sha256").update(changed).digest("hex"),
  }), /reviewed standalone carbohydrate requires evidence for every ingredient/);
});

test("reviewed preparations scale only the same weighed ingredient", async () => {
  const id = "bataattiletut";
  const [reviews, markdown] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/aamupalat", id + ".md"), "utf8"),
  ]);
  const review = reviews[id];
  const ingredient = review.ingredientPortion!;
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.equal(portion.ingredientPortion?.amountPerServing, 105);
  const choices = portion.ingredientPortion?.carbohydrateAlternatives;
  assert.equal(choices?.length, 2);
  assert.ok(Math.abs(choices![0].availableCarbsGPerServing - 19.20765) < 1e-9);
  assert.ok(Math.abs(choices![1].availableCarbsGPerServing - 17.6715) < 1e-9);
  assert.equal(portion.availableCarbs, undefined);
  assert.equal(portion.verbal, undefined);
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review,
    ingredientPortion: { ...ingredient, declaredCarbsGPer100g: 25 },
  }), /partial ingredient carbohydrate must use one composition basis/);
});

test("manufacturer-label carbohydrates do not become standalone available carbohydrates", async () => {
  const reviews = await loadReviewedPortions(root);
  for (const [id, expected] of [["lammin-chia-puuro-rouva-keto", 1.05], ["rasvakaakao-rouva-keto", 2.1]] as const) {
    const markdown = await readFile(path.join(root, "reseptit/aamupalat", id + ".md"), "utf8");
    const review = reviews[id];
    const { portion } = await projectPortionEvidence(root, id, markdown, review);
    assert.equal(portion.ingredientPortion?.declaredCarbsGPerServing, expected);
    assert.equal(portion.availableCarbs, undefined);
    await assert.rejects(projectPortionEvidence(root, id, markdown, {
      ...review, wholeCarbohydrateOnly: {},
    }), /reviewed standalone carbohydrate requires evidence for every ingredient/);
  }
});
