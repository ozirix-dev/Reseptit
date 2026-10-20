import assert from "node:assert/strict";
import test from "node:test";
import { formatIngredientAmount, nextServingCount, scaleIngredient } from "../src/features/recipes/servings";

test("servings stop at one and increase in whole portions", () => {
  assert.equal(nextServingCount(1, -1), 1);
  assert.equal(nextServingCount(2, 1), 3);
});

test("ingredient amounts scale while amounts without numbers stay absent", () => {
  assert.equal(scaleIngredient({ amount: 200, unit: "g", item: "lohi" }, 6, 4).amount, 300);
  assert.equal(scaleIngredient({ amount: null, unit: "", item: "suolaa" }, 6, 4).amount, null);
});

test("amounts use the locale decimal separator and two decimals at most", () => {
  assert.equal(formatIngredientAmount(0.5, 1, 1, "fi-FI"), "0,5");
  assert.equal(formatIngredientAmount(1.333, 1, 1, "fi-FI"), "1,33");
});
