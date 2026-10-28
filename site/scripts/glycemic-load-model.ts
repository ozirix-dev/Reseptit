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
    authors?: string;
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
  /** Historical source retained without approval for ingredient-based calculations. */
  calculationUse?: "REFERENCE_ONLY";
  note?: string;
  matchKind?: "EXACT" | "ANALOG" | "CATEGORY_MEAN";
  confidence?: "HIGH" | "MEDIUM" | "LOW";
}

export interface GlycemicLoadIngredientInput {
  name: string;
  grams: number | null;
  /** Original recipe quantity, separate from the composition-backed calculation mass. */
  recipeQuantity?: { amount: number | null; unit: string | null; massGrams: number | null };
  fineliRecordId: string | null;
  giRecordId: string | null;
  foodKey?: string;
  preparationKey?: string;
  massEvidence?: string;
  giMatchEvidence?: string;
  excludedReason?: string;
  estimatedAvailableCarbohydratePerServingG?: number;
  availableCarbohydratePer100gRange?: { min: number; max: number; evidence: string };
  /** A source-backed conservative ceiling, not an estimate of actual available carbohydrate. */
  availableCarbohydrateUpperBoundPerServingG?: number;
  upperBoundEvidence?: string;
  negligibleAssumption?: string;
}

export interface GlycemicLoadRecipeInput {
  recipeId: string;
  servings: number;
  ingredients: GlycemicLoadIngredientInput[];
}

/** Per-ingredient ceiling for omitting a positive, unmatched GI contribution. */
export const MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G = 1;
/** Editorial cap for all such omitted portions combined per serving; equality blocks. */
export const CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G = 2;

export interface GlycemicLoadResult {
  recipeId: string;
  servings: number;
  status: "CALCULATED" | "INSUFFICIENT SOURCE DATA";
  unroundedGlycemicLoadPerServing: number | null;
  glycemicLoadPerServing: number | null;
  glycemicLoadRangePerServing: { min: number; max: number } | null;
  omittedAvailableCarbohydratePerServingG: number;
  omittedAvailableCarbohydrateUpperBoundPerServingG: number;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  interpretation: string;
  ingredients: Array<{
    name: string;
    grams: number | null;
    recipeQuantity?: { amount: number | null; unit: string | null; massGrams: number | null };
    fineliRecordId: string | null;
    availableCarbohydratePer100g: number | null;
    availableCarbohydratePerServingG: number | null;
    availableCarbohydrateUpperBoundPerServingG?: number | null;
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

export type GlycemicLoadClass = "LOW" | "MEDIUM" | "HIGH";

/** Public recipe cards display one significant digit; retain the exact estimate internally. */
export function roundGlycemicLoadForDisplay(value: number): number {
  if (!valid(value)) throw new Error("Glycemic load must be a finite non-negative number.");
  return Number(value.toPrecision(1));
}

/** Standard GL bands apply to the nearest whole-number estimate, avoiding decimal gaps. */
export function classifyGlycemicLoad(value: number): GlycemicLoadClass {
  if (!valid(value)) throw new Error("Glycemic load must be a finite non-negative number.");
  const wholeNumber = Math.round(value);
  if (wholeNumber <= 10) return "LOW";
  if (wholeNumber <= 19) return "MEDIUM";
  return "HIGH";
}

function categoryMeanMatchesFood(foodKey: string, foodName: string, ingredientName: string): boolean {
  const text = `${foodName} ${ingredientName}`.normalize("NFC").toLocaleLowerCase("fi-FI");
  const patterns: Record<string, RegExp> = {
    dairy: /maito|milk|cream|kerma|jogurtti|yogurt|juusto|cheese|rahka|quark|paneer|feta|ricotta|voi|butter|dairy/,
    "plain-yogurt-category-mean": /jogurtti|yogurt/,
    "bakery-products-category-mean": /jauho|flour|mannasuurimo|semolina|leipä|bread|kaura|oat|vehnä|wheat|ruis|rye/,
    "bread-category-mean": /leipä|bread|sämpylä|bun|pita|flatbread|toast/,
    "sugar-syrups-category-mean": /soker|sugar|siirappi|syrup|hunaja|honey|hillo|jam|molasses/,
    "honey-category-mean": /hunaja|honey/,
    "peanut": /pähkinä|nut|maapähkinä|peanut|mantel|almond|pistaasi|pistachio|cashew|saksanpähkinä|walnut/,
    vegetable: /vihannes|vegetable|porkkana|carrot|kaali|cabbage|kukkakaali|cauliflower|pinaatti|spinach|paprika|pepper|tomaatti|tomato|kurkku|cucumber|munakoiso|eggplant|kesäkurpitsa|zucchini|selleri|celery|sieni|mushroom|papu|bean|herne|pea|paksoi|bok choy|sipuli|onion|okra|parsakaali|broccoli/,
    "fruit-category-mean": /hedelmä|fruit|appelsiini|orange|sitruuna|lemon|lime|limetti|taateli|date|banaani|banana|omena|apple|viikuna|fig|persikka|peach|rypäle|grape|marja|berry/,
    legume: /papu|bean|kikherne|chickpea|linssi|lentil|soija|soy|tofu|mung|herne|pea/,
    soup: /keitto|soup|broth/,
    "potatoes-category-mean": /peruna|potato/,
    "rice-category-mean": /riisi|rice/,
    "pasta-category-mean": /pasta|makaroni|noodle|nuudeli/,
    "curry-paste": /currytahna|curry paste/,
  };
  return patterns[foodKey]?.test(text) ?? false;
}

function hasClearFoodFamilyMismatch(foodKey: string, foodName: string, ingredientName: string): boolean {
  const source = `${foodKey} ${foodName}`.normalize("NFC").toLocaleLowerCase("fi-FI");
  const ingredient = ingredientName.normalize("NFC").toLocaleLowerCase("fi-FI");
  const riceVinegar = /riisiviinietik|rice\s+(?:wine\s+)?vinegar/.test(ingredient);
  const sourceIsRice = /riisi|rice/.test(source) && !/etikka|vinegar/.test(source);
  if (riceVinegar && sourceIsRice) return true;

  const milkChocolate = /maitosukla|milk\s+chocolate|suklaa|chocolate/.test(ingredient);
  const sourceIsDairy = foodKey === "dairy" || /maito|milk|dairy|cream|kerma|yogurt|jogurtti/.test(source);
  return milkChocolate && sourceIsDairy;
}

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
  let omittedAvailableCarbohydrateUpperBoundPerServingG = 0;

  const ingredients = input.ingredients.map((ingredient) => {
    const issues: string[] = [];
    const giCandidates = ingredient.foodKey
      ? giRecords.filter((record) => record.foodKey === ingredient.foodKey && record.calculationUse !== "REFERENCE_ONLY").map((record) => ({
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
      const upperBound = ingredient.availableCarbohydrateUpperBoundPerServingG;
      const validUpperBound = upperBound === undefined || (valid(upperBound) && Boolean(ingredient.upperBoundEvidence));
      const documentedZero = valid(estimatedCarbs) && estimatedCarbs === 0 && Boolean(ingredient.negligibleAssumption);
      const smallEstimate = valid(estimatedCarbs) && estimatedCarbs > 0 && estimatedCarbs < MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G && Boolean(ingredient.negligibleAssumption);
      const smallUpperBound = upperBound !== undefined && validUpperBound && upperBound > 0 && upperBound < MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G;
      const smallOmission = smallEstimate || smallUpperBound;
      if (smallOmission) {
        const omittedAmount = smallUpperBound ? upperBound! : estimatedCarbs!;
        omittedAvailableCarbohydratePerServingG += omittedAmount;
        if (smallUpperBound) omittedAvailableCarbohydrateUpperBoundPerServingG += upperBound!;
        confidence = "LOW";
      }
      const issue = documentedZero
        ? `Source-documented zero available carbohydrate: ${ingredient.negligibleAssumption}`
        : smallUpperBound ? `Conservative available-carbohydrate upper bound counted toward cumulative 2 g/serving editorial tolerance; this is not an actual nutrient estimate: ${ingredient.upperBoundEvidence}`
          : smallEstimate ? `Individual sub-1 g contribution counted toward cumulative 2 g/serving editorial tolerance: ${ingredient.negligibleAssumption}`
            : !validUpperBound ? "Available-carbohydrate upper bound is invalid or lacks source evidence."
              : ingredient.excludedReason || "Ingredient amount or Fineli mapping is missing; it is not treated as zero.";
      if (!documentedZero && !smallOmission) blockers.push(`${input.recipeId}: ${ingredient.name}: ${issue}`);
      return {
        name: ingredient.name,
        grams: ingredient.grams,
        ...(ingredient.recipeQuantity ? { recipeQuantity: ingredient.recipeQuantity } : {}),
        fineliRecordId: ingredient.fineliRecordId,
        availableCarbohydratePer100g: null,
        availableCarbohydratePerServingG: documentedZero || smallEstimate ? estimatedCarbs ?? null : null,
        availableCarbohydrateUpperBoundPerServingG: smallUpperBound ? upperBound! : null,
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
      const sourceValid = Boolean(matchedGi && matchedGi.calculationUse !== "REFERENCE_ONLY" && valid(matchedGi.gi) && ingredient.giMatchEvidence
        && matchedGi.source.url && matchedGi.source.published && matchedGi.referenceScale === "GLUCOSE_100");
      const keysMatch = Boolean(matchedGi && ingredient.foodKey && ingredient.preparationKey
        && matchedGi.foodKey === ingredient.foodKey
        && matchedGi.preparationKey === ingredient.preparationKey);
      const categoryMeanMatch = Boolean(matchedGi && match === "CATEGORY_MEAN"
        && (!ingredient.foodKey || ingredient.foodKey === matchedGi.foodKey)
        && (!ingredient.preparationKey || ingredient.preparationKey === matchedGi.preparationKey)
        && categoryMeanMatchesFood(matchedGi.foodKey, food?.name ?? "", ingredient.name));
      const foodFamilyMismatch = Boolean(matchedGi && food && hasClearFoodFamilyMismatch(matchedGi.foodKey, food.name, ingredient.name));
      const matchValid = Boolean(matchedGi && !foodFamilyMismatch && (match === "CATEGORY_MEAN" ? categoryMeanMatch : keysMatch)
        && ["EXACT", "ANALOG", "CATEGORY_MEAN"].includes(match));
      if (!sourceValid || !matchValid) {
        const reason = !matchedGi ? ingredient.giMatchEvidence || "GI evidence is missing."
          : matchedGi.calculationUse === "REFERENCE_ONLY" ? "GI record is reference-only; its evidence is not approved for ingredient-based calculation."
          : foodFamilyMismatch ? "GI food family does not match the ingredient (for example, rice is not rice vinegar or dairy is not milk chocolate)."
          : "GI value is unpublished, off-scale, or its food/preparation match lacks a rationale.";
        if (availablePerServing < MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G && ingredient.giRecordId === null) {
          omittedAvailableCarbohydratePerServingG += availablePerServing;
          confidence = "LOW";
          issues.push(`Individual sub-1 g contribution omitted and counted toward cumulative 2 g/serving editorial tolerance (${availablePerServing.toFixed(3)} g available carbohydrate): ${reason}`);
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
      if (!issue.startsWith("Individual sub-1 g contribution omitted and counted toward cumulative 2 g/serving editorial tolerance")) blockers.push(`${input.recipeId}: ${ingredient.name}: ${issue}`);
    }
    return {
      name: ingredient.name,
      grams: ingredient.grams,
      ...(ingredient.recipeQuantity ? { recipeQuantity: ingredient.recipeQuantity } : {}),
      fineliRecordId: ingredient.fineliRecordId,
      availableCarbohydratePer100g: availablePer100g,
      availableCarbohydratePerServingG: availablePerServing,
      availableCarbohydrateUpperBoundPerServingG: null,
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

  if (omittedAvailableCarbohydratePerServingG >= CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G) blockers.push(`${input.recipeId}: cumulative omitted available carbohydrate is ${omittedAvailableCarbohydratePerServingG.toFixed(3)} g/serving, at or above the 2 g editorial tolerance.`);
  const complete = blockers.length === 0;
  return {
    recipeId: input.recipeId,
    servings: input.servings,
    status: complete ? "CALCULATED" : "INSUFFICIENT SOURCE DATA",
    unroundedGlycemicLoadPerServing: complete ? totalLoad : null,
    glycemicLoadPerServing: complete ? Math.round((totalLoad + Number.EPSILON) * 100) / 100 : null,
    glycemicLoadRangePerServing: complete && hasRange ? {
      min: Math.round((totalLoadMin + Number.EPSILON) * 100) / 100,
      max: Math.round((totalLoadMax + Number.EPSILON) * 100) / 100,
    } : null,
    omittedAvailableCarbohydratePerServingG,
    omittedAvailableCarbohydrateUpperBoundPerServingG,
    confidence: complete ? confidence : null,
    interpretation: "Ingredient-based estimate only; actual prepared-meal response varies. Positive contributions are included when source-supported. An unmatched individual ingredient portion may be omitted only below 1 g available carbohydrate per serving, and all such omissions must total less than the 2 g/serving editorial tolerance.",
    ingredients,
    blockers,
  };
}
