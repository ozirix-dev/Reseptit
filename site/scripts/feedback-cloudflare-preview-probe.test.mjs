import assert from "node:assert/strict";
import test from "node:test";
import { previewOrigin, probePreview } from "./feedback-cloudflare-preview-probe.mjs";

const SHA = "614521360e3ca3d276a6567675489d841bac3a52";
const preview = "https://feedback-try.recipavo-v1-preview.pages.dev/";
function mockFetch({ revision = SHA, noindex = "noindex", apiStatus = 405, apiError = "method_not_allowed" } = {}) {
  const calls = [];
  const request = async (url, options) => {
    calls.push({ url, method: options?.method, redirect: options?.redirect });
    if (url.endsWith("/api/feedback")) {
      return new Response(JSON.stringify({ error: apiError }), {
        status: apiStatus, headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    }
    return new Response("<html><body>Preview</body></html>", {
      headers: {
        "content-type": "text/html",
        "x-robots-tag": noindex,
        "x-recipavo-commit": revision,
      },
    });
  };
  return { request, calls };
}

test("accepts only branch- or deployment-scoped Pages HTTPS preview origins", () => {
  assert.equal(previewOrigin(preview), "https://feedback-try.recipavo-v1-preview.pages.dev");
  for (const url of [
    "https://www.recipavo.com/",
    "https://recipavo-v1-preview.pages.dev/",
    "https://pages.dev/",
    "http://feedback-try.recipavo-v1-preview.pages.dev/",
    "https://feedback-try.recipavo-v1-preview.pages.dev:8443/",
    "https://feedback-try.recipavo-v1-preview.pages.dev/path",
    "https://feedback-try.recipavo-v1-preview.pages.dev/?track=x",
    "https://evil.example/",
    "https://user:password@feedback-try.recipavo-v1-preview.pages.dev/",
    "https://feedback-try.recipavo-v1-preview.pages.dev.evil.example/",
    "https://localhost/",
  ]) assert.throws(() => previewOrigin(url), url);
});

test("passes with correct SHA, noindex and exact Cloudflare Function 405 JSON", async () => {
  const { request, calls } = mockFetch();
  const value = await probePreview(preview, SHA, request);
  assert.equal(value.result, "PASS");
  assert.deepEqual(calls, [
    { url: "https://feedback-try.recipavo-v1-preview.pages.dev/", method: "GET", redirect: "manual" },
    { url: "https://feedback-try.recipavo-v1-preview.pages.dev/api/feedback", method: "GET", redirect: "manual" },
  ]);
  assert.equal(calls.some(x => x.method === "POST"), false);
});

test("rejects missing, malformed or stale SHA", async () => {
  for (const sha of ["", "HEAD", "abc", "0".repeat(39)]) {
    await assert.rejects(() => probePreview(preview, sha, mockFetch().request), /SHA/u);
  }
  await assert.rejects(() => probePreview(preview, SHA, mockFetch({ revision: "0".repeat(40) }).request),
    /approved release SHA/u);
});

test("preview must be nonindexed and not an arbitrary API or static fallback", async () => {
  await assert.rejects(() => probePreview(preview, SHA, mockFetch({ noindex: "index, follow" }).request),
    /must not be indexed/u);
  await assert.rejects(() => probePreview(preview, SHA, mockFetch({ apiStatus: 200 }).request),
    /missing or misrouted/u);
  await assert.rejects(() => probePreview(preview, SHA, mockFetch({ apiStatus: 404 }).request),
    /missing or misrouted/u);
  await assert.rejects(() => probePreview(preview, SHA, mockFetch({ apiError: "not_found" }).request),
    /intended Pages Function/u);
});

test("never treats a redirect or a production domain as preview evidence", async () => {
  let called = false;
  await assert.rejects(() => probePreview("https://www.recipavo.com/", SHA,
    async () => { called = true; throw new Error("Never fetch"); }), /specific HTTPS Pages preview URL/u);
  assert.equal(called, false);
  await assert.rejects(() => probePreview(preview, SHA, async () => new Response(null, {
    status: 302, headers: { location: "https://www.recipavo.com/" },
  })), /Preview root must serve HTML/u);
});
