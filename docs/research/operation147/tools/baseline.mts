import {assertScratch} from './scratch-scope.mts';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=path.resolve(process.argv[2]);
const output=path.resolve(process.argv[3]);
await assertScratch(output);
await fs.mkdir(output,{recursive:true});
const mod=async(p:string)=>import(pathToFileURL(path.join(root,p)).href);
const {auditTranslations}=await mod('site/scripts/translation-audit.ts');
const {verifyNutritionEvidence,recipeNutritionInputHash}=await mod('site/scripts/nutrition-evidence.ts');
const {loadRecovery,isRecoveryEvidence}=await mod('site/scripts/gk80-uunikanapasta.ts');
const {loadScopedPolyolC,isScopedPolyolEvidence}=await mod('site/scripts/gk80-polyol-c.ts');
const audit=await auditTranslations();
const batches=new Map();
for(const file of await fs.readdir(path.join(root,'docs/nutrition/batches'))){
 if(!file.endsWith('.json'))continue;
 const a=JSON.parse(await fs.readFile(path.join(root,'docs/nutrition/batches',file),'utf8'));
 batches.set(a.batchId,new Set(a.recipes.map((r:any)=>r.recipeId)));
}
const rows=[];
for(const source of audit.publishedSources){
 const id=source.data.recipe_id;
 const epath=`docs/nutrition/calculations/${id}.json`;
 let evidence=null;
 try{evidence=JSON.parse(await fs.readFile(path.join(root,epath),'utf8'));}
 catch(e:any){if(e.code!=='ENOENT')throw e;}
 if(evidence&&isRecoveryEvidence(evidence))await loadRecovery(root,id);
 if(evidence&&isScopedPolyolEvidence(evidence))await loadScopedPolyolC(root,id);
 const translations=audit.publishedTranslations.filter((t:any)=>t.data.recipe_id===id);
 const checked=verifyNutritionEvidence(source.data,evidence,translations);
 const batchErrors=evidence&&(!evidence.batchId||!batches.get(evidence.batchId)?.has(id))?['Missing matching batch manifest']:[];
 const errors=[...checked.errors,...batchErrors];
 const conflict=source.data.carbs_net_per_serving_g!=null&&source.data.carbs_total_per_serving_g!=null&&source.data.carbs_net_per_serving_g>source.data.carbs_total_per_serving_g;
 const status=conflict||(evidence&&errors.length)?'CONFLICT REQUIRES REVIEW':checked.status;
 rows.push({recipeId:id,path:source.path,recipe:source.data,content:source.content,evidence,checked:{...checked,status,errors},translations:translations.map((t:any)=>({path:t.path,data:t.data})),currentInputHash:recipeNutritionInputHash(source.data)});
}
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const hash=(s:string)=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
// Execute the exact current GK pipeline through its report construction only.
// Rewrite imports/roots into an external scratch copy; omit all public writes.
let pilot=await fs.readFile(path.join(root,'site/scripts/glycemic-load-pilot.ts'),'utf8');
pilot=pilot.slice(0,pilot.indexOf('const outputDir ='));
pilot=pilot.replace(/^import \{ siteContent \}.*\r?\n/m,'');
pilot=pilot.replace(/from (["'])(\.[^"']+)\1/g,(_,q,p)=>`from ${JSON.stringify(pathToFileURL(path.resolve(root,'site/scripts',p)).href)}`);
pilot=pilot.replace('const siteDir = path.resolve(import.meta.dirname, "..");',`const siteDir = ${JSON.stringify(path.join(root,'site'))};`);
pilot+=`\nawait writeFile(${JSON.stringify(path.join(output,'gk-baseline.json'))},JSON.stringify(report,null,2)+'\\n');\n`;
await fs.writeFile(path.join(output,'gk-runner.mts'),pilot);
await import(pathToFileURL(path.join(output,'gk-runner.mts')).href);
const inputFiles=execFileSync('git',['ls-files','-z','--','reseptit','kaannokset','docs/nutrition','site/scripts','site/src/content','site/src/features/recipes'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean).sort();
const hashes=Object.fromEntries(await Promise.all(inputFiles.map(async(f:string)=>[f,hash(await fs.readFile(path.join(root,f),'utf8'))])));
const baseline={sourceCommit:sha,createdAt:new Date().toISOString(),recipes:rows.length,translationAuditErrors:audit.errors??null,rows,inputHashes:hashes,gkRunnerSha256:hash(pilot),gkPilotSha256:hash(await fs.readFile(path.join(root,'site/scripts/glycemic-load-pilot.ts'),'utf8'))};
await fs.writeFile(path.join(output,'baseline-internal.json'),JSON.stringify(baseline,null,2)+'\n');
console.log(JSON.stringify({sourceCommit:sha,recipes:rows.length,statuses:rows.reduce((a:any,r:any)=>(a[r.checked.status]=(a[r.checked.status]??0)+1,a),{}),publishedPackages:rows.filter((r:any)=>Object.values(r.checked.values).every(v=>v!==null)).length}));
