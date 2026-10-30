// Policy checks for reviewed packs. The historical arithmetic snapshot remains frozen.
import {calculate,type Recipe,type Source,type CompositionSource} from './gk80-candidate-model';
export function calculateCandidate(r:Recipe,sources:Source[],hash:string,inputHash:string,comps:CompositionSource[]){
 const out=calculate(r,sources,hash,inputHash,comps);
 for(const s of r.scenarios){let spiceCho=0;
  for(const i of s.ingredients){
   const id=i.giId??i.impact?.sourceId,state=String((i as {state?:string}).state??'');
   if(id==='dairy-imputation30'&&/butternut|coconut|soy|plant|peanut/i.test(state))throw Error('DAIRY_SCOPE');
   if(id==='lowcho50-v2'&&(!i.per100g||i.per100g.availableCarbohydrate>5||/flour|sugar|honey|syrup|nut butter|tahini/i.test(state)))throw Error('LOW_CHO_SCOPE');
   if(id==='spice-portion50-v2'){
    if(!/ground|dried oregano|sesame seed/i.test(state)||/flour|paste|butter|stick|pod/i.test(state)||i.massG===null||!i.per100g)throw Error('PORTION_SCOPE');
    const cho=i.massG*i.retention/100/r.servings*i.per100g.availableCarbohydrate;
    if(cho>.5+1e-12)throw Error('PORTION_CHO_LIMIT');spiceCho+=cho;
   }
  }
  if(spiceCho>1+1e-12)throw Error('CUMULATIVE_PORTION_LIMIT');
 }
 return {...out,numericProposal:r.completeInputScope&&r.coverageProposalEligible&&['A','B','C','D'].includes(r.method)&&!out.broad&&out.scenarios.every(s=>s.wholeGk!==null)};
}
