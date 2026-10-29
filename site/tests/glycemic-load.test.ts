import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import type { FoodRecord } from "../scripts/nutrition-model";
import { calculateGlycemicLoad, classifyGlycemicLoad, roundGlycemicLoadForDisplay, type GlycemicIndexRecord, type GlycemicLoadRecipeInput } from "../scripts/glycemic-load-model";
import { completePublishedRecipeInputs } from "../scripts/glycemic-load-pilot-input";
import { glycemicLoadEvidenceHash, glycemicLoadInputHash, recipeBindingHash, recipeBindingMatches } from "../scripts/glycemic-load-recipe-binding";
import { publishedGlycemicLoadForRecipe } from "../src/features/recipes/glycemic-load-display";
import { parseMarkdown } from "../src/content/markdown";


// Historical batch expectations yield only to the explicitly reviewed source correction.
const finalBakeryReviewPromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-bakery-final-source-review.json"), "utf8").then(JSON.parse);
const finalBakeryBaselinePromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-bakery-final-source-baseline.json"), "utf8").then(JSON.parse);
const bakeryReviewPromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-bakery-four-source-review.json"), "utf8").then(JSON.parse);
const bakeryBaselinePromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-bakery-four-source-baseline.json"), "utf8").then(JSON.parse);
const almondReviewPromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-almond-source-review.json"), "utf8").then(JSON.parse);
const almondBaselinePromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-almond-source-baseline.json"), "utf8").then(JSON.parse);
const onionReviewPromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-onion-source-review.json"), "utf8").then(JSON.parse);
const pepperReviewPromise = readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-red-pepper-source-review.json"), "utf8").then(JSON.parse);
// Current expectations incorporate the bounded source reviews and the isolated R1B recipe overlay; historical files remain immutable.
const r1bAffectedRecipeIds = new Set(["jauheliha-makaronilaatikko", "koshari", "yangzhou-paistettu-riisi"]);
const r1bCurrentPilotPromise = readFile(path.resolve(import.meta.dirname, "../../tmp/nutrition/glycemic-load-pilot.json"), "utf8").then(JSON.parse);
const currentBakeryReviewPromise = Promise.all([bakeryReviewPromise, finalBakeryReviewPromise]).then(([four, final]) => ({
  ...four, ...final,
  affectedRecipeIds: [...new Set([...four.affectedRecipeIds, ...final.affectedRecipeIds])],
  affectedRecipes: [...final.affectedRecipes, ...four.affectedRecipes],
}));
function assertCatalogExceptFinalBakery(current: any, historical: any) {
  const withoutBakery = (catalog: any) => ({ ...catalog, records: catalog.records.filter((r: GlycemicIndexRecord) => r.id !== "bakery-products-category-mean-gi-58") });
  assert.deepEqual(withoutBakery(current), withoutBakery(historical));
}
function effectiveR1BChange(row: { recipeId: string; before: { status: string }; change: string }, current: { status: string }): string {
  if (!r1bAffectedRecipeIds.has(row.recipeId)) return row.change;
  if (row.before.status === "CALCULATED" && current.status !== "CALCULATED") return "WITHDRAWN";
  if (row.before.status !== "CALCULATED" && current.status !== "CALCULATED") return "STILL_INCOMPLETE";
  if (row.before.status === "CALCULATED" && current.status === "CALCULATED") return "UNCHANGED_CALCULATED";
  return "CHANGED";
}
async function assertReviewedSourceCorrection(result: ReturnType<typeof calculateGlycemicLoad>): Promise<boolean> {
  if (r1bAffectedRecipeIds.has(result.recipeId)) {
    const pilot = await r1bCurrentPilotPromise;
    const current = pilot.results.find((row: { recipeId: string }) => row.recipeId === result.recipeId);
    assert.ok(current, `R1B result exists for ${result.recipeId}`);
    assert.deepEqual(result, current, result.recipeId);
    return true;
  }
  const reviews = await Promise.all([finalBakeryReviewPromise, bakeryReviewPromise, almondReviewPromise, pepperReviewPromise, onionReviewPromise]);
  const row = reviews.flatMap(review => review.affectedRecipes).find((item: { recipeId: string }) => item.recipeId === result.recipeId);
  if (!row) return false;
  assert.equal(result.status, row.after.status, result.recipeId);
  assert.equal(result.glycemicLoadPerServing, row.after.glycemicLoadPerServing, result.recipeId);
  assert.equal(result.unroundedGlycemicLoadPerServing, row.after.unroundedGlycemicLoadPerServing, result.recipeId);
  assert.deepEqual(result.glycemicLoadRangePerServing, row.after.glycemicLoadRangePerServing, result.recipeId);
  return true;
}

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
    assert.equal(await assertReviewedSourceCorrection(result), true);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA", recipeId);
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

test("batch 2B3 historical estimates retain their checks except the reviewed onion withdrawal", async () => {
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
    if (await assertReviewedSourceCorrection(result)) continue;
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
  assert.deepEqual(classes, { HIGH: 3, MEDIUM: 0, LOW: 2 }); // reviewed onion, pepper and almond withdrawals; historical report stays unchanged
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
  overBudget.ingredients.push(...[0.99, 0.99, 0.1].map((amount, index) => ({
    name: `test omission ${index}`, grams: null, fineliRecordId: null, giRecordId: null,
    excludedReason: "Synthetic tolerance regression", estimatedAvailableCarbohydratePerServingG: amount,
    negligibleAssumption: "Test fixture only",
  })));
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
  assert.equal(semolinaGi.preparationKey, "steam-gelatinized-semolina-with-groundnut-oil");
  assert.equal(semolinaGi.qualityTier, "SUPPLEMENTARY");
  assert.equal(semolinaGi.matchKind, "ANALOG");
  assert.equal(semolinaGi.confidence, "LOW");
  assert.equal(semolinaGi.source.participants, 6);
  assert.match(semolinaGi.source.table, /steamed and gelatinized with 5 g groundnut oil/);
  assert.match(semolinaGi.source.qualityEvidence, /does not establish equivalence with this recipe/);

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
  assert.deepEqual([semolina.giRecordId, semolina.foodKey, semolina.preparationKey], [null, "semolina", "water-boiled-semolina-porridge"]);
  assert.equal(semolina.giMatchEvidence?.startsWith("NO MATCH:"), true);
  assert.deepEqual([orange.giRecordId, orange.foodKey, orange.preparationKey], [orangeGi.id, "orange", "raw-orange"]);
  assert.notEqual(semolina.giRecordId, "bakery-products-category-mean-gi-58");
  assert.notEqual(orange.giRecordId, "fruit-category-mean-gi-51");

  const semolinaPorridgeResult = calculateGlycemicLoad(orangePorridge, foods, catalog.records);
  assert.equal(semolinaPorridgeResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(semolinaPorridgeResult.glycemicLoadPerServing, null);
  const semolinaResult = semolinaPorridgeResult.ingredients.find((ingredient) => ingredient.name === "mannasuurimo");
  assert.ok(semolinaResult);
  assert.equal(semolinaResult.availableCarbohydratePerServingG, 31.8, "the unmatched semolina is well above the 1 g omission limit");
  assert.equal(semolinaResult.giRecordId, null);
  assert.ok(semolinaResult.giCandidates.some((candidate) => candidate.id === semolinaGi.id && !candidate.preparationMatches));
  assert.ok(semolinaPorridgeResult.blockers.some((blocker) => blocker.includes("NO MATCH: Mani et al. 1992")));

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

  const unsupportedSemolinaRecipe = inputs.recipes.find((row) => row.recipeId === "pohjoisafrikkalainen-taatelipuuro-appelsiinilla");
  assert.ok(unsupportedSemolinaRecipe);
  const unsupportedSemolina = unsupportedSemolinaRecipe.ingredients.find((row) => row.name === "mannasuurimo");
  assert.ok(unsupportedSemolina);
  assert.equal(unsupportedSemolina.giRecordId, null);
  const unsupportedSemolinaResult = calculateGlycemicLoad(unsupportedSemolinaRecipe, foods, gis);
  assert.equal(unsupportedSemolinaResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(unsupportedSemolinaResult.glycemicLoadPerServing, null);
  assert.ok(unsupportedSemolinaResult.blockers.some((blocker) => blocker.includes("NO MATCH: Mani et al. 1992")));

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

test("batch 2B5 bowl remains calculated and Chettinad follows the reviewed source withdrawal", async () => {
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
    if (await assertReviewedSourceCorrection(result)) continue;
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

test("batch 2B6A pear source remains scoped while the onion audit blocks bulgogi", async () => {
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
    if (await assertReviewedSourceCorrection(result)) continue;
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
  assert.equal(bulgogiResult.status, "INSUFFICIENT SOURCE DATA");
  assert.ok(bulgogiResult.blockers.some((blocker) => /kevätsipulia.*mass/.test(blocker)));
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
  delete unknownCocoa.ingredients.find((row) => row.name === "kaakaojauhetta")!.availableCarbohydrateUpperBoundPerServingG;
  delete unknownCocoa.ingredients.find((row) => row.name === "kaakaojauhetta")!.upperBoundEvidence;
  assert.equal(calculateGlycemicLoad(unknownCocoa, foods, gis).status, "INSUFFICIENT SOURCE DATA", "unknown composition remains blocking");
});


test("a newly published 327th recipe is auto-included as unresolved and cannot yield a zero GK", () => {
  const reviewedInputs: GlycemicLoadRecipeInput[] = Array.from({ length: 326 }, (_, index) => ({
    recipeId: "reviewed-" + (index + 1),
    servings: 1,
    ingredients: [],
  }));
  const published = reviewedInputs.map((recipe) => ({
    recipeId: recipe.recipeId,
    servings: recipe.servings,
    ingredients: [{ item: "ingredient for " + recipe.recipeId, amount: 10, unit: "g" }],
  }));
  published.push({
    recipeId: "synthetic-recipe-327",
    servings: 2,
    ingredients: [{ item: "rice", amount: 100, unit: "g" }],
  });
  const completed = completePublishedRecipeInputs(reviewedInputs, published);
  assert.equal(completed.recipes.length, 327);
  assert.deepEqual(completed.autoIncludedRecipeIds, ["synthetic-recipe-327"]);
  const input = completed.recipes.at(-1)!;
  assert.equal(input.ingredients[0]?.grams, null);
  assert.equal(input.ingredients[0]?.fineliRecordId, null);
  assert.equal(input.ingredients[0]?.giRecordId, null);
  assert.deepEqual(input.ingredients[0]?.recipeQuantity, { amount: 100, unit: "g", massGrams: 100 });
  assert.match(input.ingredients[0]?.excludedReason ?? "", /not treated as zero/);
  const result = calculateGlycemicLoad(input, [], []);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(result.glycemicLoadPerServing, null);
  assert.ok(result.blockers.length > 0);
});

test("removing a published recipe cannot leave a stale reviewed GI/GK input unnoticed", () => {
  const reviewed: GlycemicLoadRecipeInput[] = [{
    recipeId: "removed-recipe",
    servings: 1,
    ingredients: [],
  }];
  assert.throws(() => completePublishedRecipeInputs(reviewed, []), /unpublished recipe IDs: removed-recipe/);
});

test("coconut rice-porridge GI is reference-only even if an ingredient copies its matching keys", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const catalog = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8")) as { records: GlycemicIndexRecord[] };
  const record = catalog.records.find((row) => row.id === "coconut-milk-porridge-gi-31")!;
  assert.ok(record);
  assert.equal(record.gi, 31, "retain the published mixed-meal result");
  assert.equal(record.foodKey, "rice-porridge-with-coconut-milk");
  assert.equal(record.calculationUse, "REFERENCE_ONLY");
  assert.match(record.source.title, /^Green leafy porridges:/);
  const composition = food("coconut", 2.81, "KOOKOSMAITO, KOOKOSJUOMA");
  for (const grams of [100, 10]) {
    for (const keys of [
      { foodKey: "coconut-milk", preparationKey: record.preparationKey },
      { foodKey: record.foodKey, preparationKey: record.preparationKey },
    ]) {
      const input = { recipeId: "coconut", servings: 1, ingredients: [{ name: "coconut milk", grams, fineliRecordId: composition.id, giRecordId: record.id, ...keys, giMatchEvidence: "Claimed analogue with matching identifiers." }] };
      const result = calculateGlycemicLoad(input, [composition], [record]);
      assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
      assert.equal(result.glycemicLoadPerServing, null);
      assert.equal(result.ingredients[0].giContribution, null);
      assert.deepEqual(result.ingredients[0].giCandidates, [], "reference-only source is not offered as a calculation candidate");
      assert.match(result.blockers.join(" "), /reference-only/);
      const { calculationUse: _removed, ...withoutRestriction } = record;
      assert.notEqual(glycemicLoadEvidenceHash(input, [composition], [record]), glycemicLoadEvidenceHash(input, [composition], [withoutRestriction]), "removing source restriction requires evidence re-review");
    }
  }
});

test("coconut withdrawal remains protected alongside the separately reviewed onion correction", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (name: string) => JSON.parse(await readFile(path.join(root, "docs/nutrition", name), "utf8"));
  const [inputs, foods, catalog, review, bindings, inventory] = await Promise.all([
    read("glycemic-load-pilot-input.json"), read("food-records.json"), read("glycemic-index-records.json"),
    read("glycemic-coconut-source-review.json"), read("glycemic-load-recipe-bindings.json"), read("glycemic-coverage-current-2026-10-25.json"),
  ]);
  const byId = new Map<string, GlycemicLoadRecipeInput>((inputs.recipes as GlycemicLoadRecipeInput[]).map((row) => [row.recipeId, row]));
  const affected = review.affectedRecipeIds as string[];
  assert.deepEqual(affected, ["keltainen-kanacurry-vhh", "khao-soi-vhh-konjac", "massaman-curry-kanalla-vhh", "tom-kha-gai-vhh"]);
  assert.equal(inputs.recipes.some((row: GlycemicLoadRecipeInput) => row.ingredients.some((ingredient) => ingredient.giRecordId === "coconut-milk-porridge-gi-31")), false);
  const withdrawn: string[] = [];
  for (const prior of review.previouslyCalculated) {
    const input = byId.get(prior.recipeId)!;
    assert.ok(input, prior.recipeId);
    const current = calculateGlycemicLoad(input, foods, catalog.records);
    if (await assertReviewedSourceCorrection(current)) {
      if (current.status !== "CALCULATED") withdrawn.push(prior.recipeId);
      continue;
    }
    if (current.status !== "CALCULATED") {
      withdrawn.push(prior.recipeId);
      assert.equal(current.glycemicLoadPerServing, null);
    } else {
      assert.equal(current.glycemicLoadPerServing, prior.glycemicLoadPerServing, prior.recipeId);
      assert.equal(current.unroundedGlycemicLoadPerServing, prior.unroundedGlycemicLoadPerServing, prior.recipeId);
      assert.deepEqual(current.glycemicLoadRangePerServing, prior.glycemicLoadRangePerServing, prior.recipeId);
    }
  }
  assert.deepEqual([...withdrawn].sort(), ["keltainen-kanacurry-vhh", ...(await onionReviewPromise).withdrawnRecipeIds, ...(await pepperReviewPromise).withdrawnRecipeIds, ...(await almondReviewPromise).withdrawnRecipeIds, ...(await bakeryReviewPromise).withdrawnRecipeIds, ...(await finalBakeryReviewPromise).withdrawnRecipeIds, "jauheliha-makaronilaatikko", "yangzhou-paistettu-riisi"].sort());
  for (const id of affected) {
    const input = byId.get(id)!;
    const current = calculateGlycemicLoad(input, foods, catalog.records);
    const coconut = input.ingredients.find((ingredient) => ingredient.foodKey === "coconut-milk")!;
    assert.equal(coconut.giRecordId, null);
    assert.equal(coconut.preparationKey, "coconut-milk-cooked-in-recipe");
    const resultIngredient = current.ingredients.find((ingredient) => ingredient.name === coconut.name)!;
    assert.equal(resultIngredient.availableCarbohydratePerServingG, 2.81);
    assert.equal(resultIngredient.giContribution, null);
    assert.equal(current.status, "INSUFFICIENT SOURCE DATA");
    assert.match(current.blockers.join(" "), /PMID 22849311/);
    const previous = review.affectedRecipes.find((row: { recipeId: string }) => row.recipeId === id).before;
    for (const blocker of previous.blockers) assert.ok(current.blockers.includes(blocker), "other blockers remain: " + blocker);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[id]);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[id]);
    const restoredInvalidInput = { ...input, ingredients: input.ingredients.map((ingredient) => ingredient === coconut ? { ...ingredient, giRecordId: review.beforeGiRecord.id, foodKey: review.beforeGiRecord.foodKey, preparationKey: review.beforeGiRecord.preparationKey } : ingredient) };
    assert.notEqual(glycemicLoadInputHash(restoredInvalidInput), bindings.calculationInputs[id], "restoring the old binding is stale");
    const stored = inventory.recipes.find((row: { recipeId: string }) => row.recipeId === id);
    assert.equal(stored.status, current.status);
    assert.equal(stored.glycemicLoadPerServing, current.glycemicLoadPerServing);
  }
  assert.equal(inventory.currentSummary.calculated, review.previouslyCalculated.length - withdrawn.length, "no unrelated additions or losses");
});

test("onion secondary-table GI remains reference-only even with copied keys and tiny amounts", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const catalog = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"));
  const onion = catalog.records.find((row: GlycemicIndexRecord) => row.id === "onion-literature-analogue-gi-15") as GlycemicIndexRecord;
  assert.equal(onion.calculationUse, "REFERENCE_ONLY");
  assert.equal(onion.source.url, "https://doi.org/10.3390/nu12102989");
  assert.match(onion.source.table, /Table 1/);
  assert.match(onion.source.qualityEvidence, /10.3945\/an.112.003509/);
  const composition = food("onion", 4.8, "Sipuli");
  for (const grams of [1, 55, 100]) {
    const input: GlycemicLoadRecipeInput = { recipeId: "restore-onion", servings: 1, ingredients: [{
      name: "sipuli", grams, fineliRecordId: composition.id, giRecordId: onion.id,
      foodKey: onion.foodKey, preparationKey: onion.preparationKey, giMatchEvidence: "Copied keys cannot establish a primary study.",
    }] };
    const result = calculateGlycemicLoad(input, [composition], [onion]);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(result.glycemicLoadPerServing, null);
    assert.match(result.blockers.join(" "), /reference-only/);
    assert.equal(result.ingredients[0].giCandidates.length, 0);
  }
});

test("onion source correction accounts for every published result and preserves all unaffected evidence", async () => {
  const { createHash } = await import("node:crypto");
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (name: string) => JSON.parse(await readFile(path.join(root, name), "utf8"));
  const [review, pilot, inputs, foods, catalog, bindings, inventory] = await Promise.all([
    onionReviewPromise, read("tmp/nutrition/glycemic-load-pilot.json"), read("docs/nutrition/glycemic-load-pilot-input.json"),
    read("docs/nutrition/food-records.json"), read("docs/nutrition/glycemic-index-records.json"),
    read("docs/nutrition/glycemic-load-recipe-bindings.json"), read("docs/nutrition/glycemic-coverage-current-2026-10-25.json"),
  ]);
  const pepper = await pepperReviewPromise;
  const almond = await almondReviewPromise;
  const bakery = await currentBakeryReviewPromise;
  const almondAffected = new Set<string>(almond.affectedRecipeIds);
  const pepperAffected = new Set<string>(pepper.affectedRecipeIds);
  const affected = new Set<string>(review.affectedRecipeIds);
  assert.equal(affected.size, 48);
  assert.equal(review.activeBindingCount, 54);
  const priorUsers = review.affectedRecipes.filter((row: { before: { status: string } }) => row.before.status === "CALCULATED");
  assert.equal(priorUsers.length, 24);
  assert.equal(inputs.recipes.some((r: GlycemicLoadRecipeInput) => r.ingredients.some(i => i.giRecordId === "onion-literature-analogue-gi-15")), false);
  assert.equal(review.allRecipeComparisons.length, pilot.results.length);
  assert.equal(new Set(review.allRecipeComparisons.map((row: { recipeId: string }) => row.recipeId)).size, pilot.results.length);
  const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  const changes: Record<string, number> = {};
  for (const row of review.allRecipeComparisons) {
    const actual = pilot.results.find((r: { recipeId: string }) => r.recipeId === row.recipeId);
    assert.ok(actual, row.recipeId);
    const isR1B = r1bAffectedRecipeIds.has(row.recipeId);
    const expected = isR1B ? actual : bakery.allRecipeComparisons.find((r: { recipeId: string }) => r.recipeId === row.recipeId)?.after ?? pepper.allRecipeComparisons.find((r: { recipeId: string }) => r.recipeId === row.recipeId)?.after ?? row.after;
    if (!isR1B) {
      assert.equal(digest(actual), expected.resultSHA256, row.recipeId);
      if (!affected.has(row.recipeId) && !pepperAffected.has(row.recipeId) && !almondAffected.has(row.recipeId) && !bakery.affectedRecipeIds.includes(row.recipeId)) assert.equal(digest(actual), row.before.resultSHA256, `${row.recipeId} full result unchanged`);
      assert.equal(actual.glycemicLoadPerServing, expected.glycemicLoadPerServing);
      assert.equal(actual.unroundedGlycemicLoadPerServing, expected.unroundedGlycemicLoadPerServing);
      assert.deepEqual(actual.glycemicLoadRangePerServing, expected.glycemicLoadRangePerServing);
      assert.equal(actual.status === "CALCULATED" ? classifyGlycemicLoad(actual.glycemicLoadPerServing) : null, expected.glycemicClass);
    }
    const stored = inventory.recipes.find((r: { recipeId: string }) => r.recipeId === row.recipeId);
    assert.equal(stored.status, actual.status);
    assert.equal(stored.glycemicLoadPerServing, actual.glycemicLoadPerServing);
    const change = effectiveR1BChange(row, actual);
    changes[change] = (changes[change] ?? 0) + 1;
  }
  assert.deepEqual(changes, { UNCHANGED_CALCULATED: 111, STILL_INCOMPLETE: 189, WITHDRAWN: 21, CHANGED: 5 });
  for (const row of review.affectedRecipes) {
    const input = inputs.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId) as GlycemicLoadRecipeInput;
    const result = calculateGlycemicLoad(input, foods, catalog.records);
    const latest = bakery.affectedRecipes.find((r: {recipeId: string}) => r.recipeId === row.recipeId)?.after ?? almond.affectedRecipes.find((r: {recipeId: string}) => r.recipeId === row.recipeId)?.after ?? row.after;
    assert.equal(result.status, latest.status);
    assert.equal(result.unroundedGlycemicLoadPerServing, latest.unroundedGlycemicLoadPerServing);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[row.recipeId]);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[row.recipeId]);
    for (const old of row.onionBindings) {
      assert.equal(input.ingredients[old.index].giRecordId, null);
      const restored = structuredClone(input);
      restored.ingredients[old.index].giRecordId = "onion-literature-analogue-gi-15";
      assert.notEqual(glycemicLoadInputHash(restored), bindings.calculationInputs[row.recipeId]);
      assert.equal(calculateGlycemicLoad(restored, foods, catalog.records).status, "INSUFFICIENT SOURCE DATA");
    }
  }
  for (const [filename, expected] of Object.entries(review.historicalBaselineCanonicalSHA256)) {
    const text = (await readFile(path.join(root, filename), "utf8")).replaceAll("\r\n", "\n");
    assert.equal(createHash("sha256").update(text).digest("hex"), expected, filename);
  }
  for (const [filename, expected] of Object.entries(review.preserved2B6EFileSHA256)) {
    const text = (await readFile(path.join(root, filename), "utf8")).replaceAll("\r\n", "\n");
    assert.equal(createHash("sha256").update(text).digest("hex"), expected, filename);
  }
  const preserved = await read("docs/nutrition/glycemic-coverage-batch-2b6e-review.json");
  assert.equal(preserved.recipes.reduce((sum: number, row: { ingredientReview: unknown[] }) => sum + row.ingredientReview.length, 0), 44);
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
  assert.equal(pilot.results.find((row: { recipeId: string }) => row.recipeId === "keltainen-kanacurry-vhh").glycemicLoadPerServing, null);
});

test("only individually verified onion omissions retain five LOW-confidence estimates", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (name: string) => JSON.parse(await readFile(path.join(root, "docs/nutrition", name), "utf8"));
  const [inputSource, foods, catalog] = await Promise.all([read("glycemic-load-pilot-input.json"), read("food-records.json"), read("glycemic-index-records.json")]);
  const cases = [
    ["souvlaki", 17.90106, 0.36675, "MEDIUM"], ["gazpacho", 8.30484, 0.12675, "LOW"],
    ["poronkaristys-kukkakaalimuusilla", 3.08944, 0.716, "LOW"], ["vhh-lihapiirakka", 0.989845, 0.37125, "LOW"],
    ["uuniporsas-kermakastikkeessa-vhh", 0, 1.5116333333333334, "LOW"],
  ] as const;
  for (const [id, exact, omitted, category] of cases) {
    const input = inputSource.recipes.find((row: GlycemicLoadRecipeInput) => row.recipeId === id) as GlycemicLoadRecipeInput;
    const result = calculateGlycemicLoad(input, foods, catalog.records);
    if (id === "vhh-lihapiirakka") {
      const historical = (await onionReviewPromise).affectedRecipes.find((r: {recipeId: string}) => r.recipeId === id);
      assert.ok(Math.abs(historical.after.unroundedGlycemicLoadPerServing - exact) < 1e-12);
      assert.equal(historical.after.omittedAvailableCarbohydratePerServingG, omitted);
      assert.equal(await assertReviewedSourceCorrection(result), true);
      assert.equal(result.status, "INSUFFICIENT SOURCE DATA", "later almond correction must not restore onion's historical estimate");
      continue;
    }
    assert.equal(result.status, "CALCULATED", id);
    assert.ok(Math.abs(result.unroundedGlycemicLoadPerServing! - exact) < 1e-12, id);
    assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - omitted) < 1e-12, id);
    assert.equal(classifyGlycemicLoad(result.glycemicLoadPerServing!), category);
    assert.equal(result.confidence, "LOW");
    const positiveOmissions = result.ingredients.filter(i => i.giContribution === null && (i.availableCarbohydratePerServingG ?? 0) > 0);
    assert.ok(positiveOmissions.every(i => i.grams !== null && i.fineliRecordId !== null && i.availableCarbohydratePerServingG! < 1));
    assert.ok(result.omittedAvailableCarbohydratePerServingG < 2);
    const unknown = structuredClone(input);
    unknown.ingredients.find(i => i.name === positiveOmissions[0].name)!.grams = null;
    assert.equal(calculateGlycemicLoad(unknown, foods, catalog.records).glycemicLoadPerServing, null, `${id}: unknown mass cannot be omitted`);
  }
  const review = await onionReviewPromise;
  assert.deepEqual([...review.changedCalculatedRecipeIds].sort(), cases.map(row => row[0]).sort());
  for (const id of ["bulgogi", "tomaatti-kananmuna-wokki", "kreikkalainen-moussaka", "doner-kebab", "chettinad-kana", "kermainen-kanasienipannu", "kana-parmesaanipannu-parsakaali", "parsakaali-sinihomejuustofrittata", "kana-tagine-sitruunalla", "palak-paneer"]) {
    const row = review.affectedRecipes.find((r: { recipeId: string }) => r.recipeId === id);
    assert.equal(row.removalOnlyCounterfactual.status, "CALCULATED", `${id}: numeric threshold alone would pass`);
    assert.equal(row.after.status, "INSUFFICIENT SOURCE DATA", `${id}: unverified omission evidence blocks`);
  }
});

test("pepper correction locks all 326 baseline results, with exactly seven withdrawals and no unrelated change", async () => {
  const { createHash } = await import("node:crypto");
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const [review, baseline, pilot, foods, catalog, bindings] = await Promise.all([
    pepperReviewPromise, read("docs/nutrition/glycemic-red-pepper-source-baseline.json"),
    read("tmp/nutrition/glycemic-load-pilot.json"), read("docs/nutrition/food-records.json"),
    read("docs/nutrition/glycemic-index-records.json"), read("docs/nutrition/glycemic-load-recipe-bindings.json"),
  ]);
  const hash = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
  const ids = (xs: Array<{recipeId: string}>) => xs.map(x => x.recipeId).sort();
  assert.equal(baseline.sourceCommit, "c02a70cd6c54d374445941a4d4896536f55b7182");
  assert.equal(baseline.results.length, 326);
  assert.equal(new Set(ids(pilot.results)).size, 326);
  assert.deepEqual(ids(pilot.results), ids(baseline.results));
  assert.deepEqual(ids(review.allRecipeComparisons), ids(baseline.results));
  const almond = await almondReviewPromise;
  const bakery = await currentBakeryReviewPromise;
  const affected = new Set(review.affectedRecipeIds);
  const almondAffected = new Set<string>(almond.affectedRecipeIds);
  assert.equal(affected.size, 13);
  const counts: Record<string, number> = {};
  for (const row of review.allRecipeComparisons) {
    const actual = pilot.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    const before = baseline.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    assert.deepEqual(row.before, before);
    const isR1B = r1bAffectedRecipeIds.has(row.recipeId);
    const expected = bakery.allRecipeComparisons.find((r: {recipeId: string}) => r.recipeId === row.recipeId).after;
    if (!isR1B) {
      assert.equal(hash(actual), expected.resultSHA256, row.recipeId);
      assert.equal(actual.glycemicLoadPerServing, expected.glycemicLoadPerServing);
      assert.equal(actual.unroundedGlycemicLoadPerServing, expected.unroundedGlycemicLoadPerServing);
      assert.deepEqual(actual.glycemicLoadRangePerServing, expected.glycemicLoadRangePerServing);
      assert.equal(actual.confidence, expected.confidence);
      assert.equal(actual.status === "CALCULATED" ? classifyGlycemicLoad(actual.glycemicLoadPerServing) : null, expected.glycemicClass);
    }
    if (!isR1B && !affected.has(row.recipeId) && !almondAffected.has(row.recipeId) && !bakery.affectedRecipeIds.includes(row.recipeId)) {
      assert.equal(hash(actual), before.resultSHA256, `${row.recipeId}: entire unaffected result`);
      assert.equal(pilot.calculationInputHashes[row.recipeId], baseline.calculationInputHashes[row.recipeId]);
      assert.equal(pilot.calculationEvidenceHashes[row.recipeId], baseline.calculationEvidenceHashes[row.recipeId]);
    }
    assert.equal(pilot.sourceHashes[row.recipeId], baseline.sourceHashes[row.recipeId], "recipe content unchanged");
    const change = effectiveR1BChange(row, actual);
    counts[change] = (counts[change] ?? 0) + 1;
  }
  assert.deepEqual(counts, { UNCHANGED_CALCULATED: 109, STILL_INCOMPLETE: 208, WITHDRAWN: 9 });
  assert.equal(review.withdrawnRecipeIds.length, 7, "the frozen pepper review itself remains unchanged");
  assert.equal(pilot.results.filter((r: {status: string}) => r.status === "CALCULATED").length, 83);
  for (const row of review.affectedRecipes) {
    const input = pilot.calculationInputs.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    const actual = calculateGlycemicLoad(input, foods, catalog.records);
    const expectedModelResult = structuredClone((await finalBakeryReviewPromise).affectedRecipes.find((r: {recipeId: string}) => r.recipeId === row.recipeId)?.after ?? row.after);
    expectedModelResult.blockers = expectedModelResult.blockers.filter((message: string) => !message.includes(": recipe structure differs from the last GL review"));
    assert.deepEqual(actual, expectedModelResult);
    assert.equal(actual.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(actual.glycemicLoadPerServing, null);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[row.recipeId]);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[row.recipeId]);
    const prior = baseline.affectedInputs.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    assert.notEqual(glycemicLoadInputHash(prior), bindings.calculationInputs[row.recipeId], "stale input rejected");
    assert.notEqual(glycemicLoadEvidenceHash(prior, foods, baseline.giCatalog.records), bindings.calculationEvidence[row.recipeId], "stale evidence rejected");
    const pepperIndices = new Set(row.pepperBindings.map((x: {index: number}) => x.index));
    for (let j = 0; j < prior.ingredients.length; j++) {
      if (!pepperIndices.has(j) && !(await finalBakeryReviewPromise).allowedInputChanges.some((r: {recipeId: string; index: number}) => r.recipeId === row.recipeId && r.index === j)) assert.deepEqual(input.ingredients[j], prior.ingredients[j], `${row.recipeId}: non-pepper row unchanged`);
    }
  }
  for (const old of baseline.giCatalog.records) {
    if (old.id !== "red-pepper-literature-analogue-gi-40" && old.id !== "bakery-products-category-mean-gi-58") assert.deepEqual(catalog.records.find((r: GlycemicIndexRecord) => r.id === old.id), old);
  }
  assert.equal(catalog.records.length, 45);
  for (const [file, expected] of Object.entries({...baseline.historicalBaselineCanonicalSHA256, ...baseline.preserved2B6EFileSHA256, ...baseline.unchangedModelAndFoodSHA256})) {
    const text = (await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n");
    if (file === "site/scripts/glycemic-load-model.ts") {
      assert.equal(expected, (await almondBaselinePromise).beforeModelCanonicalSHA256, "previous model lock stays immutable");
      assert.equal(createHash("sha256").update(text).digest("hex"), (await finalBakeryReviewPromise).afterModelCanonicalSHA256, "only reviewed model revision");
    } else if (file === "site/scripts/glycemic-load-recipe-binding.ts") {
      assert.equal(expected, (await bakeryBaselinePromise).beforeBindingCanonicalSHA256);
      assert.equal(createHash("sha256").update(text).digest("hex"), (await bakeryReviewPromise).afterBindingCanonicalSHA256);

    } else assert.equal(createHash("sha256").update(text).digest("hex"), expected, file);
  }
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
});

test("pepper GI 40 remains historical evidence and cannot silently become a candidate or omission", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const catalog = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"));
  const record = catalog.records.find((r: GlycemicIndexRecord) => r.id === "red-pepper-literature-analogue-gi-40");
  assert.equal(record.gi, 40);
  assert.equal(record.calculationUse, "REFERENCE_ONLY");
  assert.equal(record.source.url, "https://doi.org/10.3390/nu12102989");
  assert.match(record.source.table, /Table 1/);
  const review = await pepperReviewPromise;
  const foods = JSON.parse(await readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"));
  const source = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8"));
  assert.equal(source.recipes.flatMap((r: GlycemicLoadRecipeInput) => r.ingredients).filter((i: {giRecordId: string}) => i.giRecordId === record.id).length, 0);
  assert.equal(review.affectedRecipes.reduce((n: number, r: {pepperBindings: unknown[]}) => n + r.pepperBindings.length, 0), 14);
  for (const id of [record.id, "onion-literature-analogue-gi-15", "coconut-milk-porridge-gi-31"]) {
    assert.equal(catalog.records.find((r: GlycemicIndexRecord) => r.id === id).calculationUse, "REFERENCE_ONLY");
    assert.equal(source.recipes.some((r: GlycemicLoadRecipeInput) => r.ingredients.some(i => i.giRecordId === id)), false);
  }
  const input = structuredClone(source.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === "yrttituorejuusto-kinkkurullat"));
  const row = review.affectedRecipes.find((r: {recipeId: string}) => r.recipeId === input.recipeId).pepperBindings[0];
  input.ingredients[row.index].giRecordId = record.id;
  input.ingredients[row.index].foodKey = record.foodKey;
  input.ingredients[row.index].preparationKey = record.preparationKey;
  input.ingredients[row.index].grams = 0.01;
  const result = calculateGlycemicLoad(input, foods, catalog.records);
  assert.equal(result.glycemicLoadPerServing, null, "even tiny amounts must reject an explicit reference-only binding");
  assert.ok(result.ingredients[row.index].giCandidates.every(x => x.id !== record.id));
});

test("pepper masses, colours and composition corrections cannot retain a false small-portion exemption", async () => {
  const review = await pepperReviewPromise;
  const get = (id: string) => review.affectedRecipes.find((r: {recipeId: string}) => r.recipeId === id);
  const egg = get("paprikauunimunakkaat");
  assert.equal(egg.servings, 2);
  assert.equal(egg.sourceIngredients[0].item, "isoa paprikaa");
  assert.equal(egg.pepperBindings[0].before.grams, 340);
  assert.equal(egg.pepperBindings[0].after.grams, 460);
  assert.equal(egg.pepperBindings[0].after.fineliRecordId, null, "colour is not specified by the recipe");
  assert.equal(get("tunisialainen-ojja").pepperBindings[0].after.grams, 150);
  for (const id of ["paneer-tikka", "yrttituorejuusto-kinkkurullat"]) {
    const p = get(id).pepperBindings[0];
    assert.equal(p.before.fineliRecordId, "fineli-387-release-20");
    assert.equal(p.after.fineliRecordId, "fineli-386-release-20");
    assert.equal(p.afterResult.availableCarbohydratePer100g, 4.5);
  }
  assert.equal(get("paneer-tikka").pepperBindings[1].afterResult.availableCarbohydratePerServingG, 1.0625);
  assert.equal(get("yrttituorejuusto-kinkkurullat").pepperBindings[0].beforeResult.availableCarbohydratePerServingG, 0.625);
  assert.equal(get("yrttituorejuusto-kinkkurullat").pepperBindings[0].afterResult.availableCarbohydratePerServingG, 1.125);
  for (const row of review.affectedRecipes) for (const p of row.pepperBindings) {
    const carb = p.afterResult.availableCarbohydratePerServingG;
    assert.ok(carb === null || carb >= 1, row.recipeId);
    assert.equal(p.afterResult.giContribution, null);
    assert.equal(p.after.giRecordId, null);
    assert.match(p.omissionDecision, /^BLOCKED:/);
  }
});

test("ordinary nutrition remains explicitly unresolved or reproduces existing evidence without invented retention", async () => {
  const { calculate } = await import("../scripts/nutrition-model");
  const root = path.resolve(import.meta.dirname, "../..");
  const review = await pepperReviewPromise;
  const probe = review.ordinaryNutritionChecks.paprikaEgg;
  assert.deepEqual(calculate(probe.input), probe.result);
  assert.equal(probe.result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(probe.input.ingredients.length, 5);
  for (const value of Object.values(probe.result.perServing)) assert.equal(value, null);
  assert.equal(probe.result.totalCarbohydratePerServingG, null);
  assert.ok(probe.input.ingredients.every((i: {retainedFraction?: number}) => i.retainedFraction === undefined));
  for (const row of review.ordinaryNutritionChecks.existingEvidence) {
    const input = JSON.parse(await readFile(path.join(root, "docs/nutrition/calculations", row.recipeId + ".json"), "utf8"));
    assert.deepEqual(calculate(input), row.result);
    assert.equal(row.result.status, "ESTIMATE WITH EVIDENCE");
  }
  const ham = review.ordinaryNutritionChecks.existingEvidence.find((r: {recipeId: string}) => r.recipeId === "yrttituorejuusto-kinkkurullat");
  assert.equal(ham.result.perServing.netCarbohydrate, 2.76);
  assert.equal(ham.result.totalCarbohydratePerServingG, 3.66, "use model's unrounded aggregation, not rounded macro addition");
  assert.equal(ham.result.ingredients.find((i: {record?: {id: string}}) => i.record?.id === "fineli-386-release-20").amount, 100);
});

test("source integrity screen covers exactly 45 unchanged records and distinguishes P0 exposure from confirmed subset", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, "docs/nutrition", file), "utf8"));
  const [screen, baseline, pilot] = await Promise.all([read("glycemic-source-integrity-screen-2026-10-28.json"), read("glycemic-red-pepper-source-baseline.json"), JSON.parse(await readFile(path.join(root, "tmp/nutrition/glycemic-load-pilot.json"), "utf8"))]);
  assert.deepEqual(screen.records.map((r: {id: string}) => r.id).sort(), baseline.giCatalog.records.map((r: {id: string}) => r.id).sort());
  const almondBaseline = await almondBaselinePromise;
  const counts: Record<string, number> = {};
  for (const row of screen.records) {
    counts[row.classification] = (counts[row.classification] ?? 0) + 1;
    const inputs = pilot.calculationInputs as GlycemicLoadRecipeInput[];
    const users = inputs.filter(r => r.ingredients.some(i => i.giRecordId === row.id));
    const previous = almondBaseline.sourceUsage.find((r: {id: string}) => r.id === row.id);
    assert.equal(previous.activeBindings, row.activeBindingsAfter, "the source screen remains anchored to its frozen historical usage count");
    assert.deepEqual(previous.calculatedUsers, row.calculatedUsersAfter, "the source screen retains its historical calculated subset");
    const liveBindings = inputs.flatMap(r => r.ingredients).filter(i => i.giRecordId === row.id);
    assert.equal(liveBindings.length, users.reduce((sum, recipe) => sum + recipe.ingredients.filter(i => i.giRecordId === row.id).length, 0));
    const liveCalculatedUsers = users.filter(r => pilot.results.find((x: {recipeId: string; status: string}) => x.recipeId === r.recipeId).status === "CALCULATED").map(r => r.recipeId).sort();
    assert.ok(liveCalculatedUsers.every(id => users.some(r => r.recipeId === id && r.ingredients.some(i => i.giRecordId === row.id))), row.id);
  }
  assert.deepEqual(counts, screen.counts);
  assert.deepEqual(counts, { PASS: 19, P2: 1, P1: 23, P0: 2 });
  const bakery = screen.records.find((r: {id: string}) => r.id === "bakery-products-category-mean-gi-58");
  assert.equal(bakery.activeBindingsBefore, 62);
  assert.equal(bakery.calculatedUsersBefore.length, 28);
  assert.equal(bakery.confirmedAlmondFlourPublishedSubset.length, 12);
  assert.ok(bakery.confirmedAlmondFlourPublishedSubset.every((id: string) => bakery.calculatedUsersBefore.includes(id)));
});


test("almond meal rejects bakery means across identity, name, state and copied preparation variants", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const catalog = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8"));
  const bakery = { ...catalog.records.find((r: GlycemicIndexRecord) => r.id === "bakery-products-category-mean-gi-58"), calculationUse: undefined } as GlycemicIndexRecord;
  const variants = [
    { ...food("afcd-F006077-2026-10-24", 5.4, "renamed ingredient"), state: "neutral" },
    food("new-source", 5.4, "almond flour"), food("new-source", 5.4, "Almond-meal"),
    food("new-source", 5.4, "jauhettua mantelia"), food("new-source", 5.4, "mantelijauhe"),
    { ...food("new-source", 5.4, "neutral"), state: "ground almonds, baked in mixed recipe" },
  ];
  for (const composition of variants) for (const grams of [0.01, 100]) {
    const ingredient = { name: "renamed flour", grams, fineliRecordId: composition.id, giRecordId: bakery.id,
      foodKey: bakery.foodKey, preparationKey: bakery.preparationKey, giMatchEvidence: "LOW analogy: recipe is baked; copied category keys." };
    const input = { recipeId: "almond-probe", servings: 1, ingredients: [ingredient] };
    for (const source of [bakery, { ...bakery, id: "renamed-category", foodKey: bakery.foodKey }]) {
      const result = calculateGlycemicLoad({ ...input, ingredients: [{ ...ingredient, giRecordId: source.id }] }, [composition], [source]);
      assert.equal(result.status, "INSUFFICIENT SOURCE DATA", composition.name);
      assert.equal(result.glycemicLoadPerServing, null);
      assert.match(result.blockers.join(" "), /Almond meal\/flour cannot use/);
    }
    const missing = calculateGlycemicLoad({ ...input, ingredients: [{ ...ingredient, giRecordId: null }] }, [composition], [bakery]);
    assert.equal(missing.ingredients[0].giCandidates.length, 0, "mismatched category cannot be suggested");
  }
  const byIngredient = { recipeId: "name-probe", servings: 1, ingredients: [{ name: "mantelijauhoa", grams: 100, fineliRecordId: "neutral", giRecordId: bakery.id, foodKey: bakery.foodKey, preparationKey: bakery.preparationKey, giMatchEvidence: "Synthetic source with explicit food and preparation identity." }] };
  assert.equal(calculateGlycemicLoad(byIngredient, [food("neutral", 5.4)], [bakery]).status, "INSUFFICIENT SOURCE DATA");
  // A hypothetical exact source demonstrates narrowness, not approval of a new real GI.
  const exact = { ...gi, id: "synthetic-almond-study", foodKey: "almond-meal", preparationKey: "baked", matchKind: "EXACT" as const };
  const accepted = calculateGlycemicLoad({ ...byIngredient, ingredients: [{ ...byIngredient.ingredients[0], giRecordId: exact.id, foodKey: exact.foodKey, preparationKey: exact.preparationKey }] }, [food("neutral", 5.4, "almond meal")], [exact]);
  assert.equal(accepted.status, "CALCULATED");
  assert.equal(accepted.glycemicLoadPerServing, 2.7);
  const unrelated = calculateGlycemicLoad({ ...byIngredient, ingredients: [{ ...byIngredient.ingredients[0], name: "tested food", giRecordId: gi.id, foodKey: gi.foodKey, preparationKey: gi.preparationKey }] }, [food("neutral", 10, "tested food")], [gi]);
  assert.equal(unrelated.glycemicLoadPerServing, 5);
});

test("almond correction freezes the published 326 baseline and allows exactly 99 unchanged, 2 revised and 10 withdrawn estimates", async () => {
  const { createHash } = await import("node:crypto");
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const [baseline, review, pilot, catalog] = await Promise.all([almondBaselinePromise, almondReviewPromise, read("tmp/nutrition/glycemic-load-pilot.json"), read("docs/nutrition/glycemic-index-records.json")]);
  const hash = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
  const baselineText = (await readFile(path.join(root, "docs/nutrition/glycemic-almond-source-baseline.json"), "utf8")).replaceAll("\r\n", "\n");
  assert.equal(createHash("sha256").update(baselineText).digest("hex"), "37611fbbb5eb1ada44536f900e8d1bcfa0de83bde441130253058b85a2e34412");
  assert.equal(baseline.sourceCommit, "e64a7ce04e71ab707f263b752763d02e42823cc7");
  assert.deepEqual(baseline.summary, { recipes: 326, calculated: 111, incomplete: 215, giRecords: 45 });
  assert.equal(baseline.results.length, 326);
  assert.deepEqual(baseline.results, (await pepperReviewPromise).allRecipeComparisons.map((r: {after: unknown}) => r.after), "baseline is the exact published pepper-correction result, including every full-result digest");
  assert.equal(new Set(pilot.results.map((r: {recipeId: string}) => r.recipeId)).size, 326);
  assert.equal(review.allRecipeComparisons.length, 326);
  assertCatalogExceptFinalBakery(catalog, baseline.giCatalog);
  const bakery = await currentBakeryReviewPromise;
  const counts: Record<string, number> = {};
  for (const row of review.allRecipeComparisons) {
    const prior = baseline.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    const actual = pilot.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    assert.deepEqual(row.before, prior);
    const isR1B = r1bAffectedRecipeIds.has(row.recipeId);
    const latest = bakery.affectedRecipeIds.includes(row.recipeId) ? bakery.allRecipeComparisons.find((r: {recipeId: string}) => r.recipeId === row.recipeId).after : row.after;
    if (!isR1B) {
      assert.equal(hash(actual), latest.resultSHA256, row.recipeId);
      for (const key of ["status", "glycemicLoadPerServing", "unroundedGlycemicLoadPerServing", "glycemicLoadRangePerServing", "confidence"]) assert.deepEqual(actual[key], latest[key], row.recipeId + key);
      assert.equal(actual.status === "CALCULATED" ? classifyGlycemicLoad(actual.glycemicLoadPerServing) : null, latest.glycemicClass);
    }
    assert.equal(pilot.sourceHashes[row.recipeId], baseline.sourceHashes[row.recipeId], "recipe text stays unchanged");
    if (!isR1B && !review.affectedRecipeIds.includes(row.recipeId) && !bakery.affectedRecipeIds.includes(row.recipeId)) {
      assert.equal(hash(actual), prior.resultSHA256, `${row.recipeId}: full result unchanged`);
      assert.equal(pilot.calculationInputHashes[row.recipeId], baseline.calculationInputHashes[row.recipeId]);
      assert.equal(pilot.calculationEvidenceHashes[row.recipeId], baseline.calculationEvidenceHashes[row.recipeId]);
    }
    const change = effectiveR1BChange(row, actual);
    counts[change] = (counts[change] ?? 0) + 1;
  }
  assert.deepEqual(counts, { UNCHANGED_CALCULATED: 97, STILL_INCOMPLETE: 215, WITHDRAWN: 12, CHANGED: 2 });
  assert.equal(pilot.results.filter((r: {status: string}) => r.status === "CALCULATED").length, 83);
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
  for (const [file, expected] of Object.entries({ ...baseline.historicalBaselineCanonicalSHA256, ...baseline.preserved2B6EFileSHA256, ...baseline.unchangedModelAndFoodSHA256 })) {
    const text = (await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n");
    if (file === "site/scripts/glycemic-load-recipe-binding.ts") {
      assert.equal(expected, (await bakeryBaselinePromise).beforeBindingCanonicalSHA256);
      assert.equal(createHash("sha256").update(text).digest("hex"), bakery.afterBindingCanonicalSHA256);
    } else if (file === "site/scripts/glycemic-load-model.ts") {
      assert.equal(expected, (await finalBakeryBaselinePromise).beforeModelCanonicalSHA256);
      assert.equal(createHash("sha256").update(text).digest("hex"), (await finalBakeryReviewPromise).afterModelCanonicalSHA256);
    } else assert.equal(createHash("sha256").update(text).digest("hex"), expected, file);
  }
});

test("all thirteen almond bindings and only the reviewed ingredient rows change; restoring any bakery binding fails", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, "docs/nutrition", file), "utf8"));
  const [baseline, review, inputs, foods, catalog, bindings] = await Promise.all([almondBaselinePromise, almondReviewPromise, read("glycemic-load-pilot-input.json"), read("food-records.json"), read("glycemic-index-records.json"), read("glycemic-load-recipe-bindings.json")]);
  assert.equal(review.affectedRecipes.length, 13);
  assert.equal(review.affectedRecipes.filter((r: {before: {status: string}}) => r.before.status === "CALCULATED").length, 12);
  const actualChanges: string[] = [];
  for (const row of review.affectedRecipes) {
    const prior = baseline.affectedInputs.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    const input = inputs.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    const result = calculateGlycemicLoad(input, foods, catalog.records);
    assert.deepEqual(result, row.after);
    assert.equal(input.servings, prior.servings);
    assert.equal(input.ingredients.length, prior.ingredients.length);
    const index = row.almondBinding.index;
    assert.equal(input.ingredients[index].giRecordId, null);
    assert.equal(input.ingredients[index].grams, prior.ingredients[index].grams);
    assert.equal(input.ingredients[index].fineliRecordId, "afcd-F006077-2026-10-24");
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[row.recipeId]);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[row.recipeId]);
    assert.notEqual(glycemicLoadInputHash(prior), bindings.calculationInputs[row.recipeId]);
    for (let j = 0; j < input.ingredients.length; j++) {
      if (JSON.stringify(input.ingredients[j]) !== JSON.stringify(prior.ingredients[j])) actualChanges.push(`${row.recipeId}:${j}`);
      assert.deepEqual(input.ingredients[j], row.ingredientReview[j].after);
    }
    const restored = structuredClone(input);
    const bakery = catalog.records.find((g: GlycemicIndexRecord) => g.id === "bakery-products-category-mean-gi-58");
    Object.assign(restored.ingredients[index], { giRecordId: bakery.id, foodKey: bakery.foodKey, preparationKey: bakery.preparationKey, grams: 0.01 });
    const rejected = calculateGlycemicLoad(restored, foods, catalog.records);
    assert.equal(rejected.glycemicLoadPerServing, null);
    assert.match(rejected.blockers.join(" "), /reference-only/);
    assert.notEqual(glycemicLoadInputHash(restored), bindings.calculationInputs[row.recipeId]);
  }
  assert.equal(actualChanges.length, 24);
  assert.deepEqual(actualChanges.sort(), review.allowedInputChanges.map((r: {recipeId: string; index: number}) => `${r.recipeId}:${r.index}`).sort());
});

test("the two retained almond estimates use source-backed cumulative omissions, while six tempting threshold-only estimates stay blocked", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, "docs/nutrition", file), "utf8"));
  const [review, inputs, foods, catalog, fineli] = await Promise.all([almondReviewPromise, read("glycemic-load-pilot-input.json"), read("food-records.json"), read("glycemic-index-records.json"), read("fineli-release-20-reference.json")]);
  const powder = fineli.foods.find((f: {source_id: string}) => f.source_id === "74");
  const cocoa = fineli.foods.find((f: {source_id: string}) => f.source_id === "20");
  assert.equal(powder.portion_mass_g.TL, 5);
  assert.equal(powder.per100g.available_carbohydrate_g_per_100g, 37.8);
  assert.equal(cocoa.portion_mass_g.RKL, 6);
  assert.equal(cocoa.per100g.available_carbohydrate_g_per_100g, 11);
  const expected = [
    ["vhh-brita-kakku", 0.78925, 0.79, 1.07875],
    ["vhh-mokkapalat", 0.08458333333333334, 0.08, 1.02375],
  ] as const;
  for (const [id, exact, rounded, omitted] of expected) {
    const input = inputs.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === id);
    const result = calculateGlycemicLoad(input, foods, catalog.records);
    assert.equal(result.status, "CALCULATED");
    assert.equal(result.unroundedGlycemicLoadPerServing, exact);
    assert.equal(result.glycemicLoadPerServing, rounded);
    assert.ok(Math.abs(result.omittedAvailableCarbohydratePerServingG - omitted) < 1e-12);
    assert.equal(result.confidence, "LOW");
    assert.equal(classifyGlycemicLoad(rounded), "LOW");
    for (const ingredient of input.ingredients) {
      if (ingredient.availableCarbohydrateUpperBoundPerServingG === undefined) continue;
      const isCocoa = ingredient.name.includes("kaakao");
      const source = isCocoa ? cocoa : powder;
      const unitMass = source.portion_mass_g[isCocoa ? "RKL" : "TL"];
      const count = ingredient.name === "kaakaojauhetta" ? 2 : 1;
      const expectedBound = unitMass * count * source.per100g.available_carbohydrate_g_per_100g / 100 / input.servings;
      assert.equal(ingredient.availableCarbohydrateUpperBoundPerServingG, expectedBound);
      assert.ok(expectedBound < 1);
      assert.match(ingredient.upperBoundEvidence, /Fineli Release 20/);
    }
    const missing = structuredClone(input);
    missing.ingredients.find((i: {fineliRecordId: string}) => i.fineliRecordId === "afcd-F006077-2026-10-24").grams = null;
    assert.equal(calculateGlycemicLoad(missing, foods, catalog.records).glycemicLoadPerServing, null);
  }
  const temptation = review.affectedRecipes.filter((r: {removalOnlyCounterfactual: {status: string}; after: {status: string}}) => r.removalOnlyCounterfactual.status === "CALCULATED" && r.after.status !== "CALCULATED");
  assert.equal(temptation.length, 6);
  for (const row of temptation) {
    const input = inputs.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    const result = calculateGlycemicLoad(input, foods, catalog.records);
    assert.equal(result.glycemicLoadPerServing, null);
    assert.ok(result.blockers.length > 0);
    assert.ok(input.ingredients.some((i: {grams: number | null; availableCarbohydrateUpperBoundPerServingG?: number}) => i.grams === null && i.availableCarbohydrateUpperBoundPerServingG === undefined));
  }
});

test("bakery audit accounts for 62 bindings, 58 recipes and all 28 published users without changing the other 16", async () => {
  const [baseline, review] = await Promise.all([almondBaselinePromise, almondReviewPromise]);
  const rows = review.bakeryBindings;
  assert.equal(rows.length, 62);
  assert.equal(new Set(rows.map((r: {recipeId: string}) => r.recipeId)).size, 58);
  assert.equal(review.calculatedUserScreen.length, 28);
  assert.equal(new Set(review.calculatedUserScreen.map((r: {recipeId: string}) => r.recipeId)).size, 28);
  assert.deepEqual(review.groups.map((g: {name: string; bindings: number}) => [g.name, g.bindings]), [["almond-flour", 13], ["chopped-or-flaked-almonds", 0], ["wheat-flour", 27], ["semolina", 6], ["finished-bread", 0], ["finished-pastry", 0], ["other-flours", 7], ["other-foods", 9]]);
  for (const row of rows) {
    assert.ok(row.food.name && row.sourcePath && row.sourceIngredients.length && row.preparationInstructions);
    assert.equal(row.input.giRecordId, "bakery-products-category-mean-gi-58");
    assert.equal(row.status, baseline.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId).status);
  }
  const others = review.calculatedUserScreen.filter((r: {recipeId: string}) => !review.affectedRecipeIds.includes(r.recipeId));
  assert.equal(others.length, 16);
  for (const row of others) {
    assert.deepEqual(row.after, row.before);
    assert.match(row.decision, /FOLLOW-UP/);
  }
  assert.equal(review.urgentFollowUpRecipeIds.length, 4);
  const afterBakery = review.sourceUsageAfter.find((r: {id: string}) => r.id === "bakery-products-category-mean-gi-58");
  assert.equal(afterBakery.activeBindings, 49);
  assert.equal(afterBakery.calculatedUsers.length, 16);
});


test("AJO 1.8 freezes published 101/326, withdraws exactly four and preserves 322 complete results and fingerprints", async () => {
  const { createHash } = await import("node:crypto");
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const [baseline, review, pilot, catalog] = await Promise.all([bakeryBaselinePromise, bakeryReviewPromise, read("tmp/nutrition/glycemic-load-pilot.json"), read("docs/nutrition/glycemic-index-records.json")]);
  const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  const canonicalHash = async (file: string) => createHash("sha256").update((await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n")).digest("hex");
  assert.equal(await canonicalHash("docs/nutrition/glycemic-bakery-four-source-baseline.json"), "d3de477890bece9af9b134b81d7d0d6a60710ccd939a3ffe3607879788a1320c");
  assert.equal(baseline.sourceCommit, "6975421298e28b56c8dbda69ff7aab2f01e83902");
  assert.deepEqual(baseline.summary, { recipes: 326, calculated: 101, incomplete: 225, giRecords: 45 });
  assert.deepEqual(baseline.results, (await almondReviewPromise).allRecipeComparisons.map((r: {after: unknown}) => r.after));
  assert.equal(baseline.beforeModelCanonicalSHA256, (await almondReviewPromise).afterModelCanonicalSHA256);
  assert.equal(await canonicalHash("site/scripts/glycemic-load-model.ts"), (await finalBakeryReviewPromise).afterModelCanonicalSHA256);
  assert.equal(await canonicalHash("site/scripts/glycemic-load-recipe-binding.ts"), review.afterBindingCanonicalSHA256);
  assertCatalogExceptFinalBakery(catalog, baseline.giCatalog);
  assert.equal(new Set(pilot.results.map((r: {recipeId: string}) => r.recipeId)).size, 326);
  assert.equal(review.allRecipeComparisons.length, 326);
  const affected = ["keto-kauralesesampylat", "silakkapihvit-tilli-kermakastike", "vietnamilainen-banh-cuon-sienilla", "kanaviillokki-kukkakaalilla"];
  assert.deepEqual([...review.affectedRecipeIds].sort(), affected.sort());
  assert.deepEqual([...review.withdrawnRecipeIds].sort(), affected.sort());
  const counts: Record<string, number> = {};
  for (const row of review.allRecipeComparisons) {
    const prior = baseline.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    const actual = pilot.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    assert.deepEqual(row.before, prior);
    const isR1B = r1bAffectedRecipeIds.has(row.recipeId);
    const latest = (await finalBakeryReviewPromise).allRecipeComparisons.find((r: {recipeId: string}) => r.recipeId === row.recipeId).after;
    if (!isR1B) {
      assert.equal(hash(actual), latest.resultSHA256, row.recipeId);
      for (const key of ["status", "glycemicLoadPerServing", "unroundedGlycemicLoadPerServing", "glycemicLoadRangePerServing", "confidence"]) assert.deepEqual(actual[key], latest[key]);
      assert.equal(actual.status === "CALCULATED" ? classifyGlycemicLoad(actual.glycemicLoadPerServing) : null, latest.glycemicClass);
    }
    assert.equal(pilot.sourceHashes[row.recipeId], baseline.sourceHashes[row.recipeId]);
    if (!isR1B && !affected.includes(row.recipeId) && !(await finalBakeryReviewPromise).affectedRecipeIds.includes(row.recipeId)) {
      assert.equal(hash(actual), prior.resultSHA256, `${row.recipeId}: full result unchanged`);
      assert.equal(pilot.calculationInputHashes[row.recipeId], baseline.calculationInputHashes[row.recipeId]);
      assert.equal(pilot.calculationEvidenceHashes[row.recipeId], baseline.calculationEvidenceHashes[row.recipeId]);
    } else {
      assert.equal(actual.glycemicLoadPerServing, null);
      assert.equal(actual.confidence, null);
    }
    const change = effectiveR1BChange(row, actual);
    counts[change] = (counts[change] ?? 0) + 1;
  }
  assert.deepEqual(counts, { UNCHANGED_CALCULATED: 95, STILL_INCOMPLETE: 225, WITHDRAWN: 6 });
  assert.equal(pilot.results.filter((r: {status: string}) => r.status === "CALCULATED").length, 83);
  for (const [file, expected] of Object.entries({ ...baseline.historicalBaselineCanonicalSHA256, ...baseline.preserved2B6EFileSHA256, ...baseline.unchangedModelAndFoodSHA256 })) assert.equal(await canonicalHash(file), expected, file);
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
});

test("reviewed bran/flour uses reject copied bakery keys even at tiny mass; use removal invalidates fingerprint", async () => {
  const root = path.resolve(import.meta.dirname, "../../docs/nutrition");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const [baseline, review, inputs, foods, catalog, bindings] = await Promise.all([bakeryBaselinePromise, bakeryReviewPromise, read("glycemic-load-pilot-input.json"), read("food-records.json"), read("glycemic-index-records.json"), read("glycemic-load-recipe-bindings.json")]);
  const bakery = catalog.records.find((r: GlycemicIndexRecord) => r.id === "bakery-products-category-mean-gi-58");
  const actualChanges: string[] = [];
  for (const row of review.affectedRecipes) {
    const input = inputs.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId) as GlycemicLoadRecipeInput;
    const prior = baseline.affectedInputs.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    assert.equal(input.servings, prior.servings);
    assert.equal(input.ingredients.length, prior.ingredients.length);
    assert.deepEqual(calculateGlycemicLoad(input, foods, catalog.records), row.after);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[row.recipeId]);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[row.recipeId]);
    for (let j=0; j<input.ingredients.length; j++) {
      assert.deepEqual(input.ingredients[j], row.ingredientReview[j].after);
      if (JSON.stringify(input.ingredients[j]) !== JSON.stringify(prior.ingredients[j])) actualChanges.push(`${row.recipeId}:${j}`);
    }
    const index = row.bakeryBinding.index;
    assert.equal(input.ingredients[index].giRecordId, null);
    assert.equal(input.ingredients[index].grams, prior.ingredients[index].grams);
    assert.equal(input.ingredients[index].fineliRecordId, prior.ingredients[index].fineliRecordId);
    assert.ok(row.bakeryBinding.afterResult.availableCarbohydratePerServingG >= 1);
    assert.equal(row.removalOnlyCounterfactual.glycemicLoadPerServing, null);
    for (const grams of [0.01, input.ingredients[index].grams!]) {
      const i = { ...input.ingredients[index], grams, giRecordId: bakery.id, foodKey: bakery.foodKey, preparationKey: bakery.preparationKey };
      const probe = { recipeId: "copied-keys-independent-of-recipe-id", servings: 1, ingredients: [i] };
      const rejected = calculateGlycemicLoad(probe, foods, catalog.records);
      assert.equal(rejected.glycemicLoadPerServing, null);
      assert.match(rejected.blockers.join(" "), /reference-only/);
      assert.equal(rejected.ingredients[0].giCandidates.some(g => g.id === bakery.id), false);
      // Even an alternate ID carrying the same category key is not an escape.
      const renamed = { ...bakery, calculationUse: undefined, id: "copy-of-category" };
      assert.equal(calculateGlycemicLoad({ ...probe, ingredients: [{ ...i, giRecordId: renamed.id }] }, foods, [renamed]).glycemicLoadPerServing, null);
    }
    const stripped = structuredClone(input); delete stripped.ingredients[index].ingredientUse;
    assert.notEqual(glycemicLoadInputHash(stripped), bindings.calculationInputs[row.recipeId]);
    // A hypothetical exact matched study is not forbidden by the category-specific safeguard.
    const exact = { ...bakery, calculationUse: undefined, id: "synthetic-test-only", foodKey: "specific-ingredient", preparationKey: "specific-preparation", matchKind: "EXACT" as const };
    const single = { ...input.ingredients[index], giRecordId: exact.id, foodKey: exact.foodKey, preparationKey: exact.preparationKey };
    assert.equal(calculateGlycemicLoad({ recipeId: "synthetic-only", servings: 1, ingredients: [single] }, foods, [exact]).status, "CALCULATED");
  }
  assert.equal(actualChanges.length, 14);
  assert.deepEqual(actualChanges.sort(), review.allowedInputChanges.map((r: {recipeId: string; index: number}) => `${r.recipeId}:${r.index}`).sort());
  const rows = inputs.recipes.flatMap((r: GlycemicLoadRecipeInput) => r.ingredients.flatMap((i, index) => i.giRecordId === bakery.id ? [{ recipeId: r.recipeId, index, input: i }] : []));
  assert.equal(rows.length, 0);
  const historicalRows = (await finalBakeryBaselinePromise).affectedInputs.flatMap((r: GlycemicLoadRecipeInput) => r.ingredients.flatMap((input, index) => input.giRecordId === bakery.id ? [{ recipeId: r.recipeId, index, input }] : []));
  assert.equal(historicalRows.length, 45);
  assert.deepEqual(historicalRows, review.remainingBakeryBindings.map(({recipeId, index, input}: {recipeId: string; index: number; input: unknown}) => ({recipeId, index, input})));
  assert.equal(review.sourceUsageAfter.find((r: {id: string}) => r.id === bakery.id).calculatedUsers.length, 12);
});

test("four-recipe audit rejects known false composition and unverified positive omissions", async () => {
  const review = await bakeryReviewPromise;
  const rows = new Map<string, any>(review.affectedRecipes.map((r: any) => [r.recipeId, r]));
  const chicken = rows.get("kanaviillokki-kukkakaalilla");
  for (const i of [0, 7]) assert.equal(chicken.ingredientReview[i].after.fineliRecordId, null);
  for (const i of [5, 8]) {
    assert.equal(chicken.ingredientReview[i].after.estimatedAvailableCarbohydratePerServingG, undefined);
    assert.equal(chicken.ingredientReview[i].after.availableCarbohydrateUpperBoundPerServingG, undefined);
    assert.equal(chicken.after.ingredients[i].giContribution, null);
  }
  const rice = rows.get("vietnamilainen-banh-cuon-sienilla");
  assert.equal(rice.ingredientReview[1].after.grams, 100);
  assert.equal(rice.ingredientReview[3].after.fineliRecordId, null);
  assert.equal(rice.ingredientReview[3].after.grams, null);
  const fish = rows.get("silakkapihvit-tilli-kermakastike");
  assert.equal(fish.ingredientReview[3].after.grams, 150);
  assert.equal(fish.ingredientReview[5].after.grams, 5);
  for (const i of [6, 7]) assert.equal(fish.after.ingredients[i].giContribution, null);
});

test("AJO 1.9 freezes published 97 and withdraws exactly twelve across all 326 results", async () => {
  const { createHash } = await import("node:crypto");
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  const fileHash = async (file: string) => createHash("sha256").update((await readFile(path.join(root, file), "utf8")).replaceAll("\r\n", "\n")).digest("hex");
  const [baseline, review, pilot, catalog, four] = await Promise.all([finalBakeryBaselinePromise, finalBakeryReviewPromise, read("tmp/nutrition/glycemic-load-pilot.json"), read("docs/nutrition/glycemic-index-records.json"), bakeryReviewPromise]);
  assert.equal(await fileHash("docs/nutrition/glycemic-bakery-final-source-baseline.json"), "c1a6273c8c7668a5e50d6d0683b382f44c446bbc435b3545158aa4abb9fd69dd");
  assert.equal(baseline.sourceCommit, "7f215f47991fb19e4073cbe52645b5e6513b42ba");
  assert.deepEqual(baseline.summary, { recipes: 326, calculated: 97, incomplete: 229, giRecords: 45 });
  assert.equal(baseline.beforeModelCanonicalSHA256, four.afterModelCanonicalSHA256);
  assert.equal(await fileHash("site/scripts/glycemic-load-model.ts"), review.afterModelCanonicalSHA256);
  assert.equal(new Set(pilot.results.map((r: {recipeId: string}) => r.recipeId)).size, 326);
  assert.equal(baseline.results.length, 326);
  assert.equal(review.allRecipeComparisons.length, 326);
  assert.equal(review.affectedRecipeIds.length, 41);
  const expectedWithdrawals = ["aloo-paratha", "gulab-jamun", "karibia-johnny-cake", "kiinalainen-kevatsipulipannukakku", "lahi-ita-manakish-zaatarilla", "pizza-margherita", "pohjoisafrikkalainen-baghrir", "pohjoisafrikkalainen-harcha-juustolla", "pohjoisafrikkalainen-msemen-hunajalla", "samosa", "valimerellinen-appelsiini-aamiaiskakku", "vietnamilainen-banh-bao-kananmunalla"];
  assert.deepEqual([...review.withdrawnRecipeIds].sort(), expectedWithdrawals.sort());
  const counts: Record<string, number> = {};
  for (const row of review.allRecipeComparisons) {
    const prior = baseline.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    assert.deepEqual(row.before, prior);
    assert.equal(prior.resultSHA256, four.allRecipeComparisons.find((r: {recipeId: string}) => r.recipeId === row.recipeId).after.resultSHA256, "published baseline continues exact historical results");
    const result = pilot.results.find((r: {recipeId: string}) => r.recipeId === row.recipeId);
    const isR1B = r1bAffectedRecipeIds.has(row.recipeId);
    if (!isR1B) {
      assert.equal(hash(result), row.after.resultSHA256, row.recipeId);
      for (const key of ["status", "glycemicLoadPerServing", "unroundedGlycemicLoadPerServing", "glycemicLoadRangePerServing", "confidence", "omittedAvailableCarbohydratePerServingG", "omittedAvailableCarbohydrateUpperBoundPerServingG", "blockers"]) assert.deepEqual(result[key], row.after[key], row.recipeId + key);
      assert.equal(result.status === "CALCULATED" ? classifyGlycemicLoad(result.glycemicLoadPerServing) : null, row.after.glycemicClass);
    }
    assert.equal(pilot.sourceHashes[row.recipeId], baseline.sourceHashes[row.recipeId]);
    if (!isR1B && !review.affectedRecipeIds.includes(row.recipeId)) {
      assert.equal(hash(result), prior.resultSHA256, `${row.recipeId}: all 285 unaffected full results unchanged`);
      assert.equal(pilot.calculationInputHashes[row.recipeId], baseline.calculationInputHashes[row.recipeId]);
      assert.equal(pilot.calculationEvidenceHashes[row.recipeId], baseline.calculationEvidenceHashes[row.recipeId]);
    }
    const change = effectiveR1BChange(row, result);
    if (change === "UNCHANGED_CALCULATED" && !isR1B) assert.equal(hash(result), prior.resultSHA256);
    if (change === "WITHDRAWN") {
      assert.equal(result.glycemicLoadPerServing, null);
      assert.equal(result.unroundedGlycemicLoadPerServing, null);
      assert.equal(result.confidence, null);
      if (!isR1B) assert.equal(row.after.glycemicClass, null);
      assert.ok(result.blockers.length > 0);
    }
    counts[change] = (counts[change] ?? 0) + 1;
  }
  assert.deepEqual(counts, { UNCHANGED_CALCULATED: 83, STILL_INCOMPLETE: 229, WITHDRAWN: 14 });
  assert.deepEqual(review.summary, { UNCHANGED_CALCULATED: 85, STILL_INCOMPLETE: 229, WITHDRAWN: 12 }, "frozen AJO 1.9 review counts remain historical");
  assert.equal(pilot.results.filter((r: {status: string}) => r.status === "CALCULATED").length, 83);
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
  for (const [file, expected] of Object.entries({...baseline.historicalBaselineCanonicalSHA256, ...baseline.preserved2B6EFileSHA256, ...baseline.unchangedModelAndFoodSHA256})) assert.equal(await fileHash(file), expected, file);
  const old = baseline.giCatalog.records.find((r: GlycemicIndexRecord) => r.id === "bakery-products-category-mean-gi-58");
  const current = catalog.records.find((r: GlycemicIndexRecord) => r.id === old.id);
  assert.equal(current.gi, 58);
  assert.equal(current.calculationUse, "REFERENCE_ONLY");
  assert.deepEqual(current, { ...old, calculationUse: "REFERENCE_ONLY", note: current.note, source: { ...old.source, qualityEvidence: current.source.qualityEvidence } }, "only status and explanatory source metadata may change");
  assert.match(current.source.qualityEvidence, /45 remaining bindings in 41 recipes/);
  assertCatalogExceptFinalBakery(catalog, baseline.giCatalog);
});

test("AJO 1.9 reviews all 45 bindings, preserves composition and forbids reference-only restoration at any positive mass", async () => {
  const root = path.resolve(import.meta.dirname, "../../docs/nutrition");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const [baseline, review, inputs, foods, catalog, bindings] = await Promise.all([finalBakeryBaselinePromise, finalBakeryReviewPromise, read("glycemic-load-pilot-input.json"), read("food-records.json"), read("glycemic-index-records.json"), read("glycemic-load-recipe-bindings.json")]);
  const bakery = catalog.records.find((r: GlycemicIndexRecord) => r.id === "bakery-products-category-mean-gi-58");
  assert.equal(review.allBakeryBindings.length, 45);
  assert.equal(new Set(review.allBakeryBindings.map((r: {recipeId: string; index: number}) => `${r.recipeId}:${r.index}`)).size, 45);
  assert.equal(review.affectedRecipes.filter((r: {reviewDepth: string}) => r.reviewDepth === "FULL_PUBLISHED_RECIPE").length, 12);
  assert.equal(inputs.recipes.flatMap((r: GlycemicLoadRecipeInput) => r.ingredients).filter((i: {giRecordId: string}) => i.giRecordId === bakery.id).length, 0);
  const changes: string[] = [];
  for (const row of review.affectedRecipes) {
    const input = inputs.recipes.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId) as GlycemicLoadRecipeInput;
    const prior = baseline.affectedInputs.find((r: GlycemicLoadRecipeInput) => r.recipeId === row.recipeId);
    assert.ok(row.sourcePath && row.sourceIngredients.length && row.preparationInstructions && row.preparationDecision && row.editorialRisks);
    const modelExpected = structuredClone(row.after);
    modelExpected.blockers = modelExpected.blockers.filter((message: string) => !message.includes(": recipe structure differs from the last GL review"));
    assert.deepEqual(calculateGlycemicLoad(input, foods, catalog.records), modelExpected);
    assert.equal(input.servings, prior.servings);
    assert.equal(input.ingredients.length, prior.ingredients.length);
    assert.equal(glycemicLoadInputHash(input), bindings.calculationInputs[row.recipeId]);
    assert.equal(glycemicLoadEvidenceHash(input, foods, catalog.records), bindings.calculationEvidence[row.recipeId]);
    assert.notEqual(glycemicLoadInputHash(prior), bindings.calculationInputs[row.recipeId]);
    for (let j = 0; j < input.ingredients.length; j++) {
      const old = prior.ingredients[j], current = input.ingredients[j];
      if (old.giRecordId !== bakery.id) assert.deepEqual(current, old, `${row.recipeId}:${j} other ingredient unchanged`);
      else {
        changes.push(`${row.recipeId}:${j}`);
        const { foodKey, preparationKey, ...remaining } = old;
        assert.deepEqual(current, {...remaining, giRecordId: null, giMatchEvidence: current.giMatchEvidence});
        assert.match(current.giMatchEvidence!, /REFERENCE_ONLY/);
        if (row.before.status === "CALCULATED") assert.ok(row.before.ingredients[j].availableCarbohydratePerServingG >= 1, "withdrawn flour cannot qualify as a small portion");
        for (const grams of [0.01, old.grams]) {
          const ingredient = {...current, grams, giRecordId: bakery.id, foodKey: bakery.foodKey, preparationKey: bakery.preparationKey};
          const probe = {recipeId: "copied-category-keys", servings: 1, ingredients: [ingredient]};
          const result = calculateGlycemicLoad(probe, foods, catalog.records);
          assert.equal(result.glycemicLoadPerServing, null, `${row.recipeId}:${j}`);
          assert.match(result.blockers.join(" "), /reference-only/);
          assert.equal(result.ingredients[0].giCandidates.some(c => c.id === bakery.id), false);
          const missing = calculateGlycemicLoad({...probe, ingredients: [{...ingredient, giRecordId: null}]}, foods, catalog.records);
          assert.equal(missing.ingredients[0].giCandidates.some(c => c.id === bakery.id), false);
        }
        const unknown = calculateGlycemicLoad({recipeId: "unknown-quantity", servings: 1, ingredients: [{...current, grams: null}]}, foods, catalog.records);
        assert.equal(unknown.glycemicLoadPerServing, null);
      }
    }
  }
  assert.equal(changes.length, 45);
  assert.deepEqual(changes.sort(), review.allowedInputChanges.map((r: {recipeId: string; index: number}) => `${r.recipeId}:${r.index}`).sort());
  const currentUsage = review.sourceUsageAfter.find((r: {id: string}) => r.id === bakery.id);
  assert.equal(currentUsage.activeBindings, 0);
  assert.deepEqual(currentUsage.calculatedUsers, []);
  const sourceBefore = baseline.sourceUsage.find((r: {id: string}) => r.id === bakery.id);
  assert.equal(sourceBefore.activeBindings, 45);
  assert.equal(sourceBefore.calculatedUsers.length, 12);
});

test("reference-only records cannot bypass rejection through tiny, bounded or zero omission overrides", async () => {
  const catalog = JSON.parse(await readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-index-records.json"), "utf8"));
  const rejected = catalog.records.filter((r: GlycemicIndexRecord) => r.calculationUse === "REFERENCE_ONLY");
  assert.ok(rejected.some((r: GlycemicIndexRecord) => r.id === "bakery-products-category-mean-gi-58"));
  for (const record of rejected) for (const override of [
    {estimatedAvailableCarbohydratePerServingG: 0.1, negligibleAssumption: "Synthetic small portion"},
    {availableCarbohydrateUpperBoundPerServingG: 0.1, upperBoundEvidence: "Synthetic bound"},
    {estimatedAvailableCarbohydratePerServingG: 0, negligibleAssumption: "Synthetic zero"},
  ]) {
    const ingredient = {name: "probe", grams: 0.01, fineliRecordId: "probe", giRecordId: record.id, foodKey: record.foodKey, preparationKey: record.preparationKey, excludedReason: "Synthetic exclusion", ...override};
    const result = calculateGlycemicLoad({recipeId: "reference-only-override", servings: 1, ingredients: [ingredient]}, [food("probe", 10)], catalog.records);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(result.glycemicLoadPerServing, null);
    assert.match(result.blockers.join(" "), /reference-only/);
    assert.equal(result.omittedAvailableCarbohydratePerServingG, 0);
    assert.equal(result.ingredients[0].giContribution, null);
    assert.equal(result.ingredients[0].giCandidates.some(c => c.id === record.id), false);
    // An omission without an explicit invalid source retains the existing policy.
    const missing = calculateGlycemicLoad({recipeId: "valid-override-control", servings: 1, ingredients: [{...ingredient, giRecordId: null}]}, [food("probe", 10)], catalog.records);
    assert.equal(missing.status, "CALCULATED");
  }
});



test("GK 2.1 R1B audits all three recipe inputs without publishing unsupported GI estimates", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const read = async (file: string) => JSON.parse(await readFile(path.join(root, file), "utf8"));
  const [inputReport, pilot, foods, coverage, nutrition] = await Promise.all([
    read("docs/nutrition/glycemic-load-pilot-input.json"),
    read("tmp/nutrition/glycemic-load-pilot.json"),
    read("docs/nutrition/food-records.json"),
    read("docs/nutrition/glycemic-coverage-current-2026-10-25.json"),
    read("tmp/nutrition/audit.json"),
  ]);
  const ids = ["jauheliha-makaronilaatikko", "koshari", "yangzhou-paistettu-riisi"];
  const inputById = new Map<string, GlycemicLoadRecipeInput>(inputReport.recipes.map((row: GlycemicLoadRecipeInput): [string, GlycemicLoadRecipeInput] => [row.recipeId, row]));
  const resultById = new Map<string, any>(pilot.results.map((row: any): [string, any] => [row.recipeId, row]));
  const nutritionById = new Map<string, any>(nutrition.inventory.map((row: any): [string, any] => [row.recipe_id, row]));
  const coverageById = new Map<string, any>(coverage.recipes.map((row: any): [string, any] => [row.recipeId, row]));

  const casserole = inputById.get(ids[0])!;
  const casseroleSource = parseMarkdown(await readFile(path.join(root, "reseptit/paaruoat/jauheliha-makaronilaatikko.md"), "utf8"));
  assert.ok(casseroleSource);
  const sourceIngredients = casseroleSource.data.ingredients as Array<{ amount: number; unit: string }>;
  assert.equal(sourceIngredients.length, 14);
  assert.equal(casserole.ingredients.length, 14);
  assert.deepEqual(sourceIngredients.map(({ amount, unit }) => `${amount} ${unit}`), [
    "400 g", "600 g", "70 g", "13.5 g", "500 g", "6 kpl", "200 g", "200 g", "200 g", "100 g", "3 g", "1 g", "2 g", "6 g",
  ]);
  assert.deepEqual(casserole.ingredients.map((ingredient) => ingredient.grams), [400, 600, 70, 13.5, 500, 330, 200, 200, 200, 100, 3, 1, 2, 6]);
  const beef = casserole.ingredients.find((ingredient) => ingredient.name === "7 % naudan jauhelihaa")!;
  assert.equal(beef.fineliRecordId, "fineli-11562-2026-10-24");
  assert.equal(beef.estimatedAvailableCarbohydratePerServingG, 0);
  assert.match(beef.massEvidence!, /17% fat composition is not used as a full macro match/);
  const casseroleResult = resultById.get(ids[0])!;
  assert.equal(casseroleResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(casseroleResult.glycemicLoadPerServing, null);
  assert.equal(casseroleResult.glycemicLoadRangePerServing, null);
  assert.ok(casseroleResult.omittedAvailableCarbohydratePerServingG < 2);
  assert.equal(casseroleResult.omittedAvailableCarbohydrateUpperBoundPerServingG, 0.5);
  assert.match(casseroleResult.blockers.join(" "), /kuivattua makaronia/);
  const casseroleAudit = nutritionById.get(ids[0])!;
  assert.equal(casseroleAudit.status, "INSUFFICIENT SOURCE DATA");
  assert.ok(casseroleAudit.evidenceErrors.includes("Calculation evidence file is missing"));
  assert.deepEqual(casseroleAudit.values, {
    carbs_net_per_serving_g: 37.18, carbs_total_per_serving_g: 38.79,
    protein_per_serving_g: 47.63, fat_per_serving_g: 27.93,
  });

  const koshari = inputById.get(ids[1])!;
  const koshariSource = parseMarkdown(await readFile(path.join(root, "reseptit/paaruoat/koshari.md"), "utf8"));
  assert.ok(koshariSource);
  assert.equal((koshariSource.data.ingredients as unknown[]).length, 12);
  assert.equal(koshari.ingredients.length, 12);
  const corn = koshari.ingredients.find((ingredient) => ingredient.name === "maissitärkkelystä")!;
  assert.equal(corn.grams, 16);
  assert.equal(corn.fineliRecordId, "fineli-27-2026-10-25");
  assert.equal(corn.giRecordId, null);
  assert.match(corn.massEvidence!, /potato starch is not a valid composition or GI substitute/);
  const cornFood = foods.find((row: FoodRecord) => row.id === corn.fineliRecordId)!;
  assert.equal(cornFood.per100g.carbohydrate, 86);
  for (const name of ["ruskeita linssejä", "riisiä", "pientä makaronia", "sipulia", "maissitärkkelystä", "tomaattimurskaa"]) {
    assert.equal(koshari.ingredients.find((ingredient) => ingredient.name === name)?.giRecordId, null, `${name} GI must remain unassigned`);
  }
  const koshariResult = resultById.get(ids[1])!;
  assert.equal(koshariResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(koshariResult.glycemicLoadPerServing, null);
  assert.ok(koshariResult.blockers.length >= 5);
  assert.equal(nutritionById.get(ids[1])!.status, "ESTIMATE WITH EVIDENCE");
  assert.deepEqual(nutritionById.get(ids[1])!.values, {
    carbs_net_per_serving_g: 95.91, carbs_total_per_serving_g: 103.14,
    protein_per_serving_g: 22.26, fat_per_serving_g: 12.03,
  });

  const yangzhou = inputById.get(ids[2])!;
  const yangzhouSource = parseMarkdown(await readFile(path.join(root, "reseptit/paaruoat/yangzhou-paistettu-riisi.md"), "utf8"));
  assert.ok(yangzhouSource);
  assert.equal((yangzhouSource.data.ingredients as unknown[]).length, 9);
  assert.equal(yangzhou.ingredients.length, 9);
  const rice = yangzhou.ingredients.find((ingredient) => ingredient.name === "keitettyä kylmää riisiä")!;
  assert.equal(rice.grams, 600);
  assert.equal(rice.giRecordId, null);
  assert.match(rice.giMatchEvidence!, /cultivar|cultivar/i);
  assert.match(rice.giMatchEvidence!, /overnight/);
  const springOnion = yangzhou.ingredients.find((ingredient) => ingredient.name === "kevätsipulia")!;
  assert.equal(springOnion.grams, 30);
  assert.equal(springOnion.giRecordId, null);
  assert.match(springOnion.massEvidence!, /15 g per raw spring onion/);
  const salt = yangzhou.ingredients.find((ingredient) => ingredient.name === "suolaa")!;
  assert.equal(salt.estimatedAvailableCarbohydratePerServingG, 0);
  assert.match(salt.negligibleAssumption!, /Fineli #30 records zero available carbohydrate/);
  const yangzhouResult = resultById.get(ids[2])!;
  assert.equal(yangzhouResult.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(yangzhouResult.glycemicLoadPerServing, null);
  assert.match(yangzhouResult.blockers.join(" "), /keitettyä kylmää riisiä/);
  assert.equal(nutritionById.get(ids[2])!.status, "ESTIMATE WITH EVIDENCE");
  assert.deepEqual(nutritionById.get(ids[2])!.values, {
    carbs_net_per_serving_g: 39.01, carbs_total_per_serving_g: 40.38,
    protein_per_serving_g: 21.18, fat_per_serving_g: 11.11,
  });
  assert.equal(coverage.currentSummary.recipeCount, 326);
  assert.equal(coverage.currentSummary.calculated, 83);
  assert.equal(coverage.currentSummary.incomplete, 243);
  assert.equal(coverageById.get(ids[0])!.previousApprovedGlycemicLoadPerServing, 18.23);
  assert.equal(coverageById.get(ids[0])!.glycemicLoadPerServing, null);
  assert.equal(coverageById.get(ids[1])!.previousApprovedGlycemicLoadPerServing, 50.57, "the older approved Koshari value remains a historical marker; current main is already incomplete");
  assert.equal(coverageById.get(ids[1])!.glycemicLoadPerServing, null);
  assert.equal(coverageById.get(ids[2])!.previousApprovedGlycemicLoadPerServing, 24.71);
  assert.equal(coverageById.get(ids[2])!.glycemicLoadPerServing, null);
  assert.equal(pilot.recipeBindingMismatches.length, 38);
  assert.deepEqual(pilot.calculationInputMismatches, []);
  assert.deepEqual(pilot.calculationEvidenceMismatches, []);
});
