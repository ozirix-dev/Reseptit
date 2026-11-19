import type { RecipeEntry } from "../../types/content";
import { formatRecipeIngredient } from "./servings";
import { withholdF25Nutrition } from "./f25-nutrition-withhold";

import { recipeInstructionId, recipeStepName } from "./instruction-metadata";

export function recipeJsonLd(recipe: RecipeEntry, canonicalUrl?: string): Record<string, unknown> {
  const withholding = withholdF25Nutrition(recipe.recipeId,recipe.locale);
  const nutrition = Object.fromEntries(Object.entries({
    carbohydrateContent: recipe.nutrition.carbsTotalG, proteinContent: recipe.nutrition.proteinG, fatContent: recipe.nutrition.fatG,
  }).filter(([, value]) => !withholding && value !== null).map(([key, value]) => [key, `${value} g`]));
  return {
    "@context": "https://schema.org", "@type": "Recipe", name: recipe.title,
    description: recipe.description || undefined, inLanguage: recipe.locale, recipeCategory: recipe.category,
    ...(recipe.cookingMethod?.includes("keittäminen")
      ? { cookingMethod: { fi: "Keittäminen", en: "Boiling", sv: "Kokning", th: "การต้ม" }[recipe.locale] }
      : {}),
    keywords: recipe.tags.length ? recipe.tags.join(", ") : undefined,
    ...(recipe.image ? { image: [recipe.image.src] } : {}),
    recipeYield: String(recipe.servings),
    recipeIngredient: (recipe.kitchenIngredients ?? recipe.ingredients).map(item => formatRecipeIngredient(item, recipe.servings, recipe.servings, recipe.locale)),
    recipeInstructions: [
      ...(recipe.ingredientPreparation ?? []).map((text, index) => ({
        "@type": "HowToStep", text,
        url: canonicalUrl && `${canonicalUrl}#${recipeInstructionId("prep", index)}`,
      })),
      ...recipe.instructionsText.map((text, index) => ({
        "@type": "HowToStep", text, name: recipeStepName(recipe, text),
        url: canonicalUrl && recipe.instructionStepsHtml?.length === recipe.instructionsText.length
          ? `${canonicalUrl}#${recipeInstructionId("step", index)}`
          : undefined,
      })),
    ],
    totalTime: recipe.timeTotalMin ? `PT${recipe.timeTotalMin}M` : undefined,
    ...(Object.keys(nutrition).length ? { nutrition: { "@type": "NutritionInformation", ...nutrition } } : {}),
  };
}
