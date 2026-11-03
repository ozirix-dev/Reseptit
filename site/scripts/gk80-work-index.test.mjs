import assert from "node:assert/strict";
import test from "node:test";
import { buildWorkIndex } from "./gk80-work-index.mjs";

const main = "a".repeat(40);
const head = "b".repeat(40);
const input = {
  main, inventoryHead: head,
  inventory: {
    main, reviewedPrHeads: { 229: head }, queue: ["pending"], nextRecipeId: "pending",
    recipes: [
      { recipeId: "current", status: "PUBLISHED_SINGLE" },
      { recipeId: "pending", status: "PROPOSED_RANGE" },
    ],
  },
  heads: new Map([["229", head]]),
};

test("the index rejects inventory from a different main", () => {
  assert.throws(() => buildWorkIndex({ ...input, main: "c".repeat(40) }), /stale/);
});

test("changed PR evidence invalidates the queue without inflating coverage", () => {
  const fresh = buildWorkIndex(input);
  assert.deepEqual(fresh.coverage, { numeric: 1, total: 2 });
  assert.deepEqual(fresh.queue, ["pending"]);
  const stale = buildWorkIndex({ ...input, heads: new Map() });
  assert.deepEqual(stale.changedPullRequests, [229]);
  assert.deepEqual(stale.queue, []);
  assert.match(stale.next, /Refresh/);
});
