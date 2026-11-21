import assert from "node:assert/strict";
import { test } from "node:test";
import { changedRecipeIds, markdownPartition } from "../scripts/translation-batch-ci-report";

test("changed FI and three translation paths are de-duplicated as one recipe identity", () => {
  const changed = [
    "reseptit/paaruoat/keitto.md",
    "kaannokset/en/paaruoat/keitto.md",
    "kaannokset/sv/paaruoat/keitto.md",
    "kaannokset/th/paaruoat/keitto.md",
    "reseptit/alkuruoat/salaatti.md",
    "docs/notes.md",
    "reseptit/raakileet/unpublished.md",
    "kaannokset/fr/paaruoat/nope.md",
  ].join("\n");
  assert.deepEqual(changedRecipeIds(changed), ["keitto", "salaatti"]);
});

test("no FI/translation paths produces an empty advisory inventory", () => {
  assert.deepEqual(changedRecipeIds("site/scripts/translation-batch-ci-report.ts\n.github/workflows/pages.yml"), []);
});

test("three-queue markdown preserves source hold reasons and explicit SHA", () => {
  const result = {
    total: 3,
    candidate: [{recipe_id: "approved", group: "candidate", pairs: 3, reasons: []}],
    needs_review: [{recipe_id: "needs", group: "needs-review", pairs: 2, reasons: ["th: review stale"]}],
    source_hold: [{recipe_id: "held", group: "source-hold", pairs: 0, reasons: ["FI quality evidence missing"]}],
    auto_publish: false, auto_merge: false,
  };
  const md = markdownPartition(result, {testedSha: "a".repeat(40), mode: "fixture"});
  for (const required of ["| candidate | 1 |", "| needs_review | 1 |", "| source_hold | 1 |",
    "FI quality evidence missing", "th: review stale", "a".repeat(40), "not** release approval"]) {
    assert.ok(md.includes(required), required);
  }
});
