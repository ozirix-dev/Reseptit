import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
// Read-only replay against the unchanged, verified repository model.
const root=process.env.OP141_REPOSITORY ?? 'D:/Projects/tmp/reseptit-gk80-operation141';
const directory=process.env.OP141_PACKAGE ?? 'D:/Temp/gk80-op141/stage/docs/research/gk80-operation141';
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const numbers=process.argv.slice(2).map(Number);
for(const n of numbers){
 const b=JSON.parse(fs.readFileSync(path.join(directory,`batch-${n}.json`),'utf8'));
 const results=b.cases.map((c:any)=>({scenarioId:c.scenarioId,modelInputSha256:c.modelInputSha256,versionSha256:c.versionSha256,evidenceBundleSha256:c.evidenceBundleSha256,result:calculateGlycemicLoad(c.input,b.foods,b.giRecords)}));
 fs.writeFileSync(path.join(directory,`batch-${n}-results.json`),JSON.stringify({batch:n,results},null,2)+'\n');
 console.log(JSON.stringify({batch:n,results:results.map((x:any)=>({recipe:x.result.recipeId,scenario:x.scenarioId,status:x.result.status,gk:x.result.glycemicLoadPerServing,omitted:x.result.omittedAvailableCarbohydratePerServingG,blockers:x.result.blockers})),holds:b.holds.length}));
 if(results.some((x:any)=>x.result.status!=='CALCULATED'))process.exitCode=1;
}
