import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { coconutBananaHistoricalBindingText, coconutBananaSourcePath } from "../scripts/coconut-banana-reviewed-source";

export function originalForCoconutBananaHistory(root: string, file: string, text: string): string {
  if (file !== coconutBananaSourcePath) return text;
  const original = execFileSync("git", ["cat-file", "blob", "e127ab5720becdce56c3e8676fdbc0b36f613061"], { cwd: root, encoding: "utf8" });
  if (text === original) return text;
  assert.notEqual(coconutBananaHistoricalBindingText(text), text, file + ": unreviewed source mutation");
  return original;
}
