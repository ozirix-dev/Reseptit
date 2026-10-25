/** Invented fixture data; it is not copied from Nutritics or any food database. */
export const syntheticFoodSearch = {
  status: 200,
  foods: [{ id: "fixture-food-001", name: "Synthetic oat ingredient", source: "fixture-only", nutrientsPer100g: { carbohydrate: 40, protein: 10, fat: 5 } }],
};

export const syntheticRecipeAnalysis = {
  status: 200,
  recipeId: "fixture-recipe-001",
  servings: 2,
  nutrientsPerServing: { energyKcal: 100, carbohydrate: 12, protein: 6, fat: 4 },
};
