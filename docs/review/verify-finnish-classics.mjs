// Standalone on-demand integrity check. Run from repo root:
// node docs/review/verify-finnish-classics.mjs
// No npm dependencies, no modification of sealed GK baseline tests.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const read = (relative) => readFile(path.join(root, relative), "utf8");
function blobSha(content) {
  return createHash("sha1").update("blob " + Buffer.byteLength(content) + "\0").update(content).digest("hex");
}
function yamlScalar(section, field) {
  const match = new RegExp("^" + field + ":\\s*(.*)$", "m").exec(section);
  return match?.[1]?.trim();
}
function ingredientsFromDraft(markdown, id) {
  const front = /^---\r?\n([\s\S]*?)\r?\n---/m.exec(markdown)?.[1];
  assert(front, id + ": missing recipe YAML");
  const ing = /^ingredients:\s*\n([\s\S]*?)(?=^---\s*$)/m.exec(markdown)?.[1];
  assert(ing, id + ": missing ingredient list");
  const blocks = ing.split(/(?=^  - amount: )/m).filter((s) => s.startsWith("  - amount: "));
  const rows = blocks.map((block) => {
    const amount = Number(/^  - amount:\s*([\d.]+)/m.exec(block)?.[1]);
    const item = /^    item:\s*(.*)$/m.exec(block)?.[1]?.trim().replace(/^["']|["']$/g, "");
    const unit = /^    unit:\s*(.*)$/m.exec(block)?.[1]?.trim();
    assert(Number.isFinite(amount) && item && unit === "g", id + ": invalid amount/item/unit");
    return { amount, item, unit };
  });
  return { front, rows };
}

export async function verifyFinnishClassicsReview() {
  const matrix = JSON.parse(await read("docs/review/suomalaiset-klassikot-v2-aineslahiematriisi.json"));
  const products = JSON.parse(await read("docs/review/suomalaiset-klassikot-v3-tuote-gikandidaatit.json"));
  const foodText = await read(matrix.foodRecords.path);
  assert.equal(blobSha(foodText), matrix.foodRecords.blobSha, "food library changed; re-review source bindings");
  const records = new Map(JSON.parse(foodText).map((f) => [f.id, f]));
  const candidates = new Map(products.productCandidates.map((p) => [p.id, p]));
  assert.equal(candidates.size, products.productCandidates.length, "duplicate candidate ID");
  assert.equal(matrix.recipes.length, 5);
  let count = 0, bindings = 0;
  const seen = new Set();
  for (const recipe of matrix.recipes) {
    assert(!seen.has(recipe.recipeId), recipe.recipeId + ": duplicate recipe");
    seen.add(recipe.recipeId);
    const content = await read("reseptit/raakileet/" + recipe.recipeId + ".md");
    assert.equal(blobSha(content), recipe.recipeBlobSha, recipe.recipeId + ": draft and matrix SHA mismatch");
    const { front, rows } = ingredientsFromDraft(content, recipe.recipeId);
    assert.equal(yamlScalar(front, "recipe_id"), recipe.recipeId);
    assert.equal(yamlScalar(front, "status"), "draft", recipe.recipeId + ": not a draft");
    assert.equal(Number(yamlScalar(front, "servings")), recipe.servings);
    for (const field of ["carbs_total_per_serving_g", "carbs_net_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"]) {
      const value = yamlScalar(front, field);
      assert(value === "null" || value === "" || value === undefined, recipe.recipeId + ": unapproved macro " + field);
    }
    assert.equal(rows.length, recipe.ingredients.length, recipe.recipeId + ": ingredient count mismatch");
    for (let i = 0; i < rows.length; i++) {
      const original = rows[i], item = recipe.ingredients[i];
      count++;
      assert.equal(item.position, i + 1);
      assert.equal(original.amount, item.amount_g, recipe.recipeId + ": wrong amount at " + (i + 1));
      assert.equal(original.item, item.item, recipe.recipeId + ": wrong item at " + (i + 1));
      assert.equal(item.publishableNutrients, false, "unapproved source promoted for " + recipe.recipeId);
      if (item.nutritionRecordCandidate) {
        const r = records.get(item.nutritionRecordCandidate);
        assert(r, "missing food record " + item.nutritionRecordCandidate);
        assert.equal(item.recordName, r.name);
        assert.equal(item.availableCarbPer100g, r.per100g?.carbohydrate ?? null);
      }
      if (item.publicProductCandidateId) {
        const p = candidates.get(item.publicProductCandidateId);
        assert(p && p.recipeId === recipe.recipeId && p.position === i + 1, "invalid product binding");
        assert.equal(p.ean, item.publicProductEAN);
        assert.match(p.ean, /^\d{13}$/);
        assert.equal(p.availableCarbohydratePer100g, item.publicProductCarbohydratePer100g);
        bindings++;
      }
    }
  }
  assert.equal(count, 47, "expected exactly 47 ingredient rows");
  assert.equal(bindings, 8, "expected eight product bindings");
  return { recipes: 5, ingredients: count, productBindings: bindings };
}

verifyFinnishClassicsReview().then((data) => {
  process.stdout.write("Finnish classics evidence integrity PASS " + JSON.stringify(data) + "\n");
}).catch((error) => {
  process.stderr.write("Finnish classics evidence integrity FAIL " + String(error) + "\n");
  process.exitCode = 1;
});
