import {readFile} from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import {type Recipe,type Source,type CompositionSource} from './gk80-candidate-model';
import {calculateCandidate as calculate} from './gk80-candidate-policy';
import type {GlycemicLoadResult} from './glycemic-load-model';
import {classifyGk80Source, type EvidenceKind, type ApplicationKind} from './gk80-source-classification';
type Ref={title:string;url:string;matchKind:'EXACT'|'ANALOG'|'CALCULATION_POLICY';evidenceKind:EvidenceKind;applicationKind:ApplicationKind;confidence:'LOW';note:string};
type Extended=GlycemicLoadResult&{assessmentType?:'PUBLISHED_IMPUTATION';modelScenario?:'POINT_SCENARIO'|'NAMED_SCENARIO_RANGE';candidateSources?:Ref[];candidateCarbohydrateSources?:Array<{title:string;url:string;note:string}>};
export async function loadPacks(root:string){
 const registry=JSON.parse(await readFile(path.join(root,'docs/nutrition/gk80-release-registry.json'),'utf8'));
 if(registry.schemaVersion!==1||!Array.isArray(registry.requiredPacks)||!registry.requiredPacks.length)throw Error('GK80_REGISTRY_SCHEMA');
 const found=[];const allIds=new Set<string>();const folders=new Set<string>();
 for(const pack of registry.requiredPacks){
  if(!/^gk80-release-[1-9][0-9]*$/.test(pack.folder)||folders.has(pack.folder)||!Number.isInteger(pack.version))throw Error('GK80_PACK_ID_VERSION');folders.add(pack.folder);
  const folder=path.join(root,'docs/nutrition',pack.folder);
  const json=async(n:string)=>{const text=await readFile(path.join(folder,n),'utf8');if(createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex')!==pack.sha256[n])throw Error('GK80_PACK_HASH: '+pack.folder+'/'+n);return JSON.parse(text);};
  const manifest=await json('manifest.json'),recipes:(Recipe&{sourcePath:string})[]=(await json('recipes.json')).recipes;
  const sorted=(a:string[])=>JSON.stringify([...a].sort());
  if(manifest.schemaVersion!==1||manifest.packId!==pack.folder||manifest.packVersion!==pack.version)throw Error('GK80_PACK_ID_VERSION');
  if(sorted(manifest.recipeIds)!==sorted(pack.recipeIds)||recipes.length!==pack.recipeIds.length||new Set(recipes.map(r=>r.recipeId)).size!==pack.recipeIds.length||sorted(recipes.map(r=>r.recipeId))!==sorted(pack.recipeIds))throw Error('GK80_RELEASE_SCOPE');
  for(const id of pack.recipeIds){if(allIds.has(id))throw Error('GK80_DUPLICATE_RECIPE');allIds.add(id);}
  const golden=(await json('golden.json')).recipes;
  if(golden.length!==recipes.length||sorted(golden.map((g:{recipeId:string})=>g.recipeId))!==sorted(pack.recipeIds))throw Error('GK80_GOLDEN_SCOPE');
  found.push({recipes,sources:(await json('sources.json')).records as Source[],comps:(await json('composition-sources.json')).records as CompositionSource[],golden});
 }
 return found;
}
export async function validateGk80Candidate(root:string,recipeId:string):Promise<boolean>{
 for(const pack of await loadPacks(root)){
  const r=pack.recipes.find(r=>r.recipeId===recipeId);if(!r)continue;
  const text=(await readFile(path.join(root,r.sourcePath),'utf8')).replaceAll('\r\n','\n');
  const hash=createHash('sha256').update(text).digest('hex');
  const golden=pack.golden.find((g:{recipeId:string})=>g.recipeId===recipeId);
  return calculate(r,pack.sources,hash,golden.inputHash,pack.comps).numericProposal;
 }
 return false;
}
export async function applyGk80Release(root:string,legacy:GlycemicLoadResult[]):Promise<Extended[]>{
 const out:Extended[]=[...legacy];
 for(const {recipes,sources,comps,golden} of await loadPacks(root)){
 for(const r of recipes){
  const current=createHash('sha256').update((await readFile(path.join(root,r.sourcePath),'utf8')).replaceAll('\r\n','\n')).digest('hex');
  const expected=golden.find((g:{recipeId:string})=>g.recipeId===r.recipeId);
  const result=calculate(r,sources,current,expected.inputHash,comps);if(!result.numericProposal)throw Error('GK80_RELEASE_INCOMPLETE');
  const index=out.findIndex(x=>x.recipeId===r.recipeId);if(index<0)throw Error('GK80_RELEASE_UNKNOWN_ID');
  const s=result.scenarios[0],map=new Map(sources.map(x=>[x.id,x]));
  const used=[...new Set(r.scenarios.flatMap(s=>s.ingredients.flatMap(i=>i.giId?[i.giId]:i.impact?[i.impact.sourceId]:[])))];
  const ids=[...new Set(r.scenarios.flatMap(s=>s.ingredients.flatMap(i=>i.composition?[i.composition.sourceId]:[])))];
  out[index]={...out[index],status:'CALCULATED',servings:r.servings,unroundedGlycemicLoadPerServing:result.min,
   glycemicLoadPerServing:Math.round(result.min!*100)/100,glycemicLoadRangePerServing:result.min!==result.max?{min:result.min!,max:result.max!}:null,
   omittedAvailableCarbohydratePerServingG:0,omittedAvailableCarbohydrateUpperBoundPerServingG:0,confidence:'LOW',blockers:[],assessmentType:'PUBLISHED_IMPUTATION',modelScenario:r.scenarios.length>1?'NAMED_SCENARIO_RANGE':'POINT_SCENARIO',
   interpretation:'Modeled ingredient-sum estimate with published vegetable GI assignment and named preparation analogues; no measured meal response or physiological uncertainty bound.',
   ingredients:r.scenarios[0].ingredients.map((i,n)=>({name:i.name,grams:i.massG,fineliRecordId:i.composition?.sourceId??null,
    availableCarbohydratePer100g:i.per100g?.availableCarbohydrate??null,availableCarbohydratePerServingG:s.contributions[n].carbohydrate,
    availableCarbohydratePerServingRangeG:null,gi:map.get(i.giId??i.impact?.sourceId??'')?.gi??null,giRecordId:i.giId??i.impact?.sourceId??null,
    qualityTier:null,matchKind:null,confidence:'LOW',giContribution:s.contributions[n].gk,giContributionRange:null,giCandidates:[],issues:[]})),
   candidateSources:used.map(id=>{const source=map.get(id)!;return {title:String(source.food??id),url:String(source.sourceUrl),...classifyGk80Source(source.evidenceKind??'HUMAN_GI',r.scenarios.flatMap(s=>s.ingredients).filter(i=>(i.giId??i.impact?.sourceId)===id).every(i=>i.match==='DIRECT')?'DIRECT':'APPLIED'),confidence:'LOW',note:`GK80 ${source.evidenceKind??'HUMAN_GI'}: ${source.limitations??source.food}. Recipe-specific applicability: ${r.scenarios.flatMap(s=>s.ingredients).filter(i=>(i.giId??i.impact?.sourceId)===id).map(i=>i.applicability).join('; ')}`};}),
   candidateCarbohydrateSources:ids.map(id=>{const c=comps.find(x=>x.id===id)!,rec=c.sourceRecord as {name:string;sourceUrl:string;licence?:string};return {title:rec.name,url:rec.sourceUrl,note:rec.licence??'Identified composition source; available carbohydrate already excludes fibre and polyols.'};})};
 }
 }
 return out;
}
