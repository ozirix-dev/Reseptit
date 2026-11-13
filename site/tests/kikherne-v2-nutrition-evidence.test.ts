import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { recipeNutritionInputHash } from "../scripts/nutrition-evidence";
import { calculate, type Calculation } from "../scripts/nutrition-model";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";

const root = path.resolve(import.meta.dirname, "../..");
const draftPath = "reseptit/raakileet/valimerellinen-kikherne-yrttiaamiainen-punnittu-v2.md";
const originalPath = "reseptit/aamupalat/valimerellinen-kikherne-yrttiaamiainen.md";
const evidencePath = "docs/reviews/2026-11-13-kikherne-v2-nutrition-evidence.json";
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

test("kikherne V2 nutrition is bound to exact draft ingredients without changing original GK history", () => {
  const draftRaw = read(draftPath);
  const parsed = parseMarkdown(draftRaw);
  assert.ok(parsed);
  const draft = recipeFrontmatterSchema.parse(parsed.data);
  const nutrition = JSON.parse(read(evidencePath)) as Calculation;
  assert.equal(draft.recipe_id, "valimerellinen-kikherne-yrttiaamiainen-punnittu-v2");
  assert.equal(draft.status, "draft");
  assert.equal(draft.servings, 2);
  assert.equal(nutrition.sourceHash, recipeNutritionInputHash(draft));
  assert.equal(nutrition.recipeId, draft.recipe_id);
  assert.equal(nutrition.servings, draft.servings);
  assert.equal(nutrition.ingredients.length, draft.ingredients.length);
  for (const [i, item] of draft.ingredients.entries()) {
    const evidenceRow = nutrition.ingredients[i]!;
    assert.equal(evidenceRow.item, item.item, String(i));
    assert.equal(evidenceRow.amount, item.amount, String(i));
    assert.equal(evidenceRow.unit, item.unit, String(i));
    assert.ok(evidenceRow.record?.id && evidenceRow.matchEvidence, String(i));
  }

  const result = calculate(nutrition);
  assert.equal(result.status, "ESTIMATE WITH EVIDENCE");
  assert.equal(result.omissionWithinTolerance, true);
  assert.deepEqual([
    result.perServing.netCarbohydrate,
    result.totalCarbohydratePerServingG,
    result.perServing.protein,
    result.perServing.fat,
  ], [10.2, 13.66, 11.1, 10.95]);

  // This is a numeric DRAFT calculation, NOT permission to publish.
  for (const field of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
    assert.equal(draft[field] ?? null, null, field);
  }
  assert.equal(isPublicRecipeQuarantined("valimerellinen-kikherne-yrttiaamiainen"), true);
  const old = read(originalPath);
  assert.equal(createHash("sha1").update(`blob ${Buffer.byteLength(old)}\0`).update(old).digest("hex"), "33923cc854eabc27c7905db024c3b2e7d9ca44ab");
});
