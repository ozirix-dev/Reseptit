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
  matchKind?: "EXACT" | "ANALOG" | "CATEGORY_MEAN";
  confidence?: "HIGH" | "MEDIUM" | "LOW";
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
  estimatedAvailableCarbohydratePerServingG?: number;
  availableCarbohydratePer100gRange?: { min: number; max: number; evidence: string };
  negligibleAssumption?: string;
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
  glycemicLoadRangePerServing: { min: number; max: number } | null;
  omittedAvailableCarbohydratePerServingG: number;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  interpretation: string;
  ingredients: Array<{
    name: string;
    grams: number | null;
    fineliRecordId: string | null;
    availableCarbohydratePer100g: number | null;
    availableCarbohydratePerServingG: number | null;
    availableCarbohydratePerServingRangeG: { min: number; max: number } | null;
    gi: number | null;
    giRecordId: string | null;
    qualityTier: GlycemicIndexRecord["qualityTier"] | null;
    matchKind: GlycemicIndexRecord["matchKind"] | null;
    confidence: GlycemicIndexRecord["confidence"] | null;
    giContribution: number | null;
    giContributionRange: { min: number; max: number } | null;
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
 * Calculate an ingredient-based GL estimate. Every positive carbohydrate
 * contribution is included or counted toward the cumulative editorial tolerance.
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
  let totalLoadMin = 0;
  let totalLoadMax = 0;
  let hasRange = false;
  let confidence: "HIGH" | "MEDIUM" | "LOW" = "HIGH";
  let omittedAvailableCarbohydratePerServingG = 0;

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
      const estimatedCarbs = ingredient.estimatedAvailableCarbohydratePerServingG;
      const documentedZero = valid(estimatedCarbs) && estimatedCarbs === 0 && Boolean(ingredient.negligibleAssumption);
      const smallOmission = valid(estimatedCarbs) && estimatedCarbs > 0 && estimatedCarbs < 1 && Boolean(ingredient.negligibleAssumption);
      if (smallOmission) {
        omittedAvailableCarbohydratePerServingG += estimatedCarbs;
        confidence = "LOW";
      }
      const issue = documentedZero
        ? `Source-documented zero available carbohydrate: ${ingredient.negligibleAssumption}`
        : smallOmission ? `Small contribution counted toward cumulative 1 g/serving editorial tolerance: ${ingredient.negligibleAssumption}`
        : ingredient.excludedReason || "Ingredient amount or Fineli mapping is missing; it is not treated as zero.";
      if (!documentedZero && !smallOmission) blockers.push(`${input.recipeId}: ${ingredient.name}: ${issue}`);
      return {
        name: ingredient.name,
        grams: ingredient.grams,
        fineliRecordId: ingredient.fineliRecordId,
        availableCarbohydratePer100g: null,
        availableCarbohydratePerServingG: documentedZero || smallOmission ? estimatedCarbs ?? null : null,
        availableCarbohydratePerServingRangeG: null,
        gi: null,
        giRecordId: ingredient.giRecordId,
        qualityTier: null,
        matchKind: null,
        confidence: documentedZero || smallOmission ? "LOW" as const : null,
        giContribution: null,
        giContributionRange: null,
        giCandidates,
        excludedReason: ingredient.excludedReason,
        issues: [issue],
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

    const carbohydrateRange = ingredient.availableCarbohydratePer100gRange;
    if (carbohydrateRange) {
      hasRange = true;
      if (!valid(carbohydrateRange.min) || !valid(carbohydrateRange.max) || carbohydrateRange.max < carbohydrateRange.min || !carbohydrateRange.evidence) {
        issues.push("Available-carbohydrate range is invalid or lacks evidence.");
      }
    }

    let availablePerServing: number | null = null;
    if (valid(ingredient.grams) && valid(availablePer100g)) {
      availablePerServing = availablePer100g * ingredient.grams / 100 / input.servings;
    }
    const availablePerServingRange = valid(ingredient.grams) && carbohydrateRange
      ? { min: carbohydrateRange.min * ingredient.grams / 100 / input.servings, max: carbohydrateRange.max * ingredient.grams / 100 / input.servings }
      : null;
    if (availablePerServingRange) availablePerServing = availablePerServingRange.max;

    let gi: number | null = null;
    let qualityTier: GlycemicIndexRecord["qualityTier"] | null = null;
    let giContribution: number | null = null;
    let giContributionRange: { min: number; max: number } | null = null;
    let matchKind: GlycemicIndexRecord["matchKind"] | null = null;
    let ingredientConfidence: GlycemicIndexRecord["confidence"] | null = null;
    if (availablePerServing !== null && availablePerServing > 0) {
      const matchedGi = ingredient.giRecordId ? giById.get(ingredient.giRecordId) : undefined;
      if (matchedGi) {
        gi = matchedGi.gi;
        qualityTier = matchedGi.qualityTier;
        matchKind = matchedGi.matchKind ?? "EXACT";
        ingredientConfidence = matchedGi.confidence ?? (matchedGi.qualityTier === "STRONG" ? "HIGH" : "LOW");
      }
      const match = matchedGi?.matchKind ?? "EXACT";
      const sourceValid = Boolean(matchedGi && valid(matchedGi.gi) && ingredient.giMatchEvidence
        && matchedGi.source.url && matchedGi.source.published && matchedGi.referenceScale === "GLUCOSE_100");
      const matchValid = Boolean(matchedGi && (match === "EXACT"
        ? matchedGi.qualityTier === "STRONG" && matchedGi.foodKey === ingredient.foodKey && matchedGi.preparationKey === ingredient.preparationKey
        : match === "ANALOG" ? matchedGi.preparationKey === ingredient.preparationKey
          : match === "CATEGORY_MEAN"));
      if (!sourceValid || !matchValid) {
        const reason = !matchedGi ? ingredient.giMatchEvidence || "GI evidence is missing."
          : "GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.";
        if (availablePerServing < 1) {
          omittedAvailableCarbohydratePerServingG += availablePerServing;
          confidence = "LOW";
          issues.push(`Small contribution omitted under cumulative 1 g/serving editorial tolerance (${availablePerServing.toFixed(3)} g available carbohydrate): ${reason}`);
        } else issues.push(reason);
      } else {
        if (match !== "EXACT" || matchedGi!.qualityTier !== "STRONG") ingredientConfidence = "LOW";
        else ingredientConfidence = matchedGi!.confidence ?? "HIGH";
        if (ingredientConfidence === "LOW" || match === "ANALOG" || match === "CATEGORY_MEAN") confidence = "LOW";
        else if (ingredientConfidence === "MEDIUM" && confidence === "HIGH") confidence = "MEDIUM";
        const giValue = matchedGi!.gi;
        giContribution = availablePerServing * giValue / 100;
        const minCarbs = availablePerServingRange?.min ?? availablePerServing;
        giContributionRange = {
          min: minCarbs * giValue / 100,
          max: availablePerServing * giValue / 100,
        };
        totalLoad += giContribution;
        totalLoadMin += giContributionRange.min;
        totalLoadMax += giContributionRange.max;
      }
    }

    for (const issue of issues) {
      if (!issue.startsWith("Small contribution omitted under cumulative 1 g/serving editorial tolerance")) blockers.push(`${input.recipeId}: ${ingredient.name}: ${issue}`);
    }
    return {
      name: ingredient.name,
      grams: ingredient.grams,
      fineliRecordId: ingredient.fineliRecordId,
      availableCarbohydratePer100g: availablePer100g,
      availableCarbohydratePerServingG: availablePerServing,
      availableCarbohydratePerServingRangeG: availablePerServingRange,
      gi,
      giRecordId: ingredient.giRecordId,
      qualityTier,
      matchKind,
      confidence: ingredientConfidence,
      giContribution,
      giContributionRange,
      giCandidates,
      issues,
    };
  });

  if (omittedAvailableCarbohydratePerServingG >= 1) blockers.push(`${input.recipeId}: cumulative omitted available carbohydrate is ${omittedAvailableCarbohydratePerServingG.toFixed(3)} g/serving, above the 1 g editorial tolerance.`);
  const complete = blockers.length === 0;
  return {
    recipeId: input.recipeId,
    servings: input.servings,
    status: complete ? "CALCULATED" : "INSUFFICIENT SOURCE DATA",
    glycemicLoadPerServing: complete ? Math.round((totalLoad + Number.EPSILON) * 100) / 100 : null,
    glycemicLoadRangePerServing: complete && hasRange ? {
      min: Math.round((totalLoadMin + Number.EPSILON) * 100) / 100,
      max: Math.round((totalLoadMax + Number.EPSILON) * 100) / 100,
    } : null,
    omittedAvailableCarbohydratePerServingG,
    confidence: complete ? confidence : null,
    interpretation: "Ingredient-based estimate only; actual prepared-meal response varies. Positive contributions are included when source-supported. Unmatched sub-1 g ingredient portions may be omitted only while their cumulative amount stays below the documented 1 g/serving editorial tolerance.",
    ingredients,
    blockers,
  };
}
