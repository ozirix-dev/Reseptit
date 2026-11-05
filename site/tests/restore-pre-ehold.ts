import {originalContentSourceBefore,restoreBeforeOriginalContent} from './original-content-transition';
const afcdBefore=JSON.parse(readFileSync(new URL('../../docs/nutrition/afcd-field-bindings/before.json',import.meta.url),'utf8'));
import {readFileSync} from 'node:fs';
const baseline=JSON.parse(readFileSync(new URL('../../docs/nutrition/gk80-e-hold-release/main143-baseline.json',import.meta.url),'utf8'));
const preCouscous=JSON.parse(readFileSync(new URL('../../docs/nutrition/gk80-carnitas-couscous/main146-baseline.json',import.meta.url),'utf8'));
const pre146=JSON.parse(readFileSync(new URL('../../docs/nutrition/gk80-operation146/main147-baseline.json',import.meta.url),'utf8'));
export function restoreBeforeAfcdCorrection(report:any){restoreBeforeOriginalContent(report);if(report.calculationEvidenceHashes)Object.assign(report.calculationEvidenceHashes,afcdBefore.previousCalculationEvidence);report.results=report.results.map((r:any)=>afcdBefore.selectedResults.find((b:any)=>b.recipeId===r.recipeId)??r);return report;}
export function restoreBeforeOperation146(report:any){restoreBeforeAfcdCorrection(report);report.results=report.results.map((r:any)=>pre146.selectedResults.find((b:any)=>b.recipeId===r.recipeId)??r);report.summary={...report.summary,calculated:report.results.filter((r:any)=>r.status==='CALCULATED').length,insufficientSourceData:report.results.filter((r:any)=>r.status==='INSUFFICIENT SOURCE DATA').length};return report;}
/** Only for frozen release views. A separate live147 regression protects every other result. */
export function restoreBeforeCouscous(report:any){restoreBeforeOperation146(report);report.results=report.results.map((r:any)=>preCouscous.selectedResults.find((b:any)=>b.recipeId===r.recipeId)??r);report.summary={...report.summary,calculated:report.results.filter((r:any)=>r.status==='CALCULATED').length,insufficientSourceData:report.results.filter((r:any)=>r.status==='INSUFFICIENT SOURCE DATA').length};return report;}
export function restorePreEHold(report:any){restoreBeforeCouscous(report);report.results=report.results.map((r:any)=>baseline.selectedResults.find((b:any)=>b.recipeId===r.recipeId)??r);report.summary={...report.summary,calculated:report.results.filter((r:any)=>r.status==='CALCULATED').length,insufficientSourceData:report.results.filter((r:any)=>r.status==='INSUFFICIENT SOURCE DATA').length};return report;}

/** Frozen-release view only. Live326/87/macros are independently checked in gk-legacy-reconciliation.test.ts. */
export function afcdSourceBeforeCorrection(file:string,text:string):string {
 text=originalContentSourceBefore(file,text);
 if(file==='docs/nutrition/food-records.json'){
  const rows=JSON.parse(text);
  for(const fix of afcdBefore.fixes){const row=rows.find((r:any)=>r.id===fix.id);if(!row)throw Error('Missing AFCD record');row.per100g.carbohydrate=fix.before;}
  return JSON.stringify(rows,null,2)+'\n';
 }
 if(file==='docs/nutrition/glycemic-load-recipe-bindings.json'){
  const bindings=JSON.parse(text);
  Object.assign(bindings.calculationEvidence,afcdBefore.previousCalculationEvidence);
  return JSON.stringify(bindings,null,2)+'\n';
 }
 return text;
}
