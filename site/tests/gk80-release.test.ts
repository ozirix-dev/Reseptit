import {execFileSync} from 'node:child_process';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';import {calculate,fingerprint} from '../scripts/gk80-candidate-model';import {parseMarkdown} from '../src/content/markdown';import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80-release-1/',root),json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,gold=json('golden.json').recipes;
test('four changed recipe files and cooking instructions bind to exact numerical inputs',()=>{
 for(const r of recipes){const markdown=readFileSync(new URL(r.sourcePath,root),'utf8'),hash=createHash('sha256').update(markdown.replaceAll('\r\n','\n')).digest('hex');const out=calculate(r,sources,hash,gold.find((g:{recipeId:string})=>g.recipeId===r.recipeId).inputHash,comps);assert.equal(out.numericProposal,true);assert.ok(out.impact.imputationUsed);assert.equal(out.impact.biologicalBoundEstablished,false);
  const changed=structuredClone(r);changed.scenarios[0].ingredients[0].massG+=10;assert.throws(()=>calculate(changed,sources,hash,fingerprint(r),comps),/STALE_INPUT/);
  assert.throws(()=>calculate(r,sources,'0'.repeat(64),fingerprint(r),comps),/STALE_INPUT/);
 }
});
test('four macro evidence files exactly match weighed published candidate ingredients',()=>{
 for(const r of recipes){const parsed=parseMarkdown(readFileSync(new URL(r.sourcePath,root),'utf8'))!;const evidence=JSON.parse(readFileSync(new URL(`docs/nutrition/calculations/${r.recipeId}.json`,root),'utf8'));const out=verifyNutritionEvidence(parsed.data as never,evidence);assert.deepEqual(out.errors,[]);assert.equal(out.status,'ESTIMATE WITH EVIDENCE');}
});
test('variants, distinct porridge IDs and existing-language scope remain explicit',()=>{
 const m=json('manifest.json');for(const id of m.recipeIds)assert.deepEqual(m.existingLocales[id],['fi']);assert.equal(m.approvalState,'OWNER_APPROVAL_REQUIRED');
 assert.equal(recipes.length,4);assert.equal(new Set(recipes.map((r:{sourcePath:string})=>r.sourcePath)).size,4);
 const mint=recipes.find((r:{recipeId:string})=>r.recipeId.includes('minttutee'));assert.match(mint.proposedTitle,/syötävän mintun/);assert.match(mint.proposedPreparation.join(' '),/ei siivilöidä/);
 const bubur=recipes.find((r:{recipeId:string})=>r.recipeId.includes('bubur'));assert.match(bubur.proposedTitle,/perusversio/);
});

test('independent Decimal checks all release contribution terms',()=>{const output=execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-release-decimal.py',root))],{encoding:'utf8'});assert.equal(JSON.parse(output).status,'PASS');});

test('release sources distinguish human analogues, published coding and recipe scenarios',()=>{
 const results=JSON.parse(readFileSync(new URL('tmp/nutrition/glycemic-load-pilot.json',root),'utf8')).results;
 for(const r of recipes){const result=results.find((x:{recipeId:string})=>x.recipeId===r.recipeId);
  assert.equal(result.modelScenario,'POINT_SCENARIO');
  assert.ok(result.candidateSources.some((s:{evidenceKind:string,matchKind:string})=>s.evidenceKind==='HUMAN_GI'&&s.matchKind==='ANALOG'));
  assert.ok(result.candidateSources.some((s:{evidenceKind:string,matchKind:string})=>s.evidenceKind==='PUBLISHED_IMPUTATION'&&s.matchKind==='CALCULATION_POLICY'));
 }
});
