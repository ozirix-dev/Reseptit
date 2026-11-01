import test from "node:test";
import { readFileSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
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

function withdrawnFixture(id: string) {
  const markdown = readFileSync(new URL(`../../reseptit/jalkiruoat/${id}.md`, import.meta.url), "utf8");
  const source = recipeFrontmatterSchema.parse(parseMarkdown(markdown)!.data);
  const calculation = JSON.parse(readFileSync(new URL(`../../docs/nutrition/calculations/${id}.json`, import.meta.url), "utf8")) as Calculation;
  return { source, calculation };
}

test("approved AFCD9837 packages retain evidence while withholding every public value", () => {
  for (const id of ["keto-suklaakeksit", "keto-mutakakku"]) {
    const { source, calculation } = withdrawnFixture(id);
    const result = verifyNutritionEvidence(source, calculation);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.deepEqual(result.errors, []);
    assert.equal(result.calculated, null);
    assert.ok(Object.values(result.values).every(value => value === null));
  }
});

test("withdrawal cannot restore values or accept changed inputs, evidence, or translations", () => {
  const { source, calculation } = withdrawnFixture("keto-suklaakeksit");
  for (const changed of [
    { ...source, protein_per_serving_g: 4.77 },
    { ...source, servings: source.servings + 1 },
  ]) assert.equal(verifyNutritionEvidence(changed, calculation).status, "CONFLICT REQUIRES REVIEW");
  const edited = structuredClone(calculation);
  edited.ingredients[0]!.record!.per100g.fat! += 0.01;
  assert.equal(verifyNutritionEvidence(source, edited).status, "CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence(source, null).status, "CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence(source, calculation, [{ path: "translation.md", data: { ...source, fat_per_serving_g: 20.03 } }]).status, "CONFLICT REQUIRES REVIEW");
});

test("unlisted recipes do not acquire an evidence-withdrawal exception", () => {
  const cleared = { ...recipe, carbs_net_per_serving_g: null, carbs_total_per_serving_g: null, protein_per_serving_g: null, fat_per_serving_g: null };
  assert.ok(verifyNutritionEvidence(cleared, evidence()).errors.length > 0);
});

// PR153 still carries the superseded recipe. Exercise its real archived text
// against the production gate without regenerating the 326-recipe report.
import { applyRecovery, loadRecovery, recoveryRecipeId } from "../scripts/gk80-uunikanapasta";
import type { GlycemicLoadResult } from "../scripts/glycemic-load-model";

const recoveryRoot = fileURLToPath(new URL("../..", import.meta.url));
const recoveryRecipePath = "reseptit/paaruoat/uunikanapasta-kesakurpitsa.md";

test("published uunikanapasta retains its approved display and incomplete-only entry gate", async () => {
  const { result } = await loadRecovery(recoveryRoot, recoveryRecipeId);
  assert.equal(result.gk.value, 3);
  assert.deepEqual(Object.fromEntries(Object.entries(result.macros).map(([key, value]) => [key, value.value])), {
    carbsNetG: 7.4, carbsTotalG: 10.4, proteinG: 39.53, fatG: 23.91,
  });
  assert.equal(result.wholeGkPoint, null);
  assert.equal(result.unknownAggregatePolyols, null);
  const before = JSON.parse(readFileSync(path.join(recoveryRoot, "docs/nutrition/gk80-uunikanapasta-release/historical-result.json"), "utf8")) as GlycemicLoadResult;
  assert.equal(before.status, "INSUFFICIENT SOURCE DATA");
  const [after] = await applyRecovery(recoveryRoot, [before]);
  assert.equal(after.glycemicLoadPerServing, 3);
  assert.equal(before.status, "INSUFFICIENT SOURCE DATA");
});

test("the actual PR153 recipe cannot replace the newer published preparation", async () => {
  const prefix = path.join(tmpdir(), "gk80-published-version-");
  const fixture = await mkdtemp(prefix);
  try {
    const { e } = await loadRecovery(recoveryRoot, recoveryRecipeId);
    const files = ["docs/nutrition/calculations/" + recoveryRecipeId + ".json", ...Object.keys(e.recoveryC.versionHashes)];
    for (const file of files) {
      const target = path.join(fixture, file);
      await mkdir(path.dirname(target), { recursive: true });
      await copyFile(path.join(recoveryRoot, file), target);
    }
    await loadRecovery(fixture, recoveryRecipeId);
    const stale = "docs/nutrition/gk80-uunikanapasta-release/reviewed-source.md";
    assert.notEqual(readFileSync(path.join(recoveryRoot, stale), "utf8"), readFileSync(path.join(recoveryRoot, recoveryRecipePath), "utf8"));
    await copyFile(path.join(recoveryRoot, stale), path.join(fixture, recoveryRecipePath));
    await assert.rejects(loadRecovery(fixture, recoveryRecipeId), /RECOVERY_STALE_PREPARATION/);
  } finally {
    // Verify the resolved disposable target before recursive cleanup on Windows.
    assert.equal(path.dirname(path.resolve(fixture)), path.resolve(tmpdir()));
    assert.ok(path.basename(fixture).startsWith("gk80-published-version-"));
    await rm(fixture, { recursive: true, force: true });
  }
});

test("a numeric result from an old release pack collides instead of silently replacing published recovery", async () => {
  const before = JSON.parse(readFileSync(path.join(recoveryRoot, "docs/nutrition/gk80-uunikanapasta-release/historical-result.json"), "utf8")) as GlycemicLoadResult;
  const oldPackResult = { ...before, status: "CALCULATED", glycemicLoadPerServing: 2.694325 } as GlycemicLoadResult;
  await assert.rejects(applyRecovery(recoveryRoot, [oldPackResult]), /RECOVERY_RELEASE_COLLISION/);
  assert.equal(oldPackResult.glycemicLoadPerServing, 2.694325);
});
