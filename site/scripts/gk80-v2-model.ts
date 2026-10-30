// Shared reviewed-proposal policy. Historical gk80-model.ts remains frozen.
import {calculate, type Recipe, type Source, type CompositionSource} from './gk80-model';
export type EvidenceType='DIRECT'|'FOOD_ANALOGUE'|'PUBLISHED_IMPUTATION'|'MODELLED_SCENARIO'|'CHO_ONLY'|'UNAVAILABLE';
export function calculateV2(recipe:Recipe,sources:Source[],recipeHash:string,inputHash:string,compositions:CompositionSource[]){
  const result=calculate(recipe,sources,recipeHash,inputHash,compositions);
  const map=new Map(sources.map(s=>[s.id,s]));
  for(const scenario of recipe.scenarios){
    let extensionCho=0;
    for(const i of scenario.ingredients){
      if(!i.per100g||i.massG===null||i.per100g.availableCarbohydrate===0)continue;
      const sid=i.giId??i.impact?.sourceId;if(!sid)continue;
      const source=map.get(sid)!;
      if(source.allowedRecipeIds&&!(source.allowedRecipeIds as string[]).includes(recipe.recipeId))throw Error('SOURCE_SCOPE');
      if(sid==='lowcho50-v2'){
        if(i.per100g.availableCarbohydrate>5||/flour|sugar|honey|syrup|nut butter|tahini/i.test(String((i as unknown as {state:string}).state)))throw Error('LOW_CHO_SCOPE');
      }
      if(sid==='dairy-imputation30'&&/coconut|soy|soya|plant|peanut/i.test(String((i as unknown as {state:string}).state)))throw Error('DAIRY_SCOPE');
      if(sid==='spice-portion50-v2'){
        const state=String((i as unknown as {state:string}).state);
        if(!/ground|dried oregano|sesame seed/i.test(state)||/flour|paste|butter|stick|pod/i.test(state))throw Error('PORTION_SCOPE');
        const cho=i.massG*i.retention/100/recipe.servings*i.per100g.availableCarbohydrate;
        if(cho>.5+1e-12)throw Error('PORTION_CHO_LIMIT');extensionCho+=cho;
      }
    }
    if(extensionCho>1+1e-12)throw Error('CUMULATIVE_PORTION_LIMIT');
  }
  const complete=result.scenarios.every(s=>s.wholeGk!==null);
  const numericProposal=complete&&recipe.coverageProposalEligible&&['A','B','C','D'].includes(recipe.method)&&!result.broad;
  const evidenceTypes=[...new Set(recipe.scenarios.flatMap(s=>s.ingredients.flatMap(i=>i.impact?[i.impact.kind==='PUBLISHED_IMPUTATION'?'PUBLISHED_IMPUTATION':'FOOD_ANALOGUE']:i.giId?[i.match==='DIRECT'?'DIRECT':'FOOD_ANALOGUE']:[])))] as EvidenceType[];
  return {...result,numericProposal,policyVersion:'GK80-V2-2026-10-30',
    methodType:(numericProposal?(recipe.scenarios.length>1?'MODELLED_SCENARIO':evidenceTypes.includes('PUBLISHED_IMPUTATION')?'PUBLISHED_IMPUTATION':evidenceTypes.includes('FOOD_ANALOGUE')?'FOOD_ANALOGUE':'DIRECT'):result.scenarios.every(s=>s.contributions.every(c=>c.carbohydrate!==null))?'CHO_ONLY':'UNAVAILABLE') as EvidenceType,
    evidenceTypes,previousOneUnitScreenPassed:result.impact.imputedWithinPolicy,
    interpretation:'Named modeled recipe proposal; LOW confidence. Scenario options are not physiological uncertainty bounds. All positive CHO retained; no implicit zero or GI100 maximum.'};
}
