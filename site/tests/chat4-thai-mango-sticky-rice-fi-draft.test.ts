import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { siteContent } from "../src/generated/content.generated";

const draftPath = new URL("../../reseptit/jalkiruoat/thai-mango-sticky-rice-tahmariisilla.md", import.meta.url);
const existingPath = new URL("../../reseptit/aamupalat/thai-kookosriisi-mangolla.md", import.meta.url);

test("Chat-4 mango sticky rice FI draft stays unpublished and distinct from jasmine-rice breakfast", () => {
  const parsed = parseMarkdown(readFileSync(draftPath, "utf8"));
  const existing = parseMarkdown(readFileSync(existingPath, "utf8"));
  assert.ok(parsed && existing);
  const recipe = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(recipe.recipe_id, "thai-mango-sticky-rice-tahmariisilla");
  assert.equal(recipe.category, "jalkiruoka");
  assert.equal(recipe.status, "draft");
  assert.equal(recipe.language, "fi");
  assert.equal(recipe.servings, 4);
  assert.ok((recipe.time_total_min ?? 0) >= 240, "at least 4 hours of soaking");
  assert.equal(recipe.image, undefined, "no unapproved picture attached");
  assert.equal(existing.data.recipe_id, "thai-kookosriisi-mangolla");
  assert.equal(existing.data.status, "published");
  assert.match(String(recipeFrontmatterSchema.parse(existing.data).ingredients[0].item), /jasmiiniriisiä/);
  assert.match(String(recipe.ingredients[0].item), /glutiiniriisiä/);
  assert.equal(siteContent.recipes.some(x => x.recipeId === recipe.recipe_id), false, "draft must not create public routes");
  for (const field of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
    assert.equal(recipe[field], null, field);
  }
});

test("Chat-4 mango sticky rice ingredients, cooking method and rice safety stay consistent", () => {
  const parsed = parseMarkdown(readFileSync(draftPath, "utf8"));
  assert.ok(parsed);
  const recipe = recipeFrontmatterSchema.parse(parsed.data);
  assert.deepEqual(recipe.ingredients.map(x => x.amount), [200, 180, 60, 2, 100, 5, 20, 1, 500]);
  assert.equal(recipe.ingredients.length, 9);
  assert.equal(recipe.ingredients.some(x => /(?:mungpapu|paistoöljy|öljyä)/i.test(x.item)), false);
  const instructions = parsed.content;
  assert.match(instructions, /vähintään 4 tuntia/);
  assert.match(instructions, /keskeltä kova/);
  assert.match(instructions, /25–35 minuuttia/);
  assert.match(instructions, /20 minuuttia/);
  assert.match(instructions, /500 g syötävää/);
  assert.match(instructions, /enintään 24 tuntia/);
  assert.match(instructions, /kerran kauttaaltaan höyryävän kuumaksi/);
  assert.match(instructions, /ei sisällä mungpapukoristetta eikä paistoöljyä/);
  assert.match(instructions, /Bantatthong Restaurantin Facebook Reel/);
  assert.match(instructions, /glykeeminen kuorma ovat määrittämättä/);
});
