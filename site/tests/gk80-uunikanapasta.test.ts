import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {calculateRecovery,loadRecovery,validateRecovery,applyRecovery,recoveryRecipeId,recoveryEvidenceHash} from '../scripts/gk80-uunikanapasta';
import {calculate,normalizeCarbohydrate} from '../scripts/nutrition-model';
import {fingerprint} from '../scripts/gk80-candidate-model';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
import {parseMarkdown} from '../src/content/markdown';
import {siteContent} from '../src/generated/content.generated';
import {glycemicLoadPilotResults} from '../src/generated/glycemic-load-pilot.generated';

const root=fileURLToPath(new URL('../../',import.meta.url)),folder=path.join(root,'docs/nutrition/gk80-uunikanapasta-release');
const json=(f:string)=>JSON.parse(readFileSync(path.join(root,f),'utf8'));
const evidence=()=>json('docs/nutrition/calculations/uunikanapasta-kesakurpitsa.json');
const sha=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('recovery single approved proposal reproduces all three stable display scenarios',async()=>{
 const e=evidence();assert.equal(fingerprint(e),recoveryEvidenceHash);
 const {result}=await loadRecovery(root,recoveryRecipeId);
 assert.equal(result.scenarios.length,3);assert.equal(result.gk.value,3);
 for(const s of result.scenarios){assert.deepEqual(Object.values(s.macros).map(m=>m.value),[7.4,10.4,39.53,23.91]);assert.equal(s.gk.value,3);assert.ok(s.gk.upper<=10);assert.ok(s.gk.upper-s.gk.lower<=.1);}
 assert.deepEqual([result.gk.lower,result.gk.upper],[2.736325,2.826025]);
 assert.equal(result.unknownAggregatePolyols,null);assert.equal(result.wholeGkPoint,null);
 const text=readFileSync(path.join(root,'reseptit/paaruoat/uunikanapasta-kesakurpitsa.md'),'utf8'),parsed=parseMarkdown(text)!;
 assert.deepEqual(verifyNutritionEvidence(parsed.data as never,e).errors,[]);
 const live=siteContent.recipes.filter(r=>r.recipeId===recoveryRecipeId);assert.equal(live.length,1);assert.equal(live[0].locale,'fi');
 assert.deepEqual(live[0].nutrition,{carbsNetG:7.4,carbsTotalG:10.4,proteinG:39.53,fatG:23.91});
});
test('recovery rejects changed IDs, portions, preparation, sources, GI, unknown polyols and display precision',()=>{
 for(const mutate of [
  (e:any)=>e.recipeId='vhh-kaalilaatikko',
  (e:any)=>e.servings=5,
  (e:any)=>e.ingredients[8].amount=1,
  (e:any)=>e.recoveryC.candidate.preparation[0]+=' changed',
  (e:any)=>e.recoveryC.sources[0].gi=41,
  (e:any)=>e.recoveryC.comps[0].per100g.fat=0,
  (e:any)=>e.recoveryC.reviewedCase.pilot.ingredients[8].aggregatePolyolPer100g='0',
  (e:any)=>e.recoveryC.displayProposal.display.carbsNetG.decimalPlaces=2,
  (e:any)=>e.recoveryC.biologicalBoundEstablished=true,
  (e:any)=>e.recoveryC.approvedDisplayProposal='0'.repeat(64),
 ]){const e=evidence();mutate(e);assert.throws(()=>calculateRecovery(e));}
 assert.throws(()=>calculateRecovery({...evidence(),recipeId:'jauheliha-kaalikeitto-vhh'}),/RECIPE_NOT_APPROVED/);
 assert.equal(calculate(evidence()).status,'INSUFFICIENT SOURCE DATA');
 const pepper=evidence().recoveryC.reviewedCase.pilot.ingredients[8];
 assert.equal(pepper.aggregatePolyolPer100g,null);
 assert.equal(normalizeCarbohydrate({id:'pepper',name:'pepper',sourceUrl:'https://www.foodstandards.gov.au/',retrievedAt:'2026-11-01',licence:'AFCD CC BY-SA3.0 Australia',state:'ground',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',polyolsSourceVerified:false,per100g:{carbohydrate:38.6,fibre:25.3,polyols:null}}).net,null);
});
test('recovery full recipe text drift fails closed and release collisions cannot overwrite calculated recipes',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'gk80-uuni-test-'));
 try{
  await mkdir(path.join(dir,'docs/nutrition/calculations'),{recursive:true});await mkdir(path.join(dir,'reseptit/paaruoat'),{recursive:true});
  await writeFile(path.join(dir,'docs/nutrition/calculations',recoveryRecipeId+'.json'),JSON.stringify(evidence()));
  await writeFile(path.join(dir,'reseptit/paaruoat',recoveryRecipeId+'.md'),'changed preparation');
  await assert.rejects(()=>loadRecovery(dir,recoveryRecipeId),/STALE_PREPARATION/);
 }finally{assert.ok(path.resolve(dir).startsWith(path.resolve(tmpdir())+path.sep));assert.ok(path.basename(dir).startsWith('gk80-uuni-test-'));await rm(dir,{recursive:true,force:true});}
 assert.equal(await validateRecovery(root,'vhh-kaalilaatikko'),false);
 const current=json('tmp/nutrition/glycemic-load-pilot.json').results;
 await assert.rejects(()=>applyRecovery(root,current),/RELEASE_COLLISION/);
});
test('recovery current main regression changes exactly one object and retains all130 numeric values',()=>{
 const actual=json('tmp/nutrition/glycemic-load-pilot.json'),base=json('docs/nutrition/gk80-uunikanapasta-release/main-baseline.json');
 assert.equal(actual.results.length,326);assert.equal(actual.summary.calculated,131);assert.equal(actual.summary.insufficientSourceData,195);
 let changed=0,preservedNumeric=0;
 for(const b of base.resultHashes){const r=actual.results.find((r:any)=>r.recipeId===b.recipeId);assert.ok(r);
  if(b.recipeId===recoveryRecipeId){assert.equal(b.status,'INSUFFICIENT SOURCE DATA');assert.equal(r.status,'CALCULATED');assert.equal(r.glycemicLoadPerServing,3);assert.equal(r.unroundedGlycemicLoadPerServing,null);assert.equal(r.closedRecoveryC,true);changed++;}
  else{assert.equal(sha(r),b.sha256,b.recipeId);if(b.status==='CALCULATED')preservedNumeric++;}
 }
 assert.equal(changed,1);assert.equal(preservedNumeric,130);
 const pub=glycemicLoadPilotResults.find(r=>r.recipeId===recoveryRecipeId)!;assert.equal(pub.closedRecoveryC,true);assert.equal(pub.confidence,'LOW');
 for(const rid of ['kiinalainen-teehaudutetut-munat','jauheliha-kaalikeitto-vhh','vhh-kaalilaatikko'])assert.equal(actual.results.find((r:any)=>r.recipeId===rid).glycemicLoadPerServing,null);
 for(const id of ['keto-suklaakeksit','keto-mutakakku']){
  const text=readFileSync(path.join(root,'reseptit/jalkiruoat',id+'.md'),'utf8');
  for(const key of ['carbs_net_per_serving_g','carbs_total_per_serving_g','protein_per_serving_g','fat_per_serving_g'])assert.match(text,new RegExp('^'+key+': null','m'));
 }
});
test('recovery independent Decimal reproduces approved source and rounding scenarios',()=>{
 const raw=execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(folder,'verify_decimal.py')],{encoding:'utf8'});
 assert.equal(JSON.parse(raw).status,'PASS');
});
