import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import snapshot from "../../docs/nutrition/recipe-correctness-calculation-history.json";

type Change = { before: unknown; afterSha256: string };
type Changes = Record<string, Change>;
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

function restore(value: unknown, changes: Changes, key: string) {
  if (!Object.hasOwn(changes, key)) return value;
  const { before, afterSha256 } = changes[key];
  if (JSON.stringify(value) === JSON.stringify(before)) return value;
  assert.equal(sha(value), afterSha256, "Unreviewed recipe audit output: " + key);
  return structuredClone(before);
}

// Live checks use the current records. Historical checks first verify each
// changed record, then compare its pre-audit version against the older seals.
export function restoreAuditGk(report: Record<string, any>) {
  for (const [field, changes] of Object.entries(snapshot.gk)) {
    const rows = report[field];
    if (!rows) continue;
    report[field] = Array.isArray(rows)
      ? rows.map(row => restore(row, changes, row.recipeId))
      : Object.fromEntries(Object.entries(rows)
        .map(([key, row]) => [key, restore(row, changes, key)]));
  }
  for (const [field, removed] of Object.entries(snapshot.removedMismatches)) {
    if (!report[field]) continue;
    const ids = [...report[field]];
    for (const {id, index} of removed) {
      if (!ids.includes(id)) ids.splice(index, 0, id);
    }
    report[field] = ids;
  }
  return report;
}

export function restoreAuditInventory(rows: Array<{ recipe_id: string; notes: string }>) {
  return rows.map(row => {
    const normalized = { ...row, notes: row.notes.replaceAll("\r\n", "\n") };
    return restore(normalized, snapshot.inventory, row.recipe_id);
  });
}

