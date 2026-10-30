import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {calculateRun4} from '../scripts/gk80-run4-model';import {fingerprint} from '../scripts/gk80-model';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80/run-4/',root);
const json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,gold=json('golden.json').recipes;
const calc=(r:any,expected=fingerprint(r),ss=sources,cc=comps)=>calculateRun4(r,ss,r.sourceSha256,expected,cc);
test('50 unique new IDs yield exactly26 numeric proposals, A22/B4; every term and four macros match Decimal',()=>{
 assert.equal(recipes.length,50);assert.equal(new Set(recipes.map((r:any)=>r.recipeId)).size,50);
 const prior=new Set(json('selection.json').priorNumericExcluded);assert.equal(prior.size,22);
 let count=0;for(const r of recipes){assert.ok(!prior.has(r.recipeId));const out=calc(r),g=gold.find((g:any)=>g.recipeId===r.recipeId);
  assert.equal(out.numericProposal,r.coverageProposalEligible,r.recipeId);if(out.numericProposal)count++;
  for(let n=0;n<out.scenarios.length;n++){const s=out.scenarios[n],d=g.scenarios[n];for(const k of ['availableCarbohydrate','protein','fat','fibre'])assert.ok(Math.abs(s.macros[k]-d.macros[k])<1e-9,r.recipeId+'/'+k);s.contributions.forEach((c:any,i:number)=>{assert.equal(c.gk===null,d.contributions[i].gk===null);if(c.gk!==null)assert.ok(Math.abs(c.gk-d.contributions[i].gk)<1e-9);});}
 }assert.equal(count,26);assert.equal(json('metrics.json').first25,22);assert.equal(json('metrics.json').second25,4);
});
test('source recipes, variant hashes, source fingerprints and GLUCOSE100 scale are mandatory',()=>{
 for(const r of recipes){const hash=createHash('sha256').update(readFileSync(new URL(r.sourcePath,root),'utf8').replaceAll('\r\n','\n')).digest('hex');assert.equal(hash,r.sourceSha256);if(r.coverageProposalEligible)assert.equal(fingerprint({title:r.proposedTitle,servings:r.servings,scenarios:r.scenarios,preparation:r.proposedPreparation}),r.proposedVersionHash);}
 const r=structuredClone(recipes[0]);r.scenarios[0].ingredients[0].massG+=1;assert.throws(()=>calc(r,gold[0].inputHash),/STALE_INPUT/);
 const ss=structuredClone(sources);ss[0].gi+=1;assert.throws(()=>calc(recipes.find((r:any)=>r.scenarios.some((s:any)=>s.ingredients.some((i:any)=>i.impact?.sourceId===ss[0].id))),undefined,ss),/STALE_SOURCE/);
 const scale=structuredClone(sources);for(const s of scale){s.scale='WHITE_BREAD_100';s.evidenceHash=fingerprint(Object.fromEntries(Object.entries(s).filter(([k])=>k!=='evidenceHash')));}
 assert.throws(()=>calc(recipes[0],undefined,scale),/INVALID_GI|STALE_BINDING/);
});
test('new lowCHO and flavour assignments reject out-of-scope food and doses',()=>{
 const r=structuredClone(recipes.find((r:any)=>r.recipeId==='meksikolainen-atole-maissipuuro'));const i=r.scenarios[0].ingredients.find((i:any)=>i.impact?.sourceId==='small-flavour50-r4');i.massG=100;assert.throws(()=>calc(r),/SMALL_FLAVOUR_DOSE/);
 const s=structuredClone(sources);const record=s.find((s:any)=>s.id==='lowcho50-r4');record.allowedCompositionIds=[];record.evidenceHash=fingerprint(Object.fromEntries(Object.entries(record).filter(([k])=>k!=='evidenceHash')));const q=structuredClone(recipes[0]);for(const scenario of q.scenarios)for(const i of scenario.ingredients)if(i.impact?.sourceId===record.id)i.impact.evidenceHash=record.evidenceHash;assert.throws(()=>calc(q,undefined,s),/UNREVIEWED_COMPOSITION_SCOPE/);
});
test('named rice scenarios are ordered numerical options, never SEM or physiological bounds',()=>{
 const out=calc(recipes.find((r:any)=>r.recipeId==='tomaatti-kananmuna-wokki'));assert.equal(out.methodType,'MODELLED_SCENARIO');assert.ok(out.min<out.max);assert.equal(out.impact.biologicalBoundEstablished,false);
 const open=calc(recipes.find((r:any)=>r.recipeId==='tabbouleh'));assert.equal(open.numericProposal,false);assert.equal(open.methodType,'UNAVAILABLE');
});
test('all326 legacy production result objects retain exact frozen hashes',()=>{
 const current=JSON.parse(readFileSync(new URL('tmp/nutrition/glycemic-load-pilot.json',root),'utf8')).results;
 const old=JSON.parse(readFileSync(new URL('docs/nutrition/gk80/pilot-1/legacy-results.json',root),'utf8'));
 assert.equal(current.length,326);for(const r of old){const now=current.find((x:any)=>x.recipeId===r.recipeId);assert.equal(createHash('sha256').update(JSON.stringify(now)).digest('hex'),r.sha256,r.recipeId);}
});
test('independent Python repeat checks every composition and protected source file',()=>{const out=execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-run4-verify.py',root))],{encoding:'utf8'});assert.equal(JSON.parse(out).status,'PASS');});

test('butternut never inherits dairy coding; prior proposal correction repeats independently',()=>{
 const c=json('prior-14-review.json').correction;
 const original=JSON.parse(readFileSync(new URL('docs/nutrition/gk80/run-3-v2/recipes.json',root),'utf8')).recipes.find((r:any)=>r.recipeId===c.recipe.recipeId);
 const oldSources=JSON.parse(readFileSync(new URL('docs/nutrition/gk80/run-3-v2/sources.json',root),'utf8')).records;
 const cs=JSON.parse(readFileSync(new URL(c.compositionReference,root),'utf8')).records;
 assert.throws(()=>calculateRun4(original,oldSources,original.sourceSha256,fingerprint(original),cs),/DAIRY_SCOPE/);
 const out=calculateRun4(c.recipe,c.sources,c.recipe.sourceSha256,c.golden.inputHash,cs);
 assert.equal(out.numericProposal,true);assert.ok(Math.abs(out.min!-34.7953875)<1e-9);assert.equal(c.newUniqueCount,0);
 for(const k of ['availableCarbohydrate','protein','fat','fibre'])assert.ok(Math.abs((out.scenarios[0].macros as any)[k]-c.golden.scenarios[0].macros[k])<1e-9);
});
