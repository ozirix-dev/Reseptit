/** Conditional source-HOLD audit only. ROOT DATA CACHE EXTERNAL_OUT. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [ra,da,ca,oa]=process.argv.slice(2);if(!oa)throw Error('ROOT DATA CACHE EXTERNAL_OUT');
const root=resolve(ra),data=resolve(da),cache=resolve(ca),out=resolve(oa);
let parent=out;while(!existsSync(parent))parent=dirname(parent);
let inside=false;try{inside=execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true';}catch{}if(inside)throw Error('External output required');
const sha=(b:any)=>createHash('sha256').update(b).digest('hex'),lf=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),read=(p:string)=>JSON.parse(lf(p));
const s=read(join(data,'sources.json')),pack=read(join(data,'cases.json'));if(s.activation||pack.activation||pack.ownerApproval)throw Error('Closed profile');
for(const [p,h] of Object.entries(s.sourceFilesLfSha256))if(sha(lf(join(root,p)))!==h)throw Error('Source seal '+p);
for(const a of s.externalObservations)if(a.rawFile&&sha(readFileSync(join(cache,a.rawFile)))!==a.rawSha256)throw Error('Original external seal '+a.id);
const gi=read(join(root,'docs/nutrition/glycemic-index-records.json')).records.find((g:any)=>g.id===s.giBinding.nativeId);
if(gi?.gi!==40||gi.evidenceKind!=='PUBLISHED_IMPUTATION')throw Error('Existing PI40 binding');
const values=new Map<string,number>();
for(const c of s.composition){
 let value;
 if(c.kind==='FINELI_NATIVE_POINT'){const a=read(join(root,'docs/nutrition/fineli-release-20-reference.json')).foods.find((a:any)=>a.source_id===c.nativeId);value=a.per100g.available_carbohydrate_g_per_100g;if(a.name!==c.name)throw Error('Name');}
 else if(c.kind==='AFCD_NATIVE_POINT'){const a=read(join(root,'docs/nutrition/afcd-release-3-reference.json')).foods.find((a:any)=>a.source_id===c.nativeId);value=a[c.nativeField];if(a.name!==c.name)throw Error('Name');}
 else {const a=read(join(root,'docs/nutrition/food-records.json')).find((a:any)=>a.id===c.nativeId);if(!a.polyolsSourceVerified||a.per100g.carbohydrate!==100||a.per100g.polyols!==100)throw Error('Explicit zero');value=0;}
 if(value===null||value!==c.availablePer100g)throw Error('Native value');values.set(c.id,value);
}
const cap=(id:string,grams:number)=>{const a=s.externalObservations.find((a:any)=>a.id===id);if(!a||!a.basis.startsWith('per100g'))throw Error('Cap unit mismatch');return grams*(a.totalCarbohydrate??a.declaredCarbohydrate)/100;};
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
const results=[];
for(const c of pack.cases){
 const {inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256)throw Error('Input seal');if(c.sourceQualified||c.ownerApproval||c.publicationAuthorized)throw Error('HOLD authority');
 for(const [loc,p] of Object.entries(c.paths))if(sha(lf(join(root,p as string)))!==c.recipeSha256Lf[loc])throw Error('Recipe seal '+loc);
 const foods=[],ingredients=[];
 for(const i of c.ingredients){const o=c.originalIngredients[i.originalIndex];if(i.originalIndex===6?(i.sourceId!=='RED_BOAT_4113'||i.grams!==null||i.millilitres!==15):(o.unit!=='g'||i.grams!==o.amount))throw Error('Original gram amount changed');
  if(values.has(i.sourceId)){const v=values.get(i.sourceId);foods.push({id:i.sourceId,name:i.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',sourceUrl:'native:'+i.sourceId,retrievedAt:'2026-11-02',licence:'Native source',state:'Exact reviewed source application pending',per100g:{carbohydrate:v}});if(i.giId&&!s.giBinding.allowedCompositionIds.includes(i.sourceId))throw Error('GI scope');ingredients.push({name:i.name,grams:i.grams,fineliRecordId:i.sourceId,giRecordId:i.giId,foodKey:i.giId?gi.foodKey:undefined,preparationKey:i.giId?gi.preparationKey:undefined,massEvidence:'Original weighed recipe grams',giMatchEvidence:c.preparationDecision});}
  else {if(i.giId)throw Error('Cap cannot receive GI');ingredients.push({name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,excludedReason:'Positive nominal carbohydrate upper; source-HOLD scenario only',availableCarbohydrateUpperBoundPerServingG:(i.sourceId==='RED_BOAT_4113' ? i.millilitres * s.externalObservations.find((a:any)=>a.id===i.sourceId&&a.basis==='per100ml').declaredCarbohydrate/100 : cap(i.sourceId,i.grams))/c.servings,upperBoundEvidence:i.sourceId,negligibleAssumption:'Conditional nominal-source bound, never available point'});}
 }
 const input={recipeId:c.recipeId,servings:c.servings,ingredients};const v=calculateGlycemicLoad(input,foods,[gi]);if(v.status!=='CALCULATED')throw Error(JSON.stringify(v.blockers));
 results.push({recipeId:c.recipeId,inputSha256,classification:c.classification,conditionalArithmeticStatus:v.status,calculatedGkPart:v.glycemicLoadPerServing,unrounded:v.unroundedGlycemicLoadPerServing,omittedCho:v.omittedAvailableCarbohydratePerServingG,nominalUpperOmittedCho:v.omittedAvailableCarbohydrateUpperBoundPerServingG,sourceQualified:false,ownerApproved:false,publicationAuthorized:false});
}
mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify({activation:false,results},null,2)+'\n');console.log(JSON.stringify(results));
