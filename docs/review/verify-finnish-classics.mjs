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

  const photos = JSON.parse(await read("docs/review/suomalaiset-klassikot-v4-kuvabriefit.json"));
  assert.equal(photos.recipes.length, 5, "expected five illustrated recipes");
  const known = new Set(matrix.recipes.map((entry) => entry.recipeId));
  const hashBytes = (bytes) => createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
  let localizedImages = 0;
  for (const photo of photos.recipes) {
    assert(known.has(photo.recipe_id), "photo without matching draft: " + photo.recipe_id);
    assert.equal(photo.imageStatus, "WEBP_COMMITTED_DRAFT_BOUND", "unexpected photo release status");
    const jpeg = await readFile(path.join(root, photo.originalFile));
    assert(jpeg.length > 60_000 && jpeg[0] === 0xff && jpeg[1] === 0xd8,
      photo.recipe_id + ": invalid staged JPEG photo");
    assert.equal(hashBytes(jpeg), photo.sourceGitBlobSha, photo.recipe_id + ": staged JPEG blob changed");
    const webp = await readFile(path.join(root, photo.expectedWebpPath));
    assert(webp.length > 30_000 && webp.toString("ascii", 0, 4) === "RIFF"
      && webp.toString("ascii", 8, 12) === "WEBP", photo.recipe_id + ": invalid WebP master");
    assert.equal(hashBytes(webp), photo.productionWebpGitBlobSha,
      photo.recipe_id + ": verified WebP differs from manifest");
    const relative = photo.expectedWebpPath.replace(/^kuvat\//, "");
    for (const locale of ["fi", "en", "sv", "th"]) {
      const filename = locale === "fi"
        ? "reseptit/raakileet/" + photo.recipe_id + ".md"
        : "kaannokset/" + locale + "/" + photo.category + "/" + photo.recipe_id + ".md";
      const source = await read(filename);
      assert(source.includes("  src: " + relative + "\n"),
        filename + ": missing shared WebP image reference");
      assert(source.includes("  width: 1600\n  height: 900\n"),
        filename + ": incorrect WebP image dimensions");
      assert(source.includes("status: draft"), filename + ": unexpected publish status");
      assert(/AI|tekoälyllä/.test(source), filename + ": missing AI illustration disclosure");
      localizedImages++;
    }
  }
  return { recipes: 5, ingredients: count, productBindings: bindings, stagedJPEGs: 5, webpMasters: 5, localizedImages };

}

verifyFinnishClassicsReview().then((data) => {
  process.stdout.write("Finnish classics evidence integrity PASS " + JSON.stringify(data) + "\n");
}).catch((error) => {
  process.stderr.write("Finnish classics evidence integrity FAIL " + String(error) + "\n");
  process.exitCode = 1;
});
