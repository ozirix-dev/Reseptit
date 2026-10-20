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

test("browser smoke: prerender, serving controls, navigation, SEO cleanup and 320px layout", async (t) => {
  server = spawn(process.execPath, [path.join(import.meta.dirname, "..", "node_modules", "vite", "bin", "vite.js"), "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { stdio: "ignore" });
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    t.after(async () => { await browser.close(); server.kill(); });

    const noJs = await browser.newPage({ javaScriptEnabled: false });
    await noJs.goto(`${base}/kermainen-lohipata/`);
    assert.equal(await noJs.getByRole("heading", { name: "Kermainen lohipata" }).count(), 1);
    await noJs.close();

    const page = await browser.newPage({ viewport: { width: 320, height: 800 } });
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

    await page.evaluate(() => {
      history.pushState(null, "", "/Reseptit/no-such-recipe/");
      dispatchEvent(new PopStateEvent("popstate"));
    });
    await page.getByRole("heading", { name: "Reseptiä ei löytynyt" }).waitFor();
    await page.waitForFunction(() => document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content === "noindex,follow");
    assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
    assert.equal(await page.locator('script#recipe-jsonld').count(), 0);
    assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 0);
    assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').count(), 0);
    await page.evaluate(() => history.back());
    await page.getByRole("heading", { name: "Kermainen lohipata" }).waitFor();
    await page.waitForFunction(() => Boolean(document.querySelector('link[rel="canonical"]')));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await page.close();
  } finally {
    if (browser) await browser.close();
    server?.kill();
  }
});
