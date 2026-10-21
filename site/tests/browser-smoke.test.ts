import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { chromium, type Browser } from "playwright";

const base = "http://127.0.0.1:4173/Reseptit";
let server: ChildProcess;
let browser: Browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(`${base}/kermainen-lohipata/`)).ok) return; } catch { /* server is starting */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Vite preview did not become ready.");
}

test("browser smoke: prerendered recipe pages, search filters, SEO, keyboard use and responsive layouts", async (t) => {
  server = spawn(process.execPath, [path.join(import.meta.dirname, "..", "node_modules", "vite", "bin", "vite.js"), "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { stdio: "ignore" });
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    t.after(async () => { await browser.close(); server.kill(); });

    const noJs = await browser.newPage({ javaScriptEnabled: false });
    await noJs.goto(`${base}/`);
    assert.equal(await noJs.getByRole("heading", { name: "Reseptit" }).count(), 1);
    assert.ok(await noJs.locator(".recipe-card-grid .recipe-card").count() > 0);
    assert.equal(await noJs.getByRole("search").count(), 0);
    assert.ok(await noJs.locator(".recipe-card-grid .recipe-card__link").count() > 0);
    await noJs.close();

    const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
    await page.route("https://ozirix-dev.github.io/Reseptit/kuvat/**", async (route) => {
      const imagePath = new URL(route.request().url()).pathname.split("/kuvat/")[1];
      await route.fulfill({ path: path.join(import.meta.dirname, "..", "public", "kuvat", ...imagePath.split("/")) });
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`${base}/kermainen-lohipata/`);
    await page.getByRole("button", { name: "Lisää annos" }).click();
    assert.equal(await page.locator(".serving-control output").innerText(), "5");
    assert.match(await page.locator(".ingredient-list").innerText(), /750 g lohifilee/);

    await page.getByRole("link", { name: "Reseptit, etusivu" }).click();
    await page.getByRole("heading", { name: "Reseptit" }).waitFor();
    await page.getByRole("link", { name: "Kermainen lohipata" }).click();
    await page.getByRole("heading", { name: "Kermainen lohipata" }).waitFor();

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
    assert.equal(await page.locator(".recipe-card h3").count(), await page.locator(".recipe-card").count());

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
