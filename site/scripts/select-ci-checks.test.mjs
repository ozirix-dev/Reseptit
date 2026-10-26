import assert from "node:assert/strict";
import test from "node:test";
import { classifyPaths } from "./select-ci-checks.mjs";

test("docs-only changes select no site build or test suite", () => {
  const plan = classifyPaths(["docs/notes/recipe-process.md"]);
  assert.equal(plan.full, false);
  assert.equal(plan.needsNode, false);
  assert.deepEqual(plan.unitTests, []);
  assert.equal(plan.runBrowser, false);
  assert.equal(plan.runBuild, false);
});

test("one recipe change selects its direct content check without browser tests", () => {
  const plan = classifyPaths(["reseptit/paaruoat/keitto.md"]);
  assert.equal(plan.runContent, true);
  assert.equal(plan.runBrowser, false);
  assert.equal(plan.runBuild, false);
  assert.equal(plan.full, false);
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

test("workflow and classification failures select the full fallback", () => {
  assert.equal(classifyPaths([".github/workflows/pages.yml"]).full, true);
  assert.equal(classifyPaths([], { classificationFailed: true }).full, true);
  assert.equal(classifyPaths(["site/new-unknown-config.toml"]).full, true);
});
