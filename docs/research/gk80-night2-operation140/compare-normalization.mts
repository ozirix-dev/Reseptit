import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(process.argv[2]);
const scratch=path.resolve(process.argv[3]);
assert.ok(process.argv[2]&&process.argv[3], 'Pass repository root and an existing disposable scratch directory');
const original=execFileSync('git',['show','583fdb91aeb12114f909412b9165fc3b02a6515d:site/scripts/nutrition-model.ts'],{cwd:root,encoding:'utf8'});
const oldFile=path.join(scratch,'main-nutrition-model.ts');writeFileSync(oldFile,original);
const before=await import(pathToFileURL(oldFile).href),after=await import(pathToFileURL(path.join(root,'site/scripts/nutrition-model.ts')).href);
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const samples:Array<{origin:string;record:any}>=read('docs/nutrition/food-records.json').map((record:any)=>({origin:'legacy-GK-food-records',record}));
const {readdirSync}=await import('node:fs');
for(const file of readdirSync(path.join(root,'docs/nutrition/calculations')).filter(f=>f.endsWith('.json'))){
 const e=read('docs/nutrition/calculations/'+file);
 for(const i of e.ingredients)if(i.record)samples.push({origin:'calculation:'+e.recipeId,record:i.record});
}
const run=(fn:any,r:any)=>{try{return {value:fn(r)}}catch(e){return {error:String(e)}}};
const definitions:Record<string,number>={};
for(const s of samples){definitions[s.record.carbohydrateDefinition]=(definitions[s.record.carbohydrateDefinition]??0)+1;assert.deepEqual(run(after.normalizeCarbohydrate,s.record),run(before.normalizeCarbohydrate,s.record),s.origin+':'+s.record.id);}
const us=samples.filter(s=>s.record.carbohydrateDefinition==='US_TOTAL_INCLUDING_FIBRE');assert.equal(us.length,0);
const control={id:'synthetic-only',state:'raw',basis:'per100g-edible',carbohydrateDefinition:'US_TOTAL_INCLUDING_FIBRE',polyolsSourceVerified:true,polyolsEvidence:'Synthetic source reports3g',per100g:{carbohydrate:20,fibre:4,polyols:3}};
assert.deepEqual(before.normalizeCarbohydrate(control),{available:16,net:13});assert.deepEqual(after.normalizeCarbohydrate(control),{available:13,net:13});
assert.equal(before.totalCarbohydrate(16,4,3),23);assert.equal(after.totalCarbohydrate(13,4,3),20);
const out={status:'PASS',baseMain:'583fdb91aeb12114f909412b9165fc3b02a6515d',recordUsesCompared:samples.length,uniqueRecordIds:new Set(samples.map(s=>s.record.id)).size,definitions,activeUsTotalUses:us.length,
 everyExistingNormalizationUnchanged:true,changedSyntheticControl:{before:before.normalizeCarbohydrate(control),after:after.normalizeCarbohydrate(control),reconstructedBefore:23,reconstructedAfter:20},
 mainModelLfSha256:createHash('sha256').update(original.replaceAll('\r\n','\n')).digest('hex'),patchedModelLfSha256:createHash('sha256').update(readFileSync(path.join(root,'site/scripts/nutrition-model.ts'),'utf8').replaceAll('\r\n','\n')).digest('hex'),new326Calculations:0};
writeFileSync(path.join(scratch,'normalization-proof.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
