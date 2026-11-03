import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.resolve(process.argv[2]);const dir=path.resolve(process.argv[3]??import.meta.dirname);
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const m=read(path.join(dir,'source-manifest.json'));
for(const [p,h] of Object.entries(m.sourceLfSha256))if(createHash('sha256').update(readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n')).digest('hex')!==h)throw Error('SOURCE_CHANGED '+p);
const c=read(path.join(dir,'source-catalog.json'));const foods=Object.values(c.foods);const gis=Object.values(c.existingGiCards);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const results:any[]=[];
for(const filename of ['blueberry-pie-proposal.json','lindstrom-defined-brine-proposal.json']){
 const b=read(path.join(dir,filename));const input={recipeId:b.recipeId,servings:b.servings,ingredients:b.ingredients};
 const ids=input.ingredients.map((x:any)=>x.sourceRowIndex);
 if(b.recipeId==='vhh-mustikkapiirakka'){
  if(JSON.stringify(ids)!=='[0,1,2,3,4,5,6]'||input.ingredients[2].grams!==55||input.ingredients[4].grams!==110)throw Error('EGG_ROW_MAPPING');
 }else if(JSON.stringify(ids)!=='[0,1,2,2,2,3,4,5,6,7,8,8]')throw Error('BRINE_AND_SEASONING_MAPPING');
 const result=calculateGlycemicLoad(input,foods,gis);
 if(result.status!=='CALCULATED'||Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.gk))>1e-10||Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoIncludingCeilingsG))>1e-10)throw Error(JSON.stringify(result));
 const controls:any[]=[];
 const reject=(label:string,change:(x:any)=>void)=>{const x=structuredClone(input);change(x);const r=calculateGlycemicLoad(x,foods,gis);if(r.status!=='INSUFFICIENT SOURCE DATA')throw Error('UNSAFE '+label);controls.push({label,engine:'CURRENT_GK_MODEL',status:r.status,blockers:r.blockers});};
 if(b.recipeId==='vhh-mustikkapiirakka'){
  reject('Generic commercial almondmeal5.4 exceeds single1g cap',x=>x.ingredients[0].fineliRecordId='afcd-F006077');
  reject('Almond154g exceeds single1g cap',x=>x.ingredients[0].grams=154);
  reject('Unknown almond source is not zero',x=>x.ingredients[0].fineliRecordId=null);
  reject('Unweighed vanilla has no5g physical bound',x=>{x.ingredients[6].grams=null;delete x.ingredients[6].availableCarbohydrateUpperBoundPerServingG;delete x.ingredients[6].upperBoundEvidence;});
  const x=structuredClone(input);x.ingredients[2].grams=165;
  if(x.ingredients[2].grams+x.ingredients[4].grams===165)throw Error('DUPLICATE_EGG_CONTROL');
  controls.push({label:'Old275g egg mapping rejected:original1+2eggs total165g',engine:'SOURCE_ROW_QUANTITY_CHECK',status:'REJECTED',actualInvalidEggG:x.ingredients[2].grams+x.ingredients[4].grams,requiredEggG:165});
 }else{
  reject('Brine sugar may not be omitted or zeroed',x=>x.ingredients[2].giRecordId=null);
  reject('Unknown commercial jar liquid is not a defined sugar ingredient',x=>{x.ingredients[2].fineliRecordId=null;x.ingredients[2].giRecordId=null;});
  reject('Unknown Dijon brand cannot inherit Maille label',x=>{delete x.ingredients[7].availableCarbohydrateUpperBoundPerServingG;delete x.ingredients[7].upperBoundEvidence;});
  reject('Unweighed black pepper is not zero',x=>x.ingredients[10].grams=null);
 }
 results.push({recipeId:b.recipeId,result,allOriginalSourceRowsRepresented:true,negativeControls:controls,sourceApplicationApproved:false,contentVersionApproved:false,publicationApproved:false,newPublishedValue:false});
}
console.log(JSON.stringify({results,newGiRecords:0,newRulesApplied:false,newPublishedValues:0,sempioNotUsed:true},null,2));
