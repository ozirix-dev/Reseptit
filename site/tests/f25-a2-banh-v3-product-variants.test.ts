import { readF25GateAtCreation, readF25HistoricalBlob } from "../scripts/f25-history";
import assert from "node:assert/strict";
import test from "node:test";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"../..");
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),"utf8"));
const evidence=read("docs/reviews/f25-a2-banh-cuon-xeo-v3-evidence-20261111.json");
const gitBlob=(raw:Buffer)=>createHash("sha1").update("blob "+raw.byteLength+"\0").update(raw).digest("hex");
const round=(v:number)=>Math.round(v*10000)/10000;

test("both V3 alternatives are separate from exact-blob historical FI sources and remain HOLD",()=>{
  assert.equal(evidence.schemaVersion,1);
  assert.equal(evidence.stage,"HOLD");
  assert.equal(evidence.recipes.length,2);
  const gate=readF25GateAtCreation(root);
  for(const r of evidence.recipes){
    assert.equal(gitBlob(readF25HistoricalBlob(root,r.sourceGitBlob)),r.sourceGitBlob,r.recipeId);
    assert.equal(gitBlob(readFileSync(path.join(root,r.candidatePath))),r.candidateGitBlob,r.recipeId);
    assert.equal(gitBlob(readF25HistoricalBlob(root,r.oldNutritionGitBlob)),r.oldNutritionGitBlob,r.recipeId);
    const old=read("docs/nutrition/calculations/"+r.recipeId+".json");
    assert.equal(old.sourceHash,r.oldNutritionInputHash);
    assert.equal(gate.sources.find((x:any)=>x.recipe_id===r.recipeId)?.approval,null);
    assert.equal(r.nutritionApproved,false);
    assert.equal(r.gkApproved,false);
    assert.equal(r.gk,null);
    assert.equal(r.releaseAuthorized,false);
    assert.equal(r.physicalTrial,false);
    const draft=readFileSync(path.join(root,r.candidatePath),"utf8");
    assert.match(draft,/HOLD/);
    assert.match(draft,/## Valmistus/);
    assert.match(draft,/GK/);
    assert.ok(r.unknowns.length>=5);
  }
});

test("V3 ingredient-by-ingredient label and oil-retention scenarios cannot impute null polyols",()=>{
  for(const r of evidence.recipes){
    for(const [label,retention] of [["oilRetained0",0],["oilRetained50Percent",0.5],["oilRetained100Percent",1]] as const){
      const target=r.scenarios[label];
      for(const metric of ["carbohydrate","protein","fat","fibre","polyols"] as const){
        let sum=0,missing=false;
        for(const ingredient of r.ingredients){
          const value=ingredient.macros[metric];
          if(value===null){missing=true;continue;}
          const portion=ingredient.basis==="100g"||ingredient.basis==="100ml"?ingredient.amount/100:1;
          sum+=value*portion*(metric==="fat"&&ingredient.retention?retention:1);
        }
        assert.equal(target[metric],missing?null:round(sum/evidence.servings),r.recipeId+":"+label+":"+metric);
      }
      assert.equal(target.polyols,null);
    }
  }
  const cuon=evidence.recipes.find((r:any)=>r.recipeId==="vietnamilainen-banh-cuon-sienilla");
  const xeo=evidence.recipes.find((r:any)=>r.recipeId==="vietnamilainen-banh-xeo-aamiaisletut");
  assert.ok(cuon&&xeo);
  assert.equal(cuon.ingredients.find((a:any)=>a.item.includes("tapiokatärkkelys")).ean,"6418513014119");
  assert.equal(cuon.ingredients.find((a:any)=>a.item.includes("kalakastike")).basis,"100ml");
  assert.equal(cuon.scenarios.oilRetained100Percent.carbohydrate,46.225);
  assert.equal(xeo.ingredients.find((a:any)=>a.item.includes("kurkuma")).ean,"6420101882864");
  assert.equal(xeo.scenarios.oilRetained100Percent.carbohydrate,null);
  const turmeric=xeo.ingredients.find((a:any)=>a.item.includes("kurkuma"));
  assert.ok(turmeric);
  assert.equal(turmeric.macros.carbohydrate,null,"unverified retail total carbohydrate cannot be treated as EU available carbohydrate");
  assert.equal(turmeric.labelMassBalance.subtotalGPer100g,102.8);
  assert.ok(turmeric.labelMassBalance.subtotalGPer100g>100);
  assert.equal(turmeric.labelMassBalance.passesEuAvailableCarbPlusSeparateFibre,false);
  assert.equal(xeo.conditionalComparison.alternativeWholeRecipePartialGPerServing,40.644);
  assert.equal(xeo.conditionalComparison.fullCarbohydrateApproved,false);
  assert.equal(xeo.scenarios.oilRetained0.fibre,null);
});

test("banh cuon V3 selects actual HK 10-percent pork label without losing Pirkka variant or GK HOLD",()=>{
  const cuon=evidence.recipes.find((r:any)=>r.recipeId==="vietnamilainen-banh-cuon-sienilla");
  assert.ok(cuon);
  const meat=cuon.ingredients.find((a:any)=>a.ean==="6409100037192");
  assert.ok(meat);
  assert.equal(meat.amount,150);
  assert.equal(meat.basis,"100g");
  assert.equal(meat.macros.protein,20);
  assert.equal(meat.macros.fat,10);
  assert.equal(meat.macros.carbohydrate,0);
  assert.equal(cuon.porkProductAlternatives.length,2);
  const hk=cuon.porkProductAlternatives.find((p:any)=>p.ean==="6409100037192");
  const pirkka=cuon.porkProductAlternatives.find((p:any)=>p.ean==="6410405086532");
  assert.ok(hk&&pirkka);
  assert.equal(hk.selected,true);
  assert.equal(pirkka.selected,false);
  assert.equal(pirkka.fatPer100g,12);
  assert.equal(pirkka.proteinPer100g,19);
  assert.equal(cuon.unknowns.includes("EXACT_PORK_FAT_PERCENT"),false);
  assert.equal(cuon.unknowns.includes("HK_PORK_PACK_LABEL_AND_EDIBLE_MASS_VERIFY"),true);
  const portion=meat.amount/100/evidence.servings;
  const oldProtein100g=20.9, oldFat100g=10.6;
  const oldProteinPerServing=21.6, oldFatZero=9.26;
  assert.equal(round(oldProteinPerServing+(meat.macros.protein-oldProtein100g)*portion),cuon.scenarios.oilRetained0.protein);
  assert.equal(round(oldFatZero+(meat.macros.fat-oldFat100g)*portion),cuon.scenarios.oilRetained0.fat);
  const oil=cuon.ingredients.find((a:any)=>a.item==="paistoöljy");
  assert.ok(oil);
  const oilFat=oil.amount*oil.macros.fat/100/evidence.servings;
  assert.equal(round(cuon.scenarios.oilRetained0.fat+oilFat),cuon.scenarios.oilRetained100Percent.fat);
  assert.equal(round(hk.proteinPerServingG+(pirkka.proteinPer100g-hk.proteinPer100g)*portion),pirkka.proteinPerServingG);
  assert.equal(round(hk.fatPerServingGAtZeroOilRetention+(pirkka.fatPer100g-hk.fatPer100g)*portion),pirkka.fatPerServingGAtZeroOilRetention);
  assert.equal(cuon.nutritionApproved,false);
  assert.equal(cuon.gkApproved,false);
  assert.equal(cuon.gk,null);
  assert.equal(cuon.releaseAuthorized,false);
});

test("banh cuon squid label salt and GI evidence remain product-specific and unpublished",()=>{
  const audit=read("docs/reviews/2026-11-11-f25-a2-banh-cuon-squid-salt-gi-product-audit.json");
  assert.equal(audit.recipeId,"vietnamilainen-banh-cuon-sienilla");
  const cuon=evidence.recipes.find((r:any)=>r.recipeId===audit.recipeId);
  assert.ok(cuon);
  const fish=cuon.ingredients.find((row:any)=>row.ean==="8850620888203");
  assert.ok(fish);
  assert.equal(fish.amount,15);
  assert.equal(fish.unit,"ml");
  assert.equal(fish.basis,"100ml");
  assert.equal(fish.macros.carbohydrate,3);
  assert.equal(fish.macros.protein,11);
  assert.equal(fish.saltPer100mlG,27.2);
  assert.equal(cuon.ingredients.some((row:any)=>row.item==="suola"),false);
  assert.equal(cuon.additionalSaltG,0);
  const label=audit.fishProduct.selectedLabel;
  assert.equal(audit.fishProduct.ean,"8850620888203");
  assert.equal(audit.fishProduct.selectedUnit,"ml");
  assert.equal(label.valuesPer100ml.carbohydrateG,fish.macros.carbohydrate);
  assert.equal(label.valuesPer100ml.proteinG,fish.macros.protein);
  for(const item of ["carbohydrateG","proteinG","fatG","saltG","fibreG"]){
    assert.equal(label.perRecipe[item],Math.round(label.valuesPer100ml[item]*fish.amount/100*100000)/100000);
    assert.equal(label.perServing[item],label.perRecipe[item]/audit.fishProduct.servings);
  }
  assert.equal(audit.fishProduct.saltCorrection.originalAddedSaltG,1);
  assert.equal(audit.fishProduct.saltCorrection.updatedAddedSaltG,0);
  assert.equal(audit.fishProduct.saltCorrection.oldTotalSaltFromSauceAndAdditionG,5.08);
  assert.equal(audit.fishProduct.saltCorrection.newTotalSaltFromSauceAndAdditionG,4.08);
  assert.equal(audit.fishProduct.saltCorrection.saltPerServingSauceAndAdditionG,2.04);
  assert.equal(audit.fishProduct.sameEanNotSufficientForLabelVersion,true);
  assert.ok(audit.fishProduct.otherMarketLabels.length>=2);
  assert.equal(audit.fishProduct.polyolsG,null);
  for(const source of audit.giReview.sources){
    assert.equal(source.exactMatch,false);
    assert.ok(source.humanParticipants>=10);
  }
  assert.equal(cuon.giEvidenceBoundary.transferToThisV3,false);
  assert.equal(audit.giReview.eligibleTransfer,false);
  assert.equal(audit.giReview.modeledGK,null);
  for(const key of ["completeMacrosApproved","giApproved","gkApproved","nutritionApproved","translationApproved","photoApproved","publicationAuthorized"]){
    assert.equal(audit.release[key],false,key);
  }
  const previousGate=readF25GateAtCreation(root);
  assert.equal(previousGate.sources.find((row:any)=>row.recipe_id===cuon.recipeId)?.approval,null);
});
