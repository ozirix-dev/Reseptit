import { cuisines, ingredientGroups } from "../../content/recipe-facets";
import type { RecipeCategory, RecipeDietFilter, RecipeFilters } from "../recipes/recipe-search";
import { emptyRecipeFilters } from "../recipes/recipe-search";
import type { AssistantCatalog, AssistantCatalogRecipe } from "./catalog";
import { findAssistantRecipe, searchAssistantCatalog } from "./catalog";

/**
 * A4 offline-only intent contract. An LLM output is untrusted JSON, never
 * permission to invent a recipe, URL, nutrient, GK estimate or user action.
 * No provider, network, credentials or billing integration lives here.
 */
export type AssistantIntent =
  | { version: 1; action: "search"; filters: Partial<RecipeFilters> }
  | { version: 1; action: "compare"; recipeIds: [string, string] }
  | { version: 1; action: "clarify"; reason: "missing_information" | "ambiguous_request" }
  | { version: 1; action: "unsupported"; reason: "medical" | "unverified_gk" | "outside_scope" | "prompt_injection" };

export type AssistantResolution =
  | { action: "search"; status: "ok" | "requires_gk_evidence"; filters: RecipeFilters; results: AssistantCatalogRecipe[] }
  | { action: "compare"; status: "ok"; results: [AssistantCatalogRecipe, AssistantCatalogRecipe] }
  | { action: "clarify"; status: "ok"; reason: "missing_information" | "ambiguous_request" }
  | { action: "unsupported"; status: "ok"; reason: "medical" | "unverified_gk" | "outside_scope" | "prompt_injection" };

const categories: readonly RecipeCategory[] = ["all", "aamupala", "valipala", "alkuruoka", "paaruoka", "jalkiruoka", "leivonnainen"];
const diets: readonly RecipeDietFilter[] = ["all", "keto", "vhh"];
const maxTimes = [30, 60, 90] as const;
const glCategories = ["low", "medium", "high"] as const;
const fields = ["query", "category", "diet", "maxTime", "cuisine", "ingredient", "gl"] as const;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function keysAre(value: Record<string, unknown>, allowed: readonly string[]): boolean {
  return Object.keys(value).every((key) => allowed.includes(key)) && Object.keys(value).every((key) => key !== "__proto__");
}

function parseSearchFilters(value: unknown): Partial<RecipeFilters> {
  if (!record(value) || !keysAre(value, fields)) throw new Error("Invalid assistant search filters");
  const parsed: Partial<RecipeFilters> = {};
  if ("query" in value) {
    if (typeof value.query !== "string" || value.query.length > 120 || /[\u0000-\u001f\u007f]/u.test(value.query)) {
      throw new Error("Invalid assistant search query");
    }
    parsed.query = value.query.replace(/\s+/gu, " ").trim();
  }
  if ("category" in value) {
    if (!categories.includes(value.category as RecipeCategory)) throw new Error("Invalid assistant category");
    parsed.category = value.category as RecipeCategory;
  }
  if ("diet" in value) {
    if (!diets.includes(value.diet as RecipeDietFilter)) throw new Error("Invalid assistant diet");
    parsed.diet = value.diet as RecipeDietFilter;
  }
  if ("maxTime" in value) {
    if (typeof value.maxTime !== "number" || !maxTimes.some((time) => time === value.maxTime)) throw new Error("Invalid assistant time");
    parsed.maxTime = value.maxTime;
  }
  if ("cuisine" in value) {
    if (typeof value.cuisine !== "string" || !cuisines.includes(value.cuisine as typeof cuisines[number])) throw new Error("Invalid assistant cuisine");
    parsed.cuisine = value.cuisine;
  }
  if ("ingredient" in value) {
    if (typeof value.ingredient !== "string" || !ingredientGroups.includes(value.ingredient as typeof ingredientGroups[number])) {
      throw new Error("Invalid assistant ingredient group");
    }
    parsed.ingredient = value.ingredient;
  }
  if ("gl" in value) {
    if (!glCategories.includes(value.gl as typeof glCategories[number])) throw new Error("Invalid assistant GK category");
    parsed.gl = value.gl as RecipeFilters["gl"];
  }
  return parsed;
}

export function parseAssistantIntent(value: unknown): AssistantIntent {
  if (!record(value) || value.version !== 1 || typeof value.action !== "string") {
    throw new Error("Unsupported assistant intent schema");
  }
  switch (value.action) {
    case "search": {
      if (!keysAre(value, ["version", "action", "filters"])) throw new Error("Model search includes forbidden fields");
      return { version: 1, action: "search", filters: parseSearchFilters(value.filters) };
    }
    case "compare": {
      if (!keysAre(value, ["version", "action", "recipeIds"]) || !Array.isArray(value.recipeIds) || value.recipeIds.length !== 2 ||
          !value.recipeIds.every((id: unknown) => typeof id === "string" && idPattern.test(id)) ||
          value.recipeIds[0] === value.recipeIds[1]) throw new Error("Invalid assistant comparison");
      return { version: 1, action: "compare", recipeIds: [value.recipeIds[0], value.recipeIds[1]] };
    }
    case "clarify": {
      if (!keysAre(value, ["version", "action", "reason"]) ||
          (value.reason !== "missing_information" && value.reason !== "ambiguous_request")) throw new Error("Invalid assistant clarification");
      return { version: 1, action: "clarify", reason: value.reason };
    }
    case "unsupported": {
      if (!keysAre(value, ["version", "action", "reason"]) ||
          !["medical", "unverified_gk", "outside_scope", "prompt_injection"].includes(String(value.reason))) {
        throw new Error("Invalid assistant unsupported reason");
      }
      return { version: 1, action: "unsupported", reason: value.reason as Extract<AssistantIntent, { action: "unsupported" }>["reason"] };
    }
    default:
      throw new Error("Unknown assistant action");
  }
}

/** Never trust model-proposed ID, URL, title, macro or GK fields. */
export function resolveAssistantIntent(catalog: AssistantCatalog, input: unknown): AssistantResolution {
  const intent = parseAssistantIntent(input);
  if (intent.action === "search") {
    const filters: RecipeFilters = { ...emptyRecipeFilters, ...intent.filters };
    const result = searchAssistantCatalog(catalog, filters);
    return { action: "search", status: result.status, filters, results: result.recipes.slice(0, 5) };
  }
  if (intent.action === "compare") {
    const a = findAssistantRecipe(catalog, intent.recipeIds[0]);
    const b = findAssistantRecipe(catalog, intent.recipeIds[1]);
    if (!a || !b) throw new Error("Comparison requires two published recipes in the requested locale");
    return { action: "compare", status: "ok", results: [a, b] };
  }
  return { action: intent.action, status: "ok", reason: intent.reason };
}
