import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { localeIndexes } from "../src/content/route-data";
import type { RecipeEntry, RecipeLocale } from "../src/types/content";

export const siteBase = "https://ozirix-dev.github.io/Reseptit";
export interface SeoFinding { route: string; code: string; detail: string }
export interface ExpectedPage { route: string; locale: RecipeLocale; title: string; description: string; h1: string; alternates: Record<string, string>; recipe?: RecipeEntry }
const names = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };
const descriptions = { fi: "Selkeitä reseptejä arkeen.", en: "Straightforward recipes for everyday cooking.", sv: "Enkla recept för vardagen.", th: "สูตรอาหารเรียบง่ายสำหรับทุกวัน" };
export const decodeHtml = (value: string) => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[0-9a-f]+);/gi, (entity) => {
  const named: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  return named[entity] ?? String.fromCodePoint(parseInt(entity.slice(entity[2] === "x" ? 3 : 2, -1), entity[2] === "x" ? 16 : 10));
});
const attrs = (tag: string) => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1].toLowerCase(), decodeHtml(m[2] ?? m[3])]));
const activeDocument = (html: string) => html.replace(/<!--[\s\S]*?(?:-->|$)/g, "").replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "");
const activeMarkup = (html: string) => activeDocument(html).replace(/<(script|style|textarea|xmp|iframe|noembed|noframes)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
// Consume complete raw-text elements before selecting scripts: a script-looking
// string inside one of these elements is text, not structured/hydration data.
const activeScripts = (html: string) => [...activeDocument(html).matchAll(/<(script|style|textarea|title|xmp|iframe|noembed|noframes|noscript)\b([^>]*)>([\s\S]*?)(?:<\/\1\s*>|$)/gi)]
  .filter((match) => match[1].toLowerCase() === "script")
  .map((match) => ({ attributes: attrs(match[2]), content: match[3] }));
const tags = (html: string, name: string) => [...activeMarkup(html).matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => attrs(m[0]));
const texts = (html: string, name: string) => [...activeMarkup(html).matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "gi"))].map((m) => decodeHtml(m[1].replace(/<[^>]+>/g, "")).trim());

export function expectedPages(recipes: RecipeEntry[]): ExpectedPage[] {
  const locales = (Object.keys(localeIndexes) as RecipeLocale[]).filter((locale) => recipes.some((r) => r.locale === locale));
  const alternateMap = (entries: { locale: RecipeLocale; routePath: string }[]) => {
    const result = Object.fromEntries(entries.map((r) => [r.locale, siteBase + r.routePath]));
    result["x-default"] = result.fi ?? result[entries[0].locale];
    return result;
  };
  const indexes = locales.map((locale) => ({ locale, routePath: localeIndexes[locale] }));
  return [
    ...locales.map((locale) => ({ route: localeIndexes[locale], locale, h1: names[locale], title: `${names[locale]} | Ozirix`, description: descriptions[locale], alternates: alternateMap(indexes) })),
    ...recipes.map((recipe) => ({ route: recipe.routePath, locale: recipe.locale, h1: recipe.title, title: `${recipe.title} | ${names[recipe.locale]}`, description: recipe.description || descriptions[recipe.locale], alternates: alternateMap(recipes.filter((r) => r.recipeId === recipe.recipeId)), recipe })),
  ];
}

export function inspectPage(html: string, expected: ExpectedPage): SeoFinding[] {
  html = activeDocument(html);
  const issues: SeoFinding[] = [];
  const check = (condition: boolean, code: string, detail: string) => { if (!condition) issues.push({ route: expected.route, code, detail }); };
  const links = tags(html, "link"), metas = tags(html, "meta");
  check(/^<!doctype html>/i.test(html.trim()) && /<div id="root">[\s\S]+<\/div>/.test(html) && /<\/html>\s*$/i.test(html), "HTML_SHELL", "Missing static document/root content");
  check(tags(html, "html").length === 1 && tags(html, "html")[0]?.lang === expected.locale, "LANG", "HTML language differs from inventory");
  check(isDeepStrictEqual(texts(html, "h1"), [expected.h1]), "H1", "Expected exactly one source-matching H1");
  check(isDeepStrictEqual(texts(html, "title"), [expected.title]), "TITLE", "Expected one source-matching title");
  check(isDeepStrictEqual(metas.filter((m) => m.name === "description").map((m) => m.content), [expected.description]), "DESCRIPTION", "Expected one source-matching description");
  check(isDeepStrictEqual(links.filter((l) => l.rel === "canonical").map((l) => l.href), [siteBase + expected.route]), "CANONICAL", "Canonical is missing, duplicated or incorrect");
  const alternateLinks = links.filter((l) => l.rel === "alternate" && l.hreflang);
  check(alternateLinks.length === Object.keys(expected.alternates).length && isDeepStrictEqual(Object.fromEntries(alternateLinks.map((l) => [l.hreflang, l.href])), expected.alternates), "HREFLANG", "Published alternates/x-default must match both ways; no extra, duplicate or missing locale");
  check(!metas.some((m) => ["robots", "googlebot"].includes(m.name) && /(?:noindex|none)/i.test(m.content)), "NOINDEX", "Published page blocks indexing");
  const scripts = activeScripts(html);
  const jsonScripts = scripts.filter((script) => script.attributes.type === "application/ld+json");
  if (!expected.recipe) {
    check(jsonScripts.length === 0, "INDEX_JSONLD", "Index unexpectedly declares recipe data");
    return issues;
  }
  const recipe = expected.recipe;
  check(jsonScripts.length === 1, "JSONLD_COUNT", "Expected one Recipe JSON-LD block");
  if (jsonScripts.length !== 1) return issues;
  try {
    const data = JSON.parse(jsonScripts[0].content);
    const nutrition = Object.fromEntries(Object.entries({ carbohydrateContent: recipe.nutrition.carbsTotalG, proteinContent: recipe.nutrition.proteinG, fatContent: recipe.nutrition.fatG }).filter(([, n]) => n !== null).map(([k, n]) => [k, `${n} g`]));
    const expectedData = JSON.parse(JSON.stringify({
      "@context": "https://schema.org", "@type": "Recipe", name: recipe.title, description: recipe.description || undefined,
      inLanguage: recipe.locale, recipeCategory: recipe.category, keywords: recipe.tags.length ? recipe.tags.join(", ") : undefined,
      ...(recipe.image ? { image: [recipe.image.src] } : {}), recipeYield: String(recipe.servings),
      recipeIngredient: recipe.ingredients.map((i) => [i.amount, i.unit, i.item, i.note].filter((v) => v !== null && v !== undefined && v !== "").join(" ")),
      recipeInstructions: recipe.instructionsText.map((text) => ({ "@type": "HowToStep", text })),
      totalTime: recipe.timeTotalMin ? `PT${recipe.timeTotalMin}M` : undefined,
      ...(Object.keys(nutrition).length ? { nutrition: { "@type": "NutritionInformation", ...nutrition } } : {}),
    }));
    check(isDeepStrictEqual(data, expectedData), "JSONLD_SOURCE", "Structured data differs from actual content (including nutrition, steps and unsupported extra claims)");
    check(!!recipe.image && !!data.name && Array.isArray(data.image) && data.image.length > 0, "GOOGLE_REQUIRED", "Google Recipe requires name and image");
  } catch { check(false, "JSONLD_PARSE", "Invalid JSON-LD JSON"); }
  if (recipe.image) {
    const images = tags(html, "img");
    check(images.some((img) => img.src === recipe.image!.src && img.alt === recipe.image!.alt), "RECIPE_IMAGE", "Visible recipe image/alt differs from source");
    check(metas.some((m) => m.property === "og:image" && m.content === recipe.image!.src), "OG_IMAGE", "Open Graph image differs from source");
  }
  const payload = scripts.find((script) => script.attributes.id === "page-content");
  try { check(!!payload && isDeepStrictEqual(JSON.parse(payload!.content).recipe, recipe), "PAGE_CONTENT", "Hydration content differs from audited source"); }
  catch { check(false, "PAGE_CONTENT", "Invalid hydration JSON"); }
  return issues;
}

async function indexFiles(root: string, relative = ""): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await indexFiles(root, name));
    else if (entry.isFile() && entry.name === "index.html") result.push(`/${name.replaceAll("\\", "/").replace(/index\.html$/, "")}`);
  }
  return result;
}

export function blockedByRobots(robots: string, pathname: string, agent: string): boolean {
  const groups: { agents: string[]; rules: { allow: boolean; pattern: string }[] }[] = [];
  let group: typeof groups[number] | undefined;
  for (const line of robots.split(/\r?\n/)) {
    const match = /^\s*([\w-]+)\s*:\s*(.*?)\s*$/.exec(line.split("#")[0]);
    if (!match) continue;
    const key = match[1].toLowerCase(), value = match[2];
    if (key === "user-agent") {
      if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ["allow", "disallow"].includes(key)) group.rules.push({ allow: key === "allow", pattern: value });
  }
  const specific = groups.filter((g) => g.agents.includes(agent));
  const selected = specific.length ? specific : groups.filter((g) => g.agents.includes("*"));
  const matches = selected.flatMap((g) => g.rules).filter((r) => r.pattern).filter((rule) => {
    const end = rule.pattern.endsWith("$");
    const pattern = (end ? rule.pattern.slice(0, -1) : rule.pattern).split("*").map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    return new RegExp(`^${pattern}${end ? "$" : ""}`).test(pathname);
  }).sort((a, b) => b.pattern.replaceAll("*", "").length - a.pattern.replaceAll("*", "").length || Number(b.allow) - Number(a.allow));
  return !!matches.length && !matches[0].allow;
}

export function inspectDiscovery(sitemap: string, robots: string, routes: string[]): SeoFinding[] {
  const issues: SeoFinding[] = [];
  const urls = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => decodeHtml(m[1]));
  // Validate the complete, deliberately small XML grammar emitted by our generator.
  // Unknown XML extensions fail closed instead of pretending to be supported.
  const document = /^\s*<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">([\s\S]*)<\/urlset>\s*$/.exec(sitemap);
  const body = document?.[1].replace(/<url>\s*<loc>(?:[^<&]|&amp;|&lt;|&gt;|&quot;|&apos;)*<\/loc>\s*<\/url>/g, "").trim();
  if (!document || body !== "" || !isDeepStrictEqual([...urls].sort(), routes.map((r) => siteBase + r).sort())) issues.push({ route: "/sitemap.xml", code: "SITEMAP", detail: "Malformed/unsupported sitemap XML or missing, extra or duplicate URLs" });
  const blocked = routes.some((r) => ["*", "googlebot", "googlebot-image"].some((agent) => blockedByRobots(robots, "/Reseptit" + r, agent)));
  const sitemapDirective = robots.split(/\r?\n/).map((line) => line.split("#")[0].trim()).some((line) => /^sitemap\s*:/i.test(line) && line.slice(line.indexOf(":") + 1).trim() === `${siteBase}/sitemap.xml`);
  if (!sitemapDirective || blocked) issues.push({ route: "/robots.txt", code: "ROBOTS", detail: "Project robots blocks published paths or lacks sitemap reference" });
  return issues;
}

export function inspectNotFound(html: string): SeoFinding[] {
  const document = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const noindex = tags(document, "meta").some((m) => m.name?.toLowerCase() === "robots" && m.content?.toLowerCase().split(/[,\s]+/).includes("noindex"));
  return !noindex || tags(document, "link").some((l) => l.rel === "canonical" || l.hreflang) || /application\/ld\+json/.test(html) || texts(document, "h1").length !== 1
    ? [{ route: "/404.html", code: "404_POLICY", detail: "404 must have real robots noindex, one H1, no canonical/hreflang/JSON-LD" }] : [];
}

export async function auditSeo(dist: string, recipes: RecipeEntry[], manifestRoutes: string[]) {
  const pages = expectedPages(recipes), findings: SeoFinding[] = [], images = new Set<string>();
  const add = (code: string, detail: string, route = "/") => findings.push({ route, code, detail });
  const routes = pages.map((p) => p.route);
  if (new Set(routes).size !== routes.length) add("DUPLICATE_ROUTE", "Duplicate source URL");
  if (!isDeepStrictEqual([...manifestRoutes].sort(), [...routes].sort())) add("MANIFEST", "Route manifest differs from published inventory");
  if (!isDeepStrictEqual((await indexFiles(dist)).sort(), [...routes].sort())) add("HTML_ROUTES", "Missing or extra prerendered route");
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => decodeHtml(m[1]));
  const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
  findings.push(...inspectDiscovery(sitemap, robots, routes));
  for (const page of pages) {
    let html: string;
    try { html = await readFile(path.join(dist, page.route.slice(1), "index.html"), "utf8"); }
    catch { add("MISSING_HTML", "No static page", page.route); continue; }
    findings.push(...inspectPage(html, page));
    for (const img of tags(html, "img")) {
      if (!img.alt?.trim()) add("ALT", "Image lacks alternative text", page.route);
      images.add(img.src);
      for (const candidate of (img.srcset ?? "").split(",").filter(Boolean)) images.add(candidate.trim().split(/\s+/)[0]);
    }
  }
  for (const url of images) {
    try {
      const parsed = new URL(url);
      if (parsed.origin !== "https://ozirix-dev.github.io" || !parsed.pathname.startsWith("/Reseptit/kuvat/") || parsed.search || parsed.hash) throw Error("Image outside Pages image root");
      const target = path.resolve(dist, decodeURIComponent(parsed.pathname.slice("/Reseptit/".length)));
      if (!target.startsWith(path.resolve(dist) + path.sep)) throw Error("Path escape");
      const file = await readFile(target);
      if (file.toString("ascii", 0, 4) !== "RIFF" || file.toString("ascii", 8, 12) !== "WEBP") throw Error("Missing/invalid WebP");
    } catch (error) { add("IMAGE_FILE", `${url}: ${String(error)}`); }
  }
  const missing = await readFile(path.join(dist, "404.html"), "utf8");
  findings.push(...inspectNotFound(missing));
  const verification = await readFile(path.join(dist, "google0c6f9c0486376f0f.html"), "utf8");
  if (verification !== "google-site-verification: google0c6f9c0486376f0f.html") add("VERIFICATION_FILE", "Verification content changed");
  return { mode: "offline-dist", routes: pages.length, recipes: recipes.length, imageFiles: images.size, sitemapUrls: urls.length, findings,
    limitations: ["Checks this generator's HTML structure, not a general HTML conformance validator or Google's Rich Results Test.", "No assertion about Google ownership, indexing or rich-result appearance.", "Project robots.txt is not the origin-root robots.txt used by crawlers."],
    recommendedMissing: { author: recipes.length, datePublished: recipes.length, aggregateRating: recipes.length, calories: recipes.length },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { siteContent } = await import("../src/generated/content.generated");
  const { contentManifest } = await import("../src/generated/routes.generated");
  const dist = path.resolve(import.meta.dirname, "../dist");
  await stat(dist);
  const report = await auditSeo(dist, siteContent.recipes, Object.keys(contentManifest));
  console.log(JSON.stringify(report, null, 2));
  if (report.findings.length) process.exitCode = 1;
}
