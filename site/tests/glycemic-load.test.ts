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
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], fineliRecordId: "food-b" }] },
    { ...reviewed, ingredients: [{ ...reviewed.ingredients[0], giRecordId: "gi-b" }] },
  ]) assert.equal(recipeBindingMatches(fingerprint, glycemicLoadInputHash(changed)), false);
  assert.equal(recipeBindingMatches(fingerprint, glycemicLoadInputHash({ ...reviewed, ingredients: [{ ...reviewed.ingredients[0], massEvidence: "100g listed, corrected punctuation." }] })), true);
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

test("category means reject clear rice-vinegar/rice and milk-chocolate/dairy mismatches", () => {
  const riceGi = { ...gi, id: "rice-mean", foodKey: "rice-category-mean", preparationKey: "category-mean", matchKind: "CATEGORY_MEAN" as const, qualityTier: "SUPPLEMENTARY" as const, confidence: "LOW" as const };
  const dairyGi = { ...gi, id: "dairy-mean", foodKey: "dairy", preparationKey: "category-mean", matchKind: "CATEGORY_MEAN" as const, qualityTier: "SUPPLEMENTARY" as const, confidence: "LOW" as const };
  for (const scenario of [
    { name: "riisiviinietikkaa", food: food("rice", 79, "Dry uncooked long-grain rice"), giRecord: riceGi, foodKey: "rice-category-mean" },
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

test("unmatched small portions are summed and block totals above the editorial tolerance", () => {
  const ingredients = ["a", "b"].map((id) => ({ name: id, grams: 100, fineliRecordId: id, giRecordId: null }));
  const result = calculateGlycemicLoad({ recipeId: "two-unmatched-small", servings: 1, ingredients }, ingredients.map((item) => food(item.fineliRecordId, 0.99)), []);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 1.98);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.ok(result.blockers.some((blocker) => /cumulative omitted available carbohydrate/.test(blocker)));
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
