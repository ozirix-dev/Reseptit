/** Closed B pilot: measured prepared-food GI stays attached to a prepared unit. */
import {readFileSync} from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {digest,evaluate,verifyCase,type Case,type Composition,type GI,type Ingredient} from './gk149-model';
import {loadRecovery,verifyRecoveryComposition} from './gk149-recovery';
const folder='docs/nutrition/gk80-operation149/';
type PreparedSource={id:string;kind:'HUMAN_GI_PREPARED_FOOD';gi:number;foodClass:string;allowedUnitScopes:string[];allowedRecipeIds:string[];reference:string;referenceCarbohydrateG:number;testFoodMassG:number|null;locator:string;sourcePreparation:string;limits:string;analogyErrorQuantified:false};
type DoseIngredient=Ingredient & {carbohydrateScenarioCompositionIds?:string[];massBasis?:string;accountingKey?:string};
type Node={id:string;ingredientIndexes:number[];sourceId:string|null;foodClass:string;unitScope:'PREPARED_RECIPE'|'PREPARED_COMPONENT'|'INGREDIENT_REFERENCE';matchingRationale:string;documentedDifferences:string[]};
export type PreparedCase=Omit<Case,'candidateIngredients'> & {applicationMode:'INGREDIENT_SUM'|'PREPARED_UNITS';candidateIngredients:DoseIngredient[];preparedNodes:Node[];sourceBindingSha256:Record<string,string>;riceMassDecision?:{isYieldConversion:boolean;targetCookedGrams:number;sourceTestPortionIsNotRecipeServing:boolean}};
export type PreparedContext={comps:Composition[];gis:GI[];preparedSources:PreparedSource[]};
const read=(root:string,p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
export function verifyPreparedComposition(root:string,c:Composition){
 if(c.kind!=='IFCT_ANALYTICAL_AVAILABLE_CHO'){verifyRecoveryComposition(root,c);return;}
 const r=read(root,c.path).ifctRecords.find((r:any)=>r.foodCode===c.nativeId);
 if(c.path!==folder+'prepared-route-observations.json'||c.id!=='IFCT-G010'||c.nativeField!=='Table6.TotalAvailableCHO'||c.availablePer100g!==3.66||!r||digest(r)!==c.nativeRowSha256||r.nativeTable!==6||r.nativeColumn!=='Total Available CHO'||r.availablePer100g!==c.availablePer100g||r.byDifferenceTable1Value!==4.51)throw Error('IFCT requires independent Table6 analytical availableCHO; by-difference/P0/rounded-component substitution rejected');
}
export function verifyPreparedBindings(c:PreparedCase,ctx:PreparedContext){
 const refs:Record<string,string>={};
 for(const i of c.candidateIngredients){for(const id of [i.compositionId,...(i.carbohydrateScenarioCompositionIds??[])])refs['comp:'+id]=digest(ctx.comps.find(f=>f.id===id));if(i.giId)refs['gi:'+i.giId]=digest(ctx.gis.find(g=>g.id===i.giId));}
 for(const n of c.preparedNodes){if(!n.sourceId)continue;const s=ctx.preparedSources.find(s=>s.id===n.sourceId);refs[(s?'prepared:':'gi:')+n.sourceId]=digest(s??ctx.gis.find(g=>g.id===n.sourceId));}
 const sorted=Object.fromEntries(Object.entries(refs).sort(([a],[b])=>a.localeCompare(b,'en')));
 if(!c.sourceBindingSha256||digest(sorted)!==digest(c.sourceBindingSha256))throw Error('Prepared input/source binding changed');
}
export function evaluatePrepared(c:PreparedCase,ctx:PreparedContext){
 const blockers:string[]=[],units:any[]=[];let lo=0,hi=0,traceCho=0,codedLo=0,codedHi=0,codedCho=0;
 if(c.applicationMode==='INGREDIENT_SUM')return {...evaluate(c,ctx.comps,ctx.gis),applicationMode:c.applicationMode,units};
 const out=()=>({recipeId:c.recipeId,level:c.level,applicationMode:c.applicationMode,numericProposal:blockers.length===0,publicationAuthorized:false,confidence:'LOW',point:blockers.length||Math.abs(hi-lo)>1e-10?null:Math.round(lo*100)/100,scenarioRange:!blockers.length&&Math.abs(hi-lo)>1e-10?{min:lo,max:hi}:null,rangeScope:'NAMED_COMPOSITION_AND_CHO_CAP_SCENARIOS_AT_REFERENCE_GI',isBiologicalBound:false,isConfidenceInterval:false,analogyErrorQuantified:false,omittedCho:0,assumptionSensitivity:codedCho>0?{kind:'ASSUMPTION_ONLY',gi:[0,150],min:lo-codedLo,max:hi-codedHi+1.5*codedCho,isBiologicalBound:false,isConfidenceInterval:false}:null,units,blockers});
 if(c.level!=='B'||!Number.isInteger(c.servings)||c.servings<1||!c.candidateIngredients.length||!c.preparedNodes.length){blockers.push('PREPARED_ROUTE_REQUIRES_B_COMPLETE_DOSE');return out();}
 if('globalMealFactor' in c||'globalCorrectionFactor' in c)blockers.push('GLOBAL_MEAL_CORRECTION_NOT_ALLOWED');
 const keys=c.candidateIngredients.map(i=>i.accountingKey).filter(Boolean);if(new Set(keys).size!==keys.length)blockers.push('DUPLICATE_CARBOHYDRATE_BATCH');
 if(c.recipeId==='hyderabadi-kanabiryani'){
  const rice=c.candidateIngredients.filter(i=>[i.compositionId,...(i.carbohydrateScenarioCompositionIds??[])].some(id=>/RIISI|Rice,/.test(ctx.comps.find(f=>f.id===id)?.name??'')));
  if(rice.length!==1||rice[0].accountingKey!=='RICE_MAIN_BATCH'||rice[0].grams!==900||rice[0].massBasis!=='COOKED_EDIBLE_WEIGHED'||[rice[0].compositionId,...(rice[0].carbohydrateScenarioCompositionIds??[])].some(id=>!['30346','F007661'].includes(id))||c.riceMassDecision?.isYieldConversion!==false||c.riceMassDecision?.sourceTestPortionIsNotRecipeServing!==true)blockers.push('RICE_COOKED_DOSE_NOT_YIELD_OR_DRY_DOUBLE_COUNT');
 }
 const rows=c.candidateIngredients.map((i,index)=>{
  const fs=[i.compositionId,...(i.carbohydrateScenarioCompositionIds??[])].map(id=>ctx.comps.find(f=>f.id===id));
  if(fs.some(f=>!f)||!Number.isFinite(i.grams)||i.grams<0||!i.note){blockers.push('UNVERIFIED_COMPOSITION_OR_MASS:'+index);return {min:0,max:0};}
  const values=fs.map(f=>f!.availablePer100g);const cap=i.carbohydrateUse==='UPPER_BOUND';
  if(fs.some(f=>['PHYSICAL_MASS_CAP','LABEL_ROUNDING_CAP','MANUFACTURER_TOTAL_CHO_CEILING'].includes(f!.kind))&&!cap)blockers.push('CAP_IS_NOT_POINT:'+index);
  return {min:cap?0:i.grams*Math.min(...values)/100/c.servings,max:i.grams*Math.max(...values)/100/c.servings};
 });
 const covered=new Set<number>();
 for(const n of c.preparedNodes){
  if(!n.ingredientIndexes.length||!n.matchingRationale){blockers.push('MISSING_UNIT_SCOPE_OR_RATIONALE');continue;}
  let a=0,b=0;
  for(const ix of n.ingredientIndexes){if(!Number.isInteger(ix)||ix<0||ix>=rows.length||covered.has(ix)){blockers.push('DUPLICATE_OR_INVALID_DOSE_INDEX');continue;}covered.add(ix);a+=rows[ix].min;b+=rows[ix].max;}
  const s=ctx.preparedSources.find(s=>s.id===n.sourceId),g=ctx.gis.find(g=>g.id===n.sourceId);let gi:number|null=null;
  if(s){
   if(s.kind!=='HUMAN_GI_PREPARED_FOOD'||s.reference!=='GLUCOSE_100'||!s.allowedRecipeIds.includes(c.recipeId)||s.foodClass!==n.foodClass||!s.allowedUnitScopes.includes(n.unitScope)||!n.documentedDifferences.length||!s.sourcePreparation||!s.limits)blockers.push('PREPARED_SOURCE_SCOPE_MISMATCH:'+n.id);
   if(n.unitScope==='PREPARED_RECIPE'&&(n.ingredientIndexes.length!==rows.length||new Set(n.ingredientIndexes).size!==rows.length))blockers.push('WHOLE_MEAL_SOURCE_REQUIRES_WHOLE_DOSE');
   gi=s.gi;
  }else if(g){
   if(n.unitScope!=='INGREDIENT_REFERENCE')blockers.push('INGREDIENT_GI_CANNOT_POSE_AS_PREPARED_MEAL');
   if(g.values.length!==1)blockers.push('UNDECLARED_GI_SCENARIO');gi=g.values[0];
   for(const ix of n.ingredientIndexes){const i=c.candidateIngredients[ix],f=ctx.comps.find(f=>f.id===i?.compositionId);if(!i||!f||!g.allowedCompositionIds.includes(f.id)){blockers.push('UNREVIEWED_INGREDIENT_BINDING');continue;}
    if(g.id==='low50'&&(f!.availablePer100g>5||/flour|meal|sugar|honey|coconut|kookos/i.test(f!.name)))blockers.push('LOWCHO_SCOPE');
    if(g.id==='plant50'&&(!/kookos|coconut/i.test(f!.name)||f!.availablePer100g>5))blockers.push('PLANT_SCOPE');
    if(g.id==='trace50'){traceCho+=rows[ix]?.max??0;if((rows[ix]?.max??0)>0.5)blockers.push('TRACE_SCOPE');}
   }
  }else if(n.sourceId!==null||n.unitScope!=='INGREDIENT_REFERENCE'||b>0)blockers.push('POSITIVE_CHO_WITHOUT_REFERENCE');
  if(gi!==null&&(!Number.isFinite(gi)||gi<0))blockers.push('INVALID_REFERENCE_GI');
  const x=gi===null?0:a*gi/100,y=gi===null?0:b*gi/100;lo+=x;hi+=y;
  if(g?.kind==='PROPOSED_B_CODING'){codedLo+=x;codedHi+=y;codedCho+=b;}
  units.push({id:n.id,sourceId:n.sourceId,unitScope:n.unitScope,ingredientIndexes:n.ingredientIndexes,availableChoPerServing:{min:a,max:b},referenceGi:gi,gkPerServing:{min:x,max:y},sourceTestPortionUsedAsDose:false});
 }
 if(covered.size!==rows.length)blockers.push('INCOMPLETE_RECIPE_DOSE');if(traceCho>1)blockers.push('TRACE_TOTAL_EXCEEDS_1G');return out();
}
export function loadPreparedRoute(root:string){
 const base=loadRecovery(root),pack=read(root,folder+'prepared-route-cases.json'),obs=read(root,folder+'prepared-route-observations.json');
 if(['activation','ownerApproval','readyAuthorized','mergeAuthorized','deployAuthorized'].some(k=>pack[k]!==false))throw Error('Prepared route must remain closed and unapproved');
 const extra=read(root,folder+'prepared-route-composition.json').records as Composition[],bindings=read(root,folder+'prepared-route-gi.json').records as GI[];
 for(const f of extra)verifyPreparedComposition(root,f);
 for(const g of bindings){
  const file=read(root,g.path),native=(Array.isArray(file)?file:file.records??file.fruitSources)?.find((r:any)=>r.id===g.nativeId);
  if(!native||digest(native)!==g.nativeRowSha256)throw Error('Prepared-route ingredient GI source changed');
  const original=base.gis.find(b=>b.id===g.id);
  if(original){const {allowedCompositionIds:_a,bindingStatus:_b,...s}=g as GI&{bindingStatus?:string};const {allowedCompositionIds:_c,bindingStatus:_d,...o}=original as GI&{bindingStatus?:string};if(digest(s)!==digest(o)||original.allowedCompositionIds.some(id=>!g.allowedCompositionIds.includes(id)))throw Error('Prepared route cannot rewrite frozen source/coding');}
  else if(g.kind!=='NAMED_HUMAN_GI'||g.values.length!==1||g.values[0]!==native.gi)throw Error('Named ingredient GI required');
 }
 const comps=[...base.comps,...extra],gis=base.gis.filter(g=>!bindings.some(b=>b.id===g.id)).concat(bindings),preparedSources=obs.preparedSources as PreparedSource[];
 if(new Set(comps.map(f=>f.id)).size!==comps.length||new Set(gis.map(g=>g.id)).size!==gis.length||new Set(preparedSources.map(s=>s.id)).size!==preparedSources.length)throw Error('Duplicate prepared-route source');
 const cases=pack.cases as PreparedCase[];if(cases.length!==8||new Set(cases.map(c=>c.recipeId)).size!==8||cases.some(c=>base.cases.some(b=>b.recipeId===c.recipeId)))throw Error('Prepared-route8 exact new versions required');
 const ctx={comps,gis,preparedSources};for(const c of cases){verifyCase(root,c);verifyPreparedBindings(c,ctx);}
 return {...ctx,cases,results:cases.map(c=>evaluatePrepared(c,ctx))};
}
export function formatPreparedProposal(r:{numericProposal:boolean;point:number|null;scenarioRange:{min:number;max:number}|null},locale:'fi'|'en'|'sv'|'th'='fi'){
 const t={fi:{label:'GK-arvio',none:'GK-tieto puuttuu',note:'Koostumus- ja CHO-kattoskenaariot; lähderuoan vastaavuusvirhe ei sisälly väliin.'},en:{label:'GL estimate',none:'GL unavailable',note:'Composition and CHO-cap scenarios; food-analogy error is outside this range.'},sv:{label:'GL-uppskattning',none:'GL saknas',note:'Sammansättnings- och kolhydrattaksscenarier; livsmedelsanalogins fel ingår inte i intervallet.'},th:{label:'ค่า GL ประมาณ',none:'ยังไม่มีค่า GL',note:'ช่วงนี้แสดงสถานการณ์องค์ประกอบและเพดานคาร์โบไฮเดรต ไม่รวมความคลาดเคลื่อนของอาหารเทียบเคียง'}}[locale];
 const n=new Intl.NumberFormat(locale,{maximumFractionDigits:r.point!==null&&r.point<1?2:1});
 return !r.numericProposal?{text:t.none,note:''}:r.scenarioRange?{text:`${t.label} ${Math.floor(r.scenarioRange.min)}–${Math.ceil(r.scenarioRange.max)}`,note:t.note}:{text:`${t.label} ≈ ${n.format(r.point!==null&&r.point>=10?Math.round(r.point):r.point!)}`,note:''};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../../',import.meta.url)),{results}=loadPreparedRoute(root);
 console.log(JSON.stringify({publicActivation:false,ownerApproval:false,newNumericProposals:results.filter(r=>r.numericProposal).length,results},null,2));if(results.some(r=>!r.numericProposal))process.exitCode=1;
}
