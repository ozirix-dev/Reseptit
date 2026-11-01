// One exact owner-requested recovery03 preparation. No general polyol exception.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fingerprint,type Recipe,type Source,type CompositionSource} from './gk80-candidate-model';
import {calculateCandidate} from './gk80-candidate-policy';
import {emptyValues,round,type Calculation} from './nutrition-model';
import {classifyGk80Source} from './gk80-source-classification';
import type {GlycemicLoadResult} from './glycemic-load-model';

export const recoveryRecipeId='uunikanapasta-kesakurpitsa';
export const recoveryEvidenceHash='b3c8d086f15b997937000cf4f42175a122f3f7cf2fd99c61d2783e2dc59668d7';
const proposalHash='e1f620de4ef73f347ddff4c14e41dadb1acf9b8282b7761404865491b415cc07';
type Macro='availableCarbohydrate'|'protein'|'fat'|'fibre';
type Row={index:number;name:string;massG:string|null;retention:string;sourceId:string;macroPer100g:Record<Macro,string>;certifiedZeroSalt?:boolean;gi:string|null;knownPartialPolyolPer100g:string;aggregatePolyolPer100g:string|null;unknownAggregate:boolean;pairedCarbohydrates?:{with:string;without:string};individuallyReportedSpecies?:Record<string,null>};
type Display={value:string;decimalPlaces:number};
export type RecoveryEvidence=Calculation&{recoveryC:{version:1;approvedDisplayProposal:string;reviewedCaseFingerprint:string;ownerRequest:string;biologicalBoundEstablished:false;
 candidate:Recipe;sources:Source[];comps:CompositionSource[];versionHashes:Record<string,string>;
 reviewedCase:{pilot:{servings:number;ingredients:Row[]};[key:string]:unknown};
 displayProposal:{proposalFingerprintSha256:string;display:Record<string,Display>;[key:string]:unknown};
}};
export const isRecoveryEvidence=(e:Calculation):e is RecoveryEvidence=>Object.hasOwn(e,'recoveryC');
const hash=(s:string)=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
const n=(x:unknown):number=>{if(x===null||x===undefined||x==='')throw Error('RECOVERY_UNKNOWN_NOT_ZERO');const v=Number(x);if(!Number.isFinite(v)||v<0)throw Error('RECOVERY_INVALID_NUMBER');return v;};
const keys:Macro[]=['availableCarbohydrate','protein','fat','fibre'];
const interval=(lo:number,hi:number)=>({lower:round(lo,6),upper:round(hi,6)});
function stable(lo:number,hi:number,d:Display){
 const out=interval(lo,hi);if(out.lower>out.upper||round(out.lower,d.decimalPlaces)!==n(d.value)||round(out.upper,d.decimalPlaces)!==n(d.value))throw Error('RECOVERY_UNSTABLE_DISPLAY');
 return {...out,decimalPlaces:d.decimalPlaces,value:n(d.value)};
}

export function calculateRecovery(e:RecoveryEvidence){
 if(e.recipeId!==recoveryRecipeId)throw Error('RECOVERY_RECIPE_NOT_APPROVED');
 if(fingerprint(e)!==recoveryEvidenceHash)throw Error('RECOVERY_STALE_APPROVAL');
 const p=e.recoveryC,c=p.reviewedCase,proposal=p.displayProposal;
 const {proposalFingerprintSha256,...body}=proposal;
 if(proposalFingerprintSha256!==proposalHash||fingerprint(body)!==proposalHash||p.approvedDisplayProposal!==proposalHash||fingerprint(c)!==p.reviewedCaseFingerprint)throw Error('RECOVERY_PROPOSAL_BINDING');
 if(e.servings!==4||c.pilot.servings!==4||p.version!==1||p.biologicalBoundEstablished!==false||p.ownerRequest!=='Julkaise')throw Error('RECOVERY_SCOPE');
 const r=p.candidate;
 const base=calculateCandidate(r,p.sources,r.sourceSha256,fingerprint(r),p.comps);
 if(base.scenarios.length!==1||base.scenarios[0].missing.length||r.coverageProposalEligible!==false)throw Error('RECOVERY_INCOMPLETE_INPUT');
 const sums={availableCarbohydrate:0,protein:0,fat:0,fibre:0};let ordinary=0,known=0,extra=0,unknowns=0;
 for(const i of c.pilot.ingredients){
  const salt=i.certifiedZeroSalt===true;
  if(salt&&!(i.index===9&&i.massG===null&&keys.every(k=>n(i.macroPer100g[k])===0)))throw Error('RECOVERY_PURE_SALT_SCOPE');
  const factor=salt?0:n(i.massG)*n(i.retention)/100/4;
  if(n(i.retention)!==1)throw Error('RECOVERY_RETENTION');
  const ingredient=r.scenarios[0].ingredients.find(x=>x.index===i.index);
  if(!ingredient||keys.some(k=>ingredient.per100g?.[k]!==n(i.macroPer100g[k])))throw Error('RECOVERY_MACRO_BINDING');
  for(const k of keys)sums[k]+=n(i.macroPer100g[k])*factor;
  const a=n(i.macroPer100g.availableCarbohydrate)*factor;
  if(a>0)ordinary+=a*n(i.gi)/100;
  const partial=n(i.knownPartialPolyolPer100g);known+=partial*factor;
  if(i.unknownAggregate){
   if(i.index!==8||i.aggregatePolyolPer100g!==null||!i.pairedCarbohydrates||Object.values(i.individuallyReportedSpecies??{}).some(x=>x!==null))throw Error('RECOVERY_UNKNOWN_SCOPE');
   if(n(i.pairedCarbohydrates.with)-n(i.pairedCarbohydrates.without)!==partial)throw Error('RECOVERY_PARTIAL_PAIR');
   const residual=100-keys.reduce((s,k)=>s+n(i.macroPer100g[k]),0)-partial;
   if(residual<0)throw Error('RECOVERY_SOURCE_CONFLICT');extra+=residual*factor;unknowns++;
  }else if(n(i.aggregatePolyolPer100g)!==partial)throw Error('RECOVERY_REPORTED_POLYOLS');
 }
 if(unknowns!==1||c.pilot.ingredients.length!==10||Math.abs(ordinary-base.min!)>1e-10)throw Error('RECOVERY_COMPLETE_RECIPE');
 const total=sums.availableCarbohydrate+sums.fibre+known;
 const scenarios=[0,.5,1].map(mult=>{
  let md=0,ad=0,ps=0;
  for(const index of [6,7]){const i=c.pilot.ingredients[index],factor=n(i.massG)/400;md+=.1*mult*factor;ad+=.1*mult*factor*n(i.gi)/100;ps+=mult*factor;}
  const gk=stable(ordinary-ad,ordinary+ad+(extra+ps)*1.5,proposal.display.gk);
  if(gk.upper-gk.lower>.1+1e-12||gk.lower<1||gk.upper>10)throw Error('RECOVERY_GK_CLASS_OR_BUDGET');
  return {gk,macros:{
   carbsNetG:stable(sums.availableCarbohydrate-md,sums.availableCarbohydrate+md,proposal.display.carbsNetG),
   carbsTotalG:stable(total-2*md,total+2*md+extra+ps,proposal.display.carbsTotalG),
   proteinG:stable(sums.protein-md,sums.protein+md,proposal.display.proteinG),
   fatG:stable(sums.fat-md,sums.fat+md,proposal.display.fatG),
  }};
 });
 const out=scenarios[2];
 return {recipeId:e.recipeId,scenarios,gk:out.gk,macros:out.macros,ordinaryKnownA:ordinary,unknownAggregatePolyols:null,wholeGkPoint:null,
  status:'ESTIMATE WITH EVIDENCE' as const,perServing:{...emptyValues(),netCarbohydrate:out.macros.carbsNetG.value,protein:out.macros.proteinG.value,fat:out.macros.fatG.value},totalCarbohydratePerServingG:out.macros.carbsTotalG.value};
}

export async function loadRecovery(root:string,id:string){
 if(id!==recoveryRecipeId)throw Error('RECOVERY_RECIPE_NOT_APPROVED');
 const e=JSON.parse(await readFile(path.join(root,'docs/nutrition/calculations',id+'.json'),'utf8')) as RecoveryEvidence;
 const result=calculateRecovery(e);
 for(const [file,sha] of Object.entries(e.recoveryC.versionHashes))if(hash(await readFile(path.join(root,file),'utf8'))!==sha)throw Error('RECOVERY_STALE_PREPARATION');
 return {e,result};
}
export async function validateRecovery(root:string,id:string){if(id!==recoveryRecipeId)return false;await loadRecovery(root,id);return true;}

export async function applyRecovery<T extends GlycemicLoadResult>(root:string,legacy:T[]){
 const {e,result}=await loadRecovery(root,recoveryRecipeId),p=e.recoveryC,out=[...legacy];
 const index=out.findIndex(x=>x.recipeId===recoveryRecipeId);
 if(index<0||out[index].status==='CALCULATED')throw Error('RECOVERY_RELEASE_COLLISION');
 out[index]={...out[index],status:'CALCULATED',servings:4,unroundedGlycemicLoadPerServing:null,glycemicLoadPerServing:result.gk.value,
  glycemicLoadRangePerServing:null,confidence:'LOW',blockers:[],omittedAvailableCarbohydratePerServingG:0,omittedAvailableCarbohydrateUpperBoundPerServingG:0,
  assessmentType:'PUBLISHED_IMPUTATION',modelScenario:'POINT_SCENARIO',closedRecoveryC:true,
  interpretation:'Stable display across the exact owner-requested source-accounting and two-web-profile rounding scenarios. Unknown aggregate polyols remain null. No exact whole GK point or biological uncertainty bound.',
  recoveryEvidence:{proposal:proposalHash,gkScenarios:result.scenarios,aggregatePolyols:null,wholeGkPoint:null,responseScenario:[0,150],fullWidthLimit:.1},
  ingredients:p.candidate.scenarios[0].ingredients.map(i=>{
   const source=p.sources.find(s=>s.id===(i.giId??i.impact?.sourceId)),a=i.certifiedZeroSalt?0:i.massG!*i.retention/400*i.per100g!.availableCarbohydrate;
   return {name:i.name,grams:i.massG,fineliRecordId:i.composition?.sourceId??null,availableCarbohydratePer100g:i.per100g!.availableCarbohydrate,availableCarbohydratePerServingG:a,availableCarbohydratePerServingRangeG:null,gi:source?.gi??null,giRecordId:source?.id??null,qualityTier:null,matchKind:null,confidence:'LOW',giContribution:i.index===8?null:a*(source?.gi??0)/100,giContributionRange:i.index===8?{min:a*source!.gi/100,max:a*source!.gi/100+.042}:null,giCandidates:[],issues:[]};
  }),
  candidateSources:p.sources.map(s=>({title:String(s.food??s.id),url:String(s.sourceUrl),...classifyGk80Source(s.evidenceKind as 'PUBLISHED_IMPUTATION','APPLIED'),confidence:'LOW',note:String(s.limitations??s.food)})),
  candidateCarbohydrateSources:(p.reviewedCase.sourceCards as {compositionSources:Array<{sourceId:string;evidence:{name?:string;sourceUrl?:string;originalComposition?:{sourceRecord:{name:string;sourceUrl:string;licence?:string}}}}>}).compositionSources.map(c=>{const s=c.evidence.originalComposition?.sourceRecord??c.evidence;return {title:String(s.name??c.sourceId),url:String(s.sourceUrl),note:c.sourceId.startsWith('afcd-')?'FSANZ AFCD Release3, CC BY-SA3.0 Australia. Aggregate polyols remain unknown in this closed scenario.':'THL Fineli, CC BY4.0. Named raw edible profile; web-table precision sensitivity is recipe-specific.'};}),
 } as T;
 return out as Array<T&{closedRecoveryC?:boolean}>;
}
