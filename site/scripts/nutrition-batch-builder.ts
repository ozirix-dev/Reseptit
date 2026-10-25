import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { auditTranslations } from "./translation-audit";
import { calculate, type Calculation, type FoodRecord, type IngredientInput } from "./nutrition-model";
import { recipeNutritionInputHash } from "./nutrition-evidence";
import { updateNutritionFrontmatter } from "./nutrition-markdown";

type Dataset = "fineli-release-20" | "afcd-release-3" | "food-records";
type IngredientPlan = Omit<IngredientInput, "item" | "amount" | "unit" | "record" | "state"> & {
  dataset?: Dataset;
  sourceId?: string;
  state: string;
  matchEvidence: string;
};
type BatchPlan = {
  batchId: string;
  ingredientMappings?: Record<string, IngredientPlan>;
  recipes: { recipeId: string; scope: string; ingredients?: IngredientPlan[] }[];
};
const root = path.resolve(import.meta.dirname, "../..");
const MAX_RECIPES_PER_BATCH = 40;

async function json<T>(relative: string): Promise<T> {
  return JSON.parse(await readFile(path.join(root, relative), "utf8")) as T;
}
function fineliRecord(sourceId: string, food: any, state: string): FoodRecord {
  const values = food.per100g;
  const carbohydrate = values.available_carbohydrate_g_per_100g;
  const fibre = values.fibre_g_per_100g;
  const polyols = values.polyols_g_per_100g;
  const protein = values.protein_g_per_100g;
  const fat = values.fat_g_per_100g;
  return {
    id: `fineli-${sourceId}-release-20`, name: food.name,
    sourceUrl: `https://fineli.fi/fineli/api/v1/foods/${sourceId}`,
    retrievedAt: "2026-10-24", licence: "THL, Fineli Release 20, CC BY 4.0",
    state,
    basis: "per100g-edible", carbohydrateDefinition: "EU_AVAILABLE",
    componentValues: { CHO: carbohydrate, FIBT: fibre, POLYL: polyols },
    componentIds: { CHO: 2034, FIBT: 2168, POLYL: 2260 },
    polyolsSourceVerified: polyols !== null,
    polyolsEvidence: polyols === null ? undefined : "Fineli Release 20 POLYL component 2260",
    per100g: { carbohydrate, fibre, polyols, protein, fat },
  };
}
function afcdRecord(sourceId: string, food: any, state: string): FoodRecord {
  const available = food.available_carbohydrate_without_sugar_alcohols_g_per_100g;
  const withPolyols = food.available_carbohydrate_with_sugar_alcohols_g_per_100g;
  const polyols = available === null || withPolyols === null ? null : withPolyols - available;
  if (polyols !== null && polyols < 0) throw new Error(`AFCD polyol difference is negative for ${sourceId}`);
  return {
    id: `afcd-${sourceId}-release-3`, name: food.name,
    sourceUrl: "https://www.foodstandards.gov.au/science-data/monitoringnutrition/afcd",
    retrievedAt: "2026-10-24", licence: "FSANZ AFCD Release 3; CC BY-SA 3.0 Australia; Australian data limitation applies",
    state, basis: "per100g-as-sold", carbohydrateDefinition: "EU_AVAILABLE",
    polyolsSourceVerified: available !== null && withPolyols !== null,
    polyolsEvidence: available !== null && withPolyols !== null ? "AFCD paired available carbohydrate with/without sugar alcohols" : undefined,
    per100g: { carbohydrate: available, fibre: food.fibre_g_per_100g, polyols, protein: food.protein_g_per_100g, fat: food.fat_g_per_100g },
  };
}

const inputPath = process.argv[2];
if (!inputPath) throw new Error("Usage: tsx scripts/nutrition-batch-builder.ts <batch-plan.json>");
const plan = JSON.parse(await readFile(path.resolve(root, inputPath), "utf8")) as BatchPlan;
const refreshBatch = process.argv.includes("--refresh-batch");
if (!/^batch-\d+$/.test(plan.batchId) || plan.recipes.length < 1 || plan.recipes.length > MAX_RECIPES_PER_BATCH) throw new Error(`A nutrition batch must contain 1–${MAX_RECIPES_PER_BATCH} recipes and a batch-N id`);
if (path.resolve(root, inputPath) !== path.join(root, "docs/nutrition/batches", `${plan.batchId}.json`)) throw new Error(`Batch plan must be stored at docs/nutrition/batches/${plan.batchId}.json so the audit can verify batch membership`);
if (new Set(plan.recipes.map((recipe) => recipe.recipeId)).size !== plan.recipes.length) throw new Error("Duplicate recipe IDs in batch plan");
const [audit, fineliData, afcdData, productRecords] = await Promise.all([
  auditTranslations(),
  json<{ foods: any[] }>("docs/nutrition/fineli-release-20-reference.json"),
  json<{ foods: any[] }>("docs/nutrition/afcd-release-3-reference.json"),
  json<FoodRecord[]>("docs/nutrition/food-records.json"),
]);
const sources = new Map(audit.publishedSources.map((recipe) => [recipe.data.recipe_id, recipe]));
const nutritionKeys = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;
const fineli = new Map(fineliData.foods.map((food) => [String(food.source_id), food]));
const afcd = new Map(afcdData.foods.map((food) => [String(food.source_id), food]));
const products = new Map(productRecords.map((food) => [food.id, food]));
const outputDir = path.join(root, "docs/nutrition/calculations");
const pending: { filename: string; calculation: Calculation; recipePath: string; values: Record<string, number> }[] = [];
for (const item of plan.recipes) {
  const recipe = sources.get(item.recipeId);
  if (!recipe) throw new Error(`Published Finnish source recipe not found: ${item.recipeId}`);
  if (nutritionKeys.some((key) => recipe.data[key] != null)) {
    if (!refreshBatch) throw new Error(`${item.recipeId}: batch plans may only add currently missing nutrition values`);
    const previous = JSON.parse(await readFile(path.join(root, "docs/nutrition/calculations", `${item.recipeId}.json`), "utf8")) as Calculation;
    if (previous.batchId !== plan.batchId) throw new Error(`${item.recipeId}: --refresh-batch can only refresh evidence from the same batch`);
  }
  if (item.ingredients && item.ingredients.length !== recipe.data.ingredients.length) throw new Error(`${item.recipeId}: ingredient plan count must match source ingredient count`);
  const calculation: Calculation = {
    recipeId: item.recipeId,
    sourceHash: recipeNutritionInputHash(recipe.data),
    calculatedAt: new Date().toISOString().slice(0, 10),
    batchId: plan.batchId,
    servings: recipe.data.servings,
    scope: item.scope,
    reviewerStatus: "AUTOMATED ONLY",
    carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE",
    ingredients: recipe.data.ingredients.map((ingredient, index) => {
      const mapKey = `${ingredient.unit.trim().toLocaleLowerCase("fi")}|${ingredient.item.trim().toLocaleLowerCase("fi")}`;
      const mapping = item.ingredients?.[index] ?? plan.ingredientMappings?.[mapKey];
      if (!mapping) throw new Error(`${item.recipeId}: missing source mapping for ingredient ${index + 1} (${mapKey})`);
      let record: FoodRecord | undefined;
      if (mapping.sourceId && mapping.dataset) {
        if (mapping.dataset === "fineli-release-20") {
          const food = fineli.get(mapping.sourceId);
          if (!food) throw new Error(`${item.recipeId}: unknown Fineli ID ${mapping.sourceId}`);
          record = fineliRecord(mapping.sourceId, food, mapping.state);
        } else if (mapping.dataset === "afcd-release-3") {
          const food = afcd.get(mapping.sourceId);
          if (!food) throw new Error(`${item.recipeId}: unknown AFCD ID ${mapping.sourceId}`);
          record = afcdRecord(mapping.sourceId, food, mapping.state);
        } else {
          record = products.get(mapping.sourceId);
          if (!record) throw new Error(`${item.recipeId}: unknown local product record ${mapping.sourceId}`);
        }
      }
      const result: IngredientInput = {
        item: ingredient.item, amount: ingredient.amount, unit: ingredient.unit,
        state: mapping.state, matchEvidence: mapping.matchEvidence,
        gramsPerUnit: mapping.gramsPerUnit, conversionEvidence: mapping.conversionEvidence,
        edibleFraction: mapping.edibleFraction ?? 1, edibleEvidence: mapping.edibleEvidence ?? "Ingredient basis is the documented edible amount",
        retainedFraction: mapping.retainedFraction ?? 1, retentionEvidence: mapping.retentionEvidence ?? "All ingredient mass is included; no discarded cooking liquid or fat",
        excludedReason: mapping.excludedReason,
        omissionImpactUpperBoundPerServing: mapping.omissionImpactUpperBoundPerServing,
        omissionImpactEvidence: mapping.omissionImpactEvidence,
        ...(record ? { record } : {}),
      };
      if (!mapping.excludedReason && !record) throw new Error(`${item.recipeId}: ingredient ${index + 1} has no source record`);
      if (mapping.excludedReason && record) throw new Error(`${item.recipeId}: excluded ingredient ${index + 1} must not also have a record`);
      return result;
    }),
  };
  const result = calculate(calculation);
  if (result.status !== "ESTIMATE WITH EVIDENCE") throw new Error(`${item.recipeId}: calculation rejected: ${JSON.stringify(result.rows.map((row) => ({ item: row.item, issues: row.issues })))}; omissions=${JSON.stringify(result.omissionImpactUpperBoundPerServing)}`);
  const filename = path.join(outputDir, `${item.recipeId}.json`);
  const values = {
    carbs_net_per_serving_g: result.perServing.netCarbohydrate,
    carbs_total_per_serving_g: result.totalCarbohydratePerServingG,
    protein_per_serving_g: result.perServing.protein,
    fat_per_serving_g: result.perServing.fat,
  };
  if (Object.values(values).some((value) => value === null)) throw new Error(`${item.recipeId}: calculator returned a null published nutrient`);
  pending.push({ filename, calculation, recipePath: recipe.path, values: values as Record<string, number> });
}
for (const item of pending) {
  try { await readFile(item.filename); throw new Error(`Refusing to overwrite existing calculation evidence: ${item.filename}`); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && !refreshBatch) throw error;
    if ((error as NodeJS.ErrnoException).code !== "ENOENT" && refreshBatch) {
      const previous = JSON.parse(await readFile(item.filename, "utf8")) as Calculation;
      if (previous.batchId !== plan.batchId) throw new Error(`Refusing to overwrite evidence from another batch: ${item.filename}`);
    }
  }
}
const markdownWrites = new Map<string, string>();
for (const item of pending) {
  const translationPaths = audit.publishedTranslations.filter((translation) => translation.data.recipe_id === item.calculation.recipeId).map((translation) => translation.path);
  for (const relativePath of [item.recipePath, ...translationPaths]) {
    const absolutePath = path.join(root, relativePath);
    const current = await readFile(absolutePath, "utf8");
    markdownWrites.set(relativePath, updateNutritionFrontmatter(current, item.values as Parameters<typeof updateNutritionFrontmatter>[1]));
  }
}
await mkdir(outputDir, { recursive: true });
for (const item of pending) await writeFile(item.filename, `${JSON.stringify(item.calculation, null, 2)}\n`, "utf8");
for (const [relativePath, content] of markdownWrites) await writeFile(path.join(root, relativePath), content, "utf8");
for (const item of pending) console.log(JSON.stringify({ recipeId: item.calculation.recipeId, batchId: plan.batchId, values: item.values, file: path.relative(root, item.filename).replaceAll("\\", "/") }));
