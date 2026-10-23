import assert from "node:assert/strict";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { emptyRecipeFilters, filterRecipes, normalizeSearchText, parseRecipeFilters, recipeFiltersToSearch } from "../src/features/recipes/recipe-search";
import { recipeFacets } from "../src/content/recipe-facets";

const finnishRecipes = siteContent.recipes.filter((recipe) => recipe.locale === "fi");

test("browse facets derive from source metadata and remain identical across translations", () => {
  assert.deepEqual(recipeFacets(["kananmuna"], []), { cuisine: null, ingredientGroups: ["eggs"] });
  assert.deepEqual(recipeFacets(["broileri", "kikherne"], ["intialainen"]), { cuisine: "indian", ingredientGroups: ["chicken", "legumes"] });
  for (const recipe of siteContent.recipes) {
    const source = finnishRecipes.find(item => item.recipeId === recipe.recipeId)!;
    assert.equal(recipe.cuisine, source.cuisine);
    assert.deepEqual(recipe.ingredientGroups, source.ingredientGroups);
  }
});

test("time, cuisine and main ingredient filters combine and survive URL round trips", () => {
  const filters = { ...emptyRecipeFilters, maxTime: 60, cuisine: "thai", ingredient: "chicken" };
  assert.deepEqual(parseRecipeFilters(recipeFiltersToSearch(filters), ["all"]), filters);
  assert.deepEqual(parseRecipeFilters("?time=-5&cuisine=bad&ingredient=bad", ["all"]), emptyRecipeFilters);
  const results = filterRecipes(finnishRecipes, filters, "fi");
  assert.ok(results.length > 0);
  assert.ok(results.every(recipe => recipe.timeTotalMin !== null && recipe.timeTotalMin <= 60 && recipe.cuisine === "thai" && recipe.ingredientGroups?.includes("chicken")));
  assert.equal(filterRecipes([{ ...results[0], timeTotalMin: null }], filters, "fi").length, 0);
  const thai = siteContent.recipes.filter(recipe => recipe.locale === "th");
  assert.deepEqual(filterRecipes(thai, filters, "th").map(recipe => recipe.recipeId).sort(), results.map(recipe => recipe.recipeId).sort());
  for (const buns of siteContent.recipes.filter(recipe => recipe.recipeId === "keto-kauralesesampylat")) {
    assert.equal(buns.timeTotalMin, null, "45-minute work and baking estimate excludes unmeasured required cooling");
    assert.match(buns.notesHtml, /45/);
  }
});

test("search normalization folds Finnish and Swedish diacritics while preserving Thai tone marks", () => {
  assert.equal(normalizeSearchText("  ÄÄKKÖSET   LOHI ", "fi"), "aakkoset lohi");
  assert.equal(normalizeSearchText("ÅÄÖ", "sv"), "aao");
  assert.equal(normalizeSearchText("ข้าว", "th"), "ข้าว");
  assert.equal(normalizeSearchText("ข่าว", "th"), "ข่าว");
  assert.notEqual(normalizeSearchText("ข้าว", "th"), normalizeSearchText("ข่าว", "th"));
  const thaiRecipe = siteContent.recipes.find((recipe) => recipe.locale === "th");
  assert.ok(thaiRecipe);
  const riceRecipe = { ...thaiRecipe, title: "ข้าว", ingredients: [], description: "", tags: [] };
  assert.equal(filterRecipes([riceRecipe], { ...emptyRecipeFilters, query: "ข้าว" }, "th").length, 1);
  assert.equal(filterRecipes([riceRecipe], { ...emptyRecipeFilters, query: "ข่าว" }, "th").length, 0);
});

test("search finds titles, ingredients, descriptions and tags; all words must match", () => {
  assert.ok(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "lohi kerma" }, "fi").some((recipe) => recipe.title.includes("lohikeitto")));
  assert.ok(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "raejuusto" }, "fi").length > 0);
  assert.ok(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "VHH" }, "fi").length > 0);
  assert.deepEqual(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "lohi mahdoton" }, "fi"), []);
});

test("category and diet filters use structured recipe fields and combine with AND", () => {
  const keto = filterRecipes(finnishRecipes, { ...emptyRecipeFilters, diet: "keto" }, "fi");
  assert.ok(keto.length > 0);
  assert.ok(keto.every((recipe) => recipe.dietClass === "keto"));
  const vhh = filterRecipes(finnishRecipes, { ...emptyRecipeFilters, diet: "vhh" }, "fi");
  assert.ok(vhh.length > keto.length);
  assert.ok(vhh.every((recipe) => recipe.dietClass !== null));
  const combined = filterRecipes(finnishRecipes, { query: "kukkakaali", category: "paaruoka", diet: "vhh" }, "fi");
  assert.ok(combined.length > 0);
  assert.ok(combined.every((recipe) => recipe.category === "paaruoka" && recipe.dietClass !== null));
});

test("URL filters normalize whitespace and reject unknown categories and diet values", () => {
  const parsed = parseRecipeFilters("?q=%20lohi++kerma%20&category=unknown&diet=invalid", ["all", "paaruoka"]);
  assert.deepEqual(parsed, { query: "lohi kerma", category: "all", diet: "all" });
  const search = recipeFiltersToSearch({ query: "  lohi   kerma ", category: "paaruoka", diet: "keto" });
  assert.equal(search, "?q=lohi+kerma&category=paaruoka&diet=keto");
  assert.deepEqual(parseRecipeFilters(search, ["all", "paaruoka"]), { query: "lohi kerma", category: "paaruoka", diet: "keto" });
  assert.deepEqual(parseRecipeFilters("?diet=keto", ["all", "paaruoka"], ["vhh"]), { query: "", category: "all", diet: "all" });
  assert.equal(recipeFiltersToSearch(emptyRecipeFilters), "");
});

test("a search in a translated directory stays within that locale", () => {
  const english = siteContent.recipes.filter((recipe) => recipe.locale === "en");
  const results = filterRecipes(english, { ...emptyRecipeFilters, query: "beef macaroni" }, "en");
  assert.equal(results.length, 1);
  assert.equal(results[0].locale, "en");
  const thai = siteContent.recipes.filter((recipe) => recipe.locale === "th");
  const thaiResults = filterRecipes(thai, { ...emptyRecipeFilters, query: "โปรตีนสูง" }, "th");
  assert.equal(thaiResults.length, 1);
  assert.equal(thaiResults[0].locale, "th");
});
