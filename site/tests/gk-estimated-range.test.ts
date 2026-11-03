import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { GkOnlyVariantPanel } from "../src/features/recipes/GkOnlyVariantPanel";
import { countPublishedGkEstimates, type GkOnlyVariant } from "../src/features/recipes/gk-only-types";
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { calculateGkScenarios } from "../scripts/gk-estimated-range";
import { bindaetteokProposal } from "../scripts/gk80-bindaetteok-scenarios";
import { gkEstimate, gkEstimateClass } from "../src/features/recipes/gk-estimate";

const food = { id: "bean", choSource: "CHO table", giSource: "GI study", applicability: "Matched comparator" };
const scenarios = [
  { id: "cooked", rationale: "Heavier cooked portion", ingredients: [{ ...food, grams: 200, availableChoPer100g: 10, gi: 60 }] },
  { id: "dry", rationale: "Dry basis", ingredients: [{ ...food, grams: 50, availableChoPer100g: 50, gi: 40 }] },
];

test("whole scenario extrema preserve paired quantities and divide by servings", () => {
  assert.deepEqual(calculateGkScenarios(1, ["bean"], scenarios).estimate, gkEstimate(null, { min: 10, max: 12 }));
  assert.deepEqual(calculateGkScenarios(2, ["bean"], scenarios).estimate, gkEstimate(null, { min: 5, max: 6 }));
  assert.throws(() => calculateGkScenarios(2, ["bean", "sauce"], scenarios), /Incomplete/);
  assert.throws(() => calculateGkScenarios(0, ["bean"], scenarios), /Invalid/);
});

test("classification uses both endpoints and still supports existing point values", () => {
  assert.equal(gkEstimateClass(gkEstimate(7.4)), "LOW");
  assert.equal(gkEstimateClass(gkEstimate(null, { min: 5, max: 10 })), "LOW");
  assert.equal(gkEstimateClass(gkEstimate(7.4, { min: 5, max: 11 })), "CROSSES_BOUNDARY");
  assert.equal(gkEstimateClass(gkEstimate(null, { min: 12, max: 5 })), null);
  assert.equal(gkEstimateClass(gkEstimate(null)), null);
});

test("bindaetteok comparators reproduce the reviewed calculation", () => {
  const { estimate } = bindaetteokProposal;
  assert.equal(estimate.type, "ESTIMATED_RANGE");
  if (estimate.type !== "ESTIMATED_RANGE") throw new Error("Expected range");
  assert.equal(estimate.range.min.toFixed(5), "11.99884");
  assert.equal(estimate.range.max.toFixed(5), "18.22414");
});

test("approved range display and coverage preserve the existing version contract", () => {
  const variant: GkOnlyVariant = {
    recipeId: "range", versionId: "reviewed", inputSha256: "fixture", level: "B", servings: 2,
    point: null, scenarioRange: { min: 8.04, max: 12.23 }, rangeKind: "ESTIMATED_RANGE",
    omittedCho: 0, confidence: "LOW", macroScope: "NO_MACRO_PACKAGE_FOR_THIS_VERSION",
    ingredients: [], preparation: { fi: "Valmistus", en: "Preparation", sv: "Tillagning", th: "วิธีปรุง" },
    codingKinds: [], sensitivity: null, sources: [],
  };
  const markup = renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(GkOnlyVariantPanel, { variant, locale: "fi", compact: true })));
  assert.match(markup, /8–12,3 \/ annos · arvio/);
  assert.match(markup, /Luokkarajan ylittävä arvio/);
  assert.deepEqual(countPublishedGkEstimates([
    { recipeId: "point", status: "CALCULATED", glycemicLoadPerServing: 7.4 },
    { recipeId: "range", status: "INSUFFICIENT SOURCE DATA", glycemicLoadPerServing: null },
    { recipeId: "missing", status: "INSUFFICIENT SOURCE DATA", glycemicLoadPerServing: null },
  ], [variant]), { exact: 1, range: 1, missing: 1, total: 3 });
});
