import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const project = "recipavo-r2-integration-preview";
const branch = "r2-trial";
const previewOrigin = `https://${branch}.${project}.pages.dev`;
const bucket = "recipavo-r2-full-preview-e3ad6d91";

async function main() {
  const [distArg, pilotMapFile, outputArg, revision, accountId, fallbackProbe, ...extra] = process.argv.slice(2);
  assert.ok(distArg && pilotMapFile && outputArg && revision && accountId && fallbackProbe && !extra.length,
    "Usage: node scripts/prepare-pages-recipe-preview.mjs <dist> <pilot-map> <new-stage-dir> <commit> <account> <fallback-path>");
  assert.match(revision, /^[a-f0-9]{40}$/);
  assert.match(accountId, /^[a-f0-9]{32}$/);
  const dist = path.resolve(distArg);
  const output = path.resolve(outputArg);
  assert.ok(output !== dist && !output.startsWith(dist + path.sep), "Use a stage directory outside the build");
  const home = await readFile(path.join(dist, "index.html"), "utf8");
  assert.ok(home.includes(`rel="canonical" href="${previewOrigin}/"`) &&
    !home.includes('rel="canonical" href="https://www.recipavo.com'), "Build with RECIPAVO_PREVIEW_ORIGIN first");
  const pilot = JSON.parse(await readFile(pilotMapFile, "utf8"));
  const { images } = JSON.parse(await readFile(path.join(dist, "kuvat/_variants/manifest.json"), "utf8"));
  const map = Object.create(null);
  for (const image of Object.values(images)) {
    for (const item of [image, ...image.variants]) {
      assert.match(item.path, /^(?:[\w.-]+\/)*[\w.-]+\.webp$/);
      assert.ok(!item.path.split("/").some(segment => segment === "." || segment === ".."), item.path);
      const publicPath = "/kuvat/" + item.path;
      const bytes = await readFile(path.join(dist, "kuvat", item.path));
      const digest = createHash("sha256").update(bytes).digest("hex");
      assert.ok(digest === item.sha256 && bytes.length === item.bytes, publicPath + " build integrity");
      const entry = pilot[publicPath];
      assert.ok(entry?.sha256 === digest && entry.bytes === bytes.length && entry.contentType === "image/webp",
        publicPath + " preview R2 identity");
      const pilotKey = `e3ad6d9139d283de093c02fb7960aa500c250c81/${digest}/${path.basename(item.path)}`;
      assert.equal(entry.key, pilotKey, publicPath + " preview object key");
      map[publicPath] = { key: entry.key, bytes: item.bytes };
    }
  }
  assert.ok(Object.keys(map).length > 0 && Object.keys(map).length === Object.keys(pilot).length,
    "Build and preview route sets differ");
  assert.ok(Object.hasOwn(map, fallbackProbe), "Fallback probe must be a published WebP");
  // A preview-only missing key exercises the real Pages asset fallback. No bucket object is modified.
  map[fallbackProbe].key = `preview-fallback-probe/${revision}/${path.posix.basename(fallbackProbe)}`;

  await mkdir(output);
  const assets = path.join(output, "public");
  const functions = path.join(output, "functions", "kuvat");
  await cp(dist, assets, { recursive: true, errorOnExist: true, force: false });
  await mkdir(functions, { recursive: true });
  await cp(new URL("./pages-recipe-image.ts", import.meta.url), path.join(output, "pages-recipe-image.ts"));
  await writeFile(path.join(output, "image-map.json"), JSON.stringify(map));
  await writeFile(path.join(assets, "_routes.json"), JSON.stringify({
    version: 1, include: ["/kuvat/*"], exclude: ["/kuvat/_variants/manifest.json"],
  }));
  await writeFile(path.join(assets, "robots.txt"), "User-agent: *\nDisallow: /\n");
  await writeFile(path.join(assets, "_headers"),
    `/*\n  X-Recipavo-Commit: ${revision}\n  X-Robots-Tag: noindex, nofollow\n`);
  await writeFile(path.join(functions, "[[path]].js"), `import { serveRecipeImage } from "../../pages-recipe-image.ts";
import map from "../../image-map.json";
export const onRequest = context => serveRecipeImage(context.request, map,
  context.env.RECIPE_IMAGES, () => context.next(), "${revision}", true);
`);
  await writeFile(path.join(output, "wrangler.jsonc"), JSON.stringify({
    name: project, account_id: accountId, compatibility_date: "2026-11-15",
    pages_build_output_dir: "./public", env: {
      preview: { r2_buckets: [{ binding: "RECIPE_IMAGES", bucket_name: bucket, jurisdiction: "eu" }] },
    },
  }, null, 2));
  console.log(JSON.stringify({ project, branch, bucket, revision, fallbackProbe,
    deliberatelyMissingKey: map[fallbackProbe].key, paths: Object.keys(map).length }));
}

await main();
