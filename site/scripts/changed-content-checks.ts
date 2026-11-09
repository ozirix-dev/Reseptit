import assert from "node:assert/strict";

type AuditedSource = { data: { recipe_id: string } };

/**
 * The existing GI/GK recipe binding fingerprint covers ONLY these fields.
 * Editing prose cannot repair a historically stale binding; nor should such
 * prose-only changes be mistaken for a new ingredient/yield calculation.
 *
 * Deliberately fail closed when no baseline is available. Method metadata
 * and all ingredient properties (including note/preparation state) count.
 */
export function nutritionBindingInputsChanged(
  previous: Record<string, unknown> | null | undefined,
  current: Record<string, unknown>,
): boolean {
  if (!previous) return true;
  const relevant = (data: Record<string, unknown>) => ({
    recipe_id: data.recipe_id,
    servings: data.servings,
    ingredients: data.ingredients,
    cooking_method: data.cooking_method ?? [],
  });
  return JSON.stringify(relevant(previous)) !== JSON.stringify(relevant(current));
}

export type PublishedRoute = {
  recipe_id: string;
  language: string;
  url_slug: string;
  path: string;
};

export function assertChangedRecipeAuditIsClean<TSource extends AuditedSource>(
  audit: { publishedSources: TSource[]; errors: string[] },
  recipeId: string,
): TSource | null {
  const source = audit.publishedSources.find((recipe) => recipe.data.recipe_id === recipeId) ?? null;
  const relevantErrors = audit.errors.filter((error) => error.startsWith(`${recipeId}:`));
  assert.deepEqual(relevantErrors, [], `${recipeId}: related translation checks failed`);
  return source;
}

export function duplicateRoutesForChangedRecipes(
  changedRoutes: readonly PublishedRoute[],
  allPublishedRoutes: readonly PublishedRoute[],
): string[] {
  const changedKeys = new Set(changedRoutes.map((recipe) => `${recipe.language}:${recipe.url_slug}`));
  const routes = new Map<string, PublishedRoute[]>();
  for (const recipe of allPublishedRoutes) {
    const key = `${recipe.language}:${recipe.url_slug}`;
    if (!changedKeys.has(key)) continue;
    const matches = routes.get(key) ?? [];
    matches.push(recipe);
    routes.set(key, matches);
  }

  return [...routes.entries()]
    .filter(([, matches]) => matches.length > 1)
    .map(([key, matches]) => `${matches[0].recipe_id}: duplicate published route ${key} (${matches.map((recipe) => recipe.path).join(", ")})`);
}
