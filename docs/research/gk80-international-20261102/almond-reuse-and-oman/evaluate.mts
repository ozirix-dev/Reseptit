import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const m=read(path.join(dir,'source-manifest.json'));
const hash=(b:any)=>createHash('sha256').update(b).digest('hex');
for(const [rel,sha] of Object.entries(m.sourceLfSha256)){
 if(hash(readFileSync(path.join(root,rel),'utf8').replace(/\r\n/g,'\n'))!==sha||hash(execFileSync('git',['-C',root,'show',m.mainObserved+':'+rel],{maxBuffer:32*1024*1024}))!==sha)throw Error('SOURCE_CHANGED '+rel);
}
const c=read(path.join(dir,'source-catalog.json'));
const gis=read(path.join(root,'docs/nutrition/glycemic-index-records.json')).records.filter((r:any)=>c.existingGiIds.includes(r.id));
const foods=Object.values(c.foods);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const results=[];
for(const rid of ['vhh-omenapiirakka','vhh-raparperipiirakka']){
 const b=read(path.join(dir,rid+'.json'));const input={recipeId:rid,servings:b.servings,ingredients:b.ingredients};
 const result=calculateGlycemicLoad(input,foods,gis);
 if(result.status!=='CALCULATED')throw Error(JSON.stringify(result.blockers));
 if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.unroundedGk))>1e-9)throw Error('GK_MISMATCH');
 if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoIncludingCeilingsG))>1e-9)throw Error('OMISSION_MISMATCH');
 const negativeControls=[];
 function reject(label:string,mutate:(x:any)=>void){const x=structuredClone(input);mutate(x);const r=calculateGlycemicLoad(x,foods,gis);if(r.status!=='INSUFFICIENT SOURCE DATA')throw Error('UNSAFE '+label);negativeControls.push({label,status:r.status,blockers:r.blockers});}
 reject('Unknown almond composition is notzero',x=>x.ingredients[0].fineliRecordId=null);
 reject('Generic commercial almondmeal AFCD5.4 still fails singleingredient tolerance',x=>x.ingredients[0].fineliRecordId='afcd-F006077');
 reject('154g almonds exceed1g perportion despite same8servings',x=>x.ingredients[0].grams=154);
 reject('Unknown sweetener cannot inherit Foodin100percenterythritol',x=>{const i=x.ingredients.find((r:any)=>r.fineliRecordId.startsWith('foodin-'));i.fineliRecordId=null;});
 if(rid==='vhh-raparperipiirakka')reject('Unweighed vanilla cannot inherit physical5g bound',x=>{x.ingredients[7].grams=null;delete x.ingredients[7].availableCarbohydrateUpperBoundPerServingG;});
 results.push({recipeId:rid,mechanicalModelOnly:true,result,negativeControls,sourceApplicationApproved:false,contentVersionApproved:false,newPublishedValue:false});
}
console.log(JSON.stringify({results,newGiRecords:0,newSourcesCredited:0,newRulesApplied:false,publication:false},null,2));
