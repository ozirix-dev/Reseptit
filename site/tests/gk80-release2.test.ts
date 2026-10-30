import {siteContent} from '../src/generated/content.generated';
import {execFileSync} from 'node:child_process';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';import {fingerprint} from '../scripts/gk80-candidate-model';import {calculateCandidate as calculate} from '../scripts/gk80-candidate-policy';import {applyGk80Release} from '../scripts/gk80-release';import {parseMarkdown} from '../src/content/markdown';import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80-release-2/',root),json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,gold=json('golden.json').recipes;
test('eight changed recipe files and cooking instructions bind to exact numerical inputs',()=>{
 for(const r of recipes){const markdown=readFileSync(new URL(r.sourcePath,root),'utf8'),hash=createHash('sha256').update(markdown.replaceAll('\r\n','\n')).digest('hex');const out=calculate(r,sources,hash,gold.find((g:{recipeId:string})=>g.recipeId===r.recipeId).inputHash,comps);assert.equal(out.numericProposal,true);assert.ok(out.impact.imputationUsed);assert.equal(out.impact.biologicalBoundEstablished,false);
  const changed=structuredClone(r);changed.scenarios[0].ingredients[0].massG+=10;assert.throws(()=>calculate(changed,sources,hash,fingerprint(r),comps),/STALE_INPUT/);
  assert.throws(()=>calculate(r,sources,'0'.repeat(64),fingerprint(r),comps),/STALE_INPUT/);
 }
});
test('eight macro evidence files exactly match weighed published candidate ingredients',()=>{
 for(const r of recipes){const parsed=parseMarkdown(readFileSync(new URL(r.sourcePath,root),'utf8'))!;const evidence=JSON.parse(readFileSync(new URL(`docs/nutrition/calculations/${r.recipeId}.json`,root),'utf8'));const out=verifyNutritionEvidence(parsed.data as never,evidence);assert.deepEqual(out.errors,[]);assert.equal(out.status,'ESTIMATE WITH EVIDENCE');}
});
test('exactly eight intended results change, all other 318 retain legacy status and values',async()=>{
 const report=JSON.parse(readFileSync(new URL('tmp/nutrition/glycemic-load-pilot.json',root),'utf8'));const baseline=json('legacy-baseline.json').recipes;const selected=new Set(recipes.map((r:{recipeId:string})=>r.recipeId));assert.equal(selected.size,8);assert.equal(report.summary.calculated,91);assert.equal(report.summary.insufficientSourceData,235);
 for(const old of baseline){const now=report.results.find((r:{recipeId:string})=>r.recipeId===old.recipeId);if(selected.has(old.recipeId)){assert.equal(old.status,'INSUFFICIENT SOURCE DATA');assert.equal(now.status,'CALCULATED');assert.equal(now.assessmentType,'PUBLISHED_IMPUTATION');assert.equal(now.confidence,'LOW');assert.equal(now.omittedAvailableCarbohydratePerServingG,0);}else{assert.equal(now.status,old.status,old.recipeId);assert.equal(createHash('sha256').update(JSON.stringify(now)).digest('hex'),old.sha256,old.recipeId);}}
 const applied=await applyGk80Release(fileURLToPath(root),report.results);assert.equal(applied.length,326);
});
test('all eight are existing FI-only recipes with precise cooking versions',()=>{
 const m=json('manifest.json');assert.equal(m.recipeIds.length,8);for(const id of m.recipeIds)assert.deepEqual(m.existingLocales[id],['fi']);assert.equal(m.approvalState,'OWNER_APPROVAL_REQUIRED');
 for(const r of recipes)assert.ok(r.proposedPreparation.length>=3);
 const sesame=recipes.find((r:any)=>r.recipeId==='kiinalainen-musta-seesamipuuro');assert.match(sesame.proposedPreparation.join(' '),/kokonaisina/);
});

test('independent Decimal checks all release contribution terms',()=>{const output=execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-release2-decimal.py',root))],{encoding:'utf8'});assert.equal(JSON.parse(output).status,'PASS');});

test('release sources distinguish human analogues, published coding and recipe scenarios',()=>{
 const results=JSON.parse(readFileSync(new URL('tmp/nutrition/glycemic-load-pilot.json',root),'utf8')).results;
 for(const r of recipes){const result=results.find((x:{recipeId:string})=>x.recipeId===r.recipeId);
  assert.equal(result.modelScenario,r.scenarios.length>1?'NAMED_SCENARIO_RANGE':'POINT_SCENARIO');
  for(const s of result.candidateSources){if(s.evidenceKind==='HUMAN_GI')assert.equal(s.matchKind,'ANALOG');else assert.equal(s.matchKind,'CALCULATION_POLICY');}
  assert.ok(result.candidateSources.some((s:{evidenceKind:string,matchKind:string})=>s.evidenceKind==='PUBLISHED_IMPUTATION'&&s.matchKind==='CALCULATION_POLICY'));
 }
});

test('current eight generated recipe macros equal Decimal and every historical change is explicit',()=>{
 const historical=json('historical-macros.json').recipes;
 for(const r of recipes){const live=siteContent.recipes.find(x=>x.recipeId===r.recipeId&&x.locale==='fi')!;assert.ok(live);
  const g=gold.find((g:any)=>g.recipeId===r.recipeId).scenarios[0].macros;
  const expected={carbsNetG:Math.round(g.availableCarbohydrate*100)/100,carbsTotalG:Math.round((g.availableCarbohydrate+g.fibre)*100)/100,proteinG:Math.round(g.protein*100)/100,fatG:Math.round(g.fat*100)/100};
  assert.deepEqual(live.nutrition,expected,r.recipeId);assert.ok(historical[r.recipeId]);
 }
});
