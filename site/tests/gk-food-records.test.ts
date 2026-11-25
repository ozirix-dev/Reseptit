import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { canonicalGkFoodRecords } from "../scripts/gk-food-records";
import { calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadRecipeInput } from "../scripts/glycemic-load-model";
import { glycemicLoadEvidenceHash } from "../scripts/glycemic-load-recipe-binding";
import type { FoodRecord } from "../scripts/nutrition-model";
import { glycemicLoadPilotResults } from "../src/generated/glycemic-load-pilot.generated";

const root = path.resolve(import.meta.dirname, "../..");
const readJson = async <T>(file: string): Promise<T> => JSON.parse(await readFile(path.join(root, file), "utf8")) as T;
const lemonId = "fineli-11557-2026-10-24";
const legacyUrl = "https://fineli.fi/fineli/fi/elintarvikkeet/11557";
const canonicalUrl = "https://fineli.fi/fineli/api/v1/foods/11557?c=2034&c2=2168";

test("the historical lemon duplicate has one reviewed active record; other duplicates fail closed", async () => {
  const records = await readJson<FoodRecord[]>("docs/nutrition/food-records.json");
  const snapshot = JSON.stringify(records);
  const pair = records.filter(row => row.id === lemonId);
  assert.equal(pair.length, 2);
  const [legacy, current] = pair;
  assert.ok(legacy && current);
  assert.equal(legacy.sourceUrl, legacyUrl);
  assert.equal(current.sourceUrl, canonicalUrl);
  assert.deepEqual(legacy.componentValues, current.componentValues);
  const canonical = canonicalGkFoodRecords(records);
  assert.equal(canonical.length, records.length - 1);
  assert.equal(new Set(canonical.map(row => row.id)).size, canonical.length);
  // Exact object identity of every last-wins record is preserved, not merely CHO.
  assert.deepEqual(new Map(canonical.map(row => [row.id, row])),
    new Map(records.map(row => [row.id, row])));
  assert.equal(canonical.find(row => row.id === lemonId), current);
  assert.equal(JSON.stringify(records), snapshot, "the historical registry is not mutated");
  const other = { ...current, id: "unreviewed-duplicate" };
  assert.deepEqual(canonicalGkFoodRecords([other, current]), [other, current]);
  assert.throws(() => canonicalGkFoodRecords([other, other]), /Unreviewed duplicate GK food record/);
  assert.throws(() => canonicalGkFoodRecords([current, legacy]), /Unreviewed duplicate GK food record/);
  assert.throws(() => canonicalGkFoodRecords([legacy, { ...current, sourceUrl: legacyUrl }]), /Unreviewed duplicate GK food record/);
  assert.throws(() => canonicalGkFoodRecords([legacy, current, current]), /Unreviewed duplicate GK food record/);
});

test("canonical food selection preserves current GK evidence and original calculations", async () => {
  const [records, creamCheeseEvidence, gi, inputs, report] = await Promise.all([
    readJson<FoodRecord[]>("docs/nutrition/food-records.json"),
    readJson<{ ingredients: { record?: FoodRecord }[] }>("docs/nutrition/calculations/keto-joulutortut.json"),
    readJson<{ records: GlycemicIndexRecord[] }>("docs/nutrition/glycemic-index-records.json"),
    readJson<{ recipes: GlycemicLoadRecipeInput[] }>("docs/nutrition/glycemic-load-pilot-input.json"),
    readJson<{ calculationInputs: GlycemicLoadRecipeInput[]; calculationEvidenceHashes: Record<string, string> }>("tmp/nutrition/glycemic-load-pilot.json"),
  ]);
  const creamCheese = creamCheeseEvidence.ingredients.find(row => row.record?.id === "fineli-34764-release-20")?.record;
  assert.ok(creamCheese);
  const raw = [...records, creamCheese];
  const canonical = canonicalGkFoodRecords(raw);
  assert.deepEqual(new Map(canonical.map(row => [row.id, row])), new Map(raw.map(row => [row.id, row])));
  const affected = inputs.recipes.filter(recipe => recipe.ingredients.some(row => row.fineliRecordId === lemonId));
  assert.ok(affected.some(recipe => recipe.recipeId === "hummus"));
  assert.ok(affected.some(recipe => recipe.recipeId === "pannacotta-marjakastikkeella"));
  assert.ok(report.calculationInputs.length >= inputs.recipes.length);
  for (const input of inputs.recipes) {
    assert.deepEqual(calculateGlycemicLoad(input, canonical, gi.records),
      calculateGlycemicLoad(input, raw, gi.records), input.recipeId + ": complete original calculation");
  }
  for (const input of report.calculationInputs) {
    const oldHash = glycemicLoadEvidenceHash(input, raw, gi.records);
    assert.equal(glycemicLoadEvidenceHash(input, canonical, gi.records), oldHash, input.recipeId + ": evidence fingerprint");
    assert.equal(report.calculationEvidenceHashes[input.recipeId], oldHash, input.recipeId + ": actual pilot evidence");
  }
});

test("public citations for the two affected legacy recipes use the calculation's canonical Fineli source", () => {
  for (const id of ["hummus", "pannacotta-marjakastikkeella"]) {
    const result = glycemicLoadPilotResults.find(row => row.recipeId === id);
    assert.ok(result, id);
    assert.ok(result.carbohydrateSources.some(source => source.url === canonicalUrl &&
      source.title === "TÄYSMEHU, SITRUUNATÄYSMEHU, LAIMENTAMATON"), id + ": canonical calculation source");
    assert.ok(!result.carbohydrateSources.some(source => source.url === legacyUrl), id + ": no shadowed citation");
  }
});
