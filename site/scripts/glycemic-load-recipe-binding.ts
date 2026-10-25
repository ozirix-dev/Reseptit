import { createHash } from "node:crypto";
import { parseMarkdown } from "../src/content/markdown";

export type RecipeIngredientAlias = { canonical: string; evidence: string };

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
  const section = (heading: string) => {
    const match = new RegExp(`^##\\s+${heading}\\s*\\r?\\n([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, "im").exec(parsed.content);
    return (match?.[1] ?? "").replace(/\r\n/g, "\n").trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  };
  const normalized = {
    recipeId,
    servings,
    ingredients: ingredients.map((ingredient) => {
      if (!ingredient || typeof ingredient !== "object") throw new Error(`Invalid ingredient in recipe binding: ${recipeId}`);
      const value = ingredient as Record<string, unknown>;
      return {
        item: (() => {
          const normalizedName = String(value.item ?? "").trim().normalize("NFC").toLocaleLowerCase("fi-FI");
          const alias = aliases[normalizedName];
          if (alias && !alias.evidence.trim()) throw new Error(`Recipe alias lacks evidence: ${normalizedName}`);
          return (alias?.canonical ?? normalizedName).trim().normalize("NFC").toLocaleLowerCase("fi-FI");
        })(),
        amount: value.amount ?? null,
        unit: String(value.unit ?? "").trim().normalize("NFC").toLocaleLowerCase("fi-FI"),
        note: String(value.note ?? "").trim().normalize("NFC").toLocaleLowerCase("fi-FI"),
      };
    }),
    cookingMethod: Array.isArray(data.cooking_method) ? data.cooking_method : [],
    preparation: section("Valmistus"),
    notes: section("Muistiinpanot"),
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
  return createHash("sha256").update(stableStringify(input)).digest("hex");
}
