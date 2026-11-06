import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fingerprint} from './gk80-candidate-model';
import {textHash} from './gk149-model';
import {parseMarkdown} from '../src/content/markdown';
import {calculateGlycemicLoad} from './glycemic-load-model';
import {normalizeCarbohydrate} from './nutrition-model';
import {glycemicLoadInputHash,glycemicLoadEvidenceHash,recipeBindingHash} from './glycemic-load-recipe-binding';
export const digest=fingerprint;
export type Read=(path:string)=>string;
export const folder='docs/nutrition/gk-original-solutions-batch02/';
const json=(read:Read,p:string)=>JSON.parse(read(p));
function walk(root:string,p='reseptit'):string[]{return readdirSync(join(root,p),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(root,p+'/'+e.name):e.name.endsWith('.md')?[p+'/'+e.name]:[]);}
export function evidenceState(blockers:string[]){
 const detail=blockers.join(' ');
 // Same pending-review wording rule as merged PR #290; not a failed search.
 if(/\bnot (?:yet )?(?:been )?reviewed\b/i.test(detail))return 'REVIEW_PENDING';
 if(/No (?:sufficiently matched|preparation-matched|suitable GI)|NO MATCH:|No matched .* GI was established|No sufficiently matched primary/i.test(detail))return 'NO_RELIABLE_SOURCE_FOUND';
 return 'SOURCE_BINDING_UNRESOLVED';
}
export function rankOriginalGaps(report:any,inputs:any[],originals:Record<string,any>,context:{verifiedPortionLeads?:string[];priorGiDecisions?:any[]}={}){
 const previous=new Set(['siemengranola-jogurtilla','pad-see-ew-vhh-konjac','paistettu-maksa-pekonilla','paella-valenciana','pad-thai-vhh-konjac']);
 return report.results.filter((r:any)=>r.status!=='CALCULATED').map((r:any)=>{
  const input=inputs.find(i=>i.recipeId===r.recipeId),original=originals[r.recipeId];
  if(!input||!original)throw Error('Missing original/input: '+r.recipeId);
  const selected=r.ingredients.filter((i:any)=>r.blockers.some((b:string)=>b.startsWith(r.recipeId+': '+i.name+':')));
  const known=selected.filter((i:any)=>i.availableCarbohydratePerServingG!==null).map((i:any)=>({ingredient:i.name,choPerServingG:i.availableCarbohydratePerServingG}));
  const detail=r.blockers.join(' '),types:string[]=[];
  if(/mass|quantity|amount|conversion|unweighed/i.test(detail))types.push('QUANTITY');
  if(/composition|food record|Fineli mapping|Fineli record/i.test(detail))types.push('COMPOSITION');
  if(/cumulative omitted/.test(detail)||selected.some((i:any)=>i.availableCarbohydratePerServingG>0&&i.availableCarbohydratePerServingG<1))types.push('SMALL_CHO_REVIEW');
  if(/GI|preparation|Q09/i.test(detail))types.push('GI_OR_PREPARATION');
  if(/brand|product|selected liquid|alternative|whole|recipe amount.*kpl/i.test(detail))types.push('IDENTITY_OR_CLARIFICATION');
  if(!types.length)types.push('SOURCE_RESEARCH');
  const complete=input.ingredients.length===original.ingredients.length;
  const nativeZeroLead=/ripaus suolaa/.test(detail);
  const quantityLead=types.includes('QUANTITY')&&selected.some((i:any)=>i.fineliRecordId);
  const state=evidenceState(r.blockers);
  const priorWithdrawals=(context.priorGiDecisions??[]).filter(d=>d.recipeId===r.recipeId&&d.action==='WITHDRAW_GI_FROM_REVIEW_CANDIDATE');
  const legacyAssumptions=input.ingredients.filter((i:any)=>i.grams===null&&/culinary|not fully weighed/i.test((i.excludedReason??'')+' '+(i.negligibleAssumption??''))&&(i.estimatedAvailableCarbohydratePerServingG??0)>0).map((i:any)=>({ingredient:i.name,choEstimate:i.estimatedAvailableCarbohydratePerServingG,evidence:i.negligibleAssumption}));
  const factors={nativeZeroLead:nativeZeroLead?40:0,verifiedReferencePortionLead:quantityLead&&context.verifiedPortionLeads?.includes(r.recipeId)?25:0,
   existingComposition:selected.some((i:any)=>i.fineliRecordId)?10:0,completeRowAccounting:complete?10:-35,
   establishedNegativeSearch:state==='NO_RELIABLE_SOURCE_FOUND'?-25:0,priorBatchWithoutNewLead:previous.has(r.recipeId)?-100:0,
   materialUnknownCho:selected.some((i:any)=>i.availableCarbohydratePerServingG===null)?-10:0,
   knownCarbohydrateExposure:known.some((i:any)=>i.choPerServingG>=1)?-10:0,
   priorScientificWithdrawals:priorWithdrawals.length?-25:0,
   independentUnknownQuantitiesOrComposition:-Math.min(20,Math.max(0,selected.filter((i:any)=>i.availableCarbohydratePerServingG===null).length-1)*4),
   inheritedUnweighedCulinaryAssumptions:legacyAssumptions.length?-10:0};
  return {recipeId:r.recipeId,recipePath:original.path,blockerCount:r.blockers.length,blockers:r.blockers,solutionTypes:types,evidenceState:state,
   originalIngredientCount:original.ingredients.length,inputRowCount:input.ingredients.length,rowAccounting:complete?'COUNT_MATCH_REQUIRES_SEMANTIC_REVIEW':'RECONCILE_WHOLE_RECIPE_FIRST',priorWithdrawnGiBindings:priorWithdrawals.map(d=>({ingredient:d.ingredient,giRecordId:d.giRecordId,rationale:d.rationale})),inheritedAssumptionsRequiringReview:legacyAssumptions,
   carbohydrateImpact:{knownBlockedComponents:known,knownBlockedSumG:known.reduce((s:number,i:any)=>s+i.choPerServingG,0),unknownBlockedComponents:selected.filter((i:any)=>i.availableCarbohydratePerServingG===null).map((i:any)=>i.name),completeBound:false},
   priority:{score:Object.values(factors).reduce((a,b)=>a+b,0),factors,basis:'Feasibility heuristic: quantity/source identity, completeness, CHO materiality and previous negative searches; not blocker count alone.'},
   nextStep:previous.has(r.recipeId)?'Retain batch01 HOLD; reopen only with a new source lead.':!complete?'Reconcile every original ingredient before treating the listed blockers as exhaustive.':nativeZeroLead?'Verify native-zero plain-salt composition without inventing a pinch mass; audit all other positive CHO.':quantityLead?'Check existing food-specific reference portions and the exact original quantity; no copied variant mass.':state==='NO_RELIABLE_SOURCE_FOUND'?'Use the pinned earlier source review; new research requires a concrete new lead.':'Search existing composition/GI indexes and verify product/preparation identity before any calculation.',
   publicationAuthorized:false};
 }).sort((a:any,b:any)=>b.priority.score-a.priority.score||a.recipeId.localeCompare(b.recipeId,'en'));
}
export function currentInventory(root:string){
 const read:Read=p=>readFileSync(resolve(root,p),'utf8'),report=json(read,'tmp/nutrition/glycemic-load-pilot.json');
 const inputs=json(read,'docs/nutrition/glycemic-load-pilot-input.json').recipes,foods=json(read,'docs/nutrition/food-records.json'),gis=json(read,'docs/nutrition/glycemic-index-records.json').records;
 const aliases=json(read,'docs/nutrition/glycemic-load-recipe-aliases.json').aliases;
 const originals:Record<string,any>={};
 for(const path of walk(root)){const text=read(path),parsed=parseMarkdown(text);if(parsed?.data.status==='published')originals[String(parsed.data.recipe_id)]={path,text,ingredients:parsed.data.ingredients,servings:parsed.data.servings};}
 if(Object.keys(originals).length!==326||report.results.length!==326||inputs.length!==326)throw Error('Incomplete original corpus');
 for(const input of inputs){const id=input.recipeId;
  if(glycemicLoadInputHash(input)!==report.calculationInputHashes[id]||glycemicLoadEvidenceHash(input,foods,gis)!==report.calculationEvidenceHashes[id]||recipeBindingHash(originals[id].text,aliases)!==report.sourceHashes[id])throw Error('Stale live audit; rerun audit:glycemic-load: '+id);
 }
 const context={verifiedPortionLeads:json(read,folder+'cases.json').cases.filter((c:any)=>c.hasVerifiedReferencePortion).map((c:any)=>c.recipeId),priorGiDecisions:json(read,'docs/nutrition/gk-legacy-reconciliation/source-review.json').giDecisions};
 const queue=rankOriginalGaps(report,inputs,originals,context),numeric=report.results.length-queue.length,target=Math.ceil(.8*report.results.length);
 return {schemaVersion:1,kind:'CURRENT_ORIGINAL_GAP_TRIAGE',counts:{total:326,originalNumeric:numeric,originalMissing:queue.length,oneBlocker:queue.filter((r:any)=>r.blockerCount===1).length,target,targetGap:Math.max(0,target-numeric)},queue,publicationAuthorized:false};
}
function recordAt(read:Read,path:string,kind:string,id:string){
 const file=json(read,path),records=Array.isArray(file)?file:kind==='GI'?file.records:file.foods;
 const found=records.filter((r:any)=>String(kind==='NATIVE'?r.source_id:r.id)===id);
 if(found.length!==1)throw Error('Missing or ambiguous scoped record: '+id);
 return found[0];
}
export function verifyScope(c:any,read:Read){
 if(c.ownerApproval!==false||c.publicationAuthorized!==false||c.scientificApproval!==false)throw Error('Research capsule cannot grant approval');
 if(textHash(read(c.recipePath))!==c.recipeSha256Lf)throw Error('Original recipe changed: '+c.recipeId);
 const all=json(read,'docs/nutrition/glycemic-load-pilot-input.json').recipes;
 const matches=all.filter((i:any)=>i.recipeId===c.recipeId);
 if(matches.length!==1||digest(matches[0])!==c.inputSha256)throw Error('Scoped input changed: '+c.recipeId);
 for(const item of c.sourceRecords)if(digest(recordAt(read,item.path,item.kind,item.id))!==item.sha256)throw Error('Scoped source changed: '+item.id);
 for(const [p,hash] of Object.entries(c.methodFiles))if(textHash(read(p))!==hash)throw Error('Calculation method changed: '+p);
 for(const [p,hash] of Object.entries(c.boundTextFiles??{}))if(textHash(read(p))!==hash)throw Error('Scoped supporting text changed: '+p);
 const decisions=json(read,'docs/nutrition/gk-legacy-reconciliation/source-review.json').giDecisions.filter((d:any)=>d.recipeId===c.recipeId);
 if(digest(decisions)!==c.previousGiDecisionsSha256)throw Error('Prior scoped GI review changed');
 return {input:structuredClone(matches[0]),decisions};
}
export function replayCase(c:any,read:Read){
 const {input,decisions}=verifyScope(c,read);
 const original=parseMarkdown(read(c.recipePath))!.data;
 if(input.servings!==original.servings||input.ingredients.length!==(original.ingredients as any[]).length)throw Error('Original serving or ingredient accounting mismatch');
 for(const patch of c.patches){
  const row=input.ingredients[patch.index];if(!row||row.name!==patch.name)throw Error('Candidate ingredient identity changed');
  const allowed=patch.kind==='NATIVE_ZERO_SALT'?['estimatedAvailableCarbohydratePerServingG','negligibleAssumption','massEvidence','excludedReason']:patch.kind==='REFERENCE_PORTION'?['grams','massEvidence','estimatedAvailableCarbohydratePerServingG','negligibleAssumption']:[];
  if(!allowed.length||Object.keys(patch.changes).some(k=>!allowed.includes(k)))throw Error('Unsupported research patch');
  if(patch.kind==='NATIVE_ZERO_SALT'){
   if(row.name!=='ripaus suolaa'||row.grams!==null||patch.changes.grams!==undefined||patch.changes.estimatedAvailableCarbohydratePerServingG!==0)throw Error('Native zero is limited to unchanged plain salt, not a guessed quantity or mixture');
   const native=c.sourceRecords.filter((s:any)=>s.kind==='NATIVE'&&s.purpose==='PLAIN_SALT');
   if(native.length<2||!native.every((s:any)=>{const r=recordAt(read,s.path,s.kind,s.id);return r.per100g?.available_carbohydrate_g_per_100g===0&&r.per100g?.polyols_g_per_100g===0;}))throw Error('Plain salt native-zero evidence missing');
  }
  Object.assign(row,patch.changes);
  if(patch.kind==='REFERENCE_PORTION'&&(!Number.isFinite(row.grams)||row.grams<=0))throw Error('Invalid reference portion');
  if(patch.kind==='REFERENCE_PORTION'&&row.excludedReason&&row.estimatedAvailableCarbohydratePerServingG>0){
   const food=json(read,'docs/nutrition/food-records.json').find((f:any)=>f.id===row.fineliRecordId);
   const available=food?normalizeCarbohydrate(food).available:null;
   if(available===null||Math.abs(row.estimatedAvailableCarbohydratePerServingG-row.grams*available/(100*input.servings))>1e-10)throw Error('Stale omission after portion correction');
  }
 }
 for(const decision of decisions.filter((d:any)=>d.action==='WITHDRAW_GI_FROM_REVIEW_CANDIDATE'))for(const row of input.ingredients)if(row.name===decision.ingredient&&row.giRecordId===decision.giRecordId){row.giRecordId=null;row.giMatchEvidence='Prior review still withholds this GI from new candidates: '+decision.rationale;}
 const foods=json(read,'docs/nutrition/food-records.json'),gis=json(read,'docs/nutrition/glycemic-index-records.json').records;
 const result=calculateGlycemicLoad(input,foods,gis);
 if(c.numericOriginalCandidate&&(result.status!=='CALCULATED'||(result.glycemicLoadPerServing===0&&result.omittedAvailableCarbohydratePerServingG>0)))throw Error('An all-omitted arithmetic zero is not a reliable new original total');
 if(digest(result)!==c.expectedResultSha256)throw Error('Candidate calculation/evidence changed');
 return {input,result};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=resolve(import.meta.dirname,'../..'),read:Read=p=>readFileSync(resolve(root,p),'utf8');
 const inventory=currentInventory(root),manifest=json(read,folder+'cases.json');
 const cases=manifest.cases.map((entry:any)=>{const raw=read(entry.path);if(textHash(raw)!==entry.sha256Lf)throw Error('Research capsule changed');const c=JSON.parse(raw);const {result}=replayCase(c,read);return {recipeId:c.recipeId,status:result.status,modelPoint:result.glycemicLoadPerServing,omittedCho:result.omittedAvailableCarbohydratePerServingG,numericOriginalCandidate:c.numericOriginalCandidate,scientificApproval:false,publicationAuthorized:false};});
 mkdirSync(resolve(root,'tmp/nutrition'),{recursive:true});writeFileSync(resolve(root,'tmp/nutrition/gk-original-solutions-batch02.json'),JSON.stringify({inventory,cases},null,2)+'\n');console.log(JSON.stringify({counts:inventory.counts,cases,publicationAuthorized:false}));
}
