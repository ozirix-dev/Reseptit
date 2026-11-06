import assert from "node:assert/strict";
import test from "node:test";
import { selectBrowserTests } from "./run-browser-suites.mjs";

test("suite runner selects a single focused file", () => {
  assert.deepEqual(selectBrowserTests("smoke"), ["tests/ci-essential.browser.test.ts"]);
});

test("suite runner unions and deduplicates matching suites", () => {
  assert.deepEqual(selectBrowserTests("smoke ui smoke"), [
    "tests/ci-essential.browser.test.ts",
    "tests/browser-smoke.test.ts",
  ]);
});

test("extended suite includes all existing browser checks once", () => {
  assert.deepEqual(selectBrowserTests("smoke ui routes images"), [
    "tests/ci-essential.browser.test.ts",
    "tests/browser-smoke.test.ts",
    "tests/route-loading.browser.test.ts",
    "tests/responsive-images.browser.test.ts",
  ]);
});

test("empty, unknown and malicious suite names fail closed", () => {
  for (const value of ["", "not-a-suite", "smoke;echo", "smoke unknown", 5, null]) {
    assert.throws(() => selectBrowserTests(value));
  }
});
