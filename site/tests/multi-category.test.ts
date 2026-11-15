import assert from "node:assert/strict";
import test from "node:test";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { inheritSourceAdditionalCategories, recipeMatchesCategory } from "../src/content/recipe-categories";
import { contentForRoute, localeIndexes, summarizeRecipe } from "../src/content/route-data";
import { parseRouteContent } from "../src/lib/load-content";
import { emptyRecipeFilters, filterRecipes, parseRecipeFilters, recipeFiltersToSearch } from "../src/features/recipes/recipe-search";
import { homepageTopics } from "../src/features/recipes/home-preview";
import { siteContent } from "../src/generated/content.generated";

const categories = ["aamupala", "valipala"] as const;
const base = {
  title: "Koeleipä", recipe_id: "koeleipa", url_slug: "koeleipa",
  category: "alkuruoka", language: "fi", status: "draft", servings: 4,
  ingredients: [{ amount: 100, unit: "g", item: "paahtopaisti" }],
};

test("secondary categories are optional, strictly typed and never duplicate the primary", () => {
  assert.equal(recipeFrontmatterSchema.safeParse(base).success, true, "old recipes remain valid");
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, additional_categories: [...categories] }).success, true);
  for (const invalid of [
    ["alkuruoka"], ["aamupala", "aamupala"], ["unknown"], ["aamupala", "paaruoka", "valipala", "leivonnainen", "jalkiruoka", "alkuruoka"],
  ]) {
    assert.equal(recipeFrontmatterSchema.safeParse({ ...base, additional_categories: invalid }).success, false, invalid.join(","));
  }
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, category: ["alkuruoka", "aamupala"] }).success, false,
    "the primary category remains a single category");
});

test("one recipe appears exactly once under each applicable category and combines with diet", () => {
  const sample = siteContent.recipes.find(recipe => recipe.locale === "fi" && recipe.recipeId === "hummus")!;
  assert.ok(sample);
  const multi = { ...sample, category: "alkuruoka" as const, additionalCategories: [...categories], dietClass: "keto" as const };
  const other = { ...sample, recipeId: "unrelated-fi", category: "paaruoka" as const, additionalCategories: undefined };
  for (const category of ["alkuruoka", "aamupala", "valipala"] as const) {
    const result = filterRecipes([multi, other], { ...emptyRecipeFilters, category }, "fi");
    assert.deepEqual(result.map(item => item.recipeId), [multi.recipeId], category);
    assert.equal(recipeMatchesCategory(multi, category), true);
  }
  assert.equal(recipeMatchesCategory(multi, "paaruoka"), false);
  assert.deepEqual(filterRecipes([multi, other], { ...emptyRecipeFilters, category: "valipala", diet: "keto" }, "fi").map(item => item.recipeId), [multi.recipeId]);
  const filters = parseRecipeFilters("?category=valipala&diet=keto", ["all", "valipala"]);
  assert.equal(recipeFiltersToSearch(filters), "?category=valipala&diet=keto");
  assert.deepEqual(filterRecipes([multi], filters, "fi").map(item => item.recipeId), [multi.recipeId]);
  assert.ok(homepageTopics([multi]).some(topic => topic.kind === "category" && topic.value === "valipala"));
  assert.deepEqual(filterRecipes([sample], { ...emptyRecipeFilters, category: "valipala" }, "fi"), [],
    "existing single-category entries are unchanged");
});

test("Finnish source owns the extra categories on all four language routes", () => {
  const versions = siteContent.recipes.filter(recipe => recipe.recipeId === "hummus");
  assert.deepEqual(versions.map(x => x.locale).sort(), ["en", "fi", "sv", "th"]);
  const fixtures = versions.map(recipe => ({
    ...recipe,
    category: "alkuruoka" as const,
    additionalCategories: recipe.locale === "fi" ? [...categories] : undefined,
  }));
  const inherited = inheritSourceAdditionalCategories(fixtures);
  assert.equal(inherited.length, 4);
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const recipe = inherited.find(item => item.locale === locale)!;
    assert.deepEqual(recipe.additionalCategories, categories, locale);
    assert.deepEqual(summarizeRecipe(recipe).additionalCategories, categories);
    const route = localeIndexes[locale];
    const payload = contentForRoute(inherited, route);
    assert.equal(payload.recipes.length, 1);
    assert.deepEqual(parseRouteContent(JSON.parse(JSON.stringify(payload)), route), payload);
    assert.deepEqual(filterRecipes(payload.recipes, { ...emptyRecipeFilters, category: "aamupala" }, locale).map(item => item.recipeId), ["hummus"]);
    assert.equal(contentForRoute(inherited, recipe.routePath).recipe?.recipeId, "hummus");
  }
  assert.throws(() => inheritSourceAdditionalCategories(fixtures.map(recipe => recipe.locale === "en"
    ? { ...recipe, additionalCategories: ["valipala" as const] } : recipe)), /Secondary category mismatch/);
  assert.deepEqual(inheritSourceAdditionalCategories(versions).map(recipe => recipe.additionalCategories),
    versions.map(recipe => recipe.additionalCategories), "legacy published records retain their original fields");
});
