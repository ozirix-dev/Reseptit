// Three source aliases, five dependent recipe/channel cases only. No output activation.
import {execFileSync} from 'node:child_process';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
let parent=path.dirname(output);while(true){try{parent=await fs.realpath(parent);break;}catch(e:any){if(e.code!=='ENOENT')throw e;parent=path.dirname(parent);}}
let gitRoot='';try{gitRoot=execFileSync('git',['rev-parse','--show-toplevel'],{cwd:parent,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch(e:any){if(e.status!==128)throw e;}
if(gitRoot)throw Error('Output must be outside Git worktrees');
const load=async(p:string)=>JSON.parse(await fs.readFile(path.join(root,p),'utf8'));
const {calculate}=await import(pathToFileURL(path.join(root,'site/scripts/nutrition-model.ts')).href);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const fixes={'afcd-F007619-release-3':6.9,'afcd-F006573-release-3':7.7,'afcd-F002384-release-3':2.8};
const changes=[];
for(const id of ['siemengranola-jogurtilla','vhh-runebergintortut']){
 const e=await load(`docs/nutrition/calculations/${id}.json`),next=structuredClone(e);
 for(const i of next.ingredients)if(i.record&&Object.hasOwn(fixes,i.record.id))i.record.per100g.carbohydrate=fixes[i.record.id as keyof typeof fixes];
 const before=calculate(e),after=calculate(next);
 changes.push({recipeId:id,channel:'MACRO',before:{net:before.perServing.netCarbohydrate,totalLegacy:before.totalCarbohydratePerServingG,protein:before.perServing.protein,fat:before.perServing.fat},afterAvailableOnlyCorrection:{net:after.perServing.netCarbohydrate,totalLegacy:after.totalCarbohydratePerServingG,protein:after.perServing.protein,fat:after.perServing.fat},qualification:'Corrected totalLegacy is a counterfactual using the old incomplete paired-polyol model, not an approved complete total.'});
}
const foods=await load('docs/nutrition/food-records.json'),nextFoods=structuredClone(foods),gi=await load('docs/nutrition/glycemic-index-records.json'),input=await load('docs/nutrition/glycemic-load-pilot-input.json');
for(const f of nextFoods)if(Object.hasOwn(fixes,f.id))f.per100g.carbohydrate=fixes[f.id as keyof typeof fixes];
for(const id of ['valimerellinen-ricotta-persikkakulho','pellava-puuro-pahkinoilla','siskonmakkarakeitto-juurekset']){
 const r=input.recipes.find((r:any)=>r.recipeId===id);if(!r)throw Error('Missing targeted recipe');
 const before=calculateGlycemicLoad(r,foods,gi.records),after=calculateGlycemicLoad(r,nextFoods,gi.records);
 const point=(v:any)=>({status:v.status,exact:v.unroundedGlycemicLoadPerServing,rounded:v.glycemicLoadPerServing,blockers:v.blockers});
 changes.push({recipeId:id,channel:'GK',before:point(before),afterAvailableOnlyCorrection:point(after),affectedRows:before.ingredients.flatMap((i:any,ix:number)=>Object.hasOwn(fixes,i.fineliRecordId)?[{recordId:i.fineliRecordId,grams:i.grams,beforeAvailable:i.availableCarbohydratePer100g,afterAvailable:after.ingredients[ix].availableCarbohydratePer100g,gi:i.gi,oldContribution:i.giContribution,newContribution:after.ingredients[ix].giContribution}]:[]),qualification:'Raw current-engine probe; retained HOLDs do not become publishable. Source/approval hashes require separate review after a real change.'});
}
await fs.writeFile(output,JSON.stringify(changes,null,2)+'\n');console.log(JSON.stringify(changes,null,2));
