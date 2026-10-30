import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {calculate, fingerprint, verifySource, proposalCount, display, type Recipe, type Source, type CompositionSource} from '../scripts/gk80-model';
const root=new URL('../../',import.meta.url), folder=new URL('docs/nutrition/gk80/run-2/',root);
const json=(name:string)=>JSON.parse(readFileSync(new URL(name,folder),'utf8'));
type Row=Recipe & {sourcePath:string;reviewState:string;proposedPreparation?:string[]};
const recipes:Row[]=json('recipes.json').recipes, sources:Source[]=json('sources.json').records, compositions:CompositionSource[]=json('composition-sources.json').records;
const golden=json('golden.json').recipes;
const fileHash=(path:string)=>createHash('sha256').update(readFileSync(new URL(path.replaceAll('\\','/'),root),'utf8').replaceAll('\r\n','\n')).digest('hex');
const run=(r:Row)=>calculate(r,sources,fileHash(r.sourcePath),golden.find((g:{recipeId:string})=>g.recipeId===r.recipeId).inputHash,compositions);
const near=(a:number|null,b:number|null)=>a===null||b===null?assert.equal(a,b):assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('run 2 contains exactly 30 distinct currently incomplete recipes, none from pilot 1',()=>{
  const old=JSON.parse(readFileSync(new URL('docs/nutrition/gk80/pilot-1/legacy-results.json',root),'utf8'));
  const pilot=JSON.parse(readFileSync(new URL('docs/nutrition/gk80/pilot-1/recipes.json',root),'utf8')).recipes;
  assert.equal(recipes.length,30);assert.equal(new Set(recipes.map(r=>r.recipeId)).size,30);
  assert.equal(json('selection.json').screened,243);
  for(const r of recipes){assert.ok(old.some((x:{recipeId:string;status:string})=>x.recipeId===r.recipeId&&x.status!=='CALCULATED'));assert.ok(!pilot.some((x:Row)=>x.recipeId===r.recipeId));}
});
test('all 30 independent Decimal calculations match every contribution and all four macros',()=>{
  for(const r of recipes){const out=run(r),expected=golden.find((g:{recipeId:string})=>g.recipeId===r.recipeId);
    assert.equal(out.scenarios.length,expected.scenarios.length);
    out.scenarios.forEach((s,n)=>{const e=expected.scenarios[n];near(s.wholeGk,e.wholeGk);near(s.wholeCarbohydrate,e.wholeCarbohydrate);near(s.knownSubtotal,e.knownSubtotal);near(s.imputedImpact,e.imputedImpact);
      for(const k of ['availableCarbohydrate','protein','fat','fibre'] as const)near(s.macros[k],e.macros[k]);
      s.contributions.forEach((c,j)=>{assert.equal(c.index,e.contributions[j].index);near(c.carbohydrate,e.contributions[j].carbohydrate);near(c.gk,e.contributions[j].gk);});
    });
  }
});
test('four conditional points disclose imputation; hypotheses never count as accepted or published',()=>{
  const results=recipes.map(run);assert.equal(proposalCount(results),4);assert.equal(proposalCount([...results,...results]),4);
  for(const r of recipes){const out=run(r);if(out.numericProposal){assert.equal(out.min,out.max);assert.equal(out.impact.imputationUsed,true);assert.equal(out.impact.biologicalBoundEstablished,false);assert.ok(out.scenarios[0].imputedImpact>0&&out.scenarios[0].imputedImpact<=1);assert.equal(r.reviewState,'READY_FOR_INDEPENDENT_APPROVAL');assert.ok(r.proposedPreparation?.length);assert.match(display(out,'fi').note,/GI-oletuk/);}else{assert.equal(out.min,null);}}
});
test('source manifests and frozen input hashes prevent silent evidence drift',()=>{
  sources.forEach(verifySource);
  for(const c of compositions){const {evidenceHash,...payload}=c;assert.equal(fingerprint(payload),evidenceHash);}
  for(const f of json('provenance.json').localFiles)assert.equal(fileHash(f.path),f.sha256,f.path);
  for(const r of json('selection.json').recipes){assert.equal(fileHash(r.sourcePath),r.sourceSha256);if(r.priorCalculationPath)assert.equal(fileHash(r.priorCalculationPath),r.priorCalculationSha256);}
});
test('removing the published estimate cannot silently preserve a numeric result',()=>{
  const r=structuredClone(recipes[0]);r.scenarios[0].ingredients.forEach(i=>{delete i.impact;});
  const result=calculate(r,sources,r.sourceSha256,fingerprint(r),compositions);assert.equal(result.numericProposal,false);assert.equal(result.min,null);
  const wrong=structuredClone(recipes[0]);const i=wrong.scenarios[0].ingredients.find(i=>i.impact)!;i.impact!.kind='SOURCE_COMPARATOR';
  assert.throws(()=>calculate(wrong,sources,wrong.sourceSha256,fingerprint(wrong),compositions),/IMPACT_EVIDENCE_KIND/);
});
test('the independent Python Decimal verifier also runs in normal CI',()=>{
  const output=execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-run2-decimal.py',root))],{encoding:'utf8'});
  const result=JSON.parse(output);assert.equal(result.status,'PASS');assert.equal(result.verifiedRecipes,30);assert.equal(result.numericProposals,4);assert.equal(result.numericCompositionRows,20);
});
