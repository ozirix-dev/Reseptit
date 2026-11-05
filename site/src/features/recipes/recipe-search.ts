import type { RecipeLocale } from "@/types/content";
import { cuisines, ingredientGroups } from "@/content/recipe-facets";

import type { RecipeSummary } from "@/content/route-data";

export type RecipeCategory = RecipeSummary["category"] | "all";
export type RecipeDietFilter = "all" | "keto" | "vhh";
export type GlycemicLoadFilterCategory = "low" | "medium" | "high";

export interface RecipeFilters {
  query: string;
  category: RecipeCategory;
  diet: RecipeDietFilter;
  maxTime?: number;
  cuisine?: string;
  ingredient?: string;
  gl?: GlycemicLoadFilterCategory;
}

export const emptyRecipeFilters: RecipeFilters = { query: "", category: "all", diet: "all" };

export function normalizeSearchText(value: string, locale: RecipeLocale = "fi"): string {
  let previousBaseIsThai = false;
  let normalized = "";
  for (const character of value.normalize("NFKD")) {
    if (/\p{M}/u.test(character)) {
      if (previousBaseIsThai) normalized += character;
      continue;
    }
    previousBaseIsThai = /\p{Script=Thai}/u.test(character);
    normalized += character;
  }
  return normalized.toLocaleLowerCase(locale).replace(/\s+/gu, " ").trim();
}

export function parseRecipeFilters(search: string, availableCategories: RecipeCategory[], availableDiets: RecipeDietFilter[] = ["keto", "vhh"]): RecipeFilters {
  const params = new URLSearchParams(search);
  const requestedCategory = params.get("category");
  const category = requestedCategory && availableCategories.includes(requestedCategory as RecipeCategory)
    ? requestedCategory as RecipeCategory
    : "all";
  const requestedDiet = params.get("diet");
  const diet: RecipeDietFilter = (requestedDiet === "keto" || requestedDiet === "vhh") && availableDiets.includes(requestedDiet)
    ? requestedDiet
    : "all";
  const maxTime = Number(params.get("time"));
  const cuisine = params.get("cuisine");
  const ingredient = params.get("ingredient");
  const gl = params.get("gl");
  return { query: (params.get("q") ?? "").replace(/\s+/gu, " ").trim(), category, diet,
    ...([30, 60, 90].includes(maxTime) ? { maxTime } : {}),
    ...(cuisines.includes(cuisine as typeof cuisines[number]) ? { cuisine: cuisine! } : {}),
    ...(ingredientGroups.includes(ingredient as typeof ingredientGroups[number]) ? { ingredient: ingredient! } : {}),
    ...(gl === "low" || gl === "medium" || gl === "high" ? { gl } : {}) };
}

export function recipeFiltersToSearch(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  const query = filters.query.replace(/\s+/gu, " ").trim();
  if (query) params.set("q", query);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.diet !== "all") params.set("diet", filters.diet);
  if (filters.maxTime) params.set("time", String(filters.maxTime));
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.ingredient) params.set("ingredient", filters.ingredient);
  if (filters.gl) params.set("gl", filters.gl);
  const search = params.toString();
  return search ? `?${search}` : "";
}

export function filterRecipes<T extends RecipeSummary>(recipes: T[], filters: RecipeFilters, locale: RecipeLocale, glCategories: Readonly<Record<string, GlycemicLoadFilterCategory>> = {}): T[] {
  const terms = normalizeSearchText(filters.query, locale).split(" ").filter(Boolean);
  return recipes.filter((recipe) => {
    if (filters.maxTime && (recipe.timeTotalMin === null || recipe.timeTotalMin > filters.maxTime)) return false;
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) return false;
    if (filters.ingredient && !recipe.ingredientGroups?.includes(filters.ingredient)) return false;
    if (filters.gl && glCategories[recipe.recipeId] !== filters.gl) return false;
    if (filters.category !== "all" && recipe.category !== filters.category) return false;
    if (filters.diet === "keto" && recipe.dietClass !== "keto") return false;
    if (filters.diet === "vhh" && !recipe.dietClass) return false;
    if (!terms.length) return true;
    const haystack = normalizeSearchText([
      recipe.title,
      recipe.ingredients.map((ingredient) => `${ingredient.item} ${ingredient.note ?? ""}`).join(" "),
      recipe.description,
      recipe.tags.join(" "),
    ].join(" "), locale);
    return terms.every((term) => haystack.includes(term));
  });
}
