import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

export const ketoprakSourcePath = "reseptit/aamupalat/indonesialainen-ketoprak-aamiaiskulho.md";
const reviewedBlob = "e0395c7a192fe1c3961f06d5ffe536da839c5fd2";
const historicalBlob = "961463c15db6a7786768dbcbfa54dad3498155c8";

// Reconstruct the exact frozen source for historical GK tests only.
export function originalForKetoprakHistory(root: string, file: string, text: string): string {
  if (file !== ketoprakSourcePath) return text;
  const current = text.replaceAll("\r\n", "\n");
  const digest = createHash("sha1").update(`blob ${Buffer.byteLength(current, "utf8")}\0`).update(current).digest("hex");
  assert.equal(digest, reviewedBlob, file + ": unreviewed source mutation");
  const historical = execFileSync("git", ["cat-file", "blob", historicalBlob], { cwd: root, encoding: "utf8" });
  const reviewed = parseMarkdown(current);
  const original = parseMarkdown(historical);
  assert.ok(reviewed && original);
  const { image: reviewedImage, title: reviewedTitle, ...reviewedData } = recipeFrontmatterSchema.parse(reviewed.data);
  const { image: historicalImage, title: historicalTitle, ...historicalData } = recipeFrontmatterSchema.parse(original.data);
  assert.equal(reviewedImage?.src, historicalImage?.src);
  assert.notEqual(reviewedTitle, historicalTitle);
  assert.deepEqual(reviewedData, historicalData, file + ": changed historical nutrition inputs");
  return historical;
}
