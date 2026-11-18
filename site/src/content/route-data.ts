import type { GkPortionCoverage, PortionCarbs, PortionEvidence } from "../features/recipes/gk-portion";
import type { GlycemicLoadPilotPublicResult } from "../generated/glycemic-load-pilot.generated";
import type { GkOnlyVariant, GkVersionCoverage } from "../features/recipes/gk-only-types";
import { homepagePicks, type HomepageTopic } from "../features/recipes/home-preview";
import { paginateRecipeLibrary, parseRecipeLibraryPagePath, recipeLibraryPagePath, recipeLibraryPageSize, type RecipeLibraryPageData } from "../features/recipes/recipe-pagination";
import type { RecipeDietFilter } from "../features/recipes/recipe-search";
import type { RecipeEntry, RecipeLocale } from "../types/content";

export type RecipeSummary = Pick<RecipeEntry, "recipeId" | "locale" | "title" | "category" | "additionalCategories" | "dietClass" | "dietTags" | "glutenFree" | "routePath" | "image" | "description" | "timeTotalMin" | "difficulty" | "tags" | "cuisine" | "ingredientGroups"> & {
  ingredients: Pick<RecipeEntry["ingredients"][number], "item" | "note">[];
};
export type TranslationLink = Pick<RecipeEntry, "locale" | "routePath">;
export interface RecipeCatalog {
  total: number;
  searchFile: string;
  categories: RecipeSummary["category"][];
  diets: Exclude<RecipeDietFilter, "all">[];
  cuisines: string[];
  ingredientGroups: string[];
  hasGlycemicLoad: boolean;
  topics: HomepageTopic[];
}
export interface RouteContent {
  path: string;
  locales: RecipeLocale[];
  recipes: RecipeSummary[];
  recipe: RecipeEntry | null;
  translations: TranslationLink[];
  catalog?: RecipeCatalog;
  pagination?: Omit<RecipeLibraryPageData<RecipeSummary>, "items">;
  glycemicRecipe?: {
    result: GlycemicLoadPilotPublicResult | null;
    variants: GkOnlyVariant[];
    portionEvidence?: PortionEvidence;
    pending?: boolean;
    reviewedNotesHtml?: string;
  };
  glycemicOverview?: {
    results: GlycemicLoadPilotPublicResult[];
    variants: GkOnlyVariant[];
    coverage: GkVersionCoverage;
    reviewedCount: number;
    portionCoverage: GkPortionCoverage;
    carbsByRecipe?: Record<string, PortionCarbs>;
    knownIngredientNames?: Record<string, Partial<Record<RecipeLocale, string>>>;
    portions?: Record<string, PortionEvidence>;
  };
}
export const localeIndexes: Record<RecipeLocale, string> = { fi: "/", en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" };
export function normalizePath(value: string, basePath = "/"): string {
  const pathname = value.split(/[?#]/)[0];
  const prefix = basePath.replace(/\/$/, "");
  const route = prefix && (pathname === prefix || pathname.startsWith(prefix + "/"))
    ? pathname.slice(prefix.length)
    : pathname;
  return route.replace(/\/+$/, "") + "/";
}
export function summarizeRecipe(recipe: RecipeEntry): RecipeSummary {
  const { recipeId, locale, title, category, additionalCategories, dietClass, dietTags, glutenFree, routePath, image, description, timeTotalMin, difficulty, tags, ingredients } = recipe;
  return { recipeId, locale, title, category, ...(additionalCategories?.length ? { additionalCategories } : {}), dietClass, ...(dietTags?.length ? { dietTags } : {}), ...(glutenFree === true ? { glutenFree: true } : {}), routePath, image, description, timeTotalMin, difficulty, tags, cuisine: recipe.cuisine ?? null, ingredientGroups: recipe.ingredientGroups ?? [],
    ingredients: ingredients.map(({ item, note }) => ({ item, ...(note ? { note } : {}) })) };
}
export function recipeLibraryRoutes(recipes: RecipeEntry[]): string[] {
  return (Object.keys(localeIndexes) as RecipeLocale[]).flatMap(locale => {
    const total = recipes.filter(recipe => recipe.locale === locale).length;
    return Array.from({ length: Math.ceil(total / recipeLibraryPageSize) }, (_, index) => recipeLibraryPagePath(locale, index + 1));
  });
}
export function contentForRoute(recipes: RecipeEntry[], route: string, featured = false): RouteContent {
  const path = normalizePath(route);
  const locales = (Object.keys(localeIndexes) as RecipeLocale[]).filter((locale) => recipes.some((recipe) => recipe.locale === locale));
  const indexLocale = locales.find((locale) => localeIndexes[locale] === path);
  const recipe = recipes.find((entry) => entry.routePath === path) ?? null;
  const library = parseRecipeLibraryPagePath(path);
  if (library && locales.includes(library.locale) && !recipe) {
    const count = recipes.filter(entry => entry.locale === library.locale).length;
    if (library.page <= Math.ceil(count / recipeLibraryPageSize)) {
      const { items, ...pagination } = paginateRecipeLibrary(recipes, library.locale, library.page);
      return { path, locales, recipe, recipes: items.map(summarizeRecipe), translations: [], pagination };
    }
  }
  const entries = indexLocale ? recipes.filter(entry => entry.locale === indexLocale) : [];
  return { path, locales, recipe,
    recipes: (featured ? homepagePicks(entries) : entries.slice(0, recipeLibraryPageSize)).map(summarizeRecipe),
    translations: recipe ? recipes.filter((entry) => entry.recipeId === recipe.recipeId).map(({ locale, routePath }) => ({ locale, routePath })) : [],
  };
}
export function serializeRouteContent(content: RouteContent): string {
  return JSON.stringify(content).replaceAll("<", "\\u003c").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}
