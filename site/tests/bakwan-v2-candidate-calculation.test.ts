import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { auditBakwanV2Candidate } from "../scripts/bakwan-v2-candidate-calculation";

const root=path.resolve(import.meta.dirname,"../..");

test("bakwan v2 is a separate structured FI draft, not a public nutrition claim",async()=>{
 const result=await auditBakwanV2Candidate(root);
 assert.equal(result.status,"DRAFT_ESTIMATES_NOT_APPROVED");
 assert.equal(result.recipeId,"indonesialainen-bakwan-jagung-punnittu-v2");
 assert.equal(result.approvedForPublication,false);
 assert.equal(result.independentNutritionApproved,false);
 assert.equal(result.glycemicLoadApproved,false);
 assert.equal(result.weighedInKitchen,false);
 assert.equal(result.missingEvidence.length,5);
 assert.equal(result.oilRetentionScenarios.length,3);
});

test("bakwan 100% oil model reproduces old macro arithmetic while all assumptions remain explicit",async()=>{
 const result=await auditBakwanV2Candidate(root);
 const all=result.oilRetentionScenarios;
 assert.deepEqual(all.map(x=>x.assumedOilRetainedFraction),[0.5,0.75,1]);
 assert.deepEqual(all[2].perServing,{
  availableCarbohydratesG:45.19,
  carbohydratePlusFibreAndPolyolsG:49.88,
  proteinG:7.89,
  fatG:8.5,
 });
 assert.deepEqual(all.map(x=>x.perServing.fatG),[5.12,6.81,8.5]);
 assert.deepEqual(all.map(x=>x.perServing.availableCarbohydratesG),[45.19,45.19,45.19]);
 assert.ok(all.every(x=>x.rows.length===5));
 assert.ok(all[0].rows.find(x=>x.ingredient==="neutraalia paistoöljyä")?.assumedRetainedFraction===0.5);
 assert.ok(all[2].rows.find(x=>x.ingredient==="kuorittua porkkanaa")?.designedGrams===60);
});
