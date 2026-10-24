import test from "node:test";
import assert from "node:assert/strict";
import { calculate } from "../scripts/nutrition-model";
import { recipeNutritionInputHash, verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import { updateNutritionFrontmatter } from "../scripts/nutrition-markdown";
import type { Calculation, FoodRecord } from "../scripts/nutrition-model";

const food: FoodRecord = {
  id: "synthetic-source-record",
  name: "Synthetic food",
  sourceUrl: "https://example.org/food",
  retrievedAt: "2026-10-24",
  licence: "Synthetic test fixture",
  state: "raw",
  basis: "per100g-edible",
  carbohydrateDefinition: "EU_AVAILABLE",
  polyolsSourceVerified: true,
  polyolsEvidence: "Synthetic source explicitly reports zero polyols",
  per100g: { kcal: 120, protein: 12, fat: 6, carbohydrate: 10, fibre: 2, sugars: 3, polyols: 0 },
};
const recipe = {
  recipe_id: "synthetic-recipe",
  servings: 2,
  ingredients: [{ item: "synthetic food", amount: 200, unit: "g" }],
};
function evidence(): Calculation {
  return {
    recipeId: recipe.recipe_id,
    sourceHash: recipeNutritionInputHash(recipe),
    calculatedAt: "2026-10-24",
    servings: recipe.servings,
    scope: "synthetic fixture, all edible raw weight included",
    reviewerStatus: "AUTOMATED ONLY",
    carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE",
    ingredients: [{ ...recipe.ingredients[0], record: food, state: "raw", matchEvidence: "synthetic exact match", edibleFraction: 1, edibleEvidence: "synthetic fixture", retainedFraction: 1, retentionEvidence: "synthetic fixture" }],
  };
}
function published() {
  const result = calculate(evidence());
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
    carbs_net_per_serving_g: result.perServing.netCarbohydrate,
    carbs_total_per_serving_g: result.totalCarbohydratePerServingG,
    protein_per_serving_g: result.perServing.protein,
    fat_per_serving_g: result.perServing.fat,
  };
}

test("nutrition evidence must reproduce all four published values", () => {
  const result = verifyNutritionEvidence(published(), evidence());
  assert.equal(result.status, "ESTIMATE WITH EVIDENCE");
  assert.deepEqual(result.errors, []);
});

test("stale recipe ingredients and changed nutrition values are detected", () => {
  const staleSource = published();
  staleSource.ingredients[0]!.amount = 210;
  const stale = verifyNutritionEvidence(staleSource, evidence());
  assert.equal(stale.status, "CONFLICT REQUIRES REVIEW");
  assert.ok(stale.errors.some((error) => error.includes("changed after calculation")));

  const editedValue = published();
  editedValue.carbs_total_per_serving_g! += 0.01;
  const mismatch = verifyNutritionEvidence(editedValue, evidence());
  assert.equal(mismatch.status, "CONFLICT REQUIRES REVIEW");
  assert.ok(mismatch.errors.some((error) => error.includes("carbs_total_per_serving_g mismatch")));
});

test("published translations must carry the same four values", () => {
  const source = published();
  const translated = { ...source, protein_per_serving_g: source.protein_per_serving_g! + 0.01 };
  const result = verifyNutritionEvidence(source, evidence(), [{ path: "translation.md", data: translated }]);
  assert.equal(result.status, "CONFLICT REQUIRES REVIEW");
  assert.ok(result.errors.some((error) => error.includes("protein_per_serving_g differs")));
});

test("recipes with published values but no structured evidence are not verified", () => {
  const result = verifyNutritionEvidence(published(), null);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
});

test("nutrition metadata updates preserve recipe frontmatter and reject unrounded values", () => {
  const markdown = "---\ntitle: Test\nservings: 2\n---\n# Test\n\nBody.\n";
  const updated = updateNutritionFrontmatter(markdown, {
    carbs_net_per_serving_g: 1.2,
    carbs_total_per_serving_g: 2.34,
    protein_per_serving_g: 3,
    fat_per_serving_g: 4.56,
  });
  assert.match(updated, /^---\ntitle: Test\nservings: 2\ncarbs_net_per_serving_g: 1.2/m);
  assert.match(updated, /fat_per_serving_g: 4\.56\n\n---\n# Test/);
  assert.throws(() => updateNutritionFrontmatter(markdown, { carbs_net_per_serving_g: 1.234, carbs_total_per_serving_g: 2, protein_per_serving_g: 3, fat_per_serving_g: 4 }));
});
