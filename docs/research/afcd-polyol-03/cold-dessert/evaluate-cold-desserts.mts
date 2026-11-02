/** Closed A-version review: ROOT DATA CACHE EXTERNAL_OUT. No registry/recipe writes. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [ra,da,ca,oa]=process.argv.slice(2);if(!oa)throw Error('ROOT DATA CACHE EXTERNAL_OUT');
const root=resolve(ra),data=resolve(da),cache=resolve(ca),out=resolve(oa),sha=(b:any)=>createHash('sha256').update(b).digest('hex'),lf=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),read=(p:string)=>JSON.parse(lf(p));
let parent=out;while(!existsSync(parent))parent=dirname(parent);let inside=false;try{inside=execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true';}catch{}if(inside)throw Error('External output required');
const s=read(join(data,'sources.json')),p=read(join(data,'cases.json'));if(s.activation||s.ownerApproval||p.activation||p.ownerApproval)throw Error('Research must stay closed');
for(const [f,h] of Object.entries(s.sourceFilesLfSha256))if(sha(lf(join(root,f)))!==h)throw Error('Native file seal '+f);
const pinned=s.pinnedGitFiles.map((a:any)=>{const text=execFileSync('git',['show',a.commit+':'+a.path],{cwd:root,encoding:'utf8'}).replaceAll('\r\n','\n');if(sha(text)!==a.lfSha256)throw Error('Pinned historical source');return JSON.parse(text);});
for(const o of [...s.products,s.externalPdf])if(sha(readFileSync(join(cache,o.rawFile)))!==o.rawSha256)throw Error('External raw seal');
const fin=read(join(root,'docs/nutrition/fineli-release-20-reference.json')).foods,af=read(join(root,'docs/nutrition/afcd-release-3-reference.json')).foods,nativeGi=read(join(root,'docs/nutrition/glycemic-index-records.json')).records,nativeFood=read(join(root,'docs/nutrition/food-records.json'));
for(const f of s.composition){
 if(f.kind==='FINELI_CHOAVL'){const a=fin.find((a:any)=>a.source_id===f.nativeId);if(a?.per100g.available_carbohydrate_g_per_100g!==f.availablePer100g||JSON.stringify(a.portion_mass_g)!==JSON.stringify(f.portionMasses))throw Error('Fineli quantity/CHO');}
 else if(f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'){if(af.find((a:any)=>a.source_id===f.nativeId)?.available_carbohydrate_without_sugar_alcohols_g_per_100g!==f.availablePer100g)throw Error('AFCD native field');}
 else if(f.kind==='EXPLICIT_LABEL_C_MINUS_P'){const a=nativeFood.find((a:any)=>a.id===f.nativeId);if(!a?.polyolsSourceVerified||a.per100g.carbohydrate!==100||a.per100g.polyols!==100||f.availablePer100g!==0)throw Error('Pure erythritol source');}
 else if(f.kind.startsWith('LABEL_UPPER')){const o=s.products.find((a:any)=>a.id===f.observationId);if(f.availablePoint!==null||f.polyols!==null||f.fibreSubtracted||f.declaredCarbohydrate!==o.declaredCarbohydrate||(f.kind==='LABEL_UPPER_PER100ML')!==(o.basis==='per100ml-as-sold'))throw Error('Label cap cannot be nutrient point');}
 else if(f.kind!=='PHYSICAL_MASS_UPPER')throw Error('Unknown source type');
}
for(const g of s.giBindings){
 if(g.kind==='EXISTING_PUBLISHED_CODING'){const n=nativeGi.find((a:any)=>a.id===g.nativeId);if(n?.gi!==30||g.id!=='dairy30'||n.matchKind==='CATEGORY_MEAN'||n.calculationUse==='REFERENCE_ONLY')throw Error('Existing dairy code');}
 else{const observations=pinned.flatMap((a:any)=>a.records??[]),sourcePoint=g.observation.gi??g.observation.values?.[0],scaleMatches=g.id==='strawberry40'?g.values[0]===40&&g.observation.locator.includes('glucose2h'):g.observation.reportedScale==='GLUCOSE_100';if(g.kind!=='NAMED_HUMAN_GI'||!observations.some((a:any)=>JSON.stringify(a)===JSON.stringify(g.observation))||sourcePoint!==g.values[0]||!scaleMatches)throw Error('Named observation, no second scale conversion');}
}
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
const foods=s.composition.filter((f:any)=>f.availablePer100g!==undefined&&f.availablePer100g!==null).map((f:any)=>({id:f.id,name:f.name,sourceUrl:'native:'+f.id,retrievedAt:'2026-11-02',licence:'Source catalog',state:'Exact cold version',basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.availablePer100g}}));
const records=s.giBindings.map((g:any)=>g.id==='dairy30'?nativeGi.find((a:any)=>a.id===g.nativeId):({id:g.id,gi:g.values[0],foodKey:g.id,preparationKey:g.id,food:g.observation.food??'Raw fresh strawberries',preparation:'Raw named fruit;LOW cultivar/composition analogy',qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:'HUMAN_GI',source:{title:g.observation.food??'Raw fresh strawberries',url:g.sourceUrl,table:g.locator,year:2021,published:true,iso26642Confirmed:false,qualityEvidence:g.limitation},note:g.limitation}));
const results=[];
for(const c of p.cases){
 const {inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256||c.approval||c.publicationAuthorized||c.level!=='A'||c.servings!==4)throw Error('Case scope/hash');
 for(const [loc,path] of Object.entries(c.paths)){const f=join(root,path as string);if(sha(lf(f))!==c.recipeSha256[loc]&&sha(readFileSync(f))!==c.recipeSha256[loc])throw Error('Original recipe seal');}
 const ingredients:any[]=[],terms:any[]=[];let omitted=0,covered=0;
 for(const [ix,i] of c.candidateIngredients.entries()){
  const f=s.composition.find((a:any)=>a.id===i.compositionId),g=s.giBindings.find((a:any)=>a.id===i.giId),o=p.originalIngredientsByRecipe[c.recipeId][p.originalIndexByCandidate[c.recipeId][ix]];
  if(!f||o.unit==='g'&&i.grams!==o.amount||f.kind==='LABEL_UPPER_PER100ML'&&(i.millilitres!==o.amount||o.unit!=='ml'||i.grams!==undefined))throw Error('Original quantity/source unit changed');
  const isCap=f.kind.startsWith('LABEL_UPPER')||f.kind==='PHYSICAL_MASS_UPPER',q=f.kind==='LABEL_UPPER_PER100ML'?i.millilitres:i.grams;
  if(!Number.isFinite(q)||q<0||q===0&&!i.note.startsWith('ZERO_CHO_SENTINEL'))throw Error('Unknown quantity');
  const cho=f.kind==='PHYSICAL_MASS_UPPER'?q/c.servings:isCap?q*f.declaredCarbohydrate/100/c.servings:q*f.availablePer100g/100/c.servings;
  if(isCap!== (i.carbohydrateUse==='UPPER_BOUND')||isCap&&g||g&&!g.allowedCompositionIds.includes(f.id))throw Error('Cap/GI binding');
  if(!g&&cho>0){if(cho>=1)throw Error('A single omission fails');omitted+=cho;}else if(g)covered+=cho;
  const gr=g?records.find((a:any)=>a.id===(g.nativeId==='op142-dairy-imputation30'?g.nativeId:g.id)):null;
  ingredients.push(isCap?{name:i.name,grams:f.kind==='LABEL_UPPER_PER100ML'?null:q,fineliRecordId:null,giRecordId:null,excludedReason:'Positive unknownGI, conservative nominal upper',availableCarbohydrateUpperBoundPerServingG:cho,upperBoundEvidence:i.note,negligibleAssumption:i.note}:{name:i.name,grams:q,fineliRecordId:f.id,giRecordId:gr?.id??null,foodKey:gr?.foodKey,preparationKey:gr?.preparationKey,massEvidence:i.note,giMatchEvidence:c.preparationDecision});
  terms.push({name:i.name,compositionId:f.id,quantity:q,unit:f.kind==='LABEL_UPPER_PER100ML'?'ml':'g',choMin:isCap?0:cho,choMax:cho,giId:i.giId,isNominalUpper:f.kind.startsWith('LABEL_UPPER'),isPhysicalUpper:f.kind==='PHYSICAL_MASS_UPPER',gk:g?cho*g.values[0]/100:null});
 }
 if(omitted>=2)throw Error('A cumulative omissions fail');
 const result=calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,records);if(result.status!=='CALCULATED'||result.blockers.length)throw Error(c.recipeId+': '+result.blockers.join(';'));
 results.push({recipeId:c.recipeId,inputSha256,classification:p.classification[c.recipeId],currentAArithmeticPass:true,point:result.glycemicLoadPerServing,unrounded:result.unroundedGlycemicLoadPerServing,omittedCho:result.omittedAvailableCarbohydratePerServingG,omittedUpper:result.omittedAvailableCarbohydrateUpperBoundPerServingG,coveredCho:covered,omittedChoIsActualPoint:false,ownerApproved:false,publicationAuthorized:false,terms,assumptionSensitivityOnly:{gi:[0,150],min:c.recipeId==='kaakao-kookos-chia'?0:result.unroundedGlycemicLoadPerServing-(1.875+1.0745)*.3,max:c.recipeId==='kaakao-kookos-chia'?(covered+omitted)*1.5:result.unroundedGlycemicLoadPerServing-(1.875+1.0745)*.3+(1.875+1.0745+omitted)*1.5,isSourceBound:false,isBiologicalBound:false,isConfidenceInterval:false}});
}
mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify({activation:false,ownerApproval:false,results},null,2)+'\n');console.log(JSON.stringify(results.map(({terms,...r}:any)=>r)));
