// Read-only historical screening; no runtime calculation or approval.
// Run: node docs/research/gk-source-risk-01/verify.mjs
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const pins={
  "input": {
    "path": "docs/nutrition/glycemic-load-pilot-input.json",
    "blob": "914b0fa604516f8585e616863bfff5dcaab3e729"
  },
  "food": {
    "path": "docs/nutrition/food-records.json",
    "blob": "d7d6b83b45ed6b048582850f39425d08eb8d1ec6"
  },
  "gi": {
    "path": "docs/nutrition/glycemic-index-records.json",
    "blob": "719328765182a5058a513381bf5fc1cd0fd31651"
  },
  "cream": {
    "path": "docs/nutrition/calculations/keto-joulutortut.json",
    "blob": "c98eca4213669c6ea1ca5a0bf24a04a169a17d5d"
  },
  "canonical": {
    "path": "site/scripts/gk-food-records.ts",
    "blob": "7dda9dd4b5e8300b564fb0e1d5131fd0ab40c289"
  }
};
const base="2075b8430b6320feef6ebe181f3f84b6cd56c0ce";
function buildAudit(input, foodRecords, catalog, creamEvidence, pins, base) {
  const check=(condition,message)=>{if(!condition)throw Error(message)};
  const valid=x=>typeof x==="number"&&Number.isFinite(x)&&x>=0;
  const round=x=>Math.round(x*1e6)/1e6;
  const sortIds=xs=>[...new Set(xs)].sort();
  const increment=(object,key)=>{object[key]=(object[key]??0)+1};
  const foodMap=new Map(),duplicateRecords=[];
  for(const record of foodRecords){
    if(foodMap.has(record.id)){
      check(record.id==="fineli-11557-2026-10-24"&&foodMap.get(record.id).per100g.carbohydrate===record.per100g.carbohydrate,"unexpected duplicate");
      duplicateRecords.push(record.id);
    }
    foodMap.set(record.id,record);
  }
  check(duplicateRecords.length===1,"expected historical lemon duplicate");
  const cream=creamEvidence.ingredients.filter(i=>i.record?.id==="fineli-34764-release-20");
  check(cream.length===1&&!foodMap.has(cream[0].record.id),"cream overlay mismatch");
  foodMap.set(cream[0].record.id,cream[0].record);
  const giMap=new Map(catalog.records.map(g=>[g.id,g]));
  check(giMap.size===catalog.records.length&&input.recipes.length===new Set(input.recipes.map(r=>r.recipeId)).size,"duplicate GI or recipe ID");
  const summary={recipes:input.recipes.length,ingredientRows:0,assignedGiRows:0,knownGiRows:0,unknownGiRows:0,referenceOnlyAssignedRows:0,missingMatchKeys:0,missingMatchKeysNonCategory:0,mismatchedPresentKeys:0,excludedRows:0,explicitEstimateOrBoundRows:0,unresolvedCompositionOrMassRows:0,pointCarbRows:0,rangeCarbRows:0,knownPositiveMissingGiRows:0,knownMissingGiAtLeast1gRows:0,knownMissingGiAtLeast10gRows:0,categoryProxyAtLeast10gRows:0,analogueAtLeast10gRows:0,missingCompositionIdRows:0,recipesWithAssignedGi:0,assignedKnownGiIds:0,screenedRecipeCount:0,screenedIngredientCount:0};
  const screen=[],recipes=[],sourceStats=new Map(),missingCompositionIds=[],assignedRecipes=new Set();
  for(const recipe of input.recipes){
    const perRecipe={recipeId:recipe.recipeId,servings:recipe.servings,ingredientRows:recipe.ingredients.length,screenedRows:0,knownMissingGiAtLeast1gRows:0,missingGiKnownCarbGPerServing:0,broadProxyKnownCarbGPerServing:0,unresolvedRows:0,flags:[]};
    check(valid(recipe.servings)&&recipe.servings>0,"bad serving count");
    for(const [index,i] of recipe.ingredients.entries()){
      summary.ingredientRows++;
      const f=foodMap.get(i.fineliRecordId),g=giMap.get(i.giRecordId),flags=[];
      let point=null,range=null;
      if(i.excludedReason){
        summary.excludedRows++;
        if(valid(i.estimatedAvailableCarbohydratePerServingG)||valid(i.availableCarbohydrateUpperBoundPerServingG)){
          summary.explicitEstimateOrBoundRows++;
        }else{
          flags.push("EXCLUDED_WITHOUT_NUMERIC_ESTIMATE_OR_BOUND");
        }
      }else{
        if(i.fineliRecordId&&!f){summary.missingCompositionIdRows++;missingCompositionIds.push({recipeId:recipe.recipeId,ingredientIndex:index,id:i.fineliRecordId});flags.push("UNKNOWN_COMPOSITION_ID")}
        if(f&&valid(i.grams)&&f.basis!=="unresolved"&&valid(f.per100g?.carbohydrate)){
          let c=null;
          if(f.carbohydrateDefinition==="EU_AVAILABLE")c=f.per100g.carbohydrate;
          else if(f.carbohydrateDefinition==="EU_TOTAL_INCLUDING_POLYOLS"&&f.polyolsSourceVerified===true&&valid(f.per100g.polyols)&&f.per100g.polyols<=f.per100g.carbohydrate)c=f.per100g.carbohydrate-f.per100g.polyols;
          if(c!==null)point=round(c*i.grams/100/recipe.servings);
        }
        const r=i.availableCarbohydratePer100gRange;
        if(r&&valid(i.grams)&&valid(r.min)&&valid(r.max)&&r.min<=r.max&&r.evidence){
          range={min:round(r.min*i.grams/100/recipe.servings),max:round(r.max*i.grams/100/recipe.servings)};
          summary.rangeCarbRows++;flags.push("EXPLICIT_COMPOSITION_RANGE");
        }else if(point!==null)summary.pointCarbRows++;
        if(point===null&&range===null){summary.unresolvedCompositionOrMassRows++;perRecipe.unresolvedRows++;flags.push("UNRESOLVED_COMPOSITION_OR_MASS")}
      }
      const exposure=range?.max??point;
      if(i.giRecordId!==null&&i.giRecordId!==undefined){
        summary.assignedGiRows++;assignedRecipes.add(recipe.recipeId);
        if(!g){summary.unknownGiRows++;flags.push("UNKNOWN_GI_ID")}
        else{
          summary.knownGiRows++;
          const stat=sourceStats.get(g.id)??{id:g.id,matchKind:g.matchKind??null,assignedRows:0,recipeIds:[],knownCarbExposureGSum:0,rowsWithKnownExposure:0,maxKnownCarbGPerServing:null,atLeast10gRows:0};
          stat.assignedRows++;stat.recipeIds.push(recipe.recipeId);
          if(exposure!==null){stat.rowsWithKnownExposure++;stat.knownCarbExposureGSum+=exposure;stat.maxKnownCarbGPerServing=Math.max(stat.maxKnownCarbGPerServing??0,exposure);if(exposure>=10)stat.atLeast10gRows++}
          sourceStats.set(g.id,stat);
          if(g.calculationUse==="REFERENCE_ONLY"){summary.referenceOnlyAssignedRows++;flags.push("REFERENCE_ONLY_GI_ASSIGNED")}
          if(!g.source?.published||g.referenceScale!=="GLUCOSE_100"||!i.giMatchEvidence)flags.push("SOURCE_OR_RATIONALE_REVIEW");
          if(!i.foodKey||!i.preparationKey){
            summary.missingMatchKeys++;
            if(g.matchKind!=="CATEGORY_MEAN"){summary.missingMatchKeysNonCategory++;flags.push("MISSING_NONCATEGORY_KEYS")}
            else flags.push("CATEGORY_KEYS_MISSING_REVIEW_ONLY");
          }else if(i.foodKey!==g.foodKey||i.preparationKey!==g.preparationKey){summary.mismatchedPresentKeys++;flags.push("PRESENT_KEYS_DIFFER")}
          if(exposure!==null&&exposure>=10&&g.matchKind==="CATEGORY_MEAN"){summary.categoryProxyAtLeast10gRows++;flags.push("CATEGORY_PROXY_AT_LEAST_10G")}
          if(exposure!==null&&exposure>=10&&g.matchKind==="ANALOG"){summary.analogueAtLeast10gRows++;flags.push("ANALOGUE_AT_LEAST_10G")}
          if(exposure!==null&&["CATEGORY_MEAN","ANALOG"].includes(g.matchKind))perRecipe.broadProxyKnownCarbGPerServing+=exposure;
        }
      }else if(exposure!==null&&exposure>0){
        summary.knownPositiveMissingGiRows++;perRecipe.missingGiKnownCarbGPerServing+=exposure;
        if(exposure>=1){summary.knownMissingGiAtLeast1gRows++;perRecipe.knownMissingGiAtLeast1gRows++;flags.push("UNASSIGNED_GI_AT_LEAST_1G")}
        if(exposure>=10){summary.knownMissingGiAtLeast10gRows++;flags.push("UNASSIGNED_GI_AT_LEAST_10G")}
      }
      // Explicit high-priority identity cases from the independent review; do not infer other identities from keywords.
      if(recipe.recipeId==="pellava-puuro-pahkinoilla"&&index===2)flags.push("REPORTED_ALMOND_DRINK_DAIRY_IDENTITY_MISMATCH");
      if(recipe.recipeId==="char-siu"&&index===4)flags.push("REPORTED_RICE_VINEGAR_GRAIN_GI_MISMATCH");
      if(flags.length){
        perRecipe.screenedRows++;perRecipe.flags.push(...flags);
        screen.push({recipeId:recipe.recipeId,ingredientIndex:index,name:i.name,grams:i.grams??null,servings:recipe.servings,foodRecordId:i.fineliRecordId??null,giRecordId:i.giRecordId??null,foodKey:i.foodKey??null,preparationKey:i.preparationKey??null,knownAvailableCarbGPerServing:point,explicitAvailableCarbRangeGPerServing:range,reportedExcludedEstimateGPerServing:i.estimatedAvailableCarbohydratePerServingG??null,reportedExcludedUpperBoundGPerServing:i.availableCarbohydrateUpperBoundPerServingG??null,flags,newUseAuthorized:false});
      }
    }
    perRecipe.flags=sortIds(perRecipe.flags);
    perRecipe.missingGiKnownCarbGPerServing=round(perRecipe.missingGiKnownCarbGPerServing);
    perRecipe.broadProxyKnownCarbGPerServing=round(perRecipe.broadProxyKnownCarbGPerServing);
    recipes.push(perRecipe);
  }
  summary.recipesWithAssignedGi=assignedRecipes.size;
  summary.assignedKnownGiIds=sourceStats.size;
  summary.screenedRecipeCount=recipes.filter(x=>x.screenedRows>0).length;
  summary.screenedIngredientCount=screen.length;
  const byFlag={};for(const row of screen)for(const flag of row.flags)increment(byFlag,flag);
  const sources=catalog.records.map(g=>{const s=sourceStats.get(g.id)??{id:g.id,matchKind:g.matchKind??null,assignedRows:0,recipeIds:[],knownCarbExposureGSum:0,rowsWithKnownExposure:0,maxKnownCarbGPerServing:null,atLeast10gRows:0};return {...s,recipeIds:sortIds(s.recipeIds),knownCarbExposureGSum:round(s.knownCarbExposureGSum)}});
  const queue=(flag)=>screen.filter(r=>r.flags.includes(flag)).sort((a,b)=>(b.explicitAvailableCarbRangeGPerServing?.max??b.knownAvailableCarbGPerServing??-1)-(a.explicitAvailableCarbRangeGPerServing?.max??a.knownAvailableCarbGPerServing??-1)|| (a.recipeId<b.recipeId?-1:a.recipeId>b.recipeId?1:0)||a.ingredientIndex-b.ingredientIndex).map(r=>({recipeId:r.recipeId,ingredientIndex:r.ingredientIndex}));
  return {schemaVersion:1,status:"AUDIT_HISTORICAL_INPUT_SCREEN_NOT_RUNTIME_CALCULATION",baseCommit:base,pins,scope:"Original committed recipe inputs only. Known available carbohydrate from pinned composition and edible mass; excluded rows are not treated as measured composition. Range maximum is used only for prioritization. No GK result or public status inferred. Flags overlap and are not confirmed defects.",thresholds:{missingGiReviewG:1,highExposureReviewG:10,highExposureIsEditorialOnly:true},knownRegistryExceptions:{duplicateRecords,scopedCreamCheeseId:cream[0].record.id,missingCompositionIds},summary,flagCounts:byFlag,sources,recipeScreen:recipes,ingredientScreen:screen,reviewQueues:{unknownGi:queue("UNKNOWN_GI_ID"),missingNoncategoryKeys:queue("MISSING_NONCATEGORY_KEYS"),presentKeysDiffer:queue("PRESENT_KEYS_DIFFER"),missingGiAtLeast1g:queue("UNASSIGNED_GI_AT_LEAST_1G"),categoryProxyAtLeast10g:queue("CATEGORY_PROXY_AT_LEAST_10G"),analogueAtLeast10g:queue("ANALOGUE_AT_LEAST_10G")},newUseAuthorized:false};
}
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,"../../..");
function readPinned(pin){
  const raw=Buffer.from(readFileSync(resolve(root,pin.path),"utf8").replaceAll("\r\n","\n"),"utf8");
  const hash=createHash("sha1").update("blob "+raw.length+"\0").update(raw).digest("hex");
  if(hash!==pin.blob)throw Error("Pinned input mismatch: "+pin.path);
  return raw.toString("utf8");
}
readPinned(pins.canonical);
const actual=buildAudit(...["input","food","gi","cream"].map(k=>JSON.parse(readPinned(pins[k]))),pins,base);
const expected=readFileSync(resolve(here,"risk-screen.json"),"utf8").replaceAll("\r\n","\n");
if(JSON.stringify(actual,null,2)+"\n"!==expected)throw Error("Audit snapshot differs");
console.log("PASS: pinned original input risk screening, no runtime approval");
