/** F25 nutrient-data integrity: the four FI sources known to have missing or
 * mismatched source macros cannot present an apparently measured nutrition/GL result.
 * This view-only suppression does not mutate GK provenance or release the recipes.
 * Remove an entry only in a reviewed FI+nutrition+GK approval PR.
 */
import type { RecipeLocale } from "@/types/content";

export const f25UnverifiedNutritionSourceIds = Object.freeze([
  "rahka-marjakerroskulho",
  "intialainen-pinaatti-paneer-chilla",
  "lahi-ita-zaatar-munat",
  "japanilainen-hojicha-jogurtti-persimonilla",
  "vietnamilainen-papaija-kookospuuro",
  "vietnamilainen-banh-cuon-sienilla",
  "vietnamilainen-banh-xeo-aamiaisletut",
  "pohjoisafrikkalainen-baghrir",
] as const);

const held = new Set<string>(f25UnverifiedNutritionSourceIds);

export function withholdF25Nutrition(recipeId: string, locale: RecipeLocale): boolean {
  return locale === "fi" && held.has(recipeId);
}

/** A held FI nutrition version must not be listed under a numerical GK class.
 * Keep other locales and unaffected source classes unchanged.
 */
export function publicF25GkFilterCategories<T extends string>(
  categories: Readonly<Record<string,T>>, locale: RecipeLocale,
): Record<string,T> {
  return Object.fromEntries(
    Object.entries(categories).filter(([id]) => !withholdF25Nutrition(id, locale)),
  );
}
