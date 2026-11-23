import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadReviewedPortions, portionPreparationHash, projectPortionEvidence } from "../scripts/gk-portion-projection";
import { countGkPortionCoverage, originalPortionCarbs, originalPortionGk, reviewedIngredientPortions, verbalGkForPortion } from "../src/features/recipes/gk-portion";
import { formatOriginalPortionGk } from "../src/features/recipes/gk80-format";
import { originalGlycemicLoadCategory } from "../scripts/glycemic-load-filter";
import { recipeBindingHash } from "../scripts/glycemic-load-recipe-binding";

const root = path.resolve(import.meta.dirname, "../..");

test("three legacy totals retain their definition alongside weighed ingredient estimates", async () => {
  const reviews = await loadReviewedPortions(root);
  const cases = [
    ["hummus", "alkuruoat", 100, 17.6, 25.16, 18.54],
    ["vhh-kaalikaarryleet", "paaruoat", 62.5, 1.46875, 23.34, 15.48],
    ["chole-bhature", "paaruoat", 87.5, 64.74825, 118.4, 105.3],
  ] as const;
  for (const [id, category, mass, carbs, total, net] of cases) {
    const markdown = await readFile(path.join(root, "reseptit", category, id + ".md"), "utf8");
    const { portion } = await projectPortionEvidence(root, id, markdown, reviews[id]);
    const [ingredient] = reviewedIngredientPortions(portion);
    assert.equal(ingredient.amountPerServing, mass);
    assert.ok(Math.abs(ingredient.availableCarbsGPerServing! - carbs) < 1e-9);
    assert.match(ingredient.source!, /^https:\/\/fineli\.fi\/fineli\/api\/v1\/foods\//);
    assert.deepEqual(Object.keys(ingredient.name).sort(), ["en", "fi", "sv", "th"]);
    assert.deepEqual(originalPortionCarbs({ carbsTotalG: total, carbsNetG: net, fatG: null, proteinG: null }, portion),
      { range: { min: total, max: total }, definition: "total" });
  }
});

test("approved recipe-specific net models take precedence over total carbohydrate", async () => {
  const cases = [
    ["jauheliha-kaalikeitto-vhh", "jauheliha-kaalikeitto-vhh", 10.21, 12],
    ["vhh-kaalilaatikko", "kaalilaatikko", 9.52, 13],
    ["uunikanapasta-kesakurpitsa", "uunikanapasta-kesakurpitsa", 7.4, 10.4],
  ] as const;
  for (const [id, filename, net, total] of cases) {
    const markdown = await readFile(path.join(root, "reseptit/paaruoat", filename + ".md"), "utf8");
    const { portion } = await projectPortionEvidence(root, id, markdown);
    assert.equal(portion.availableCarbs, undefined);
    assert.deepEqual(Object.keys(portion.carbohydrateScope ?? {}).sort(), ["en", "fi", "sv", "th"]);
    const nutrition = { carbsTotalG: total, carbsNetG: net, fatG: null, proteinG: null };
    assert.deepEqual(originalPortionCarbs(nutrition, portion), { range: { min: net, max: net }, definition: "net" });
    assert.deepEqual(originalPortionCarbs(nutrition), { range: { min: total, max: total }, definition: "total" });
    await assert.rejects(projectPortionEvidence(root, id, markdown + "\n"), /approved net carbohydrate model/);
  }
});

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

test("an approved range without a point keeps its class and both display endpoints", () => {
  const result = {
    status: "CALCULATED", confidence: "LOW", glycemicLoadPerServing: null,
    glycemicLoadRangePerServing: { min: 4.75, max: 5.25 },
  };
  const portion = originalPortionGk(result);
  assert.equal(portion.inconsistent, false);
  assert.equal(portion.rangeOnly, true);
  assert.equal(originalGlycemicLoadCategory(result), "low");
  for (const [locale, expected] of [["fi-FI", "4,75–5,25"], ["en-GB", "4.75–5.25"],
    ["sv-SE", "4,75–5,25"], ["th-TH", "4.75–5.25"]]) {
    assert.equal(formatOriginalPortionGk(portion.estimate, locale, false, portion.rangeOnly).value, expected);
  }
  const tied = originalPortionGk({ ...result, glycemicLoadRangePerServing: { min: 1.005, max: 1.006 } });
  assert.equal(formatOriginalPortionGk(tied.estimate, "en-GB", false, tied.rangeOnly).value, "1.005–1.006");
  const nearBoundary = originalPortionGk({ ...result, glycemicLoadRangePerServing: { min: 19.8, max: 19.95 } });
  assert.deepEqual(formatOriginalPortionGk(nearBoundary.estimate, "en-GB", false, nearBoundary.rangeOnly),
    { value: "19.8–20", roundingHitsBoundary: true });
  const narrow = originalPortionGk({ ...result, glycemicLoadRangePerServing: { min: 4.7511, max: 4.7512 } });
  assert.equal(formatOriginalPortionGk(narrow.estimate, "fi-FI", false, narrow.rangeOnly).value, "4,7511–4,7512");
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

test("reviewed ingredient GK subtotals require a preparation-bound scope in every language", async () => {
  const id = "khao-kha-moo-vhh";
  const recipe = await readFile(path.join(root, "reseptit/paaruoat", `${id}.md`), "utf8");
  const review = (await loadReviewedPortions(root))[id];
  const { portion } = await projectPortionEvidence(root, id, recipe, review);
  assert.equal(portion.gkIngredientSubset, true);
  await assert.rejects(projectPortionEvidence(root, id, recipe, {
    ...review, condition: { ...review.condition!, th: "" },
  }), /subtotal requires a localized ingredient scope/);
  await assert.rejects(projectPortionEvidence(root, id, recipe, {
    ...review, preparationSha256: "changed",
  }), /preparation or serving notes changed/);
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

test("two reviewed sauce portions keep separate label values and fail on stale or duplicate evidence", async () => {
  const id = "kebab-munakasrulla";
  const markdown = await readFile(path.join(root, "reseptit/paaruoat", `${id}.md`), "utf8");
  const review = (await loadReviewedPortions(root))[id];
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  const rows = reviewedIngredientPortions(portion);
  assert.deepEqual(rows.map(item => item.amountPerServing), [20, 20]);
  assert.deepEqual(rows.map(item => item.declaredCarbsGPerServing), [2.4, 2]);
  assert.ok(rows.every(item => item.availableCarbsGPerServing === undefined));
  assert.equal(portion.availableCarbs, undefined);
  assert.equal(originalGlycemicLoadCategory(undefined, portion), null);
  const second = review.additionalIngredientPortions![0];
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, additionalIngredientPortions: [{ ...second, ingredientSha256: "changed" }],
  }), /partial ingredient amount no longer matches/);
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, additionalIngredientPortions: [review.ingredientPortion!],
  }), /distinct ingredients/);
  const repeatedWithStringIndex = { ...review.ingredientPortion!, index: String(review.ingredientPortion!.index) as unknown as number };
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, additionalIngredientPortions: [repeatedWithStringIndex],
  }), /partial ingredient amount no longer matches/);
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, additionalIngredientPortions: [{ ...second, source: undefined }],
  }), /additional ingredient carbohydrate requires its own source/);
});

test("raw pasta accompaniments keep their own source and never become a whole serving", async () => {
  const reviews = await loadReviewedPortions(root);
  for (const [id, weight, available, declared] of [
    ["uunifetapasta-kirsikkatomaateilla", 112.5, 3.9375, undefined],
    ["linssimakaronilaatikko", 25, undefined, 10.75],
  ] as const) {
    const markdown = await readFile(path.join(root, "reseptit", "paaruoat", id + ".md"), "utf8");
    const { portion } = await projectPortionEvidence(root, id, markdown, reviews[id]);
    const [pasta, ingredient] = reviewedIngredientPortions(portion);
    assert.ok(pasta.amountPerServing > 0);
    assert.equal(ingredient.amountPerServing, weight);
    assert.equal(ingredient.availableCarbsGPerServing, available);
    assert.equal(ingredient.declaredCarbsGPerServing, declared);
    assert.ok(ingredient.source?.startsWith("https://"));
    assert.equal(portion.availableCarbs, undefined);
    assert.equal(originalGlycemicLoadCategory(undefined, portion), null);
  }
});

test("volume-only ingredient evidence cannot carry a per-100-gram carbohydrate value", async () => {
  const id = "punajuuririsotto";
  const [reviews, markdown] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/paaruoat", `${id}.md`), "utf8"),
  ]);
  const review = reviews[id];
  const ingredient = review.ingredientPortion!;
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.equal(portion.ingredientPortion?.unit, "dl");
  assert.equal(portion.ingredientPortion?.amountPerServing, 0.8);
  assert.equal(portion.availableCarbs, undefined);
  for (const compositionKey of ["availableCarbsGPer100g", "declaredCarbsGPer100g"] as const) {
    await assert.rejects(projectPortionEvidence(root, id, markdown, {
      ...review, ingredientPortion: { ...ingredient, source: review.source, [compositionKey]: 75 },
    }), /invalid partial ingredient carbohydrate composition/);
  }
});

test("an optional side stays outside the recipe and is bound to its exact food and preparation", async () => {
  const id = "kerala-kalacurry";
  const [reviews, markdown] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/paaruoat", `${id}.md`), "utf8"),
  ]);
  const review = reviews[id];
  const original = await projectPortionEvidence(root, id, markdown);
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.deepEqual(portion.availableCarbs, original.portion.availableCarbs);
  assert.equal(portion.sideCarbohydrate?.availableCarbsGPer100g, 23.561);
  assert.equal(portion.sideCarbohydrate?.name.fi, "Keitetty pitkäjyväinen riisi");
  assert.deepEqual(portion.sideCarbohydrate?.weightsG, [50, 100, 150, 200]);
  assert.equal(portion.ingredientPortion, undefined);
  assert.equal(portion.verbal, undefined);
  const side = review.sideCarbohydrate!;
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review, sideCarbohydrate: { ...side, foodSha256: "changed" },
  }), /side carbohydrate needs the exact reviewed food composition/);
  await assert.rejects(projectPortionEvidence(root, id, markdown.replace("6. Maista ja säädä suola. Tarjoa riisin kanssa.",
    "6. Maista ja säädä suola. Tarjoa leivän kanssa."), review), /preparation or serving notes changed/);
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
  const id = "bataatti-banaanileipa";
  const [reviews, markdown] = await Promise.all([
    loadReviewedPortions(root),
    readFile(path.join(root, "reseptit/leivonnaiset", id + ".md"), "utf8"),
  ]);
  const review = { ...reviews[id], wholeCarbohydrateOnly: undefined };
  const ingredient = review.ingredientPortion!;
  const { portion } = await projectPortionEvidence(root, id, markdown, review);
  assert.equal(portion.ingredientPortion?.amountPerServing, 24);
  const choices = portion.ingredientPortion?.carbohydrateAlternatives;
  assert.equal(choices?.length, 2);
  assert.ok(Math.abs(choices![0].availableCarbsGPerServing - 4.39032) < 1e-9);
  assert.ok(Math.abs(choices![1].availableCarbsGPerServing - 4.0392) < 1e-9);
  assert.equal(portion.availableCarbs, undefined);
  assert.equal(portion.verbal, undefined);
  await assert.rejects(projectPortionEvidence(root, id, markdown, {
    ...review,
    ingredientPortion: { ...ingredient, declaredCarbsGPer100g: 25 },
  }), /partial ingredient carbohydrate must use one composition basis/);
});

test("whole-portion comparisons require a complete calculation for each named preparation", async () => {
  const reviews = await loadReviewedPortions(root);
  for (const [id, category, baked, boiled] of [
    ["bataattiletut", "aamupalat", 30.33, 28.79], ["bataattibrowniet", "leivonnaiset", 10.05, 9.68],
    ["bataatti-banaanileipa", "leivonnaiset", 14.14, 13.79],
  ] as const) {
    const markdown = await readFile(path.join(root, "reseptit", category, id + ".md"), "utf8");
    const review = reviews[id];
    const { portion } = await projectPortionEvidence(root, id, markdown, review);
    assert.deepEqual(portion.availableCarbs, { min: boiled, max: baked });
    assert.deepEqual(portion.wholeCarbohydrateChoices?.map(choice => [choice.source.split("/").at(-1), choice.availableCarbsGPerServing]),
      [["30600", baked], ["30602", boiled]]);
    assert.equal(Boolean(portion.ingredientPortion?.carbohydrateAlternatives), id === "bataatti-banaanileipa");
    assert.equal(portion.verbal, undefined);
    assert.equal(originalGlycemicLoadCategory(undefined, portion), null);

    const broken = structuredClone(review);
    const choices = broken.wholeCarbohydrateOnly!.preparationChoices!.choices;
    choices[1].record.carbohydrateDefinition = "EU_TOTAL_INCLUDING_POLYOLS";
    choices[1].record.per100g.polyols = null;
    choices[1].record.polyolsSourceVerified = false;
    if (id === "bataatti-banaanileipa") {
      await assert.rejects(projectPortionEvidence(root, id, markdown, broken), /ingredient and whole-portion preparations must agree/);
      delete broken.ingredientPortion!.carbohydrateAlternatives;
    }
    await assert.rejects(projectPortionEvidence(root, id, markdown, broken), /whole-portion preparation requires evidence for every ingredient/);
    const duplicate = structuredClone(review);
    duplicate.wholeCarbohydrateOnly!.preparationChoices!.choices[1].label.en = choices[0].label.en;
    await assert.rejects(projectPortionEvidence(root, id, markdown, duplicate), /whole-portion preparations require distinct labels/);
  }
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
      ...review, declaredLabelIngredientIndices: [100],
    }), /invalid reviewed portion composition indices/);
    await assert.rejects(projectPortionEvidence(root, id, markdown, {
      ...review, wholeCarbohydrateOnly: {},
    }), /reviewed standalone carbohydrate requires evidence for every ingredient/);
  }
});

test("reviewed standalone composition uses its pinned historical input without releasing macro or GL data", async () => {
  const reviews = await loadReviewedPortions(root);
  for (const [id, category, expected] of [
    ["mustikka-jogurttijaatelo", "jalkiruoat", 15.01],
    ["parmesaani-lyttyperunat", "alkuruoat", 23.37],
    ["makea-banaanimunakas", "aamupalat", 32.43],
    ["piparkakkulatte-hunajalla", "aamupalat", 15.75],
    ["paahtopaistileipa-piparjuurikastikkeella", "alkuruoat", 22.7],
    ["porkkanaletut", "paaruoat", 51.03],
    ["kookos-linssikeitto", "paaruoat", 29.87],
    ["papu-myskikurpitsapelti", "paaruoat", 24.22],
    ["uunibataatit-fetalla", "paaruoat", 47.01],
  ] as const) {
    const markdown = await readFile(path.join(root, "reseptit", category, id + ".md"), "utf8");
    const review = reviews[id];
    const { portion } = await projectPortionEvidence(root, id, markdown, review);
    assert.deepEqual(portion.availableCarbs, { min: expected, max: expected });
    assert.equal(portion.verbal, undefined);
    assert.equal(originalGlycemicLoadCategory(undefined, portion), null);
    const { portion: archived } = await projectPortionEvidence(root, id, markdown, {
      ...review, wholeCarbohydrateOnly: undefined,
    });
    assert.equal(archived.availableCarbs, undefined);
    const { compositionMatches } = review.wholeCarbohydrateOnly!;
    const match = compositionMatches![0];
    await assert.rejects(projectPortionEvidence(root, id, markdown, {
      ...review, wholeCarbohydrateOnly: { compositionMatches: [Object.assign({}, match, { amount: 999 })] },
    }), /cannot change the recipe quantity/);
    await assert.rejects(projectPortionEvidence(root, id, markdown, {
      ...review, wholeCarbohydrateOnly: { compositionMatches: [match, match] },
    }), /invalid reviewed portion composition indices/);
    if (id === "porkkanaletut") {
      assert.equal(portion.ingredientPortion?.declaredCarbsGPerServing, 7.125);
      assert.match(portion.ingredientPortion?.source ?? "", /^https:\/\/apetit\.fi\//);
      const unbounded = structuredClone(review);
      const oil = unbounded.wholeCarbohydrateOnly!.compositionMatches!.find(row => row.excludedReason)!;
      oil.omissionImpactUpperBoundPerServing!.totalCarbohydrate = 0.1;
      await assert.rejects(projectPortionEvidence(root, id, markdown, unbounded), /requires evidence for every ingredient/);
    }
  }
});
