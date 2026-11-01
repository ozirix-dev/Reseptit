/** Positive modeled estimates below one must never round to a displayed zero. */
export function formatGlycemicLoadNumber(value:number,locale:string,modeled:boolean):string{
 if(modeled&&value>0&&value<1)return '<1';
 return new Intl.NumberFormat(locale,modeled?{maximumFractionDigits:0}:{maximumSignificantDigits:1,minimumSignificantDigits:1}).format(value);
}
