/** Closed pilot arithmetic. Public integration requires the separate exact owner-approved GK-only version contract. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {calculateGlycemicLoad,type GlycemicIndexRecord} from './glycemic-load-model';

export const PROFILE='GK149_V2_GK_ONLY';
export const ACTIVATION=false;
export const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const textHash=(value:string)=>createHash('sha256').update(value.replaceAll('\r\n','\n')).digest('hex');
export type Level='A'|'B'|'C';
export type Ingredient={name:string;grams:number;compositionId:string;giId:string|null;carbohydrateUse:'AVAILABLE_POINT'|'UPPER_BOUND';note:string};
export type Case={recipeId:string;level:Level;servings:number;paths:Record<string,string>;recipeSha256:Record<string,string>;candidateIngredients:Ingredient[];preparationDecision:string;requiredDecisions:string[];macroAction:string;approval:false;confidence:'LOW';inputSha256:string;classAssessment?:{value:'LOW'|'MEDIUM'|'HIGH';kind:'SOURCE_SUPPORTED_QUALITATIVE';sourceIds:string[];rationale:string}};
export type Composition={id:string;kind:string;path:string;nativeId?:string;nativeField:string;nativeRowSha256?:string;fileSha256?:string;availablePer100g:number;name:string;polyols:string};
export type GI={id:string;kind:string;values:number[];path:string;nativeId:string;nativeRowSha256:string;sourceUrl:string;locator:string;limitation:string;allowedCompositionIds:string[];comparators?:string[]};
export type Result={recipeId:string;level:Level;qualitativeClass:'LOW'|'MEDIUM'|'HIGH'|null;numericProposal:boolean;publicationAuthorized:false;point:number|null;scenarioRange:{min:number;max:number}|null;rangeKind:'NAMED_COMPARATOR_SCENARIOS'|'CONDITIONAL_CODING_MODEL'|null;omittedCho:number;unknownGiCho:number;assumptionSensitivity:{kind:'ASSUMPTION_ONLY';gi:[0,150];min:number;max:number;isBiologicalBound:false;isConfidenceInterval:false}|null;dominantUncertainty:string;blockers:string[];contributions:Array<{name:string;choMin:number;choMax:number;gkMin:number|null;gkMax:number|null;giId:string|null}>};
const folder='docs/nutrition/gk80-operation149/';
const read=(root:string,p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const get=(o:any,key:string)=>key.split('.').reduce((v,k)=>v?.[k],o);
const err=(msg:string):never=>{throw Error('GK149: '+msg);};

/** Validate a native field, not a historical EU_AVAILABLE enum or paired-AFCD P0. */
export function verifyComposition(root:string,c:Composition){
 const dataset=c.path.endsWith('.json')?read(root,c.path):null;
 if(c.kind==='FINELI_CHOAVL'||c.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'){
  const f=dataset.foods.find((x:any)=>x.source_id===c.nativeId);
  const expected=c.kind==='FINELI_CHOAVL'?'per100g.available_carbohydrate_g_per_100g':'available_carbohydrate_without_sugar_alcohols_g_per_100g';
  if(!f||c.nativeField!==expected||digest(f)!==c.nativeRowSha256||get(f,expected)!==c.availablePer100g)err('native carbohydrate mismatch '+c.id);
 }else{
  if(textHash(readFileSync(path.join(root,c.path),'utf8'))!==c.fileSha256)err('composition evidence changed '+c.id);
  if(c.kind==='LABEL_TOTAL_MINUS_DECLARED_POLYOLS'){
   const label=dataset.find((x:any)=>x.id==='foodin-erythritol-200g-label-2026-10-24');
   if(!label?.polyolsSourceVerified||label.per100g.carbohydrate!==100||label.per100g.polyols!==100||c.availablePer100g!==0)err('explicit erythritol label missing');
  }else if(c.kind==='INDEPENDENT_SUGAR_STARCH_SUM'){
   const n=(s:string)=>Number(dataset.nativeValues[s].value.replace(',','.'));
   if(n('Sugars total')+n('Starch total')!==c.availablePer100g)err('independent carbohydrate sum mismatch');
  }else if(c.kind==='PHYSICAL_MASS_CAP'){if(c.availablePer100g!==100)err('physical mass cap must remain100g/100g');}
  else if(c.kind==='LABEL_ROUNDING_CAP'){if(c.id!=='dijon-cap'||c.availablePer100g!==10)err('unverified label rounding cap');}
  else err('unapproved carbohydrate definition '+c.id);
 }
 if(!Number.isFinite(c.availablePer100g)||c.availablePer100g<0||c.availablePer100g>100)err('invalid CHO '+c.id);
}
export function verifyCase(root:string,c:Case){
 const {inputSha256,...body}=c;if(digest(body)!==inputSha256)err('input hash '+c.recipeId);
 if(c.approval!==false||c.macroAction!=='PRESERVE_ALL_CURRENT_VALUES_AND_WITHHOLDINGS'||!c.preparationDecision||!c.requiredDecisions.includes('GK_ONLY_CONTRACT'))err('contract '+c.recipeId);
 for(const [locale,p] of Object.entries(c.paths))if(textHash(readFileSync(path.join(root,p),'utf8'))!==c.recipeSha256[locale])err('recipe changed '+c.recipeId+'/'+locale);
}
export function loadPilot(root:string){
 const pack=read(root,folder+'cases.json');
 if(pack.profile!==PROFILE||pack.activation!==false||pack.ownerApproval!==false||pack.readyAuthorized!==false||pack.mergeAuthorized!==false||pack.deployAuthorized!==false)err('pilot must remain closed');
 const comps=read(root,folder+'composition-sources.json').records as Composition[],gis=read(root,folder+'gi-sources.json').records as GI[];
 if(new Set(comps.map(x=>x.id)).size!==comps.length||new Set(gis.map(x=>x.id)).size!==gis.length)err('duplicate source');
 for(const c of comps)verifyComposition(root,c);
 for(const g of gis){
  const file=read(root,g.path);const rows=Array.isArray(file)?file:file.records;
  const native=rows?.find((x:any)=>x.id===g.nativeId);
  if(!native||digest(native)!==g.nativeRowSha256)err('GI evidence changed '+g.id);
  if(g.kind!=='PROPOSED_B_CODING'){
   if(native.gi!==undefined&&(g.values.length!==1||g.values[0]!==native.gi))err('GI value mismatch');
   if(native.values!==undefined&&digest(native.values)!==digest(g.values))err('GI observation values mismatch');
   if(native.calculationUse==='REFERENCE_ONLY'||native.matchKind==='CATEGORY_MEAN')err('reference-only/family mean GI');
  }
  else if(digest(g.values)!==digest([50])||g.nativeId!=='op142-lowcho50-v2')err('unapproved new coding value');
  if(!g.values.length||g.values.some(v=>!Number.isFinite(v)||v<0)||!g.locator||!g.limitation)err('invalid GI '+g.id);
  if(!['NAMED_HUMAN_GI','EXISTING_PUBLISHED_CODING','PROPOSED_B_CODING'].includes(g.kind))err('unapproved GI kind');
 }
 for(const g of gis)if(g.comparators){const values=g.comparators.map(id=>gis.find(x=>x.id===id)?.values[0]);if(digest(values)!==digest(g.values))err('comparator values changed');}
 const cases=pack.cases as Case[];
 if(new Set(cases.map(c=>c.recipeId)).size!==cases.length||new Set(pack.selectedRecipeIds).size!==70||cases.some(c=>!pack.selectedRecipeIds.includes(c.recipeId)))err('case scope');
 for(const c of cases)verifyCase(root,c);
 return {pack,cases,comps,gis};
}
function giRecord(g:GI):GlycemicIndexRecord{return {id:g.id,gi:g.values[0],foodKey:g.id,preparationKey:g.id,food:g.locator,preparation:g.locator,qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:g.kind==='NAMED_HUMAN_GI'?'HUMAN_GI':'PUBLISHED_IMPUTATION',source:{title:g.locator,url:g.sourceUrl,table:g.locator,year:2026,published:true,iso26642Confirmed:false,qualityEvidence:g.limitation},note:g.limitation};}
export function evaluate(c:Case,comps:Composition[],gis:GI[]):Result{
 const blockers:string[]=[],contributions:Result['contributions']=[];let min=0,max=0,unknown=0,trace=0;let proposedCoding=false,hasCap=false;
 const out:Result={recipeId:c.recipeId,level:c.level,qualitativeClass:null,numericProposal:false,publicationAuthorized:false,point:null,scenarioRange:null,rangeKind:null,omittedCho:0,unknownGiCho:0,assumptionSensitivity:null,dominantUncertainty:c.preparationDecision,blockers,contributions};
 if(!Number.isInteger(c.servings)||c.servings<=0||!c.candidateIngredients.length){blockers.push('INVALID_RECIPE_INPUT');return out;}
 const aRows:any[]=[];const foods:any[]=[];
 for(const i of c.candidateIngredients){
  const f=comps.find(x=>x.id===i.compositionId),g=gis.find(x=>x.id===i.giId);
  if(!f||!Number.isFinite(i.grams)||i.grams<0||!i.note){blockers.push('MISSING_COMPOSITION_OR_MASS: '+i.name);continue;}
  const upper=i.grams*f.availablePer100g/100/c.servings,isCap=i.carbohydrateUse==='UPPER_BOUND';
  const lower=isCap?0:upper;hasCap ||= isCap&&upper>0;
  if(['PHYSICAL_MASS_CAP','LABEL_ROUNDING_CAP'].includes(f.kind)&&!isCap)blockers.push('CAP_IS_NOT_EXACT_AVAILABLE_CHO: '+i.name);
  if(g&&!g.allowedCompositionIds.includes(f.id))blockers.push('UNREVIEWED_GI_BINDING: '+i.name);
  if(g?.id==='low50'&&(f.availablePer100g>5||/flour|meal|sugar|honey|coconut|kookos/i.test(f.name)))blockers.push('LOWCHO_CODING_SCOPE: '+i.name);
  if(g?.id==='plant50'&&(!/kookos|coconut/i.test(f.name)||f.availablePer100g>5||c.level!=='B'))blockers.push('PLANT_CODING_SCOPE');
  if(g?.id==='trace50'){trace+=upper;if(upper>0.5||c.level!=='B')blockers.push('TRACE_CODING_SCOPE: '+i.name);}
  if(g?.kind==='PROPOSED_B_CODING'){proposedCoding=true;if(c.level!=='B')blockers.push('B_CODING_IN_A');}
  if(!g&&upper>0){unknown+=upper;if(c.level==='B')blockers.push('UNRESOLVED_POSITIVE_GI: '+i.name);}
  const lo=g?lower*Math.min(...g.values)/100:null,hi=g?upper*Math.max(...g.values)/100:null;
  if(lo!==null)min+=lo;if(hi!==null)max+=hi;
  contributions.push({name:i.name,choMin:lower,choMax:upper,gkMin:lo,gkMax:hi,giId:i.giId});
  if(isCap){aRows.push({name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,availableCarbohydrateUpperBoundPerServingG:upper,upperBoundEvidence:i.note,negligibleAssumption:i.note,excludedReason:'Documented upper bound only; not zero.'});}
  else {foods.push({id:f.id,name:f.name,sourceUrl:'source-catalog:'+f.id,retrievedAt:'2026-11-02',licence:'See frozen source catalog',state:'See exact candidate',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.availablePer100g}});aRows.push({name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:g?.id??null,foodKey:g?.id,preparationKey:g?.id,massEvidence:i.note,giMatchEvidence:c.preparationDecision});}
 }
 if(trace>1)blockers.push('CUMULATIVE_TRACE_CODING_EXCEEDS_1G');
 out.unknownGiCho=unknown;
 if(c.level==='C'){
  const a=c.classAssessment;
  if(a?.kind==='SOURCE_SUPPORTED_QUALITATIVE'&&a.rationale.trim()&&a.sourceIds.length&&a.sourceIds.every(id=>gis.some(g=>g.id===id&&g.kind==='NAMED_HUMAN_GI'))&&!blockers.length){out.qualitativeClass=a.value;out.dominantUncertainty=a.rationale;}
  else blockers.push('MISSING_SOURCE_SUPPORTED_CLASS_ASSESSMENT');
  return out;
 }
 if(c.level==='A'){
  const result=calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients:aRows},foods,gis.map(giRecord));
  blockers.push(...result.blockers);out.omittedCho=result.omittedAvailableCarbohydratePerServingG;
  if(out.omittedCho>0)out.dominantUncertainty=`GI-less omitted CHO up to ${out.omittedCho.toFixed(3)}g/serving; not GI zero. `+c.preparationDecision;
  if(!blockers.length&&result.status==='CALCULATED'){out.numericProposal=true;out.point=result.glycemicLoadPerServing;}
  // Explicit sensitivity of the known omitted CHO, never a confidence/biological bound.
  if(out.omittedCho>0&&out.point!==null)out.assumptionSensitivity={kind:'ASSUMPTION_ONLY',gi:[0,150],min:result.unroundedGlycemicLoadPerServing!,max:result.unroundedGlycemicLoadPerServing!+1.5*out.omittedCho,isBiologicalBound:false,isConfidenceInterval:false};
 }else if(!blockers.length){
  out.numericProposal=true;out.rangeKind=proposedCoding||hasCap?'CONDITIONAL_CODING_MODEL':'NAMED_COMPARATOR_SCENARIOS';
  if(Math.abs(max-min)>1e-10)out.scenarioRange={min,max};else out.point=Math.round(min*100)/100;
  const coded=contributions.filter(x=>gis.find(g=>g.id===x.giId)?.kind==='PROPOSED_B_CODING');
  if(coded.length){const codedLo=coded.reduce((s,x)=>s+(x.gkMin??0),0),codedHi=coded.reduce((s,x)=>s+(x.gkMax??0),0),cho=coded.reduce((s,x)=>s+x.choMax,0);out.assumptionSensitivity={kind:'ASSUMPTION_ONLY',gi:[0,150],min:min-codedLo,max:max-codedHi+1.5*cho,isBiologicalBound:false,isConfidenceInterval:false};}
 }
 return out;
}
export function summarize(results:Result[],existing=156,total=326){
 if(new Set(results.map(r=>r.recipeId)).size!==results.length)err('duplicate recipe result');
 const count=(l:Level)=>results.filter(r=>r.level===l&&r.numericProposal).length;
 return {existing,numericA:count('A'),numericB:count('B'),classOnly:results.filter(r=>r.level==='C'&&r.qualitativeClass).length,additionalNumeric:count('A')+count('B'),candidateTotal:existing+count('A')+count('B'),total,productionUnchanged:existing,target:30,targetMet:count('A')+count('B')>=30};
}
/** Proposed labels only. Model scenarios always carry their conditional meaning. */
export function formatResult(r:Result,locale:'fi'|'en'|'sv'|'th'='fi'){
 const words={fi:{missing:'GK-tieto puuttuu',estimate:'GK-arvio',scenario:'malliskenaario',low:'matala'},en:{missing:'GL unavailable',estimate:'GL estimate',scenario:'model scenario',low:'low'},sv:{missing:'GL saknas',estimate:'GL-estimat',scenario:'modellscenario',low:'låg'},th:{missing:'ยังไม่มีค่า GL',estimate:'ค่า GL ประมาณ',scenario:'สถานการณ์แบบจำลอง',low:'ต่ำ'}}[locale];
 if(r.level==='C'&&r.qualitativeClass)return {text:`${words.estimate}: ${r.qualitativeClass==='LOW'?words.low:r.qualitativeClass}`,uncertainty:r.dominantUncertainty,level:'C'};
 if(!r.numericProposal)return {text:words.missing,uncertainty:r.blockers.join('; '),level:r.level};
 const number=r.point?.toLocaleString(locale==='th'?'th-TH':locale,{maximumFractionDigits:2});
 const text=r.scenarioRange?`${words.estimate} ${Math.floor(r.scenarioRange.min)}–${Math.ceil(r.scenarioRange.max)} (${words.scenario})`:`${r.level==='A'?(locale==='fi'?'GK':'GL'):words.estimate} ≈ ${number}`;
 return {text,uncertainty:r.dominantUncertainty,level:r.level};
}
