import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {applyGk80Release,loadPacks} from '../scripts/gk80-release';
import {siteContent} from '../src/generated/content.generated';
const root=fileURLToPath(new URL('../../',import.meta.url));
const json=(f:string)=>JSON.parse(readFileSync(path.join(root,f),'utf8'));
const ids=new Set<string>(json('docs/nutrition/gk80-integration-12/manifest.json').recipeIds);
test('actual combined build adds exactly twelve, preserving all 314 other result objects',async()=>{
 const report=json('tmp/nutrition/glycemic-load-pilot.json');
 const baseline=json('docs/nutrition/gk80-release-1/legacy-baseline.json').recipes;
 assert.equal(ids.size,12);assert.equal(report.results.length,326);assert.equal(report.summary.calculated,95);assert.equal(report.summary.insufficientSourceData,231);
 let changed=0,unchanged=0;
 for(const old of baseline){const now=report.results.find((r:{recipeId:string})=>r.recipeId===old.recipeId);assert.ok(now);
  if(ids.has(old.recipeId)){changed++;assert.equal(old.status,'INSUFFICIENT SOURCE DATA');assert.equal(now.status,'CALCULATED');assert.equal(now.assessmentType,'PUBLISHED_IMPUTATION');assert.equal(now.confidence,'LOW');assert.equal(now.omittedAvailableCarbohydratePerServingG,0);}
  else{unchanged++;assert.equal(createHash('sha256').update(JSON.stringify(now)).digest('hex'),old.sha256,old.recipeId);}
 }
 assert.equal(changed,12);assert.equal(unchanged,314);assert.equal((await applyGk80Release(root,report.results)).length,326);
});
test('all twelve generated macros match independently verified Decimal data',async()=>{
 for(const pack of await loadPacks(root))for(const r of pack.recipes){
  const live=siteContent.recipes.find(x=>x.recipeId===r.recipeId&&x.locale==='fi')!;assert.ok(live);
  const g=pack.golden.find((g:{recipeId:string})=>g.recipeId===r.recipeId).scenarios[0].macros;
  const round=(v:number)=>Math.round(v*100)/100;
  assert.deepEqual(live.nutrition,{carbsNetG:round(g.availableCarbohydrate),carbsTotalG:round(g.availableCarbohydrate+g.fibre),proteinG:round(g.protein),fatG:round(g.fat)},r.recipeId);
 }
});
async function fixture(fn:(dir:string)=>Promise<void>){
 const dir=await mkdtemp(path.join(tmpdir(),'gk80-integration-'));
 try{await cp(path.join(root,'docs/nutrition/gk80-release-registry.json'),path.join(dir,'docs/nutrition/gk80-release-registry.json'),{recursive:true});for(const n of [1,2])await cp(path.join(root,`docs/nutrition/gk80-release-${n}`),path.join(dir,`docs/nutrition/gk80-release-${n}`),{recursive:true});await fn(dir);}finally{await rm(dir,{recursive:true,force:true});}
}
async function mutate(dir:string,n:number,file:string,fn:(v:any)=>void){
 const f=path.join(dir,`docs/nutrition/gk80-release-${n}`,file),v=JSON.parse(await readFile(f,'utf8'));fn(v);const text=JSON.stringify(v);await writeFile(f,text);
 const reg=path.join(dir,'docs/nutrition/gk80-release-registry.json'),r=JSON.parse(await readFile(reg,'utf8'));r.requiredPacks[n-1].sha256[file]=createHash('sha256').update(text).digest('hex');await writeFile(reg,JSON.stringify(r));
}
test('both packs are mandatory; missing package or recipe fails closed',async()=>{
 await fixture(async dir=>{await rm(path.join(dir,'docs/nutrition/gk80-release-1'),{recursive:true});await assert.rejects(loadPacks(dir),/ENOENT/);});
 await fixture(async dir=>{await mutate(dir,2,'recipes.json',v=>v.recipes.pop());await assert.rejects(loadPacks(dir),/GK80_RELEASE_SCOPE/);});
});
test('changed source, wrong package version, duplicate IDs and stale recipe fail closed',async()=>{
 await fixture(async dir=>{await writeFile(path.join(dir,'docs/nutrition/gk80-release-2/sources.json'),'{}');await assert.rejects(loadPacks(dir),/GK80_PACK_HASH/);});
 await fixture(async dir=>{await mutate(dir,2,'manifest.json',v=>v.packVersion++);await assert.rejects(loadPacks(dir),/GK80_PACK_ID_VERSION/);});
 await fixture(async dir=>{await mutate(dir,2,'recipes.json',v=>v.recipes[1]=v.recipes[0]);await assert.rejects(loadPacks(dir),/GK80_RELEASE_SCOPE/);});
 await fixture(async dir=>{const packs=await loadPacks(root);const r=packs[0].recipes[0];await cp(path.join(root,r.sourcePath),path.join(dir,r.sourcePath),{recursive:true});await writeFile(path.join(dir,r.sourcePath),'stale');await assert.rejects(applyGk80Release(dir,[]),/STALE_INPUT/);});
});
