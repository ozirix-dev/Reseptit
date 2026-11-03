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
 for(const [p,sha] of Object.entries(m.filesLfSha256))if(textHash(text(root,p))!==sha)throw Error('Next-seven file changed: '+p);
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
 for(const [locale,p] of Object.entries(c.paths))if(textHash(text(root,p as string))!==c.recipeSha256Lf[locale])throw Error('Pad recipe changed: '+locale);
 // Only the six shared inputs used by this exact case enter the integration.
 // Other sourceFiles entries remain frozen research context, not public imports.
 const shared=['docs/nutrition/fineli-release-20-reference.json','docs/nutrition/afcd-release-3-reference.json','docs/nutrition/food-records.json','docs/nutrition/glycemic-index-records.json','site/scripts/glycemic-load-model.ts','site/scripts/nutrition-model.ts'];
 for(const p of shared){
  if(p==='docs/nutrition/food-records.json')verifyFoodinRecord(read(root,p),sources.sourceFilesLfSha256[p]);
  else if(textHash(text(root,p))!==sources.sourceFilesLfSha256[p])throw Error('Pad shared evidence changed: '+p);
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
