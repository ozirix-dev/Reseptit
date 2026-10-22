import type { RecipeEntry, RecipeLocale } from "../types/content";

export type RecipeSummary = Pick<RecipeEntry, "recipeId" | "locale" | "title" | "category" | "dietClass" | "routePath" | "image" | "description" | "timeTotalMin" | "difficulty" | "tags"> & {
  ingredients: Pick<RecipeEntry["ingredients"][number], "item" | "note">[];
};
export type TranslationLink = Pick<RecipeEntry, "locale" | "routePath">;
export interface RouteContent {
  path: string;
  locales: RecipeLocale[];
  recipes: RecipeSummary[];
  recipe: RecipeEntry | null;
  translations: TranslationLink[];
}
export const localeIndexes: Record<RecipeLocale, string> = { fi: "/", en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" };
export function normalizePath(value: string): string {
  const pathname = value.split(/[?#]/)[0].replace(/^\/Reseptit(?=\/|$)/, "");
  return `${pathname.replace(/\/+$/, "")}/`;
}
export function summarizeRecipe(recipe: RecipeEntry): RecipeSummary {
  const { recipeId, locale, title, category, dietClass, routePath, image, description, timeTotalMin, difficulty, tags, ingredients } = recipe;
  return { recipeId, locale, title, category, dietClass, routePath, image, description, timeTotalMin, difficulty, tags,
    ingredients: ingredients.map(({ item, note }) => ({ item, ...(note ? { note } : {}) })) };
}
export function contentForRoute(recipes: RecipeEntry[], route: string): RouteContent {
  const path = normalizePath(route);
  const locales = (Object.keys(localeIndexes) as RecipeLocale[]).filter((locale) => recipes.some((recipe) => recipe.locale === locale));
  const indexLocale = locales.find((locale) => localeIndexes[locale] === path);
  const recipe = recipes.find((entry) => entry.routePath === path) ?? null;
  return { path, locales, recipe,
    recipes: indexLocale ? recipes.filter((entry) => entry.locale === indexLocale).map(summarizeRecipe) : [],
    translations: recipe ? recipes.filter((entry) => entry.recipeId === recipe.recipeId).map(({ locale, routePath }) => ({ locale, routePath })) : [],
  };
}
export function serializeRouteContent(content: RouteContent): string {
  return JSON.stringify(content).replaceAll("<", "\\u003c").replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}
