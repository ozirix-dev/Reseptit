import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath} from 'node:url';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import {loadRecovery,verifyRecoveryComposition,verifyRecoveryCase} from '../scripts/gk149-recovery';
import {evaluate,loadPilot,digest} from '../scripts/gk149-model';
import {buildGkOnlyVariants} from '../scripts/gk149-integration';
const root=fileURLToPath(new URL('../../',import.meta.url)),recovery=loadRecovery(root);
test('five additional exact source-reuse proposals remain outside the approved16 and public coverage',()=>{
 assert.equal(recovery.results.length,5);assert.ok(recovery.results.every(r=>r.numericProposal&&!r.publicationAuthorized));assert.equal(recovery.results.filter(r=>r.level==='A').length,2);assert.equal(recovery.results.filter(r=>r.level==='B').length,3);
 const publicVersions=buildGkOnlyVariants(root);assert.equal(publicVersions.length,16);for(const c of recovery.cases){assert.equal(c.approval,false);assert.ok(!publicVersions.some(p=>p.recipeId===c.recipeId));}
 const coffee=JSON.parse(readFileSync(path.join(root,'docs/nutrition/gk80-operation149/additional-proposal.json'),'utf8'));assert.equal(new Set([...publicVersions.map(v=>v.recipeId),coffee.recipeId,...recovery.cases.map(c=>c.recipeId)]).size,22);
});
test('ready-in-water manufacturer ceiling cannot be zeroed, reused for dry product or treated as exactCHO',()=>{
 const f=recovery.comps.find(c=>c.id==='koro-ready-ceiling')!;verifyRecoveryComposition(root,f);assert.throws(()=>verifyRecoveryComposition(root,{...f,availablePer100g:0}),/ceiling/);
 const c=structuredClone(recovery.cases.find(c=>c.recipeId==='pad-kee-mao-vhh-konjac')!);const row=c.candidateIngredients.find(i=>i.compositionId===f.id)!;assert.equal(row.grams,600);assert.equal(row.carbohydrateUse,'UPPER_BOUND');assert.ok(recovery.results.find(r=>r.recipeId===c.recipeId)!.omittedCho>0.9);
 row.carbohydrateUse='AVAILABLE_POINT';const {inputSha256:_old,...body}=c;c.inputSha256=digest(body);assert.throws(()=>verifyRecoveryCase(root,c,recovery.comps),/ceiling must remain/);
});
test('prepared whole-chickpea pancake comparator cannot be silently assigned to dehulled besan',()=>{
 const c=structuredClone(recovery.cases.find(c=>c.recipeId==='intialainen-besan-chilla')!);c.candidateIngredients[0].compositionId='F003986';
 const base=JSON.parse(readFileSync(path.join(root,'docs/nutrition/afcd-release-3-reference.json'),'utf8')).foods.find((f:any)=>f.source_id==='F003986');
 const changed=[...recovery.comps,{id:'F003986',kind:'AFCD_WITHOUT_SUGAR_ALCOHOLS',path:'',nativeField:'',availablePer100g:base.available_carbohydrate_without_sugar_alcohols_g_per_100g,name:base.name,polyols:'UNKNOWN'}];
 assert.equal(evaluate(c,changed,recovery.gis).numericProposal,false);assert.ok(c.preparationDecision.includes('whole-chickpea'));
});
test('bread-reference table observations are already glucose100 and are not converted again',()=>{
 assert.deepEqual(recovery.gis.find(g=>g.id==='blueberry53-recovery')!.values,[53]);assert.deepEqual(recovery.gis.find(g=>g.id==='persimmon61-recovery')!.values,[61]);
 assert.equal(recovery.results.find(r=>r.recipeId==='japanilainen-hojicha-jogurtti-persimonilla')!.point,8.42);
 assert.ok(recovery.cases.find(c=>c.recipeId==='intialainen-pinaatti-paneer-chilla')!.requiredDecisions.includes('EXCLUDE_UNQUANTIFIED_CHUTNEY_AND_LEMON_OWNER_DECISION'));
 assert.equal(loadPilot(root).cases.length,19);
});
test('independent native-field Decimal replay verifies all five exact calculations and positive A omissions',()=>{
 const p=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,'docs/nutrition/gk80-operation149/verify_recovery.py')],{encoding:'utf8'}));assert.equal(p.status,'PASS');assert.equal(p.checked,5);assert.equal(p.writes,0);
 for(const r of p.results){const actual=recovery.results.find(a=>a.recipeId===r.recipeId)!;assert.equal(actual.point,Number(r.point));assert.ok(Math.abs(actual.omittedCho-Number(r.omittedCho))<1e-12);}
});
