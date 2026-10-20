import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
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
    try {
      await (await import("node:fs/promises")).symlink(outside, path.join(source, "paaruoat", "escape.webp"));
    } catch (error) {
      if (process.platform !== "win32") throw error;
      return;
    }
    await assert.rejects(rebuildPublishedImages(source, publicDir, ["paaruoat/escape.webp"]), /outside its allowed directory/);
    assert.deepEqual(await readFile(outside), fixtureWebp);
  } finally { await rm(root, { recursive: true, force: true }); }
});
