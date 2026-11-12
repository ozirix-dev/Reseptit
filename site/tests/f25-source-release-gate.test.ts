import { readF25AtCreation, readF25GateAtCreation } from "../scripts/f25-history";
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { f25SourceReleaseGate, sourceReleaseGateDecision, f25SourceGatePreflight, type F25SourceGate } from "../scripts/f25-source-release-gate";

const root=path.resolve(import.meta.dirname,"../..");
const gitBlob=(buf:Buffer)=>createHash("sha1").update("blob "+buf.byteLength+"\0").update(buf).digest("hex");

test("F25 retains the original source cohort and verifies current approvals independently", () => {
  const original = readF25GateAtCreation(root);
  assert.equal(original.sources.length, 15);
  for (const source of original.sources) {
    assert.equal(source.approval, null);
    const bytes = Buffer.from(readF25AtCreation(root, source.source_path), "utf8");
    assert.equal(gitBlob(bytes), source.baseline_git_blob_sha);
  }
  assert.deepEqual(f25SourceReleaseGate.sources.map(source => ({ ...source, approval: null })), original.sources);

  const summary = f25SourceGatePreflight();
  assert.equal(summary.total, original.sources.length);
  assert.equal(summary.held + summary.authorized, summary.total);
  for (const source of f25SourceReleaseGate.sources) {
    const decision = sourceReleaseGateDecision(source.recipe_id);
    if (!source.approval) {
      assert.deepEqual(decision, { authorized: false, reason: "F25_SOURCE_HOLD: " + source.recipe_id });
    } else {
      assert.equal(decision.authorized, true, decision.reason);
    }
  }
});

test("forged F25 approval with stale FI source hash never bypasses publication gate",()=>{
  const sample=f25SourceReleaseGate.sources.find(x=>x.recipe_id==="lahi-ita-zaatar-munat")!;
  const fake:NonNullable<typeof sample.approval>={
    status:"RELEASE_AUTHORIZED",reviewedAt:"2026-11-11",
    reviewReference:"https://github.com/ozirix-dev/Reseptit/pull/438",
    reviewerKind:"AI_EDITORIAL_WITH_INDEPENDENT_EVIDENCE",
    sourceSha256:"0".repeat(64),nutritionEvidenceSha256:"1".repeat(64),
    gkRecipeBindingSha256:"2".repeat(64),gkCalculationInputSha256:"3".repeat(64),
    gkCalculationEvidenceSha256:"4".repeat(64),
    gkDisposition:"GK_UNAVAILABLE_EXPLICITLY_REVIEWED",
    cookingAndAllergensReviewed:true,ingredientUnitConversionsReviewed:true,translationMeaningReviewRequired:true,
  };
  const cloned=structuredClone(f25SourceReleaseGate) as F25SourceGate;
  const row=cloned.sources.find(x=>x.recipe_id===sample.recipe_id)!;
  row.approval=fake;
  assert.match(sourceReleaseGateDecision(sample.recipe_id,cloned).reason,/FI source SHA mismatch|FI source or nutrition calculation missing/);
  assert.equal(sourceReleaseGateDecision(sample.recipe_id,cloned).authorized,false);
});

test("false claims of independent nutrition approval cannot substitute for exact evidence",()=>{
  const cloned=structuredClone(f25SourceReleaseGate) as F25SourceGate;
  const sample=cloned.sources.find(x=>x.recipe_id==="intialainen-pinaatti-paneer-chilla")!;
  sample.approval={
    status:"RELEASE_AUTHORIZED",reviewedAt:"2026-11-11",
    reviewReference:"https://github.com/ozirix-dev/Reseptit/pull/438",
    reviewerKind:"AI_EDITORIAL_WITH_INDEPENDENT_EVIDENCE",
    sourceSha256:createHash("sha256").update(readFileSync(path.join(root,sample.source_path),"utf8").replaceAll("\r\n","\n")).digest("hex"),
    nutritionEvidenceSha256:"1".repeat(64),gkRecipeBindingSha256:"2".repeat(64),
    gkCalculationInputSha256:"3".repeat(64),gkCalculationEvidenceSha256:"4".repeat(64),
    gkDisposition:"GK_RECHECKED_NUMERIC",cookingAndAllergensReviewed:true,
    ingredientUnitConversionsReviewed:true,translationMeaningReviewRequired:true,
  };
  assert.match(sourceReleaseGateDecision(sample.recipe_id,cloned).reason,/nutrition calculation missing|nutrition evidence SHA mismatch/);
});


test("four F25 A1 catalogue checks never treat missing product, polyol or teaspoon as zero",async()=>{
  const {runF25A1FoodCatalogPreflight}=await import("../scripts/f25-a1-food-catalog-preflight");
  const result=runF25A1FoodCatalogPreflight();
  assert.equal(result.recipes,4);
  assert.equal(result.authorized,0);
  assert.deepEqual(result.rows.map(x=>x.recipeId),[
    "rahka-marjakerroskulho","intialainen-pinaatti-paneer-chilla",
    "lahi-ita-zaatar-munat","japanilainen-hojicha-jogurtti-persimonilla"
  ]);
  for(const row of result.rows){
    assert.equal(row.status,"INSUFFICIENT SOURCE DATA",row.recipeId);
    assert.ok(row.gaps.length>0,row.recipeId);
    assert.ok(row.macroFieldsAvailable<4,row.recipeId);
  }
  assert.ok(result.rows[0]?.gaps.some(x=>x.ingredient==="mustikoita"&&x.reason.includes("polyol")));
  assert.ok(result.rows[1]?.gaps.some(x=>x.ingredient==="juustokumina"));
  assert.ok(result.rows[2]?.gaps.some(x=>x.ingredient==="zaatar"));
  assert.ok(result.rows[3]?.gaps.some(x=>x.ingredient==="hojicha-teetä"));
});
