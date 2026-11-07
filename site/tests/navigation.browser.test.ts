import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import path from "node:path";
import { launchBrowser } from "./launch-browser";

const base = "http://127.0.0.1:4182/Reseptit";
test("navigation keeps separate menus and restores scroll correctly across all links", async t => {
  const server = spawn(process.execPath, [path.join(import.meta.dirname, "..", "node_modules", "vite", "bin", "vite.js"), "preview", "--host", "127.0.0.1", "--port", "4182", "--strictPort"], { stdio: "pipe" });
  t.after(() => server.kill());
  let started = false;
  for (let i = 0; i < 45; i++) {
    if (server.exitCode !== null) throw new Error("Vite preview exited early");
    try { if ((await fetch(base + "/ruokaopas/")).ok) { started = true; break; } } catch { /* starting */ }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert.ok(started, "Vite preview must start");
  const browser = await launchBrowser();
  t.after(() => browser.close());

  const desktop = await browser.newPage({ viewport: { width: 1366, height: 800 } });
  await desktop.goto(base + "/ruokaopas/");
  await desktop.locator(".blog-card").first().waitFor();
  assert.equal(await desktop.locator(".site-primary-nav a").count(), 3);
  assert.equal(await desktop.locator(".site-language-nav a").count(), 4);
  assert.ok(await desktop.locator(".site-primary-nav").isVisible());
  assert.ok(await desktop.locator(".site-language-nav").isVisible());
  const nav = await desktop.locator(".site-primary-nav").boundingBox();
  const langs = await desktop.locator(".site-language-nav").boundingBox();
  assert.ok(nav && langs && nav.x + nav.width <= langs.x + 3, "Desktop language choices must be separate");

  await desktop.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await desktop.waitForFunction(() => window.scrollY > 400);
  await desktop.locator(".blog-card").last().locator("a").click();
  await desktop.waitForURL(/\/ruokaopas\/[^/]+\/$/);
  await desktop.waitForFunction(() => window.scrollY < 8);
  await desktop.goBack();
  await desktop.waitForFunction(() => window.scrollY > 400);

  await desktop.goto(base + "/kermainen-lohipata/");
  const anchor = desktop.locator('a[href$="#recipe-instructions"]').first();
  await anchor.click();
  await desktop.waitForFunction(() => location.hash === "#recipe-instructions" && window.scrollY > 100);
  await desktop.close();

  const tablet = await browser.newPage({ viewport: { width: 850, height: 850 } });
  await tablet.goto(base + "/ruokaopas/");
  const brand = await tablet.locator(".site-brand").boundingBox();
  const sections = await tablet.locator(".site-primary-nav").boundingBox();
  assert.ok(brand && sections && sections.y > brand.y, "Tablet sections should move to separate row");
  await tablet.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 800 } });
  await mobile.goto(base + "/ruokaopas/");
  await mobile.waitForFunction(() => !(document.querySelector(".site-primary-menu") as HTMLDetailsElement)?.open);
  assert.ok(await mobile.locator(".site-primary-menu > summary").isVisible());
  assert.ok(await mobile.locator(".site-language-menu > summary").isVisible());
  await mobile.locator(".site-primary-menu > summary").click();
  assert.ok(await mobile.locator(".site-primary-nav a").first().isVisible());
  await mobile.locator(".site-primary-nav a").first().click();
  await mobile.waitForURL(base + "/");
  await mobile.waitForFunction(() => window.scrollY < 8);
  await mobile.waitForFunction(() => !(document.querySelector(".site-primary-menu") as HTMLDetailsElement)?.open);
  assert.equal(await mobile.locator(".site-primary-menu").evaluate((node: HTMLDetailsElement) => node.open), false);
  await mobile.locator(".site-language-menu > summary").click();
  assert.ok(await mobile.locator(".site-language-nav a").first().isVisible());
  await mobile.close();
});
