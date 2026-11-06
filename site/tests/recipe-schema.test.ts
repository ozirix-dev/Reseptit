import assert from "node:assert/strict";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { assertQuantifiedCriticalIngredients, assertUniqueRecipes } from "../src/content/recipe-validation";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { siteContent } from "../src/generated/content.generated";
import { recipeJsonLd } from "../src/features/recipes/schema";

test("Recipe yield is Schema.org Text and preserves the source serving count", () => {
  for (const recipe of siteContent.recipes) {
    assert.equal(recipeJsonLd(recipe).recipeYield, String(recipe.servings));
  }
});

test("malformed frontmatter and unsupported fields are rejected", () => {
  assert.throws(() => parseMarkdown("---\ntitle: [broken\n---\nText"));
  const recipe = siteContent.recipes[0];
  assert.throws(() => recipeFrontmatterSchema.parse({
    title: recipe.title, recipe_id: recipe.recipeId, url_slug: recipe.slug,
    category: recipe.category, language: recipe.locale, status: "published",
    ingredients: recipe.ingredients, servings: recipe.servings,
    unexpected_field: "must not be silently ignored",
  }));
});

test("recipe images require relative WebP paths and descriptive dimensions", () => {
  const recipe = siteContent.recipes[0];
  const input = {
    title: recipe.title, recipe_id: recipe.recipeId, url_slug: recipe.slug,
    category: recipe.category, language: recipe.locale, status: "published",
    ingredients: recipe.ingredients, servings: recipe.servings,
    image: { src: "../outside.webp", alt: "Valmis ruoka", width: 1200, height: 800 },
  };
  assert.equal(recipeFrontmatterSchema.safeParse(input).success, false);
  assert.equal(recipeFrontmatterSchema.safeParse({
    ...input,
    image: { ...input.image, src: "paaruoat/ruoka.webp" },
  }).success, true);
});

test("aamupala is a supported recipe category", () => {
  const recipe = siteContent.recipes.find((entry) => entry.category === "aamupala");
  assert.ok(recipe);
  assert.equal(recipeFrontmatterSchema.safeParse({
    title: recipe.title, recipe_id: recipe.recipeId, url_slug: recipe.slug,
    category: "aamupala", language: "fi", status: "published",
    ingredients: recipe.ingredients, servings: recipe.servings,
  }).success, true);
});

test("valipala category is accepted, but drafts do not imply publication", () => {
  assert.equal(recipeFrontmatterSchema.safeParse({
    title: "Välipalaluonnos", recipe_id: "valipala-koe", url_slug: "valipala-koe",
    category: "valipala", language: "fi", status: "draft",
    ingredients: [{amount: 100, unit: "g", item: "kurkkua"}], servings: 2,
  }).success, true);
  assert.ok(!siteContent.recipes.some((entry) => entry.recipeId === "valipala-koe"));
});

test("duplicate published recipe locale and route are rejected", () => {
  const recipe = siteContent.recipes[0];
  assert.throws(() => assertUniqueRecipes([recipe, { ...recipe }]), /Duplicate published recipe translation/);
  assert.throws(() => assertUniqueRecipes([recipe, { ...recipe, recipeId: "other-recipe" }]), /Duplicate published recipe URL/);
});

test("new recipes require exact amounts for nutrition-critical ingredients", () => {
  const recipe = { ...siteContent.recipes[0], recipeId: "future-recipe", locale: "fi" as const,
    ingredients: [{ amount: null, unit: "", item: "oliiviöljyä" }] };
  assert.throws(() => assertQuantifiedCriticalIngredients([recipe]), /oliiviöljyä needs a numeric amount and unit/);
  assert.doesNotThrow(() => assertQuantifiedCriticalIngredients([{
    ...recipe, ingredients: [{ amount: 15, unit: "ml", item: "oliiviöljyä" }],
  }]));
  assert.doesNotThrow(() => assertQuantifiedCriticalIngredients(siteContent.recipes));
});


test("second snack review batch matches its source ledger and cannot publish duplicates", async () => {
  const { readFileSync } = await import("node:fs");
  const path = await import("node:path");
  const root = path.resolve(import.meta.dirname, "../..");
  const ledger = JSON.parse(readFileSync(path.join(root, "docs/reviews/valipalat/era-02/source-bindings.json"), "utf8")) as {
    status: string; published: boolean; publicationAuthorized: boolean; glycemicLoadStatus: string;
    recipes: Array<{ id: string; servings: number; status: string; gk: string;
      sourceFile: string; ingredients: Array<{ grams: number; unit: string; item: string; sourceId: string | null }> }>;
  };
  const foodRecords = JSON.parse(readFileSync(path.join(root, "docs/nutrition/food-records.json"), "utf8")) as Array<{ id: string }>;
  const knownIds = new Set(foodRecords.map(row => row.id));
  assert.equal(ledger.status, "DRAFT_SOURCE_MAPPING_ONLY");
  assert.equal(ledger.published, false);
  assert.equal(ledger.publicationAuthorized, false);
  assert.equal(ledger.glycemicLoadStatus, "HOLD_ALL");
  assert.equal(ledger.recipes.length, 5);
  for (const recipe of ledger.recipes) {
    const md = parseMarkdown(readFileSync(path.join(root, recipe.sourceFile), "utf8"));
    assert.ok(md, recipe.sourceFile);
    const actual = recipeFrontmatterSchema.parse(md.data);
    assert.equal(actual.recipe_id, recipe.id);
    assert.equal(actual.url_slug, recipe.id);
    assert.equal(actual.category, "valipala");
    assert.equal(actual.language, "fi");
    assert.equal(actual.status, "draft");
    assert.equal(actual.servings, recipe.servings);
    assert.equal(recipe.status, "REVIEW_REQUIRED");
    assert.equal(recipe.gk, "HOLD");
    assert.equal(actual.ingredients.length, recipe.ingredients.length);
    for (let i = 0; i < actual.ingredients.length; i++) {
      assert.equal(actual.ingredients[i].amount, recipe.ingredients[i].grams);
      assert.equal(actual.ingredients[i].unit, recipe.ingredients[i].unit);
      assert.equal(actual.ingredients[i].item, recipe.ingredients[i].item);
      const id = recipe.ingredients[i].sourceId;
      if (id !== null) assert.ok(knownIds.has(id), `${recipe.id} unknown food source: ${id}`);
    }
    assert.ok(!siteContent.recipes.some(item => item.recipeId === recipe.id),
      `${recipe.id} unexpectedly already published`);
  }
  assert.ok(siteContent.recipes.some(item => item.recipeId === "munakasmuffinit" && item.locale === "fi"),
    "existing muffins must be reused, not duplicated");
  assert.ok(!siteContent.recipes.some(item => item.recipeId === "suklaamousse-keto" && item.locale === "fi"),
    "the old mousse title-only stub must not be presented as published");
});
