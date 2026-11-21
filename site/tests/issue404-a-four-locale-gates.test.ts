import assert from "node:assert/strict";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { publicSafetyHold } from "../scripts/build-content";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";
import { publicRecipeQualityHold } from "../scripts/recipe-quality-holds";

const locales = ["fi", "en", "sv", "th"] as const;
const withdrawnOriginals = [
  "karibia-bammy-kassavaleipa",
  "karibia-ackee-ja-suolakala",
  "vietnamilainen-banh-bao-kananmunalla",
] as const;

test("issue 404 A: unsafe original recipes have no public recipe entry in any locale", () => {
  for (const recipeId of withdrawnOriginals) {
    assert.equal(isPublicRecipeQuarantined(recipeId), true, recipeId);
    for (const locale of locales) {
      assert.equal(
        siteContent.recipes.some((entry) => entry.recipeId === recipeId && entry.locale === locale),
        false,
        `${recipeId}/${locale}: original source must not generate a public recipe route`,
      );
      if (recipeId === "karibia-ackee-ja-suolakala") {
        assert.ok(publicSafetyHold(recipeId, locale), `${recipeId}/${locale}: missing safety warning`);
      } else {
        assert.ok(publicRecipeQualityHold(recipeId, locale), `${recipeId}/${locale}: missing quality/safety hold`);
      }
    }
  }
});

test("issue 404 A: corrected shrimp wonton instructions remain cookable in all four locales", () => {
  const safetyWords = {
    fi: /läpinäkymättömiä/,
    en: /opaque/,
    sv: /ogenomskinliga/,
    th: /ทึบ/,
  } as const;
  const sealWords = {
    fi: /tiiviiksi/,
    en: /seal/,
    sv: /ordentligt/,
    th: /สนิท/,
  } as const;
  for (const locale of locales) {
    const recipe = siteContent.recipes.find(
      (entry) => entry.recipeId === "kiinalainen-katkarapu-wontonkeitto" && entry.locale === locale,
    );
    assert.ok(recipe, `wonton/${locale}: published translation missing`);
    assert.equal(publicRecipeQualityHold(recipe.recipeId, locale), null);
    const method = recipe.instructionsText.join(" ");
    assert.match(method, safetyWords[locale], `wonton/${locale}: shrimp doneness missing`);
    assert.match(method, sealWords[locale], `wonton/${locale}: wonton sealing missing`);
    assert.ok(recipe.ingredients.some((ingredient) => ingredient.amount === 150), `wonton/${locale}: shrimp/dough mass missing`);
    assert.ok(recipe.ingredients.some((ingredient) => ingredient.amount === 700), `wonton/${locale}: broth amount missing`);
    assert.equal(recipe.nutrition.carbsNetG, null, `wonton/${locale}: unreviewed nutrition must not be introduced`);
  }
});

test("issue 404 A: published weighed bánh bao V2, not the original, has a complete method in all locales", () => {
  for (const locale of locales) {
    const recipe = siteContent.recipes.find(
      (entry) => entry.recipeId === "vietnamilainen-banh-bao-kananmunalla-punnittu-v2" &&
        entry.locale === locale,
    );
    assert.ok(recipe, `banh bao V2/${locale}: reviewed successor missing`);
    for (const amount of [120, 66, 2, 50]) {
      assert.ok(
        recipe.ingredients.some((ingredient) => ingredient.amount === amount),
        `banh bao V2/${locale}: missing required weighed amount ${amount}`,
      );
    }
    const method = recipe.instructionsText.join(" ");
    assert.match(method, /60[–-]75/, `banh bao V2/${locale}: primary rise missing`);
    assert.match(method, /15[–-]18/, `banh bao V2/${locale}: steaming step missing`);
    assert.equal(isPublicRecipeQuarantined(recipe.recipeId), false);
  }
});
