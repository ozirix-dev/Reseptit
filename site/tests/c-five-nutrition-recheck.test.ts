import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { auditCFive, cFiveIds } from "../scripts/c-five-nutrition-recheck";

const repoRoot=path.resolve(import.meta.dirname,"../..");

test("C five: two reported macro sets reproduce exactly; three remain evidence-HOLD",async()=>{
  const results=await auditCFive(repoRoot);
  assert.deepEqual(results.map(x=>x.recipeId),[...cFiveIds]);
  assert.ok(results.every(x=>x.status==="HOLD_EVIDENCE"&&x.blockers.length));
  const reproduced=results.filter(x=>x.calculationStatus==="REPRODUCED_AUTOMATED_ONLY");
  assert.deepEqual(reproduced.map(x=>x.recipeId),[
    "indonesialainen-bakwan-maissifritter","kiinalainen-jianbing-munaletty",
  ]);
  for(const item of reproduced) {
    assert.deepEqual(item.reproducedPerServing,item.sourceDisplayedPerServing);
    assert.ok(item.blockers.includes("AUTOMATED_ONLY_IS_NOT_INDEPENDENT_SOURCE_APPROVAL"));
  }
  const other=results.filter(x=>x.calculationStatus==="NO_INDEPENDENT_CALCULATION");
  assert.equal(other.length,3);
  for(const item of other)assert.ok(Object.values(item.sourceDisplayedPerServing).every(x=>x===null));
});

test("C five: carrot sensitivity is explicitly modeled, never counted as measured",async()=>{
  const results=await auditCFive(repoRoot);
  const bakwan=results.find(x=>x.recipeId==="indonesialainen-bakwan-maissifritter")!;
  assert.deepEqual(bakwan.reproducedPerServing,{
    carbsNetG:45.19,carbsTotalG:49.88,proteinG:7.89,fatG:8.5,
  });
  assert.deepEqual(bakwan.sensitivities?.map(x=>x.grams),[35,60,65,100]);
  assert.equal(bakwan.sensitivities?.[1].differenceToStoredG,0);
  assert.ok(bakwan.sensitivities![0].carbsNetPerServingG<45.19);
  assert.ok(bakwan.sensitivities![3].carbsNetPerServingG>45.19);
  assert.ok(bakwan.blockers.includes("CARROT_COUNT_NOT_MEASURED_60G_MODELED"));
});

test("C five: soybean paste sensitivity preserves exact 15g model, but product remains unknown",async()=>{
  const results=await auditCFive(repoRoot);
  const jianbing=results.find(x=>x.recipeId==="kiinalainen-jianbing-munaletty")!;
  assert.deepEqual(jianbing.reproducedPerServing,{
    carbsNetG:38.96,carbsTotalG:41.6,proteinG:14.79,fatG:15.39,
  });
  assert.deepEqual(jianbing.sensitivities?.map(x=>x.grams),[10,15,20,30]);
  assert.equal(jianbing.sensitivities?.[1].differenceToStoredG,0);
  assert.ok(jianbing.blockers.includes("SOYBEAN_PASTE_PRODUCT_NOT_IDENTIFIED"));
});

test("C five: no GK or nutrition approvals are produced by arithmetic reproduction",async()=>{
  const results=await auditCFive(repoRoot);
  for(const item of results) {
    assert.ok(!("approvedNutrition" in item));
    assert.ok(!("approvedGk" in item));
    assert.ok(!("gkPerServing" in item));
  }
  assert.ok(results.find(x=>x.recipeId==="japanilainen-soba-aamiaiskeitto")!.blockers.includes("GK100_SOURCE_SEALED"));
});
