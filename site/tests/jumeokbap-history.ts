import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";

export const jumeokbapSourcePath = "reseptit/aamupalat/korealainen-jumeokbap-merilevalla.md";
const reviewedBlob = "7f0441079a4121aed2cad4ab21ab460b62281e37";
const historicalBlob = "6e2f037fa0f44c916de0ad8ba91d32ad2224c960";

// Reconstruct the exact frozen source for historical GK tests only.
export function originalForJumeokbapHistory(root: string, file: string, text: string): string {
  if (file !== jumeokbapSourcePath) return text;
  const current = text.replaceAll("\r\n", "\n");
  const digest = createHash("sha1").update(`blob ${Buffer.byteLength(current, "utf8")}\0`).update(current).digest("hex");
  assert.equal(digest, reviewedBlob, file + ": unreviewed source mutation");
  const historical = execFileSync("git", ["cat-file", "blob", historicalBlob], { cwd: root, encoding: "utf8" });
  const reviewed = parseMarkdown(current);
  const original = parseMarkdown(historical);
  assert.ok(reviewed && original);
  const { image: reviewedImage, ...reviewedData } = reviewed.data;
  const { image: historicalImage, ...historicalData } = original.data;
  assert.notDeepEqual(reviewedImage, historicalImage);
  assert.deepEqual(reviewedData, historicalData, file + ": changed historical nutrition inputs");
  return historical;
}
