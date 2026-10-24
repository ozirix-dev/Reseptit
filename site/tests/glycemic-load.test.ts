import assert from "node:assert/strict";
import test from "node:test";

import type { FoodRecord } from "../scripts/nutrition-model";
import { calculateGlycemicLoad, type GlycemicIndexRecord } from "../scripts/glycemic-load-model";
import { publishedGlycemicLoadForRecipe } from "../src/features/recipes/glycemic-load-display";

function food(id: string, availableCarbohydrate: number): FoodRecord {
  return {
    id,
    name: id,
    sourceUrl: `https://example.test/${id}`,
    retrievedAt: "2026-10-24",
    licence: "test fixture",
    state: "raw-edible-as-listed",
    basis: "per100g-edible",
    carbohydrateDefinition: "EU_AVAILABLE",
    componentValues: { CHO: availableCarbohydrate, FIBT: 0, POLYL: 0 },
    componentIds: { CHO: 2034, FIBT: 2168, POLYL: 2260 },
    per100g: { carbohydrate: availableCarbohydrate, fibre: 0, polyols: 0 },
  };
}

const gi: GlycemicIndexRecord = {
  id: "tested-food-raw",
  gi: 50,
  foodKey: "tested-food",
  preparationKey: "raw",
  food: "Tested food",
  preparation: "raw",
  qualityTier: "STRONG",
  referenceScale: "GLUCOSE_100",
  source: {
    title: "Test source",
    url: "https://example.test/gi",
    table: "Supplemental Table 1",
    year: 2021,
    published: true,
    iso26642Confirmed: true,
    participants: 10,
    referenceFood: "Glucose",
    testDurationHours: 2,
    qualityEvidence: "Table 1 ISO-standard inclusion criteria.",
  },
};

test("single-ingredient GL uses available carbohydrate per serving and rounds only the total", () => {
  const result = calculateGlycemicLoad({
    recipeId: "one",
    servings: 2,
    ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact raw-food match." }],
  }, [food("food", 25)], [gi]);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.ingredients[0].availableCarbohydratePerServingG, 12.5);
  assert.equal(result.glycemicLoadPerServing, 6.25);
});

test("mixed-meal GL adds independently weighted ingredient contributions", () => {
  const secondGi = { ...gi, id: "second", foodKey: "second-food", preparationKey: "cooked", gi: 25 };
  const result = calculateGlycemicLoad({
    recipeId: "mixed",
    servings: 2,
    ingredients: [
      { name: "first", grams: 100, fineliRecordId: "first", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact raw-food match." },
      { name: "second", grams: 200, fineliRecordId: "second", giRecordId: secondGi.id, foodKey: "second-food", preparationKey: "cooked", giMatchEvidence: "Exact cooked-food match." },
    ],
  }, [food("first", 20), food("second", 10)], [gi, secondGi]);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.ingredients[0].giContribution, 5);
  assert.equal(result.ingredients[1].giContribution, 2.5);
  assert.equal(result.glycemicLoadPerServing, 7.5);
});

test("zero-carbohydrate ingredients need no GI value and contribute zero", () => {
  const result = calculateGlycemicLoad({
    recipeId: "zero",
    servings: 1,
    ingredients: [{ name: "oil", grams: 20, fineliRecordId: "oil", giRecordId: null }],
  }, [food("oil", 0)], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0);
  assert.equal(result.ingredients[0].giContribution, null);
});

test("supplementary and unpublished GI records never produce a public-ready GL", () => {
  const supplementary = {
    ...gi,
    qualityTier: "SUPPLEMENTARY" as const,
    source: { ...gi.source, published: false, iso26642Confirmed: false, qualityEvidence: "Database lists unpublished observation; protocol is not verifiable." },
  };
  const result = calculateGlycemicLoad({
    recipeId: "supplementary",
    servings: 1,
    ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: supplementary.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact food and preparation, lower quality source." }],
  }, [food("food", 10)], [supplementary]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.match(result.blockers[0], /strong, published ISO 26642/);
});

test("unweighed ingredients block totals and are not silently omitted", () => {
  const result = calculateGlycemicLoad({
    recipeId: "unweighed",
    servings: 1,
    ingredients: [{ name: "unmeasured seasoning", grams: null, fineliRecordId: null, giRecordId: null, excludedReason: "Amount not specified." }],
  }, [], []);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.match(result.blockers[0], /not treated as zero/);
});

test("source discovery records food candidates but marks preparation mismatch", () => {
  const rawCandidate = { ...gi, preparation: "whole, raw", preparationKey: "whole-raw" };
  const result = calculateGlycemicLoad({
    recipeId: "tomato-sauce",
    servings: 1,
    ingredients: [{ name: "crushed tomato", grams: 100, fineliRecordId: "tomato", giRecordId: null, foodKey: "tested-food", preparationKey: "crushed-cooked" }],
  }, [food("tomato", 5)], [rawCandidate]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.ingredients[0].giCandidates.length, 1);
  assert.equal(result.ingredients[0].giCandidates[0].preparationMatches, false);
});

test("a GI from a different food or preparation blocks the recipe total", () => {
  const result = calculateGlycemicLoad({
    recipeId: "mismatch",
    servings: 1,
    ingredients: [{ name: "cooked food", grams: 100, fineliRecordId: "food", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "cooked", giMatchEvidence: "Incorrectly assigned raw value." }],
  }, [food("food", 10)], [gi]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.match(result.blockers[0], /does not exactly match/);
});

test("missing ingredient mass or GI evidence never returns a partial recipe GL", () => {
  const result = calculateGlycemicLoad({
    recipeId: "blocked",
    servings: 2,
    ingredients: [
      { name: "known", grams: 100, fineliRecordId: "known", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact match." },
      { name: "unknown GI", grams: 20, fineliRecordId: "unknown-gi", giRecordId: null },
      { name: "unknown mass", grams: null, fineliRecordId: "known", giRecordId: null },
    ],
  }, [food("known", 20), food("unknown-gi", 5)], [gi]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.ok(result.blockers.some((blocker) => blocker.includes("unknown GI")));
  assert.ok(result.blockers.some((blocker) => blocker.includes("unknown mass")));
});

test("recipe pages receive only calculated, non-null complete GL results", () => {
  const results = [
    { recipeId: "waiting", status: "INSUFFICIENT SOURCE DATA" as const, glycemicLoadPerServing: null, sourceReferences: [] },
    { recipeId: "invalid", status: "CALCULATED" as const, glycemicLoadPerServing: null, sourceReferences: [] },
    { recipeId: "ready", status: "CALCULATED" as const, glycemicLoadPerServing: 3.25, sourceReferences: [{ title: "Study", url: "https://example.test/study" }] },
  ];
  assert.equal(publishedGlycemicLoadForRecipe("waiting", results), null);
  assert.equal(publishedGlycemicLoadForRecipe("invalid", results), null);
  assert.deepEqual(publishedGlycemicLoadForRecipe("ready", results), results[2]);
  assert.equal(publishedGlycemicLoadForRecipe("unknown", results), null);
});
