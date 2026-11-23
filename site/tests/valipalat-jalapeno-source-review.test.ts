import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { calculateGlycemicLoad } from "../scripts/glycemic-load-model";
import { recipeNutritionInputHash, verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import type { Calculation, FoodRecord } from "../scripts/nutrition-model";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "jalapeno-poppers-pekonilla";
const candidatePath = "docs/reviews/valipalat/katselmointi/jalapeno-poppers-pekonilla.md";
const approvedSnapshot = "f6e27b71219534e2105d89724b088135c1601d93";
const evidencePath = "docs/reviews/valipalat/era-02/source-bindings.json";
const reportPath = "docs/reviews/valipalat/era-02/jalapeno-method-and-nutrition-2026-11-21.md";
const sourceBlob = (s: string) => createHash("sha1")
  .update("blob " + Buffer.byteLength(s, "utf8") + "\0")
  .update(s, "utf8")
  .digest("hex");

type SourceEvidence = {
  foodId?: number;
  sourceMatchesFoodName?: boolean;
  polyolsStatus?: string;
  declaredCarbohydrateDefinition?: string;
  completeEUAvailableCarbohydrateEvidence?: boolean;
  approvedForPublicMacroCalculation?: boolean;
  approval?: string;
  per100g?: { carbohydrateByDifferenceG: number; dietaryFibreG: number; proteinG: number; fatG: number };
  cookedFatRetentionFraction?: number | null;
  cookedEdibleBaconG?: number | null;
  drippedBaconFatG?: number | null;
  genericCookingYieldCannotValidateThisStuffedBakedRecipe?: boolean;
};
type IngredientBinding = { grams: number; match: string; sourceId: string | null; externalEvidence?: SourceEvidence };
type Row = {
  id: string;
  status: string;
  gk: string;
  sourceFile: string;
  servings: number;
  ingredients: IngredientBinding[];
  nutritionStatus: string;
  publicationAuthorized: boolean;
  methodEvidence?: {
    sourceOvenC: number;
    sourceApproxBakingMinutes: number;
    ingredientQuantitiesSourceExact: boolean;
    sixPortionsDependOnTwelveHalves: boolean;
    timeTotalMinApproved: boolean;
    recipavoPhysicalTestClaim: boolean;
    preparationSourceStatus: string;
  };
};
type Mapping = { published: boolean; publicationAuthorized: boolean; recipes: Row[] };

test("B2 jalapeno: archived HOLD remains pinned and only the approved FI source can go public", async () => {
  const source = await readFile(path.join(root, candidatePath), "utf8");
  assert.equal(sourceBlob(source), approvedSnapshot, "draft changed without renewed source/nutrition review");
  const parsed = parseMarkdown(source);
  assert.ok(parsed);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  assert.equal(data.recipe_id, recipeId);
  assert.equal(data.language, "fi");
  assert.equal(data.category, "valipala");
  assert.equal(data.status, "draft");
  assert.equal(data.servings, 6);
  assert.equal(data.time_total_min, null, "40 minutes was not a measured yield/time");
  assert.equal(data.ingredients.length, 4);
  assert.deepEqual(data.ingredients.map(({amount,unit}) => [amount,unit]), [[150,"g"],[120,"g"],[60,"g"],[90,"g"]]);
  assert.equal(data.image, undefined);
  for (const field of [
    "carbs_net_per_serving_g", "carbs_total_per_serving_g",
    "protein_per_serving_g", "fat_per_serving_g",
  ] as const) assert.equal(data[field] ?? null, null, "no fabricated macros");
  assert.match(parsed.content, /200 °C/);
  assert.match(parsed.content, /20[–-]25 minuuttia/);
  assert.match(parsed.content, /180 g:n täytteeksi/);
  assert.match(parsed.content, /15 g puolikasta kohti/);
  assert.match(parsed.content, /90 g ohutta raakaa pekonia/);
  assert.match(parsed.content, /kuusi chiliä ei automaattisesti paina|Kuusi chiliä ei automaattisesti paina/);
  assert.match(parsed.content, /USDA FDC 168576/);
  assert.match(parsed.content, /HOLD/);
  assert.match(parsed.content, /omaa koekeittiökoetta ei vaadita automaattisesti/);
  const currentPath = "reseptit/valipalat/" + recipeId + ".md";
  const currentSource = await readFile(path.join(root, currentPath), "utf8");
  const current = parseMarkdown(currentSource);
  assert.ok(current);
  const review = JSON.parse(await readFile(path.join(root, "docs/reviews/new-recipes", recipeId + ".json"), "utf8"));
  assert.equal(review.source_path, currentPath);
  assert.equal(review.source_sha256, createHash("sha256").update(currentSource).digest("hex"));
  const publishedLocales = siteContent.recipes.filter(r => r.recipeId === recipeId).map(r => r.locale);
  if (current.data.status === "published") {
    assert.equal(review.decision, "approved");
    assert.equal(review.checks.nutrition.status, "pass");
    assert.deepEqual(publishedLocales, ["fi"]);
  } else {
    assert.equal(review.decision, "hold");
    assert.deepEqual(publishedLocales, []);
  }
  const pairs = JSON.parse(await readFile(path.join(root,
    "meta/kaannokset/published-translation-pairs.json"), "utf8")) as {
      sources: Array<{ recipe_id: string }>;
    };
  assert.equal(pairs.sources.some(x => x.recipe_id === recipeId), false);
});

test("B2 jalapeno: exact USDA pepper is research-only and raw bacon retention stays unmeasured", async () => {
  const mapping = JSON.parse(await readFile(path.join(root, evidencePath), "utf8")) as Mapping;
  assert.equal(mapping.published, false);
  assert.equal(mapping.publicationAuthorized, false);
  const rows = mapping.recipes.filter(r => r.id === recipeId);
  assert.equal(rows.length, 1);
  const row = rows[0];
  assert.equal(row.status, "REVIEW_REQUIRED");
  assert.equal(row.gk, "HOLD");
  assert.equal(row.nutritionStatus, "UNPUBLISHED");
  assert.equal(row.publicationAuthorized, false);
  assert.equal(row.sourceFile, candidatePath);
  assert.equal(row.servings, 6);
  assert.equal(row.ingredients.length, 4);
  assert.deepEqual(row.ingredients.map(x => x.grams), [150,120,60,90]);
  assert.deepEqual(row.ingredients.map(x => x.match), ["PROVISIONAL","EXACT","EXACT","REVIEW"]);

  const jalapeno = row.ingredients[0];
  assert.equal(jalapeno.sourceId, "afcd-F002901-2026-10-25", "old red chili remains a mismatch comparator");
  const food = jalapeno.externalEvidence;
  assert.ok(food);
  assert.equal(food.foodId, 168576);
  assert.equal(food.sourceMatchesFoodName, true);
  assert.equal(food.polyolsStatus, "NOT_REPORTED");
  assert.equal(food.declaredCarbohydrateDefinition, "US_CARBOHYDRATE_BY_DIFFERENCE_INCLUDES_FIBRE");
  assert.equal(food.completeEUAvailableCarbohydrateEvidence, false);
  assert.equal(food.approvedForPublicMacroCalculation, false);
  assert.equal(food.approval, "RESEARCH_ONLY_NOT_NUTRITION_MODEL_INPUT");
  assert.ok(food.per100g);
  assert.equal(food.per100g.carbohydrateByDifferenceG * 1.5, 9.75);
  assert.equal(Number((food.per100g.dietaryFibreG * 1.5).toFixed(3)), 4.2);
  assert.equal(food.per100g.proteinG * 1.5, 1.365);
  assert.equal(Number((food.per100g.fatG * 1.5).toFixed(3)), 0.555);

  const recipe = recipeFrontmatterSchema.parse(parseMarkdown(await readFile(path.join(root, candidatePath), "utf8"))!.data);
  const composition: FoodRecord = {
    id: "usda-168576-research", name: "Peppers, jalapeno, raw",
    sourceUrl: "https://fdc.nal.usda.gov/food-details/168576/nutrients",
    retrievedAt: "2026-11-23", licence: "USDA public domain",
    state: "raw", basis: "per100g-edible", carbohydrateDefinition: "US_TOTAL_INCLUDING_FIBRE",
    per100g: { carbohydrate: food.per100g.carbohydrateByDifferenceG, fibre: food.per100g.dietaryFibreG, polyols: null },
  };
  const comparison = (composition.per100g.carbohydrate! - composition.per100g.fibre!) * jalapeno.grams / 100 / row.servings;
  assert.equal(Number(comparison.toFixed(3)), 0.925, "USDA carbohydrate minus fibre is only a scenario input");
  const gk = calculateGlycemicLoad({ recipeId, servings: row.servings,
    ingredients: [{ name: recipe.ingredients[0].item, grams: jalapeno.grams, fineliRecordId: composition.id, giRecordId: null }] },
    [composition], [], { requireBoundedGi: true });
  assert.equal(gk.glycemicLoadPerServing, null);
  assert.equal(gk.glycemicLoadRangePerServing, null);

  // A fixture for the nutrition gate only. Image, safety and editorial approval remain separate.
  const withholding: Calculation = {
    recipeId, servings: recipe.servings, sourceHash: recipeNutritionInputHash(recipe),
    calculatedAt: "2026-11-23", scope: "FI release-gate test", reviewerStatus: "AUTOMATED ONLY",
    carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE", publicationStatus: "WITHHELD_SOURCE_INCOMPLETE",
    withholdingReason: "Jalapeño polyols and other ingredients need separate recipe-specific evidence.",
    ingredients: recipe.ingredients.map((ingredient, index) => ({
      ...ingredient, state: "raw", matchEvidence: index === 0 ? "USDA research comparator" : "",
      ...(index === 0 ? { record: composition } : {}), edibleFraction: 1, edibleEvidence: "Edible input mass",
      retainedFraction: 1, retentionEvidence: "Gate test uses the input mass",
    })),
  };
  const verified = verifyNutritionEvidence(recipe, withholding);
  assert.equal(verified.status, "INSUFFICIENT SOURCE DATA");
  assert.deepEqual(verified.errors, []);
  assert.ok(Object.values(verified.values).every(value => value === null));

  const bacon = row.ingredients[3];
  assert.equal(bacon.sourceId, "fineli-707-2026-10-24");
  const yieldEvidence = bacon.externalEvidence;
  assert.ok(yieldEvidence);
  assert.equal(yieldEvidence.cookedEdibleBaconG, null);
  assert.equal(yieldEvidence.cookedFatRetentionFraction, null);
  assert.equal(yieldEvidence.drippedBaconFatG, null);
  assert.equal(yieldEvidence.genericCookingYieldCannotValidateThisStuffedBakedRecipe, true);
  assert.equal(yieldEvidence.approvedForPublicMacroCalculation, false);
  assert.equal(yieldEvidence.approval, "RETENTION_AND_PRODUCT_HOLD");

  assert.equal(row.methodEvidence?.sourceOvenC, 200);
  assert.equal(row.methodEvidence?.sourceApproxBakingMinutes, 20);
  assert.equal(row.methodEvidence?.ingredientQuantitiesSourceExact, false);
  assert.equal(row.methodEvidence?.sixPortionsDependOnTwelveHalves, true);
  assert.equal(row.methodEvidence?.timeTotalMinApproved, false);
  assert.equal(row.methodEvidence?.recipavoPhysicalTestClaim, false);
  assert.equal(row.methodEvidence?.preparationSourceStatus, "METHOD_SUPPORTED_QUANTITIES_NOT_INDEPENDENTLY_VERIFIED");
  const report = await readFile(path.join(root, reportPath), "utf8");
  assert.match(report, /Kylee Ayotte/);
  assert.match(report, /FDC 168576/);
  assert.match(report, /ei luoda uutta|ei luoda uutta/i);
  assert.match(report, /POLYL/);
  assert.match(report, /EI JULKAISULUPAA/);
});
