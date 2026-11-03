import {assertRecipeBaseline} from "./assert-recipe-baseline";
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';import path from 'node:path';
import {ACTIVATION,loadPilot,evaluate,summarize,formatResult,digest,verifyCase,verifyComposition,type Case,type Result} from '../scripts/gk149-model';
import {MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G,CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G} from '../scripts/glycemic-load-model';
const root=fileURLToPath(new URL('../../',import.meta.url)),folder='docs/nutrition/gk80-operation149/';
const json=(p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const {pack,cases,comps,gis}=loadPilot(root),results=cases.map(c=>evaluate(c,comps,gis));
const seal=(c:Case)=>{const {inputSha256:_,...b}=c;return {...b,inputSha256:digest(b)} as Case;};

test('closed pilot reports its actual16 results, not the30 target or classes as numbers',()=>{
 const s=summarize(results);assert.equal(ACTIVATION,false);assert.equal(pack.activation,false);assert.equal(s.numericA,10);assert.equal(s.numericB,6);assert.equal(s.classOnly,0);assert.equal(s.targetMet,false);assert.equal(s.candidateTotal,172);assert.equal(s.productionUnchanged,156);
 assert.ok(results.every(r=>r.publicationAuthorized===false));assert.throws(()=>summarize([...results,results[0]]),/duplicate/);
 const g=json(folder+'golden.json');for(const r of results){const e=g.results.find((v:any)=>v.recipeId===r.recipeId);assert.deepEqual({recipeId:r.recipeId,level:r.level,numericProposal:r.numericProposal,point:r.point,scenarioRange:r.scenarioRange,omittedCho:r.omittedCho},e);}
});
test('all170 HOLDs screened and all70 selected IDs have a concrete decision',()=>{
 const csv=readFileSync(path.join(root,folder+'hold-screen.csv'),'utf8').trim().split(/\r?\n/);assert.equal(csv.length,171);
 const ids=csv.slice(1).map(l=>l.split(',')[0]);assert.equal(new Set(ids).size,170);
 const hold=json('tmp/nutrition/glycemic-load-pilot.json').results.filter((r:any)=>r.status!=='CALCULATED').map((r:any)=>r.recipeId);assert.deepEqual(new Set(ids),new Set(hold));assert.ok(cases.every(c=>hold.includes(c.recipeId)));
 const d=json(folder+'recipe-decisions.json');assert.equal(d.decisions.length,70);assert.equal(d.decisions.filter((r:any)=>r.decision==='HOLD').length,54);assert.deepEqual(new Set(d.decisions.map((r:any)=>r.recipeId)),new Set(pack.selectedRecipeIds));assert.ok(d.decisions.every((r:any)=>r.decisionEvidence.length>50));assert.equal(json(folder+'next30.json').queue.length,30);
});
test('native availableCHO is independently verified; wrong field, stale source, P0 proxy rejected',()=>{
 const af=comps.find(c=>c.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS')!;verifyComposition(root,af);assert.throws(()=>verifyComposition(root,{...af,nativeField:'available_carbohydrate_with_sugar_alcohols_g_per_100g'}),/native carbohydrate/);assert.throws(()=>verifyComposition(root,{...af,availablePer100g:999}),/native carbohydrate/);assert.throws(()=>verifyComposition(root,{...af,nativeRowSha256:'0'.repeat(64)}),/native carbohydrate/);
 assert.ok(comps.every(c=>!('polyolsSourceVerified' in c)));assert.ok(comps.every(c=>c.polyols.includes('UNKNOWN_OR_UNUSED')));
});
test('source, exact recipe and input changes invalidate their distinct bindings',()=>{
 const c=structuredClone(cases[0]);verifyCase(root,c);c.candidateIngredients[0].grams+=1;assert.throws(()=>verifyCase(root,c),/input hash/);
 const stale=structuredClone(cases[0]);stale.recipeSha256.fi='0'.repeat(64);assert.throws(()=>verifyCase(root,seal(stale)),/recipe changed/);
 assert.equal(pack.ownerApproval,false);assert.equal(pack.readyAuthorized,false);assert.equal(pack.mergeAuthorized,false);assert.equal(pack.deployAuthorized,false);
});
test('A individual1g and cumulative2g equality still block; higher almond portions stay HOLD',()=>{
 assert.equal(MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G,1);assert.equal(CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G,2);
 for(const id of ['rahkapiirakka-vhh','vhh-lihapiirakka','keto-korvapuustit'])assert.equal(results.find(r=>r.recipeId===id)?.numericProposal,false);
 const c=structuredClone(cases[0]);c.servings=1;c.candidateIngredients=[{name:'one whole gram',grams:1,compositionId:'physical',giId:null,carbohydrateUse:'UPPER_BOUND',note:'Whole weighed mass cap'}];assert.equal(evaluate(c,comps,gis).numericProposal,false);
 c.candidateIngredients=Array.from({length:4},(_,i)=>({...c.candidateIngredients[0],name:String(i),grams:0.5}));assert.equal(evaluate(c,comps,gis).numericProposal,false);
});
test('B includes positive unknownGI; cannot turn omission or sensitivity into a sourced result',()=>{
 const c=structuredClone(cases.find(c=>c.recipeId==='congee-riisipuuro')!);c.candidateIngredients.push({name:'unknown starch',grams:0.1,compositionId:'F006077',giId:null,carbohydrateUse:'AVAILABLE_POINT',note:'Positive contribution must not silently disappear'});const r=evaluate(c,comps,gis);assert.equal(r.numericProposal,false);assert.ok(r.blockers.some(b=>b.includes('UNRESOLVED_POSITIVE_GI')));
 const b=results.find(r=>r.recipeId==='japanilainen-kabocha-puuro')!;assert.equal(b.assumptionSensitivity?.kind,'ASSUMPTION_ONLY');assert.equal(b.assumptionSensitivity?.isBiologicalBound,false);assert.equal(b.assumptionSensitivity?.isConfidenceInterval,false);assert.equal(b.rangeKind,'CONDITIONAL_CODING_MODEL');
 const bread=results.find(r=>r.recipeId==='valimerellinen-halloumi-tomaattileipa')!;assert.equal(bread.rangeKind,'NAMED_COMPARATOR_SCENARIOS');assert.equal(bread.assumptionSensitivity,null);assert.ok(bread.scenarioRange);
});
test('new B coding cannot leak into A or large unknown starch/sauce portions',()=>{
 const c=structuredClone(cases.find(c=>c.recipeId==='japanilainen-kabocha-puuro')!);c.level='A';assert.equal(evaluate(c,comps,gis).numericProposal,false);
 c.level='B';c.candidateIngredients[3].grams=200;assert.equal(evaluate(c,comps,gis).numericProposal,false);
 c.candidateIngredients[3].grams=5;c.candidateIngredients[2].compositionId='F006077';assert.equal(evaluate(c,comps,gis).numericProposal,false);
});
test('C is a distinct nonnumeric type; no class is inferred from GI0–150',()=>{
 const c=structuredClone(cases[0]);c.level='C';const r=evaluate(c,comps,gis);assert.equal(r.numericProposal,false);assert.equal(r.qualitativeClass,null);assert.equal(summarize([r]).classOnly,0);
 const fixture={...r,qualitativeClass:'LOW',blockers:[]} as Result;assert.equal(summarize([fixture]).additionalNumeric,0);assert.equal(summarize([fixture]).classOnly,1);assert.match(formatResult(fixture,'fi').text,/matala/);
});
test('presentation keeps A/B/class/missing separate in four locales and never rounds0.03 to zero',()=>{
 const a=results.find(r=>r.recipeId==='keto-suklaakeksit')!,b=results.find(r=>r.recipeId==='valimerellinen-halloumi-tomaattileipa')!;
 for(const l of ['fi','en','sv','th'] as const){assert.ok(formatResult(a,l).text);assert.ok(formatResult(b,l).text.includes('–'));assert.ok(formatResult(a,l).uncertainty.includes('GI-less'));}
 assert.match(formatResult(a,'fi').text,/0,03/);assert.match(formatResult(results.at(-1)!,'fi').text,/puuttuu/);
});
test('parent recipe/macro sources and all326 original-version results stay unchanged after GK-only approval',()=>{
 const base=json(folder+'baseline.json');
 // The owner has now authorized the explicit integration adapter/UI. Parent
 // recipes, translations and nutrition sources remain immutable and distinct.
 assertRecipeBaseline(root,base.main);
 // New batch evidence may be added; existing nutrition sources may not be modified, removed or renamed.
 const changed=execFileSync('git',['diff','--name-only','--diff-filter=DMRT',base.main,'--','docs/nutrition'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean).filter(p=>!p.startsWith(folder));assert.deepEqual(changed,[]);
 const report=json('tmp/nutrition/glycemic-load-pilot.json');assert.equal(report.summary.calculated,156);assert.equal(report.results.length,326);for(const r of report.results)assert.equal(digest(r),base.baselineResultHashes[r.recipeId],r.recipeId);
 assert.ok(readFileSync(path.join(root,'site/scripts/glycemic-load-pilot.ts'),'utf8').includes('buildGkOnlyVariants'));assert.ok(!readFileSync(path.join(root,'site/scripts/gk80-release.ts'),'utf8').includes('gk149'));assert.equal(base.numericIds.length,156);
});
test('independent Python Decimal verifies actual16 and rejects the three blocked attempts',()=>{
 const p=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,folder+'verify_decimal.py')],{encoding:'utf8'}));assert.equal(p.status,'PASS');assert.equal(p.checked,16);assert.equal(p.held,3);assert.equal(p.writes,0);
});
