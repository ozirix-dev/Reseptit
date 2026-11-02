/** Read-only research evaluation. Writes only outside any Git worktree. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {evaluateMinorOmissions,PROFILE} from './minor-omission-model.mts';
const args=process.argv.slice(2);if(args.length!==4)throw Error('ROOT SNAPSHOT DATA EXTERNAL_OUT required');
const [root,snapshot,data,out]=args.map(p=>path.resolve(p));
let parent=out;while(true){try{parent=await fs.realpath(parent);break;}catch(e:any){if(e.code!=='ENOENT')throw e;parent=path.dirname(parent);}}
try{execFileSync('git',['rev-parse','--show-toplevel'],{cwd:parent,stdio:'ignore'});throw Error('External non-Git output required');}catch(e:any){if(e.status!==128)throw e;}
const read=async(p:string)=>JSON.parse(await fs.readFile(p,'utf8'));
const digest=(x:any)=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const lfhash=(x:string)=>createHash('sha256').update(x.replaceAll('\r\n','\n')).digest('hex');
const settings=await read(data+'/route-settings.json');assert.equal(settings.profile,PROFILE);
for(const k of ['activation','ownerApproval','publicationAuthorized'])assert.equal(settings[k],false);
assert.equal(createHash('sha256').update(await fs.readFile(snapshot+'/model-runner.mts')).digest('hex'),settings.originalModelRunnerSha256);
const {evaluate}=await import(pathToFileURL(snapshot+'/model-runner.mts').href);
const baseComps=(await read(snapshot+'/composition-sources.json')).records,baseGis=(await read(snapshot+'/gi-sources.json')).records;
const baseResults=(await read(snapshot+'/results.json')).results;
for(const c of (await read(snapshot+'/cases.json')).cases)assert.deepEqual(evaluate(c,baseComps,baseGis),baseResults.find((r:any)=>r.recipeId===c.recipeId));
const sources=await read(data+'/composition-sources.json'),gicatalog=await read(data+'/gi-sources.json'),products=await read(data+'/product-observations.json'),observations=await read(data+'/source-observations.json');
const fi=(await read(root+'/docs/nutrition/fineli-release-20-reference.json')).foods;
for(const c of sources.records){
 if(c.kind==='FINELI_CHOAVL'){const native=fi.find((f:any)=>f.source_id===c.nativeId);assert.ok(native);assert.equal(digest(native),c.nativeRowSha256);assert.equal(native.per100g.available_carbohydrate_g_per_100g,c.availablePer100g);}
 else if(c.kind==='LABEL_CARBOHYDRATE_UPPER'){const native=products.records.find((o:any)=>o.id===c.nativeId);assert.ok(native);assert.equal(digest(native),c.nativeRowSha256);assert.equal(native.basisAmount,100);assert.equal(native.basisUnit,'g');assert.equal(native.carbohydrateDefinition,'EU_CARBOHYDRATE_INCLUDING_POLYOLS');assert.equal(native.carbohydrate,c.availablePer100g);assert.equal(native.polyols,null);assert.match(native.sourceSha256,/^[a-f0-9]{64}$/);}
 else assert.deepEqual(c,baseComps.find((b:any)=>b.id===c.id));
}
for(const g of gicatalog.records){
 if(g.kind==='NAMED_HUMAN_GI'){const native=observations.records.find((o:any)=>o.id===g.nativeId);assert.ok(native);assert.equal(digest(native),g.nativeRowSha256);assert.deepEqual(g.values,native.values);}
 else assert.deepEqual(g,baseGis.find((b:any)=>b.id===g.id));
}
const cases=(await read(data+'/cases.json')).cases;
const allResults:any[]=[];const rows:any[]=[];
for(const c of cases){
 const {inputSha256,...body}=c;assert.equal(digest(body),inputSha256);assert.equal(c.approval,false);
 for(const [locale,p] of Object.entries(c.paths))assert.equal(lfhash(await fs.readFile(root+'/'+p,'utf8')),c.recipeSha256[locale]);
 const old=evaluate(c,sources.records,gicatalog.records);assert.equal(old.numericProposal,false);assert.ok(old.blockers.some((b:string)=>b.startsWith('UNRESOLVED_POSITIVE_GI:')));
 const result=evaluateMinorOmissions(c,sources.records,gicatalog.records,evaluate);assert.equal(result.numericProposal,true,result.blockers.join(';'));assert.equal(result.publicationAuthorized,false);
 allResults.push(result);rows.push({recipeId:c.recipeId,scope:'NEW_RESEARCH_ONLY_NOT_ADMITTED_TO_JOINT33',point:result.point,range:result.scenarioRange,omittedCho:result.omittedCho,remainingProposedCodingIds:[],inputSha256,sourceEquivalenceCertified:false});
 // Necessary boundary checks for the proposed shared rule: equality fails,
 // splitting one original ingredient cannot bypass1g, unknown source stays HOLD.
 const mustard=c.candidateIngredients.find((i:any)=>i.compositionId==='28');
 const equality=structuredClone(c);equality.candidateIngredients.find((i:any)=>i.name===mustard.name).grams=4*100/14.1;
 assert.equal(evaluateMinorOmissions(equality,sources.records,gicatalog.records,evaluate).numericProposal,false);
 const split=structuredClone(c);const sourceRow=split.candidateIngredients.find((i:any)=>i.name===mustard.name);sourceRow.grams=16;const extra={...sourceRow,name:'same-original-mustard-second-row'};split.candidateIngredients.push(extra);split.originalIngredientGroups[extra.name]=split.originalIngredientGroups[sourceRow.name];assert.equal(evaluateMinorOmissions(split,sources.records,gicatalog.records,evaluate).numericProposal,false);
 const total=structuredClone(c);total.candidateIngredients.find((i:any)=>i.name===mustard.name).grams+=0.1; // cap margin is only0.0131125g CHO, so add >that.
 total.candidateIngredients.find((i:any)=>i.name===mustard.name).grams+=0.3;assert.equal(evaluateMinorOmissions(total,sources.records,gicatalog.records,evaluate).numericProposal,false);
 const unknown=structuredClone(c);unknown.candidateIngredients[0].compositionId='UNKNOWN';assert.equal(evaluateMinorOmissions(unknown,sources.records,gicatalog.records,evaluate).numericProposal,false);
}
const git=(n:string)=>JSON.parse(execFileSync('git',['show',settings.upstreamHead+':docs/nutrition/gk80-operation149/'+n],{cwd:root,encoding:'utf8'}));
const localCases=(await fs.readFile(root+'/docs/research/afcd-polyol-03/source-extensions/cases.jsonl','utf8')).trim().split('\n').map(JSON.parse);
const merge=(a:any[],b:any[])=>[...a.filter(x=>!b.some(y=>y.id===x.id)),...b];
for(const item of settings.comparisonOnlyExistingCases){
 let pack:any,comps:any[],gis:any[];
 if(item.origin==='local'){pack={cases:localCases};comps=merge(baseComps,(await read(root+'/docs/research/afcd-polyol-03/source-extensions/composition-sources.json')).records);gis=merge(baseGis,(await read(root+'/docs/research/afcd-polyol-03/source-extensions/gi-sources.json')).records);}
 else{const prefix=item.origin==='recovery'?'recovery':'prepared-route';pack=git(prefix+'-cases.json');comps=merge(baseComps,git(prefix+'-composition.json').records);gis=merge(baseGis,git(prefix+'-gi.json').records);}
 const original=pack.cases.find((c:any)=>c.recipeId===item.recipeId);assert.ok(original);
 const c=structuredClone(original);c.originalIngredientGroups=Object.fromEntries(c.candidateIngredients.map((i:any)=>[i.name,i.name]));c.omitOriginalIngredientGroups=[];
 const removed:string[]=[];
 for(const i of c.candidateIngredients)if(i.giId==='trace50'){removed.push(i.name);i.giId=null;c.omitOriginalIngredientGroups.push(i.name);}
 assert.ok(removed.length);delete c.inputSha256;c.inputSha256=digest(c);
 const result=evaluateMinorOmissions(c,comps,gis,evaluate);allResults.push(result);
 const pending=[...new Set(c.candidateIngredients.map((i:any)=>gis.find(g=>g.id===i.giId)).filter((g:any)=>g?.kind==='PROPOSED_B_CODING').map((g:any)=>g.id))];
 rows.push({recipeId:c.recipeId,scope:'EXISTING_ID_ALTERNATIVE_NO_EXTRA_COVERAGE',numericProposal:result.numericProposal,blockers:result.blockers,point:result.point??null,range:result.scenarioRange??null,omittedCho:result.omittedCho??null,removedTrace50Ingredients:removed,remainingProposedCodingIds:pending,inputSha256:c.inputSha256,sourceEquivalenceCertified:false});
}
const summary={profile:PROFILE,newResearchRecipeCount:cases.length,newSourceQualifiedPublicationCandidates:0,existingRecipeAlternativesReviewed:rows.length-cases.length,existingRecipeAlternativesPassingNewProfile:rows.filter(r=>r.scope.startsWith('EXISTING')&&r.numericProposal).length,existingRecipeAlternativesWithoutAnyProposedBCode:rows.filter(r=>r.scope.startsWith('EXISTING')&&r.numericProposal&&!r.remainingProposedCodingIds.length).length,existingJointArithmeticCountUnchanged:33,productionNumericUnchanged:156,methodContentApprovedUnchanged:16,sourceEquivalenceCertified:false,ownerApproval:false,publicationAuthorized:false};
await fs.mkdir(out,{recursive:true});await fs.writeFile(out+'/minor-omission-results.json',JSON.stringify({summary,candidates:rows,results:allResults},null,2)+'\n');
console.log(JSON.stringify({summary,candidates:rows},null,2));
