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
