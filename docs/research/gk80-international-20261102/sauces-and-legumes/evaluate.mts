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
const catalog=read(path.join(dir,'source-catalog.json'));
const foods=Object.values(catalog.foods), gis=Object.values(catalog.existingGiCards);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const rows=[];
for(const filename of ['falafel-current-oven-version.json','okonomiyaki-named-sauces-version.json']){
 const b=read(path.join(dir,filename));
 const input={recipeId:b.recipeId,servings:b.servings,ingredients:b.ingredients};
 const result=calculateGlycemicLoad(input,foods,gis);
 if(result.status!=='CALCULATED')throw Error('BLOCKED '+JSON.stringify(result.blockers));
 if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.unroundedGk))>1e-10)throw Error('DECIMAL_GK_MISMATCH');
 if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoUpperG))>1e-10)throw Error('DECIMAL_OMISSION_MISMATCH');
 const controls=[];
 const reject=(label:string,mutate:(x:any)=>void)=>{
  const altered=structuredClone(input);mutate(altered);
  const r=calculateGlycemicLoad(altered,foods,gis);
  if(r.status!=='INSUFFICIENT SOURCE DATA')throw Error('UNSAFE_GENERALIZATION '+label);
  controls.push({label,status:r.status,blockers:r.blockers});
 };
 if(b.recipeId==='falafel'){
  reject('Unspecified baking-powder mass blocks instead of becomingzero',x=>x.ingredients[7].grams=null);
  reject('A100g onion instead of source55g exceeds individual1g omission cap',x=>x.ingredients[1].grams=100);
  reject('Unspecified dry chickpea composition blocks',x=>x.ingredients[0].fineliRecordId=null);
 }else{
  reject('Unbranded sriracha cannot inherit Encona label',x=>{delete x.ingredients[7].availableCarbohydrateUpperBoundPerServingG;delete x.ingredients[7].upperBoundEvidence;});
  reject('Poppamies19g/100ml version fails cumulative2g cap',x=>{x.ingredients[7].availableCarbohydrateUpperBoundPerServingG=19*15/100/4;});
  reject('Unknown spring-onion quantity blocks',x=>x.ingredients[4].grams=null);
 }
 rows.push({recipeId:b.recipeId,researchStatus:b.researchStatus,result,negativeControls:controls,
  allCurrentRowsRepresented:b.originalIngredientCount===input.ingredients.length,
  sourceApplicationApproved:false,publicationApproved:false,newPublishedValue:false});
}
console.log(JSON.stringify({mechanicalModelOnly:true,newGiSources:0,newMethodRules:0,results:rows},null,2));
