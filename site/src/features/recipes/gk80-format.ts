import { classifyPublicGk, type GkEstimate } from "./gk-estimate";

/** Positive modeled estimates below one must never round to a displayed zero. */
export function formatGlycemicLoadNumber(value:number,locale:string,modeled:boolean):string{
 if(modeled&&value>0&&value<1)return '<1';
 return new Intl.NumberFormat(locale,modeled?{maximumFractionDigits:0}:{maximumSignificantDigits:1,minimumSignificantDigits:1}).format(value);
}


export function formatOriginalPortionGk(estimate: GkEstimate, locale: string, modeled: boolean) {
  const values = estimate.type === "ESTIMATED_RANGE" ? [estimate.range.min, estimate.range.max]
    : estimate.type === "EXACT_MODEL" ? [estimate.value] : [];
  return {
    value: values.map(value => formatGlycemicLoadNumber(value, locale, modeled)).join("–"),
    roundingHitsBoundary: values.some(value => {
      const rounded = modeled ? Math.round(value) : Number(value.toPrecision(1));
      return classifyPublicGk(rounded) !== classifyPublicGk(value);
    }),
  };
}
