export type GkRange = { min: number; max: number };

export type GkEstimate =
  | { type: "EXACT_MODEL"; value: number }
  | { type: "ESTIMATED_RANGE"; range: GkRange }
  | { type: "INSUFFICIENT_DATA" };

export function validGkRange(range: GkRange): boolean {
  return Number.isFinite(range.min) && Number.isFinite(range.max) && range.min >= 0 && range.max >= range.min;
}

export function gkEstimate(point: number | null, range?: GkRange | null): GkEstimate {
  if (range) return validGkRange(range) ? { type: "ESTIMATED_RANGE", range } : { type: "INSUFFICIENT_DATA" };
  return point !== null && Number.isFinite(point) && point >= 0
    ? { type: "EXACT_MODEL", value: point }
    : { type: "INSUFFICIENT_DATA" };
}

export function gkEstimateClass(estimate: GkEstimate) {
  if (estimate.type === "INSUFFICIENT_DATA") return null;
  const classify = (value: number) => value <= 10 ? "LOW" : value < 20 ? "MEDIUM" : "HIGH";
  if (estimate.type === "EXACT_MODEL") return classify(estimate.value);
  const low = classify(estimate.range.min);
  return low === classify(estimate.range.max) ? low : "CROSSES_BOUNDARY";
}
