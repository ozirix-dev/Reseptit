import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {calculateGlycemicLoad,type GlycemicLoadRecipeInput} from './glycemic-load-model';

export function verifyLegacyCandidateInput(text:string,expected:Record<string,string>){
 const inputs=JSON.parse(text.replaceAll('\r\n','\n')).recipes as GlycemicLoadRecipeInput[];
 for(const [id,hash] of Object.entries(expected)){
  const rows=inputs.filter(r=>r.recipeId===id);
  if(rows.length!==1||createHash('sha256').update(JSON.stringify(rows[0])).digest('hex')!==hash)throw Error('Current input changed; rebase and review candidate patches: '+id);
 }
}

/** Review-only adapter. It never writes live inputs, bindings, receipts or generated publication data. */
export function prepareLegacyGkCandidates(root:string) {
 const read=(p:string)=>readFileSync(join(root,p),'utf8').replaceAll('\r\n','\n');
 const manifest=JSON.parse(read('docs/nutrition/gk-legacy-reconciliation/candidates.json'));
 const text=read('docs/nutrition/glycemic-load-pilot-input.json');
 verifyLegacyCandidateInput(text,manifest.recipeSnapshotsSha256);
 if(manifest.publicationAuthorized!==false||manifest.sourceApprovalGranted!==false)throw Error('This adapter cannot grant approval');
 const inputs=JSON.parse(text).recipes as GlycemicLoadRecipeInput[];
 const proposed=structuredClone(inputs);
 const ids=new Set<string>();
 for(const patch of manifest.patches) {
  const recipe=proposed.find(r=>r.recipeId===patch.recipeId);
  const rows=recipe?.ingredients.filter(r=>r.name===patch.ingredient);
  if(!rows||rows.length!==1||patch.recipeId==='tomaatti-kananmuna-wokki')throw Error('Ambiguous or protected candidate scope');
  Object.assign(rows[0],patch.changes);ids.add(patch.recipeId);
 }
 const foods=JSON.parse(read('docs/nutrition/food-records.json'));
 const gis=JSON.parse(read('docs/nutrition/glycemic-index-records.json')).records;
 return {baseMain:manifest.baseMain,publicationAuthorized:false,sourceApprovalGranted:false,
  pendingDecisions:manifest.decisions.filter((r:{decision:string})=>r.decision!=='PREPARED_CANDIDATE'),
  candidates:[...ids].map(recipeId=>{
   const before=inputs.find(r=>r.recipeId===recipeId)!;
   const after=proposed.find(r=>r.recipeId===recipeId)!;
   return {recipeId,input:after,before:calculateGlycemicLoad(before,foods,gis),after:calculateGlycemicLoad(after,foods,gis),publicationStatus:'REVIEW_REQUIRED'};
  })};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 console.log(JSON.stringify(prepareLegacyGkCandidates(resolve(import.meta.dirname,'../..')),null,2));
}
