import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const browserSuites = Object.freeze({
  smoke: ["tests/ci-essential.browser.test.ts"],
  ui: ["tests/browser-smoke.test.ts", "tests/navigation.browser.test.ts", "tests/content-layout.browser.test.ts"],
  routes: ["tests/route-loading.browser.test.ts"],
  images: ["tests/responsive-images.browser.test.ts"],
});

const previewBrowserTest = "tests/recipavo-preview.browser.test.ts";

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
    const suites = process.env.BROWSER_SUITES ?? process.argv[2];
    const selected = selectBrowserTests(suites);
    console.log("Browser suites: " + suites);
    console.log("Selected browser tests:\n" + selected.join("\n"));
    const require = createRequire(import.meta.url);
    const result = spawnSync(process.execPath, [require.resolve("tsx/cli"), "--test", "--test-concurrency=1", ...selected], {
      cwd: fileURLToPath(new URL("../", import.meta.url)),
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

export { browserSuites, previewBrowserTest, selectBrowserTests };
