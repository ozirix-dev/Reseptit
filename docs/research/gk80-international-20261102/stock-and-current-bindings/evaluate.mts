import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const hash=(b:any)=>createHash('sha256').update(b).digest('hex');
const manifest=read(path.join(dir,'source-manifest.json'));
for(const [rel,sha] of Object.entries(manifest.sourceLfSha256))if(hash(readFileSync(path.join(root,rel),'utf8').replace(/\r\n/g,'\n'))!==sha)throw Error('BASELINE_CHANGED '+rel);
const catalog=read(path.join(dir,'source-catalog.json'));
const foods=Object.values(catalog.foods);
const gi=Object.values(catalog.existingGiCards);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const rows=[];
for(const filename of ['paella-named-stock-version.json','kongjuk-current-water-version.json']){
 const bundle=read(path.join(dir,filename));
 if(hash(readFileSync(path.join(root,bundle.sourcePath),'utf8').replace(/\r\n/g,'\n'))!==bundle.sourceLfSha256)throw Error('RECIPE_CHANGED');
 const input={recipeId:bundle.recipeId,servings:bundle.servings,ingredients:structuredClone(bundle.ingredients)};
 const result=calculateGlycemicLoad(input,foods,gi);
 if(result.status!=='CALCULATED')throw Error('BLOCKED '+JSON.stringify(result.blockers));
 if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(bundle.expected.unroundedGk))>1e-11)throw Error('GK_EXPECTATION');
 if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(bundle.expected.omittedChoUpperG??bundle.expected.omittedChoG))>1e-11)throw Error('OMISSION_EXPECTATION');
 const controls:any[]=[];
 const reject=(label:string,change:(x:any)=>void)=>{
  const altered=structuredClone(input);change(altered);
  const check=calculateGlycemicLoad(altered,foods,gi);
  if(check.status!=='INSUFFICIENT SOURCE DATA')throw Error('INVALID_GENERALIZATION_ALLOWED '+label);
  controls.push({label,status:check.status,blockers:check.blockers});
 };
 if(filename.startsWith('paella')){
  reject('Unknown stock is not zero or named Knorr',x=>{const i=x.ingredients[4];delete i.availableCarbohydrateUpperBoundPerServingG;delete i.upperBoundEvidence;});
  reject('Double-strength16g/L stock exceeds individual1g cap',x=>{x.ingredients[4].availableCarbohydrateUpperBoundPerServingG=1.64;});
  reject('Missing paprika mass cannot use whole-mass bound',x=>{const i=x.ingredients[5];i.grams=null;delete i.availableCarbohydrateUpperBoundPerServingG;delete i.upperBoundEvidence;});
  reject('Unweighed rosemary infusion is not the omitted optional branch',x=>{const i=x.ingredients[9];i.grams=null;delete i.estimatedAvailableCarbohydratePerServingG;delete i.negligibleAssumption;});
 }else{
  reject('Replacing current plain water with unspecified broth remains unsupported',x=>{x.ingredients[4]={name:'unsupported broth alternative, not current water',grams:null,fineliRecordId:null,giRecordId:null,excludedReason:'Alternative stock composition unknown, not assigned zero.'};});
 }
 rows.push({recipeId:bundle.recipeId,variant:bundle.variant,researchStatus:bundle.researchStatus,sourceLfSha256:bundle.sourceLfSha256,allSourceRowsRepresented:input.ingredients.length===bundle.originalIngredientCount,result,negativeControls:controls,sourceApplicationApproved:false,publicationApproved:false,newPublishedValue:false,macroPublicationAuthorized:false});
}
console.log(JSON.stringify({mechanicalModelOnly:true,policyChangeApplied:false,productionWrites:false,results:rows},null,2));
