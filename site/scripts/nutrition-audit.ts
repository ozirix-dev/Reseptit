import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { nutritionProvenance } from "./nutrition-provenance";
import path from "node:path";
import { auditTranslations } from "./translation-audit";
import { calculate, type Calculation, type IngredientInput } from "./nutrition-model";
import { verifyNutritionEvidence } from "./nutrition-evidence";
const root = path.resolve(import.meta.dirname, "../..");
const keys = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;
const audit = await auditTranslations();
const calculatedAt = new Date().toISOString().slice(0, 10);
const provenance = await nutritionProvenance(root);
const sourceHashes: Record<string, string> = Object.fromEntries(await Promise.all(audit.publishedSources.map(async (recipe) => [recipe.path, createHash("sha256").update((await readFile(path.join(root, recipe.path), "utf8")).replaceAll("\r\n", "\n")).digest("hex")] as const)));
const batchDirectory = path.join(root, "docs/nutrition/batches");
const batchFiles = await readdir(batchDirectory).catch((error: NodeJS.ErrnoException) => error.code === "ENOENT" ? [] : Promise.reject(error));
const batches = new Map<string, Set<string>>();
for (const filename of batchFiles.filter((name) => name.endsWith(".json"))) {
  const batch = JSON.parse(await readFile(path.join(batchDirectory, filename), "utf8")) as { batchId?: string; recipes?: { recipeId?: string }[] };
  if (!batch.batchId || filename !== `${batch.batchId}.json` || !Array.isArray(batch.recipes) || batches.has(batch.batchId)) throw new Error(`Invalid or duplicate nutrition batch manifest: ${filename}`);
  batches.set(batch.batchId, new Set(batch.recipes.map((recipe) => recipe.recipeId).filter((id): id is string => Boolean(id))));
}
const evidenceDirectory = path.join(root, "docs/nutrition/calculations");
const evidenceFiles = await readdir(evidenceDirectory).catch((error: NodeJS.ErrnoException) => error.code === "ENOENT" ? [] : Promise.reject(error));
const evidenceByRecipe = new Map<string, Calculation>();
for (const filename of evidenceFiles.filter((name) => name.endsWith(".json"))) {
  const evidence = JSON.parse(await readFile(path.join(evidenceDirectory, filename), "utf8")) as Calculation;
  if (!evidence.recipeId || evidenceByRecipe.has(evidence.recipeId)) throw new Error(`Duplicate or invalid nutrition evidence recipeId in ${filename}`);
  if (filename !== `${evidence.recipeId}.json`) throw new Error(`Nutrition evidence filename must match recipeId: ${filename}`);
  evidenceByRecipe.set(evidence.recipeId, evidence);
}
const publishedRecipeIds = new Set(audit.publishedSources.map((recipe) => recipe.data.recipe_id));
for (const recipeId of evidenceByRecipe.keys()) if (!publishedRecipeIds.has(recipeId)) throw new Error(`Nutrition evidence has no published source recipe: ${recipeId}`);
const translationsByRecipe = new Map<string, typeof audit.publishedTranslations>();
for (const translation of audit.publishedTranslations) {
  const group = translationsByRecipe.get(translation.data.recipe_id) ?? [];
  group.push(translation);
  translationsByRecipe.set(translation.data.recipe_id, group);
}
const inventory = audit.publishedSources.map((recipe) => {
  const values = Object.fromEntries(keys.map((key) => [key, recipe.data[key] ?? null]));
  const translations = translationsByRecipe.get(recipe.data.recipe_id) ?? [];
  const checked = verifyNutritionEvidence(recipe.data, evidenceByRecipe.get(recipe.data.recipe_id) ?? null, translations);
  const evidence = evidenceByRecipe.get(recipe.data.recipe_id);
  const batchErrors = evidence && (!evidence.batchId || !batches.get(evidence.batchId)?.has(recipe.data.recipe_id))
    ? [`calculation evidence is not listed in a matching batch manifest (${evidence.batchId ?? "missing batchId"})`]
    : [];
  const evidenceErrors = [...checked.errors, ...batchErrors];
  const conflicts = recipe.data.carbs_net_per_serving_g != null && recipe.data.carbs_total_per_serving_g != null && recipe.data.carbs_net_per_serving_g > recipe.data.carbs_total_per_serving_g;
  const status = conflicts || (evidence !== undefined && evidenceErrors.length > 0) ? "CONFLICT REQUIRES REVIEW" : checked.status;
  const evidencePath = evidenceByRecipe.has(recipe.data.recipe_id) ? `docs/nutrition/calculations/${recipe.data.recipe_id}.json` : null;
  return { recipe_id: recipe.data.recipe_id, source_path: recipe.path, source_content_hash: sourceHashes[recipe.path], values, servings: recipe.data.servings,
    status,
    calculationEvidence: evidencePath,
    recalculatedValues: checked.calculated ? { carbs_net_per_serving_g: checked.calculated.perServing.netCarbohydrate, carbs_total_per_serving_g: checked.calculated.totalCarbohydratePerServingG, protein_per_serving_g: checked.calculated.perServing.protein, fat_per_serving_g: checked.calculated.perServing.fat } : null,
    evidenceErrors,
    carbohydrateDefinition: recipe.data.carbs_net_per_serving_g == null ? "NOT DOCUMENTED" : "AVAILABLE_EXCLUDING_FIBRE",
    totalCarbohydrateDefinition: evidencePath && status === "ESTIMATE WITH EVIDENCE" ? "AVAILABLE_PLUS_FIBRE_PLUS_POLYOLS" : "NOT VERIFIED",
    portionBasis: "metadata fields per serving", brandAndRawWeightEvidence: status === "ESTIMATE WITH EVIDENCE" ? evidencePath : "NOT VERIFIED",
    missingFields: keys.filter((key) => recipe.data[key] == null),
    ingredients: recipe.data.ingredients,
    notes: recipe.content.split("## Muistiinpanot")[1]?.trim() ?? "",
    uncertainties: status === "ESTIMATE WITH EVIDENCE" ? [] : evidenceErrors,
  };
});
const blockers: Record<string, string[]> = {
  "butter-chicken": ["Frying oil is listed but its amount and retention are unmeasured", "Thigh skin/bone basis and yoghurt/cream fat unknown", "Marinade retained fraction unknown", "Honey optional; coriander quantity missing; rice/naan excluded", "Fineli prepared dish 34422 rejected: breast and 15% cream differ from source"],
  "pad-thai-vhh-konjac": ["Konjac drained weight known, product composition missing", "Shrimp raw/cooked basis must be confirmed", "Firm tofu brand and egg edible weights missing", "Tamarind/sauce concentration and spoon density missing", "Erythritol identity/purity and gram conversion need evidence; no blanket polyol deduction", "Spring onion/coriander unmeasured; serving lime wedges unquantified"],
  "paella-valenciana": ["Chicken edible meat versus bone-in weight unclear", "Rabbit/hare/chicken alternative unresolved", "Rice treated as dry by steps, exact product needs confirmation", "Broth composition, oil density and spice weights missing", "Rosemary removed before serving; retention not measured"],
};
const pilots = [];
for (const [id, uncertainties] of Object.entries(blockers)) {
  const source = audit.publishedSources.find((r) => r.data.recipe_id === id);
  if (!source) throw Error(`Pilot source missing: ${id}`);
  let ingredients: IngredientInput[] = source.data.ingredients.map((i) => ({ ...i, state: "UNRESOLVED", matchEvidence: "" }));
  // Remaining pilots are deliberately partial and cannot replace whole-dish values.
  const input: Calculation = { recipeId: id, sourceHash: sourceHashes[source.path], calculatedAt, servings: source.data.servings, scope: "Unfinished ingredient-input evidence pilot; not cooked meal nutrition; no sides unless explicitly quantified", reviewerStatus: "AUTOMATED ONLY", carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE", ingredients };
  const result = calculate(input);
  pilots.push({ ...result, source_path: source.path, uncertainties, existingPerServing: inventory.find((r) => r.recipe_id === id)!.values,
    comparison: "Full comparison blocked; no inferred totals", comparisonStatus: "INSUFFICIENT SOURCE DATA" });
}
const counts = Object.fromEntries(["VERIFIED", "ESTIMATE WITH EVIDENCE", "INSUFFICIENT SOURCE DATA", "CONFLICT REQUIRES REVIEW", "MISSING"].map((status) => [status, inventory.filter((r) => r.status === status).length]));
const report = { ...provenance, calculatedAt, sources: inventory.length, counts, dietClasses: Object.fromEntries(["keto", "vhh_tiukka", "vhh_valjempi", "unclassified"].map((diet) => [diet, audit.publishedSources.filter((r) => (r.data.diet_class ?? "unclassified") === diet).length])), inventory, pilots };
const directory = path.join(root, process.argv.includes("--snapshot") ? "docs/nutrition" : "tmp/nutrition");
await mkdir(directory, { recursive: true });
await writeFile(path.join(directory, "audit.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ sources: report.sources, counts, dietClasses: report.dietClasses, pilots: pilots.map((p) => ({ id: p.recipeId, status: p.status, total: p.total, perServing: p.perServing })), output: directory }, null, 2));
if (process.argv.includes("--strict") && counts["CONFLICT REQUIRES REVIEW"]! > 0) {
  throw new Error(`Strict nutrition audit found ${counts["CONFLICT REQUIRES REVIEW"]} conflicting published nutrition records`);
}
