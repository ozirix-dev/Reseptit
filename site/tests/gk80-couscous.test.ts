import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseMarkdown} from '../src/content/markdown';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
import {recipeBindingHash,glycemicLoadEvidenceHash,glycemicLoadInputHash} from '../scripts/glycemic-load-recipe-binding';
const root=new URL('../../',import.meta.url),folder='docs/nutrition/gk80-carnitas-couscous/';
const json=(p:string)=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const hash=(p:string)=>createHash('sha256').update(readFileSync(new URL(p,root),'utf8').replaceAll('\r\n','\n')).digest('hex');
const entry=json(folder+'integration.json').recipes[0];
test('exactly one new couscous result; all325 others and146 prior numeric results preserved',()=>{
 const report=json('tmp/nutrition/glycemic-load-pilot.json'),base=json(folder+'main146-baseline.json');assert.equal(report.results.length,326);assert.equal(report.summary.calculated,147);assert.equal(report.summary.insufficientSourceData,179);assert.equal(base.numericIds.length,146);
 for(const r of report.results)if(r.recipeId!==entry.recipeId)assert.equal(createHash('sha256').update(JSON.stringify(r)).digest('hex'),base.resultHashes[r.recipeId],r.recipeId);
 for(const id of base.numericIds)assert.equal(report.results.find((r:any)=>r.recipeId===id).status,'CALCULATED');
 const r=report.results.find((r:any)=>r.recipeId===entry.recipeId);assert.equal(r.glycemicLoadPerServing,34.08);assert.equal(r.confidence,'LOW');assert.equal(r.glycemicLoadRangePerServing,null);assert.equal(r.assessmentType,'PUBLISHED_IMPUTATION');assert.ok(r.omittedAvailableCarbohydratePerServingG<2);
 for(const id of ['carnitas-salaattitacot','kiinalainen-teehaudutetut-munat'])assert.equal(report.results.find((r:any)=>r.recipeId===id).glycemicLoadPerServing,null);
});
test('four exact versions bind fresh complete macros, source records and preparation',()=>{
 const rel=entry.originalPublishedPath,text=readFileSync(new URL(rel,root),'utf8'),fi=parseMarkdown(text)!.data as any,calc=json('docs/nutrition/calculations/'+entry.recipeId+'.json'),bindings=json('docs/nutrition/glycemic-load-recipe-bindings.json');
 assert.equal(hash(rel),entry.sourceLfSha256);assert.equal(hash('docs/nutrition/calculations/'+entry.recipeId+'.json'),entry.macroEvidenceSha256);
 const targets=['en','sv','th'].map(loc=>{const p='kaannokset/'+loc+'/'+rel.replace('reseptit/','');assert.equal(hash(p),entry.localeLfSha256[loc]);assert.equal(hash(p),bindings.exactRecipeText[entry.recipeId].locales[loc].sha256);const data=parseMarkdown(readFileSync(new URL(p,root),'utf8'))!.data as any;assert.deepEqual(data.ingredients.map((i:any)=>[i.amount,i.unit]),fi.ingredients.map((i:any)=>[i.amount,i.unit]));assert.equal(data.time_total_min,fi.time_total_min);return {path:p,data};});
 const verified=verifyNutritionEvidence(fi,calc,targets);assert.deepEqual(verified.errors,[]);assert.equal(verified.status,'ESTIMATE WITH EVIDENCE');assert.equal(calc.ingredients[0].record.primaryReference.source_id,'30792');assert.equal(calc.ingredients[5].record.primaryReference.source_id,'11089');
 const foods=json('docs/nutrition/food-records.json'),gis=json('docs/nutrition/glycemic-index-records.json').records;assert.equal(recipeBindingHash(text,json('docs/nutrition/glycemic-load-recipe-aliases.json').aliases),bindings.recipes[entry.recipeId]);assert.equal(glycemicLoadInputHash(entry.newInput),bindings.calculationInputs[entry.recipeId]);assert.equal(glycemicLoadEvidenceHash(entry.newInput,foods,gis),bindings.calculationEvidence[entry.recipeId]);
});
test('boiled36 is a limited specific human analogue; microwave51 and raw-orange45 are not activated',()=>{
 const r=entry.newInput.ingredients;assert.equal(r[0].grams,600);assert.equal(r[5].grams,400);assert.equal(r[5].giRecordId,'cc-hold-chickpea-boiled36');assert.equal(r[6].grams,1000);assert.equal(r[12].grams,null);assert.equal(r[12].estimatedAvailableCarbohydratePerServingG,0);
 const pack=json(folder+'integration.json');assert.equal(pack.recipes.length,1);assert.equal(pack.ownerApproval,'PENDING_DRAFT_REVIEW');assert.equal(pack.readyAuthorized,false);assert.equal(pack.mergeAuthorized,false);assert.equal(pack.deployAuthorized,false);
 const g=json('docs/nutrition/glycemic-index-records.json').records.find((g:any)=>g.id===r[5].giRecordId);assert.equal(g.gi,36);assert.equal(g.source.participants,7);assert.equal(g.source.iso26642Confirmed,false);assert.equal(g.qualityTier,'SUPPLEMENTARY');assert.equal(g.matchKind,'ANALOG');assert.equal(g.confidence,'LOW');assert.equal(g.referenceScale,'GLUCOSE_100');
 const decisions=json(folder+'decisions.json');assert.equal(decisions.reviewed,2);assert.equal(decisions.holds,1);assert.equal(decisions.decisions.find((d:any)=>d.recipeId==='carnitas-salaattitacot').decision,'HOLD_UNCHANGED');
});
test('independent Decimal checks GK, omissions and all four complete macros',()=>{
 const result=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',fileURLToPath(new URL(folder+'verify_decimal.py',root))],{encoding:'utf8'}));assert.equal(result.status,'PASS');assert.equal(result.checked,1);
});
