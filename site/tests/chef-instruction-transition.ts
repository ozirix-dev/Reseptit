import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

// This is an editorial-only *historical test projection*, not GK publication
// approval. The recipe source in the live site is never rewritten by this
// module. Preserve the original frozen nutrition/GK audit for comparison.
//
// Verify proposed recipe bytes against ONE immutable PR commit, and verify
// that the sole semantic edit is confined to "## Valmistus".
const baselineMain = "ade461048ea138cd4f6a34340e8a53df79532bd7";
const editorProposed = "9fc0b8fd7af8ed95cd429b86fec669290d290b18";

export const chefCorrectionPaths = Object.freeze([
  "reseptit/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md",
  "reseptit/aamupalat/karibia-jamaikalainen-munakokkeli.md",
  "reseptit/aamupalat/karibia-johnny-cake.md",
  "reseptit/aamupalat/karibia-plantain-aamiaislautanen.md",
  "reseptit/aamupalat/kiinalainen-kevatsipulipannukakku.md",
  "reseptit/aamupalat/kiinalainen-tomaattimunakas-riisilla.md",
  "reseptit/aamupalat/korealainen-gyeran-mari-kasviksilla.md",
  "reseptit/aamupalat/malesialainen-mee-goreng-aamunuudeleilla.md",
  "reseptit/aamupalat/meksikolainen-munakokkeli-pico-de-gallolla.md",
  "reseptit/aamupalat/pohjoisafrikkalainen-harcha-juustolla.md",
  "reseptit/aamupalat/pohjoisafrikkalainen-maakouda.md",
  "reseptit/aamupalat/vietnamilainen-banh-mi-munalla.md",
] as const);
const permitted = new Set<string>(chefCorrectionPaths);
const lf = (value: string) => value.replaceAll("\r\n", "\n");
const gitText = (root: string, sha: string, file: string) =>
  lf(execFileSync("git", ["show", sha + ":" + file], { cwd: root, encoding: "utf8" }));

function withoutPreparation(value: string): string {
  const marker = "\n## Valmistus\n";
  const at = value.indexOf(marker);
  assert(at >= 0, "Chef correction must have a preparation section");
  const start = at + marker.length;
  const nextHeading = value.indexOf("\n## ", start);
  const end = nextHeading < 0 ? value.length : nextHeading;
  const instructions = value.slice(start, end);
  assert(/^\s*1\.\s/.test(instructions), "Chef correction must retain ordered steps");
  // Most older breakfast recipes end immediately after ## Valmistus.
  return value.slice(0, start) + "\n<INSTRUCTIONS_ONLY>\n" + value.slice(end);
}

/** Undo only the exact pinned 12 FI preparation-only edits in frozen GK tests. */
export function originalForChefHistoricalCheck(
  root: string, file: string, liveText: string,
): string {
  if (!permitted.has(file)) return liveText;
  const live = lf(liveText);
  const edited = gitText(root, editorProposed, file);
  const historical = gitText(root, baselineMain, file);
  assert.equal(live, edited, file + ": unknown edit cannot inherit chef historical exception");
  assert.equal(withoutPreparation(edited), withoutPreparation(historical),
    file + ": chef edit changed source fields outside ## Valmistus");
  assert.notEqual(edited, historical, file + ": expected an actual editorial correction");
  return historical;
}
