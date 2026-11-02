import {assertScratch} from './scratch-scope.mts';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
await assertScratch(out);
const baseline=JSON.parse(await fs.readFile(path.join(out,'gk-baseline.json'),'utf8'));
const original=await fs.readFile(path.join(root,'site/scripts/glycemic-load-model.ts'),'utf8');
const rewire=(s:string)=>s.replace(/from (["'])(\.[^"']+)\1/g,(_,q,p)=>`from ${JSON.stringify(pathToFileURL(path.resolve(root,'site/scripts',p)).href)}`);
const summaries=[];
for(const [per,cumulative] of [[1.5,2],[2,2],[1,3],[1.5,3],[2,4]]){
 const filename=path.join(out,`gk-model-${per}-${cumulative}.mts`);
 await fs.writeFile(filename,rewire(original).replace('MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G = 1;','MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G = '+per+';').replace('CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G = 2;','CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G = '+cumulative+';'));
 let runner=await fs.readFile(path.join(out,'gk-runner.mts'),'utf8');
 runner=runner.replace(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model')).href,pathToFileURL(filename).href);
 runner=runner.slice(0,runner.lastIndexOf('await writeFile('));
 const resultPath=path.join(out,`gk-${per}-${cumulative}.json`);
 runner+=`await writeFile(${JSON.stringify(resultPath)},JSON.stringify(report,null,2)+'\\n');`;
 const runPath=path.join(out,`gk-runner-${per}-${cumulative}.mts`);await fs.writeFile(runPath,runner);await import(pathToFileURL(runPath).href);
 const result=JSON.parse(await fs.readFile(resultPath,'utf8'));
 const newRows=result.results.filter((r:any)=>r.status==='CALCULATED'&&baseline.results.find((x:any)=>x.recipeId===r.recipeId)?.status!=='CALCULATED');
 summaries.push({perIngredientStrictlyLessThan:per,cumulativeStrictlyLessThan:cumulative,calculated:result.summary.calculated,newRecipeIds:newRows.map((r:any)=>r.recipeId),newResults:newRows,unresolved:result.summary.insufficientSourceData,classification:'REVIEW REQUIRED; method sensitivity only, no approvals transferred'});
}
await fs.writeFile(path.join(out,'gk-sensitivity.json'),JSON.stringify(summaries,null,2)+'\n');
console.log(JSON.stringify(summaries.map(({newResults,...r})=>r)));
