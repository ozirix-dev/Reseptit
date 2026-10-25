import "./content-layout.browser.test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import test from "node:test";
import type { Browser } from "playwright";
import { launchBrowser } from "./launch-browser";
import { recipeUi } from "../src/features/recipes/recipe-i18n";
import { toolUi } from "../src/features/recipes/recipe-tools";

const base = "http://127.0.0.1:4176/Reseptit";
let server: ChildProcess;
let browser: Browser;
let serverOutput = "";

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Vite preview exited before becoming ready: ${serverOutput}`);
    try { if ((await fetch(`${base}/kermainen-lohipata/`)).ok) return; } catch { /* server is starting */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Vite preview did not become ready: ${serverOutput}`);
}

test("browser smoke: prerendered recipe pages, search filters, SEO, keyboard use and responsive layouts", async (t) => {
  server = spawn(process.execPath, [path.join(import.meta.dirname, "..", "node_modules", "vite", "bin", "vite.js"), "preview", "--host", "127.0.0.1", "--port", "4176", "--strictPort"], { stdio: "pipe" });
  server.stdout?.on("data", (data) => { serverOutput += data; });
  server.stderr?.on("data", (data) => { serverOutput += data; });
  try {
    await waitForServer();
    browser = await launchBrowser();
    t.after(async () => { await browser.close(); server.kill(); });

    const noJs = await browser.newPage({ javaScriptEnabled: false });
      await noJs.route("https://ozirix-dev.github.io/Reseptit/kuvat/**", async (route) => {
        await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
      });
    await noJs.goto(`${base}/`);
    assert.equal(await noJs.getByRole("heading", { name: "Reseptit" }).count(), 1);
    assert.ok(await noJs.locator(".recipe-card-grid .recipe-card").count() > 0);
    assert.equal(await noJs.getByRole("search").count(), 0);
    assert.ok(await noJs.locator(".recipe-card-grid .recipe-card__link").count() > 0);
    await noJs.goto(`${base}/kermainen-lohipata/`);
    assert.equal(await noJs.locator(".recipe-actions button, .serving-control button, .recipe-steps input").count(), 0);
    assert.ok(await noJs.locator(".rich-text ol li").count() > 0);
    await noJs.getByRole("link", { name: toolUi.fi.jump }).click();
    assert.ok(noJs.url().endsWith("#recipe-instructions"));
    await noJs.close();

    const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
    await page.route("https://ozirix-dev.github.io/Reseptit/kuvat/**", async (route) => {
      const imagePath = new URL(route.request().url()).pathname.split("/kuvat/")[1];
      await route.fulfill({ path: path.join(import.meta.dirname, "..", "public", "kuvat", ...imagePath.split("/")) });
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

    const methodPages = [
      { path: "/glykeeminen-kuorma/", locale: "fi", title: "Glykeeminen kuorma: lähteet ja laskenta | Reseptit", description: "Reseptien glykeemisen kuorman laskentatapa, lähteet ja reseptikohtaiset oletukset." },
      { path: "/en/glycemic-load/", locale: "en", title: "Glycemic load: sources and method | Recipes", description: "Calculation method, sources and recipe-specific assumptions for glycemic-load estimates." },
      { path: "/sv/glykemisk-belastning/", locale: "sv", title: "Glykemisk belastning: källor och metod | Recept", description: "Beräkningsmetod, källor och receptspecifika antaganden för uppskattningar av glykemisk belastning." },
      { path: "/th/glycemic-load/", locale: "th", title: "ภาระน้ำตาลในเลือด: แหล่งข้อมูลและวิธีคำนวณ | สูตรอาหาร", description: "วิธีคำนวณ แหล่งข้อมูล และสมมติฐานเฉพาะสูตรสำหรับค่าประมาณภาระน้ำตาลในเลือด" },
    ];
    for (const methodPage of methodPages) {
      const canonical = `https://ozirix-dev.github.io${base.replace("http://127.0.0.1:4176", "")}${methodPage.path}`;
      await page.goto(`${base}${methodPage.path}`);
      await page.waitForFunction((title) => document.title === title && Boolean(document.querySelector('link[rel="canonical"]')), methodPage.title);
      assert.equal(await page.locator("html").getAttribute("lang"), methodPage.locale);
      assert.ok((await page.locator("h1").innerText()).trim().length > 0, `${methodPage.locale}: visible method heading`);
      assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), methodPage.description);
      assert.equal(await page.locator('meta[property="og:title"]').getAttribute("content"), methodPage.title);
      assert.equal(await page.locator('meta[property="og:description"]').getAttribute("content"), methodPage.description);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute("content"), canonical);
      assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute("content"), methodPage.title);
      assert.equal(await page.locator('meta[name="twitter:description"]').getAttribute("content"), methodPage.description);
      assert.equal(await page.locator('meta[name="robots"]').count(), 0);
      assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 5);
      assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').count(), 1);
      assert.equal(await page.locator('link[rel="alternate"][hreflang="fi"]').getAttribute("href"), "https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/");

      const noSlashPath = `${base}${methodPage.path.slice(0, -1)}`;
      await page.evaluate((path) => { history.pushState(null, "", path); dispatchEvent(new PopStateEvent("popstate")); }, noSlashPath);
      await page.waitForFunction((title) => document.title === title && Boolean(document.querySelector('link[rel="canonical"]')), methodPage.title);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), canonical, `${methodPage.locale}: no-slash route keeps slash canonical`);
      assert.equal(await page.locator('meta[name="robots"]').count(), 0, `${methodPage.locale}: no-slash route remains indexable`);
    }

    await page.goto(`${base}/kermainen-lohipata/`);
    await page.getByRole("button", { name: "Lisää annos" }).click();
    assert.equal(await page.locator(".serving-control output").innerText(), "5");
    assert.match(await page.locator(".ingredient-list").innerText(), /750 g lohifilee/);
    assert.equal(await page.locator(".recipe-scaled-note").innerText(), toolUi.fi.scaled(4));
    await page.getByRole("link", { name: toolUi.fi.jump }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#recipe-instructions").evaluate(element => element === document.activeElement), true);
    const firstStep = page.getByRole("checkbox", { name: `${toolUi.fi.completed}: 1`, exact: true });
    await firstStep.focus();
    await page.keyboard.press("Space");
    assert.equal(await firstStep.isChecked(), true);
    assert.match(await page.locator(".step-controls").innerText(), /1\/7/);
    await page.evaluate(() => { (window as unknown as { printCalled: boolean }).printCalled = false; window.print = () => { (window as unknown as { printCalled: boolean }).printCalled = true; }; });
    await page.getByRole("button", { name: toolUi.fi.print }).click();
    assert.equal(await page.evaluate(() => (window as unknown as { printCalled: boolean }).printCalled), true);
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".print-servings").isVisible(), true);
    assert.match(await page.locator(".print-servings").innerText(), /5/);
    assert.equal(await page.locator(".recipe-actions").isVisible(), false);
    assert.equal(await page.locator(".recipe-step-text").first().evaluate(element => getComputedStyle(element).textDecorationLine), "none");
    assert.match(await page.locator(".ingredient-list").innerText(), /750 g lohifilee/);
    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
    assert.equal(await page.locator("html").evaluate(element => getComputedStyle(element).scrollBehavior), "auto");
    await page.getByRole("button", { name: toolUi.fi.reset }).click();
    assert.equal(await firstStep.isChecked(), false);
    await firstStep.check();

    await page.getByRole("link", { name: "Reseptit, etusivu" }).click();
    await page.getByRole("heading", { name: "Reseptit" }).waitFor();
    await page.getByRole("link", { name: "Kermainen lohipata" }).click();
    await page.getByRole("heading", { name: "Kermainen lohipata" }).waitFor();
    assert.equal(await page.locator(".serving-control output").innerText(), "4");
    assert.equal(await firstStep.isChecked(), false);

    await page.goto(`${base}/?q=lohi`);
    await page.getByRole("searchbox", { name: "Hae reseptejä" }).waitFor();
    await page.waitForFunction(() => (document.querySelector<HTMLInputElement>("#recipe-search")?.value ?? "") === "lohi");
    assert.ok(await page.locator(".recipe-card-grid .recipe-card").count() > 0);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href"))?.endsWith("/Reseptit/"));
    await page.getByLabel("Kategoria").selectOption("jalkiruoka");
    await page.getByRole("status").getByText("Löytyi 0 reseptiä").waitFor();
    assert.match(page.url(), /[?&]q=lohi/);
    assert.match(page.url(), /[?&]category=jalkiruoka/);
    await page.getByRole("button", { name: "Tyhjennä haku ja suodattimet" }).click();
    await page.getByRole("searchbox", { name: "Hae reseptejä" }).fill("kukkakaali");
    await page.getByLabel("Kategoria").selectOption("paaruoka");
    await page.getByLabel("Ruokavalio").selectOption("vhh");
    assert.ok(await page.locator(".recipe-card-grid .recipe-card").count() > 0);
    assert.equal(await page.locator(".recipe-card__diet").count(), await page.locator(".recipe-card").count());
    await page.getByRole("searchbox", { name: "Hae reseptejä" }).fill("ei-tallaista-ainesosaa");
    await page.getByText("Reseptejä ei löytynyt hakuehdoilla.").waitFor();
    assert.equal(await page.locator(".recipe-card-grid").count(), 0);
    await page.getByRole("button", { name: "Tyhjennä haku ja suodattimet" }).last().click();
    await page.locator(".recipe-card__image[loading=eager]").waitFor();
    assert.equal(await page.locator(".recipe-card__image[loading=eager]").count(), 1);
    assert.equal(await page.locator(".recipe-card__image").evaluateAll((images) => images.filter((image) => image.getAttribute("fetchpriority") === "high").length), 1);
    assert.equal(await page.locator(".recipe-card__image[loading=lazy]").count(), await page.locator(".recipe-card__image").count() - 1);
    assert.equal(await page.locator(".recipe-card h2").count(), await page.locator(".recipe-card").count());

    for (const [width, columns] of [[320, 1], [375, 1], [390, 1], [768, 2], [1024, 2], [1440, 3]]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `no horizontal overflow at ${width}px`);
      assert.equal(await page.locator(".recipe-card-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), columns, `grid column count at ${width}px`);
    }

    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(`${base}/en/recipes/`);
    await page.getByRole("searchbox", { name: "Search recipes" }).waitFor();
    await page.goto(`${base}/sv/recept/`);
    await page.getByRole("searchbox", { name: "Sök recept" }).waitFor();
    await page.goto(`${base}/th/recipes/`);
    await page.getByRole("searchbox", { name: "ค้นหาสูตรอาหาร" }).waitFor();
    for (const [locale, route] of [["fi", "/"], ["en", "/en/recipes/"], ["sv", "/sv/recept/"], ["th", "/th/recipes/"]] as const) {
      await page.goto(`${base}${route}`);
      await page.getByRole("searchbox", { name: recipeUi[locale].search }).waitFor();
      await page.locator(".recipe-more-filters summary").click();
      await page.getByLabel(toolUi[locale].time, { exact: true }).selectOption("60");
      await page.getByLabel(toolUi[locale].cuisine, { exact: true }).selectOption("thai");
      await page.getByLabel(toolUi[locale].ingredient, { exact: true }).selectOption("chicken");
      assert.ok(await page.locator(".recipe-card").count() > 0);
      assert.match(page.url(), /time=60&cuisine=thai&ingredient=chicken/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} advanced filters`);
      await page.reload();
      await page.waitForFunction(() => document.querySelector<HTMLSelectElement>("#recipe-cuisine")?.value === "thai");
      await page.getByRole("button", { name: recipeUi[locale].resetFilters }).click();
      for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
        assert.equal(await page.locator(selector).getAttribute("content"), recipeUi[locale].intro, `${locale}: ${selector}`);
      }
      // Exercise React navigation back to the index, without a new document load.
      await page.locator(".recipe-card__link").first().click();
      await page.locator(".article-breadcrumbs a").click();
      await page.getByRole("searchbox", { name: recipeUi[locale].search }).waitFor();
      await page.waitForFunction((intro) => document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content === intro, recipeUi[locale].intro);
      for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
        assert.equal(await page.locator(selector).getAttribute("content"), recipeUi[locale].intro, `${locale} after React navigation: ${selector}`);
      }
    }
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${base}/hummus/`);
    assert.match(await page.locator(".recipe-glycemic-load").innerText(), /GK-arvio[\s\S]*noin 6 \/ annos/);
    const methodLink = page.locator(".recipe-glycemic-load__caption a");
    await methodLink.focus();
    assert.equal(await methodLink.evaluate((element) => element.matches(":focus-visible")), true);
    await page.keyboard.press("Enter");
    await page.getByRole("heading", { name: "Glykeeminen kuorma: lähteet ja laskenta" }).waitFor();
    assert.ok(page.url().includes("#hummus"));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "central GK details fit 320px");
    const sourceSummary = page.locator("#hummus summary");
    await sourceSummary.focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#hummus details").evaluate((element) => (element as HTMLDetailsElement).open), true);
    await page.getByRole("link", { name: "English", exact: true }).click();
    await page.getByRole("heading", { name: "Glycemic load: sources and method" }).waitFor();
    assert.ok(page.url().includes("/en/glycemic-load/"));
    await page.setViewportSize({ width: 320, height: 800 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

    await page.goto(`${base}/`);
    const searchbox = page.getByRole("searchbox", { name: "Hae reseptejä" });
    await searchbox.focus();
    await searchbox.fill("lohi");
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("button", { name: "Tyhjennä haku", exact: true }).evaluate((button) => button.matches(":focus-visible")), true);

    await page.evaluate(() => {
      history.pushState(null, "", "/Reseptit/no-such-recipe/");
      dispatchEvent(new PopStateEvent("popstate"));
    });
    await page.getByRole("heading", { name: "Sivua ei löytynyt" }).waitFor();
    await page.waitForFunction(() => document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content === "noindex,follow");
    assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
    assert.equal(await page.locator('script#recipe-jsonld').count(), 0);
    assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 0);
    assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').count(), 0);

    for (const missingPage of [
      { path: "/Reseptit/en/recipes/no-such-recipe/", locale: "en", heading: "Page not found", title: "Page not found | Recipes" },
      { path: "/Reseptit/sv/recept/recept-som-inte-finns/", locale: "sv", heading: "Sidan kunde inte hittas", title: "Sidan kunde inte hittas | Recept" },
      { path: "/Reseptit/th/recipes/no-such-recipe/", locale: "th", heading: "ไม่พบหน้านี้", title: "ไม่พบหน้านี้ | สูตรอาหาร" },
    ]) {
      await page.evaluate((path) => {
        history.pushState(null, "", path);
        dispatchEvent(new PopStateEvent("popstate"));
      }, missingPage.path);
      await page.getByRole("heading", { name: missingPage.heading }).waitFor();
      assert.equal(await page.locator("html").getAttribute("lang"), missingPage.locale);
      assert.equal(await page.title(), missingPage.title);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,follow");
      assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 0);
    }
    await page.goto(`${base}/kermainen-lohipata/`);
    await page.getByRole("heading", { name: "Kermainen lohipata" }).waitFor();
    await page.waitForFunction(() => Boolean(document.querySelector('link[rel="canonical"]')));

    const localizedRecipes = [
      { route: "/en/recipes/high-protein-beef-macaroni-bake/", title: "High-Protein Beef Macaroni Bake", locale: "en", increase: "Increase servings" },
      { route: "/sv/recept/proteinrik-makaronilada-med-kottfars/", title: "Proteinrik makaronilåda med köttfärs", locale: "sv", increase: "Öka portioner" },
      { route: "/th/recipes/makaroni-op-nuea-bot-protein-sung/", title: "มักกะโรนีอบเนื้อบดโปรตีนสูง", locale: "th", increase: "เพิ่มจำนวนที่" },
    ];
    for (const recipe of localizedRecipes) {
      await page.goto(`${base}${recipe.route}`);
      await page.getByRole("heading", { name: recipe.title }).waitFor();
      assert.equal(await page.locator("html").getAttribute("lang"), recipe.locale);
      assert.equal(await page.locator(".recipe-languages a").count(), 4);
      assert.equal(await page.locator(".ingredient-list li").count(), 14);
      assert.equal(await page.getByRole("button", { name: toolUi[recipe.locale as "en" | "sv" | "th"].print }).count(), 1);
      await page.getByRole("checkbox").first().check();
      assert.equal(await page.getByRole("checkbox").first().isChecked(), true);
      const increase = page.getByRole("button", { name: recipe.increase });
      await increase.focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.locator(".serving-control output").innerText(), "9");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.setViewportSize({ width: 1280, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.setViewportSize({ width: 320, height: 800 });
    }

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await page.close();
  } finally {
    if (browser) await browser.close();
    server?.kill();
  }
});
