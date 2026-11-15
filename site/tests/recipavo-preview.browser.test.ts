import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { launchBrowser } from "./launch-browser";
import { recipavoHeroCopy } from "../src/features/recipes/recipavo-hero";
import { siteContent } from "../src/generated/content.generated";
import { recipeLibraryPagePath, recipeLibraryPageSize } from "../src/features/recipes/recipe-pagination";

const production = process.env.RECIPAVO_BUILD_TARGET === "production";
const prefix = production ? "" : "/Reseptit";
const base = "http://127.0.0.1:4181" + prefix;
const indexes = { fi: "/", en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" } as const;

test("branded HTML keeps the target indexing policy, search and library working in every locale", async () => {
  assert.ok(production || process.env.VITE_RECIPAVO_HERO_PREVIEW === "true", "Build and test must use the same branded target");
  const homePicksExpected = existsSync(path.resolve("src/features/recipes/home-preview.ts"));
  assert.equal(homePicksExpected, true, "H1 preview must be present on the integrated main before releasing this SEO fix");
  const server = spawn(process.execPath, [path.resolve("node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4181", "--strictPort"], { stdio: "pipe" });
  let output = "";
  server.stdout.on("data", (data) => { output += data; });
  server.stderr.on("data", (data) => { output += data; });
  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined;
  try {
    let ready = false;
    for (let i = 0; i < 80; i++) {
      if (server.exitCode !== null) throw Error(`Vite preview exited: ${output}`);
      try { ready = (await fetch(`${base}/`)).ok; } catch { /* server warming up */ }
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.ok(ready, output);
    browser = await launchBrowser();
    const errors: string[] = [];
    for (const [locale, route] of Object.entries(indexes) as Array<[keyof typeof indexes, string]>) {
      const noJs = await browser.newPage({ javaScriptEnabled: false });
      await noJs.goto(base + route);
      assert.equal(await noJs.locator("h1").textContent(), recipavoHeroCopy[locale].title);
      if (production) assert.equal(await noJs.locator('meta[name="robots"]').count(), 0);
      else assert.match(await noJs.locator('meta[name="robots"]').getAttribute("content") ?? "", /noindex\s*,\s*nofollow/);
      assert.equal(await noJs.locator('link[rel="canonical"]').count(), 1);
      if (homePicksExpected) {
        assert.equal(await noJs.locator(".home-preview__picks > .recipe-card-grid .recipe-card").count(), 9, locale);
        await noJs.locator(".recipe-library-link a").click();
        assert.equal(new URL(noJs.url()).pathname, prefix + recipeLibraryPagePath(locale));
        assert.equal(await noJs.locator(".recipe-card").count(), recipeLibraryPageSize);
        await noJs.locator('.recipe-pagination a[rel="next"]').click();
        assert.equal(new URL(noJs.url()).pathname, prefix + recipeLibraryPagePath(locale, 2));
      }
      await noJs.close();

      const page = await browser.newPage({ viewport: { width: { fi: 320, en: 390, sv: 768, th: 1440 }[locale], height: 850 } });
      page.on("pageerror", (error) => errors.push(`${locale}: ${error.message}`));
      await page.goto(base + route);
      await page.locator("#recipe-search").waitFor();
      await page.waitForFunction(
        ({ title, production }) => document.title === title && (production
          ? !document.querySelector('meta[name="robots"]')
          : /noindex\s*,\s*nofollow/.test(document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "")),
        { title: recipavoHeroCopy[locale].title + " | Recipavo", production },
      );
      assert.equal(await page.locator("h1").textContent(), recipavoHeroCopy[locale].title);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}: horizontal overflow`);
      if (homePicksExpected) {
        assert.equal(await page.locator(".home-preview__picks > .recipe-card-grid .recipe-card").count(), 9, locale);
        assert.ok(await page.locator(".home-preview__topic-list a").count() >= 4, locale);
        const cards = await page.locator(".recipe-card__link").evaluateAll(links =>
          links.map(link => (link as HTMLAnchorElement).pathname));
        const outsideHome = siteContent.recipes.find(recipe => recipe.locale === locale && !cards.includes(prefix + recipe.routePath))!;
        await page.locator("#recipe-search").fill(outsideHome.title);
        await page.locator('.recipe-card__link[href="' + prefix + outsideHome.routePath + '"]').waitFor();
        await page.goto(base + route);
        await page.locator(".home-preview__topic-list a").first().click();
        await page.waitForFunction(() => !document.querySelector(".home-preview__picks") && !!document.querySelector(".recipe-result-count"));
        assert.ok(page.url().includes("category=") || page.url().includes("diet="), `${locale}: topic filtering`);
      }
      await page.close();
    }
    const fallback = await browser.newPage({ viewport: { width: 412, height: 900 }, deviceScaleFactor: 2, isMobile: true });
    try {
      let allowHydration!: () => void;
      const beforeHydration = new Promise<void>(resolve => { allowHydration = resolve; });
      await fallback.route(/\/assets\/index-[\w-]+\.js$/, async route => {
        await beforeHydration;
        await route.continue();
      });
      await fallback.route(/\/kuvat\/.+\.webp$/, async route => {
        const file = new URL(route.request().url()).pathname.split("/kuvat/")[1];
        await route.fulfill({ path: path.resolve("dist/kuvat", file), contentType: "image/webp" });
      });
      await fallback.route("**/*.avif", route => route.fulfill({ status: 404 }));
      try {
        await fallback.goto(base + "/", { waitUntil: "commit" });
        await fallback.locator(".home-preview__picks .recipe-card__link").first().scrollIntoViewIfNeeded();
        await fallback.waitForFunction(() => {
          const img = document.querySelector<HTMLImageElement>(".home-preview__picks .recipe-card__image");
          return img?.currentSrc.endsWith(".avif") && img.complete && img.naturalWidth === 0;
        });
      } finally {
        allowHydration();
      }
      await fallback.waitForFunction(() => {
        const img = document.querySelector<HTMLImageElement>(".home-preview__picks .recipe-card__image");
        return img?.currentSrc.endsWith("-720w.webp") && img.complete && img.naturalWidth > 0;
      });
    } finally {
      await fallback.close();
    }

    const fi = await browser.newPage();
    fi.on("pageerror", (error) => errors.push(`FI blog: ${error.message}`));
    await fi.goto(base + "/ruokaopas/");
    await fi.waitForFunction(production => production
      ? !document.querySelector('meta[name="robots"]')
      : /noindex\s*,\s*nofollow/.test(document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? ""), production);
    assert.ok(await fi.getByRole("heading", { name: "Ruokaopas", exact: true }).count());
    await fi.close();
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    server.kill();
  }
});
