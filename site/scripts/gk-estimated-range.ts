import { gkEstimate } from "../src/features/recipes/gk-estimate";

export type GkScenarioIngredient = {
  id: string;
  gi: number;
  choSource: string;
  giSource: string;
  applicability: string;
} & (
  | { grams: number; availableChoPer100g: number }
  | { batchAvailableCho: number }
);

export type GkScenario = {
  id: string;
  rationale: string;
  ingredients: readonly GkScenarioIngredient[];
};

/** Scenarios describe whole batches. CHO, mass and GI stay paired within each row. */
export function calculateGkScenarios(
  servings: number,
  ingredientIds: readonly string[],
  scenarios: readonly GkScenario[],
) {
  if (!Number.isInteger(servings) || servings < 1 || !ingredientIds.length ||
      new Set(ingredientIds).size !== ingredientIds.length || ingredientIds.some(id => !id.trim())) {
    throw new Error("Invalid recipe scope");
  }
  const expected = new Set(ingredientIds);
  const scenarioIds = new Set<string>();
  const totals = scenarios.map(scenario => {
    if (!scenario.id.trim() || !scenario.rationale.trim() || scenarioIds.has(scenario.id)) {
      throw new Error("Each scenario needs a unique ID and rationale");
    }
    scenarioIds.add(scenario.id);
    const seen = new Set<string>();
    let total = 0;
    for (const row of scenario.ingredients) {
      const batchCho = "batchAvailableCho" in row ? row.batchAvailableCho : row.grams * row.availableChoPer100g / 100;
      const invalidComposition = !("batchAvailableCho" in row) &&
        (![row.grams, row.availableChoPer100g].every(value => Number.isFinite(value) && value >= 0) ||
          row.availableChoPer100g > 100);
      if (!expected.has(row.id) || seen.has(row.id) ||
          invalidComposition || ![batchCho, row.gi].every(value => Number.isFinite(value) && value >= 0) || !row.choSource.trim() || !row.giSource.trim() || !row.applicability.trim()) {
        throw new Error(`Invalid scenario ingredient: ${scenario.id}/${row.id}`);
      }
      seen.add(row.id);
      total += batchCho * row.gi / 100;
    }
    if (seen.size !== expected.size || !Number.isFinite(total)) throw new Error(`Incomplete scenario: ${scenario.id}`);
    return { id: scenario.id, value: total / servings };
  });
  if (!totals.length) return { estimate: gkEstimate(null), totals };
  const min = Math.min(...totals.map(row => row.value));
  const max = Math.max(...totals.map(row => row.value));
  return { estimate: min === max ? gkEstimate(min) : gkEstimate(null, { min, max }), totals };
}
