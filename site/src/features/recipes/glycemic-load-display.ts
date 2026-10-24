export interface GlycemicLoadDisplayCandidate {
  recipeId: string;
  status: "CALCULATED" | "INSUFFICIENT SOURCE DATA";
  glycemicLoadPerServing: number | null;
  sourceReferences: Array<{ title: string; url: string }>;
}

export type PublishedGlycemicLoad = Omit<GlycemicLoadDisplayCandidate, "status" | "glycemicLoadPerServing"> & {
  status: "CALCULATED";
  glycemicLoadPerServing: number;
};

/** Return public GK data only for a complete, calculated recipe total. */
export function publishedGlycemicLoadForRecipe(
  recipeId: string,
  results: GlycemicLoadDisplayCandidate[],
): PublishedGlycemicLoad | null {
  const result = results.find((entry) => entry.recipeId === recipeId);
  return result?.status === "CALCULATED" && result.glycemicLoadPerServing !== null
    ? result as PublishedGlycemicLoad
    : null;
}
