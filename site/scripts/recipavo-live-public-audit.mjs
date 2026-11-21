/**
 * #334 read-only, public HTTPS release observation.
 * Evidence only: cannot authorize link placement, Cloudflare publishing or GK.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PUBLIC_ROUTES = [
  {key: "home-fi", path: "/", expected: 200, html: true},
  {key: "gi-guide-fi", path: "/ruokaopas/glykeeminen-indeksi-ja-kuorma/", expected: 200, html: true},
  {key: "keto-guide-fi", path: "/ruokaopas/keto-vhh-ero/", expected: 200, html: true},
  {key: "recipes-en", path: "/en/recipes/", expected: 200, html: true},
  {key: "recipes-sv", path: "/sv/recept/", expected: 200, html: true},
  {key: "recipes-th", path: "/th/recipes/", expected: 200, html: true},
  {key: "sitemap", path: "/sitemap.xml", expected: 200, html: false},
  {key: "robots", path: "/robots.txt", expected: 200, html: false},
  {key: "deliberate-404", path: "/chat5-nonexistent-audit-route-20261122/", expected: 404, html: false},
];

function attribute(tag, name) {
  const re = new RegExp("(?:^|\\s)" + name + "\\s*=\\s*([\"'])(.*?)\\1", "i");
  return re.exec(tag)?.[2] ?? null;
}

export function inspectHeadLinks(html) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
  let canonical = null;
  const languages = {};
  for (const tag of tags) {
    const rel = (attribute(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    const href = attribute(tag, "href");
    if (!href) continue;
    if (rel.includes("canonical")) canonical = href;
    if (rel.includes("alternate")) {
      const language = attribute(tag, "hreflang");
      if (language) languages[language.toLowerCase()] = href;
    }
  }
  return {canonical, hreflang: languages};
}

function safeUrl(url) {
  try { return new URL(url).href; } catch { return null; }
}

export async function checkPublicRoutes({
  origin = "https://www.recipavo.com",
  fetcher = fetch,
  expectedSha = null,
} = {}) {
  const base = new URL(origin);
  if (base.protocol !== "https:" || base.username || base.password)
    throw Error("Only public HTTPS origins may be audited");
  if (expectedSha !== null && !/^[a-f0-9]{40}$/.test(expectedSha))
    throw Error("Expected release commit must be a 40-character SHA");
  const observations = await Promise.all(PUBLIC_ROUTES.map(async route => {
    const requested = new URL(route.path, base).href;
    try {
      const response = await fetcher(requested, {
        method: "GET", redirect: "follow", cache: "no-store",
        headers: {"user-agent": "Recipavo-Chat5-Public-Audit/1.0"},
        signal: AbortSignal.timeout(12000),
      });
      const status = response.status;
      const contentType = response.headers.get("content-type");
      const sourceSha = response.headers.get("x-recipavo-commit");
      const body = status === 200 ? (await response.text()).slice(0, 500000) : "";
      const head = route.html && status === 200 ? inspectHeadLinks(body) : {canonical: null, hreflang: {}};
      const finalUrl = response.url || requested;
      const canonical = head.canonical ? safeUrl(new URL(head.canonical, finalUrl).href) : null;
      const canonicalMatch = route.html && status === 200 && canonical !== null
        ? canonical === new URL(route.path, base).href : null;
      return {
        key: route.key, requested, finalUrl, redirected: response.redirected,
        expectedStatus: route.expected, httpStatus: status, httpMatch: status === route.expected,
        contentType, sourceSha, canonical, canonicalMatch,
        hreflang: head.hreflang,
        sitemapLocCount: route.key === "sitemap" && status === 200
          ? [...body.matchAll(/<loc\b[^>]*>/gi)].length : null,
        error: null,
      };
    } catch (error) {
      return {
        key: route.key, requested, finalUrl: null, redirected: null,
        expectedStatus: route.expected, httpStatus: null, httpMatch: false,
        contentType: null, sourceSha: null, canonical: null, canonicalMatch: null,
        hreflang: {}, sitemapLocCount: null, error: String(error),
      };
    }
  }));
  const httpVerified = observations.every(r => r.httpMatch);
  const badCanonicals = observations.filter(r => r.canonicalMatch === false);
  const sourceHeaders = observations.filter(r => r.httpMatch && r.sourceSha !== null);
  const shaVerified = expectedSha !== null && sourceHeaders.length === observations.length
    && sourceHeaders.every(r => r.sourceSha === expectedSha);
  const result = {
    schemaVersion: 1,
    observedAt: new Date().toISOString(),
    origin: base.origin,
    expectedSha,
    statuses: {
      http: httpVerified ? "PASS" : "HOLD",
      canonical: badCanonicals.length ? "HOLD" : "NOT FULLY VERIFIED",
      hreflang: "OBSERVED ONLY",
      releaseSha: shaVerified ? "PASS" : "NOT VERIFIED",
      overall: httpVerified && !badCanonicals.length && shaVerified ? "PASS" : "HOLD",
    },
    summary: {
      checked: observations.length,
      matchingHttpStatuses: observations.filter(r => r.httpMatch).length,
      unobservedHttpStatuses: observations.filter(r => r.httpStatus === null).length,
      htmlCanonicalObserved: observations.filter(r => r.canonical !== null).length,
      mismatchedCanonicals: badCanonicals.length,
      releaseShaObserved: sourceHeaders.length,
    },
    routes: observations,
    releaseAuthorized: false,
    linkPublicationAuthorized: false,
    autoDeploy: false,
    autoMerge: false,
  };
  return result;
}

export function publicAuditMarkdown(result) {
  const lines = [
    "# Recipavo public HTTPS audit (#334)", "",
    "Read-only observation; no link placement, production release or GK authorization.",
    "", "Observed: " + result.observedAt,
    "HTTP: " + result.statuses.http + "; SHA: " + result.statuses.releaseSha,
    "; overall: " + result.statuses.overall, "",
    "| Route | HTTP | Expected | Canonical | Release header |",
    "| --- | ---: | ---: | --- | --- |",
  ];
  for (const row of result.routes) {
    lines.push("| " + row.key + " | " + (row.httpStatus ?? "unavailable")
      + " | " + row.expectedStatus + " | " + (row.canonicalMatch ?? "not verified")
      + " | " + (row.sourceSha ?? "missing") + " |");
    if (row.error) lines.push("", "- " + row.key + " could not be observed: " + row.error, "");
  }
  lines.push("", "Canonical, hreflang, robots and sitemap results are observations only.",
    "The SHA is not deployment-verified unless it matches a separately supplied approved expected SHA.", "");
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const expectedArg = process.argv.find(arg => arg.startsWith("--expected-sha="));
    const expectedSha = expectedArg ? expectedArg.slice("--expected-sha=".length) : null;
    const result = await checkPublicRoutes({expectedSha});
    const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
    const dir = path.join(root, "tmp", "recipavo-live-audit");
    await mkdir(dir, {recursive: true});
    await writeFile(path.join(dir, "current.json"), JSON.stringify(result, null, 2) + "\n");
    await writeFile(path.join(dir, "current.md"), publicAuditMarkdown(result));
    console.log(JSON.stringify({statuses: result.statuses, summary: result.summary}));
    // Deliberately advisory: a network failure must remain HOLD in the artifact,
    // never be laundered into a publication approval or a false green live gate.
  } catch (error) {
    console.error("PUBLIC_LIVE_AUDIT_FAILED:", error);
    process.exitCode = 1;
  }
}
