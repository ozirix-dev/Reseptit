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

/** Home-recipe points and ranges; study servings remain a separate comparison scope. */
export function countPublishedGkEstimates(
 original:Array<{recipeId:string;status:string;glycemicLoadPerServing:number|null;glycemicLoadRangePerServing?:GkRange|null}>,
 variants:Array<{recipeId:string;point:number|null;scenarioRange:GkRange|null;studyServing?:true}>,
) {
 const originalIds=new Set(original.map(r=>r.recipeId));
 if(originalIds.size!==original.length)throw Error('Duplicate original recipe');
 const home=new Map<string,typeof variants[number]>();
 let studyComparisons=0;
 for(const v of variants){
  if(!originalIds.has(v.recipeId))throw Error('Unknown recipe scope');
  if(v.studyServing){studyComparisons++;continue;}
  if(home.has(v.recipeId)||original.find(r=>r.recipeId===v.recipeId)!.status==='CALCULATED')throw Error('Duplicate home numeric scope');
  home.set(v.recipeId,v);
 }
 const counts={exact:0,range:0,missing:0,total:original.length,studyComparisons};
 for(const r of original){
  const v=home.get(r.recipeId);
  const estimate=v?gkEstimate(v.point,v.scenarioRange):r.status==='CALCULATED'?gkEstimate(r.glycemicLoadPerServing,r.glycemicLoadRangePerServing):gkEstimate(null);
  if(estimate.type==='EXACT_MODEL')counts.exact++;
  else if(estimate.type==='ESTIMATED_RANGE')counts.range++;
  else counts.missing++;
 }
 return counts;
}
