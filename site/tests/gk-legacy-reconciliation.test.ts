import {assertOriginalContentTransition,originalContentInventoryBefore,restoreBeforeOriginalContent} from './original-content-transition';
import {p1Transition,requiresP1SourceCorrection,verifyP1SourceInputs} from './p1-source-transition';
import {execFileSync} from 'node:child_process';
import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {prepareLegacyGkCandidates,verifyLegacyCandidateInput,verifyLegacyCandidateScope,verifyLegacyReviewEvidence} from '../scripts/legacy-gk-corrections';
import {reviewedSourceHashMatches} from '../scripts/afcd-column-correction';
import {glycemicLoadEvidenceHash,glycemicLoadInputHash} from '../scripts/glycemic-load-recipe-binding';
import {roundGlycemicLoadForDisplay} from '../scripts/glycemic-load-model';
import {historicalBreakfastRecipe, reviewedBreakfastPaths} from '../scripts/gk100-breakfast-sealed-source';
import {verifyReleaseBundle} from '../scripts/gk100-approval-release';
import {historicalFarinataForApprovedPanVersion} from '../scripts/gk100-farinata-sealed-source';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../',import.meta.url));
const read=(p:string)=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const json=(p:string)=>JSON.parse(read(p));
const sha=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const lf=(v:any):any=>typeof v==='string'?v.replaceAll('\r\n','\n'):Array.isArray(v)?v.map(lf):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,lf(x)])):v;
const before=json('docs/nutrition/gk-legacy-reconciliation/baseline.json');
const report=json('tmp/nutrition/glycemic-load-pilot.json');

test('serabi and apam balik retain only the sealed thin-version GK', () => {
 for (const [bundleName, id] of [
  ['first-five', 'indonesialainen-serabi-kookospannukakku'],
  ['eighteen', 'malesialainen-apam-balik'],
 ]) {
  const file = `reseptit/aamupalat/${id}.md`;
  const {bundle, authorization} = json(`docs/nutrition/gk100-approved-releases/${bundleName}.json`);
  const live = read(file).replaceAll('\r\n','\n');
  const historical = historicalBreakfastRecipe(file, live);
  assert.notEqual(historical, live);
  const historicalHash = createHash('sha256').update(historical).digest('hex');
  const approved = bundle.manifest.candidates.find((row: any) => row.recipeId === id);
  assert.equal(historicalHash, approved.originalSha256);
  assert.equal(live.split('\n## Valmistus\n')[0], historical.split('\n## Valmistus\n')[0]);
  const versions = verifyReleaseBundle(bundle, authorization, read);
  assert.equal(versions.filter(version => version.recipeId === id).length, 1);
  assert.equal(report.results.find((row: any) => row.recipeId === id).glycemicLoadPerServing, null);
  assert.throws(() => verifyReleaseBundle(bundle, authorization,
   source => source === file ? live + '\nUnreviewed change\n' : read(source)),
  /GK100_RELEASE_CANDIDATE_CHANGED/);
 }
});

test('Live original results preserve frozen history plus the exact reviewed transitions; all87 variants and macros stay identical',()=>{
 assert.equal(report.results.length,335); // five post-baseline classics remain in live reporting
 assertOriginalContentTransition(report);
 const historical = restoreBeforeOriginalContent(structuredClone(report));
 const requiresP1=requiresP1SourceCorrection(root);
 verifyP1SourceInputs(json('docs/nutrition/glycemic-load-pilot-input.json').recipes,requiresP1);
 const affected=Object.keys(before.expectedResultDeltas);
 assert.deepEqual(affected.sort(),['pellava-puuro-pahkinoilla','valimerellinen-ricotta-persikkakulho']);
 for(const r of historical.results){
  const p1=p1Transition.records.find((x:any)=>x.recipeId===r.recipeId);
  if(requiresP1&&p1){assert.equal(sha(r),p1.newResultSha256,r.recipeId+' reviewed P1 main correction');assert.equal(r.glycemicLoadPerServing,null);continue;}
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
 const inventory = json('tmp/nutrition/audit.json').inventory;
 // The approved oven-farinata editorial correction changed the full-file
 // SHA in nutrition audit provenance, but not its amounts or macro values.
 // Reconstruct ONLY the exact reviewed source for the frozen inventory check.
 const farinataPath='reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md';
 const publishedFarinata=read(farinataPath).replaceAll('\r\n','\n');
 const historicalFarinata=historicalFarinataForApprovedPanVersion(farinataPath,publishedFarinata);
 const publishedFarinataHash=createHash('sha256').update(publishedFarinata).digest('hex');
 const historicalFarinataHash=createHash('sha256').update(historicalFarinata).digest('hex');
 const historicalInventory = inventory.map((row: any) => {
  if (!reviewedBreakfastPaths.includes(row.source_path)) return row;
  const live = read(row.source_path);
  const historical = historicalBreakfastRecipe(row.source_path, live);
  if (historical === live) return row;
  assert.equal(row.source_content_hash, createHash('sha256').update(live.replaceAll('\r\n','\n')).digest('hex'));
  return {...row, source_content_hash:createHash('sha256').update(historical).digest('hex')};
 });
 for (const lineEnding of ['\n', '\r\n']) {
  const withLineEndings = historicalInventory.map((row: any) => {
   const normalNotes=row.notes.replaceAll('\r\n', '\n').replaceAll('\n', lineEnding);
   if(row.recipe_id!=='valimerellinen-farinata-aamupalaksi'||historicalFarinata===publishedFarinata){
    return {...row,notes:normalNotes};
   }
   assert.equal(row.source_path,farinataPath);
   assert.equal(row.source_content_hash,publishedFarinataHash,'only the reviewed farinata source may be normalized');
   return {...row,notes:normalNotes,source_content_hash:historicalFarinataHash};
  });
  assert.equal(sha(lf(originalContentInventoryBefore(withLineEndings))),before.macroInventorySha256);
 }
 assert.equal(sha(report.giSourcePolicy),before.currentSourcePolicySha256);
 assert.equal(sha(report.giSourceCatalog),before.currentSourceCatalogSha256);
 assert.deepEqual(historical.calculationInputMismatches,requiresP1?p1Transition.newInputMismatches:[]);
 assert.deepEqual(historical.calculationEvidenceMismatches,requiresP1?p1Transition.newEvidenceMismatches:[]);
 const peach=report.results.find((r:any)=>r.recipeId==='valimerellinen-ricotta-persikkakulho');
 assert.equal(peach.glycemicLoadPerServing,3.97);
 assert.equal(peach.unroundedGlycemicLoadPerServing,3.96885);
 assert.equal(roundGlycemicLoadForDisplay(peach.glycemicLoadPerServing),4);
 assert.equal(report.results.find((r:any)=>r.recipeId==='pellava-puuro-pahkinoilla').glycemicLoadPerServing,null);
});

test('reviewed farinata normalization remains restricted to the exact approved source bytes',()=>{
 const file='reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md';
 const current=read(file).replaceAll('\r\n','\n');
 const historical=historicalFarinataForApprovedPanVersion(file,current);
 assert.notEqual(historical,current,'the current reviewed oven instructions must differ from the signed history');
 assert.equal(createHash('sha256').update(historical).digest('hex'),'1b15fd29f9d833b84289c2d1345e27a0110c4bda7044ed6939d581ede947d237');
 assert.equal(historicalFarinataForApprovedPanVersion(file,current.replace('55','56')),current.replace('55','56'),
  'any other text change must not acquire legacy approval');
 assert.equal(historicalFarinataForApprovedPanVersion('reseptit/aamupalat/other.md',current),current);
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
 assert.doesNotThrow(()=>verifyLegacyCandidateInput(inputText.replaceAll('\r\n','\n').replaceAll('\n','\r\n'),manifest.recipeSnapshotsSha256));
 const stale=JSON.parse(inputText);stale.recipes.find((r:any)=>r.recipeId==='baozi').ingredients[0].grams+=1;
 assert.throws(()=>verifyLegacyCandidateInput(JSON.stringify(stale),manifest.recipeSnapshotsSha256),/Current input changed/);
 const unrelated=JSON.parse(inputText);unrelated.recipes.find((r:any)=>!Object.hasOwn(manifest.recipeSnapshotsSha256,r.recipeId)).ingredients[0].grams=123;
 assert.doesNotThrow(()=>verifyLegacyCandidateInput(JSON.stringify(unrelated),manifest.recipeSnapshotsSha256));
 assert.equal(sha(lf({notes:'a\r\nb',value:3})),sha(lf({notes:'a\nb',value:3})));
 assert.notEqual(sha(lf({notes:'a\nb',value:3})),sha(lf({notes:'a\nb',value:4})));
 assert.equal(review.publicationAuthorized,false);assert.equal(review.sourceApprovalGranted,false);
 assert.equal(review.candidates.length,9);
 assert.equal(read('docs/nutrition/glycemic-load-pilot-input.json'),inputText);
 assert.ok(!review.candidates.some(r=>r.recipeId==='tomaatti-kananmuna-wokki'));
 assert.equal(review.contentDecisions.length,17);
 assert.equal(review.pendingDecisions.length,9);
 assert.equal(review.contentDecisions.filter((p:any)=>p.action==='KEEP_EXISTING_SCOPED_ANALOG').length,2);
 const original=json('docs/nutrition/gk-legacy-reconciliation/candidates.json');
 assert.equal(original.decisions.filter((p:any)=>p.decision==='PRESERVE_CURRENT_APPROVED_EHOLD').length,5);
 const missingSource=structuredClone(original);missingSource.reviewEvidenceSnapshots=missingSource.reviewEvidenceSnapshots.filter((p:any)=>p.id!=='pear-raw-mean-gi-38-2002');
 assert.throws(()=>verifyLegacyReviewEvidence(read,missingSource),/Missing reviewed GI source snapshot/);
 const missing=structuredClone(original);delete missing.recipeSnapshotsSha256.baozi;
 assert.throws(()=>verifyLegacyCandidateScope(missing),/exact snapshot/);
 assert.throws(()=>verifyLegacyReviewEvidence(p=>{
  if(p!=='docs/nutrition/glycemic-index-records.json')return read(p);
  const data=json(p);data.records.find((r:any)=>r.id==='pear-raw-mean-gi-38-2002').gi=99;return JSON.stringify(data);
 },original),/Reviewed source record changed/);
 assert.doesNotThrow(()=>verifyLegacyReviewEvidence(p=>{
  if(p!=='docs/nutrition/glycemic-index-records.json')return read(p);
  const data=json(p);data.records.find((r:any)=>!original.reviewEvidenceSnapshots.some((snap:any)=>snap.id===r.id)).gi=99;return JSON.stringify(data);
 },original));
 const baozi=review.candidates.find(r=>r.recipeId==='baozi')!.input.ingredients;
 assert.equal(baozi.find(r=>r.name==='maissitärkkelystä')!.fineliRecordId,'fineli-27-2026-10-25');
 assert.equal(baozi.find(r=>r.name==='maissitärkkelystä')!.grams,7);
 const avocado=review.candidates.find(r=>r.recipeId==='meksikolainen-paputostada-aamupalaksi')!.after.ingredients.find(r=>/avokado/.test(r.name))!;
 assert.equal(avocado.availableCarbohydratePerServingG,0.462);assert.equal(avocado.gi,null);
 for(const id of ['bulgogi','masala-dosa']){
  assert.equal(review.candidates.find(r=>r.recipeId===id)!.after.status,'INSUFFICIENT SOURCE DATA');
  assert.equal(report.results.find((r:any)=>r.recipeId===id).glycemicLoadPerServing,null,'candidate cannot publish itself');
 }
 assert.equal(review.candidates.filter(c=>c.contentAssessment.status==='SUPERSEDED_BY_APPROVED_SCOPE').length,6);
 const baoziScope=review.candidates.find(r=>r.recipeId==='baozi')!;
 assert.equal(baoziScope.existingSuccessor.scope,'STUDY_COMPARISON_ONLY');
 assert.equal(baoziScope.contentAssessment.status,'HOLD');
 const tostada=review.candidates.find(r=>r.recipeId==='meksikolainen-paputostada-aamupalaksi')!;
 assert.equal(tostada.existingSuccessor.point,16.638165);
 assert.match(tostada.existingSuccessor.distinction,/72 g|72g/);
 const dosa=review.candidates.find(r=>r.recipeId==='masala-dosa')!;
 assert.deepEqual(dosa.existingSuccessor.scenarioRange,{min:57.8025,max:63.495});
 assert.equal(dosa.input.ingredients.find(r=>r.name==='urad-dal-linssejä')!.fineliRecordId,null);
 assert.equal(dosa.input.ingredients.find(r=>r.name==='tuoretta inkivääriä')!.estimatedAvailableCarbohydratePerServingG,0.22425);
 for(const decision of review.contentDecisions){
  const input=review.candidates.find(r=>r.recipeId===decision.recipeId)!.input;
  const row=input.ingredients.find(r=>r.name===decision.ingredient)!;
  assert.equal(row.giRecordId,decision.action==='KEEP_EXISTING_SCOPED_ANALOG'?decision.giRecordId:null);
 }
 for(const c of review.candidates){assert.equal(c.publicationStatus,'REVIEW_REQUIRED');assert.equal(c.contentAssessment.status,c.existingSuccessor.scope.startsWith('CURRENT_APPROVED_')?'SUPERSEDED_BY_APPROVED_SCOPE':'HOLD');assert.equal(c.contentAssessment.publishedGlycemicLoadPerServing,null);assert.ok(c.contentAssessment.reasons.length>0);}

});

test('independent Decimal checks source components and the three original-case numeric traps without approving a whole recipe or sub-threshold omission',()=>{
 const proof=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',fileURLToPath(new URL('../../docs/nutrition/gk-legacy-reconciliation/verify_source_components.py',import.meta.url))],{encoding:'utf8'}));
 assert.equal(proof.status,'PASS');assert.equal(proof.checked,12);assert.equal(proof.publicationAuthorized,false);
});

test('three original-case source cards cannot reuse a whole-food GI as a home result or ignore changed recipe/macro content',()=>{
 const manifest=json('docs/nutrition/gk-legacy-reconciliation/candidates.json');
 const review=verifyLegacyReviewEvidence(read,manifest);
 const cards=review.deepOriginalCaseReview.cards;
 assert.equal(cards.baozi.primarySource.giMean,39.1);
 assert.equal(cards.baozi.primarySource.spreadType,'SD');
 assert.equal(cards.baozi.crossCheck.servingGlIsHomeRecipeResult,false);
 assert.equal(cards['kreikkalainen-moussaka'].primarySource.footnoteProtocolCarbohydrateG,25);
 assert.equal(cards['indonesialainen-bubur-sumsum'].ownerDecision.answer,'Unknown; preserve HOLD');
 for(const id of Object.keys(cards)){
  const result=report.results.find((r:any)=>r.recipeId===id);
  assert.equal(result.glycemicLoadPerServing,null);assert.equal(result.status,'INSUFFICIENT SOURCE DATA');
 }
 assert.throws(()=>verifyLegacyReviewEvidence(p=>read(p)+(p===cards.baozi.recipePath?'changed':'') ,manifest),/Reviewed recipe\/macro text changed/);
 assert.throws(()=>verifyLegacyReviewEvidence(p=>read(p)+(p===cards.baozi.macroPath?'changed':'') ,manifest),/Reviewed recipe\/macro text changed/);
 const missing=structuredClone(manifest);missing.reviewTextSnapshots.pop();
 assert.throws(()=>verifyLegacyReviewEvidence(read,missing),/Missing reviewed recipe\/macro text snapshot/);
});

test('the reviewed P1 main profile forbids restoring cow-milk coconut inputs after integration',()=>{
 const old=p1Transition.records.map((r:any)=>r.oldInput);
 assert.throws(()=>verifyP1SourceInputs(old,true),/rolled back/);
 assert.doesNotThrow(()=>verifyP1SourceInputs(old,false));
 const mutated=structuredClone(old);mutated[0].ingredients[0].grams=999;
 assert.throws(()=>verifyP1SourceInputs(mutated,false),/changed/);
});
