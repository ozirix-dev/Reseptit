import type { RecipeLocale } from "@/types/content";
import { withholdF25Nutrition } from "./f25-nutrition-withhold";

const partialNutritionNotices: Readonly<Partial<Record<string, string>>> = {
  "rapeat-juustonaksut": "Arvio koskee cheddaria. Savupaprikaa on 0,25 g annoksessa ja se on jätetty laskelmasta.",
};

export function recipeNutritionPresentation(recipeId: string, locale: RecipeLocale) {
  const sourceWithheld = withholdF25Nutrition(recipeId, locale);
  const partialNotice = partialNutritionNotices[recipeId];
  return {
    sourceWithheld,
    partialNotice: sourceWithheld ? undefined : partialNotice,
    includeStructuredNutrition: !sourceWithheld && partialNotice === undefined,
  };
}
