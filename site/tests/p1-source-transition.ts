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
