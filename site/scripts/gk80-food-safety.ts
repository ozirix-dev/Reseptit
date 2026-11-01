// Explicit dataset identities and reviewed preparation aliases. Names never
// classify a food; every new identity/form/application requires a data entry.
import {readFileSync} from 'node:fs';
import type {Ingredient,Recipe,Source} from './gk80-candidate-model';
type Alias={compositionId:string;foodId:string;foodKind:string;inputForm:string;allowedSources:string[];consumedForms:Record<string,string>};
type Catalog={schemaVersion:number;foodTypes:Record<string,string>;sourceRules:Record<string,{foodKinds:string[];consumedForm:string}>;aliases:Alias[]};
const catalog:Catalog=JSON.parse(readFileSync(new URL('./gk80-food-catalog.json',import.meta.url),'utf8'));
if(catalog.schemaVersion!==1)throw Error('FOOD_CATALOG_VERSION');
export function foodKindForId(foodId:string):string{const kind=catalog.foodTypes[foodId];if(!kind)throw Error('UNREVIEWED_FOOD_ID');return kind;}
export function assertFoodApplication(kind:string,sourceId:string){
 const rule=catalog.sourceRules[sourceId];
 if(!rule||!rule.foodKinds.includes(kind))throw Error('FOOD_FAMILY_OR_PREPARATION');
 return rule.consumedForm;
}
export function assertFoodBindings(recipe:Recipe,sources:Source[]){
 const sourceMap=new Map(sources.map(s=>[s.id,s]));
 for(const scenario of recipe.scenarios){let minorCho=0;
  for(const i of scenario.ingredients){
   const sid=i.giId??i.impact?.sourceId;if(!sid||!i.per100g||i.per100g.availableCarbohydrate===0)continue;
   const state=String((i as Ingredient&{state?:string}).state??'');
   const legacy=(i as Ingredient&{compositionEvidence?:{id:string;dataset:string}}).compositionEvidence;
   const legacyId=legacy?(/^[0-9]+$/.test(legacy.id)?'F'+legacy.id:/^F[0-9]+$/.test(legacy.id)?'A'+legacy.id.slice(1):'UNKNOWN'):'UNKNOWN';
   const compositionId=i.composition?.sourceId??'legacy:'+legacyId;
   const alias=catalog.aliases.find(a=>a.compositionId===compositionId&&a.inputForm===state);
   if(!alias||!alias.allowedSources.includes(sid))throw Error('UNREVIEWED_FOOD_PREPARATION: '+compositionId+' / '+state+' / '+sid);
   const consumed=assertFoodApplication(alias.foodKind,sid);
   if(alias.consumedForms[sid]!==consumed)throw Error('FOOD_PREPARATION_MISMATCH');
   const source=sourceMap.get(sid);if(!source)throw Error('UNKNOWN_GI');
   if(Array.isArray(source.allowedCompositionIds)&&!source.allowedCompositionIds.includes(compositionId))throw Error('UNREVIEWED_COMPOSITION_SCOPE');
   const minor=['GROUND_SPICE','WHOLE_SEED','VANILLA_EXTRACT'].includes(alias.foodKind)&&source.evidenceKind==='PUBLISHED_IMPUTATION';
   if(minor){
    if(i.massG===null)throw Error('MISSING_MINOR_MASS');
    const cho=i.massG*i.retention/100/recipe.servings*i.per100g.availableCarbohydrate;
    if(cho>.5+1e-12)throw Error('PORTION_CHO_LIMIT');minorCho+=cho;
   }else if(source.family==='lowcho-code'&&i.per100g.availableCarbohydrate>5)throw Error('LOW_CHO_SCOPE');
  }
  if(minorCho>1+1e-12)throw Error('CUMULATIVE_PORTION_LIMIT');
 }
}
