import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import {
  calculate, allowedOmissionErrorPerServing,
  type Calculation, type FoodRecord, type IngredientInput,
} from "../scripts/nutrition-model";
import { recipeNutritionInputHash, verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import { recipeBindingHash } from "../scripts/glycemic-load-recipe-binding";

// Chat 6, 22 Nov 2026: an isolated source-feasibility experiment, NOT
// a release/approval, a rewritten GK input, or new public nutrition values.
const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const json = (path: string) => JSON.parse(read(path));
const recipeId = "sitruuna-yrttikana-parsa";
const recipePath = `reseptit/paaruoat/${recipeId}.md`;
const sourceText = read(recipePath);
const source = recipeFrontmatterSchema.parse(parseMarkdown(sourceText)!.data);
const old = json(`docs/nutrition/calculations/${recipeId}.json`) as Calculation;
const thyme = (json("docs/nutrition/calculations/lahi-ita-zaatar-munat.json") as Calculation).ingredients
  .find(row => row.item === "kuivattua jauhettua timjamia")?.record;
const pepper = (json("docs/nutrition/food-records.json") as FoodRecord[])
  .find(row => row.id === "afcd-F006618-2026-10-24");
const afcd = json("docs/nutrition/afcd-release-3-reference.json").foods as Array<Record<string, unknown>>;
const salt = afcd.find(row => row.source_id === "F007879");
const usda = json("docs/nutrition/gk80-operation142/usda-cap-excerpts.json") as Record<string, {
  totalCarbohydrate: {amount: string};
}>;
type UsdaNutrient = { amount: string };
type UsdaSnapshot = { fdc_id: string; nutrients: Record<string, UsdaNutrient> };
const garlicSnapshot = (old.ingredients[6]!.record as FoodRecord & {primarySource?: UsdaSnapshot}).primarySource!;
const lemonSnapshot = (json("docs/nutrition/gk80-operation142/integration.json") as {
  extraUsdaSources: UsdaSnapshot[];
}).extraUsdaSources.find(row => row.fdc_id === "167749")!;
const sourceNumber = (snapshot: UsdaSnapshot, nutrientId: string): number => {
  const raw = snapshot.nutrients[nutrientId]?.amount;
  assert.ok(raw !== undefined && raw.trim() !== "", `Missing USDA ${snapshot.fdc_id} nutrient ${nutrientId}`);
  const amount = Number(raw);
  assert.ok(Number.isFinite(amount) && amount >= 0, `Invalid USDA ${snapshot.fdc_id} nutrient ${nutrientId}`);
  return amount;
};
// USDA SR27, NDB 02020, "Spices, garlic powder", proximate Energy 331 kcal/100 g.
// The original repon garlic snapshot has nutrient IDs 1003/1004/1005, but no
// energy row. Keep the energy citation explicit rather than inventing a record.
// https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR27/reports/sr27fg02.pdf
const garlicEnergyKcalPer100g = 331;
const checks = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;

type Omission = NonNullable<IngredientInput["omissionImpactUpperBoundPerServing"]>;
const fromProfile = (grams: number, per100g: {carbohydrate: number; protein: number; fat: number; kcal: number}): Omission => {
  const portion = grams / 4 / 100;
  const carbohydrate = per100g.carbohydrate * portion;
  return { kcal: per100g.kcal * portion, netCarbohydrate: carbohydrate,
    totalCarbohydrate: carbohydrate, protein: per100g.protein * portion, fat: per100g.fat * portion };
};
const omittedGarlic = fromProfile(old.ingredients[6]!.amount!, {
  carbohydrate: sourceNumber(garlicSnapshot, "1005"),
  protein: sourceNumber(garlicSnapshot, "1003"),
  fat: sourceNumber(garlicSnapshot, "1004"),
  kcal: garlicEnergyKcalPer100g,
});
const omittedZest = fromProfile(old.ingredients[8]!.amount!, {
  carbohydrate: sourceNumber(lemonSnapshot, "1005"),
  protein: sourceNumber(lemonSnapshot, "1003"),
  fat: sourceNumber(lemonSnapshot, "1004"),
  kcal: sourceNumber(lemonSnapshot, "1008"),
});
const noMacros: Omission = {kcal: 0, netCarbohydrate: 0, totalCarbohydrate: 0, protein: 0, fat: 0};

function exclude(row: IngredientInput, why: string, impact: Omission, sourceEvidence: string): IngredientInput {
  return { ...row, record: undefined, excludedReason: why, omissionImpactUpperBoundPerServing: impact,
    omissionImpactEvidence: sourceEvidence };
}

function makeCandidate(): Calculation {
  assert.ok(thyme && pepper && salt);
  const candidate = structuredClone(old);
  candidate.scope = "Chat-6 CONDITIONAL SOURCE FEASIBILITY ONLY. Not approved for public macros. Original ingredient weights, four servings and GK binding remain unchanged. Two small inputs modeled as omitted and plain salt assumed; each condition requires independent review.";
  const tim = candidate.ingredients[5]!;
  tim.record = structuredClone(thyme);
  tim.state = thyme.state;
  tim.matchEvidence = "Exact dried ground thyme, AFCD F009160, same source already used in the published zaatar eggs recipe; borrowed composition and inferred source-model polyol difference disclosed.";
  const pep = candidate.ingredients[7]!;
  pep.record = structuredClone(pepper);
  pep.state = pepper.state;
  pep.matchEvidence = "Ground black pepper, AFCD F006618; source-model with/without sugar-alcohol carbohydrate fields match, but individual alcohols are unreported.";
  candidate.ingredients[6] = exclude(candidate.ingredients[6]!, "Conditional whole-ingredient omission: 3.1 g garlic powder, not a polyol-zero inference.", omittedGarlic,
    "USDA FDC 171325 SR Legacy nominal profile: total CHO 72.73, protein 16.55, fat 0.73 g and 331 kcal per 100g. Scaled as nominal composition, NOT a tested lot-specific upper bound.");
  candidate.ingredients[8] = exclude(candidate.ingredients[8]!, "Conditional whole-ingredient omission: 2 g grated outer zest, not claimed equivalent to whole peel.", omittedZest,
    "USDA FDC 167749 SR Legacy raw peel nominal profile: total CHO 16, protein 1.5, fat 0.3 g and 47 kcal per 100g. This is a proxy, NOT validated zest composition.");
  // The original sealed evidence already recognizes pure table salt as a
  // zero-macro exclusion. Keep that reviewed choice byte-for-byte, and
  // independently corroborate it with AFCD F007879 in the source test.
  assert.equal(candidate.ingredients[9]!.excludedReason, "Pure salt; no macro contribution");
  assert.deepEqual(candidate.ingredients[9]!.omissionImpactUpperBoundPerServing, noMacros);
  // The real recipe has a formally withheld four-macro package. This synthetic
  // calculation must not claim to be that approved/published evidence.
  delete candidate.publicationStatus;
  delete candidate.withholdingReason;
  return candidate;
}

test("baseline retains all four macro nulls and the sealed original GK", () => {
  assert.equal(old.sourceHash, recipeNutritionInputHash(source));
  assert.equal(old.publicationStatus, "WITHHELD_SOURCE_INCOMPLETE");
  assert.equal(calculate(old).status, "INSUFFICIENT SOURCE DATA");
  assert.equal(verifyNutritionEvidence(source, old).status, "INSUFFICIENT SOURCE DATA");
  for (const key of checks) assert.equal(source[key], null);
  for (const language of ["en", "sv", "th"]) {
    const translated = recipeFrontmatterSchema.parse(parseMarkdown(read(`kaannokset/${language}/paaruoat/${recipeId}.md`))!.data);
    for (const key of checks) assert.equal(translated[key], null, `${language}:${key}`);
  }
  const bindings = json("docs/nutrition/glycemic-load-recipe-bindings.json");
  const aliases = json("docs/nutrition/glycemic-load-recipe-aliases.json").aliases;
  assert.equal(recipeBindingHash(sourceText, aliases), bindings.recipes[recipeId]);
  const historical = json("docs/nutrition/gk80-operation142/targeted-results.json").checked
    .find((row: {recipeId: string}) => row.recipeId === recipeId);
  assert.equal(historical.gk, 0.88);
  assert.equal(historical.omittedCho, 0.826245);
});

test("AFCD evidence is source-model derived, not a measurement of individual polyol zero", () => {
  assert.ok(thyme && pepper && salt);
  const th = afcd.find(row => row.source_id === "F009160")!;
  const pe = afcd.find(row => row.source_id === "F006618")!;
  for (const row of [th, pe]) {
    assert.equal(row.derivation, "Borrowed");
    assert.equal(row.available_carbohydrate_with_sugar_alcohols_g_per_100g,
      row.available_carbohydrate_without_sugar_alcohols_g_per_100g);
    assert.equal(row.sorbitol_g_per_100g, null);
    assert.equal(row.mannitol_g_per_100g, null);
    assert.equal(row.glycerol_g_per_100g, null);
  }
  assert.equal(thyme.polyolsSourceVerified, true);
  assert.equal(pepper.polyolsSourceVerified, true);
  assert.equal(salt.derivation, "Analysed");
  for (const k of ["protein_g_per_100g", "fat_g_per_100g", "fibre_g_per_100g",
    "available_carbohydrate_with_sugar_alcohols_g_per_100g"] as const) assert.equal(salt[k], 0, k);
  assert.equal(garlicSnapshot.fdc_id, "171325");
  assert.equal(lemonSnapshot.fdc_id, "167749");
  assert.equal(sourceNumber(garlicSnapshot, "1005"), 72.73);
  assert.equal(sourceNumber(garlicSnapshot, "1003"), 16.55);
  assert.equal(sourceNumber(garlicSnapshot, "1004"), 0.73);
  assert.equal(garlicEnergyKcalPer100g, 331);
  assert.equal(sourceNumber(lemonSnapshot, "1005"), 16);
  assert.equal(sourceNumber(lemonSnapshot, "1003"), 1.5);
  assert.equal(sourceNumber(lemonSnapshot, "1004"), 0.3);
  assert.equal(sourceNumber(lemonSnapshot, "1008"), 47);
  // Independently cross-check the carbohydrate field against the separate
  // historical USDA extraction; never treat a missing value as zero.
  assert.equal(Number(usda["171325"]?.totalCarbohydrate.amount), sourceNumber(garlicSnapshot, "1005"));
  assert.equal(Number(usda["167749"]?.totalCarbohydrate.amount), sourceNumber(lemonSnapshot, "1005"));
});

test("conditional calculation is numerically feasible, but has no publication authority", () => {
  const candidate = makeCandidate();
  const calculation = calculate(candidate);
  assert.equal(calculation.status, "ESTIMATE WITH EVIDENCE");
  assert.equal(calculation.omissionWithinTolerance, true);
  const total = Object.fromEntries((Object.keys(noMacros) as Array<keyof Omission>).map(key =>
    [key, (omittedGarlic[key] + omittedZest[key])]));
  assert.ok(Math.abs(total.totalCarbohydrate - 0.6436575) < 1e-10);
  assert.ok(Math.abs(total.protein - 0.1357625) < 1e-10);
  assert.ok(Math.abs(total.fat - 0.0071575) < 1e-10);
  assert.ok(Math.abs(total.kcal - 2.80025) < 1e-10);
  for (const key of Object.keys(total) as Array<keyof Omission>)
    assert.ok(total[key] <= allowedOmissionErrorPerServing[key], key);
  assert.equal(calculation.perServing.netCarbohydrate, 2.36);
  assert.equal(calculation.totalCarbohydratePerServingG, 4.29);
  assert.equal(calculation.perServing.protein, 36.73);
  assert.equal(calculation.perServing.fat, 16.60);

  // Even if numerical calculation succeeds, publication is blocked by the
  // existing four-null source, required review, and explicit withholding gate.
  assert.equal(verifyNutritionEvidence(source, candidate).status, "INSUFFICIENT SOURCE DATA");
  const fakeWithholding = {...candidate, publicationStatus: "WITHHELD_SOURCE_INCOMPLETE" as const,
    withholdingReason: "Original source is still incomplete"};
  assert.equal(verifyNutritionEvidence(source, fakeWithholding).status, "CONFLICT REQUIRES REVIEW");
});

// Independent fallback when only weighed ingredient mass, not an accepted
// composition upper bound, is established. One nutrient cannot exceed the
// entire weighed mass; 9 kcal/g is an illustrative Atwater fat-energy ceiling.
// This does NOT validate that the omitted material is pure fat or pure CHO.
function fromMassOnly(row: IngredientInput): Omission {
  assert.equal(row.unit, "g");
  assert.ok(row.amount !== null && Number.isFinite(row.amount) && row.amount >= 0);
  assert.equal(old.servings, source.servings);
  const gramsPerServing = row.amount / old.servings;
  return {
    kcal: gramsPerServing * 9,
    netCarbohydrate: gramsPerServing,
    totalCarbohydrate: gramsPerServing,
    protein: gramsPerServing,
    fat: gramsPerServing,
  };
}

test("source-independent mass bounds do NOT justify macro publication", () => {
  const candidate = makeCandidate();
  const garlicMassBound = fromMassOnly(old.ingredients[6]!);
  const zestMassBound = fromMassOnly(old.ingredients[8]!);
  const massOnlyTotal = Object.fromEntries((Object.keys(noMacros) as Array<keyof Omission>)
    .map(key => [key, garlicMassBound[key] + zestMassBound[key]])) as Omission;

  // 3.1 g garlic powder + 2 g outer zest, across four servings.
  assert.equal(old.servings, 4);
  assert.equal(old.ingredients[6]!.amount, 3.1);
  assert.equal(old.ingredients[8]!.amount, 2);
  assert.equal(massOnlyTotal.totalCarbohydrate, 1.275);
  assert.equal(massOnlyTotal.netCarbohydrate, 1.275);
  assert.equal(massOnlyTotal.protein, 1.275);
  assert.equal(massOnlyTotal.fat, 1.275);
  assert.ok(Math.abs(massOnlyTotal.kcal - 11.475) < 1e-10);
  assert.ok(massOnlyTotal.totalCarbohydrate > allowedOmissionErrorPerServing.totalCarbohydrate);
  assert.ok(massOnlyTotal.kcal > allowedOmissionErrorPerServing.kcal);

  candidate.ingredients[6]!.omissionImpactUpperBoundPerServing = garlicMassBound;
  candidate.ingredients[8]!.omissionImpactUpperBoundPerServing = zestMassBound;
  candidate.ingredients[6]!.omissionImpactEvidence =
    "SOURCE-INDEPENDENT STRESS TEST ONLY: whole weighed ingredient mass, not product-specific composition";
  candidate.ingredients[8]!.omissionImpactEvidence =
    "SOURCE-INDEPENDENT STRESS TEST ONLY: whole weighed ingredient mass, not product-specific composition";
  const result = calculate(candidate);
  assert.deepEqual(result.omissionImpactUpperBoundPerServing, massOnlyTotal);
  assert.equal(result.omissionWithinTolerance, false);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");

  // No amount of arithmetic can convert unapproved mass-only bounds into
  // permission to lift the existing four-null public nutrition withholding.
  assert.equal(verifyNutritionEvidence(source, candidate).status, "INSUFFICIENT SOURCE DATA");
  assert.equal(old.publicationStatus, "WITHHELD_SOURCE_INCOMPLETE");
});

test("conditional gate fails closed for ambiguous salt, AFCD evidence loss and excess omissions", () => {
  const noSaltDecision = makeCandidate();
  // The original, pinned evidence ALREADY excludes pure salt as zero macro.
  // A missing amount is safe only with that explicit, sourced exclusion.
  assert.equal(old.ingredients[9]!.excludedReason, "Pure salt; no macro contribution");
  const unresolvedSalt = structuredClone(old.ingredients[9]!);
  delete unresolvedSalt.excludedReason;
  delete unresolvedSalt.omissionImpactUpperBoundPerServing;
  delete unresolvedSalt.omissionImpactEvidence;
  noSaltDecision.ingredients[9] = unresolvedSalt;
  assert.equal(calculate(noSaltDecision).status, "INSUFFICIENT SOURCE DATA");
  const noPolyolEvidence = makeCandidate();
  noPolyolEvidence.ingredients[7]!.record!.polyolsSourceVerified = false;
  noPolyolEvidence.ingredients[7]!.record!.polyolsEvidence = "";
  assert.equal(calculate(noPolyolEvidence).status, "INSUFFICIENT SOURCE DATA");
  const excessive = makeCandidate();
  excessive.ingredients[6]!.omissionImpactUpperBoundPerServing!.totalCarbohydrate = 1.05;
  assert.equal(calculate(excessive).status, "INSUFFICIENT SOURCE DATA");
});
