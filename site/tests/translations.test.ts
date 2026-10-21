import assert from "node:assert/strict";
import { test } from "node:test";
import { auditTranslations } from "../scripts/translation-audit";

test("all published translations match the source structure and known critical terms", async () => {
  const result = await auditTranslations();
  const translatedSources = result.publishedSources.filter((recipe) =>
    (["en", "sv", "th"] as const).every((locale) => recipe.data.translation_status?.[locale] === "published"),
  );
  assert.equal(translatedSources.length, 39, "source recipes with all three published translations");
  assert.equal(result.publishedTranslations.length, translatedSources.length * 3, "published translation count");
  assert.equal(result.rows.length, translatedSources.length * 3, "one audit row per published translation");
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
});

test("audit output distinguishes structural passes from pending human language review", async () => {
  const result = await auditTranslations();
  assert.ok(result.rows.every((row) => row.language_review.includes("independent human language review pending")));
  assert.ok(result.rows.every((row) => row.review_status.includes("HUMAN REVIEW PENDING")));
});
