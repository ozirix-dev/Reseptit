import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FoodRecord } from "./nutrition-model";
import { calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadRecipeInput } from "./glycemic-load-model";

const root = path.resolve(import.meta.dirname, "../..");
const expectedRecipeIds = [
  "munakokkeli", "munakasmuffinit", "munakasrulla-pinaatti-tuorejuustolla", "munatacot-huevos-rancheros",
  "paprikauunimunakkaat", "shakshuka", "uunimuna-avokadot", "uunimunat-pinaatilla", "tortilla-de-patatas", "vhh-lihamureke",
];

const [input, foodRecords, giSource] = await Promise.all([
  readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((text) => JSON.parse(text)),
  readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((text) => JSON.parse(text) as FoodRecord[]),
  readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((text) => JSON.parse(text)),
]);

const inputs = input.recipes as GlycemicLoadRecipeInput[];
const actualIds = inputs.map((recipe) => recipe.recipeId);
if (actualIds.length !== expectedRecipeIds.length || new Set(actualIds).size !== actualIds.length
    || expectedRecipeIds.some((id) => !actualIds.includes(id))) {
  throw new Error("Glycemic-load pilot input must contain exactly the ten selected Fineli recipes.");
}

const giRecords = giSource.records as GlycemicIndexRecord[];
const sourceHashes = Object.fromEntries(await Promise.all(expectedRecipeIds.map(async (recipeId) => {
  const category = ["tortilla-de-patatas", "vhh-lihamureke"].includes(recipeId) ? "paaruoat" : "aamupalat";
  const recipePath = path.join(root, "reseptit", category, `${recipeId}.md`);
  const contents = (await readFile(recipePath, "utf8")).replaceAll("\r\n", "\n");
  return [recipeId, createHash("sha256").update(contents).digest("hex")];
})));

const results = inputs.map((recipe) => calculateGlycemicLoad(recipe, foodRecords, giRecords));
const report = {
  generatedAt: new Date().toISOString(),
  scope: "Internal calculation pilot only; not a measured post-meal glucose response and not published to recipe pages.",
  formula: "sum(GI_i × available carbohydrate_i per serving) / 100",
  fineliEvidence: input.fineliEvidence,
  massEvidence: input.massEvidence,
  giSourcePolicy: giSource.sourcePolicy,
  sourceHashes,
  results,
  summary: {
    recipes: results.length,
    calculated: results.filter((result) => result.status === "CALCULATED").length,
    insufficientSourceData: results.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length,
  },
};

const outputDir = path.join(root, "tmp/nutrition");
await mkdir(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "glycemic-load-pilot.json");
await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ ...report.summary, output: path.relative(root, outputPath), blockers: results.map((result) => ({ recipeId: result.recipeId, count: result.blockers.length })) }, null, 2));
