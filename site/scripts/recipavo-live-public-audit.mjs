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

const crawlerFiles = new Set(["robots", "sitemap"]);

function inspectCrawlerFile(key, contentType, body) {
  const mediaType = contentType?.split(";")[0].trim().toLowerCase();
  if (key === "robots") {
    const hasUserAgent = /^[\t ]*user-agent[\t ]*:[\t ]*[^#\s]+/im.test(body);
    return {
      crawlerContentMatch: mediaType === "text/plain" && !body.trimStart().startsWith("<") && hasUserAgent,
      sitemapLocCount: null,
    };
  }
  const xml = body.replace(/<!--[\s\S]*?-->/g, "").trimStart();
  const hasSitemapRoot = /^(?:<\?xml\s[^?]*\?>\s*)?<(?:urlset|sitemapindex)(?:\s|>)/.test(xml);
  const sitemapLocCount = [...xml.matchAll(/<loc>\s*[^<\s][^<]*<\/loc>/g)].length;
  return {
    crawlerContentMatch: (mediaType === "application/xml" || mediaType === "text/xml")
      && hasSitemapRoot && sitemapLocCount > 0,
    sitemapLocCount,
  };
}

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
        ...(crawlerFiles.has(route.key) && status === 200
          ? inspectCrawlerFile(route.key, contentType, body)
          : {crawlerContentMatch: crawlerFiles.has(route.key) ? false : null, sitemapLocCount: null}),
        error: null,
      };
    } catch (error) {
      return {
        key: route.key, requested, finalUrl: null, redirected: null,
        expectedStatus: route.expected, httpStatus: null, httpMatch: false,
        contentType: null, sourceSha: null, canonical: null, canonicalMatch: null,
        hreflang: {}, crawlerContentMatch: crawlerFiles.has(route.key) ? false : null,
        sitemapLocCount: null, error: String(error),
      };
    }
  }));
  const httpVerified = observations.every(r => r.httpMatch);
  const crawlerFilesVerified = observations.filter(r => crawlerFiles.has(r.key))
    .every(r => r.crawlerContentMatch === true);
  const badCanonicals = observations.filter(r => r.canonicalMatch === false);
  const sourceHeaders = observations.filter(r => r.httpMatch && r.sourceSha !== null);
  const distinctSourceShas = [...new Set(sourceHeaders.map(r => r.sourceSha))].sort();
  const shaConsistency = sourceHeaders.length !== observations.length ? "NOT FULLY VERIFIED"
    : distinctSourceShas.length === 1 ? "PASS" : "HOLD";
  const htmlPages = observations.filter(r => PUBLIC_ROUTES.find(p => p.key === r.key)?.html);
  const canonicalStatus = badCanonicals.length ? "HOLD"
    : htmlPages.every(r => r.canonicalMatch === true) ? "PASS" : "NOT FULLY VERIFIED";
  const shaVerified = expectedSha !== null && shaConsistency === "PASS"
    && sourceHeaders.every(r => r.sourceSha === expectedSha);
  const result = {
    schemaVersion: 1,
    observedAt: new Date().toISOString(),
    origin: base.origin,
    expectedSha,
    statuses: {
      http: httpVerified ? "PASS" : "HOLD",
      canonical: canonicalStatus,
      crawlerFiles: crawlerFilesVerified ? "PASS" : "HOLD",
      shaConsistency,
      hreflang: "OBSERVED ONLY",
      releaseSha: shaVerified ? "PASS" : "NOT VERIFIED",
      overall: httpVerified && canonicalStatus === "PASS" && crawlerFilesVerified && shaVerified
        ? "PASS" : "HOLD",
    },
    summary: {
      checked: observations.length,
      matchingHttpStatuses: observations.filter(r => r.httpMatch).length,
      unobservedHttpStatuses: observations.filter(r => r.httpStatus === null).length,
      htmlCanonicalObserved: observations.filter(r => r.canonical !== null).length,
      mismatchedCanonicals: badCanonicals.length,
      releaseShaObserved: sourceHeaders.length,
      distinctSourceShas,
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
    "; SHA consistency: " + result.statuses.shaConsistency,
    "; overall: " + result.statuses.overall,
    "Crawler files: " + result.statuses.crawlerFiles, "",
    "| Route | HTTP | Expected | Canonical | Crawler content | Release header |",
    "| --- | ---: | ---: | --- | --- | --- |",
  ];
  for (const row of result.routes) {
    lines.push("| " + row.key + " | " + (row.httpStatus ?? "unavailable")
      + " | " + row.expectedStatus + " | " + (row.canonicalMatch ?? "not verified")
      + " | " + (row.crawlerContentMatch ?? "—")
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
