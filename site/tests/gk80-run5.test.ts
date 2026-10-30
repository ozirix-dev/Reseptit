import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {fingerprint,display} from '../scripts/gk80-candidate-model';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calculateCandidate} from '../scripts/gk80-candidate-policy';
const root=new URL('../../',import.meta.url),base=new URL('docs/nutrition/gk80/run-5/',root);
const json=(f:string)=>JSON.parse(readFileSync(new URL(f,base),'utf8'));
test('all 48 prior proposals have explicit compatible food and preparation bindings',()=>{
 const recipes=json('prior48/recipes.json').recipes,bundles=json('prior48/evidence-bundles.json').recipes,golden=json('prior48/golden.json').recipes;
 assert.equal(recipes.length,48);assert.equal(new Set(recipes.map((r:any)=>r.recipeId)).size,48);
 for(const r of recipes){const g=golden.find((g:any)=>g.recipeId===r.recipeId),bundle=bundles.find((b:any)=>b.recipeId===r.recipeId);const result=calculateCandidate(r,bundle.sources,r.sourceSha256,g.inputHash,bundle.comps);assert.equal(result.numericProposal,true,r.recipeId);
  for(let n=0;n<result.scenarios.length;n++){assert.ok(Math.abs(result.scenarios[n].wholeGk!-g.scenarios[n].wholeGk)<1e-10,r.recipeId);}
 }
 assert.equal(recipes.some((r:any)=>r.recipeId==='pohjoisafrikkalainen-harcha-juustolla'),false);
});

test('40 new IDs contain26 complete numerical proposals,19 in first20, with unchanged sources',()=>{
 const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,golden=json('golden.json').recipes,prior=new Set(json('prior48/recipes.json').recipes.map((r:any)=>r.recipeId));
 assert.equal(recipes.length,40);assert.equal(new Set(recipes.map((r:any)=>r.recipeId)).size,40);let count=0;
 for(const [n,r] of recipes.entries()){
  assert.equal(prior.has(r.recipeId),false);const hash=createHash('sha256').update(readFileSync(new URL(r.sourcePath,root),'utf8').replaceAll('\r\n','\n')).digest('hex');assert.equal(hash,r.sourceSha256,r.recipeId);
  if(!r.coverageProposalEligible){assert.ok(r.blockers.length);continue;}
  const g=golden.find((g:any)=>g.recipeId===r.recipeId),out=calculateCandidate(r,sources,hash,g.inputHash,comps);assert.equal(out.numericProposal,true,r.recipeId);count++;
  assert.ok(r.proposedPreparation.length>=3);assert.equal(r.proposedVersionHash,fingerprint({title:r.proposedTitle,servings:r.servings,scenarios:r.scenarios,preparation:r.proposedPreparation}));
  for(const locale of ['fi','en','sv','th'] as const)assert.ok(display(out,locale).text);
  for(let k=0;k<out.scenarios.length;k++){
   const a=out.scenarios[k],b=g.scenarios[k];for(const key of ['availableCarbohydrate','protein','fat','fibre'] as const)assert.ok(Math.abs(a.macros[key]-b.macros[key])<1e-10,r.recipeId+' '+key);
   assert.ok(Math.abs(a.wholeGk!-b.wholeGk)<1e-10,r.recipeId);for(let j=0;j<a.contributions.length;j++)assert.ok(Math.abs(a.contributions[j].gk!-b.contributions[j].gk)<1e-10,r.recipeId+' contribution'+j);
  }
  if(n===19)assert.equal(count,19);
 }
 assert.equal(count,26);
});
test('independent Decimal reproduces all40 new and48 audited old proposals and USDA proxy semantics',()=>{
 const out=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-run5-decimal.py',root))],{encoding:'utf8'}));assert.equal(out.status,'PASS');assert.equal(out.recipes,88);
});
test('food/preparation aliases reject changed identities, states and overdosed spices',()=>{
 const r=json('recipes.json').recipes.find((r:any)=>r.recipeId==='jerk-kana'),sources=json('sources.json').records,comps=json('composition-sources.json').records;
 const changed=structuredClone(r);const spice=changed.scenarios[0].ingredients.find((i:any)=>i.composition?.sourceId==='U171315-r5');spice.massG=50;
 assert.throws(()=>calculateCandidate(changed,sources,changed.sourceSha256,fingerprint(changed),comps),/PORTION_CHO_LIMIT/);
 spice.massG=3.5;spice.state='peanut butter';assert.throws(()=>calculateCandidate(changed,sources,changed.sourceSha256,fingerprint(changed),comps),/UNREVIEWED_FOOD_PREPARATION/);
});
test('nine legacy zero IDs are flagged as omitted positive CHO, without rewriting production results',()=>{
 const zero=json('legacy-nine-zeros.json');assert.equal(zero.recipes.length,9);assert.equal(zero.trueZeroCho,0);
 for(const r of zero.recipes){assert.equal(r.unrounded,0);assert.ok(r.positiveAvailableCarbohydratePerServing>0);assert.equal(r.classification,'OMITTED_POSITIVE_CHO_ZERO');}
 const coverage=json('coverage.json');assert.equal(coverage.assignments.length,326);assert.equal(new Set(coverage.assignments.map((r:any)=>r.recipeId)).size,326);assert.equal(Object.values(coverage.categories).reduce((a:any,b:any)=>a+b,0),326);assert.equal(coverage.conditionalUnique,74);
});
test('new modeled path withholds positive-CHO ingredients lacking GI instead of inventing a zero total',()=>{
 const r=structuredClone(json('recipes.json').recipes.find((r:any)=>r.coverageProposalEligible));for(const i of r.scenarios[0].ingredients){i.giId=null;i.giEvidenceHash=null;delete i.impact;}
 const out=calculateCandidate(r,[],r.sourceSha256,fingerprint(r),json('composition-sources.json').records);assert.equal(out.numericProposal,false);assert.equal(out.min,null);assert.ok(out.scenarios[0].macros.availableCarbohydrate>0);
});
