import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { auditSeo, expectedPages, inspectPage, inspectDiscovery, blockedByRobots, inspectNotFound, siteBase } from "../scripts/seo-audit";
import { siteContent } from "../src/generated/content.generated";
import { contentManifest } from "../src/generated/routes.generated";

const dist = path.resolve(import.meta.dirname, "../dist");
test("HTTP 200 discovery bodies must contain the expected sitemap and crawling policy", () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteBase}/</loc></url></urlset>`;
  const robots = `User-agent: *\nSitemap: ${siteBase}/sitemap.xml\n`;
  assert.deepEqual(inspectDiscovery(sitemap, robots, ["/"]), []);
  for (const wrong of ["<html>not XML</html>", "<urlset></urlset>", sitemap.replace("</urlset>", ""), sitemap.replace("</url>", "</broken>"), sitemap.replace("</urlset>", `<url><loc>${siteBase}/</loc></url></urlset>`)]) assert.ok(inspectDiscovery(wrong, robots, ["/"]).some((f) => f.code === "SITEMAP"));
  for (const wrong of ["", robots.replace("Sitemap:", "# Sitemap:"), robots + "Disallow: /\n", robots + "Disallow: /Reseptit/\n", robots + "Disallow: /Reseptit/*\n", robots + "Disallow: /*\n"]) assert.ok(inspectDiscovery(sitemap, wrong, ["/"]).some((f) => f.code === "ROBOTS"));
  assert.equal(blockedByRobots("User-agent: *\nDisallow: /\nAllow: /Reseptit/", "/Reseptit/test/", "googlebot"), false);
  assert.equal(blockedByRobots("User-agent: *\nAllow: /\nUser-agent: Googlebot\nDisallow: /Reseptit/*", "/Reseptit/test/", "googlebot"), true);
});
test("404 needs a real robots meta, not matching text or a comment", () => {
  const meta = '<meta name="robots" content="noindex,follow">';
  assert.deepEqual(inspectNotFound(`<html><head>${meta}</head><body><h1>Missing</h1></body></html>`), []);
  for (const text of ["noindex", `<!--${meta}-->`, `<script>const html='${meta}'</script>`]) assert.ok(inspectNotFound(`<html><h1>Missing</h1>${text}</html>`).length);
});
test("all generated routes, images, sitemap and metadata match published source", async () => {
  const report = await auditSeo(dist, siteContent.recipes, Object.keys(contentManifest));
  assert.deepEqual(report.findings, []);
  assert.equal(report.routes, Object.keys(contentManifest).length);
});
test("inventory is dynamic and duplicate URLs are rejected", async () => {
  const recipe = siteContent.recipes[0];
  assert.equal(expectedPages([recipe]).length, 2);
  const report = await auditSeo(dist, [...siteContent.recipes, recipe], Object.keys(contentManifest));
  assert.ok(report.findings.some((f) => f.code === "DUPLICATE_ROUTE"));
});
test("metadata mutations cannot silently pass", async () => {
  const page = expectedPages(siteContent.recipes).find((p) => p.recipe)!;
  const html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8");
  const cases: [string, string][] = [
    [html.replace(/rel="canonical"/g, 'rel="missing"'), "CANONICAL"],
    [html.replace(/hreflang="x-default"/g, 'hreflang="fi"'), "HREFLANG"],
    [html.replace(/hreflang="th"/g, 'hreflang="xx"'), "HREFLANG"],
    [html.replace(/<title>/, '<title>Wrong '), "TITLE"],
    [html.replace(/name="description"/, 'name="missing"'), "DESCRIPTION"],
    [html.replace(/<h1/, '<h1>Extra</h1><h1'), "H1"],
    [html.replace(/<html lang="[^"]+"/, '<html lang="xx"'), "LANG"],
    [html.replace('</head>', '<meta name="robots" content="noindex"></head>'), "NOINDEX"],
    [html.replace('"@type":"Recipe"', '"@type":"Fake"'), "JSONLD_SOURCE"],
    [html.replace('"@context":"https://schema.org"', 'INVALID'), "JSONLD_PARSE"],
    [html.replace(/property="og:image"/, 'property="missing"'), "OG_IMAGE"],
  ];
  for (const [broken, code] of cases) assert.ok(inspectPage(broken, page).some((f) => f.code === code), code);
  for (const [pattern, code] of [[/<link\b[^>]*rel="canonical"[^>]*>/, "CANONICAL"], [/<link\b[^>]*hreflang="th"[^>]*>/, "HREFLANG"], [/<meta\b[^>]*name="description"[^>]*>/, "DESCRIPTION"]] as const) {
    for (const wrap of [(tag: string) => `<!--${tag}-->`, (tag: string) => `<script>const fake='${tag}'</script>`, (tag: string) => `<style>/*${tag}*/</style>`, (tag: string) => `<textarea>${tag}</textarea>`, (tag: string) => `<template>${tag}</template>`]) {
      assert.ok(inspectPage(html.replace(pattern, wrap), page).some((f) => f.code === code), code);
    }
  }
});
