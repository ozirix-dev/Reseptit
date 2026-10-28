import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=path.resolve(process.argv[2]);
const output=path.resolve(process.argv[3]);
const relativeOutput=path.relative(root,output);
if (!relativeOutput.startsWith('..'+path.sep) && !path.isAbsolute(relativeOutput)) throw new Error('Output must be outside the repository');
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const read=(p:string)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const pilot=read('tmp/nutrition/glycemic-load-pilot.json');
const foods=read('docs/nutrition/food-records.json');
const gi=read('docs/nutrition/glycemic-index-records.json').records;
const rows=[];
for (const r of pilot.results.filter((r:any)=>r.status!=='CALCULATED')) {
 const input=structuredClone(pilot.calculationInputs.find((i:any)=>i.recipeId===r.recipeId));
 const changed=[];
 r.ingredients.forEach((i:any,n:number)=>{
  if(i.giRecordId && i.giContribution===null && i.availableCarbohydratePerServingG>0 && i.availableCarbohydratePerServingG<1 && i.issues.some((x:string)=>r.blockers.includes(`${r.recipeId}: ${i.name}: ${x}`))) {
   input.ingredients[n].giRecordId=null;
   changed.push({index:n,name:i.name,carbohydrate:i.availableCarbohydratePerServingG});
  }
 });
 const result=calculateGlycemicLoad(input,foods,gi);
 rows.push({recipeId:r.recipeId,changed,remainingBlockers:result.blockers,omitted:result.omittedAvailableCarbohydratePerServingG,modelOnlyCouldResolve:changed.length>0 && result.status==='CALCULATED',bindingBlocked:pilot.recipeBindingMismatches.includes(r.recipeId)});
}
fs.writeFileSync(output,JSON.stringify(rows,null,2)+'\n');
console.log(rows.filter(r=>r.modelOnlyCouldResolve));
