import path from "node:path";
import { nutritionCalculationFingerprint, resolveNutritionFieldApproval } from "../scripts/nutrition-field-approval";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import assert from "node:assert/strict";
import { calculate } from "../scripts/nutrition-model";
import { recipeNutritionInputHash, verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import { updateNutritionFrontmatter } from "../scripts/nutrition-markdown";
import type { Calculation, FoodRecord } from "../scripts/nutrition-model";

const food: FoodRecord = {
  id: "synthetic-source-record",
  name: "Synthetic food",
  sourceUrl: "https://example.org/food",
  retrievedAt: "2026-10-24",
  licence: "Synthetic test fixture",
  state: "raw",
  basis: "per100g-edible",
  carbohydrateDefinition: "EU_AVAILABLE",
  polyolsSourceVerified: true,
  polyolsEvidence: "Synthetic source explicitly reports zero polyols",
  per100g: { kcal: 120, protein: 12, fat: 6, carbohydrate: 10, fibre: 2, sugars: 3, polyols: 0 },
};
const recipe = {
  recipe_id: "synthetic-recipe",
  servings: 2,
  ingredients: [{ item: "synthetic food", amount: 200, unit: "g" }],
};
function evidence(): Calculation {
  return {
    recipeId: recipe.recipe_id,
    sourceHash: recipeNutritionInputHash(recipe),
    calculatedAt: "2026-10-24",
    servings: recipe.servings,
    scope: "synthetic fixture, all edible raw weight included",
    reviewerStatus: "AUTOMATED ONLY",
    carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE",
    ingredients: [{ ...recipe.ingredients[0], record: food, state: "raw", matchEvidence: "synthetic exact match", edibleFraction: 1, edibleEvidence: "synthetic fixture", retainedFraction: 1, retentionEvidence: "synthetic fixture" }],
  };
}
function published() {
  const result = calculate(evidence());
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
    carbs_net_per_serving_g: result.perServing.netCarbohydrate,
    carbs_total_per_serving_g: result.totalCarbohydratePerServingG,
    protein_per_serving_g: result.perServing.protein,
    fat_per_serving_g: result.perServing.fat,
  };
}

test("nutrition evidence must reproduce all four published values", () => {
  const result = verifyNutritionEvidence(published(), evidence());
  assert.equal(result.status, "ESTIMATE WITH EVIDENCE");
  assert.deepEqual(result.errors, []);
});

test("the archived aloo paratha source mismatch is withheld and cannot be reused", () => {
  const id = "intialainen-aloo-paratha";
  const markdown = readFileSync(new URL(`../../reseptit/aamupalat/${id}.md`, import.meta.url), "utf8");
  const historical = JSON.parse(readFileSync(new URL(`../../docs/nutrition/calculations/${id}.json`, import.meta.url), "utf8")) as Calculation;
  const source = recipeFrontmatterSchema.parse(parseMarkdown(markdown)?.data);

  const otherRecipe = { ...source, recipe_id: "other-potato-recipe" };
  const incorrect = verifyNutritionEvidence(otherRecipe, { ...historical, recipeId: otherRecipe.recipe_id });
  assert.equal(incorrect.status, "CONFLICT REQUIRES REVIEW");
  assert.equal(incorrect.calculated, null);
  assert.match(incorrect.errors.join(), /Fineli #310 identifies Jerusalem artichoke/);

  const archived = verifyNutritionEvidence(source, historical);
  assert.equal(archived.status, "INSUFFICIENT SOURCE DATA");
  assert.deepEqual(archived.errors, []);
  assert.deepEqual(Object.values(archived.values), [null, null, null, null]);
  assert.match(archived.withholdingReason!, /MAA-ARTISOKKA/);
  assert.equal(verifyNutritionEvidence(source, { ...historical, scope: "changed" }).status, "CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence(source, null).status, "CONFLICT REQUIRES REVIEW");

  const successorId = `${id}-punnittu-v2`;
  const successorMarkdown = readFileSync(new URL(`../../reseptit/aamupalat/${successorId}.md`, import.meta.url), "utf8");
  const successor = JSON.parse(readFileSync(new URL(`../../docs/nutrition/calculations/${successorId}.json`, import.meta.url), "utf8")) as Calculation;
  const successorSource = recipeFrontmatterSchema.parse(parseMarkdown(successorMarkdown)?.data);
  const current = verifyNutritionEvidence(successorSource, successor);
  assert.equal(current.status, "ESTIMATE WITH EVIDENCE");
  assert.equal(current.values.carbs_net_per_serving_g, 43.9);
  assert.equal(successor.ingredients.find(row => row.item === "kuorittua raakaa perunaa")?.record?.id, "fineli-205-release-20");
});

test("stale recipe ingredients and changed nutrition values are detected", () => {
  const staleSource = published();
  staleSource.ingredients[0]!.amount = 210;
  const stale = verifyNutritionEvidence(staleSource, evidence());
  assert.equal(stale.status, "CONFLICT REQUIRES REVIEW");
  assert.ok(stale.errors.some((error) => error.includes("changed after calculation")));

  const editedValue = published();
  editedValue.carbs_total_per_serving_g! += 0.01;
  const mismatch = verifyNutritionEvidence(editedValue, evidence());
  assert.equal(mismatch.status, "CONFLICT REQUIRES REVIEW");
  assert.ok(mismatch.errors.some((error) => error.includes("carbs_total_per_serving_g mismatch")));
});

test("published translations must carry the same four values", () => {
  const source = published();
  const translated = { ...source, protein_per_serving_g: source.protein_per_serving_g! + 0.01 };
  const result = verifyNutritionEvidence(source, evidence(), [{ path: "translation.md", data: translated }]);
  assert.equal(result.status, "CONFLICT REQUIRES REVIEW");
  assert.ok(result.errors.some((error) => error.includes("protein_per_serving_g differs")));
});

test("recipes with published values but no structured evidence are not verified", () => {
  const result = verifyNutritionEvidence(published(), null);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
});

test("nutrition metadata updates preserve recipe frontmatter and reject unrounded values", () => {
  const markdown = "---\ntitle: Test\nservings: 2\n---\n# Test\n\nBody.\n";
  const updated = updateNutritionFrontmatter(markdown, {
    carbs_net_per_serving_g: 1.2,
    carbs_total_per_serving_g: 2.34,
    protein_per_serving_g: 3,
    fat_per_serving_g: 4.56,
  });
  assert.match(updated, /^---\ntitle: Test\nservings: 2\ncarbs_net_per_serving_g: 1.2/m);
  assert.match(updated, /fat_per_serving_g: 4\.56\n\n---\n# Test/);
  assert.throws(() => updateNutritionFrontmatter(markdown, { carbs_net_per_serving_g: 1.234, carbs_total_per_serving_g: 2, protein_per_serving_g: 3, fat_per_serving_g: 4 }));
});

function withdrawnFixture(id: string) {
  const markdown = readFileSync(new URL(`../../reseptit/jalkiruoat/${id}.md`, import.meta.url), "utf8");
  const source = recipeFrontmatterSchema.parse(parseMarkdown(markdown)!.data);
  const calculation = JSON.parse(readFileSync(new URL(`../../docs/nutrition/calculations/${id}.json`, import.meta.url), "utf8")) as Calculation;
  return { source, calculation };
}

test("approved AFCD9837 packages retain evidence while withholding every public value", () => {
  for (const id of ["keto-suklaakeksit", "keto-mutakakku"]) {
    const { source, calculation } = withdrawnFixture(id);
    const result = verifyNutritionEvidence(source, calculation);
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.deepEqual(result.errors, []);
    assert.equal(result.calculated, null);
    assert.ok(Object.values(result.values).every(value => value === null));
  }
});

test("withdrawal cannot restore values or accept changed inputs, evidence, or translations", () => {
  const { source, calculation } = withdrawnFixture("keto-suklaakeksit");
  for (const changed of [
    { ...source, protein_per_serving_g: 4.77 },
    { ...source, servings: source.servings + 1 },
  ]) assert.equal(verifyNutritionEvidence(changed, calculation).status, "CONFLICT REQUIRES REVIEW");
  const edited = structuredClone(calculation);
  edited.ingredients[0]!.record!.per100g.fat! += 0.01;
  assert.equal(verifyNutritionEvidence(source, edited).status, "CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence(source, null).status, "CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence(source, calculation, [{ path: "translation.md", data: { ...source, fat_per_serving_g: 20.03 } }]).status, "CONFLICT REQUIRES REVIEW");
});

test("unlisted recipes do not acquire an evidence-withdrawal exception", () => {
  const cleared = { ...recipe, carbs_net_per_serving_g: null, carbs_total_per_serving_g: null, protein_per_serving_g: null, fat_per_serving_g: null };
  assert.ok(verifyNutritionEvidence(cleared, evidence()).errors.length > 0);
});

function incompleteWithholdingFixture() {
  const e = evidence();
  e.publicationStatus = "WITHHELD_SOURCE_INCOMPLETE";
  e.withholdingReason = "Source aggregate polyols remain unknown; withhold all macros.";
  e.ingredients[0]!.record = structuredClone(food);
  e.ingredients[0]!.record!.per100g.polyols = null;
  e.ingredients[0]!.record!.polyolsSourceVerified = false;
  return {source: {...recipe, carbs_net_per_serving_g:null, carbs_total_per_serving_g:null, protein_per_serving_g:null, fat_per_serving_g:null}, e};
}

test("explicit incomplete-source evidence can withhold all macros without publishing partial results", () => {
  const {source,e} = incompleteWithholdingFixture();
  const result = verifyNutritionEvidence(source,e);
  assert.equal(result.status,"INSUFFICIENT SOURCE DATA");
  assert.deepEqual(result.errors,[]);
  assert.equal(e.ingredients[0]!.record!.per100g.polyols,null);
  assert.equal(result.calculated!.status,"INSUFFICIENT SOURCE DATA");
  assert.ok(Object.values(result.values).every(value=>value===null));
});

test("incomplete-source declaration cannot accept stale inputs, translated values or partial publication", () => {
  const {source,e}=incompleteWithholdingFixture();
  assert.equal(verifyNutritionEvidence({...source,servings:3},e).status,"CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence({...source,protein_per_serving_g:12},e).status,"CONFLICT REQUIRES REVIEW");
  const changed=structuredClone(source);changed.ingredients[0]!.amount=201;
  assert.equal(verifyNutritionEvidence(changed,e).status,"CONFLICT REQUIRES REVIEW");
  assert.equal(verifyNutritionEvidence(source,e,[{path:"translation.md",data:{...source,fat_per_serving_g:6}}]).status,"CONFLICT REQUIRES REVIEW");
  e.withholdingReason="";
  assert.equal(verifyNutritionEvidence(source,e).status,"CONFLICT REQUIRES REVIEW");
});

test("complete calculations cannot masquerade as incomplete-source withholding",()=>{
  const e=evidence();e.publicationStatus="WITHHELD_SOURCE_INCOMPLETE";e.withholdingReason="Claimed incomplete";
  const {source}=incompleteWithholdingFixture();
  assert.equal(verifyNutritionEvidence(source,e).status,"CONFLICT REQUIRES REVIEW");
});

test("partial net carbohydrate can use the exact AFCD native field", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const input = evidence();
  input.publicationStatus = "WITHHELD_SOURCE_INCOMPLETE";
  input.withholdingReason = "Synthetic fixture using an AFCD carbohydrate row";
  const record = {
    ...food,
    id: "afcd-F002963",
    sourceUrl: "https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/search/food/F002963",
    polyolsSourceVerified: false,
    per100g: { ...food.per100g, carbohydrate: 27.5, polyols: null },
  };
  input.ingredients[0]!.record = record;
  const approve = () => resolveNutritionFieldApproval(root, input, {
    evidenceSha256: nutritionCalculationFingerprint(input), fields: ["carbs_net_per_serving_g"],
  });
  const result = verifyNutritionEvidence({ ...recipe, carbs_net_per_serving_g: 27.5 }, input, [], await approve());
  assert.equal(result.status, "PARTIAL ESTIMATE WITH EVIDENCE");
  assert.equal(result.fieldEstimates?.carbs_total_per_serving_g, null);

  record.per100g.carbohydrate = 27.6;
  const mismatched = verifyNutritionEvidence({ ...recipe, carbs_net_per_serving_g: 27.6 }, input, [], await approve());
  assert.match(mismatched.errors.join(), /recalculated=null/);
});

test("partial nutrition rejects unknown totals, unproved labels and unbounded omissions", () => {
  const full = evidence();
  const incomplete = (record: FoodRecord): Calculation => ({
    ...full,
    publicationStatus: "WITHHELD_SOURCE_INCOMPLETE",
    withholdingReason: "Synthetic incomplete source",
    ingredients: [{ ...full.ingredients[0]!, record }],
  });
  const approval = (input: Calculation, ...fields: string[]) => ({
    scope: { evidenceSha256: nutritionCalculationFingerprint(input), fields },
    verifiedAvailableRows: new Set<number>(),
  });
  const productLabel = incomplete({
    ...food,
    polyolsSourceVerified: false,
    per100g: { ...food.per100g, polyols: null },
  });
  assert.equal(verifyNutritionEvidence({ ...recipe, protein_per_serving_g: 12 }, productLabel, [],
    approval(productLabel, "protein_per_serving_g")).status, "PARTIAL ESTIMATE WITH EVIDENCE");

  for (const definition of ["EU_AVAILABLE", "EU_TOTAL_INCLUDING_POLYOLS", "US_TOTAL_INCLUDING_FIBRE"] as const) {
    const input = incomplete({ ...productLabel.ingredients[0]!.record!, carbohydrateDefinition: definition });
    assert.match(verifyNutritionEvidence({ ...recipe, carbs_net_per_serving_g: 10 }, input, [],
      approval(input, "carbs_net_per_serving_g")).errors.join(), /recalculated=null/);
  }

  const unverifiedPolyols = incomplete({ ...food, polyolsSourceVerified: false });
  assert.match(verifyNutritionEvidence({ ...recipe, carbs_total_per_serving_g: 12 }, unverifiedPolyols, [],
    approval(unverifiedPolyols, "carbs_total_per_serving_g")).errors.join(), /recalculated=null/);

  const onlyProteinMissing = incomplete({ ...food, per100g: { ...food.per100g, protein: null } });
  assert.equal(verifyNutritionEvidence({ ...recipe, carbs_total_per_serving_g: 12 }, onlyProteinMissing, [],
    approval(onlyProteinMissing, "carbs_total_per_serving_g")).status, "PARTIAL ESTIMATE WITH EVIDENCE");
  assert.match(verifyNutritionEvidence({ ...recipe, carbs_total_per_serving_g: 12 }, onlyProteinMissing, [],
    approval(onlyProteinMissing, "carbs_total_per_serving_g", "carbs_total_per_serving_g")).errors.join(), /approval is invalid/);

  const zeroFat = incomplete({ ...food, per100g: { ...food.per100g, protein: null, fat: 0 } });
  const approvedZero = approval(zeroFat, "fat_per_serving_g");
  assert.equal(verifyNutritionEvidence({ ...recipe, fat_per_serving_g: 0 }, zeroFat, [], approvedZero).status,
    "PARTIAL ESTIMATE WITH EVIDENCE");
  assert.match(verifyNutritionEvidence(recipe, zeroFat, [], approvedZero).errors.join(), /published=null, recalculated=0/);

  const extra = { item: "frying oil", amount: 20, unit: "g", state: "as sold", matchEvidence: "", excludedReason: "retention unknown" };
  const original = { ...recipe, ingredients: [...recipe.ingredients, extra] };
  const withOmission = {
    ...productLabel,
    sourceHash: recipeNutritionInputHash(original),
    ingredients: [...productLabel.ingredients, extra],
  };
  assert.match(verifyNutritionEvidence({ ...original, protein_per_serving_g: 12 }, withOmission, [],
    approval(withOmission, "protein_per_serving_g")).errors.join(), /bounded omissions/);
});
