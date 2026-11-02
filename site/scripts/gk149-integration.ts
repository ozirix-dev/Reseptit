/** Explicit owner-approved GK-only version contract, independent of parent macro evidence. */
import {readFileSync} from 'node:fs';import path from 'node:path';
import {loadPilot,evaluate,textHash,digest,type Case} from './gk149-model';
import type {GkOnlyVariant,LocalizedText} from '../src/features/recipes/gk-only-types';
const folder='docs/nutrition/gk80-operation149/';
export function verifyGkOnlyApproval(root:string,approval:any){
 if(approval.schemaVersion!==1||approval.decision!=='OWNER_METHOD_AND_CONTENT_APPROVED_AWAITING_SEPARATE_RELEASE_AUTHORIZATION'||approval.methodAndContentApproved!==true||approval.integrationAuthorized!==true||approval.answer!=='Kyllä'||approval.readyAuthorized!==false||approval.mergeAuthorized!==false||approval.deployAuthorized!==false)throw Error('GK-only owner approval missing or scope changed');
 const required=['cases.json','composition-sources.json','gi-sources.json','source-observations.json','golden.json','method-proposal.md'].sort();
 if(digest(Object.keys(approval.approvedFilesLfSha256??{}).sort())!==digest(required)||approval.approvedReferenceHead!=='7127c0014edd525ac2ced97cf36b3eb511032ae2')throw Error('Incomplete GK-only approval binding');
 for(const [file,hash] of Object.entries(approval.approvedFilesLfSha256)){
  if(!/^[a-z0-9-]+\.(json|md)$/.test(file)||textHash(readFileSync(path.join(root,folder+file),'utf8'))!==hash)throw Error('Approved GK-only method/source pack changed: '+file);
 }
 if(Object.keys(approval.approvedInputs??{}).length!==16)throw Error('GK-only approved scope must be exactly16');
}
export function buildGkOnlyVariants(root:string):GkOnlyVariant[]{
 const read=(p:string)=>JSON.parse(readFileSync(path.join(root,folder+p),'utf8'));
 const approval=read('owner-approval.json');verifyGkOnlyApproval(root,approval);
 const {cases,comps,gis}=loadPilot(root),gold=read('golden.json').results,copy=read('public-copy.json');
 const approved=Object.keys(approval.approvedInputs);if(approved.length!==16)throw Error('GK-only approved scope must be exactly16');
 const localized=(v:unknown):LocalizedText=>{if(!v||typeof v!=='object'||!['fi','en','sv','th'].every(l=>typeof (v as any)[l]==='string'&&(v as any)[l].trim()))throw Error('Missing GK-only locale text');return v as LocalizedText;};
 return approved.map(id=>{
  const c=cases.find((c:Case)=>c.recipeId===id);if(!c||c.inputSha256!==approval.approvedInputs[id]||c.level==='C')throw Error('GK-only input not approved: '+id);
  const r=evaluate(c,comps,gis),g=gold.find((g:any)=>g.recipeId===id);
  if(!r.numericProposal||r.blockers.length||!g||digest({recipeId:r.recipeId,level:r.level,numericProposal:r.numericProposal,point:r.point,scenarioRange:r.scenarioRange,omittedCho:r.omittedCho})!==digest(g))throw Error('GK-only calculation changed: '+id);
  const usedGi=[...new Set(c.candidateIngredients.flatMap(i=>i.giId?[i.giId]:[]))].map(id=>gis.find(g=>g.id===id)!);
  const usedComps=[...new Set(c.candidateIngredients.map(i=>i.compositionId))].map(id=>comps.find(c=>c.id===id)!);
  const sources:GkOnlyVariant['sources']=[...usedGi.map(g=>({title:g.locator,url:g.sourceUrl,kind:g.kind==='NAMED_HUMAN_GI'?'HUMAN_GI' as const:g.kind==='PROPOSED_B_CODING'?'B_CODING' as const:'PUBLISHED_CODING' as const,note:g.limitation})),...usedComps.map(f=>({title:f.name,url:f.kind==='PHYSICAL_MASS_CAP'?'#gk-only-method':(f as any).url,kind:['PHYSICAL_MASS_CAP','LABEL_ROUNDING_CAP'].includes(f.kind)?'BOUND' as const:'CARBOHYDRATE' as const,note:f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'?'FSANZ AFCD Release3 available carbohydrate WITHOUT sugar alcohols; Australian composition proxy; CC BY-SA3.0 Australia. Total polyols not inferred.':f.kind==='FINELI_CHOAVL'?'THL Fineli Release20 available carbohydrate; CC BY4.0. Total polyols not inferred.':f.nativeField}))];
  const preparation=localized(copy.preparation[id]);for(const text of Object.values(preparation)){
   for(const match of text.matchAll(/\{\{amount:(\d+)\}\}/g)){const i=c.candidateIngredients[Number(match[1])];if(!i||i.grams<=0)throw Error('Invalid preparation quantity token');}
   if(text.replace(/\{\{(?:servings|amount:\d+)\}\}/g,'').includes('{{'))throw Error('Unknown preparation token');
  }
  return {recipeId:id,versionId:'gk149-'+c.inputSha256.slice(0,12),inputSha256:c.inputSha256,level:c.level,servings:c.servings,point:r.point,scenarioRange:r.scenarioRange,rangeKind:r.rangeKind,omittedCho:r.omittedCho,confidence:'LOW',macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',ingredients:c.candidateIngredients.map(i=>({name:localized(copy.specialNames[i.name]??copy.ingredientNames[i.compositionId]),grams:i.grams===0&&comps.find(c=>c.id===i.compositionId)?.availablePer100g===0?null:i.grams})),preparation:localized(copy.preparation[id]),codingKinds:usedGi.flatMap(g=>g.id==='plant50'?['PLANT50' as const]:g.id==='trace50'?['TRACE50' as const]:[]),sensitivity:r.assumptionSensitivity,sources};
 });
}
