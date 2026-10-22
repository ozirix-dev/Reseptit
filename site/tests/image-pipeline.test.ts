import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { rebuildPublishedImages } from "../src/content/published-images";

const siteDir = path.resolve(import.meta.dirname, "..");
const fixtureWebp = Buffer.from("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v89WAAAAA==", "base64");
const npmCli = process.env.npm_execpath;

function run(script: string, sourceRoot?: string) {
  const env = { ...process.env };
  if (sourceRoot) env.RECIPE_SOURCE_ROOT = sourceRoot;
  else delete env.RECIPE_SOURCE_ROOT;
  const result = spawnSync(npmCli ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm", npmCli ? [npmCli, "run", script] : ["run", script], {
    cwd: siteDir, encoding: "utf8", env,
  });
  if (result.status !== 0) throw new Error(`${script} failed:\n${result.stdout}\n${result.stderr}`);
}

function recipe(image: string | null) {
  return `---\ntitle: Testiresepti\nrecipe_id: testiresepti\nurl_slug: testiresepti\ncategory: paaruoka\nlanguage: fi\nstatus: published\nservings: 2\ningredients:\n  - amount: 1\n    unit: kpl\n    item: sipuli\n${image ? `image:\n  src: ${image}\n  alt: Testikuva\n  width: 1\n  height: 1\n` : ""}---\n# Testiresepti\n\nKuvaa testaava resepti.\n\n## Valmistus\n1. Valmista.\n`;
}

test("published image pipeline copies only safe, referenced images and removes stale output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "reseptit-image-test-"));
  try {
    await mkdir(path.join(root, "reseptit", "paaruoat"), { recursive: true });
    await mkdir(path.join(root, "kuvat", "paaruoat"), { recursive: true });
    await writeFile(path.join(root, "kuvat", "paaruoat", "test.webp"), fixtureWebp);
    await writeFile(path.join(root, "reseptit", "paaruoat", "test.md"), recipe("paaruoat/test.webp"));
    run("build", root);
    const copied = await readFile(path.join(siteDir, "public", "kuvat", "paaruoat", "test.webp"));
    assert.deepEqual(copied, fixtureWebp);
    const html = await readFile(path.join(siteDir, "dist", "testiresepti", "index.html"), "utf8");
    assert.match(html, /src="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\/paaruoat\/test\.webp"/);
    const json = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(json);
    assert.deepEqual(JSON.parse(json[1]).image, ["https://ozirix-dev.github.io/Reseptit/kuvat/paaruoat/test.webp"]);

    await writeFile(path.join(root, "reseptit", "paaruoat", "test.md"), recipe("paaruoat/missing.webp"));
    const missing = spawnSync(npmCli ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm", npmCli ? [npmCli, "run", "content:sync"] : ["run", "content:sync"], { cwd: siteDir, encoding: "utf8", env: { ...process.env, RECIPE_SOURCE_ROOT: root } });
    assert.notEqual(missing.status, 0, "missing published image must fail build");
    await writeFile(path.join(root, "reseptit", "paaruoat", "test.md"), recipe(null));
    run("build", root);
    await assert.rejects(readFile(path.join(siteDir, "public", "kuvat", "paaruoat", "test.webp")));
    const noImageHtml = await readFile(path.join(siteDir, "dist", "testiresepti", "index.html"), "utf8");
    assert.doesNotMatch(noImageHtml, /class="recipe-image"/);
    const noImageJson = noImageHtml.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(noImageJson);
    assert.equal("image" in JSON.parse(noImageJson[1]), false);
  } finally {
    try {
      await rm(path.join(siteDir, "public", "kuvat"), { recursive: true, force: true });
      run("build");
    } finally { await rm(root, { recursive: true, force: true }); }
  }
});

test("image rebuild rejects traversal and external symlinks without touching source", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "reseptit-image-safe-"));
  const source = path.join(root, "source");
  const publicDir = path.join(root, "public");
  const outside = path.join(root, "outside.webp");
  try {
    await mkdir(path.join(source, "paaruoat"), { recursive: true });
    await writeFile(outside, fixtureWebp);
    await assert.rejects(rebuildPublishedImages(source, publicDir, ["../outside.webp"]));
    const external = path.join(root, "external");
    await mkdir(external);
    await writeFile(path.join(external, "escape.webp"), fixtureWebp);
    // Windows junctions do not need elevated symlink privileges. Never skip safety.
    await symlink(external, path.join(source, "linked"), process.platform === "win32" ? "junction" : "dir");
    await assert.rejects(rebuildPublishedImages(source, publicDir, ["linked/escape.webp"]), /outside its allowed directory/);
    assert.deepEqual(await readFile(outside), fixtureWebp);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("visually reviewed V1.4 replacements match the correction manifest", async () => {
  const { createHash } = await import("node:crypto");
  const repoDir = path.resolve(siteDir, "..");
  const manifest = JSON.parse(await readFile(path.join(repoDir, "docs/reports/2026-10-22-v1-4-image-corrections.json"), "utf8"));
  assert.equal(manifest.images.length, 15);
  assert.equal(new Set(manifest.images.map((entry: {path: string}) => entry.path)).size, 15);
  for (const entry of manifest.images) {
    const bytes = await readFile(path.join(repoDir, entry.path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, entry.path);
    assert.notEqual(entry.sha256, entry.old_sha256, entry.path);
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP", entry.path);
    assert.deepEqual(await readFile(path.join(siteDir, "dist", entry.path)), bytes, `published ${entry.path}`);
  }
});

test("responsive variants are deterministic, deduplicated, bounded, reusable and transactional", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "reseptit-variants-"));
  const source = path.join(root, "source");
  const publicDir = path.join(root, "public");
  const output = path.join(publicDir, "kuvat");
  const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
  try {
    await mkdir(source);
    const bytes = await sharp({ create: { width: 1700, height: 997, channels: 3, background: "#aa3322" } }).webp().toBuffer();
    await writeFile(path.join(source, "wide.webp"), bytes);
    await writeFile(path.join(source, "same.webp"), bytes);
    await writeFile(path.join(source, "small.webp"), fixtureWebp);
    await writeFile(path.join(source, "draft.webp"), bytes);
    const selected = ["wide.webp", "same.webp", "wide.webp", "small.webp"];
    const first = await rebuildPublishedImages(source, publicDir, selected);
    assert.equal(first.images.length, 3);
    const wide = first.images.find((image) => image.path === "wide.webp")!;
    assert.deepEqual(wide.variants.map((v) => v.width), [480, 960, 1440]);
    assert.deepEqual(first.images.find((image) => image.path === "same.webp")!.variants, wide.variants);
    assert.equal(first.images.find((image) => image.path === "small.webp")!.variants.length, 0);
    assert.equal((await readdir(path.join(output, "_variants"))).length, 4, "3 unique variants plus manifest");
    await assert.rejects(readFile(path.join(output, "draft.webp")));
    for (const variant of wide.variants) {
      const buffer = await readFile(path.join(output, variant.path));
      const metadata = await sharp(buffer).metadata();
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.width, variant.width);
      assert.equal(metadata.height, variant.height);
      assert.ok(variant.width < wide.width);
      assert.ok(Math.abs(variant.height - wide.height * variant.width / wide.width) <= .5);
      assert.equal(hash(buffer), variant.sha256);
    }
    assert.deepEqual(await readFile(path.join(output, "wide.webp")), bytes);
    assert.deepEqual(await rebuildPublishedImages(source, publicDir, selected.reverse()), first);
    // A damaged cached variant is repaired, never copied blindly.
    await writeFile(path.join(output, wide.variants[0].path), "corrupt");
    assert.deepEqual(await rebuildPublishedImages(source, publicDir, selected), first);
    const manifest = await readFile(path.join(output, "_variants/manifest.json"));
    await writeFile(path.join(source, "invalid.webp"), "not an image");
    for (const bad of ["missing.webp", "invalid.webp", "../escape.webp", "C:/escape.webp", "bad\\path.webp"]) {
      await assert.rejects(rebuildPublishedImages(source, publicDir, [...selected, bad]));
      assert.deepEqual(await readFile(path.join(output, "_variants/manifest.json")), manifest, bad);
      assert.deepEqual(await readFile(path.join(output, "wide.webp")), bytes);
      assert.equal((await readdir(publicDir)).some((name) => name.startsWith(".kuvat-")), false);
    }
    await assert.rejects(rebuildPublishedImages(output, publicDir, ["wide.webp"]), /overlap/);
    await rebuildPublishedImages(source, publicDir, ["small.webp"]);
    for (const variant of wide.variants) await assert.rejects(readFile(path.join(output, variant.path)));
    assert.deepEqual(await readFile(path.join(source, "wide.webp")), bytes);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("all published source bytes and responsive dimensions match the generated manifest", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  const manifest = JSON.parse(await readFile(path.join(siteDir, "dist/kuvat/_variants/manifest.json"), "utf8"));
  const expected = new Set(siteContent.recipes.flatMap((r) => r.image ? [r.image.src.split("/kuvat/")[1]] : []));
  assert.deepEqual(new Set(manifest.images.map((image: {path: string}) => image.path)), expected);
  const unique = new Set<string>();
  for (const image of manifest.images) {
    const source = await readFile(path.join(siteDir, "../kuvat", image.path));
    assert.equal(createHash("sha256").update(source).digest("hex"), image.sha256);
    assert.deepEqual(await readFile(path.join(siteDir, "dist/kuvat", image.path)), source);
    for (const v of image.variants) {
      unique.add(v.path);
      const buffer = await readFile(path.join(siteDir, "dist/kuvat", v.path));
      const meta = await sharp(buffer).metadata();
      assert.equal(meta.format, "webp");
      assert.equal(meta.width, v.width);
      assert.equal(meta.height, v.height);
      assert.ok(v.width < image.width);
      assert.ok(Math.abs(v.height - image.height * v.width / image.width) <= .5);
      assert.equal(createHash("sha256").update(buffer).digest("hex"), v.sha256);
    }
  }
  assert.equal((await readdir(path.join(siteDir, "dist/kuvat/_variants"))).length, unique.size + 1);
});

test("output and cache junctions cannot escape the generated directory", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "reseptit-output-safe-"));
  const source = path.join(root, "source"), publicDir = path.join(root, "public"), outside = path.join(root, "outside");
  try {
    await mkdir(source); await mkdir(publicDir); await mkdir(outside);
    const bytes = await sharp({ create: { width: 600, height: 400, channels: 3, background: "#335522" } }).webp().toBuffer();
    await writeFile(path.join(source, "test.webp"), bytes);
    await writeFile(path.join(outside, "sentinel"), "unchanged");
    const linkType = process.platform === "win32" ? "junction" : "dir";
    await symlink(outside, path.join(publicDir, "kuvat"), linkType);
    await assert.rejects(rebuildPublishedImages(source, publicDir, ["test.webp"]), /symbolic link/);
    // Unlink only the fixture junction, never recursively remove its target.
    await (await import("node:fs/promises")).unlink(path.join(publicDir, "kuvat"));
    await assert.rejects(rebuildPublishedImages(source, publicDir, ["test.webp"], 0), /workers/);
    const first = await rebuildPublishedImages(source, publicDir, ["test.webp"]);
    await rm(path.join(publicDir, "kuvat/_variants"), { recursive: true });
    await symlink(outside, path.join(publicDir, "kuvat/_variants"), linkType);
    assert.deepEqual(await rebuildPublishedImages(source, publicDir, ["test.webp"]), first);
    assert.equal(await readFile(path.join(outside, "sentinel"), "utf8"), "unchanged");
    assert.deepEqual(await readdir(outside), ["sentinel"]);
    await assert.rejects(rebuildPublishedImages(path.join(publicDir, "kuvat"), publicDir, ["test.webp"]), /overlap/);
    await writeFile(path.join(source, "test.webp"), await sharp(bytes).tint("#ee7722").webp().toBuffer());
    const changed = await rebuildPublishedImages(source, publicDir, ["test.webp"]);
    assert.notEqual(changed.images[0].variants[0].path, first.images[0].variants[0].path);
    await assert.rejects(readFile(path.join(publicDir, "kuvat", first.images[0].variants[0].path)));
  } finally { await rm(root, { recursive: true, force: true }); }
});
