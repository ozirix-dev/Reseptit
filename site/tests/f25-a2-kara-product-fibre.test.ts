import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"../..");
const read=(name:string)=>JSON.parse(readFileSync(path.join(root,name),"utf8"));
const data=read("docs/reviews/2026-11-11-f25-a2-kara-coconut-fibre-alternative.json");
const near=(a:number,b:number)=>Math.abs(a-b)<1e-9;

test("Kara alternative has exact volume basis, fills coconut fibre evidence but keeps unknown polyols nullable",()=>{
  const kara=data.product,thai=data.replacedProduct;
  assert.equal(data.status,"HOLD_PRODUCT_SUBSTITUTION_ONLY");
  assert.equal(kara.ean,"8886303210238");
  assert.equal(thai.ean,"8851978804068");
  assert.equal(kara.declaredBasis,"per100ml");
  assert.equal(thai.declaredBasis,"per100ml");
  assert.equal(kara.per100ml.fibre,0.3);
  assert.equal(kara.per100ml.polyols,null);
  assert.equal(thai.per100ml.fibre,null);
  assert.equal(data.recipes.length,2);
  assert.equal(data.release.nutritionApproved,false);
  assert.equal(data.release.gkApproved,false);
  assert.equal(data.release.sourceApproved,false);
  assert.equal(data.release.publicationAuthorized,false);
  assert.equal(data.release.gk,null);
  const gate=read("meta/kaannokset/f25-release-gate.json");
  for(const candidate of data.recipes) {
    assert.equal(candidate.coconutVolumeMl,200);
    assert.equal(gate.sources.find((s:any)=>s.recipe_id===candidate.recipeId)?.approval,null);
    assert.ok(candidate.remainingBlockers.length>=4);
    assert.equal(candidate.newPartial.polyolsTotal,null);
    const old=candidate.oldPartial,newer=candidate.newPartial;
    const carbDelta=(kara.per100ml.carbohydrate-thai.per100ml.carbohydrate)*candidate.coconutVolumeMl/100/candidate.servings;
    const proteinDelta=(kara.per100ml.protein-thai.per100ml.protein)*candidate.coconutVolumeMl/100/candidate.servings;
    const fatDelta=(kara.per100ml.fat-thai.per100ml.fat)*candidate.coconutVolumeMl/100/candidate.servings;
    if(candidate.recipeId==="vietnamilainen-papaija-kookospuuro") assert.ok(near(newer.carbohydrate,old.carbohydrate+carbDelta));
    if(candidate.recipeId==="vietnamilainen-papaija-kookospuuro"){
      const prior=read(candidate.basedOn);
      assert.equal(prior.status,"HOLD");
      assert.ok(near(old.carbohydrate,prior.perServingPartial.availableCarbohydrateG));
      assert.ok(near(newer.proteinLowerBound,old.proteinLowerBound+proteinDelta));
      assert.ok(near(newer.proteinUpperBoundExclusive,old.proteinUpperBoundExclusive+proteinDelta));
      assert.ok(near(newer.fatLowerBound,old.fatLowerBound+fatDelta));
      assert.ok(near(newer.fatUpperBoundExclusive,old.fatUpperBoundExclusive+fatDelta));
      assert.equal(newer.fibreTotal,null,"Cock pearls missing fibre prevents complete total");
      assert.ok(near(newer.fibreLowerBound,old.fibreLowerBound+kara.per100ml.fibre*200/100/2));
    } else {
      const prior=read(candidate.basedOn).recipes.find((r:any)=>r.recipeId===candidate.recipeId);
      assert.ok(prior);
      assert.equal(old.carbohydrate,null);
      assert.equal(newer.carbohydrate,null);
      assert.equal(prior.scenarios.oilRetained100Percent.carbohydrate,null);
      assert.ok(near(candidate.conditionalEuDefinitionComparison.oldThaiChoiceCarbohydrateGPerServing,40.644));
      assert.ok(near(candidate.conditionalEuDefinitionComparison.newKaraCarbohydrateGPerServing,40.344));
      assert.ok(near(candidate.conditionalEuDefinitionComparison.newKaraCarbohydrateGPerServing-
        candidate.conditionalEuDefinitionComparison.oldThaiChoiceCarbohydrateGPerServing,carbDelta));
      assert.equal(candidate.conditionalEuDefinitionComparison.publishedNutritionAuthorized,false);
      assert.ok(near(newer.protein,old.protein+proteinDelta));
      assert.ok(near(newer.fatAtZeroOilRetention,old.fatAtZeroOilRetention+fatDelta));
      assert.ok(near(newer.fatAtFullOilRetention,old.fatAtFullOilRetention+fatDelta));
      assert.equal(old.fibreTotal,null);
      assert.equal(candidate.newFibreComponentsTotalG.meiraTurmeric,null);
      assert.equal(newer.fibreTotal,null,"retailer turmeric values are internally inconsistent");
      const reliableFibre=["fineRiceFlour","beanSprouts","karaCoconutMilk","shrimp"]
        .map(key=>candidate.newFibreComponentsTotalG[key])
        .reduce((sum:number,value:number)=>sum+value,0);
      assert.ok(near(newer.fibreLowerBoundG,reliableFibre/candidate.servings));
    }
  }
});
