import { createHash } from "node:crypto";
import type { Calculation } from "./nutrition-model";
import { calculate } from "./nutrition-model";

const nutritionKeys = [
  "carbs_net_per_serving_g",
  "carbs_total_per_serving_g",
  "protein_per_serving_g",
  "fat_per_serving_g",
] as const;

type RecipeForEvidence = {
  recipe_id: string;
  servings: number;
  ingredients: { amount: number | null; unit: string; item: string; note?: string }[];
  carbs_net_per_serving_g?: number | null;
  carbs_total_per_serving_g?: number | null;
  protein_per_serving_g?: number | null;
  fat_per_serving_g?: number | null;
};

type TranslationForEvidence = { path: string; data: RecipeForEvidence };

export function recipeNutritionInputHash(recipe: RecipeForEvidence): string {
  const input = {
    servings: recipe.servings,
    ingredients: recipe.ingredients.map(({ amount, unit, item, note }) => ({ amount, unit, item, note: note ?? null })),
  };
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export function verifyNutritionEvidence(
  recipe: RecipeForEvidence,
  evidence: Calculation | null,
  translations: TranslationForEvidence[] = [],
) {
  const errors: string[] = [];
  const values = Object.fromEntries(nutritionKeys.map((key) => [key, recipe[key] ?? null]));
  const hasValues = Object.values(values).some((value) => value !== null);
  if (!evidence) return { status: hasValues ? "INSUFFICIENT SOURCE DATA" : "MISSING", errors: ["Calculation evidence file is missing"], calculated: null, values };

  if (evidence.recipeId !== recipe.recipe_id) errors.push(`recipe ID mismatch: ${evidence.recipeId}`);
  if (evidence.servings !== recipe.servings) errors.push(`servings mismatch: evidence=${evidence.servings}, recipe=${recipe.servings}`);
  const expectedHash = recipeNutritionInputHash(recipe);
  if (evidence.sourceHash !== expectedHash) errors.push("recipe ingredients or yield changed after calculation evidence was produced");
  if (evidence.ingredients.length !== recipe.ingredients.length) {
    errors.push(`ingredient row count mismatch: evidence=${evidence.ingredients.length}, recipe=${recipe.ingredients.length}`);
  }
  for (let index = 0; index < Math.min(evidence.ingredients.length, recipe.ingredients.length); index++) {
    const input = evidence.ingredients[index]!;
    const source = recipe.ingredients[index]!;
    if (input.item !== source.item || input.amount !== source.amount || input.unit !== source.unit) {
      errors.push(`ingredient ${index + 1} does not match the published source recipe`);
    }
  }

  let calculated: ReturnType<typeof calculate> | null = null;
  try {
    calculated = calculate(evidence);
    if (calculated.status !== "ESTIMATE WITH EVIDENCE") errors.push(`calculation status is ${calculated.status}`);
    const calculatedValues = {
      carbs_net_per_serving_g: calculated.perServing.netCarbohydrate,
      carbs_total_per_serving_g: calculated.totalCarbohydratePerServingG,
      protein_per_serving_g: calculated.perServing.protein,
      fat_per_serving_g: calculated.perServing.fat,
    };
    for (const key of nutritionKeys) {
      const actual = values[key];
      const expected = calculatedValues[key];
      if (actual === null || expected === null || actual !== expected) {
        errors.push(`${key} mismatch: published=${actual}, recalculated=${expected}`);
      }
    }
  } catch (error) {
    errors.push(`calculation failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  for (const translation of translations) {
    if (translation.data.recipe_id !== recipe.recipe_id) errors.push(`${translation.path}: recipe ID mismatch`);
    for (const key of nutritionKeys) {
      if ((translation.data[key] ?? null) !== (recipe[key] ?? null)) errors.push(`${translation.path}: ${key} differs from Finnish source`);
    }
  }

  const status = errors.length === 0 ? "ESTIMATE WITH EVIDENCE" : hasValues ? "CONFLICT REQUIRES REVIEW" : "INSUFFICIENT SOURCE DATA";
  return { status, errors, calculated, values };
}
