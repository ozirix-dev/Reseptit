// Bounded source reuse for run4. Frozen historical models remain unchanged.
import {calculateV2} from './gk80-v2-model';
import {type Recipe,type Source,type CompositionSource} from './gk80-model';
export function calculateRun4(r:Recipe,sources:Source[],recipeHash:string,inputHash:string,comps:CompositionSource[]){
 const result=calculateV2(r,sources,recipeHash,inputHash,comps),map=new Map(sources.map(s=>[s.id,s]));
 for(const scenario of r.scenarios){let minorCho=0;
  for(const i of scenario.ingredients){
   if(!i.per100g||i.massG===null||i.per100g.availableCarbohydrate===0)continue;
   const id=i.giId??i.impact?.sourceId,source=map.get(id??'');
   if(id==='dairy-imputation30'&&/butternut|coconut|soy|plant|peanut/i.test(String((i as {state?:string}).state)))throw Error('DAIRY_SCOPE');
   if(id==='lowcho50-r4'||id==='small-flavour50-r4'){
    if(!(source!.allowedCompositionIds as string[]).includes(i.composition?.sourceId??''))throw Error('UNREVIEWED_COMPOSITION_SCOPE');
    if(id==='lowcho50-r4'&&(i.per100g.availableCarbohydrate>5||/flour|sugar|honey|syrup|peanut butter/i.test(String((i as {state?:string}).state))))throw Error('LOW_CHO_SCOPE');
    if(id==='small-flavour50-r4'){
     if(!/ground|dried oregano|sesame seed|vanilla bean extract|dry powder/i.test(String((i as {state?:string}).state))||/flour|paste|butter|stick|pod/i.test(String((i as {state?:string}).state)))throw Error('SMALL_FLAVOUR_SCOPE');
     const cho=i.massG*i.retention/100/r.servings*i.per100g.availableCarbohydrate;
     if(cho>.5+1e-12)throw Error('SMALL_FLAVOUR_DOSE');minorCho+=cho;
    }
   }
  }
  if(minorCho>1+1e-12)throw Error('SMALL_FLAVOUR_AGGREGATE');
 }
 return {...result,policyVersion:'GK80-R4-2026-10-30'};
}
