import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { launchBrowser } from "./launch-browser";
import { localImageServer } from "./helpers/local-image-server";
import { siteContent } from "../src/generated/content.generated";
import type { Locator } from "playwright";

// Can also record the frozen baseline via IMAGE_TEST_ROOT/IMAGE_TEST_PHASE.
test("fresh browser contexts choose correctly sized local images without duplicate loads", async () => {
  const phase = process.env.IMAGE_TEST_PHASE ?? "after";
  const server = await localImageServer(process.env.IMAGE_TEST_ROOT ?? "dist");
  const browser = await launchBrowser();
  const rows: unknown[] = [];
  try {
    for (const width of [320, 375, 390, 412, 768, 1024, 1440]) for (const dpr of [1, 2, 3]) {
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
          const avifSrc = image.closest("picture")?.querySelector('source[type="image/avif"]')?.getAttribute("srcset") ?? null;
          return { src: image.src, srcSet: image.srcset, avifSrc, sizes: image.sizes, currentSrc: image.currentSrc, naturalWidth: image.naturalWidth,
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
          if (result.avifSrc) candidates.push(result.avifSrc);
          assert.ok(candidates.includes(result.currentSrc));
          assert.equal(requests.filter((url) => candidates.includes(url)).length, 1, `no fallback/preload double fetch ${width}/${dpr}/${route}`);
          if (dpr === 1 && width <= 390) assert.match(result.currentSrc, /480w\.webp$/);
          if (route === "/") {
            if (process.env.VITE_RECIPAVO_HERO_PREVIEW === "true" && (width === 390 || width === 412)) {
              if (dpr === 2) {
                assert.ok(result.avifSrc, "the first home pick has an AVIF source");
                assert.equal(result.currentSrc, result.avifSrc);
              }
              if (dpr === 3) {
                const selectedWidth = Number(result.srcSet.split(", ")
                  .find((candidate) => candidate.startsWith(result.currentSrc + " "))?.split(" ").at(-1)?.slice(0, -1));
                assert.ok(selectedWidth >= result.renderedWidth * dpr, "3x gets a full-density image");
              }
            }
            assert.equal(await page.locator('.recipe-card img[loading="eager"]').count(), result.avifSrc ? 0 : 1);
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

// WP-04: preserve the audited card/hero geometry and image metadata on the
// exact sample of published recipes. Visual recognizability and semantic
// accuracy of the alt text remain editorial checks, not pixel assertions.
test("WP-04 audited recipe images retain card framing and accessible metadata", {
  skip: process.env.IMAGE_TEST_PHASE === "before",
}, async t => {
  const sample = [
    "perinteinen-vaniljakastike", "suolasienisalaatti-sipulilla",
    "lasimestarin-silli", "savupororullat-kantarelleilla",
    "kylmasavulohilettukakku", "nokkosletut-puolukoilla", "pienet-kantarellipiiraat",
    "punajuuricarpaccio-vuohenjuustolla", "sillikaviaari-ruisnapeilla",
    "uunissa-paistetut-silakkarullat", "pina-colada-hedelmajaatelo",
    "kinkkukiusaus", "liha-perunasoselaatikko", "suppilovahverokeitto", "kesakeitto",
  ];
  const server = await localImageServer(process.env.IMAGE_TEST_ROOT ?? "dist");
  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined;
  let completed = 0;
  try {
    browser = await launchBrowser();
    async function measure(locator: Locator, label: string, card: boolean) {
      await locator.waitFor({ state: "visible" });
      await locator.scrollIntoViewIfNeeded();
      const result = await locator.evaluate(async (node: HTMLImageElement) => {
        await node.decode();
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        const candidates = node.srcset.split(",").map(part => part.trim().split(/\s+/u)[0]).filter(Boolean);
        const avif = node.closest("picture")?.querySelector('source[type="image/avif"]')?.getAttribute("srcset");
        if (avif) candidates.push(...avif.split(",").map(part => part.trim().split(/\s+/u)[0]).filter(Boolean));
        return {
          complete: node.complete, naturalWidth: node.naturalWidth, naturalHeight: node.naturalHeight,
          width: rect.width, height: rect.height, left: rect.left, right: rect.right,
          viewport: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
          sourceWidth: Number(node.getAttribute("width")), sourceHeight: Number(node.getAttribute("height")),
          src: node.src, currentSrc: node.currentSrc, candidates,
          alt: node.getAttribute("alt"), fit: style.objectFit, position: style.objectPosition,
        };
      });
      assert.ok(result.complete && result.naturalWidth > 0 && result.naturalHeight > 0, label + ": decoded");
      assert.ok(result.alt?.trim(), label + ": meaningful metadata present (editorial accuracy reviewed separately)");
      assert.ok(result.width > 0 && result.height > 0, label + ": nonzero dimensions");
      assert.ok(result.left >= -1 && result.right <= result.viewport + 1 && result.scrollWidth <= result.viewport + 1,
        label + ": no horizontal overflow");
      assert.ok(result.sourceWidth > 0 && result.sourceHeight > 0, label + ": reserved intrinsic dimensions");
      assert.ok(Math.abs(result.naturalWidth / result.naturalHeight - result.sourceWidth / result.sourceHeight) < 0.03,
        label + ": responsive variant preserves aspect ratio");
      assert.equal(new URL(result.src).origin, server.base, label + ": local source");
      assert.equal(new URL(result.currentSrc).origin, server.base, label + ": local variant");
      assert.ok(result.candidates.length > 0 && result.candidates.includes(result.currentSrc), label + ": candidate from declared srcset");
      assert.equal(result.fit, "cover", label + ": existing fit");
      assert.equal(result.position, "50% 50%", label + ": existing centered crop");
      if (card) assert.ok(Math.abs(result.width / result.height - 1.6) < 0.015, label + ": 16:10 card");
      return result;
    }
    for (const width of [320, 390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 }, deviceScaleFactor: 1,
        reducedMotion: "reduce", serviceWorkers: "block",
      });
      try {
        // Do not allow an old deployed image or any external POST to satisfy a test.
        await context.route("**/*", route => new URL(route.request().url()).origin === server.base &&
          route.request().method() === "GET" ? route.continue() : route.abort());
        const page = await context.newPage();
        const errors: string[] = [];
        page.on("pageerror", error => errors.push(error.message));
        for (const id of width === 390 ? sample : sample.slice(0, 4)) {
          const recipe = siteContent.recipes.find(row => row.locale === "fi" && row.recipeId === id);
          assert.ok(recipe?.image, id + ": audited published recipe and image");
          const label = id + "/" + width;
          const indexResponse = await page.goto(server.base + "/?q=" + encodeURIComponent(recipe.title));
          assert.ok(indexResponse?.ok(), label + ": index response");
          await page.locator("#recipe-search").waitFor();
          const card = page.locator('.recipe-card__link[href="' + recipe.routePath + '"] .recipe-card__image');
          const cardResult = await measure(card, label + ": card", true);
          const detailResponse = await page.goto(server.base + recipe.routePath);
          assert.ok(detailResponse?.ok(), label + ": detail response");
          const heroResult = await measure(page.locator("img.recipe-image"), label + ": hero", false);
          assert.equal(cardResult.alt, recipe.image.alt, label + ": card source alt");
          assert.equal(heroResult.alt, recipe.image.alt, label + ": hero source alt");
          assert.equal(cardResult.src, heroResult.src, label + ": same underlying source");
          assert.equal(cardResult.sourceWidth, heroResult.sourceWidth, label + ": consistent source width");
          assert.equal(cardResult.sourceHeight, heroResult.sourceHeight, label + ": consistent source height");
          completed++;
          t.diagnostic("WP-04 pair " + JSON.stringify({ id, width, card: [cardResult.width, cardResult.height],
            hero: [heroResult.width, heroResult.height], intrinsic: [heroResult.sourceWidth, heroResult.sourceHeight],
            alt: heroResult.alt, cardSource: new URL(cardResult.currentSrc).pathname, heroSource: new URL(heroResult.currentSrc).pathname }));
        }
        assert.deepEqual(errors, [], "no page errors at width " + width);
      } finally {
        await context.close();
      }
    }
    assert.equal(completed, 23);
    t.diagnostic("WP-04 summary " + JSON.stringify({ pairs: completed, images: completed * 2, status: "PASS" }));
  } finally {
    try { await browser?.close(); } finally { await server.close(); }
  }
});
