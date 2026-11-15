import type { SearchRecipe } from "../features/recipes/recipe-search";
import { normalizePath, type RouteContent } from "../content/route-data";
import type { RecipeCategoryName, RecipeLocale } from "../types/content";
import { siteTarget } from "../content/site-target";

const cache = new Map<string, RouteContent>();
const validCategories = new Set<RecipeCategoryName>(["aamupala", "valipala", "alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"]);
const validLocales = new Set<RecipeLocale>(["fi", "en", "sv", "th"]);
const validDietTags = new Set(["carnivore", "vegetarian", "vegan", "pescatarian"]);
const validDiets = new Set(["vhh_tiukka", "vhh_valjempi", "keto"]);
const validFilters = new Set(["vhh", "keto", ...validDietTags]);
const searchFilePattern = /^search-(fi|en|sv|th)-[a-f0-9]{20}\.json$/;

const isStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === "string");
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const isNullableNumber = (value: unknown) => value === null || isFiniteNumber(value);
const isNullableString = (value: unknown) => value === null || typeof value === "string";

function validAdditionalCategories(recipe: { category: RecipeCategoryName; additionalCategories?: RecipeCategoryName[] }): boolean {
  const categories = recipe.additionalCategories;
  return categories === undefined || (Array.isArray(categories) &&
    categories.length <= 5 && categories.every(category => validCategories.has(category)) &&
    new Set(categories).size === categories.length && !categories.includes(recipe.category));
}

function validCard(item: Omit<SearchRecipe, "searchText">): boolean {
  return !!item && typeof item.recipeId === "string" && validLocales.has(item.locale) &&
    validCategories.has(item.category) && validAdditionalCategories(item) &&
    typeof item.title === "string" && typeof item.routePath === "string" &&
    typeof item.description === "string" && isNullableNumber(item.timeTotalMin) && isNullableString(item.difficulty) &&
    (item.dietClass === null || validDiets.has(item.dietClass)) &&
    (item.dietTags === undefined || (Array.isArray(item.dietTags) && item.dietTags.every(tag => validDietTags.has(tag)))) &&
    (item.glutenFree === undefined || typeof item.glutenFree === "boolean") &&
    (item.cuisine === undefined || isNullableString(item.cuisine)) &&
    (item.ingredientGroups === undefined || isStrings(item.ingredientGroups)) &&
    (item.image === null || (!!item.image && typeof item.image.src === "string" &&
      typeof item.image.alt === "string" && isFiniteNumber(item.image.width) && isFiniteNumber(item.image.height) &&
      isNullableString(item.image.sizes) && isNullableString(item.image.srcSet)));
}

function validIngredients(ingredients: RouteContent["recipes"][number]["ingredients"]): boolean {
  return Array.isArray(ingredients) && ingredients.every(item =>
    item && typeof item.item === "string" && (item.note === undefined || typeof item.note === "string"));
}

export function parseRecipeSearch(value: unknown): SearchRecipe[] {
  if (!Array.isArray(value) || !value.every(entry => validCard(entry) && typeof entry.searchText === "string")) {
    throw new Error("Invalid recipe search index");
  }
  return value as SearchRecipe[];
}

export function parseRouteContent(value: unknown, route: string): RouteContent {
  const data = value as RouteContent | null;
  if (!data || data.path !== normalizePath(route, siteTarget.basePath) || !Array.isArray(data.locales) ||
      !data.locales.every(locale => validLocales.has(locale)) ||
      !Array.isArray(data.recipes) || !Array.isArray(data.translations) ||
      !data.translations.every(item => item && typeof item.routePath === "string" && data.locales.includes(item.locale)) ||
      !data.recipes.every(item => validCard(item) && validIngredients(item.ingredients) && isStrings(item.tags)) ||
      (data.recipe !== null && (!data.recipe || !validCard(data.recipe) || data.recipe.routePath !== data.path ||
        !validIngredients(data.recipe.ingredients) ||
        !data.recipe.ingredients.every(item => isNullableNumber(item.amount) && typeof item.unit === "string") ||
        typeof data.recipe.instructionsHtml !== "string" || typeof data.recipe.notesHtml !== "string" ||
        !isStrings(data.recipe.instructionsText) ||
        (data.recipe.instructionStepsHtml != null && !isStrings(data.recipe.instructionStepsHtml)) ||
        !data.recipe.nutrition || !["carbsNetG", "carbsTotalG", "proteinG", "fatG"].every(
          key => isNullableNumber(data.recipe!.nutrition[key as keyof NonNullable<RouteContent["recipe"]>["nutrition"]])) ||
        !isFiniteNumber(data.recipe.servings) || data.recipe.servings <= 0))) {
    throw new Error("Invalid recipe page data");
  }
  const { catalog, pagination } = data;
  if ((catalog !== undefined && (!catalog || typeof catalog.searchFile !== "string" ||
      !searchFilePattern.test(catalog.searchFile) ||
      !Number.isSafeInteger(catalog.total) || catalog.total < 0 ||
      !Array.isArray(catalog.categories) || !catalog.categories.every(category => validCategories.has(category)) ||
      !Array.isArray(catalog.diets) || !catalog.diets.every(diet => validFilters.has(diet)) ||
      !isStrings(catalog.cuisines) || !isStrings(catalog.ingredientGroups) || typeof catalog.hasGlycemicLoad !== "boolean" ||
      !Array.isArray(catalog.topics) || !catalog.topics.every(topic => topic &&
        (topic.kind === "category" ? validCategories.has(topic.value) :
          topic.kind === "diet" && (topic.value === "keto" || topic.value === "vhh"))))) ||
      (pagination !== undefined && (!pagination || pagination.canonicalPath !== data.path || !data.recipes.length ||
        !validLocales.has(pagination.locale) ||
        ![pagination.page, pagination.pageSize, pagination.totalItems, pagination.totalPages].every(
          number => Number.isSafeInteger(number) && number > 0) ||
        !isNullableString(pagination.previousPath) || !isNullableString(pagination.nextPath))) ||
      (data.glycemicRecipe && (!data.recipe || !Array.isArray(data.glycemicRecipe.variants) ||
        (data.glycemicRecipe.result && data.glycemicRecipe.result.recipeId !== data.recipe.recipeId))) ||
      (data.glycemicOverview && (!Array.isArray(data.glycemicOverview.results) ||
        !Array.isArray(data.glycemicOverview.variants) || !data.glycemicOverview.coverage))) {
    throw new Error("Invalid recipe page data");
  }
  return data;
}

export function rememberContent(data: RouteContent): RouteContent {
  cache.set(data.path, data);
  if (cache.size > 24) cache.delete(cache.keys().next().value!);
  return data;
}
export async function loadContent({ request }: { request: Request }): Promise<RouteContent> {
  const route = new URL(request.url).pathname;
  const path = normalizePath(route, siteTarget.basePath);
  const cached = cache.get(path);
  if (cached) return cached;
  const { contentManifest, publishedLocales } = await import("../generated/routes.generated");
  const file = contentManifest[path];
  if (!file) return { path, locales: publishedLocales, recipes: [], recipe: null, translations: [] };
  const response = await fetch(`${import.meta.env.BASE_URL}data/${file}`, { signal: request.signal });
  if (!response.ok) throw new Error(`Recipe page data: HTTP ${response.status}`);
  return rememberContent(parseRouteContent(await response.json(), route));
}

const searches = new Map<string, Promise<SearchRecipe[]>>();

export function loadRecipeSearch(file: string): Promise<SearchRecipe[]> {
  const cached = searches.get(file);
  if (cached) return cached;
  const request = fetch(import.meta.env.BASE_URL + "data/" + file).then(async response => {
    if (!response.ok) throw new Error("Recipe search: HTTP " + response.status);
    return parseRecipeSearch(await response.json());
  }).catch(error => {
    searches.delete(file);
    throw error;
  });
  searches.set(file, request);
  return request;
}
