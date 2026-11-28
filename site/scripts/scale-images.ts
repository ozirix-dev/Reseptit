// Run from site/: node --import tsx scripts/scale-images.ts ../tmp/v15/scaling
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import { parse, stringify } from "yaml";
import { rebuildPublishedImages, imageSettings, type ImageManifest, type ImageVariant } from "../src/content/published-images";
const site = path.resolve(import.meta.dirname, "..");
const repo = path.dirname(site);

// Verified-corpus mode uses the normal build's manifest, not synthetic RIFF
// clones. One fresh process per measurement makes peak RSS comparable.
if (process.argv[2] === "verified-worker") {
  const [source, output, workerCount, referencePath] = process.argv.slice(3);
  const workers = Number(workerCount);
  assert.ok([source, output, referencePath].every(value => typeof value === "string" && path.isAbsolute(value)),
    "Verified worker requires absolute source, scratch output and reference manifest paths");
  assert.ok([1, 2, 4].includes(workers), "Verified worker count must be 1, 2 or 4");
  const raw = await readFile(referencePath, "utf8");
  const expected = JSON.parse(raw) as ImageManifest;
  assert.deepEqual(expected.settings, imageSettings);
  assert.ok(expected.images.length > 0);
  const paths = expected.images.map(image => image.path);
  assert.equal(new Set(paths).size, paths.length);
  // For a source <=720px, homepage selection cannot add a 720px variant.
  // Hero and reviewed AVIF rules remain in the unmodified production pipeline.
  const homepage = new Set(expected.images.filter(image => image.variants.some(v => v.width === 720)).map(image => image.path));
  const start = performance.now();
  const actual = await rebuildPublishedImages(source, output, paths, workers, homepage,
    path.join(path.dirname(output), "stage-cache"));
  const ms = performance.now() - start;
  const maxRssKiB = process.resourceUsage().maxRSS;
  assert.deepEqual(actual, expected, "Manifest parity failed against canonical build");
  const outputDir = path.join(output, "kuvat");
  const manifestBytes = await readFile(path.join(outputDir, "_variants", "manifest.json"), "utf8");
  assert.equal(manifestBytes, raw, "Manifest bytes differ from canonical build");
  const digest = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
  const files = new Map<string, ImageVariant>();
  for (const image of actual.images) {
    for (const item of [image, ...image.variants, image.homeAvif, image.heroAvif]) {
      if (!item) continue;
      const prior = files.get(item.path);
      if (prior) assert.deepEqual([item.bytes, item.sha256, item.width, item.height],
        [prior.bytes, prior.sha256, prior.width, prior.height], item.path);
      files.set(item.path, item);
    }
  }
  for (const item of files.values()) {
    const bytes = await readFile(path.join(outputDir, item.path));
    assert.equal(bytes.length, item.bytes, item.path);
    assert.equal(digest(bytes), item.sha256, item.path);
  }
  const actualPaths = (await readdir(outputDir, { recursive: true, withFileTypes: true }))
    .filter(entry => entry.isFile())
    .map(entry => path.relative(outputDir, path.join(entry.parentPath, entry.name)).split(path.sep).join("/"))
    .sort();
  assert.deepEqual(actualPaths, [...files.keys(), "_variants/manifest.json"].sort());
  console.log(JSON.stringify({ workers, ms, maxRssKiB, filesVerified: files.size,
    sources: paths.length, manifestSha256: digest(manifestBytes), node: process.version,
    platform: process.platform, availableParallelism: os.availableParallelism(), encoder: imageSettings.encoder }));
} else if (process.argv[2] === "worker") {
  const [source, output, workers] = process.argv.slice(3);
  const start = performance.now();
  const files = (await readdir(path.join(source, "kuvat"))).filter((f) => f.endsWith(".webp"));
  const manifest = await rebuildPublishedImages(path.join(source, "kuvat"), output, files, Number(workers));
  const variants = [...new Map(manifest.images.flatMap((i) => i.variants).map((v) => [v.path, v])).values()];
  console.log(JSON.stringify({ ms: performance.now() - start, maxRssKiB: process.resourceUsage().maxRSS,
    workers: Number(workers), sources: manifest.images.length, variants: variants.length, bytes: variants.reduce((n, v) => n + v.bytes, 0) }));
} else {
  const outputRoot = path.resolve(process.argv[2] ?? "../tmp/v15/scaling");
  // Each run owns a new directory, never cleans another worktree or fixture.
  await mkdir(outputRoot, { recursive: false });
  async function execute(args: string[], cwd: string, env: NodeJS.ProcessEnv = process.env) {
    const start = performance.now();
    const child = spawn(process.execPath, args, { cwd, env, stdio: "pipe" });
    let log = ""; child.stdout.on("data", (b) => log += b); child.stderr.on("data", (b) => log += b);
    const code = await new Promise<number | null>((resolve, reject) => { child.once("error", reject); child.once("exit", resolve); });
    if (code !== 0) throw Error(log);
    return { ms: performance.now() - start, log };
  }
  async function markdown(dir: string): Promise<string[]> {
    return (await Promise.all((await readdir(dir, { withFileTypes: true })).map((e) => e.isDirectory() ? markdown(path.join(dir, e.name)) : e.name.endsWith(".md") ? [path.join(dir, e.name)] : []))).flat();
  }
  const templates = [];
  for (const dir of ["reseptit/aamupalat", "reseptit/alkuruoat", "reseptit/paaruoat", "reseptit/jalkiruoat", "reseptit/leivonnaiset", "kaannokset"]) {
    for (const file of await markdown(path.join(repo, dir))) {
      const text = await readFile(file, "utf8"), match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) continue;
      const data = parse(match[1]); if (data.status === "published" && data.image) templates.push({ data, body: match[2] });
    }
  }
  const ids = [...new Set(templates.filter((t) => t.data.language === "fi").map((t) => t.data.recipe_id))];
  const results: unknown[] = [];
  for (const count of [ids.length, 250, 500]) {
    const root = path.join(outputRoot, String(count)), source = path.join(root, "source");
    await mkdir(path.join(source, "kuvat"), { recursive: true });
    for (let i = 0; i < count; i++) {
      const id = ids[i % ids.length], same = templates.filter((t) => t.data.recipe_id === id);
      const original = await readFile(path.join(repo, "kuvat", same[0].data.image.src));
      // Valid unknown RIFF chunk: unique source bytes, unchanged decoded pixels.
      // This prevents deduplication from making 500 sources look like only 119.
      const payload = Buffer.from(String(i).padStart(8, "0")), chunk = Buffer.alloc(8 + payload.length);
      chunk.write("simu", 0); chunk.writeUInt32LE(payload.length, 4); payload.copy(chunk, 8);
      const bytes = Buffer.concat([original, chunk]); bytes.writeUInt32LE(bytes.length - 8, 4);
      const imageName = `sample-${i}.webp`;
      await writeFile(path.join(source, "kuvat", imageName), bytes);
      for (const template of same) {
        const data = structuredClone(template.data);
        data.recipe_id = `sample-${i}`; data.url_slug = `sample-${i}`; data.image.src = imageName;
        const dir = path.join(source, data.language === "fi" ? "reseptit/paaruoat" : `kaannokset/${data.language}/paaruoat`);
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, `sample-${i}.md`), `---\n${stringify(data)}---\n${template.body}`);
      }
    }
    const imageRuns: unknown[] = [];
    const builds: unknown[] = [];
    const row = { count, versions: count * templates.filter((t) => t.data.recipe_id === ids[0]).length, imageRuns, builds };
    results.push(row);
    const checkpoint = () => writeFile(path.join(outputRoot, "results.json"), JSON.stringify(results, null, 2));
    for (const workers of [1, 2, 4]) {
      const output = path.join(root, `pipeline-${workers}`);
      for (const pass of ["cold", "repeat"]) {
        const result = await execute(["--import", "tsx", path.join(site, "scripts/scale-images.ts"), "worker", source, output, String(workers)], site);
        imageRuns.push({ pass, ...JSON.parse(result.log.trim()) });
        await checkpoint();
      }
    }
    const clone = path.join(root, "site");
    await cp(site, clone, { recursive: true, filter: (src) => !["node_modules", "dist", "generated", "data", "kuvat"].includes(path.basename(src)) });
    const { symlink } = await import("node:fs/promises");
    await symlink(path.join(site, "node_modules"), path.join(clone, "node_modules"), process.platform === "win32" ? "junction" : "dir");
    for (const pass of ["cold", "repeat"]) {
      const result = await execute([process.env.npm_execpath ?? path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"), "run", "build"], clone, { ...process.env, RECIPE_SOURCE_ROOT: source });
      await writeFile(path.join(root, `build-${pass}.log`), result.log);
      builds.push({ pass, ms: result.ms });
      await checkpoint();
    }
    await writeFile(path.join(outputRoot, "results.json"), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results.at(-1)));
  }
}
