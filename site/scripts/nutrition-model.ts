// Editorial calculation only. Never imported by the public application.
export const nutrients = ["kcal", "protein", "fat", "carbohydrate", "fibre", "sugars", "polyols", "netCarbohydrate"] as const;
export type Nutrient = typeof nutrients[number];
export type Values = Record<Nutrient, number | null>;
export type CarbDefinition = "EU_AVAILABLE" | "US_TOTAL_INCLUDING_FIBRE" | "UNKNOWN";
export interface FoodRecord {
  id: string; name: string; sourceUrl: string; retrievedAt: string; licence: string;
  state: string; basis: "per100g-edible"; carbohydrateDefinition: CarbDefinition;
  componentValues?: Partial<Record<"CHO" | "FIBT" | "POLYL", number | null>>;
  componentIds?: Partial<Record<"CHO" | "FIBT" | "POLYL", number>>;
  per100g: Partial<Omit<Values, "netCarbohydrate">>;
}
export interface IngredientInput {
  item: string; amount: number | null; unit: string; record?: FoodRecord;
  state: string; matchEvidence: string;
  gramsPerUnit?: number; conversionEvidence?: string;
  edibleFraction?: number; edibleEvidence?: string;
  retainedFraction?: number; retentionEvidence?: string;
  excludedReason?: string;
  omissionImpactUpperBoundPerServing?: {
    kcal: number; netCarbohydrate: number; totalCarbohydrate: number; protein: number; fat: number;
  };
  omissionImpactEvidence?: string;
}
export interface Calculation {
  recipeId: string; sourceHash: string; calculatedAt: string; servings: number;
  scope: string; reviewerStatus: "AUTOMATED ONLY"; ingredients: IngredientInput[];
  // Available carbohydrate is normalized to the same basis before aggregation.
  carbohydrateOutput: "AVAILABLE_EXCLUDING_FIBRE";
}
export const emptyValues = (): Values => Object.fromEntries(nutrients.map((n) => [n, null])) as Values;
export const allowedOmissionErrorPerServing = {
  kcal: 10, netCarbohydrate: 1, totalCarbohydrate: 1, protein: 1, fat: 1,
} as const;
const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0;
type Fraction = { n: bigint; d: bigint };
const fraction = (n: bigint, d: bigint): Fraction => {
  let a = n < 0n ? -n : n, b = d;
  while (b) { const remainder = a % b; a = b; b = remainder; }
  return { n: n / (a || 1n), d: d / (a || 1n) };
};
const decimal = (value: number): Fraction => {
  if (!valid(value)) throw Error("Invalid decimal input");
  const [mantissa, exp = "0"] = String(value).split("e"), [whole, tail = ""] = mantissa.split(".");
  const shift = Number(exp) - tail.length, digits = BigInt(whole + tail);
  return shift >= 0 ? fraction(digits * 10n ** BigInt(shift), 1n) : fraction(digits, 10n ** BigInt(-shift));
};
const multiply = (a: Fraction, b: Fraction) => fraction(a.n * b.n, a.d * b.d);
const add = (a: Fraction, b: Fraction) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
const numeric = (value: Fraction) => Number(value.n) / Number(value.d);
const roundFraction = (value: Fraction, decimals = 2): number => {
  const scaled = value.n * 10n ** BigInt(decimals);
  const rounded = scaled / value.d + (scaled % value.d * 2n >= value.d ? 1n : 0n);
  return Number(`${rounded}e-${decimals}`);
};
export function round(value: number, decimals = 2): number {
  if (!valid(value) || !Number.isInteger(decimals) || decimals < 0 || decimals > 6) throw Error("Invalid rounding input");
  return roundFraction(decimal(value), decimals);
}
function nutrientValue(record: FoodRecord, nutrient: "carbohydrate" | "fibre" | "polyols"): number | null | undefined {
  const component = ({ carbohydrate: "CHO", fibre: "FIBT", polyols: "POLYL" } as const)[nutrient];
  if (!record.componentValues) return record.per100g[nutrient];
  const expectedId = { CHO: 2034, FIBT: 2168, POLYL: 2260 }[component];
  if (record.componentIds?.[component] !== expectedId || !Object.hasOwn(record.componentValues, component)) {
    throw Error(`Missing or mismatched Fineli component mapping for ${component}`);
  }
  const componentValue = record.componentValues[component];
  const summaryValue = record.per100g[nutrient];
  if (componentValue !== null && summaryValue !== componentValue) throw Error(`Fineli ${component} does not match its normalized value`);
  return componentValue;
}
export function normalizeCarbohydrate(record: FoodRecord, subtractFibre = record.carbohydrateDefinition === "US_TOTAL_INCLUDING_FIBRE") {
  if (subtractFibre && record.carbohydrateDefinition !== "US_TOTAL_INCLUDING_FIBRE") throw Error("Fibre would be subtracted twice or definition is unknown");
  const carbohydrate = nutrientValue(record, "carbohydrate");
  const fibre = nutrientValue(record, "fibre");
  const polyols = nutrientValue(record, "polyols");
  let available: number | null = null;
  if (record.carbohydrateDefinition === "EU_AVAILABLE" && valid(carbohydrate)) available = carbohydrate;
  if (record.carbohydrateDefinition === "US_TOTAL_INCLUDING_FIBRE" && subtractFibre && valid(carbohydrate) && valid(fibre)) {
    if (fibre > carbohydrate) throw Error("Conflicting carbohydrate definition: fibre exceeds total");
    available = carbohydrate - fibre;
  }
  // No blanket polyol subtraction, including erythritol. A future policy needs evidence.
  return { available, net: polyols === 0 ? available : null };
}
/**
 * Total carbohydrate for this site's display means available carbohydrate +
 * dietary fibre + polyols. Fineli's CHO value is available carbohydrate even
 * though its component type is named TOTALCAR. Missing fibre/polyol data is
 * never treated as zero.
 */
export function totalCarbohydrate(available: number | null, fibre: number | null, polyols: number | null): number | null {
  if (!valid(available) || !valid(fibre) || !valid(polyols)) return null;
  return round(available + fibre + polyols, 6);
}
export function calculate(input: Calculation) {
  if (!Number.isInteger(input.servings) || input.servings <= 0) throw Error("Invalid servings");
  if (!input.recipeId || !/^[a-f0-9]{64}$/.test(input.sourceHash) || !/^\d{4}-\d{2}-\d{2}$/.test(input.calculatedAt) || !input.scope || input.reviewerStatus !== "AUTOMATED ONLY" || input.carbohydrateOutput !== "AVAILABLE_EXCLUDING_FIBRE" || !input.ingredients.length) throw Error("Incomplete calculation provenance");
  const exactRows: Record<Nutrient, Fraction | null>[] = [];
  const exactMasses: (Fraction | null)[] = [];
  const omissionImpactUpperBoundPerServing = { kcal: 0, netCarbohydrate: 0, totalCarbohydrate: 0, protein: 0, fat: 0 };
  let omissionImpactUnbounded = false;
  const rows = input.ingredients.map((ingredient) => {
    const issues: string[] = [];
    const fail = (message: string) => issues.push(message);
    if (ingredient.excludedReason) {
      const impact = ingredient.omissionImpactUpperBoundPerServing;
      const fields = Object.keys(allowedOmissionErrorPerServing) as (keyof typeof allowedOmissionErrorPerServing)[];
      if (!ingredient.omissionImpactEvidence || !impact || fields.some((key) => !valid(impact[key]))) omissionImpactUnbounded = true;
      else for (const key of fields) omissionImpactUpperBoundPerServing[key] += impact[key];
      return { item: ingredient.item, excluded: ingredient.excludedReason, grams: null, values: emptyValues(), issues };
    }
    const exact = Object.fromEntries(nutrients.map((n) => [n, null])) as Record<Nutrient, Fraction | null>;
    exactRows.push(exact);
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
    if (record?.componentValues) {
      for (const key of ["carbohydrate", "fibre", "polyols"] as const) {
        try { const value = nutrientValue(record, key); if (value !== null && !valid(value)) fail(`Invalid component value ${key}`); }
        catch (error) { fail(String(error)); }
      }
    }
    const exactMass = issues.length ? null : [ingredient.amount!, factor!, ingredient.edibleFraction!].map(decimal).reduce(multiply);
    exactMasses.push(exactMass);
    const grams = exactMass ? numeric(exactMass) : null;
    if (grams !== null && record) {
      const weight = multiply(multiply(exactMass!, decimal(ingredient.retainedFraction!)), { n: 1n, d: 100n });
      for (const key of nutrients) if (key !== "netCarbohydrate") {
        const nutrient = key === "carbohydrate" || key === "fibre" || key === "polyols" ? nutrientValue(record, key) : record.per100g[key];
        if (valid(nutrient)) exact[key] = multiply(decimal(nutrient), weight);
      }
      try {
        const carb = normalizeCarbohydrate(record);
        let available = carb.available === null ? null : decimal(nutrientValue(record, "carbohydrate")!);
        if (available && record.carbohydrateDefinition === "US_TOTAL_INCLUDING_FIBRE") { const fibre = decimal(nutrientValue(record, "fibre")!); available = add(available, { n: -fibre.n, d: fibre.d }); }
        exact.carbohydrate = available ? multiply(available, weight) : null;
        exact.netCarbohydrate = carb.net === null ? null : exact.carbohydrate;
      } catch (error) { exact.carbohydrate = null; fail(String(error)); }
      for (const key of nutrients) values[key] = exact[key] ? numeric(exact[key]!) : null;
      for (const key of nutrients) if (values[key] === null) fail(`Unknown nutrient ${key}`);
    }
    return { item: ingredient.item, recordId: record?.id ?? null, grams, values, issues };
  });
  const total = emptyValues(), perServing = emptyValues();
  for (const key of nutrients) {
    if (exactRows.length && exactRows.every((row) => row[key] !== null)) {
      const sum = exactRows.map((row) => row[key]!).reduce(add);
      total[key] = roundFraction(sum); perServing[key] = roundFraction(multiply(sum, { n: 1n, d: BigInt(input.servings) }));
    }
  }
  const exactTotalCarbohydrate = exactRows.length && exactRows.every((row) => row.carbohydrate !== null && row.fibre !== null && row.polyols !== null)
    ? exactRows.map((row) => add(add(row.carbohydrate!, row.fibre!), row.polyols!)).reduce(add)
    : null;
  const totalCarbohydrateGrams = exactTotalCarbohydrate === null ? null : roundFraction(exactTotalCarbohydrate);
  const totalCarbohydratePerServingG = exactTotalCarbohydrate === null
    ? null
    : roundFraction({ n: exactTotalCarbohydrate.n, d: exactTotalCarbohydrate.d * BigInt(input.servings) });
  const omissionWithinTolerance = !omissionImpactUnbounded &&
    Object.entries(allowedOmissionErrorPerServing).every(([key, allowed]) => omissionImpactUpperBoundPerServing[key as keyof typeof omissionImpactUpperBoundPerServing] <= allowed);
  return { ...input, rows, total, perServing, totalCarbohydrateGrams, totalCarbohydratePerServingG,
    edibleInputGrams: exactMasses.length && exactMasses.every((m) => m !== null) ? roundFraction((exactMasses as Fraction[]).reduce(add)) : null,
    omissionImpactUpperBoundPerServing, omissionWithinTolerance,
    status: nutrients.every((n) => total[n] !== null) && omissionWithinTolerance ? "ESTIMATE WITH EVIDENCE" : "INSUFFICIENT SOURCE DATA" };
}
