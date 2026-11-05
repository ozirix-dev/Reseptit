/** Four exact owner-approved A versions; no release authority or general source admission. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {digest,textHash} from './gk149-model';
import {verifyFoodinRecord} from './gk-foodin-binding';
import {calculateGlycemicLoad,type GlycemicLoadIngredientInput,type GlycemicIndexRecord} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import {mextAvailableMass} from '../../docs/research/afcd-polyol-03/mext-available-source';
import type {GkOnlyVariant,LocalizedText} from '../src/features/recipes/gk-only-types';
import {acceptsReviewedNutritionModelBinding} from './reviewed-nutrition-model-binding';

const folder='docs/nutrition/gk80-next-four/';
const read=(root:string,p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const text=(root:string,p:string)=>readFileSync(path.join(root,p),'utf8');
const fail=(message:string):never=>{throw Error('Next-four: '+message);};
const locales=['fi','en','sv','th'] as const;
const localized=(value:any):LocalizedText=>{
 if(!value||!locales.every(locale=>typeof value[locale]==='string'&&value[locale].trim()))fail('missing public locale');
 return value;
};
export const NEXT_FOUR_INPUTS={
 'rahkapiirakka-vhh':'4194712a2cecb7979c779f4479a1f0a92bf402e190c4ff66a2369667455acbd4',
 bulgogi:'5ae159afc878044788f07f23db47c2932168760d4f8020e5ec3d9b553f7e83c1',
 'rahka-marjakerroskulho':'092719e24df715f0149468125c91e24c08a5dffb29ba2d2f712bb779bd4bdc86',
 'kaakao-kookos-chia':'dfcb1006838f327d6dc368dbdd647180f4be3305b82518e99f88b8d25f71f8b2'
};
export const QUANTITY_CONTRACT='GK_ONLY_NATIVE_UNITS_V1' as const;
export function verifyNextFourManifest(root:string){
 const raw=text(root,folder+'integration.json');
 if(textHash(raw)!=='05ea7570d484e62b85b58239dbea31007027b5b5d17cce75f87a6f1fc3022492')fail('integration manifest seal changed');
 const m=JSON.parse(raw);
 if(m.integrationAuthorized!==true||m.readyAuthorized!==false||m.mergeAuthorized!==false||m.deployAuthorized!==false||digest(m.approvedInputs)!==digest(NEXT_FOUR_INPUTS))fail('integration authority/scope');
 for(const [p,sha] of Object.entries(m.filesLfSha256))if(textHash(text(root,p))!==sha)fail('integration file changed: '+p);
 return m;
}
export function verifyNextFourCase(c:any){
 const expected=NEXT_FOUR_INPUTS[c.recipeId as keyof typeof NEXT_FOUR_INPUTS];
 const {inputSha256,...body}=c;
 if(!expected||inputSha256!==expected||digest(body)!==expected||c.level!=='A'||c.confidence!=='LOW'||c.approval!==false||c.macroAction!=='PRESERVE_ALL_CURRENT_VALUES_AND_WITHHOLDINGS')fail('unapproved exact case');
 if(c.publicationAuthorized!==undefined&&c.publicationAuthorized!==false)fail('case release authority');
}
export function verifyMext05001(context:any,source:any){
 if(source.id!=='MEXT05001'||source.nativeId!=='05001'||source.nativeField!=='CHOAVL'||source.availablePer100g!==5.2||context.mext.records.length!==1||context.mext.records[0].nativeId!=='05001')fail('MEXT05001 exact scope');
 const result=mextAvailableMass(context.mext,'05001');
 if(result.availablePer100g!==5.2||context.mext.records[0].mainCell!=='P435'||context.mext.records[0].carbohydrateCell!=='O359')fail('MEXT05001 source field');
 return result.availablePer100g;
}
type Composition={id:string;name:string;value:number;basis:'g'|'ml';upper:boolean;url:string;kind:'CARBOHYDRATE'|'BOUND';note:string};
function verifyComposition(root:string,context:any,f:any,foodinLineage:string):Composition{
 let value:number,basis:'g'|'ml'='g',upper=false,url:string,note:string;
 if(['FINELI_NATIVE','FINELI_CHOAVL','AFCD_WITHOUT_SUGAR_ALCOHOLS'].includes(f.kind)){
  const fineli=f.kind!=='AFCD_WITHOUT_SUGAR_ALCOHOLS';
  const p=fineli?'docs/nutrition/fineli-release-20-reference.json':'docs/nutrition/afcd-release-3-reference.json';
  const rows=read(root,p).foods.filter((r:any)=>String(r.source_id)===f.nativeId);
  const field=fineli?'per100g.available_carbohydrate_g_per_100g':'available_carbohydrate_without_sugar_alcohols_g_per_100g';
  if(rows.length!==1||(f.nativeField&&f.nativeField!==field))fail('native carbohydrate field: '+f.id);
  value=fineli?rows[0].per100g.available_carbohydrate_g_per_100g:rows[0].available_carbohydrate_without_sugar_alcohols_g_per_100g;
  if(value!==f.availablePer100g)fail('native carbohydrate point: '+f.id);
  if(f.portionMasses&&digest(f.portionMasses)!==digest(rows[0].portion_mass_g))fail('native household measures changed: '+f.id);
  url=fineli?'https://fineli.fi/fineli/fi/elintarvikkeet/'+f.nativeId:'https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd';
  note=fineli?'THL Fineli Release20, native available carbohydrate; CC BY4.0. Unknown total polyols are not assumed zero.':'FSANZ AFCD Release3, native carbohydrate WITHOUT sugar alcohols; CC BY-SA3.0 Australia. Regional composition proxy; unknown total polyols are not assumed zero.';
 }else if(f.kind==='MEXT_NATIVE_MASS'){
  value=verifyMext05001(context,f);url=context.mext.source.landingPage;
  note='MEXT2023 corrected2026-03-27, native CHOAVL mass05001 only. Dried unroasted whole almonds, all150g retained after grinding; not arbitrary almond flour.0.975gCHO/serving is only0.025g below the individual omission limit. Native point, not a lot-certified upper. 日本食品標準成分表（八訂）増補2023年から引用.';
 }else if(['EXPLICIT_LABEL_DIFFERENCE','EXPLICIT_LABEL_C_MINUS_P'].includes(f.kind)){
  const record=verifyFoodinRecord(read(root,'docs/nutrition/food-records.json'),foodinLineage);
  value=record.per100g.carbohydrate-record.per100g.polyols;
  if(f.nativeId!==record.id||value!==0||f.availablePer100g!==0)fail('Foodin exact label');
  url=record.sourceUrl;note='Foodin pure erythritol label: explicit100g carbohydrate minus100g polyols. The computational zero-mass marker never removes the original sweetener.';
 }else if(['PHYSICAL_MASS_CAP','PHYSICAL_MASS_UPPER'].includes(f.kind)){
  value=100;upper=true;url='#gk-only-method';note='Whole weighed edible mass is a positive carbohydrate upper bound only, not a nutrient point or a zero.';
  if(f.id!=='physical'&&f.id!=='vanilla-physical-cap')fail('unapproved physical bound');
 }else if(['LABEL_UPPER_PER100ML','LABEL_UPPER_PER100G'].includes(f.kind)){
  const product=context.products.find((p:any)=>p.id===f.observationId);
  if(!product||product.declaredCarbohydrate!==f.declaredCarbohydrate||f.availablePoint!==null)fail('product label bound');
  basis=f.kind==='LABEL_UPPER_PER100ML'?'ml':'g';
  if((basis==='ml'&&(f.id!=='koko-uk-unsweetened-cap'||product.basis!=='per100ml-as-sold'||product.declaredCarbohydrate!==0.4))||(basis==='g'&&(f.id!=='urtekram-roasted-cap'||product.basis!=='per100g-as-sold-roasted'||product.declaredCarbohydrate!==8.4)))fail('exact product/unit binding');
  value=product.declaredCarbohydrate;upper=true;url=product.url;note=product.fieldMeaning+' '+product.productIdentity+'; source basis: '+product.basis;
 }else return fail('unsupported source type: '+f.kind);
 if(!Number.isFinite(value)||value<0||value>100)fail('invalid carbohydrate');
 return {id:f.id,name:f.name??f.id,value,basis,upper,url,kind:upper?'BOUND':'CARBOHYDRATE',note};
}
function verifyGi(root:string,g:any):GlycemicIndexRecord{
 if(!['NAMED_HUMAN_GI','EXISTING_PUBLISHED_CODING','EXISTING_PUBLISHED_IMPUTATION'].includes(g.kind))fail('new GI model outside four A scope');
 const p=g.path??'docs/nutrition/glycemic-index-records.json';
 const data=read(root,p),rows=(Array.isArray(data)?data:data.records).filter((r:any)=>r.id===g.nativeId);
 const values=g.values??[g.value],native=rows[0];
 if(rows.length!==1||values.length!==1||digest(values)!==digest(native.values??[native.gi])||native.calculationUse==='REFERENCE_ONLY'||native.matchKind==='CATEGORY_MEAN')fail('GI source binding');
 if(g.nativeRowSha256&&digest(native)!==g.nativeRowSha256)fail('GI record hash');
 return {id:g.id,gi:values[0],foodKey:g.id,preparationKey:g.id,food:g.locator??native.food,preparation:g.locator??native.preparation,qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:g.kind==='NAMED_HUMAN_GI'?'HUMAN_GI':'PUBLISHED_IMPUTATION',source:{title:g.locator??native.source.title,url:g.sourceUrl??native.source.url,table:g.locator??native.source.table,year:native.source?.year??2021,published:true,iso26642Confirmed:false,qualityEvidence:g.limitation??g.note??native.note??'Exact approved source application'},note:g.limitation??g.note??native.note};
}
export function loadApprovedFour(root:string){
 const manifest=verifyNextFourManifest(root),pack=read(root,folder+'cases.json'),sources=read(root,folder+'sources.json'),lineage=read(root,folder+'approval-lineage.json');
 if(pack.activation!==false||pack.sourceCommit!==manifest.sourceCommit||pack.cases.length!==4||digest(lineage.approvedInputs)!==digest(NEXT_FOUR_INPUTS))fail('projected approved scope');
 for(const [p,expected] of Object.entries(sources.sharedFilesLfSha256) as Array<[string,string]>){
  const actual=textHash(text(root,p));
  if(actual!==expected&&!acceptsReviewedNutritionModelBinding(p,expected,actual))fail('shared source changed: '+p);
 }
 const admitted:Record<string,string>={};
 for(const [p,binding] of Object.entries(lineage.receiptBindings) as Array<[string,any]>){
  if(textHash(text(root,p))!==binding.sha256Lf)fail('original approval receipt changed');
  const a=read(root,p);
  if(a.sourceAndContentApproved!==true||a.currentAArithmeticAccepted!==true||a.integrationAuthorizedForOwnerInLaterBatch!==true||a.readyAuthorized!==false||a.mergeAuthorized!==false||a.deployAuthorized!==false)fail('existing approval scope/authority');
  const inputs=a.approvedInputs??{[a.recipeId]:a.approvedCaseInputSha256};
  if(digest(inputs)!==digest(binding.approvedInputs)||a.reviewedContentCommit!==binding.reviewedContentCommit)fail('receipt input lineage');
  Object.assign(admitted,inputs);
 }
 if(digest(Object.fromEntries(Object.keys(NEXT_FOUR_INPUTS).map(id=>[id,admitted[id]])))!==digest(NEXT_FOUR_INPUTS)||Object.keys(admitted).length!==4)fail('receipts admit only four');
 const copy=read(root,folder+'public-copy.json');
 return pack.cases.map((c:any)=>{
  verifyNextFourCase(c);
  for(const [locale,p] of Object.entries(c.paths))if(textHash(text(root,p as string))!==(c.recipeSha256??c.recipeSha256Lf)[locale])fail('parent recipe version changed');
  const context=sources.contexts[pack.caseContexts[c.recipeId]],comps:Composition[]=context.composition.map((f:any)=>verifyComposition(root,context,f,sources.foodinOriginalFileLfSha256));
  const gis:GlycemicIndexRecord[]=context.giBindings.map((g:any)=>verifyGi(root,g));
  const foods:FoodRecord[]=comps.filter(f=>!f.upper).map(f=>({id:f.id,name:f.name,sourceUrl:f.url,retrievedAt:'2026-11-02',licence:'See pinned source catalog',state:'Exact admitted version',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.value}}));
  const ingredients:GlycemicLoadIngredientInput[]=c.candidateIngredients.map((i:any)=>{
   const f=comps.find(f=>f.id===i.compositionId)??fail('missing composition');
   if(i.giId&&!context.giBindings.find((g:any)=>g.id===i.giId)?.allowedCompositionIds.includes(f.id))fail('unapproved named GI/food binding');
   if(f.upper){
    const amount=f.basis==='ml'?i.millilitres:i.grams;
    if(i.carbohydrateUse!=='UPPER_BOUND'||i.giId!==null||!Number.isFinite(amount)||amount<0||(f.basis==='ml'&&Object.hasOwn(i,'grams')))fail('native-unit upper bound');
    return {name:i.name,grams:f.basis==='ml'?null:amount,fineliRecordId:null,giRecordId:null,recipeQuantity:f.basis==='ml'?{amount,unit:'ml',massGrams:null}:undefined,availableCarbohydrateUpperBoundPerServingG:amount*f.value/100/c.servings,upperBoundEvidence:i.note,negligibleAssumption:i.note,excludedReason:'Positive source-backed upper; not GI zero.'};
   }
   if(i.carbohydrateUse!=='AVAILABLE_POINT'||!Number.isFinite(i.grams)||i.grams<0||Object.hasOwn(i,'millilitres'))fail('source-native gram point');
   return {name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:i.giId,foodKey:i.giId??undefined,preparationKey:i.giId??undefined,massEvidence:i.note,giMatchEvidence:c.preparationDecision};
  });
  const result=calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,gis),expected=manifest.expectedResults[c.recipeId];
  if(result.status!=='CALCULATED'||result.blockers.length||result.glycemicLoadPerServing!==expected.point||Math.abs(result.unroundedGlycemicLoadPerServing!-expected.unrounded)>1e-10||Math.abs(result.omittedAvailableCarbohydratePerServingG-expected.omittedCho)>1e-10)fail('approved arithmetic changed: '+c.recipeId);
  return {c,result,comps,gis,copy:copy.versions[c.recipeId]};
 });
}
export function buildApprovedFourVariants(root:string):GkOnlyVariant[]{
 return loadApprovedFour(root).map(({c,result:r,comps,gis,copy}:any)=>{
  if(copy.ingredientNames.length!==c.candidateIngredients.length)fail('public ingredient scope');
  const overrides:Record<string,any>=copy.nativeQuantities??{};
  const ingredients=c.candidateIngredients.map((i:any,index:number)=>{
   const override=overrides[String(index)];
   if(override){
    // Every display override is an explicit original measure, never a density conversion.
    const expected=c.recipeId==='rahkapiirakka-vhh'&&index===5?{amount:2,unit:'tbsp'}:c.recipeId==='bulgogi'&&index===4?{amount:1,unit:'tbsp'}:c.recipeId==='kaakao-kookos-chia'&&index===1?{amount:200,unit:'ml'}:c.recipeId==='kaakao-kookos-chia'&&index===2?{amount:100,unit:'ml'}:null;
    if(!expected||digest(override)!==digest(expected))fail('unapproved public native quantity');
    return {name:localized(copy.ingredientNames[index]),grams:null,quantity:override};
   }
   if(i.millilitres!==undefined)fail('native ml display missing');
   return {name:localized(copy.ingredientNames[index]),grams:i.grams===0?null:i.grams};
  });
  const preparation=localized(copy.preparation);
  for(const value of Object.values(preparation)){
   for(const token of value.matchAll(/\{\{amount:(\d+)\}\}/g)){const i=ingredients[Number(token[1])];if(!i||!(i.grams??i.quantity?.amount))fail('public amount token');}
   if(value.replace(/\{\{(?:servings|amount:\d+)\}\}/g,'').includes('{{'))fail('unknown public preparation token');
  }
  const publicSources:GkOnlyVariant['sources']=[...comps.map((f:any)=>({title:f.name,url:f.url,kind:f.kind,note:f.note})),...gis.map((g:any)=>({title:g.source.title,url:g.source.url,kind:g.evidenceKind==='HUMAN_GI'?'HUMAN_GI' as const:'PUBLISHED_CODING' as const,note:g.note??g.source.qualityEvidence}))];
  if(publicSources.some(s=>!s.url?.startsWith('https://')&&s.url!=='#gk-only-method'))fail('public source URL');
  const coded=r.ingredients.filter((i:any)=>gis.find((g:any)=>g.id===i.giRecordId)?.evidenceKind==='PUBLISHED_IMPUTATION');
  const codedGk=coded.reduce((sum:number,i:any)=>sum+i.giContribution,0),codedCho=coded.reduce((sum:number,i:any)=>sum+i.availableCarbohydratePerServingG,0);
  const remaining=Math.max(0,r.unroundedGlycemicLoadPerServing-codedGk);
  return {recipeId:c.recipeId,versionId:'gk-next4-'+c.inputSha256.slice(0,12),inputSha256:c.inputSha256,level:'A',servings:c.servings,point:r.glycemicLoadPerServing,scenarioRange:null,rangeKind:null,omittedCho:r.omittedAvailableCarbohydratePerServingG,confidence:'LOW',macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',quantityContract:QUANTITY_CONTRACT,ingredients,preparation,limitation:localized(copy.limitation),codingKinds:[],sensitivity:{kind:'ASSUMPTION_ONLY',gi:[0,150],min:remaining,max:remaining+1.5*(r.omittedAvailableCarbohydratePerServingG+codedCho),isBiologicalBound:false,isConfidenceInterval:false},sources:publicSources};
 });
}
