import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { languageDestination } from "../src/SiteNavigation";

import { normalizePath } from "../src/content/route-data";
import { resolveSiteTarget } from "../src/content/site-target";

const dist = path.resolve(import.meta.dirname, "../dist");

test("recipe route normalization follows the deployment base", () => {
  const legacy = resolveSiteTarget();
  const preview = resolveSiteTarget("https://v1.recipavo-v1-preview.pages.dev");
  assert.equal(normalizePath("/Reseptit/en/recipes/?q=rice", legacy.basePath), "/en/recipes/");
  assert.equal(normalizePath("/en/recipes/?q=rice", preview.basePath), "/en/recipes/");
  assert.equal(normalizePath("/Reseptit/en/recipes/", preview.basePath), "/Reseptit/en/recipes/");
  assert.equal(preview.noIndex, true);
  assert.throws(() => resolveSiteTarget("https://www.recipavo.com"));
  assert.deepEqual(resolveSiteTarget(undefined, "production"), {
    basePath: "/", baseUrl: "https://www.recipavo.com", noIndex: false, production: true,
  });
  assert.throws(() => resolveSiteTarget(preview.baseUrl, "production"));
  assert.throws(() => resolveSiteTarget(undefined, "invalid"));
});

test("language switching preserves translated content and keeps Finnish-only blog honest", () => {
  const translations = [
    { locale: "fi" as const, routePath: "/korvapuustit/" },
    { locale: "en" as const, routePath: "/en/recipes/cinnamon-rolls/" }
  ];
  assert.equal(languageDestination("en", "/korvapuustit/", translations), "/en/recipes/cinnamon-rolls/");
  assert.equal(languageDestination("sv", "/korvapuustit/", translations), "/sv/recept/");
  assert.equal(languageDestination("en", "/ruokaopas/pad-thai-ainesosat/", []), "/en/recipes/");
  assert.equal(languageDestination("fi", "/ruokaopas/pad-thai-ainesosat/", []), "/ruokaopas/pad-thai-ainesosat/");
  assert.equal(languageDestination("sv", "/glykeeminen-kuorma/", []), "/sv/glykemisk-belastning/");
  assert.equal(languageDestination("th", "/en/glycemic-load/", []), "/th/glycemic-load/");
});

test("all locale indexes expose two separate semantic navigation groups", async () => {
  for (const route of ["", "en/recipes", "sv/recept", "th/recipes", "ruokaopas"]) {
    const html = await readFile(path.join(dist, route, "index.html"), "utf8");
    assert.match(html, /class="site-primary-nav" aria-label="/, route);
    assert.match(html, /class="site-language-nav" aria-label="/, route);
    assert.equal((html.match(/class="site-primary-nav"/g) ?? []).length, 1, route);
    assert.equal((html.match(/class="site-language-nav"/g) ?? []).length, 1, route);
    assert.match(html, /href="\/Reseptit\/ruokaopas\/"/);
    assert.match(html, /href="\/Reseptit\/(glykeeminen-kuorma|en\/glycemic-load|sv\/glykemisk-belastning|th\/glycemic-load)\/"/, route);
  }
});

test("global scroll restoration and preserved filter position are wired once", async () => {
  const router = await readFile(path.resolve(import.meta.dirname, "../src/router.tsx"), "utf8");
  const recipes = await readFile(path.resolve(import.meta.dirname, "../src/features/recipes/RecipesPage.tsx"), "utf8");
  assert.match(router, /<ScrollRestoration\s*\/>/);
  assert.equal((router.match(/<ScrollRestoration\s*\/>/g) ?? []).length, 1);
  assert.match(recipes, /preventScrollReset:\s*true/);
});
