import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export const bissaraSourcePath = "reseptit/aamupalat/pohjoisafrikkalainen-bissara.md";
const reviewedBlob = "1c7fb66e7512d91bd986d3de8c20a4a5ee0251c6";
const historicalBlob = "f64ad230f209daf4c1125edd09ede4c734e4e620";

// Reconstruct the exact frozen source for historical GK tests only.
export function originalForBissaraHistory(root: string, file: string, text: string): string {
  if (file !== bissaraSourcePath) return text;
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
