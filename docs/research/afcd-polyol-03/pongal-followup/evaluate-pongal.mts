/** Closed research replay: ROOT DATA CACHE EXTERNAL_OUT. No active registry writes. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [ra,da,ca,oa]=process.argv.slice(2);if(!oa)throw Error('ROOT DATA CACHE EXTERNAL_OUT');
const root=resolve(ra),data=resolve(da),cache=resolve(ca),out=resolve(oa),sha=(b:any)=>createHash('sha256').update(b).digest('hex'),lf=(p:string)=>readFileSync(p,'utf8').replaceAll('\r\n','\n'),read=(p:string)=>JSON.parse(lf(p));
let parent=out;while(!existsSync(parent))parent=dirname(parent);try{if(execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:parent,stdio:['ignore','pipe','ignore']}).toString().trim()==='true')throw Error('Only external output');}catch(e:any){if(e.message==='Only external output')throw e;}
const s=read(join(data,'sources.json')),p=read(join(data,'cases.json'));if(s.activation||s.ownerApproval||p.activation||p.ownerApproval||p.publicationAuthorized||p.displayPolicy.roundingStep!==1||p.cases.length!==1)throw Error('Closed one-case research');
for(const [f,h] of Object.entries(s.sourceFilesLfSha256))if(sha(lf(join(root,f)))!==h)throw Error('Native source/engine seal');
const pinned=s.pinnedGitFiles.map((a:any)=>{const text=execFileSync('git',['show',a.commit+':'+a.path],{cwd:root,encoding:'utf8'}).replaceAll('\r\n','\n');if(sha(text)!==a.lfSha256)throw Error('Pinned source seal');return JSON.parse(text);});
for(const e of s.externalSources)if(sha(readFileSync(join(cache,e.rawFile)))!==e.rawSha256)throw Error('External primary source seal');
const fin=read(join(root,'docs/nutrition/fineli-release-20-reference.json')).foods,af=read(join(root,'docs/nutrition/afcd-release-3-reference.json')).foods;
for(const f of s.composition){if(f.kind==='FINELI_CHOAVL'){const n=fin.find((a:any)=>a.source_id===f.nativeId);if(n?.per100g.available_carbohydrate_g_per_100g!==f.availablePer100g||n.process!==f.process||JSON.stringify(n.portion_mass_g)!==JSON.stringify(f.portionMasses))throw Error('Native Fineli CHO/quantity');}else if(f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'){const n=af.find((a:any)=>a.source_id===f.nativeId);if(n?.available_carbohydrate_without_sugar_alcohols_g_per_100g!==f.availablePer100g||n.name!==f.name)throw Error('Native AFCD CHO/food state');}else throw Error('Unsupported native source');}
for(const g of s.giBindings){if(g.id==='mung31.43'){const e=s.externalSources.find((a:any)=>a.id==='pirasath2012');if(g.values[0]!==31.43||e.selectedFacts.gi!==31.43||e.selectedFacts.participants!==22||e.selectedFacts.iso26642Confirmed||e.selectedFacts.repeatedGlucoseConfirmed)throw Error('Old reported reference limitations');}else {const n=pinned.flatMap((a:any)=>a.records??[]).find((a:any)=>a.id===g.id);if(!n||JSON.stringify(n.values)!==JSON.stringify(g.values)||n.locator!==g.locator)throw Error('Named published source identity');}}
const foods=s.composition.map((f:any)=>({id:f.id,name:f.name,sourceUrl:'native:'+f.id,retrievedAt:'2026-11-02',licence:'Sealed source catalog',state:f.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:f.availablePer100g}}));
const {calculateGlycemicLoad}=await import(pathToFileURL(join(root,'site/scripts/glycemic-load-model.ts')).href);
function evaluate(c:any,a:any){
 if(c.recipeId!=='intialainen-ven-pongal'||c.level!=='B'||c.servings!==2||c.approval||c.publicationAuthorized||c.candidateIngredients.length!==7||JSON.stringify(c.originalIndexByCandidate)!==JSON.stringify([0,1,2,3,4,5,6]))throw Error('Exact closed two-serving version');
 if(!['F007682','11521'].includes(a.riceCompositionId)||![31.43,42].includes(a.mungGi)||![22,27].includes(a.cashewGi))throw Error('Named scenario endpoints only');
 if(c.candidateIngredients[1].compositionId!=='F000446'||c.candidateIngredients[5].compositionId!=='F004205'||c.candidateIngredients[5].grams!==14)throw Error('Whole dry mung and weighed14g ghee');
 const ingredients:any[]=[],terms:any[]=[],records:any[]=[];let trace=0;
 for(const [ix,o] of c.candidateIngredients.entries()){
  const i={...o,compositionId:ix===0?a.riceCompositionId:o.compositionId},f=s.composition.find((f:any)=>f.id===i.compositionId),orig=c.originalIngredients[c.originalIndexByCandidate[ix]];
  if(!f||!Number.isFinite(i.grams)||i.grams<0||orig.unit==='g'&&i.grams!==orig.amount)throw Error('Original grams/quantity/source');
  if(ix===3&&(i.grams!==2||f.portionMasses.TL!==2)||ix===4&&(i.grams!==700||f.portionMasses.DL!==100)||ix===6&&(i.grams!==0||f.availablePer100g!==0))throw Error('Native portion or zero-CHO sentinel');
  const cho=i.grams*f.availablePer100g/100/c.servings,gid=ix===1?(a.mungGi===42?'mung42':'mung31.43'):i.giId,g=s.giBindings.find((g:any)=>g.id===gid);
  if(cho>0&&!g||g&&!g.allowedCompositionIds.includes(f.id))throw Error('Positive B contribution needs reviewed GI');
  const gi=ix===1?a.mungGi:ix===2?a.cashewGi:g?.values[0];
  if(g?.id==='trace50'){if(cho>.5)throw Error('Trace per-ingredient bound');trace+=cho;}
  const id=g?g.id+'_'+gi:null;
  if(g&&!records.some(a=>a.id===id))records.push({id,gi,foodKey:id,preparationKey:id,food:g.id,preparation:g.locator,qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:g.id==='trace50'?'PUBLISHED_IMPUTATION':'HUMAN_GI',source:{title:g.id,url:g.sourceUrl,table:g.locator,year:g.id==='mung31.43'?2012:g.id==='trace50'?2007:2021,published:true,iso26642Confirmed:false,qualityEvidence:g.limitation},note:g.limitation});
  ingredients.push({name:i.name,grams:i.grams,fineliRecordId:f.id,giRecordId:id,foodKey:id??undefined,preparationKey:id??undefined,massEvidence:i.note,giMatchEvidence:c.preparationDecision});terms.push({name:i.name,compositionId:f.id,grams:i.grams,choPerServing:cho,giId:gid,gi:gi??null,gk:cho>0?cho*gi/100:0});
 }
 if(trace>1)throw Error('Trace aggregate bound');
 const v=calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,records);if(v.status!=='CALCULATED'||v.blockers.length||v.omittedAvailableCarbohydratePerServingG!==0)throw Error('Strict B failed '+v.blockers.join(';'));
 const point=v.unroundedGlycemicLoadPerServing!,pepper=terms[3].gk;
 return {scenarioId:a.id,unrounded:point,point:v.glycemicLoadPerServing,omittedCho:0,traceCodedCho:trace,terms,pepperAssumptionSensitivityOnly:{gi:[0,150],min:point-pepper,max:point-pepper+1.5*trace,isSourceInterval:false,isBiologicalBound:false}};
}
const c=p.cases[0],{inputSha256,...body}=c;if(sha(JSON.stringify(body))!==inputSha256)throw Error('Input seal');for(const [loc,path] of Object.entries(c.paths))if(sha(lf(join(root,path as string)))!==c.recipeSha256[loc]&&sha(readFileSync(join(root,path as string)))!==c.recipeSha256[loc])throw Error('Original recipe seal');
const scenarios=c.scenarios.map((a:any)=>evaluate(c,a)),min=Math.min(...scenarios.map((a:any)=>a.unrounded)),max=Math.max(...scenarios.map((a:any)=>a.unrounded)),controls:any[]=[];
function reject(name:string,c:any,a:any){try{evaluate(c,a);throw Error('Unexpected admission');}catch(e:any){if(e.message==='Unexpected admission')throw e;controls.push({control:name,status:'REJECTED',reason:e.message});}}
let bad=structuredClone(c);bad.candidateIngredients[1].compositionId='31213';reject('COOKED_COMPOSITION_CANNOT_USE_DRY150G',bad,c.scenarios[0]);bad=structuredClone(c);bad.candidateIngredients[2].grams=100;reject('CASHEW_STALE100G_CANNOT_REPLACE_ORIGINAL20G',bad,c.scenarios[0]);bad=structuredClone(c);bad.candidateIngredients[3].giId=null;reject('B_PEPPER_POSITIVE_CHO_CANNOT_BE_OMITTED',bad,c.scenarios[0]);reject('PONGAL45_OR_DIABETIC90_NOT_MUNG_ENDPOINT',c,{...c.scenarios[0],mungGi:45});
const result={activation:false,ownerApproval:false,recipeId:c.recipeId,inputSha256,currentStrictBArithmeticPass:true,currentSourceAdmission:'EXACT_OWNER_REVIEW_REQUIRED',ownerApproved:false,publicationAuthorized:false,sourceScenarioEnvelope:{min,max,isConfidenceInterval:false,isBiologicalBound:false,analogyErrorQuantified:false},displayProposal:{min:Math.floor(min),max:Math.ceil(max),label:`GK-arvio ${Math.floor(min)}–${Math.ceil(max)} · mallinnettu`,activation:false},omittedCho:0,scenarios,controls};mkdirSync(out,{recursive:true});writeFileSync(join(out,'engine-results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,scenarios:scenarios.length}));
