import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { localeIndexes } from "../src/content/route-data";
import { resolveSiteTarget } from "../src/content/site-target";
import { recipeLibraryPagePath, recipeLibraryPageSize } from "../src/features/recipes/recipe-pagination";
import { activeScripts, blockedByRobots, inspectNotFound, tags } from "./seo-audit";

const revisionHeader = "x-recipavo-commit";
const production = resolveSiteTarget(undefined, "production").baseUrl;
const notFound = "/__recipavo_release_probe_missing__/";
const samples = [...Object.entries(localeIndexes), ["fi", recipeLibraryPagePath("fi", 2)]] as const;
// https://mimesniff.spec.whatwg.org/#javascript-mime-type
const javascriptMime = /^(?:application\/(?:x-)?(?:ecmascript|javascript)|text\/(?:(?:x-)?(?:ecmascript|javascript)|javascript1\.[0-5]|jscript|livescript))$/;
const noIndex = (value: string) => /\b(?:noindex|none)\b/i.test(value);
const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const alternates = (html: string) => tags(html, "link")
  .filter(tag => tag.rel === "alternate" && tag.hreflang)
  .map(({ hreflang, href }) => [hreflang, href]).sort();

function moduleEntry(html: string, origin: string, route: string, source: "live" | "artifact") {
  const pageUrl = origin + route;
  const declaredBase = tags(html, "base").find(tag => tag.href !== undefined)?.href;
  const baseUrl = URL.parse(declaredBase ?? pageUrl, pageUrl) ?? pageUrl;
  const entries: URL[] = [];
  const label = `${route} ${source} module entry`;
  for (const { attributes: { type, src } } of activeScripts(html)) {
    if (type?.toLowerCase() !== "module" || !src?.trim()) continue;
    const url = URL.parse(src, baseUrl);
    assert.ok(url, `${label}: invalid URL ${src}`);
    if (url.origin === origin) entries.push(url);
  }
  assert.equal(entries.length, 1, `${label}: expected one first-party external module script`);
  const [entry] = entries;
  assert.match(entry.pathname, /^\/assets\/[\w.-]+\.js$/, `${label}: expected a generated JavaScript asset`);
  assert.equal(entry.href, origin + entry.pathname, `${label}: expected a plain asset URL`);
  return entry.pathname;
}

export async function verifyProductionRelease(expectedSha: string, origin: string, dist: string, request = fetch) {
  assert.match(expectedSha, /^[a-f0-9]{40}$/, "Expected a full commit SHA");
  assert.equal(origin, production, "Expected the Recipavo production origin");
  const artifact = (file: string) => readFile(path.join(dist, file.replace(/^\//, "")));
  const headers = (await artifact("_headers")).toString("utf8");
  assert.deepEqual([...headers.matchAll(/^\s*X-Recipavo-Commit:[ \t]*(\S+)\s*$/gmi)].map(match => match[1]),
    [expectedSha], "Artifact revision stamp differs from expected SHA");
  const summaries: { route: string; revision: string | null; cachedMetadata?: true }[] = [];
  const get = (route: string) => request(origin + route, {
    redirect: "manual", signal: AbortSignal.timeout(15_000),
  });
  const checkHtml = async (route: string, status: number) => {
    const response = await get(route);
    assert.equal(response.status, status, route);
    assert.equal(response.headers.get(revisionHeader), expectedSha, route + " revision");
    assert.match(response.headers.get("content-type") ?? "", /text\/html/i, route);
    if (status === 200) assert.ok(!noIndex(response.headers.get("x-robots-tag") ?? ""), route + " header indexing policy");
    summaries.push({ route, revision: expectedSha });
    return response.text();
  };
  const checkFile = async (route: string, expected: Buffer, requireJavaScript = false) => {
    const checkMime = (response: Response, label: string) => {
      if (!requireJavaScript) return;
      const header = response.headers.get("content-type") ?? "";
      assert.match(header.split(";", 1)[0].trim().toLowerCase(), javascriptMime,
        `${label} Content-Type: expected JavaScript, received ${header || "(missing)"}`);
    };
    const expectedDigest = digest(expected);
    const response = await get(route);
    assert.equal(response.status, 200, route);
    checkMime(response, route);
    const revision = response.headers.get(revisionHeader);
    assert.equal(digest(new Uint8Array(await response.arrayBuffer())), expectedDigest, route + " content");
    if (revision === expectedSha) {
      summaries.push({ route, revision });
      return;
    }
    const fresh = await get(route + "?recipavo_revision=" + expectedSha);
    assert.equal(fresh.status, 200, route + " revision probe");
    checkMime(fresh, route + " revision probe");
    assert.equal(fresh.headers.get(revisionHeader), expectedSha, route + " revision probe");
    assert.equal(digest(new Uint8Array(await fresh.arrayBuffer())), expectedDigest, route + " revision probe content");
    summaries.push({ route, revision, cachedMetadata: true });
  };

  const entries = new Set<string>();
  for (const [lang, route] of samples) {
    const html = await checkHtml(route, 200);
    const localHtml = (await artifact(route + "index.html")).toString("utf8");
    assert.ok(tags(html, "h1").length === 1 && html.includes('<div id="root">'), route + " prerendered page");
    if (route === recipeLibraryPagePath("fi", 2)) {
      const cards = tags(html, "article").filter(tag => tag.class === "recipe-card").length;
      assert.ok(cards > 0 && cards <= recipeLibraryPageSize, route + " prerendered library cards");
    }
    assert.deepEqual(tags(html, "html").map(tag => tag.lang), [lang], route + " language");
    assert.deepEqual(tags(html, "link").filter(tag => tag.rel === "canonical").map(tag => tag.href),
      [origin + route], route + " canonical");
    const expectedAlternates = alternates(localHtml);
    assert.ok(expectedAlternates.length > 0 && expectedAlternates.every(([, href]) =>
      href.startsWith(origin + "/")), route + " artifact alternates");
    assert.deepEqual(alternates(html), expectedAlternates, route + " hreflang");
    assert.ok(!tags(html, "meta").some(tag => /^(robots|googlebot)$/i.test(tag.name ?? "") &&
      noIndex(tag.content ?? "")), route + " must be indexable");
    const expectedEntry = moduleEntry(localHtml, origin, route, "artifact");
    const liveEntry = moduleEntry(html, origin, route, "live");
    assert.equal(liveEntry, expectedEntry, route + " live module entry differs from artifact");
    entries.add(liveEntry);
  }
  assert.deepEqual(inspectNotFound(await checkHtml(notFound, 404)), []);

  const robots = await artifact("/robots.txt");
  const sitemap = await artifact("/sitemap.xml");
  assert.match(robots.toString(), /^Sitemap:\s+https:\/\/www\.recipavo\.com\/sitemap\.xml\s*$/m);
  for (const [, route] of samples) {
    for (const crawler of ["*", "googlebot"]) assert.ok(!blockedByRobots(robots.toString(), route, crawler), route);
    assert.ok(sitemap.toString().includes(`<loc>${origin}${route}</loc>`), route + " sitemap");
  }
  await checkFile("/robots.txt", robots);
  await checkFile("/sitemap.xml", sitemap);
  for (const entry of entries) await checkFile(entry, await artifact(entry), true);
  return { expectedSha, origin, summaries };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const [, , sha, origin, dist, ...extra] = process.argv;
  if (!sha || !origin || !dist || extra.length) {
    throw new Error("Usage: npm run verify:production -- <commit-sha> https://www.recipavo.com <stamped-dist-directory>");
  }
  console.log(JSON.stringify(await verifyProductionRelease(sha, origin, dist), null, 2));
}
