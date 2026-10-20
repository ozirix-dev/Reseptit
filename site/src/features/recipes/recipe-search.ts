import type { RecipeEntry, RecipeLocale } from "@/types/content";

export type RecipeCategory = RecipeEntry["category"] | "all";
export type RecipeDietFilter = "all" | "keto" | "vhh";

export interface RecipeFilters {
  query: string;
  category: RecipeCategory;
  diet: RecipeDietFilter;
}

export const emptyRecipeFilters: RecipeFilters = { query: "", category: "all", diet: "all" };

export function normalizeSearchText(value: string, locale: RecipeLocale = "fi"): string {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase(locale).replace(/\s+/gu, " ").trim();
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
  return { query: (params.get("q") ?? "").replace(/\s+/gu, " ").trim(), category, diet };
}

export function recipeFiltersToSearch(filters: RecipeFilters): string {
  const params = new URLSearchParams();
  const query = filters.query.replace(/\s+/gu, " ").trim();
  if (query) params.set("q", query);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.diet !== "all") params.set("diet", filters.diet);
  const search = params.toString();
  return search ? `?${search}` : "";
}

export function filterRecipes(recipes: RecipeEntry[], filters: RecipeFilters, locale: RecipeLocale): RecipeEntry[] {
  const terms = normalizeSearchText(filters.query, locale).split(" ").filter(Boolean);
  return recipes.filter((recipe) => {
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
