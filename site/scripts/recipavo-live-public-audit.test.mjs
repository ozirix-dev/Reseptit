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
