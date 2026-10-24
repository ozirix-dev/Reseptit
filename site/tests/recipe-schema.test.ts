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
