import assert from "node:assert/strict";
import test from "node:test";
import { analyticsEvents, track } from "../src/features/privacy/analytics";

test("visitor analytics never uses storage or sends events while disabled", (t) => {
  const origin = "https://www.recipavo.com";
  let storageReads = 0;
  let storageWrites = 0;
  let fetches = 0;
  const storedGrant = "granted:" + (Date.now() + 60_000);
  const storage = {
    getItem() { storageReads++; return storedGrant; },
    setItem() { storageWrites++; },
    removeItem() { storageWrites++; },
  };

  t.mock.method(globalThis, "fetch", async () => {
    fetches++;
    return new Response();
  });
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location: { origin }, localStorage: storage },
  });
  t.after(() => {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  });

  for (const event of analyticsEvents) track(event);
  Object.defineProperty(window, "localStorage", {
    get() { storageReads++; throw new Error("storage unavailable"); },
  });
  for (const event of analyticsEvents) track(event);

  assert.equal(storageReads, 0);
  assert.equal(storageWrites, 0);
  assert.equal(fetches, 0);
});
