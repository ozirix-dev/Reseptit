import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  assertCoverageConsistency,
  buildBaselineSnapshot,
  buildCurrentCoverageInventory,
  type CoverageResult,
} from "../scripts/glycemic-coverage-inventory-model";

const sampleResult = (recipeId: string, blockers: string[] = [], status: CoverageResult["status"] = "INSUFFICIENT SOURCE DATA"): CoverageResult => ({
  recipeId,
  status,
  glycemicLoadPerServing: status === "CALCULATED" ? 12.3 : null,
  omittedAvailableCarbohydratePerServingG: 0,
  blockers,
  ingredients: [],
});

test("current inventory consistency requires every recipe exactly once", () => {
  assert.doesNotThrow(() => assertCoverageConsistency([sampleResult("a"), sampleResult("b")], ["a", "b"]));
  assert.throws(() => assertCoverageConsistency([sampleResult("a"), sampleResult("a")], ["a", "b"]), /duplicate recipe IDs/);
  assert.throws(() => assertCoverageConsistency([sampleResult("a")], ["a", "b"]), /Expected 2 current GK results/);
});

test("baseline snapshots capture the approved source revision and all recipe states", () => {
  const baseline = buildBaselineSnapshot({
    sourceCommit: "5e9cdeb830f468ecf099e9c286f9344afe3b6b71",
    results: [sampleResult("blocked"), sampleResult("calculated", [], "CALCULATED")],
    sourceHashes: { blocked: "r1", calculated: "r2" },
    calculationInputHashes: { blocked: "i1", calculated: "i2" },
    calculationEvidenceHashes: { blocked: "e1", calculated: "e2" },
    giRecordCount: 38,
    giTierCounts: { STRONG: 5, SUPPLEMENTARY: 33 },
    nutritionAuditCounts: { "ESTIMATE WITH EVIDENCE": 180 },
    nutritionStatuses: { blocked: "ESTIMATE WITH EVIDENCE", calculated: "ESTIMATE WITH EVIDENCE" },
  });
  assert.equal(baseline.recipeCount, 2);
  assert.equal(baseline.calculated, 1);
  assert.equal(baseline.incomplete, 1);
  assert.equal(baseline.recipes[0]?.calculationInputVersion, "i1");
});

test("stale structure cannot be cleared by refreshing a fingerprint while other blockers remain", () => {
  const baseline = buildBaselineSnapshot({
    sourceCommit: "approved",
    results: [sampleResult("corn-recipe", ["corn-recipe: recipe structure differs from last review."])],
    sourceHashes: { "corn-recipe": "old-recipe" },
    calculationInputHashes: { "corn-recipe": "input" },
    calculationEvidenceHashes: { "corn-recipe": "evidence" },
    giRecordCount: 1,
    giTierCounts: { STRONG: 1 },
    nutritionAuditCounts: {},
    nutritionStatuses: { "corn-recipe": "ESTIMATE WITH EVIDENCE" },
  });
  const inventory = buildCurrentCoverageInventory({
    sourceCommit: "working",
    baseline,
    giRecordCount: 1,
    giTierCounts: { STRONG: 1 },
    results: [sampleResult("corn-recipe", ["corn-recipe: recipe structure differs from last review.", "corn-recipe: maize: GI evidence is missing."])],
    sourceHashes: { "corn-recipe": "new-recipe" },
    calculationInputHashes: { "corn-recipe": "input" },
    calculationEvidenceHashes: { "corn-recipe": "evidence" },
    nutritionStatuses: { "corn-recipe": "ESTIMATE WITH EVIDENCE" },
    currentRecipeStructures: {},
    currentCalculationInputs: {},
    historicalStaleRecipeIds: ["corn-recipe"],
  });
  assert.equal(inventory.currentSummary.recipeCount, 1);
  assert.equal(inventory.currentSummary.calculated, 0);
  assert.equal(inventory.currentSummary.newStructureMismatches, 1);
  assert.equal(inventory.structuralBindingAnalysis.potentiallyPublishableAfterBindingOnly, 0);
  assert.equal(inventory.recipes[0]?.blockingCategories.includes("GI_MISSING"), true);
});

test("historical 213-recipe inventory remains a separate batch-one baseline", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const historical = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-inventory-2026-10-25.json"), "utf8")) as {
    sourceCommit: string;
    recipes: Array<{ structureStale?: boolean }>;
  };
  assert.equal(historical.sourceCommit, "b51c769731ba40f9ab0b085e5b1b47f979651d9f");
  assert.equal(historical.recipes.length, 213);
  assert.equal(historical.recipes.filter((recipe) => recipe.structureStale).length, 51);
});

test("batch 2A preserves its starting overlap audit and only accepts reviewed current recipe inputs", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-current-2026-10-25.json"), "utf8")) as {
    sourceCommit: string;
    currentSummary: { recipeCount: number };
    recipes: Array<{ recipeId: string; recipeVersionChanged: boolean; calculationInputVersionChanged: boolean; calculationEvidenceVersionChanged: boolean; blockingCategories: string[] }>;
    structuralBindingAnalysis: { rows: Array<{ recipeId: string }>; withOtherBlockers: number; potentiallyPublishableAfterBindingOnly: number };
  };
  const reviewStart = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2a-review-start.json"), "utf8")) as {
    structuralBindingAnalysis: { rows: Array<{ recipeId: string }>; withOtherBlockers: number; potentiallyPublishableAfterBindingOnly: number };
  };
  const input = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8")) as {
    recipes: Array<{ recipeId: string; ingredients: Array<{ name: string; grams: number | null; fineliRecordId?: string | null; giRecordId?: string | null }> }>;
  };
  assert.equal(reviewStart.structuralBindingAnalysis.rows.length, 51);
  assert.equal(reviewStart.structuralBindingAnalysis.withOtherBlockers, 51);
  assert.equal(reviewStart.structuralBindingAnalysis.potentiallyPublishableAfterBindingOnly, 0);
  assert.equal(current.currentSummary.recipeCount, 325);
  const reviewedIds = [
    "karibia-johnny-cake", "pohjoisafrikkalainen-msemen-hunajalla", "japanilainen-tamago-kake-gohan",
    "malesialainen-nasi-lemak-aamiaisella", "thai-kookosriisi-mangolla", "pohjoisafrikkalainen-harissa-shakshuka",
    "meksikolainen-quesadilla-sienilla", "indonesialainen-bakwan-maissifritter", "valimerellinen-farinata-aamupalaksi",
    "valimerellinen-halloumi-tomaattileipa",
  ];
  const currentById = new Map(current.recipes.map((row) => [row.recipeId, row]));
  const inputById = new Map(input.recipes.map((row) => [row.recipeId, new Map(row.ingredients.map((ingredient) => [ingredient.name, ingredient]))]));
  for (const id of reviewedIds) {
    const row = currentById.get(id);
    assert.ok(row, `Current coverage row exists for ${id}`);
    assert.equal(row.blockingCategories.includes("STRUCTURE"), false, `${id} has no stale structure blocker`);
    assert.equal(row.blockingCategories.includes("INPUT"), false, `${id} has no stale input blocker`);
  }
  assert.equal(inputById.get("karibia-johnny-cake")?.get("leivinjauhe")?.grams, 5);
  assert.equal(inputById.get("pohjoisafrikkalainen-msemen-hunajalla")?.get("voi")?.grams, 50);
  assert.equal(inputById.get("japanilainen-tamago-kake-gohan")?.get("nori")?.grams, 2);
  assert.equal(inputById.get("malesialainen-nasi-lemak-aamiaisella")?.get("kurkku")?.grams, 100);
  assert.equal(inputById.get("thai-kookosriisi-mangolla")?.get("seesaminsiemen")?.grams, 6);
  assert.equal(inputById.get("meksikolainen-quesadilla-sienilla")?.get("maissi")?.grams, null);
  assert.equal(inputById.get("indonesialainen-bakwan-maissifritter")?.get("maissi")?.grams, null);
  assert.equal(inputById.get("malesialainen-nasi-lemak-aamiaisella")?.get("kookosmaito")?.grams, null);
});
