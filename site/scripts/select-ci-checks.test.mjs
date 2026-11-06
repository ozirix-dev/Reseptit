import {execFileSync} from 'node:child_process';
import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from "node:assert/strict";
import test from "node:test";
import { applyEventPolicy, classifyPaths } from "./select-ci-checks.mjs";

test("docs-only changes select no site build or test suite", () => {
  const plan = classifyPaths(["docs/notes/recipe-process.md"]);
  assert.equal(plan.full, false);
  assert.equal(plan.needsNode, false);
  assert.deepEqual(plan.unitTests, []);
  assert.equal(plan.runBrowser, false);
  assert.equal(plan.runBuild, false);
});

test("translation evidence selects one dedicated suite and no build", () => {
  const plan = classifyPaths(["meta/kaannokset/codex-review-evidence.json", "site/scripts/translation-semantic-review.ts"]);
  assert.equal(plan.runTranslationReview, true);
  assert.equal(plan.runBuild, false);
  assert.deepEqual(plan.unitTests, []);
  const recipe = classifyPaths(["kaannokset/th/paaruoat/bouillabaisse.md"]);
  assert.equal(recipe.runContent, true);
  assert.equal(recipe.runTranslationReview, true);
  assert.equal(recipe.runBuild, false);
});

test("recipe additions, edits, and deletions select nutrition plus GI/GK checks", () => {
  for (const operation of ["add", "edit", "delete"]) {
    const plan = classifyPaths(["reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md"]);
    assert.equal(plan.runContent, true, operation);
    assert.equal(plan.runNutrition, true, operation);
    assert.equal(plan.runGlycemic, true, operation);
    assert.equal(plan.runBuild, true, operation);
    assert.equal(plan.unitTests.includes("tests/glycemic-coverage-inventory.test.ts"), true, operation);
    assert.equal(plan.unitTests.includes("tests/glycemic-load.test.ts"), true, operation);
    assert.equal(plan.runBrowser, false, operation);
    assert.equal(plan.full, false, operation);
  }
});

test("PR and main push both audit recipe coverage; only main push publishes", () => {
  const recipePath = ["reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md"];
  const pullRequest = applyEventPolicy(classifyPaths(recipePath), "pull_request");
  const mainPush = applyEventPolicy(classifyPaths(recipePath), "push");
  for (const plan of [pullRequest, mainPush]) {
    assert.equal(plan.runNutrition, true);
    assert.equal(plan.runGlycemic, true);
    assert.equal(plan.runBuild, true);
    assert.equal(plan.runStatic, true);
  }
  assert.equal(pullRequest.publish, false);
  assert.equal(mainPush.publish, true);
});

test("separately passing recipe and GI/GK PR path sets remain audited when combined", () => {
  const recipePrPaths = ["reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md"];
  const giPrPaths = ["docs/nutrition/glycemic-load-pilot-input.json", "docs/nutrition/glycemic-index-records.json"];
  const recipePr = classifyPaths(recipePrPaths);
  const giPr = classifyPaths(giPrPaths);
  const combined = classifyPaths([...recipePrPaths, ...giPrPaths]);
  assert.equal(recipePr.runGlycemic, true);
  assert.equal(recipePr.runNutrition, true);
  assert.equal(recipePr.runBuild, true);
  assert.equal(giPr.runGlycemic, true);
  assert.equal(giPr.runBuild, true);
  assert.deepEqual(combined.unitTests, [
    "tests/glycemic-coverage-inventory.test.ts",
    "tests/glycemic-load.test.ts",
    "tests/nutrition-evidence.test.ts",
    "tests/nutrition-model.test.ts",
  ]);

  const combinedPr = applyEventPolicy(classifyPaths([...recipePrPaths, ...giPrPaths]), "pull_request");
  const combinedMainPush = applyEventPolicy(classifyPaths([...recipePrPaths, ...giPrPaths]), "push");
  for (const plan of [combinedPr, combinedMainPush]) {
    assert.equal(plan.runNutrition, true);
    assert.equal(plan.runGlycemic, true);
    assert.equal(plan.runBuild, true);
    assert.equal(plan.runStatic, true);
    assert.equal(plan.unitTests.includes("tests/glycemic-coverage-inventory.test.ts"), true);
    assert.equal(plan.unitTests.includes("tests/glycemic-load.test.ts"), true);
  }
  assert.equal(combinedPr.publish, false);
  assert.equal(combinedMainPush.publish, true);
});

test("GI/GK model changes retain calculation regression and build audits", () => {
  const plan = classifyPaths(["site/scripts/glycemic-load-model.ts"]);
  assert.deepEqual(plan.unitTests, [
    "tests/glycemic-coverage-inventory.test.ts",
    "tests/glycemic-load.test.ts",
  ]);
  assert.equal(plan.runGlycemic, true);
  assert.equal(plan.runBuild, true);
  assert.equal(plan.runBrowser, false);
});

test("GI/GK recipe bindings, aliases, and calculation snapshots select GI/GK checks", () => {
  for (const file of [
    "docs/nutrition/glycemic-load-recipe-bindings.json",
    "docs/nutrition/glycemic-load-recipe-aliases.json",
    "docs/nutrition/glycemic-coverage-current-2026-10-25.json",
  ]) {
    const plan = classifyPaths([file]);
    assert.equal(plan.runGlycemic, true, file);
    assert.equal(plan.runBuild, true, file);
    assert.deepEqual(plan.unitTests, [
      "tests/glycemic-coverage-inventory.test.ts",
      "tests/glycemic-load.test.ts",
    ], file);
  }
});

test("nutrition references and recipe calculations select audit and evidence checks", () => {
  const reference = classifyPaths(["docs/nutrition/fineli-release-20-reference.json"]);
  assert.equal(reference.runNutrition, true);
  assert.equal(reference.runBuild, true);
  assert.equal(reference.runGlycemic, false);

  const calculation = classifyPaths(["docs/nutrition/calculations/example-recipe.json"]);
  assert.equal(calculation.runContent, true);
  assert.equal(calculation.runNutrition, true);
  assert.equal(calculation.runGlycemic, true);
  assert.equal(calculation.runBuild, true);
});

test("unknown nutrition JSON is fail-closed while report Markdown stays lightweight", () => {
  assert.equal(classifyPaths(["docs/nutrition/new-calculation-source.json"]).full, true);
  const report = classifyPaths(["docs/nutrition/fineli-integration-plan.md"]);
  assert.equal(report.full, false);
  assert.equal(report.needsNode, false);
  assert.deepEqual(report.unitTests, []);
});

test("UI changes run the build and browser checks", () => {
  const plan = classifyPaths(["site/src/features/recipes/recipe-card.tsx"]);
  assert.equal(plan.runBuild, true);
  assert.equal(plan.runBrowser, true);
  assert.equal(plan.full, false);
});

test("generated-content tests prepare only their generated input", () => {
  const plan = classifyPaths(["site/tests/published-content.test.ts"]);
  assert.equal(plan.runContentSync, true);
  assert.equal(plan.runBuild, false);
  assert.deepEqual(plan.unitTests, ["tests/published-content.test.ts"]);
});

test("static and browser tests build the output before their focused runners", () => {
  const staticPlan = classifyPaths(["site/tests/static-output.test.ts"]);
  assert.equal(staticPlan.runBuild, true);
  assert.equal(staticPlan.runStatic, true);
  assert.deepEqual(staticPlan.unitTests, []);

  const browserPlan = classifyPaths(["site/tests/browser-smoke.test.ts"]);
  assert.equal(browserPlan.runBuild, true);
  assert.equal(browserPlan.runBrowser, true);
  assert.deepEqual(browserPlan.unitTests, []);
});

test("workflow and classification failures select the full fallback", () => {
  assert.equal(classifyPaths([".github/workflows/pages.yml"]).full, true);
  assert.equal(classifyPaths([], { classificationFailed: true }).full, true);
  assert.equal(classifyPaths(["site/new-unknown-config.toml"]).full, true);
});

test("full fallback retains the changed-content gate for mixed and forced runs", () => {
  const translation = "kaannokset/th/paaruoat/hyderabadi-kanabiryani.md";
  const other = "site/scripts/approved-recipe-note-edits.ts";
  for (const paths of [[translation, other], [other, translation]]) {
    const plan = classifyPaths(paths);
    assert.equal(plan.full, true);
    assert.equal(plan.runContent, true);
  }
  assert.equal(classifyPaths([translation], { forceFull: true }).runContent, true);
  assert.equal(classifyPaths(["reseptit/_mallipohjat/resepti/resepti_pohja.md"]).runContent, false);
  assert.equal(classifyPaths([other, "docs/nutrition/calculations/bouillabaisse.json"]).runContent, true);
});

test('only exact unbound planning JSONs avoid a full suite; adjacent packets remain protected', () => {
  for (const file of [
    'docs/nutrition/gk80-carnitas-couscous/operation145/next-queue.json',
    'docs/nutrition/gk80-operation146/queue.json',
    'docs/nutrition/gk80-run8/inventory.json',
  ]) {
    const plan = classifyPaths([file]);
    assert.equal(plan.full, false, file);
    assert.equal(plan.needsNode, false, file);
  }
  for (const file of [
    'docs/nutrition/gk80-operation146/inputs.json',
    'docs/nutrition/gk100-approved-releases/v31-eight.json',
    'docs/research/example/candidate.json',
    'docs/research/example/verify.py',
    'docs/research/example/review.md',
  ]) assert.equal(classifyPaths([file]).full, true, file);
  const combined = classifyPaths(['docs/nutrition/gk80-run8/inventory.json', 'docs/nutrition/food-records.json']);
  assert.equal(combined.runGlycemic, true);
  assert.equal(combined.runNutrition, true);
  assert.equal(combined.runBuild, true);
});

test('malformed changed paths fall back to full checks without crashing', () => {
  for (const paths of [null, {}, [false], [3], [''], ['  '], ['docs/notes.md', null]]) {
    const plan = classifyPaths(paths);
    assert.equal(plan.full, true);
    assert.equal(plan.runBuild, true);
    assert.equal(plan.runBrowser, true);
  }
});

test('search tests build the GK-derived filter data before running', () => {
  const plan = classifyPaths(['site/tests/recipe-search.test.ts']);
  assert.equal(plan.runBuild, true);
  assert.equal(plan.runStatic, true);
  assert.equal(plan.runContentSync, false);
});

test('malformed CLI input emits full-check outputs and a classification error', () => {
  const fixture = mkdtempSync(path.join(tmpdir(), 'recipe-ci-input-'));
  try {
    const output = path.join(fixture, 'outputs');
    const result = JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL('./select-ci-checks.mjs', import.meta.url))], {
      env: {...process.env, CHANGED_PATHS_JSON: '[false]', GITHUB_OUTPUT: output,
        EVENT_NAME: 'pull_request', FORCE_FULL: 'false', DEPLOY: 'false'},
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    }));
    assert.equal(result.full, true);
    assert.equal(result.runBuild, true);
    assert.equal(result.publish, false);
    assert.ok(readFileSync(output, 'utf8').includes('classification_error=true'));
  } finally { rmSync(fixture, {recursive: true, force: true}); }
});

test("three-tier browser selection keeps docs and content fast", () => {
  assert.deepEqual(classifyPaths(["docs/review/new-recipe.md"]).browserSuites, []);
  assert.deepEqual(classifyPaths(["reseptit/paaruoat/kana.md"]).browserSuites, []);
  assert.deepEqual(classifyPaths(["kaannokset/th/paaruoat/kana.md"]).browserSuites, []);
  assert.deepEqual(classifyPaths(["kuvat/paaruoat/kana.webp"]).browserSuites, []);
});

test("UI and blog changes select the essential browser test", () => {
  for (const p of ["site/src/styles.css", "site/src/features/recipes/home-preview.css", "site/src/features/blog/blog-data.ts"]) {
    const plan = classifyPaths([p]);
    assert.deepEqual(plan.browserSuites, ["smoke"], p);
    assert.equal(plan.runBuild, true, p);
    assert.equal(plan.runBrowser, true, p);
  }
});

test("riskier browser changes add only their relevant deep suites", () => {
  assert.deepEqual(classifyPaths(["site/src/features/recipes/RecipesPage.tsx"]).browserSuites, ["smoke", "ui"]);
  assert.deepEqual(classifyPaths(["site/src/router.tsx"]).browserSuites, ["smoke", "ui", "routes"]);
  assert.deepEqual(classifyPaths(["site/src/SeoMeta.tsx"]).browserSuites, ["smoke", "ui", "routes"]);
  assert.deepEqual(classifyPaths(["site/src/features/recipes/image-layout.ts"]).browserSuites, ["smoke", "images"]);
  const search = classifyPaths(["site/src/features/recipes/recipe-search.ts"]);
  assert.deepEqual(search.browserSuites, ["smoke", "ui"]);
  assert.ok(search.unitTests.includes("tests/recipe-search.test.ts"));
});

test("test-file changes select relevant suite without running all browsers", () => {
  assert.deepEqual(classifyPaths(["site/tests/ci-essential.browser.test.ts"]).browserSuites, ["smoke"]);
  assert.deepEqual(classifyPaths(["site/tests/browser-smoke.test.ts"]).browserSuites, ["ui"]);
  assert.deepEqual(classifyPaths(["site/tests/route-loading.browser.test.ts"]).browserSuites, ["routes"]);
  assert.deepEqual(classifyPaths(["site/tests/responsive-images.browser.test.ts"]).browserSuites, ["images"]);
  assert.equal(classifyPaths(["site/tests/new-experimental.browser.test.ts"]).full, true);
});

test("multi-file diffs take a union; unknown or CI changes fail closed", () => {
  const p = classifyPaths(["site/src/features/recipes/image-layout.ts", "site/src/router.tsx"]);
  assert.deepEqual(p.browserSuites, ["smoke", "ui", "routes", "images"]);
  const unknown = classifyPaths(["site/src/features/assistant/unknown.ts"]);
  assert.equal(unknown.full, true);
  assert.deepEqual(unknown.browserSuites, ["smoke", "ui", "routes", "images"]);
  const ci = classifyPaths([".github/workflows/pages.yml"]);
  assert.equal(ci.full, true);
  assert.deepEqual(ci.browserSuites, ["smoke", "ui", "routes", "images"]);
});

test("browser-specific output is absent from docs-only and present on UI changes", () => {
  const content = classifyPaths(["docs/review/only-report.md"]);
  assert.equal(content.runBrowser, false);
  const changed = classifyPaths(["site/src/styles.css"]);
  assert.equal(changed.runBrowser, true);
  assert.deepEqual(changed.browserSuites, ["smoke"]);
});
