/** Six exact A versions explicitly approved in the scoped2026-11-02 owner reply. */
import {readFileSync} from 'node:fs';import path from 'node:path';
import {loadPilot,evaluate,verifyCase,verifyComposition,textHash,digest,type Case,type Composition,type GI} from './gk149-model';
import {loadRecovery} from './gk149-recovery';
import {loadPreparedRoute} from './gk149-prepared-route';
import {labelAvailableUpper} from '../../docs/research/afcd-polyol-03/label-carbohydrate-upper';
import {mextAvailableMass} from '../../docs/research/afcd-polyol-03/mext-available-source';
import type {GkOnlyVariant,LocalizedText} from '../src/features/recipes/gk-only-types';
const folder='docs/nutrition/gk80-operation149/',ext='docs/research/afcd-polyol-03/source-extensions/';
const packetPath='docs/research/afcd-polyol-03/six-a-review-packet.json';
const packetSeal='92a3e56aae708ef8a5c85ba897c04dec1d6970a94ba30e4300c429111348095d';
const requiredFiles=[packetPath,...['cases.jsonl','composition-sources.json','gi-sources.json','source-observations.json','product-observations.json','mext-native-observations.json'].map(n=>ext+n),...['label-carbohydrate-upper.ts','mext-available-source.ts'].map(n=>'docs/research/afcd-polyol-03/'+n),...['composition-sources.json','gi-sources.json','source-observations.json','recovery-cases.json','recovery-composition.json','recovery-gi.json','recovery-observations.json','prepared-route-cases.json','prepared-route-composition.json','prepared-route-gi.json','prepared-route-observations.json'].map(n=>folder+n)].sort();
const read=(root:string,p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
export function verifyApprovedSix(root:string,a:any){
 if(a.schemaVersion!==1||a.methodAndContentApproved!==true||a.integrationAuthorized!==true||a.answer!=='Kyllä, hyväksyn kuuden version paketin integraatioon'||a.releaseAuthorized!==false||a.readyAuthorized!==false||a.mergeAuthorized!==false||a.deployAuthorized!==false||a.approvedReferenceHead!=='fc8e2cbddc8d7fabd3df1cb4439db23d79d97964')throw Error('Six-version owner approval missing or scope changed');
 if(digest(a.admittedSourceFamilies)!==digest(['MEXT2023_CHOAVL_MASS_NATTO04046_ONLY','IFCT2017_TABLE6_AVAILABLE_CHO_G010_ONLY']))throw Error('Source-family approval scope changed');
 const p=read(root,packetPath),{packetBodySha256,...body}=p;
 if(packetBodySha256!==packetSeal||digest(body)!==packetSeal||a.packetBodySha256!==packetSeal)throw Error('Six-version approved packet changed');
 if(digest(Object.keys(a.approvedSourceFilesLfSha256??{}).sort())!==digest(requiredFiles))throw Error('Six-version source binding incomplete');
 for(const file of requiredFiles)if(textHash(readFileSync(path.join(root,file),'utf8'))!==a.approvedSourceFilesLfSha256[file])throw Error('Six-version source pack changed: '+file);
 const expected=Object.fromEntries(p.cases.map((c:any)=>[c.recipeId,c.inputSha256]));
 if(Object.keys(expected).length!==6||digest(a.approvedInputs)!==digest(expected))throw Error('Six-version exact approved scope changed');
 return p;
}
const merge=<T extends {id:string}>(base:T[],extra:T[])=>base.filter(b=>!extra.some(e=>e.id===b.id)).concat(extra);
export function loadApprovedSix(root:string){
 const approval=read(root,folder+'approved-six-owner-approval.json'),packet=verifyApprovedSix(root,approval);
 const base=loadPilot(root),recovery=loadRecovery(root),prepared=loadPreparedRoute(root);
 const extraComps=read(root,ext+'composition-sources.json').records as Composition[],extraGis=read(root,ext+'gi-sources.json').records as GI[];
 const products=read(root,ext+'product-observations.json'),mext=read(root,ext+'mext-native-observations.json');
 const comps=merge(base.comps,extraComps),gis=merge(base.gis,extraGis);
 const cases=readFileSync(path.join(root,ext+'cases.jsonl'),'utf8').trim().split('\n').map(l=>JSON.parse(l)) as Case[];
 const copy=read(root,folder+'approved-six-public-copy.json'),gold=read(root,folder+'approved-six-golden.json');
 return packet.cases.map((p:any)=>{
  const ctx=p.origin==='local'?{cases,comps,gis}:p.recipeId==='pad-kee-mao-vhh-konjac'?recovery:prepared;
  const c=ctx.cases.find((c:Case)=>c.recipeId===p.recipeId);
  if(!c||c.level!=='A'||c.inputSha256!==approval.approvedInputs[c.recipeId])throw Error('Unapproved six-version input');
  verifyCase(root,c);
  for(const i of c.candidateIngredients){
   const f=ctx.comps.find((f:Composition)=>f.id===i.compositionId)!;
   if(!f)throw Error('Missing approved composition');
   if(p.origin==='local'){
    if(f.kind==='LABEL_CARBOHYDRATE_UPPER'){
     const native=products.records.find((o:any)=>o.id===f.nativeId);if(!native||digest(native)!==f.nativeRowSha256||i.carbohydrateUse!=='UPPER_BOUND'||i.giId!==null||labelAvailableUpper(native,'g').availableUpper!==f.availablePer100g)throw Error('Approved label bound changed');
    }else if(f.kind==='MEXT_CHOAVL_MASS'){
     const native=mext.records.find((r:any)=>r.nativeId===f.nativeId);if(!native||digest(native)!==f.nativeRowSha256||f.nativeField!=='CHOAVL'||f.nativeId!=='04046'||mextAvailableMass(mext,f.nativeId).availablePer100g!==f.availablePer100g)throw Error('Approved MEXT native mass changed');
    }else verifyComposition(root,f);
    if(i.giId){
     const g=ctx.gis.find((g:GI)=>g.id===i.giId)!;if(!g||g.kind==='PROPOSED_B_CODING')throw Error('New B coding outside approved six A scope');
     const source=read(root,g.path),native=(Array.isArray(source)?source:source.records).find((n:any)=>n.id===g.nativeId);
     if(!native||digest(native)!==g.nativeRowSha256||digest(g.values)!==digest(typeof native.gi==='number'?[native.gi]:native.values))throw Error('Approved GI source changed');
    }
   }
  }
  if(c.recipeId==='japanilainen-dashimaki-tamago-aamiaislautasella'){
   const o=products.records.find((o:any)=>o.id==='hondashi-th-dilution');
   if(!o||o.powderGrams*o.recipePreparedSoupMl!==o.recipePowderGrams*o.preparedSoupMl||c.candidateIngredients.find(i=>i.compositionId==='physical')?.grams!==o.recipePowderGrams)throw Error('Approved Hondashi dilution changed');
  }
  const r=evaluate(c,ctx.comps,ctx.gis),expected=gold.results.find((g:any)=>g.recipeId===c.recipeId);
  if(!r.numericProposal||r.blockers.length||r.point!==p.point||!expected||digest({recipeId:r.recipeId,point:r.point,omittedCho:r.omittedCho})!==digest(expected))throw Error('Approved six-version arithmetic changed: '+c.recipeId);
  return {c,r,comps:ctx.comps,gis:ctx.gis,copy};
 });
}
const compositionUrl=(root:string,f:any):string=>{
 if(f.kind==='PHYSICAL_MASS_CAP')return '#gk-only-method';
 if(f.url??f.sourceUrl)return f.url??f.sourceUrl;
 if(f.kind==='IFCT_ANALYTICAL_AVAILABLE_CHO')return read(root,f.path).ifctRecords.find((r:any)=>r.foodCode===f.nativeId).sourceUrl;
 if(f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS')return 'https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd';
 throw Error('Missing exact source URL: '+f.id);
};
const localized=(v:any):LocalizedText=>{if(!v||!['fi','en','sv','th'].every(l=>typeof v[l]==='string'&&v[l].trim()))throw Error('Missing six-version locale text');return v;};
export function buildApprovedSixVariants(root:string):GkOnlyVariant[]{
 return loadApprovedSix(root).map(({c,r,comps,gis,copy}:any)=>{
  const usedGi=[...new Set(c.candidateIngredients.flatMap((i:any)=>i.giId?[i.giId]:[]))].map(id=>gis.find((g:any)=>g.id===id));
  const usedComps=[...new Set(c.candidateIngredients.map((i:any)=>i.compositionId))].map(id=>comps.find((f:any)=>f.id===id));
  const sources:GkOnlyVariant['sources']=[...usedGi.map((g:any)=>({title:g.locator,url:g.sourceUrl,kind:g.kind==='NAMED_HUMAN_GI'?'HUMAN_GI' as const:'PUBLISHED_CODING' as const,note:g.limitation})),...usedComps.map((f:any)=>({title:f.name,url:compositionUrl(root,f),kind:['PHYSICAL_MASS_CAP','LABEL_CARBOHYDRATE_UPPER','MANUFACTURER_TOTAL_CHO_CEILING'].includes(f.kind)?'BOUND' as const:'CARBOHYDRATE' as const,note:f.kind==='MEXT_CHOAVL_MASS'?'日本食品標準成分表（八訂）増補2023年から引用. Native published CHOAVL mass; unknown polyols/components not zero. No macro approval.':f.kind==='LABEL_CARBOHYDRATE_UPPER'||f.kind==='MANUFACTURER_TOTAL_CHO_CEILING'?'Nominal manufacturer source-model carbohydrate upper only; not zero or an analytical/lot-variability bound. Unknown polyols retained.':f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'?'FSANZ AFCD Release3 available carbohydrate WITHOUT sugar alcohols; Australian composition proxy; CC BY-SA3.0 Australia. Total polyols not inferred.':f.kind==='FINELI_CHOAVL'?'THL Fineli Release20 available carbohydrate; CC BY4.0. Total polyols not inferred.':f.nativeField}))];
  if(c.recipeId==='japanilainen-dashimaki-tamago-aamiaislautasella'){const o=read(root,ext+'product-observations.json').records.find((o:any)=>o.id==='hondashi-th-dilution');sources.push({title:'Hondashi manufacturer dilution:7g/litre finished broth',url:o.sourceUrl,kind:'BOUND',note:o.scope});}
  if(sources.some(s=>!s.url||(!s.url.startsWith('https://')&&s.url!=='#gk-only-method')))throw Error('Missing six-version public source URL');
  const preparation=localized(copy.preparation[c.recipeId]);for(const text of Object.values(preparation)){
   for(const match of text.matchAll(/\{\{amount:(\d+)\}\}/g))if(!c.candidateIngredients[Number(match[1])]?.grams)throw Error('Invalid six-version quantity token');
   if(text.replace(/\{\{(?:servings|amount:\d+)\}\}/g,'').includes('{{'))throw Error('Unknown six-version preparation token');
  }
  return {recipeId:c.recipeId,versionId:'gk149-'+c.inputSha256.slice(0,12),inputSha256:c.inputSha256,level:'A',servings:c.servings,point:r.point,scenarioRange:null,rangeKind:null,omittedCho:r.omittedCho,confidence:'LOW',macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',ingredients:c.candidateIngredients.map((i:any)=>({name:localized(copy.ingredientNames[i.name]),grams:i.grams===0&&comps.find((f:any)=>f.id===i.compositionId)?.availablePer100g===0?null:i.grams})),preparation,codingKinds:[],sensitivity:r.assumptionSensitivity,sources};
 });
}
