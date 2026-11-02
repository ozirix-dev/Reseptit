/** Closed current-A replay: ROOT DATA CACHE EXTERNAL_OUT. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [ra,da,ca,oa]=process.argv.slice(2);if(!oa)throw Error('ROOT DATA CACHE EXTERNAL_OUT');
const root=resolve(ra),data=resolve(da),cache=resolve(ca),out=resolve(oa),sha=(b:any)=>createHash('sha256').update(b).digest('hex'),lf=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),read=(p:string)=>JSON.parse(lf(p));
let parent=out;while(!existsSync(parent))parent=dirname(parent);let inside=false;try{inside=execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true';}catch{}if(inside)throw Error('External output only');
const s=read(join(data,'sources.json')),p=read(join(data,'cases.json'));if(s.activation||s.ownerApproval||p.activation||p.ownerApproval||p.publicationAuthorized||p.profile!=='EXISTING_A_STRICT_1_AND_2')throw Error('Closed current-A research only');
for(const [f,h] of Object.entries(s.sourceFilesLfSha256))if(sha(lf(join(root,f)))!==h)throw Error('Native source/engine seal '+f);
for(const x of s.pdfs)if(sha(readFileSync(join(cache,x.file)))!==x.rawSha256)throw Error('PDF seal');
for(const x of s.products){if(x.basis!=='PER_100_G_AS_SOLD'||x.availablePoint!==null||x.polyols!==null||x.subtractFibre||!x.nominalOnlyNotLotBound)throw Error('Product cap semantics');if(x.rawFile?sha(readFileSync(join(cache,x.rawFile)))!==x.rawSha256:x.rawSha256!==null||!x.rawFetchStatus.startsWith('WEB_REVIEWED_NO_RAW_SEAL'))throw Error('Product capture seal');}
const fin=read(join(root,'docs/nutrition/fineli-release-20-reference.json')).foods,af=read(join(root,'docs/nutrition/afcd-release-3-reference.json')).foods,ng=read(join(root,'docs/nutrition/glycemic-index-records.json')).records;
const byComp=new Map(s.composition.map((f:any)=>[f.id,f]));
for(const f of s.composition){if(f.kind==='FINELI_CHOAVL'){const n=fin.find((a:any)=>a.source_id===f.nativeId);if(n?.per100g.available_carbohydrate_g_per_100g!==f.availablePer100g||n.process!==f.process||JSON.stringify(n.portion_mass_g)!==JSON.stringify(f.portionMasses))throw Error('Fineli native value/measure');}else if(f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'){const n=af.find((a:any)=>a.source_id===f.nativeId);if(n?.available_carbohydrate_without_sugar_alcohols_g_per_100g!==f.availablePer100g||n.name!==f.name)throw Error('AFCD native value/state');}else if(f.kind==='LABEL_UPPER_PER100G'){const x=s.products.find((a:any)=>a.id===f.observationId);if(x?.declaredCarbohydrate!==f.declaredCarbohydrate||f.availablePoint!==null||f.polyols!==null)throw Error('Never a label nutrient point');}else if(f.kind!=='PHYSICAL_MASS_UPPER')throw Error('Unsupported source type');}
const foods=s.composition.filter((f:any)=>Number.isFinite(f.availablePer100g)).map((f:any)=>({id:f.id,name:f.name,sourceUrl:'native:'+f.id,retrievedAt:'2026-11-02',licence:'Sealed reference',state:f.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.availablePer100g}}));
const records=s.giBindings.map((g:any)=>{if(g.kind==='EXISTING_PUBLISHED_CODING'){const n=ng.find((a:any)=>a.id===g.nativeId);if(n?.gi!==40||n.evidenceKind!=='PUBLISHED_IMPUTATION'||n.calculationUse==='REFERENCE_ONLY')throw Error('Existing vegetable policy only');return n;}if(g.kind!=='NAMED_HUMAN_GI'||g.reference!=='GLUCOSE_100_2_H'||g.iso26642Confirmed||!s.pdfs.some((x:any)=>x.file===g.pdf&&x.visualPagesChecked.includes(g.pdfPage)))throw Error('Named analogue source');return {id:g.id,gi:g.gi,foodKey:g.id,preparationKey:g.id,food:g.food,preparation:g.note,qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:'HUMAN_GI',source:{title:'Atkinson et al2021, '+g.food,url:g.sourceUrl,table:g.pdf+' p'+g.pdfPage+' item'+g.item,year:2021,published:true,participants:g.healthyParticipants,referenceFood:'Glucose',testDurationHours:2,iso26642Confirmed:false,qualityEvidence:g.note},note:g.note};});
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
const close=(a:number,b:number)=>Math.abs(a-b)<1e-10;
function evaluate(c:any,sc:any){
 const rows=c.candidateIngredients,original=c.originalIngredients;
 if(c.approval||c.publicationAuthorized||c.servings!==4||c.level!=='A')throw Error('Case scope');
 for(const [ix,o] of original.entries()){const rs=rows.filter((x:any)=>x.originalIndex===ix);if(!rs.length||o.unit==='g'&&(rs.length!==1||rs[0].grams!==o.amount))throw Error('Original ingredient missing or original grams changed');}
 const additions=rows.filter((i:any)=>i.originalIndex===null);
 if(c.recipeId==='kana-tagine-sitruunalla'?(additions.length!==2||additions[0].grams!==200||additions[0].giId!=='couscous65'||additions[1].grams!==300||additions[1].compositionId!=='922'):additions.length!==0)throw Error('Complete original serving choice required');
 const stock=rows.filter((i:any)=>i.compositionId==='bong-kanafondi');if(stock.length){const water=rows.find((i:any)=>i.originalIndex===stock[0].originalIndex&&i.compositionId==='922');const expected=c.recipeId==='paella-valenciana'?[50,950]:[15,285];if(stock.length!==1||stock[0].grams!==expected[0]||water?.grams!==expected[1])throw Error('Exact weighed concentrate and water');}
 const ingredients:any[]=[],terms:any[]=[],groups=new Map<number,number>();let omitted=0,nominal=0,physical=0,pointOmitted=0;
 for(const [ix,row] of rows.entries()){
  const i={...row,compositionId:sc.compositionOverrides[ix]??row.compositionId},f:any=byComp.get(i.compositionId),g=s.giBindings.find((x:any)=>x.id===i.giId);
  if(!f||!Number.isFinite(i.grams)||i.grams<0||i.grams===0&&!i.note.startsWith('ZERO_CHO_SENTINEL')||i.giId&&!g)throw Error('Complete quantity/source binding');
  const label=f.kind==='LABEL_UPPER_PER100G',mass=f.kind==='PHYSICAL_MASS_UPPER',cap=label||mass;
  if(cap!== (i.carbohydrateUse==='UPPER_BOUND')||cap&&g||g&&!g.allowedCompositionIds.includes(f.id))throw Error('Cap cannot be point or coded GI');
  const cho=i.grams*(mass?100:label?f.declaredCarbohydrate:f.availablePer100g)/100/c.servings;
  if(!g&&cho>0){if(cho>=1)throw Error('A single omission must be <1');omitted+=cho;groups.set(i.originalIndex,(groups.get(i.originalIndex)??0)+cho);if(label)nominal+=cho;else if(mass)physical+=cho;else pointOmitted+=cho;}
  const gr=g?records.find((x:any)=>x.id===(g.nativeId??g.id)):null;
  ingredients.push(cap?{name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,excludedReason:'Known conservative omission cap; not GI0',availableCarbohydrateUpperBoundPerServingG:cho,upperBoundEvidence:i.note,negligibleAssumption:i.note}:{name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:gr?.id??null,foodKey:gr?.foodKey,preparationKey:gr?.preparationKey,massEvidence:i.note,giMatchEvidence:c.preparationDecision});
  terms.push({ingredientIndex:ix,compositionId:f.id,choPerServing:cho,choSemantics:label?'NOMINAL_LABEL_CAP':mass?'PHYSICAL_CAP':'NATIVE_POINT',giId:i.giId,gk:g?cho*g.gi/100:null});
 }
 if(omitted>=2||[...groups.values()].some(x=>x>=1))throw Error('A aggregate/original ingredient group gate');
 const v=calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,records);
 if(v.status!=='CALCULATED'||v.blockers.length||!close(v.omittedAvailableCarbohydratePerServingG,omitted)||!close(v.omittedAvailableCarbohydrateUpperBoundPerServingG,nominal+physical))throw Error(c.recipeId+': current A engine mismatch '+v.blockers.join(';'));
 return {scenarioId:sc.id,unrounded:v.unroundedGlycemicLoadPerServing,point:v.glycemicLoadPerServing,omittedChoOrCap:omitted,nominalLabelCap:nominal,physicalMassCap:physical,nativePointOmitted:pointOmitted,maxOmittedOriginalGroup:Math.max(...groups.values()),terms};
}
const results=[];
for(const c of p.cases){const {inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256)throw Error('Case seal');for(const [loc,path] of Object.entries(c.paths))if(sha(lf(join(root,path as string)))!==c.recipeSha256Lf[loc])throw Error('Recipe/locale seal');const scenarios=c.scenarios.map((sc:any)=>evaluate(c,sc)),min=Math.min(...scenarios.map((a:any)=>a.unrounded)),max=Math.max(...scenarios.map((a:any)=>a.unrounded));results.push({recipeId:c.recipeId,inputSha256,currentAArithmeticPass:true,sourceAdmission:'EXACT_OWNER_REVIEW_REQUIRED',point:scenarios[0].point,omittedChoOrCap:scenarios[0].omittedChoOrCap,conditionalSourceScenarioEnvelope:scenarios.length>1?{min,max,integerMin:Math.floor(min),integerMax:Math.ceil(max),scope:'CALCULATED_PART_ONLY',isWholeMealBound:false}:null,ownerApproved:false,publicationAuthorized:false,scenarios});}
const reject=(name:string,c:any)=>{try{evaluate(c,c.scenarios[0]);throw Error('Unexpected admission');}catch(e:any){if(e.message==='Unexpected admission')throw e;return {control:name,status:'REJECTED',reason:e.message};}};
let bad=structuredClone(p.cases[1]);bad.candidateIngredients=bad.candidateIngredients.filter((i:any)=>i.originalIndex!==null);const controls=[reject('MISSING_COUSCOUS_SIDE',bad)];bad=structuredClone(p.cases[0]);bad.candidateIngredients[4].carbohydrateUse='AVAILABLE_POINT';controls.push(reject('LABEL_CAP_AS_NUTRIENT_POINT',bad));
mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify({activation:false,ownerApproval:false,results,controls},null,2)+'\n');console.log(JSON.stringify(results.map(({scenarios,...a}:any)=>({...a,scenarioCount:scenarios.length,maxOmittedOriginalGroup:scenarios[0].maxOmittedOriginalGroup}))));
