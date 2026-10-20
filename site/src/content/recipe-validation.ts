import type { RecipeEntry } from "../types/content";

export function assertUniqueRecipes(recipes: RecipeEntry[]): void {
  const ids = new Set<string>();
  const routes = new Set<string>();
  for (const recipe of recipes) {
    const id = `${recipe.recipeId}:${recipe.locale}`;
    const route = `${recipe.locale}:${recipe.routePath}`;
    if (ids.has(id)) throw new Error(`Duplicate published recipe translation: ${id}`);
    if (routes.has(route)) throw new Error(`Duplicate published recipe URL: ${route}`);
    ids.add(id);
    routes.add(route);
  }
}
