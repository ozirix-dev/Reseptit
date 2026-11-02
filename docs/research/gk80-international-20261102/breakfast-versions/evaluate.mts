import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const sha=(v:any)=>createHash('sha256').update(v).digest('hex');
const manifest=read(path.join(dir,'source-manifest.json'));
for(const [rel,hash] of Object.entries(manifest.sourceHashes))if(sha(readFileSync(path.join(root,rel)))!==hash)throw Error('BASELINE_CHANGED '+rel);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const records=read(path.join(root,'docs/nutrition/glycemic-index-records.json')).records;
const allResults=[];
for(const filename of ['pistachio-yogurt-named-version.json','chia-unsweetened-version.json']){
 const b=read(path.join(dir,filename));
 if(sha(readFileSync(path.join(root,b.sourcePath),'utf8').replace(/\r\n/g,'\n'))!==b.sourceLfSha256)throw Error('RECIPE_CHANGED');
 const input={recipeId:b.recipeId,servings:b.servings,ingredients:structuredClone(b.rows.map((r:any)=>r.input))};
 const foods=b.rows.filter((r:any)=>r.food).map((r:any)=>r.food);
 const result=calculateGlycemicLoad(input,foods,records);
 if(result.status!=='CALCULATED')throw Error(JSON.stringify(result.blockers));
 if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.unroundedGk))>1e-12)throw Error('GK_EXPECTATION_MISMATCH');
 if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoG))>1e-12)throw Error('OMISSION_EXPECTATION_MISMATCH');
 const counterfactual=structuredClone(input);
 const last=counterfactual.ingredients.find((r:any)=>r.name===(filename.startsWith('chia')?'makeutusainetta maun mukaan':'ruusuvesi'));
 delete last.estimatedAvailableCarbohydratePerServingG; delete last.negligibleAssumption;
 last.grams=null;last.recipeQuantity=filename.startsWith('chia')?undefined:{amount:5,unit:'ml',massGrams:null};
 last.excludedReason='Unspecified product or optional branch not selected: no zero is allowed.';
 const unresolved=calculateGlycemicLoad(counterfactual,foods,records);
 if(unresolved.status!=='INSUFFICIENT SOURCE DATA')throw Error('UNKNOWN_WAS_TREATED_AS_ZERO');
 let finnishNamesOnly:any=null;
 if(filename.startsWith('chia')){
  const untranslated=structuredClone(foods);
  for(const f of untranslated)if(f.sourceOriginalName)f.name=f.sourceOriginalName;
  const literal=calculateGlycemicLoad(input,untranslated,records);
  if(literal.status!=='INSUFFICIENT SOURCE DATA'||literal.blockers.length!==2)throw Error('IDENTITY_CAUSE_NOT_REPRODUCED');
  finnishNamesOnly={status:literal.status,blockers:literal.blockers,scientificMeaning:'Literal family-recognition defect only. Same food IDs, nutrient values and raw berry identities; full source-backed aliases are in input bundle.'};
 }
 allResults.push({recipeId:b.recipeId,variant:b.variant,...(b.role?{role:b.role,countedAsOwnNewRecipeCandidate:false}:{}),allSourceRowsRepresented:input.ingredients.length===b.sourceIngredientCount,sourceLfSha256:b.sourceLfSha256,result,unknownProductOrUnselectedBranchCounterfactual:{status:unresolved.status,blockers:unresolved.blockers},finnishNamesOnly,sourceApplicationApproved:false,publicationApproved:false,newPublishedValue:false,macroPublicationAuthorized:false});
}
console.log(JSON.stringify({mechanicalModelOnly:true,policyChangeApplied:false,registryOrRecipeChanges:false,results:allResults},null,2));
