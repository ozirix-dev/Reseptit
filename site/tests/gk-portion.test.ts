import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
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
