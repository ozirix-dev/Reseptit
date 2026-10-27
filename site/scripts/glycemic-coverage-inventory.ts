import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GlycemicLoadRecipeInput } from "./glycemic-load-model";
import { glycemicLoadInputHash } from "./glycemic-load-recipe-binding";
import { writeImmutableBaselineFile } from "./glycemic-coverage-baseline-file";
import { parseMarkdown } from "../src/content/markdown";
import { assertCoverageConsistency, buildBaselineSnapshot, buildCurrentCoverageInventory, type CoverageBaseline, type CoverageResult, type CurrentCoverageInput } from "./glycemic-coverage-inventory-model";

type JsonRecord = Record<string, unknown>;
type PilotReport = JsonRecord & {
  results: CoverageResult[];
  summary: { recipes: number; calculated: number; insufficientSourceData: number };
  sourceHashes: Record<string, string>;
  calculationInputHashes: Record<string, string>;
  calculationEvidenceHashes: Record<string, string>;
  calculationInputs: GlycemicLoadRecipeInput[];
  autoIncludedRecipeIds: string[];
};
type NutritionReport = JsonRecord & {
  counts: Record<string, number>;
  inventory: Array<{ recipe_id: string; status: string; source_path: string; servings: number; ingredients: Array<Record<string, unknown>> }>;
};
type InputReport = { recipes: GlycemicLoadRecipeInput[] };
type GICatalog = { records: Array<{ qualityTier: string }> };
type HistoricalInventory = { recipes: Array<{ recipeId: string; structureStale?: boolean }> };
type ReviewStartSnapshot = {
  sourceCommit: string;
  structuralBindingAnalysis: {
    rows: Array<{ recipeId: string; currentStatus: CoverageBaseline["recipes"][number]["status"]; otherBlockingCategories: string[]; otherBlockers: string[] }>;
  };
};

const siteDir = path.resolve(import.meta.dirname, "..");
const root = path.resolve(siteDir, "..");
const baselinePath = path.join(root, "docs/nutrition/glycemic-coverage-batch-2a-baseline.json");
const args = process.argv.slice(2);
const option = (name: string, fallback: string) => {
  const index = args.indexOf(name);
  if (index < 0) return fallback ? path.resolve(root, fallback) : null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a path under docs/nutrition.`);
  const resolved = path.resolve(root, value);
  if (!resolved.startsWith(`${path.resolve(root, "docs/nutrition")}${path.sep}`)) throw new Error(`${name} must stay under docs/nutrition.`);
  return resolved;
};
const baselineInputPath = option("--baseline", "docs/nutrition/glycemic-coverage-batch-2a-baseline.json")!;
const currentOutputPath = option("--output-json", "docs/nutrition/glycemic-coverage-current-2026-10-25.json")!;
const markdownOutputPath = option("--output-markdown", "docs/nutrition/glycemic-coverage-current-2026-10-25.md")!;
const batchBaselinePath = option("--capture-batch-baseline", "");
const batch2B2BaselinePath = option("--capture-batch-2b2-baseline", "");
const batch2B3BaselinePath = option("--capture-batch-2b3-baseline", "");
const batch2B4BaselinePath = option("--capture-batch-2b4-baseline", "");
const batch2B5BaselinePath = option("--capture-batch-2b5-baseline", "");
const batch2B6ABaselinePath = option("--capture-batch-2b6a-baseline", "");
const batch2B6BBaselinePath = option("--capture-batch-2b6b-baseline", "");
const batch2B6CBaselinePath = option("--capture-batch-2b6c-baseline", "");
const batch2B6DBaselinePath = option("--capture-batch-2b6d-baseline", "");
const readJson = async <T>(relativePath: string): Promise<T> => JSON.parse(await readFile(path.join(root, relativePath), "utf8")) as T;

const [pilot, nutrition, inputs, giCatalog, historical, reviewStart] = await Promise.all([
  readJson<PilotReport>("tmp/nutrition/glycemic-load-pilot.json"),
  readJson<NutritionReport>("tmp/nutrition/audit.json"),
  readJson<InputReport>("docs/nutrition/glycemic-load-pilot-input.json"),
  readJson<GICatalog>("docs/nutrition/glycemic-index-records.json"),
  readJson<HistoricalInventory>("docs/nutrition/glycemic-coverage-inventory-2026-10-25.json"),
  readJson<ReviewStartSnapshot>("docs/nutrition/glycemic-coverage-batch-2a-review-start.json"),
]);
const nutritionRecipeIds = nutrition.inventory.map((row) => row.recipe_id);
const rawInputIds = inputs.recipes.map((recipe) => recipe.recipeId);
const calculationInputs = pilot.calculationInputs;
const calculationInputIds = calculationInputs.map((recipe) => recipe.recipeId);
const hasDuplicates = (ids: string[]) => new Set(ids).size !== ids.length;
if (hasDuplicates(nutritionRecipeIds)) throw new Error("Nutrition inventory contains duplicate recipe IDs.");
if (hasDuplicates(rawInputIds)) throw new Error("GI/GK reviewed input contains duplicate recipe IDs.");
if (hasDuplicates(calculationInputIds)) throw new Error("Effective GI/GK inputs contain duplicate recipe IDs.");
if (hasDuplicates(pilot.autoIncludedRecipeIds)) throw new Error("Auto-included GI/GK recipe IDs contain duplicates.");
const nutritionIds = new Set(nutritionRecipeIds);
const rawInputSet = new Set(rawInputIds);
const effectiveInputSet = new Set(calculationInputIds);
const staleInputIds = rawInputIds.filter((id) => !nutritionIds.has(id));
if (staleInputIds.length) throw new Error("GI/GK input contains recipes outside the current nutrition inventory: " + staleInputIds.join(", ") + ".");
const expectedAutoIncluded = nutritionRecipeIds.filter((id) => !rawInputSet.has(id)).sort();
const actualAutoIncluded = [...pilot.autoIncludedRecipeIds].sort();
if (JSON.stringify(expectedAutoIncluded) !== JSON.stringify(actualAutoIncluded)) {
  throw new Error("Auto-included GK rows disagree with published recipes. Missing: "
    + expectedAutoIncluded.filter((id) => !actualAutoIncluded.includes(id)).join(", ")
    + "; unexpected: " + actualAutoIncluded.filter((id) => !expectedAutoIncluded.includes(id)).join(", ") + ".");
}
const missingEffectiveInputs = nutritionRecipeIds.filter((id) => !effectiveInputSet.has(id));
const unexpectedEffectiveInputs = calculationInputIds.filter((id) => !nutritionIds.has(id));
if (missingEffectiveInputs.length || unexpectedEffectiveInputs.length) {
  throw new Error("Coverage input sets disagree. Missing effective GK rows: " + missingEffectiveInputs.join(", ")
    + "; unexpected: " + unexpectedEffectiveInputs.join(", ") + ".");
}
assertCoverageConsistency(pilot.results, nutritionRecipeIds);
if (pilot.summary.recipes !== pilot.results.length
    || pilot.summary.calculated + pilot.summary.insufficientSourceData !== pilot.summary.recipes) {
  throw new Error("GI/GK pilot summary does not match its result rows.");
}
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const calculationInputHashes = Object.fromEntries(calculationInputs.map((recipe) => [recipe.recipeId, glycemicLoadInputHash(recipe)]));
const nutritionStatuses = Object.fromEntries(nutrition.inventory.map((row) => [row.recipe_id, row.status]));
const currentRecipeStructures = Object.fromEntries(await Promise.all(nutrition.inventory.map(async (row) => {
  const source = await readFile(path.join(root, row.source_path), "utf8");
  const parsed = parseMarkdown(source);
  if (!parsed) throw new Error(`Recipe has no frontmatter: ${row.recipe_id}`);
  return [row.recipe_id, {
    sourcePath: row.source_path,
    servings: Number(parsed.data.servings),
    ingredients: parsed.data.ingredients as Array<Record<string, unknown>>,
    cookingMethod: parsed.data.cooking_method ?? [],
  }] as const;
}))) as CurrentCoverageInput["currentRecipeStructures"];
const currentCalculationInputs = Object.fromEntries(calculationInputs.map((recipe) => {
  const sourceMaizeRecipe = new Set(["meksikolainen-quesadilla-sienilla", "indonesialainen-bakwan-maissifritter"]).has(recipe.recipeId)
    ? currentRecipeStructures[recipe.recipeId]?.ingredients.filter((ingredient) => /maissinjyv/i.test(String(ingredient.item ?? ""))) ?? []
    : [];
  if (sourceMaizeRecipe.length > 1) throw new Error(`Expected at most one source maize ingredient for ${recipe.recipeId}.`);
  const sourceQuantity = sourceMaizeRecipe[0];
  const maizeInput = recipe.ingredients.find((ingredient) => ingredient.name === "maissi");
  if (sourceQuantity && maizeInput) {
    const sourceAmount = typeof sourceQuantity.amount === "number" ? sourceQuantity.amount : null;
    const sourceUnit = typeof sourceQuantity.unit === "string" ? sourceQuantity.unit : null;
    const sourceMass = sourceAmount !== null && ["g", "gram", "grams"].includes(String(sourceUnit ?? "").toLocaleLowerCase("en-US")) ? sourceAmount : null;
    const inputQuantity = maizeInput.recipeQuantity;
    if (!inputQuantity || inputQuantity.amount !== sourceAmount || inputQuantity.unit !== sourceUnit || inputQuantity.massGrams !== sourceMass) {
      throw new Error(`Known maize recipe quantity for ${recipe.recipeId} must match the source recipe; keep accepted calculation grams separate.`);
    }
    if (recipe.recipeId === "meksikolainen-quesadilla-sienilla") {
      if (maizeInput.grams !== null || maizeInput.fineliRecordId || maizeInput.giRecordId) {
        throw new Error(`Unresolved maize composition/GI for ${recipe.recipeId} must not be promoted into an accepted calculation input.`);
      }
    } else if (recipe.recipeId === "indonesialainen-bakwan-maissifritter") {
      if (maizeInput.grams !== sourceMass || maizeInput.fineliRecordId !== "afcd-F003209-release-3" || maizeInput.giRecordId !== null) {
        throw new Error("Bakwan may use the source-backed raw fresh-corn composition, but its missing GI must remain blocking.");
      }
    }
  }
  const ingredients = recipe.ingredients.map((ingredient) => ingredient.name === "maissi" && sourceQuantity
    ? ingredient
    : ingredient as unknown as Record<string, unknown>);
  return [recipe.recipeId, { servings: recipe.servings, ingredients: ingredients as unknown as Array<Record<string, unknown>> }];
}));
const historicalStaleRecipeIds = historical.recipes.filter((row) => row.structureStale).map((row) => row.recipeId);
const giTierCounts = Object.fromEntries([...new Set(giCatalog.records.map((record) => record.qualityTier))].map((tier) => [tier, giCatalog.records.filter((record) => record.qualityTier === tier).length]));

if (args.includes("--capture-approved-baseline")) {
  const expectedSourceCommit = "5e9cdeb830f468ecf099e9c286f9344afe3b6b71";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Approved baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== pilot.results.length) throw new Error("Baseline capture omitted one or more source recipes.");
  await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, output: baselinePath }, null, 2));
  process.exit(0);
}

if (batchBaselinePath) {
  const expectedSourceCommit = "25902326b9fd89a30d8bfe48f2d1cd02879bd9df";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B1 baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  try {
    await readFile(batchBaselinePath, "utf8");
    throw new Error(`Refusing to overwrite existing batch baseline: ${batchBaselinePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 117 || baseline.incomplete !== 208) throw new Error("Batch 2B1 baseline does not match the approved 325 / 117 / 208 starting point.");
  await writeFile(batchBaselinePath, `${JSON.stringify(baseline, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, output: batchBaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B2BaselinePath) {
  const expectedSourceCommit = "66ba0464bd0099c2318ce9b5cd1ae3ca0bd841cd";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B2 baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  try {
    await readFile(batch2B2BaselinePath, "utf8");
    throw new Error(`Refusing to overwrite existing batch baseline: ${batch2B2BaselinePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 117 || baseline.incomplete !== 208 || baseline.giRecordCount !== 38) {
    throw new Error("Batch 2B2 baseline does not match the approved 325 / 117 / 208 / 38 starting point.");
  }
  await writeFile(batch2B2BaselinePath, `${JSON.stringify(baseline, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B2BaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B3BaselinePath) {
  const expectedSourceCommit = "95b87e3eb8b41dbef0913b8532fd8af67a5e56d6";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B3 baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  try {
    await readFile(batch2B3BaselinePath, "utf8");
    throw new Error(`Refusing to overwrite existing batch baseline: ${batch2B3BaselinePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 118 || baseline.incomplete !== 207 || baseline.giRecordCount !== 38) {
    throw new Error("Batch 2B3 baseline does not match the accepted 325 / 118 / 207 / 38 starting point.");
  }
  await writeFile(batch2B3BaselinePath, `${JSON.stringify(baseline, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B3BaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B4BaselinePath) {
  const expectedSourceCommit = "3099c246d188ee0484d1cd4b36e9e14d172c3610";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B4 baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  try {
    await readFile(batch2B4BaselinePath, "utf8");
    throw new Error(`Refusing to overwrite existing batch baseline: ${batch2B4BaselinePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 126 || baseline.incomplete !== 199 || baseline.giRecordCount !== 38) {
    throw new Error("Batch 2B4 baseline does not match the accepted 325 / 126 / 199 / 38 starting point.");
  }
  await writeFile(batch2B4BaselinePath, `${JSON.stringify(baseline, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B4BaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B5BaselinePath) {
  const expectedSourceCommit = "2f9cdd844a276cb284b02a01b0f501d3cb8540fb";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B5 baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  try {
    await readFile(batch2B5BaselinePath, "utf8");
    throw new Error(`Refusing to overwrite existing batch baseline: ${batch2B5BaselinePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 127 || baseline.incomplete !== 198 || baseline.giRecordCount !== 39) {
    throw new Error("Batch 2B5 baseline does not match the accepted 325 / 127 / 198 / 39 starting point.");
  }
  if (baseline.giTierCounts.STRONG !== 5 || baseline.giTierCounts.SUPPLEMENTARY !== 34) {
    throw new Error("Batch 2B5 baseline GI quality tiers do not match the accepted 5 STRONG / 34 SUPPLEMENTARY starting point.");
  }
  await writeFile(batch2B5BaselinePath, `${JSON.stringify(baseline, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B5BaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B6ABaselinePath) {
  const expectedSourceCommit = "21d9628db3ffc7434e4308d6ab42880d1f12bae0";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B6A baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  try {
    await readFile(batch2B6ABaselinePath, "utf8");
    throw new Error(`Refusing to overwrite existing batch baseline: ${batch2B6ABaselinePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 129 || baseline.incomplete !== 196 || baseline.giRecordCount !== 39) {
    throw new Error("Batch 2B6A baseline does not match the accepted 325 / 129 / 196 / 39 starting point.");
  }
  if (baseline.giTierCounts.STRONG !== 5 || baseline.giTierCounts.SUPPLEMENTARY !== 34) {
    throw new Error("Batch 2B6A baseline GI quality tiers do not match the accepted 5 STRONG / 34 SUPPLEMENTARY starting point.");
  }
  if (baseline.nutritionAuditCounts["ESTIMATE WITH EVIDENCE"] !== 180 || baseline.nutritionAuditCounts["INSUFFICIENT SOURCE DATA"] !== 86 || baseline.nutritionAuditCounts.MISSING !== 59 || baseline.nutritionAuditCounts["CONFLICT REQUIRES REVIEW"] !== 0) {
    throw new Error("Batch 2B6A baseline strict nutrition audit does not match the accepted 180 / 86 / 59 / 0 starting point.");
  }
  await writeFile(batch2B6ABaselinePath, `${JSON.stringify(baseline, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B6ABaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B6BBaselinePath) {
  const expectedSourceCommit = "0d7b194228b3a520b0f14613246b4d9aa48137cc";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B6B baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 132 || baseline.incomplete !== 193 || baseline.giRecordCount !== 40) {
    throw new Error("Batch 2B6B baseline does not match the verified 325 / 132 / 193 / 40 starting point.");
  }
  if (baseline.giTierCounts.STRONG !== 5 || baseline.giTierCounts.SUPPLEMENTARY !== 35) {
    throw new Error("Batch 2B6B baseline GI quality tiers do not match the verified 5 STRONG / 35 SUPPLEMENTARY starting point.");
  }
  if (baseline.nutritionAuditCounts["ESTIMATE WITH EVIDENCE"] !== 180 || baseline.nutritionAuditCounts["INSUFFICIENT SOURCE DATA"] !== 86 || baseline.nutritionAuditCounts.MISSING !== 59 || baseline.nutritionAuditCounts["CONFLICT REQUIRES REVIEW"] !== 0) {
    throw new Error("Batch 2B6B baseline strict nutrition audit does not match the verified 180 / 86 / 59 / 0 starting point.");
  }
  await writeImmutableBaselineFile(batch2B6BBaselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B6BBaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B6CBaselinePath) {
  const expectedSourceCommit = "b2ac53b11b45b8759d5f841ba978c966a50efe26";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B6C baseline can only be captured at ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 134 || baseline.incomplete !== 191 || baseline.giRecordCount !== 42) {
    throw new Error("Batch 2B6C baseline does not match the verified 325 / 134 / 191 / 42 starting point.");
  }
  if (baseline.giTierCounts.STRONG !== 5 || baseline.giTierCounts.SUPPLEMENTARY !== 37) {
    throw new Error("Batch 2B6C baseline GI quality tiers do not match the verified 5 STRONG / 37 SUPPLEMENTARY starting point.");
  }
  if (baseline.nutritionAuditCounts["ESTIMATE WITH EVIDENCE"] !== 180 || baseline.nutritionAuditCounts["INSUFFICIENT SOURCE DATA"] !== 86 || baseline.nutritionAuditCounts.MISSING !== 59 || baseline.nutritionAuditCounts["CONFLICT REQUIRES REVIEW"] !== 0) {
    throw new Error("Batch 2B6C baseline strict nutrition audit does not match the verified 180 / 86 / 59 / 0 starting point.");
  }
  if (baseline.recipes.length !== 325 || new Set(baseline.recipes.map((recipe) => recipe.recipeId)).size !== 325) {
    throw new Error("Batch 2B6C baseline must contain every recipe exactly once.");
  }
  await writeImmutableBaselineFile(batch2B6CBaselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B6CBaselinePath }, null, 2));
  process.exit(0);
}

if (batch2B6DBaselinePath) {
  const expectedSourceCommit = "f2ba9e849e677f9e223103022e309a09b9992f62";
  if (sourceCommit !== expectedSourceCommit) throw new Error(`Batch 2B6D baseline can only be captured at corrected 2B6C HEAD ${expectedSourceCommit}; current HEAD is ${sourceCommit}.`);
  const baseline = buildBaselineSnapshot({
    sourceCommit,
    results: pilot.results,
    sourceHashes: pilot.sourceHashes,
    calculationInputHashes,
    calculationEvidenceHashes: pilot.calculationEvidenceHashes,
    giRecordCount: giCatalog.records.length,
    giTierCounts,
    nutritionAuditCounts: nutrition.counts,
    nutritionStatuses,
  });
  if (baseline.recipeCount !== 325 || baseline.calculated !== 136 || baseline.incomplete !== 189 || baseline.giRecordCount !== 42) {
    throw new Error("Batch 2B6D baseline does not match the corrected 325 / 136 / 189 / 42 starting point.");
  }
  if (baseline.giTierCounts.STRONG !== 5 || baseline.giTierCounts.SUPPLEMENTARY !== 37) {
    throw new Error("Batch 2B6D baseline GI quality tiers do not match the verified 5 STRONG / 37 SUPPLEMENTARY starting point.");
  }
  if (baseline.nutritionAuditCounts["ESTIMATE WITH EVIDENCE"] !== 180 || baseline.nutritionAuditCounts["INSUFFICIENT SOURCE DATA"] !== 86 || baseline.nutritionAuditCounts.MISSING !== 59 || baseline.nutritionAuditCounts["CONFLICT REQUIRES REVIEW"] !== 0) {
    throw new Error("Batch 2B6D baseline strict nutrition audit does not match the verified 180 / 86 / 59 / 0 starting point.");
  }
  if (baseline.recipes.length !== 325 || new Set(baseline.recipes.map((recipe) => recipe.recipeId)).size !== 325) {
    throw new Error("Batch 2B6D baseline must contain every recipe exactly once.");
  }
  await writeImmutableBaselineFile(batch2B6DBaselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(JSON.stringify({ sourceCommit, recipeCount: baseline.recipeCount, calculated: baseline.calculated, incomplete: baseline.incomplete, giRecordCount: baseline.giRecordCount, output: batch2B6DBaselinePath }, null, 2));
  process.exit(0);
}

const baseline = JSON.parse(await readFile(baselineInputPath, "utf8")) as CoverageBaseline;
if (baselineInputPath === baselinePath && baseline.sourceCommit !== "5e9cdeb830f468ecf099e9c286f9344afe3b6b71") throw new Error(`Approved baseline source is unexpected: ${baseline.sourceCommit}`);
const inventory = buildCurrentCoverageInventory({
  sourceCommit,
  baseline,
  giRecordCount: giCatalog.records.length,
  giTierCounts,
  results: pilot.results,
  sourceHashes: pilot.sourceHashes,
  calculationInputHashes,
  calculationEvidenceHashes: pilot.calculationEvidenceHashes,
  nutritionStatuses,
  currentRecipeStructures,
  currentCalculationInputs,
  historicalStaleRecipeIds,
  structuralReviewStartSourceCommit: reviewStart.sourceCommit,
  structuralReviewStartRows: reviewStart.structuralBindingAnalysis.rows,
  expectedCurrentRecipeIds: nutritionRecipeIds,
  reviewedStructuralRecipeIds: [
    "karibia-johnny-cake", "pohjoisafrikkalainen-msemen-hunajalla", "japanilainen-tamago-kake-gohan",
    "malesialainen-nasi-lemak-aamiaisella", "thai-kookosriisi-mangolla", "pohjoisafrikkalainen-harissa-shakshuka",
    "meksikolainen-quesadilla-sienilla", "indonesialainen-bakwan-maissifritter", "valimerellinen-farinata-aamupalaksi",
    "valimerellinen-halloumi-tomaattileipa",
  ],
});

const summary = inventory.currentSummary;
const structural = inventory.structuralBindingAnalysis;
const reportLines = [
  "# GK-esteinventaario",
  "",
  `Lähdecommit: \`${sourceCommit}\`. Vertailun lähtösnapshot: \`${baseline.sourceCommit}\` (${baseline.calculated} laskettua / ${baseline.incomplete} keskeneräistä; ${baseline.giRecordCount} GI-tietuetta). Historiallinen 213 reseptin inventaario säilyy erillisenä.`,
  ...(baseline.sourceCommit === "5e9cdeb830f468ecf099e9c286f9344afe3b6b71"
    ? ["", "Erän 2A lähtösnapshot on historiallinen vertailupohja, ei tämän ajon nykytila. Ajantasainen laskentatila ja nykyiset GK-luvut esitetään alla."]
    : []),
  "",
  `Nykyinen ajo kattaa ${summary.recipeCount} reseptiä: ${summary.calculated} laskettua, ${summary.incomplete} keskeneräistä. GI-katalogissa on ${summary.giRecordCount} tietuetta (${Object.entries(summary.giTierCounts).map(([tier, count]) => `${count} ${tier}`).join(", ")}).`,
  "",
  "## Muutos hyväksytystä vertailusta",
  "",
  `- Aiemmin keskeneräisiä, nyt laskettavia: ${summary.newlyCalculated}. Aiemmin laskettuja, nyt estettyjä: ${summary.newlyBlocked}. Edelleen keskeneräisiä: ${summary.stillIncomplete}.`,
  `- Estoperuste muuttui ${summary.changedBlockerRecipes} reseptillä. Uusia rakenne-/syöte-/lähdesidonnan muutoksia: ${summary.newStructureMismatches}/${summary.newInputMismatches}/${summary.newEvidenceMismatches}.`,
  `- Keskeneräisiä, joiden ravintoarvotila on tuettu: ${summary.incompleteWithSupportedNutrition}; tarkistettava: ${summary.incompleteNutritionNeedsReview}; puuttuva: ${summary.incompleteNutritionMissing}.`,
  "",
  "## Päällekkäiset esteet",
  "",
  "Luokat menevät päällekkäin; sama resepti voi esiintyä useassa rivissä.",
  "",
  "| Luokka | Reseptit | Estoviestit |",
  "| --- | ---: | ---: |",
  ...Object.entries(inventory.blockerOverlapCounts).map(([category, value]) => `| ${category} | ${value.recipes} | ${value.blockerMessages} |`),
  "",
  "## Historiallinen erä 2A: rakennesidontojen lähtötilanne ja lopputulos",
  "",
  `Korjausta edeltävä snapshot (lähdecommit \`${structural.reviewStartSourceCommit}\`) osoittaa, että ${structural.withOtherBlockersAtReviewStart}/${structural.rows.length} reseptillä oli rakennesidonnan lisäksi muita esteitä. Pelkkä fingerprintin uusiminen olisi voinut ratkaista ${structural.potentiallyResolvableByBindingOnlyAtReviewStart} arviota. Erässä tarkistettiin sisällöllisesti ${structural.reviewedInBatch2A}; niistä ${structural.calculatedAfterContentReview} palautui laskettavaksi ja ${structural.reviewedStillIncomplete} jäi keskeneräiseksi. ${structural.outOfScope} rakennesidontaa jäi erän 2A varsinaisen tarkistuksen ulkopuolelle. Nykytilan estolistaa ei käytetä alkuperäisen esteen päättelemiseen.`,
  "",
  "| Resepti | Lähtötilanteen muut esteet | Erä 2A | Nykyinen GK | Laskentasyöte / lähteet |",
  "| --- | --- | --- | --- | --- |",
  ...structural.rows.map((row) => {
    const inputIngredients = row.currentCalculationInput?.ingredients.map((ingredient) => {
      const quantity = ingredient.recipeQuantity as { amount?: number | null; unit?: string | null; massGrams?: number | null } | undefined;
      const recipeQuantity = quantity ? `recipe ${quantity.amount ?? "?"} ${quantity.unit ?? "?"} (mass ${quantity.massGrams ?? "unresolved"} g)` : "recipe quantity not captured";
      return `${recipeQuantity}; calculation mass ${ingredient.grams ?? "unresolved"} g; ${ingredient.name ?? ""} (${ingredient.fineliRecordId ?? "composition unresolved"}; GI ${ingredient.giRecordId ?? "missing"})`;
    }).join("; ") ?? "—";
    return `| ${row.recipeId} | ${row.otherBlockingCategoriesAtReviewStart.join(", ") || "none"} | ${row.batch2AOutcome} | ${row.currentStatus} | ${inputIngredients.replaceAll("|", "\\|")} |`;
  }),
  "",
  "## Nykyiset keskeneräiset reseptit",
  "",
  "JSON-inventaario sisältää jokaiselle nykyiselle reseptille reseptin, GK-syötteen ja lähdetietueiden fingerprintit, ravintoarvotilan, kaikki estot, puuttuvat ruoka-/GI-tietueet, massa-/valmistustilaongelmat sekä seuraavan työvaiheen. Tämä taulukko listaa keskeneräiset ensisijaisen esteen mukaan.",
  "",
  "| Resepti | Ensisijainen luokka | GK-tila | Ravintoarvotila | Työvaihe |",
  "| --- | --- | --- | --- | --- |",
  ...inventory.recipes.filter((row) => row.status !== "CALCULATED").map((row) => `| ${row.recipeId} | ${row.primaryBlockingCategory ?? "—"} | ${row.status} | ${row.nutritionStatus} | ${row.suggestedNextWorkstream} |`),
  "",
  "## Rajaukset",
  "",
  "- Tämä inventaario kuvaa laskenta-ajon esteitä; se ei itsessään vahvista lähdettä tai korjaa reseptisyötettä.",
  "- GI-arvoja, GK-kaavaa, alle 1 g:n ainesosarajaa tai alle 2 g:n kumulatiivista toleranssia ei muuteta.",
  "- Eräkohtainen vertailusnapshot käyttää sille nimettyä 325 reseptin lähtötilaa; historiallisia erä 1:n ja erän 2A tiedostoja ei korvata.",
  "",
];
await writeFile(currentOutputPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
await writeFile(markdownOutputPath, `${reportLines.join("\n").trimEnd()}\n`, "utf8");
console.log(JSON.stringify({ sourceCommit, ...summary, historicalStructuralBindingCount: structural.rows.length, withOtherBlockersAtReviewStart: structural.withOtherBlockersAtReviewStart, potentiallyResolvableByBindingOnlyAtReviewStart: structural.potentiallyResolvableByBindingOnlyAtReviewStart, output: currentOutputPath, markdown: markdownOutputPath }, null, 2));
