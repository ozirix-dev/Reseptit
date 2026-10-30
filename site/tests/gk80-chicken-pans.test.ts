import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {calculate, fingerprint, verifySource, proposalCount, display, type Recipe, type Source, type CompositionSource} from '../scripts/gk80-model';
const root=new URL('../../',import.meta.url), folder=new URL('docs/nutrition/gk80/chicken-pans-1/',root);
const json=(name:string)=>JSON.parse(readFileSync(new URL(name,folder),'utf8'));
type Row=Recipe & {sourcePath:string;reviewState:string;approved:boolean;published:boolean;confidence:string;uncertainty:string};
const recipes:Row[]=json('recipes.json').recipes, sources:Source[]=json('sources.json').records, compositions:CompositionSource[]=json('composition-sources.json').records;
const golden=json('golden.json');
const fileHash=(path:string)=>createHash('sha256').update(readFileSync(new URL(path,root),'utf8').replaceAll('\r\n','\n')).digest('hex');
const run=(r:Row)=>calculate(r,sources,fileHash(r.sourcePath),golden.recipes.find((g:{recipeId:string})=>g.recipeId===r.recipeId).inputHash,compositions);
const near=(a:number|null,b:number|null)=>a===null||b===null?assert.equal(a,b):assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('two complete conditional pan proposals include every ingredient and all four macros',()=>{
  assert.deepEqual(recipes.map(r=>r.recipeId),['kana-parmesaanipannu-parsakaali','kermainen-kanasienipannu']);
  assert.deepEqual(recipes.map(r=>r.scenarios[0].ingredients.length),[9,10]);
  assert.equal(proposalCount(recipes.map(run)),2);
  for(const r of recipes){const out=run(r),expected=golden.recipes.find((g:{recipeId:string})=>g.recipeId===r.recipeId).scenarios[0],s=out.scenarios[0];
    assert.equal(s.missing.length,0);near(s.wholeGk,expected.wholeGk);near(s.imputedImpact,expected.imputedImpact);near(s.wholeCarbohydrate,expected.wholeCarbohydrate);
    for(const k of ['availableCarbohydrate','protein','fat','fibre'] as const)near(s.macros[k],expected.macros[k]);
    s.contributions.forEach((c,j)=>{assert.equal(c.index,expected.contributions[j].index);near(c.carbohydrate,expected.contributions[j].carbohydrate);near(c.gk,expected.contributions[j].gk);});
    assert.equal(r.approved,false);assert.equal(r.published,false);assert.equal(r.confidence,'LOW');assert.equal(r.uncertainty,'NOT_BOUNDED');
    assert.equal(display(out,'fi').text,'GK-arvio noin 1');assert.match(display(out,'fi').note,/odottavat hyväksyntää/);
    assert.equal(out.impact.biologicalBoundEstablished,false);
    assert.equal(out.impact.imputedWithinPolicy,true);
    assert.equal(out.impact.withinOneUnitEditorialTarget,false); // Dairy comparators bring all assumptions above one.
  }
});
test('new and inherited evidence is hash-bound; previous recipes and calculations remain frozen',()=>{
  sources.forEach(verifySource);
  for(const c of compositions){const {evidenceHash,...payload}=c;assert.equal(fingerprint(payload),evidenceHash);}
  for(const f of json('provenance.json').localFiles)assert.equal(fileHash(f.path),f.sha256,f.path);
  assert.deepEqual(sources.find(s=>s.id==='schakel-default50')!.allowedRecipeIds,recipes.map(r=>r.recipeId));
  const changed=structuredClone(recipes[0]);changed.scenarios[0].ingredients[4].massG=300;
  assert.throws(()=>run(changed),/STALE_INPUT/);
});
test('missing or relabelled GI imputation cannot silently preserve an evidence-backed number',()=>{
  const missing=structuredClone(recipes[0]);delete missing.scenarios[0].ingredients[4].impact;
  assert.equal(calculate(missing,sources,missing.sourceSha256,fingerprint(missing),compositions).numericProposal,false);
  const wrong=structuredClone(recipes[0]);wrong.scenarios[0].ingredients[4].impact!.kind='SOURCE_COMPARATOR';
  assert.throws(()=>calculate(wrong,sources,wrong.sourceSha256,fingerprint(wrong),compositions),/IMPACT_EVIDENCE_KIND/);
  const changedSources=structuredClone(sources);changedSources.find(s=>s.id==='schakel-default50')!.gi=0;
  assert.throws(()=>calculate(recipes[0],changedSources,recipes[0].sourceSha256,fingerprint(recipes[0]),compositions),/STALE_SOURCE/);
});
test('label CHO remains an explicit proxy; weighed pepper, thyme, Dijon and yellow-onion version stay distinct',()=>{
  const raw=json('recipes.json').recipes;
  const labels=compositions.filter(c=>c.id.endsWith('-label-proxy'));
  assert.equal(labels.length,2);
  for(const c of labels){assert.equal(c.carbohydrateDefinition,'MODELLED_AVAILABLE_CHO_FROM_EU_LABEL');assert.equal(c.measuredPolyolsPer100,null);}
  assert.equal(labels.find(c=>c.id==='chicken-label-proxy')!.per100g.availableCarbohydrate,.2);
  assert.equal(labels.find(c=>c.id==='maille-label-proxy')!.per100g.availableCarbohydrate,3.5);
  for(const r of raw){const rows=r.scenarios[0].ingredients, pepper=rows.find((i:{projectExtension?:boolean})=>i.projectExtension);
    assert.equal(pepper.massG,.5);assert.equal(pepper.per100g.availableCarbohydrate,38.6);assert.match(pepper.applicability,/not low-CHO/);
    for(const i of rows.filter((i:{composition?:{sourceId:string}})=>i.composition?.sourceId.endsWith('-label-proxy')))assert.equal(i.carbohydrateEvidence,'MODEL_PROXY_NOT_MEASURED_POLYOL_FREE');
  }
  const mushroom=raw[1],rows=mushroom.scenarios[0].ingredients;
  assert.match(mushroom.proposedTitle,/keltasipulilla/);assert.equal(rows[2].massG,55);assert.match(rows[2].name,/keltaista sipulia/);
  assert.equal(rows[5].massG,15);assert.equal(rows[7].massG,2);
  assert.equal(rows[7].composition.sourceId,'afcd-F010466-checked');
});
test('diagnostics never become a biological interval or approved coverage',()=>{
  for(const d of golden.diagnostics){assert.equal(d.numericRangeClaim,false);assert.equal(d.biologicalBoundEstablished,false);assert.equal(d.coverageEligible,false);assert.ok(d.hypotheticalAllDefault150>d.hypotheticalAllDefault100);}
  const m=json('metrics.json');assert.equal(m.newNumericConditionalProposals,2);assert.equal(m.cumulativeUniqueConditionalProposals,8);
  assert.equal(m.productionBefore,83);assert.equal(m.productionAfter,83);assert.equal(m.newApprovedNumericValues,0);assert.equal(m.newPublished,0);
});
test('independent Decimal arithmetic and batch evidence checks run in normal CI',()=>{
  const result=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-chicken-pans-verify.py',root))],{encoding:'utf8'}));
  assert.equal(result.status,'PASS');assert.equal(result.verifiedRecipes,2);assert.equal(result.ingredientRows,19);assert.equal(result.productionChanged,false);
});
