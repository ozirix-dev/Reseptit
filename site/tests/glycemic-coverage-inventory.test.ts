import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assertCoverageConsistency,
  buildBaselineSnapshot,
  buildCurrentCoverageInventory,
  type CoverageResult,
} from "../scripts/glycemic-coverage-inventory-model";
import { writeImmutableBaselineFile } from "../scripts/glycemic-coverage-baseline-file";

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

test("batch baseline capture refuses to overwrite and preserves the original snapshot", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "glycemic-baseline-"));
  const filePath = path.join(directory, "baseline.json");
  const original = "{\"sourceCommit\":\"approved\"}\n";
  try {
    await writeImmutableBaselineFile(filePath, original);
    await assert.rejects(writeImmutableBaselineFile(filePath, "{\"sourceCommit\":\"replacement\"}\n"), /Refusing to overwrite existing batch baseline/);
    assert.equal(await readFile(filePath, "utf8"), original);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("a resolved current row cannot erase its pre-correction content blockers", () => {
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
    results: [sampleResult("corn-recipe", [], "CALCULATED")],
    sourceHashes: { "corn-recipe": "new-recipe" },
    calculationInputHashes: { "corn-recipe": "input" },
    calculationEvidenceHashes: { "corn-recipe": "evidence" },
    nutritionStatuses: { "corn-recipe": "ESTIMATE WITH EVIDENCE" },
    currentRecipeStructures: {},
    currentCalculationInputs: {},
    historicalStaleRecipeIds: ["corn-recipe"],
    structuralReviewStartSourceCommit: "pre-correction",
    structuralReviewStartRows: [{ recipeId: "corn-recipe", currentStatus: "INSUFFICIENT SOURCE DATA", otherBlockingCategories: ["MASS_PREPARATION"], otherBlockers: ["Recipe quantity and source composition required correction before calculation."] }],
    reviewedStructuralRecipeIds: ["corn-recipe"],
  });
  assert.equal(inventory.currentSummary.recipeCount, 1);
  assert.equal(inventory.currentSummary.calculated, 1);
  const structuralRow = inventory.structuralBindingAnalysis.rows[0];
  assert.equal(structuralRow?.bindingOnlyWouldResolveAtStart, false);
  assert.equal(structuralRow?.reviewStartStatus, "INSUFFICIENT SOURCE DATA");
  assert.equal(structuralRow?.currentStatus, "CALCULATED");
  assert.equal(structuralRow?.batch2AOutcome, "CALCULATED_AFTER_CONTENT_REVIEW");
  assert.equal(inventory.structuralBindingAnalysis.potentiallyResolvableByBindingOnlyAtReviewStart, 0);
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
    recipes: Array<{ recipeId: string; status: string; recipeVersionChanged: boolean; calculationInputVersionChanged: boolean; calculationEvidenceVersionChanged: boolean; blockingCategories: string[] }>;
    structuralBindingAnalysis: {
      rows: Array<{ recipeId: string; bindingOnlyWouldResolveAtStart: boolean }>;
      withOtherBlockersAtReviewStart: number;
      potentiallyResolvableByBindingOnlyAtReviewStart: number;
      reviewedInBatch2A: number;
      calculatedAfterContentReview: number;
      reviewedStillIncomplete: number;
      outOfScope: number;
    };
  };
  const reviewStart = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2a-review-start.json"), "utf8")) as {
    structuralBindingAnalysis: { rows: Array<{ recipeId: string }>; withOtherBlockers: number; potentiallyPublishableAfterBindingOnly: number };
  };
  const input = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8")) as {
    recipes: Array<{ recipeId: string; ingredients: Array<{ name: string; grams: number | null; recipeQuantity?: { amount: number | null; unit: string | null; massGrams: number | null }; fineliRecordId?: string | null; giRecordId?: string | null; availableCarbohydrateUpperBoundPerServingG?: number; estimatedAvailableCarbohydratePerServingG?: number }> }>;
  };
  assert.equal(reviewStart.structuralBindingAnalysis.rows.length, 51);
  assert.equal(reviewStart.structuralBindingAnalysis.withOtherBlockers, 51);
  assert.equal(reviewStart.structuralBindingAnalysis.potentiallyPublishableAfterBindingOnly, 0);
  assert.equal(current.currentSummary.recipeCount, 325);
  assert.equal(current.structuralBindingAnalysis.withOtherBlockersAtReviewStart, 51);
  assert.equal(current.structuralBindingAnalysis.potentiallyResolvableByBindingOnlyAtReviewStart, 0);
  assert.equal(current.structuralBindingAnalysis.reviewedInBatch2A, 10);
  assert.equal(current.structuralBindingAnalysis.calculatedAfterContentReview, 3);
  assert.equal(current.structuralBindingAnalysis.reviewedStillIncomplete, 7);
  assert.equal(current.structuralBindingAnalysis.outOfScope, 41);
  assert.equal(current.structuralBindingAnalysis.rows.filter((row) => row.bindingOnlyWouldResolveAtStart).length, 0);
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
  assert.equal(inputById.get("thai-kookosriisi-mangolla")?.get("seesaminsiemen")?.giRecordId, null);
  assert.equal(inputById.get("meksikolainen-quesadilla-sienilla")?.get("maissi")?.grams, null);
  assert.equal(inputById.get("indonesialainen-bakwan-maissifritter")?.get("maissi")?.grams, 100);
  assert.equal(inputById.get("indonesialainen-bakwan-maissifritter")?.get("maissi")?.fineliRecordId, "afcd-F003209-release-3");
  assert.equal(inputById.get("indonesialainen-bakwan-maissifritter")?.get("maissi")?.giRecordId, null);
  assert.deepEqual(inputById.get("meksikolainen-quesadilla-sienilla")?.get("maissi")?.recipeQuantity, { amount: 80, unit: "g", massGrams: 80 });
  assert.deepEqual(inputById.get("indonesialainen-bakwan-maissifritter")?.get("maissi")?.recipeQuantity, { amount: 100, unit: "g", massGrams: 100 });
  assert.equal(inputById.get("malesialainen-nasi-lemak-aamiaisella")?.get("kookosmaito")?.grams, null);
  assert.equal(inputById.get("malesialainen-nasi-lemak-aamiaisella")?.get("kookosmaito")?.fineliRecordId, null);
  assert.deepEqual(inputById.get("malesialainen-nasi-lemak-aamiaisella")?.get("kookosmaito")?.recipeQuantity, { amount: 200, unit: "ml", massGrams: null });
  assert.equal(inputById.get("thai-kookosriisi-mangolla")?.get("kookosmaito")?.fineliRecordId, null);
  assert.deepEqual(inputById.get("thai-kookosriisi-mangolla")?.get("kookosmaito")?.recipeQuantity, { amount: 200, unit: "ml", massGrams: null });
  assert.equal(inputById.get("valimerellinen-farinata-aamupalaksi")?.get("rosmariini")?.estimatedAvailableCarbohydratePerServingG, undefined);
  assert.equal(inputById.get("valimerellinen-farinata-aamupalaksi")?.get("rosmariini")?.availableCarbohydrateUpperBoundPerServingG, 0.1035);
  assert.equal(current.recipes.find((row) => row.recipeId === "meksikolainen-quesadilla-sienilla")?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(current.recipes.find((row) => row.recipeId === "indonesialainen-bakwan-maissifritter")?.status, "INSUFFICIENT SOURCE DATA");
});

test("batch 2B1 baseline and current inventory are separate complete 325-recipe snapshots", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b1-baseline.json"), "utf8")) as {
    sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number;
  };
  const current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b1-current.json"), "utf8")) as {
    previousApprovedBaseline: { sourceCommit: string };
    currentSummary: { recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; newlyCalculated: number; newlyBlocked: number; changedBlockerRecipes: number; newInputMismatches: number; newEvidenceMismatches: number };
    recipes: Array<{ recipeId: string; status: string; blockingCategories: string[] }>;
  };
  assert.equal(baseline.sourceCommit, "25902326b9fd89a30d8bfe48f2d1cd02879bd9df");
  assert.deepEqual([baseline.recipeCount, baseline.calculated, baseline.incomplete, baseline.giRecordCount], [325, 117, 208, 38]);
  assert.equal(current.previousApprovedBaseline.sourceCommit, baseline.sourceCommit);
  assert.deepEqual([current.currentSummary.recipeCount, current.currentSummary.calculated, current.currentSummary.incomplete, current.currentSummary.giRecordCount], [325, 117, 208, 38]);
  assert.deepEqual([current.currentSummary.newlyCalculated, current.currentSummary.newlyBlocked, current.currentSummary.changedBlockerRecipes], [0, 0, 3]);
  assert.equal(current.currentSummary.newInputMismatches, 0);
  assert.equal(current.currentSummary.newEvidenceMismatches, 0);
  for (const id of ["meksikolainen-quesadilla-sienilla", "indonesialainen-bakwan-maissifritter", "malesialainen-nasi-lemak-aamiaisella", "thai-kookosriisi-mangolla", "pohjoisafrikkalainen-harissa-shakshuka", "valimerellinen-farinata-aamupalaksi"]) {
    const row = current.recipes.find((recipe) => recipe.recipeId === id);
    assert.ok(row, `Batch 2B1 inventory includes ${id}`);
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA");
  }
});

test("batch 2B2 captures the published main baseline and preserves all earlier inventory snapshots", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b2-baseline.json"), "utf8")) as {
    sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; recipes: Array<{ recipeId: string }>;
  };
  const current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b2-current.json"), "utf8")) as {
    sourceCommit: string;
    previousApprovedBaseline: { sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number };
    currentSummary: { recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; newlyCalculated: number; newlyBlocked: number; stillIncomplete: number; newStructureMismatches: number; newInputMismatches: number; newEvidenceMismatches: number };
    recipes: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null; blockers: unknown[] }>;
  };
  const batch2B1Baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b1-baseline.json"), "utf8")) as { sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number };
  const batch2B1Current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b1-current.json"), "utf8")) as { sourceCommit: string; currentSummary: { recipeCount: number; calculated: number; incomplete: number; giRecordCount: number } };

  assert.equal(baseline.sourceCommit, "66ba0464bd0099c2318ce9b5cd1ae3ca0bd841cd");
  assert.deepEqual([baseline.recipeCount, baseline.calculated, baseline.incomplete, baseline.giRecordCount], [325, 117, 208, 38]);
  assert.equal(new Set(baseline.recipes.map((row) => row.recipeId)).size, 325);
  assert.equal(current.previousApprovedBaseline.sourceCommit, baseline.sourceCommit);
  assert.deepEqual([current.previousApprovedBaseline.recipeCount, current.previousApprovedBaseline.calculated, current.previousApprovedBaseline.incomplete, current.previousApprovedBaseline.giRecordCount], [325, 117, 208, 38]);
  assert.equal(current.sourceCommit.length, 40);
  assert.deepEqual([current.currentSummary.recipeCount, current.currentSummary.calculated, current.currentSummary.incomplete, current.currentSummary.giRecordCount], [325, 118, 207, 38]);
  assert.deepEqual([current.currentSummary.newlyCalculated, current.currentSummary.newlyBlocked, current.currentSummary.stillIncomplete], [1, 0, 207]);
  assert.deepEqual([current.currentSummary.newStructureMismatches, current.currentSummary.newInputMismatches, current.currentSummary.newEvidenceMismatches], [0, 0, 0]);
  assert.equal(current.recipes.length, 325);
  assert.equal(new Set(current.recipes.map((row) => row.recipeId)).size, 325);
  for (const id of ["thai-jok-kanalla"]) {
    const row = current.recipes.find((recipe) => recipe.recipeId === id);
    assert.ok(row, `2B2 current inventory includes ${id}`);
    assert.equal(row.status, "CALCULATED");
    assert.ok(typeof row.glycemicLoadPerServing === "number");
    assert.deepEqual(row.blockers, []);
  }
  for (const id of ["caponata", "pasta-alla-norma", "baozi", "harira", "vhh-runebergintortut", "thai-porsasjok"]) {
    const row = current.recipes.find((recipe) => recipe.recipeId === id);
    assert.ok(row, `2B2 current inventory includes ${id}`);
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA");
    assert.ok(row.blockers.length > 0);
  }
  assert.deepEqual([batch2B1Baseline.sourceCommit, batch2B1Baseline.recipeCount, batch2B1Baseline.calculated, batch2B1Baseline.incomplete, batch2B1Baseline.giRecordCount], ["25902326b9fd89a30d8bfe48f2d1cd02879bd9df", 325, 117, 208, 38]);
  assert.deepEqual([batch2B1Current.currentSummary.recipeCount, batch2B1Current.currentSummary.calculated, batch2B1Current.currentSummary.incomplete, batch2B1Current.currentSummary.giRecordCount], [325, 117, 208, 38]);
});

test("batch 2B5 baseline and current inventory preserve the published 325-recipe starting point", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b5-baseline.json"), "utf8")) as {
    sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; giTierCounts: Record<string, number>; recipes: Array<{ recipeId: string }>;
  };
  const current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b5-current.json"), "utf8")) as {
    sourceCommit: string; previousApprovedBaseline: { sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number };
    currentSummary: { recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; newlyCalculated: number; newlyBlocked: number };
    recipes: Array<{ recipeId: string }>;
  };
  assert.equal(baseline.sourceCommit, "2f9cdd844a276cb284b02a01b0f501d3cb8540fb");
  assert.deepEqual([baseline.recipeCount, baseline.calculated, baseline.incomplete, baseline.giRecordCount], [325, 127, 198, 39]);
  assert.deepEqual([baseline.giTierCounts.STRONG, baseline.giTierCounts.SUPPLEMENTARY], [5, 34]);
  assert.equal(new Set(baseline.recipes.map((row) => row.recipeId)).size, 325);
  assert.equal(current.previousApprovedBaseline.sourceCommit, baseline.sourceCommit);
  assert.deepEqual([current.currentSummary.recipeCount, current.currentSummary.calculated, current.currentSummary.incomplete, current.currentSummary.giRecordCount], [325, 129, 196, 39]);
  assert.deepEqual([current.currentSummary.newlyCalculated, current.currentSummary.newlyBlocked], [2, 0]);
  assert.equal(current.recipes.length, 325);
  assert.equal(new Set(current.recipes.map((row) => row.recipeId)).size, 325);
});

test("batch 2B6A preserves its immutable published baseline and records only three reviewed additions", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b6a-baseline.json"), "utf8")) as {
    sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; recipes: Array<{ recipeId: string }>;
  };
  const current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b6a-current.json"), "utf8")) as {
    sourceCommit: string;
    previousApprovedBaseline: { sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number };
    currentSummary: { recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; newlyCalculated: number; newlyBlocked: number; changedBlockerRecipes: number; newStructureMismatches: number; newInputMismatches: number; newEvidenceMismatches: number };
    recipes: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null; newlyCalculated: boolean }>;
  };
  assert.deepEqual([baseline.sourceCommit, baseline.recipeCount, baseline.calculated, baseline.incomplete, baseline.giRecordCount], ["21d9628db3ffc7434e4308d6ab42880d1f12bae0", 325, 129, 196, 39]);
  assert.equal(baseline.recipes.length, 325);
  assert.equal(new Set(baseline.recipes.map((row) => row.recipeId)).size, 325);
  assert.equal(current.previousApprovedBaseline.sourceCommit, baseline.sourceCommit);
  assert.deepEqual([current.currentSummary.recipeCount, current.currentSummary.calculated, current.currentSummary.incomplete, current.currentSummary.giRecordCount], [325, 132, 193, 40]);
  assert.deepEqual([current.currentSummary.newlyCalculated, current.currentSummary.newlyBlocked, current.currentSummary.changedBlockerRecipes], [3, 0, 3]);
  assert.deepEqual([current.currentSummary.newStructureMismatches, current.currentSummary.newInputMismatches, current.currentSummary.newEvidenceMismatches], [0, 0, 0]);
  for (const id of ["bulgogi", "keto-suklaakeksit", "vhh-mokkapalat"]) {
    const row = current.recipes.find((recipe) => recipe.recipeId === id);
    assert.ok(row, `2B6A inventory includes ${id}`);
    assert.equal(row.status, "CALCULATED");
    assert.equal(row.newlyCalculated, true);
  }
});

test("batch 2B6C baseline locks the published 325-recipe main and all regression fingerprints", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b6c-baseline.json"), "utf8")) as {
    sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number;
    giTierCounts: { STRONG: number; SUPPLEMENTARY: number };
    nutritionAuditCounts: Record<string, number>;
    recipes: Array<{ recipeId: string; status: string; recipeVersion: string; calculationInputVersion: string; calculationEvidenceVersion: string }>;
  };
  assert.deepEqual([baseline.sourceCommit, baseline.recipeCount, baseline.calculated, baseline.incomplete, baseline.giRecordCount], ["b2ac53b11b45b8759d5f841ba978c966a50efe26", 325, 134, 191, 42]);
  assert.deepEqual([baseline.giTierCounts.STRONG, baseline.giTierCounts.SUPPLEMENTARY], [5, 37]);
  assert.deepEqual([baseline.nutritionAuditCounts["ESTIMATE WITH EVIDENCE"], baseline.nutritionAuditCounts["INSUFFICIENT SOURCE DATA"], baseline.nutritionAuditCounts.MISSING, baseline.nutritionAuditCounts["CONFLICT REQUIRES REVIEW"]], [180, 86, 59, 0]);
  assert.equal(baseline.recipes.length, 325);
  assert.equal(new Set(baseline.recipes.map((row) => row.recipeId)).size, 325);
  assert.ok(baseline.recipes.every((row) => row.recipeVersion && row.calculationInputVersion && row.calculationEvidenceVersion));
  assert.equal(baseline.recipes.filter((row) => row.status === "CALCULATED").length, 134);
});

test("batch 2B6C current inventory publishes only two evidence-ready additions", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const inventory = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b6c-current.json"), "utf8")) as {
    currentSummary: { recipeCount: number; calculated: number; incomplete: number; newlyCalculated: number; newlyBlocked: number; changedBlockerRecipes: number; newInputMismatches: number; newEvidenceMismatches: number };
    recipes: Array<{ recipeId: string; status: string; newlyCalculated: boolean; glycemicLoadPerServing: number | null }>;
  };
  const summary = inventory.currentSummary;
  assert.deepEqual([summary.recipeCount, summary.calculated, summary.incomplete, summary.newlyCalculated, summary.newlyBlocked, summary.changedBlockerRecipes], [325, 136, 189, 2, 0, 2]);
  assert.equal(summary.newInputMismatches, 0);
  assert.equal(summary.newEvidenceMismatches, 0);
  const newlyCalculated = inventory.recipes.filter((row) => row.newlyCalculated).map((row) => row.recipeId).sort();
  assert.deepEqual(newlyCalculated, ["meksikolainen-aamiais-tacot-mustapavuilla", "vhh-kaalikaarryleet"]);
  for (const id of ["meheva-suklaakakku", "meksikolainen-paputostada-aamupalaksi"]) {
    const row = inventory.recipes.find((item) => item.recipeId === id);
    assert.ok(row, `${id} present in inventory`);
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA", id);
    assert.equal(row.glycemicLoadPerServing, null, id);
  }
});

test("batch 2B6D adds three sourced date estimates and preserves the previous 136 GK values", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const baseline = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b6d-baseline.json"), "utf8")) as {
    sourceCommit: string; recipeCount: number; calculated: number; incomplete: number; giRecordCount: number;
    recipes: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null }>;
  };
  const current = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-batch-2b6d-current.json"), "utf8")) as {
    currentSummary: { recipeCount: number; calculated: number; incomplete: number; giRecordCount: number; giTierCounts: Record<string, number>; newlyCalculated: number; newlyBlocked: number; newStructureMismatches: number; newInputMismatches: number; newEvidenceMismatches: number };
    recipes: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null; previousApprovedGlycemicLoadPerServing: number | null; newlyCalculated: boolean; blockingCategories: string[] }>;
  };
  assert.deepEqual([baseline.sourceCommit, baseline.recipeCount, baseline.calculated, baseline.incomplete, baseline.giRecordCount], ["f2ba9e849e677f9e223103022e309a09b9992f62", 325, 136, 189, 42]);
  assert.deepEqual([current.currentSummary.recipeCount, current.currentSummary.calculated, current.currentSummary.incomplete, current.currentSummary.giRecordCount, current.currentSummary.newlyCalculated, current.currentSummary.newlyBlocked], [325, 139, 186, 45, 3, 0]);
  assert.deepEqual([current.currentSummary.giTierCounts.STRONG, current.currentSummary.giTierCounts.SUPPLEMENTARY], [6, 39]);
  assert.equal(current.currentSummary.newStructureMismatches, 0);
  assert.equal(current.currentSummary.newInputMismatches, 0);
  assert.equal(current.currentSummary.newEvidenceMismatches, 0);
  assert.equal(current.recipes.length, 325);
  assert.equal(current.recipes.filter((row) => row.status !== "CALCULATED" && row.blockingCategories.length === 0).length, 0, "all incomplete recipes have a classified blocker");
  const previousResults = new Map(baseline.recipes.filter((row) => row.status === "CALCULATED").map((row) => [row.recipeId, row.glycemicLoadPerServing]));
  assert.equal(previousResults.size, 136);
  for (const [id, value] of previousResults) {
    const row = current.recipes.find((item) => item.recipeId === id);
    assert.ok(row, `${id} remains in the current inventory`);
    assert.equal(row.status, "CALCULATED", `${id} stays calculated`);
    assert.equal(row.glycemicLoadPerServing, value, `${id} retains the previous GK`);
    assert.equal(row.previousApprovedGlycemicLoadPerServing, value, `${id} matches the immutable baseline`);
  }
  const newlyCalculated = current.recipes.filter((row) => row.newlyCalculated).sort((a, b) => a.recipeId.localeCompare(b.recipeId));
  assert.deepEqual(newlyCalculated.map((row) => [row.recipeId, row.glycemicLoadPerServing]), [
    ["kiinalainen-hirssipuuro-taateleilla", 21.19],
    ["pohjoisafrikkalainen-kuskus-aamiaiskulho", 34.36],
    ["pohjoisafrikkalainen-taatelipuuro-appelsiinilla", 21.95],
  ]);
});
