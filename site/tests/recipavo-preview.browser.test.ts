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
const base = "http://127.0.0.1:4181";
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
      if (production && locale === "fi") {
        const website = await noJs.locator("#website-jsonld").textContent();
        assert.deepEqual(JSON.parse(website!), {
          "@context": "https://schema.org", "@type": "WebSite", name: "Recipavo", url: "https://www.recipavo.com/",
        });
      }
      if (homePicksExpected) {
        assert.equal(await noJs.locator(".home-preview__picks > .recipe-card-grid .recipe-card").count(), 9, locale);
        await noJs.locator(".recipe-library-link a").click();
        assert.equal(new URL(noJs.url()).pathname, recipeLibraryPagePath(locale));
        assert.equal(await noJs.locator(".recipe-card").count(), recipeLibraryPageSize);
        await noJs.locator('.recipe-pagination a[rel="next"]').click();
        assert.equal(new URL(noJs.url()).pathname, recipeLibraryPagePath(locale, 2));
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
        { title: recipavoHeroCopy[locale].tagline + " | Recipavo", production },
      );
      assert.equal(await page.locator("h1").textContent(), recipavoHeroCopy[locale].title);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}: horizontal overflow`);
      if (homePicksExpected) {
        assert.equal(await page.locator(".home-preview__picks > .recipe-card-grid .recipe-card").count(), 9, locale);
        const firstCard = page.locator(".home-preview__picks .recipe-card__link").first();
        const firstTitle = (await firstCard.locator("h3").textContent())!;
        assert.equal(await firstCard.getByRole("heading", { name: firstTitle, exact: true }).count(), 1, locale);
        assert.equal(await page.getByRole("link", { name: firstTitle, exact: true }).count(), 1, locale);
        const cards = await page.locator(".recipe-card__link").evaluateAll(links =>
          links.map(link => (link as HTMLAnchorElement).pathname));
        const outsideHome = siteContent.recipes.find(recipe => recipe.locale === locale && !cards.includes(recipe.routePath))!;
        await page.locator("#recipe-search").fill(outsideHome.title);
        await page.locator('.recipe-card__link[href="' + outsideHome.routePath + '"]').waitFor();
        await page.goto(base + route);
        await page.locator("#recipe-category").selectOption("paaruoka");
        await page.locator(".recipe-result-count").waitFor();
        assert.equal(await page.locator(".home-preview__picks").count(), 0, locale);
        assert.equal(new URL(page.url()).searchParams.get("category"), "paaruoka", locale);
        await page.locator(".recipe-more-filters > summary").press("Enter");
        await page.locator("#recipe-gluten-free").check();
        await page.waitForURL(url => url.searchParams.has("gluten_free"));
        const target = locale === "en" ? "fi" : "en";
        const selected = new URL(page.url()).search;
        await page.reload();
        await page.locator(`.site-language-menu a[href="${indexes[target]}${selected}"]`).waitFor({ state: "attached" });
        const menu = page.locator(".site-language-menu");
        if (await menu.locator("summary").isVisible()) await menu.locator("summary").click();
        await menu.locator(`a[hreflang="${target}"]`).click();
        await page.waitForURL(url => url.pathname === indexes[target] && url.search === selected);
        await page.locator(".recipe-result-count").waitFor();
        assert.equal(await page.locator("#recipe-category").inputValue(), "paaruoka", locale);
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
    await fi.getByRole("link", { name: /Pad thai kotona/ }).click();
    await fi.getByRole("link", { name: "VHH-pad thai katkaravuilla ja konjaknuudeleilla" }).click();
    await fi.waitForFunction(() => document.title === "VHH-pad thai katkaravuilla ja konjaknuudeleilla | Recipavo");
    const description = "Valmista VHH-pad thai katkaravuista ja konjaknuudeleista. Kuivapaista nuudelit ennen wokkausta, jotta niistä haihtuu ylimääräinen neste.";
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      assert.equal(await fi.locator(selector).getAttribute("content"), description);
    }
    await fi.getByRole("link", { name: /Pad thai kotona/ }).click();
    await fi.waitForFunction(() => document.title === "Pad thai kotona: mitkä ainekset tekevät siitä pad thain? | Recipavo");
    await fi.close();
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    server.kill();
  }
});
