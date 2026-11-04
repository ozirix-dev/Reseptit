export interface GlycemicLoadDisplayCandidate {
  recipeId: string;
  assessmentType?: "PUBLISHED_IMPUTATION";
  closedRecoveryC?: boolean;
  boundedPolyolC?: boolean;
  status: "CALCULATED" | "INSUFFICIENT SOURCE DATA";
  glycemicLoadPerServing: number | null;
  glycemicLoadRangePerServing?: { min: number; max: number } | null;
  omittedAvailableCarbohydratePerServingG?: number;
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; note: string }>;
}

export type PublishedGlycemicLoad = Omit<GlycemicLoadDisplayCandidate, "status" | "glycemicLoadPerServing"> & {
  status: "CALCULATED";
  glycemicLoadPerServing: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  omittedAvailableCarbohydratePerServingG: number;
};

/** Return public GK data only for a complete, calculated recipe total. */
export function publishedGlycemicLoadForRecipe<T extends GlycemicLoadDisplayCandidate>(
  recipeId: string,
  results: T[],
): (T & PublishedGlycemicLoad) | null {
  const result = results.find((entry) => entry.recipeId === recipeId);
  return result?.status === "CALCULATED" && result.glycemicLoadPerServing !== null && result.confidence !== null
    ? result as T & PublishedGlycemicLoad
    : null;
}
