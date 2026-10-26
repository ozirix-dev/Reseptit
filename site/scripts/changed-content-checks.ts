import assert from "node:assert/strict";

type AuditedSource = { data: { recipe_id: string } };
type TranslationAudit = { publishedSources: AuditedSource[]; errors: string[] };

export type PublishedRoute = {
  recipe_id: string;
  language: string;
  url_slug: string;
  path: string;
};

export function assertChangedRecipeAuditIsClean(audit: TranslationAudit, recipeId: string): AuditedSource | null {
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
