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

const gkRegistryPath = "docs/nutrition/glycemic-load-recipe-bindings.json";
const gkRegistryBefore = "b8f934f49a43e586ceeda7ed3e3f0cd19a99c76d13e18541565075b8aa182996";
const gkRegistryAfter = "713691ca88e8c6627e6c52a16a611dbfbe9f5076c94f27091523124d0a188d83";
const gkRegistryAfterBlob = "28abe2f8ac00056969af44704353efbb1e893106";

// Exact old registry rows, from the pinned predecessor Git blob. Older locale
// bindings may be approved-note projections, not raw markdown SHA-256 values.
export const priorExactRecipeText: Readonly<Record<string, unknown>> = {
  "janssoninkiusaus-juuriselleri": {
    "sourceSha256": "277c4c9c65bec0fad4548e4df80b13b2ffb52efcc0c0eb8d9d44ba477d7a9943",
    "locales": {
      "en": {
        "path": "kaannokset/en/paaruoat/janssoninkiusaus-juuriselleri.md",
        "sha256": "41177b4288899e04dc50d953c5dfdb45bd4b6576d688a87aac6cd64c2c2ffac6"
      },
      "sv": {
        "path": "kaannokset/sv/paaruoat/janssoninkiusaus-juuriselleri.md",
        "sha256": "0d1280214a6210e0f2127912fb398d53766c9805e438aca0c3ed73c73f9e9380"
      },
      "th": {
        "path": "kaannokset/th/paaruoat/janssoninkiusaus-juuriselleri.md",
        "sha256": "b3a9a741c6c171d2add9c6ff2ebdfe89224afb1d87c007f16e12c8764747dee5"
      }
    }
  },
  "paprikainen-vhh-gulassi": {
    "sourceSha256": "6ad3fcad16aeea7c58b2cf2f90f690be0e4d2248a5a5695a22cc1493d7a8b51e",
    "locales": {
      "en": {
        "path": "kaannokset/en/paaruoat/paprikainen-vhh-gulassi.md",
        "sha256": "a5c65e76ba73b7db657ee103243f14a3043f4c20b62b516d2fafe80cf80b4767"
      },
      "sv": {
        "path": "kaannokset/sv/paaruoat/paprikainen-vhh-gulassi.md",
        "sha256": "8232f403116497802403671a9574fbb255a9a1993d025734a97c57489fe5f827"
      },
      "th": {
        "path": "kaannokset/th/paaruoat/paprikainen-vhh-gulassi.md",
        "sha256": "e1c5d7763111f04246111f5054768ab4db4793e2c11e66365fc09f811f7761d0"
      }
    }
  }
};

// Reverse only the exact GK-005 registry successor, before the older
// frozen-release readers normalize or reconstruct the registry. A new
// registry revision needs its own reviewed transition, not a relaxed seal.
export function predecessorForGk005RegistryHistory(file: string, text: string): string {
  if (file !== gkRegistryPath) return text;
  const current = text.replaceAll("\r\n", "\n");
  const currentHash = sha(current);
  if (currentHash === gkRegistryBefore) {
    assert.equal(blob(current), manifest.priorExactGkRegistryGitBlob, file + ": predecessor Git blob mismatch");
    return current;
  }
  assert.equal(currentHash, gkRegistryAfter, file + ": unreviewed GK-005 registry successor");
  assert.equal(blob(current), gkRegistryAfterBlob, file + ": successor Git blob mismatch");
  const data = JSON.parse(current) as { exactRecipeText: Record<string, unknown> };
  for (const [id, entry] of Object.entries(manifest.recipes)) {
    const candidate = entry.candidateExactRecipeText;
    assert.deepEqual(data.exactRecipeText[id], candidate, id + ": unexpected successor binding");
    assert.ok(Object.hasOwn(priorExactRecipeText, id), id + ": missing prior binding");
    data.exactRecipeText[id] = structuredClone(priorExactRecipeText[id]!);
  }
  const predecessor = JSON.stringify(data, null, 2) + "\n";
  assert.equal(sha(predecessor), gkRegistryBefore, file + ": historical registry SHA-256 mismatch");
  assert.equal(blob(predecessor), manifest.priorExactGkRegistryGitBlob, file + ": historical registry Git blob mismatch");
  return predecessor;
}
