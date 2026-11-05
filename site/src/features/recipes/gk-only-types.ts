import type {RecipeLocale} from '@/types/content';
import { gkVariantScope } from './gk-estimate-scope';
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
export interface GkVersionCoverage {
 total:number;
 originalNumeric:number;
 originalRecipeIds:string[];
 variantNumeric:number;
 variantRecipeIds:string[];
 originalTarget:number;
 originalTargetGap:number;
 /** Historical mixed accounting, never original-recipe coverage. */
 legacyNumericRecipes:number;
 additionalA:number;
 additionalB:number;
 classOnly:number;
 numericRecipes:number;
 missing:number;
 numericRecipeIds:string[];
 studyServingRecipeIds:string[];
}

export function countGkVersions(original:Array<{recipeId:string;status:string}>,variants:GkOnlyVariant[]):GkVersionCoverage {
 const originalIds = new Set(original.map(row => row.recipeId));
 if (originalIds.size !== original.length) throw Error('Duplicate original recipe');
 const originalNumeric = new Set(original.filter(row => row.status === 'CALCULATED').map(row => row.recipeId));
 const additional = new Set<string>();
 const studyServings = new Set<string>();
 const legacyIds = new Set(originalNumeric);
 let additionalA = 0;
 let additionalB = 0;
 for (const variant of variants) {
  const {recipeId, level, point, scenarioRange} = variant;
  const study = gkVariantScope(variant) === 'STUDY_COMPARISON';
  const covered = study ? studyServings : additional;
  if (!originalIds.has(recipeId) || covered.has(recipeId) || (!study && originalNumeric.has(recipeId))) {
   throw Error('GK-only version must cover one distinct recipe within its scope; home-recipe versions require missing original GK');
  }
  if (level !== 'A' && level !== 'B') throw Error('Class-only is not numeric');
  const validPoint = typeof point === 'number' && Number.isFinite(point) && point >= 0;
  const validRange = scenarioRange && Number.isFinite(scenarioRange.min) && Number.isFinite(scenarioRange.max)
    && scenarioRange.min >= 0 && scenarioRange.max >= scenarioRange.min;
  if (!validPoint && !validRange) throw Error('Numeric GK-only value missing');
  covered.add(recipeId);
  if (!variant.studyServing) legacyIds.add(recipeId);
  if (study) continue;
  if (level === 'A') additionalA++;
  else additionalB++;
 }
 const numericRecipeIds = [...originalNumeric, ...additional].sort();
 return {
  total: original.length, originalNumeric: originalNumeric.size,
  originalRecipeIds: [...originalNumeric].sort(), variantNumeric: additional.size, variantRecipeIds: [...additional].sort(),
  originalTarget: Math.ceil(original.length * 0.8), originalTargetGap: Math.max(0, Math.ceil(original.length * 0.8) - originalNumeric.size),
  legacyNumericRecipes: legacyIds.size, additionalA, additionalB, classOnly: 0,
  numericRecipes: numericRecipeIds.length, missing: original.length - numericRecipeIds.length,
  numericRecipeIds, studyServingRecipeIds: [...studyServings].sort(),
 };
}
