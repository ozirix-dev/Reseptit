import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import type { FoodRecord } from "../scripts/nutrition-model";
import { calculateGlycemicLoad, classifyGlycemicLoad, roundGlycemicLoadForDisplay, type GlycemicIndexRecord } from "../scripts/glycemic-load-model";
import { glycemicLoadEvidenceHash, glycemicLoadInputHash, recipeBindingHash, recipeBindingMatches } from "../scripts/glycemic-load-recipe-binding";
import { publishedGlycemicLoadForRecipe } from "../src/features/recipes/glycemic-load-display";

function food(id: string, availableCarbohydrate: number, name = id): FoodRecord {
  return {
    id,
    name,
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

test("recipe binding detects calculation-relevant changes and ignores instruction copy edits", () => {
  const reviewed = `---
recipe_id: sample
servings: 2
cooking_method: [boiling]
ingredients:
  - amount: 100
    unit: g
    item: dry rice
---
## Valmistus
Boil until cooked.
`;
  const fingerprint = recipeBindingHash(reviewed);
  assert.equal(recipeBindingMatches(fingerprint, recipeBindingHash(reviewed.replaceAll("\n", "\r\n"))), true);
  for (const changed of [
    reviewed.replace("servings: 2", "servings: 3"),
    reviewed.replace("amount: 100", "amount: 150"),
    reviewed.replace("unit: g", "unit: ml"),
    reviewed.replace("dry rice", "cooked rice"),
    reviewed.replace("cooking_method: [boiling]", "cooking_method: [frying]"),
    reviewed.replace("item: dry rice", "item: cooked rice"),
    reviewed.replace("item: dry rice", "item: kypsää rice"),
  ]) assert.equal(recipeBindingMatches(fingerprint, recipeBindingHash(changed)), false);
  assert.equal(recipeBindingMatches(fingerprint, recipeBindingHash(reviewed.replace("Boil until cooked.", "Boil it until cooked!"))), true);
  assert.equal(recipeBindingMatches(fingerprint, recipeBindingHash(reviewed.replace("item: dry rice", "item: dry, rice"))), true);
  const documentedAlias = reviewed.replace("dry rice", "rice");
  assert.equal(recipeBindingMatches(fingerprint, recipeBindingHash(documentedAlias, { rice: { canonical: "dry rice", evidence: "Same source food identity; preparation and mass basis reviewed." } })), true);
  assert.equal(recipeBindingMatches(null, fingerprint), false);
});

test("calculation input binding covers numeric and mapping inputs but ignores evidence prose edits", () => {
  const reviewed = { recipeId: "sample", servings: 2, ingredients: [{ name: "rice", grams: 100, fineliRecordId: "food-a", giRecordId: "gi-a", massEvidence: "100 g listed", giMatchEvidence: "Exact cooked rice match." }] };
  const fingerprint = glycemicLoadInputHash(reviewed);
  assert.equal(recipeBindingMatches(fingerprint, glycemicLoadInputHash({ ingredients: reviewed.ingredients, servings: 2, recipeId: "sample" })), true);
  for (const changed of [
    { ...reviewed, servings: 3 },
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], grams: 150 }] },
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], recipeQuantity: { amount: 100, unit: "g", massGrams: 100 } }] },
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], availableCarbohydrateUpperBoundPerServingG: 0.1 }] },
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], fineliRecordId: "food-b" }] },
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], giRecordId: "gi-b" }] },
  ]) assert.equal(recipeBindingMatches(fingerprint, glycemicLoadInputHash(changed)), false);
  assert.equal(recipeBindingMatches(fingerprint, glycemicLoadInputHash({ ...reviewed, ingredients: [{ ...reviewed.ingredients[0], massEvidence: "100g listed, corrected punctuation." }] })), true);
  assert.equal(recipeBindingMatches(fingerprint, glycemicLoadInputHash({ ...reviewed, ingredients: [{ ...reviewed.ingredients[0], upperBoundEvidence: "Reworded source note." }] })), true);
});

test("GI and food source value, state, and composition edits invalidate only calculation-relevant evidence", () => {
  const input = { recipeId: "sample", servings: 2, ingredients: [{ name: "rice", grams: 100, fineliRecordId: "food", giRecordId: gi.id }] };
  const original = glycemicLoadEvidenceHash(input, [food("food", 12.5)], [gi]);
  assert.equal(recipeBindingMatches(original, glycemicLoadEvidenceHash(input, [food("food", 12.5)], [{ ...gi, source: { ...gi.source, title: "Retitled source" } }])), true);
  assert.equal(recipeBindingMatches(original, glycemicLoadEvidenceHash(input, [food("food", 15)], [gi])), false);
  assert.equal(recipeBindingMatches(original, glycemicLoadEvidenceHash(input, [{ ...food("food", 12.5), state: "cooked rice" }], [gi])), false);
  assert.equal(recipeBindingMatches(original, glycemicLoadEvidenceHash(input, [food("food", 12.5)], [{ ...gi, gi: 60 }])), false);
  assert.equal(recipeBindingMatches(original, glycemicLoadEvidenceHash(input, [food("food", 12.5)], [{ ...gi, preparationKey: "cooked" }])), false);
});

test("food evidence fingerprints include definition-specific carbohydrate components and meaningful state", () => {
  const input = { recipeId: "source", servings: 1, ingredients: [{ name: "erythritol", grams: 10, fineliRecordId: "erythritol", giRecordId: null }] };
  const erythritol: FoodRecord = {
    ...food("erythritol", 100, "Foodin erythritol"),
    carbohydrateDefinition: "EU_TOTAL_INCLUDING_POLYOLS",
    componentValues: { CHO: 100, FIBT: 0, POLYL: 100 },
    per100g: { carbohydrate: 100, fibre: 0, polyols: 100 },
  };
  const original = glycemicLoadEvidenceHash(input, [erythritol], []);
  assert.notEqual(glycemicLoadEvidenceHash(input, [{ ...erythritol, componentValues: { ...erythritol.componentValues, POLYL: 99 }, per100g: { ...erythritol.per100g, polyols: 99 } }], []), original);
  assert.equal(glycemicLoadEvidenceHash(input, [{ ...erythritol, name: "Foodin, erythritol!", sourceUrl: "https://example.test/renamed", retrievedAt: "2026-10-25" }], []), original);
  assert.notEqual(glycemicLoadEvidenceHash(input, [{ ...erythritol, state: "diluted erythritol drink" }], []), original);

  const usInput = { ...input, ingredients: [{ ...input.ingredients[0], fineliRecordId: "us-food" }] };
  const usFood: FoodRecord = {
    ...food("us-food", 52, "US-labelled food"),
    carbohydrateDefinition: "US_TOTAL_INCLUDING_FIBRE",
    componentValues: { CHO: 52, FIBT: 10, POLYL: 2 },
    per100g: { carbohydrate: 52, fibre: 10, polyols: 2 },
  };
  const usOriginal = glycemicLoadEvidenceHash(usInput, [usFood], []);
  assert.notEqual(glycemicLoadEvidenceHash(usInput, [{ ...usFood, componentValues: { ...usFood.componentValues, FIBT: 11 }, per100g: { ...usFood.per100g, fibre: 11 } }], []), usOriginal);
});

test("whole-number GL classes and one-significant-digit display use separate rounding rules", () => {
  const expected: Array<[number, number, string]> = [
    [9.99, 10, "LOW"], [10, 10, "LOW"], [10.5, 10, "MEDIUM"], [10.99, 10, "MEDIUM"], [11, 10, "MEDIUM"],
    [19, 20, "MEDIUM"], [19.49, 20, "MEDIUM"], [19.5, 20, "HIGH"], [19.83, 20, "HIGH"], [20, 20, "HIGH"], [20.88, 20, "HIGH"],
  ];
  for (const [value, shown, classification] of expected) {
    assert.equal(roundGlycemicLoadForDisplay(value), shown, `display rounding for ${value}`);
    assert.equal(classifyGlycemicLoad(value), classification, `whole-number class for ${value}`);
    assert.equal(new Intl.NumberFormat("en", { maximumSignificantDigits: 1, minimumSignificantDigits: 1 }).format(value), String(shown));
  }
});

test("GI mappings reject clear rice-vinegar/rice and milk-chocolate/dairy mismatches", () => {
  const riceGi = { ...gi, id: "rice-mean", foodKey: "rice-category-mean", preparationKey: "category-mean", matchKind: "CATEGORY_MEAN" as const, qualityTier: "SUPPLEMENTARY" as const, confidence: "LOW" as const };
  const directRiceGi = { ...gi, id: "direct-rice", foodKey: "rice-category-mean", preparationKey: "category-mean", matchKind: "EXACT" as const };
  const analogueRiceGi = { ...gi, id: "analogue-rice", foodKey: "rice-category-mean", preparationKey: "category-mean", matchKind: "ANALOG" as const, qualityTier: "SUPPLEMENTARY" as const, confidence: "LOW" as const };
  const dairyGi = { ...gi, id: "dairy-mean", foodKey: "dairy", preparationKey: "category-mean", matchKind: "CATEGORY_MEAN" as const, qualityTier: "SUPPLEMENTARY" as const, confidence: "LOW" as const };
  for (const scenario of [
    { name: "riisiviinietikkaa", food: food("rice", 79, "Dry uncooked long-grain rice"), giRecord: riceGi, foodKey: "rice-category-mean" },
    { name: "rice wine vinegar", food: food("rice", 79, "Dry uncooked long-grain rice"), giRecord: directRiceGi, foodKey: "rice-category-mean" },
    { name: "rice vinegar", food: food("rice", 79, "Dry uncooked long-grain rice"), giRecord: analogueRiceGi, foodKey: "rice-category-mean" },
    { name: "maitosuklaata", food: food("milk", 5, "Whole milk"), giRecord: dairyGi, foodKey: "dairy" },
  ]) {
    const result = calculateGlycemicLoad({
      recipeId: "mismatch", servings: 1,
      ingredients: [{ name: scenario.name, grams: 100, fineliRecordId: scenario.food.id, giRecordId: scenario.giRecord.id, foodKey: scenario.foodKey, preparationKey: "category-mean", giMatchEvidence: "Broad category mean; mismatch guard regression fixture." }],
    }, [scenario.food], [scenario.giRecord]);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(result.glycemicLoadPerServing, null);
  }
});

test("Jiaozi rice wine vinegar has no dry-rice or rice-GI source mapping", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const pilot = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"));
  const vinegar = pilot.recipes.find((recipe: { recipeId: string }) => recipe.recipeId === "jiaozi")?.ingredients
    .find((ingredient: { name: string }) => ingredient.name === "riisiviinietikkaa");
  assert.equal(vinegar?.grams, 12);
  assert.equal(vinegar?.fineliRecordId, null);
  assert.equal(vinegar?.giRecordId, null);
  assert.match(vinegar?.excludedReason ?? "", /not treated as zero/);
});

test("mashed and boiled potato source analogues are mapped separately for aloo paratha and samosa", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [pilot, foods, catalog] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((value) => JSON.parse(value)),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((value) => JSON.parse(value)),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((value) => JSON.parse(value)),
  ]);
  const mashed = catalog.records.find((record: { id: string }) => record.id === "potato-mashed-preparation-analogue-gi-73");
  const boiled = catalog.records.find((record: { id: string }) => record.id === "potato-boiled-preparation-analogue-gi-66");
  assert.equal(mashed?.gi, 73);
  assert.equal(mashed?.preparationKey, "mashed-unspecified");
  assert.equal(mashed?.source?.table, "Supplemental Table 1, entry 1861");
  assert.match(mashed?.source?.qualityEvidence ?? "", /Yang et al\. \(2006; https:\/\/doi\.org\/10\.3748\/wjg\.v12\.i21\.3430\)/);
  assert.equal(boiled?.gi, 66);
  assert.equal(boiled?.preparationKey, "boiled-unspecified");
  assert.equal(boiled?.source?.table, "Supplemental Table 1, entry 1842");
  const expectations = {
    "aloo-paratha": {
      giRecordId: "potato-mashed-preparation-analogue-gi-73",
      preparationKey: "mashed-unspecified",
      evidence: /entry 1861[\s\S]*not a measurement of aloo paratha GI/,
    },
    samosa: {
      giRecordId: "potato-boiled-preparation-analogue-gi-66",
      preparationKey: "boiled-unspecified",
      evidence: /entry 1842[\s\S]*not as a measurement of samosa GI/,
    },
  } as const;
  for (const [recipeId, expected] of Object.entries(expectations)) {
    const recipe = pilot.recipes.find((row: { recipeId: string }) => row.recipeId === recipeId);
    const potato = recipe?.ingredients.find((row: { name: string }) => row.name === "perunoita");
    assert.equal(potato?.fineliRecordId, "fineli-205-2026-10-24");
    assert.equal(potato?.giRecordId, expected.giRecordId);
    assert.equal(potato?.foodKey, "potato");
    assert.equal(potato?.preparationKey, expected.preparationKey);
    assert.match(potato?.giMatchEvidence ?? "", expected.evidence);
    assert.match(potato?.giMatchEvidence ?? "", /Low-confidence/);
    const result = calculateGlycemicLoad(recipe, foods, catalog.records);
    assert.equal(result.status, "CALCULATED", recipeId);
    assert.equal(result.confidence, "LOW", recipeId);
    const resultPotato = result.ingredients.find((row) => row.name === "perunoita");
    assert.equal(resultPotato?.matchKind, "ANALOG");
    assert.equal(resultPotato?.confidence, "LOW");
  }
});

test("GI coverage inventory keeps its original 2026-10-25 baseline when current inputs change", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const inventory = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-coverage-inventory-2026-10-25.json"), "utf8"));
  assert.equal(inventory.sourceCommit, "b51c769731ba40f9ab0b085e5b1b47f979651d9f");
  assert.deepEqual(inventory.baseline, {
    recipeCount: 325,
    calculated: 112,
    incomplete: 213,
    giRecordCount: 37,
    strongGICount: 4,
    supplementaryGICount: 33,
    nutritionAuditCounts: {
      VERIFIED: 0,
      "ESTIMATE WITH EVIDENCE": 180,
      "INSUFFICIENT SOURCE DATA": 86,
      "CONFLICT REQUIRES REVIEW": 0,
      MISSING: 59,
    },
  });
  assert.equal(inventory.recipes.length, 213);
  assert.equal(new Set(inventory.recipes.map((recipe: { recipeId: string }) => recipe.recipeId)).size, 213);
  assert.deepEqual(inventory.recipeCountByOriginalState, {
    previouslyCalculatedNowBlocked: 78,
    alreadyIncompleteAtBaseline: 135,
  });
});

test("the GL Markdown summary stays aligned with the machine-readable audit", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [markdown, json] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-quality-audit-2026-10-25.md"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-quality-audit-2026-10-25.json"), "utf8").then((value) => JSON.parse(value)),
  ]);
  const { total, previousCalculated, previousIncomplete, currentCalculated, currentIncomplete, changedStructuresSinceReview, previousCalculatedNowBlocked } = json.recipes;
  assert.ok(markdown.includes(`| ${total} | ${previousCalculated} | ${currentCalculated} | ${previousIncomplete} | ${currentIncomplete} | ${changedStructuresSinceReview} | ${previousCalculatedNowBlocked} |`));
  assert.ok(markdown.includes(`${currentCalculated} yhteisen lasketun arvon vertailussa`));
});

test("single-ingredient GL uses available carbohydrate per serving and rounds only the total", () => {
  const result = calculateGlycemicLoad({
    recipeId: "one",
    servings: 2,
    ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact raw-food match." }],
  }, [food("food", 25)], [gi]);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.unroundedGlycemicLoadPerServing, 6.25);
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

test("a sourced analogue supports a total only with low confidence", () => {
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
  assert.equal(result.ingredients[0].confidence, "LOW");
});

test("GI matches require both reviewed food and preparation keys; category means stay in their group", () => {
  const categoryMean: GlycemicIndexRecord = {
    ...gi,
    id: "legume-mean",
    foodKey: "legume",
    preparationKey: "legume-category",
    matchKind: "CATEGORY_MEAN",
    qualityTier: "SUPPLEMENTARY",
    confidence: "LOW",
  };
  const input = (foodKey: string, preparationKey: string) => ({
    recipeId: "category-check",
    servings: 1,
    ingredients: [{ name: "cooked broad beans", grams: 100, fineliRecordId: "beans", giRecordId: categoryMean.id, foodKey, preparationKey, giMatchEvidence: "Published legume group mean; broad beans are legumes." }],
  });
  const accepted = calculateGlycemicLoad(input("legume", "legume-category"), [food("beans", 20)], [categoryMean]);
  assert.equal(accepted.status, "CALCULATED");
  assert.equal(accepted.confidence, "LOW");
  for (const mismatched of [input("nuts", "legume-category"), input("legume", "canned-drained")]) {
    const rejected = calculateGlycemicLoad(mismatched, [food("beans", 20)], [categoryMean]);
    assert.equal(rejected.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(rejected.glycemicLoadPerServing, null);
  }
  const curryPasteMean = { ...categoryMean, id: "curry-category", foodKey: "curry-paste", preparationKey: "asian-regional-food-category" };
  const coconutMilk = calculateGlycemicLoad({
    recipeId: "wrong-category",
    servings: 1,
    ingredients: [{ name: "coconut milk", grams: 100, fineliRecordId: "coconut", giRecordId: curryPasteMean.id, foodKey: "curry-paste", preparationKey: "asian-regional-food-category", giMatchEvidence: "Incorrect curry-paste mapping." }],
  }, [food("coconut", 3, "Coconut milk")], [curryPasteMean]);
  assert.equal(coconutMilk.status, "INSUFFICIENT SOURCE DATA");
});

test("assumed small seasoning amounts are visible and count toward the cumulative tolerance", () => {
  const result = calculateGlycemicLoad({
    recipeId: "unweighed",
    servings: 1,
    ingredients: [{ name: "assumed seasoning", grams: 1.5, fineliRecordId: null, giRecordId: null, excludedReason: "Standard estimate; not weighed.", estimatedAvailableCarbohydratePerServingG: 0.3, negligibleAssumption: "1.5 g batch amount, assumed 0.6 g available carbohydrate total." }],
  }, [], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0.3);
  assert.equal(result.blockers.length, 0);
  assert.equal(result.ingredients[0].grams, 1.5);
  assert.equal(result.ingredients[0].availableCarbohydratePerServingG, 0.3);
  assert.match(result.ingredients[0].issues[0], /editorial tolerance/);
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
  assert.equal(result.unroundedGlycemicLoadPerServing, null);
  assert.match(result.blockers[0], /unpublished/);
});

test("positive sub-1 g carbohydrate without GI evidence is included in the disclosed tolerance", () => {
  const result = calculateGlycemicLoad({
    recipeId: "small-contribution",
    servings: 1,
    ingredients: [{ name: "spinach", grams: 100, fineliRecordId: "spinach", giRecordId: null }],
  }, [food("spinach", 0.2)], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0.2);
  assert.equal(result.ingredients[0].availableCarbohydratePerServingG, 0.2);
  assert.equal(result.ingredients[0].giContribution, null);
  assert.equal(result.blockers.length, 0);
});

test("6 g sesame across two servings uses the existing sub-1 g editorial tolerance without a nut GI proxy", () => {
  const result = calculateGlycemicLoad({
    recipeId: "thai-kookosriisi-mangolla",
    servings: 2,
    ingredients: [{ name: "seesaminsiemen", grams: 6, fineliRecordId: "sesame", giRecordId: null }],
  }, [food("sesame", 0.9)], []);
  assert.equal(result.status, "CALCULATED");
  assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - 0.027) < 1e-12);
  assert.equal(result.ingredients[0].giRecordId, null);
  assert.equal(result.ingredients[0].confidence, null);
  assert.equal(result.blockers.length, 0);
});

test("small contributions accumulate rather than disappearing ingredient by ingredient", () => {
  const ingredients = Array.from({ length: 10 }, (_, i) => ({ name: `food-${i}`, grams: 100, fineliRecordId: `food-${i}`, giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact raw-food match." }));
  const result = calculateGlycemicLoad({ recipeId: "ten-small", servings: 1, ingredients }, ingredients.map((ingredient) => food(ingredient.fineliRecordId, 0.9)), [gi]);
  assert.equal(result.status, "CALCULATED");
  assert.ok(Math.abs(result.ingredients.reduce((sum, ingredient) => sum + (ingredient.availableCarbohydratePerServingG ?? 0), 0) - 9) < 1e-9);
  assert.equal(result.glycemicLoadPerServing, 4.5);
});

test("two 0.99 g contributions are both included", () => {
  const ingredients = ["a", "b"].map((id) => ({ name: id, grams: 100, fineliRecordId: id, giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact raw-food match." }));
  const result = calculateGlycemicLoad({ recipeId: "two-small", servings: 1, ingredients }, ingredients.map((item) => food(item.fineliRecordId, 0.99)), [gi]);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0.99);
});

test("two 0.99 g unmatched portions are omitted within the new 2 g cumulative tolerance", () => {
  const ingredients = ["a", "b"].map((id) => ({ name: id, grams: 100, fineliRecordId: id, giRecordId: null }));
  const result = calculateGlycemicLoad({ recipeId: "two-unmatched-small", servings: 1, ingredients }, ingredients.map((item) => food(item.fineliRecordId, 0.99)), []);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 1.98);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0);
  assert.equal(result.confidence, "LOW");
  assert.equal(result.blockers.length, 0);
});

test("one 0.99 g unmatched portion is accepted without rounding the carbohydrate amount", () => {
  const result = calculateGlycemicLoad({ recipeId: "one-unmatched-small", servings: 1, ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: null }] }, [food("food", 0.99)], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0.99);
  assert.equal(result.confidence, "LOW");
});

test("source-backed small upper bounds stay distinct from estimated available carbohydrate", () => {
  const result = calculateGlycemicLoad({
    recipeId: "rosemary-upper-bound",
    servings: 2,
    ingredients: [{
      name: "fresh rosemary",
      grams: null,
      fineliRecordId: null,
      giRecordId: null,
      excludedReason: "Fresh rosemary is omitted under the existing small-contribution tolerance.",
      availableCarbohydrateUpperBoundPerServingG: 0.1035,
      upperBoundEvidence: "USDA FDC 173473 total carbohydrate ceiling for 1 g across two servings.",
    }],
  }, [], []);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0.1035);
  assert.equal(result.omittedAvailableCarbohydrateUpperBoundPerServingG, 0.1035);
  assert.equal(result.ingredients[0].availableCarbohydratePerServingG, null);
  assert.equal(result.ingredients[0].availableCarbohydrateUpperBoundPerServingG, 0.1035);
  assert.match(result.ingredients[0].issues[0] ?? "", /not an actual nutrient estimate/);
});

test("batch 2B2 GI omissions use source-backed per-item bounds and stay under both editorial limits", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
  ]);
  const recipes = JSON.parse(inputText) as { recipes: Array<{ recipeId: string; servings: number; ingredients: Array<{ name: string; grams: number | null; fineliRecordId: string | null; giRecordId: string | null; excludedReason?: string; availableCarbohydrateUpperBoundPerServingG?: number; upperBoundEvidence?: string }> }> };
  const foodRecords = JSON.parse(foodText) as FoodRecord[];
  const giRecords = (JSON.parse(giText) as { records: GlycemicIndexRecord[] }).records;
  const reviewed = [
    ["caponata", "kapriksia", 0.10535],
    ["pasta-alla-norma", "tuoretta basilikaa", 0.175],
    ["baozi", "kuivahiivaa", 0.72135],
    ["baozi", "raastettua inkivääriä", 0.114],
    ["harira", "jauhettua inkivääriä", 0.2148],
    ["vhh-runebergintortut", "kardemummaa", 0.208],
    ["thai-jok-kanalla", "inkivääri", 0.076],
  ] as const;

  for (const [recipeId, ingredientName, expectedBound] of reviewed) {
    const recipe = recipes.recipes.find((row) => row.recipeId === recipeId);
    assert.ok(recipe, `2B2 input includes ${recipeId}`);
    const ingredient = recipe.ingredients.find((row) => row.name === ingredientName);
    assert.ok(ingredient, `${recipeId} includes ${ingredientName}`);
    assert.equal(ingredient.giRecordId, null, `${ingredientName} has no unrelated GI proxy`);
    assert.equal(ingredient.availableCarbohydrateUpperBoundPerServingG, expectedBound);
    assert.ok(ingredient.upperBoundEvidence?.length, `${ingredientName} has bound evidence`);
    assert.ok(ingredient.excludedReason?.length, `${ingredientName} omission is disclosed`);
    assert.ok(expectedBound < 1, `${ingredientName} is under the individual cutoff`);

    if (ingredient.fineliRecordId && ingredient.grams !== null) {
      const foodRecord = foodRecords.find((row) => row.id === ingredient.fineliRecordId);
      assert.ok(foodRecord, `source record exists for ${ingredientName}`);
      assert.equal(foodRecord.carbohydrateDefinition, "EU_AVAILABLE");
      const sourceBound = ((foodRecord.per100g.carbohydrate ?? 0) + (foodRecord.per100g.fibre ?? 0)) * ingredient.grams / 100 / recipe.servings;
      assert.ok(Math.abs(expectedBound - sourceBound) < 1e-12, `${ingredientName} bound follows its source composition and recipe portion`);
    } else {
      assert.match(ingredient.upperBoundEvidence, /USDA FoodData Central SR Legacy FDC 175043/);
    }

    const result = calculateGlycemicLoad(recipe, foodRecords, giRecords);
    assert.ok(result.omittedAvailableCarbohydratePerServingG < 2, `${recipeId} stays below the cumulative cap`);
  }

  for (const [recipeId, ingredientName, wrongGiId] of [
    ["caponata", "tomaattimurskaa", "tomato-raw-cooked-sauce-analogue-gi-22"],
    ["pasta-alla-norma", "tomaattimurskaa", "tomato-raw-cooked-sauce-analogue-gi-22"],
    ["harira", "tomaattimurskaa", "tomato-raw-cooked-sauce-analogue-gi-22"],
    ["baozi", "maissitärkkelystä", "potatoes-category-mean-gi-71"],
    ["vhh-runebergintortut", "mantelijauhoa", "bakery-products-category-mean-gi-58"],
  ] as const) {
    const recipe = recipes.recipes.find((row) => row.recipeId === recipeId)!;
    const ingredient = recipe.ingredients.find((row) => row.name === ingredientName)!;
    assert.equal(ingredient.giRecordId, null, `${recipeId}/${ingredientName} has no mismatched GI mapping`);
    assert.ok(calculateGlycemicLoad(recipe, foodRecords, giRecords).status === "INSUFFICIENT SOURCE DATA");
    assert.ok(giRecords.some((record) => record.id === wrongGiId), `${wrongGiId} remains documented as a source, not assigned to this ingredient`);
  }

  const correctedSmallSeasoningRecipes = ["thai-jok-kanalla"];
  for (const recipeId of correctedSmallSeasoningRecipes) {
    const recipe = recipes.recipes.find((row) => row.recipeId === recipeId)!;
    const result = calculateGlycemicLoad(recipe, foodRecords, giRecords);
    assert.equal(result.status, "CALCULATED");
    assert.equal(result.confidence, "LOW");
  }
});

test("three 0.7 g unmatched portions exceed the 2 g cumulative tolerance", () => {
  const ingredients = ["a", "b", "c"].map((id) => ({ name: id, grams: 100, fineliRecordId: id, giRecordId: null }));
  const result = calculateGlycemicLoad({ recipeId: "three-small", servings: 1, ingredients }, ingredients.map((item) => food(item.fineliRecordId, 0.7)), []);
  assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - 2.1) < 1e-9);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.ok(result.blockers.some((blocker) => /at or above the 2 g editorial tolerance/.test(blocker)));
});

test("two 0.5 g unmatched portions remain below the 2 g cumulative tolerance", () => {
  const ingredients = ["a", "b"].map((id) => ({ name: id, grams: 100, fineliRecordId: id, giRecordId: null }));
  const result = calculateGlycemicLoad({ recipeId: "two-half", servings: 1, ingredients }, ingredients.map((item) => food(item.fineliRecordId, 0.5)), []);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 1);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.confidence, "LOW");
});

test("exactly 2 g of unmatched carbohydrate blocks the recipe", () => {
  const result = calculateGlycemicLoad({ recipeId: "exactly-two", servings: 1, ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: null }] }, [food("food", 2)], []);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
});

test("a single 1 g or larger unmatched portion still blocks", () => {
  for (const carbs of [1, 1.5]) {
    const result = calculateGlycemicLoad({ recipeId: `individual-${carbs}`, servings: 1, ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: null }] }, [food("food", carbs)], []);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(result.omittedAvailableCarbohydratePerServingG, 0);
    assert.equal(result.glycemicLoadPerServing, null);
  }
});

test("a wrong assigned GI match remains blocking even for a sub-1 g portion", () => {
  const wrong = { ...gi, foodKey: "different-food" };
  const result = calculateGlycemicLoad({ recipeId: "small-wrong-match", servings: 1, ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: wrong.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Incorrectly assigned GI match." }] }, [food("food", 0.5)], [wrong]);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0);
  assert.equal(result.glycemicLoadPerServing, null);
});

test("a single 0.99 g contribution is not rounded away", () => {
  const result = calculateGlycemicLoad({ recipeId: "one-small", servings: 1, ingredients: [{ name: "food", grams: 100, fineliRecordId: "food", giRecordId: gi.id, foodKey: "tested-food", preparationKey: "raw", giMatchEvidence: "Exact raw-food match." }] }, [food("food", 0.99)], [gi]);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.glycemicLoadPerServing, 0.5);
});

test("a measured zero is distinct from an unknown amount", () => {
  const zero = calculateGlycemicLoad({ recipeId: "zero-source", servings: 1, ingredients: [{ name: "oil", grams: 20, fineliRecordId: "oil", giRecordId: null }] }, [food("oil", 0)], []);
  const unknown = calculateGlycemicLoad({ recipeId: "unknown", servings: 1, ingredients: [{ name: "unknown", grams: null, fineliRecordId: null, giRecordId: null, excludedReason: "Amount and mapping unknown." }] }, [], []);
  assert.equal(zero.status, "CALCULATED");
  assert.equal(zero.glycemicLoadPerServing, 0);
  assert.equal(unknown.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(unknown.glycemicLoadPerServing, null);
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
