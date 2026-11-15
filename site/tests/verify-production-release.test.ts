import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { verifyProductionRelease } from "../scripts/verify-production-release";

test("production verification distinguishes stale headers from wrong bytes or pages", async t => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "recipavo-release-test-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const origin = "https://www.recipavo.com";
  const sha = "a".repeat(40);
  const old = "b".repeat(40);
  const missing = "/__recipavo_release_probe_missing__/";
  const files = new Map<string, string>();
  const pages = [["fi", "/"], ["en", "/en/recipes/"], ["sv", "/sv/recept/"], ["th", "/th/recipes/"], ["fi", "/reseptit/sivu/2/"]];
  const asset = "/assets/index-abcd.js";
  for (const [locale, route] of pages) {
    const url = origin + route;
    const article = route.includes("/sivu/") ? '<article class="recipe-card">Card</article>' : "";
    files.set(route + "index.html", [
      `<html lang="${locale}"><head><link rel="canonical" href="${url}">`,
      `<link rel="alternate" hreflang="${locale}" href="${url}">`,
      `<script type="module" src="${asset}"></script></head>`,
      `<body><div id="root"><h1>Recipes</h1>${article}</div></body></html>`,
    ].join(""));
  }
  files.set("/_headers", `/*\n  X-Recipavo-Commit: ${sha}\n`);
  files.set("/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  files.set("/sitemap.xml", pages.map(([, route]) => `<loc>${origin}${route}</loc>`).join(""));
  files.set(asset, "build artifact");
  for (const [relative, body] of files) {
    const destination = path.join(dir, relative.slice(1));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, body, "utf8");
  }

  let fault: "robots-bytes" | "robots-revision" | "html-revision" | null = null;
  const request: typeof fetch = async input => {
    const { pathname, search } = new URL(String(input));
    const headers = new Headers({
      "content-type": pathname.endsWith("/") ? "text/html" : "text/plain",
      "X-Recipavo-Commit": (pathname === "/robots.txt" && (!search || fault === "robots-revision")) ||
        (pathname === "/" && fault === "html-revision") ? old : sha,
    });
    if (pathname === missing) {
      return new Response('<meta name="robots" content="noindex,follow"><h1>Missing</h1>', { status: 404, headers });
    }
    const file = pathname.endsWith("/") ? pathname + "index.html" : pathname;
    const body = pathname === "/robots.txt" && !search && fault === "robots-bytes" ? "wrong" : files.get(file);
    assert.notEqual(body, undefined, file);
    return new Response(body, { headers });
  };

  const result = await verifyProductionRelease(sha, origin, dir, request);
  assert.deepEqual(result.summaries.filter(entry => entry.cachedMetadata), [
    { route: "/robots.txt", revision: old, cachedMetadata: true },
  ]);
  fault = "robots-bytes";
  await assert.rejects(verifyProductionRelease(sha, origin, dir, request), /robots\.txt content/);
  fault = "robots-revision";
  await assert.rejects(verifyProductionRelease(sha, origin, dir, request), /robots\.txt revision probe/);
  fault = "html-revision";
  await assert.rejects(verifyProductionRelease(sha, origin, dir, request), /\/ revision/);
  await assert.rejects(verifyProductionRelease(sha, "https://recipavo-preview.pages.dev", dir, request), /production origin/);
});
