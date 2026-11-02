import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const hash=(b:any)=>createHash('sha256').update(b).digest('hex');
const m=read(path.join(dir,'source-manifest.json'));
for(const [rel,sha] of Object.entries(m.sourceLfSha256))if(hash(readFileSync(path.join(root,rel),'utf8').replace(/\r\n/g,'\n'))!==sha)throw Error('LOCAL_SOURCE_CHANGED '+rel);
for(const [rel,sha] of Object.entries(m.sourceGitBlobSha256))if(hash(execFileSync('git',['-C',root,'show',m.mainObserved+':'+rel]))!==sha)throw Error('FROZEN_MAIN_SOURCE_CHANGED '+rel);
const c=read(path.join(dir,'source-catalog.json'));
const b=read(path.join(dir,'poha-fresh-leaf-version.json'));
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const foods=Object.values(c.foods),gis=Object.values(c.existingGiCards);
const input={recipeId:b.recipeId,servings:b.servings,ingredients:b.ingredients};
const result=calculateGlycemicLoad(input,foods,gis);
if(result.status!=='CALCULATED')throw Error('BLOCKED '+JSON.stringify(result.blockers));
if(Math.abs(result.unroundedGlycemicLoadPerServing-Number(b.expected.unroundedGk))>1e-10)throw Error('GK_MISMATCH');
if(Math.abs(result.omittedAvailableCarbohydratePerServingG-Number(b.expected.omittedChoG))>1e-10)throw Error('OMISSION_MISMATCH');
const controls=[];
function reject(label:string,mutate:(x:any)=>void){
 const x=structuredClone(input);mutate(x);const r=calculateGlycemicLoad(x,foods,gis);
 if(r.status!=='INSUFFICIENT SOURCE DATA')throw Error('UNSAFE_GENERALIZATION '+label);
 controls.push({label,status:r.status,blockers:r.blockers});
}
reject('Unknown curry-leaf composition is notzero',x=>x.ingredients[2].fineliRecordId=null);
reject('Legacy150g leaves cannot replace current3g',x=>x.ingredients[2].grams=150);
reject('Unspecified fresh coriander quantity cannot inherit a trace assumption',x=>x.ingredients[5].grams=null);
reject('Unknown peanut composition blocks',x=>x.ingredients[1].fineliRecordId=null);
console.log(JSON.stringify({recipeId:b.recipeId,mechanicalModelOnly:true,result,negativeControls:controls,
 sourceFamilyReused:true,newSourceCredit:false,newRulesApplied:false,sourceApplicationApproved:false,contentVersionApproved:false,newPublishedValue:false},null,2));
