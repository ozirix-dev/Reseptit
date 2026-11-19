import { originalPortionGk, verbalGkForPortion, type PortionEvidence } from "../src/features/recipes/gk-portion";

export type GlycemicLoadFilterCategory = "low" | "medium" | "high";
interface OriginalEstimate {
  status: string;
  confidence: string | null;
  glycemicLoadPerServing: number | null;
  unroundedGlycemicLoadPerServing?: number | null;
  glycemicLoadRangePerServing: { min: number; max: number } | null;
  omittedAvailableCarbohydratePerServingG?: number;
}

/** Listing categories use the original recipe at its listed serving size. */
export function originalGlycemicLoadCategory(result?: OriginalEstimate, evidence?: PortionEvidence): GlycemicLoadFilterCategory | null {
  if (result?.status !== "CALCULATED" || result.confidence === null) {
    const verbal = evidence?.verbal;
    const category = !evidence?.condition && !verbal?.condition ? verbalGkForPortion(verbal, 1) : null;
    return category ? category.toLowerCase() as GlycemicLoadFilterCategory : null;
  }
  const { category, omissionLimitsClass } = originalPortionGk(result);
  if (!category || category === "CROSSES_BOUNDARY" || omissionLimitsClass || evidence?.classLimitation) return null;
  return category.toLowerCase() as GlycemicLoadFilterCategory;
}
