import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { launchBrowser } from "./launch-browser";
import { recipavoHeroCopy } from "../src/features/recipes/recipavo-hero";
import { siteContent } from "../src/generated/content.generated";

const base = "http://127.0.0.1:4181/Reseptit";
const indexes = { fi: "/", en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" } as const;

test("preview HTML stays noindex after React hydration and keeps every locale reachable", async () => {
  assert.equal(process.env.VITE_RECIPAVO_HERO_PREVIEW, "true", "Build and test must use the explicit preview flag");
  const homePicksExpected = existsSync(path.resolve("src/features/recipes/home-preview.ts"));
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
      assert.match(await noJs.locator('meta[name="robots"]').getAttribute("content") ?? "", /noindex\s*,\s*nofollow/);
      assert.equal(await noJs.locator('link[rel="canonical"]').count(), 1);
      if (homePicksExpected) {
        assert.equal(await noJs.locator(".home-preview__picks > .recipe-card-grid .recipe-card").count(), 9, locale);
        const detail = noJs.locator(".home-preview__more");
        assert.equal(await detail.count(), 1, locale);
        await detail.locator("summary").click();
        assert.equal(await detail.getAttribute("open"), "", locale);
        const rows = await noJs.locator(".home-preview__picks .recipe-card").count();
        const published = siteContent.recipes.filter((recipe) => recipe.locale === locale).length;
        assert.equal(rows, published, locale);
      }
      await noJs.close();

      const page = await browser.newPage({ viewport: { width: { fi: 320, en: 390, sv: 768, th: 1440 }[locale], height: 850 } });
      page.on("pageerror", (error) => errors.push(`${locale}: ${error.message}`));
      await page.goto(base + route);
      await page.locator("#recipe-search").waitFor();
      await page.waitForFunction(
        (title) => document.title === title && /noindex\s*,\s*nofollow/.test(document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? ""),
        `${recipavoHeroCopy[locale].title} | Recipavo`,
      );
      assert.equal(await page.locator("h1").textContent(), recipavoHeroCopy[locale].title);
      assert.equal(await page.locator("html").getAttribute("lang"), locale);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}: horizontal overflow`);
      if (homePicksExpected) {
        assert.equal(await page.locator(".home-preview__picks > .recipe-card-grid .recipe-card").count(), 9, locale);
        assert.ok(await page.locator(".home-preview__topic-list a").count() >= 4, locale);
        await page.locator(".home-preview__topic-list a").first().click();
        await page.waitForFunction(() => !document.querySelector(".home-preview__picks") && !!document.querySelector(".recipe-result-count"));
        assert.ok(page.url().includes("category=") || page.url().includes("diet="), `${locale}: topic filtering`);
      }
      await page.close();
    }
    const fi = await browser.newPage();
    fi.on("pageerror", (error) => errors.push(`FI blog: ${error.message}`));
    await fi.goto(base + "/ruokaopas/");
    await fi.waitForFunction(() => /noindex\s*,\s*nofollow/.test(document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? ""));
    assert.ok(await fi.getByRole("heading", { name: "Ruokaopas", exact: true }).count());
    await fi.close();
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    server.kill();
  }
});
