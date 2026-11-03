import {recipeTextForApprovedSnapshot} from "./approved-recipe-note-edits";
/** Small adapter over the reviewed GK149 arithmetic; no publication path. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {canonical,fingerprint} from './gk80-candidate-model';
import {loadPilot,evaluate,textHash} from './gk149-model';
import {MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G as SINGLE,
 CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G as COMBINED} from './glycemic-load-model';
import type {ScenarioResultV1,ScenarioTerm} from '../src/features/recipes/gk-scenario-types';

export const SCENARIO_SCHEMA='GK_SCENARIOS_01_V1';
export const SCENARIO_FOLDER='docs/nutrition/gk-scenarios-01/';
type Sealed={evidenceHash:string};
export type EvidenceSource=Sealed&{id:string;title:string;url:string;locator:string;licence:string;
 rawSha256:string|null;access?:string;observation:Record<string,unknown>;[key:string]:unknown};
export type ResponseSource=Sealed&{id:string;sourceId:string;sourceHash:string;species:string;gi:string;
 scale:'GLUCOSE_100';massBasis:'FULL_REPORTED_POLYOL_MASS';use:'CONDITIONAL_RESEARCH_ONLY';
 form:'ISOLATED_POLYOL';uncertainty:{kind:string;value:string;nStudies:number};applicability:string};
export type Product=Sealed&{id:string;manufacturer:string;name:string;kind:'NAMED_PRODUCT'|'REFERENCE_COMPOSITE';
 sourceId:string;sourceHash:string;basis:'per100g';carbohydrateDefinition:'EU_LABEL_INCLUDING_POLYOLS'|'AFCD_WITHOUT_SUGAR_ALCOHOLS';
 raw:{labelCarbohydrate:string|null;withoutSugarAlcohols:string|null;withSugarAlcohols:string|null;polyols:string|null};
 species:Record<string,string|null>;speciesSemantics:'SOLE_LISTED_POLYOL_ALLOCATION'|'REPORTED_PARTIAL_SPECIES';
 aggregateComplete:boolean;sweeteners:string[];note:string;preparationMatch:string;ordinaryGiId:null;
 responseBindings:Record<string,string>};
export type PilotPack={schemaVersion:typeof SCENARIO_SCHEMA;methodVersion:'COMPONENT_RESEARCH_V1';
 baselineMain:string;owner:string;recipeId:string;recipeVersion:string;approvedInputHash:string;baseContextHash:string;servings:number;
 chocolateGrams:string;separateErythritolGrams:string;separateErythritolResponseId:string;separateErythritolCompositionId:string;
 publicationAuthorized:false;wholeRecipeEvidenceAvailable:false;preserveFilesLfSha256:Record<string,string>;
 sources:EvidenceSource[];responses:ResponseSource[];products:Product[];inputHash:string};
export type BaseContext={recipeId:string;recipeVersion:string;servings:number;terms:ScenarioTerm[];
 chocolateGrams:number;separateErythritolGrams:number;original:ScenarioResultV1['original'];
 sources:ScenarioResultV1['sources'];preparation:string};

const fail=(message:string):never=>{throw Error('GK_SCENARIO: '+message);};
export function quantity(v:unknown):number {
 if(typeof v!=='string'||!/^\d+(?:\.\d+)?$/.test(v))return fail('UNKNOWN_OR_INVALID_QUANTITY');
 const n=Number(v);if(!Number.isFinite(n)||n<0)return fail('INVALID_QUANTITY');return n;
}
function verifySeal(v:Sealed){const {evidenceHash,...body}=v;if(fingerprint(body)!==evidenceHash)fail('STALE_EVIDENCE');}
function unique<T extends {id:string}>(values:T[]){if(new Set(values.map(v=>v.id)).size!==values.length)fail('DUPLICATE_ID');}
export function omissionsWithinPolicy(grams:number[]){
 return grams.every(g=>Number.isFinite(g)&&g>=0&&g<SINGLE)&&grams.reduce((a,b)=>a+b,0)<COMBINED;
}
function sourceFor(pack:PilotPack,id:string,hash:string){
 const s=pack.sources.find(s=>s.id===id);if(!s||s.evidenceHash!==hash)fail('SOURCE_BINDING');
 verifySeal(s!);if(!s!.url.startsWith('https://')||!s!.locator||!s!.licence)fail('SOURCE_METADATA');return s!;
}
export function verifyPack(pack:PilotPack){
 const {inputHash,...body}=pack;
 if(fingerprint(body)!==inputHash)fail('STALE_INPUT');
 if(pack.schemaVersion!==SCENARIO_SCHEMA||pack.methodVersion!=='COMPONENT_RESEARCH_V1'||pack.publicationAuthorized!==false||pack.wholeRecipeEvidenceAvailable!==false)fail('CLOSED_RESEARCH_CONTRACT');
 if(!Number.isInteger(pack.servings)||pack.servings<=0)fail('INVALID_SERVINGS');
 quantity(pack.chocolateGrams);quantity(pack.separateErythritolGrams);
 unique(pack.sources);unique(pack.responses);unique(pack.products);
 for(const s of pack.sources)verifySeal(s);
 for(const r of pack.responses){
  verifySeal(r);const s=sourceFor(pack,r.sourceId,r.sourceHash);
  const observed=s.observation[r.species] as {gi?:unknown}|undefined;
  if(r.scale!=='GLUCOSE_100'||r.massBasis!=='FULL_REPORTED_POLYOL_MASS'||r.use!=='CONDITIONAL_RESEARCH_ONLY'
   ||r.form!=='ISOLATED_POLYOL'||!r.applicability||!observed||observed.gi!==r.gi)fail('RESPONSE_SOURCE_BINDING');
  quantity(r.gi); // Includes a reported zero; never generated from absence.
 }
}

/** Raw observations are alternatives, never additive with/without/total fields. */
export function normalizeProduct(pack:PilotPack,p:Product){
 verifySeal(p);const s=sourceFor(pack,p.sourceId,p.sourceHash),o=s.observation;
 if([p.id,p.manufacturer,p.name,p.note,p.preparationMatch].some(v=>typeof v!=='string'||!v.trim())
  ||!['NAMED_PRODUCT','REFERENCE_COMPOSITE'].includes(p.kind)||!Array.isArray(p.sweeteners)||!p.sweeteners.length
  ||p.basis!=='per100g'||p.ordinaryGiId!==null)fail('UNSUPPORTED_OR_INCOMPLETE_PRODUCT');
 for(const v of Object.values(p.raw))if(v!==null&&quantity(v)>100)fail('INVALID_PER100G');
 for(const v of Object.values(p.species))if(v!==null&&quantity(v)>100)fail('INVALID_SPECIES');
 let ordinary:number;
 if(p.carbohydrateDefinition==='EU_LABEL_INCLUDING_POLYOLS'){
  if(p.kind!=='NAMED_PRODUCT'||o.definition!=='EU_LABEL_CARBOHYDRATE_INCLUDES_POLYOLS_EXCLUDES_FIBRE')fail('PRODUCT_DEFINITION_BINDING');
  if(p.raw.withoutSugarAlcohols!==null||p.raw.withSugarAlcohols!==null)fail('DOUBLE_CARBOHYDRATE_BASIS');
  if(p.raw.labelCarbohydrate!==o.carbohydrate||p.raw.polyols!==o.polyols)fail('COMPOSITION_SOURCE_BINDING');
  ordinary=quantity(p.raw.labelCarbohydrate)-quantity(p.raw.polyols);
  if(ordinary<0)fail('POLYOLS_EXCEED_LABEL_CARBOHYDRATE');
  const reported=Object.entries(p.species);
  const listed=(o.polyolIngredients as string[]).filter(x=>['maltitol','xylitol','erythritol','sorbitol','mannitol','glycerol','isomalt','lactitol'].includes(x));
  if(!p.aggregateComplete||p.speciesSemantics!=='SOLE_LISTED_POLYOL_ALLOCATION'||listed.length!==1
   ||reported.length!==1||reported[0][0]!==listed[0]||reported[0][1]!==p.raw.polyols)fail('UNVERIFIED_POLYOL_ALLOCATION');
 }else if(p.carbohydrateDefinition==='AFCD_WITHOUT_SUGAR_ALCOHOLS'){
  if(p.kind!=='REFERENCE_COMPOSITE'||o.pairDifferenceMeaning!=='DERIVED_PAIRED_CARBOHYDRATE_DIFFERENCE_NOT_TOTAL_POLYOLS')fail('REFERENCE_IS_NOT_NAMED_PRODUCT');
  if(p.raw.labelCarbohydrate!==null||p.raw.polyols!==null||p.aggregateComplete!==false||p.speciesSemantics!=='REPORTED_PARTIAL_SPECIES')fail('AFCD_PAIR_IS_NOT_TOTAL_POLYOLS');
  if(p.raw.withoutSugarAlcohols!==o.without||p.raw.withSugarAlcohols!==o.with||canonical(p.species)!==canonical(o.species))fail('AFCD_SOURCE_BINDING');
  ordinary=quantity(p.raw.withoutSugarAlcohols);
  if(quantity(p.raw.withSugarAlcohols)<ordinary)fail('CONFLICTING_AFCD_PAIR');
  // Do not subtract anything from without, nor add the paired field to species.
 }else return fail('UNSUPPORTED_CARBOHYDRATE_DEFINITION');
 return {ordinaryPer100g:ordinary,source:s};
}

export function loadScenarioPilot(root:string):{pack:PilotPack;base:BaseContext}{
 const pack=JSON.parse(readFileSync(path.join(root,SCENARIO_FOLDER+'pilot.json'),'utf8')) as PilotPack;
 verifyPack(pack);
 for(const [file,hash] of Object.entries(pack.preserveFilesLfSha256)){
  if(path.isAbsolute(file)||file.split(/[\\/]/).includes('..'))fail('INVALID_BASELINE_PATH');
  if(textHash(recipeTextForApprovedSnapshot(file,readFileSync(path.join(root,file),'utf8').replaceAll('\r\n','\n')))!==hash)fail('BASELINE_CHANGED: '+file);
 }
 // Verification only for the source pack; evaluate exactly one recipe, never 326 recipes.
 const {cases,comps,gis}=loadPilot(root),c=cases.find(c=>c.recipeId===pack.recipeId);
 if(!c||c.inputSha256!==pack.approvedInputHash||c.servings!==pack.servings)fail('BASE_VERSION_BINDING');
 const chosen=c!,r=evaluate(chosen,comps,gis);
 const gold=JSON.parse(readFileSync(path.join(root,'docs/nutrition/gk80-operation149/golden.json'),'utf8')).results.find((v:{recipeId:string})=>v.recipeId===chosen.recipeId);
 if(!r.numericProposal||r.point!==gold.point||r.omittedCho!==gold.omittedCho)fail('APPROVED_RESULT_CHANGED');
 const chocolate=chosen.candidateIngredients.filter(i=>i.compositionId==='F009837');
 const separate=chosen.candidateIngredients.filter(i=>i.compositionId===pack.separateErythritolCompositionId);
 if(chocolate.length!==1||separate.length!==1||chocolate[0].grams!==quantity(pack.chocolateGrams)||separate[0].grams!==quantity(pack.separateErythritolGrams))fail('REPLACEMENT_SCOPE');
 const baseTerms=r.contributions.flatMap((term,index)=>{
  const ingredient=chosen.candidateIngredients[index];
  if(ingredient===chocolate[0]||ingredient===separate[0])return [];
  if(term.choMin!==term.choMax)fail('BASE_BOUND_NOT_POINT');
  return [{id:'base-'+index,name:ingredient.name,massG:ingredient.name==='suola'?null:ingredient.grams,
   gPerServing:term.choMin,species:null,coefficient:ingredient.giId?gis.find(g=>g.id===ingredient.giId)!.values[0]:null,
   gkPerServing:term.choMin===0?0:term.gkMin,evidence:term.choMin===0||term.gkMin!==null?'EXISTING_GK_ONLY' as const:'UNRESOLVED' as const,
   sourceIds:[ingredient.compositionId,...(ingredient.giId?[ingredient.giId]:[])],reason:term.gkMin===null&&term.choMax>0?'MISSING_GI_RETAINED_OMISSION':'EXISTING_REVIEWED_ARITHMETIC'}];
 });
 const usedComps=[...new Set(chosen.candidateIngredients.filter(i=>i.compositionId!=='F009837').map(i=>i.compositionId))].map(id=>comps.find(x=>x.id===id)!);
 const usedGis=[...new Set(chosen.candidateIngredients.flatMap(i=>i.giId?[i.giId]:[]))].map(id=>gis.find(x=>x.id===id)!);
 const sources=[...usedComps.map(c=>({id:c.id,title:c.name,url:String((c as unknown as {url:string}).url??'https://github.com/ozirix-dev/Reseptit/pull/183'),locator:c.nativeField,note:c.polyols})),
  ...usedGis.map(g=>({id:g.id,title:g.locator,url:g.sourceUrl,locator:g.locator,note:g.limitation}))];
 const base:BaseContext={recipeId:pack.recipeId,recipeVersion:pack.recipeVersion,servings:chosen.servings,terms:baseTerms,
  chocolateGrams:chocolate[0].grams,separateErythritolGrams:separate[0].grams,
  original:{inputHash:chosen.inputSha256,point:r.point!,omittedCho:r.omittedCho},sources,preparation:chosen.preparationDecision};
 if(fingerprint(base)!==pack.baseContextHash)fail('BASE_CONTEXT_CHANGED');
 // Cross-check the selected AFCD observations against the existing native row.
 const native=JSON.parse(readFileSync(path.join(root,'docs/nutrition/afcd-release-3-reference.json'),'utf8')).foods.find((v:{source_id:string})=>v.source_id==='F009837');
 const p=pack.products.find(p=>p.id==='afcd-f009837');if(!p)fail('MISSING_REFERENCE');
 if(quantity(p!.raw.withoutSugarAlcohols)!==native.available_carbohydrate_without_sugar_alcohols_g_per_100g||quantity(p!.raw.withSugarAlcohols)!==native.available_carbohydrate_with_sugar_alcohols_g_per_100g)fail('AFCD_NATIVE_ROW_CHANGED');
 for(const [species,value] of Object.entries(p!.species))if((value===null?null:quantity(value))!==native[species+'_g_per_100g'])fail('AFCD_NATIVE_SPECIES_CHANGED');
 return {pack,base};
}

/** Invalid evidence returns HOLD with no numerical fallback. No source-specific total is invented. */
export function assessProduct(pack:PilotPack,p:Product,base:BaseContext):ScenarioResultV1{
 const out:ScenarioResultV1={schemaVersion:SCENARIO_SCHEMA,methodVersion:pack.methodVersion,recipeId:pack.recipeId,recipeVersion:pack.recipeVersion,
  scenarioId:p.id,productName:p.name,manufacturer:p.manufacturer,productKind:p.kind,inputHash:pack.inputHash,productHash:p.evidenceHash,sourceHashes:{},
  confidence:'LOW',publicationAuthorized:false,macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',servings:pack.servings,
  chocolateGrams:base.chocolateGrams,separateErythritolGrams:base.separateErythritolGrams,sweeteners:p.sweeteners,
  status:'HOLD',wholeRecipe:{kind:'UNAVAILABLE',reasons:[]},conditional:{kind:'UNAVAILABLE',reasons:[]},calculatedPortion:null,terms:[],
  coverage:{calculatedOrdinaryChoG:null,unresolvedOrdinaryChoG:null,conditionalPolyolsG:null,unresolvedPolyolsG:null,aggregatePolyolsComplete:false,omittedOrdinaryChoG:null,omissionPolicySatisfied:false,unknownOtherIngredientPolyols:true},
  classRobustness:'NOT_DETERMINABLE',blockers:[],notes:[],sources:[],original:{...base.original}};
 try{
  verifyPack(pack);
  const sealedProduct=pack.products.find(x=>x.id===p.id);if(!sealedProduct||canonical(sealedProduct)!==canonical(p))fail('PRODUCT_NOT_IN_INPUT');
  if(fingerprint(base)!==pack.baseContextHash||base.recipeId!==pack.recipeId||base.recipeVersion!==pack.recipeVersion||base.original.inputHash!==pack.approvedInputHash||base.servings!==pack.servings
   ||base.chocolateGrams!==quantity(pack.chocolateGrams)||base.separateErythritolGrams!==quantity(pack.separateErythritolGrams))fail('BASE_CONTEXT_MISMATCH');
  const normalized=normalizeProduct(pack,p),factor=quantity(pack.chocolateGrams)/100/pack.servings;
  out.terms=structuredClone(base.terms);
  out.terms.push({id:'chocolate-ordinary',name:p.name,massG:base.chocolateGrams,gPerServing:normalized.ordinaryPer100g*factor,
   species:null,coefficient:null,gkPerServing:null,evidence:'UNRESOLVED',sourceIds:[p.sourceId],reason:'CHOCOLATE_NON_POLYOL_GI_NOT_MATCHED'});
  const sources=new Set([p.sourceId]);let unresolvedPolyols=0,conditionalPolyols=0;
  function polyolTerm(id:string,name:string,species:string,grams:number,responseId:string|undefined,compositionSource:string){
   const response=pack.responses.find(r=>r.id===responseId);
   if(response&&response.species!==species)fail('WRONG_POLYOL_RESPONSE');
   const perServing=grams/pack.servings;
   if(response){conditionalPolyols+=perServing;sources.add(response.sourceId);}
   else {unresolvedPolyols+=perServing;out.blockers.push('MISSING_RESPONSE: '+id);}
   out.terms.push({id,name,massG:grams,gPerServing:perServing,species,coefficient:response?quantity(response.gi):null,
    gkPerServing:response?perServing*quantity(response.gi)/100:null,evidence:response?'CONDITIONAL_RESEARCH':'UNRESOLVED',
    sourceIds:[compositionSource,...(response?[response.sourceId]:[])],reason:response?'ISOLATED_POLYOL_TO_BAKED_CAKE_ASSUMPTION':'MISSING_RESPONSE_NOT_ZERO'});
  }
  for(const [species,value] of Object.entries(p.species)){
   if(value===null)continue; // Not zero: completeness remains false and blocks the total.
   polyolTerm('chocolate-'+species,p.name,species,quantity(value)*quantity(pack.chocolateGrams)/100,p.responseBindings[species],p.sourceId);
  }
  polyolTerm('separate-erythritol','Foodin100%erytritoli','erythritol',quantity(pack.separateErythritolGrams),pack.separateErythritolResponseId,pack.separateErythritolCompositionId);
  const ordinary=out.terms.filter(t=>t.species===null),unresolved=ordinary.filter(t=>t.gkPerServing===null);
  const omitted=unresolved.reduce((sum,t)=>sum+t.gPerServing!,0);
  out.coverage={calculatedOrdinaryChoG:ordinary.filter(t=>t.gkPerServing!==null).reduce((sum,t)=>sum+t.gPerServing!,0),
   unresolvedOrdinaryChoG:omitted,conditionalPolyolsG:conditionalPolyols,
   unresolvedPolyolsG:p.aggregateComplete?unresolvedPolyols:null,aggregatePolyolsComplete:p.aggregateComplete,
   omittedOrdinaryChoG:omitted,omissionPolicySatisfied:omissionsWithinPolicy(unresolved.map(t=>t.gPerServing!)),unknownOtherIngredientPolyols:true};
  out.calculatedPortion=out.terms.filter(t=>t.evidence==='EXISTING_GK_ONLY').reduce((sum,t)=>sum+t.gkPerServing!,0);
  const assumptionTerms=out.terms.filter(t=>t.evidence==='CONDITIONAL_RESEARCH');
  out.conditional={kind:'CONDITIONAL_SCENARIOS',alternatives:[{id:p.id+'-isolated-polyol-transfer',
   value:out.calculatedPortion+assumptionTerms.reduce((sum,t)=>sum+t.gkPerServing!,0),
   assumptions:['Full listed polyol mass × review-derived response coefficient / 100.',
    'Pure-polyol coefficients transferred to chocolate and baked cake; no product/cake GI measurement.',
    ...(!p.aggregateComplete?['Only named reported species; aggregate and missing species remain unknown.']:['Aggregate polyols allocated to the sole listed polyol.'])]}],
   scope:'COMPONENT_SUBTOTAL',isBiologicalBound:false,isConfidenceInterval:false};
  out.blockers.push('WHOLE_CAKE_GI_OR_VALIDATED_COMPONENT_TRANSFER_MISSING','POSITIVE_ORDINARY_CHO_WITHOUT_MATCHED_GI',
   'OTHER_INGREDIENT_AGGREGATE_POLYOLS_UNKNOWN','ERYTHRITOL_ZERO_IS_A_CONDITIONAL_COEFFICIENT');
  if(!p.aggregateComplete)out.blockers.push('AGGREGATE_POLYOLS_UNKNOWN','AFCD_COMPOSITE_IS_NOT_A_NAMED_CURRENT_PRODUCT');
  if(!out.coverage.omissionPolicySatisfied)out.blockers.push('EXISTING_OMISSION_LIMIT_EXCEEDED');
  if(normalized.source.rawSha256===null&&p.kind==='NAMED_PRODUCT')out.blockers.push('LIVE_PUBLISHER_BYTES_UNAVAILABLE');
  out.notes=[p.note,base.preparation,'No complete GL class, numerical bounds or personal glucose prediction. Existing omissions remain visible.'];
  out.sources=[...base.sources,...pack.sources.filter(s=>sources.has(s.id)).map(s=>({id:s.id,title:s.title,url:s.url,locator:s.locator,note:s.licence}))];
  for(const s of pack.sources.filter(s=>sources.has(s.id)))out.sourceHashes[s.id]=s.evidenceHash;
 }catch(e){
  out.blockers=[e instanceof Error?e.message:String(e)];out.terms=[];out.calculatedPortion=null;
  out.conditional={kind:'UNAVAILABLE',reasons:out.blockers};
 }
 out.wholeRecipe={kind:'UNAVAILABLE',reasons:out.blockers};return out;
}

export function assessPilot(pack:PilotPack,base:BaseContext){
 verifyPack(pack);
 return {schemaVersion:SCENARIO_SCHEMA,kind:'CONDITIONAL_SCENARIOS' as const,wholeRecipeRange:null,
  uniqueRecipeCount:1,newSourceEligibleWholeRecipeResults:0,publishedResults:0,coverageDelta:0,
  results:pack.products.map(p=>assessProduct(pack,p,base))};
}
