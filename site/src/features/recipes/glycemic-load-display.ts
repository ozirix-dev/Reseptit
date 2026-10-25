export interface GlycemicLoadDisplayCandidate {
  recipeId: string;
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
export function publishedGlycemicLoadForRecipe(
  recipeId: string,
  results: GlycemicLoadDisplayCandidate[],
): PublishedGlycemicLoad | null {
  const result = results.find((entry) => entry.recipeId === recipeId);
  return result?.status === "CALCULATED" && result.glycemicLoadPerServing !== null && result.confidence !== null
    ? result as PublishedGlycemicLoad
    : null;
}
