import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildInventory,verifyGapBaseline,gapQueue,firstBatch} from '../scripts/gk-original-gap-inventory';
const root=new URL('../../',import.meta.url);
const read=(p:string)=>readFileSync(new URL(p,root),'utf8');
const json=(p:string)=>JSON.parse(read(p));
test('current inventory counts original HOLDs without promoting any of87 separate versions',()=>{
 const inventory=buildInventory(fileURLToPath(root));
 assert.deepEqual(inventory.counts,{total:326,originalNumeric:156,originalMissing:170,reviewCases:5,newApprovedOriginals:0});
 assert.equal(inventory.queue.length,170);
 assert.deepEqual(inventory,json('docs/nutrition/gk-original-gap-batch01/inventory.json'));
 assert.ok(inventory.queue.every(r=>r.originalCoverageGain===0&&!r.publicationAuthorized));
 assert.equal(new Set(inventory.firstBatch.map((r:any)=>r.recipeId)).size,5);
 assert.ok(inventory.firstBatch.every((r:any)=>r.status==='HOLD'));
});
test('changed original, sealed variant, source or recipe cannot reuse the research baseline',()=>{
 const report=json('tmp/nutrition/glycemic-load-pilot.json'), baseline=json('docs/nutrition/gk-original-gap-batch01/baseline.json');
 const original=structuredClone(report);original.results[0].glycemicLoadPerServing=0;
 assert.throws(()=>verifyGapBaseline(original,baseline,read),/original results changed/);
 const variant=structuredClone(report);variant.gkOnlyVariants[0].point=0;
 assert.throws(()=>verifyGapBaseline(variant,baseline,read),/variant objects changed/);
 const input=structuredClone(report);input.calculationInputHashes[report.results[0].recipeId]='changed';
 assert.throws(()=>verifyGapBaseline(input,baseline,read),/Input evidence hashes changed/);
 const recipe=Object.keys(baseline.sourceFiles).find(p=>p.startsWith('reseptit/'))!;
 assert.throws(()=>verifyGapBaseline(report,baseline,p=>read(p)+(p===recipe?'changed':'')),/Stale source or original recipe/);
 const source='docs/nutrition/food-records.json';
 assert.throws(()=>verifyGapBaseline(report,baseline,p=>read(p)+(p===source?'changed':'')),/Stale source or original recipe/);
});
test('a variant never fills an original gap and a plan cannot grant approval or select a calculated recipe',()=>{
 const report=json('tmp/nutrition/glycemic-load-pilot.json'),plan=json('docs/nutrition/gk-original-gap-batch01/plan.json');
 const counts=gapQueue(report).length;
 const added=structuredClone(report);added.gkOnlyVariants.push({recipeId:plan.cases[0].recipeId,versionId:'unapproved',point:0});
 assert.equal(gapQueue(added).length,counts);
 assert.throws(()=>firstBatch(report,{...plan,publicationAuthorized:true}),/cannot grant approval/);
 assert.throws(()=>firstBatch(report,{...plan,cases:[...plan.cases,plan.cases[0]]}),/five distinct/);
 const wrong=structuredClone(plan);wrong.cases[0].recipeId=report.results.find((r:any)=>r.status==='CALCULATED').recipeId;
 assert.throws(()=>firstBatch(report,wrong),/not a current original HOLD/);
});
test('component diagnostics cannot solve granola or pad see ew by dropping only butter or white pepper',()=>{
 const report=json('tmp/nutrition/glycemic-load-pilot.json');
 const granola=report.results.find((r:any)=>r.recipeId==='siemengranola-jogurtilla');
 const butter=granola.ingredients.find((i:any)=>i.name==='voita').availableCarbohydratePerServingG;
 assert.ok(granola.omittedAvailableCarbohydratePerServingG-butter>=2);
 const pad=report.results.find((r:any)=>r.recipeId==='pad-see-ew-vhh-konjac');
 const pepper=pad.ingredients.find((i:any)=>i.name==='valkopippuria').availableCarbohydratePerServingG;
 assert.ok(pad.omittedAvailableCarbohydratePerServingG-pepper>=2);
});
