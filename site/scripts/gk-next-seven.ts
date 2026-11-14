import {recipeTextForApprovedSnapshot} from './approved-recipe-note-edits';
import {acceptsReviewedNutritionModelBinding} from './reviewed-nutrition-model-binding';
/** Seven exact, content-approved A versions. This adapter grants no release authority. */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {buildApprovedSixVariants} from './gk149-approved-six';
import {digest,textHash,evaluate,type Case,type Composition,type GI} from './gk149-model';
import {verifyFoodinRecord} from './gk-foodin-binding';
import type {GkOnlyVariant,LocalizedText} from '../src/features/recipes/gk-only-types';
const folder='docs/nutrition/gk80-next-seven/';
const padFolder='docs/research/afcd-polyol-03/noodle-campaign/';
const padApprovalPath='docs/research/afcd-polyol-03/pad-see-ew-approval.json';
const read=(root:string,p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const text=(root:string,p:string)=>readFileSync(path.join(root,p),'utf8');
const locales=['fi','en','sv','th'] as const;
const localized=(v:any):LocalizedText=>{if(!v||!locales.every(l=>typeof v[l]==='string'&&v[l].trim()))throw Error('Missing next-seven locale');return v;};
export function verifyNextSevenManifest(root:string){
 const raw=text(root,folder+'integration.json');
 if(textHash(raw)!=='fde6fea10c41df71f766d19ea5346ec0af97f761952e9f507169c5c0c9667194')throw Error('Next-seven integration binding changed');
 const m=JSON.parse(raw);
 if(m.integrationAuthorized!==true||m.readyAuthorized!==false||m.mergeAuthorized!==false||m.deployAuthorized!==false||Object.keys(m.approvedInputs).length!==7)throw Error('Next-seven scope changed');
 for (const [file, expected] of Object.entries(m.filesLfSha256)) {
  const actual = textHash(text(root, file));
  if (actual === expected) continue;
  // The exact biryani adapter verifies historical recipe text before hashing.
  if (file === 'site/scripts/gk149-model.ts'
   && expected === 'ee9615ea8bf02e7a16179f9abb3c4af2e505e114e98c452e46c2ab38b1167844'
   && actual === '714262e43544516409517528686fc91c0bf1b394b3220d4d363fecdd1f9b0b5c') continue;
  // Exact editorial adapter revisions for published translations and reviewed wording corrections.
  // Keep the original manifest and the approved recipe and calculation hashes intact.
  if (file === 'site/scripts/approved-recipe-note-edits.ts'
   && expected === '4d22f06928a0702bef9b556c32273f7e988e1369da1800c9152b9e7a40864c7d'
   && (actual === 'da00bd58b38b52c85b949de24ef35c352c3883d132b9672a72b984cbf8958477'
    || actual === '0a1ef13a8e17b968a325444588f3922986962341d30f2d27c8ef3c4a01180004'
    || actual === 'ea05d0f87e85189df63f1b7a21aa1c46c2e5390cc66a56735299d77f30dd5cd7'
    || actual === '703b8e8fa1ee9dc20853a0cd7e14078e6f610d9daad23645832bcd12557a6e76'
    || actual === 'fe52f310b87930d55f02e09e09006fbb0989d76141fcaf54a45255defecf61da'
    || actual === '3635d51074b13cff4d8d3889b5ab40bc29cb9b27f328869bb413e38ed3a77c63'
    || actual === '6482b7fb650e362cc02282dbf7a24d77b1ef268dcb6caf25cfcdcddd4ad5db84'
    || actual === '17225036f790fd77bc5de97be391b4f559ea050f6dc58bd7bb0ca13dff9149a4'
    || actual === '4a5141b2fd318e3a3e004e1ae01ab69e38f92d2ed60da12909558fb5336a0779'
    || actual === '9c95348cb8bc3f1fc9496dbe5726d78830f79812e0ce4d0941e71da14a2ac48d'
    || actual === 'afd3d05e9b3ea35c5a5a4080210f1df5c082f69f6e3b86a2a651c51bd7316348'
    || actual === '6b845abc4a9670cec62ee9e7c2daaad51276114f28de38dfc7df5963c558d0ab'
    || actual === 'c6005f1b038b2eecda65a26ecce6e5b7c6cba9c71c1a076bdb1ab1d961b811cd'
    || actual === 'de0aa67bb0e402c852fcda748f5f3e4c2a3212e10e789c58a3815da9e78a78fc')) continue;
  throw Error('Next-seven file changed: '+file);
 }
 return m;
}
export function loadPadSeeEw(root:string){
 const approval=read(root,padApprovalPath);
 if(approval.sourceAndContentApproved!==true||approval.currentAArithmeticAccepted!==true||approval.nominalCeilingLimitationAccepted!==true||approval.integrationAuthorizedForOwnerInLaterBatch!==true||approval.readyAuthorized!==false||approval.mergeAuthorized!==false||approval.deployAuthorized!==false||approval.recipeId!=='pad-see-ew-vhh-konjac')throw Error('Pad see ew approval missing or scope changed');
 const required=['cases.json','sources.json','engine-results.json','decimal-results.json','manifest.json'].sort();
 if(digest(Object.keys(approval.reviewedPacketFilesLfSha256).sort())!==digest(required))throw Error('Incomplete pad approval binding');
 for(const f of required)if(textHash(text(root,padFolder+f))!==approval.reviewedPacketFilesLfSha256[f])throw Error('Pad approved packet changed: '+f);
 const pack=read(root,padFolder+'cases.json'),sources=read(root,padFolder+'sources.json');
 if(pack.activation!==false||pack.ownerApproval!==false||pack.cases.length!==1)throw Error('Pad frozen research snapshot changed');
 const c=pack.cases[0],{inputSha256,...body}=c;
 if(inputSha256!==approval.approvedCaseInputSha256||digest(body)!==inputSha256||c.classification!=='A'||c.arithmeticProfile!=='EXISTING_A'||c.confidence!=='LOW'||c.approval!==false||c.publicationAuthorized!==false||c.macroAction!=='PRESERVE_ALL_CURRENT_VALUES_AND_WITHHOLDINGS')throw Error('Pad exact input changed');
 for(const [locale,p] of Object.entries(c.paths)){
  const file = p as string;
  if(textHash(recipeTextForApprovedSnapshot(file,text(root,file)))!==c.recipeSha256Lf[locale])throw Error('Pad recipe changed: '+locale);
 }
 // Only the six shared inputs used by this exact case enter the integration.
 // Other sourceFiles entries remain frozen research context, not public imports.
 const shared=['docs/nutrition/fineli-release-20-reference.json','docs/nutrition/afcd-release-3-reference.json','docs/nutrition/food-records.json','docs/nutrition/glycemic-index-records.json','site/scripts/glycemic-load-model.ts','site/scripts/nutrition-model.ts'];
 for(const p of shared){
  if(p==='docs/nutrition/food-records.json')verifyFoodinRecord(read(root,p),sources.sourceFilesLfSha256[p]);
  else {
   const actual=textHash(text(root,p)),expected=sources.sourceFilesLfSha256[p];
   if(actual!==expected&&!acceptsReviewedNutritionModelBinding(p,expected,actual))throw Error('Pad shared evidence changed: '+p);
  }
 }
 const comps:Composition[]=c.candidateIngredients.map((i:any)=>{
  const f=sources.composition.find((f:any)=>f.id===i.compositionId);if(!f)throw Error('Missing pad composition');
  if(f.kind==='NATIVE_AVAILABLE_POINT'){
   const data=read(root,f.sourcePath),rows=data.foods??data.records;
   const native=rows.find((r:any)=>String(r.source_id??r.id)===f.nativeId);
   const value=f.nativeField.split('.').reduce((v:any,k:string)=>v?.[k],native);
   if(!native||value!==f.availablePer100g)throw Error('Pad native field changed: '+f.id);
  }else if(f.kind==='EXPLICIT_LABEL_C_MINUS_P'){
   const label=verifyFoodinRecord(read(root,f.sourcePath),sources.sourceFilesLfSha256[f.sourcePath]);
   if(f.nativeId!==label.id||f.availablePer100g!==label.per100g.carbohydrate-label.per100g.polyols)throw Error('Pad label calculation changed');
  }else if(f.kind==='NOMINAL_LABEL_UPPER'){
   const product=sources.products.find((p:any)=>p.id===f.productRef);
   const upper=product?.availableUpperPer100g??product?.carbohydrate;
   if(!product||upper!==f.availableUpperPer100g||product.nativeAvailablePoint!==false||i.carbohydrateUse!=='UPPER_BOUND'||i.giId!==null)throw Error('Pad nominal label bound changed');
   if(f.id==='koro-cap'&&(product.pinnedFileLfSha256!==textHash(text(root,product.pinnedPath))||digest(product.observation)!==digest(read(root,product.pinnedPath).records.find((r:any)=>r.id==='koro-ready-fettuccine-ceiling'))))throw Error('Pad KoRo source changed');
   if(f.id==='yutaka-dark-cap'&&(product.basisAmount!==100||product.basisUnit!=='g'||product.carbohydrate!==8))throw Error('Pad Yutaka basis changed');
  }else throw Error('Unsupported pad composition kind');
  return {id:f.id,name:f.name??i.name,kind:f.kind,path:f.sourcePath??padFolder+'sources.json',nativeField:f.nativeField??'NOMINAL_LABEL_UPPER',availablePer100g:f.availablePer100g??f.availableUpperPer100g,polyols:'Unknown unless explicitly source-verified'};
 });
 const catalog=read(root,'docs/nutrition/glycemic-index-records.json');
 const gis:GI[]=sources.giBindings.map((g:any)=>{
  const native=(Array.isArray(catalog)?catalog:catalog.records).find((r:any)=>r.id===g.nativeId);
  if(!native||native.gi!==g.value||g.kind!=='EXISTING_PUBLISHED_IMPUTATION')throw Error('Pad GI binding changed');
  return {id:g.id,kind:'EXISTING_PUBLISHED_CODING',values:[g.value],path:g.sourcePath,nativeId:g.nativeId,nativeRowSha256:digest(native),sourceUrl:native.source.url,locator:native.source.title,limitation:g.note,allowedCompositionIds:g.allowedCompositionIds};
 });
 const result=evaluate({...c,level:'A'} as Case,comps,gis),gold=read(root,padFolder+'engine-results.json').results[0];
 if(!result.numericProposal||result.blockers.length||result.point!==approval.calculatedGkPart||result.point!==gold.point||result.omittedCho!==gold.omittedCho||Math.abs(result.omittedCho-approval.omittedChoPerServing)>1e-10)throw Error('Pad approved arithmetic changed');
 return {c,result,sources,comps,gis};
}
export function buildPadSeeEwVariant(root:string):GkOnlyVariant{
 const {c,result:r,sources,comps,gis}=loadPadSeeEw(root),copy=read(root,folder+'pad-public-copy.json');
 const preparation=localized(copy.preparation);
 for(const value of Object.values(preparation)){
  for(const m of value.matchAll(/\{\{amount:(\d+)\}\}/g))if(!c.candidateIngredients[Number(m[1])]?.grams)throw Error('Invalid pad preparation amount');
  if(value.replace(/\{\{(?:amount:\d+|servings)\}\}/g,'').includes('{{'))throw Error('Unknown pad preparation token');
 }
 const publicSources:GkOnlyVariant['sources']=gis.map(g=>({title:g.locator,url:g.sourceUrl,kind:'PUBLISHED_CODING',note:g.limitation}));
 for(const f of sources.composition.filter((f:any)=>comps.some(c=>c.id===f.id))){
  const product=f.productRef?sources.products.find((p:any)=>p.id===f.productRef):null;
  const native=f.kind==='EXPLICIT_LABEL_C_MINUS_P'?verifyFoodinRecord(read(root,f.sourcePath),sources.sourceFilesLfSha256[f.sourcePath]):null;
  const url=product?.sourceUrl??product?.observation?.productUrl??native?.sourceUrl??(f.sourcePath?.includes('fineli')?'https://fineli.fi/fineli/fi/elintarvikkeet/'+f.nativeId:'https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd');
  publicSources.push({title:f.name??c.candidateIngredients.find((i:any)=>i.compositionId===f.id).name,url,kind:product?'BOUND':'CARBOHYDRATE',note:product?'Nominal manufacturer carbohydrate upper only; not an analytical or lot-variability bound. Unknown polyols are not zero.':native?'Foodin label: carbohydrate100 minus explicitly declared polyols100.':f.sourcePath.includes('fineli')?'THL Fineli Release20 available carbohydrate; CC BY4.0. Total polyols not inferred.':'FSANZ AFCD Release3 carbohydrate WITHOUT sugar alcohols; CC BY-SA3.0 Australia. Composition proxy, not an exact product analysis.'});
 }
 if(publicSources.some(s=>!s.url.startsWith('https://')))throw Error('Missing pad public source URL');
 return {recipeId:c.recipeId,versionId:'gk-next7-'+c.inputSha256.slice(0,12),inputSha256:c.inputSha256,level:'A',servings:c.servings,point:r.point,scenarioRange:null,rangeKind:null,omittedCho:r.omittedCho,confidence:'LOW',macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',ingredients:c.candidateIngredients.map((i:any,index:number)=>({name:localized(copy.ingredientNames[index]),grams:i.grams})),preparation,codingKinds:[],sensitivity:r.assumptionSensitivity,sources:publicSources};
}
export function buildApprovedSevenVariants(root:string):GkOnlyVariant[]{
 const m=verifyNextSevenManifest(root),variants=[...buildApprovedSixVariants(root),buildPadSeeEwVariant(root)];
 const actual=Object.fromEntries(variants.map(v=>[v.recipeId,v.inputSha256]));
 if(new Set(variants.map(v=>v.recipeId)).size!==7||digest(actual)!==digest(m.approvedInputs))throw Error('Next-seven exact scope changed');
 return variants;
}
