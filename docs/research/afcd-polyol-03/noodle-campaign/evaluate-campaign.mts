/** Read-only local campaign check. node via tsx evaluate-campaign.mts ROOT DATA_DIR EXTERNAL_OUT. */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [rootArg,dataArg,outArg]=process.argv.slice(2);if(!outArg)throw Error('ROOT DATA_DIR EXTERNAL_OUT required');
const root=resolve(rootArg),data=resolve(dataArg),out=resolve(outArg);
let parent=out;while(!existsSync(parent))parent=dirname(parent);
let inGit=false;try{inGit=execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true';}catch{}
if(inGit)throw Error('External output directory required');
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const sha=(s:string)=>createHash('sha256').update(s).digest('hex');
const text=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n');
const sources=read(join(data,'sources.json')),pack=read(join(data,'cases.json'));
if(pack.activation!==false||pack.ownerApproval!==false)throw Error('Research closed');
for(const [p,h] of Object.entries(sources.sourceFilesLfSha256))if(sha(text(join(root,p)))!==h)throw Error('Source seal '+p);
for(const c of sources.composition){
 if(c.kind==='NATIVE_AVAILABLE_POINT'){
  const f=read(join(root,c.sourcePath)).foods.find((f:any)=>f.source_id===c.nativeId);
  const v=c.nativeField.split('.').reduce((o:any,k:string)=>o?.[k],f);
  if(v!==c.availablePer100g||v===null)throw Error('Native source field '+c.id);
 }
 if(c.kind==='EXPLICIT_LABEL_C_MINUS_P'){
  const f=read(join(root,c.sourcePath)).find((f:any)=>f.id===c.nativeId);
  if(!f?.polyolsSourceVerified||f.per100g.carbohydrate!==100||f.per100g.polyols!==100||c.availablePer100g!==0)throw Error('Explicit polyols');
 }
 if(c.kind==='NOMINAL_LABEL_UPPER'){
  const p=sources.products.find((p:any)=>p.id===c.productRef);
  if(c.id==='koro-cap'){
   const raw=execFileSync('git',['show',p.pinnedCommit+':'+p.pinnedPath],{cwd:root}).toString();
   if(sha(raw.replaceAll('\r\n','\n'))!==p.pinnedFileLfSha256)throw Error('Pinned KoRo source');
   const row=JSON.parse(raw).records.find((r:any)=>r.id===p.observation.id);
   if(JSON.stringify(row)!==JSON.stringify(p.observation)||c.availableUpperPer100g!==.1)throw Error('KoRo declaration');
  }else if(p.basisAmount!==100||p.basisUnit!=='g'||p.carbohydrate!==c.availableUpperPer100g)throw Error('Product unit or ceiling');
 }
}
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
const {mextAvailableMass}=await import(pathToFileURL(join(root,'docs/research/afcd-polyol-03/mext-available-source.ts')).href);
const mext=read(join(data,'mext-noodles.json'));
for(const id of ['01047','01048','01050','01051','01056'])mextAvailableMass(mext,id);
let estimatedRejected=false;try{mextAvailableMass(mext,'01041');}catch{estimatedRejected=true;}
if(!estimatedRejected)throw Error('Parenthesized source estimate must be rejected');
const nativeGi=read(join(root,'docs/nutrition/glycemic-index-records.json')).records;
const gi=sources.giBindings.map((b:any)=>{const r=nativeGi.find((r:any)=>r.id===b.nativeId);if(!r||r.gi!==b.value||r.evidenceKind!=='PUBLISHED_IMPUTATION')throw Error('Named existing GI');return r;});
const results=[];
for(const c of pack.cases){
 const {inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256)throw Error('Case input hash');
 for(const [loc,p] of Object.entries(c.paths))if(sha(text(join(root,p as string)))!==c.recipeSha256Lf[loc])throw Error('Recipe changed '+loc);
 if(c.approval!==false||c.publicationAuthorized!==false||c.arithmeticProfile!=='EXISTING_A')throw Error('Unauthorized case');
 const foods:any[]=[],ingredients:any[]=[];
 for(const i of c.candidateIngredients){
  const f=sources.composition.find((f:any)=>f.id===i.compositionId);if(!f)throw Error('Missing composition');
  const binding=sources.giBindings.find((g:any)=>g.id===i.giId),g=gi.find((g:any)=>g.id===binding?.nativeId);
  if(i.giId&&(!g||!binding.allowedCompositionIds.includes(f.id)))throw Error('Unreviewed GI binding');
  if(i.carbohydrateUse==='UPPER_BOUND'){
   if(f.kind!=='NOMINAL_LABEL_UPPER'||g)throw Error('Ceiling is omitted, not point/GI zero');
   ingredients.push({name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,availableCarbohydrateUpperBoundPerServingG:i.grams*f.availableUpperPer100g/100/c.servings,upperBoundEvidence:i.note,negligibleAssumption:i.note,excludedReason:"Documented nominal product ceiling only; not zero"});
  }else{
   if(f.kind==='NOMINAL_LABEL_UPPER')throw Error('Upper used as point');
   foods.push({id:f.id,name:i.name,sourceUrl:'shared-source:'+f.id,retrievedAt:'2026-11-02',licence:'See native source',state:'Original exact recipe use',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.availablePer100g}});
   ingredients.push({name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:g?.id??null,foodKey:g?.foodKey,preparationKey:g?.preparationKey,massEvidence:i.note,giMatchEvidence:c.preparationDecision});
  }
 }
 const input={recipeId:c.recipeId,servings:c.servings,ingredients};const r=calculateGlycemicLoad(input,foods,gi);
 if(r.status!=='CALCULATED'||r.glycemicLoadPerServing!==.73||Math.abs(r.omittedAvailableCarbohydratePerServingG-1.5733)>1e-10)throw Error('Expected current A result not achieved: '+JSON.stringify(r.blockers));
 const comparator=structuredClone(input);const dark=comparator.ingredients[c.candidateIngredients.findIndex((i:any)=>i.compositionId==='yutaka-dark-cap')];dark.availableCarbohydrateUpperBoundPerServingG=15*23.5/100/4;
 const bd=calculateGlycemicLoad(comparator,foods,gi);if(bd.status!=='INSUFFICIENT SOURCE DATA')throw Error('Different sauce collective omission should block');
 results.push({recipeId:c.recipeId,inputSha256,classification:'A',ownerApproval:false,publicationAuthorized:false,status:r.status,point:r.glycemicLoadPerServing,unrounded:r.unroundedGlycemicLoadPerServing,omittedCho:r.omittedAvailableCarbohydratePerServingG,comparator:{product:'blue-dragon-dark-comparator',status:bd.status,omittedCho:bd.omittedAvailableCarbohydratePerServingG,blockers:bd.blockers},ingredients:r.ingredients});
}
mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify({activation:false,results},null,2)+'\n');
console.log(JSON.stringify({cases:results.length,point:results[0].point,omittedCho:results[0].omittedCho,comparatorBlocked:true,mextEstimateRejected:estimatedRejected}));

