import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";
import type { FoodRecord } from "./nutrition-model";
import type { GlycemicIndexRecord, GlycemicLoadRecipeInput } from "./glycemic-load-model";

export type RecipeIngredientAlias = { canonical: string; evidence: string };

function normalizeText(value: unknown): string {
  return String(value ?? "").normalize("NFC").toLocaleLowerCase("fi-FI")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{N}%]+/gu, " ")
    .trim().replace(/\s+/g, " ");
}

function ingredientStates(value: Record<string, unknown>): string[] {
  const text = normalizeText(`${String(value.item ?? "")} ${String(value.note ?? "")}`);
  const states: Array<[string, string[]]> = [
    ["raw", ["raw", "raakana", "raaka"]],
    ["dry", ["dry", "dried", "uncooked", "kuivana", "kuivattu", "kuivattua", "kuivaa", "kuivan"]],
    ["cooked", ["cooked", "boiled", "kypsä", "kypsänä", "kypsää", "kypsennetty", "keitetty", "kypsiä"]],
    ["drained", ["drained", "valutettu", "valutettuina", "valutettuja"]],
    ["peeled", ["peeled", "kuorittu", "kuorittua", "kuorittuna", "kuorittua"]],
    ["unpeeled", ["unpeeled", "kuorimaton", "kuorimattomana"]],
    ["skinless", ["skinless", "nahaton", "nahatonta", "nahattomana", "nahatonta"]],
    ["boneless", ["boneless", "luuton", "luutonta", "luuttomana"]],
    ["sweetened", ["sweetened", "sokeroitu", "sokeroitua"]],
    ["unsweetened", ["unsweetened", "makeuttamaton", "makeuttamatonta"]],
    ["optional", ["optional", "valinnainen", "valinnaista"]],
    ["canned", ["canned", "säilyke", "säilykkeenä", "tölkitetty"]],
    ["salted", ["salted", "suolattu", "suolattua"]],
  ];
  const words = new Set(text.split(" "));
  return states.filter(([, variants]) => variants.some((variant) => words.has(variant))).map(([state]) => state);
}

export function recipeBindingHash(markdown: string, aliases: Record<string, RecipeIngredientAlias> = {}): string {
  const parsed = parseMarkdown(markdown);
  if (!parsed) throw new Error("Cannot bind GL inputs to recipe content without frontmatter.");
  const data = parsed.data;
  const recipeId = String(data.recipe_id ?? "");
  const servings = data.servings;
  const ingredients = data.ingredients;
  if (!recipeId || !Number.isInteger(servings) || !Array.isArray(ingredients)) {
    throw new Error("Recipe binding requires recipe_id, integer servings and structured ingredients.");
  }
  const normalized = {
    recipeId,
    servings,
    ingredients: ingredients.map((ingredient) => {
      if (!ingredient || typeof ingredient !== "object") throw new Error(`Invalid ingredient in recipe binding: ${recipeId}`);
      const value = ingredient as Record<string, unknown>;
      return {
        item: (() => {
          const normalizedName = normalizeText(value.item);
          const alias = aliases[normalizedName];
          if (alias && !alias.evidence.trim()) throw new Error(`Recipe alias lacks evidence: ${normalizedName}`);
          return normalizeText(alias?.canonical ?? normalizedName);
        })(),
        amount: value.amount ?? null,
        unit: normalizeText(value.unit),
        states: ingredientStates({ ...value, item: aliases[normalizeText(value.item)]?.canonical ?? value.item }),
      };
    }),
    cookingMethod: Array.isArray(data.cooking_method)
      ? data.cooking_method.map(normalizeText)
      : [],
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

export function recipeBindingMatches(expected: string | null | undefined, current: string): boolean {
  return typeof expected === "string" && expected.length === 64 && expected === current;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function glycemicLoadInputHash(input: unknown): string {
  const value = input as GlycemicLoadRecipeInput;
  const calculation = {
    recipeId: value.recipeId,
    servings: value.servings,
    ingredients: value.ingredients.map((ingredient) => ({
      name: normalizeText(ingredient.name),
      grams: ingredient.grams,
      fineliRecordId: ingredient.fineliRecordId,
      giRecordId: ingredient.giRecordId,
      foodKey: ingredient.foodKey ?? null,
      preparationKey: ingredient.preparationKey ?? null,
      excludedState: ingredient.excludedReason
        ? ingredient.estimatedAvailableCarbohydratePerServingG === 0 ? "documented-zero"
          : typeof ingredient.estimatedAvailableCarbohydratePerServingG === "number" ? "small-estimate" : "unknown"
        : null,
      estimatedAvailableCarbohydratePerServingG: ingredient.estimatedAvailableCarbohydratePerServingG ?? null,
      carbohydrateRange: ingredient.availableCarbohydratePer100gRange
        ? { min: ingredient.availableCarbohydratePer100gRange.min, max: ingredient.availableCarbohydratePer100gRange.max }
        : null,
      hasMassEvidence: Boolean(ingredient.massEvidence),
      hasGiMatchEvidence: Boolean(ingredient.giMatchEvidence),
    })),
  };
  return createHash("sha256").update(stableStringify(calculation)).digest("hex");
}

/** Hash only source fields that can change available-carbohydrate or GI calculations. */
export function glycemicLoadEvidenceHash(
  input: GlycemicLoadRecipeInput,
  foodRecords: FoodRecord[],
  giRecords: GlycemicIndexRecord[],
): string {
  const foodById = new Map(foodRecords.map((record) => [record.id, record]));
  const giById = new Map(giRecords.map((record) => [record.id, record]));
  const foodIds = [...new Set(input.ingredients.flatMap((ingredient) => ingredient.fineliRecordId ? [ingredient.fineliRecordId] : []))].sort();
  const giIds = [...new Set(input.ingredients.flatMap((ingredient) => ingredient.giRecordId ? [ingredient.giRecordId] : []))].sort();
  return createHash("sha256").update(stableStringify({
    foods: foodIds.map((id) => {
      const record = foodById.get(id);
      return record ? {
        id: record.id,
        name: normalizeText(record.name),
        sourceUrl: record.sourceUrl,
        state: normalizeText(record.state),
        basis: record.basis,
        carbohydrateDefinition: record.carbohydrateDefinition,
        carbohydratePer100g: record.componentValues && Object.hasOwn(record.componentValues, "CHO")
          ? record.componentValues.CHO : record.per100g.carbohydrate,
      } : { id, missing: true };
    }),
    gi: giIds.map((id) => {
      const record = giById.get(id);
      return record ? {
        id: record.id,
        gi: record.gi,
        foodKey: normalizeText(record.foodKey),
        preparationKey: normalizeText(record.preparationKey),
        qualityTier: record.qualityTier,
        referenceScale: record.referenceScale,
        matchKind: record.matchKind ?? "EXACT",
        confidence: record.confidence ?? null,
        source: {
          url: record.source.url,
          table: normalizeText(record.source.table),
          year: record.source.year,
          published: record.source.published,
          iso26642Confirmed: record.source.iso26642Confirmed,
          qualityEvidence: normalizeText(record.source.qualityEvidence),
        },
      } : { id, missing: true };
    }),
  })).digest("hex");
}
