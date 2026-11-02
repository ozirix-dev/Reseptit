import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {fingerprint} from '../scripts/gk80-candidate-model';
import {loadScenarioPilot,assessPilot,assessProduct,normalizeProduct,verifyPack,quantity,omissionsWithinPolicy,type PilotPack,type Product} from '../scripts/gk-scenario-model';
import {scenarioDependencies} from '../scripts/gk-scenario-dependencies';

const root=fileURLToPath(new URL('../../',import.meta.url));
const {pack,base}=loadScenarioPilot(root),report=assessPilot(pack,base);
const reseal=<T extends {evidenceHash:string}>(v:T):T=>{const {evidenceHash:_,...body}=v;return {...v,evidenceHash:fingerprint(body)};};
function repack(p:PilotPack){const {inputHash:_,...body}=p;p.inputHash=fingerprint(body);return p;}
const altered=(fn:(p:PilotPack)=>void)=>{const p=structuredClone(pack);fn(p);return repack(p);};
const near=(a:number|null,b:number)=>assert.ok(a!==null&&Math.abs(a-b)<1e-12,`${a} != ${b}`);

test('approved mud cake input and original result remain exactly pinned',()=>{
 assert.equal(base.original.inputHash,'b373e5621c6c939eaec2af8c9c11cd687f0a4b0f179159b5d143d2d4141e6af3');
 assert.equal(base.original.point,0.07);assert.equal(base.original.omittedCho,1.3774);
 assert.equal(pack.baselineMain,'92dc6dbe7b27e145d6938026c73b6823f2e2108f');
 for(const r of report.results)assert.deepEqual(r.original,base.original);
});
test('maltitol, xylitol and erythritol retain distinct coefficients and masses',()=>{
 const r=report.results.find(r=>r.scenarioId==='afcd-f009837')!;
 const m=r.terms.find(t=>t.id==='chocolate-maltitol')!,x=r.terms.find(t=>t.id==='chocolate-xylitol')!,e=r.terms.find(t=>t.id==='chocolate-erythritol')!;
 assert.equal(m.coefficient,35);assert.equal(x.coefficient,13);assert.equal(e.coefficient,0);
 near(m.gPerServing,5.25);near(x.gPerServing,0.675);near(e.gPerServing,0.7125);
 near(m.gkPerServing,1.8375);near(x.gkPerServing,0.08775);assert.equal(e.evidence,'CONDITIONAL_RESEARCH');
});
test('AFCD without is used once; with is retained but not added, subtracted or declared total',()=>{
 const p=pack.products.find(p=>p.id==='afcd-f009837')!,r=report.results.find(r=>r.scenarioId===p.id)!;
 assert.equal(normalizeProduct(pack,p).ordinaryPer100g,4.1);
 near(r.terms.find(t=>t.id==='chocolate-ordinary')!.gPerServing,0.76875);
 assert.equal(r.coverage.unresolvedPolyolsG,null);assert.equal(r.coverage.aggregatePolyolsComplete,false);
 assert.ok(r.blockers.includes('AGGREGATE_POLYOLS_UNKNOWN'));
 const p2=altered(a=>{a.products[3]=reseal({...a.products[3],aggregateComplete:true,raw:{...a.products[3].raw,polyols:'28'}});});
 assert.equal(assessProduct(p2,p2.products[3],base).conditional.kind,'UNAVAILABLE');
 const asNamed=altered(a=>{a.products[3]=reseal({...a.products[3],kind:'NAMED_PRODUCT'});});
 assert.equal(assessProduct(asNamed,asNamed.products[3],base).conditional.kind,'UNAVAILABLE');
});
test('EU label subtraction occurs once; fibre and separate erythritol are not subtracted again',()=>{
 const p=pack.products[1],r=report.results[1];assert.equal(normalizeProduct(pack,p).ordinaryPer100g,5);
 near(r.terms.find(t=>t.id==='chocolate-ordinary')!.gPerServing,0.9375);
 const e=r.terms.filter(t=>t.id==='separate-erythritol');assert.equal(e.length,1);near(e[0].gPerServing,10);
 assert.equal(e[0].coefficient,0);assert.equal(e[0].evidence,'CONDITIONAL_RESEARCH');
 const p2=altered(a=>{a.products[1]=reseal({...a.products[1],raw:{...a.products[1].raw,withoutSugarAlcohols:'5'}});});
 assert.match(assessProduct(p2,p2.products[1],base).blockers[0],/DOUBLE_CARBOHYDRATE/);
});
test('missing GI/response never becomes zero or an evidence-bounded interval',()=>{
 const p=altered(a=>{a.products[0].responseBindings={};a.products[0]=reseal(a.products[0]);});
 const r=assessProduct(p,p.products[0],base),t=r.terms.find(t=>t.id==='chocolate-maltitol')!;
 assert.equal(t.gkPerServing,null);assert.equal(t.coefficient,null);assert.equal(t.evidence,'UNRESOLVED');
 assert.equal(r.wholeRecipe.kind,'UNAVAILABLE');assert.equal(r.classRobustness,'NOT_DETERMINABLE');
 assert.ok(r.coverage.unresolvedPolyolsG!>0);assert.equal(report.wholeRecipeRange,null);
});
test('product composition and species response bindings cannot be swapped',()=>{
 const p=altered(a=>{a.products[0]=reseal({...a.products[0],sourceId:a.products[1].sourceId,sourceHash:a.products[1].sourceHash});});
 assert.equal(assessProduct(p,p.products[0],base).conditional.kind,'UNAVAILABLE');
 const p2=altered(a=>{a.products[0].responseBindings.maltitol='livesey-xylitol';a.products[0]=reseal(a.products[0]);});
 assert.match(assessProduct(p2,p2.products[0],base).blockers[0],/WRONG_POLYOL/);
});
test('product outputs stay separate, input remains immutable, no universal min/max is manufactured',()=>{
 const before=JSON.stringify({pack,base});
 const a=assessProduct(pack,pack.products[0],base),b=assessProduct(pack,pack.products[1],base);
 assert.notEqual(a.productHash,b.productHash);assert.notDeepEqual(a.terms,b.terms);
 assert.equal(JSON.stringify({pack,base}),before);assert.equal(report.results.length,4);
 assert.equal(report.wholeRecipeRange,null);assert.equal(report.coverageDelta,0);
});
test('stale source, product and pack hashes fail closed without leaking a numerical fallback',()=>{
 for(const mutate of [(p:PilotPack)=>{p.products[0].raw.labelCarbohydrate='49';},(p:PilotPack)=>{p.sources[0].title='changed';},(p:PilotPack)=>{p.chocolateGrams='151';}]){
  const p=structuredClone(pack);mutate(p);const r=assessProduct(p,p.products[0],base);
  assert.equal(r.conditional.kind,'UNAVAILABLE');assert.equal(r.calculatedPortion,null);assert.deepEqual(r.terms,[]);
 }
 assert.throws(()=>verifyPack(altered(p=>{p.responses[0]=reseal({...p.responses[0],gi:'36'});})),/RESPONSE_SOURCE_BINDING/);
});
test('absent, negative, NaN and malformed quantities are rejected; explicit zero is distinct',()=>{
 for(const v of [null,undefined,'','-1','NaN','1e2',0,Infinity])assert.throws(()=>quantity(v));assert.equal(quantity('0'),0);
 const p=altered(a=>{a.products[0]=reseal({...a.products[0],raw:{...a.products[0].raw,polyols:null}});});
 assert.equal(assessProduct(p,p.products[0],base).conditional.kind,'UNAVAILABLE');
 const incomplete=altered(a=>{a.products[0]=reseal({...a.products[0],manufacturer:''});});
 assert.equal(assessProduct(incomplete,incomplete.products[0],base).conditional.kind,'UNAVAILABLE');
});
test('positive omissions remain visible and strict existing limits are preserved',()=>{
 assert.equal(omissionsWithinPolicy([0.999999,0.999999]),true);
 assert.equal(omissionsWithinPolicy([1]),false);assert.equal(omissionsWithinPolicy([0.8,0.8,0.4]),false);
 assert.equal(omissionsWithinPolicy([NaN]),false);assert.equal(omissionsWithinPolicy([-1]),false);
 for(const r of report.results){
  const missing=r.terms.filter(t=>t.species===null&&t.gkPerServing===null);
  assert.ok(missing.length>0);assert.ok(missing.every(t=>t.gPerServing!>0));
  near(r.coverage.omittedOrdinaryChoG,missing.reduce((s,t)=>s+t.gPerServing!,0));
  assert.equal(r.coverage.omissionPolicySatisfied,missing.every(t=>t.gPerServing!<1)&&r.coverage.omittedOrdinaryChoG!<2);
  assert.equal(r.wholeRecipe.kind,'UNAVAILABLE');assert.equal(r.status,'HOLD');
 }
 const p=altered(a=>{a.products[0]=reseal({...a.products[0],raw:{...a.products[0].raw,labelCarbohydrate:'100'}});});
 assert.equal(assessProduct(p,p.products[0],base).conditional.kind,'UNAVAILABLE');
});
test('SD/SEM values never form bounds; all response transfers remain assumptions',()=>{
 for(const r of report.results){assert.equal(r.conditional.kind,'CONDITIONAL_SCENARIOS');
  if(r.conditional.kind==='CONDITIONAL_SCENARIOS'){assert.equal(r.conditional.isConfidenceInterval,false);assert.equal(r.conditional.isBiologicalBound,false);assert.equal(r.conditional.scope,'COMPONENT_SUBTOTAL');}
  assert.equal(r.wholeRecipe.kind,'UNAVAILABLE');assert.equal(r.publicationAuthorized,false);
 }
});
test('inconsistent recipe context is HOLD, never scaled into another version',()=>{
 const r=assessProduct(pack,pack.products[0],{...base,servings:16});assert.equal(r.conditional.kind,'UNAVAILABLE');
 const tampered=structuredClone(base);tampered.terms[0].gkPerServing=999;
 assert.equal(assessProduct(pack,pack.products[0],tampered).conditional.kind,'UNAVAILABLE');
});
test('generic ingredient dependency inventory is deduplicated and opens no unsupported coverage',()=>{
 const deps=scenarioDependencies(root);assert.equal(new Set(deps.rows.map(r=>r.recipeId)).size,deps.count);
 assert.ok(deps.rows.some(r=>r.recipeId==='keto-suklaakeksit'&&r.chocolatePolyolProblem));
 assert.equal(deps.verifiedCompositionDifferences,2);assert.equal(deps.coverageDelta,0);assert.equal(deps.newSourceEligibleNumericalResults,0);
});
test('preview is isolated, data driven, four-language draft, no SEO nutrition data',()=>{
 const html=readFileSync(path.join(root,'site/previews/gk-scenarios.html'),'utf8');
 assert.ok(html.includes('noindex,nofollow,noarchive'));assert.ok(html.includes('GENERATED_RESULT_DATA'));
 assert.ok(!html.includes('application/ld+json'));assert.ok(!html.includes('schema.org'));assert.ok(!html.includes('canonical'));
 assert.ok(!html.includes('0.07'));assert.ok(!html.includes('2.7'));assert.ok(html.includes('aria-live="polite"'));
 for(const lang of ['fi','en','sv','th'])assert.ok(html.includes(lang+':{'));
 assert.ok(!readFileSync(path.join(root,'site/src/router.tsx'),'utf8').includes('gk-scenario'));
});

// Keep public typing usable without letting arbitrary raw Product fields become a recipe macro package.
const productTypeCheck:Product=pack.products[0];assert.equal(productTypeCheck.basis,'per100g');
