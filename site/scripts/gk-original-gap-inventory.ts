import {gkVariantScope} from '../src/features/recipes/gk-estimate-scope';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

export const hash=(v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
export const textHash=(v:string)=>createHash('sha256').update(v.replaceAll('\r\n','\n')).digest('hex');
type Result={recipeId:string;status:string;glycemicLoadPerServing:number|null;blockers:string[];ingredients:any[];omittedAvailableCarbohydratePerServingG:number};
type Report={results:Result[];gkOnlyVariants:any[];calculationInputHashes:Record<string,string>};
export function verifyGapBaseline(report:Report,baseline:any,read:(p:string)=>string){
 if(hash(report.results)!==baseline.resultsSha256)throw Error('Live original results changed; regenerate and review baseline');
 if(hash(report.gkOnlyVariants)!==baseline.variantsSha256)throw Error('Approved variant objects changed');
 if(hash(report.calculationInputHashes)!==baseline.inputHashesSha256)throw Error('Input evidence hashes changed');
 for(const [p,expected] of Object.entries(baseline.sourceFiles))if(textHash(read(p))!==expected)throw Error('Stale source or original recipe: '+p);
 const ids=report.results.map(r=>r.recipeId);
 if(new Set(ids).size!==ids.length||ids.length!==326)throw Error('Incomplete or duplicate original inventory');
}
export function gapQueue(report:Report){
 return report.results.filter(r=>r.status!=='CALCULATED').map(r=>{
  if(r.glycemicLoadPerServing!==null||!r.blockers.length)throw Error('Inconsistent HOLD: '+r.recipeId);
  return {recipeId:r.recipeId,status:'HOLD',blockerCount:r.blockers.length,
   blockerKinds:[...new Set(r.blockers.map(b=>/cumulative omitted/.test(b)?'CUMULATIVE_OMISSION':/structure differs|source.*changed|binding/i.test(b)?'BINDING_REVIEW':'SOURCE_OR_PREPARATION'))],
   blockers:r.blockers,inputSha256:report.calculationInputHashes[r.recipeId],
   existingNonOriginalEvidence:report.gkOnlyVariants.filter(v=>v.recipeId===r.recipeId).map(v=>({versionId:v.versionId,scope:gkVariantScope(v)})),
   originalCoverageGain:0,publicationAuthorized:false};
 }).sort((a,b)=>a.recipeId.localeCompare(b.recipeId,'en'));
}
export function firstBatch(report:Report,plan:any){
 if(plan.publicationAuthorized!==false||plan.sourceApprovalGranted!==false)throw Error('Review plan cannot grant approval');
 const queue=gapQueue(report);
 if(plan.cases.length!==5||new Set(plan.cases.map((c:any)=>c.recipeId)).size!==5)throw Error('Expected five distinct review cases');
 return plan.cases.map((c:any)=>{
  const row=queue.find(r=>r.recipeId===c.recipeId);
  if(!row)throw Error('Case is not a current original HOLD: '+c.recipeId);
  const result=report.results.find(r=>r.recipeId===c.recipeId)!;
  return {...row,...c,status:'HOLD',originalCoverageGain:0,publicationAuthorized:false,
   omittedChoPerServing:result.omittedAvailableCarbohydratePerServingG,
   sourceComponents:result.ingredients.filter(i=>i.issues?.length).map(i=>({name:i.name,grams:i.grams,foodRecordId:i.fineliRecordId,choPer100g:i.availableCarbohydratePer100g,choPerServing:i.availableCarbohydratePerServingG,issues:i.issues}))};
 });
}
export function buildInventory(root:string){
 const read=(p:string)=>readFileSync(resolve(root,p),'utf8');
 const baseline=JSON.parse(read('docs/nutrition/gk-original-gap-batch01/baseline.json'));
 const ancestry=execFileSync('git',['merge-base','--is-ancestor',baseline.mainSha,'HEAD'],{cwd:root});
 void ancestry;
 const report=JSON.parse(read('tmp/nutrition/glycemic-load-pilot.json'));
 verifyGapBaseline(report,baseline,read);
 const plan=JSON.parse(read('docs/nutrition/gk-original-gap-batch01/plan.json'));
 return {schemaVersion:1,kind:'READ_ONLY_ORIGINAL_GAP_REVIEW',mainSha:baseline.mainSha,
  resultsSha256:baseline.resultsSha256,variantsSha256:baseline.variantsSha256,
  counts:{total:326,originalNumeric:report.results.filter((r:Result)=>r.status==='CALCULATED').length,originalMissing:gapQueue(report).length,reviewCases:5,newApprovedOriginals:0},
  publicationAuthorized:false,sourceApprovalGranted:false,queue:gapQueue(report),firstBatch:firstBatch(report,plan)};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=resolve(import.meta.dirname,'../..');
 const result=buildInventory(root);
 const output=resolve(root,'tmp/nutrition/gk-original-gap-batch01.json');
 mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({output,counts:result.counts,publicationAuthorized:false}));
}
