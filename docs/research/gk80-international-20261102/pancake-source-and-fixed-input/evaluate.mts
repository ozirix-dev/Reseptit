import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const hash=(s:string)=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const manifest=read(path.join(dir,'source-manifest.json'));
for(const [rel,sha] of Object.entries(manifest.sourceLfSha256))if(hash(readFileSync(path.join(root,rel),'utf8'))!==sha)throw Error('BASELINE_CHANGED '+rel);
const c=read(path.join(dir,'source-catalog.json'));
const b=read(path.join(dir,'honey-mustard-chicken-fixed-input-proposal.json'));
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const input={recipeId:b.recipeId,servings:b.servings,ingredients:b.ingredients};
const foods=Object.values(c.foods),gis=Object.values(c.existingGiCards);
const result=calculateGlycemicLoad(input,foods,gis);
if(result.status!=='CALCULATED')throw Error('BLOCKED '+JSON.stringify(result.blockers));
if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.unroundedGk))>1e-10)throw Error('GK_MISMATCH');
if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoUpperG))>1e-10)throw Error('OMISSION_MISMATCH');
const controls=[];
function reject(label:string,mutate:(x:any)=>void){
 const x=structuredClone(input);mutate(x);const r=calculateGlycemicLoad(x,foods,gis);
 if(r.status!=='INSUFFICIENT SOURCE DATA')throw Error('INVALID_GENERALIZATION '+label);
 controls.push({label,status:r.status,blockers:r.blockers});
}
reject('Original unquantified pepper remains HOLD',x=>x.ingredients[7].grams=null);
reject('Unknown Dijon brand cannot inherit Maille label',x=>{delete x.ingredients[2].availableCarbohydrateUpperBoundPerServingG;delete x.ingredients[2].upperBoundEvidence;});
reject('Missing garlic quantity invalidates whole-mass ceiling',x=>{x.ingredients[5].grams=null;delete x.ingredients[5].availableCarbohydrateUpperBoundPerServingG;delete x.ingredients[5].upperBoundEvidence;});
reject('4g garlic whole-mass ceiling reaches individual1g threshold',x=>{x.ingredients[5].grams=4;x.ingredients[5].availableCarbohydrateUpperBoundPerServingG=1;});
console.log(JSON.stringify({mechanicalModelOnly:true,actualBatchWeighed:false,currentRecipeApproved:false,newPublishedValue:false,
 proposedFixedVersionRequired:true,recipeId:b.recipeId,result,negativeControls:controls,
 newHumanPancakeSourceApplied:false,newGiRegistryCards:0,newPolicyRules:0},null,2));
