import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {currentInventory,digest,evidenceState,folder,rankOriginalGaps,replayCase,verifyScope,type Read} from '../scripts/gk-original-solutions';
import {parseMarkdown} from '../src/content/markdown';
import {textHash} from '../scripts/gk149-model';
import {checkBatch} from '../scripts/gk100-approval-factory';
const root=resolve(import.meta.dirname,'../..');
const read:Read=p=>readFileSync(resolve(root,p),'utf8');
const json=(p:string)=>JSON.parse(read(p));
const manifest=json(folder+'cases.json');
const cases=manifest.cases.map((e:any)=>{assert.equal(textHash(read(e.path)),e.sha256Lf);return json(e.path);});
const cake=cases.find((c:any)=>c.recipeId==='vhh-mansikkakakku');
const override=(p:string,value:unknown):Read=>q=>q===p?JSON.stringify(value):read(q);

test('all 170 current gaps ranked, top 30 screened; pending review is not failed research',()=>{
 const inventory=currentInventory(root),screen=json(folder+'screening.json'),deep=json(folder+'deep-review.json');
 assert.deepEqual(inventory.counts,{total:326,originalNumeric:156,originalMissing:170,oneBlocker:57,target:261,targetGap:105});
 assert.equal(new Set(inventory.queue.map((r:any)=>r.recipeId)).size,170);
 assert.equal(screen.screenedCount,53);assert.equal(screen.oneBlockerScreened,32);assert.equal(deep.cases.length,11);
 assert.ok(inventory.queue.slice(0,30).every((r:any)=>screen.recipes.some((s:any)=>s.recipeId===r.recipeId)));
 assert.equal(evidenceState(['GI source has not yet been reviewed.']),'REVIEW_PENDING');
 assert.equal(evidenceState(['NO MATCH: original preparation']),'NO_RELIABLE_SOURCE_FOUND');
 assert.equal(evidenceState(['GI evidence is missing.']),'SOURCE_BINDING_UNRESOLVED');
 assert.equal(inventory.queue.find((r:any)=>r.recipeId==='tangyuan').rowAccounting,'RECONCILE_WHOLE_RECIPE_FIRST');
 assert.equal(inventory.queue.find((r:any)=>r.recipeId==='munakoiso-kesakurpitsalasagne').evidenceState,'REVIEW_PENDING');
});
test('candidate replay preserves withdrawals, positive omissions and approval boundaries',()=>{
 const replay=cases.map((c:any)=>({c,...replayCase(c,read)}));
 const strawberry=replay.find((r:any)=>r.c.recipeId===cake.recipeId)!;
 assert.equal(strawberry.result.unroundedGlycemicLoadPerServing,1.0745);
 assert.equal(strawberry.result.omittedAvailableCarbohydratePerServingG,.86718);
 assert.equal(strawberry.input.servings,10);assert.equal(strawberry.input.ingredients.length,8);
 const beef=replay.find((r:any)=>r.c.recipeId==='bulgogi')!;
 assert.equal(beef.result.glycemicLoadPerServing,null);
 assert.equal(beef.input.ingredients.filter((i:any)=>String(i.giMatchEvidence).includes('Prior review still withholds')).length,3);
 for(const r of replay){
  assert.equal(r.c.ownerApproval,false);assert.equal(r.c.scientificApproval,false);assert.equal(r.c.publicationAuthorized,false);
  if(r.c.recipeId.startsWith('keto-')){
   assert.equal(r.c.numericOriginalCandidate,false);assert.equal(r.result.glycemicLoadPerServing,0);
   assert.ok(r.result.omittedAvailableCarbohydratePerServingG>1);
   assert.equal(r.input.ingredients.find((i:any)=>i.name==='ripaus suolaa').grams,null);
   assert.throws(()=>replayCase({...r.c,numericOriginalCandidate:true},read),/all-omitted/);
  }
 }
});
test('changed own recipe, input, used source, native fact, model or locale stops replay',()=>{
 for(const c of cases){
  assert.throws(()=>verifyScope(c,p=>p===c.recipePath?read(p)+'\nchanged':read(p)),/recipe changed/);
  const input=json('docs/nutrition/glycemic-load-pilot-input.json');input.recipes.find((i:any)=>i.recipeId===c.recipeId).servings++;
  assert.throws(()=>verifyScope(c,override('docs/nutrition/glycemic-load-pilot-input.json',input)),/input changed/);
  for(const source of c.sourceRecords){
   const file=json(source.path),rows=Array.isArray(file)?file:source.kind==='GI'?file.records:file.foods;
   const row=rows.find((r:any)=>String(source.kind==='NATIVE'?r.source_id:r.id)===source.id);row.testMutation=true;
   assert.throws(()=>verifyScope(c,override(source.path,file)),/source changed/);
  }
  for(const p of [...Object.keys(c.methodFiles),...Object.keys(c.boundTextFiles??{})]){
   assert.throws(()=>verifyScope(c,q=>q===p?read(q)+'\nchanged':read(q)),/changed/);
  }
 }
});
test('unrelated recipe publication/input/source edits do not invalidate another capsule',()=>{
 const p='docs/nutrition/glycemic-load-pilot-input.json',input=json(p);
 input.recipes.find((i:any)=>i.recipeId!==cake.recipeId).servings++;
 assert.doesNotThrow(()=>replayCase(cake,override(p,input)));
 const fp='docs/nutrition/food-records.json',foods=json(fp),used=new Set(cake.sourceRecords.map((r:any)=>r.id));
 foods.find((f:any)=>!used.has(f.id)).testMutation=true;
 assert.doesNotThrow(()=>replayCase(cake,override(fp,foods)));
 assert.doesNotThrow(()=>replayCase(cake,q=>q==='reseptit/other-recipe.md'?'changed':read(q)));
 // A newly published other original leaves the remaining queue and candidate usable.
 const report=structuredClone(json('tmp/nutrition/glycemic-load-pilot.json'));
 const other=report.results.find((r:any)=>r.recipeId!==cake.recipeId&&r.status!=='CALCULATED');other.status='CALCULATED';
 const originals=Object.fromEntries(json(folder+'priority-snapshot.json').queue.map((r:any)=>[r.recipeId,{path:r.recipePath,ingredients:Array.from({length:r.originalIngredientCount})}]));
 const queue=rankOriginalGaps(report,json(p).recipes,originals);
 assert.equal(queue.length,169);assert.ok(queue.some((r:any)=>r.recipeId===cake.recipeId));
 assert.doesNotThrow(()=>replayCase(cake,read));
});
test('stale dose omission, missing salt proof and seasoning mixture cannot be admitted',()=>{
 const mud=structuredClone(cases.find((c:any)=>c.recipeId==='keto-mutakakku'));
 mud.patches.find((p:any)=>p.name==='kaakaojauhetta').changes.estimatedAvailableCarbohydratePerServingG=.1375;
 assert.throws(()=>replayCase(mud,read),/Stale omission/);
 const salt=structuredClone(cases.find((c:any)=>c.recipeId==='keto-mutakakku'));
 salt.sourceRecords=salt.sourceRecords.filter((s:any)=>s.purpose!=='PLAIN_SALT');
 assert.throws(()=>replayCase(salt,read),/native-zero evidence missing/);
 const mixture=structuredClone(cases.find((c:any)=>c.recipeId==='keto-mutakakku'));
 mixture.patches.find((p:any)=>p.kind==='NATIVE_ZERO_SALT').changes.grams=0;
 assert.throws(()=>replayCase(mixture,read),/Unsupported research patch/);
 const approved={...cake,ownerApproval:true};assert.throws(()=>replayCase(approved,read),/cannot grant approval/);
});
test('whole publication and historical baseline remain intact, including all 87 variants',()=>{
 const baseline=json(folder+'publication-baseline.json'),report=json('tmp/nutrition/glycemic-load-pilot.json');
 assert.equal(digest(report.results),baseline.resultsSha256);assert.equal(digest(report.gkOnlyVariants),baseline.variantsSha256);
 assert.equal(report.gkOnlyVariants.length,87);assert.equal(Object.keys(baseline.acceptedOriginalHashes).length,156);
 for(const [p,hash] of Object.entries(baseline.macroFiles))assert.equal(textHash(read(p)),hash,p);
 const historic=baseline.historical291;
 const raw=execFileSync('git',['show',historic.commit+':'+historic.baselinePath],{cwd:root,encoding:'utf8'});
 assert.equal(textHash(raw),historic.baselineSha256Lf);
});
test('Factory technical PASS remains REVIEW_REQUIRED and cannot grant publication',()=>{
 const checked=checkBatch(json(folder+'factory-batch.json'),read).manifest;
 assert.deepEqual(checked,json(folder+'factory-check.json'));
 const candidate=checked.candidates[0];
 assert.equal(candidate.technical,'PASS');assert.equal(candidate.state,'REVIEW_REQUIRED');
 assert.equal(candidate.ownerStatus,'PENDING');assert.equal(candidate.publicationAuthorized,false);
 const packet=json('docs/nutrition/gk-original-batch02-mansikka-release-candidate.json');
 assert.equal(packet.ingredients.length,8);assert.equal(packet.servings,10);assert.equal(packet.publicationAuthorized,false);
 const original=parseMarkdown(read(cake.recipePath))!.data.ingredients as any[];
 const proposed=replayCase(cake,read).input;
 [4,5,6,1,0,2,3,7].forEach((originalIndex,packetIndex)=>{
  assert.equal(packet.ingredients[packetIndex].name.fi,original[originalIndex].item);
  assert.equal(packet.ingredients[packetIndex].grams,proposed.ingredients[originalIndex].grams);
 });
});
