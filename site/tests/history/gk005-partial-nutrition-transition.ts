import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import manifest from "./gk005-partial-nutrition-transition.json";

type TextTransition = {
  recipeId: string; locale: string; beforeGitBlob: string;
  beforeSha256: string; afterSha256: string; inverseEdits: readonly (readonly string[])[];
};

const records: Readonly<Record<string, TextTransition>> = manifest.files;
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const blob = (text: string) => {
  const bytes = Buffer.from(text, "utf8");
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
};

// Test-only replay, never imported by a publication or evidence gate.
export function restoreGk005Source(file: string, text: string,
    transitions: Readonly<Record<string, TextTransition>> = records): string {
  assert.ok(Object.hasOwn(records, file) && Object.hasOwn(transitions, file), file + ": unknown GK-005 source");
  const entry = transitions[file]!;
  assert.deepEqual(entry, records[file], file + ": historical transition fixture changed");
  const current = text.replaceAll("\r\n", "\n");
  assert.equal(sha(current), entry.afterSha256, file + ": unreviewed GK-005 successor");
  let before = current;
  for (const [after, prior] of entry.inverseEdits) {
    assert.ok(typeof after === "string" && typeof prior === "string" && after.length > 0);
    assert.equal(before.split(after).length, 2, file + ": inverse anchor must occur once");
    before = before.replace(after, prior);
  }
  assert.equal(sha(before), entry.beforeSha256, file + ": historical SHA-256 mismatch");
  assert.equal(blob(before), entry.beforeGitBlob, file + ": historical Git blob mismatch");
  return before;
}

export function predecessorForGk005History(file: string, text: string): string {
  return Object.hasOwn(records, file) ? restoreGk005Source(file, text) : text;
}

const inventory: Readonly<Record<string, { inventory: { before: unknown; afterSha256: string } }>> = manifest.recipes;
const frozenBeforeHashes: Readonly<Record<string, string>> = {
  "janssoninkiusaus-juuriselleri": "c639473404cb8fd78c41532abeee478b21de87011110453a264917b0fe4e34b9",
  "paprikainen-vhh-gulassi": "95180c63e52c53fb88da5f88ea60443a767ba3f29528c57a3b3f4f11b54df840",
};

// Compare every property of the actual live inventory row by its exact hash
// before restoring the earlier row for existing aggregate historical seals.
export function restoreGk005Inventory<T extends { recipe_id: string; notes: string }>(rows: readonly T[]): T[] {
  for (const id of Object.keys(inventory)) {
    assert.equal(rows.filter(row => row.recipe_id === id).length, 1, id + ": missing/duplicate live nutrition row");
  }
  return rows.map(row => {
    if (!Object.hasOwn(inventory, row.recipe_id)) return row;
    const entry = inventory[row.recipe_id]!.inventory;
    const normalized = { ...row, notes: row.notes.replaceAll("\r\n", "\n") };
    assert.equal(sha(JSON.stringify(normalized)), entry.afterSha256, row.recipe_id + ": unreviewed GK-005 live inventory");
    assert.equal(sha(JSON.stringify(entry.before)), frozenBeforeHashes[row.recipe_id],
      row.recipe_id + ": historical inventory fixture changed");
    return structuredClone(entry.before) as T;
  });
}
