import {originalContentSourceBefore} from './original-content-transition';
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Historical GK80 snapshots predate the two P1 coconut-milk HOLD fixes (#282).
 * Do not change historical counters or rewrite snapshots. Only these exact two live result objects
 * may differ; every other historical result must retain its original hash.
 */
export const p1CoconutHoldHashes: Readonly<Record<string, string>> = {
  "kookos-lime-kanacurry": "ccb8e4cb3c23dfdee67128ce984a8adcd61fc6d5ed8c252ffaee18092441eee9",
  "sate-ayam": "fca734aa79a7a47409fc0d1d444c24f9495805f64be99cacf854fef7fbab8659",
};

export const isP1CoconutHold = (recipeId: string): boolean =>
  Object.hasOwn(p1CoconutHoldHashes, recipeId);

export function assertP1CoconutHold(result: {
  recipeId: string; status: string; glycemicLoadPerServing: number | null; blockers: string[];
}): void {
  const expected = p1CoconutHoldHashes[result.recipeId];
  assert.ok(expected, `unexpected P1 recipe: ${result.recipeId}`);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA", result.recipeId);
  assert.equal(result.glycemicLoadPerServing, null, result.recipeId);
  assert.ok(result.blockers.some((reason) => reason.includes("coconut milk was incorrectly linked")), result.recipeId);
  const actual = createHash("sha256").update(JSON.stringify(result)).digest("hex");
  assert.equal(actual, expected, `${result.recipeId}: exactly the reviewed P1 HOLD result`);
}

/**
 * Assert that #282 changed exactly one coconut ingredient in each of two
 * previously HOLD recipes, preserving the other 324 inputs byte-for-byte in
 * JSON semantics and every other ingredient in the two selected recipes.
 * Historical baseline commit is the last main HEAD before #282 was merged.
 */
export function assertOnlyP1CoconutInputChanges(root: string): void {
  const relative = "docs/nutrition/glycemic-load-pilot-input.json";
  const old = JSON.parse(execFileSync("git", [
    "show", "081ba2c95f9243c1ed72206073160f9e64992e96:" + relative
  ], { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }));
  const current = JSON.parse(originalContentSourceBefore(relative, readFileSync(path.join(root, relative), "utf8")));
  assert.equal(old.recipes.length, 326);
  assert.equal(current.recipes.length, 326);
  const expectedNames: Record<string, [string, number]> = {
    "kookos-lime-kanacurry": ["täysrasvaista kookosmaitoa", 400],
    "sate-ayam": ["kookosmaitoa", 200],
  };
  const changed: string[] = [];
  for (let i = 0; i < old.recipes.length; i++) {
    const a = old.recipes[i], b = current.recipes[i];
    assert.equal(a.recipeId, b.recipeId, `recipe index ${i}`);
    if (JSON.stringify(a) === JSON.stringify(b)) continue;
    const evidence = expectedNames[a.recipeId];
    assert.ok(evidence, `${a.recipeId}: unrelated recipe input changed`);
    changed.push(a.recipeId);
    const aWithoutIngredients = { ...a, ingredients: undefined };
    const bWithoutIngredients = { ...b, ingredients: undefined };
    assert.deepEqual(bWithoutIngredients, aWithoutIngredients, a.recipeId);
    assert.equal(a.ingredients.length, b.ingredients.length);
    const changedIngredientIndices: number[] = [];
    for (let j = 0; j < a.ingredients.length; j++) {
      if (JSON.stringify(a.ingredients[j]) !== JSON.stringify(b.ingredients[j])) changedIngredientIndices.push(j);
    }
    assert.equal(changedIngredientIndices.length, 1, a.recipeId);
    const ingredient = b.ingredients[changedIngredientIndices[0]];
    assert.equal(ingredient.name, evidence[0]);
    assert.equal(ingredient.grams, null);
    assert.equal(ingredient.fineliRecordId, null);
    assert.equal(ingredient.giRecordId, null);
    assert.equal(ingredient.foodKey, null);
    assert.equal(ingredient.preparationKey, null);
    assert.deepEqual(ingredient.recipeQuantity, { amount: evidence[1], unit: "ml", massGrams: null });
    assert.match(ingredient.excludedReason ?? "", /HOLD:.*coconut milk.*cow's milk/i);
    assert.equal(ingredient.estimatedAvailableCarbohydratePerServingG, undefined);
  }
  assert.deepEqual(changed.sort(), Object.keys(expectedNames).sort());
}
