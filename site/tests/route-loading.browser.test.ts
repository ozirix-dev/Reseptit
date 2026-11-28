import { siteTarget } from "../src/content/site-target";
import assert from "node:assert/strict";
import test from "node:test";
import type { Server } from "node:http";
import { preview } from "vite";
import path from "node:path";
import { launchBrowser } from "./launch-browser";
import { localImageServer } from "./helpers/local-image-server";
import { siteContent } from "../src/generated/content.generated";
import { localeIndexes } from "../src/content/route-data";

type Cleanup = () => Promise<void>;

async function closeResources(resources: Cleanup[], priorFailures: unknown[]) {
  const failures = [...priorFailures];
  for (const close of resources.reverse()) {
    try {
      await close();
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length === priorFailures.length) return;
  if (failures.length === 1) throw failures[0];
  throw new AggregateError(failures, "Resource cleanup failed", { cause: failures[0] });
}

async function withCleanup(run: (defer: (close: Cleanup) => void) => Promise<void>) {
  const resources: Cleanup[] = [];
  const failures: unknown[] = [];
  try {
    await run((close) => { resources.push(close); });
  } catch (error) {
    failures.push(error);
    throw error;
  } finally {
    await closeResources(resources, failures);
  }
}

type RoutePreview = { httpServer: Pick<Server, "address">; close: Cleanup };

// Bind directly to port 0: the OS selects and reserves the port in one
// operation. Do not probe a free port and then release/rebind it.
async function startRoutePreview(open: () => Promise<RoutePreview> = () => preview({
  root: path.resolve(import.meta.dirname, ".."),
  preview: { host: "127.0.0.1", port: 0, strictPort: true, open: false },
  logLevel: "silent",
})) {
  const server = await open();
  try {
    const address = server.httpServer.address();
    assert.ok(address && typeof address !== "string" && address.port > 0, "Preview must listen on an assigned port");
    assert.equal(address.address, "127.0.0.1");
    return { base: `http://127.0.0.1:${address.port}`, close: () => server.close() };
  } catch (error) {
    await closeResources([() => server.close()], [error]);
    throw error;
  }
}

test("preview startup preserves the primary error and reports cleanup failures", async () => {
  const launchFailure = new Error("preview failed to start");
  await assert.rejects(startRoutePreview(async () => { throw launchFailure; }),
    (error) => error === launchFailure);

  const closeFailure = new Error("preview failed to close");
  let closes = 0;
  await assert.rejects(startRoutePreview(async () => ({
    httpServer: { address: () => null },
    close: async () => { closes++; throw closeFailure; },
  })), (error) => {
    assert.ok(error instanceof AggregateError);
    assert.ok(error.cause instanceof assert.AssertionError);
    assert.match(error.cause.message, /Preview must listen on an assigned port/);
    assert.deepEqual(error.errors, [error.cause, closeFailure]);
    return true;
  });
  assert.equal(closes, 1);
});

test("browser cleanup closes acquired resources after launch or close fails", async () => {
  const launchFailure = new Error("browser failed to launch");
  const closed: string[] = [];
  await assert.rejects(withCleanup(async (defer) => {
    defer(async () => { closed.push("server after launch failure"); });
    throw launchFailure;
  }), (error) => error === launchFailure);
  assert.deepEqual(closed, ["server after launch failure"]);

  const testFailure = new Error("browser assertion failed");
  const closeFailure = new Error("browser failed to close");
  await assert.rejects(withCleanup(async (defer) => {
    defer(async () => { closed.push("server"); });
    defer(async () => { closed.push("browser"); throw closeFailure; });
    throw testFailure;
  }), (error) => {
    assert.ok(error instanceof AggregateError);
    assert.equal(error.cause, testFailure);
    assert.deepEqual(error.errors, [testFailure, closeFailure]);
    return true;
  });
  assert.deepEqual(closed, ["server after launch failure", "browser", "server"]);
});

test("route previews reserve distinct ports and close independently", async (t) => {
  const first = await startRoutePreview();
  t.after(() => first.close());
  const second = await startRoutePreview();
  t.after(() => second.close());
  assert.notEqual(first.base, second.base, "Simultaneously listening previews cannot share a port");
  const firstResponse = await fetch(first.base + "/");
  const secondResponse = await fetch(second.base + "/");
  assert.equal(firstResponse.status, 200);
  assert.equal(secondResponse.status, 200);
  const firstHtml = await firstResponse.text();
  assert.match(firstHtml, /id="page-content"/);
  assert.equal(await secondResponse.text(), firstHtml, "Both serve the same existing production build");
  await first.close();
  const remaining = await fetch(second.base + "/");
  assert.equal(remaining.status, 200);
  assert.equal(await remaining.text(), firstHtml);
});

test("bounded page data, navigation cache, failures, history and multilingual static HTML", async (t) => {
  const server = await startRoutePreview();
  const { base } = server;
  t.after(() => server.close());
  const browser = await launchBrowser();
  try {
    const context = await browser.newContext();
    await context.route(`${siteTarget.baseUrl}/kuvat/**`, async (route) => {
      await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const dataRequests: string[] = [];
    const searchRequests: string[] = [];
    page.on("request", request => {
      const url = request.url();
      if (url.includes("/data/search-")) searchRequests.push(url);
      else if (url.includes("/data/")) dataRequests.push(url);
    });
    const initialScripts: string[] = [];
    const recordInitialScripts = (request: import("playwright").Request) => {
      if (request.resourceType() === "script") initialScripts.push(new URL(request.url()).pathname);
    };
    page.on("request", recordInitialScripts);
    await page.goto(`${base}/`);
    await page.locator(".recipe-filters").waitFor();
    page.off("request", recordInitialScripts);
    assert.equal(await page.locator('head link[rel="stylesheet"]').count(), 0, "home CSS is inlined");
    assert.ok(await page.locator("head style").count());
    assert.ok(initialScripts.some(url => /\/index-[\w-]+\.js$/.test(url)));
    assert.equal(initialScripts.some(url => /\/(?:RecipePage|GlycemicLoadPilotPage|BlogPages|routes\.generated)-/.test(url)), false,
      "the home page loads neither other route components nor the navigation manifest");

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
      await noJs.route(`${siteTarget.baseUrl}/kuvat/**`, async (route) => {
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
    assert.equal(searchRequests.length, 0, "unfiltered browsing never downloads the search index");
    await page.goto(`${base}/?q=lohi`);
    await page.waitForFunction(() => document.querySelector<HTMLInputElement>("#recipe-search")?.value === "lohi");
    await page.locator(".recipe-card__link").first().click();
    await page.locator(".ingredient-list").waitFor();
    assert.equal(dataRequests.length, 1);
    assert.equal(searchRequests.length, 1);
    assert.match(searchRequests[0], /search-fi-/);
    await page.goBack();
    await page.waitForFunction(() => document.querySelector<HTMLInputElement>("#recipe-search")?.value === "lohi");
    const requestsBeforeTyping = dataRequests.length;
    await page.locator("#recipe-search").fill("kukkakaali");
    await page.waitForFunction(() => location.search.includes("kukkakaali"));
    assert.equal(dataRequests.length, requestsBeforeTyping);
    assert.equal(searchRequests.length, 1, "refining a search reuses the locale index");
    await page.locator(".site-language-nav a[lang=en]").click();
    await page.getByRole("searchbox", { name: "Search recipes" }).waitFor();
    assert.equal(dataRequests.length, requestsBeforeTyping + 1);
    assert.deepEqual(errors, []);

    const retry = await context.newPage();
    await retry.goto(base + "/");
    await retry.route("**/data/search-fi-*.json", route => route.fulfill({ status: 503 }));
    await retry.locator("#recipe-search").fill("lohi");
    await retry.getByRole("alert").waitFor();
    assert.equal(await retry.getByRole("alert").textContent(), "Reseptiluetteloa ei voitu ladata.");
    await retry.unroute("**/data/search-fi-*.json");
    await retry.getByRole("button", { name: "Yritä uudelleen" }).click();
    await retry.locator(".recipe-card__link").first().waitFor();
    await retry.close();

    // A failed JSON fetch must expose a retry link, never replace the page with blank output.
    for (const body of ["missing", "not-json", '{"path":"/sv/recept/"}']) {
      const failing = await context.newPage();
      await failing.goto(`${base}/`);
      await failing.locator(".recipe-filters").waitFor();
      await failing.route("**/data/*.json", (route) => route.fulfill({ status: body === "missing" ? 404 : 200, contentType: "application/json", body }));
      await failing.locator(".site-language-nav a[lang=sv]").click();
      await failing.getByRole("heading", { name: "Sidan kunde inte laddas" }).waitFor();
      assert.equal(await failing.getByRole("link", { name: "Försök igen" }).getAttribute("href"), "/sv/recept/");
      await failing.close();
    }
    const initialFailure = await context.newPage();
    const englishHome = `${base}/en/recipes/`;
    await initialFailure.route(englishHome, async route => {
      const response = await route.fetch();
      const html = (await response.text()).replace(/(<script\b[^>]*id="page-content"[^>]*>)[\s\S]*?(<\/script>)/, "$1{$2");
      await route.fulfill({ response, body: html });
    }, { times: 1 });
    await initialFailure.goto(englishHome);
    const reload = initialFailure.getByRole("link", { name: "Try again" });
    await reload.waitFor();
    assert.ok(await initialFailure.locator(".recipe-card__link").count() > 0);
    assert.equal(await initialFailure.locator(".recipe-filters--placeholder").count(), 1);
    await reload.click();
    await initialFailure.getByRole("searchbox", { name: "Search recipes" }).waitFor();
    await initialFailure.close();

    await context.close();
  } finally {
    await browser.close();
  }
});

test("mobile entry waits for the critical image and resumes on image failure or interaction", async () => {
  await withCleanup(async (defer) => {
    const server = await localImageServer("dist");
    defer(() => server.close());
    const browser = await launchBrowser();
    defer(() => browser.close());
    for (const action of ["load", "error", "interaction"] as const) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
      const page = await context.newPage();
      const avif = /\/kuvat\/_variants\/[\w-]+-720w\.avif$/;
      const entry = /\/assets\/index-[\w-]+\.js$/;
      let finishImage!: (result: "load" | "error") => void;
      const image = new Promise<"load" | "error">((resolve) => { finishImage = resolve; });
      await page.route(avif, async (route) => {
        if (await image === "load") await route.continue();
        else await route.abort();
      });
      try {
        await page.clock.install();
        const requested = page.waitForRequest(avif);
        let started = false;
        page.on("request", request => { if (entry.test(request.url())) started = true; });
        await page.goto(server.base + "/kermainen-lohipata/", { waitUntil: "domcontentloaded" });
        await requested;
        assert.equal(started, false, "the AVIF request starts before the entry module");
        assert.equal(await page.locator("h1").textContent(), "Kermainen lohipata");
        const entryRequest = page.waitForRequest(entry);
        if (action === "interaction") await page.keyboard.press("Tab");
        else finishImage(action);
        await entryRequest;
        await page.locator(".serving-control button").first().waitFor();
        if (action === "error") {
          await page.waitForFunction(() => {
            const img = document.querySelector<HTMLImageElement>(".recipe-image");
            return img?.complete && img.naturalWidth > 0 && img.currentSrc.endsWith("-720w.webp");
          });
        }
      } finally {
        finishImage("load");
        await context.close();
      }
    }
  });
});

test("English mobile library gives the decoded first image a rendering opportunity", async () => {
  await withCleanup(async (defer) => {
    const server = await localImageServer("dist");
    defer(() => server.close());
    const browser = await launchBrowser();
    defer(() => browser.close());
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const decode = HTMLImageElement.prototype.decode;
      HTMLImageElement.prototype.decode = function () {
        if (!this.matches(".recipe-card:first-child img")) return decode.call(this);
        document.documentElement.dataset.testDecoding = "pending";
        return new Promise<void>((resolve, reject) => {
          window.addEventListener("test-release-card-decode", () => {
            void decode.call(this).then(resolve, reject);
          }, { once: true });
        });
      };
    });
    const entry = /\/assets\/index-[\w-]+\.js$/;
    let started = false;
    page.on("request", (request) => { if (entry.test(request.url())) started = true; });
    await page.goto(server.base + "/en/recipes/all/", { waitUntil: "domcontentloaded" });
    await page.locator('html[data-test-decoding="pending"]').waitFor();
    assert.equal(started, false, "the entry waits while the loaded first image is decoding");
    assert.equal(await page.locator("h1").textContent(), "Recipe library");
    const entryResponse = page.waitForResponse(entry);
    await page.evaluate(() => window.dispatchEvent(new Event("test-release-card-decode")));
    assert.equal((await entryResponse).ok(), true);
    await context.close();
  });
});
