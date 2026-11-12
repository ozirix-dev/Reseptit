import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createElement as h} from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {MemoryRouter} from 'react-router-dom';
import { frozenOriginalRows } from "./original-content-transition";
import {buildGkOnlyVariants,verifyGkOnlyApproval} from '../scripts/gk149-integration';
import {countGkVersions,type GkOnlyVariant} from '../src/features/recipes/gk-only-types';
import {GkOnlyVariantPanel,gkOnlyUi,gkOnlyValue,gkOnlyPreparation,gkScopeUi} from '../src/features/recipes/GkOnlyVariantPanel';
import {gkOnlyVariants} from '../src/generated/gk-only-variants.generated';
import { isPublicRecipeQuarantined } from '../scripts/public-recipe-quarantine';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url)),folder='docs/nutrition/gk80-operation149/';const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const approval=read(folder+'owner-approval.json'),variants=buildGkOnlyVariants(root),report=read('tmp/nutrition/glycemic-load-pilot.json');
const render=(v:GkOnlyVariant,l:'fi'|'en'|'sv'|'th',servings=v.servings)=>renderToStaticMarkup(h(MemoryRouter,null,h(GkOnlyVariantPanel,{variant:v,locale:l,servings})));
test('shared-source queue is deduplicated and the new pending proposal cannot expand approved public scope',()=>{
 const p=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,folder+'verify_strategy.py')],{encoding:'utf8'}));assert.equal(p.status,'PASS');assert.equal(p.approvedPublicScope,16);assert.equal(p.pendingNumericProposal,1);assert.equal(p.queueDistinct,154);assert.equal(p.writes,0);
});
test('16 explicitly approved exact versions raise distinct numeric recipe coverage156→172',()=>{
 const historicalResults = frozenOriginalRows(report.results, (row: typeof report.results[number]) => row.recipeId);
 const coverage=countGkVersions(historicalResults,variants);assert.equal(variants.length,16);assert.equal(coverage.numericRecipes,172);assert.equal(coverage.additionalA,10);assert.equal(coverage.additionalB,6);assert.equal(coverage.classOnly,0);assert.equal(coverage.missing,154);assert.equal(coverage.total,326);assert.deepEqual(
    gkOnlyVariants.filter(v=>approval.approvedInputs[v.recipeId]===v.inputSha256),
    variants.filter(v=>!isPublicRecipeQuarantined(v.recipeId)),
    "public GK149 variants omit only explicitly quarantined recipe IDs"
  );assert.deepEqual(variants,report.gkOnlyVariants.filter((v:any)=>approval.approvedInputs[v.recipeId]===v.inputSha256));assert.equal(new Set(coverage.numericRecipeIds).size,172);assert.equal(historicalResults.filter(row => row.status === "CALCULATED").length, 156);
 const input=read(folder+'cases.json').cases,gold=read(folder+'golden.json').results;
 for(const v of variants){const c=input.find((c:any)=>c.recipeId===v.recipeId),g=gold.find((g:any)=>g.recipeId===v.recipeId);assert.equal(v.inputSha256,approval.approvedInputs[v.recipeId]);assert.equal(v.inputSha256,c.inputSha256);assert.equal(v.point,g.point);assert.deepEqual(v.scenarioRange,g.scenarioRange);assert.equal(v.omittedCho,g.omittedCho);assert.equal(v.confidence,'LOW');assert.equal(v.ingredients.length,c.candidateIngredients.length);assert.ok(v.sources.length>0);assert.ok(v.sources.every(s=>s.url.startsWith('https://')||s.url==='#gk-only-method'));}
});
test('approval is exact, content-only and cannot authorize changes or expand its scope',()=>{
 verifyGkOnlyApproval(root,approval);assert.equal(approval.answer,'Kyllä');assert.equal(approval.readyAuthorized,false);assert.equal(approval.mergeAuthorized,false);assert.equal(approval.deployAuthorized,false);
 for(const key of ['methodAndContentApproved','integrationAuthorized'])assert.throws(()=>verifyGkOnlyApproval(root,{...approval,[key]:false}),/approval/);
 assert.throws(()=>verifyGkOnlyApproval(root,{...approval,approvedFilesLfSha256:{}}),/binding/);
 assert.throws(()=>verifyGkOnlyApproval(root,{...approval,approvedFilesLfSha256:{...approval.approvedFilesLfSha256,'cases.json':'0'.repeat(64)}}),/pack changed/);
 assert.throws(()=>verifyGkOnlyApproval(root,{...approval,approvedInputs:{...approval.approvedInputs,'unapproved-recipe':'invented'}}),/scope/);
});
test('coverage cannot double-count versions, replace an existing result, count C or invent an endpoint',()=>{
 assert.throws(()=>countGkVersions(report.results,[variants[0],variants[0]]),/distinct/);
 assert.throws(()=>countGkVersions(report.results,[{...variants[0],recipeId:report.results.find((r:any)=>r.status==='CALCULATED').recipeId}]),/distinct/);
 assert.throws(()=>countGkVersions(report.results,[{...variants[0],level:'C'} as unknown as GkOnlyVariant]),/Class-only/);
 assert.throws(()=>countGkVersions(report.results,[{...variants[0],point:null,scenarioRange:{min:0,max:Infinity}}]),/Numeric/);
});
test('GK-only versions never inherit parent nutrition values or macro evidence',()=>{
 for(const v of variants){assert.equal(v.macroScope,'NO_MACRO_PACKAGE_FOR_THIS_VERSION');for(const k of ['nutrition','macros','macroEvidence','macroEvidenceSha256','carbs_net_per_serving_g'])assert.ok(!(k in v));assert.equal(report.results.find((r:any)=>r.recipeId===v.recipeId).status,'INSUFFICIENT SOURCE DATA');}
 for(const id of ['keto-mutakakku','keto-suklaakeksit']){const parent=read(folder+'baseline.json').baselineResultHashes[id];assert.ok(parent);assert.ok(variants.some(v=>v.recipeId===id));}
});
test('four-language public version panels identify scope, amounts, uncertainty and sources',()=>{
 for(const v of variants)for(const l of ['fi','en','sv','th'] as const){const html=render(v,l);assert.ok(html.includes(gkOnlyUi[l].scope),v.recipeId+'/'+l);assert.ok(html.includes(gkOnlyUi[l].low));assert.ok(html.includes('data-gk-level="'+v.level+'"'));assert.ok(html.includes('NO_MACRO_PACKAGE_FOR_THIS_VERSION'));assert.ok(html.includes(gkOnlyUi[l].details));assert.ok(html.includes(gkOnlyUi[l].sources));assert.ok(html.includes(gkOnlyPreparation(v,l).replaceAll('&','&amp;')));assert.ok(!html.includes('undefined'));assert.ok(!html.includes('NaN'));if(v.omittedCho>0)assert.ok(html.includes(gkOnlyUi[l].omissionEnd));if(v.scenarioRange)assert.ok(html.includes(gkOnlyUi[l].range));if(v.sensitivity)assert.ok(html.includes(gkOnlyUi[l].sensitivityNote));}
});
test('serving scaling changes only version amounts, not per-serving GL or source/approval identity',()=>{
 const v=variants.find(v=>v.recipeId==='keto-mutakakku')!;const a=render(v,'fi'),b=render(v,'fi',v.servings*2);assert.ok(a.includes('150 g'));assert.ok(b.includes('300 g'));assert.ok(a.includes(gkOnlyValue(v,'fi')));assert.ok(b.includes(gkOnlyValue(v,'fi')));assert.equal(gkOnlyValue(variants.find(v=>v.recipeId==='keto-suklaakeksit')!,'fi'),gkScopeUi.fi.tiny);assert.ok(!a.includes('≈ 0,07'));assert.ok(a.includes(gkScopeUi.fi.partial));assert.ok(a.includes(gkOnlyUi.fi.original));
 assert.ok(gkOnlyPreparation(v,'fi',9).includes('11,25'));assert.ok(gkOnlyPreparation(v,'fi',9).includes('4,725'));assert.ok(!render(v,'fi',9).includes('{{'));assert.ok(a.includes('1,4'),'an omission upper bound rounds outward to one decimal');
});
