import { resolveSiteTarget, siteTarget } from "../src/content/site-target";
import { privacyCopy } from "../src/features/privacy/privacy-copy";
import { build } from "vite";
import react from "@vitejs/plugin-react";
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
      // UX-002-001: clearing or resetting a focused, disappearing button
      // must return focus to the persistent search input in every language.
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(base + index);
        const search = page.locator("#recipe-search");
        await search.fill(recipe.title);
        const clear = page.locator(".recipe-search-field__clear");
        await clear.focus();
        await page.keyboard.press(width === 390 ? "Space" : "Enter");
        await clear.waitFor({ state: "detached" });
        await page.waitForFunction(() => {
          const input = document.querySelector<HTMLInputElement>("#recipe-search");
          return input === document.activeElement && input?.value === "" &&
            !new URL(location.href).searchParams.has("q");
        });
        await page.keyboard.press("Tab");
        assert.equal(await page.locator("#recipe-category").evaluate(node => node === document.activeElement), true,
          `${locale} ${width}: Tab after clear`);
        await page.keyboard.press("Shift+Tab");
        assert.equal(await search.evaluate(node => node === document.activeElement), true,
          `${locale} ${width}: Shift+Tab after clear`);
      }
      await page.locator("#recipe-search").fill("recipavo-ux-no-match-79b42");
      const emptyReset = page.locator(".recipe-empty-state .recipe-filter-reset");
      await emptyReset.focus();
      await page.keyboard.press("Enter");
      await emptyReset.waitFor({ state: "detached" });
      await page.waitForFunction(() => {
        const input = document.querySelector<HTMLInputElement>("#recipe-search");
        return input === document.activeElement && input?.value === "" && !location.search;
      });

      // Reset a filter-only result set by pointer, and retain the category
      // when only the query is cleared.
      const category = page.locator("#recipe-category");
      await category.selectOption("paaruoka");
      const visibleReset = page.locator(".recipe-filters .recipe-filter-reset");
      await visibleReset.waitFor();
      await page.locator("#recipe-search").fill(recipe.title);
      await page.locator(".recipe-search-field__clear").click();
      await page.waitForFunction(() => {
        const input = document.querySelector<HTMLInputElement>("#recipe-search");
        const params = new URL(location.href).searchParams;
        return input === document.activeElement && input?.value === "" &&
          !params.has("q") && params.get("category") === "paaruoka";
      });
      await visibleReset.click();
      await visibleReset.waitFor({ state: "detached" });
      await page.waitForFunction(() => document.activeElement?.id === "recipe-search" && !location.search);
      assert.equal(await category.inputValue(), "all", `${locale}: category reset`);
      assert.equal(await page.locator("#main").getAttribute("tabindex"), "-1", `${locale}: stable focus destination`);

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


// UX-002-002: the production-only consent prompt must be exercised even
// when the ordinary CI site build is a preview target. Bundle the real
// component and stylesheet, using an isolated synthetic page and intercept
// every request. No production network traffic or consent data is sent.
test("production consent prompt does not cover keyboard focus and restores it on choice", async () => {
  const production = resolveSiteTarget(undefined, "production");
  const entry = "virtual:recipavo-consent-regression";
  const resolved = "\0" + entry;
  const fixture = `
import { createElement as h } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AnalyticsPrompt } from "@/features/privacy/Privacy";
import "@/styles.css";
const locale = new URLSearchParams(location.search).get("locale") || "fi";
const buttons = Array.from({ length: 36 }, (_, index) =>
  h("button", { key: index, type: "button", style: { minHeight: "44px" } }, String(index + 1)));
createRoot(document.getElementById("fixture")).render(
  h(BrowserRouter, null, h("div", { className: "site-shell" },
    h("header", { className: "site-header" },
      h("div", { className: "container site-header__inner" }, h("a", { href: "#main" }, "Header"))),
    h(AnalyticsPrompt, { locale }),
    h("main", { id: "main", className: "container site-main", tabIndex: -1 },
      h("h1", null, "Recipe"), h("div", { style: { display: "grid", gap: "1rem" } }, buttons))
  )));
`;
  const result = await build({
    configFile: false,
    root: process.cwd(),
    logLevel: "error",
    plugins: [react(), {
      name: "recipavo-consent-regression",
      resolveId(id) { if (id === entry) return resolved; },
      load(id) { if (id === resolved) return fixture; },
    }],
    define: { __RECIPE_SITE_TARGET__: JSON.stringify(production) },
    resolve: { alias: { "@": path.resolve("src") } },
    build: {
      write: false,
      cssCodeSplit: false,
      rollupOptions: { input: entry },
    },
  });
  const files = new Map<string, { body: string | Buffer; contentType: string }>();
  const styles: string[] = [];
  let script = "";
  for (const part of Array.isArray(result) ? result : [result]) {
    assert.ok("output" in part, "expected an in-memory fixture build");
    for (const item of part.output) {
      const name = "/" + item.fileName;
      if (item.type === "chunk") {
        files.set(name, { body: item.code, contentType: "text/javascript" });
        if (item.isEntry) script = name;
      } else if (item.fileName.endsWith(".css")) {
        styles.push(name);
        files.set(name, { body: typeof item.source === "string" ? item.source : Buffer.from(item.source), contentType: "text/css" });
      }
    }
  }
  assert.ok(script && styles.length > 0, "fixture includes real JS and CSS");
  const browser = await launchBrowser();
  try {
    for (const locale of Object.keys(localeIndexes) as Array<keyof typeof localeIndexes>) {
      for (const width of [320, 360, 390, 430, 768, 1024, 1440, 1920]) {
        const context = await browser.newContext({
          viewport: { width, height: 844 },
          reducedMotion: "reduce",
          serviceWorkers: "block",
        });
        const sends: string[] = [];
        try {
          await context.route("**/*", async route => {
            const request = route.request();
            const url = new URL(request.url());
            if (url.origin === "https://plausible.io" && url.pathname === "/api/event" && request.method() === "POST") {
              sends.push(request.postData() ?? "");
              await route.fulfill({ status: 204, headers: { "access-control-allow-origin": production.baseUrl } });
              return;
            }
            if (url.origin !== production.baseUrl || request.method() !== "GET") {
              await route.abort();
              return;
            }
            if (url.pathname === "/") {
              await route.fulfill({ contentType: "text/html", body:
                '<!doctype html><html lang="' + locale + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="canonical" href="' + production.baseUrl + '/">' +
                styles.map(href => '<link rel="stylesheet" href="' + href + '">').join("") +
                '</head><body><div id="fixture"></div><script type="module" src="' + script + '"></script></body></html>' });
              return;
            }
            const file = files.get(url.pathname);
            if (file) await route.fulfill(file);
            else await route.fulfill({ status: 404 });
          });
          const page = await context.newPage();
          await page.goto(production.baseUrl + "/?locale=" + locale);
          const prompt = page.locator(".analytics-prompt .privacy-choice");
          await prompt.waitFor();
          assert.equal(await page.evaluate(() => {
            const banner = document.querySelector(".analytics-prompt .privacy-choice")!;
            const rect = banner.getBoundingClientRect();
            const main = document.querySelector("#main")!.getBoundingClientRect();
            return rect.bottom <= main.top + 0.5 && document.documentElement.scrollWidth <= innerWidth;
          }), true, `${locale} ${width}: prompt stays above content without overflow`);
          for (const key of ["Tab", "Shift+Tab"]) {
            for (let step = 0; step < 30; step++) {
              await page.keyboard.press(key);
              const covered = await page.evaluate(() => {
                const banner = document.querySelector(".analytics-prompt .privacy-choice");
                const focused = document.activeElement;
                if (!banner || !focused || focused === document.body || banner.contains(focused)) return false;
                const b = banner.getBoundingClientRect(), f = focused.getBoundingClientRect();
                return f.width > 0 && f.height > 0 && f.left >= b.left && f.right <= b.right &&
                  f.top >= b.top && f.bottom <= b.bottom;
              });
              assert.equal(covered, false, `${locale} ${width} ${key} step ${step + 1}`);
            }
          }
          assert.equal(sends.length, 0, "no analytics before explicit consent");
          const grant = width === 390;
          const button = prompt.getByRole("button", { name: grant ? privacyCopy[locale].allow : privacyCopy[locale].deny, exact: true });
          await button.focus();
          const sent = grant ? page.waitForRequest(request => request.url() === "https://plausible.io/api/event" && request.method() === "POST") : null;
          await page.keyboard.press(grant ? "Space" : "Enter");
          await prompt.waitFor({ state: "detached" });
          assert.equal(await page.evaluate(() => document.activeElement?.id), "main", `${locale} ${width}: choice focus`);
          assert.match(await page.evaluate(() => localStorage.getItem("recipavo-analytics-choice") ?? ""), grant ? /^granted:\d+$/ : /^denied:\d+$/);
          if (sent) {
            const request = await sent;
            assert.deepEqual(request.postDataJSON(), { domain: "recipavo.com", name: "pageview", url: production.baseUrl + "/" });
          } else assert.equal(sends.length, 0, "denied consent sends nothing");
          await page.keyboard.press("Tab");
          assert.equal(await page.locator("#main button").first().evaluate(node => node === document.activeElement), true,
            `${locale} ${width}: Tab continues into content`);
          await page.reload();
          await page.locator("#main button").first().waitFor();
          assert.equal(await prompt.count(), 0, "persisted choice does not show prompt again");
          if (!grant) assert.equal(sends.length, 0, "persisted denial sends nothing");
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
});
