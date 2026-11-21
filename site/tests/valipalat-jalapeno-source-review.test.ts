import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { recipeFrontmatterSchema } from "../src/content/schema";
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
    reciPavoPhysicalTestClaim: boolean;
    preparationSourceStatus: string;
  };
};
type Mapping = { published: boolean; publicationAuthorized: boolean; recipes: Row[] };

test("B2 jalapeno: source-backed cooking method is a held draft, not a hidden published recipe", async () => {
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
  assert.equal(siteContent.recipes.some(r => r.recipeId === recipeId), false);
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
  assert.equal(food.per100g.dietaryFibreG * 1.5, 4.2);
  assert.equal(food.per100g.proteinG * 1.5, 1.365);
  assert.equal(Number((food.per100g.fatG * 1.5).toFixed(3)), 0.555);

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
  assert.equal(row.methodEvidence?.reciPavoPhysicalTestClaim, false);
  assert.equal(row.methodEvidence?.preparationSourceStatus, "METHOD_SUPPORTED_QUANTITIES_NOT_INDEPENDENTLY_VERIFIED");
  const report = await readFile(path.join(root, reportPath), "utf8");
  assert.match(report, /Kylee Ayotte/);
  assert.match(report, /FDC 168576/);
  assert.match(report, /ei luoda uutta|ei luoda uutta/i);
  assert.match(report, /POLYL/);
  assert.match(report, /EI JULKAISULUPAA/);
});
