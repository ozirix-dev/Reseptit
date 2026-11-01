// Deliberately closed to the two exact, owner-approved preparations in PR #156.
// Missing aggregate polyols are never assigned a point value, including zero.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {canonical,fingerprint,type Recipe,type Source,type CompositionSource} from './gk80-candidate-model';
import {calculateCandidate} from './gk80-candidate-policy';
import {classifyGk80Source} from './gk80-source-classification';
import {emptyValues,round,type Calculation} from './nutrition-model';
import type {GlycemicLoadResult} from './glycemic-load-model';

const approved = {
  'jauheliha-kaalikeitto-vhh': '7e16f21f52cc2365c6b1742d891542fb118b7b879b5bf73d88d5dbef361c0f2f',
  'vhh-kaalilaatikko': '57540a15a0e29a4fc6c7cdfe83dfbaa8f59222a0dd48ad77f75c96cf36d82235',
} as const;
export const scopedPolyolRecipeIds = Object.freeze(Object.keys(approved));
type Macro = 'availableCarbohydrate'|'protein'|'fat'|'fibre';
type Row = {
  index:number; name:string; massG:string; retention:string; sourceId:string; sourceEvidenceHash:string;
  macro:Record<Macro,string>; polyolsSourceValue:number|null;
  polyolEvidenceKind:'REPORTED_SOURCE_VALUE'|'AFCD_PAIRED_SOURCE_MODEL'|'MISSING_AGGREGATE';
  pairedCarbohydrates:{withValue:number;without:number}|null;
  targetDefinition:string|null; gi:string|null; giSourceId:string|null; giSourceEvidenceHash:string|null;
};
export type ScopedPolyolEvidence = Calculation & {scopedPolyolC:{
  version:1; approval:string; fullGkWidthLimit:number; responseScenario:number[]; biologicalBoundEstablished:false;
  case:{recipeId:string;servings:number;completeScope:boolean;preparationApprovedForPublication:boolean;ingredients:Row[]};
  recipe:Recipe&{sourcePath:string}; sources:Source[]; comps:CompositionSource[]; versionHashes:Record<string,string>;
}};
export function isScopedPolyolEvidence(e:Calculation):e is ScopedPolyolEvidence {
  return Object.hasOwn(e,'scopedPolyolC');
}
const quantity=(v:unknown):number=>{
  if(v===null||v===undefined||v==='')throw Error('SCOPED_C_UNKNOWN_NOT_ZERO');
  const n=Number(v);if(!Number.isFinite(n)||n<0)throw Error('SCOPED_C_INVALID_QUANTITY');return n;
};
const group=(n:number)=>n<=10?'LOW':n<20?'MEDIUM':'HIGH';
type Interval={lower:number;upper:number};
function stableDisplay(interval:Interval,places:readonly number[]) {
  if(interval.lower<0||interval.upper<interval.lower)throw Error('SCOPED_C_INVALID_INTERVAL');
  for(const decimalPlaces of places){
    const lower=round(interval.lower,decimalPlaces),upper=round(interval.upper,decimalPlaces);
    if(lower===upper)return {...interval,decimalPlaces,value:lower};
  }
  throw Error('SCOPED_C_UNSTABLE_DISPLAY');
}
export function assertScopedGkInterval(interval:Interval) {
  const out=stableDisplay(interval,[0]);
  // This approved packet contains no subunit estimates; no new format is inferred.
  if(interval.lower<1||out.value===0)throw Error('SCOPED_C_POSITIVE_SUBUNIT');
  if(group(interval.lower)!==group(interval.upper))throw Error('SCOPED_C_CLASS_CHANGE');
  if(interval.upper-interval.lower>0.1)throw Error('SCOPED_C_CUMULATIVE_BUDGET');
  return out;
}
export function calculateScopedPolyolC(e:ScopedPolyolEvidence) {
  if(!Object.hasOwn(approved,e.recipeId))throw Error('SCOPED_C_RECIPE_NOT_APPROVED');
  if(fingerprint(e)!==approved[e.recipeId as keyof typeof approved])throw Error('SCOPED_C_STALE_APPROVAL');
  const p=e.scopedPolyolC,c=p.case;
  if(p.version!==1||p.fullGkWidthLimit!==0.1||canonical(p.responseScenario)!=='[0,150]'||p.biologicalBoundEstablished!==false
      ||e.servings!==6||c.servings!==6||!c.completeScope||!c.preparationApprovedForPublication)throw Error('SCOPED_C_APPROVAL_SCOPE');
  const r=p.recipe;
  // Reuse all existing food identity, preparation, GI and composition checks.
  const base=calculateCandidate(r,p.sources,r.sourceSha256,fingerprint(r),p.comps);
  if(base.scenarios.length!==1||base.scenarios[0].missing.length)throw Error('SCOPED_C_INCOMPLETE_GI_OR_COMPOSITION');
  const sums={availableCarbohydrate:0,protein:0,fat:0,fibre:0};
  let ordinaryGk=0,knownPolyols=0,unknownMax=0,targets=0;
  const unknowns:Array<{sourceId:string;aggregatePolyolsPer100g:null;maximumScenarioGPerServing:number;evidence:string}>=[];
  for(const i of c.ingredients){
    const comp=p.comps.find(x=>x.id===i.sourceId);
    if(!comp||comp.evidenceHash!==i.sourceEvidenceHash)throw Error('SCOPED_C_COMPOSITION_BINDING');
    const {evidenceHash,...payload}=comp;
    if(fingerprint(payload)!==evidenceHash)throw Error('SCOPED_C_STALE_COMPOSITION');
    const macro=Object.fromEntries(Object.entries(i.macro).map(([k,v])=>[k,quantity(v)])) as Record<Macro,number>;
    if(canonical(macro)!==canonical(comp.per100g)||quantity(i.retention)!==1)throw Error('SCOPED_C_COMPOSITION_OR_RETENTION');
    const factor=quantity(i.massG)/100/6;
    for(const k of Object.keys(sums) as Macro[])sums[k]+=macro[k]*factor;
    if(macro.availableCarbohydrate>0){
      const source=p.sources.find(x=>x.id===i.giSourceId);
      if(!source||source.evidenceHash!==i.giSourceEvidenceHash||source.gi!==quantity(i.gi))throw Error('SCOPED_C_MISSING_GI');
      ordinaryGk+=macro.availableCarbohydrate*factor*source.gi/100;
    }
    if(i.polyolEvidenceKind==='REPORTED_SOURCE_VALUE')knownPolyols+=quantity(i.polyolsSourceValue)*factor;
    else {
      if(i.polyolsSourceValue!==null)throw Error('SCOPED_C_UNKNOWN_AGGREGATE_REQUIRED');
      let known=0;
      if(i.polyolEvidenceKind==='AFCD_PAIRED_SOURCE_MODEL'){
        if(!i.pairedCarbohydrates)throw Error('SCOPED_C_MISSING_PAIR');
        known=quantity(i.pairedCarbohydrates.withValue)-quantity(i.pairedCarbohydrates.without);
        if(known<0)throw Error('SCOPED_C_CONFLICTING_PAIR');
        knownPolyols+=known*factor;
      }else if(i.polyolEvidenceKind==='MISSING_AGGREGATE'){
        targets++;
        if(i.sourceId!=='norway-06.186-polyoli02-20261101'||quantity(i.massG)!==0.6||i.targetDefinition!=='AVAILABLE_WITH_UNKNOWN_EXTERNAL_POLYOLS')throw Error('SCOPED_C_UNREVIEWED_TARGET');
      }else throw Error('SCOPED_C_UNKNOWN_EVIDENCE_KIND');
      // Conditional source accounting, NOT a biological maximum. Never subtract
      // water-by-difference or infer that an unreported polyol species is zero.
      const slack=100-macro.availableCarbohydrate-macro.fibre-macro.protein-macro.fat-known;
      if(slack<0)throw Error('SCOPED_C_SOURCE_ACCOUNTING_CONFLICT');
      const maximum=slack*factor;unknownMax+=maximum;
      unknowns.push({sourceId:i.sourceId,aggregatePolyolsPer100g:null,maximumScenarioGPerServing:maximum,evidence:i.polyolEvidenceKind});
    }
  }
  if(targets!==1||unknowns.length!==2)throw Error('SCOPED_C_UNREVIEWED_UNKNOWNS');
  if(Math.abs(ordinaryGk-base.min!)>1e-10)throw Error('SCOPED_C_INGREDIENT_SCOPE');
  const gk=assertScopedGkInterval({lower:ordinaryGk,upper:ordinaryGk+unknownMax*1.5});
  const totalLower=sums.availableCarbohydrate+sums.fibre+knownPolyols;
  const macros={
    carbsNetG:stableDisplay({lower:sums.availableCarbohydrate,upper:sums.availableCarbohydrate},[2,1,0]),
    carbsTotalG:stableDisplay({lower:totalLower,upper:totalLower+unknownMax},[2,1,0]),
    proteinG:stableDisplay({lower:sums.protein,upper:sums.protein},[2,1,0]),
    fatG:stableDisplay({lower:sums.fat,upper:sums.fat},[2,1,0]),
  };
  return {recipeId:e.recipeId,gk,gkClass:group(gk.lower),macros,unknowns,
    confidence:'LOW' as const,biologicalBoundEstablished:false as const,
    perServing:{...emptyValues(),netCarbohydrate:macros.carbsNetG.value,protein:macros.proteinG.value,fat:macros.fatG.value},
    totalCarbohydratePerServingG:macros.carbsTotalG.value,status:'ESTIMATE WITH EVIDENCE' as const};
}
const textHash=(s:string)=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
export async function loadScopedPolyolC(root:string,recipeId:string){
  if(!Object.hasOwn(approved,recipeId))throw Error('SCOPED_C_RECIPE_NOT_APPROVED');
  const e=JSON.parse(await readFile(path.join(root,'docs/nutrition/calculations',recipeId+'.json'),'utf8')) as ScopedPolyolEvidence;
  const result=calculateScopedPolyolC(e);
  for(const [file,digest] of Object.entries(e.scopedPolyolC.versionHashes)){
    if(textHash(await readFile(path.join(root,file),'utf8'))!==digest)throw Error('SCOPED_C_STALE_PREPARATION: '+file);
  }
  return {e,result};
}
export async function validateScopedPolyolC(root:string,id:string):Promise<boolean>{
  if(!Object.hasOwn(approved,id))return false;
  await loadScopedPolyolC(root,id);return true;
}
export async function applyScopedPolyolC<T extends GlycemicLoadResult>(root:string,legacy:T[]){
  const out=[...legacy];
  for(const id of scopedPolyolRecipeIds){
    const {e,result}=await loadScopedPolyolC(root,id),p=e.scopedPolyolC;
    const index=out.findIndex(x=>x.recipeId===id);
    if(index<0||out[index].status==='CALCULATED')throw Error('SCOPED_C_RELEASE_COLLISION');
    out[index]={...out[index],status:'CALCULATED',servings:6,unroundedGlycemicLoadPerServing:null,
      glycemicLoadPerServing:result.gk.value,glycemicLoadRangePerServing:null,confidence:'LOW',blockers:[],
      omittedAvailableCarbohydratePerServingG:0,omittedAvailableCarbohydrateUpperBoundPerServingG:0,
      assessmentType:'PUBLISHED_IMPUTATION',boundedPolyolC:true,modelScenario:'POINT_SCENARIO',
      interpretation:'Stable rounded value across the owner-approved source-accounting scenario. Unknown aggregate polyols remain unknown; no physiological bound or exact unrounded point is claimed.',
      boundedPolyolEvidence:{gkInterval:result.gk,unknowns:result.unknowns,macros:result.macros,responseScenario:[0,150],fullWidthLimit:0.1,biologicalBoundEstablished:false},
      ingredients:p.recipe.scenarios[0].ingredients.map(i=>{
        const sourceId=i.composition?.sourceId??null,source=p.sources.find(s=>s.id===(i.giId??i.impact?.sourceId));
        const factor=i.certifiedZeroSalt?0:i.massG!/600,carbohydrate=i.per100g!.availableCarbohydrate*factor;
        const ordinary=carbohydrate*(source?.gi??0)/100,unknown=result.unknowns.find(u=>u.sourceId===sourceId);
        return {name:i.name,grams:i.massG,fineliRecordId:sourceId,availableCarbohydratePer100g:i.per100g!.availableCarbohydrate,
          availableCarbohydratePerServingG:carbohydrate,availableCarbohydratePerServingRangeG:null,
          gi:source?.gi??null,giRecordId:source?.id??null,qualityTier:null,matchKind:null,confidence:'LOW',
          giContribution:unknown?null:ordinary,giContributionRange:unknown?{min:ordinary,max:ordinary+unknown.maximumScenarioGPerServing*1.5}:null,
          giCandidates:[],issues:[]};
      }),
      candidateSources:p.sources.map(s=>({title:String(s.food??s.id),url:String(s.sourceUrl),...classifyGk80Source(s.evidenceKind as 'HUMAN_GI'|'PUBLISHED_IMPUTATION'??'HUMAN_GI','APPLIED'),confidence:'LOW',note:String(s.limitations??s.food)})),
      candidateCarbohydrateSources:p.comps.map(c=>{const s=c.sourceRecord as {name:string;sourceUrl:string;licence?:string};return {title:s.name,url:s.sourceUrl,note:s.licence??'Source-specific available carbohydrate; missing polyols retained as unknown in the approved recipe model.'};}),
    } as T;
  }
  return out as Array<T&{boundedPolyolC?:boolean}>;
}
