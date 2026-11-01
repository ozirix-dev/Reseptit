import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {fingerprint} from '../../../site/scripts/gk80-candidate-model.ts';
import {calculate,normalizeCarbohydrate} from '../../../site/scripts/nutrition-model.ts';
import {CASE_FINGERPRINT,loadCase,loadRecipe,validateCase,evaluatePrototype,assertPublicationAuthorized,standardNutritionInput,textHash} from './prototype.mts';
const folder=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(folder,'../../..');
const json=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const git=(...a:string[])=>execFileSync('git',['-C',root,...a],{encoding:'utf8'}).trim();

test('closed packet binds all sources, preparation, servings, macros and pending decisions',()=>{
 const p=loadCase();assert.equal(fingerprint(p),CASE_FINGERPRINT);validateCase(p,loadRecipe());
 assert.equal(p.pilot.ingredients.length,10);assert.equal(p.pilot.ingredients[8].aggregatePolyolPer100g,null);
 assert.deepEqual(p.bindingProposals.map((x:any)=>x.ingredientIndex),[6,7]);
});
test('changes to recipe, mass, source, polyol, serving or approval invalidate the whole case',()=>{
 const mutations=[
  (p:any)=>p.recipeId='other-recipe',
  (p:any)=>p.pilot.servings=5,
  (p:any)=>p.pilot.preparation[0]+=' changed',
  (p:any)=>p.pilot.ingredients[8].massG='1',
  (p:any)=>p.pilot.ingredients[8].aggregatePolyolPer100g='0',
  (p:any)=>p.pilot.ingredients[7].macroPer100g.fat='0.6',
  (p:any)=>p.sourceCards.giSources[0].gi=41,
  (p:any)=>p.sourceCards.compositionSources[0].effectiveMacroPer100g.fat='2.02',
  (p:any)=>p.candidate.coverageProposalEligible=true,
  (p:any)=>p.pilot.ingredients.push({...p.pilot.ingredients[8],index:10}),
  (p:any)=>p.ownerContentApproved=true,
  (p:any)=>p.publicationEligible=true,
  (p:any)=>p.productionEnabled=true,
  (p:any)=>p.bindingProposals[1].installed=true,
 ];
 for(const change of mutations){const p=loadCase();change(p);assert.throws(()=>validateCase(p,loadRecipe()));}
 assert.throws(()=>validateCase(loadCase(),loadRecipe()+' changed'),/STALE_PREPARATION/);
});
test('prototype stays HOLD with no production override or activation path',()=>{
 const r=evaluatePrototype();assert.equal(r.status,'HOLD');assert.equal(r.publicationEligible,false);
 assert.equal(r.productionEnabled,false);assert.equal(r.activationSupported,false);assert.equal(r.productionGkOverride,null);
 assert.throws(()=>assertPublicationAuthorized(),/PUBLICATION_DISABLED/);
 assert.ok(r.blockers.includes('NET_CHO_TWO_DECIMAL_DISPLAY_UNSTABLE'));
 assert.equal(r.arithmeticDiagnostic.numericProposal,false);
 assert.match(r.foodBindingBlocker!,/UNREVIEWED_FOOD_PREPARATION/);
});
test('ordinary nutrition path rejects pepper unknown even independently of unweighed salt',()=>{
 const input=standardNutritionInput(loadCase()),pepper=input.ingredients[8].record!;
 assert.equal(pepper.per100g.polyols,null);assert.equal(normalizeCarbohydrate(pepper).net,null);
 const onlyPepper=calculate({...input,ingredients:[input.ingredients[8]]});
 assert.equal(onlyPepper.status,'INSUFFICIENT SOURCE DATA');assert.equal(onlyPepper.totalCarbohydratePerServingG,null);
 assert.equal(input.ingredients[9].amount,null);assert.equal(calculate(input).totalCarbohydratePerServingG,null);
});
test('fixed-source arithmetic reproduces the original named scenario without a whole point',()=>{
 const f=evaluatePrototype().precision.fixedSource;
 assert.deepEqual(f.gk,{lower:2.737675,upper:2.779675});assert.equal(f.gkWidth,.042);
 assert.deepEqual(f.totalCho,{lower:10.38025,upper:10.40825});
 assert.equal(f.wholeGkPoint,null);assert.equal(f.unknownAggregatePolyolPoint,null);
});
test('source rounding makes net7.38 unstable; requested precision is never silently coarsened',()=>{
 for(const result of [evaluatePrototype().precision.nearestQuantum,evaluatePrototype().precision.conservativeQuantum]){
  assert.deepEqual(result.displays.carbsNetG.endpointDisplays,[7.38,7.39]);
  assert.equal(result.displays.carbsNetG.decimalPlaces,2);assert.equal(result.displays.carbsNetG.requestedValue,7.38);
  assert.equal(result.displays.carbsNetG.stable,false);assert.equal(result.allFourMacroDisplaysStable,false);
  assert.equal(result.displays.carbsTotalG.stable,true);assert.equal(result.displays.gk.stable,true);
  assert.equal(result.displays.proteinG.stable,true);assert.equal(result.displays.fatG.stable,true);
  assert.equal(result.gkClassStable,true);assert.equal(result.withinNamedWidthBudget,true);
 }
 assert.equal(evaluatePrototype().precision.conservativeQuantum.gkWidth,.0897);
});
test('basil eligibility is explicit but neither alias nor GI source allowlist is installed',()=>{
 const r=evaluatePrototype(),catalog=json(path.join(root,'site/scripts/gk80-food-catalog.json'));
 for(const proposal of r.bindingProposals){
  assert.equal(proposal.installed,false);assert.equal(proposal.ownerApproved,false);
  assert.ok(!catalog.aliases.some((a:any)=>a.compositionId===proposal.aliasProposal.compositionId));
 }
 assert.equal(r.basilApplicability.compositionQualifiesWithinSensitivity,true);
 assert.equal(r.basilApplicability.existingSourceAllowsNewComposition,false);
 const source=loadCase().sourceCards.giSources.find((x:any)=>x.id==='lowcho50-r4');
 assert.ok(!source.allowedCompositionIds.includes(r.basilApplicability.sourceId));
});
test('all production trees and 326 reused baseline objects remain unchanged at 130 numeric',()=>{
 const base=json(path.join(folder,'main-baseline.json'));
 assert.equal(base.resultHashes.length,326);assert.equal(base.resultHashes.filter((x:any)=>x.status==='CALCULATED').length,130);
 for(const [p,sha] of Object.entries(base.protectedTrees)){
  assert.equal(git('rev-parse',`${base.main}:${p}`),sha);
  assert.equal(git('diff',base.main,'--',p),'');
 }
 const report=json(base.sourceReport),hash=(x:any)=>textHash(JSON.stringify(x));
 assert.equal(report.results.length,326);
 for(const r of report.results)assert.equal(hash(r),base.resultHashes.find((x:any)=>x.recipeId===r.recipeId)?.sha256);
 const hold=report.results.find((x:any)=>x.recipeId==='uunikanapasta-kesakurpitsa');
 assert.notEqual(hold.status,'CALCULATED');assert.equal(hold.glycemicLoadPerServing,null);
 const keys=['carbs_net_per_serving_g','carbs_total_per_serving_g','protein_per_serving_g','fat_per_serving_g'];
 for(const rid of ['keto-suklaakeksit','keto-mutakakku']){
  const text=readFileSync(path.join(root,'reseptit/jalkiruoat',rid+'.md'),'utf8');
  for(const k of keys)assert.match(text,new RegExp('^'+k+': null','m'));
 }
});
test('PR156 exact two approvals, helper and source worktrees are not changed',()=>{
 const pins=json(path.join(folder,'source-pins.json')),old=pins.sourcePrs['156'].root;
 for(const [file,sha] of Object.entries(pins.pr156FileHashes))assert.equal(textHash(readFileSync(path.join(old,file),'utf8')),sha);
 for(const [rid,sha] of Object.entries(pins.pr156EvidenceFingerprints))assert.equal(fingerprint(json(path.join(old,'docs/nutrition/calculations',rid+'.json'))),sha);
 for(const state of Object.values(pins.sourcePrs) as any[]){
  const run=(...a:string[])=>execFileSync('git',['-C',state.root,...a],{encoding:'utf8'}).trim();
  assert.equal(run('rev-parse','HEAD'),state.head);assert.equal(run('status','--porcelain'),'');
 }
 assert.equal(git('ls-files','site/scripts/gk80-polyol-c.ts'),'');
 const imports=spawnSync('git',['-C',root,'grep','-n','gk80-afcd-recovery-02','--','site'],{encoding:'utf8'});
 assert.equal(imports.status,1);assert.equal(imports.stdout,'');
});
