import type { SearchRecipe } from "../features/recipes/recipe-search";
import { contentManifest, publishedLocales } from "../generated/routes.generated";
import { normalizePath, type RouteContent } from "../content/route-data";
import type { RecipeCategoryName } from "../types/content";
import { siteTarget } from "../content/site-target";

const cache = new Map<string, RouteContent>();
const validCategories = new Set<RecipeCategoryName>(["aamupala", "valipala", "alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"]);
function validAdditionalCategories(recipe: { category: RecipeCategoryName; additionalCategories?: RecipeCategoryName[] }): boolean {
  const categories = recipe.additionalCategories;
  return categories === undefined || (Array.isArray(categories) &&
    categories.length <= 5 && categories.every(category => validCategories.has(category)) &&
    new Set(categories).size === categories.length && !categories.includes(recipe.category));
}

export function parseRouteContent(value: unknown, route: string): RouteContent {
  const data = value as RouteContent | null;
  if (!data || data.path !== normalizePath(route, siteTarget.basePath) || !Array.isArray(data.locales) ||
      !data.locales.every((locale) => ["fi", "en", "sv", "th"].includes(locale)) ||
      !Array.isArray(data.recipes) || !Array.isArray(data.translations) ||
      !data.translations.every((item) => typeof item.routePath === "string" && data.locales.includes(item.locale)) ||
      !data.recipes.every((item) => typeof item.title === "string" && typeof item.routePath === "string" && Array.isArray(item.ingredients) && Array.isArray(item.tags) && validAdditionalCategories(item)) ||
      (data.recipe !== null && (!data.recipe || data.recipe.routePath !== data.path || typeof data.recipe.title !== "string" ||
        !Array.isArray(data.recipe.ingredients) || !validAdditionalCategories(data.recipe) || typeof data.recipe.instructionsHtml !== "string" || !data.recipe.nutrition || !(data.recipe.servings > 0)))) {
    throw new Error("Invalid recipe page data");
  }
  if ((data.catalog && (!/^search-(fi|en|sv|th)-[a-f0-9]{20}\.json$/.test(data.catalog.searchFile) ||
      !Array.isArray(data.catalog.categories) || !Array.isArray(data.catalog.diets) ||
      !Array.isArray(data.catalog.cuisines) || !Array.isArray(data.catalog.ingredientGroups) || !Array.isArray(data.catalog.topics))) ||
      (data.pagination && (data.pagination.canonicalPath !== data.path || !data.recipes.length)) ||
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
    const entries: unknown = await response.json();
    if (!Array.isArray(entries) || !entries.every(entry =>
      entry && typeof entry.searchText === "string" && typeof entry.title === "string" &&
      typeof entry.routePath === "string" && validAdditionalCategories(entry))) {
      throw new Error("Invalid recipe search index");
    }
    return entries as SearchRecipe[];
  }).catch(error => {
    searches.delete(file);
    throw error;
  });
  searches.set(file, request);
  return request;
}
