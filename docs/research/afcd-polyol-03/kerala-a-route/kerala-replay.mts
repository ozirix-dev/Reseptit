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
const recipe='kerala-kalacurry';
const paths=['reseptit',...['en','sv','th'].map(x=>'kaannokset/'+x)].map(x=>x+'/paaruoat/'+recipe+'.md');
const fin=JSON.parse(lf(finPath)).foods;
const af=JSON.parse(lf(afPath)).foods;
const gi=JSON.parse(lf(giPath)).records.find(x=>x.id==='op142-vegetable-imputation40');
if(gi?.gi!==40||gi.evidenceKind!=='PUBLISHED_IMPUTATION')throw Error('Unexpected GI record');
const servings=4;
const rows=[
 {name:'Frozen plain saithe',grams:600,fineli:'SEITI, PAKASTE'},
 {name:'Fairtrade Original coconut milk 1 L',grams:400,cap:.8,url:'https://www.fairtradeoriginal.nl/product/biologische-kokosmelk-1-l/'},
 {name:'Yellow onion',grams:55,fineli:'SIPULI, KELTASIPULI',coded:true},
 {name:'Garlic, two medium cloves',grams:7,fineli:'VALKOSIPULI',coded:true},
 {name:'Fresh peeled ginger',grams:15,afcd:'F004213'},
 {name:'Blue Dragon Tamarind Paste',grams:10,cap:16,url:'https://www.bluedragon.co.uk/products/tamarind-paste'},
 {name:'Ground dried turmeric',grams:1.5,afcd:'F009335'},
 {name:'Chili powder',grams:.5,cap:100},
 {name:'Mustard seeds',grams:1,cap:100},
 {name:'Optional curry leaves, omitted in this version',grams:0,excluded:true},
 {name:'Pure oil, all retained',grams:27,fineli:'KOOKOSÖLJY'},
 {name:'Pure salt',grams:6,zero:true},
 {name:'Water for tamarind',grams:100,zero:true}
];
const foods=[],ingredients=[];
for(const [i,r] of rows.entries()){
 if(r.excluded)continue;
 if(r.cap!==undefined){
  ingredients.push({name:r.name,grams:r.grams,fineliRecordId:null,giRecordId:null,excludedReason:'Positive conservative omission',upperBoundEvidence:r.url??'Full weighed mass',availableCarbohydrateUpperBoundPerServingG:r.grams*r.cap/100/servings,negligibleAssumption:'Count full bound in A total'});
  continue;
 }
 const source=r.fineli?fin.find(x=>x.name===r.fineli):r.afcd?af.find(x=>x.source_id===r.afcd):null;
 const cho=r.zero?0:r.fineli?source?.per100g.available_carbohydrate_g_per_100g:source?.available_carbohydrate_without_sugar_alcohols_g_per_100g;
 if(!Number.isFinite(cho))throw Error('Missing native source '+r.name);
 const id='kerala-'+i;
 foods.push({id,name:r.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',sourceUrl:'native:'+(source?.source_id??'pure-zero'),retrievedAt:'2026-11-03',licence:'Source dataset',state:r.name,per100g:{carbohydrate:cho}});
 ingredients.push({name:r.name,grams:r.grams,fineliRecordId:id,giRecordId:r.coded?gi.id:null,foodKey:r.coded?gi.foodKey:undefined,preparationKey:r.coded?gi.preparationKey:undefined,massEvidence:'Exact research grams',giMatchEvidence:'Sauté then simmer chopped onion and garlic in the retained curry'});
}
const {calculateGlycemicLoad}=await import(pathToFileURL(resolve(root,modelPath)).href);
const result=calculateGlycemicLoad({recipeId:recipe,servings,ingredients},foods,[gi]);
if(result.status!=='CALCULATED'||Math.abs(result.omittedAvailableCarbohydratePerServingG-1.9215)>1e-10)throw Error(JSON.stringify(result));
const inputs={rows,servings,recipeId:recipe,scope:'Curry only; rice is a separately calculated serving suggestion. Retain all served sauce. Weighed coconut milk and spices are a new exact version. No optional curry leaves.',lfSha256:Object.fromEntries([...paths,finPath,afPath,giPath,modelPath].map(p=>[p,sha(lf(p))]))};
const evidence={inputs,inputSha256:sha(JSON.stringify(inputs)),calculatedGkPart:result.glycemicLoadPerServing,unroundedGk:result.unroundedGlycemicLoadPerServing,omittedChoPerServing:result.omittedAvailableCarbohydratePerServingG,sourceQualified:false,ownerApproved:false,publicationAuthorized:false};
writeFileSync(out,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({...evidence,inputs:undefined}));

