import { calculate, type Calculation, type FoodRecord, type IngredientInput } from "./nutrition-model";
export function salmonScenario(ingredients: IngredientInput[], records: FoodRecord[]) {
  const matches = ingredients.filter((i) => i.item === "lohifilee");
  const foods = records.filter((r) => r.id === "fineli-34255-search-snapshot-2026-10-22");
  if (matches.length !== 1 || foods.length !== 1 || matches[0].unit !== "g" || !(matches[0].amount! > 0)) throw Error("Salmon pilot requires one identified lohifilee gram input and one identified Fineli record");
  const record = foods[0];
  if (record.state !== "raw-edible-fillet" || record.basis !== "per100g-edible") throw Error("Salmon record basis changed; review matching evidence");
  return ingredients.map((ingredient) => ingredient !== matches[0] ? ingredient : { ...ingredient, record, state: record.state, matchEvidence: "Conditional raw farmed Salmo salar contribution using current recipe quantity; species not confirmed by recipe", edibleFraction: 1, edibleEvidence: "Conditional raw edible fillet input, Fineli record edible share 100%", retainedFraction: 1, retentionEvidence: "Input nutrient contribution only, no claim about cooked retention" });
}
export function salmonComparison(input: Calculation, existingProtein: number | null) {
  const salmon = input.ingredients.filter((i) => i.record?.id === "fineli-34255-search-snapshot-2026-10-22");
  if (salmon.length !== 1) throw Error("Salmon contribution is ambiguous or missing");
  const perServing = calculate({ ...input, ingredients: salmon }).perServing;
  const protein = perServing.protein;
  const conflict = protein !== null && existingProtein !== null && protein > existingProtein;
  return { conditionalSalmonPerServing: perServing,
    comparison: `Conditional salmon input protein/serving: ${protein ?? "unknown"} g; existing whole-dish protein/serving: ${existingProtein ?? "unknown"} g. ${conflict ? "Input exceeds existing estimate; investigate species/weights/retention." : "No demonstrated excess; full dish comparison remains blocked."} Do not overwrite.`,
    comparisonStatus: conflict ? "CONFLICT REQUIRES REVIEW" : "INSUFFICIENT SOURCE DATA" };
}
