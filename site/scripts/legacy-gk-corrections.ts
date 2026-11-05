import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {calculateGlycemicLoad,type GlycemicLoadRecipeInput} from './glycemic-load-model';

const sha=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function verifyLegacyCandidateInput(text:string,expected:Record<string,string>){
 const inputs=JSON.parse(text.replaceAll('\r\n','\n')).recipes as GlycemicLoadRecipeInput[];
 for(const [id,hash] of Object.entries(expected)){
  const rows=inputs.filter(r=>r.recipeId===id);
  if(rows.length!==1||sha(rows[0])!==hash)throw Error('Current input changed; rebase and review candidate patches: '+id);
 }
}
export function verifyLegacyReviewEvidence(read:(path:string)=>string,manifest:any){
 for(const snapshot of manifest.reviewEvidenceSnapshots){
  const rows=JSON.parse(read(snapshot.path))[snapshot.arrayKey];
  const selected=rows.filter((r:any)=>r[snapshot.idKey]===snapshot.id);
  if(selected.length!==1||sha(selected[0])!==snapshot.sha256)throw Error('Reviewed source record changed: '+snapshot.path+'/'+snapshot.id);
 }
 const raw=read(manifest.sourceReviewPath).replaceAll('\r\n','\n');
 if(createHash('sha256').update(raw).digest('hex')!==manifest.sourceReviewSha256Lf)throw Error('Source review changed; refresh its bound assessment');
 const review=JSON.parse(raw);
 const cards=review.deepOriginalCaseReview?.cards;
 if(!cards||JSON.stringify(Object.keys(cards).sort())!==JSON.stringify(['baozi','indonesialainen-bubur-sumsum','kreikkalainen-moussaka']))throw Error('Missing original-case research scope');
 const paths=[...new Set(Object.values(cards).flatMap((c:any)=>[c.recipePath,c.macroPath]).filter(Boolean))].sort();
 const pins=manifest.reviewTextSnapshots??[];
 if(JSON.stringify(paths)!==JSON.stringify(pins.map((p:any)=>p.path).sort()))throw Error('Missing reviewed recipe/macro text snapshot');
 for(const pin of pins){
  if(createHash('sha256').update(read(pin.path).replaceAll('\r\n','\n')).digest('hex')!==pin.sha256Lf)throw Error('Reviewed recipe/macro text changed: '+pin.path);
 }

 for(const id of new Set<string>(review.giDecisions.map((d:any)=>d.giRecordId))){
  if(manifest.reviewEvidenceSnapshots.filter((p:any)=>p.path==='docs/nutrition/glycemic-index-records.json'&&p.id===id).length!==1)throw Error('Missing reviewed GI source snapshot: '+id);
 }
 if(review.sourceApprovalGranted!==false||review.publicationAuthorized!==false)throw Error('Research assessment cannot grant source/publication approval');
 return review;
}
export function verifyLegacyCandidateScope(manifest:any){
 const ids=[...new Set(manifest.patches.map((p:any)=>p.recipeId))].sort();
 if(JSON.stringify(ids)!==JSON.stringify(Object.keys(manifest.recipeSnapshotsSha256).sort()))throw Error('Candidate scope must have an exact snapshot for every affected recipe');
}

/** Review-only adapter. It never writes live inputs, bindings, receipts or generated publication data. */
export function prepareLegacyGkCandidates(root:string) {
 const read=(p:string)=>readFileSync(join(root,p),'utf8').replaceAll('\r\n','\n');
 const manifest=JSON.parse(read('docs/nutrition/gk-legacy-reconciliation/candidates.json'));
 const text=read('docs/nutrition/glycemic-load-pilot-input.json');
 verifyLegacyCandidateScope(manifest);
 verifyLegacyCandidateInput(text,manifest.recipeSnapshotsSha256);
 if(manifest.publicationAuthorized!==false||manifest.sourceApprovalGranted!==false)throw Error('This adapter cannot grant approval');
 const review=verifyLegacyReviewEvidence(read,manifest);
 const inputs=JSON.parse(text).recipes as GlycemicLoadRecipeInput[];
 const proposed=structuredClone(inputs);
 const ids=new Set<string>();
 for(const patch of manifest.patches) {
  const recipe=proposed.find(r=>r.recipeId===patch.recipeId);
  const rows=recipe?.ingredients.filter(r=>r.name===patch.ingredient);
  if(!rows||rows.length!==1||patch.recipeId==='tomaatti-kananmuna-wokki')throw Error('Ambiguous or protected candidate scope');
  Object.assign(rows[0],patch.changes);ids.add(patch.recipeId);
 }
 if(JSON.stringify([...ids].sort())!==JSON.stringify(Object.keys(review.candidateHolds).sort()))throw Error('Every candidate needs its scoped content assessment');
 const live=JSON.parse(read('tmp/nutrition/glycemic-load-pilot.json'));
 for(const [id,scope] of Object.entries(review.currentSuccessors) as Array<[string,any]>){
  const source=scope.scope==='CURRENT_APPROVED_ORIGINAL'?live.results.find((r:any)=>r.recipeId===id)
   :scope.versionId?live.gkOnlyVariants.find((v:any)=>v.recipeId===id&&v.versionId===scope.versionId):null;
  if(scope.snapshotSha256&&(!source||sha(source)!==scope.snapshotSha256))throw Error('Current approved successor changed; review its scope: '+id);
 }
 const foods=JSON.parse(read('docs/nutrition/food-records.json'));
 const gis=JSON.parse(read('docs/nutrition/glycemic-index-records.json')).records;
 return {baseMain:manifest.baseMain,publicationAuthorized:false,sourceApprovalGranted:false,
  contentDecisions:review.giDecisions,originalCaseResearch:review.deepOriginalCaseReview,
  pendingDecisions:review.giDecisions.filter((r:{action:string;recipeId:string})=>r.action==='WITHDRAW_GI_FROM_REVIEW_CANDIDATE'&&!review.currentSuccessors[r.recipeId].scope.startsWith('CURRENT_APPROVED_')),
  candidates:[...ids].map(recipeId=>{
   const before=inputs.find(r=>r.recipeId===recipeId)!;
   const after=proposed.find(r=>r.recipeId===recipeId)!;
   return {recipeId,input:after,before:calculateGlycemicLoad(before,foods,gis),after:calculateGlycemicLoad(after,foods,gis),
    publicationStatus:'REVIEW_REQUIRED',existingSuccessor:review.currentSuccessors[recipeId],contentAssessment:{status:review.currentSuccessors[recipeId].scope.startsWith('CURRENT_APPROVED_')?'SUPERSEDED_BY_APPROVED_SCOPE':'HOLD',publishedGlycemicLoadPerServing:null,reasons:review.candidateHolds[recipeId] as string[]}};
  })};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 console.log(JSON.stringify(prepareLegacyGkCandidates(resolve(import.meta.dirname,'../..')),null,2));
}
