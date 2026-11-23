import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { auditSeo, expectedPages, inspectPage, inspectDiscovery, blockedByRobots, inspectNotFound, siteBase } from "../scripts/seo-audit";
import { recipeSeoDescriptions } from "../scripts/recipe-seo-descriptions";
import { siteTarget } from "../src/content/site-target";
import { siteContent } from "../src/generated/content.generated";
import { contentManifest } from "../src/generated/routes.generated";
import { recipeLibraryPagePath } from "../src/features/recipes/recipe-pagination";

const dist = path.resolve(import.meta.dirname, "../dist");
test("HTTP 200 discovery bodies must contain the expected sitemap and crawling policy", () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteBase}/</loc></url></urlset>`;
  const allowCrawling = "User-agent: *\nAllow: /\n";
  const advertiseSitemap = `Sitemap: ${siteBase}/sitemap.xml\n`;
  const robots = siteTarget.production ? allowCrawling + advertiseSitemap : allowCrawling;
  assert.deepEqual(inspectDiscovery(sitemap, robots, ["/"]), []);
  for (const wrong of ["<html>not XML</html>", "<urlset></urlset>", sitemap.replace("</urlset>", ""), sitemap.replace("</url>", "</broken>"), sitemap.replace("</urlset>", `<url><loc>${siteBase}/</loc></url></urlset>`)]) assert.ok(inspectDiscovery(wrong, robots, ["/"]).some((f) => f.code === "SITEMAP"));
  const wrongSitemapPolicy = siteTarget.production ? allowCrawling : allowCrawling + advertiseSitemap;
  for (const wrong of ["", wrongSitemapPolicy, robots + "Sitemap: https://example.com/sitemap.xml\n",
    "User-agent: *\nDisallow: /\n", "User-agent: *\nDisallow: /*\n"]) {
    assert.ok(inspectDiscovery(sitemap, wrong, ["/"]).some((f) => f.code === "ROBOTS"));
  }
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
test("the Search Console examples have named steps with working canonical fragments", async () => {
  const pages = expectedPages(siteContent.recipes);
  for (const slug of ["avokado-banaanijaatelo", "bataattiletut"]) {
    const page = pages.find(item => item.route === `/${slug}/`)!;
    const html = await readFile(path.join(dist, slug, "index.html"), "utf8");
    const structured = JSON.parse(html.match(/<script id="recipe-jsonld"[^>]*>([\s\S]*?)<\/script>/)![1]);
    const steps = structured.recipeInstructions.filter((step: { url: string }) => step.url?.includes("#recipe-step-"));
    assert.equal(steps.length, 4, slug);
    steps.forEach((step: { name: string; url: string }, index: number) => {
      assert.ok(step.name?.trim(), `${slug} step ${index + 1} must have a descriptive name`);
      assert.equal(step.url, `${siteBase}/${slug}/#recipe-step-${index + 1}`);
    });
    assert.deepEqual(inspectPage(html, page), []);
    assert.ok(inspectPage(html.replace('id="recipe-step-1"', 'id="wrong-step"'), page)
      .some(item => item.code === "JSONLD_STEP_TARGET"));
  }
});

test("natto cookingMethod is independently checked against public notes in FI/EN/SV/TH", async () => {
  const pages = expectedPages(siteContent.recipes);
  const methods = { fi: "Keittäminen", en: "Boiling", sv: "Kokning", th: "การต้ม" } as const;
  for (const [locale, label] of Object.entries(methods)) {
    const page = pages.find(item => item.recipe?.recipeId === "japanilainen-natto-riisikulho" && item.locale === locale);
    assert.ok(page?.recipe, locale + ": published review page");
    const html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8");
    assert.deepEqual(inspectPage(html, page), [], locale + ": approved method must survive SEO audit");
    const correct = '"cookingMethod":"' + label + '"';
    assert.ok(html.includes(correct), locale + ": localized JSON-LD method present");
    assert.ok(inspectPage(html.replace(correct, '"cookingMethod":"Frying"'), page)
      .some(item => item.code === "JSONLD_SOURCE"), locale + ": unsupported metadata is rejected");
    const unreviewed = { ...page, recipe: { ...page.recipe, notesHtml: "" } };
    assert.ok(inspectPage(html, unreviewed).some(item => item.code === "COOKING_METHOD_SOURCE"),
      locale + ": method cannot be claimed without visible supporting review notes");
  }
});

test("goulash stove metadata requires exact public notes and cannot be forged in JSON-LD", async () => {
  const pages = expectedPages(siteContent.recipes);
  const methods = { fi: "Liedellä hauduttaminen", en: "Stovetop simmering",
    sv: "Sjudning på spis", th: "เคี่ยวบนเตา" } as const;
  for (const [locale, label] of Object.entries(methods)) {
    const page = pages.find(item => item.recipe?.recipeId === "paprikainen-vhh-gulassi" && item.locale === locale);
    assert.ok(page?.recipe, locale + ": published goulash page must exist");
    const html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8");
    assert.deepEqual(inspectPage(html, page), [], locale + ": source-reviewed stove method must pass");
    const method = '"cookingMethod":"' + label + '"';
    assert.ok(html.includes(method), locale + ": JSON-LD must include the localized stove method");
    assert.ok(inspectPage(html.replace(method, '"cookingMethod":"Oven"'), page)
      .some(item => item.code === "JSONLD_SOURCE"), locale + ": forged oven metadata rejected");
    const missingNotes = { ...page, recipe: { ...page.recipe, notesHtml: "" } };
    assert.ok(inspectPage(html, missingNotes)
      .some(item => item.code === "COOKING_METHOD_SOURCE"), locale + ": no unsupported source review");
    const wrongMethod = { ...page, recipe: { ...page.recipe, cookingMethod: ["uuni"] } };
    assert.ok(inspectPage(html, wrongMethod)
      .some(item => item.code === "COOKING_METHOD_SOURCE"), locale + ": oven claim rejected");
  }
});

test("all indexable content templates use distinct descriptions and Recipavo titles", () => {
  const pages = expectedPages(siteContent.recipes);
  const descriptions = new Map<string, string>();
  const titles = new Map<string, string>();
  for (const { route, title, description } of pages) {
    assert.match(title, / \| Recipavo$/, route);
    assert.equal(titles.get(title), undefined, `Duplicate title on ${route} and ${titles.get(title)}`);
    titles.set(title, route);
    assert.ok(description.trim(), route);
    assert.equal(descriptions.get(description), undefined, `Duplicate description on ${route} and ${descriptions.get(description)}`);
    descriptions.set(description, route);
  }
  for (const [slug, localized] of Object.entries(recipeSeoDescriptions)) {
    for (const [locale, description] of Object.entries(localized)) {
      const page = pages.find(item => item.recipe?.slug === slug && item.locale === locale);
      assert.equal(page?.description, description, `${locale}:${slug}`);
    }
  }
});
test("inventory is dynamic and duplicate URLs are rejected", async () => {
  const recipe = siteContent.recipes[0];
  const withOneRecipe = expectedPages([recipe]);
  assert.equal(withOneRecipe.length, expectedPages([]).length + 3, "adds the localized index, library and recipe");
  assert.ok(withOneRecipe.some(page => page.route === recipeLibraryPagePath(recipe.locale)));
  const report = await auditSeo(dist, [...siteContent.recipes, recipe], Object.keys(contentManifest));
  assert.ok(report.findings.some((f) => f.code === "DUPLICATE_ROUTE"));
});
test("metadata mutations cannot silently pass", async () => {
  const page = expectedPages(siteContent.recipes).find((p) => p.recipe?.recipeId === "som-tam-vhh-kurkkuna" && p.recipe.locale === "fi")!;
  const html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8");
  const cases: [string, string][] = [
    [html.replace(/rel="canonical"/g, 'rel="missing"'), "CANONICAL"],
    [html.replace(/hreflang="x-default"/g, 'hreflang="fi"'), "HREFLANG"],
    [html.replace(/hreflang="th"/g, 'hreflang="xx"'), "HREFLANG"],
    [html.replace(/<title>/, '<title>Wrong '), "TITLE"],
    [html.replace(/name="description"/, 'name="missing"'), "DESCRIPTION"],
    [html.replace(/<h1/, '<h1>Extra</h1><h1'), "H1"],
    [html.replace(/<html lang="[^"]+"/, '<html lang="xx"'), "LANG"],
    [siteTarget.production
      ? html.replace("</head>", '<meta name="googlebot" content="noindex" /></head>')
      : html.replace(/<meta name="robots"[^>]*>/, ""), "NOINDEX"],
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

test("JSON-LD and hydration require active scripts outside inert content", async () => {
  const page = expectedPages(siteContent.recipes).find((p) => p.recipe)!;
  const html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8");
  assert.deepEqual(inspectPage(html, page), []);
  const wrappers = [
    (script: string) => `<!--${script}-->`,
    ...["style", "textarea", "title", "xmp", "iframe", "noembed", "noframes", "noscript", "template"].map((name) =>
      (script: string) => `<${name}>${script}</${name}>`),
    (script: string) => `<TeXtArEa class="example">${script}</TeXtArEa>`,
  ];
  for (const [pattern, code] of [
    [/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i, "JSONLD_COUNT"],
    [/<script\b[^>]*id="page-content"[^>]*>[\s\S]*?<\/script>/i, "PAGE_CONTENT"],
  ] as const) {
    const script = html.match(pattern)?.[0];
    assert.ok(script, `Fixture must contain ${code} script`);
    for (const wrap of wrappers) {
      assert.ok(inspectPage(html.replace(pattern, () => wrap(script)), page).some((f) => f.code === code), `${code}: ${wrap("...")}`);
      // Inert copies must not count as duplicates of the real script either.
      const duplicateFindings = inspectPage(html.replace("</body>", `${wrap(script)}</body>`), page);
      assert.deepEqual(duplicateFindings.filter((f) => f.code.startsWith("JSONLD_") || f.code === "PAGE_CONTENT"), []);
    }
  }
});

test("ingredient markup and JSON-LD must both use the base kitchen quantity", async () => {
  const page = expectedPages(siteContent.recipes).find(item => item.route === "/avokado-perunasampylat/")!;
  const html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8");
  assert.deepEqual(inspectPage(html, page), []);
  const visible = html.replace("<li>2 kananmunaa</li>", "<li>100 g kananmunaa</li>");
  assert.ok(inspectPage(visible, page).some(finding => finding.code === "INGREDIENT_SOURCE"));
  const structured = html.replace('"2 kananmunaa"', '"100 g kananmunaa"');
  assert.ok(inspectPage(structured, page).some(finding => finding.code === "JSONLD_SOURCE"));
});

test("wrapped instructions keep their complete text and anchor in recipe JSON-LD", async () => {
  const examples = [
    { slug: "avokado-perunasampylat-pellilla", step: 4, continuation: /Tarkista kypsyys 25 minuutin kohdalla.*sisälämmön vähintään 71 °C/ },
    { slug: "kebab-munakasrulla", step: 2, continuation: /keskitasolla noin 15 minuuttia.*Älä paista levyä kuivaksi/ },
  ];
  for (const { slug, step, continuation } of examples) {
    const html = await readFile(path.join(dist, slug, "index.html"), "utf8");
    const json = html.match(/<script id="recipe-jsonld"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(json, slug);
    const structured = JSON.parse(json);
    const steps = structured.recipeInstructions as { text: string; url?: string }[];
    const anchor = `recipe-step-${step}`;
    const instruction = steps.find(item => item.url === `${siteBase}/${slug}/#${anchor}`);
    assert.ok(instruction, slug);
    assert.match(instruction.text, continuation);
    assert.ok(html.includes(`id="${anchor}"`), slug);
  }
});
