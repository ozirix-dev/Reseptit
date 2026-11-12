import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { browserSuites, previewBrowserTest } from "./run-browser-suites.mjs";

const site = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const dedicatedTests = new Set([
  ...Object.values(browserSuites).flat(),
  previewBrowserTest,
  "tests/blog.test.ts",
  "tests/image-pipeline.test.ts",
  "tests/navigation.test.ts",
  "tests/seo-audit.test.ts",
  "tests/static-output.test.ts",
  "tests/translation-publication-index.test.ts",
  "tests/translation-review.test.ts",
  "tests/translations.test.ts",
]);

const tests = ["scripts", "tests"].flatMap(directory =>
  readdirSync(path.join(site, directory), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".test.ts") && !entry.name.endsWith(".browser.test.ts"))
    .map(entry => path.relative(site, path.join(entry.parentPath, entry.name)).replaceAll(path.sep, "/")),
).filter(file => !dedicatedTests.has(file)).sort();

if (tests.length === 0) throw new Error("No unit tests found.");
const result = spawnSync(process.execPath, [require.resolve("tsx/cli"), "--test", ...tests], {
  cwd: site,
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
