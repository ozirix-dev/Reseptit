// Common scoped policy for research and all installed release packs.
import {calculate,type Recipe,type Source,type CompositionSource} from './gk80-candidate-model';
import {assertFoodBindings} from './gk80-food-safety';
export function calculateCandidate(r:Recipe,sources:Source[],hash:string,inputHash:string,comps:CompositionSource[]){
 const out=calculate(r,sources,hash,inputHash,comps);
 assertFoodBindings(r,sources);
 return {...out,numericProposal:r.completeInputScope&&r.coverageProposalEligible&&['A','B','C','D'].includes(r.method)&&!out.broad&&out.scenarios.every(s=>s.wholeGk!==null)};
}
export function roundedCandidatePoint(value:number):number{
 if(!Number.isFinite(value)||value<0)throw Error('INVALID_GK_POINT');
 const point=Math.round(value*100)/100;
 return value>0&&point===0?value:point;
}
