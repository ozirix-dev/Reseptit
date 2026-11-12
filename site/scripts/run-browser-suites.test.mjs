import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync } from "node:fs";
import { browserSuites, previewBrowserTest, selectBrowserTests } from "./run-browser-suites.mjs";

test("suite runner selects a single focused file", () => {
  assert.deepEqual(selectBrowserTests("smoke"), ["tests/ci-essential.browser.test.ts"]);
});

test("suite runner unions and deduplicates matching suites", () => {
  assert.deepEqual(selectBrowserTests("smoke ui smoke"), [
    "tests/ci-essential.browser.test.ts",
    "tests/browser-smoke.test.ts",
    "tests/navigation.browser.test.ts",
    "tests/content-layout.browser.test.ts",
  ]);
});

test("extended suite includes all existing browser checks once", () => {
  assert.deepEqual(selectBrowserTests("smoke ui routes images"), [
    "tests/ci-essential.browser.test.ts",
    "tests/browser-smoke.test.ts",
    "tests/navigation.browser.test.ts",
    "tests/content-layout.browser.test.ts",
    "tests/route-loading.browser.test.ts",
    "tests/responsive-images.browser.test.ts",
  ]);
});

test("empty, unknown and malicious suite names fail closed", () => {
  for (const value of ["", "not-a-suite", "smoke;echo", "smoke unknown", 5, null]) {
    assert.throws(() => selectBrowserTests(value));
  }
});

test("each browser test belongs to one suite or the dedicated preview workflow", () => {
  const registered = [...Object.values(browserSuites).flat(), previewBrowserTest].sort();
  const discovered = readdirSync(new URL("../tests", import.meta.url))
    .filter(name => name.endsWith(".browser.test.ts") || name === "browser-smoke.test.ts")
    .map(name => "tests/" + name).sort();
  assert.deepEqual(registered, discovered);
});
