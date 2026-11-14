import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { parseMarkdown } from "../../src/content/markdown";
import { recipeFrontmatterSchema } from "../../src/content/schema";

const recordSchema = z.object({
  recipeId: z.string().regex(/^[a-z0-9-]+$/),
  sourcePath: z.string().regex(/^reseptit\/[a-z-]+\/[a-z0-9-]+\.md$/),
  historicalGitBlob: z.string().regex(/^[a-f0-9]{40}$/),
  fixturePath: z.string().regex(/^fixtures\/[a-z0-9-]+\.md$/),
  historicalSha256: z.string().regex(/^[a-f0-9]{64}$/),
  reviewedGitBlob: z.string().regex(/^[a-f0-9]{40}$/),
  reviewReference: z.string().regex(/^docs\/reviews\/[a-z0-9-]+\.md$/),
  comparison: z.literal("same-frontmatter-except-title-time-image-metadata"),
}).strict();

function gitBlob(bytes: Buffer): string {
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}

export function createHistoricalSourceReader(
  manifest: unknown,
  readFixture: (file: string) => Buffer,
  requiredRecipeIds: readonly string[],
) {
  const byPath = new Map<string, z.infer<typeof recordSchema>>();
  const ids = new Set<string>();
  for (const record of z.array(recordSchema).parse(manifest)) {
    const { recipeId, sourcePath, fixturePath } = record;
    assert.ok(!ids.has(recipeId) && !byPath.has(sourcePath), recipeId + ": duplicate historical record");
    assert.ok(sourcePath.endsWith(`/${recipeId}.md`), recipeId + ": wrong recipe source path");
    assert.equal(fixturePath, `fixtures/${recipeId}.md`, recipeId + ": wrong fixture path");
    ids.add(recipeId);
    byPath.set(sourcePath, record);
  }
  for (const id of requiredRecipeIds) {
    assert.ok(ids.has(id), id + ": missing required historical record");
  }

  return {
    has(file: string): boolean {
      return byPath.has(file);
    },
    restore(file: string, text: string): { text: string; historicalGitBlob: string } {
      const record = byPath.get(file);
      assert.ok(record, file + ": unknown historical source");

      // The old source lock admits LF and CRLF checkouts of the reviewed recipe.
      const current = text.replaceAll("\r\n", "\n");
      assert.equal(gitBlob(Buffer.from(current)), record.reviewedGitBlob, file + ": unreviewed source mutation");

      const bytes = readFixture(record.fixturePath);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), record.historicalSha256,
        file + ": historical fixture SHA-256 mismatch");
      assert.equal(gitBlob(bytes), record.historicalGitBlob, file + ": historical Git blob mismatch");
      const historical = bytes.toString("utf8");
      const reviewed = parseMarkdown(current);
      const original = parseMarkdown(historical);
      assert.ok(reviewed && original, file + ": missing recipe frontmatter");
      const { image: reviewedImage, title: reviewedTitle, time_total_min: reviewedTime, ...reviewedData } =
        recipeFrontmatterSchema.parse(reviewed.data);
      const { image: historicalImage, title: historicalTitle, time_total_min: historicalTime, ...historicalData } =
        recipeFrontmatterSchema.parse(original.data);
      assert.equal(reviewedData.recipe_id, record.recipeId, file + ": wrong reviewed recipe");
      assert.equal(historicalData.recipe_id, record.recipeId, file + ": wrong historical recipe");
      assert.equal(reviewedImage?.src, historicalImage?.src, file + ": changed image source");
      assert.notEqual(reviewedTitle, historicalTitle, file + ": expected reviewed title change");
      assert.notEqual(reviewedTime, historicalTime, file + ": expected reviewed time change");
      assert.deepEqual(reviewedData, historicalData, file + ": changed historical nutrition inputs");
      return { text: historical, historicalGitBlob: record.historicalGitBlob };
    },
  };
}

export const historicalSources = createHistoricalSourceReader(
  JSON.parse(readFileSync(new URL("./historical-source-manifest.json", import.meta.url), "utf8")),
  file => readFileSync(new URL(file, import.meta.url)),
  ["pohjoisafrikkalainen-bissara", "korealainen-bindaetteok-aamiaiseksi", "japanilainen-kabocha-puuro"],
);
