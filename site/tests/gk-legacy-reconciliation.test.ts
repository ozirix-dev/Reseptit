import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {prepareLegacyGkCandidates,verifyLegacyCandidateInput} from '../scripts/legacy-gk-corrections';
import {reviewedSourceHashMatches} from '../scripts/afcd-column-correction';
import {glycemicLoadEvidenceHash,glycemicLoadInputHash} from '../scripts/glycemic-load-recipe-binding';
import {roundGlycemicLoadForDisplay} from '../scripts/glycemic-load-model';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const read=(p:string)=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const json=(p:string)=>JSON.parse(read(p));
const sha=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const before=json('docs/nutrition/gk-legacy-reconciliation/baseline.json');
const report=json('tmp/nutrition/glycemic-load-pilot.json');

test('live326 allow only the independently verified AFCD result deltas; every87 sealed variant and macro stays identical',()=>{
 assert.equal(report.results.length,326);
 const affected=Object.keys(before.expectedResultDeltas);
 assert.deepEqual(affected.sort(),['pellava-puuro-pahkinoilla','valimerellinen-ricotta-persikkakulho']);
 for(const r of report.results){
  const restored=structuredClone(r);
  for(const delta of before.expectedResultDeltas[r.recipeId]??[]){
   const keys=delta.path.slice(1).split('/');let parent=restored;
   for(const key of keys.slice(0,-1))parent=parent[key];
   assert.deepEqual(parent[keys.at(-1)!],delta.after,r.recipeId+delta.path);
   parent[keys.at(-1)!]=delta.before;
  }
  assert.equal(sha(restored),before.resultHashes[r.recipeId],r.recipeId+' complete result');
 }
 assert.equal(report.gkOnlyVariants.length,87);
 for(const v of report.gkOnlyVariants)assert.equal(sha(v),before.variantHashes[v.recipeId+'/'+v.versionId],v.recipeId);
 assert.equal(sha(json('tmp/nutrition/audit.json').inventory),before.macroInventorySha256);
 assert.equal(sha(report.giSourcePolicy),before.currentSourcePolicySha256);
 assert.equal(sha(report.giSourceCatalog),before.currentSourceCatalogSha256);
 assert.deepEqual(report.calculationInputMismatches,[]);
 assert.deepEqual(report.calculationEvidenceMismatches,[]);
 const peach=report.results.find((r:any)=>r.recipeId==='valimerellinen-ricotta-persikkakulho');
 assert.equal(peach.glycemicLoadPerServing,3.97);
 assert.equal(peach.unroundedGlycemicLoadPerServing,3.96885);
 assert.equal(roundGlycemicLoadForDisplay(peach.glycemicLoadPerServing),4);
 assert.equal(report.results.find((r:any)=>r.recipeId==='pellava-puuro-pahkinoilla').glycemicLoadPerServing,null);
});

test('the source transition accepts only the exact3 corrected columns, preserving unrelated source and engine seals',()=>{
 const file='docs/nutrition/food-records.json';const text=read(file);
 assert.equal(reviewedSourceHashMatches(file,text,before.oldFoodFileSha256),true);
 assert.equal(reviewedSourceHashMatches(file,text.replaceAll('\r\n','\n').replaceAll('\n','\r\n'),before.oldFoodFileSha256),true);
 const foods=JSON.parse(text);const ids=new Set(Object.keys(before.authorizedSourceCorrection));
 const changed=structuredClone(foods);changed.find((f:any)=>!ids.has(f.id)).per100g.carbohydrate=123;
 assert.equal(reviewedSourceHashMatches(file,JSON.stringify(changed,null,2)+'\n',before.oldFoodFileSha256),false);
 const partial=structuredClone(foods);partial.find((f:any)=>f.id==='afcd-F006573-release-3').per100g.carbohydrate=8;
 assert.equal(reviewedSourceHashMatches(file,JSON.stringify(partial,null,2)+'\n',before.oldFoodFileSha256),false);
 assert.equal(reviewedSourceHashMatches('site/scripts/glycemic-load-model.ts',text,before.oldFoodFileSha256),false);
 assert.equal(reviewedSourceHashMatches(file,text,'0'.repeat(64)),false);
 const bindings=json('docs/nutrition/glycemic-load-recipe-bindings.json');
 for(const id of ['valimerellinen-ricotta-persikkakulho','pellava-puuro-pahkinoilla']){
  const input=report.calculationInputs.find((r:any)=>r.recipeId===id);
  assert.equal(glycemicLoadEvidenceHash(input,foods,json('docs/nutrition/glycemic-index-records.json').records),bindings.calculationEvidence[id]);
  assert.equal(glycemicLoadInputHash(input),bindings.calculationInputs[id]);
 }
});

test('current-main133/226 candidates preserve production input, approved EHOLD rows and pending GI decisions',()=>{
 const inputText=read('docs/nutrition/glycemic-load-pilot-input.json');
 const review=prepareLegacyGkCandidates(root);
 const manifest=json('docs/nutrition/gk-legacy-reconciliation/candidates.json');
 assert.doesNotThrow(()=>verifyLegacyCandidateInput(inputText.replaceAll('\r\n','\n').replaceAll('\n','\r\n'),manifest.inputFileLfSha256));
 assert.throws(()=>verifyLegacyCandidateInput(inputText+' ',manifest.inputFileLfSha256),/Current input changed/);
 assert.equal(review.publicationAuthorized,false);assert.equal(review.sourceApprovalGranted,false);
 assert.equal(review.candidates.length,6);
 assert.equal(read('docs/nutrition/glycemic-load-pilot-input.json'),inputText);
 assert.ok(!review.candidates.some(r=>r.recipeId==='tomaatti-kananmuna-wokki'));
 const pending=review.pendingDecisions;
 assert.equal(pending.filter((p:any)=>p.decision==='PREPARATION_APPLICABILITY_REVIEW_REQUIRED').length,17);
 assert.equal(pending.filter((p:any)=>p.decision==='PRESERVE_CURRENT_APPROVED_EHOLD').length,5);
 const baozi=review.candidates.find(r=>r.recipeId==='baozi')!.input.ingredients;
 assert.equal(baozi.find(r=>r.name==='maissitärkkelystä')!.fineliRecordId,'fineli-27-2026-10-25');
 assert.equal(baozi.find(r=>r.name==='maissitärkkelystä')!.grams,7);
 const avocado=review.candidates.find(r=>r.recipeId==='meksikolainen-paputostada-aamupalaksi')!.after.ingredients.find(r=>/avokado/.test(r.name))!;
 assert.equal(avocado.availableCarbohydratePerServingG,0.462);assert.equal(avocado.gi,null);
 for(const id of ['bulgogi','masala-dosa']){
  assert.equal(review.candidates.find(r=>r.recipeId===id)!.after.status,'CALCULATED');
  assert.equal(report.results.find((r:any)=>r.recipeId===id).glycemicLoadPerServing,null,'candidate cannot publish itself');
 }
 for(const c of review.candidates)assert.equal(c.publicationStatus,'REVIEW_REQUIRED');
});
