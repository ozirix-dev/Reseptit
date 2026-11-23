import { classifyPublicGk, type GkEstimate } from "./gk-estimate";

/** Positive modeled estimates below one must never round to a displayed zero. */
export function formatGlycemicLoadNumber(value:number,locale:string,modeled:boolean):string{
 if(modeled&&value>0&&value<1)return '<1';
 return new Intl.NumberFormat(locale,modeled?{maximumFractionDigits:0}:{maximumSignificantDigits:1,minimumSignificantDigits:1}).format(value);
}


export function formatOriginalPortionGk(estimate: GkEstimate, locale: string, modeled: boolean, rangeOnly = false) {
  const values = estimate.type === "ESTIMATED_RANGE" ? [estimate.range.min, estimate.range.max]
    : estimate.type === "EXACT_MODEL" ? [estimate.value] : [];
  if (rangeOnly && estimate.type === "ESTIMATED_RANGE") {
    const { min, max } = estimate.range;
    // Use the same Intl rounding for display and classification. Use Latin
    // digits and no grouping only when converting the rounded number back.
    const numericFormatter = (digits: number) => new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: digits, useGrouping: false, numberingSystem: "latn",
    });
    let digits = 3;
    let numeric = numericFormatter(digits);
    while (min !== max && numeric.format(min) === numeric.format(max) && digits < 17) {
      numeric = numericFormatter(++digits);
    }
    const display = new Intl.NumberFormat(locale, { maximumSignificantDigits: digits });
    return {
      value: values.map(value => display.format(value)).join("–"),
      roundingHitsBoundary: values.some(value => classifyPublicGk(Number(numeric.format(value))) !== classifyPublicGk(value)),
    };
  }
  return {
    value: values.map(value => formatGlycemicLoadNumber(value, locale, modeled)).join("–"),
    roundingHitsBoundary: values.some(value => {
      const rounded = modeled ? Math.round(value) : Number(value.toPrecision(1));
      return classifyPublicGk(rounded) !== classifyPublicGk(value);
    }),
  };
}
