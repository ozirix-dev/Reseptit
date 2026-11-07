import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const browserSuites = Object.freeze({
  smoke: ["tests/ci-essential.browser.test.ts"],
  ui: ["tests/browser-smoke.test.ts", "tests/navigation.browser.test.ts"],
  routes: ["tests/route-loading.browser.test.ts"],
  images: ["tests/responsive-images.browser.test.ts"],
});

function selectBrowserTests(value) {
  assert.equal(typeof value, "string", "BROWSER_SUITES must be a string");
  const names = value.trim().split(/\s+/).filter(Boolean);
  assert.ok(names.length, "BROWSER_SUITES must select at least one suite");
  const filenames = new Set();
  for (const name of names) {
    assert.ok(Object.hasOwn(browserSuites, name), "Unknown browser suite: " + name);
    for (const filename of browserSuites[name]) filenames.add(filename);
  }
  return [...filenames];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const selected = selectBrowserTests(process.env.BROWSER_SUITES);
    console.log("Browser suites: " + process.env.BROWSER_SUITES);
    console.log("Selected browser tests:\n" + selected.join("\n"));
    const result = spawnSync("npm", ["exec", "--", "tsx", "--test", "--test-concurrency=1", ...selected], {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: process.env,
    });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

export { browserSuites, selectBrowserTests };
