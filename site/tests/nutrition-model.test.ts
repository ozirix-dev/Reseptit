import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { calculate, normalizeCarbohydrate, round, type Calculation, type FoodRecord } from "../scripts/nutrition-model";
const food: FoodRecord = { id: "test-fixture-not-real-food", name: "Synthetic exact test fixture", sourceUrl: "https://example.org/fixture", retrievedAt: "2026-10-22", licence: "test", state: "raw", basis: "per100g-edible", carbohydrateDefinition: "EU_AVAILABLE", per100g: { kcal: 100, protein: 10, fat: 5, carbohydrate: 20, fibre: 4, sugars: 2, polyols: 0 } };
function fixture(): Calculation { return { recipeId: "fixture", sourceHash: "a".repeat(64), calculatedAt: "2026-10-22", servings: 4, scope: "input estimate, no loss", reviewerStatus: "AUTOMATED ONLY", carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE", ingredients: [{ item: "fixture", amount: 250, unit: "g", record: structuredClone(food), state: "raw", matchEvidence: "fixture", edibleFraction: 1, edibleEvidence: "fixture", retainedFraction: 1, retentionEvidence: "fixture" }] }; }
test("independent arithmetic and rounding only after totals/division", () => {
  const result = calculate(fixture());
  assert.equal(result.total.kcal, 250); assert.equal(result.perServing.kcal, 62.5);
  assert.equal(result.perServing.protein, 6.25); assert.equal(result.total.carbohydrate, 50);
  assert.equal(result.total.netCarbohydrate, 50); assert.equal(round(1.005), 1.01);
  assert.throws(() => round(2, -1)); assert.throws(() => round(NaN));
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
test("servings and provenance must be valid", () => {
  for (const servings of [0, -1, 1.5, NaN, Infinity]) assert.throws(() => calculate({ ...fixture(), servings }));
  assert.throws(() => calculate({ ...fixture(), sourceHash: "" }));
});
test("EU fibre is never subtracted again; US needs fibre; polyols unresolved", () => {
  assert.throws(() => normalizeCarbohydrate(food, true));
  const us = { ...food, carbohydrateDefinition: "US_TOTAL_INCLUDING_FIBRE" as const };
  assert.equal(normalizeCarbohydrate(us).available, 16);
  assert.equal(normalizeCarbohydrate({ ...us, per100g: { carbohydrate: 20 } }).available, null);
  assert.throws(() => normalizeCarbohydrate({ ...us, per100g: { carbohydrate: 2, fibre: 4 } }));
  assert.equal(normalizeCarbohydrate({ ...food, per100g: { carbohydrate: 20, polyols: 3 } }).net, null);
  assert.equal(normalizeCarbohydrate({ ...food, carbohydrateDefinition: "UNKNOWN" }).available, null);
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
test("documented salmon input contribution is reproducible without inventing dish totals", async () => {
  const records: FoodRecord[] = JSON.parse(await readFile(new URL("../../docs/nutrition/food-records.json", import.meta.url), "utf8"));
  const input = fixture(); input.ingredients[0].record = records[0]; input.ingredients[0].state = records[0].state; input.ingredients[0].amount = 600;
  const result = calculate(input);
  assert.equal(result.total.kcal, 1356); assert.equal(result.total.protein, 120); assert.equal(result.total.fat, 98.4);
  assert.equal(result.perServing.protein, 30); assert.equal(result.total.netCarbohydrate, null);
  input.ingredients.push({ item: "cream with unverified density", amount: 2, unit: "dl", state: "unknown", matchEvidence: "" });
  assert.equal(calculate(input).total.protein, null);
});
