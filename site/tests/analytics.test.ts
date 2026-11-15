import assert from "node:assert/strict";
import test from "node:test";

test("Plausible sends only permitted production events after current consent", async (t) => {
  const origin = "https://www.recipavo.com";
  let pageOrigin = origin;
  let canonical = origin + "/?q=private-search#private-fragment";
  let stored: string | null = null;
  let storageFails = false;
  const sends: { url: unknown; init: RequestInit | undefined }[] = [];
  const storage = {
    getItem: () => { if (storageFails) throw Error("storage denied"); return stored; },
    setItem: (_key: string, value: string) => { if (storageFails) throw Error("storage denied"); stored = value; },
    removeItem: () => { if (storageFails) throw Error("storage denied"); stored = null; },
  };
  const values = {
    window: { location: { get origin() { return pageOrigin; } }, localStorage: storage, dispatchEvent() {} },
    document: {
      referrer: "https://www.google.com/search?q=private-referrer#private-fragment",
      querySelector: () => ({ href: canonical }),
    },
    fetch: async (url: unknown, init?: RequestInit) => { sends.push({ url, init }); return new Response(); },
  };
  for (const [key, value] of Object.entries(values)) {
    const old = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => { if (old) Object.defineProperty(globalThis, key, old); else Reflect.deleteProperty(globalThis, key); });
  }
  const oldTarget = process.env.RECIPAVO_BUILD_TARGET;
  const oldPreview = process.env.RECIPAVO_PREVIEW_ORIGIN;
  process.env.RECIPAVO_BUILD_TARGET = "production";
  delete process.env.RECIPAVO_PREVIEW_ORIGIN;
  t.after(() => {
    if (oldTarget === undefined) delete process.env.RECIPAVO_BUILD_TARGET;
    else process.env.RECIPAVO_BUILD_TARGET = oldTarget;
    if (oldPreview !== undefined) process.env.RECIPAVO_PREVIEW_ORIGIN = oldPreview;
  });
  const analytics = await import("../src/features/privacy/analytics");
  const { track, trackPageview, setAnalyticsChoice, getAnalyticsChoice } = analytics;
  track("Recipe Search");
  assert.equal(trackPageview(null), null);
  setAnalyticsChoice("denied");
  track("Recipe Search");
  assert.equal(sends.length, 0);

  setAnalyticsChoice("granted");
  const current = trackPageview(null);
  assert.equal(current, origin + "/");
  trackPageview(current);
  track("Recipe Search");
  track("unapproved" as Parameters<typeof track>[0]);
  assert.equal(sends.length, 2);
  assert.deepEqual(sends.map(({ url, init }) => ({
    url, credentials: init?.credentials, referrerPolicy: init?.referrerPolicy,
    payload: JSON.parse(String(init?.body)),
  })), [
    { url: "https://plausible.io/api/event", credentials: "omit", referrerPolicy: "no-referrer",
      payload: { domain: "recipavo.com", name: "pageview", url: origin + "/", referrer: "https://google.com/" } },
    { url: "https://plausible.io/api/event", credentials: "omit", referrerPolicy: "no-referrer",
      payload: { domain: "recipavo.com", name: "Recipe Search", url: origin + "/" } },
  ]);

  for (const excluded of [origin + "/tietosuoja/", "https://example.org/"]) {
    canonical = excluded;
    assert.equal(trackPageview(null), null);
    track("Recipe Search");
  }
  canonical = origin + "/";
  pageOrigin = "https://recipavo-preview.pages.dev";
  track("Recipe Search");
  pageOrigin = origin;
  setAnalyticsChoice("denied");
  track("Recipe Search");
  stored = "granted:1";
  assert.equal(getAnalyticsChoice(), null);
  track("Recipe Search");
  storageFails = true;
  assert.equal(getAnalyticsChoice(), null);
  assert.equal(sends.length, 2);
  setAnalyticsChoice("granted");
  track("Recipe Search");
  setAnalyticsChoice("denied");
  track("Recipe Search");
  assert.equal(sends.length, 3);
  assert.equal(getAnalyticsChoice(), "denied");
  assert.ok(stored);
  assert.match(stored, new RegExp("^granted:1$"));
});
