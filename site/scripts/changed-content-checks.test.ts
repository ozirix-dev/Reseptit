import assert from "node:assert/strict";
import test from "node:test";
import { assertChangedRecipeAuditIsClean, duplicateRoutesForChangedRecipes, nutritionBindingInputsChanged, type PublishedRoute } from "./changed-content-checks";

test("removed, draft, and renamed Finnish sources cannot hide published orphan translations", () => {
  for (const recipeId of ["removed-recipe", "draft-recipe", "previous-recipe-id"]) {
    assert.throws(
      () => assertChangedRecipeAuditIsClean({ publishedSources: [], errors: [`${recipeId}:en: published translation has no Finnish source`] }, recipeId),
      /related translation checks failed/,
      recipeId,
    );
  }
});

test("changed published routes are checked against unchanged collection entries", () => {
  const changed: PublishedRoute = {
    recipe_id: "changed-recipe",
    language: "fi",
    url_slug: "shared-recipe-route",
    path: "reseptit/paaruoat/changed-recipe.md",
  };
  const unchanged: PublishedRoute = {
    recipe_id: "unchanged-recipe",
    language: "fi",
    url_slug: "shared-recipe-route",
    path: "reseptit/alkuruoat/unchanged-recipe.md",
  };

  assert.equal(duplicateRoutesForChangedRecipes([changed], [changed, unchanged]).length, 1);
  assert.deepEqual(duplicateRoutesForChangedRecipes([changed], [changed]), []);
});

test("instruction-only change never rebinds a historical GI/GK calculation", () => {
  const original = {
    recipe_id: "foo", servings: 2, cooking_method: ["paistaminen"],
    ingredients: [{ amount: 100, unit: "g", item: "riisi", note: "kuiva" }],
    title: "Vanha ohje", description: "yleispohja",
  };
  const fixedText = { ...original, title: "Sama ruoka", description: "Tarkennettu ohje" };
  assert.equal(nutritionBindingInputsChanged(original, fixedText), false);
  assert.equal(nutritionBindingInputsChanged(null, original), true, "new sources stay gated");
});

test("ingredient quantities, notes, serving yields and cooking methods retain strict GI/GK gate", () => {
  const original = {
    recipe_id: "foo", servings: 2, cooking_method: ["paistaminen"],
    ingredients: [{ amount: 100, unit: "g", item: "riisi", note: "kuiva" }],
  };
  const examples = [
    { ...original, servings: 4 },
    { ...original, cooking_method: ["keittäminen"] },
    { ...original, ingredients: [{ ...original.ingredients[0], amount: 120 }] },
    { ...original, ingredients: [{ ...original.ingredients[0], note: "kypsä" }] },
    { ...original, ingredients: [...original.ingredients, { amount: 15, unit: "g", item: "öljyä" }] },
  ];
  for (const changed of examples) assert.equal(nutritionBindingInputsChanged(original, changed), true);
});
