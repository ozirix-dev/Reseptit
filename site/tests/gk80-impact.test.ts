import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, fingerprint, display, stressTestUnknown, type Recipe, type Source, type Ingredient, type CompositionSource } from '../scripts/gk80-model';

// Synthetic fixtures exercise arithmetic and validation, not scientific approval.
const signed = <T extends object>(payload: T) => ({ ...payload, evidenceHash: fingerprint(payload) });
const sources: Source[] = [
  signed({id:'main', gi:60, family:'grain', scale:'GLUCOSE_100'}),
  signed({id:'milk-low', gi:30, family:'dairy', scale:'GLUCOSE_100', evidenceKind:'HUMAN_GI'}),
  signed({id:'milk-high', gi:46, family:'dairy', scale:'GLUCOSE_100', evidenceKind:'HUMAN_GI'}),
  signed({id:'vegetable-estimate', gi:40, family:'vegetable', scale:'GLUCOSE_100', evidenceKind:'PUBLISHED_IMPUTATION'}),
  signed({id:'over100', gi:114, family:'grain', scale:'GLUCOSE_100'}),
];
const compositions: CompositionSource[] = [signed({id:'known',per100g:{availableCarbohydrate:20,protein:2,fat:1,fibre:3}})];
function ingredient(index:number, giId:string|null, carbohydrate:number): Ingredient {
  const source=sources.find(s=>s.id===giId);
  return {index,name:'fixture',massG:100,per100g:{availableCarbohydrate:carbohydrate,protein:2,fat:1,fibre:3},retention:1,
    carbohydrateDefinition:'AVAILABLE_EXCLUDING_FIBRE_AND_POLYOLS',giId,giEvidenceHash:source?.evidenceHash??null,
    family:source?.family??'dairy',match:'APPLIED',applicability:'Explicit synthetic scenario'};
}
function fixture():Recipe {
  return {recipeId:'fixture',sourceSha256:'recipe-v1',servings:1,method:'C',completeInputScope:true,coverageProposalEligible:true,
    scenarios:['milk-low','milk-high'].map(id=>({id,ingredients:[ingredient(0,'main',20),{
      ...ingredient(1,null,.3),impact:{kind:'SOURCE_COMPARATOR',sourceId:id,evidenceHash:sources.find(s=>s.id===id)!.evidenceHash,rationale:'Two named dairy comparators'},
    }]}))};
}
const run=(r:Recipe, ss=sources, cc:CompositionSource[]=[])=>calculate(r,ss,r.sourceSha256,fingerprint(r),cc);
const close=(a:number|null,b:number)=>assert.ok(a!==null&&Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('small positive CHO without exact GI yields a complete named comparator scenario',()=>{
  const out=run(fixture());close(out.min,12.09);close(out.max,12.138);
  assert.equal(out.numericProposal,true);assert.equal(out.impact.withinOneUnitEditorialTarget,true);
  close(out.impact.scenarioSpread,.048);assert.equal(out.impact.biologicalBoundEstablished,false);
  assert.equal(out.scenarios[0].contributions[1].reason,'SOURCE_COMPARATOR');
});
test('multiple small uncertain components accumulate before the one-unit editorial check',()=>{
  const r=fixture();r.scenarios.forEach(s=>{for(let k=2;k<11;k++)s.ingredients.push({...structuredClone(s.ingredients[1]),index:k});});
  const out=run(r);assert.equal(out.impact.withinOneUnitEditorialTarget,false);close(out.max,13.38);
  // A fully sourced, useful larger scenario remains a numerical proposal; it is not called minor.
  assert.equal(out.numericProposal,true);
});
test('published imputation is disclosed separately and cannot masquerade as a measured interval',()=>{
  const r=fixture();r.scenarios=[r.scenarios[0]];
  const i=r.scenarios[0].ingredients[1];i.family='vegetable';i.impact={kind:'PUBLISHED_IMPUTATION',sourceId:'vegetable-estimate',evidenceHash:sources[3].evidenceHash,rationale:'Explicit published coding estimate, not a physiological bound'};
  const out=run(r);assert.equal(out.impact.imputationUsed,true);close(out.scenarios[0].imputedImpact,.12);
  assert.equal(out.impact.biologicalBoundEstablished,false);
  i.per100g!.availableCarbohydrate=3;assert.equal(run(r).numericProposal,false);
  i.impact.kind='SOURCE_COMPARATOR';assert.throws(()=>run(r),/IMPACT_EVIDENCE_KIND/);
});
test('large unresolved effect and tiny unsupported effect both remain unknown; stress never approves',()=>{
  for(const cho of [.001,40]){const r=fixture();r.scenarios.forEach(s=>{delete s.ingredients[1].impact;s.ingredients[1].per100g!.availableCarbohydrate=cho;});
    const out=run(r);assert.equal(out.numericProposal,false);assert.equal(out.min,null);
    assert.equal(out.scenarios[0].contributions[1].gk,null);assert.equal(stressTestUnknown(cho,150).coverageEligible,false);
    assert.equal(stressTestUnknown(cho,150).evidence,'HYPOTHETICAL_NOT_A_BOUND');}
});
test('missing mass prevents a whole total even when a comparator exists',()=>{
  const r=fixture();r.scenarios[0].ingredients[1].massG=null;
  const out=run(r);assert.equal(out.min,null);assert.equal(out.scenarios[0].wholeCarbohydrate,null);
});
test('known CHO zero is legitimate; a missing composition is never a zero',()=>{
  const r=fixture();r.scenarios=r.scenarios.slice(0,1);r.scenarios[0].ingredients=[ingredient(0,null,0)];
  close(run(r).min,0);assert.equal(display(run(r),'fi').text,'GK-arvio noin 0');
  r.scenarios[0].ingredients[0].per100g=null;assert.equal(run(r).min,null);
});
test('positive GL that rounds below one remains visibly positive',()=>{
  const r=fixture();r.scenarios.forEach(s=>s.ingredients.forEach(i=>i.massG=.1));
  assert.match(display(run(r),'fi').text,/<1$/);assert.ok(run(r).min!>0);
});
test('two-class crossings stay numeric and expose both classes',()=>{
  const r=fixture();r.scenarios[0].ingredients[0].per100g!.availableCarbohydrate=16;
  const out=run(r);assert.equal(out.numericProposal,true);assert.deepEqual(out.classes,['LOW','MEDIUM']);
});
test('dependent ingredient choices are calculated as complete bundles, not Cartesian extrema',()=>{
  const r=fixture();r.method='D';r.scenarios[0].ingredients[0].massG=200;r.scenarios[1].ingredients[1].massG=200;
  const out=run(r);close(out.min,12.276);close(out.max,24.09);assert.equal(out.scenarios.length,2);
});
test('stale composition source, changed macros, and stale recipe are rejected',()=>{
  const r=fixture();r.evidenceVersion=2;r.scenarios=[{id:'one',ingredients:[ingredient(0,'main',20)]}];
  r.scenarios[0].ingredients[0].composition={sourceId:'known',evidenceHash:compositions[0].evidenceHash};
  close(run(r,sources,compositions).min,12);
  const stale=structuredClone(compositions);stale[0].per100g.fat=5;assert.throws(()=>run(r,sources,stale),/STALE_COMPOSITION/);
  r.scenarios[0].ingredients[0].per100g!.protein=5;assert.throws(()=>run(r,sources,compositions),/COMPOSITION_MISMATCH/);
  assert.throws(()=>calculate(r,sources,'changed',fingerprint(r),compositions),/STALE_INPUT/);
});
test('stale comparator, wrong family, mixed bindings and direct-method mislabelling fail closed',()=>{
  const r=fixture();r.scenarios[0].ingredients[1].impact!.evidenceHash='stale';assert.throws(()=>run(r),/STALE_BINDING/);
  const f=fixture();f.scenarios[0].ingredients[1].family='grain';assert.throws(()=>run(f),/WRONG_FOOD_FAMILY/);
  const both=fixture();both.scenarios[0].ingredients[1].giId='main';assert.throws(()=>run(both),/AMBIGUOUS/);
  const direct=fixture();direct.method='A';direct.scenarios.forEach(s=>s.ingredients[0].match='DIRECT');assert.throws(()=>run(direct),/IMPACT_NOT_DIRECT/);
  const src=structuredClone(sources);src[1].gi=31;assert.throws(()=>run(fixture(),src),/STALE_SOURCE/);
});
test('GI above 100 is preserved; incomplete scenario scopes cannot silently omit rows',()=>{
  const r=fixture();r.scenarios=[{id:'high',ingredients:[ingredient(0,'over100',20)]}];close(run(r).min,22.8);
  const scope=fixture();scope.evidenceVersion=2;scope.scenarios[1].ingredients.pop();assert.throws(()=>run(scope),/INCONSISTENT_SCENARIO_SCOPE/);
});
