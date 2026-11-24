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
  const recipeSlugs = [
    "valimerellinen-menemen-fetalla",
    "valimerellinen-pinaatti-fetashakshuka",
  ];
  const recipeRoutes = recipeSlugs.flatMap(slug =>
    [["fi", "/"], ["en", "/en/recipes/"], ["sv", "/sv/recept/"], ["th", "/th/recipes/"]]
      .map(([lang, root]) => [lang, root + slug + "/"]));
  const pages = [
    ["fi", "/"], ["en", "/en/recipes/"], ["sv", "/sv/recept/"],
    ["th", "/th/recipes/"], ["fi", "/reseptit/sivu/2/"],
    ...recipeRoutes,
  ];
  const changedRecipeRoute = "/sv/recept/valimerellinen-pinaatti-fetashakshuka/";
  const asset = "/assets/index-abcd.js";
  const entry = `<script type="module" src="${asset}"></script>`;
  const bootstrap = `<script type="module">const importEntry = () => { void import("${asset}"); }; importEntry();</script>`;
  const library = "/reseptit/sivu/2/";
  const english = "/en/recipes/";
  for (const [locale, route] of pages) {
    const url = origin + route;
    const article = route.includes("/sivu/") ? '<article class="recipe-card">Card</article>' : "";
    const recipe = recipeRoutes.some(([, candidate]) => candidate === route) ? [
      '<ul class="ingredient-list"><li>egg</li><li>feta</li></ul>',
      '<script type="application/ld+json">',
      JSON.stringify({
        "@type": "Recipe", name: "Recipe", recipeIngredient: ["egg", "feta"],
        recipeInstructions: ["prepare vegetables", "cook eggs", "serve with feta"],
        nutrition: { carbohydrateContent: "5.02 g", proteinContent: "21.98 g" },
      }),
      "</script>",
    ].join("") : "";
    files.set(route + "index.html", [
      `<html lang="${locale}"><head><link rel="canonical" href="${url}">`,
      `<link rel="alternate" hreflang="${locale}" href="${url}">`,
      (route === "/" ? bootstrap : entry) + "</head>",
      `<body><div id="root"><h1>Recipes</h1>${article}${recipe}</div></body></html>`,
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

  type Fault = "entry-mismatch" | "entry-missing" | "bootstrap-mismatch" | "bootstrap-hidden" |
    "js-mime" | "cached-js-mime" |
    "robots-bytes" | "robots-revision" | "html-revision" |
    "recipe-ingredients" | "recipe-instructions" | "recipe-revision" | "recipe-http";
  const requestWithFault = (fault?: Fault): typeof fetch => async input => {
    const { pathname, search } = new URL(String(input));
    const staleRevision = (pathname === "/robots.txt" && (!search || fault === "robots-revision")) ||
      (pathname === "/" && fault === "html-revision") ||
      (pathname === changedRecipeRoute && fault === "recipe-revision") ||
      (pathname === asset && !search && fault === "cached-js-mime");
    const headers = new Headers({
      "content-type": pathname.endsWith("/") ? "text/html" : "text/plain",
      "X-Recipavo-Commit": staleRevision ? old : sha,
    });
    if (pathname === asset && fault !== "js-mime" && (search || fault !== "cached-js-mime")) {
      headers.set("content-type", "Text/JavaScript; charset=UTF-8");
    }
    if (pathname === missing) {
      return new Response('<meta name="robots" content="noindex,follow"><h1>Missing</h1>', { status: 404, headers });
    }
    const file = pathname.endsWith("/") ? pathname + "index.html" : pathname;
    const body = files.get(file);
    assert.ok(body !== undefined, file);
    if (pathname === changedRecipeRoute && fault === "recipe-http") {
      return new Response("Not Found", { status: 404, headers });
    }
    if (pathname === changedRecipeRoute && fault === "recipe-ingredients") {
      return new Response(body.replace("<li>egg</li>", "<li>unknown</li>"), { headers });
    }
    if (pathname === changedRecipeRoute && fault === "recipe-instructions") {
      return new Response(body.replace('"cook eggs"', '"serve raw eggs"'), { headers });
    }
    if (pathname === "/" && fault === "bootstrap-mismatch") {
      return new Response(body.replace("importEntry();</script>", "</script>"), { headers });
    }
    if (pathname === "/" && fault === "bootstrap-hidden") {
      return new Response(body.replace(bootstrap, `<template>${bootstrap}</template>`), { headers });
    }
    if (pathname === library && fault === "entry-mismatch") {
      return new Response(body.replace(asset, "/assets/index-missing.js"), { headers });
    }
    if (pathname === english && fault === "entry-missing") {
      const decoys = [
        `<link rel="modulepreload" href="${asset}">`,
        `<script type="module" src="https://analytics.example/analytics.js"></script>`,
        `<template>${entry}</template>`,
        `<!--${entry}-->`,
      ].join("");
      return new Response(body.replace(entry, decoys), { headers });
    }
    return new Response(pathname === "/robots.txt" && !search && fault === "robots-bytes" ? "wrong" : body, { headers });
  };

  const verify = (fault?: Fault) => verifyProductionRelease(sha, origin, dir, requestWithFault(fault));

  await t.test("accepts the matching release and stale robots metadata", async () => {
    const result = await verify();
    assert.deepEqual(result.summaries.filter(entry => entry.cachedMetadata), [
      { route: "/robots.txt", revision: old, cachedMetadata: true },
    ]);
    assert.deepEqual(result.summaries.filter(entry => entry.route === asset), [{ route: asset, revision: sha }]);
    assert.equal(result.summaries.filter(entry => recipeRoutes.some(([, route]) => route === entry.route)).length, 8,
      "Two approved-source recipe identities must have all four language routes checked");
  });

  await t.test("rejects a modified or inactive inline home bootstrap", async () => {
    await assert.rejects(verify("bootstrap-mismatch"), /live module entry differs from artifact/);
    await assert.rejects(verify("bootstrap-hidden"), /expected one first-party module entry/);
  });
  await t.test("rejects stale or missing #404 recipe pages in any locale", async () => {
    await assert.rejects(verify("recipe-http"), /pinaatti-fetashakshuka/);
    await assert.rejects(verify("recipe-revision"), /pinaatti-fetashakshuka.*revision/);
  });
  await t.test("rejects live recipe ingredients or safety steps diverging from the release", async () => {
    await assert.rejects(verify("recipe-ingredients"), /live ingredient list differs from artifact/);
    await assert.rejects(verify("recipe-instructions"), /live Recipe JSON-LD .* differs from artifact/);
  });
  await t.test("rejects a mismatched library module entry", async () => {
    await assert.rejects(verify("entry-mismatch"), /\/reseptit\/sivu\/2\/.*live module entry/);
  });
  await t.test("rejects an English page without an active first-party module entry", async () => {
    await assert.rejects(verify("entry-missing"), /\/en\/recipes\/.*live module entry/);
  });
  await t.test("rejects text/plain JavaScript with matching bytes and revision", async () => {
    await assert.rejects(verify("js-mime"), /index-abcd\.js.*Content-Type/);
  });
  await t.test("rejects text/plain at the ordinary URL even when a revision probe would succeed", async () => {
    await assert.rejects(verify("cached-js-mime"), /index-abcd\.js.*Content-Type/);
  });
  await t.test("rechecks ordinary HTML URLs when only the observed previous release is served", async () => {
    const requests: string[] = [];
    const delays: number[] = [];
    const get = requestWithFault();
    const request: typeof fetch = async (input, init) => {
      const { pathname, search } = new URL(String(input));
      const response = await get(input, init);
      if (pathname === "/" || pathname === changedRecipeRoute) {
        assert.equal(search, "");
        if (!requests.includes(pathname)) response.headers.set("X-Recipavo-Commit", old);
        requests.push(pathname);
      }
      return response;
    };
    const result = await verifyProductionRelease(sha, origin, dir, request, {
      previousSha: old,
      delay: async ms => { delays.push(ms); },
    });
    assert.deepEqual(requests, ["/", "/", changedRecipeRoute, changedRecipeRoute]);
    assert.deepEqual(delays, [5_000, 5_000]);
    assert.ok(result.summaries.some(entry => entry.route === changedRecipeRoute && entry.revision === sha));
  });

  await t.test("fails after six retries if the previous revision does not converge", async () => {
    let delays = 0;
    await assert.rejects(verifyProductionRelease(sha, origin, dir, requestWithFault("html-revision"), {
      previousSha: old,
      delay: async () => { delays += 1; },
    }), /\/ revision/);
    assert.equal(delays, 6);
  });

  await t.test("does not retry an unrecognized revision or unrelated failures", async () => {
    const delay = async () => { assert.fail("Unexpected revision retry"); };
    await assert.rejects(verifyProductionRelease(sha, origin, dir, requestWithFault("html-revision"), {
      previousSha: "c".repeat(40), delay,
    }), /\/ revision/);
    const options = { previousSha: old, delay };
    await assert.rejects(verifyProductionRelease(sha, origin, dir, requestWithFault("recipe-http"), options),
      /pinaatti-fetashakshuka/);
    await assert.rejects(verifyProductionRelease(sha, origin, dir, requestWithFault("bootstrap-mismatch"), options),
      /live module entry differs from artifact/);
  });

  await t.test("rejects wrong robots bytes or revision, stale HTML and preview origins", async () => {
    await assert.rejects(verify("robots-bytes"), /robots\.txt content/);
    await assert.rejects(verify("robots-revision"), /robots\.txt revision probe/);
    await assert.rejects(verify("html-revision"), /\/ revision/);
    await assert.rejects(verifyProductionRelease(sha, "https://recipavo-preview.pages.dev", dir, requestWithFault()),
      /production origin/);
  });
});
