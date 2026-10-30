import {readFile} from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import {calculate,type Recipe,type Source,type CompositionSource} from './gk80-candidate-model';
import type {GlycemicLoadResult} from './glycemic-load-model';
import {classifyGk80Source, type EvidenceKind, type ApplicationKind} from './gk80-source-classification';
type Ref={title:string;url:string;matchKind:'EXACT'|'ANALOG'|'CALCULATION_POLICY';evidenceKind:EvidenceKind;applicationKind:ApplicationKind;confidence:'LOW';note:string};
type Extended=GlycemicLoadResult&{assessmentType?:'PUBLISHED_IMPUTATION';modelScenario?:'POINT_SCENARIO'|'NAMED_SCENARIO_RANGE';candidateSources?:Ref[];candidateCarbohydrateSources?:Array<{title:string;url:string;note:string}>};
export async function validateGk80Candidate(root:string,recipeId:string):Promise<boolean>{
 const folder=path.join(root,'docs/nutrition/gk80-release-1');
 const json=async(n:string)=>JSON.parse(await readFile(path.join(folder,n),'utf8'));
 const manifest=await json('manifest.json');if(!manifest.recipeIds.includes(recipeId))return false;
 const r=(await json('recipes.json')).recipes.find((r:Recipe)=>r.recipeId===recipeId);
 if(!r)throw Error('GK80_RELEASE_SCOPE');
 const text=(await readFile(path.join(root,r.sourcePath),'utf8')).replaceAll('\r\n','\n');
 const hash=createHash('sha256').update(text).digest('hex');
 const golden=(await json('golden.json')).recipes.find((g:{recipeId:string})=>g.recipeId===recipeId);
 return calculate(r,(await json('sources.json')).records,hash,golden.inputHash,(await json('composition-sources.json')).records).numericProposal;
}
export async function applyGk80Release(root:string,legacy:GlycemicLoadResult[]):Promise<Extended[]>{
 const folder=path.join(root,'docs/nutrition/gk80-release-1'),json=async(n:string)=>JSON.parse(await readFile(path.join(folder,n),'utf8'));
 const recipes:(Recipe&{sourcePath:string})[]=(await json('recipes.json')).recipes,sources:Source[]=(await json('sources.json')).records,comps:CompositionSource[]=(await json('composition-sources.json')).records,golden=(await json('golden.json')).recipes;
 const manifest=await json('manifest.json');
 if(recipes.length!==4||new Set(recipes.map(r=>r.recipeId)).size!==4||JSON.stringify(recipes.map(r=>r.recipeId))!==JSON.stringify(manifest.recipeIds))throw Error('GK80_RELEASE_SCOPE');
 const out:Extended[]=[...legacy];
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
   candidateSources:used.map(id=>{const source=map.get(id)!;return {title:String(source.food??id),url:String(source.sourceUrl),...classifyGk80Source(source.evidenceKind??'HUMAN_GI',r.scenarios.flatMap(s=>s.ingredients).filter(i=>(i.giId??i.impact?.sourceId)===id).every(i=>i.match==='DIRECT')?'DIRECT':'APPLIED'),confidence:'LOW',note:`GK80 ${source.evidenceKind??'HUMAN_GI'}: ${source.limitations??source.food}. Recipe-specific applicability: ${r.scenarios[0].ingredients.filter(i=>(i.giId??i.impact?.sourceId)===id).map(i=>i.applicability).join('; ')}`};}),
   candidateCarbohydrateSources:ids.map(id=>{const c=comps.find(x=>x.id===id)!,rec=c.sourceRecord as {name:string;sourceUrl:string;licence?:string};return {title:rec.name,url:rec.sourceUrl,note:rec.licence??'Identified composition source; available carbohydrate already excludes fibre and polyols.'};})};
 }
 return out;
}
