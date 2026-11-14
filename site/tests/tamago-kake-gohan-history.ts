import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export const tamagoKakeGohanSourcePath = "reseptit/aamupalat/japanilainen-tamago-kake-gohan.md";
const reviewedBlob = "bb53351c165630bbc4ca0ce0c88c25abeae770d7";
const historicalBlob = "d51492200bb882497b036e05754064d1f837c9b7";

// Reconstruct the exact frozen source for historical GK tests only.
export function originalForTamagoKakeGohanHistory(root: string, file: string, text: string): string {
  if (file !== tamagoKakeGohanSourcePath) return text;
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
  assert.equal(reviewedTime, historicalTime);
  assert.deepEqual(reviewedData, historicalData, file + ": changed historical nutrition inputs");
  return historical;
}
