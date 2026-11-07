// Convert reviewed, unpublished Finnish-classics JPEG source photos into recipe WebP originals.
// Run from the repository root after "cd site && npm ci":
//   node docs/review/convert-finnish-classics-webp.mjs
// To inspect planned paths without writing, use --dry-run.
// This tool does NOT add image metadata, change publish status, calculate GK or touch a production recipe.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const requireSite = createRequire(path.join(repoRoot, "site", "package.json"));
const sharp = requireSite("sharp");
const dryRun = process.argv.includes("--dry-run");
const recipes = [
  ["karjalanpiirakat-riisipuurolla", "leivonnaiset"],
  ["marry-me-kanapasta", "paaruoat"],
  ["uunifetapasta-kirsikkatomaateilla", "paaruoat"],
  ["raejuustobagelit-ilman-kohotusta", "leivonnaiset"],
  ["linssimakaronilaatikko", "paaruoat"],
];

const results = [];
for (const [recipeId, category] of recipes) {
  const input = path.join(repoRoot, "docs", "review", "kuvat", "suomalaiset-klassikot", `${recipeId}.jpg`);
  const output = path.join(repoRoot, "kuvat", category, `${recipeId}.webp`);
  await access(input);
  const src = await sharp(input, { failOn: "error" }).metadata();
  assert(src.format === "jpeg", `${recipeId}: expected a JPEG source`);
  assert(src.width && src.height, `${recipeId}: missing pixel dimensions`);
  assert(src.width >= 1600 && src.height >= 900,
    `${recipeId}: source ${src.width}×${src.height} too small for the 1600×900 target; no upscaling`);
  assert(!src.pages || src.pages === 1, `${recipeId}: animated images prohibited`);
  // Photos were visually reviewed at source aspect; crop only the minimal difference to exact 16:9.
  if (!dryRun) {
    await mkdir(path.dirname(output), { recursive: true });
    await sharp(input)
      .rotate()
      .resize(1600, 900, { fit: "cover", position: sharp.strategy.attention, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(output);
    const actual = await sharp(output).metadata();
    assert(actual.format === "webp" && actual.width === 1600 && actual.height === 900,
      `${recipeId}: unexpected WebP output dimensions`);
  }
  results.push({
    recipeId,
    source: path.relative(repoRoot, input).replaceAll(path.sep, "/"),
    target: path.relative(repoRoot, output).replaceAll(path.sep, "/"),
    sourceWidth: src.width, sourceHeight: src.height,
    targetWidth: 1600, targetHeight: 900,
    converted: !dryRun,
  });
}
process.stdout.write(JSON.stringify({ dryRun, images: results }, null, 2) + "\n");
