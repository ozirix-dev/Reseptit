import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import path from "node:path";
import { chromium } from "playwright";
import { siteContent } from "../src/generated/content.generated";
import { localeIndexes } from "../src/content/route-data";

test("bounded page data, navigation cache, failures, history and multilingual static HTML", async () => {
  const base = "http://127.0.0.1:4175/Reseptit";
  const server = spawn(process.execPath, [path.resolve("node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4175", "--strictPort"], { stdio: "pipe" });
  let output = "";
  server.stdout.on("data", (data) => { output += data; });
  server.stderr.on("data", (data) => { output += data; });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (server.exitCode !== null) throw Error(`Preview exited: ${output}`);
      try { ready = (await fetch(`${base}/`)).ok; } catch { /* startup */ }
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.ok(ready, output);
    const context = await browser.newContext();
    await context.route("https://ozirix-dev.github.io/Reseptit/kuvat/**", async (route) => {
      await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const dataRequests: string[] = [];
    page.on("request", (request) => { if (request.url().includes("/data/")) dataRequests.push(request.url()); });
    for (const [locale, index] of Object.entries(localeIndexes)) {
      const recipe = siteContent.recipes.find((r) => r.locale === locale)!;
      for (const route of [index, recipe.routePath]) {
        await page.goto(`${base}${route}`);
        await page.locator(route === index ? ".recipe-filters" : ".serving-control button").first().waitFor();
        const initial = await page.locator("#page-content").textContent();
        assert.ok(initial);
        const payload = JSON.parse(initial);
        assert.equal(payload.recipe?.locale ?? payload.recipes[0].locale, locale);
        assert.equal(payload.recipes.some((r: Record<string, unknown>) => "instructionsHtml" in r), false);
        for (const width of [320, 375, 390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${route} ${width}`);
        }
        assert.equal(await page.locator("img").first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), true);
      }
      const noJs = await browser.newPage({ javaScriptEnabled: false });
      await noJs.route("https://ozirix-dev.github.io/Reseptit/kuvat/**", async (route) => {
        await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
      });
      await noJs.goto(`${base}${index}`);
      assert.equal(await noJs.locator("form").count(), 0);
      assert.ok(await noJs.locator(".recipe-card__link").count() > 0);
      await noJs.locator(".recipe-card__link").first().click();
      assert.ok(await noJs.locator(".ingredient-list li").count() > 0);
      assert.ok(await noJs.locator(".rich-text").count() > 0);
      await noJs.close();
    }
    assert.equal(dataRequests.length, 0, "direct routes hydrate embedded data without a JSON waterfall");
    await page.goto(`${base}/?q=lohi`);
    await page.waitForFunction(() => document.querySelector<HTMLInputElement>("#recipe-search")?.value === "lohi");
    await page.locator(".recipe-card__link").first().click();
    await page.locator(".ingredient-list").waitFor();
    assert.equal(dataRequests.length, 1);
    await page.goBack();
    await page.waitForFunction(() => document.querySelector<HTMLInputElement>("#recipe-search")?.value === "lohi");
    const requestsBeforeTyping = dataRequests.length;
    await page.locator("#recipe-search").fill("kukkakaali");
    await page.waitForFunction(() => location.search.includes("kukkakaali"));
    assert.equal(dataRequests.length, requestsBeforeTyping);
    await page.locator(".site-nav a[lang=en]").click();
    await page.getByRole("searchbox", { name: "Search recipes" }).waitFor();
    assert.equal(dataRequests.length, requestsBeforeTyping + 1);
    assert.deepEqual(errors, []);

    // A failed JSON fetch must expose a retry link, never replace the page with blank output.
    for (const body of ["missing", "not-json", '{"path":"/sv/recept/"}']) {
      const failing = await context.newPage();
      await failing.goto(`${base}/`);
      await failing.locator(".recipe-filters").waitFor();
      await failing.route("**/data/*.json", (route) => route.fulfill({ status: body === "missing" ? 404 : 200, contentType: "application/json", body }));
      await failing.locator(".site-nav a[lang=sv]").click();
      await failing.getByRole("heading", { name: "Sidan kunde inte laddas" }).waitFor();
      assert.equal(await failing.getByRole("link", { name: "Försök igen" }).getAttribute("href"), "/Reseptit/sv/recept/");
      await failing.close();
    }
    await context.close();
  } finally {
    await browser.close();
    server.kill();
  }
});
