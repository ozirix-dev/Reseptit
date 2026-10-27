import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { nutritionProvenance, inputPaths, inputHash } from "../scripts/nutrition-provenance";
import { salmonScenario, salmonComparison } from "../scripts/nutrition-pilot";
import { allowedOmissionErrorPerServing, calculate, normalizeCarbohydrate, round, totalCarbohydrate, type Calculation, type FoodRecord } from "../scripts/nutrition-model";
const food: FoodRecord = { id: "test-fixture-not-real-food", name: "Synthetic exact test fixture", sourceUrl: "https://example.org/fixture", retrievedAt: "2026-10-22", licence: "test", state: "raw", basis: "per100g-edible", carbohydrateDefinition: "EU_AVAILABLE", polyolsSourceVerified: true, polyolsEvidence: "Synthetic source explicitly reports zero polyols", per100g: { kcal: 100, protein: 10, fat: 5, carbohydrate: 20, fibre: 4, sugars: 2, polyols: 0 } };
test("provenance covers food records, calculator and loader inputs including dirty files", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const result = await nutritionProvenance(root);
  for (const file of ["docs/nutrition/food-records.json", "site/scripts/nutrition-model.ts", "site/scripts/nutrition-audit.ts", "site/src/content/schema.ts", "site/package-lock.json"]) {
    const expected = createHash("sha256").update((await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n")).digest("hex");
    assert.equal(result.sourceInputHashes[file], expected);
  }
  assert.equal(result.sourceWorkingTreeChanges, execFileSync("git", ["status", "--porcelain", "--untracked-files=all", "--", ...inputPaths], { cwd: root, encoding: "utf8" }).trim() || null);
  assert.equal(await inputHash(path.join(root, "tmp", "nonexistent-provenance-fixture-4db15c96.md")), null);
  await assert.rejects(() => inputHash(path.join(root, "site")));
});
function fixture(): Calculation { return { recipeId: "fixture", sourceHash: "a".repeat(64), calculatedAt: "2026-10-22", servings: 4, scope: "input estimate, no loss", reviewerStatus: "AUTOMATED ONLY", carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE", ingredients: [{ item: "fixture", amount: 250, unit: "g", record: structuredClone(food), state: "raw", matchEvidence: "fixture", edibleFraction: 1, edibleEvidence: "fixture", retainedFraction: 1, retentionEvidence: "fixture" }] }; }
test("salmon pilot follows ingredient identity and current values, never array order or old comparison", async () => {
  const records = JSON.parse(await readFile(new URL("../../docs/nutrition/food-records.json", import.meta.url), "utf8"));
  const ingredients = [{ item: "sipuli", amount: 1, unit: "kpl", state: "UNRESOLVED", matchEvidence: "" }, { item: "lohifilee", amount: 600, unit: "g", state: "UNRESOLVED", matchEvidence: "" }];
  const input = { ...fixture(), ingredients: salmonScenario(ingredients, records) };
  assert.equal(input.ingredients[0].record, undefined); assert.equal(input.ingredients[1].record?.id, records[0].id);
  assert.equal(salmonComparison(input, 29).comparisonStatus, "CONFLICT REQUIRES REVIEW");
  assert.equal(salmonComparison(input, 31).comparisonStatus, "INSUFFICIENT SOURCE DATA");
  assert.equal(salmonComparison({ ...input, servings: 8 }, 29).conditionalSalmonPerServing.protein, 15);
  input.ingredients[1].amount = 400;
  const result = salmonComparison(input, 29);
  assert.equal(result.conditionalSalmonPerServing.protein, 20); assert.equal(result.comparisonStatus, "INSUFFICIENT SOURCE DATA");
  assert.throws(() => salmonScenario([ingredients[0]], records));
  assert.throws(() => salmonScenario([ingredients[1], ingredients[1]], records));
});
test("independent arithmetic and rounding only after totals/division", () => {
  const result = calculate(fixture());
  assert.equal(result.total.kcal, 250); assert.equal(result.perServing.kcal, 62.5);
  assert.equal(result.perServing.protein, 6.25); assert.equal(result.total.carbohydrate, 50);
  assert.equal(result.total.netCarbohydrate, 50); assert.equal(round(1.005), 1.01);
  assert.throws(() => round(2, -1)); assert.throws(() => round(NaN));
  assert.equal(round(4.225), 4.23); assert.equal(round(10.075), 10.08);
  assert.equal(round(0.0000001), 0); assert.equal(round(1e25), 1e25);
  assert.equal(round(4.2249), 4.22); assert.equal(round(4.225, 3), 4.225);
});
test("unknowns do not become zero, partial ingredients do not become recipe totals", () => {
  const mutations = [
    (i: Calculation) => { i.ingredients[0].record!.sourceUrl = ""; },
    (i: Calculation) => { i.ingredients[0].amount = null; },
    (i: Calculation) => { i.ingredients[0].unit = "dl"; },
    (i: Calculation) => { i.ingredients[0].retainedFraction = undefined; },
    (i: Calculation) => { i.ingredients[0].record!.per100g.fat = -1; },
    (i: Calculation) => { i.ingredients[0].edibleEvidence = ""; },
    (i: Calculation) => { i.ingredients[0].state = "cooked"; },
  ];
  for (const mutate of mutations) { const input = fixture(); mutate(input); assert.equal(calculate(input).total.kcal, null); }
  const input = fixture(); delete input.ingredients[0].record!.per100g.protein;
  assert.equal(calculate(input).total.protein, null); assert.equal(calculate(input).total.kcal, 250);
});
test("missing optional energy or sugar source fields do not block the four supported macros", () => {
  const input = fixture();
  delete input.ingredients[0]!.record!.per100g.kcal;
  delete input.ingredients[0]!.record!.per100g.sugars;
  assert.equal(calculate(input).status, "ESTIMATE WITH EVIDENCE");
  assert.equal(calculate(input).perServing.kcal, null);
  assert.equal(calculate(input).perServing.sugars, null);
});
test("prepared-product nutrient basis is accepted only with a matching prepared state", async () => {
  const records: FoodRecord[] = JSON.parse(await readFile(new URL("../../docs/nutrition/food-records.json", import.meta.url), "utf8"));
  const noodles = records.find((record) => record.id === "koro-konjac-noodles-prepared-2026-10-24");
  assert.ok(noodles);
  const input = fixture();
  input.ingredients[0] = { item: "prepared konjac noodles", amount: 200, unit: "g", record: noodles, state: noodles.state, matchEvidence: "Exact prepared product label; values per 100 g prepared.", edibleFraction: 1, edibleEvidence: "Prepared and ready to eat as sold.", retainedFraction: 1, retentionEvidence: "Entire prepared package portion counted." };
  assert.equal(calculate(input).status, "ESTIMATE WITH EVIDENCE");
  assert.equal(calculate(input).totalCarbohydratePerServingG, 1.35);
  input.ingredients[0].state = "dry konjac noodles";
  assert.equal(calculate(input).status, "INSUFFICIENT SOURCE DATA");
});
test("unresolved nutrient weight basis cannot be normalized or calculated", () => {
  const record = { ...structuredClone(food), basis: "unresolved" as const };
  assert.throws(() => normalizeCarbohydrate(record), /weight basis is unresolved/);
  const input = fixture(); input.ingredients[0].record = record;
  assert.equal(calculate(input).status, "INSUFFICIENT SOURCE DATA");
  assert.ok(calculate(input).rows[0].issues.includes("Unresolved food/state/edible basis match"));
});
test("servings and provenance must be valid", () => {
  for (const servings of [0, -1, 1.5, NaN, Infinity]) assert.throws(() => calculate({ ...fixture(), servings }));
  assert.throws(() => calculate({ ...fixture(), sourceHash: "" }));
});
test("EU available carbohydrates already exclude polyols; total carbohydrate removes polyols only when source definition includes them", () => {
  assert.throws(() => normalizeCarbohydrate(food, true));
  const us = { ...food, carbohydrateDefinition: "US_TOTAL_INCLUDING_FIBRE" as const };
  assert.equal(normalizeCarbohydrate(us).available, 16);
  assert.equal(normalizeCarbohydrate({ ...us, per100g: { carbohydrate: 20 } }).available, null);
  assert.throws(() => normalizeCarbohydrate({ ...us, per100g: { carbohydrate: 2, fibre: 4 } }));
  assert.equal(normalizeCarbohydrate({ ...food, per100g: { carbohydrate: 20, polyols: 3 } }).net, 20);
  assert.equal(normalizeCarbohydrate({ ...food, carbohydrateDefinition: "EU_TOTAL_INCLUDING_POLYOLS", per100g: { carbohydrate: 20, polyols: 3 } }).net, 17);
  assert.equal(normalizeCarbohydrate({ ...food, polyolsSourceVerified: false, per100g: { carbohydrate: 20, polyols: 3 } }).net, null);
  assert.equal(normalizeCarbohydrate({ ...food, per100g: { carbohydrate: 2, polyols: 3 } }).net, 2);
  assert.equal(normalizeCarbohydrate({ ...food, per100g: { carbohydrate: 20, polyols: null } }).net, null);
  const fineliSugarFreeChocolate = { ...food, per100g: { carbohydrate: 1.7, fibre: 3.5, polyols: 50, protein: 2.3, fat: 36.65 } };
  assert.equal(normalizeCarbohydrate(fineliSugarFreeChocolate).net, 1.7);
  assert.equal(totalCarbohydrate(1.7, 3.5, 50), 55.2);
  assert.equal(normalizeCarbohydrate({ ...food, carbohydrateDefinition: "UNKNOWN" }).available, null);
});
test("Foodin erythritol label reports the polyol mass and contributes zero net carbs", async () => {
  const records: FoodRecord[] = JSON.parse(await readFile(new URL("../../docs/nutrition/food-records.json", import.meta.url), "utf8"));
  const erythritol = records.find((record) => record.id === "foodin-erythritol-200g-label-2026-10-24");
  assert.ok(erythritol);
  assert.equal(erythritol.per100g.polyols, 100);
  assert.deepEqual(normalizeCarbohydrate(erythritol), { available: 0, net: 0 });
  assert.equal(totalCarbohydrate(0, 0, erythritol.per100g.polyols!), 100);
  const input = fixture(); input.ingredients[0].record = erythritol; input.ingredients[0].amount = 4; input.ingredients[0].state = erythritol.state;
  const result = calculate(input);
  assert.equal(result.total.netCarbohydrate, 0); assert.equal(result.totalCarbohydrateGrams, 4);
  const missingPolyolEvidence = { ...erythritol, polyolsSourceVerified: false };
  assert.equal(normalizeCarbohydrate(missingPolyolEvidence).net, null);
  const fishSauce = records.find((record) => record.id === "off-13692210-squid-brand-fish-sauce-2026-10-24");
  assert.ok(fishSauce?.polyolsEvidence);
  assert.deepEqual(normalizeCarbohydrate(fishSauce), { available: 3.4, net: 3.4 });
});
test("volume requires ingredient evidence, kg conversion and explicit exclusions", () => {
  const input = fixture(); input.ingredients[0].unit = "dl"; input.ingredients[0].amount = 1;
  input.ingredients[0].gramsPerUnit = 90; input.ingredients[0].conversionEvidence = "synthetic oil fixture";
  assert.equal(calculate(input).total.kcal, 90);
  input.ingredients[0].unit = "kg"; input.ingredients[0].amount = 0.25;
  assert.equal(calculate(input).total.kcal, 250);
  input.ingredients.push({ item: "optional garnish", amount: null, unit: "", state: "raw", matchEvidence: "", excludedReason: "explicit test scenario omits garnish" });
  assert.equal(calculate(input).total.kcal, 250);
});
test("bounded minor omissions are allowed only within the summed per-serving error budget", () => {
  const input = fixture();
  input.ingredients.push({ item: "small herb garnish", amount: null, unit: "", state: "raw", matchEvidence: "", excludedReason: "Unmeasured garnish; bounded conservative estimate", omissionImpactEvidence: "Fineli herb composition × documented 2 g maximum for this recipe", omissionImpactUpperBoundPerServing: { kcal: 5, netCarbohydrate: 0.3, totalCarbohydrate: 0.5, protein: 0.1, fat: 0.2 } });
  const result = calculate(input);
  assert.equal(result.omissionWithinTolerance, true);
  assert.equal(result.status, "ESTIMATE WITH EVIDENCE");
  assert.deepEqual(result.omissionImpactUpperBoundPerServing, { kcal: 5, netCarbohydrate: 0.3, totalCarbohydrate: 0.5, protein: 0.1, fat: 0.2 });
  input.ingredients.push({ item: "second seasoning", amount: null, unit: "", state: "raw", matchEvidence: "", excludedReason: "Unmeasured amount", omissionImpactEvidence: "Conservative source-based upper bound", omissionImpactUpperBoundPerServing: { kcal: 6, netCarbohydrate: 0.2, totalCarbohydrate: 0.6, protein: 0.1, fat: 0.1 } });
  assert.equal(calculate(input).omissionWithinTolerance, false);
  assert.equal(calculate(input).status, "INSUFFICIENT SOURCE DATA");
  assert.equal(allowedOmissionErrorPerServing.totalCarbohydrate, 1);
});
test("an omitted ingredient with no bounded impact cannot qualify as a complete estimate", () => {
  const input = fixture();
  input.ingredients.push({ item: "unknown amount", amount: null, unit: "", state: "raw", matchEvidence: "", excludedReason: "Not quantified" });
  const result = calculate(input);
  assert.equal(result.omissionWithinTolerance, false);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
});
test("documented salmon input contribution is reproducible without inventing dish totals", async () => {
  const records: FoodRecord[] = JSON.parse(await readFile(new URL("../../docs/nutrition/food-records.json", import.meta.url), "utf8"));
  const input = fixture(); input.ingredients[0].record = records[0]; input.ingredients[0].state = records[0].state; input.ingredients[0].amount = 600;
  const result = calculate(input);
  assert.equal(result.total.kcal, 1356); assert.equal(result.total.protein, 120); assert.equal(result.total.fat, 98.4);
  assert.equal(result.perServing.protein, 30); assert.equal(result.total.netCarbohydrate, null);
  input.ingredients.push({ item: "cream with unverified density", amount: 2, unit: "dl", state: "unknown", matchEvidence: "" });
  assert.equal(calculate(input).total.protein, null);
});
test("decimal multiplication, subtraction, aggregation and serving division remain exact", () => {
  const input = fixture(); input.ingredients[0].record!.per100g.protein = 0.35; input.ingredients[0].amount = 90; input.servings = 1;
  assert.equal(calculate(input).total.protein, 0.32);
  input.ingredients.push(structuredClone(input.ingredients[0])); input.servings = 2;
  assert.equal(calculate(input).total.protein, 0.63); assert.equal(calculate(input).perServing.protein, 0.32);
  input.ingredients[0].record!.carbohydrateDefinition = "US_TOTAL_INCLUDING_FIBRE";
  input.ingredients[0].record!.per100g.carbohydrate = 0.7; input.ingredients[0].record!.per100g.fibre = 0.35;
  input.ingredients = [input.ingredients[0]]; input.servings = 1;
  assert.equal(calculate(input).total.carbohydrate, 0.32);
});
