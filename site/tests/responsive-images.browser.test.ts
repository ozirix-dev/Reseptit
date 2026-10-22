import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { localImageServer } from "./helpers/local-image-server";

// Can also record the frozen baseline via IMAGE_TEST_ROOT/IMAGE_TEST_PHASE.
test("fresh browser contexts choose correctly sized local images without duplicate loads", async () => {
  const phase = process.env.IMAGE_TEST_PHASE ?? "after";
  const server = await localImageServer(process.env.IMAGE_TEST_ROOT ?? "dist");
  const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
  const rows: unknown[] = [];
  try {
    for (const width of [320, 375, 390, 768, 1024, 1440]) for (const dpr of [1, 2, 3]) {
      for (const route of ["/", "/kermainen-lohipata/", "/en/recipes/"]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: dpr });
        const page = await context.newPage();
        const requests: string[] = [], errors: string[] = [];
        page.on("request", (req) => { if (req.resourceType() === "image") requests.push(req.url()); });
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
        page.on("response", (res) => { if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`); });
        await page.goto(server.base + route);
        await page.locator(route.endsWith("lohipata/") ? ".serving-control button" : ".recipe-filters").first().waitFor();
        await page.locator("img").first().evaluate(async (image: HTMLImageElement) => { await image.decode(); });
        const result = await page.locator("img").first().evaluate((image: HTMLImageElement) => {
          const slot = image.sizes.split(", ").find((part) => !part.startsWith("(") || matchMedia(part.slice(0, part.indexOf(")") + 1)).matches) ?? "";
          const size = slot.startsWith("(") ? slot.slice(slot.indexOf(")") + 2) : slot;
          const probe = document.createElement("div"); probe.style.width = size; document.body.append(probe);
          const declaredWidth = probe.getBoundingClientRect().width; probe.remove();
          return { src: image.src, srcSet: image.srcset, sizes: image.sizes, currentSrc: image.currentSrc, naturalWidth: image.naturalWidth,
            renderedWidth: image.getBoundingClientRect().width, declaredWidth, dpr: devicePixelRatio, complete: image.complete,
            overflow: document.documentElement.scrollWidth > innerWidth,
            resources: performance.getEntriesByType("resource").map((entry) => ({ url: entry.name, bytes: (entry as PerformanceResourceTiming).transferSize })) };
        });
        assert.ok(result.complete && result.naturalWidth > 0);
        assert.equal(result.overflow, false);
        assert.deepEqual(errors, []);
        assert.ok(requests.every((url) => url.startsWith(server.base)), "all images must come from this local build");
        if (phase !== "before") {
          assert.ok(Math.abs(result.renderedWidth - result.declaredWidth) < 1, `sizes matches CSS: ${width} ${route}`);
          const candidates = result.srcSet.split(", ").map((part) => part.split(" ")[0]);
          assert.ok(candidates.includes(result.currentSrc));
          assert.equal(requests.filter((url) => candidates.includes(url)).length, 1, `no fallback/preload double fetch ${width}/${dpr}/${route}`);
          if (dpr === 1 && width <= 390) assert.match(result.currentSrc, /480w\.webp$/);
          if (route === "/") {
            assert.equal(await page.locator('.recipe-card img[loading="eager"]').count(), 1);
            assert.equal(await page.locator('.recipe-card img[fetchpriority="high"]').count(), 1);
          }
        }
        rows.push({ phase, width, route, ...result, requests });
        if (phase === "after" && route !== "/en/recipes/" && ((width === 390 && dpr === 2) || (width === 1440 && dpr === 1))) {
          const screenshots = path.resolve("../tmp/v15/screenshots"); await mkdir(screenshots, { recursive: true });
          await page.screenshot({ path: path.join(screenshots, `${route === "/" ? "index" : "hero"}-${width}.png`) });
        }
        await context.close();
      }
    }
    // Real no-JS navigation must load variants too, from this build only.
    const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noJs.goto(server.base + "/");
    assert.equal(await noJs.locator("form").count(), 0);
    const image = await noJs.locator("img").first().getAttribute("srcset");
    if (phase !== "before") assert.match(image!, /_variants/);
    await noJs.locator(".recipe-card__link").first().click();
    assert.ok(await noJs.locator(".ingredient-list li").count());
    await noJs.close();
  } finally {
    await browser.close(); await server.close();
    const output = path.resolve("../tmp/v15"); await mkdir(output, { recursive: true });
    await writeFile(path.join(output, `browser-${phase}.json`), JSON.stringify(rows, null, 2));
  }
});
