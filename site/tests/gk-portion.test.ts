import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { projectPortionEvidence } from "../scripts/gk-portion-projection";
import { originalPortionGk, verbalGkForPortion } from "../src/features/recipes/gk-portion";
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
  assert.equal(verbalGkForPortion(portion.verbal, 1), "LOW");
  assert.equal(verbalGkForPortion(portion.verbal, 1.5), null);
  assert.equal(originalGlycemicLoadCategory(undefined, portion), "low");
  assert.equal(originalGlycemicLoadCategory(undefined, { availableCarbs: portion.availableCarbs }), null);
  assert.equal(recipeBindingHash(markdown.replace(/^title: .+$/m, 'title: "Toimitettu kuvaus"')), recipeBindingHash(markdown));
  await assert.rejects(projectPortionEvidence(root, recipeId, markdown.replace("servings: 6", "servings: 7"), reviews[recipeId]), /no longer matches the recipe/);
  await assert.rejects(projectPortionEvidence(root, recipeId, markdown, {
    ...reviews[recipeId], nutritionSha256: createHash("sha256").update("changed").digest("hex"),
  }), /nutrition evidence changed/);
});
