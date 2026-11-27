import type { RecipeLocale } from "@/types/content";
import { cuisines, ingredientGroups } from "@/content/recipe-facets";
import { recipeMatchesCategory } from "@/content/recipe-categories";
import {withholdF25Nutrition} from "./f25-nutrition-withhold";

import type { RecipeSummary } from "@/content/route-data";

export type RecipeCategory = RecipeSummary["category"] | "all";
export type RecipeDietFilter = "all" | "keto" | "vhh" | "carnivore" | "vegetarian" | "vegan" | "pescatarian";
export const supportedRecipeDiets: readonly RecipeDietFilter[] = ["keto", "vhh", "carnivore", "vegetarian", "vegan", "pescatarian"];
export type GlycemicLoadFilterCategory = "low" | "medium" | "high";

export interface RecipeFilters {
  query: string;
  category: RecipeCategory;
  diet: RecipeDietFilter;
  maxTime?: number;
  cuisine?: string;
  ingredient?: string;
  gl?: GlycemicLoadFilterCategory;
  glutenFree?: boolean;
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

export function parseRecipeFilters(search: string, availableCategories: RecipeCategory[], availableDiets: RecipeDietFilter[] = [...supportedRecipeDiets]): RecipeFilters {
  const params = new URLSearchParams(search);
  const requestedCategory = params.get("category");
  const category = requestedCategory && availableCategories.includes(requestedCategory as RecipeCategory)
    ? requestedCategory as RecipeCategory
    : "all";
  const requestedDiet = params.get("diet");
  const diet: RecipeDietFilter = requestedDiet && supportedRecipeDiets.includes(requestedDiet as RecipeDietFilter) && availableDiets.includes(requestedDiet as RecipeDietFilter)
    ? requestedDiet as RecipeDietFilter
    : "all";
  const maxTime = Number(params.get("time"));
  const cuisine = params.get("cuisine");
  const ingredient = params.get("ingredient");
  const gl = params.get("gl");
  return { query: (params.get("q") ?? "").replace(/\s+/gu, " ").trim(), category, diet,
    ...([30, 60, 90].includes(maxTime) ? { maxTime } : {}),
    ...(cuisines.includes(cuisine as typeof cuisines[number]) ? { cuisine: cuisine! } : {}),
    ...(ingredientGroups.includes(ingredient as typeof ingredientGroups[number]) ? { ingredient: ingredient! } : {}),
    ...(gl === "low" || gl === "medium" || gl === "high" ? { gl } : {}),
    ...(params.get("gluten_free") === "1" ? { glutenFree: true } : {}) };
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
  if (filters.glutenFree) params.set("gluten_free", "1");
  const search = params.toString();
  return search ? `?${search}` : "";
}

export type SearchRecipe = Omit<RecipeSummary, "ingredients" | "tags"> & { searchText: string };

export function recipeSearchEntry(recipe: RecipeSummary): SearchRecipe {
  const { ingredients, tags, ...card } = recipe;
  const searchText = normalizeSearchText([
    recipe.title, ingredients.map(({ item, note }) => note ? item + " " + note : item).join(" "),
    recipe.description, tags.join(" "),
  ].join(" "), recipe.locale);
  return { ...card, searchText };
}

// A targeted Swedish query alias: the singular rödbeta must also find
// rödbetor, rödbetorna and rödbets- compounds (e.g. rödbetsröra).
// Match word starts, not arbitrary substrings; leave the index and all
// other query terms, locales and structured filters unchanged.
const swedishBeetrootVariants = /(?:^|[^\p{L}\p{M}\p{N}])rodbet(?:or(?:na)?s?(?![\p{L}\p{M}\p{N}])|s)/u;

export function filterRecipes<T extends RecipeSummary | SearchRecipe>(recipes: T[], filters: RecipeFilters, locale: RecipeLocale, glCategories: Readonly<Record<string, GlycemicLoadFilterCategory>> = {}): T[] {
  const terms = normalizeSearchText(filters.query, locale).split(" ").filter(Boolean);
  return recipes.filter((recipe) => {
    if (filters.maxTime && (recipe.timeTotalMin === null || recipe.timeTotalMin > filters.maxTime)) return false;
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) return false;
    if (filters.ingredient && !recipe.ingredientGroups?.includes(filters.ingredient)) return false;
    if (filters.gl && (withholdF25Nutrition(recipe.recipeId, locale) || glCategories[recipe.recipeId] !== filters.gl)) return false;
    if (filters.glutenFree && recipe.glutenFree !== true) return false;
    if (filters.category !== "all" && !recipeMatchesCategory(recipe, filters.category)) return false;
    if (filters.diet === "keto" && recipe.dietClass !== "keto") return false;
    if (filters.diet === "vhh" && !recipe.dietClass) return false;
    if (filters.diet !== "all" && filters.diet !== "keto" && filters.diet !== "vhh" && !recipe.dietTags?.includes(filters.diet)) return false;
    if (!terms.length) return true;
    const haystack = "searchText" in recipe ? recipe.searchText : recipeSearchEntry(recipe).searchText;
    return terms.every((term) => haystack.includes(term) ||
      (locale === "sv" && recipe.locale === "sv" && term === "rodbeta" && swedishBeetrootVariants.test(haystack)));
  });
}
