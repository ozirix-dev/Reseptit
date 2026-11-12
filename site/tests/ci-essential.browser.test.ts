import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { launchBrowser } from "./launch-browser";
import { recipeUi } from "../src/features/recipes/recipe-i18n";
import { siteContent } from "../src/generated/content.generated";

const base = "http://127.0.0.1:4192/Reseptit";
const routes = ["/", "/en/recipes/", "/sv/recept/", "/th/recipes/"];

test("essential UI smoke: locales, search, a recipe, blog and no-JS navigation", async () => {
  const server = spawn(process.execPath, [
    path.resolve("node_modules/vite/bin/vite.js"),
    "preview", "--host", "127.0.0.1", "--port", "4192", "--strictPort",
  ], { stdio: "pipe" });
  let serverOutput = "";
  server.stdout.on("data", (data) => { serverOutput += data; });
  server.stderr.on("data", (data) => { serverOutput += data; });
  let browser: Awaited<ReturnType<typeof launchBrowser>> | undefined;
  const errors: string[] = [];
  try {
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      if (server.exitCode !== null) throw Error("Vite preview exited: " + serverOutput);
      try { ready = (await fetch(base + "/")).ok; } catch { /* warming up */ }
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.ok(ready, "Vite preview did not start: " + serverOutput);
    browser = await launchBrowser();
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await page.goto(base + route);
      await page.locator("#recipe-search").waitFor();
      assert.ok(await page.locator(".recipe-card__link").count() > 0, route + " has recipes");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, route + " does not overflow");
    }
    // Reviewed dietary pilot: direct links, four locales, independent checkbox,
    // reset, keyboard activation, and no false carnivore menu promise.
    for (const [index, route] of routes.entries()) {
      const locale = (["fi", "en", "sv", "th"] as const)[index];
      const labels = recipeUi[locale];
      const width = [320, 360, 768, 1440][index];
      await page.setViewportSize({ width, height: 844 });
      await page.goto(base + route + "?diet=vegan");
      await page.waitForFunction(() => document.querySelector<HTMLSelectElement>("#recipe-diet")?.value === "vegan");
      const expectedVegan = siteContent.recipes.filter(item => item.locale === locale && item.dietTags?.includes("vegan")).length;
      assert.ok(expectedVegan >= 2, locale + " retains the pilot vegan recipes");
      assert.equal(await page.locator(".recipe-card-grid .recipe-card").count(), expectedVegan, locale + " lists only reviewed vegan recipes");
      const expectedCarnivore = siteContent.recipes
        .filter(item => item.locale === locale && item.dietTags?.includes("carnivore"))
        .map(item => new URL(base + item.routePath).pathname)
        .sort();
      assert.equal(await page.locator('#recipe-diet option[value="carnivore"]').count(), expectedCarnivore.length ? 1 : 0,
        locale + " only advertises published, source-reviewed carnivore recipes");
      if (locale === "fi") assert.ok(expectedCarnivore.length > 0, "FI retains reviewed carnivore recipes");
      if (expectedCarnivore.length > 0) {
        await page.getByLabel(labels.dietFilter).selectOption("carnivore");
        await page.waitForFunction(() => new URL(location.href).searchParams.get("diet") === "carnivore");
        const actualRoutes = await page.locator(".recipe-card-grid .recipe-card__link")
          .evaluateAll(links => links.map(link => (link as HTMLAnchorElement).pathname).sort());
        assert.deepEqual(actualRoutes, expectedCarnivore, locale + " lists exactly the reviewed public routes");
        await page.getByLabel(labels.dietFilter).selectOption("vegan");
        await page.waitForFunction(() => new URL(location.href).searchParams.get("diet") === "vegan");
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true,
        locale + " dietary search must not overflow at " + width + "px");
      await page.getByLabel(labels.dietFilter).selectOption("pescatarian");
      await page.waitForFunction(() => new URL(location.href).searchParams.get("diet") === "pescatarian");
      const expectedPescatarian = siteContent.recipes.filter(item => item.locale === locale && item.dietTags?.includes("pescatarian")).length;
      assert.ok(expectedPescatarian >= 5, locale + " retains the five verified pescatarian recipes");
      assert.equal(await page.locator(".recipe-card-grid .recipe-card").count(), expectedPescatarian, locale + " lists only reviewed pescatarian recipes");
      await page.getByLabel(labels.dietFilter).selectOption("vegan");
      const glutenFree = page.locator("#recipe-gluten-free");
      await glutenFree.focus();
      await page.keyboard.press("Space");
      assert.equal(await glutenFree.isChecked(), true, locale + " gluten checkbox keyboard toggles independently");
      assert.ok(page.url().includes("gluten_free=1"), locale + " checkbox persists in URL");
      await page.reload();
      await page.waitForFunction(() => document.querySelector<HTMLSelectElement>("#recipe-diet")?.value === "vegan");
      assert.equal(await page.locator("#recipe-gluten-free").isChecked(), true, locale + " URL restores both filters");
      await page.getByRole("button", { name: labels.resetFilters }).last().click();
      assert.equal(await page.locator("#recipe-diet").inputValue(), "all");
      assert.equal(await page.locator("#recipe-gluten-free").isChecked(), false);
    }
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(base + "/?q=lohi");
    await page.waitForFunction(() => document.querySelector<HTMLInputElement>("#recipe-search")?.value === "lohi");
    assert.ok(await page.locator(".recipe-card__link").count() > 0, "search has results");
    await page.locator(".recipe-card__link").first().click();
    await page.locator(".ingredient-list li").first().waitFor();
    await page.goto(base + "/ruokaopas/");
    await page.getByRole("heading", { name: "Ruokaopas", exact: true }).waitFor();
    await page.close();

    const noJs = await browser.newPage({ javaScriptEnabled: false });
    await noJs.goto(base + "/");
    assert.ok(await noJs.locator(".recipe-card__link").count() > 0, "prerendered recipe links");
    await noJs.locator(".recipe-card__link").first().click();
    await noJs.locator(".ingredient-list li").first().waitFor();
    await noJs.close();
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    server.kill();
  }
});
