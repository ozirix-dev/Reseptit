import type {RecipeLocale} from '@/types/content';
export type LocalizedText=Record<RecipeLocale,string>;
export interface GkOnlyVariant {
 recipeId:string;versionId:string;inputSha256:string;level:'A'|'B';servings:number;
 point:number|null;scenarioRange:{min:number;max:number}|null;
 rangeKind:'NAMED_COMPARATOR_SCENARIOS'|'CONDITIONAL_CODING_MODEL'|null;
 omittedCho:number;confidence:'LOW';macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION';
 /** Absent means the original gram-only contract; sealed inputs are never rewritten. */
 quantityContract?:'GK_ONLY_NATIVE_UNITS_V1';
 rangeDisplay?:'OUTWARD_INTEGER';
 standalonePreparation?:true;
 studyServing?:true;
 ingredients:Array<{name:LocalizedText;grams:number|null;quantity?:{amount:number;unit:'ml'|'tbsp'}}> ;
 limitation?:LocalizedText;
 preparation:LocalizedText;codingKinds:Array<'PLANT50'|'TRACE50'>;
 sensitivity:{min:number;max:number;kind:'ASSUMPTION_ONLY';gi:[0,150];isBiologicalBound:false;isConfidenceInterval:false}|null;
 sources:Array<{title:string;url:string;kind:'CARBOHYDRATE'|'HUMAN_GI'|'PUBLISHED_CODING'|'B_CODING'|'BOUND';note:string}>;
}
export interface GkVersionCoverage {total:number;originalNumeric:number;additionalA:number;additionalB:number;classOnly:number;numericRecipes:number;missing:number;numericRecipeIds:string[];}
export function countGkVersions(original:Array<{recipeId:string;status:string}>,variants:GkOnlyVariant[]):GkVersionCoverage{
 const originalIds=new Set(original.map(r=>r.recipeId));if(originalIds.size!==original.length)throw Error('Duplicate original recipe');
 const old=new Set(original.filter(r=>r.status==='CALCULATED').map(r=>r.recipeId)),next=new Set<string>();
 for(const v of variants){if(!originalIds.has(v.recipeId)||old.has(v.recipeId)||next.has(v.recipeId))throw Error('GK-only version must cover one distinct previously missing recipe');if(v.level!=='A'&&v.level!=='B')throw Error('Class-only is not numeric');const point=typeof v.point==='number'&&Number.isFinite(v.point)&&v.point>=0;const range=v.scenarioRange&&Number.isFinite(v.scenarioRange.min)&&Number.isFinite(v.scenarioRange.max)&&v.scenarioRange.min>=0&&v.scenarioRange.max>=v.scenarioRange.min;if(!point&&!range)throw Error('Numeric GK-only value missing');next.add(v.recipeId);}
 const ids=[...old,...next].sort();return {total:original.length,originalNumeric:old.size,additionalA:variants.filter(v=>v.level==='A').length,additionalB:variants.filter(v=>v.level==='B').length,classOnly:0,numericRecipes:ids.length,missing:original.length-ids.length,numericRecipeIds:ids};
}
