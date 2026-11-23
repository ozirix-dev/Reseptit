import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const draftPath = new URL("../../reseptit/jalkiruoat/thai-mango-sticky-rice-tahmariisilla.md", import.meta.url);
const existingPath = new URL("../../reseptit/aamupalat/thai-kookosriisi-mangolla.md", import.meta.url);

test("Chat-4 mango sticky rice FI publication has safe source and remains distinct from jasmine-rice breakfast", () => {
  const parsed = parseMarkdown(readFileSync(draftPath, "utf8"));
  const existing = parseMarkdown(readFileSync(existingPath, "utf8"));
  assert.ok(parsed && existing);
  const recipe = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(recipe.recipe_id, "thai-mango-sticky-rice-tahmariisilla");
  assert.equal(recipe.category, "jalkiruoka");
  assert.equal(recipe.status, "published");
  assert.equal(recipe.language, "fi");
  assert.equal(recipe.servings, 4);
  assert.ok((recipe.time_total_min ?? 0) >= 240, "at least 4 hours of soaking");
  assert.ok(recipe.image);
  assert.equal(recipe.image.src, "jalkiruoat/thai-mango-sticky-rice-tahmariisilla.webp");
  assert.deepEqual([recipe.image.width, recipe.image.height], [1280, 853]);
  const image = readFileSync(new URL("../../kuvat/" + recipe.image.src, import.meta.url));
  assert.equal(createHash("sha256").update(image).digest("hex"),
    "32fab405fa2a5f8b85a50f196cd07cab321b0aa9378ada3f9c561b874c76285b");
  const altTexts = new Set([recipe.image.alt]);
  for (const locale of ["en", "sv", "th"]) {
    const translationPath = new URL(
      `../../kaannokset/${locale}/jalkiruoat/${recipe.recipe_id}.md`, import.meta.url,
    );
    const translation = parseMarkdown(readFileSync(translationPath, "utf8"));
    assert.ok(translation);
    const translated = recipeFrontmatterSchema.parse(translation.data);
    assert.equal(translated.status, "published");
    assert.equal(translated.language, locale);
    assert.equal(translated.translation_of, recipe.recipe_id);
    assert.ok(translated.image?.alt);
    assert.deepEqual([translated.image.src, translated.image.width, translated.image.height],
      [recipe.image.src, recipe.image.width, recipe.image.height]);
    altTexts.add(translated.image.alt);
  }
  assert.equal(altTexts.size, 4);
  assert.equal(existing.data.recipe_id, "thai-kookosriisi-mangolla");
  assert.equal(existing.data.status, "published");
  assert.match(String(recipeFrontmatterSchema.parse(existing.data).ingredients[0].item), /jasmiiniriisiä/);
  assert.match(String(recipe.ingredients[0].item), /glutiiniriisiä/);
  const index = JSON.parse(readFileSync(new URL("../../meta/kaannokset/published-translation-pairs.json", import.meta.url), "utf8")) as {sources: Array<{recipe_id: string; locales: string[]}>};
  assert.ok(index.sources.some(x => x.recipe_id === recipe.recipe_id && ["en", "sv", "th"].every(locale => x.locales.includes(locale))), "three reviewed published pairs required");
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
