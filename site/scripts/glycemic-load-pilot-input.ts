import type { GlycemicLoadRecipeInput } from "./glycemic-load-model";

export interface PublishedRecipeInputSource {
  recipeId: string;
  servings: number;
  ingredients: Array<{ item: string; amount: number | null; unit: string | null }>;
}

const unresolvedSourceReason =
  "Published recipe: available-carbohydrate composition is unresolved and GI evidence has not been reviewed; unknown values are not treated as zero.";

export function completePublishedRecipeInputs(
  reviewedInputs: GlycemicLoadRecipeInput[],
  publishedRecipes: PublishedRecipeInputSource[],
): { recipes: GlycemicLoadRecipeInput[]; autoIncludedRecipeIds: string[] } {
  const publishedIds = publishedRecipes.map((recipe) => recipe.recipeId);
  if (new Set(publishedIds).size !== publishedIds.length) {
    throw new Error("Published Finnish recipe sources contain duplicate recipe IDs.");
  }
  const reviewedIds = reviewedInputs.map((recipe) => recipe.recipeId);
  if (new Set(reviewedIds).size !== reviewedIds.length) {
    throw new Error("GI/GK pilot input contains duplicate recipe IDs.");
  }
  const published = new Set(publishedIds);
  const staleInputs = reviewedIds.filter((recipeId) => !published.has(recipeId));
  if (staleInputs.length) {
    throw new Error("GI/GK pilot input contains unpublished recipe IDs: " + staleInputs.join(", ") + ".");
  }

  const reviewed = new Set(reviewedIds);
  const autoIncluded = publishedRecipes.filter((recipe) => !reviewed.has(recipe.recipeId));
  const unresolvedInputs = autoIncluded.map((recipe) => {
    if (!Number.isInteger(recipe.servings) || recipe.servings <= 0 || recipe.ingredients.length === 0) {
      throw new Error("Cannot create an unresolved GI/GK row without valid servings and ingredients: " + recipe.recipeId + ".");
    }
    return {
      recipeId: recipe.recipeId,
      servings: recipe.servings,
      ingredients: recipe.ingredients.map((ingredient) => {
        if (!ingredient.item.trim()) throw new Error("Published recipe ingredient has no name: " + recipe.recipeId + ".");
        const unit = ingredient.unit?.trim() || null;
        const amount = typeof ingredient.amount === "number" && Number.isFinite(ingredient.amount) ? ingredient.amount : null;
        const massGrams = amount !== null && unit && ["g", "gram", "grams"].includes(unit.toLocaleLowerCase("en-US"))
          ? amount
          : null;
        return {
          name: ingredient.item,
          grams: null,
          recipeQuantity: { amount, unit, massGrams },
          fineliRecordId: null,
          giRecordId: null,
          excludedReason: unresolvedSourceReason,
        };
      }),
    };
  });
  return {
    recipes: [...reviewedInputs, ...unresolvedInputs],
    autoIncludedRecipeIds: autoIncluded.map((recipe) => recipe.recipeId),
  };
}
