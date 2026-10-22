import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { auditSeo, expectedPages, inspectPage } from "../scripts/seo-audit";
import { siteContent } from "../src/generated/content.generated";
import { contentManifest } from "../src/generated/routes.generated";

const dist = path.resolve(import.meta.dirname, "../dist");
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
});
