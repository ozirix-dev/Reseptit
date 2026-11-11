import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

/** Three individually reviewed public FI preparations migrated into canonical sources.
 * Frozen original-GK audits require the original historical text. This helper
 * is for immutable historical tests ONLY; it grants no nutrition/GK approval.
 */
const before = "bc2688a6b32a5a6711253a71a63b35b265c3ad30";
const exactBlobs = {
  "reseptit/aamupalat/japanilainen-soba-aamiaiskeitto.md": "d0deeb60a1f9af7a2e643a889fbe2d030bd39d96",
  "reseptit/aamupalat/kiinalainen-jianbing-munaletty.md": "15eef1ad0e7d56666e923e8d035db14e7efadd0c",
  "reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md": "ee92d9f640fea1e3853a426d642d5a5a3da20fc2",
} as const;

export const reviewedThreeCanonicalPaths = Object.freeze(Object.keys(exactBlobs));
const lf = (s: string) => s.replaceAll("\r\n", "\n");
const hashBlob = (s: string) => createHash("sha1")
  .update("blob " + Buffer.byteLength(s,"utf8") + "\0").update(s).digest("hex");

export function originalForThreeCanonicalHistory(root: string, path: string, text: string): string {
  if (!Object.hasOwn(exactBlobs, path)) return text;
  const current = lf(text);
  assert.equal(hashBlob(current), exactBlobs[path as keyof typeof exactBlobs],
    path + ": unreviewed canonical source mutation");
  const frozen = lf(execFileSync("git", ["show", before + ":" + path],
    {cwd: root, encoding: "utf8"}));
  const marker = "\n## Valmistus\n";
  const at = current.indexOf(marker), oldAt = frozen.indexOf(marker);
  assert(at >= 0 && oldAt >= 0, path + ": preparation heading missing");
  assert.equal(current.slice(0,at), frozen.slice(0,oldAt),
    path + ": ingredient, meta or pre-preparation content changed");
  assert.equal((frozen.match(/\n## Muistiinpanot\n/g) ?? []).length, 0,
    path + ": unexpected historical note");
  assert.equal((current.match(/\n## Muistiinpanot\n/g) ?? []).length, 1,
    path + ": reviewed notes missing");
  assert.notEqual(current, frozen);
  return frozen;
}
