import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
export const p1Transition=JSON.parse(readFileSync(new URL('../../docs/nutrition/gk-legacy-reconciliation/p1-main-transition.json',import.meta.url),'utf8'));
const sha=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function requiresP1SourceCorrection(root:string){
 const result=spawnSync('git',['merge-base','--is-ancestor',p1Transition.mainSha,'HEAD'],{cwd:root,encoding:'utf8'});
 if(result.status!==0&&result.status!==1)throw Error('Cannot verify reviewed main ancestry: '+result.stderr);
 return result.status===0;
}
export function verifyP1SourceInputs(inputs:any[],requireNew:boolean){
 for(const row of p1Transition.records){
  const matches=inputs.filter(r=>r.recipeId===row.recipeId);
  if(matches.length!==1||sha(matches[0])!==(requireNew?row.newInputSha256:row.oldInputSha256))throw Error('P1 source identity changed or rolled back: '+row.recipeId);
 }
}
/** Frozen-release projection only; live input/result hashes are checked independently. */
export function restoreBeforeP1SourceCorrection(report:any){
 for(const row of p1Transition.records){
  report.results=report.results.map((r:any)=>r.recipeId===row.recipeId?row.oldResult:r);
  if(report.calculationInputHashes)report.calculationInputHashes[row.recipeId]=row.oldCalculationInputHash;
  if(report.calculationEvidenceHashes)report.calculationEvidenceHashes[row.recipeId]=row.oldCalculationEvidenceHash;
 }
 for(const key of ['calculationInputMismatches','calculationEvidenceMismatches'])if(report[key])report[key]=report[key].filter((id:string)=>!p1Transition.records.some((r:any)=>r.recipeId===id));
 return report;
}
export function sourceBeforeP1Correction(file:string,text:string){
 if(file!=='docs/nutrition/glycemic-load-pilot-input.json')return text;
 const input=JSON.parse(text);
 input.recipes=input.recipes.map((r:any)=>p1Transition.records.find((x:any)=>x.recipeId===r.recipeId)?.oldInput??r);
 return JSON.stringify(input,null,2)+'\n';
}
