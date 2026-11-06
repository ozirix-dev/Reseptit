import {afcdSourceBeforeCorrection} from './restore-pre-ehold';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createElement as h} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {buildApprovedSevenVariants,loadPadSeeEw,verifyNextSevenManifest} from '../scripts/gk-next-seven';
import {buildGkOnlyVariants} from '../scripts/gk149-integration';
import {verifyApprovedSix} from '../scripts/gk149-approved-six';
import {verifyFoodinRecord,FOODIN_ORIGINAL_FILE_SHA256,FOODIN_RECORD_SHA256,FOODIN_RECORD_ID} from '../scripts/gk-foodin-binding';
import {textHash,digest} from '../scripts/gk149-model';
import {countGkVersions} from '../src/features/recipes/gk-only-types';
import {gkOnlyVariants,gkVersionCoverage} from '../src/generated/gk-only-variants.generated';
import {GkOnlyVariantPanel,gkOnlyUi,gkScopeUi,gkOnlyValue,gkOnlyPreparation} from '../src/features/recipes/GkOnlyVariantPanel';
const root=fileURLToPath(new URL('../../',import.meta.url));
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const manifest=verifyNextSevenManifest(root),seven=buildApprovedSevenVariants(root),sixteen=buildGkOnlyVariants(root),report=read('tmp/nutrition/glycemic-load-pilot.json');
const render=(v:typeof seven[number],locale:'fi'|'en'|'sv'|'th',servings=v.servings)=>renderToStaticMarkup(h(MemoryRouter,null,h(GkOnlyVariantPanel,{variant:v,locale,servings})));
test('exact seven new A versions form a distinct179-recipe candidate while the original16 stay intact',()=>{
 assert.equal(seven.length,7);assert.ok(seven.every(v=>v.level==='A'&&v.confidence==='LOW'));
 assert.deepEqual(Object.fromEntries(seven.map(v=>[v.recipeId,v.inputSha256])),manifest.approvedInputs);
 const legacy=gkOnlyVariants.filter(v=>[...sixteen,...seven].some(old=>old.inputSha256===v.inputSha256));
 assert.deepEqual(legacy,[...sixteen,...seven]);assert.deepEqual(report.gkOnlyVariants,gkOnlyVariants);
 const coverage=countGkVersions(report.results,legacy);
 assert.deepEqual(gkVersionCoverage,report.versionCoverage);
 assert.equal(coverage.numericRecipes,179);assert.equal(coverage.originalNumeric,156);assert.equal(coverage.additionalA,17);assert.equal(coverage.additionalB,6);assert.equal(coverage.missing,154);assert.equal(coverage.total,333);
 assert.deepEqual(report.coverageViews.originalRecipe,{total:333,numeric:156,missing:177});
 assert.throws(()=>countGkVersions(report.results,[...gkOnlyVariants,seven[0]]),/distinct/);
 for(const v of seven){assert.equal(report.results.find((r:any)=>r.recipeId===v.recipeId).status,'INSUFFICIENT SOURCE DATA');assert.equal(v.macroScope,'NO_MACRO_PACKAGE_FOR_THIS_VERSION');assert.ok(!('nutrition' in v)&&!('macros' in v));}
});
test('all original16 approved files and approvals are byte-identical after LF normalization to the published release',()=>{
 const a=read('docs/nutrition/gk80-operation149/owner-approval.json');
 for(const file of ['owner-approval.json',...Object.keys(a.approvedFilesLfSha256)]){
  const p='docs/nutrition/gk80-operation149/'+file;
  const frozen=execFileSync('git',['show','92dc6dbe7b27e145d6938026c73b6823f2e2108f:'+p],{cwd:root,encoding:'utf8'});
  assert.equal(textHash(readFileSync(path.join(root,p),'utf8')),textHash(frozen),p);
 }
});
test('Draft-only authority and exact receipts reject added recipes, widened source families and changed manifests',()=>{
 assert.equal(manifest.readyAuthorized,false);assert.equal(manifest.mergeAuthorized,false);assert.equal(manifest.deployAuthorized,false);
 const a=read('docs/nutrition/gk80-operation149/approved-six-owner-approval.json');verifyApprovedSix(root,a);
 assert.throws(()=>verifyApprovedSix(root,{...a,approvedInputs:{...a.approvedInputs,extra:'0'.repeat(64)}}),/scope/);
 assert.throws(()=>verifyApprovedSix(root,{...a,admittedSourceFamilies:[...a.admittedSourceFamilies,'ANY_MEXT']}),/scope/);
 const fixture=mkdtempSync(path.join(os.tmpdir(),'gk-seven-seal-'));
 try{mkdirSync(path.join(fixture,'docs/nutrition/gk80-next-seven'),{recursive:true});writeFileSync(path.join(fixture,'docs/nutrition/gk80-next-seven/integration.json'),JSON.stringify({...manifest,mergeAuthorized:true}));assert.throws(()=>verifyNextSevenManifest(fixture),/binding changed/);}finally{rmSync(fixture,{recursive:true,force:true});}
});
test('Foodin record refinement is proven against both exact Git snapshots without accepting a changed label',()=>{
 const binding=read('docs/nutrition/gk80-next-seven/foodin-record-binding.json');
 const originalText=execFileSync('git',['show',binding.originalSourceCommit+':'+binding.sourcePath],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 assert.equal(textHash(originalText),FOODIN_ORIGINAL_FILE_SHA256);
 const corrected=JSON.parse(originalText),afcd=read('docs/nutrition/afcd-release-3-reference.json').foods;
 for(const [id,before,after] of [['F002384',5,2.8],['F006573',8,7.7],['F007619',7,6.9]] as const){
  const row=corrected.find((r:any)=>r.id==='afcd-'+id+'-release-3');assert.equal(row.per100g.carbohydrate,before);
  assert.equal(afcd.find((r:any)=>r.source_id===id).available_carbohydrate_without_sugar_alcohols_g_per_100g,after);
  row.per100g.carbohydrate=after;
 }
 const correctedText=JSON.stringify(corrected,null,2)+'\n';
 assert.equal(textHash(correctedText),binding.pr182FileLfSha256,'only the three exact AFCD field corrections reconstruct the PR182 source hash');
 for(const text of [originalText,correctedText]){
  const row=verifyFoodinRecord(JSON.parse(text),FOODIN_ORIGINAL_FILE_SHA256);assert.equal(digest(row),FOODIN_RECORD_SHA256);assert.deepEqual(row,binding.originalRecord);
 }
 const records=read(binding.sourcePath),row=records.find((r:any)=>r.id===FOODIN_RECORD_ID);
 assert.throws(()=>verifyFoodinRecord([...records,row],FOODIN_ORIGINAL_FILE_SHA256),/ambiguous/);
 for(const mutate of [(r:any)=>r.per100g.polyols=99,(r:any)=>r.sourceUrl='https://example.com/other',(r:any)=>r.polyolsSourceVerified=false]){
  const changed=structuredClone(records);mutate(changed.find((r:any)=>r.id===FOODIN_RECORD_ID));assert.throws(()=>verifyFoodinRecord(changed,FOODIN_ORIGINAL_FILE_SHA256),/changed/);
 }
 assert.throws(()=>verifyFoodinRecord(records,'0'.repeat(64)),/lineage/);
 // The source correction is not imported or used to silently replace any baseline result.
 assert.equal(textHash(afcdSourceBeforeCorrection(binding.sourcePath,readFileSync(path.join(root,binding.sourcePath),'utf8'))),FOODIN_ORIGINAL_FILE_SHA256);
});
test('four-language panels keep own quantities, positive omissions, source limits and parent macro separation',()=>{
 for(const v of seven)for(const locale of ['fi','en','sv','th'] as const){
  const html=render(v,locale),t=gkOnlyUi[locale];assert.ok(html.includes(t.low)&&html.includes(t.scope)&&html.includes(t.sources));assert.ok(html.includes(t.omissionEnd));assert.ok(html.includes('NO_MACRO_PACKAGE_FOR_THIS_VERSION'));assert.ok(!html.includes('undefined')&&!html.includes('NaN')&&!html.includes('{{'));
 }
 const pad=seven.find(v=>v.recipeId==='pad-see-ew-vhh-konjac')!;
 for(const locale of ['fi','en','sv','th'] as const){assert.equal(gkOnlyValue(pad,locale),gkScopeUi[locale].tiny);assert.ok(render(pad,locale).includes(gkScopeUi[locale].partial));}
 assert.ok(render(pad,'fi').includes('1,6'));assert.ok(render(pad,'en').includes('1.6'));
 assert.ok(render(pad,'fi',8).includes('1 200 g')||render(pad,'fi',8).includes('1 200 g'));
 assert.ok(gkOnlyPreparation(pad,'en',8).includes('30 g'));assert.ok(gkOnlyPreparation(pad,'en',8).includes('1200')||gkOnlyPreparation(pad,'en',8).includes('1,200'));
 assert.equal(loadPadSeeEw(root).result.point,0.73);
});
test('independent Decimal replay checks all seven, including the cumulative positive omission bound',()=>{
 const output=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,'docs/nutrition/gk80-next-seven/verify_decimal.py')],{encoding:'utf8'}));
 assert.equal(output.status,'PASS');assert.equal(output.checked,7);assert.equal(output.writes,0);
 for(const v of seven){const r=output.results.find((r:any)=>r.recipeId===v.recipeId);assert.equal(Number(r.point),v.point);assert.ok(Math.abs(Number(r.omittedCho)-v.omittedCho)<1e-12);}
});
