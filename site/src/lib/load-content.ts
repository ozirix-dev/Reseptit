import { contentManifest, publishedLocales } from "../generated/routes.generated";
import { normalizePath, type RouteContent } from "../content/route-data";

const cache = new Map<string, RouteContent>();
export function parseRouteContent(value: unknown, route: string): RouteContent {
  const data = value as RouteContent | null;
  if (!data || data.path !== normalizePath(route) || !Array.isArray(data.locales) ||
      !data.locales.every((locale) => ["fi", "en", "sv", "th"].includes(locale)) ||
      !Array.isArray(data.recipes) || !Array.isArray(data.translations) ||
      !data.translations.every((item) => typeof item.routePath === "string" && data.locales.includes(item.locale)) ||
      !data.recipes.every((item) => typeof item.title === "string" && typeof item.routePath === "string" && Array.isArray(item.ingredients) && Array.isArray(item.tags)) ||
      (data.recipe !== null && (!data.recipe || data.recipe.routePath !== data.path || typeof data.recipe.title !== "string" ||
        !Array.isArray(data.recipe.ingredients) || typeof data.recipe.instructionsHtml !== "string" || !data.recipe.nutrition || !(data.recipe.servings > 0)))) {
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
  const path = normalizePath(new URL(request.url).pathname);
  const cached = cache.get(path);
  if (cached) return cached;
  const file = contentManifest[path];
  if (!file) return { path, locales: publishedLocales, recipes: [], recipe: null, translations: [] };
  const response = await fetch(`${import.meta.env.BASE_URL}data/${file}`, { signal: request.signal });
  if (!response.ok) throw new Error(`Recipe page data: HTTP ${response.status}`);
  return rememberContent(parseRouteContent(await response.json(), path));
}
