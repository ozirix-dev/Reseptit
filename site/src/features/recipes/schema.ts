import type { RecipeEntry } from "../../types/content";
import { withholdF25Nutrition } from "./f25-nutrition-withhold";

export function recipeJsonLd(recipe: RecipeEntry): Record<string, unknown> {
  const withholding = withholdF25Nutrition(recipe.recipeId,recipe.locale);
  const nutrition = Object.fromEntries(Object.entries({
    carbohydrateContent: recipe.nutrition.carbsTotalG, proteinContent: recipe.nutrition.proteinG, fatContent: recipe.nutrition.fatG,
  }).filter(([, value]) => !withholding && value !== null).map(([key, value]) => [key, `${value} g`]));
  return {
    "@context": "https://schema.org", "@type": "Recipe", name: recipe.title,
    description: recipe.description || undefined, inLanguage: recipe.locale, recipeCategory: recipe.category,
    keywords: recipe.tags.length ? recipe.tags.join(", ") : undefined,
    ...(recipe.image ? { image: [recipe.image.src] } : {}),
    recipeYield: String(recipe.servings),
    recipeIngredient: recipe.ingredients.map((item) => [item.amount, item.unit, item.item, item.note]
      .filter((value) => value !== null && value !== undefined && value !== "").join(" ")),
    recipeInstructions: recipe.instructionsText.map((text) => ({ "@type": "HowToStep", text })),
    totalTime: recipe.timeTotalMin ? `PT${recipe.timeTotalMin}M` : undefined,
    ...(Object.keys(nutrition).length ? { nutrition: { "@type": "NutritionInformation", ...nutrition } } : {}),
  };
}
