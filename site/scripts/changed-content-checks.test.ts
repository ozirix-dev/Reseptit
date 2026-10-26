import assert from "node:assert/strict";
import test from "node:test";
import { assertChangedRecipeAuditIsClean, duplicateRoutesForChangedRecipes, type PublishedRoute } from "./changed-content-checks";

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
