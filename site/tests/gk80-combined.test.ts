import {isP1CoconutHold,assertP1CoconutHold} from './p1-coconut-hold-guard';
import {restorePreEHold} from './restore-pre-ehold';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {loadPacks} from '../scripts/gk80-release';import {calculateCandidate} from '../scripts/gk80-candidate-policy';
const root=new URL('../../',import.meta.url);const json=(f:string)=>JSON.parse(readFileSync(new URL(f,root),'utf8'));
test('Operation142 adds exactly ten candidates and preserves all133 current main numeric results',async()=>{
 const report=restorePreEHold(json('tmp/nutrition/glycemic-load-pilot.json')),baseline=json('docs/nutrition/gk80-operation142/main133-baseline.json'),pack=json('docs/nutrition/gk80-operation142/integration.json');
 const ids=new Set(pack.recipes.map((r:any)=>r.recipeId));
 assert.equal(report.results.length,326);assert.equal(report.summary.calculated,143);assert.equal(report.summary.insufficientSourceData,183);assert.equal(ids.size,10);
 for(const current of report.results.filter((r:any)=>!ids.has(r.recipeId))){
  if(isP1CoconutHold(current.recipeId))assertP1CoconutHold(current);
  else assert.equal(createHash('sha256').update(JSON.stringify(current)).digest('hex'),baseline.resultHashes[current.recipeId],current.recipeId+': unchanged full result');
 }
 for(const previous of baseline.numericIds){const current=report.results.find((r:any)=>r.recipeId===previous);assert.ok(current,previous);assert.equal(createHash('sha256').update(JSON.stringify(current)).digest('hex'),baseline.resultHashes[previous],previous);assert.ok(!ids.has(previous));}
 for(const entry of pack.recipes){const result=report.results.find((r:any)=>r.recipeId===entry.recipeId);assert.equal(result.status,'CALCULATED');assert.equal(result.confidence,'LOW');assert.equal(result.assessmentType,'PUBLISHED_IMPUTATION');assert.equal(result.glycemicLoadPerServing,entry.gk);assert.ok(result.omittedAvailableCarbohydratePerServingG<2);assert.equal(result.glycemicLoadRangePerServing,null);}
 assert.equal(report.results.find((r:any)=>r.recipeId==='kiinalainen-teehaudutetut-munat').glycemicLoadPerServing,null);
 assert.equal((await loadPacks((await import('node:url')).fileURLToPath(root))).length,7);
});

test('all56 source bindings and Decimal goldens remain valid together; oil really is rapeseed',async()=>{const path=(await import('node:url')).fileURLToPath(root);for(const pack of await loadPacks(path))for(const r of pack.recipes){const h=createHash('sha256').update(readFileSync(new URL(r.sourcePath,root),'utf8').replaceAll('\r\n','\n')).digest('hex');const g=pack.golden.find((x:any)=>x.recipeId===r.recipeId);const out=calculateCandidate(r,pack.sources,h,g.inputHash,pack.comps);assert.equal(out.numericProposal,true);assert.equal(out.scenarios.length,g.scenarios.length);for(let i=0;i<out.scenarios.length;i++)assert.ok(Math.abs(out.scenarios[i].wholeGk!-g.scenarios[i].wholeGk)<1e-10);}const c=json('docs/nutrition/calculations/thai-kai-jiao-yrteilla.json');assert.equal(c.ingredients.find((i:any)=>i.item.includes('rypsi')).record.referenceRecord.source_id,'535');});

test('all ten new versions bind current FI and30 translated files to new macro evidence',async()=>{
 const pack=json('docs/nutrition/gk80-operation142/integration.json');
 const {parseMarkdown}=await import('../src/content/markdown');
 const {verifyNutritionEvidence}=await import('../scripts/nutrition-evidence');
 const hash=(text:string)=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex');
 let complete=0,withheld=0;
 for(const entry of pack.recipes){
  const text=readFileSync(new URL(entry.originalPublishedPath,root),'utf8');assert.equal(hash(text),entry.sourceLfSha256);
  const source=parseMarkdown(text)!.data as any;const evidence=json('docs/nutrition/calculations/'+entry.recipeId+'.json');
  const translations=['en','sv','th'].map(locale=>{const p='kaannokset/'+locale+'/'+entry.originalPublishedPath.replace('reseptit/','');const target=readFileSync(new URL(p,root),'utf8');assert.equal(hash(target),entry.localeLfSha256[locale]);return {path:p,data:parseMarkdown(target)!.data as any};});
  const checked=verifyNutritionEvidence(source,evidence,translations);assert.deepEqual(checked.errors,[],entry.recipeId);assert.equal(checked.status,entry.macroStatus);
  if(checked.status==='ESTIMATE WITH EVIDENCE')complete++;else{withheld++;assert.equal(evidence.publicationStatus,'WITHHELD_SOURCE_INCOMPLETE');assert.ok(Object.values(checked.values).every(value=>value===null));}
 }
 assert.equal(complete,6);assert.equal(withheld,4);
});

test('Operation143 keeps pepper/coriander identities and same-food fibre supplements distinct',async()=>{
 const {parseMarkdown}=await import('../src/content/markdown');
 const tacos=parseMarkdown(readFileSync(new URL('reseptit/aamupalat/munatacot-huevos-rancheros.md',root),'utf8'))!.data as any;
 const evidence=json('docs/nutrition/calculations/munatacot-huevos-rancheros.json');
 assert.equal(tacos.ingredients[9].amount,0.5);assert.match(tacos.ingredients[9].item,/mustapippuri/);assert.equal(evidence.ingredients[9].record.primaryReference.source_id,'11177');
 assert.equal(tacos.ingredients[10].amount,10);assert.match(tacos.ingredients[10].item,/korianteri/);assert.equal(evidence.ingredients[10].record.primaryReference.source_id,'34238');
 assert.equal(json('docs/nutrition/calculations/caponata.json').ingredients[5].record.primaryReference.source_id,'34972');
 const supplements=json('docs/nutrition/gk80-operation143/source-supplements.json').fineliFibre;
 for(const id of ['ratatouille','munatacot-huevos-rancheros','caponata'])for(const ingredient of json('docs/nutrition/calculations/'+id+'.json').ingredients){
  const r=ingredient.record,s=r?.supplementaryFibreSource;if(!s || !Object.hasOwn(s,"originalFrozenValue"))continue;
  assert.equal(r.primaryReference.per100g.fibre_g_per_100g,null);assert.equal(r.per100g.fibre,supplements[r.primaryReference.source_id].fibre);assert.equal(r.per100g.polyols,r.primaryReference.per100g.polyols_g_per_100g);
 }
});
