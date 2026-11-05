export type GlycemicLoadFilterCategory = 'low' | 'medium' | 'high';
interface OriginalEstimate {
  status: string;
  confidence: string | null;
  glycemicLoadPerServing: number | null;
  glycemicLoadRangePerServing: {min: number; max: number} | null;
}

/** Listing categories only: never recalculate or substitute a modified GK-only version. */
export function originalGlycemicLoadCategory(result: OriginalEstimate): GlycemicLoadFilterCategory | null {
  const point = result.glycemicLoadPerServing;
  if (result.status !== 'CALCULATED' || result.confidence === null || point === null) return null;
  const min = result.glycemicLoadRangePerServing?.min ?? point;
  const max = result.glycemicLoadRangePerServing?.max ?? point;
  if (![point, min, max].every(value => Number.isFinite(value) && value >= 0)
      || min > max) return null;
  // Rounded points may sit just outside an unrounded scenario range. Both must fit the class.
  const lower = Math.min(point, min), upper = Math.max(point, max);
  return upper <= 10 ? 'low' : lower > 10 && upper < 20 ? 'medium' : lower >= 20 ? 'high' : null;
}
