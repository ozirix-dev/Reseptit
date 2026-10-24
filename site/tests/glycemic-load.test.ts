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

test("carbohydrate-source scenarios produce a range without presenting it as a confidence interval", () => {
  const result = calculateGlycemicLoad({
    recipeId: "range",
    servings: 2,
    ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "GI source matched; carbohydrate range is documented.", availableCarbohydratePer100gRange: { min: 10, max: 20, evidence: "Two named source scenarios." } }],
  }, [food("food", 10)], [gi]);
  assert.equal(result.glycemicLoadPerServing, 5);
  assert.deepEqual(result.glycemicLoadRangePerServing, { min: 2.5, max: 5 });
  assert.deepEqual(result.ingredients[0].giContributionRange, { min: 2.5, max: 5 });
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

test("published, explicitly labelled supplementary proxy values are accepted with lower confidence", () => {
  const supplementary = {
    ...gi,
    qualityTier: "SUPPLEMENTARY" as const,
    matchKind: "ANALOG" as const,
    confidence: "LOW" as const,
    source: { ...gi.source, published: true, iso26642Confirmed: false, qualityEvidence: "Published generic analogue; study methods do not confirm ISO compliance." },
  };
  const result = calculateGlycemicLoad({
    recipeId: "supplementary",
    servings: 1,
    ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: supplementary.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact food and preparation, lower quality source." }],
  }, [food("food", 10)], [supplementary]);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 5);
  assert.equal(result.ingredients[0].matchKind, "ANALOG");
  assert.equal(result.confidence, "LOW");
});

test("standardized seasoning assumptions are visible and can be omitted below 1 g per serving", () => {
  const result = calculateGlycemicLoad({
    recipeId: "unweighed",
    servings: 1,
    ingredients: [{ name: "assumed seasoning", grams: 1.5, fineliRecordId: null, giRecordId: null, excludedReason: "Standard estimate; not weighed.", estimatedAvailableCarbohydratePerServingG: 0.3, negligibleAssumption: "1.5 g batch amount, assumed 0.6 g available carbohydrate total." }],
  }, [], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.ingredients[0].grams, 1.5);
  assert.equal(result.ingredients[0].availableCarbohydratePerServingG, 0.3);
  assert.match(result.ingredients[0].issues[0], /<1 g\/serving/);
  assert.equal(result.confidence, "LOW");
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

test("an unpublished GI record still blocks an important ingredient", () => {
  const result = calculateGlycemicLoad({
    recipeId: "unpublished",
    servings: 1,
    ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: "unpublished", foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Unpublished value." }],
  }, [food("food", 10)], [{ ...gi, id: "unpublished", source: { ...gi.source, published: false } }]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.match(result.blockers[0], /unpublished/);
});

test("a sub-1 g ingredient needs no GI record and is excluded from the sum", () => {
  const result = calculateGlycemicLoad({
    recipeId: "small-contribution",
    servings: 1,
    ingredients: [{ name: "spinach", grams: 100, fineliRecordId: "spinach", giRecordId: null }],
  }, [food("spinach", 0.2)], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0);
  assert.equal(result.ingredients[0].availableCarbohydratePerServingG, 0.2);
  assert.equal(result.ingredients[0].giContribution, null);
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
  }, [food("known", 20), food("unknown-gi", 25)], [gi]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.ok(result.blockers.some((blocker) => blocker.includes("unknown GI")));
  assert.ok(result.blockers.some((blocker) => blocker.includes("unknown mass")));
});

test("recipe pages receive only calculated, non-null complete GL results", () => {
  const results = [
    { recipeId: "waiting", status: "INSUFFICIENT SOURCE DATA" as const, glycemicLoadPerServing: null, confidence: null, sourceReferences: [] },
    { recipeId: "invalid", status: "CALCULATED" as const, glycemicLoadPerServing: null, confidence: "LOW" as const, sourceReferences: [] },
    { recipeId: "ready", status: "CALCULATED" as const, glycemicLoadPerServing: 3.25, confidence: "MEDIUM" as const, sourceReferences: [{ title: "Study", url: "https://example.test/study", matchKind: "ANALOG" as const, confidence: "LOW" as const, note: "Analogue." }] },
  ];
  assert.equal(publishedGlycemicLoadForRecipe("waiting", results), null);
  assert.equal(publishedGlycemicLoadForRecipe("invalid", results), null);
  assert.deepEqual(publishedGlycemicLoadForRecipe("ready", results), results[2]);
  assert.equal(publishedGlycemicLoadForRecipe("unknown", results), null);
});
