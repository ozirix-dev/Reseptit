import assert from "node:assert/strict";
import test from "node:test";
import { assessRecipeSimilarity, auditRecipeLibrary, canonicalIngredient, checkPublicRecipeSubmission } from "../src/content/recipe-similarity";
import type { SimilarityRecipe } from "../src/content/recipe-similarity";

const bun: SimilarityRecipe = {
  recipeId: "bun-a", title: "Pehmeä sämpylä", locale: "fi", servings: 4,
  ingredients: [
    { item: "vehnäjauhoa, puolikarkeaa", amount: 400, unit: "g" },
    { item: "täysmaitoa", amount: 200, unit: "ml" },
    { item: "kananmunaa ilman kuorta", amount: 80, unit: "g" },
    { item: "voita", amount: 40, unit: "g" },
    { item: "kuivahiivaa", amount: 8, unit: "g" },
    { item: "suolaa", amount: 4, unit: "g" },
  ],
  cookingMethods: ["uuni"], instructions: ["Vaivaa, kohota ja paista uunissa."],
};

test("ingredient identities preserve structural flour and onion differences", () => {
  assert.equal(canonicalIngredient("valkosipulia"), "valkosipuli");
  assert.equal(canonicalIngredient("sipulia"), "sipuli");
  assert.equal(canonicalIngredient("kookosmaitoa"), "kookosmaito");
  assert.equal(canonicalIngredient("täysmaitoa"), "maito");
  assert.equal(canonicalIngredient("kananmunan keltuaista"), "keltuainen");
  assert.equal(canonicalIngredient("kananmunaa ilman kuorta"), "kananmuna");
  assert.equal(canonicalIngredient("Pofiber"), "pofiber");
  assert.equal(canonicalIngredient("mantelijauhoja"), "mantelijauho");
});

test("renaming and scaling servings never conceals an identical formula", () => {
  const twice = {
    ...bun, recipeId: "bun-b", title: "My bakery secret", servings: 8,
    ingredients: bun.ingredients.map((item) => ({ ...item, amount: item.amount! * 2 })),
  };
  const result = assessRecipeSimilarity(twice, [bun]);
  assert.equal(result.status, "MATERIAL_DUPLICATE");
  assert.equal(result.matches[0].kind, "MATERIAL_DUPLICATE");
  assert.equal(result.matches[0].quantitySimilarity, 1);
});

test("same title but different core ingredients does not prove duplication", () => {
  const keto = {
    ...bun, recipeId: "bun-keto",
    ingredients: [
      { item: "mantelijauhoa", amount: 200, unit: "g" },
      { item: "Pofiber", amount: 40, unit: "g" },
      { item: "kananmunaa ilman kuorta", amount: 180, unit: "g" },
      { item: "juustoraastetta", amount: 70, unit: "g" },
    ],
  };
  const result = assessRecipeSimilarity(keto, [bun]);
  assert.notEqual(result.status, "MATERIAL_DUPLICATE");
});

test("tangzhong is a relevant method difference even with similar ingredients", () => {
  const tangzhong = {
    ...bun, recipeId: "bun-tangzhong",
    instructions: ["Keitä tangzhong-esitaikina, vaivaa ja paista uunissa."],
  };
  const result = assessRecipeSimilarity(tangzhong, [bun]);
  assert.equal(result.status, "UNCERTAIN");
  assert.equal(result.matches[0].kind, "POSSIBLE_VARIANT");
  assert.match(result.matches[0].reasons.join(" "), /tangzhong/);
});

test("missing quantities are uncertain rather than a no-match certification", () => {
  const incomplete = {
    ...bun, recipeId: "incomplete",
    ingredients: [{ item: "kananmunaa", amount: null, unit: "" }],
  };
  const result = assessRecipeSimilarity(incomplete, []);
  assert.equal(result.status, "UNCERTAIN");
  assert.ok(result.warnings.length);
});

test("translations and revisions with the same recipe ID are not duplicates", () => {
  const translated = { ...bun, locale: "en", title: "Soft burger bun" };
  const result = assessRecipeSimilarity(bun, [translated]);
  assert.equal(result.status, "NO_MATERIAL_MATCH");
  assert.equal(result.comparedRecipes, 0);
});

test("a same-source URL alone does not create an exact duplicate", () => {
  const alternative = {
    ...bun, recipeId: "alternative", sourceUrl: "https://example.com/bun",
    ingredients: [{ item: "mantelijauhoa", amount: 200, unit: "g" },
      { item: "Pofiber", amount: 30, unit: "g" },
      { item: "raejuustoa", amount: 150, unit: "g" }],
  };
  const source = { ...bun, sourceUrl: "https://example.com/bun" };
  assert.notEqual(assessRecipeSimilarity(alternative, [source]).status, "MATERIAL_DUPLICATE");
});

test("the published-library inventory considers each recipe pair once", () => {
  const duplicate = { ...bun, recipeId: "bun-b", title: "Another name" };
  const result = auditRecipeLibrary([bun, duplicate, { ...bun, locale: "en" }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].matches.length, 1);
});

test("pending submissions never leak another user's proposed recipe in public matches", () => {
  const proposal = { ...bun, recipeId: "new-proposal" };
  const pending = { ...bun, recipeId: "someone-private", title: "Private pending candidate", scope: "pending" as const };
  const result = checkPublicRecipeSubmission(proposal, [], [pending]);
  assert.equal(result.internal.status, "MATERIAL_DUPLICATE");
  assert.deepEqual(result.publicMatches, []);
  assert.equal(result.publicStatus, "UNCERTAIN");
  assert.equal(JSON.stringify(result.publicMatches).includes("someone-private"), false);
});

test("different finished dishes do not flood the review queue on shared pantry ingredients", () => {
  const cake = { ...bun, recipeId: "cake", title: "Suklaakakku" };
  const cookies = { ...bun, recipeId: "cookies", title: "Suklaakeksit",
    ingredients: bun.ingredients.map((item) => ({
      ...item, amount: item.item.includes("kananmun") || item.item.includes("voita") ? item.amount! * 2 : item.amount,
    })),
  };
  const result = assessRecipeSimilarity(cookies, [cake]);
  assert.equal(result.status, "NO_MATERIAL_MATCH");
});

test("taco and tostada with the same formula are a reviewable variant, not an automatic duplicate", () => {
  const taco = { ...bun, recipeId: "taco", title: "Taco" };
  const tostada = { ...bun, recipeId: "tostada", title: "Tostada" };
  const result = assessRecipeSimilarity(taco, [tostada]);
  assert.equal(result.status, "UNCERTAIN");
  assert.equal(result.matches[0].kind, "POSSIBLE_VARIANT");
});

test("Finnish source is preferred over an earlier translation of the same recipe", () => {
  const translated = { ...bun, locale: "en", ingredients: [{ item: "unknown novelty", amount: 1, unit: "kpl" }] };
  const another = { ...bun, recipeId: "other-bun", title: "My bun" };
  assert.equal(assessRecipeSimilarity(another, [translated, bun]).status, "MATERIAL_DUPLICATE");
});


test("ingredient matching does not confuse eggplant with egg or a sandwich with butter", () => {
  assert.equal(canonicalIngredient("eggplant"), "eggplant");
  assert.equal(canonicalIngredient("voileipä"), "voileipä");
  assert.equal(canonicalIngredient("voita"), "voi");
  assert.equal(canonicalIngredient("perunajauhoa"), "perunajauho");
  assert.equal(canonicalIngredient("maito"), "maito");
});

test("editing the same recipe object invalidates its cached ingredient comparison", () => {
  const editable = {
    ...bun, recipeId: "editable", ingredients: bun.ingredients.map((ingredient) => ({ ...ingredient })),
  };
  const before = assessRecipeSimilarity(editable, [bun]);
  assert.equal(before.status, "MATERIAL_DUPLICATE");
  editable.ingredients[0].amount = 1600;
  const after = assessRecipeSimilarity(editable, [bun]);
  assert.notEqual(after.candidateRevision, before.candidateRevision);
  assert.notEqual(after.status, "MATERIAL_DUPLICATE");
});

test("a public submission reusing an existing recipe ID must not bypass review", () => {
  const sameIdentifier = { ...bun, title: "Different title with colliding ID",
    ingredients: [{ item: "fresh vegetable", amount: 100, unit: "g" },
      { item: "another vegetable", amount: 50, unit: "g" }] };
  const result = checkPublicRecipeSubmission(sameIdentifier, [bun], []);
  assert.equal(result.internal.status, "UNCERTAIN");
  assert.equal(result.publicStatus, "UNCERTAIN");
  assert.deepEqual(result.publicMatches, []);
});

test("non-Finnish submissions are conservatively marked uncertain", () => {
  const english = { ...bun, recipeId: "english", locale: "en" };
  const result = assessRecipeSimilarity(english, []);
  assert.equal(result.status, "UNCERTAIN");
});
