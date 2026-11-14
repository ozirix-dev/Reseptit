/** F25 nutrient-data integrity: FI sources known to have missing or
 * mismatched source macros cannot present an apparently measured nutrition/GL result.
 * This view-only suppression does not mutate GK provenance or release the recipes.
 * Remove an entry only in a reviewed FI+nutrition+GK approval PR.
 */
import type { RecipeLocale } from "@/types/content";

export const f25UnverifiedNutritionSourceIds = Object.freeze([
  "intialainen-pinaatti-paneer-chilla",
] as const);

const held = new Set<string>(f25UnverifiedNutritionSourceIds);

export function withholdF25Nutrition(recipeId: string, locale: RecipeLocale): boolean {
  return locale === "fi" && held.has(recipeId);
}

/** Exact public label for an unavailable GK; never a numerical estimate or release approval. */
export function f25ExplicitUndefinedGkLabel(recipeId: string, locale: RecipeLocale): string | null {
  return locale === "fi" && recipeId === "vietnamilainen-banh-cuon-sienilla" && withholdF25Nutrition(recipeId,locale)
    ? "GK: ei määritetty"
    : null;
}
