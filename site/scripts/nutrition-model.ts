// Editorial calculation only. Never imported by the public application.
export const nutrients = ["kcal", "protein", "fat", "carbohydrate", "fibre", "sugars", "polyols", "netCarbohydrate"] as const;
export type Nutrient = typeof nutrients[number];
export type Values = Record<Nutrient, number | null>;
export type CarbDefinition = "EU_AVAILABLE" | "US_TOTAL_INCLUDING_FIBRE" | "UNKNOWN";
export interface FoodRecord {
  id: string; name: string; sourceUrl: string; retrievedAt: string; licence: string;
  state: string; basis: "per100g-edible"; carbohydrateDefinition: CarbDefinition;
  per100g: Partial<Omit<Values, "netCarbohydrate">>;
}
export interface IngredientInput {
  item: string; amount: number | null; unit: string; record?: FoodRecord;
  state: string; matchEvidence: string;
  gramsPerUnit?: number; conversionEvidence?: string;
  edibleFraction?: number; edibleEvidence?: string;
  retainedFraction?: number; retentionEvidence?: string;
  excludedReason?: string;
}
export interface Calculation {
  recipeId: string; sourceHash: string; calculatedAt: string; servings: number;
  scope: string; reviewerStatus: "AUTOMATED ONLY"; ingredients: IngredientInput[];
  // Only this definition is aggregated. US total is converted once, EU is not.
  carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE";
}
export const emptyValues = (): Values => Object.fromEntries(nutrients.map((n) => [n, null])) as Values;
const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0;
export function round(value: number, decimals = 2): number {
  if (!valid(value) || !Number.isInteger(decimals) || decimals < 0 || decimals > 6) throw Error("Invalid rounding input");
  return Math.round((value + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
}
export function normalizeCarbohydrate(record: FoodRecord, subtractFibre = record.carbohydrateDefinition === "US_TOTAL_INCLUDING_FIBRE") {
  if (subtractFibre && record.carbohydrateDefinition !== "US_TOTAL_INCLUDING_FIBRE") throw Error("Fibre would be subtracted twice or definition is unknown");
  const { carbohydrate, fibre, polyols } = record.per100g;
  let available: number | null = null;
  if (record.carbohydrateDefinition === "EU_AVAILABLE" && valid(carbohydrate)) available = carbohydrate;
  if (record.carbohydrateDefinition === "US_TOTAL_INCLUDING_FIBRE" && subtractFibre && valid(carbohydrate) && valid(fibre)) {
    if (fibre > carbohydrate) throw Error("Conflicting carbohydrate definition: fibre exceeds total");
    available = carbohydrate - fibre;
  }
  // No blanket polyol subtraction, including erythritol. A future policy needs evidence.
  return { available, net: polyols === 0 ? available : null };
}
export function calculate(input: Calculation) {
  if (!Number.isInteger(input.servings) || input.servings <= 0) throw Error("Invalid servings");
  if (!input.recipeId || !/^[a-f0-9]{64}$/.test(input.sourceHash) || !/^\d{4}-\d{2}-\d{2}$/.test(input.calculatedAt) || !input.scope || input.reviewerStatus !== "AUTOMATED ONLY" || input.carbohydrateOutput !== "AVAILABLE_EXCLUDING_FIBRE" || !input.ingredients.length) throw Error("Incomplete calculation provenance");
  const rows = input.ingredients.map((ingredient) => {
    const issues: string[] = [];
    const fail = (message: string) => issues.push(message);
    if (ingredient.excludedReason) return { item: ingredient.item, excluded: ingredient.excludedReason, grams: null, values: emptyValues(), issues };
    if (!valid(ingredient.amount)) fail("Missing/invalid amount");
    const record = ingredient.record;
    if (!record?.id || !/^https:\/\//.test(record.sourceUrl) || !record.retrievedAt || !record.licence) fail("Missing source reference");
    if (!ingredient.matchEvidence || !record || record.state !== ingredient.state || record.basis !== "per100g-edible") fail("Unresolved food/state/edible basis match");
    const factor = ingredient.unit === "g" ? 1 : ingredient.unit === "kg" ? 1000 : ingredient.gramsPerUnit;
    if (!valid(factor) || factor === 0 || (!["g", "kg"].includes(ingredient.unit) && !ingredient.conversionEvidence)) fail("Missing ingredient-specific unit conversion");
    if (!valid(ingredient.edibleFraction) || ingredient.edibleFraction > 1 || !ingredient.edibleEvidence) fail("Unknown edible fraction");
    if (!valid(ingredient.retainedFraction) || ingredient.retainedFraction > 1 || !ingredient.retentionEvidence) fail("Unknown preparation retention/loss");
    const values = emptyValues();
    if (record) for (const [key, value] of Object.entries(record.per100g)) {
      if (!(nutrients as readonly string[]).includes(key) || key === "netCarbohydrate" || (value !== null && !valid(value))) fail(`Invalid nutrient ${key}`);
    }
    const grams = issues.length ? null : ingredient.amount! * factor! * ingredient.edibleFraction!;
    if (grams !== null && record) {
      for (const key of nutrients) if (key !== "netCarbohydrate" && valid(record.per100g[key])) values[key] = record.per100g[key]! * grams / 100 * ingredient.retainedFraction!;
      try {
        const carb = normalizeCarbohydrate(record);
        values.carbohydrate = carb.available === null ? null : carb.available * grams / 100 * ingredient.retainedFraction!;
        values.netCarbohydrate = carb.net === null ? null : carb.net * grams / 100 * ingredient.retainedFraction!;
      } catch (error) { values.carbohydrate = null; fail(String(error)); }
      for (const key of nutrients) if (values[key] === null) fail(`Unknown nutrient ${key}`);
    }
    return { item: ingredient.item, recordId: record?.id ?? null, grams, values, issues };
  });
  const included = rows.filter((row) => !row.excluded);
  const total = emptyValues(), perServing = emptyValues();
  for (const key of nutrients) {
    if (included.length && included.every((row) => row.values[key] !== null)) {
      const sum = included.reduce((value, row) => value + row.values[key]!, 0);
      total[key] = round(sum); perServing[key] = round(sum / input.servings);
    }
  }
  return { ...input, rows, total, perServing, edibleInputGrams: included.length && included.every((r) => r.grams !== null) ? round(included.reduce((n, r) => n + r.grams!, 0)) : null,
    status: nutrients.every((n) => total[n] !== null) ? "ESTIMATE WITH EVIDENCE" : "INSUFFICIENT SOURCE DATA" };
}
