import assert from "node:assert/strict";
import test from "node:test";
import { launchBrowser } from "./launch-browser";
import { localImageServer } from "./helpers/local-image-server";

test("search retry preserves keyboard focus and releases it when the user moves", async (t) => {
  const server = await localImageServer("dist");
  t.after(() => server.close());
  const browser = await launchBrowser();
  t.after(() => browser.close());

  const cases = [
    { name: "success keeps focus in the Finnish search field", language: "fi", path: "/", query: "lohi", retry: "Yritä uudelleen", loading: "Ladataan reseptiluetteloa…", success: true, moves: false },
    { name: "another error restores focus to the Swedish retry button", language: "sv", path: "/sv/recept/", query: "lax", retry: "Försök igen", loading: "Laddar receptlistan…", success: false, moves: false },
    { name: "another error respects a deliberate focus move", language: "fi", path: "/", query: "lohi", retry: "Yritä uudelleen", loading: "Ladataan reseptiluetteloa…", success: false, moves: true },
  ] as const;

  for (const scenario of cases) {
    await t.test(scenario.name, async () => {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      let requests = 0;
      let finishRetry!: () => void;
      const retryPending = new Promise<void>(resolve => { finishRetry = resolve; });
      try {
        await page.route(`**/data/search-${scenario.language}-*.json`, async route => {
          if (++requests === 1) {
            await route.fulfill({ status: 503 });
            return;
          }
          await retryPending;
          if (scenario.success) {
            await route.continue();
          } else {
            await route.fulfill({ status: 503 });
          }
        });
        await page.goto(server.base + scenario.path);
        const search = page.getByRole("searchbox");
        const retry = page.getByRole("button", { name: scenario.retry, exact: true });
        await search.fill(scenario.query);
        await retry.waitFor();
        const filteredUrl = page.url();
        assert.equal(new URL(filteredUrl).searchParams.get("q"), scenario.query);
        await retry.press("Enter");
        await page.getByText(scenario.loading, { exact: true }).waitFor();
        assert.equal(await search.evaluate(el => el === document.activeElement), true);

        const category = page.locator("#recipe-category");
        if (scenario.moves) {
          await search.press("Tab");
          await page.keyboard.press("Tab");
          assert.equal(await category.evaluate(el => el === document.activeElement), true);
        }
        finishRetry();

        const focused = scenario.moves ? category : scenario.success ? search : retry;
        if (scenario.success) {
          await page.locator(".recipe-card__link").first().waitFor();
        } else {
          await retry.waitFor();
        }
        await page.waitForFunction(selector => document.activeElement === document.querySelector(selector),
          scenario.moves ? "#recipe-category" : scenario.success ? "#recipe-search" : ".recipe-empty-state button");
        assert.equal(await focused.evaluate(el => el === document.activeElement), true);
        assert.equal(page.url(), filteredUrl);
        assert.equal(await search.inputValue(), scenario.query);
        assert.equal(requests, 2);
      } finally {
        finishRetry();
        await page.close();
      }
    });
  }
});
