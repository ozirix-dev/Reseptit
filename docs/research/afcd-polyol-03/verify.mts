import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]),reportPath=path.resolve(process.argv[3]),output=path.resolve(process.argv[4]);
const load=async(p:string)=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
const {afcdGkOnlyObservation}=await import(pathToFileURL(path.join(root,'docs/research/afcd-polyol-03/gk-only-source.ts')).href);
const {normalizeCarbohydrate}=await import(pathToFileURL(path.join(root,'site/scripts/nutrition-model.ts')).href);
const ref=await load('docs/nutrition/afcd-release-3-reference.json'),foods=await load('docs/nutrition/food-records.json'),summary=JSON.parse(await fs.readFile(path.join(output,'summary.json'),'utf8'));
const report=JSON.parse(await fs.readFile(reportPath,'utf8'));
assert.equal(report.results.length,326);assert.equal(summary.missingCount,170);assert.equal(summary.afcdPolyolUnknownCounterfactualChangedRecipes,0);
const ids=new Set(report.calculationInputs.filter((r:any)=>report.results.find((x:any)=>x.recipeId===r.recipeId).status!=='CALCULATED').flatMap((r:any)=>r.ingredients.map((i:any)=>i.fineliRecordId).filter((id:string)=>id?.startsWith('afcd-'))));
let checked=0,pending=0;
for(const food of foods.filter((f:any)=>ids.has(f.id))){const nativeId=food.id.match(/F\d{6}/i)[0].toUpperCase();if(food.id==='afcd-F007619-release-3'){assert.throws(()=>afcdGkOnlyObservation(ref,food,nativeId,'Existing named preparation mapping, not a new approval'),/separate correction/);pending++;continue;}
 const result=afcdGkOnlyObservation(ref,food,nativeId,'Existing named preparation mapping, not a new approval');const normalized=normalizeCarbohydrate(result.record);assert.equal(normalized.available,food.per100g.carbohydrate);assert.equal(normalized.net,null);assert.equal(result.record.per100g.polyols,null);assert.equal(result.record.per100g.protein,undefined);assert.equal(result.record.per100g.fat,undefined);assert.equal(result.publicationAuthorization,false);assert.equal(result.giAuthorization,false);checked++;
}
assert.equal(checked,90);assert.equal(pending,1);
for(const id of ['siemengranola-jogurtilla','vhh-runebergintortut']){const macro=await load('docs/nutrition/calculations/'+id+'.json'),copy=macro.ingredients.find((i:any)=>i.record?.id==='afcd-F007619-release-3').record;assert.equal(afcdGkOnlyObservation(ref,copy,'F007619','Exact macro copy reviewed independently').record.per100g.carbohydrate,6.9);}
const sample=foods.find((f:any)=>/^afcd-F006077-/i.test(f.id));assert.ok(sample);
assert.throws(()=>afcdGkOnlyObservation(ref,sample,'F007619','Wrong native record'),/identity mismatch/);
assert.throws(()=>afcdGkOnlyObservation(ref,sample,'F006077',''),/correspondence/);
const missing=structuredClone(ref);missing.foods.find((r:any)=>r.source_id==='F006077').available_carbohydrate_without_sugar_alcohols_g_per_100g=null;assert.throws(()=>afcdGkOnlyObservation(missing,sample,'F006077','Reviewed'),/unknown, not zero/);
const zero=structuredClone(ref),zeroLocal=structuredClone(sample);zero.foods.find((r:any)=>r.source_id==='F006077').available_carbohydrate_without_sugar_alcohols_g_per_100g=0;zeroLocal.per100g.carbohydrate=0;const z=afcdGkOnlyObservation(zero,zeroLocal,'F006077','Synthetic explicit available-CHO zero only');assert.equal(normalizeCarbohydrate(z.record).available,0);assert.equal(z.record.per100g.polyols,null);
const groups=(await fs.readFile(path.join(output,'source-groups.jsonl'),'utf8')).trim().split('\n').map(JSON.parse);
for(const g of groups.filter((g:any)=>/Original quantity and composition are preserved/.test(g.representativeReason)))assert.equal(g.class,'C','Preserved quantity/composition must not become invented blockers');
assert.equal(Object.values(summary.primaryCounts).reduce((a:any,b:any)=>a+b,0),170);
console.log(JSON.stringify({status:'PASS',checkedAfcdLocalVersions:checked,pendingPr182Versions:pending,allHeldCounterfactuals:170,sameLocalIdDifferentCopies:2,unknownVersusZero:true,productionActivation:false}));
