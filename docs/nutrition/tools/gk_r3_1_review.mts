import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { calculateGlycemicLoad } from "../../../site/scripts/glycemic-load-model.ts";
import { classifyPaths } from "../../../site/scripts/select-ci-checks.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../..");
const read=async(p:string)=>JSON.parse(await fs.readFile(path.join(root,p),"utf8"));
const input=await read("docs/nutrition/glycemic-load-pilot-input.json");
const foods=await read("docs/nutrition/food-records.json");
const records=(await read("docs/nutrition/glycemic-index-records.json")).records;
const baseline=(await read("tmp/nutrition/glycemic-load-pilot.json")).results;
const foodById=new Map(foods.map((r:any)=>[r.id,r]));
const giById=new Map(records.map((r:any)=>[r.id,r]));
const allResults=input.recipes.map((r:any)=>calculateGlycemicLoad(r,foods,records));
const active=baseline.filter((r:any)=>r.status==="CALCULATED");
for(const r of active) assert.equal(JSON.stringify(allResults.find((x:any)=>x.recipeId===r.recipeId)),JSON.stringify(r),r.recipeId);
assert.equal(active.length,83);
const core=(r:any)=>Object.fromEntries(["status","unroundedGlycemicLoadPerServing","glycemicLoadPerServing","glycemicLoadRangePerServing","confidence","omittedAvailableCarbohydratePerServingG","omittedAvailableCarbohydrateUpperBoundPerServingG"].map(k=>[k,r[k]]));
const anomalies:any[]=[];const transforms:any[]=[];const zeroBindings:any[]=[];const zeros:any[]=[];const categoryRows:any[]=[];
for(const r of active){
 const inp=input.recipes.find((x:any)=>x.recipeId===r.recipeId);
 const knownCho=r.ingredients.reduce((n:number,i:any)=>n+(i.availableCarbohydratePerServingG??0),0);
 if(r.glycemicLoadPerServing===0&&r.omittedAvailableCarbohydratePerServingG>0)zeros.push({recipeId:r.recipeId,...core(r),knownCho,matchedPositiveCho:r.ingredients.reduce((n:number,i:any)=>n+(i.giContribution!==null?i.availableCarbohydratePerServingG??0:0),0),reason:r.unroundedGlycemicLoadPerServing===0?"NO_NUMERICAL_GI_CONTRIBUTIONS; not proven zero physiological load":"ROUNDING_TO_ZERO"});
 for(let index=0;index<inp.ingredients.length;index++){
  const i=inp.ingredients[index],out=r.ingredients[index],g:any=giById.get(i.giRecordId),food:any=foodById.get(i.fineliRecordId);if(!g)continue;
  const id=i.fineliRecordId??"",name=(food?.name??"")+" "+i.name;
  const row={recipeId:r.recipeId,index,ingredient:i.name,compositionId:id,compositionName:food?.name,giRecordId:g.id,giFood:g.food,availableCho:out.availableCarbohydratePerServingG,giContribution:out.giContribution,bindingRole:out.giContribution!==null?"NUMERICALLY_USED":out.availableCarbohydratePerServingG===0?"UNUSED_ZERO_CHO_METADATA":"BOUND_NOT_USED",giMatchEvidence:i.giMatchEvidence};
  if(out.availableCarbohydratePerServingG===0)zeroBindings.push(row);
  let mismatch:string|null=null;
  if(g.id==="vegetables-category-mean-gi-66"&&/^fineli-541-/.test(id))mismatch="CONFIRMED_OIL_IS_NOT_VEGETABLE_GI_FOOD";
  if(g.id==="vegetables-category-mean-gi-66"&&/^afcd-F006618-/.test(id))mismatch="CONFIRMED_BLACK_PEPPER_SPICE_IS_NOT_VEGETABLE_PEPPER";
  if(mismatch){
   const changed=structuredClone(inp);changed.ingredients[index].giRecordId=null;
   const removed=calculateGlycemicLoad(changed,foods,records);
   anomalies.push({...row,classification:mismatch,before:core(r),counterfactualAfterUnbinding:core(removed),numericCoreUnchanged:JSON.stringify(core(r))===JSON.stringify(core(removed)),note:"In-memory counterfactual only; active source unchanged"});
  }
  let form:string|null=null;
  if(g.id==="rice-category-mean-gi-67"&&/^fineli-182-/.test(id))form="RICE_GRAIN_MEAN_TO_RICE_FLOUR";
  if(g.id==="potatoes-category-mean-gi-71"&&/^fineli-162-/.test(id))form="POTATO_MEAN_TO_ISOLATED_STARCH";
  if(g.id==="legumes-category-mean-gi-34"&&/^afcd-F003986-/.test(id))form="WHOLE_LEGUME_MEAN_TO_FLOUR";
  if(g.id==="legumes-category-mean-gi-34"&&(/soijamaito|soijakastike|soijapaputahna/.test(i.name)||/^fineli-(31|30207)-/.test(id)))form="LEGUME_MEAN_TO_PROCESSED_LIQUID_OR_PASTE";
  if(g.id==="nuts-category-mean-gi-22"&&/jauho/.test(i.name))form="NUT_MEAN_TO_ALMOND_FLOUR_AND_RECIPE_PREPARATION";
  if(form)transforms.push({...row,classification:form,reviewStatus:"PREPARATION_OR_PRODUCT_REVIEW_REQUIRED; not automatically wrong food family"});
  if(g.matchKind==="CATEGORY_MEAN"&&out.giContribution!==null)categoryRows.push({...row,major:out.availableCarbohydratePerServingG>=5||(out.availableCarbohydratePerServingG>=1&&knownCho>0&&out.availableCarbohydratePerServingG/knownCho>=.25)});
 }
}
function simulate(name:string,select:(i:any,out:any,g:any,recipe:any)=>boolean){
 const kept:string[]=[],blocked:string[]=[],details:any[]=[];
 for(const r of active){
  const original=input.recipes.find((x:any)=>x.recipeId===r.recipeId),changed=structuredClone(original);
  const removed:any[]=[];
  changed.ingredients.forEach((i:any,n:number)=>{const out=r.ingredients[n],g=giById.get(i.giRecordId);if(g&&select(i,out,g,r)){removed.push({ingredient:i.name,giRecordId:i.giRecordId,availableCho:out.availableCarbohydratePerServingG});i.giRecordId=null;}});
  const after=calculateGlycemicLoad(changed,foods,records);
  (after.status==="CALCULATED"?kept:blocked).push(r.recipeId);
  if(removed.length)details.push({recipeId:r.recipeId,removed,after:core(after),blockers:after.blockers});
 }
 return {name,meaning:"Mechanical in-memory sensitivity using unchanged model and1g/2g omission rules; survivors are NOT independently source-approved",calculated:kept.length,blocked:blocked.length,keptRecipeIds:kept,blockedRecipeIds:blocked,details};
}
const sensitivity=[
 simulate("UNBIND_CONFIRMED_WRONG_FAMILY_ONLY",(i:any,_o:any,_g:any,r:any)=>anomalies.some(a=>a.recipeId===r.recipeId&&a.ingredient===i.name)),
 simulate("REMOVE_MAJOR_CATEGORY_CONTRIBUTIONS",(_i:any,o:any,g:any,r:any)=>g.matchKind==="CATEGORY_MEAN"&&o.giContribution!==null&&(o.availableCarbohydratePerServingG>=5||(o.availableCarbohydratePerServingG>=1&&o.availableCarbohydratePerServingG/r.ingredients.reduce((n:number,j:any)=>n+(j.availableCarbohydratePerServingG??0),0)>=.25))),
 simulate("REMOVE_ALL_CATEGORY_CONTRIBUTIONS",(_i:any,o:any,g:any)=>g.matchKind==="CATEGORY_MEAN"&&o.giContribution!==null)
];
const ruleLimitHolds=active.filter((r:any)=>{
 const cats=r.ingredients.filter((i:any)=>giById.get(i.giRecordId)?.matchKind==="CATEGORY_MEAN"&&i.giContribution!==null);
 return cats.every((i:any)=>i.availableCarbohydratePerServingG<1)&&r.omittedAvailableCarbohydratePerServingG+cats.reduce((n:number,i:any)=>n+i.availableCarbohydratePerServingG,0)<2;
});
const nonzeroLabelEligible=ruleLimitHolds.filter((r:any)=>!(r.glycemicLoadPerServing===0&&r.omittedAvailableCarbohydratePerServingG>0));
const r2Sha="020b665582f4f1ec54e56ec978581e424adc6ace";
const r2Input=JSON.parse(execFileSync("git",["show",r2Sha+":docs/nutrition/glycemic-load-pilot-input.json"],{cwd:root,encoding:"utf8",maxBuffer:5e6}));
const r2Results=r2Input.recipes.map((r:any)=>calculateGlycemicLoad(r,foods,records));
for(const r of active)assert.equal(JSON.stringify(r2Results.find((x:any)=>x.recipeId===r.recipeId)),JSON.stringify(r),r.recipeId);
const r4Ids=["tomaatti-kananmuna-wokki","yangzhou-paistettu-riisi","kreikkalainen-moussaka","indonesialainen-serabi-kookospannukakku","thai-kookosriisi-mangolla"];
const corrections=JSON.parse(execFileSync("git",["show",r2Sha+":docs/nutrition/gk-r2-corrections.json"],{cwd:root,encoding:"utf8",maxBuffer:1e6})).changes;
const audit=(await read("tmp/nutrition/audit.json")).inventory;
const r4=r4Ids.map(id=>{
 const r=audit.find((r:any)=>r.recipe_id===id);
 const sources=execFileSync("git",["ls-files","reseptit","kaannokset"],{cwd:root,encoding:"utf8"}).trim().split("\n").filter(p=>path.basename(p)===id+".md");
 const paths=["docs/nutrition/calculations/"+id+".json",...sources];
 const plan=classifyPaths(paths);
 return {recipeId:id,sourcePath:r.source_path,paths,r2InputChanges:corrections.filter((c:any)=>c.recipeId===id).map((c:any)=>({ingredient:c.ingredient,kind:c.kind})),ciPlan:{unitTests:[...plan.unitTests],runNutrition:plan.runNutrition,runGlycemic:plan.runGlycemic,runContent:plan.runContent},condition:"Require both nutrition and GK suites in CI even when actual path selector would omit GK; no CI change in R3.1"};
});
const result={schemaVersion:1,scope:"R3.1 targeted automatic83 review and read-only counterfactuals; not83scientific approvals",baseCommit:"e8da2c9417e2aeff55a85d599b3b7e1ad465f36c",reviewedR3Head:"1d7dc77f15de34e92607b979484504b9834e162c",existing83ModelResultsMatchFreshAudit:true,all326UnchangedVerification:"Separate gk_r3_verify.py compares the complete audit against version-pinned results; raw model excludes audit binding diagnostics",existing83ExactlyMatchR2Results:true,counts:{active:83,boundGiRows:active.reduce((n:number,r:any)=>n+r.ingredients.filter((i:any)=>i.giRecordId).length,0),numericallyUsedCategoryRows:categoryRows.length,categoryRecipes:new Set(categoryRows.map(r=>r.recipeId)).size,confirmedFamilyMismatchRows:anomalies.length,confirmedFamilyMismatchRecipes:new Set(anomalies.map(r=>r.recipeId)).size,zeroChoBoundMetadataRows:zeroBindings.length,preparationTransformRows:transforms.length,preparationTransformRecipes:new Set(transforms.map(r=>r.recipeId)).size,zeroGkWithOmissions:zeros.length},anomalies,preparationTransforms:transforms,zeroChoBindings:zeroBindings,zeroGkRecipes:zeros,categoryRows,sensitivity,proposedPolicyMechanicalGate:{rule:"Each used CATEGORY_MEAN carbohydrate<1g and categoryCHO+omittedCHO<2g; remove numerical0label if any nonzeroomission; source/preparation approvals still required",beforeZeroPresentationGate:ruleLimitHolds.length,afterZeroPresentationGate:nonzeroLabelEligible.length,eligibleRecipeIds:nonzeroLabelEligible.map((r:any)=>r.recipeId),meaning:"Upper bound on existing83 eligible after quantitative/presentation gates, NOT forecast of source-approved coverage"},r4Dependencies:r4};
if(process.argv.includes("--verify")){
 const saved=await read("docs/nutrition/gk-r3-1-targeted-screen.json");assert.deepEqual(result,saved);
 console.log(JSON.stringify({result:"PASS",...result.counts,policyMechanicalGate:result.proposedPolicyMechanicalGate.afterZeroPresentationGate,simulations:result.sensitivity.map(({name,calculated,blocked}:any)=>({name,calculated,blocked}))},null,2));
}else console.log(JSON.stringify(result,null,2));
