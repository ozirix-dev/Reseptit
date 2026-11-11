import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { auditKarnivoreFi3Readiness, karnivoreFi3Ids } from "../scripts/karnivore-fi3-release-readiness";

test("first three actual recipes remain fail-closed until image, nutrition and product evidence exist", async () => {
  const repoRoot = path.resolve(import.meta.dirname, "../..");
  const rows = await auditKarnivoreFi3Readiness(repoRoot);
  assert.deepEqual(rows.map((row) => row.recipeId), [...karnivoreFi3Ids]);
  for (const row of rows) {
    assert.equal(row.ready, false, `${row.recipeId}: this is a protected draft queue`);
    for (const blocker of [
      "DRAFT_SOURCE_ONLY",
      "IMAGE_NOT_VERSIONED",
      "IMAGE_METADATA_MISSING",
      "NUTRITION_CALCULATION_MISSING",
      "PUBLIC_MACROS_WITHHELD",
      "SOURCE_IDENTITY_NOT_APPROVED",
    ]) assert(row.blockers.includes(blocker as typeof row.blockers[number]), `${row.recipeId} missing blocker ${blocker}`);
    assert(row.evidence.proxies > 0, `${row.recipeId}: never auto-upgrade proxy source matches`);
    assert.equal(row.evidence.unresolved, 0, `${row.recipeId}: separate first-three from seven further drafts`);
  }
});
