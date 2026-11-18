import { portionCopy } from "../src/features/recipes/RecipePortionSummary";
import { glycemicLoadPath } from "../src/features/recipes/recipe-i18n";
import { siteContent } from "../src/generated/content.generated";
import { siteTarget } from "../src/content/site-target";
import { gkCopy } from "../src/features/glycemic-load/glycemic-load-copy";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import test from "node:test";
import type { Browser } from "playwright";
import { launchBrowser } from "./launch-browser";
import { recipeUi } from "../src/features/recipes/recipe-i18n";
import { toolUi } from "../src/features/recipes/recipe-tools";

const base = "http://127.0.0.1:4176";
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
      await noJs.route(`${siteTarget.baseUrl}/kuvat/**`, async (route) => {
        await route.fulfill({ path: path.resolve("public/kuvat", new URL(route.request().url()).pathname.split("/kuvat/")[1]) });
      });
    await noJs.goto(`${base}/`);
    assert.equal(await noJs.getByRole("heading", { name: "Reseptit" }).count(), 1);
    assert.ok(await noJs.locator(".recipe-card-grid .recipe-card").count() > 0);
    assert.equal(await noJs.getByRole("search").count(), 0);
    assert.ok(await noJs.locator(".recipe-card-grid .recipe-card__link").count() > 0);
    await noJs.goto(`${base}/avokado-perunasampylat/`);
    const staticIngredients = await noJs.locator(".ingredient-list li").allTextContents();
    assert.deepEqual(staticIngredients.slice(0, 3), ["180 g keitettyä jauhoista perunaa", "100 g kypsän avokadon hedelmälihaa", "2 kananmunaa"]);

    await noJs.goto(`${base}/kermainen-lohipata/`);
    assert.equal(await noJs.locator(".recipe-actions button, .serving-control button, .recipe-steps input").count(), 0);
    assert.ok(await noJs.locator(".rich-text ol li").count() > 0);
    await noJs.getByRole("link", { name: toolUi.fi.jump }).click();
    assert.ok(noJs.url().endsWith("#recipe-instructions"));
    await noJs.close();

    const context = await browser.newContext({ viewport: { width: 320, height: 800 } });
    const page = await context.newPage();
    await page.route(`${siteTarget.baseUrl}/kuvat/**`, async (route) => {
      const imagePath = new URL(route.request().url()).pathname.split("/kuvat/")[1];
      await route.fulfill({ path: path.join(import.meta.dirname, "..", "public", "kuvat", ...imagePath.split("/")) });
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

    const methodPages = [
      { path: "/glykeeminen-kuorma/", locale: "fi", ogLocale: "fi_FI", title: "Reseptien glykeeminen kuorma (GK) | Recipavo", description: "Löydä reseptien glykeemisen kuorman (GK) arviot, luotettavuustiedot ja tarvittaessa tarkat laskentalähteet." },
      { path: "/en/glycemic-load/", locale: "en", ogLocale: "en_GB", title: "Glycemic load (GL) of recipes | Recipavo", description: "Explore calculated glycemic load estimates for recipes, their reliability and detailed sources." },
      { path: "/sv/glykemisk-belastning/", locale: "sv", ogLocale: "sv_SE", title: "Receptens glykemiska belastning (GL) | Recipavo", description: "Hitta uppskattningar av receptens glykemiska belastning, tillförlitlighet och detaljerade källor." },
      { path: "/th/glycemic-load/", locale: "th", ogLocale: "th_TH", title: "ค่าภาระน้ำตาลในเลือด (GL) ของสูตรอาหาร | Recipavo", description: "ค้นหาค่าภาระน้ำตาลในเลือด (GL) ของสูตรอาหาร พร้อมระดับความน่าเชื่อถือและแหล่งข้อมูลการคำนวณ" },
    ] as const;
    for (const [index, methodPage] of methodPages.entries()) {
      const canonical = `${siteTarget.baseUrl}${methodPage.path}`;
      await page.goto(`${base}${methodPage.path}`);
      await page.waitForFunction((title) => document.title === title && Boolean(document.querySelector('link[rel="canonical"]')), methodPage.title);
      assert.equal(await page.locator("html").getAttribute("lang"), methodPage.locale);
      assert.ok((await page.locator("h1").innerText()).trim().length > 0, `${methodPage.locale}: visible method heading`);
      assert.equal(await page.locator('meta[name="description"]').getAttribute("content"), methodPage.description);
      assert.equal(await page.locator('meta[property="og:title"]').getAttribute("content"), methodPage.title);
      assert.equal(await page.locator('meta[property="og:description"]').getAttribute("content"), methodPage.description);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute("content"), canonical);
      assert.equal(await page.locator('meta[property="og:locale"]').getAttribute("content"), methodPage.ogLocale);
      assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), "website");
      assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute("content"), "summary");
      assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute("content"), methodPage.title);
      assert.equal(await page.locator('meta[name="twitter:description"]').getAttribute("content"), methodPage.description);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content") ?? "", /noindex\s*,\s*nofollow/);
      assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 5);
      assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').count(), 1);
      assert.equal(await page.locator('link[rel="alternate"][hreflang="fi"]').getAttribute("href"), `${siteTarget.baseUrl}/glykeeminen-kuorma/`);
      for (const [locale, route] of [["en", "en/glycemic-load/"], ["sv", "sv/glykemisk-belastning/"], ["th", "th/glycemic-load/"]] as const) {
        assert.equal(await page.locator(`link[rel="alternate"][hreflang="${locale}"]`).getAttribute("href"), `${siteTarget.baseUrl}/${route}`);
      }

      const width = [320, 390, 768, 1440][index];
      await page.setViewportSize({ width, height: 800 });
      const search = page.locator("#gk-recipe-search");
      const results = page.locator(".glycemic-pilot__recipe");
      await search.waitFor();
      assert.equal(await results.count(), 24);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${methodPage.locale} at ${width}px`);

      const liverSearch = { fi: "Maksalaatikko", en: "Beef liver", sv: "Levergryta", th: "หม้อตับเนื้อ" }[methodPage.locale];
      await search.fill(liverSearch);
      const liver = page.locator("#maksalaatikko-kukkakaalilla");
      assert.equal(await liver.isVisible(), true, `${methodPage.locale}: liver recipe is searchable`);
      assert.match(await liver.innerText(), /GI/);
      assert.ok((await liver.innerText()).includes(gkCopy[methodPage.locale].missing));
      assert.doesNotMatch(await liver.innerText(), /3[.,]45/);
      await page.getByRole("checkbox").check();
      assert.equal(await liver.count(), 0);
      await page.getByRole("checkbox").uncheck();
      await search.fill("");

      if (methodPage.locale === "fi") {
        const initialIds = await results.evaluateAll((rows) => rows.map((row) => row.id));
        await page.getByRole("button", { name: "Näytä lisää", exact: true }).click();
        assert.equal(await results.count(), 48);
        assert.equal(await results.nth(24).evaluate((row) => row === document.activeElement), true);
        await page.getByRole("button", { name: "Näytä kaikki tulokset" }).click();
        const allIds = await results.evaluateAll((rows) => rows.map((row) => row.id));
        assert.ok(allIds.length > 48);
        assert.equal(new Set(allIds).size, allIds.length);
        const lastResult = results.last();
        const lastId = allIds.at(-1);
        const lastTitle = await lastResult.getByRole("heading", { level: 3 }).innerText();
        assert.ok(lastId && !initialIds.includes(lastId));
        await search.fill(lastTitle);
        assert.equal(await results.first().getAttribute("id"), lastId);
        await search.fill("");
        assert.equal(await results.count(), 24);
        await page.getByRole("checkbox").check();
        assert.equal(await page.locator("#kookos-lime-kanacurry").count(), 0);
        await page.evaluate(() => { window.location.hash = "kookos-lime-kanacurry"; });
        await page.locator("#kookos-lime-kanacurry").waitFor();
        assert.equal(await page.getByRole("checkbox").isChecked(), true);
      }

      const recipePrefix = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" }[methodPage.locale];
      await page.goto(`${base}${recipePrefix}/hummus/`);
      const href = await page.locator(".recipe-glycemic-load__caption a").getAttribute("href");
      assert.equal(href, `${methodPage.path}#hummus`);
      const linkedPage = await context.newPage();
      await linkedPage.goto(new URL(href!, base).href);
      await linkedPage.waitForFunction(() => document.activeElement?.id === "hummus");
      assert.equal(await linkedPage.locator(".glycemic-pilot__recipe").count(), 25);
      await linkedPage.reload();
      await linkedPage.waitForFunction(() => document.activeElement?.id === "hummus");
      await linkedPage.locator("#gk-recipe-search").fill("zzzz1234");
      assert.equal(await linkedPage.locator(".glycemic-pilot__recipe").count(), 1);
      assert.equal(await linkedPage.locator(".glycemic-pilot__recipe").getAttribute("id"), "hummus");
      await linkedPage.close();

      await page.goto(`${base}${methodPage.path}`);
      await search.waitFor();
      const noSlashPath = `${base}${methodPage.path.slice(0, -1)}`;
      await page.evaluate((path) => { history.pushState(null, "", path); dispatchEvent(new PopStateEvent("popstate")); }, noSlashPath);
      await page.waitForFunction((title) => document.title === title && Boolean(document.querySelector('link[rel="canonical"]')), methodPage.title);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), canonical, `${methodPage.locale}: no-slash route keeps slash canonical`);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content") ?? "", /noindex\s*,\s*nofollow/, `${methodPage.locale}: no-slash route keeps staging noindex`);
    }

    const rollRecipes = [
      { locale: "fi", route: "/avokado-perunasampylat/", baseEgg: "2 kananmunaa", baseYolk: "1 keltuainen, voiteluun", nextEgg: "2 ⅓ kananmunaa", nextYolk: "1 ⅙ keltuaista, voiteluun", doubleEgg: "4 kananmunaa", doubleYolk: "2 keltuaista, voiteluun" },
      { locale: "en", route: "/en/recipes/avokado-perunasampylat/", baseEgg: "2 eggs", baseYolk: "1 egg yolk, for brushing", nextEgg: "2 ⅓ eggs", nextYolk: "1 ⅙ egg yolks, for brushing", doubleEgg: "4 eggs", doubleYolk: "2 egg yolks, for brushing" },
      { locale: "sv", route: "/sv/recept/avokado-perunasampylat/", baseEgg: "2 ägg", baseYolk: "1 äggula, till pensling", nextEgg: "2 ⅓ ägg", nextYolk: "1 ⅙ äggulor, till pensling", doubleEgg: "4 ägg", doubleYolk: "2 äggulor, till pensling" },
      { locale: "th", route: "/th/recipes/avokado-perunasampylat/", baseEgg: "ไข่ไก่ 2 ฟอง", baseYolk: "ไข่แดง 1 ฟอง สำหรับทาหน้า", nextEgg: "ไข่ไก่ 2 ⅓ ฟอง", nextYolk: "ไข่แดง 1 ⅙ ฟอง สำหรับทาหน้า", doubleEgg: "ไข่ไก่ 4 ฟอง", doubleYolk: "ไข่แดง 2 ฟอง สำหรับทาหน้า" },
      { locale: "fi", route: "/avokado-perunasampylat-pellilla/", baseEgg: "1 kananmuna", baseYolk: null, nextEgg: "1 ⅙ kananmunaa", nextYolk: null, doubleEgg: "2 kananmunaa", doubleYolk: null },
    ] as const;
    for (const recipe of rollRecipes) {
      await page.goto(`${base}${recipe.route}`);
      const rows = page.locator(".ingredient-list li");
      const increased = page.getByRole("button", { name: recipeUi[recipe.locale].increase, exact: true });
      const decreased = page.getByRole("button", { name: recipeUi[recipe.locale].decrease, exact: true });
      const eggLines = async (egg: string, yolk: string | null) => {
        assert.equal(await rows.nth(2).innerText(), egg, recipe.route);
        if (yolk) assert.equal(await rows.nth(6).innerText(), yolk, recipe.route);
      };
      await eggLines(recipe.baseEgg, recipe.baseYolk);
      await increased.click();
      await eggLines(recipe.nextEgg, recipe.nextYolk);
      assert.ok(await page.getByText(toolUi[recipe.locale].eggFraction, { exact: true }).isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const structured = JSON.parse((await page.locator("#recipe-jsonld").textContent())!);
      assert.equal(structured.recipeIngredient[2], recipe.baseEgg);
      assert.equal(structured.recipeYield, "6");
      if (recipe.baseYolk) assert.equal(structured.recipeIngredient[6], recipe.baseYolk);
      await page.emulateMedia({ media: "print" });
      await eggLines(recipe.nextEgg, recipe.nextYolk);
      assert.match(await page.locator(".print-servings").innerText(), /7/);
      await page.emulateMedia({ media: "screen" });
      for (let i = 7; i < 12; i++) await increased.click();
      await eggLines(recipe.doubleEgg, recipe.doubleYolk);
      assert.equal(await page.getByText(toolUi[recipe.locale].eggFraction, { exact: true }).count(), 0);
      for (let i = 12; i > 6; i--) await decreased.click();
      await eggLines(recipe.baseEgg, recipe.baseYolk);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/gluteeniton-uunipannukakku/`);
    const milk = page.locator(".ingredient-list li").first();
    const increaseFi = page.getByRole("button", { name: recipeUi.fi.increase, exact: true });
    assert.equal(await milk.innerText(), "800 g Valio kevytmaitoa, 1,5 % rasvaa");
    await increaseFi.click();
    assert.match(await milk.innerText(), /Valio kevytmaitoa, 1,5 % rasvaa$/);
    assert.doesNotMatch(await milk.innerText(), /8 dl/);
    await page.goto(`${base}/gluteeniton-perunajauhokakkupohja/`);
    await increaseFi.click();
    const flour = page.locator(".ingredient-list li").filter({ hasText: "Finnamyl Helmi" });
    assert.match(await flour.innerText(), /500 g pakkaus EAN 6430024961201/);
    await page.goto(`${base}/bataatti-mustikkakakku/`);
    assert.equal(await page.locator(".ingredient-list li").nth(1).innerText(), "5 isoa kananmunaa");

    await page.goto(`${base}/medu-vada/`);
    assert.match(await page.locator(".ingredient-list li").first().innerText(), /urad-dal-linssejä, kuorittuja ja halkaistuja/);
    assert.equal(await page.locator(".ingredient-list li").last().innerText(), "öljyä friteeraukseen");
    assert.ok(await page.getByText(/Varaa friteeraukseen noin litra öljyä/).isVisible());
    assert.ok(await page.getByText(/ravintoarviossa friteerausöljyä oletetaan imeytyvän 50 g/).isVisible());
    await increaseFi.click();
    assert.equal(await page.locator(".ingredient-list li").last().innerText(), "öljyä friteeraukseen");
    await page.goto(`${base}/idli-sambar/`);
    const water = page.locator(".ingredient-list li").filter({ hasText: /^vettä, tarpeen mukaan/ });
    assert.equal(await water.innerText(), "vettä, tarpeen mukaan");
    await increaseFi.click();
    assert.equal(await water.innerText(), "vettä, tarpeen mukaan");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.setViewportSize({ width: 320, height: 800 });

    await page.goto(`${base}/kermainen-lohipata/`);
    await page.getByRole("button", { name: "Lisää annosmäärää", exact: true }).click();
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
    await page.locator("#recipe-search").fill("Kermainen lohipata");
    await page.locator('.recipe-card__link[href="/kermainen-lohipata/"]').click();
    await page.getByRole("heading", { name: "Kermainen lohipata" }).waitFor();
    assert.equal(await page.locator(".serving-control output").innerText(), "4");
    assert.equal(await firstStep.isChecked(), false);

    await page.goto(`${base}/?q=lohi`);
    await page.getByRole("searchbox", { name: "Hae reseptejä" }).waitFor();
    await page.waitForFunction(() => (document.querySelector<HTMLInputElement>("#recipe-search")?.value ?? "") === "lohi");
    await page.locator(".recipe-card-grid .recipe-card").first().waitFor();
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href"))?.endsWith("/"));
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
    const cardImages = page.locator("img.recipe-card__image");
    const imagePlaceholders = page.locator(".recipe-card__image--placeholder");
    assert.equal(await imagePlaceholders.count(), 0);
    assert.equal(await cardImages.count() + await imagePlaceholders.count(), await page.locator(".recipe-card").count());
    await page.locator("img.recipe-card__image[loading=eager]").waitFor();
    assert.equal(await page.locator("img.recipe-card__image[loading=eager]").count(), 1);
    assert.equal(await cardImages.evaluateAll((images) => images.filter((image) => image.getAttribute("fetchpriority") === "high").length), 1);
    assert.equal(await page.locator("img.recipe-card__image[loading=lazy]").count(), await cardImages.count() - 1);
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
      const advancedFilters = page.locator(".recipe-more-filters");
      assert.equal(await advancedFilters.evaluate((details: HTMLDetailsElement) => details.open), false, `${locale}: extra filters initially collapsed`);
      await advancedFilters.locator("summary").click();
      assert.equal(await advancedFilters.evaluate((details: HTMLDetailsElement) => details.open), true, `${locale}: extra filters can be opened`);
      await page.getByLabel(toolUi[locale].time, { exact: true }).selectOption("60");
      await page.getByLabel(toolUi[locale].cuisine, { exact: true }).selectOption("thai");
      await page.getByLabel(toolUi[locale].ingredient, { exact: true }).selectOption("chicken");
      await page.locator(".recipe-card").first().waitFor();
      assert.match(page.url(), /time=60&cuisine=thai&ingredient=chicken/);
      await page.getByLabel(toolUi[locale].gl, { exact: true }).selectOption("low");
      await page.waitForFunction(() => new URL(location.href).searchParams.get("gl") === "low");
      assert.equal(await page.locator(".recipe-filter-chip").count(), 4, `${locale} filter chips`);
      assert.ok((await page.locator(".recipe-gl-disclosure").innerText()).includes(toolUi[locale].glNote));
      const glChip = page.getByRole("button", {name: `${toolUi[locale].removeFilter}: ${toolUi[locale].lowGl}`, exact: true});
      await glChip.focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => !new URL(location.href).searchParams.has("gl"));
      assert.equal(await page.getByLabel(toolUi[locale].time, {exact: true}).inputValue(), "60");
      assert.equal(await page.getByLabel(toolUi[locale].cuisine, {exact: true}).inputValue(), "thai");
      assert.equal(await page.getByLabel(toolUi[locale].ingredient, {exact: true}).inputValue(), "chicken");
      assert.equal(await page.locator(".recipe-filter-chip").count(), 3);
      await page.waitForFunction(() => document.activeElement?.classList.contains("recipe-filter-chip"));

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
    const perPortion = page.locator("[data-portion-gk]");
    const originalValue = await perPortion.innerText();
    const batch = page.getByRole("group", { name: portionCopy.fi.batch, exact: true });
    assert.equal(await batch.count(), 1);
    assert.match(await page.locator(".recipe-portion").innerText(), /1\/4.*erästä/);
    assert.match(await page.locator(".recipe-portion").innerText(), /Tarjoiluleipä ja dippivihannekset eivät sisälly/);
    await page.getByRole("button", { name: recipeUi.fi.increase, exact: true }).click();
    assert.equal(await perPortion.innerText(), originalValue, "changing the batch leaves the eaten portion alone");
    assert.match(await page.locator(".recipe-portion").innerText(), /1\/5.*erästä/);
    const eatenPortion = page.getByLabel(portionCopy.fi.title, { exact: true });
    await page.keyboard.press("Tab");
    await eatenPortion.focus();
    assert.equal(await eatenPortion.evaluate(element => element.matches(":focus-visible")), true);
    await eatenPortion.selectOption("1.5");
    assert.notEqual(await perPortion.innerText(), originalValue);
    await eatenPortion.selectOption("1");
    assert.equal(await perPortion.innerText(), originalValue);
    const methodLink = page.locator(".recipe-glycemic-load__caption a");
    await methodLink.focus();
    assert.equal(await methodLink.evaluate((element) => element.matches(":focus-visible")), true);
    await page.keyboard.press("Enter");
    await page.getByRole("heading", { name: "Glykeeminen kuorma", exact: true }).waitFor();
    assert.ok(page.url().includes("#hummus"));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "central GK details fit 320px");
    const hummus = page.locator("#hummus");
    const technical = hummus.locator(".gk-evidence__technical");
    const researchLink = technical.locator("a").first();
    assert.equal(await researchLink.isVisible(), false);
    assert.match(await hummus.innerText(), /Luotettavuus/);
    assert.match(await hummus.innerText(), /Hiilihydraatteja noin 25,2 g annoksessa.*kuitu ja polyolit mukana/);
    assert.doesNotMatch(await hummus.innerText(), /HUMAN_GI|CATEGORY_MEAN|CALCULATION_POLICY/);
    const calculation = hummus.locator(".gk-evidence__details").first();
    await calculation.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await calculation.evaluate((element) => (element as HTMLDetailsElement).open), true);
    assert.equal(await researchLink.isVisible(), false);
    await technical.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await researchLink.isVisible(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "expanded evidence fits 320px");
    await page.locator(".site-language-menu > summary").click();
    await page.getByRole("link", { name: "English", exact: true }).click();
    await page.getByRole("heading", { name: "Glycemic load", exact: true }).waitFor();
    assert.ok(page.url().includes("/en/glycemic-load/"));
    await page.setViewportSize({ width: 320, height: 800 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

    for (const [index, locale] of (["fi", "en", "sv", "th"] as const).entries()) {
      await page.setViewportSize({ width: [320, 360, 768, 1440][index]!, height: 844 });
      await page.goto(base + glycemicLoadPath(locale));
      assert.equal(await page.locator('[data-gk-coverage="WHOLE_PORTION_CARBS"]').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const recipe = siteContent.recipes.find(recipe => recipe.locale === locale && recipe.recipeId === "kermainen-lohipata")!;
      await page.goto(base + recipe.routePath);
      assert.equal(await page.getByLabel(portionCopy[locale].title, { exact: true }).inputValue(), "1");
      await page.getByLabel(portionCopy[locale].title, { exact: true }).selectOption("2");
      assert.equal(await page.locator("[data-portion-gk]").count(), 1);
    }

    await page.goto(base + glycemicLoadPath("fi"));
    await page.locator("#gk-recipe-search").fill("Fetavaahto");
    const pendingGk = page.locator("#fetavaahto-kasvistikuilla");
    await pendingGk.waitFor();
    assert.match(await pendingGk.innerText(), /3,5/);
    assert.equal(await pendingGk.locator('[data-gk-estimate="VERBAL"]').count(), 1);
    assert.match(await pendingGk.getByRole("link", { name: portionCopy.fi.scopeSource }).getAttribute("href") ?? "", /^https:/);

    const routeFor = (id: string, locale = "fi") => siteContent.recipes.find(recipe => recipe.locale === locale && recipe.recipeId === id)!.routePath;
    const yogurtId = "valimerellinen-jogurttikulho-hunajalla";
    await page.goto(base + routeFor(yogurtId));
    const yogurtClass = page.locator("[data-original-gk-class]");
    assert.equal(await yogurtClass.getAttribute("data-original-gk-class"), "LOW");
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.equal(await yogurtClass.getAttribute("data-original-gk-class"), "MEDIUM");
    await page.goto(base + glycemicLoadPath("fi") + "#" + yogurtId);
    assert.equal(await page.locator(`#${yogurtId} [data-original-gk-class]`).getAttribute("data-original-gk-class"), "LOW");

    await page.goto(base + routeFor("malesialainen-kookos-banaanikulho"));
    const ingredientPortion = page.locator("[data-ingredient-portion]");
    assert.match(await ingredientPortion.innerText(), /Kuorittu banaani.*100 g[\s\S]+18,3 g/);
    assert.equal(await page.locator("[data-portion-carbohydrate], [data-portion-gk]").count(), 0);
    await page.getByRole("button", { name: recipeUi.fi.increase, exact: true }).click();
    assert.match(await ingredientPortion.innerText(), /100 g[\s\S]+18,3 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await ingredientPortion.innerText(), /150 g[\s\S]+27,5 g/);
    await page.goto(base + routeFor("indonesialainen-bakwan-jagung-kotiversio"));
    assert.match(await ingredientPortion.innerText(), /Puolikarkea vehnäjauho.*40 g[\s\S]+29,6 g/);
    const bakwanCarbs = page.locator('[data-portion-carbohydrate="available"]');
    assert.match(await bakwanCarbs.innerText(), /42,4 g/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await ingredientPortion.innerText(), /60 g[\s\S]+44,4 g/);
    assert.match(await bakwanCarbs.innerText(), /63,6 g/);
    await page.goto(base + glycemicLoadPath("fi") + "#malesialainen-kookos-banaanikulho");
    assert.match(await page.locator("#malesialainen-kookos-banaanikulho [data-ingredient-portion]").innerText(), /100 g[\s\S]+18,3 g/);
    await page.goto(base + routeFor("tunisialainen-brik", "en"));
    assert.match(await page.locator("[data-ingredient-portion]").innerText(), /1 sheet\b/);

    await page.goto(base + routeFor("malesialainen-nasi-lemak-aamiaisella"));
    const alternatives = page.locator("[data-gk-alternatives]");
    assert.match(await alternatives.innerText(), /Basmatiriisi\s+noin 22[\s\S]+Jasmiiniriisi\s+noin 26/);
    await page.getByRole("button", { name: recipeUi.fi.increase, exact: true }).click();
    assert.match(await alternatives.innerText(), /noin 22[\s\S]+noin 26/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await alternatives.innerText(), /noin 34[\s\S]+noin 40/);

    await page.goto(base + routeFor("dan-dan-nuudelit"));
    const danDan = page.locator('[data-gk-version="gk-operation80-review-ad22de231e93"]');
    assert.match(await danDan.locator("[data-gk-alternatives]").innerText(), /Tuore udon\s+noin 18,5[\s\S]+Hakubaku Somen\s+noin 25/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);
    assert.match(await danDan.innerText(), /Lähdearvion erän annosmäärä · 4/);

    await page.goto(base + routeFor("pohjoisafrikkalainen-msemen-hunajalla-punnittu-v2", "en"));
    assert.match(await page.locator('[data-gk-status="QUALITATIVE"]').innerText(), /Estimated high GL/);
    assert.match(await page.locator(".recipe-portion").innerText(), /2 pieces/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(base + routeFor("indonesialainen-nasi-goreng-aamiaisriisi-punnittu-v2"));
    const nasiGoreng = page.locator('[data-gk-status="QUALITATIVE"]');
    assert.match(await nasiGoreng.locator("[data-verbal-portion-scope]").innerText(), /150 g pitkäjyväistä valkoista riisiä punnittuna kypsänä ja kylmänä/);
    assert.ok(await nasiGoreng.evaluate(element => element.getBoundingClientRect().right <= innerWidth));
    assert.match(await page.locator("[data-portion-carbohydrate]").innerText(), /61 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.equal(await nasiGoreng.locator("[data-verbal-portion-scope]").count(), 0);
    assert.match(await page.locator("[data-portion-carbohydrate]").innerText(), /121,9 g/);

    await page.goto(base + routeFor("dal-makhani"));
    assert.match(await ingredientPortion.innerText(), /100 g[\s\S]+3,5 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await ingredientPortion.innerText(), /150 g[\s\S]+5,2 g/);
    assert.equal(await page.locator("[data-portion-carbohydrate], [data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("gluteeniton-siemenvuokaleipa"));
    const declaredCarbs = ingredientPortion.locator('[data-ingredient-carbohydrate="declared"]');
    assert.match(await ingredientPortion.innerText(), /17,5 g/);
    assert.match(await declaredCarbs.innerText(), /pakkauksen mukaan[\s\S]+13,1 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.match(await ingredientPortion.innerText(), /35 g/);
    assert.match(await declaredCarbs.innerText(), /26,3 g/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("jauheliha-kaalikeitto-vhh"));
    const roundedEstimate = page.locator("[data-portion-gk]");
    assert.match(await roundedEstimate.innerText(), /5/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.equal(await roundedEstimate.count(), 0);
    assert.equal(await page.getByText(portionCopy.fi.roundedServingOnly, { exact: true }).count(), 1);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1");
    assert.match(await roundedEstimate.innerText(), /5/);

    await page.goto(base + routeFor("uuniriisipuuro"));
    const ovenRiceCarbs = page.locator('[data-portion-carbohydrate="available"]');
    assert.match(await ovenRiceCarbs.innerText(), /44,2 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await ovenRiceCarbs.innerText(), /66,2 g/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("bataattiletut"));
    const preparations = page.locator('[data-carbohydrate-choice="whole"]');
    assert.match((await preparations.allInnerTexts()).join(" "), /30,3 g[\s\S]+28,8 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match((await preparations.allInnerTexts()).join(" "), /45,5 g[\s\S]+43,2 g/);
    assert.equal(await page.locator("[data-portion-gk], [data-ingredient-carb-alternative]").count(), 0);

    await page.goto(base + routeFor("bataatti-banaanileipa"));
    const loafPortion = page.locator(".recipe-portion");
    assert.match(await loafPortion.innerText(), /Callebaut 811[\s\S]+14,1 g[\s\S]+13,8 g/);
    const ingredientPreparations = page.locator("[data-ingredient-carb-alternative]");
    assert.match((await ingredientPreparations.allInnerTexts()).join(" "), /4,4 g[\s\S]+4 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await loafPortion.innerText(), /21,2 g[\s\S]+20,7 g[\s\S]+6,6 g[\s\S]+6,1 g/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("porkkanaletut"));
    const carrotPortion = page.locator(".recipe-portion");
    assert.match(await carrotPortion.innerText(), /kotitekoista sosetta[\s\S]+51 g[\s\S]+7,1 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await carrotPortion.innerText(), /76,5 g[\s\S]+10,7 g/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("paahtopaistileivat-kauralesesampyloilla"));
    const sandwichCarbs = page.locator('[data-portion-carbohydrate="available"]');
    const rollCarbs = page.locator('[data-ingredient-carbohydrate="available"]');
    const comparison = page.locator("[data-compared-carbohydrates]");
    assert.match(await sandwichCarbs.innerText(), /4,6 g/);
    assert.match(await rollCarbs.innerText(), /1,6 g/);
    assert.match(await comparison.innerText(), /22,7 g/);
    assert.equal(await comparison.getByRole("link").getAttribute("href"), routeFor("paahtopaistileipa-piparjuurikastikkeella"));
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await sandwichCarbs.innerText(), /6,9 g/);
    assert.match(await rollCarbs.innerText(), /2,4 g/);
    assert.match(await comparison.innerText(), /34,1 g/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("karjalanpiirakat-riisipuurolla"));
    const riceLabelCarbs = page.locator('[data-ingredient-carbohydrate="declared"]');
    assert.match(await riceLabelCarbs.innerText(), /6,4 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
    assert.match(await riceLabelCarbs.innerText(), /9,6 g/);
    assert.equal(await page.locator("[data-portion-carbohydrate], [data-portion-gk]").count(), 0);

    await page.goto(base + routeFor("munakasrulla-pinaatti-tuorejuustolla"));
    const gkCoverage = page.locator("[data-original-gk-coverage]");
    assert.match(await gkCoverage.locator('[data-gk-contributor="all"]').innerText(), /tuorejuustoa/);
    assert.match(await gkCoverage.locator("[data-gk-omissions]").innerText(), /1,2 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.match(await gkCoverage.locator("[data-gk-omissions]").innerText(), /2,4 g/);
    assert.match(await page.locator(".recipe-glycemic-load__class").innerText(), /epävarma/);

    await page.goto(base + routeFor("caponata"));
    const caponataOmission = page.locator("[data-gk-omissions]");
    assert.match(await caponataOmission.innerText(), /yläraja on 0,12 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.match(await caponataOmission.innerText(), /yläraja on 0,23 g/);

    await page.goto(base + routeFor("briossisampylat-joshua-weissman"));
    assert.match(await page.locator('[data-gk-status="QUALITATIVE"]').innerText(), /Suuri arvioitu GK/);
    assert.equal(await page.locator("[data-portion-gk]").count(), 0);

    for (const [id, selector, copy] of [
      ["taytetyt-kananmunat-yrteilla", '[data-gk-status="QUALITATIVE"]', portionCopy.fi.class.LOW],
      ["kylma-oliivioljylevite", '.recipe-portion', "Tarjoiluleipä ei sisälly arvioon"],
      ["tonnikalatayte-kurkkukupeissa", '[data-portion-carbohydrate]', "1,2"],
      ["malesialainen-nasi-lemak-aamiaisella", ".recipe-portion", "basmati- ja jasmiiniriisin"],
      ["linssimakaronilaatikko", ".recipe-portion", "Myllyn Paras Makaroni"],
      ["kebab-munakasrulla", '.recipe-portion', "Vehnäjauho"],
      ["mapo-tofu", "[data-ingredient-portion]", "Pitkäjyväinen riisi, kypsäpaino"],
      ["vhh-kaalikaarryleet", '.recipe-glycemic-load__class', "kasvisryhmän keskiarvo"],
    ]) {
      const recipe = siteContent.recipes.find(recipe => recipe.locale === "fi" && recipe.recipeId === id)!;
      await page.goto(base + recipe.routePath);
      assert.ok((await page.locator(selector).innerText()).includes(copy), id);
      if (id === "mapo-tofu") assert.equal(await page.locator("[data-portion-carbohydrate]").count(), 0);
      if (id === "taytetyt-kananmunat-yrteilla") {
        const source = page.locator('[data-gk-status="QUALITATIVE"]').getByRole("link", { name: portionCopy.fi.scopeSource });
        await source.focus();
        assert.equal(await source.getAttribute("href"), "https://glycemicindex.com/faqs/");
        await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("1.5");
        assert.equal(await page.getByText(portionCopy.fi.class.LOW, { exact: true }).count(), 0);
        assert.equal(await page.getByText(portionCopy.fi.baseOnly, { exact: true }).count(), 1);
      }
    }
    for (const [id, values] of [
      ["timjami-uunijuurekset", ["12,5", "25,1", "37,6", "50,1"]],
      ["palsternakkasosekeitto", ["15,3", "30,6", "45,9", "61,2"]],
    ] as const) {
      await page.goto(base + routeFor(id));
      const serving = page.getByLabel(portionCopy.fi.title, { exact: true });
      const scope = page.locator('.recipe-portion .recipe-disclosure').first();
      const baseScope = await scope.innerText();
      for (const [index, multiplier] of ["0.5", "1", "1.5", "2"].entries()) {
        await serving.selectOption(multiplier);
        assert.match(await page.locator('[data-portion-carbohydrate="available"]').innerText(), new RegExp(`${values[index]} g$`));
        assert.equal(await scope.innerText(), baseScope);
        assert.equal(await page.locator("[data-portion-gk], [data-original-gk-class]").count(), 0);
      }
    }
    const soupComparison = page.locator("[data-compared-carbohydrates]");
    assert.match(await soupComparison.innerText(), /43,6 g/);
    assert.equal(await soupComparison.getByRole("link").getAttribute("href"), routeFor("pinaattikeitto"));
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("0.5");
    assert.match(await soupComparison.innerText(), /10,9 g/);
    await page.goto(base + routeFor("mustaherukkavispipuuro"));
    assert.match(await page.locator(".recipe-portion").innerText(), /200 g[\s\S]*140 g/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("2");
    assert.match(await page.locator('[data-portion-carbohydrate="available"]').innerText(), /58 g$/);
    assert.equal(await page.locator("[data-portion-gk], [data-original-gk-class]").count(), 0);
    await page.goto(base + routeFor("paneer-tikka"));
    const pepperAmount = page.locator("[data-ingredient-portion] dd");
    assert.match(await pepperAmount.innerText(), /0,25 kpl$/);
    await page.getByLabel(portionCopy.fi.title, { exact: true }).selectOption("0.5");
    assert.match(await pepperAmount.innerText(), /0,125 kpl$/);
    assert.equal(await page.locator("[data-ingredient-carbohydrate], [data-portion-carbohydrate], [data-portion-gk]").count(), 0);
    await page.goto(`${base}/`);
    const searchbox = page.getByRole("searchbox", { name: "Hae reseptejä" });
    await searchbox.focus();
    await searchbox.fill("lohi");
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("button", { name: "Tyhjennä haku", exact: true }).evaluate((button) => button.matches(":focus-visible")), true);

    await page.evaluate(() => {
      history.pushState(null, "", "/no-such-recipe/");
      dispatchEvent(new PopStateEvent("popstate"));
    });
    await page.getByRole("heading", { name: "Sivua ei löytynyt" }).waitFor();
    await page.waitForFunction(() => document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content === "noindex,nofollow");
    assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
    assert.equal(await page.locator('script#recipe-jsonld').count(), 0);
    assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 0);
    assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').count(), 0);

    for (const missingPage of [
      { path: "/en/recipes/no-such-recipe/", locale: "en", heading: "Page not found", title: "Page not found | Recipavo" },
      { path: "/sv/recept/recept-som-inte-finns/", locale: "sv", heading: "Sidan kunde inte hittas", title: "Sidan kunde inte hittas | Recipavo" },
      { path: "/th/recipes/no-such-recipe/", locale: "th", heading: "ไม่พบหน้านี้", title: "ไม่พบหน้านี้ | Recipavo" },
    ]) {
      await page.evaluate((path) => {
        history.pushState(null, "", path);
        dispatchEvent(new PopStateEvent("popstate"));
      }, missingPage.path);
      await page.getByRole("heading", { name: missingPage.heading }).waitFor();
      assert.equal(await page.locator("html").getAttribute("lang"), missingPage.locale);
      assert.equal(await page.title(), missingPage.title);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow");
      assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 0);
    }
    await page.goto(`${base}/kermainen-lohipata/`);
    await page.getByRole("heading", { name: "Kermainen lohipata" }).waitFor();
    await page.waitForFunction(() => Boolean(document.querySelector('link[rel="canonical"]')));

    const localizedRecipes = [
      { route: "/en/recipes/high-protein-beef-macaroni-bake/", title: "High-Protein Beef Macaroni Bake", locale: "en", increase: "Increase the number of servings" },
      { route: "/sv/recept/proteinrik-makaronilada-med-kottfars/", title: "Proteinrik makaronilåda med köttfärs", locale: "sv", increase: "Öka antalet portioner" },
      { route: "/th/recipes/makaroni-op-nuea-bot-protein-sung/", title: "มักกะโรนีอบเนื้อบดโปรตีนสูง", locale: "th", increase: "เพิ่มจำนวนเสิร์ฟ" },
    ];
    for (const recipe of localizedRecipes) {
      await page.goto(`${base}${recipe.route}`);
      await page.getByRole("heading", { name: recipe.title }).waitFor();
      assert.equal(await page.locator("html").getAttribute("lang"), recipe.locale);
      assert.equal(await page.locator(".recipe-languages a").count(), 4);
      assert.equal(await page.locator(".ingredient-list li").count(), 14);
      const print = page.getByRole("button", { name: toolUi[recipe.locale as "en" | "sv" | "th"].print });
      await print.waitFor();
      assert.equal(await print.count(), 1);
      await page.getByRole("checkbox").first().check();
      assert.equal(await page.getByRole("checkbox").first().isChecked(), true);
      const increase = page.getByRole("button", { name: recipe.increase, exact: true });
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
