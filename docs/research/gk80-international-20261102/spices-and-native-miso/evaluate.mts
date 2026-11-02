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
 const local=readFileSync(path.join(root,rel),'utf8').replace(/\r\n/g,'\n');
 if(hash(local)!==sha||hash(execFileSync('git',['-C',root,'show',m.mainObserved+':'+rel],{maxBuffer:32*1024*1024}))!==sha)throw Error('SOURCE_CHANGED '+rel);
}
const c=read(path.join(dir,'source-catalog.json'));
const b=read(path.join(dir,'pav-bhaji-current-source-version.json'));
const allGi=read(path.join(root,'docs/nutrition/glycemic-index-records.json')).records;
const gis=allGi.filter((r:any)=>c.existingGiIds.includes(r.id));
const foods=Object.values(c.foods);
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const input={recipeId:b.recipeId,servings:b.servings,ingredients:b.ingredients};
const result=calculateGlycemicLoad(input,foods,gis);
if(result.status!=='CALCULATED')throw Error(JSON.stringify(result.blockers));
if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.unroundedGk))>1e-9)throw Error('GK_MISMATCH');
if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoG))>1e-9)throw Error('OMISSION_MISMATCH');
const negativeControls=[];
function reject(label:string,mutate:(x:any)=>void){const x=structuredClone(input);mutate(x);const r=calculateGlycemicLoad(x,foods,gis);if(r.status!=='INSUFFICIENT SOURCE DATA')throw Error('UNSAFE '+label);negativeControls.push({label,status:r.status,blockers:r.blockers,omittedCho:r.omittedAvailableCarbohydratePerServingG});}
reject('Unknown old spice blend is notzero',x=>x.ingredients.splice(9,5,{name:'pav bhaji masala -mausteseosta',grams:null,fineliRecordId:null,giRecordId:null}));
reject('Unspecified cumin mass cannot inherit a small-contribution assumption',x=>x.ingredients[9].grams=null);
reject('Unknown turmeric composition is notzero',x=>x.ingredients[12].fineliRecordId=null);
reject('Double spice amounts exceed cumulative2g even while every omitted row is below1g',x=>{for(let i=9;i<14;i++)x.ingredients[i].grams*=2;});
console.log(JSON.stringify({recipeId:b.recipeId,mechanicalModelOnly:true,result,negativeControls,newGiRecords:0,sourceApplicationApproved:false,newPublishedValue:false},null,2));
