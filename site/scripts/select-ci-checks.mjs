import { randomUUID } from "node:crypto";
import { appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const allUnitTests = [
  "tests/servings.test.ts",
  "tests/published-content.test.ts",
  "tests/markdown-safety.test.ts",
  "tests/recipe-schema.test.ts",
  "tests/recipe-search.test.ts",
  "tests/route-content.test.ts",
  "tests/nutrition-model.test.ts",
  "tests/nutrition-evidence.test.ts",
  "tests/glycemic-load.test.ts",
  "tests/glycemic-coverage-inventory.test.ts",
];

function fullPlan() {
  return {
    full: true,
    runContent: false,
    runNutrition: false,
    runGlycemic: false,
    runTranslationReview: true,
    runImages: true,
    runStatic: true,
    runBrowser: true,
    runBuild: true,
    needsNode: true,
    unitTests: ["*"],
    publish: false,
  };
}

function classifyPaths(paths, { forceFull = false, classificationFailed = false } = {}) {
  if (forceFull || classificationFailed || paths.length === 0) return fullPlan();

  const plan = {
    full: false,
    runContent: false,
    runNutrition: false,
    runGlycemic: false,
    runTranslationReview: false,
    runImages: false,
    runStatic: false,
    runBrowser: false,
    runBuild: false,
    needsNode: false,
    unitTests: new Set(),
    publish: false,
  };
  const normalized = paths.map((value) => value.replaceAll("\\", "/"));

  for (const file of normalized) {
    if (/^(?:reseptit|kaannokset)\/.+\.md$/i.test(file)) {
      if (file.includes("/_mallipohjat/")) return fullPlan();
      plan.runContent = true;
      plan.needsNode = true;
      continue;
    }
    if (file === "docs/nutrition/food-records.json" || file.startsWith("docs/nutrition/batches/")) {
      plan.runNutrition = true;
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      continue;
    }
    if (/^docs\/nutrition\/calculations\/[a-z0-9-]+\.json$/i.test(file)) {
      plan.runContent = true;
      plan.needsNode = true;
      continue;
    }
    if (/^docs\/nutrition\/(?:glycemic-index-records|glycemic-load-pilot-input)\.json$/i.test(file) ||
        file === "site/scripts/glycemic-load-model.ts" ||
        file === "site/scripts/glycemic-load-pilot.ts" ||
        file === "site/scripts/glycemic-coverage-inventory.ts") {
      plan.runGlycemic = true;
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      plan.unitTests.add("tests/glycemic-load.test.ts");
      plan.unitTests.add("tests/glycemic-coverage-inventory.test.ts");
      continue;
    }
    if (file === "meta/kaannokset/human-review-evidence.json" ||
        file === "site/scripts/translation-review.ts" ||
        file === "site/scripts/translation-audit.ts") {
      plan.runTranslationReview = true;
      plan.needsNode = true;
      plan.unitTests.add("tests/translation-review.test.ts");
      if (file === "site/scripts/translation-audit.ts") {
        plan.unitTests.add("tests/translations.test.ts");
      }
      continue;
    }
    if (file.startsWith("kuvat/")) {
      plan.runImages = true;
      plan.needsNode = true;
      continue;
    }
    if (file === ".github/workflows/pages.yml" || file === "site/package.json" ||
        file === "site/package-lock.json" || file === "site/scripts/build-content.ts" ||
        file === "site/scripts/select-ci-checks.mjs" || file.startsWith("site/scripts/ci-")) {
      return fullPlan();
    }
    if (file.startsWith("site/tests/")) {
      const testPath = file.slice("site/".length);
      if (/\.browser\.test\.ts$/.test(file)) {
        plan.runBrowser = true;
        plan.runBuild = true;
        plan.runStatic = true;
      } else if (/\.test\.ts$/.test(file)) {
        plan.unitTests.add(testPath);
      } else {
        return fullPlan();
      }
      plan.needsNode = true;
      continue;
    }
    if (file === "site/scripts/nutrition-model.ts" || file === "site/scripts/nutrition-evidence.ts") {
      plan.runNutrition = true;
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      plan.unitTests.add("tests/nutrition-model.test.ts");
      plan.unitTests.add("tests/nutrition-evidence.test.ts");
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
      if (!tests) return fullPlan();
      for (const testFile of tests) plan.unitTests.add(testFile);
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      continue;
    }
    if (file.startsWith("site/src/") && /\.(?:tsx|css)$/.test(file)) {
      plan.runBrowser = true;
      plan.runBuild = true;
      plan.runStatic = true;
      plan.needsNode = true;
      continue;
    }
    if (file.startsWith("site/public/")) {
      plan.runStatic = true;
      plan.runBuild = true;
      plan.needsNode = true;
      continue;
    }
    if (file.startsWith("site/scripts/")) return fullPlan();
    if (file.startsWith("site/")) return fullPlan();
    if (/^(?:README\.md|AGENTS\.md|docs\/|meta\/|\.markdownlint-cli2\.jsonc$)/.test(file)) continue;
    return fullPlan();
  }

  if (plan.runBuild) plan.runStatic = true;
  if (plan.runContent || plan.runNutrition || plan.runGlycemic || plan.runTranslationReview ||
      plan.runImages || plan.runStatic || plan.runBrowser || plan.unitTests.size > 0) {
    plan.needsNode = true;
  }
  plan.unitTests = [...plan.unitTests].sort();
  return plan;
}

function getChangedPaths() {
  let base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA || "HEAD";
  if (process.env.EVENT_NAME === "workflow_dispatch") {
    base = execFileSync("git", ["rev-parse", `${head}^`], { encoding: "utf8" }).trim();
  }
  if (!base || /^0+$/.test(base)) throw new Error("Base revision is unavailable.");
  return execFileSync("git", ["diff", "--name-only", "--no-renames", "--diff-filter=ACDMRT", base, head], { encoding: "utf8" })
    .split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function writeGithubOutputs(plan, paths, classificationError) {
  if (!process.env.GITHUB_OUTPUT) return;
  const delimiter = `paths_${randomUUID().replaceAll("-", "")}`;
  const rows = [
    `changed_paths<<${delimiter}`,
    ...paths,
    delimiter,
    ...Object.entries(plan).filter(([key]) => key !== "unitTests").map(([key, value]) =>
      `${{
        full: "full",
        runContent: "run_content",
        runNutrition: "run_nutrition",
        runGlycemic: "run_glycemic",
        runTranslationReview: "run_translation_review",
        runImages: "run_images",
        runStatic: "run_static",
        runBrowser: "run_browser",
        runBuild: "run_build",
        needsNode: "needs_node",
        publish: "publish",
      }[key]}=${String(value)}`),
    `unit_tests=${Array.isArray(plan.unitTests) ? plan.unitTests.join(" ") : "*"}`,
    `classification_error=${String(Boolean(classificationError))}`,
  ];
  appendFileSync(process.env.GITHUB_OUTPUT, `${rows.join("\n")}\n`, "utf8");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let paths = [];
  let classificationError = null;
  try {
    paths = process.env.CHANGED_PATHS_JSON ? JSON.parse(process.env.CHANGED_PATHS_JSON) : getChangedPaths();
    if (!Array.isArray(paths)) throw new Error("Changed path list is not an array.");
  } catch (error) {
    classificationError = error instanceof Error ? error.message : String(error);
  }
  const plan = classifyPaths(paths, {
    forceFull: process.env.FORCE_FULL === "true",
    classificationFailed: Boolean(classificationError),
  });
  if (process.env.EVENT_NAME === "push" && plan.needsNode) {
    plan.runBuild = true;
    plan.runStatic = true;
    plan.publish = true;
  }
  if (process.env.EVENT_NAME === "workflow_dispatch" && process.env.DEPLOY === "true") {
    plan.runBuild = true;
    plan.runStatic = true;
    plan.needsNode = true;
    plan.publish = true;
  }
  if (plan.runBuild) plan.runStatic = true;
  writeGithubOutputs(plan, paths, classificationError);
  if (classificationError) console.warn(`Path classification failed; full checks selected: ${classificationError}`);
  console.log(JSON.stringify({ ...plan, unitTests: Array.isArray(plan.unitTests) ? plan.unitTests : ["all unit tests"], changedPaths: paths.length }, null, 2));
}

export { classifyPaths, allUnitTests };
