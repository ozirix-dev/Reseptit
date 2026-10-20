import { siteContent } from "@/generated/content.generated";
import type { RecipeEntry, RecipeLocale } from "@/types/content";

function normalizePath(path: string): string {
  const stripped = path.replace(/^\/Reseptit/, "").replace(/\/$/, "");
  return stripped || "/";
}

export function getRecipes(locale?: RecipeLocale): RecipeEntry[] {
  return siteContent.recipes.filter((recipe) => !locale || recipe.locale === locale);
}

export function getRecipeByPath(path: string): RecipeEntry | undefined {
  const normalized = normalizePath(path);
  return siteContent.recipes.find((recipe) => normalizePath(recipe.routePath) === normalized);
}

export function getRecipeTranslations(recipe: RecipeEntry): RecipeEntry[] {
  return siteContent.recipes.filter((entry) => entry.recipeId === recipe.recipeId);
}
