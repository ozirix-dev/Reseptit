import {readFileSync} from 'node:fs';
import {manakishStudyBinding} from '../src/features/recipes/gk-estimate-scope';
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { GkOnlyVariantPanel } from "../src/features/recipes/GkOnlyVariantPanel";
import { countGkVersions, type GkOnlyVariant } from "../src/features/recipes/gk-only-types";
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { calculateGkScenarios } from "../scripts/gk-estimated-range";
import { bindaetteokProposal } from "../scripts/gk80-bindaetteok-scenarios";
import { gkEstimate, gkEstimateClass, countPublishedGkEstimates } from "../src/features/recipes/gk-estimate";

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
    point: null, scenarioRange: { min: 8.04, max: 12.23 }, rangeKind: "NAMED_COMPARATOR_SCENARIOS",
    omittedCho: 0, confidence: "LOW", macroScope: "NO_MACRO_PACKAGE_FOR_THIS_VERSION",
    ingredients: [], preparation: { fi: "Valmistus", en: "Preparation", sv: "Tillagning", th: "วิธีปรุง" },
    codingKinds: [], sensitivity: null, sources: [],
  };
  const markup = renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(GkOnlyVariantPanel, { variant, locale: "fi", compact: true })));
  assert.match(markup, /8–12,3/);
  assert.match(markup, /annos/);
  const coverage=countGkVersions([
    {recipeId:'point',status:'CALCULATED'},
    {recipeId:'range',status:'INSUFFICIENT SOURCE DATA'},
    {recipeId:'missing',status:'INSUFFICIENT SOURCE DATA'},
  ],[variant]);
  assert.equal(coverage.numericRecipes,2);
  assert.equal(coverage.missing,1);
});

test('home estimate counts never let a study comparison overwrite an original or home version',()=>{
 const original=[{recipeId:'original',status:'CALCULATED',glycemicLoadPerServing:7},{recipeId:'version',status:'INSUFFICIENT SOURCE DATA',glycemicLoadPerServing:null}];
 const home={versionId:'fixture',inputSha256:'fixture',recipeId:'version',point:null,scenarioRange:{min:8,max:12}};
 const study={versionId:'fixture-study',inputSha256:'fixture-study',recipeId:'original',point:null,scenarioRange:{min:20,max:30},studyServing:true as const};
 assert.deepEqual(countPublishedGkEstimates(original,[home,study]),{exact:1,range:1,missing:0,total:2,studyComparisons:1});
 assert.throws(()=>countPublishedGkEstimates(original,[home,home]),/Duplicate/);
 assert.throws(()=>countPublishedGkEstimates(original,[{...home,recipeId:'other'}]),/Unknown/);
 assert.throws(()=>calculateGkScenarios(1,['bean'],[scenarios[0],scenarios[0]]),/unique/);
 assert.throws(()=>calculateGkScenarios(1,['bean'],[{...scenarios[0],ingredients:[{...food,grams:1,availableChoPer100g:101,gi:60}]}]),/Invalid/);
});

test('real approved corpus counts eight studies including sealed manakish without changing its packet',()=>{
 const report=JSON.parse(readFileSync(new URL('../../tmp/nutrition/glycemic-load-pilot.json',import.meta.url),'utf8'));
 const before=JSON.stringify(report.gkOnlyVariants);
 const manakish=report.gkOnlyVariants.find((v:any)=>v.recipeId===manakishStudyBinding.recipeId);
 assert.equal(manakish.studyServing,undefined);
 const counts=countPublishedGkEstimates(report.results,report.gkOnlyVariants);
 assert.equal(counts.studyComparisons,8);
 assert.equal(counts.studyComparisons,report.versionCoverage.studyServingRecipeIds.length);
 assert.equal(counts.exact+counts.range,235);
 assert.equal(counts.total,report.results.length);
 assert.equal(counts.missing,counts.total-counts.exact-counts.range);
 assert.equal(counts.missing,102); // Five newly published classics are explicitly GK-incomplete.
 assert.equal(JSON.stringify(report.gkOnlyVariants),before);
 const changed=structuredClone(report.gkOnlyVariants);
 changed.find((v:any)=>v.recipeId===manakishStudyBinding.recipeId).inputSha256='changed';
 assert.throws(()=>countPublishedGkEstimates(report.results,changed),/GK_SCOPE_REVIEW_REQUIRED/);
});
