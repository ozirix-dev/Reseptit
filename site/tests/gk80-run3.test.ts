import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {calculateV2} from '../scripts/gk80-v2-model';import {fingerprint, type Recipe} from '../scripts/gk80-model';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80/run-3-v2/',root);
const json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,gold=json('golden.json').recipes;
const hash=(p:string)=>createHash('sha256').update(readFileSync(new URL(p,root),'utf8').replaceAll('\r\n','\n')).digest('hex');
const run=(r:Recipe)=>calculateV2(r,sources,hash((r as Recipe&{sourcePath:string}).sourcePath),gold.find((g:{recipeId:string})=>g.recipeId===r.recipeId).inputHash,comps);
const near=(a:number|null,b:number|null)=>a===null||b===null?assert.equal(a,b):assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('40 new incomplete IDs use 15+15+10 selection, at least 10 with major carbohydrate',()=>{
 assert.equal(recipes.length,40);assert.equal(new Set(recipes.map((r:Recipe)=>r.recipeId)).size,40);
 const sel=json('selection.json');assert.equal(sel.screen.length,243);assert.ok(sel.majorCarbohydrateRecipes>=10);
 for(const r of recipes)assert.equal(sel.screen.find((s:{recipeId:string})=>s.recipeId===r.recipeId).excludedPrior,false);
});
test('all ingredients, four macros and named scenarios agree with independent Decimal',()=>{
 for(const r of recipes){const out=run(r),g=gold.find((x:{recipeId:string})=>x.recipeId===r.recipeId);out.scenarios.forEach((s,n)=>{const e=g.scenarios[n];near(s.wholeGk,e.wholeGk);near(s.knownSubtotal,e.knownSubtotal);near(s.imputedImpact,e.imputedImpact);for(const k of ['availableCarbohydrate','protein','fat','fibre'] as const)near(s.macros[k],e.macros[k]);s.contributions.forEach((c,j)=>{near(c.gk,e.contributions[j].gk);near(c.carbohydrate,e.contributions[j].carbohydrate);});});}
});
test('valid published imputation can exceed one GK without being relabelled direct evidence',()=>{
 const numeric=recipes.map(run).filter((r:ReturnType<typeof run>)=>r.numericProposal);assert.equal(numeric.length,14);
 assert.ok(numeric.filter((r:ReturnType<typeof run>)=>!r.previousOneUnitScreenPassed).length>=1);
 assert.equal(numeric.filter((r:ReturnType<typeof run>)=>r.methodType==='MODELLED_SCENARIO').length,2);
 for(const r of numeric){assert.equal(r.impact.biologicalBoundEstablished,false);assert.ok(r.evidenceTypes.includes('PUBLISHED_IMPUTATION'));}
});
test('a missing binding or stale recipe input blocks a whole numerical proposal',()=>{
 const r=structuredClone(recipes[0]);delete r.scenarios[0].ingredients[0].impact;
 assert.throws(()=>run(r),/STALE_INPUT/);assert.equal(calculateV2(r,sources,r.sourceSha256,fingerprint(r),comps).numericProposal,false);
 const incompleteScope=structuredClone(recipes[0]);incompleteScope.completeInputScope=false;assert.equal(calculateV2(incompleteScope,sources,incompleteScope.sourceSha256,fingerprint(incompleteScope),comps).methodType,'UNAVAILABLE');
});
test('small portion extension has food and aggregate dose limits; no general spice fallback',()=>{
 const r=structuredClone(recipes.find((r:Recipe)=>r.recipeId==='kiinalainen-musta-seesamipuuro'));r.scenarios[0].ingredients[0].massG=100;
 assert.throws(()=>calculateV2(r,sources,r.sourceSha256,fingerprint(r),comps),/PORTION_CHO_LIMIT/);
 const wrong=structuredClone(recipes[0]);const i=wrong.scenarios[0].ingredients[0];const s=sources.find((s:{id:string})=>s.id==='spice-portion50-v2');i.impact={kind:'PUBLISHED_IMPUTATION',sourceId:s.id,evidenceHash:s.evidenceHash,rationale:'deliberately wrong'};i.family=s.family;
 assert.throws(()=>calculateV2(wrong,sources,wrong.sourceSha256,fingerprint(wrong),comps),/PORTION_SCOPE/);
});
test('all proposed versions stay unapproved; baseline publication counts stay separate',()=>{
 const m=json('metrics.json');assert.equal(m.productionBefore,83);assert.equal(m.productionAfter,83);assert.equal(m.ownerApproved,0);assert.equal(m.published,0);assert.equal(m.cumulativeConditional,22);
 for(const r of recipes){assert.equal(r.approved,false);assert.equal(r.published,false);}
 for(const f of json('provenance.json').localFiles)assert.equal(hash(f.path),f.sha256,f.path);
});
test('Python Decimal and composition/provenance checks run in CI',()=>{
 const out=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-run3-verify.py',root))],{encoding:'utf8'}));assert.equal(out.status,'PASS');assert.equal(out.recipes,40);assert.equal(out.numericProposals,14);
});
