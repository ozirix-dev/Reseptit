import { siteTarget } from "../src/content/site-target";
import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import path from "node:path";
import { launchBrowser } from "./launch-browser";
import { siteContent } from "../src/generated/content.generated";
const localeIndexes = { fi: "/", en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" };

test("multilingual content, image loading, responsive layout and JavaScript-free HTML", async () => {
  const base = "http://127.0.0.1:4175";
  const server = spawn(process.execPath, [path.resolve("node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", "4175", "--strictPort"], { stdio: "pipe" });
  let output = "";
  server.stdout.on("data", (data) => { output += data; });
  server.stderr.on("data", (data) => { output += data; });
  const browser = await launchBrowser();
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
    await context.route(`${siteTarget.baseUrl}/kuvat/**`, async (route) => {
      await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    for (const [locale, index] of Object.entries(localeIndexes)) {
      const recipe = siteContent.recipes.find((r) => r.locale === locale)!;
      for (const route of [index, recipe.routePath]) {
        await page.goto(`${base}${route}`);
        await page.locator(route === index ? ".recipe-filters" : ".serving-control button").first().waitFor();
        for (const width of [320, 375, 390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${route} ${width}`);
          if (route !== index) {
            const buttons = await page.locator(".serving-control button").evaluateAll(nodes => nodes.map(node => {
              const { width, height, y } = node.getBoundingClientRect();
              return { width, height, y };
            }));
            assert.equal(buttons.length, 2, `${route} ${width}: serving controls`);
            assert.ok(buttons.every(box => box.width >= 44 && box.height >= 44), `${route} ${width}: 44px buttons`);
            assert.ok(Math.abs(buttons[0]!.y - buttons[1]!.y) <= 1, `${route} ${width}: buttons on one row`);
          }
          if (route === index && width === 390) {
            await page.waitForFunction(() =>
              document.querySelector<HTMLDetailsElement>(".site-primary-menu")?.open === false &&
              document.querySelector<HTMLDetailsElement>(".site-language-menu")?.open === false);
            const primary = page.locator(".site-primary-menu > summary");
            const languages = page.locator(".site-language-menu > summary");
            await primary.click();
            assert.ok(await page.locator(".site-primary-nav").isVisible());
            await languages.press("Enter");
            assert.equal(await page.locator(".site-primary-menu").evaluate((node: HTMLDetailsElement) => node.open), false);
            assert.ok(await page.locator(".site-language-nav").isVisible());
            await primary.click();
            assert.equal(await page.locator(".site-language-menu").evaluate((node: HTMLDetailsElement) => node.open), false);
            assert.ok(await page.locator(".site-primary-nav").isVisible());
            await primary.press("Enter");
            assert.equal(await page.locator(".site-primary-menu").evaluate((node: HTMLDetailsElement) => node.open), false);
          }
        }
        assert.equal(await page.locator("img").first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0), true);
      }
      const noJs = await browser.newPage({ javaScriptEnabled: false });
      await noJs.route(`${siteTarget.baseUrl}/kuvat/**`, async (route) => {
        await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
      });
      await noJs.goto(`${base}${index}`);
      for (const width of [320, 390, 700]) {
        await noJs.setViewportSize({ width, height: 900 });
        assert.ok(await noJs.locator(".site-primary-nav").isVisible());
        assert.ok(await noJs.locator(".site-language-nav").isVisible());
        const primary = await noJs.locator(".site-primary-nav").boundingBox();
        const languages = await noJs.locator(".site-language-nav").boundingBox();
        assert.ok(primary && languages, `${index} ${width}: both SSR menus`);
        assert.ok(primary.x + primary.width <= languages.x + 1 ||
          languages.x + languages.width <= primary.x + 1 ||
          primary.y + primary.height <= languages.y + 1 ||
          languages.y + languages.height <= primary.y + 1, `${index} ${width}: no menu overlap`);
        assert.ok([primary, languages].every(box => box.x >= -1 && box.x + box.width <= width + 1),
          `${index} ${width}: menus in viewport`);
      }
      const guideLink = noJs.locator('.site-primary-nav a[href="/ruokaopas/"]');
      assert.equal(await guideLink.getAttribute("lang"), null);
      assert.equal(await guideLink.getAttribute("hreflang"), "fi");
      assert.equal(await noJs.locator("form").count(), 0);
      assert.ok(await noJs.locator(".recipe-card__link").count() > 0);
      await noJs.locator(".recipe-card__link").first().click();
      assert.ok(await noJs.locator(".ingredient-list li").count() > 0);
      assert.ok(await noJs.locator(".rich-text").count() > 0);
      await noJs.close();
    }
    assert.deepEqual(errors, []);
    await context.close();
  } finally {
    await browser.close();
    server.kill();
  }
});
