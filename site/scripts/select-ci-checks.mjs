import { randomUUID } from "node:crypto";
import { appendFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { browserSuites, previewBrowserTest } from "./run-browser-suites.mjs";

// Only the established, append-only four-language recipe batch is eligible for
// narrower browser checks. Preserve all unit/domain checks and fail closed to
// the ordinary full plan when any path, status or old record differs.
const batchManifests = [
  "assets/images.tracked-overlays.json",
  "docs/nutrition/new-public-gk-pending-sources.json",
  "meta/kaannokset/published-translation-pairs.json",
  "meta/kaannokset/codex-review-evidence.json"
];

function recipeBatchPaths(paths) {
  const fiPattern = /^reseptit\/(aamupalat|valipalat|alkuruoat|paaruoat|jalkiruoat|leivonnaiset)\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
  const sources = paths.map(file => fiPattern.exec(file)).filter(Boolean);
  const batches = paths.filter(file => /^docs\/nutrition\/batches\/batch-[0-9]+\.json$/.test(file));
  if (!sources.length || batches.length !== 1) return null;
  const ids = new Set(sources.map(match => match[2]));
  if (ids.size !== sources.length) return null;
  const images = new Set();
  const reviews = new Set();
  const expected = new Set([...batchManifests, ...batches]);
  for (const [, category, id] of sources) {
    const image = `${category}/${id}.webp`;
    images.add(image);
    expected.add(`reseptit/${category}/${id}.md`);
    expected.add(`kuvat/${image}`);
    expected.add(`docs/nutrition/calculations/${id}.json`);
    expected.add(`docs/reviews/new-recipes/${id}.json`);
    for (const locale of ["en", "sv", "th"]) {
      expected.add(`kaannokset/${locale}/${category}/${id}.md`);
      reviews.add(`${id}:${locale}`);
    }
  }
  if (paths.length !== expected.size || new Set(paths).size !== paths.length ||
      paths.some(file => !expected.has(file))) return null;
  return { ids, images, reviews };
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function appendedKeys(before, after, expected) {
  if (!isRecord(before) || !isRecord(after)) return false;
  const previous = Object.keys(before);
  if (previous.some(key => !Object.hasOwn(after, key) ||
      JSON.stringify(before[key]) !== JSON.stringify(after[key]))) return false;
  const added = Object.keys(after).filter(key => !Object.hasOwn(before, key));
  return added.length === expected.size && added.every(key => expected.has(key));
}

function appendedRows(before, after, field, key, expected) {
  if (!isRecord(before) || !isRecord(after) ||
      !Array.isArray(before[field]) || !Array.isArray(after[field])) return false;
  const metadata = value => Object.fromEntries(Object.entries(value).filter(([name]) => name !== field));
  if (JSON.stringify(metadata(before)) !== JSON.stringify(metadata(after))) return false;
  const map = rows => {
    if (rows.some(row => !isRecord(row) || typeof row[key] !== "string" || !row[key])) return null;
    if (new Set(rows.map(row => row[key])).size !== rows.length) return null;
    return Object.fromEntries(rows.map(row => [row[key], row]));
  };
  return appendedKeys(map(before[field]), map(after[field]), expected);
}

function isAppendOnlyRecipeBatch(changes, before, after) {
  const batch = recipeBatchPaths(changes.map(change => change.path));
  if (!batch || changes.some(change =>
    change.status !== (batchManifests.includes(change.path) ? "M" : "A"))) return false;
  const [overlays, pending, pairs, reviews] = batchManifests;
  return appendedRows(before[overlays], after[overlays], "files", "path", batch.images) &&
    appendedKeys(before[pending], after[pending], batch.ids) &&
    appendedRows(before[pairs], after[pairs], "sources", "recipe_id", batch.ids) &&
    appendedKeys(before[reviews], after[reviews], batch.reviews);
}

function inspectAppendOnlyRecipeBatch(base, head, paths) {
  if (!recipeBatchPaths(paths)) return false;
  try {
    const fields = execFileSync("git", ["diff", "--name-status", "-z", "--no-renames", "--diff-filter=ACDMRT", base, head], { encoding: "utf8" }).split("\0");
    if (fields.pop() !== "" || fields.length % 2 !== 0) return false;
    const changes = [];
    for (let i = 0; i < fields.length; i += 2) changes.push({ status: fields[i], path: fields[i + 1] });
    if (changes.length !== paths.length || changes.some(change => !paths.includes(change.path))) return false;
    const read = revision => Object.fromEntries(batchManifests.map(file => [file,
      JSON.parse(execFileSync("git", ["show", revision + ":" + file], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }))]));
    return isAppendOnlyRecipeBatch(changes, read(base), read(head));
  } catch { return false; }
}

const glycemicDataFiles = new Set([
  "docs/nutrition/glycemic-index-records.json",
  "docs/nutrition/glycemic-load-pilot-input.json",
  "docs/nutrition/glycemic-load-recipe-bindings.json",
  "docs/nutrition/glycemic-load-recipe-aliases.json",
]);

const nutritionSourceFiles = new Set([
  "docs/nutrition/food-records.json",
  "docs/nutrition/afcd-release-3-reference.json",
  "docs/nutrition/fineli-release-20-reference.json",
  "docs/nutrition/cnf-2026-reference.json",
]);

// Exact planning outputs only. Unknown neighboring files retain full checks.
const planningJson = new Set([
  "docs/nutrition/gk80-carnitas-couscous/operation145/next-queue.json",
  "docs/nutrition/gk80-operation146/queue.json",
  "docs/nutrition/gk80-run8/inventory.json",
]);

const staticTests = [
  "tests/static-output.test.ts",
  "tests/seo-audit.test.ts",
  "tests/blog.test.ts",
  "tests/navigation.test.ts"
];
const translationTests = [
  "tests/translations.test.ts",
  "tests/translation-review.test.ts",
  "tests/translation-batch-partition.test.ts",
  "tests/translation-publication-index.test.ts",
  "tests/f25-source-release-gate.test.ts"
];
const nutritionTests = ["tests/nutrition-model.test.ts", "tests/nutrition-evidence.test.ts"];
const glycemicTests = ["tests/glycemic-load.test.ts", "tests/glycemic-coverage-inventory.test.ts"];

function addNutritionChecks(plan) {
  plan.runNutrition = true;
  plan.runBuild = true;
  plan.runStatic = true;
  plan.needsNode = true;
}

function addGlycemicChecks(plan) {
  plan.runGlycemic = true;
  plan.runBuild = true;
  plan.runStatic = true;
  plan.needsNode = true;
}

function addBrowserSuite(plan, suite) {
  plan.runBrowser = true;
  plan.runBuild = true;
  plan.runStatic = true;
  plan.needsNode = true;
  plan.browserSuites.add(suite);
}

function fullPlan(paths) {
  return {
    full: true,
    wideTests: true,
    runContent: paths.some((file) =>
      (/^(?:reseptit|kaannokset)\/.+\.md$/i.test(file) && !file.includes("/_mallipohjat/")) ||
      /^docs\/nutrition\/calculations\/[a-z0-9-]+\.json$/i.test(file)),
    runNutrition: false,
    runGlycemic: false,
    runTranslationReview: true,
    runImages: true,
    runStatic: true,
    runBrowser: true,
    browserSuites: ["smoke", "ui", "routes", "images"],
    runBuild: true,
    runContentSync: false,
    runTypecheck: false,
    needsNode: true,
    unitTests: ["*"],
  };
}

function classifyPaths(paths, { forceFull = false, classificationFailed = false, cacheIgnoreOnly = false, appendOnlyRecipeBatch = false } = {}) {
  const valid = Array.isArray(paths) && paths.every(value => typeof value === "string" && value.trim());
  const normalized = valid ? paths.map((value) => value.replaceAll("\\", "/")) : [];
  const fallback = () => fullPlan(normalized);
  if (!valid || forceFull || classificationFailed || paths.length === 0) return fallback();
  if (appendOnlyRecipeBatch && recipeBatchPaths(normalized)) {
    return { ...fullPlan(normalized), full: false, browserSuites: ["smoke", "routes", "images"] };
  }

  const plan = {
    full: false,
    wideTests: false,
    runContent: false,
    runNutrition: false,
    runGlycemic: false,
    runTranslationReview: false,
    runImages: false,
    runStatic: false,
    runBrowser: false,
    browserSuites: new Set(),
    runBuild: false,
    runContentSync: false,
    runTypecheck: false,
    needsNode: false,
    unitTests: new Set(),
  };
  for (const file of normalized) {
    if (file === ".gitignore" && cacheIgnoreOnly) continue;
    if (planningJson.has(file)) continue;
    // Review prose can also be a sealed approval input.
    if (file.startsWith("docs/research/")) return fallback();
    if (/^reseptit\/.+\.md$/i.test(file)) {
      if (file.includes("/_mallipohjat/")) return fallback();
      plan.runContent = true;
      // All ordinary FI recipes still receive the mandatory site build,
      // route generation, publication preflight and changed-content checks.
      // Full nutrition/GK regression suites are reserved for evidence, data
      // and calculation-engine changes selected by their own paths below.
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      continue;
    }
    if (/^kaannokset\/.+\.md$/i.test(file)) {
      plan.runContent = true;
      plan.runTranslationReview = true;
      plan.needsNode = true;
      continue;
    }
    if (nutritionSourceFiles.has(file) || /^docs\/nutrition\/batches\/.+\.json$/i.test(file)) {
      addNutritionChecks(plan);
      if (file === "docs/nutrition/food-records.json") addGlycemicChecks(plan);
      continue;
    }
    if (/^docs\/nutrition\/calculations\/[a-z0-9-]+\.json$/i.test(file)) {
      plan.runContent = true;
      addNutritionChecks(plan);
      addGlycemicChecks(plan);
      continue;
    }
    if (/^site\/(?:scripts|tests)\/(?:test_)?gi_(?:sqlite[^/]*|gk_maintainer)\.(?:py|mjs)$/.test(file)) {
      addNutritionChecks(plan);
      addGlycemicChecks(plan);
      continue;
    }
    if (glycemicDataFiles.has(file) || /^docs\/nutrition\/glycemic-[a-z0-9-]+\.json$/i.test(file) ||
        file === "site/scripts/glycemic-load-model.ts" ||
        file === "site/scripts/glycemic-load-pilot.ts" ||
        file === "site/scripts/glycemic-coverage-inventory.ts") {
      addGlycemicChecks(plan);
      continue;
    }
    if (/^docs\/nutrition\/estimates-[a-z0-9-]+\.md$/i.test(file)) {
      addNutritionChecks(plan);
      continue;
    }
    if (/^docs\/nutrition\/glycemic-[a-z0-9-]+\.md$/i.test(file)) {
      addGlycemicChecks(plan);
      continue;
    }
    if (/^docs\/nutrition\/.+\.json$/i.test(file)) return fallback();
    if (file === "meta/kaannokset/human-review-evidence.json" ||
        file === "meta/kaannokset/codex-review-evidence.json" ||
        file === "site/scripts/translation-semantic-review.ts" ||
        file === "site/scripts/validate-changed-content.ts" ||
        file === "site/scripts/translation-review.ts" ||
        file === "site/scripts/translation-queue.ts" ||
        file === "site/scripts/translation-queue-cli.ts" ||
        file === "site/scripts/translation-audit.ts") {
      plan.runTranslationReview = true;
      plan.needsNode = true;
      continue;
    }
    if (file.startsWith("meta/kaannokset/")) return fallback();
    if (file.startsWith("kuvat/")) {
      plan.runImages = true;
      plan.runBuild = true;
      plan.needsNode = true;
      continue;
    }
    if (file === ".github/workflows/pages.yml" || file === "site/package.json" ||
        file === "site/package-lock.json" || file === "site/scripts/build-content.ts" ||
        file === "site/scripts/select-ci-checks.mjs" || file.startsWith("site/scripts/ci-")) {
      return fallback();
    }
    if (file.startsWith("site/tests/")) {
      const testPath = file.slice("site/".length);
      const suite = Object.keys(browserSuites).find(name => browserSuites[name].includes(testPath));
      if (suite) {
        addBrowserSuite(plan, suite);
      } else if (testPath === previewBrowserTest) {
        // The dedicated preview workflow runs this feature-flagged test.
        addBrowserSuite(plan, "smoke");
      } else if (/\.browser\.test\.ts$/.test(file)) {
        return fallback();
      } else if (testPath === "tests/image-pipeline.test.ts") {
        plan.runImages = true;
        plan.runBuild = true;
      } else if (staticTests.includes(testPath)) {
        plan.runStatic = true;
        plan.runBuild = true;
      } else if (/\.test\.ts$/.test(file)) {
        plan.unitTests.add(testPath);
        if (testPath === "tests/recipe-search.test.ts") {
          plan.runBuild = true;
          plan.runStatic = true;
        }
      } else {
        return fallback();
      }
      plan.needsNode = true;
      continue;
    }
    if (file === "site/scripts/nutrition-model.ts" || file === "site/scripts/nutrition-evidence.ts") {
      addNutritionChecks(plan);
      continue;
    }
    if (file === "site/scripts/nutrition-audit.ts") {
      plan.runNutrition = true;
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      continue;
    }
    if (file.startsWith("site/src/content/")) {
      const testsBySource = new Map([
        ["site/src/content/markdown.ts", ["tests/markdown-safety.test.ts", "tests/recipe-schema.test.ts"]],
        ["site/src/content/recipe-search.ts", ["tests/recipe-search.test.ts"]],
        ["site/src/content/recipe-validation.ts", ["tests/recipe-schema.test.ts"]],
        ["site/src/content/route-data.ts", ["tests/route-content.test.ts", "tests/published-content.test.ts"]],
        ["site/src/content/schema.ts", ["tests/recipe-schema.test.ts"]],
      ]);
      const tests = testsBySource.get(file);
      if (!tests) return fallback();
      for (const testFile of tests) plan.unitTests.add(testFile);
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      continue;
    }
    if (file === "site/src/features/recipes/recipe-search.ts") {
      plan.unitTests.add("tests/recipe-search.test.ts");
      addBrowserSuite(plan, "smoke");
      addBrowserSuite(plan, "ui");
      continue;
    }
    if (file === "site/src/features/recipes/image-layout.ts") {
      addBrowserSuite(plan, "smoke");
      addBrowserSuite(plan, "images");
      continue;
    }
    if (file.startsWith("site/src/features/blog/") && /\.ts$/.test(file)) {
      addBrowserSuite(plan, "smoke");
      continue;
    }
    if (file.startsWith("site/src/") && /\.(?:tsx|css)$/.test(file)) {
      addBrowserSuite(plan, "smoke");
      if (file === "site/src/SiteNavigation.tsx") {
        addBrowserSuite(plan, "ui");
        addBrowserSuite(plan, "routes");
      } else if (file === "site/src/router.tsx" || file === "site/src/SeoMeta.tsx") {
        addBrowserSuite(plan, "ui");
        addBrowserSuite(plan, "routes");
      } else if (file.startsWith("site/src/features/glycemic-load/") ||
                 file === "site/src/features/recipes/RecipesPage.tsx" ||
                 file === "site/src/features/recipes/RecipePage.tsx") {
        addBrowserSuite(plan, "ui");
      } else if (file.startsWith("site/src/features/recipes/") && /image/i.test(file)) {
        addBrowserSuite(plan, "images");
      }
      continue;
    }
    if (file.startsWith("site/public/")) {
      plan.runStatic = true;
      plan.runBuild = true;
      plan.needsNode = true;
      continue;
    }
    if (file.startsWith("site/scripts/")) return fallback();
    if (file.startsWith("site/")) return fallback();
    if (/^(?:README\.md|AGENTS\.md|docs\/|meta\/|\.github\/ISSUE_TEMPLATE\/|\.markdownlint-cli2\.jsonc$)/.test(file)) continue;
    return fallback();
  }

  if (plan.runBuild) plan.runStatic = true;
  plan.runTypecheck = !plan.runBuild && normalized.some(file => /^site\/(?:src|scripts|tests)\/.+\.(?:[cm]?ts|tsx)$/.test(file));
  plan.runContentSync = plan.runTypecheck;
  if (plan.runContent || plan.runNutrition || plan.runGlycemic || plan.runTranslationReview ||
      plan.runImages || plan.runStatic || plan.runBrowser || plan.unitTests.size > 0) {
    plan.needsNode = true;
  }
  // The dedicated steps already run these files, even when a test itself changed.
  if (plan.runTranslationReview) {
    for (const test of translationTests) plan.unitTests.delete(test);
  }
  // The model entry point imports the binding tests even in the focused suite.
  if (plan.runNutrition || plan.unitTests.has("tests/nutrition-model.test.ts")) {
    plan.unitTests.delete("tests/nutrition-model-binding.test.ts");
  }
  if (plan.runNutrition) for (const test of nutritionTests) plan.unitTests.delete(test);
  if (plan.runGlycemic) for (const test of glycemicTests) plan.unitTests.delete(test);
  plan.unitTests = [...plan.unitTests].sort();
  plan.browserSuites = ["smoke", "ui", "routes", "images"].filter((suite) => plan.browserSuites.has(suite));
  return plan;
}

function applyEventPolicy(plan, eventName) {
  if (eventName === "push" && plan.needsNode) {
    plan.runBuild = true;
    plan.runStatic = true;
  }
  if (plan.runBuild) {
    plan.runStatic = true;
    plan.runTypecheck = false;
    plan.runContentSync = false;
  }
  if (plan.runStatic) {
    // The event policy can enable the static suite after paths are classified.
    plan.unitTests = plan.unitTests.filter(file => !staticTests.includes(file));
  }
  return plan;
}

function getChangedPaths() {
  let base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA || "HEAD";
  if (process.env.EVENT_NAME === "workflow_dispatch") {
    base = execFileSync("git", ["rev-parse", `${head}^`], { encoding: "utf8" }).trim();
  }
  if (!base || /^0+$/.test(base)) throw new Error("Base revision is unavailable.");
  const paths = execFileSync("git", ["diff", "--name-only", "-z", "--no-renames", "--diff-filter=ACDMRT", base, head], { encoding: "utf8" })
    .split("\0").filter(Boolean);
  return { paths, cacheIgnoreOnly: paths.includes(".gitignore") && isCacheIgnoreOnly(base, head),
    appendOnlyRecipeBatch: inspectAppendOnlyRecipeBatch(base, head, paths) };
}

function isCacheIgnoreOnly(base, head) {
  const change = execFileSync("git", ["diff", "--raw", "--no-renames", base, head, "--", ".gitignore"], { encoding: "utf8" });
  if (!/^:100644 100644 [a-f0-9]+ [a-f0-9]+ M\t\.gitignore\r?\n$/.test(change)) return false;

  const before = execFileSync("git", ["show", `${base}:.gitignore`], { encoding: "utf8" });
  const after = execFileSync("git", ["show", `${head}:.gitignore`], { encoding: "utf8" });
  const [longer, shorter] = before.length > after.length ? [before, after] : [after, before];
  const rule = /^\/\.wrangler\/cache\/\n/gm;
  return [...longer.matchAll(rule)].length === 1 && longer.replace(rule, "") === shorter;
}

/**
 * The FI audit must be refreshed when recipe sources or the published recipe
 * projection can change. Do not run it for translation-only, UI-only or docs
 * work: the scan covers FI source files and FI generated RecipeEntry output.
 */
function shouldRunFiEditorialAudit(paths) {
  if (!Array.isArray(paths)) return true; // Untrusted changed-path input: fail safe.
  return paths.some((raw) => {
    if (typeof raw !== "string" || !raw.trim()) return true;
    const file = raw.replaceAll("\\", "/");
    if (/^reseptit\/.+\.md$/i.test(file) && !file.includes("/_mallipohjat/")) return true;
    if (file === ".github/workflows/pages.yml") return true; // Verify this gate in its own PR.
    // The quarantine membership is consumed by both the raw FI inventory and
    // the published content build. Treat a change as an audit input mutation.
    if (file === "site/scripts/public-recipe-quarantine.json") return true;
    if (/^site\/scripts\/.+\.(?:mjs|ts)$/i.test(file)) return true;
    if (/^site\/src\/content\/.+\.ts$/i.test(file)) return true;
    return false;
  });
}

function writeGithubOutputs(plan, paths, classificationError) {
  if (!process.env.GITHUB_OUTPUT) return;
  const delimiter = `paths_${randomUUID().replaceAll("-", "")}`;
  const rows = [
    `changed_paths<<${delimiter}`,
    ...paths,
    delimiter,
    ...Object.entries(plan).filter(([key]) => key !== "unitTests" && key !== "browserSuites").map(([key, value]) =>
      `${{
        full: "full",
        wideTests: "wide_tests",
        runContent: "run_content",
        runNutrition: "run_nutrition",
        runGlycemic: "run_glycemic",
        runTranslationReview: "run_translation_review",
        runImages: "run_images",
        runStatic: "run_static",
        runBrowser: "run_browser",
        runBuild: "run_build",
        needsNode: "needs_node",
        runContentSync: "run_content_sync",
        runTypecheck: "run_typecheck",
      }[key]}=${String(value)}`),
    `unit_tests=${Array.isArray(plan.unitTests) ? plan.unitTests.join(" ") : "*"}`,
    `browser_suites=${plan.browserSuites.join(" ")}`,
    `run_editorial_audit=${String(plan.runBuild && (
      shouldRunFiEditorialAudit(paths) ||
      process.env.EVENT_NAME === "workflow_dispatch" ||
      Boolean(classificationError)
    ))}`,
    `classification_error=${String(Boolean(classificationError))}`,
  ];
  appendFileSync(process.env.GITHUB_OUTPUT, `${rows.join("\n")}\n`, "utf8");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let paths = [];
  let classificationError = null;
  let cacheIgnoreOnly = false;
  let appendOnlyRecipeBatch = false;
  try {
    if (process.env.CHANGED_PATHS_JSON) paths = JSON.parse(process.env.CHANGED_PATHS_JSON);
    else ({ paths, cacheIgnoreOnly, appendOnlyRecipeBatch } = getChangedPaths());
    if (!Array.isArray(paths) || paths.some(file => typeof file !== "string" || !file.trim())) throw new Error("Changed paths must be non-empty strings.");
  } catch (error) {
    classificationError = error instanceof Error ? error.message : String(error);
    paths = [];
  }
  const deletedTest = !process.env.CHANGED_PATHS_JSON && paths.some(file =>
    /^site\/tests\/.+\.test\.ts$/.test(file) && !existsSync(file));
  const plan = applyEventPolicy(classifyPaths(paths, {
    forceFull: process.env.FORCE_FULL === "true" || deletedTest,
    classificationFailed: Boolean(classificationError),
    cacheIgnoreOnly,
    appendOnlyRecipeBatch,
  }), process.env.EVENT_NAME);
  writeGithubOutputs(plan, paths, classificationError);
  if (classificationError) console.warn(`Path classification failed; full checks selected: ${classificationError}`);
  console.log(JSON.stringify({ ...plan, unitTests: Array.isArray(plan.unitTests) ? plan.unitTests : ["all unit tests"], changedPaths: paths.length }, null, 2));
}

export { applyEventPolicy, classifyPaths, shouldRunFiEditorialAudit, isAppendOnlyRecipeBatch };
