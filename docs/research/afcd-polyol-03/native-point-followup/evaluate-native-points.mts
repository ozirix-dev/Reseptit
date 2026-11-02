/** Research-only generic native-point A checker. ROOT DATA_DIR EXTERNAL_OUT. No active writes. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [ra,da,oa]=process.argv.slice(2);if(!oa)throw Error('ROOT DATA_DIR EXTERNAL_OUT required');
const root=resolve(ra),data=resolve(da),out=resolve(oa);let parent=out;while(!existsSync(parent))parent=dirname(parent);
let gitOut=false;try{gitOut=execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true';}catch{}
if(gitOut)throw Error('Output must be external');
const txt=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),sha=(s:string)=>createHash('sha256').update(s).digest('hex'),read=(p:string)=>JSON.parse(txt(p));
const sources=read(join(data,'sources.json')),pack=read(join(data,'cases.json')),mext=read(join(data,sources.mextFile));
if(sources.activation!==false||pack.activation!==false||pack.ownerApproval!==false)throw Error('Closed research profile required');
for(const [p,h] of Object.entries(sources.sourceFilesLfSha256))if(sha(txt(join(root,p)))!==h)throw Error('Source seal '+p);
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
const {mextAvailableMass}=await import(pathToFileURL(join(root,'docs/research/afcd-polyol-03/mext-available-source.ts')).href);
const unavailableControls=[];
for(const id of ['05040','04063','17009']){let rejected=false;try{mextAvailableMass(mext,id);}catch{rejected=true;}if(!rejected)throw Error('Estimated/missing source accepted '+id);unavailableControls.push(id);}
const nativeGi=read(join(root,'docs/nutrition/glycemic-index-records.json')).records;
const gis=sources.giBindings.map((g:any)=>{const n=nativeGi.find((x:any)=>x.id===g.nativeId);if(n?.gi!==g.value||n.evidenceKind!=='PUBLISHED_IMPUTATION')throw Error('Existing GI binding');return n;});
const values=new Map<string,number>();
for(const f of sources.composition){
 if(f.kind==='MEXT_NATIVE_MASS'){
  const r=mextAvailableMass(mext,f.nativeId);if(r.availablePer100g!==f.availablePer100g)throw Error('MEXT mass mismatch');values.set(f.id,r.availablePer100g);
 }else if(f.kind==='FINELI_NATIVE'||f.kind==='AFCD_NATIVE_COMPARATOR'){
  const n=read(join(root,f.path)).foods.find((x:any)=>x.source_id===f.nativeId),v=f.nativeField.split('.').reduce((o:any,k:string)=>o?.[k],n);
  if(v===null||v!==f.availablePer100g||n.name!==f.name)throw Error('Native field '+f.id);
  if(f.portionMasses&&JSON.stringify(n.portion_mass_g)!==JSON.stringify(f.portionMasses))throw Error('Native portions '+f.id);
  values.set(f.id,v);
 }else if(f.kind==='EXPLICIT_LABEL_DIFFERENCE'){
  const n=read(join(root,f.path)).find((x:any)=>x.id===f.nativeId);
  if(!n?.polyolsSourceVerified||n.per100g.carbohydrate!==100||n.per100g.polyols!==100)throw Error('Explicit erythritol source');values.set(f.id,0);
 }else if(f.kind==='PHYSICAL_MASS_CAP'){if(f.availableUpperPer100g!==100)throw Error('Physical mass cap');}
 else throw Error('Unknown source kind');
}
const results=[];
for(const c of pack.cases){
 const {inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256)throw Error('Input hash');
 if(c.approval!==false||c.publicationAuthorized!==false||c.arithmeticProfile!=='EXISTING_A')throw Error('Case authority');
 for(const [loc,p] of Object.entries(c.paths))if(sha(txt(join(root,p as string)))!==c.recipeSha256Lf[loc])throw Error('Recipe seal '+loc);
 const foods=new Map(),ingredients=[];
 for(const i of c.candidateIngredients){
  const f=sources.composition.find((x:any)=>x.id===i.compositionId);if(!f)throw Error('Missing source');
  const b=sources.giBindings.find((g:any)=>g.id===i.giId),g=gis.find((g:any)=>g.id===b?.nativeId);
  if(i.giId&&(!g||!b.allowedCompositionIds.includes(f.id)))throw Error('GI binding scope');
  if(i.carbohydrateUse==='UPPER_BOUND'){
   if(f.kind!=='PHYSICAL_MASS_CAP'||g)throw Error('Invalid cap');
   ingredients.push({name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,availableCarbohydrateUpperBoundPerServingG:i.grams/c.servings,upperBoundEvidence:i.note,negligibleAssumption:i.note,excludedReason:'Full mass cap, positive unknown GI'});
  }else{
   if(i.grams===0&&!i.note.startsWith('ZERO_CHO_SENTINEL'))throw Error('Unexplained zero mass');
   const v=values.get(f.id);if(v===undefined)throw Error('Unverified point');
   foods.set(f.id,{id:f.id,name:i.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',sourceUrl:'native-source:'+f.id,retrievedAt:'2026-11-02',licence:'See native source',state:'Exact candidate source version',per100g:{carbohydrate:v}});
   ingredients.push({name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:g?.id??null,foodKey:g?.foodKey,preparationKey:g?.preparationKey,massEvidence:i.note,giMatchEvidence:c.preparationDecision});
  }
 }
 const input={recipeId:c.recipeId,servings:c.servings,ingredients};const result=calculateGlycemicLoad(input,[...foods.values()],gis);
 if(result.status!=='CALCULATED')throw Error(JSON.stringify(result.blockers));
 // Exact old generic almond meal is a different source, not a second endpoint.
 const oldFoods=new Map(foods);oldFoods.set('MEXT05001',{...oldFoods.get('MEXT05001'),per100g:{carbohydrate:values.get('F006077')}});
 const comparator=calculateGlycemicLoad(input,[...oldFoods.values()],gis);if(comparator.status!=='INSUFFICIENT SOURCE DATA')throw Error('Old5.4 reference should still fail strict ingredient gate');
 results.push({recipeId:c.recipeId,inputSha256,status:result.status,point:result.glycemicLoadPerServing,unrounded:result.unroundedGlycemicLoadPerServing,omittedCho:result.omittedAvailableCarbohydratePerServingG,ownerApproval:false,publicationAuthorized:false,comparator:{nativeId:'AFCD-F006077',status:comparator.status,almondChoPerServing:150*5.4/100/8,blockers:comparator.blockers}});
}
mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify({activation:false,results,unavailableMextControlsRejected:unavailableControls},null,2)+'\n');console.log(JSON.stringify(results));
