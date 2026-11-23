import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { PILOT_IDS, runFiveSourcePilot, verifyWrittenApproval } from "../scripts/fi-approved-source-pilot";

test("five distinct existing FI approvals bind exactly to the current reviewed bytes", async () => {
  const result = await runFiveSourcePilot();
  assert.equal(new Set(PILOT_IDS).size, 5);
  assert.equal(result.counts.checked, 5);
  assert.equal(result.counts.source_bound_approved, 5,
    JSON.stringify(result.cases.filter(c => !c.source_gate_pass)));
  assert.equal(result.counts.stale_or_blocked, 0);
  assert.equal(result.counts.human_approved, 0);
  assert.equal(result.counts.release_authorized, 0);
  assert.equal(result.auto_merge, false);
  assert.equal(result.auto_publish, false);
  assert.ok(result.cases.every(c => c.triage_group !== "candidate"),
    "A pre-existing editorial source approval does not automatically authorize translation candidates");
});

test("changed FI bytes invalidate an otherwise approved written review", () => {
  const id = "synthetic-fi";
  const path = "reseptit/valipalat/synthetic-fi.md";
  const content = "---\nrecipe_id: synthetic-fi\n---\nOriginal source";
  const review: any = {
    schema_version: 1, decision: "approved", recipe_id: id, source_path: path,
    source_sha256: createHash("sha256").update(content).digest("hex"),
    reviewed_at: "2026-11-21", reviewed_by: "synthetic-only reviewer",
    nutrition_evidence: "synthetic test reference", checks: {},
  };
  for (const key of ["ingredients","method","food_safety","servings_and_time","nutrition"])
    review.checks[key] = {status: "pass", notes: "Synthetic fixture evidence"};
  review.checks.glycemic = {status: "unavailable", notes: "No approved glycemic evidence"};
  assert.equal(verifyWrittenApproval(id, path, content, review).current, true);
  const changed = verifyWrittenApproval(id, path, content + " changed", review);
  assert.equal(changed.current, false);
  assert.match(changed.errors.join(" "), /SHA-256/);
});

test("unverified nutrition or food safety evidence blocks source proof", () => {
  const id = "synthetic-fi", path = "reseptit/valipalat/synthetic-fi.md", source = "test";
  const review: any = {
    schema_version: 1, decision: "approved", recipe_id: id, source_path: path,
    source_sha256: createHash("sha256").update(source).digest("hex"),
    reviewed_at: "2026-11-21", reviewed_by: "synthetic-only reviewer",
    nutrition_evidence: "synthetic test reference", checks: {},
  };
  for (const key of ["ingredients","method","food_safety","servings_and_time","nutrition"])
    review.checks[key] = {status: "pass", notes: "Synthetic fixture evidence"};
  review.checks.glycemic = {status: "unavailable", notes: "Synthetic GK unavailable"};
  review.checks.food_safety.status = "hold";
  assert.equal(verifyWrittenApproval(id, path, source, review).current, false);
});
