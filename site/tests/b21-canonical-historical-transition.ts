import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

/**
 * Issue #404 B21: reconstruct ONLY the frozen historical FI text for legacy GK tests.
 * The live recipes are the reviewed canonical preparation-only versions.
 * This is NOT a new nutrition or GI/GK approval.
 */
const before = "bac553e873410b66a2b5c69b41365618319265b6"; // main before #430
const reviewed = "a0e5d7355fe2f74b74dfbd369729184344943aba"; // exact reviewed PR head
const paths = new Set([
  "reseptit/aamupalat/indonesialainen-bakwan-maissifritter.md",
  "reseptit/aamupalat/meksikolainen-huevos-divorciados.md",
]);

const lf = (s: string) => s.replaceAll("\r\n", "\n");
const gitText = (root: string, commit: string, file: string) =>
  lf(execFileSync("git", ["show", commit + ":" + file], { cwd: root, encoding: "utf8" }));

function withoutPreparation(s: string) {
  const marker = "\n## Valmistus\n";
  const start = s.indexOf(marker);
  assert(start >= 0, "B21 source must have its preparation section");
  const after = start + marker.length;
  const endIndex = s.indexOf("\n## ", after);
  const end = endIndex === -1 ? s.length : endIndex;
  return s.slice(0, after) + "\n<REVIEWED_PREPARATION>\n" + s.slice(end);
}

export function originalForB21CanonicalHistory(root: string, file: string, text: string): string {
  if (!paths.has(file)) return text;
  const current = lf(text);
  const accepted = gitText(root, reviewed, file);
  const original = gitText(root, before, file);
  assert.equal(current, accepted, file + ": unreviewed modifications cannot inherit B21 historical snapshot");
  assert.equal(withoutPreparation(accepted), withoutPreparation(original),
    file + ": B21 correction changed metadata, ingredients or non-preparation text");
  assert.notEqual(accepted, original);
  return original;
}
