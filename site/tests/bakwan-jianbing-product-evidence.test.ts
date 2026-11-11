import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { cFiveProductEvidencePath, verifyBakwanJianbingProductEvidence } from "../scripts/bakwan-jianbing-product-evidence";

const repoRoot=path.resolve(import.meta.dirname,"../..");
const load=async()=>JSON.parse(await readFile(path.join(repoRoot,cFiveProductEvidencePath),"utf8"));

test("bakwan and jianbing: reference composition exists but recipe-specific quantities remain HOLD",async()=>{
  const out=await verifyBakwanJianbingProductEvidence(repoRoot);
  assert.equal(out.checked,2);
  assert.equal(out.approved,0);
  assert.equal(out.status,"HOLD_PRODUCT_AND_MASS");
  assert.deepEqual(out.results.map(x=>x.recipeId),[
    "indonesialainen-bakwan-maissifritter","kiinalainen-jianbing-munaletty",
  ]);
  assert.ok(out.results.every(x=>x.sourceBound && x.compositionMatched && !x.portionMeasured &&
    !x.macroApproved && !x.gkApproved));
  assert.equal(out.results[1].productValidated,false);
});

test("product evidence cannot be converted into macro or GK approval without independent proof",async()=>{
  const data=await load();data.records[0].authorizedMacro=true;
  await assert.rejects(verifyBakwanJianbingProductEvidence(repoRoot,data),/SOURCE_IDENTITY_IS_NOT_MACRO_APPROVAL/);
  data.records[0].authorizedMacro=false;data.records[1].authorizedGk=true;
  await assert.rejects(verifyBakwanJianbingProductEvidence(repoRoot,data),/SOURCE_IDENTITY_IS_NOT_GK_APPROVAL/);
});

test("source and recorded composition are exact-version-bound, no silent substitution",async()=>{
  const data=await load();data.records[0].recipeBlobSha1="0".repeat(40);
  await assert.rejects(verifyBakwanJianbingProductEvidence(repoRoot,data),/FI_SOURCE_STALE/);
  data.records[0].recipeBlobSha1=(await load()).records[0].recipeBlobSha1;
  data.records[0].referenceAvailableChoPer100G=999;
  await assert.rejects(verifyBakwanJianbingProductEvidence(repoRoot,data),/COMPOSITION_CHANGED/);
  data.records[0].referenceAvailableChoPer100G=5.56;
  data.records[1].modeledMassG=20;
  await assert.rejects(verifyBakwanJianbingProductEvidence(repoRoot,data),/Expected values to be strictly equal/);
});
