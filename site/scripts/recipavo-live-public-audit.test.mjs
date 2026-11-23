import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PUBLIC_ROUTES, checkPublicRoutes, inspectHeadLinks, publicAuditMarkdown,
} from "../scripts/recipavo-live-public-audit.mjs";

const sha = "a".repeat(40);

function syntheticFetch(url) {
  const route = new URL(url);
  const missing = route.pathname.includes("nonexistent");
  const type = route.pathname.endsWith(".xml") ? "application/xml"
    : route.pathname.endsWith(".txt") ? "text/plain" : "text/html";
  const body = missing ? "Not found" : type === "application/xml"
    ? '<urlset><url><loc>https://www.recipavo.com/</loc></url></urlset>'
    : type === "text/plain" ? "User-agent: *\nAllow: /\n"
      : '<html><head><link href="https://www.recipavo.com' + route.pathname
        + '" rel="canonical"><link rel="alternate" hreflang="en" href="https://www.recipavo.com/en/recipes/"></head><body>Public test</body></html>';
  return Promise.resolve(new Response(body, {
    status: missing ? 404 : 200,
    headers: {"content-type": type, "X-Recipavo-Commit": sha},
  }));
}

test("extract canonical and hreflang irrespective of link attribute order", () => {
  assert.deepEqual(inspectHeadLinks(
    '<link href="https://example.org/" rel="canonical"><link hreflang="sv" href="https://example.org/sv/" rel="alternate">'
  ), {canonical: "https://example.org/", hreflang: {sv: "https://example.org/sv/"}});
});

test("9 public routes include FI guides, three localized recipe indexes and deliberate 404", () => {
  assert.equal(PUBLIC_ROUTES.length, 9);
  assert.ok(PUBLIC_ROUTES.some(x => x.path === "/ruokaopas/glykeeminen-indeksi-ja-kuorma/"));
  assert.ok(PUBLIC_ROUTES.some(x => x.path === "/th/recipes/"));
  assert.ok(PUBLIC_ROUTES.some(x => x.expected === 404));
});

test("a source-pinned complete public observation does not authorize link publishing", async () => {
  const result = await checkPublicRoutes({fetcher: syntheticFetch, expectedSha: sha});
  assert.equal(result.statuses.http, "PASS");
  assert.equal(result.statuses.releaseSha, "PASS");
  assert.equal(result.statuses.shaConsistency, "PASS");
  assert.equal(result.statuses.canonical, "PASS");
  assert.equal(result.statuses.overall, "PASS");
  assert.equal(result.summary.checked, 9);
  assert.equal(result.summary.matchingHttpStatuses, 9);
  assert.equal(result.summary.htmlCanonicalObserved, 6);
  assert.equal(result.routes.find(x => x.key === "deliberate-404")?.httpStatus, 404);
  assert.equal(result.routes.find(x => x.key === "sitemap")?.sitemapLocCount, 1);
  assert.equal(result.releaseAuthorized, false);
  assert.equal(result.linkPublicationAuthorized, false);
  assert.equal(result.autoDeploy, false);
  assert.match(publicAuditMarkdown(result), /SHA: PASS/);
});

test("without independently pinned SHA even HTTP success is not release verification", async () => {
  const result = await checkPublicRoutes({fetcher: syntheticFetch});
  assert.equal(result.statuses.http, "PASS");
  assert.equal(result.statuses.releaseSha, "NOT VERIFIED");
  assert.equal(result.statuses.overall, "HOLD");
});

test("network errors remain missing HTTP statuses, not invented 404s", async () => {
  const result = await checkPublicRoutes({
    expectedSha: sha, fetcher: async url => {
      if (url.includes("keto-vhh")) throw Error("Synthetic DNS failure");
      return syntheticFetch(url);
    },
  });
  assert.equal(result.statuses.http, "HOLD");
  assert.equal(result.statuses.overall, "HOLD");
  const bad = result.routes.find(x => x.key === "keto-guide-fi");
  assert.equal(bad?.httpStatus, null);
  assert.match(bad?.error ?? "", /Synthetic DNS failure/);
});

test("wrong canonical and mismatched commit both block live success", async () => {
  const result = await checkPublicRoutes({
    expectedSha: "b".repeat(40),
    fetcher: async url => {
      const result = await syntheticFetch(url);
      if (!url.includes("/ruokaopas/keto-vhh-ero/")) return result;
      return new Response('<link rel="canonical" href="https://www.recipavo.com/other/">', {
        status: 200, headers: {"content-type": "text/html", "X-Recipavo-Commit": sha},
      });
    },
  });
  assert.equal(result.statuses.overall, "HOLD");
  assert.equal(result.summary.mismatchedCanonicals, 1);
  assert.equal(result.statuses.releaseSha, "NOT VERIFIED");
});

test("reject insecure origins and invalid expected SHA", async () => {
  await assert.rejects(checkPublicRoutes({origin: "http://example.org", fetcher: syntheticFetch}), /HTTPS/);
  await assert.rejects(checkPublicRoutes({expectedSha: "abc", fetcher: syntheticFetch}), /40-character/);
});

test("crawler files HOLD even when an HTML fallback returns 200 and the expected commit", async () => {
  for (const [path, contentType] of [
    ["/robots.txt", "text/html"],
    ["/robots.txt", "text/plain"],
    ["/sitemap.xml", "text/html"],
    ["/sitemap.xml", "application/xml"],
  ]) {
    const report = await checkPublicRoutes({
      expectedSha: sha,
      fetcher: async url => {
        if (!url.endsWith(path)) return syntheticFetch(url);
        return new Response("<!doctype html><html><body>Public page</body></html>", {
          headers: {"content-type": contentType, "X-Recipavo-Commit": sha},
        });
      },
    });
    assert.equal(report.statuses.http, "PASS");
    assert.equal(report.statuses.releaseSha, "PASS");
    assert.equal(report.statuses.overall, "HOLD", path + " " + contentType);
    assert.equal(report.statuses.crawlerFiles, "HOLD");
    assert.equal(report.routes.find(route => route.requested.endsWith(path))?.crawlerContentMatch, false);
    assert.match(publicAuditMarkdown(report), /Crawler files: HOLD/);
  }
});

test("an empty sitemap or commented-out location does not count as crawler evidence", async () => {
  const report = await checkPublicRoutes({
    expectedSha: sha,
    fetcher: async url => {
      if (!url.endsWith("/sitemap.xml")) return syntheticFetch(url);
      return new Response("<urlset><!-- <loc>https://www.recipavo.com/</loc> --></urlset>", {
        headers: {"content-type": "application/xml", "X-Recipavo-Commit": sha},
      });
    },
  });
  assert.equal(report.routes.find(route => route.key === "sitemap")?.sitemapLocCount, 0);
  assert.equal(report.statuses.overall, "HOLD");
});

const inspectSitemap = body => checkPublicRoutes({
  expectedSha: sha,
  fetcher: async url => url.endsWith("/sitemap.xml")
    ? new Response(body, {headers: {"content-type": "application/xml", "X-Recipavo-Commit": sha}})
    : syntheticFetch(url),
});

test("malformed XML, misplaced locations and invalid URLs keep sitemap evidence on HOLD", async () => {
  const bodies = [
    '<urlset><url><loc>https://www.recipavo.com/</loc>',
    '<urlset><![CDATA[<loc>https://www.recipavo.com/</loc>]]></urlset>',
    '<urlset><loc>https://www.recipavo.com/</loc></urlset>',
    '<urlset><sitemap><loc>https://www.recipavo.com/</loc></sitemap></urlset>',
    '<urlset><url><loc>not-a-url</loc></url></urlset>',
    '<urlset><url><loc>https:example.com</loc></url></urlset>',
    '<urlset><url><loc>https://www.recipavo.com/</loc></url><url/></urlset>',
    '<!DOCTYPE urlset><urlset><url><loc>https://www.recipavo.com/</loc></url></urlset>',
    '<urlset><url><loc>https://www.recipavo.com/</loc></url></urlset>' + ' '.repeat(500000) + '<extra/>',
  ];
  for (const body of bodies) {
    const report = await inspectSitemap(body);
    assert.equal(report.statuses.http, "PASS");
    assert.equal(report.statuses.releaseSha, "PASS");
    assert.equal(report.statuses.crawlerFiles, "HOLD", body.slice(0, 100));
    assert.equal(report.statuses.overall, "HOLD");
  }
});

test("sitemap locations must belong to the audited HTTPS origin", async () => {
  const valid = "<url><loc>https://www.recipavo.com/</loc></url>";
  for (const location of [
    "https://www.recipavo.com.example.org/recipe/",
    "http://www.recipavo.com/recipe/",
    "https://www.recipavo.com:8443/recipe/",
  ]) {
    const report = await inspectSitemap(
      "<urlset>" + valid + "<url><loc>" + location + "</loc></url></urlset>",
    );
    const sitemap = report.routes.find(route => route.key === "sitemap");
    assert.equal(sitemap?.sitemapLocCount, 2);
    assert.equal(sitemap?.crawlerContentMatch, false, location);
    assert.equal(report.statuses.http, "PASS");
    assert.equal(report.statuses.overall, "HOLD");
  }

  const report = await inspectSitemap(
    "<sitemapindex><sitemap><loc>https://example.org/recipes.xml</loc></sitemap></sitemapindex>",
  );
  assert.equal(report.statuses.crawlerFiles, "HOLD");
});

test("valid sitemap URLs and sitemap indexes are counted under the corresponding parent", async () => {
  const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
  const locations = '<loc>https://www.recipavo.com/</loc>';
  const cases = [
    [`<urlset xmlns="${namespace}"><url>${locations}<lastmod>2026-11-23</lastmod></url><url><loc>https://www.recipavo.com/?a=1&amp;b=2</loc></url></urlset>`, 2],
    [`<s:sitemapindex xmlns:s="${namespace}"><s:sitemap><s:loc>https://www.recipavo.com/recipes.xml</s:loc></s:sitemap></s:sitemapindex>`, 1],
  ];
  for (const [body, expected] of cases) {
    const report = await inspectSitemap(body);
    assert.equal(report.statuses.crawlerFiles, "PASS");
    assert.equal(report.statuses.overall, "PASS");
    assert.equal(report.routes.find(route => route.key === "sitemap")?.sitemapLocCount, expected);
  }
});

test("same HTTP status but stale robots.txt commit must fail SHA consistency", async () => {
  const olderSha = "b".repeat(40);
  const report = await checkPublicRoutes({
    expectedSha: sha,
    fetcher: async url => {
      const response = await syntheticFetch(url);
      if (!url.endsWith("/robots.txt")) return response;
      return new Response("User-agent: *\nAllow: /\n", {
        status: 200, headers: {"content-type": "text/plain", "X-Recipavo-Commit": olderSha},
      });
    },
  });
  assert.equal(report.statuses.http, "PASS");
  assert.equal(report.statuses.canonical, "PASS");
  assert.equal(report.statuses.shaConsistency, "HOLD");
  assert.equal(report.statuses.releaseSha, "NOT VERIFIED");
  assert.deepEqual(report.summary.distinctSourceShas, [sha, olderSha].sort());
  assert.equal(report.statuses.overall, "HOLD");
});
