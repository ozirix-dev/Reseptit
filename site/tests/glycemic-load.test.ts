import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import type { FoodRecord } from "../scripts/nutrition-model";
import { calculateGlycemicLoad, classifyGlycemicLoad, roundGlycemicLoadForDisplay, type GlycemicIndexRecord, type GlycemicLoadRecipeInput } from "../scripts/glycemic-load-model";
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

test("plain-yogurt category mean binds only to ingredients in the yogurt family", () => {
  const yogurtGi = {
    ...gi,
    id: "plain-yogurt-category-mean-test",
    foodKey: "plain-yogurt-category-mean",
    preparationKey: "category-mean",
    matchKind: "CATEGORY_MEAN" as const,
    qualityTier: "SUPPLEMENTARY" as const,
    confidence: "LOW" as const,
  };
  const calculateFor = (name: string) => {
    const sourceFood = food(`food-${name}`, 10, name);
    return calculateGlycemicLoad({
      recipeId: `yogurt-binding-${name}`,
      servings: 1,
      ingredients: [{
        name,
        grams: 100,
        fineliRecordId: sourceFood.id,
        giRecordId: yogurtGi.id,
        preparationKey: "category-mean",
        giMatchEvidence: "Published plain-yogurt category mean test fixture.",
      }],
    }, [sourceFood], [yogurtGi]);
  };

  for (const name of ["maustamatonta jogurttia 3,9 % rasvaa", "plain yogurt"]) {
    const result = calculateFor(name);
    assert.equal(result.status, "CALCULATED", name);
    assert.equal(result.glycemicLoadPerServing, 5, name);
    assert.equal(result.ingredients[0]?.matchKind, "CATEGORY_MEAN", name);
  }

  for (const name of ["plain rice", "maustamaton kerma"]) {
    const result = calculateFor(name);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA", name);
    assert.equal(result.glycemicLoadPerServing, null, name);
    assert.ok(result.blockers.length > 0, name);
    assert.equal(result.ingredients[0]?.giContribution, null, name);
    assert.equal(result.ingredients[0]?.availableCarbohydratePerServingG, 10, name);
  }
});

test("batch 2B6C retains source-supported warm tortilla and cream omissions while blocking fried tostada and baked chocolate", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText, pilotText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
    readFile(path.join(root, "tmp/nutrition/glycemic-load-pilot.json"), "utf8"),
  ]);
  const inputs = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const foods = JSON.parse(foodText) as FoodRecord[];
  const gis = (JSON.parse(giText) as { records: GlycemicIndexRecord[] }).records;
  const pilot = JSON.parse(pilotText) as { results: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null; confidence: string | null; omittedAvailableCarbohydratePerServingG: number }> };
  const expected = [
    { id: "meksikolainen-aamiais-tacot-mustapavuilla", gl: 16.04, omitted: 0.727 },
    { id: "vhh-kaalikaarryleet", gl: 9.24, omitted: 1.578025 },
  ];
  for (const item of expected) {
    const recipe = inputs.recipes.find((row) => row.recipeId === item.id)!;
    const result = calculateGlycemicLoad(recipe, foods, gis);
    assert.equal(result.status, "CALCULATED", item.id);
    assert.equal(result.glycemicLoadPerServing, item.gl, `${item.id} GK/serving`);
    assert.equal(result.confidence, "LOW", `${item.id} proxy or editorial omission is visible`);
    assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - item.omitted) < 1e-12, `${item.id} cumulative omitted carbohydrate`);
    assert.ok(result.omittedAvailableCarbohydratePerServingG < 2, `${item.id} existing cumulative editorial tolerance`);
    const audit = pilot.results.find((row) => row.recipeId === item.id)!;
    assert.equal(audit.status, "CALCULATED", `${item.id} all-325 audit`);
    assert.equal(audit.glycemicLoadPerServing, item.gl, `${item.id} all-325 audit GK`);
  }

  const tortilla = inputs.recipes.find((row) => row.recipeId === expected[0]!.id)!.ingredients.find((row) => row.name === "maissitortilla")!;
  assert.equal(tortilla.foodKey, "corn-tortilla");
  assert.equal(tortilla.preparationKey, "commercial-corn-tortilla");
  assert.equal(tortilla.giRecordId, "corn-tortilla-noriega-2000-glucose-estimate");

  for (const id of ["meheva-suklaakakku", "meksikolainen-paputostada-aamupalaksi"]) {
    const recipe = inputs.recipes.find((row) => row.recipeId === id)!;
    const result = calculateGlycemicLoad(recipe, foods, gis);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA", `${id} requires GI/preparation evidence`);
    assert.equal(result.glycemicLoadPerServing, null, `${id} must not have a published GK estimate`);
    assert.ok(result.blockers.length > 0, `${id} must retain a genuine blocker`);
    const audited = pilot.results.find((row) => row.recipeId === id)!;
    assert.equal(audited.status, "INSUFFICIENT SOURCE DATA", `${id} full-inventory audit`);
    assert.equal(audited.glycemicLoadPerServing, null, `${id} full-inventory GK`);
  }
  const tostada = inputs.recipes.find((row) => row.recipeId === "meksikolainen-paputostada-aamupalaksi")!;
  assert.equal(tostada.ingredients.find((row) => row.name === "maissitortilla")?.preparationKey, undefined,
    "commercial soft-tortilla preparation may not be assigned to a crispy tostada");
  const cake = inputs.recipes.find((row) => row.recipeId === "meheva-suklaakakku")!;
  assert.equal(cake.ingredients.find((row) => row.name === "tummaa suklaata")?.preparationKey, undefined,
    "as-sold dark chocolate source is not a baked-cake preparation match");

  const darkChocolate = gis.find((row) => row.id === "dark-chocolate-international-tables-mean-gi-29")!;
  const milkChocolate = calculateGlycemicLoad({
    recipeId: "milk-chocolate-must-not-match-dark-chocolate-mean",
    servings: 1,
    ingredients: [{ name: "maitosuklaata", grams: 100, fineliRecordId: "food", giRecordId: darkChocolate.id, foodKey: "chocolate", preparationKey: "dark-chocolate-as-sold", giMatchEvidence: "Dark chocolate category mean." }],
  }, [food("food", 55, "maitosuklaata")], [darkChocolate]);
  assert.equal(milkChocolate.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(milkChocolate.glycemicLoadPerServing, null);

  const whiteChocolate = calculateGlycemicLoad({
    recipeId: "white-chocolate-must-not-match-dark-chocolate-mean",
    servings: 1,
    ingredients: [{ name: "valkosuklaata", grams: 100, fineliRecordId: "food", giRecordId: darkChocolate.id, foodKey: "chocolate", preparationKey: "dark-chocolate-as-sold", giMatchEvidence: "Dark chocolate category mean." }],
  }, [food("food", 55, "valkosuklaata")], [darkChocolate]);
  assert.equal(whiteChocolate.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(whiteChocolate.glycemicLoadPerServing, null);
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

test("tacokulho-nauta-avokado regression uses exact raw tomato and a labelled plain-yogurt category mean", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [pilot, foods, catalog] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((value) => JSON.parse(value)),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((value) => JSON.parse(value)),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((value) => JSON.parse(value)),
  ]);
  const recipe = pilot.recipes.find((row: { recipeId: string }) => row.recipeId === "tacokulho-nauta-avokado");
  const tomato = recipe.ingredients.find((row: { name: string }) => row.name === "tomaattia");
  const yogurt = recipe.ingredients.find((row: { name: string }) => row.name === "maustamatonta jogurttia 3,9 % rasvaa");
  assert.equal(tomato?.fineliRecordId, "fineli-352-release-20");
  assert.equal(tomato?.giRecordId, "whole-tomato-raw-gi-22");
  assert.equal(tomato?.preparationKey, "whole-raw");
  assert.equal(yogurt?.fineliRecordId, "fineli-620-release-20");
  assert.equal(yogurt?.giRecordId, "plain-yogurt-category-mean-gi-27-2017");
  assert.equal(yogurt?.excludedReason, undefined, "known composition and mass must use the normal Fineli carbohydrate calculation");
  const result = calculateGlycemicLoad(recipe, foods, catalog.records);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.unroundedGlycemicLoadPerServing, 0.41925);
  assert.equal(result.glycemicLoadPerServing, 0.42);
  assert.equal(roundGlycemicLoadForDisplay(result.glycemicLoadPerServing), 0.4);
  assert.equal(classifyGlycemicLoad(result.unroundedGlycemicLoadPerServing), "LOW");
  assert.equal(result.confidence, "LOW");
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 1.24525);
  assert.ok(result.omittedAvailableCarbohydratePerServingG < 2);
  assert.equal(result.ingredients.find((row) => row.name === "tomaattia")?.matchKind, "EXACT");
  assert.equal(result.ingredients.find((row) => row.name === "maustamatonta jogurttia 3,9 % rasvaa")?.matchKind, "CATEGORY_MEAN");
});

test("pesto chicken salad regression uses a low-confidence raw-cherry-tomato cultivar analogue", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [pilot, foods, catalog] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((value) => JSON.parse(value)),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((value) => JSON.parse(value)),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((value) => JSON.parse(value)),
  ]);
  const recipe = pilot.recipes.find((row: { recipeId: string }) => row.recipeId === "kanasalaatti-pesto-mozzarella");
  const tomato = recipe.ingredients.find((row: { name: string }) => row.name === "kirsikkatomaatteja");
  const giRecord = catalog.records.find((row: { id: string }) => row.id === "tomato-cherry-raw-analogue-gi-22");
  assert.equal(tomato?.fineliRecordId, "afcd-F009190-release-3");
  assert.equal(tomato?.preparationKey, "whole-raw");
  assert.equal(giRecord?.gi, 22);
  assert.equal(giRecord?.matchKind, "ANALOG");
  assert.equal(giRecord?.qualityTier, "SUPPLEMENTARY");
  assert.equal(giRecord?.confidence, "LOW");
  assert.match(giRecord?.note ?? "", /not for sauces or cooked tomatoes/);
  const result = calculateGlycemicLoad(recipe, foods, catalog.records);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.unroundedGlycemicLoadPerServing, 0.28875);
  assert.equal(result.glycemicLoadPerServing, 0.29);
  assert.equal(roundGlycemicLoadForDisplay(result.glycemicLoadPerServing), 0.3);
  assert.equal(classifyGlycemicLoad(result.unroundedGlycemicLoadPerServing), "LOW");
  assert.equal(result.confidence, "LOW");
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0.816225);
  assert.equal(result.ingredients.find((row) => row.name === "kirsikkatomaatteja")?.matchKind, "ANALOG");
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

test("batch 2B3 eight estimates match report classes, sources, amounts and fingerprints", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const ids = ["malesialainen-congee-inkivaarilla", "kiinalainen-riisipuuro-kananmunalla", "thai-porsasjok", "lahi-ita-kikhernejauho-yrttilettu", "kai-jiew-vhh", "hyderabadi-kanabiryani", "yrttituorejuusto-kinkkurullat", "keto-mutakakku"];
  const files = await Promise.all([
    "docs/nutrition/glycemic-load-pilot-input.json", "docs/nutrition/food-records.json",
    "docs/nutrition/glycemic-index-records.json", "docs/nutrition/glycemic-load-recipe-bindings.json",
    "docs/nutrition/glycemic-load-recipe-aliases.json", "docs/nutrition/glycemic-coverage-batch-2b3-review.md",
  ].map((file) => readFile(path.join(root, file), "utf8")));
  const inputs = JSON.parse(files[0]) as { recipes: Array<{ recipeId: string; servings: number; ingredients: Array<{ name: string; grams: number | null; fineliRecordId: string | null; giRecordId: string | null; excludedReason?: string; estimatedAvailableCarbohydratePerServingG?: number; availableCarbohydrateUpperBoundPerServingG?: number; upperBoundEvidence?: string }> }> };
  const foods = JSON.parse(files[1]) as FoodRecord[];
  const gis = (JSON.parse(files[2]) as { records: GlycemicIndexRecord[] }).records;
  const bindings = JSON.parse(files[3]) as { recipes: Record<string, string>; calculationInputs: Record<string, string>; calculationEvidence: Record<string, string> };
  const aliases = (JSON.parse(files[4]) as { aliases: Record<string, { canonical: string; evidence: string }> }).aliases;
  const report = files[5];
  const classes: Record<string, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  const paths: Record<string, string> = {
    "malesialainen-congee-inkivaarilla": "aamupalat", "kiinalainen-riisipuuro-kananmunalla": "aamupalat", "thai-porsasjok": "aamupalat", "lahi-ita-kikhernejauho-yrttilettu": "aamupalat", "kai-jiew-vhh": "paaruoat", "hyderabadi-kanabiryani": "paaruoat", "yrttituorejuusto-kinkkurullat": "aamupalat", "keto-mutakakku": "jalkiruoat",
  };
  for (const id of ids) {
    const input = inputs.recipes.find((row) => row.recipeId === id);
    assert.ok(input, `${id} input exists exactly once`);
    assert.equal(inputs.recipes.filter((row) => row.recipeId === id).length, 1);
    const result = calculateGlycemicLoad(input, foods, gis);
    assert.equal(result.status, "CALCULATED", id);
    assert.equal(result.confidence, "LOW", id);
    assert.ok(result.glycemicLoadPerServing !== null);
    const classification = classifyGlycemicLoad(result.glycemicLoadPerServing);
    classes[classification]++;
    assert.ok(result.omittedAvailableCarbohydratePerServingG < 2, `${id} cumulative omitted carbs under 2 g`);
    for (const item of input.ingredients.filter((ingredient) => ingredient.excludedReason && (ingredient.estimatedAvailableCarbohydratePerServingG ?? ingredient.availableCarbohydrateUpperBoundPerServingG ?? 0) > 0)) {
      const omitted = item.estimatedAvailableCarbohydratePerServingG ?? item.availableCarbohydrateUpperBoundPerServingG!;
      assert.ok(omitted < 1, `${id}/${item.name}: individual omitted amount <1 g`);
      if (item.availableCarbohydrateUpperBoundPerServingG !== undefined) assert.ok(item.upperBoundEvidence);
    }
    const markdown = await readFile(path.join(root, "reseptit", paths[id], `${id}.md`), "utf8");
    assert.equal(recipeBindingHash(markdown, aliases), bindings.recipes[id], `${id} recipe fingerprint`);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[id], `${id} input fingerprint`);
    assert.equal(glycemicLoadEvidenceHash(input, foods, gis), bindings.calculationEvidence[id], `${id} source fingerprint`);
    const row = report.split("\n").find((line) => line.startsWith(`| ${id} |`));
    assert.ok(row, `${id} appears in audit table`);
    const cells = row.split("|").map((cell) => cell.trim());
    assert.ok(Math.abs(Number(cells[6].replace(",", ".")) - result.glycemicLoadPerServing) < 0.005, `${id} report GL`);
    const classMap: Record<string, string> = { Korkea: "HIGH", Keskitaso: "MEDIUM", Matala: "LOW" };
    assert.equal(classMap[cells[7]], classification, `${id} report GL class`);
    assert.equal(cells[8], "LOW", `${id} confidence is separate from GL class`);
  }
  assert.deepEqual(classes, { HIGH: 4, MEDIUM: 0, LOW: 4 });
  assert.match(report, /4 korkea, 4 matala ja 0 keskitaso/);
});

test("batch 2B3 regressions block missing sources, changed bindings, invalid GI and unknown carbs", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
  ]);
  const input = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const recipe = input.recipes.find((row) => row.recipeId === "hyderabadi-kanabiryani")!;
  const foods = JSON.parse(foodText) as FoodRecord[];
  const gis = (JSON.parse(giText) as { records: GlycemicIndexRecord[] }).records;
  const missingRice = calculateGlycemicLoad(recipe, foods.filter((row) => row.id !== "afcd-F007682-2026-10-24"), gis);
  assert.equal(missingRice.status, "INSUFFICIENT SOURCE DATA");
  const changedMass = structuredClone(recipe);
  changedMass.ingredients.find((row) => row.name === "basmatiriisiä")!.grams = 301;
  assert.equal(recipeBindingMatches(glycemicLoadInputHash(recipe), glycemicLoadInputHash(changedMass)), false);
  const wrongGiRecipe = structuredClone(recipe);
  wrongGiRecipe.ingredients.find((row) => row.name === "basmatiriisiä")!.giRecordId = "onion-literature-analogue-gi-15";
  assert.equal(calculateGlycemicLoad(wrongGiRecipe, foods, gis).status, "INSUFFICIENT SOURCE DATA");
  const overBudget = structuredClone(recipe);
  const smallOmissions = overBudget.ingredients.filter((row) => typeof row.estimatedAvailableCarbohydratePerServingG === "number" && Number(row.estimatedAvailableCarbohydratePerServingG) > 0);
  smallOmissions[0].estimatedAvailableCarbohydratePerServingG = 0.99;
  smallOmissions[1].estimatedAvailableCarbohydratePerServingG = 0.99;
  smallOmissions[2].estimatedAvailableCarbohydratePerServingG = 0.1;
  const overBudgetResult = calculateGlycemicLoad(overBudget, foods, gis);
  assert.ok(overBudgetResult.omittedAvailableCarbohydratePerServingG >= 2);
  assert.equal(overBudgetResult.status, "INSUFFICIENT SOURCE DATA");
  const unknown = structuredClone(recipe);
  const unknownItem = unknown.ingredients.find((row) => row.name === "tuoretta minttua")!;
  delete unknownItem.estimatedAvailableCarbohydratePerServingG;
  assert.equal(calculateGlycemicLoad(unknown, foods, gis).status, "INSUFFICIENT SOURCE DATA");
  assert.equal(calculateGlycemicLoad(unknown, foods, gis).glycemicLoadPerServing, null);
});

test("batch 2B4 raw mango GI source is food-specific, conservative and reusable", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText, bindingText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8"),
  ]);
  const input = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const foods = JSON.parse(foodText) as FoodRecord[];
  const gis = (JSON.parse(giText) as { records: GlycemicIndexRecord[] }).records;
  const bindings = JSON.parse(bindingText) as { calculationInputs: Record<string, string>; calculationEvidence: Record<string, string> };
  const mangoGi = gis.find((row) => row.id === "mango-raw-mean-gi-51-2002");
  assert.ok(mangoGi);
  assert.equal(mangoGi.gi, 51);
  assert.equal(mangoGi.foodKey, "mango");
  assert.equal(mangoGi.preparationKey, "raw");
  assert.equal(mangoGi.qualityTier, "SUPPLEMENTARY");
  assert.equal(mangoGi.matchKind, "ANALOG");
  assert.equal(mangoGi.confidence, "LOW");
  assert.equal(mangoGi.source.url, "https://doi.org/10.1093/ajcn/76.1.5");

  const yogurt = input.recipes.find((row) => row.recipeId === "karibia-mango-limejogurtti");
  assert.ok(yogurt);
  const mango = yogurt.ingredients.find((row) => row.name === "kuorittua mangoa");
  assert.ok(mango);
  assert.equal(mango.grams, 200);
  assert.equal(mango.giRecordId, mangoGi.id);
  assert.equal(mango.foodKey, "mango");
  assert.equal(mango.preparationKey, "raw");
  const yogurtResult = calculateGlycemicLoad(yogurt, foods, gis);
  assert.equal(yogurtResult.status, "CALCULATED");
  assert.equal(yogurtResult.glycemicLoadPerServing, 7.3);
  assert.equal(yogurtResult.confidence, "LOW");
  assert.ok(Math.abs(yogurtResult.omittedAvailableCarbohydratePerServingG - 0.73) < 1e-12);
  assert.equal(roundGlycemicLoadForDisplay(yogurtResult.glycemicLoadPerServing!), 7);
  assert.equal(glycemicLoadInputHash(yogurt), bindings.calculationInputs[yogurt.recipeId]);
  assert.equal(glycemicLoadEvidenceHash(yogurt, foods, gis), bindings.calculationEvidence[yogurt.recipeId]);
  const broadFruitProxy = structuredClone(yogurt);
  const broadMango = broadFruitProxy.ingredients.find((row) => row.name === "kuorittua mangoa")!;
  broadMango.giRecordId = "fruit-category-mean-gi-51";
  broadMango.foodKey = "fruit-category-mean";
  broadMango.preparationKey = "category-mean";
  broadMango.giMatchEvidence = "Broad fruit-category mean, not a mango-specific GI source.";
  assert.equal(calculateGlycemicLoad(broadFruitProxy, foods, gis).status, "INSUFFICIENT SOURCE DATA", "a broad fruit proxy does not become an acceptable mango match");

  const riceBowl = input.recipes.find((row) => row.recipeId === "thai-kookosriisi-mangolla");
  assert.ok(riceBowl);
  const riceMango = riceBowl.ingredients.find((row) => row.name === "mango");
  assert.ok(riceMango);
  assert.equal(riceMango.giRecordId, mangoGi.id);
  const riceResult = calculateGlycemicLoad(riceBowl, foods, gis);
  assert.equal(riceResult.status, "INSUFFICIENT SOURCE DATA", "unidentified coconut milk remains blocking");
  assert.equal(riceResult.glycemicLoadPerServing, null);
  assert.ok(riceResult.blockers.some((row) => /coconut milk/.test(row)));
  assert.equal(glycemicLoadInputHash(riceBowl), bindings.calculationInputs[riceBowl.recipeId]);
  assert.equal(glycemicLoadEvidenceHash(riceBowl, foods, gis), bindings.calculationEvidence[riceBowl.recipeId]);
});

test("batch 2B6D date GI evidence is scoped and opens only source-supported recipes", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText, bindingText, aliasText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8"),
  ]);
  const inputs = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const foods = JSON.parse(foodText) as FoodRecord[];
  const catalog = JSON.parse(giText) as { records: GlycemicIndexRecord[] };
  const bindings = JSON.parse(bindingText) as { recipes: Record<string, string>; calculationInputs: Record<string, string>; calculationEvidence: Record<string, string> };
  const aliases = (JSON.parse(aliasText) as { aliases: Record<string, { canonical: string; evidence: string }> }).aliases;
  const dateGi = catalog.records.find((record) => record.id === "dried-date-tamer-mean-gi-55-2-algeffari-2016");
  assert.ok(dateGi);
  assert.equal(dateGi.gi, 55.2);
  assert.equal(dateGi.foodKey, "dried-date-tamer");
  assert.equal(dateGi.preparationKey, "tamer-stage-as-sold");
  assert.equal(dateGi.qualityTier, "SUPPLEMENTARY");
  assert.equal(dateGi.referenceScale, "GLUCOSE_100");
  assert.equal(dateGi.matchKind, "ANALOG");
  assert.equal(dateGi.confidence, "LOW");
  assert.equal(dateGi.source.url, "https://doi.org/10.5144/0256-4947.2016.397");
  assert.equal(dateGi.source.participants, 19);
  assert.match(dateGi.source.table, /mean GI 55\.2 \(SEM 7\.7\), range 42\.8–74\.6/);

  const semolinaGi = catalog.records.find((record) => record.id === "semolina-steamed-gelatinized-mani-1992-gi-55");
  assert.ok(semolinaGi);
  assert.equal(semolinaGi.gi, 55);
  assert.equal(semolinaGi.foodKey, "semolina");
  assert.equal(semolinaGi.preparationKey, "water-gelatinized-semolina");
  assert.equal(semolinaGi.qualityTier, "SUPPLEMENTARY");
  assert.equal(semolinaGi.matchKind, "ANALOG");
  assert.equal(semolinaGi.confidence, "LOW");
  assert.equal(semolinaGi.source.participants, 6);
  assert.match(semolinaGi.source.table, /steamed and gelatinized with 5 g groundnut oil/);
  assert.match(semolinaGi.source.qualityEvidence, /not this recipe/);

  const orangeGi = catalog.records.find((record) => record.id === "orange-navel-2021-gi-45");
  assert.ok(orangeGi);
  assert.equal(orangeGi.gi, 45);
  assert.equal(orangeGi.foodKey, "orange");
  assert.equal(orangeGi.preparationKey, "raw-orange");
  assert.equal(orangeGi.qualityTier, "STRONG");
  assert.equal(orangeGi.matchKind, "ANALOG");
  assert.equal(orangeGi.confidence, "LOW");
  assert.equal(orangeGi.source.participants, 10);
  assert.match(orangeGi.source.table, /navel oranges, Australia, GI 45 ± 5/);

  const cases = [
    { id: "kiinalainen-hirssipuuro-taateleilla", expected: 21.19 },
    { id: "pohjoisafrikkalainen-taatelipuuro-appelsiinilla", expected: 21.95 },
    { id: "pohjoisafrikkalainen-kuskus-aamiaiskulho", expected: 34.36 },
  ];
  for (const item of cases) {
    const input = inputs.recipes.find((recipe) => recipe.recipeId === item.id)!;
    const date = input.ingredients.find((ingredient) => /taatel/i.test(ingredient.name));
    assert.ok(date, `${item.id} has a separately served dried-date ingredient`);
    assert.equal(date.grams, 10);
    assert.equal(date.giRecordId, dateGi.id);
    assert.equal(date.foodKey, dateGi.foodKey);
    assert.equal(date.preparationKey, dateGi.preparationKey);
    const result = calculateGlycemicLoad(input, foods, catalog.records);
    assert.equal(result.status, "CALCULATED", item.id);
    assert.equal(result.glycemicLoadPerServing, item.expected, item.id);
    assert.equal(result.confidence, "LOW", item.id);
    assert.deepEqual(result.blockers, []);
    const markdown = await readFile(path.join(root, "reseptit", "aamupalat", `${item.id}.md`), "utf8");
    assert.equal(recipeBindingHash(markdown, aliases), bindings.recipes[item.id], `${item.id} recipe fingerprint`);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[item.id], `${item.id} input fingerprint`);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[item.id], `${item.id} evidence fingerprint`);
  }

  const orangePorridge = inputs.recipes.find((recipe) => recipe.recipeId === "pohjoisafrikkalainen-taatelipuuro-appelsiinilla")!;
  const semolina = orangePorridge.ingredients.find((ingredient) => ingredient.name === "mannasuurimo")!;
  const orange = orangePorridge.ingredients.find((ingredient) => ingredient.name === "appelsiini")!;
  assert.deepEqual([semolina.giRecordId, semolina.foodKey, semolina.preparationKey], [semolinaGi.id, "semolina", "water-gelatinized-semolina"]);
  assert.deepEqual([orange.giRecordId, orange.foodKey, orange.preparationKey], [orangeGi.id, "orange", "raw-orange"]);
  assert.notEqual(semolina.giRecordId, "bakery-products-category-mean-gi-58");
  assert.notEqual(orange.giRecordId, "fruit-category-mean-gi-51");

  const cookedDateRecipe = inputs.recipes.find((recipe) => recipe.recipeId === "lahi-ita-taatelipuuro-tahinilla")!;
  const cookedDate = cookedDateRecipe.ingredients.find((ingredient) => /taatel/i.test(ingredient.name))!;
  assert.equal(cookedDate.giRecordId, null, "dates cooked into the porridge stay unmatched");
  const cookedResult = calculateGlycemicLoad(cookedDateRecipe, foods, catalog.records);
  assert.equal(cookedResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(cookedResult.glycemicLoadPerServing, null);
  assert.ok(cookedResult.blockers.some((blocker) => blocker.includes("cooks the dried dates")));
  const cookedDateMarkdown = await readFile(path.join(root, "reseptit", "aamupalat", "lahi-ita-taatelipuuro-tahinilla.md"), "utf8");
  assert.match(cookedDateMarkdown, /1\. Mittaa kaurahiutale[\s\S]*?\n2\. Hauduta[\s\S]*?\n3\. Keitä puuro taatelien/);
  assert.doesNotMatch(cookedDateMarkdown, /\n4\. Keitä puuro taatelien/);
});

test("batch 2B6D pitted-date source and new GK values pass an independent numerical check", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
  ]);
  const inputs = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const foods = JSON.parse(foodText) as FoodRecord[];
  const gis = (JSON.parse(giText) as { records: GlycemicIndexRecord[] }).records;
  const dateFood = foods.find((row) => row.id === "afcd-F003496-release-3");
  const oldFineliDate = foods.find((row) => row.id === "fineli-28937-release-20");
  const dateGi = gis.find((row) => row.id === "dried-date-tamer-mean-gi-55-2-algeffari-2016");
  assert.ok(dateFood);
  assert.ok(oldFineliDate);
  assert.ok(dateGi);
  assert.equal(dateFood.per100g.carbohydrate, 67.2);
  assert.equal(dateFood.per100g.fibre, 9.7);
  assert.equal(dateFood.basis, "per100g-as-sold");
  assert.match(dateFood.name, /pitted/i);
  assert.equal(oldFineliDate.per100g.carbohydrate, 38.158);
  assert.equal(oldFineliDate.basis, "unresolved");
  assert.match(oldFineliDate.state, /87% edible portion listed/);
  assert.match(oldFineliDate.state, /denominator unresolved/);
  assert.equal(inputs.recipes.some((recipe) => recipe.ingredients.some((ingredient) => ingredient.fineliRecordId === oldFineliDate.id)), false);
  assert.equal(dateGi.gi, 55.2);

  const cases = [
    {
      id: "kiinalainen-hirssipuuro-taateleilla",
      expected: 21.19,
      previous: 20.39,
      terms: [
        { ingredient: "hirssi", foodId: "fineli-160-release-20", carbohydratePer100g: 68.8, grams: 100, giId: "millet-groats-rozanska-2020-gi-56-2", gi: 56.2 },
        { ingredient: "kivettömiä kuivattuja taateleita", foodId: "afcd-F003496-release-3", carbohydratePer100g: 67.2, grams: 10, giId: dateGi.id, gi: 55.2 },
      ],
    },
    {
      id: "pohjoisafrikkalainen-taatelipuuro-appelsiinilla",
      expected: 21.95,
      terms: [
        { ingredient: "mannasuurimo", foodId: "fineli-112-release-20", carbohydratePer100g: 63.6, grams: 100, giId: "semolina-steamed-gelatinized-mani-1992-gi-55", gi: 55 },
        { ingredient: "appelsiini", foodId: "fineli-11045-release-20", carbohydratePer100g: 8.9, grams: 130, giId: "orange-navel-2021-gi-45", gi: 45 },
        { ingredient: "kivettömiä kuivattuja taateleita", foodId: "afcd-F003496-release-3", carbohydratePer100g: 67.2, grams: 10, giId: dateGi.id, gi: 55.2 },
      ],
    },
    {
      id: "pohjoisafrikkalainen-kuskus-aamiaiskulho",
      expected: 34.36,
      previous: 33.56,
      terms: [
        { ingredient: "kuskus", foodId: "fineli-29208-release-20", carbohydratePer100g: 63.6, grams: 100, giId: "couscous-groats-rozanska-2020-gi-99", gi: 99 },
        { ingredient: "kivettömiä kuivattuja taateleita", foodId: "afcd-F003496-release-3", carbohydratePer100g: 67.2, grams: 10, giId: dateGi.id, gi: 55.2 },
        { ingredient: "manteli", foodId: "fineli-379-release-20", carbohydratePer100g: 6.6, grams: 20, giId: "nuts-category-mean-gi-22", gi: 22 },
        { ingredient: "jogurtti", foodId: "fineli-619-release-20", carbohydratePer100g: 5, grams: 100, giId: "dairy-category-mean-gi-35", gi: 35 },
      ],
    },
  ];
  const dateCarbohydratePerServing = 67.2 * 10 / 100 / 2;
  const newDateContribution = dateCarbohydratePerServing * 55.2 / 100;
  assert.equal(dateCarbohydratePerServing, 3.36);
  assert.ok(Math.abs(newDateContribution - 1.85472) < 1e-12);

  for (const item of cases) {
    const recipe = inputs.recipes.find((row) => row.recipeId === item.id);
    assert.ok(recipe);
    const date = recipe.ingredients.find((row) => /taatel/i.test(row.name));
    assert.ok(date);
    assert.equal(date.name, "kivettömiä kuivattuja taateleita");
    assert.equal(date.grams, 10);
    assert.equal(date.fineliRecordId, "afcd-F003496-release-3");
    assert.match(date.massEvidence!, /10 g pitted dried dates/);

    let independentSum = 0;
    for (const term of item.terms) {
      const ingredient: GlycemicLoadRecipeInput["ingredients"][number] | undefined = recipe.ingredients.find(
        (row: GlycemicLoadRecipeInput["ingredients"][number]) => row.name === term.ingredient,
      );
      const foodSource = foods.find((row) => row.id === term.foodId);
      const giSource = gis.find((row) => row.id === term.giId);
      assert.ok(ingredient);
      assert.ok(foodSource);
      assert.ok(giSource);
      assert.equal(ingredient.grams, term.grams);
      assert.equal(ingredient.fineliRecordId, term.foodId);
      assert.equal(ingredient.giRecordId, term.giId);
      assert.equal(foodSource.per100g.carbohydrate, term.carbohydratePer100g);
      assert.equal(giSource.gi, term.gi);
      independentSum += (term.carbohydratePer100g * term.grams / 100 / recipe.servings) * term.gi / 100;
    }
    const result = calculateGlycemicLoad(recipe, foods, gis);
    assert.equal(Math.round(independentSum * 100) / 100, item.expected);
    assert.equal(result.unroundedGlycemicLoadPerServing, independentSum);
    assert.equal(result.glycemicLoadPerServing, item.expected);
    const dateResult = result.ingredients.find((row) => /taatel/i.test(row.name));
    assert.equal(dateResult?.availableCarbohydratePerServingG, 3.36);
    assert.ok(Math.abs((dateResult?.giContribution ?? 0) - 1.85472) < 1e-12);
  }

  const cookedDateRecipe = inputs.recipes.find((row) => row.recipeId === "lahi-ita-taatelipuuro-tahinilla");
  assert.ok(cookedDateRecipe);
  const cookedDate = cookedDateRecipe.ingredients.find((row) => /taatel/i.test(row.name));
  assert.ok(cookedDate);
  assert.equal(cookedDate.fineliRecordId, "afcd-F003496-release-3");
  assert.equal(cookedDate.grams, 10);
  assert.equal(cookedDate.giRecordId, null);
  const cookedResult = calculateGlycemicLoad(cookedDateRecipe, foods, gis);
  assert.equal(cookedResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(cookedResult.glycemicLoadPerServing, null);
  assert.equal(cookedResult.ingredients.find((row) => /taatel/i.test(row.name))?.availableCarbohydratePerServingG, 3.36);
});

test("batch 2B5 small-portion corrections calculate the cottage-cheese bowl and Chettinad chicken", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText, bindingText, aliasText, pilotText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8"),
    readFile(path.join(root, "tmp/nutrition/glycemic-load-pilot.json"), "utf8"),
  ]);
  const inputs = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const foods = JSON.parse(foodText) as FoodRecord[];
  const gis = (JSON.parse(giText) as { records: GlycemicIndexRecord[] }).records;
  const bindings = JSON.parse(bindingText) as { recipes: Record<string, string>; calculationInputs: Record<string, string>; calculationEvidence: Record<string, string> };
  const aliases = (JSON.parse(aliasText) as { aliases: Record<string, { canonical: string; evidence: string }> }).aliases;
  const pilot = JSON.parse(pilotText) as { results: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null; confidence: string | null; omittedAvailableCarbohydratePerServingG: number }>; recipeBindingMismatches: string[]; calculationInputMismatches: string[]; calculationEvidenceMismatches: string[] };
  for (const id of ["bulgogi", "keto-suklaakeksit", "vhh-mokkapalat"]) {
    assert.equal(pilot.recipeBindingMismatches.includes(id), false, `${id} recipe structure binding matches`);
  }
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
  const cases = [
    { id: "raejuusto-pesto-kasviskulho", category: "aamupalat", unrounded: 0.861, stored: 0.86, shown: 0.9, omitted: 0.630975 },
    { id: "chettinad-kana", category: "paaruoat", unrounded: 0.6032, stored: 0.6, shown: 0.6, omitted: 1.17125 },
  ];

  for (const item of cases) {
    const input = inputs.recipes.find((row) => row.recipeId === item.id)!;
    const result = calculateGlycemicLoad(input, foods, gis);
    assert.equal(input.servings, 4, `${item.id} servings`);
    assert.equal(result.status, "CALCULATED", item.id);
    assert.ok(Math.abs(result.unroundedGlycemicLoadPerServing! - item.unrounded) < 1e-12, `${item.id} unrounded GK`);
    assert.equal(result.glycemicLoadPerServing, item.stored, `${item.id} numeric GK`);
    assert.equal(roundGlycemicLoadForDisplay(result.glycemicLoadPerServing!), item.shown, `${item.id} displayed GK`);
    assert.equal(classifyGlycemicLoad(result.glycemicLoadPerServing!), "LOW", `${item.id} GK class`);
    assert.equal(result.confidence, "LOW", `${item.id} confidence remains separate from the GK class`);
    assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - item.omitted) < 1e-12, `${item.id} cumulative omitted carbohydrate`);
    assert.ok(result.omittedAvailableCarbohydratePerServingG < 2, `${item.id} cumulative omission under 2 g per serving`);
    assert.deepEqual(result.blockers, [], `${item.id} has no remaining blockers`);
    const markdown = await readFile(path.join(root, "reseptit", item.category, `${item.id}.md`), "utf8");
    assert.equal(recipeBindingHash(markdown, aliases), bindings.recipes[item.id], `${item.id} recipe fingerprint`);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[item.id], `${item.id} input fingerprint`);
    assert.equal(glycemicLoadEvidenceHash(input, foods, gis), bindings.calculationEvidence[item.id], `${item.id} evidence fingerprint`);
    const audited = pilot.results.find((row) => row.recipeId === item.id)!;
    assert.equal(audited.status, "CALCULATED", `${item.id} all-recipe audit status`);
    assert.equal(audited.glycemicLoadPerServing, item.stored, `${item.id} all-recipe audit GK`);
    assert.equal(audited.confidence, "LOW", `${item.id} all-recipe audit confidence`);
    assert.ok(Math.abs(audited.omittedAvailableCarbohydratePerServingG - item.omitted) < 1e-12);
  }

  const bowl = inputs.recipes.find((row) => row.recipeId === "raejuusto-pesto-kasviskulho")!;
  for (const [name, recordId, expected] of [
    ["paahdettuja pinjansiemeniä", "fineli-30968-2026-10-24", 0.3765],
    ["rucolaa", "fineli-34159-2026-10-24", 0.05],
  ] as const) {
    const item = bowl.ingredients.find((row) => row.name === name)!;
    assert.equal(item.fineliRecordId, recordId, `${name} composition source`);
    assert.equal(item.giRecordId, null, `${name} has no guessed GI`);
    const result = calculateGlycemicLoad(bowl, foods, gis);
    assert.ok(Math.abs(result.ingredients.find((row) => row.name === name)!.availableCarbohydratePerServingG! - expected) < 1e-12);
  }
  const chettinad = inputs.recipes.find((row) => row.recipeId === "chettinad-kana")!;
  for (const [name, recordId] of [
    ["tuoretta inkivääriä", "afcd-F004213-2026-10-24"],
    ["mustapippureita", "afcd-F006618-2026-10-24"],
    ["korianterinsiemeniä", "afcd-F003190-2026-10-24"],
  ] as const) {
    const item = chettinad.ingredients.find((row) => row.name === name)!;
    assert.equal(item.fineliRecordId, recordId, `${name} composition source`);
    assert.equal(item.giRecordId, null, `${name} has no guessed GI`);
  }

  const wrongGi = structuredClone(bowl);
  wrongGi.ingredients.find((row) => row.name === "paahdettuja pinjansiemeniä")!.giRecordId = "vegetables-category-mean-gi-66";
  assert.equal(calculateGlycemicLoad(wrongGi, foods, gis).status, "INSUFFICIENT SOURCE DATA", "a wrong food-family GI remains blocking");
  const unknownComposition = structuredClone(bowl);
  unknownComposition.ingredients.find((row) => row.name === "paahdettuja pinjansiemeniä")!.fineliRecordId = null;
  assert.equal(calculateGlycemicLoad(unknownComposition, foods, gis).status, "INSUFFICIENT SOURCE DATA", "unknown composition remains blocking");
});

test("batch 2B6A uses a food-specific pear source and only omits source-backed sub-1 g portions", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const [inputText, foodText, giText, bindingText, aliasText, pilotText] = await Promise.all([
    readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8"),
    readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8"),
    readFile(path.join(root, "tmp/nutrition/glycemic-load-pilot.json"), "utf8"),
  ]);
  const inputs = JSON.parse(inputText) as { recipes: GlycemicLoadRecipeInput[] };
  const foods = JSON.parse(foodText) as FoodRecord[];
  const giCatalog = JSON.parse(giText) as { sources: Array<{ id: string; authors?: string }>; records: GlycemicIndexRecord[] };
  const gis = giCatalog.records;
  const bindings = JSON.parse(bindingText) as { recipes: Record<string, string>; calculationInputs: Record<string, string>; calculationEvidence: Record<string, string> };
  const aliases = (JSON.parse(aliasText) as { aliases: Record<string, { canonical: string; evidence: string }> }).aliases;
  const pilot = JSON.parse(pilotText) as { results: Array<{ recipeId: string; status: string; glycemicLoadPerServing: number | null; confidence: string | null; omittedAvailableCarbohydratePerServingG: number }> };
  const pear = gis.find((record) => record.id === "pear-raw-mean-gi-38-2002");
  assert.ok(pear);
  assert.equal(giCatalog.sources.find((source) => source.id === "international-tables-2002")?.authors, "Foster-Powell K, Holt SHA, Brand-Miller JC");
  assert.equal(pear.gi, 38);
  assert.equal(pear.qualityTier, "SUPPLEMENTARY");
  assert.equal(pear.matchKind, "ANALOG");
  assert.equal(pear.confidence, "LOW");
  assert.equal(pear.referenceScale, "GLUCOSE_100");
  assert.equal(pear.source.authors, "Foster-Powell K, Holt SHA, Brand-Miller JC");
  assert.match(pear.source.table, /^Table 1, entries 423–426/);
  assert.equal(pear.source.published, true);
  assert.equal(pear.source.iso26642Confirmed, false);

  const cases = [
    { id: "bulgogi", servings: 4, unrounded: 40.249495, stored: 40.25, shown: 40, category: "HIGH", omitted: 0.07313375 },
    { id: "keto-suklaakeksit", servings: 10, unrounded: 0.56376, stored: 0.56, shown: 0.6, category: "LOW", omitted: 0.5073 },
    { id: "vhh-mokkapalat", servings: 12, unrounded: 0.397783333333333, stored: 0.4, shown: 0.4, category: "LOW", omitted: 0.36475 },
  ];
  for (const item of cases) {
    const input = inputs.recipes.find((row) => row.recipeId === item.id)!;
    const result = calculateGlycemicLoad(input, foods, gis);
    assert.equal(input.servings, item.servings);
    assert.equal(result.status, "CALCULATED", item.id);
    assert.ok(Math.abs(result.unroundedGlycemicLoadPerServing! - item.unrounded) < 1e-12, `${item.id} unrounded GK`);
    assert.equal(result.glycemicLoadPerServing, item.stored, `${item.id} stored GK`);
    assert.equal(roundGlycemicLoadForDisplay(result.glycemicLoadPerServing!), item.shown, `${item.id} displayed GK`);
    assert.equal(classifyGlycemicLoad(result.glycemicLoadPerServing!), item.category, `${item.id} GK class`);
    assert.equal(result.confidence, "LOW", `${item.id} confidence`);
    assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - item.omitted) < 1e-12, `${item.id} omitted available carbohydrate`);
    assert.ok(result.omittedAvailableCarbohydratePerServingG < 2, `${item.id} cumulative omission below 2 g`);
    assert.equal(classifyGlycemicLoad(result.unroundedGlycemicLoadPerServing! + item.omitted), item.category, `${item.id} GI-100 omission sensitivity does not change class`);
    assert.deepEqual(result.blockers, []);
    assert.equal(recipeBindingMatches(bindings.recipes[item.id], recipeBindingHash(await readFile(path.join(root, "reseptit", item.id === "vhh-mokkapalat" || item.id === "keto-suklaakeksit" ? "jalkiruoat" : "paaruoat", `${item.id}.md`), "utf8"), aliases)), true, `${item.id} recipe fingerprint`);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[item.id], `${item.id} input fingerprint`);
    assert.equal(glycemicLoadEvidenceHash(input, foods, gis), bindings.calculationEvidence[item.id], `${item.id} evidence fingerprint`);
    const audited = pilot.results.find((row) => row.recipeId === item.id)!;
    assert.equal(audited.status, "CALCULATED", `${item.id} full audit status`);
    assert.equal(audited.glycemicLoadPerServing, item.stored, `${item.id} full audit GK`);
    assert.equal(audited.confidence, "LOW", `${item.id} full audit confidence`);
    assert.ok(Math.abs(audited.omittedAvailableCarbohydratePerServingG - item.omitted) < 1e-12);
  }

  const bulgogi = inputs.recipes.find((row) => row.recipeId === "bulgogi")!;
  const pearInput = bulgogi.ingredients.find((row) => row.name === "päärynää")!;
  assert.equal(pearInput.giRecordId, pear.id);
  assert.equal(pearInput.giMatchEvidence?.includes("not an exact preparation match"), true);
  const sesame = bulgogi.ingredients.find((row) => row.name === "seesaminsiemeniä")!;
  const blackPepper = bulgogi.ingredients.find((row) => row.name === "mustapippuria")!;
  assert.equal(sesame.estimatedAvailableCarbohydratePerServingG, undefined, "known Fineli composition is calculated directly; no duplicate estimate field");
  assert.equal(blackPepper.estimatedAvailableCarbohydratePerServingG, undefined, "known AFCD composition is calculated directly; no duplicate estimate field");
  const bulgogiResult = calculateGlycemicLoad(bulgogi, foods, gis);
  assert.equal(bulgogiResult.ingredients.find((row) => row.name === "seesaminsiemeniä")?.availableCarbohydratePerServingG, 0.02488375);
  assert.equal(bulgogiResult.ingredients.find((row) => row.name === "mustapippuria")?.availableCarbohydratePer100g, 38.6);
  assert.equal(bulgogiResult.ingredients.find((row) => row.name === "mustapippuria")?.availableCarbohydratePerServingG, 0.04825);
  assert.equal(bulgogiResult.omittedAvailableCarbohydratePerServingG, 0.07313375);
  for (const id of ["keto-suklaakeksit", "vhh-mokkapalat"]) {
    const input = inputs.recipes.find((row) => row.recipeId === id)!;
    const cocoaOrChocolate = input.ingredients.filter((row) => /suklaata|kaakaojauhetta/i.test(row.name));
    assert.ok(cocoaOrChocolate.length > 0);
    for (const ingredient of cocoaOrChocolate) assert.equal(ingredient.giRecordId, null, `${id} does not retain a mismatched GI proxy`);
  }
  const unsupportedPearGi = structuredClone(bulgogi);
  unsupportedPearGi.ingredients.find((row) => row.name === "päärynää")!.giRecordId = "dark-chocolate-international-tables-mean-gi-29";
  assert.equal(calculateGlycemicLoad(unsupportedPearGi, foods, gis).status, "INSUFFICIENT SOURCE DATA", "wrong food-family GI remains blocking");
  const unknownCocoa = structuredClone(inputs.recipes.find((row) => row.recipeId === "vhh-mokkapalat")!);
  unknownCocoa.ingredients.find((row) => row.name === "kaakaojauhetta")!.fineliRecordId = null;
  assert.equal(calculateGlycemicLoad(unknownCocoa, foods, gis).status, "INSUFFICIENT SOURCE DATA", "unknown composition remains blocking");
});
