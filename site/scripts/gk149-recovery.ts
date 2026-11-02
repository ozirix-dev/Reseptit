/** Closed source-reuse proposals. Deliberately absent from the publication import chain. */
import {readFileSync} from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {loadPilot,verifyComposition,verifyCase,evaluate,digest,type Composition,type GI,type Case} from './gk149-model';
const folder='docs/nutrition/gk80-operation149/';
const read=(root:string,p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
export function verifyRecoveryComposition(root:string,c:Composition){
 if(c.kind!=='MANUFACTURER_TOTAL_CHO_CEILING'){verifyComposition(root,c);return;}
 const row=read(root,c.path).records.find((r:any)=>r.id===c.nativeId);
 if(c.id!=='koro-ready-ceiling'||c.path!==folder+'recovery-observations.json'||c.nativeField!=='manufacturerDeclaredTotalChoCeilingPer100g'||c.availablePer100g!==0.1||!row||digest(row)!==c.nativeRowSha256||row.state!=='READY_IN_WATER_DRAINED'||row.productUrl!=='https://www.koro.com/fi/luomu-konjac-fettuccine-vedessae-1-kg'||row.manufacturerDeclaredTotalChoCeilingPer100g!==0.1||row.relation!=='STRICT_LESS_THAN')throw Error('Unverified product carbohydrate ceiling or wrong dry/prepared basis');
}
export function verifyRecoveryCase(root:string,c:Case,comps:Composition[]){
 verifyCase(root,c);
 for(const i of c.candidateIngredients)if(comps.find(f=>f.id===i.compositionId)?.kind==='MANUFACTURER_TOTAL_CHO_CEILING'&&(i.carbohydrateUse!=='UPPER_BOUND'||i.giId!==null))throw Error('Manufacturer ceiling must remain a CHO upper bound, never an exact point/GI binding');
}
export function loadRecovery(root:string){
 const base=loadPilot(root),pack=read(root,folder+'recovery-cases.json');
 if(pack.activation!==false||pack.ownerApproval!==false||pack.readyAuthorized!==false||pack.mergeAuthorized!==false||pack.deployAuthorized!==false)throw Error('Recovery must remain unapproved and closed');
 const extra=read(root,folder+'recovery-composition.json').records as Composition[],bindings=read(root,folder+'recovery-gi.json').records as GI[];
 for(const c of extra)verifyRecoveryComposition(root,c);
 const comps=[...base.comps,...extra];if(new Set(comps.map(c=>c.id)).size!==comps.length)throw Error('Duplicate recovery composition');
 for(const g of bindings){
  const file=read(root,g.path),native=(Array.isArray(file)?file:file.records).find((r:any)=>r.id===g.nativeId);
  if(!native||digest(native)!==g.nativeRowSha256)throw Error('Recovery GI evidence changed');
  const original=base.gis.find(b=>b.id===g.id);
  if(original){
   const {allowedCompositionIds:_a,bindingStatus:_b,...source}=g as GI & {bindingStatus?:string};
   const {allowedCompositionIds:_c,...frozen}=original;
   if(digest(source)!==digest(frozen)||original.allowedCompositionIds.some(id=>!g.allowedCompositionIds.includes(id)))throw Error('Recovery cannot rewrite a frozen GI source/coding');
  }else if(g.kind!=='NAMED_HUMAN_GI'||g.values.length!==1||native.gi!==g.values[0]||native.reportedScale!=='GLUCOSE_100')throw Error('Recovery requires named glucose-scale observations');
 }
 const gis=base.gis.filter(g=>!bindings.some(b=>b.id===g.id)).concat(bindings);
 const cases=pack.cases as Case[];
 if(cases.length!==5||new Set(cases.map(c=>c.recipeId)).size!==5||cases.some(c=>base.cases.some(b=>b.recipeId===c.recipeId)))throw Error('Recovery scope must be5 new distinct exact versions');
 for(const c of cases)verifyRecoveryCase(root,c,comps);
 const results=cases.map(c=>evaluate(c,comps,gis));
 return {cases,comps,gis,results};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../../',import.meta.url)),{results}=loadRecovery(root);
 console.log(JSON.stringify({publicActivation:false,ownerApproval:false,additionalProposals:results.filter(r=>r.numericProposal).length,results},null,2));
 if(results.some(r=>!r.numericProposal))process.exitCode=1;
}
