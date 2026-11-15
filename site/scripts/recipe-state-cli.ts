import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { git, readRecipeStateInputs, repoRoot } from "./recipe-state-inputs";
import { projectRecipeState } from "./recipe-state";

if (process.argv.length !== 2 || process.env.RECIPE_SOURCE_ROOT !== undefined) {
  throw Error("Run recipe-state-cli.ts without arguments or RECIPE_SOURCE_ROOT in a committed checkout.");
}

const sourceCommit = git("rev-parse", "HEAD").trim();
function verifySource() {
  if (git("rev-parse", "HEAD").trim() !== sourceCommit || git("status", "--porcelain") ||
    git("ls-files", "--others", "--ignored", "--exclude-standard", "--", "reseptit", "kaannokset", "kuvat")) {
    throw Error("Recipe state requires a clean checkout and source directories without ignored files.");
  }
}
verifySource();

function generate(script: string, ...args: string[]) {
  const start = performance.now();
  const result = spawnSync(process.execPath, ["--import", "tsx", `scripts/${script}.ts`, ...args], {
    cwd: path.join(repoRoot, "site"),
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error(`${script} failed: ${result.status ?? result.signal}`);
  return Math.round(performance.now() - start);
}

const inputGenerationMs = {
  content: generate("build-content"),
  nutrition: generate("nutrition-audit", "--strict"),
  glycemicLoad: generate("glycemic-load-pilot"),
};
const start = performance.now();
const inputs = await readRecipeStateInputs(sourceCommit);
const loaded = performance.now();
const state = projectRecipeState(sourceCommit, inputs);
const json = JSON.stringify(state, null, 2) + "\n";
const projected = performance.now();
verifySource();

const outputDir = path.join(repoRoot, "tmp/recipe-state");
const output = path.join(outputDir, "current.json");
const draft = path.join(outputDir, `.${randomUUID()}.json`);
await mkdir(outputDir, { recursive: true });
await writeFile(draft, json, { flag: "wx" });
try {
  await rename(draft, output);
} finally {
  await rm(draft, { force: true });
}
console.log(JSON.stringify({ sourceCommit, output, inputGenerationMs, readInputsMs: Math.round(loaded - start),
  projectionMs: Math.round(projected - loaded), records: state.recipes.length, conflicts: state.conflicts.length,
  counts: state.counts }, null, 2));
