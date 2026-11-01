import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync} from 'node:fs';
import {normalizeCarbohydrate,calculate as calculateNutrition} from '../../../site/scripts/nutrition-model.ts';
import {calculateGlycemicLoad} from '../../../site/scripts/glycemic-load-model.ts';
import {calculateCandidate} from '../../../site/scripts/gk80-candidate-policy.ts';
import {formatGlycemicLoadNumber} from '../../../site/src/features/recipes/gk80-format.ts';
import {classifyPaths} from '../../../site/scripts/select-ci-checks.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../../..');
const output=process.argv[2];if(!output)throw Error('EXPLICIT_SCRATCH_OUTPUT_REQUIRED');
const rel=path.relative(root,path.resolve(output));if(rel===''||(!rel.startsWith('..'+path.sep)&&!path.isAbsolute(rel)))throw Error('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const food:any={id:'synthetic-us-control',name:'tomato',sourceUrl:'https://example.org/synthetic',retrievedAt:'2026-11-01',licence:'synthetic fixture',state:'raw',basis:'per100g-edible',carbohydrateDefinition:'US_TOTAL_INCLUDING_FIBRE',polyolsSourceVerified:true,polyolsEvidence:'Synthetic exact fixture, not a food claim',per100g:{carbohydrate:50,fibre:10,polyols:20}};
assert.deepEqual(normalizeCarbohydrate(food),{available:40,net:20});
const source=read(root+'/docs/nutrition/glycemic-index-records.json').records[0];
const input:any={recipeId:'synthetic-us-control',servings:1,ingredients:[{name:'tomato',grams:100,fineliRecordId:food.id,giRecordId:source.id,foodKey:source.foodKey,preparationKey:source.preparationKey,giMatchEvidence:'Synthetic fixture, no recipe use'}]};
const out=calculateGlycemicLoad(input,[food],[source]);
assert.equal(out.status,'CALCULATED');assert.equal(out.ingredients[0].availableCarbohydratePerServingG,40);
assert.equal(out.unroundedGlycemicLoadPerServing,8.8); // 40 * GI22 /100, not 20*22/100
const nutrition=calculateNutrition({recipeId:'us-control',sourceHash:'a'.repeat(64),calculatedAt:'2026-11-01',servings:1,scope:'synthetic',reviewerStatus:'AUTOMATED ONLY',carbohydrateOutput:'AVAILABLE_EXCLUDING_FIBRE',ingredients:[{item:'tomato',amount:100,unit:'g',record:{...food,per100g:{...food.per100g,protein:10,fat:5}},state:'raw',matchEvidence:'synthetic',edibleFraction:1,edibleEvidence:'synthetic',retainedFraction:1,retentionEvidence:'synthetic'}]} as any);
assert.equal(nutrition.totalCarbohydrateGrams,70);assert.equal(nutrition.total.netCarbohydrate,20);
const eu={...food,carbohydrateDefinition:'EU_TOTAL_INCLUDING_POLYOLS'};
assert.deepEqual(normalizeCarbohydrate(eu),{available:30,net:30});
const avail={...food,carbohydrateDefinition:'EU_AVAILABLE'};
assert.deepEqual(normalizeCarbohydrate(avail),{available:50,net:50});
assert.deepEqual(normalizeCarbohydrate({...avail,polyolsSourceVerified:false,per100g:{...avail.per100g,polyols:null}}),{available:50,net:null});
assert.throws(()=>normalizeCarbohydrate(avail,true),/twice/);
const held=[];
for(const n of [6,7]) for(const h of read(root+`/docs/nutrition/gk80-release-${n}/held-review.json`).recipes){
 const b=h.lockedResearchBundle;let error=null,result=null;
 try{result=calculateCandidate(b.recipe,b.sources,b.recipe.sourceSha256,b.golden.inputHash,b.comps);}catch(e){error=String(e);}
 held.push({recipeId:h.recipeId,numericProposal:result?.numericProposal??false,currentPolicyError:error});
}
// Number arithmetic independent of prototype's Decimal implementation.
const data=read(path.join(here,'pilot-inputs.json'));
const decimal=read(path.join(here,'pilot-results.json'));let comparisons=0;
for(const r of decimal.results){
 const p=data.recipes.find((p:any)=>p.recipeId===r.recipeId);
 const pool=p.uncertainties.some((x:any)=>x.scenarioPoolUpperPer100===null)?null:p.uncertainties.reduce((s:number,x:any)=>s+x.massG/p.servings*x.scenarioPoolUpperPer100/100,0);
 const width=pool===null?null:pool*Number(r.giScenario[1])/100;
 assert.ok(width===null?r.sourceScenarioWidth===null:Math.abs(width-Number(r.sourceScenarioWidth))<1e-12);
 comparisons++;
 if(r.sourceScenario){
  const lo=Math.round(Number(r.sourceScenario.lower)*100)/100,hi=Math.round(Number(r.sourceScenario.upper)*100)/100;
  assert.equal(formatGlycemicLoadNumber(lo,'en-US',true),r.sourceScenario.displayAtLower);
  assert.equal(formatGlycemicLoadNumber(hi,'en-US',true),r.sourceScenario.displayAtUpper);
 }
}
const docsPlan=classifyPaths(['docs/research/polyoli-01/README.md','docs/research/polyoli-01/pilot-inputs.json','docs/research/polyoli-01/prototype.py']);
const nutritionPlan=classifyPaths(['docs/nutrition/polyoli-01/pilot-inputs.json']);
assert.equal(docsPlan.runBuild,false);assert.equal(nutritionPlan.full,true);
const report={status:'PASS',normalizationControls:6,usDiagnostic:{available:40,net:20,actualGk:8.8,polyolExcludingModelGk:4.4,actualNutritionTotal:70,sourceTotal:50,activeUsRecords:0},held,independentNumberComparisons:comparisons,docsPlan,nutritionPlan};
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
