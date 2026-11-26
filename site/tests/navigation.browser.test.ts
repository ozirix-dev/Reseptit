import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import path from "node:path";
import { launchBrowser } from "./launch-browser";
import type { Page } from "playwright";

const base = "http://127.0.0.1:4182";

async function assertMenuInViewport(page: Page, selector: string, expectedLinks: number, label: string) {
  const panel = page.locator(selector);
  await panel.waitFor({ state: "visible" });
  assert.equal(await panel.locator("a").count(), expectedLinks, `${label}: link count`);
  const geometry = await panel.evaluate(node => ({
    viewport: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    boxes: [node, ...node.querySelectorAll("a")].map(element => {
      const { left, right, width, height } = element.getBoundingClientRect();
      return { left, right, width, height };
    }),
  }));
  assert.ok(geometry.scrollWidth <= geometry.viewport + 1, `${label}: horizontal overflow`);
  for (const box of geometry.boxes) {
    assert.ok(box.width > 0 && box.height > 0, `${label}: visible panel and links`);
    assert.ok(box.left >= -0.5 && box.right <= geometry.viewport + 0.5,
      `${label}: panel/link outside viewport: ${JSON.stringify(box)} / ${geometry.viewport}`);
  }
}
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

  // UX-001-001: a mobile panel may extend past the left edge even when
  // document.scrollWidth fits. Check the actual panel and every link.
  const indexes = { fi: "/", en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" };
  const mobileWidths = [320, 360, 390, 430, 620, 700];
  const desktopWidths = [701, 768, 1024, 1099, 1100, 1440, 1920];
  for (const [locale, index] of Object.entries(indexes)) {
    const page = await browser.newPage({ viewport: { width: 320, height: 844 }, reducedMotion: "reduce" });
    try {
      await page.goto(base + index);
      await page.locator("#recipe-search").waitFor();
      const primary = page.locator(".site-primary-menu > summary");
      const languages = page.locator(".site-language-menu > summary");
      const primaryPanel = ".site-primary-nav";
      const languagePanel = ".site-language-nav";
      for (const width of mobileWidths) {
        await page.setViewportSize({ width, height: 844 });
        await page.waitForFunction(() =>
          !document.querySelector<HTMLDetailsElement>(".site-primary-menu")?.open &&
          !document.querySelector<HTMLDetailsElement>(".site-language-menu")?.open);
        const label = `${locale} ${width}px`;
        await primary.press("Enter");
        await assertMenuInViewport(page, primaryPanel, 3, `${label}: primary`);
        await page.keyboard.press("Tab");
        assert.equal(await page.locator(primaryPanel + " a").first().evaluate(node =>
          node === document.activeElement && node.matches(":focus-visible")), true, `${label}: first link focus`);
        await languages.press("Space");
        assert.equal(await page.locator(".site-primary-menu").evaluate((node: HTMLDetailsElement) => node.open), false,
          `${label}: opening language menu closes primary`);
        await assertMenuInViewport(page, languagePanel, 4, `${label}: language`);
        await primary.click();
        assert.equal(await page.locator(".site-language-menu").evaluate((node: HTMLDetailsElement) => node.open), false,
          `${label}: opening primary closes language menu`);
        await assertMenuInViewport(page, primaryPanel, 3, `${label}: primary after switching`);
        await primary.press("Enter");
        await page.waitForFunction(() => !document.querySelector<HTMLDetailsElement>(".site-primary-menu")?.open);
      }
      for (const width of desktopWidths) {
        await page.setViewportSize({ width, height: 844 });
        await page.waitForFunction(() =>
          document.querySelector<HTMLDetailsElement>(".site-primary-menu")?.open &&
          document.querySelector<HTMLDetailsElement>(".site-language-menu")?.open);
        await assertMenuInViewport(page, primaryPanel, 3, `${locale} ${width}px: desktop primary`);
        await assertMenuInViewport(page, languagePanel, 4, `${locale} ${width}px: desktop language`);
      }
      await page.setViewportSize({ width: 320, height: 844 });
      await page.waitForFunction(() =>
        !document.querySelector<HTMLDetailsElement>(".site-primary-menu")?.open &&
        !document.querySelector<HTMLDetailsElement>(".site-language-menu")?.open);
    } finally {
      await page.close();
    }
    const noJs = await browser.newPage({ javaScriptEnabled: false });
    try {
      await noJs.goto(base + index);
      for (const width of mobileWidths) {
        await noJs.setViewportSize({ width, height: 844 });
        await assertMenuInViewport(noJs, ".site-primary-nav", 3, `${locale} ${width}px: no-JS primary`);
        await assertMenuInViewport(noJs, ".site-language-nav", 4, `${locale} ${width}px: no-JS language`);
        const sections = await noJs.locator(".site-primary-nav").boundingBox();
        const languageChoices = await noJs.locator(".site-language-nav").boundingBox();
        assert.ok(sections && languageChoices &&
          (sections.x + sections.width <= languageChoices.x + 0.5 ||
            languageChoices.x + languageChoices.width <= sections.x + 0.5 ||
            sections.y + sections.height <= languageChoices.y + 0.5 ||
            languageChoices.y + languageChoices.height <= sections.y + 0.5),
          `${locale} ${width}px: no-JS panels do not overlap`);
      }
    } finally {
      await noJs.close();
    }
  }
});
