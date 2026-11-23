import type { RecipeEntry, RecipeLocale } from "../../types/content";
import { classifyPublicGk, gkEstimate, gkEstimateClass, type GkRange } from "./gk-estimate";
import type { GlycemicLoadDisplayCandidate } from "./glycemic-load-display";

export type GkClass = ReturnType<typeof classifyPublicGk>;
export type LocalizedText = Record<RecipeLocale, string>;

export interface OriginalGkCoverage {
  estimatedOmissionG: number;
  upperBoundOmissionG: number;
  hasOmissionAssumptions?: true;
  mainIngredient?: {
    names: Partial<LocalizedText>;
    share: "all" | "majority";
    categoryMean: boolean;
  };
}

export interface CarbohydrateChoice {
  label: LocalizedText;
  availableCarbsGPerServing: number;
  source: string;
}

/** Reviewed language refers to the original listed serving, never a separate version. */
export interface VerbalGk {
  category: GkClass;
  portions: number[];
  rationale: LocalizedText;
  condition?: LocalizedText;
}

export interface IngredientPortion {
  name: LocalizedText;
  amountPerServing: number;
  unit: "g" | "dl" | "kpl" | "arkkia";
  source?: string;
  availableCarbsGPerServing?: number;
  declaredCarbsGPerServing?: number;
  carbohydrateAlternatives?: CarbohydrateChoice[];
}

export interface NamedGkAlternative {
  label: LocalizedText;
  gkPerServing: number;
}

export type CarbohydrateComparison = Pick<RecipeEntry, "title" | "routePath"> & { range: GkRange };

export interface SideCarbohydrate {
  name: LocalizedText;
  availableCarbsGPer100g: number;
  source: string;
  weightsG: readonly number[];
}

export interface PortionEvidence {
  ingredientPortion?: IngredientPortion;
  additionalIngredientPortions?: IngredientPortion[];
  alternatives?: NamedGkAlternative[];
  versionAlternatives?: { versionId: string; choices: NamedGkAlternative[] };
  reviewedSource?: string;
  availableCarbs?: GkRange;
  modeledNetCarbs?: number;
  carbohydrateComparisons?: Partial<Record<RecipeLocale, CarbohydrateComparison>>;
  sideCarbohydrate?: SideCarbohydrate;
  wholeCarbohydrateChoices?: CarbohydrateChoice[];
  driver?: { ingredientIndex: number; coversMajority: boolean };
  verbal?: VerbalGk;
  condition?: LocalizedText;
  carbohydrateScope?: LocalizedText;
  classLimitation?: LocalizedText;
  gkIngredientSubset?: true;
  piecesPerServing?: number;
  gramsPerServing?: number;
}

export function reviewedIngredientPortions(evidence?: PortionEvidence): IngredientPortion[] {
  return evidence?.ingredientPortion ? [evidence.ingredientPortion, ...(evidence.additionalIngredientPortions ?? [])] : [];
}

export type PortionCarbs = { range: GkRange; definition: "available" | "total" | "net"; choices?: CarbohydrateChoice[] };

export function originalPortionCarbs(nutrition: RecipeEntry["nutrition"], evidence?: PortionEvidence): PortionCarbs | null {
  if (evidence?.availableCarbs) return {
    range: evidence.availableCarbs, definition: "available",
    ...(evidence.wholeCarbohydrateChoices && { choices: evidence.wholeCarbohydrateChoices }),
  };
  if (evidence?.modeledNetCarbs !== undefined) {
    const value = evidence.modeledNetCarbs;
    return { range: { min: value, max: value }, definition: "net" };
  }
  for (const [value, definition] of [[nutrition.carbsTotalG, "total"], [nutrition.carbsNetG, "net"]] as const) {
    if (value !== null && Number.isFinite(value) && value >= 0) return { range: { min: value, max: value }, definition };
  }
  return null;
}

export const eatenPortions = [0.5, 1, 1.5, 2] as const;

export function scalePortionRange(range: GkRange, multiplier: number): GkRange {
  return { min: range.min * multiplier, max: range.max * multiplier };
}

export function verbalGkForPortion(verbal: VerbalGk | undefined, multiplier: number): GkClass | null {
  return verbal?.portions.includes(multiplier) ? verbal.category : null;
}

export function classLimitedByOmission(category: GkClass | "CROSSES_BOUNDARY" | null, omitted = 0): boolean {
  // An omission does not erase the calculation. Without independent bounds for its
  // glycemic contribution, a low or medium modeled class is not a stable filter.
  return omitted > 0 && (category === "LOW" || category === "MEDIUM");
}

type PortionGkValues = Pick<GlycemicLoadDisplayCandidate,
  "unroundedGlycemicLoadPerServing" | "glycemicLoadPerServing" | "glycemicLoadRangePerServing" | "omittedAvailableCarbohydratePerServingG">;

export function originalPortionGk(result: PortionGkValues, multiplier = 1) {
  const range = result.glycemicLoadRangePerServing;
  // An explicitly absent unrounded point can certify a rounded serving value
  // without certifying enough precision to extrapolate to another portion.
  const standardServingOnly = multiplier !== 1 && result.unroundedGlycemicLoadPerServing === null && range === null;
  const point = standardServingOnly ? null : result.unroundedGlycemicLoadPerServing ?? result.glycemicLoadPerServing;
  const estimate = gkEstimate(point === null ? null : point * multiplier, range && scalePortionRange(range, multiplier));
  const numericCategory = gkEstimateClass(estimate);
  const pointCategory = point !== null && Number.isFinite(point) && point >= 0
    ? classifyPublicGk(point * multiplier) : null;
  const rangeOnly = estimate.type === "ESTIMATED_RANGE" && point === null;
  const inconsistent = estimate.type === "ESTIMATED_RANGE" && pointCategory !== null
    && numericCategory !== "CROSSES_BOUNDARY" && numericCategory !== pointCategory;
  const category = inconsistent ? null : numericCategory;
  const omissionLimitsClass = classLimitedByOmission(category, result.omittedAvailableCarbohydratePerServingG);
  return { estimate, category, inconsistent, omissionLimitsClass, standardServingOnly, rangeOnly };
}

export interface GkPortionCoverage {
  originalNumeric: number;
  numericIngredientSubset: number;
  numericWithRecordedOmissions: number;
  originalVerbal: number;
  wholePortionCarbs: number;
  carbOnly: number;
  foodNoteOnly: number;
  limited: number;
  pending: number;
  useful: number;
  total: number;
}

export function countGkPortionCoverage(rows: {
  numeric: boolean;
  recordedOmissions?: boolean;
  carbs: PortionCarbs | null;
  evidence?: PortionEvidence;
  pending: boolean;
}[]): GkPortionCoverage {
  const counts: GkPortionCoverage = {
    originalNumeric: 0, numericIngredientSubset: 0, numericWithRecordedOmissions: 0,
    originalVerbal: 0, wholePortionCarbs: 0,
    carbOnly: 0, foodNoteOnly: 0, limited: 0, pending: 0, useful: 0, total: rows.length,
  };
  for (const row of rows) {
    if (row.carbs) counts.wholePortionCarbs++;
    if (row.pending) counts.pending++;
    if (row.numeric) {
      counts.originalNumeric++;
      if (row.evidence?.gkIngredientSubset) counts.numericIngredientSubset++;
      if (row.recordedOmissions) counts.numericWithRecordedOmissions++;
    }
    else if (verbalGkForPortion(row.evidence?.verbal, 1)) counts.originalVerbal++;
    else if (row.carbs) counts.carbOnly++;
    else if (row.evidence?.driver || row.evidence?.ingredientPortion) counts.foodNoteOnly++;
    else counts.limited++;
  }
  counts.useful = counts.total - counts.limited;
  return counts;
}
