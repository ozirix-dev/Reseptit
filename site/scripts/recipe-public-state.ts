import type { RecipeEntry, RecipeLocale } from "../src/types/content";

export const recipeLocales = ["fi", "en", "sv", "th"] as const;

export function indexPublicRecipes(recipes: readonly RecipeEntry[]) {
  const byId = new Map<string, Partial<Record<RecipeLocale, RecipeEntry>>>();
  const routes = new Set<string>();
  const images = new Set<string>();
  const locales = { fi: 0, en: 0, sv: 0, th: 0 };
  for (const recipe of recipes) {
    const versions = byId.get(recipe.recipeId) ?? {};
    if (versions[recipe.locale] || routes.has(recipe.routePath)) {
      throw Error(`Duplicate public recipe version or route: ${recipe.recipeId} ${recipe.routePath}`);
    }
    versions[recipe.locale] = recipe;
    byId.set(recipe.recipeId, versions);
    routes.add(recipe.routePath);
    locales[recipe.locale]++;
    if (recipe.image) images.add(recipe.image.src);
  }
  return {
    byId,
    locales,
    recipes: byId.size,
    publishedVersions: routes.size,
    staticRoutes: routes.size + recipeLocales.filter(locale => locales[locale] > 0).length,
    images: images.size,
  };
}
