import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { nutritionProvenance } from "./nutrition-provenance";
import { salmonScenario, salmonComparison } from "./nutrition-pilot";
import path from "node:path";
import { auditTranslations } from "./translation-audit";
import { calculate, type Calculation, type FoodRecord, type IngredientInput } from "./nutrition-model";
const root = path.resolve(import.meta.dirname, "../..");
const keys = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;
const fineliCarbohydrateEvidence = new Set(["munakokkeli", "munakasmuffinit", "munakasrulla-pinaatti-tuorejuustolla", "munatacot-huevos-rancheros", "paprikauunimunakkaat", "shakshuka", "uunimuna-avokadot", "uunimunat-pinaatilla", "tortilla-de-patatas", "vhh-lihamureke", "halloumimunakas", "kaakao-kookos-chia", "kurkku-oliivi-aamiaiskulho", "marjainen-chiavanukas", "paahdettu-aamiaismunakoiso", "rahka-marjakerroskulho", "savulohi-avokadokulho", "tonnikalamunakkaat-uunissa", "chili-con-carne-kukkakaaliriisi", "kana-fajita-pelti", "ratatouille", "menemen", "munakoiso-jauhelihavuoka-vhh", "kesakurpitsalasagne-vhh", "taytetyt-paprikat-vhh", "kukkakaaligratiini-pekonilla", "jauhelihakastike-kesakurpitsanuudeleilla", "vhh-kaalikaarryleet", "uunikanapasta-kesakurpitsa", "hummus"]);
const audit = await auditTranslations();
const calculatedAt = new Date().toISOString().slice(0, 10);
const provenance = await nutritionProvenance(root);
const sourceHashes: Record<string, string> = Object.fromEntries(await Promise.all(audit.publishedSources.map(async (recipe) => [recipe.path, createHash("sha256").update((await readFile(path.join(root, recipe.path), "utf8")).replaceAll("\r\n", "\n")).digest("hex")] as const)));
const inventory = audit.publishedSources.map((recipe) => {
  const values = Object.fromEntries(keys.map((key) => [key, recipe.data[key] ?? null]));
  const hasValues = Object.values(values).some((n) => n !== null);
  const hasFineliCarbohydrateEvidence = fineliCarbohydrateEvidence.has(recipe.data.recipe_id) && recipe.data.carbs_total_per_serving_g != null;
  const conflicts = recipe.data.carbs_net_per_serving_g != null && recipe.data.carbs_total_per_serving_g != null && recipe.data.carbs_net_per_serving_g > recipe.data.carbs_total_per_serving_g;
  return { recipe_id: recipe.data.recipe_id, source_path: recipe.path, source_content_hash: sourceHashes[recipe.path], values, servings: recipe.data.servings,
    status: conflicts ? "CONFLICT REQUIRES REVIEW" : hasValues ? "INSUFFICIENT SOURCE DATA" : "MISSING",
    calculationEvidence: hasFineliCarbohydrateEvidence ? "docs/nutrition/estimates-2026-10-24.md; docs/nutrition/food-records.json" : null,
    carbohydrateDefinition: recipe.data.carbs_net_per_serving_g == null ? "NOT DOCUMENTED" : "AVAILABLE_EXCLUDING_FIBRE",
    totalCarbohydrateDefinition: hasFineliCarbohydrateEvidence ? "AVAILABLE_PLUS_FIBRE_PLUS_POLYOLS" : "NOT DOCUMENTED",
    portionBasis: "metadata fields per serving", brandAndRawWeightEvidence: hasFineliCarbohydrateEvidence ? "Fineli record IDs and mass assumptions in docs/nutrition/estimates-2026-10-24.md" : "NOT VERIFIED",
    missingFields: keys.filter((key) => recipe.data[key] == null),
    ingredients: recipe.data.ingredients,
    notes: recipe.content.split("## Muistiinpanot")[1]?.trim() ?? "",
    uncertainties: ["No reproducible ingredient-to-record calculation found in repository", "Product, edible weight and preparation yield require evidence", ...(recipe.data.ingredients.some((i) => i.amount === null) ? ["Unmeasured ingredients present"] : []), ...(recipe.data.ingredients.some((i) => !["g", "kg"].includes(i.unit)) ? ["Ingredient-specific volume/piece weights required"] : [])],
  };
});
const records: FoodRecord[] = JSON.parse(await readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8"));
const blockers: Record<string, string[]> = {
  "kermainen-lohipata": ["Salmon species/fat and edible skinless weight need confirmation", "Cream cheese brand/fat missing", "Cream density/fat and small onion/clove/spoon weights unknown", "Vegetable side excluded from pilot; its amount is absent"],
  "keto-kauralesesampylat": ["Egg edible weights missing", "Cottage cheese fat, almond flour fat and psyllium product unidentified", "Cream density and powder teaspoon weights missing", "Optional sesame and extra psyllium quantities unspecified", "Fineli oat bran record 170 identified but direct access failed; do not substitute whole oats"],
  "butter-chicken": ["Frying oil is listed but its amount and retention are unmeasured", "Thigh skin/bone basis and yoghurt/cream fat unknown", "Marinade retained fraction unknown", "Honey optional; coriander quantity missing; rice/naan excluded", "Fineli prepared dish 34422 rejected: breast and 15% cream differ from source"],
  "pad-thai-vhh-konjac": ["Konjac drained weight known, product composition missing", "Shrimp raw/cooked basis must be confirmed", "Firm tofu brand and egg edible weights missing", "Tamarind/sauce concentration and spoon density missing", "Erythritol identity/purity and gram conversion need evidence; no blanket polyol deduction", "Spring onion/coriander unmeasured; serving lime wedges unquantified"],
  "paella-valenciana": ["Chicken edible meat versus bone-in weight unclear", "Rabbit/hare/chicken alternative unresolved", "Rice treated as dry by steps, exact product needs confirmation", "Broth composition, oil density and spice weights missing", "Rosemary removed before serving; retention not measured"],
};
const pilots = [];
for (const [id, uncertainties] of Object.entries(blockers)) {
  const source = audit.publishedSources.find((r) => r.data.recipe_id === id);
  if (!source) throw Error(`Pilot source missing: ${id}`);
  let ingredients: IngredientInput[] = source.data.ingredients.map((i) => ({ ...i, state: "UNRESOLVED", matchEvidence: "" }));
  // This explicit input-only scenario demonstrates a sourced contribution, not a full dish estimate.
  if (id === "kermainen-lohipata") ingredients = salmonScenario(ingredients, records);
  const input: Calculation = { recipeId: id, sourceHash: sourceHashes[source.path], calculatedAt, servings: source.data.servings, scope: "Unfinished ingredient-input evidence pilot; not cooked meal nutrition; no sides unless explicitly quantified", reviewerStatus: "AUTOMATED ONLY", carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE", ingredients };
  const result = calculate(input);
  pilots.push({ ...result, source_path: source.path, uncertainties, existingPerServing: inventory.find((r) => r.recipe_id === id)!.values,
    ...(id === "kermainen-lohipata" ? salmonComparison(input, inventory.find((r) => r.recipe_id === id)!.values.protein_per_serving_g) : { comparison: "Full comparison blocked; no inferred totals", comparisonStatus: "INSUFFICIENT SOURCE DATA" }) });
}
const counts = Object.fromEntries(["VERIFIED", "ESTIMATE WITH EVIDENCE", "INSUFFICIENT SOURCE DATA", "CONFLICT REQUIRES REVIEW", "MISSING"].map((status) => [status, inventory.filter((r) => r.status === status).length]));
const report = { ...provenance, calculatedAt, sources: inventory.length, counts, dietClasses: Object.fromEntries(["keto", "vhh_tiukka", "vhh_valjempi", "unclassified"].map((diet) => [diet, audit.publishedSources.filter((r) => (r.data.diet_class ?? "unclassified") === diet).length])), inventory, pilots };
const directory = path.join(root, process.argv.includes("--snapshot") ? "docs/nutrition" : "tmp/nutrition");
await mkdir(directory, { recursive: true });
await writeFile(path.join(directory, "audit.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ sources: report.sources, counts, dietClasses: report.dietClasses, pilots: pilots.map((p) => ({ id: p.recipeId, status: p.status, total: p.total, perServing: p.perServing })), output: directory }, null, 2));
