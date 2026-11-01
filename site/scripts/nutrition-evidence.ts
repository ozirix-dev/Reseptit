import {calculateScopedPolyolC,isScopedPolyolEvidence} from './gk80-polyol-c';
import {calculateRecovery,isRecoveryEvidence} from "./gk80-uunikanapasta";
import { createHash } from "node:crypto";
import type { Calculation } from "./nutrition-model";
import { calculate } from "./nutrition-model";

// Owner-approved AFCD9837 withdrawal: suppress only these two exact historical
// evidence objects. This neither validates their old polyol claim nor relaxes
// the four-value calculation rules. Restoring values requires a separate change.
const withdrawnEvidenceHashes: Readonly<Record<string, string>> = {
  "keto-suklaakeksit": "53b29654ae27ad3069892bcad94f9710ef4893798a0aef4cc5239845abf16e28",
  "keto-mutakakku": "d1b17dcd782b109e50cf62abcb40f7deeab083b02e954d3de536231493f2573b"
};

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
  const withdrawnHash = Object.hasOwn(withdrawnEvidenceHashes, recipe.recipe_id) ? withdrawnEvidenceHashes[recipe.recipe_id] : undefined;
  if (withdrawnHash && !evidence) return { status: "CONFLICT REQUIRES REVIEW", errors: ["Withdrawn package must retain its exact historical calculation evidence"], calculated: null, values };
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

  for (const translation of translations) {
    if (translation.data.recipe_id !== recipe.recipe_id) errors.push(`${translation.path}: recipe ID mismatch`);
    for (const key of nutritionKeys) {
      if ((translation.data[key] ?? null) !== (recipe[key] ?? null)) errors.push(`${translation.path}: ${key} differs from Finnish source`);
    }
  }

  if (withdrawnHash) {
    if (hasValues) errors.push("Withdrawn package must withhold all four nutrition values");
    const actualHash = createHash("sha256").update(JSON.stringify(evidence)).digest("hex");
    if (actualHash !== withdrawnHash) errors.push("Withdrawn calculation evidence fingerprint changed; separate review required");
    return { status: errors.length === 0 ? "INSUFFICIENT SOURCE DATA" : "CONFLICT REQUIRES REVIEW", errors, calculated: null, values };
  }

  let calculated: ReturnType<typeof calculate> | ReturnType<typeof calculateRecovery> | ReturnType<typeof calculateScopedPolyolC> | null = null;
  try {
    calculated = isRecoveryEvidence(evidence) ? calculateRecovery(evidence) : isScopedPolyolEvidence(evidence) ? calculateScopedPolyolC(evidence) : calculate(evidence);
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

  const status = errors.length === 0 ? "ESTIMATE WITH EVIDENCE" : hasValues ? "CONFLICT REQUIRES REVIEW" : "INSUFFICIENT SOURCE DATA";
  return { status, errors, calculated, values };
}
