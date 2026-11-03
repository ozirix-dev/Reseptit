import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [root,out]=process.argv.slice(2);
const lf=(p)=>readFileSync(resolve(root,p),'utf8').replaceAll('\r\n','\n');
const sha=(s)=>createHash('sha256').update(s).digest('hex');
const finPath='docs/nutrition/fineli-release-20-reference.json';
const afPath='docs/nutrition/afcd-release-3-reference.json';
const giPath='docs/nutrition/glycemic-index-records.json';
const modelPath='site/scripts/glycemic-load-model.ts';
const recipe='paistettu-maksa-pekonilla';
const paths=['reseptit',...['en','sv','th'].map(x=>'kaannokset/'+x)].map(x=>x+'/paaruoat/'+recipe+'.md');
const fin=JSON.parse(lf(finPath)).foods;
const af=JSON.parse(lf(afPath)).foods;
const gi=JSON.parse(lf(giPath)).records.find(x=>x.id==='op142-vegetable-imputation40');
if(gi?.gi!==40||gi.evidenceKind!=='PUBLISHED_IMPUTATION')throw Error('Unexpected GI record');
const servings=4;
const low=JSON.parse(lf(giPath)).records.find(x=>x.id==='op142-lowcho50-v2');
if(low?.gi!==50||low.evidenceKind!=='PUBLISHED_IMPUTATION')throw Error('Unexpected low-CHO model');
const rows=[
 {name:'Raw beef liver',grams:500,point:3.3,sourceId:'MEXT 11092 estimated available CHO mass sum',url:'https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=11_11092_7&MODE=7',coded:'low'},
 {name:'Atria Suomalainen Pekoni 200 g',grams:150,cap:.7,url:'https://www.atria.fi/tuotteet/atria-suomalainen-pekoni-200g/'},
 {name:'Yellow onion',grams:55,fineli:'SIPULI, KELTASIPULI',coded:true},
 {name:'Butter',grams:28,fineliId:'500'},
 {name:'Valio Keittiön lactose-free whipping cream 35%',grams:100,cap:3,url:'https://www.valio.fi/tuotteet/valio-keittion-kuohukerma-laktoositon/'},
 {name:'Pure salt',grams:3,zero:true},
 {name:'Ground black pepper',grams:1,fineliId:'11177'}
];
const foods=[],ingredients=[];
for(const [i,r] of rows.entries()){
 if(r.excluded)continue;
 if(r.cap!==undefined){
  ingredients.push({name:r.name,grams:r.grams,fineliRecordId:null,giRecordId:null,excludedReason:'Positive conservative omission',upperBoundEvidence:r.url??'Full weighed mass',availableCarbohydrateUpperBoundPerServingG:r.grams*r.cap/100/servings,negligibleAssumption:'Count full bound in A total'});
  continue;
 }
 const source=r.fineliId?fin.find(x=>x.source_id===r.fineliId):r.fineli?fin.find(x=>x.name===r.fineli):r.afcd?af.find(x=>x.source_id===r.afcd):null;
 const cho=r.point??(r.zero?0:(r.fineli||r.fineliId)?source?.per100g.available_carbohydrate_g_per_100g:source?.available_carbohydrate_without_sugar_alcohols_g_per_100g);
 if(!Number.isFinite(cho))throw Error('Missing native source '+r.name);
 const id='liver-'+i;
 const binding=r.coded==='low'?low:r.coded?gi:null;
 foods.push({id,name:r.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',sourceUrl:r.url??'native:'+(source?.source_id??'pure-zero'),retrievedAt:'2026-11-03',licence:'Source dataset',state:r.name,per100g:{carbohydrate:cho}});
 ingredients.push({name:r.name,grams:r.grams,fineliRecordId:id,giRecordId:binding?.id??null,foodKey:binding?.foodKey,preparationKey:binding?.preparationKey,massEvidence:'Exact research grams',giMatchEvidence:'Pan-fry, finish in sauce and retain all pan juices; keep original liver doneness instruction.'});
}
const {calculateGlycemicLoad}=await import(pathToFileURL(resolve(root,modelPath)).href);
const result=calculateGlycemicLoad({recipeId:recipe,servings,ingredients},foods,[gi,low]);
if(result.status!=='CALCULATED'||Math.abs(result.omittedAvailableCarbohydratePerServingG-1.164275)>1e-10)throw Error(JSON.stringify(result));
const inputs={rows,servings,recipeId:recipe,scope:'Four portions with all bacon, butter, cream sauce and pan juices. Original liver and bacon grams and liver doneness instruction retained. Cream and seasoning masses define the new exact version. MEXT estimated mass sum qualifies arithmetically, Fineli 5.031 does not qualify for this model.',lfSha256:Object.fromEntries([...paths,finPath,afPath,giPath,modelPath].map(p=>[p,sha(lf(p))]))};
const evidence={inputs,inputSha256:sha(JSON.stringify(inputs)),calculatedGkPart:result.glycemicLoadPerServing,unroundedGk:result.unroundedGlycemicLoadPerServing,omittedChoPerServing:result.omittedAvailableCarbohydratePerServingG,sourceQualified:false,ownerApproved:false,publicationAuthorized:false};
writeFileSync(out,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({...evidence,inputs:undefined}));

