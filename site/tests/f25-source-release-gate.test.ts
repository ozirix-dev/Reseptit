import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { f25SourceReleaseGate, sourceReleaseGateDecision, f25SourceGatePreflight, type F25SourceGate } from "../scripts/f25-source-release-gate";

const root=path.resolve(import.meta.dirname,"../..");
const gitBlob=(buf:Buffer)=>createHash("sha1").update("blob "+buf.byteLength+"\0").update(buf).digest("hex");

test("15 F25 source identities remain source-blob pinned and none is silently approved",()=>{
  assert.equal(f25SourceReleaseGate.sources.length,15);
  const ids=f25SourceReleaseGate.sources.map(x=>x.recipe_id);
  assert.equal(new Set(ids).size,15);
  assert.deepEqual(f25SourceReleaseGate.sources.filter(x=>x.public_quarantine_at_baseline).map(x=>x.recipe_id).sort(),
    ["indonesialainen-nasi-goreng-aamiaisriisi","pohjoisafrikkalainen-maakouda"]);
  const summary=f25SourceGatePreflight();
  assert.equal(summary.total,15);
  assert.equal(summary.held,15);
  assert.equal(summary.authorized,0);
  for(const source of f25SourceReleaseGate.sources) {
    assert.equal(source.approval,null);
    assert.equal(sourceReleaseGateDecision(source.recipe_id).authorized,false);
    const file=readFileSync(path.join(root,source.source_path));
    assert.equal(gitBlob(file),source.baseline_git_blob_sha);
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
  assert.match(sourceReleaseGateDecision(sample.recipe_id,cloned).reason,/FI source SHA mismatch/);
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
  assert.match(sourceReleaseGateDecision(sample.recipe_id,cloned).reason,/nutrition calculation missing/);
});
