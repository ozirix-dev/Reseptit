import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export const bindaetteokSourcePath = "reseptit/aamupalat/korealainen-bindaetteok-aamiaiseksi.md";
const reviewedBlob = "01e805ee8ddf65e1ec11b82c68dcddab677686cb";
const historicalBlob = "3de00ffb9962fbd547a20699f45eec5c0dbbe1b6";

// Reconstruct the exact frozen source for historical GK tests only.
export function originalForBindaetteokHistory(root: string, file: string, text: string): string {
  if (file !== bindaetteokSourcePath) return text;
  const current = text.replaceAll("\r\n", "\n");
  const digest = createHash("sha1").update(`blob ${Buffer.byteLength(current, "utf8")}\0`).update(current).digest("hex");
  assert.equal(digest, reviewedBlob, file + ": unreviewed source mutation");
  const historical = execFileSync("git", ["cat-file", "blob", historicalBlob], { cwd: root, encoding: "utf8" });
  const reviewed = parseMarkdown(current);
  const original = parseMarkdown(historical);
  assert.ok(reviewed && original);
  const { image: reviewedImage, title: reviewedTitle, time_total_min: reviewedTime, ...reviewedData } = recipeFrontmatterSchema.parse(reviewed.data);
  const { image: historicalImage, title: historicalTitle, time_total_min: historicalTime, ...historicalData } = recipeFrontmatterSchema.parse(original.data);
  assert.equal(reviewedImage?.src, historicalImage?.src);
  assert.notEqual(reviewedTitle, historicalTitle);
  assert.notEqual(reviewedTime, historicalTime);
  assert.deepEqual(reviewedData, historicalData, file + ": changed historical nutrition inputs");
  return historical;
}
