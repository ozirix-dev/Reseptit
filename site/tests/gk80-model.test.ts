import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { calculate, fingerprint, display, gkClass, normalizeGi, proposalCount, verifySource, type Recipe, type Source } from '../scripts/gk80-model';
const root = new URL('../../', import.meta.url);
const folder = new URL('docs/nutrition/gk80/pilot-1/', root);
const json = (name: string) => JSON.parse(readFileSync(new URL(name, folder), 'utf8'));
const recipes: Recipe[] = json('recipes.json').recipes;
const sources: Source[] = json('sources.json').records;
const golden = json('golden.json').recipes;
const baseline = json('baseline.json');
const hashFile = (p: string) => createHash('sha256').update(/\.(md|json|tsx?|css|html)$/.test(p) ? readFileSync(new URL(p,root),'utf8').replaceAll('\r\n','\n') : readFileSync(new URL(p,root))).digest('hex');
const run = (r: Recipe) => calculate(r,sources,r.sourceSha256,fingerprint(r));
const coffee = () => structuredClone(recipes.find(r => r.recipeId.includes('kahvijogurtti'))!);
const near = (a: number | null,b: number | null) => a === null || b === null ? assert.equal(a,b) : assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);

test('20 unique incomplete recipes and every ingredient/macro agree with independent Decimal calculations',()=>{
  assert.equal(recipes.length,20);assert.equal(new Set(recipes.map(r=>r.recipeId)).size,20);
  const legacy = new Map(json('legacy-results.json').map((r: {recipeId:string;status:string})=>[r.recipeId,r.status]));
  for(const r of recipes){
    assert.notEqual(legacy.get(r.recipeId),'CALCULATED');
    const expected = golden.find((g:{recipeId:string})=>g.recipeId===r.recipeId);
    const actual = calculate(r,sources,hashFile((r as Recipe & {sourcePath:string}).sourcePath),expected.inputHash);
    for(let j=0;j<actual.scenarios.length;j++){
      const a=actual.scenarios[j],e=expected.scenarios[j];near(a.wholeGk,e.wholeGk);near(a.knownSubtotal,e.knownSubtotal);
      for(const k of Object.keys(a.macros) as (keyof typeof a.macros)[]) near(a.macros[k],e.macros[k]);
      for(let i=0;i<a.contributions.length;i++){near(a.contributions[i].carbohydrate,e.contributions[i].carbohydrate);near(a.contributions[i].gk,e.contributions[i].gk);}
    }
  }
  const results=recipes.map(run);assert.equal(proposalCount(results),3);assert.equal(proposalCount([...results,...results]),3);
});
test('all source evidence hashes are valid; existing glucose GI is not converted twice',()=>{
  sources.forEach(verifySource);assert.equal(normalizeGi(114,'GLUCOSE_100'),114);
  near(normalizeGi(73.8,'WHITE_BREAD_100',{factor:.71,evidence:'Pinned Noriega convention'}),52.398);
  assert.throws(()=>normalizeGi(52.4,'GLUCOSE_100',{factor:.71,evidence:'duplicate'}),/DOUBLE/);
  assert.throws(()=>normalizeGi(73.8,'WHITE_BREAD_100'),/MISSING/);
});
test('A direct and B applied point estimates retain distinct match semantics',()=>{
  const r=coffee();r.scenarios=[r.scenarios[0]];r.scenarios[0].ingredients=[r.scenarios[0].ingredients[2]];r.method='B';
  near(run(r).min,5.375625);r.method='A';assert.throws(()=>run(r),/UNREVIEWED/);
  r.scenarios[0].ingredients[0].match='DIRECT';near(run(r).min,5.375625);
});
test('C endpoints come from complete scenarios; D preserves dependent amounts/preparations',()=>{
  const r=coffee(),c=run(r);near(c.min,10.697125);near(c.max,12.146875);
  r.method='D';r.scenarios[1].ingredients[2].massG=250;const d=run(r);
  near(d.scenarios[1].wholeGk,18.66625);near(d.scenarios[0].wholeGk,c.min);
  // No Cartesian mixing of source, mass and preparation across scenario bundles.
  assert.equal(d.scenarios.length,2);assert.equal(d.max,d.scenarios[1].wholeGk);
});
test('missing GI is an unknown additive effect, never zero or whole-recipe GK',()=>{
  const r=coffee();r.scenarios[0].ingredients[2].giId=null;const result=run(r);
  assert.equal(result.min,null);assert.equal(result.numericProposal,false);
  assert.ok(result.scenarios[0].missing[0].giForOneGk!>0);
  for(const locale of ['fi','en','sv','th'] as const) assert.ok(!display(result,locale).text.includes('0'));
});
test('unknown GI, wrong family, stale binding/source/recipe/input fail closed',()=>{
  for(const mutation of ['unknown','family','binding'] as const){const r=coffee(),i=r.scenarios[0].ingredients[2];
    if(mutation==='unknown')i.giId='not-real';if(mutation==='family')i.family='potato-starch';if(mutation==='binding')i.giEvidenceHash='stale';assert.throws(()=>run(r));}
  const r=coffee();assert.throws(()=>calculate(r,sources,'old',fingerprint(r)),/STALE_INPUT/);
  assert.throws(()=>calculate(r,sources,r.sourceSha256,'old'),/STALE_INPUT/);
  const changed=structuredClone(sources);changed.find(s=>s.id==='banana47')!.gi=48;
  assert.throws(()=>calculate(r,changed,r.sourceSha256,fingerprint(r)),/STALE_SOURCE/);
});
test('missing mass, ingredient duplication and wrong carbohydrate basis cannot disappear',()=>{
  const r=coffee();r.scenarios[0].ingredients[2].massG=null;assert.equal(run(r).min,null);
  const duplicate=coffee();duplicate.scenarios[0].ingredients.push(duplicate.scenarios[0].ingredients[0]);assert.throws(()=>run(duplicate),/DUPLICATE/);
  const total=coffee();total.scenarios[0].ingredients[0].carbohydrateDefinition='TOTAL_INCLUDING_FIBRE';assert.throws(()=>run(total),/DEFINITION/);
});
test('zero composition, small positive rounding and crossing class boundaries',()=>{
  const r=coffee();r.scenarios=[r.scenarios[0]];r.scenarios[0].ingredients=[r.scenarios[0].ingredients[1]];
  assert.equal(run(r).min,0);assert.equal(run(r).scenarios[0].missing.length,0);
  const small=coffee();small.scenarios[0].ingredients.forEach(i=>{if(i.massG!==null)i.massG/=100});small.scenarios=[small.scenarios[0]];
  assert.ok(display(run(small),'fi').text.endsWith('<1'));
  assert.equal(gkClass(10),'LOW');assert.equal(gkClass(10.01),'MEDIUM');assert.equal(gkClass(20),'HIGH');
  const bread=run(recipes.find(r=>r.recipeId.includes('halloumi'))!);assert.deepEqual(bread.classes,['MEDIUM','HIGH']);
  for(const locale of ['fi','en','sv','th'] as const){assert.match(display(bread,locale).text,/14–21/);assert.ok(display(bread,locale).note.length>20);}
});
test('wide all-class envelopes and CHO-only never count toward numeric coverage',()=>{
  const r=coffee();r.scenarios[0].ingredients.forEach(i=>{if(i.massG!==null)i.massG/=10});r.scenarios[1].ingredients.forEach(i=>{if(i.massG!==null)i.massG*=10});
  assert.equal(run(r).broad,true);assert.equal(run(r).numericProposal,false);
  const cho=coffee();cho.method='E';assert.equal(run(cho).numericProposal,false);
});
test('994 protected source files and all326 legacy outputs remain unchanged',()=>{
  for(const [p,hash] of Object.entries(baseline.protectedFiles))assert.equal(hashFile(p),hash,p);
  const audit=JSON.parse(readFileSync(new URL('tmp/nutrition/glycemic-load-pilot.json',root),'utf8'));
  const resultHashes = audit.results.map((r:{recipeId:string;status:string})=>({recipeId:r.recipeId,status:r.status,sha256:createHash('sha256').update(JSON.stringify(r)).digest('hex')}));
  assert.deepEqual(resultHashes,json('legacy-results.json'));assert.equal(audit.summary.recipes,326);assert.equal(audit.summary.calculated,83);
  const zeros=json('legacy-zero-review.json').recipes;assert.equal(zeros.length,9);assert.ok(zeros.every((z:{omittedCarbohydrateG:number})=>z.omittedCarbohydrateG>0));
});
