// Read-only proposal arithmetic; outputs are restricted to external non-Git scratch.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {labelAvailableUpper} from './label-carbohydrate-upper';
import {mextAvailableMass} from './mext-available-source';

const [root,snapshot,data,out]=process.argv.slice(2).map(p=>path.resolve(p));
if (![root,snapshot,data,out].every(Boolean)) throw Error('ROOT SNAPSHOT DATA EXTERNAL_OUT required');
let parent=out;
while (true) {
  try { parent=await fs.realpath(parent);break; }
  catch(e:any) { if(e.code!=='ENOENT') throw e;parent=path.dirname(parent); }
}
try {
  execFileSync('git',['rev-parse','--show-toplevel'],{cwd:parent,stdio:'ignore'});
  throw Error('External scratch output required');
} catch(e:any) { if(e.status!==128) throw e; }
const read=async(p:string)=>JSON.parse(await fs.readFile(p,'utf8'));
const digest=(v:any)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const textHash=(v:string)=>createHash('sha256').update(v.replaceAll('\r\n','\n')).digest('hex');
const {evaluate}=await import(pathToFileURL(snapshot+'/model-runner.mts').href);
const pack=await read(snapshot+'/cases.json');
const baseResults=(await read(snapshot+'/results.json')).results;
const baseComps=(await read(snapshot+'/composition-sources.json')).records;
const baseGis=(await read(snapshot+'/gi-sources.json')).records;
const addedComps=(await read(data+'/composition-sources.json')).records;
const addedGis=(await read(data+'/gi-sources.json')).records;
const observations=await read(data+'/source-observations.json');
const products=await read(data+'/product-observations.json');
const method=await read(data+'/method.json');
const mext=await read(data+'/mext-native-observations.json');
assert.throws(()=>mextAvailableMass(mext,'06236'));
const natto=mextAvailableMass(mext,'04046');assert.equal(natto.availablePer100g,0.3);assert.equal(natto.polyols,null);assert.equal(natto.differenceToken,'(4.8)');
const cases=(await fs.readFile(data+'/cases.jsonl','utf8')).trim().split('\n').map(JSON.parse);
for (const key of ['activation','ownerApproval','readyAuthorized','mergeAuthorized','deployAuthorized','newMainFoodGi50Default','sourceOnlyCoreRulesChanged']) assert.equal(method[key],false,key);
assert.equal(method.baseHead,'7127c0014edd525ac2ced97cf36b3eb511032ae2');
assert.deepEqual(method.newCases,cases.map((c:any)=>({recipeId:c.recipeId,inputSha256:c.inputSha256})));
const afcd=(await read(root+'/docs/nutrition/afcd-release-3-reference.json')).foods;
const fi=(await read(root+'/docs/nutrition/fineli-release-20-reference.json')).foods;
for (const c of addedComps) {
  if(c.kind==='MEXT_CHOAVL_MASS') {
    assert.equal(c.nativeField,'CHOAVL');const native=mext.records.find((r:any)=>r.nativeId===c.nativeId);assert.ok(native);assert.equal(digest(native),c.nativeRowSha256);assert.equal(mextAvailableMass(mext,c.nativeId).availablePer100g,c.availablePer100g);continue;
  }
  if(c.kind==='LABEL_CARBOHYDRATE_UPPER') {
    assert.equal(c.path,'docs/research/afcd-polyol-03/source-extensions/product-observations.json');
    assert.equal(c.nativeField,'carbohydrate');
    const o=products.records.find((o:any)=>o.id===c.nativeId);
    assert.ok(o);assert.equal(digest(o),c.nativeRowSha256);
    const bound=labelAvailableUpper(o,'g');
    assert.equal(bound.availableUpper,c.availablePer100g);assert.equal(bound.totalPolyols,null);
    // Actual rejected source classes: per100ml, unknown CHO and implicit zero.
    assert.throws(()=>labelAvailableUpper({...o,basisUnit:'ml'},'g'));
    assert.throws(()=>labelAvailableUpper({...o,carbohydrate:null},'g'));
    assert.equal(labelAvailableUpper({...o,carbohydrate:0},'g').valueState,'SOURCE_DECLARED_ZERO');
    continue;
  }
  assert.ok(['FINELI_CHOAVL','AFCD_WITHOUT_SUGAR_ALCOHOLS'].includes(c.kind));
  const isFi=c.kind==='FINELI_CHOAVL';
  const native=(isFi?fi:afcd).find((n:any)=>n.source_id===c.nativeId);
  assert.ok(native);assert.equal(digest(native),c.nativeRowSha256);
  assert.equal(c.nativeField,isFi?'per100g.available_carbohydrate_g_per_100g':'available_carbohydrate_without_sugar_alcohols_g_per_100g');
  assert.equal(c.availablePer100g,isFi?native.per100g.available_carbohydrate_g_per_100g:native.available_carbohydrate_without_sugar_alcohols_g_per_100g);
}
for (const g of addedGis) {
  let source:any;
  if(g.path.startsWith('docs/research/afcd-polyol-03/source-extensions/')) source=observations;
  else if(g.path.startsWith('docs/nutrition/gk80-operation149/')) source=await read(snapshot+'/'+path.basename(g.path));
  else source=await read(root+'/'+g.path);
  const native=(Array.isArray(source)?source:source.records).find((n:any)=>n.id===g.nativeId);
  assert.ok(native);assert.equal(digest(native),g.nativeRowSha256);
  assert.deepEqual(g.values,typeof native.gi==='number'?[native.gi]:native.values);
  assert.ok(['NAMED_HUMAN_GI','EXISTING_PUBLISHED_CODING','PROPOSED_B_CODING'].includes(g.kind));
}
const comps=[...baseComps,...addedComps];
const gis=[...baseGis.filter((g:any)=>!addedGis.some((a:any)=>a.id===g.id)),...addedGis];
assert.equal(new Set(comps.map((c:any)=>c.id)).size,comps.length);
assert.equal(new Set(gis.map((g:any)=>g.id)).size,gis.length);
for(const c of pack.cases) assert.deepEqual(evaluate(c,comps,gis),baseResults.find((r:any)=>r.recipeId===c.recipeId),'Existing19 result preserved: '+c.recipeId);
const priority=(await fs.readFile(snapshot+'/hold-screen.csv','utf8')).trim().split('\n');
// The user explicitly selected the existing39 model +38 product/preparation cohort.
const eligibleIds=new Set(priority.slice(1).filter(line=>/^[^,]+,[23],/.test(line)).map(line=>line.split(',')[0]));
assert.equal(eligibleIds.size,77);
const numericIds=new Set(baseResults.filter((r:any)=>r.numericProposal).map((r:any)=>r.recipeId));
const rows:any[]=[],allResults:any[]=[];
for(const c of cases) {
  assert.ok(eligibleIds.has(c.recipeId));assert.ok(!numericIds.has(c.recipeId));
  assert.equal(c.approval,false);assert.equal(c.macroAction,'PRESERVE_ALL_CURRENT_VALUES_AND_WITHHOLDINGS');
  assert.ok(c.requiredDecisions.includes('GK_ONLY_CONTRACT'));
  const {inputSha256,...body}=c;assert.equal(digest(body),inputSha256);
  for(const [locale,p] of Object.entries(c.paths)) assert.equal(textHash(await fs.readFile(root+'/'+p,'utf8')),c.recipeSha256[locale]);
  for(const i of c.candidateIngredients) if(comps.find((f:any)=>f.id===i.compositionId)?.kind==='LABEL_CARBOHYDRATE_UPPER') assert.equal(i.carbohydrateUse,'UPPER_BOUND');
  if(c.recipeId==='japanilainen-dashimaki-tamago-aamiaislautasella') {
    const o=products.records.find((o:any)=>o.id==='hondashi-th-dilution');
    assert.equal(o.powderGrams*o.recipePreparedSoupMl,o.recipePowderGrams*o.preparedSoupMl);
    assert.equal(c.candidateIngredients.find((i:any)=>i.compositionId==='physical').grams,o.recipePowderGrams);
  }
  const r=evaluate(c,comps,gis);assert.equal(r.numericProposal,true,r.blockers.join('; '));
  if(c.level==='B') { assert.equal(r.omittedCho,0);assert.equal(r.unknownGiCho,0); }
  else { assert.ok(r.omittedCho<2);assert.ok(r.unknownGiCho<=r.omittedCho+1e-9); }
  assert.equal(r.publicationAuthorized,false);numericIds.add(c.recipeId);allResults.push(r);
  rows.push({recipeId:c.recipeId,level:c.level,sourcePolicy:c.sourcePolicy??'EXISTING_SOURCE_FAMILIES',point:r.point??'',sourceScenarioMin:r.scenarioRange?.min??'',sourceScenarioMax:r.scenarioRange?.max??'',rangeKind:r.rangeKind,dominantUncertainty:r.dominantUncertainty,omittedCho:r.omittedCho,unknownGiCho:r.unknownGiCho,newMainFoodGi50Default:false,inputSha256:c.inputSha256,publicationAuthorized:false});
}
const total=numericIds.size;
const summary={existingNumeric:156,previousSharedCandidates:16,verifiedExtensionA:cases.filter((c:any)=>c.level==='A').length,verifiedExtensionB:cases.filter((c:any)=>c.level==='B').length,newDistinctBeyondFrozenUpstream17:total-17,totalPreparedCandidates:total,a:baseResults.filter((r:any)=>r.numericProposal&&r.level==='A').length+cases.filter((c:any)=>c.level==='A').length,b:baseResults.filter((r:any)=>r.numericProposal&&r.level==='B').length+cases.filter((c:any)=>c.level==='B').length,aRequiringNewSourceFamily:cases.filter((c:any)=>c.sourcePolicy==='MEXT_SOURCE_FAMILY_ADMISSION_REQUIRED').length,classOnly:0,approvedNewPublished:0,conditionalCoverage:156+total,denominator:326,percent:Number(((156+total)/326*100).toFixed(2)),target30Shortfall:30-total,target80Percent:261,remainingTo80AfterAllCandidateApprovals:261-156-total,assumptionResearchCasesCounted:0,publicationAuthorized:false};
const keys=Object.keys(rows[0]);
const csv=[keys.join(','),...rows.map(r=>keys.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\n')+'\n';
await fs.mkdir(out,{recursive:true});
await fs.writeFile(out+'/source-first-candidates.csv',csv);
await fs.writeFile(out+'/source-first-results.json',JSON.stringify({summary,results:allResults},null,2)+'\n');
console.log(JSON.stringify({summary,results:rows.map(({dominantUncertainty,...r})=>r)},null,2));
