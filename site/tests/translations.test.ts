import assert from "node:assert/strict";
import { test } from "node:test";
import { auditTranslations } from "../scripts/translation-audit";

test("all published translations match the source structure and known critical terms", async () => {
  const result = await auditTranslations();
  const translatedSources = result.publishedSources.filter((recipe) =>
    (["en", "sv", "th"] as const).every((locale) => recipe.data.translation_status?.[locale] === "published"),
  );
  assert.equal(translatedSources.length, 119, "source recipes with all three published translations");
  assert.equal(result.publishedTranslations.length, translatedSources.length * 3, "one published translation per locale for each source recipe");
  assert.equal(result.rows.length, result.publishedTranslations.length, "one audit row per published translation");
  assert.deepEqual(result.errors, []);
  for (const recipe of translatedSources) {
    for (const locale of ["en", "sv", "th"] as const) {
      const target = result.publishedTranslations.find((entry) => entry.data.recipe_id === recipe.data.recipe_id && entry.data.language === locale);
      assert.ok(target, `${recipe.data.recipe_id} is published in ${locale}`);
      assert.equal(target.data.translation_of, recipe.data.recipe_id);
      assert.equal(target.data.servings, recipe.data.servings);
      assert.equal(target.data.image?.src, recipe.data.image?.src);
    }
  }
  const somTam = result.publishedTranslations.find((recipe) => recipe.data.recipe_id === "som-tam-vhh-kurkkuna" && recipe.data.language === "th");
  assert.ok(somTam, "som tam has a published Thai version");
  assert.equal(somTam.data.url_slug, "som-tam-taeng-kwa-vhh");
  assert.equal(somTam.data.source_recipe, "reseptit/alkuruoat/som-tam-vhh-kurkkuna.md");
  assert.equal(somTam.data.ingredients.length, 9);
});

test("audit output distinguishes structural passes from pending human language review", async () => {
  const result = await auditTranslations();
  assert.ok(result.rows.every((row) => row.language_review.includes("independent human language review pending")));
  assert.ok(result.rows.every((row) => row.review_status.includes("HUMAN REVIEW PENDING")));
});
