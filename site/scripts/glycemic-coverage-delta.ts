import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Row = { recipeId: string; [key: string]: unknown };
type Snapshot = { sourceCommit: string; recipes: Row[]; [key: string]: unknown };
type SnapshotRef = { sourceCommit: string; sha256: string };
type CoverageDelta = {
  schemaVersion: 1;
  base: SnapshotRef;
  target: SnapshotRef;
  targetMetadata: Omit<Snapshot, "recipes">;
  targetOrder: string[];
  changes: { recipeId: string; before: Row | null; after: Row | null }[];
};

const serialize = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

function rowsById(rows: Row[]) {
  const indexed = new Map(rows.map(row => [row.recipeId, row]));
  if (indexed.size !== rows.length || rows.some(row => typeof row.recipeId !== "string" || !row.recipeId)) {
    throw Error("Invalid or duplicate recipe ID in GK coverage snapshot");
  }
  return indexed;
}

function parseSnapshot(text: string) {
  const value = JSON.parse(text) as Snapshot;
  if (!/^[a-f0-9]{40}$/.test(value.sourceCommit) || !Array.isArray(value.recipes) ||
    Object.keys(value).at(-1) !== "recipes" || serialize(value) !== text) {
    throw Error("Expected the canonical GK coverage JSON format with a pinned source commit and recipes last");
  }
  return { value, rows: rowsById(value.recipes), ref: { sourceCommit: value.sourceCommit, sha256: sha(text) } };
}

export function createCoverageDelta(base: string, target: string): CoverageDelta {
  const first = parseSnapshot(base);
  const last = parseSnapshot(target);
  const { recipes, ...targetMetadata } = last.value;
  const changes = [...new Set([...first.rows.keys(), ...last.rows.keys()])].sort().flatMap(recipeId => {
    const before = first.rows.get(recipeId) ?? null;
    const after = last.rows.get(recipeId) ?? null;
    return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ recipeId, before, after }];
  });
  return { schemaVersion: 1, base: first.ref, target: last.ref, targetMetadata,
    targetOrder: recipes.map(row => row.recipeId), changes };
}

export function reconstructCoverageSnapshot(base: string, delta: CoverageDelta): string {
  const { ref, rows } = parseSnapshot(base);
  if (delta.schemaVersion !== 1 || ref.sha256 !== delta.base.sha256 || ref.sourceCommit !== delta.base.sourceCommit) {
    throw Error("GK coverage delta base does not match the snapshot");
  }
  const seen = new Set<string>();
  for (const { recipeId, before, after } of delta.changes) {
    if (seen.has(recipeId) || JSON.stringify(rows.get(recipeId) ?? null) !== JSON.stringify(before) ||
      (after && after.recipeId !== recipeId)) {
      throw Error(`Invalid GK coverage delta row: ${recipeId}`);
    }
    seen.add(recipeId);
    if (after) rows.set(recipeId, after);
    else rows.delete(recipeId);
  }
  if (rows.size !== delta.targetOrder.length || new Set(delta.targetOrder).size !== rows.size ||
    delta.targetOrder.some(id => !rows.has(id))) {
    throw Error("Invalid GK coverage target row order");
  }
  const result = serialize({ ...delta.targetMetadata, recipes: delta.targetOrder.map(id => rows.get(id)) });
  if (delta.targetMetadata.sourceCommit !== delta.target.sourceCommit || sha(result) !== delta.target.sha256) {
    throw Error("Reconstructed GK coverage snapshot does not match the target");
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [basePath, targetPath] = process.argv.slice(2);
  if (process.argv.length !== 4) throw Error("Usage: glycemic-coverage-delta.ts BASE.json TARGET.json");
  const [base, target] = await Promise.all([readFile(basePath, "utf8"), readFile(targetPath, "utf8")]);
  const delta = createCoverageDelta(base, target);
  if (reconstructCoverageSnapshot(base, delta) !== target) throw Error("GK coverage delta failed round trip");
  process.stdout.write(serialize(delta));
}
