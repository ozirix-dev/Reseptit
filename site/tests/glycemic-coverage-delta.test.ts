import assert from "node:assert/strict";
import { test } from "node:test";
import { createCoverageDelta, reconstructCoverageSnapshot } from "../scripts/glycemic-coverage-delta";

const before = { recipeId: "held", glycemicLoadPerServing: null, blockers: ["SOURCE"], recipeVersion: "original" };
const after = { recipeId: "held", glycemicLoadPerServing: 0, blockers: [], recipeVersion: "replacement" };
const unchanged = { recipeId: "unchanged", glycemicLoadPerServing: null };
const removed = { recipeId: "removed", glycemicLoadPerServing: 7.5 };
const added = { recipeId: "added", glycemicLoadPerServing: null };
const snapshot = (commit: string, recipes: object[]) => JSON.stringify({ sourceCommit: commit.repeat(40), recipes }, null, 2) + "\n";
const base = snapshot("a", [unchanged, removed, before]);
const target = snapshot("b", [after, added, unchanged]);

test("delta preserves membership, order, source versions, blockers and null vs zero", () => {
  const delta = createCoverageDelta(base, target);
  assert.deepEqual(delta.changes, [
    { recipeId: "added", before: null, after: added },
    { recipeId: "held", before, after },
    { recipeId: "removed", before: removed, after: null },
  ]);
  assert.equal(reconstructCoverageSnapshot(base, JSON.parse(JSON.stringify(delta))), target);
});

test("reconstruction rejects moved bases, invalid deltas and duplicate recipe IDs", () => {
  const delta = createCoverageDelta(base, target);
  assert.throws(() => reconstructCoverageSnapshot(target, delta), /base does not match/);
  assert.throws(() => reconstructCoverageSnapshot(base, { ...delta, targetOrder: ["held", "added", "added"] }), /row order/);
  assert.throws(() => reconstructCoverageSnapshot(base, { ...delta, targetOrder: [...delta.targetOrder].reverse() }), /does not match the target/);
  assert.throws(() => createCoverageDelta(base, snapshot("b", [after, before])), /duplicate recipe ID/);
});
