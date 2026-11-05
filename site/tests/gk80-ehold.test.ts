import {isP1CoconutHold,assertP1CoconutHold,assertOnlyP1CoconutInputChanges} from './p1-coconut-hold-guard';
import {restoreBeforeCouscous} from './restore-pre-ehold';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseMarkdown} from '../src/content/markdown';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
import {glycemicLoadEvidenceHash,glycemicLoadInputHash,recipeBindingHash} from '../scripts/glycemic-load-recipe-binding';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80-e-hold-release/',root);
const json=(p:string)=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const hash=(p:string)=>createHash('sha256').update(readFileSync(new URL(p,root),'utf8').replaceAll('\r\n','\n')).digest('hex');
const pack=json('docs/nutrition/gk80-e-hold-release/integration.json');
test('three E-HOLD candidates preserve every other result object and all143 numeric results',()=>{
 const report=restoreBeforeCouscous(json('tmp/nutrition/glycemic-load-pilot.json')),base=json('docs/nutrition/gk80-e-hold-release/main143-baseline.json');
 const ids=new Set(pack.recipes.map((r:any)=>r.recipeId));assert.equal(ids.size,3);
 assert.equal(report.results.length,326);assert.equal(report.summary.calculated,146);assert.equal(report.summary.insufficientSourceData,180);assert.equal(base.numericIds.length,143);
 for(const r of report.results)if(!ids.has(r.recipeId)){
  if(isP1CoconutHold(r.recipeId))assertP1CoconutHold(r);
  else assert.equal(createHash('sha256').update(JSON.stringify(r)).digest('hex'),base.resultHashes[r.recipeId],r.recipeId);
 }
 for(const id of base.numericIds)assert.equal(report.results.find((r:any)=>r.recipeId===id).status,'CALCULATED',id);
 for(const entry of pack.recipes){const r=report.results.find((r:any)=>r.recipeId===entry.recipeId);assert.equal(r.glycemicLoadPerServing,entry.gk);assert.equal(r.status,'CALCULATED');assert.equal(r.confidence,'LOW');assert.equal(r.assessmentType,'PUBLISHED_IMPUTATION');assert.equal(r.glycemicLoadRangePerServing,null);assert.ok(r.omittedAvailableCarbohydratePerServingG<2);}
 for(const id of ['carnitas-salaattitacot','marokkolainen-couscous','kiinalainen-teehaudutetut-munat'])assert.equal(report.results.find((r:any)=>r.recipeId===id).glycemicLoadPerServing,null);
});
test('exact FI/EN/SV/TH versions have fresh macro and calculation-source bindings',()=>{
 const bindings=json('docs/nutrition/glycemic-load-recipe-bindings.json'),foods=json('docs/nutrition/food-records.json'),gis=json('docs/nutrition/glycemic-index-records.json').records;
 const aliases=json('docs/nutrition/glycemic-load-recipe-aliases.json').aliases;let complete=0,withheld=0;
 for(const entry of pack.recipes){const rel=entry.originalPublishedPath,text=readFileSync(new URL(rel,root),'utf8'),fi=parseMarkdown(text)!.data as any,evidence=json('docs/nutrition/calculations/'+entry.recipeId+'.json');
  assert.equal(hash(rel),entry.sourceLfSha256);assert.equal(hash('docs/nutrition/calculations/'+entry.recipeId+'.json'),entry.macroEvidenceSha256);assert.equal(recipeBindingHash(text,aliases),bindings.recipes[entry.recipeId]);assert.equal(glycemicLoadInputHash(entry.newInput),bindings.calculationInputs[entry.recipeId]);assert.equal(glycemicLoadEvidenceHash(entry.newInput,foods,gis),bindings.calculationEvidence[entry.recipeId]);
  const targets=['en','sv','th'].map(loc=>{const p='kaannokset/'+loc+'/'+rel.replace('reseptit/','');assert.equal(hash(p),entry.localeLfSha256[loc]);assert.equal(hash(p),bindings.exactRecipeText[entry.recipeId].locales[loc].sha256);const d=parseMarkdown(readFileSync(new URL(p,root),'utf8'))!.data as any;assert.deepEqual(d.ingredients.map((i:any)=>[i.amount,i.unit]),fi.ingredients.map((i:any)=>[i.amount,i.unit]));assert.equal(d.servings,fi.servings);assert.equal(d.time_total_min,fi.time_total_min);return {path:p,data:d};});
  const checked=verifyNutritionEvidence(fi,evidence,targets);assert.deepEqual(checked.errors,[],entry.recipeId);assert.equal(checked.status,entry.macroStatus);
  if(checked.status==='ESTIMATE WITH EVIDENCE')complete++;else{withheld++;assert.equal(evidence.publicationStatus,'WITHHELD_SOURCE_INCOMPLETE');assert.ok(Object.values(checked.values).every(v=>v===null));assert.equal(evidence.ingredients[6].record.per100g.polyols,null);}
 }
 assert.equal(complete,2);assert.equal(withheld,1);
});
test('new bread source is regular69, rice uses a new dry mass, old research approval is not reused',()=>{
 const rice=pack.recipes.find((r:any)=>r.recipeId==='tomaatti-kananmuna-wokki').newInput.ingredients[7];assert.equal(rice.grams,150);assert.equal(rice.fineliRecordId,'ehold-fineli-11521');assert.match(rice.massEvidence,/NOT a conversion/);
 const doner=pack.recipes.find((r:any)=>r.recipeId==='doner-kebab').newInput;assert.equal(doner.ingredients[9].grams,240);assert.equal(doner.ingredients[9].giRecordId,'ehold-pita-white-regular69');assert.deepEqual(doner.ingredients.slice(10).map((r:any)=>r.grams),[180,10,10]);
 const g=json('docs/nutrition/glycemic-index-records.json').records.find((r:any)=>r.id==='ehold-pita-white-regular69');assert.equal(g.gi,69);assert.equal(g.matchKind,'ANALOG');assert.equal(g.confidence,'LOW');assert.equal(g.source.participants,10);assert.match(g.source.table,/row9/);
 assert.equal(pack.ownerApproval,'PENDING_DRAFT_REVIEW');assert.equal(pack.readyAuthorized,false);assert.equal(pack.mergeAuthorized,false);assert.equal(pack.deployAuthorized,false);
 const decisions=json('docs/nutrition/gk80-e-hold-release/decisions.json');assert.equal(decisions.reviewedCases,5);assert.equal(decisions.decisions.filter((r:any)=>r.decision==='HOLD_UNCHANGED').length,2);
});
test('independent Decimal checks all3 GK contributions, omissions and two complete macro packages',()=>{
 const result=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',fileURLToPath(new URL('verify_decimal.py',folder))],{encoding:'utf8'}));assert.equal(result.status,'PASS');assert.equal(result.checked,3);
});
