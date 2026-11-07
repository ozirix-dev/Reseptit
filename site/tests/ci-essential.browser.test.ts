import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { launchBrowser } from "./launch-browser";

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
