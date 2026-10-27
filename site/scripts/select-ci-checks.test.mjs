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
