import { normalizeCarbohydrate, type FoodRecord } from "./nutrition-model";

export interface GlycemicIndexRecord {
  id: string;
  gi: number;
  foodKey: string;
  preparationKey: string;
  food: string;
  preparation: string;
  qualityTier: "STRONG" | "SUPPLEMENTARY";
  referenceScale: "GLUCOSE_100";
  source: {
    title: string;
    url: string;
    table: string;
    year: number;
    published: boolean;
    iso26642Confirmed: boolean;
    participants?: number;
    referenceFood?: string;
    testDurationHours?: number;
    qualityEvidence: string;
  };
  note?: string;
}

export interface GlycemicLoadIngredientInput {
  name: string;
  grams: number | null;
  fineliRecordId: string | null;
  giRecordId: string | null;
  foodKey?: string;
  preparationKey?: string;
  massEvidence?: string;
  giMatchEvidence?: string;
  excludedReason?: string;
}

export interface GlycemicLoadRecipeInput {
  recipeId: string;
  servings: number;
  ingredients: GlycemicLoadIngredientInput[];
}

export interface GlycemicLoadResult {
  recipeId: string;
  servings: number;
  status: "CALCULATED" | "INSUFFICIENT SOURCE DATA";
  glycemicLoadPerServing: number | null;
  ingredients: Array<{
    name: string;
    grams: number | null;
    fineliRecordId: string | null;
    availableCarbohydratePer100g: number | null;
    availableCarbohydratePerServingG: number | null;
    gi: number | null;
    giRecordId: string | null;
    qualityTier: GlycemicIndexRecord["qualityTier"] | null;
    giContribution: number | null;
    giCandidates: Array<{
      id: string;
      gi: number;
      preparation: string;
      qualityTier: GlycemicIndexRecord["qualityTier"];
      preparationMatches: boolean;
      sourceUrl: string;
    }>;
    excludedReason?: string;
    issues: string[];
  }>;
  blockers: string[];
}

const valid = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;

/**
 * Calculate GL from each ingredient's available carbohydrate and an exact GI
 * match. Missing evidence blocks the recipe total; a partial GL is never
 * returned as if it represented the whole recipe.
 */
export function calculateGlycemicLoad(
  input: GlycemicLoadRecipeInput,
  foodRecords: FoodRecord[],
  giRecords: GlycemicIndexRecord[],
): GlycemicLoadResult {
  if (!input.recipeId || !Number.isInteger(input.servings) || input.servings <= 0 || !input.ingredients.length) {
    throw new Error("A glycemic-load input needs a recipe ID, positive servings, and ingredients.");
  }

  const foodsById = new Map(foodRecords.map((record) => [record.id, record]));
  const giById = new Map(giRecords.map((record) => [record.id, record]));
  const blockers: string[] = [];
  let totalLoad = 0;

  const ingredients = input.ingredients.map((ingredient) => {
    const issues: string[] = [];
    const giCandidates = ingredient.foodKey
      ? giRecords.filter((record) => record.foodKey === ingredient.foodKey).map((record) => ({
        id: record.id,
        gi: record.gi,
        preparation: record.preparation,
        qualityTier: record.qualityTier,
        preparationMatches: record.preparationKey === ingredient.preparationKey,
        sourceUrl: record.source.url,
      }))
      : [];

    if (ingredient.excludedReason) {
      const issue = "Ingredient amount or Fineli mapping is missing; it is not treated as zero.";
      blockers.push(`${input.recipeId}: ${ingredient.name}: ${issue}`);
      return {
        name: ingredient.name,
        grams: ingredient.grams,
        fineliRecordId: ingredient.fineliRecordId,
        availableCarbohydratePer100g: null,
        availableCarbohydratePerServingG: null,
        gi: null,
        giRecordId: ingredient.giRecordId,
        qualityTier: null,
        giContribution: null,
        giCandidates,
        excludedReason: ingredient.excludedReason,
        issues,
      };
    }

    if (!valid(ingredient.grams)) issues.push("Ingredient mass is missing or invalid.");
    const food = ingredient.fineliRecordId ? foodsById.get(ingredient.fineliRecordId) : undefined;
    if (!food) issues.push("Fineli food record is missing.");

    let availablePer100g: number | null = null;
    if (food) {
      try {
        const normalized = normalizeCarbohydrate(food);
        availablePer100g = normalized.available;
        if (!valid(availablePer100g)) issues.push("Available carbohydrate is missing or its definition is unresolved.");
      } catch (error) {
        issues.push(String(error));
      }
    }

    let availablePerServing: number | null = null;
    if (valid(ingredient.grams) && valid(availablePer100g)) {
      availablePerServing = availablePer100g * ingredient.grams / 100 / input.servings;
    }

    let gi: number | null = null;
    let qualityTier: GlycemicIndexRecord["qualityTier"] | null = null;
    let giContribution: number | null = null;
    if (availablePerServing !== null && availablePerServing > 0) {
      if (!ingredient.foodKey || !ingredient.preparationKey) {
        issues.push("Ingredient food and preparation keys are missing.");
      }
      const matchedGi = ingredient.giRecordId ? giById.get(ingredient.giRecordId) : undefined;
      if (!matchedGi) {
        issues.push(ingredient.giMatchEvidence || "No exact, preparation-matched published GI value is recorded.");
      } else if (matchedGi.foodKey !== ingredient.foodKey || matchedGi.preparationKey !== ingredient.preparationKey) {
        issues.push("Published GI food or preparation does not exactly match the recipe ingredient.");
      } else if (!valid(matchedGi.gi) || !ingredient.giMatchEvidence) {
        issues.push("GI value or exact-match evidence is invalid.");
      } else if (matchedGi.qualityTier !== "STRONG" || !matchedGi.source.published || !matchedGi.source.iso26642Confirmed) {
        issues.push("GI source does not meet the strong, published ISO 26642 evidence tier.");
      } else {
        gi = matchedGi.gi;
        qualityTier = matchedGi.qualityTier;
        giContribution = availablePerServing * gi / 100;
        totalLoad += giContribution;
      }
    }

    for (const issue of issues) blockers.push(`${input.recipeId}: ${ingredient.name}: ${issue}`);
    return {
      name: ingredient.name,
      grams: ingredient.grams,
      fineliRecordId: ingredient.fineliRecordId,
      availableCarbohydratePer100g: availablePer100g,
      availableCarbohydratePerServingG: availablePerServing,
      gi,
      giRecordId: ingredient.giRecordId,
      qualityTier,
      giContribution,
      giCandidates,
      issues,
    };
  });

  const complete = blockers.length === 0;
  return {
    recipeId: input.recipeId,
    servings: input.servings,
    status: complete ? "CALCULATED" : "INSUFFICIENT SOURCE DATA",
    glycemicLoadPerServing: complete ? Math.round((totalLoad + Number.EPSILON) * 100) / 100 : null,
    ingredients,
    blockers,
  };
}
