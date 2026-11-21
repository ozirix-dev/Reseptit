import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { launchBrowser } from "./launch-browser";
import { feedbackUi } from "../src/features/feedback/feedback-copy";
import { privacyPaths } from "../src/features/privacy/privacy-copy";

const base = "http://127.0.0.1:4184";
const localeRoutes = [
  ["fi", "/"],
  ["en", "/en/recipes/"],
  ["sv", "/sv/recept/"],
  ["th", "/th/recipes/"],
] as const;

test("feedback dialog works in four languages, with keyboard exit and disabled-by-default intake", async t => {
  const server = spawn(process.execPath,
    [path.resolve("node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1",
      "--port", "4184", "--strictPort"], { stdio: "pipe" });
  let output = "";
  server.stdout?.on("data", data => { output += data; });
  server.stderr?.on("data", data => { output += data; });
  t.after(() => server.kill());

  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error("Feedback preview exited: " + output);
    try {
      ready = (await fetch(base + "/")).ok;
    } catch { /* preview is starting */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(ready, output);
  const browser = await launchBrowser();
  t.after(() => browser.close());

  const page = await browser.newPage({ viewport: { width: 390, height: 860 } });
  const errors: string[] = [];
  const submissionRequests: string[] = [];
  const turnstileRequests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    if (request.url().includes("/api/feedback")) submissionRequests.push(request.url());
    if (request.url().includes("challenges.cloudflare.com/turnstile")) turnstileRequests.push(request.url());
  });

  for (const [locale, route] of localeRoutes) {
    const copy = feedbackUi[locale];
    await page.goto(base + route);
    const trigger = page.getByRole("button", { name: copy.button, exact: true });
    // The static email link is upgraded only after hydration.
    await trigger.waitFor();
    assert.equal(await page.getByRole("dialog").count(), 0);

    await trigger.click();
    const dialog = page.getByRole("dialog", { name: copy.title });
    await dialog.waitFor();
    assert.equal(await dialog.locator("h2").textContent(), copy.title);
    assert.equal(await dialog.locator("form").count(), 0, locale + ": intake must stay disabled");
    assert.equal(await dialog.getByText(copy.disabled, { exact: true }).count(), 1);
    assert.equal(await dialog.locator('a[href^="mailto:"]').count(), 1);
    assert.equal(await dialog.locator('a[href="' + privacyPaths[locale] + '"]').count(), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true, locale + ": horizontal scrolling");

    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert.equal(await page.getByRole("dialog").count(), 0);
    // Reopen: the lazy module must not leave an inaccessible stale dialog.
    await trigger.click();
    await dialog.waitFor();
    await dialog.getByRole("button", { name: copy.close }).click();
    await dialog.waitFor({ state: "hidden" });
  }

  // A recipe-specific action must work on a deeply linked translated recipe.
  await page.goto(base + "/en/recipes/kermainen-lohipata/?tracking=should-not-be-copied");
  const recipeTrigger = page.getByRole("button", {
    name: feedbackUi.en.recipeButton, exact: true,
  });
  await recipeTrigger.waitFor();
  await recipeTrigger.click();
  const recipeDialog = page.getByRole("dialog", { name: feedbackUi.en.title });
  await recipeDialog.waitFor();
  assert.equal(await recipeDialog.getByText(feedbackUi.en.disabled, { exact: true }).count(), 1);
  assert.equal(await recipeDialog.locator("form").count(), 0);
  assert.equal(await recipeDialog.locator("code").count(), 0,
    "A disabled form must not accidentally disclose URL query parameters");
  await page.keyboard.press("Escape");
  await recipeDialog.waitFor({ state: "hidden" });

  // Static HTML is still useful for users who have JavaScript disabled.
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(base + "/kermainen-lohipata/");
  assert.equal(await noJs.getByRole("button", { name: feedbackUi.fi.recipeButton }).count(), 0);
  assert.equal(await noJs.getByRole("link", { name: feedbackUi.fi.recipeButton })
    .getAttribute("href"), "mailto:ossi@rikkola.fi");
  assert.equal(await noJs.locator(".feedback-dialog").count(), 0);
  await noJs.close();

  assert.deepEqual(submissionRequests, [], "Opening feedback must not submit a message");
  assert.deepEqual(turnstileRequests, [], "Disabled intake must not load Turnstile");
  assert.deepEqual(errors, []);
  await page.close();
});
