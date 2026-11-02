/** Closed research. ROOT DATA CACHE EXTERNAL_OUT; current A, existing B arithmetic, two unapproved profiles. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [ra,da,ca,oa]=process.argv.slice(2);if(!oa)throw Error('ROOT DATA CACHE EXTERNAL_OUT');
const root=resolve(ra),data=resolve(da),cache=resolve(ca),out=resolve(oa);let parent=out;while(!existsSync(parent))parent=dirname(parent);
let inside=false;try{inside=execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true';}catch{}if(inside)throw Error('External output required');
const sha=(b:any)=>createHash('sha256').update(b).digest('hex'),lf=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),read=(p:string)=>JSON.parse(lf(p));
const s=read(join(data,'sources.json')),pack=read(join(data,'cases.json'));if(s.activation||s.ownerApproval||pack.activation||pack.ownerApproval)throw Error('Research profile must remain closed');
for(const [p,h] of Object.entries(s.sourceFilesLfSha256))if(sha(lf(join(root,p)))!==h)throw Error('Native source seal '+p);
for(const a of s.externalObservations)if(a.rawFile&&sha(readFileSync(join(cache,a.rawFile)))!==a.rawSha256)throw Error('Raw source seal '+a.id);
const contract=s.authoritativeBContract;const originalGiText=execFileSync('git',['show',contract.mainHead+':'+contract.giPath],{cwd:root,encoding:'utf8'}).replaceAll('\r\n','\n');if(sha(originalGiText)!==contract.giFileLfSha256)throw Error('Approved B source snapshot');
const originalB=JSON.parse(originalGiText).records;
const nativeGi=read(join(root,'docs/nutrition/glycemic-index-records.json')).records;
for(const g of s.gi){
 if(g.nativeId&&g.kind!=='PROPOSED_B_CODING'){const a=nativeGi.find((a:any)=>a.id===g.nativeId);if(!a||a.gi!==g.values[0]||a.calculationUse==='REFERENCE_ONLY'||a.matchKind==='CATEGORY_MEAN')throw Error('Existing GI source '+g.id);}
 else if(g.kind==='PROPOSED_B_CODING'){const a=originalB.find((a:any)=>a.id===g.id);if(!a||JSON.stringify(a.values)!==JSON.stringify(g.values)||!['plant50','trace50'].includes(g.id))throw Error('Existing B coding');}
 else if(g.id==='kidney36'){const a=s.externalObservations.find((a:any)=>a.id==='kidney36-2021');if(g.values[0]!==a.gi||a.item!==1290||a.semUsedAsRecipeInterval)throw Error('Kidney GI provenance');}
 else if(g.kind==='SOURCE_EXPERT_ESTIMATE'){const a=s.externalObservations.find((a:any)=>a.id==='pb-expert18');if(g.values[0]!==a.expertEstimatedGi||g.humanMeasured!==false||g.currentContractAdmitted!==false||a.humanMeasured!==false)throw Error('Expert estimate cannot become human GI');}
 else throw Error('Unsupported source kind');
}
for(const c of s.composition){
 if(c.kind==='LABEL_CARBOHYDRATE_UPPER'){const a=s.externalObservations.find((a:any)=>a.id===c.sourceObservationId);if(a.availablePoint!==null||a.polyols!==null||a.declaredCarbohydrate!==c.availablePer100g||a.basis!=='per100g-as-sold')throw Error('Label is upper only');continue;}
 const f=read(join(root,c.kind==='FINELI_CHOAVL'?'docs/nutrition/fineli-release-20-reference.json':'docs/nutrition/afcd-release-3-reference.json')).foods.find((a:any)=>a.source_id===c.nativeId);
 const v=c.nativeField.split('.').reduce((a:any,k:string)=>a?.[k],f);
 if(!f||v===null||v!==c.availablePer100g)throw Error('Native available field '+c.id);
 if(c.portionMasses&&JSON.stringify(c.portionMasses)!==JSON.stringify(f.portion_mass_g))throw Error('Native quantity seal');
}
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
const {evaluateMinorOmissions}=await import(pathToFileURL(join(root,'docs/research/afcd-polyol-03/minor-omission-model.mts')).href);
const giRecord=(g:any)=>g.nativeId&&g.kind!=='PROPOSED_B_CODING'?nativeGi.find((a:any)=>a.id===g.nativeId):{id:g.id,gi:g.values[0],foodKey:g.id,preparationKey:g.id,food:g.id,preparation:g.locator,qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:g.kind==='NAMED_HUMAN_GI'?'HUMAN_GI':'PUBLISHED_IMPUTATION',source:{title:g.kind+': '+g.locator,url:g.sourceUrl,table:g.locator,year:g.id==='peanutExpert18'?2026:2021,published:true,iso26642Confirmed:false,qualityEvidence:g.limitation},note:g.limitation};
function calculate(c:any,comps:any[],gis:any[],strict=false,expertResearch=false){
 const blockers:string[]=[],contributions:any[]=[],foods:any[]=[],ingredients:any[]=[],records:any[]=[];let trace=0;
 for(const i of c.candidateIngredients){const f=comps.find(f=>f.id===i.compositionId),g=gis.find(g=>g.id===i.giId);if(!f||!Number.isFinite(i.grams)||i.grams<0){blockers.push('UNKNOWN_SOURCE_OR_MASS');continue;}const cho=i.grams*f.availablePer100g/100/c.servings,isCap=i.carbohydrateUse==='UPPER_BOUND';
  if(g&&!g.allowedCompositionIds.includes(f.id))blockers.push('UNREVIEWED_GI_SOURCE_BINDING');
  if(c.level==='A'&&g&&(g.kind==='PROPOSED_B_CODING'||g.kind==='SOURCE_EXPERT_ESTIMATE'))blockers.push('NEW_B_CODE_NOT_ALLOWED_IN_A');
  if(g?.kind==='SOURCE_EXPERT_ESTIMATE'&&!expertResearch)blockers.push('EXPERT_ESTIMATE_TYPE_NOT_ADMITTED_IN_CURRENT_CONTRACT');
  if(g?.id==='plant50'&&(c.level!=='B'||f.id!=='F29014'||f.availablePer100g>5))blockers.push('PLANT_SCOPE');
  if(g?.id==='trace50'){trace+=cho;if(cho>.5||c.level!=='B')blockers.push('TRACE_SCOPE');}
  if(strict&&cho>0&&!g)blockers.push('UNRESOLVED_POSITIVE_GI: '+i.name);
  if(isCap&&f.kind!=='LABEL_CARBOHYDRATE_UPPER')blockers.push('UNKNOWN_CAP');
  if(f.kind==='LABEL_CARBOHYDRATE_UPPER'&&!isCap)blockers.push('LABEL_CAP_NOT_POINT');
  contributions.push({name:i.name,choMin:isCap?0:cho,choMax:cho,gkMin:g?cho*g.values[0]/100:null,gkMax:g?cho*g.values[0]/100:null,giId:i.giId});
  if(isCap){if(g)blockers.push('NO_GI_ASSIGNED_TO_UNKNOWN_AVAILABLE_CAP');ingredients.push({name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,excludedReason:'Nominal label upper, positive unknownGI',availableCarbohydrateUpperBoundPerServingG:cho,upperBoundEvidence:i.note,negligibleAssumption:i.note});}
  else {foods.push({id:f.id,name:f.name,sourceUrl:'native:'+f.id,retrievedAt:'2026-11-02',licence:'See source catalog',state:'Exact input version review pending',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.availablePer100g}});const gr=g?giRecord(g):null;if(gr&&!records.some(a=>a.id===gr.id))records.push(gr);ingredients.push({name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:gr?.id??null,foodKey:gr?.foodKey,preparationKey:gr?.preparationKey,massEvidence:i.note,giMatchEvidence:c.preparationDecision});}
 }
 if(trace>1)blockers.push('TRACE_TOTAL_EXCEEDS1');
 const calc=calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,records);blockers.push(...calc.blockers);
 return {recipeId:c.recipeId,level:c.level,numericProposal:!blockers.length&&calc.status==='CALCULATED',publicationAuthorized:false,point:blockers.length?null:calc.glycemicLoadPerServing,unrounded:blockers.length?null:calc.unroundedGlycemicLoadPerServing,omittedCho:calc.omittedAvailableCarbohydratePerServingG,unknownGiCho:0,contributions,blockers};
}
const results=[];
for(const c of pack.cases){const {inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256||c.approval!==false||c.publicationAuthorized!==false||c.servings!==4)throw Error('Case authority/hash');
 for(const [loc,p] of Object.entries(c.paths))if(sha(lf(join(root,p as string)))!==c.recipeSha256[loc])throw Error('Recipe seal');
 for(const i of c.candidateIngredients){const o=c.originalIngredients[i.originalIndex];if(o.unit==='g'&&i.grams!==o.amount)throw Error('Original grams changed '+i.name);if(i.grams===0&&!i.note.startsWith('ZERO_CHO_SENTINEL_RETAIN_ORIGINAL'))throw Error('Missing zero-CHO quantity policy');}
 const strict=calculate(c,s.composition,s.gi,c.level==='B',false);
 const selected=c.profile==='NEW_B_MINOR_OMISSIONS'?evaluateMinorOmissions(c,s.composition,s.gi,(a:any,fs:any[],gs:any[])=>calculate(a,fs,gs,true,false)):c.profile==='NEW_EXPERT_ESTIMATE_B_REFERENCE'?calculate(c,s.composition,s.gi,true,true):strict;
 if(!selected.numericProposal)throw Error(c.recipeId+': '+selected.blockers.join(';'));
 if(c.level==='B'&&strict.numericProposal)throw Error('Unapproved B method unexpectedly admitted');
 if(c.recipeId==='sate-ayam'){const no=structuredClone(c);no.candidateIngredients.find((i:any)=>i.giId==='peanutExpert18').giId=null;if(calculate(no,s.composition,s.gi,true,true).numericProposal)throw Error('Positive peanutGI cannot be omitted');}
 const coded=selected.contributions.filter((i:any)=>['plant50','trace50','peanutExpert18'].includes(i.giId)),codedCho=coded.reduce((t:number,i:any)=>t+i.choMax,0),codedGk=coded.reduce((t:number,i:any)=>t+(i.gkMax??0),0);
 results.push({recipeId:c.recipeId,inputSha256,profile:c.profile,level:c.level,numericArithmeticProposal:true,currentContractArithmeticPass:strict.numericProposal,point:selected.point,unrounded:selected.unrounded,omittedCho:selected.omittedCho,currentContractBlockers:strict.blockers,sourceQualifiedForOwnerReview:c.level==='A',newMethodApprovalRequired:c.level==='B',ownerApproved:false,publicationAuthorized:false,contributions:selected.contributions,editorialGiReferenceContributions:coded.map((i:any)=>({giId:i.giId,cho:i.choMax,gk:i.gkMax})),assumptionSensitivityOnly:codedCho||selected.omittedCho?{gi:[0,150],min:selected.unrounded-codedGk,max:selected.unrounded-codedGk+1.5*(codedCho+selected.omittedCho),isSourceBound:false,isBiologicalBound:false,isConfidenceInterval:false}:null});
}
mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify({activation:false,ownerApproval:false,results},null,2)+'\n');console.log(JSON.stringify(results.map(({contributions,...x}:any)=>x)));
