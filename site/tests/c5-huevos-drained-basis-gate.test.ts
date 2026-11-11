import assert from "node:assert/strict";
import test from "node:test";
import {auditHuevosDrainedBasis,huevosV2ProductCandidates} from "../scripts/c5-huevos-drained-basis-gate";
import {siteContent} from "../src/generated/content.generated";

test("C5 current and legacy bean EANs stay independent and as-sold labels cannot approve drained macros",()=>{
  assert.deepEqual(huevosV2ProductCandidates.map(p=>p.ean),
    ["7310130009839","7310130009785","3083681192513"]);
  const outputs=huevosV2ProductCandidates.map(p=>auditHuevosDrainedBasis(p));
  assert.deepEqual(outputs.map(r=>r.counterfactualPerServing.availableCarbohydrateG),[15.66,11.54,14.91]);
  assert.deepEqual(outputs.map(r=>r.counterfactualPerServing.proteinG),[13.49,13.57,13.42]);
  assert.deepEqual(outputs.map(r=>r.counterfactualPerServing.fatGRange),[
    {min:6.54,max:13.28},{min:6.76,max:13.51},{min:6.76,max:13.51}
  ]);
  for(const r of outputs){
    assert.equal(r.usedBeanGrams,150);
    assert.equal(r.labelBasis,"as_sold");
    assert.equal(r.drainedBasisConfirmed,false);
    assert.equal(r.approvedNutrition,null);
    assert.equal(r.approvedTotalCarbohydrate,null);
    assert.equal(r.approvedFibre,null);
    assert.equal(r.approvedGk,null);
    assert.equal(r.releaseAuthorized,false);
    assert(r.packagingYieldRatio>0 && r.packagingYieldRatio<1);
  }
  assert.equal(outputs[0].counterfactualPerServing.availableCarbohydrateG-
      outputs[1].counterfactualPerServing.availableCarbohydrateG,4.12);
});
test("C5 fails on invented drained evidence or invalid bean mass",()=>{
  const candidate=huevosV2ProductCandidates[0];
  assert.throws(()=>auditHuevosDrainedBasis({...candidate,drainedBasisConfirmed:true} as never),/UNREVIEWED_DRAINED_BASIS_STATE/);
  assert.throws(()=>auditHuevosDrainedBasis(candidate,0),/INVALID_BEAN_GRAMS/);
  assert.throws(()=>auditHuevosDrainedBasis(candidate,Number.NaN),/INVALID_BEAN_GRAMS/);
});
test("C5 current product review does not publish draft V2 or change its nutrition",()=>{
  const id="meksikolainen-huevos-divorciados-kypsat-pavut-v2";
  assert.equal(siteContent.recipes.some(r=>r.recipeId===id),false);
});
