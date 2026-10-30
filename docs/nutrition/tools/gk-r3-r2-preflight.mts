import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {calculate} from '../../../site/scripts/nutrition-model.ts';
import {calculateGlycemicLoad} from '../../../site/scripts/glycemic-load-model.ts';
import {glycemicLoadInputHash,glycemicLoadEvidenceHash} from '../../../site/scripts/glycemic-load-recipe-binding.ts';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const r2='R2_COMMIT', r2Sha='020b665582f4f1ec54e56ec978581e424adc6ace';
const mainSha='e8da2c9417e2aeff55a85d599b3b7e1ad465f36c';
const git=(args:string[])=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const readText=async(p:string)=>p.startsWith(r2+'/')?git(['show',r2Sha+':'+p.slice(r2.length+1)]):await fs.readFile(p,'utf8');
const read=async(p:string)=>JSON.parse(await readText(p));
const hash=(v:any)=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const fullDiff=git(['diff',mainSha,r2Sha,'--']);
const files=[...fullDiff.matchAll(/^diff --git a\/(.+) b\/(.+)$/gm)].map(m=>m[2]);
assert.equal(files.length,12);
const diffCoverage=[];
for(const file of files){const value=await readText(r2+'/'+file);if(file.endsWith('.json'))JSON.parse(value);diffCoverage.push({file,bytes:Buffer.byteLength(value),canonicalSha256:crypto.createHash('sha256').update(value.replaceAll('\r\n','\n')).digest('hex')});}
assert.equal(git(['rev-parse',r2Sha+'^{commit}']).trim(),r2Sha);
const before=await read(root+'/docs/nutrition/glycemic-load-pilot-input.json');
const after=await read(r2+'/docs/nutrition/glycemic-load-pilot-input.json');
const cor=await read(r2+'/docs/nutrition/gk-r2-corrections.json');
const foods=await read(root+'/docs/nutrition/food-records.json');
const gi=await read(root+'/docs/nutrition/glycemic-index-records.json');
const manifest=await read(r2+'/docs/nutrition/gk-r2-regression.json');
const binding=await read(r2+'/docs/nutrition/glycemic-load-recipe-bindings.json');
const mainPilot=await read(root+'/tmp/nutrition/glycemic-load-pilot.json');
const replay=structuredClone(before);
for(const c of cor.changes){const r=replay.recipes.find((r:any)=>r.recipeId===c.recipeId);const ix=r.ingredients.findIndex((i:any)=>i.name===c.ingredient);assert.deepEqual(r.ingredients[ix],c.before);r.ingredients[ix]=c.after;}
assert.deepEqual(replay,after);
for(const row of manifest.recipes){const r=mainPilot.results.find((r:any)=>r.recipeId===row.recipeId);assert.equal(hash(r),row.beforeResultSha256,row.recipeId);}
const mutationProbes=[];
for(const id of manifest.allowedChangedRecipeIds){
 const input=after.recipes.find((r:any)=>r.recipeId===id);const expected=manifest.recipes.find((r:any)=>r.recipeId===id);
 const actual=calculateGlycemicLoad(input,foods,gi.records);assert.equal(hash(actual),expected.afterResultSha256,id);
 assert.equal(glycemicLoadInputHash(input),binding.calculationInputs[id]);assert.equal(glycemicLoadEvidenceHash(input,foods,gi.records),binding.calculationEvidence[id]);
 const bad=structuredClone(input);const row=bad.ingredients.find((r:any)=>r.grams>0&&r.fineliRecordId&&foods.find((f:any)=>f.id===r.fineliRecordId)?.per100g.carbohydrate>0);row.grams+=11;
 assert.notEqual(glycemicLoadInputHash(bad),binding.calculationInputs[id]);assert.notEqual(hash(calculateGlycemicLoad(bad,foods,gi.records)),expected.afterResultSha256);
 const alteredFoods=structuredClone(foods);const chosen=alteredFoods.find((f:any)=>f.id===row.fineliRecordId);chosen.per100g.carbohydrate+=1;
 assert.notEqual(glycemicLoadEvidenceHash(input,alteredFoods,gi.records),binding.calculationEvidence[id]);
 assert.notEqual(hash(calculateGlycemicLoad(input,alteredFoods,gi.records)),expected.afterResultSha256);
 const changedBinding=structuredClone(input);changedBinding.ingredients.find((r:any)=>r.name===row.name).giRecordId='rice-category-mean-gi-67';
 assert.notEqual(glycemicLoadInputHash(changedBinding),binding.calculationInputs[id]);
 assert.notEqual(glycemicLoadEvidenceHash(changedBinding,foods,gi.records),binding.calculationEvidence[id]);
 mutationProbes.push({recipeId:id,probe:'+11 g on a nonzero carbohydrate ingredient; +1gCHO/100g composition; reassigned GI binding',inputFingerprintDetected:true,fixedFullResultDetected:true,compositionEvidenceDriftDetected:true,reassignedGiBindingDetected:true});
}
const proposals=await read(r2+'/docs/nutrition/gk-r2-nutrition-proposals.json');
const proposalChecks=[];
for(const p of proposals.proposals){const b=await read(root+'/'+p.calculationPath);const a=structuredClone(b);for(const replacement of p.replacementRows){const ix=a.ingredients.findIndex((i:any)=>i.item===replacement.item);assert.ok(ix>=0);a.ingredients[ix]=replacement.proposed;}const old=calculate(b),next=calculate(a);assert.deepEqual(old.perServing,p.beforePerServing);assert.deepEqual(next.perServing,p.proposedPerServing);proposalChecks.push({recipeId:p.recipeId,servings:b.servings,before:old.perServing,proposed:next.perServing,omissionUpperBounds:next.omissionImpactUpperBoundPerServing,reproduced:true,proposedCalculation:a});}
const result={schemaVersion:1,reviewRole:'Technical preflight of our own R2 work; not independent approval',mainCommit:'e8da2c9417e2aeff55a85d599b3b7e1ad465f36c',r2Head:'020b665582f4f1ec54e56ec978581e424adc6ace',diffCoverage,correctionReplay:{changes:cor.changes.length,exactReplay:true},all326BaselineResultsMatch:true,publicCoverage:mainPilot.summary,mutationProbes,proposalChecks};
const saved=await read(root+'/docs/nutrition/gk-r3-r2-preflight.json');
// Checkout byte counts depend on CRLF; identity is the canonical LF content hash.
const canonicalFiles=(rows:any[])=>rows.map(({file,canonicalSha256})=>({file,canonicalSha256}));
assert.deepEqual(canonicalFiles(result.diffCoverage),canonicalFiles(saved.diffCoverage));
assert.deepEqual(result.mutationProbes,saved.mutationProbes);
assert.deepEqual(result.publicCoverage,saved.publicCoverage);
console.log(JSON.stringify({files:files.length,replay:cor.changes.length,baselineMatches:manifest.recipes.length,probes:mutationProbes.length,proposals:proposalChecks.map(({recipeId,before,proposed,omissionUpperBounds})=>({recipeId,before,proposed,omissionUpperBounds}))},null,2));
