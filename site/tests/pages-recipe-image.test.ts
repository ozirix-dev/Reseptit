import assert from "node:assert/strict";
import test from "node:test";
import { serveRecipeImage } from "../scripts/pages-recipe-image";

const revision = "a".repeat(40);
const image = "https://preview.pages.dev/kuvat/main.webp";
const map = { "/kuvat/main.webp": { key: "preview/main.webp", bytes: 4 } };
const fallback = async () => new Response("static");
const metadata = { size: 4, httpEtag: '"verified"', httpMetadata: { contentType: "image/webp" } };

test("GET and HEAD serve the mapped image with preview and revision headers", async () => {
  const calls: string[] = [];
  const bucket = {
    async get(key: string) { calls.push("GET " + key); return { ...metadata, body: "webp" }; },
    async head(key: string) { calls.push("HEAD " + key); return metadata; },
  };
  const get = await serveRecipeImage(new Request(image), map, bucket, fallback, revision, true);
  const head = await serveRecipeImage(new Request(image, { method: "HEAD" }), map, bucket, fallback, revision, true);
  assert.deepEqual(calls, ["GET preview/main.webp", "HEAD preview/main.webp"]);
  assert.equal(await get.text(), "webp");
  assert.equal(await head.text(), "");
  for (const response of [get, head]) {
    assert.equal(response.headers.get("content-type"), "image/webp");
    assert.equal(response.headers.get("content-length"), "4");
    assert.equal(response.headers.get("etag"), '"verified"');
    assert.equal(response.headers.get("x-recipavo-commit"), revision);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    assert.equal(response.headers.get("x-recipavo-image-source"), "r2");
  }
  const production = await serveRecipeImage(new Request(image), map, bucket, fallback, revision);
  assert.equal(production.headers.get("x-robots-tag"), null);
  assert.equal(production.headers.get("x-recipavo-image-source"), null);
});

test("missing, unavailable and metadata-mismatched R2 objects preserve static responses", async () => {
  const staticResponse = new Response("static");
  for (const get of [
    async () => null,
    async () => { throw new Error("unavailable"); },
    async () => ({ ...metadata, size: 3, body: "webp" }),
    async () => ({ ...metadata, httpMetadata: { contentType: "text/plain" }, body: "webp" }),
    async () => metadata,
  ]) {
    assert.equal(await serveRecipeImage(new Request(image), map, { get, head: get },
      async () => staticResponse, revision), staticResponse);
  }
  assert.equal(await (await serveRecipeImage(new Request(image), map, undefined, fallback, revision)).text(), "static");
});

test("preserves Pages handling for unknown images, ranges, conditions and non-image methods", async () => {
  let lookups = 0;
  const get = async () => { lookups++; return null; };
  const static404 = new Response("missing", { status: 404 });
  for (const request of [
    new Request(image.replace("main.webp", "missing.webp")),
    new Request(image, { method: "POST" }),
    new Request(image, { headers: { Range: "bytes=0-9" } }),
    new Request(image, { headers: { "If-None-Match": '"verified"' } }),
  ]) {
    const response = await serveRecipeImage(request, map, { get, head: get }, async () => static404, revision);
    assert.equal(response, static404);
  }
  assert.equal(lookups, 0);
});
