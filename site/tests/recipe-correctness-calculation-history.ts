import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import snapshot from "../../docs/nutrition/recipe-correctness-calculation-history.json";
import { projectTranslationAuditSource } from "../scripts/translation-audit";
import { beforeReviewedLocalePrecision, porkServiceNoteSourcePath } from "./history/reviewed-locale-precision";

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

export function restoreAuditInventory(rows: Array<{ recipe_id: string; notes: string; source_path: string; source_content_hash: string }>) {
  return rows.map(row => {
    const normalized = { ...row, notes: row.notes.replaceAll("\r\n", "\n") };
    if (row.source_path === porkServiceNoteSourcePath) {
      const root = fileURLToPath(new URL("../../", import.meta.url));
      const source = readFileSync(new URL("../../" + row.source_path, import.meta.url), "utf8").replaceAll("\r\n", "\n");
      const previous = beforeReviewedLocalePrecision(root, row.source_path, source);
      const notes = (text: string) => text.split("## Muistiinpanot")[1]?.trim() ?? "";
      assert.equal(row.source_content_hash, createHash("sha256").update(source).digest("hex"));
      assert.equal(normalized.notes, notes(projectTranslationAuditSource(row.source_path, source)));
      normalized.notes = notes(previous);
      normalized.source_content_hash = createHash("sha256").update(previous).digest("hex");
    }
    return restore(normalized, snapshot.inventory, row.recipe_id);
  });
}
