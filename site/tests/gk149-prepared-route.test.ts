import { biryaniSourceBeforeReview } from "../scripts/biryani-reviewed-source";
import {recipeTextForApprovedSnapshot} from '../scripts/approved-recipe-note-edits';
import {parseMarkdown} from '../src/content/markdown';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
import {loadPreparedRoute,evaluatePrepared,verifyPreparedComposition,verifyPreparedBindings,formatPreparedProposal} from '../scripts/gk149-prepared-route';
import {digest,textHash} from '../scripts/gk149-model';
import {verifyNextSevenManifest} from '../scripts/gk-next-seven';
import {buildGkOnlyVariants} from '../scripts/gk149-integration';import {loadRecovery} from '../scripts/gk149-recovery';
const root=fileURLToPath(new URL('../../',import.meta.url)),ctx=loadPreparedRoute(root),get=(id:string)=>structuredClone(ctx.cases.find(c=>c.recipeId===id)!);
test('eight new proposals complete30 distinct numeric proposals while approved publication scope stays16',()=>{
 assert.equal(ctx.results.filter(r=>r.numericProposal).length,8);assert.equal(ctx.results.filter(r=>r.level==='A').length,1);assert.equal(ctx.results.filter(r=>r.level==='B').length,7);assert.ok(ctx.results.every(r=>r.publicationAuthorized===false));
 const approved=buildGkOnlyVariants(root),prior=loadRecovery(root),coffee=JSON.parse(readFileSync(path.join(root,'docs/nutrition/gk80-operation149/additional-proposal.json'),'utf8'));
 const all=[...approved.map(r=>r.recipeId),...prior.cases.map(c=>c.recipeId),coffee.recipeId,...ctx.cases.map(c=>c.recipeId)];assert.equal(all.length,30);assert.equal(new Set(all).size,30);assert.equal(approved.length,16);
 const batch=JSON.parse(readFileSync(path.join(root,'docs/nutrition/gk80-operation149/proposal-batch.json'),'utf8'));assert.equal(batch.pendingVersions,14);assert.equal(batch.ownerApproved,false);assert.equal(batch.publicActivation,false);
 // Preserve the old research seal against its immutable source revision.
 // The record-binding refinement is independently sealed by the new integration.
 const next=verifyNextSevenManifest(root);
 for(const [p,h] of Object.entries(batch.sealedFilesLfSha256)){
  const current=textHash(readFileSync(path.join(root,p),'utf8'));
  if(p==='site/scripts/gk149-model.ts'){
   const frozen=execFileSync('git',['show',next.frozenProposalModelCommit+':'+p],{cwd:root,encoding:'utf8'});
   assert.equal(textHash(frozen),h,'Frozen review model changed');
  }else assert.equal(current,h,'Review packet changed: '+p);
 }
 for(const c of [...prior.cases,...ctx.cases])assert.equal(batch.reviewedInputs.find((x:any)=>x.recipeId===c.recipeId)?.inputSha256,c.inputSha256);assert.equal(batch.reviewedInputs.find((x:any)=>x.recipeId===coffee.recipeId)?.inputSha256,digest(coffee));
 for(const c of ctx.cases){assert.equal(c.approval,false);verifyPreparedBindings(c,ctx);assert.ok(!approved.some(r=>r.recipeId===c.recipeId));}
});
test('IFCT analytical availableCHO rejects the by-difference4.51 and a silent re-sum3.68',()=>{
 const f=ctx.comps.find(f=>f.id==='IFCT-G010')!;verifyPreparedComposition(root,f);
 for(const value of [4.51,3.68,0])assert.throws(()=>verifyPreparedComposition(root,{...f,availablePer100g:value}),/Table6/);
 assert.throws(()=>verifyPreparedComposition(root,{...f,nativeField:'CHOAVLDF'}),/Table6/);
});
test('source/recipe input binding rejects even a source-only GI alteration',()=>{
 const c=get('baozi'),changed=structuredClone(ctx);changed.preparedSources.find(s=>s.id==='baozi-whole39')!.gi=28;
 assert.throws(()=>verifyPreparedBindings(c,changed),/binding changed/);
});
test('a whole-food GI cannot be reused for raw rice,paella,or an incomplete meal dose',()=>{
 const c=get('hyderabadi-kanabiryani');c.preparedNodes[0].unitScope='INGREDIENT_REFERENCE';assert.equal(evaluatePrepared(c,ctx).numericProposal,false);
 const p=get('hyderabadi-kanabiryani');p.recipeId='paella-valenciana';assert.equal(evaluatePrepared(p,ctx).numericProposal,false);
 const missing=get('baozi');missing.preparedNodes[0].ingredientIndexes.pop();assert.equal(evaluatePrepared(missing,ctx).numericProposal,false);
});
test('prepared components account for every ingredient exactly once and cannot claim the whole plate GI',()=>{
 const c=get('malesialainen-roti-jala-currykanalla');c.preparedNodes[0].unitScope='PREPARED_RECIPE';assert.equal(evaluatePrepared(c,ctx).numericProposal,false);
 const duplicate=get('pizza-margherita');duplicate.preparedNodes[0].ingredientIndexes.push(4);assert.equal(evaluatePrepared(duplicate,ctx).numericProposal,false);
 const unreferenced=get('pizza-margherita');unreferenced.preparedNodes[1].sourceId=null;assert.equal(evaluatePrepared(unreferenced,ctx).numericProposal,false);
});
test('900g cooked rice is never inferred from300g dry or counted alongside a dry input',()=>{
 const c=get('hyderabadi-kanabiryani');c.candidateIngredients[0].compositionId='F007682';assert.equal(evaluatePrepared(c,ctx).numericProposal,false);
 const conversion=get('hyderabadi-kanabiryani');conversion.riceMassDecision!.isYieldConversion=true;assert.equal(evaluatePrepared(conversion,ctx).numericProposal,false);
 const duplicate=get('hyderabadi-kanabiryani');duplicate.candidateIngredients.push({...duplicate.candidateIngredients[0],grams:300,compositionId:'F007682',massBasis:'DRY'});duplicate.preparedNodes[0].ingredientIndexes.push(duplicate.candidateIngredients.length-1);assert.equal(evaluatePrepared(duplicate,ctx).numericProposal,false);
 const valid=ctx.results.find(r=>r.recipeId==='hyderabadi-kanabiryani')!;assert.ok(valid.scenarioRange);assert.ok(Math.abs(valid.scenarioRange.min-30.60421)<1e-10);assert.ok(Math.abs(valid.scenarioRange.max-44.93684)<1e-10);
});
test('reference test-food mass and50gCHO are metadata,not target serving multipliers;no global correction',()=>{
 const c=get('hyderabadi-kanabiryani'),other=structuredClone(ctx);other.preparedSources.find(s=>s.id==='biryani-whole52')!.testFoodMassG=9999;
 assert.deepEqual(evaluatePrepared(c,other).scenarioRange,evaluatePrepared(c,ctx).scenarioRange);
 const factor=get('baozi') as any;factor.globalMealFactor=0.75;assert.equal(evaluatePrepared(factor,ctx).numericProposal,false);
});
test('independent Decimal and native-field replay verifies8 results and keeps all uncertainty types separate',()=>{
 const p=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,'docs/nutrition/gk80-operation149/verify_prepared_route.py')],{encoding:'utf8'}));assert.equal(p.status,'PASS');assert.equal(p.checked,8);assert.equal(p.writes,0);
 for(const r of p.results){const actual=ctx.results.find(a=>a.recipeId===r.recipeId)!;if(r.point!==null)assert.equal(actual.point,Number(r.point));else{assert.ok(actual.scenarioRange);assert.ok(Math.abs(actual.scenarioRange.min-Number(r.minExact))<1e-10);assert.ok(Math.abs(actual.scenarioRange.max-Number(r.maxExact))<1e-10);}}
 const b=ctx.results.find(r=>r.recipeId==='hyderabadi-kanabiryani')!;for(const l of ['fi','en','sv','th'] as const){const text=formatPreparedProposal(b,l);assert.ok(text.text.includes('30–45'));assert.ok(text.note);}
});


test('the exact Thai biryani wording preserves the sealed recipe and rejects subsequent changes', () => {
 const candidate=get('hyderabadi-kanabiryani');
 const file=candidate.paths.th;
 const current=readFileSync(path.join(root,file),'utf8').replaceAll('\r\n','\n');
 const previous=biryaniSourceBeforeReview(file,current);
 const approved=recipeTextForApprovedSnapshot(file,previous);
 assert.notEqual(current,approved);
 assert.equal(textHash(approved),candidate.recipeSha256.th);
 assert.deepEqual(parseMarkdown(previous)?.data,parseMarkdown(approved)?.data);
 for(const modified of [current.replace('amount: 300','amount: 301'),current+'\nUnreviewed instruction.\n']){
  assert.notEqual(modified,current);
  assert.equal(biryaniSourceBeforeReview(file,modified),modified);
  assert.equal(recipeTextForApprovedSnapshot(file,modified),modified);
  assert.notEqual(textHash(modified),candidate.recipeSha256.th);
 }
});
