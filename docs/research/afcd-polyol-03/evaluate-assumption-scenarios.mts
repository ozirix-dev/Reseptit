// Isolated handoff evaluator. Reuses the pinned Operation149 engine without changing it.
import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {pathToFileURL} from 'node:url';import {execFileSync} from 'node:child_process';
const root=path.resolve(process.argv[2]),snapshot=path.resolve(process.argv[3]),data=path.resolve(process.argv[4]),out=path.resolve(process.argv[5]);
let parent=out;while(true){try{parent=await fs.realpath(parent);break;}catch(e:any){if(e.code!=='ENOENT')throw e;parent=path.dirname(parent);}}try{execFileSync('git',['rev-parse','--show-toplevel'],{cwd:parent,stdio:'ignore'});throw Error('Output must be outside Git');}catch(e:any){if(e.status!==128)throw e;}await fs.mkdir(out,{recursive:true});
const load=async(p:string)=>JSON.parse(await fs.readFile(p,'utf8')),digest=(v:any)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const {evaluate}=await import(pathToFileURL(path.join(snapshot,'model-runner.mts')).href);
const pack=await load(snapshot+'/cases.json'),baseComps=(await load(snapshot+'/composition-sources.json')).records,baseGis=(await load(snapshot+'/gi-sources.json')).records,baseResults=(await load(snapshot+'/results.json')).results;
const method=await load(data+'/method.json'),addedComps=(await load(data+'/composition-overlays.json')).records,addedGis=(await load(data+'/gi-overlays.json')).records,cases=(await fs.readFile(data+'/cases.jsonl','utf8')).trim().split('\n').map(JSON.parse);
assert.equal(method.activation,false);assert.equal(method.ownerApproval,false);assert.equal(method.aMethodChanged,false);assert.equal(method.macroApproval,false);assert.equal(cases.length,4);
const nativeAfcd=(await load(root+'/docs/nutrition/afcd-release-3-reference.json')).foods,nativeFi=(await load(root+'/docs/nutrition/fineli-release-20-reference.json')).foods,nativeGi=(await load(root+'/docs/nutrition/glycemic-index-records.json')).records;
const comps=[...baseComps,...addedComps],gis=[...baseGis.filter((g:any)=>!addedGis.some((a:any)=>a.id===g.id)),...addedGis];
function verifyAddedComposition(c:any){const native=(c.kind==='FINELI_CHOAVL'?nativeFi:nativeAfcd).find((r:any)=>r.source_id===c.nativeId);assert.ok(native);assert.equal(digest(native),c.nativeRowSha256);assert.equal(c.availablePer100g,c.kind==='FINELI_CHOAVL'?native.per100g.available_carbohydrate_g_per_100g:native.available_carbohydrate_without_sugar_alcohols_g_per_100g);}
for(const c of addedComps)verifyAddedComposition(c);
function verifyCoding(g:any){const native=nativeGi.find((r:any)=>r.id===g.nativeId);assert.ok(native);assert.equal(digest(native),g.nativeRowSha256);assert.deepEqual(g.values,[native.gi]);assert.equal(g.kind,'PROPOSED_B_CODING');}
for(const g of addedGis)verifyCoding(g);
assert.throws(()=>verifyAddedComposition({...addedComps[0],availablePer100g:0}),/strict|equal/i);
assert.throws(()=>verifyCoding({...addedGis[0],values:[51]}),/deep|equal/i);
assert.deepEqual(method.sourceCompositionScenarios.map((x:any)=>[x.compositionId,x.availableCho]),[['F006077',5.4],['379',6.6]]);
for(const c of pack.cases){const actual=evaluate(c,comps,gis),before=baseResults.find((r:any)=>r.recipeId===c.recipeId);assert.deepEqual(actual,before,'All existing Operation149 results unchanged: '+c.recipeId);}
const csv=(rows:any[])=>{const k=Object.keys(rows[0]);return [k.join(','),...rows.map(r=>k.map(key=>'"'+String(r[key]??'').replaceAll('"','""')+'"').join(','))].join('\n')+'\n';};
const endpoints=[],results=[];
for(const c of cases){const {inputSha256,...body}=c;assert.equal(digest(body),inputSha256);assert.equal(c.level,'B');assert.equal(c.approval,false);assert.equal(c.macroAction,'PRESERVE_ALL_CURRENT_VALUES_AND_WITHHOLDINGS');assert.ok(pack.selectedRecipeIds.includes(c.recipeId));
 for(const [locale,p] of Object.entries(c.paths)){const text=await fs.readFile(root+'/'+p,'utf8');assert.equal(createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex'),c.recipeSha256[locale]);}
 const almond=c.candidateIngredients.filter((i:any)=>i.compositionId==='F006077');assert.equal(almond.length,1);assert.equal(almond[0].giId,'almond50-b');
 const scenarioResults=[];
 for(const scenario of method.sourceCompositionScenarios){const sc=structuredClone(c);sc.candidateIngredients.find((i:any)=>i.compositionId==='F006077').compositionId=scenario.compositionId;
  const result=evaluate(sc,comps,gis);assert.equal(result.numericProposal,true,result.blockers.join('; '));assert.equal(result.level,'B');assert.equal(result.omittedCho,0);assert.equal(result.unknownGiCho,0);assert.equal(result.publicationAuthorized,false);
  const exact=result.contributions.reduce((s:number,i:any)=>s+i.gkMin,0);scenarioResults.push({...result,exact});endpoints.push({recipeId:c.recipeId,scenario:scenario.id,almondAvailableChoPer100g:scenario.availableCho,almondGrams:almond[0].grams,servings:c.servings,exactGk:exact,giCoding:50,omittedCho:0,publicationAuthorized:false});
 }
 const a=structuredClone(c);a.level='A';for(const i of a.candidateIngredients)if(i.giId==='almond50-b'||i.giId==='trace50')i.giId=null;const aResult=evaluate(a,baseComps,baseGis);assert.equal(aResult.numericProposal,false,'Current A cannot silently approve the new B scenario');
 const missing=structuredClone(c);missing.candidateIngredients.find((i:any)=>i.compositionId==='F006077').giId=null;assert.equal(evaluate(missing,comps,gis).numericProposal,false,'Missing major GI cannot disappear');
 const range={min:Math.min(...scenarioResults.map(r=>r.exact)),max:Math.max(...scenarioResults.map(r=>r.exact))};
 results.push({recipeId:c.recipeId,level:'ASSUMPTION_RESEARCH',numericalScenario:true,eligibleNumericCandidate:false,method:method.id,rangeKind:'SOURCE_COMPOSITION_SCENARIOS_CONDITIONAL_ON_PROPOSED_GI50',gkMin:range.min,gkMax:range.max,unknownPhysiologicalGiError:true,giIsMeasured:false,sourceCaseSha256:c.inputSha256,publicationAuthorized:false,requiredDecisions:c.requiredDecisions.join(';')});
}
const afcdIds=new Set(baseComps.filter((c:any)=>c.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS').map((c:any)=>c.id));const numericIds=new Set(baseResults.filter((r:any)=>r.numericProposal).map((r:any)=>r.recipeId));const overlap=results.filter(r=>numericIds.has(r.recipeId));assert.equal(overlap.length,0);for(const r of results)numericIds.add(r.recipeId);
const baseNumeric=baseResults.filter((r:any)=>r.numericProposal).length;const summary={existing:156,sharedA:baseResults.filter((r:any)=>r.numericProposal&&r.level==='A').length,sharedB:baseResults.filter((r:any)=>r.numericProposal&&r.level==='B').length,additionalSupplementB:0,assumptionResearchCases:results.length,uniqueNewNumericCandidates:baseNumeric,candidateCoverage:156+baseNumeric,denominator:326,percent:Number(((156+baseNumeric)/326*100).toFixed(2)),target30Shortfall:Math.max(0,30-baseNumeric),final80PercentNeeds:261,remainingTo80AfterCandidates:261-(156+baseNumeric),activeNumeric:156,productionActivation:false,newGiAssumptionApproved:false,assumptionCasesCountedToward30:false};
await fs.writeFile(out+'/assumption-scenarios.csv',csv(results));await fs.writeFile(out+'/b-endpoint-checks.csv',csv(endpoints));await fs.writeFile(out+'/joint-summary.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({status:'PASS',summary,results},null,2));
