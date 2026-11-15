import type { RecipeCategoryName, RecipeLocale } from "../types/content";

type CategorizedRecipe = {
  category: RecipeCategoryName;
  additionalCategories?: RecipeCategoryName[];
};

/** Category filters include secondary listings; a recipe is still a single record. */
export function recipeMatchesCategory(recipe: CategorizedRecipe, category: RecipeCategoryName): boolean {
  return recipe.category === category || (recipe.additionalCategories?.includes(category) ?? false);
}

/**
 * Finnish metadata owns secondary categories for every published translation.
 * Explicit localized declarations must agree; never silently accept drift.
 */
export function inheritSourceAdditionalCategories<T extends CategorizedRecipe & {
  recipeId: string;
  locale: RecipeLocale;
}>(recipes: readonly T[]): T[] {
  const sources = new Map<string, RecipeCategoryName[]>();
  for (const recipe of recipes) {
    if (recipe.locale === "fi") sources.set(recipe.recipeId, recipe.additionalCategories ?? []);
  }
  return recipes.map((recipe) => {
    const sourceCategories = sources.get(recipe.recipeId);
    const explicit = recipe.additionalCategories ?? [];
    if (recipe.locale !== "fi" && explicit.length &&
        (!sourceCategories || explicit.length !== sourceCategories.length ||
          explicit.some((category, index) => category !== sourceCategories[index]))) {
      throw new Error(`Secondary category mismatch: ${recipe.recipeId}/${recipe.locale}`);
    }
    if (!sourceCategories?.length) return recipe;
    return { ...recipe, additionalCategories: [...sourceCategories] };
  });
}
