import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GlycemicLoadRecipeInput } from "./glycemic-load-model";
import { glycemicLoadInputHash } from "./glycemic-load-recipe-binding";
import { parseMarkdown } from "../src/content/markdown";
import { buildBaselineSnapshot, buildCurrentCoverageInventory, type CoverageBaseline, type CoverageResult, type CurrentCoverageInput } from "./glycemic-coverage-inventory-model";

type JsonRecord = Record<string, unknown>;
type PilotReport = JsonRecord & {
  results: CoverageResult[];
  summary: { recipes: number; calculated: number; insufficientSourceData: number };
  sourceHashes: Record<string, string>;
  calculationInputHashes: Record<string, string>;
  calculationEvidenceHashes: Record<string, string>;
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
const readJson = async <T>(relativePath: string): Promise<T> => JSON.parse(await readFile(path.join(root, relativePath), "utf8")) as T;

const [pilot, nutrition, inputs, giCatalog, historical, reviewStart] = await Promise.all([
  readJson<PilotReport>("tmp/nutrition/glycemic-load-pilot.json"),
  readJson<NutritionReport>("tmp/nutrition/audit.json"),
  readJson<InputReport>("docs/nutrition/glycemic-load-pilot-input.json"),
  readJson<GICatalog>("docs/nutrition/glycemic-index-records.json"),
  readJson<HistoricalInventory>("docs/nutrition/glycemic-coverage-inventory-2026-10-25.json"),
  readJson<ReviewStartSnapshot>("docs/nutrition/glycemic-coverage-batch-2a-review-start.json"),
]);
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const calculationInputHashes = Object.fromEntries(inputs.recipes.map((recipe) => [recipe.recipeId, glycemicLoadInputHash(recipe)]));
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
const currentCalculationInputs = Object.fromEntries(inputs.recipes.map((recipe) => {
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

if (pilot.summary.recipes !== inputs.recipes.length || nutrition.inventory.length !== inputs.recipes.length) {
  throw new Error(`Coverage inputs disagree: GL=${pilot.summary.recipes}, nutrition=${nutrition.inventory.length}, source recipes=${inputs.recipes.length}.`);
}
if (new Set(inputs.recipes.map((recipe) => recipe.recipeId)).size !== inputs.recipes.length) throw new Error("Source input contains duplicate recipe IDs.");

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
  if (baseline.recipeCount !== inputs.recipes.length) throw new Error("Baseline capture omitted one or more source recipes.");
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
