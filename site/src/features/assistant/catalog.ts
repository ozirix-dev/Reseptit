import type { RecipeEntry, RecipeLocale } from "../../types/content";
import { localeIndexes, summarizeRecipe, type RecipeSummary } from "../../content/route-data";
import { filterRecipes, type GlycemicLoadFilterCategory, type RecipeFilters } from "../recipes/recipe-search";
import {withholdF25Nutrition, publicF25GkFilterCategories} from "../recipes/f25-nutrition-withhold";

/**
 * A1 is a read-only projection of the *already published* recipe build.
 * It is not a second nutrition/GK calculator or an AI-generated recipe source.
 * The build supplies the SHA-256 of each complete RecipeEntry.
 */
export interface AssistantCatalogRecipe extends Omit<RecipeSummary, "image" | "ingredients"> {
  image: null; // Avoid old-origin image URLs and image srcSet duplication in the lightweight catalog.
  ingredients: RecipeEntry["ingredients"];
  servings: number;
  nutritionPerServing: RecipeEntry["nutrition"];
  sourceVersion: string;
  publishedTranslations: Partial<Record<RecipeLocale, string>>;
}

export interface AssistantCatalog {
  schemaVersion: 1;
  locale: RecipeLocale;
  recipes: AssistantCatalogRecipe[];
}

const locales: readonly RecipeLocale[] = ["fi", "en", "sv", "th"];
const sourceHashPattern = /^[0-9a-f]{64}$/;
const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertSourceRecipe(recipe: RecipeEntry): void {
  // RecipeEntry is produced after the published-only Markdown build filter.
  // Reject an accidentally forwarded raw draft at runtime as well.
  if ("status" in recipe && recipe.status !== "published") {
    throw new Error(`Assistant catalog rejects an unpublished source: ${recipe.recipeId}`);
  }
  if (!locales.includes(recipe.locale) || !safeSlugPattern.test(recipe.recipeId) || !safeSlugPattern.test(recipe.slug)) {
    throw new Error(`Assistant catalog has an invalid recipe identity: ${recipe.recipeId}`);
  }
  if (recipe.routePath !== `${localeIndexes[recipe.locale]}${recipe.slug}/`) {
    throw new Error(`Assistant catalog route is not the canonical published route: ${recipe.recipeId}`);
  }
  if (!Number.isInteger(recipe.servings) || recipe.servings < 1) {
    throw new Error(`Assistant catalog has invalid servings: ${recipe.recipeId}`);
  }
  for (const [field, value] of Object.entries(recipe.nutrition)) {
    if (value !== null && (typeof value !== "number" || !Number.isFinite(value) || value < 0)) {
      throw new Error(`Assistant catalog has invalid published nutrition field ${field}: ${recipe.recipeId}`);
    }
  }
}

/** Build only from buildRecipes() output; never from drafts or user suggestions. */
export function createAssistantCatalog(
  publishedRecipes: readonly RecipeEntry[],
  locale: RecipeLocale,
  sourceSha256: (recipe: RecipeEntry) => string,
): AssistantCatalog {
  if (!locales.includes(locale)) throw new Error("Unsupported assistant catalog locale");

  const seenIds = new Set<string>();
  const seenRoutes = new Set<string>();
  const translations = new Map<string, Partial<Record<RecipeLocale, string>>>();
  for (const recipe of publishedRecipes) {
    assertSourceRecipe(recipe);
    const key = `${recipe.locale}:${recipe.recipeId}`;
    if (seenIds.has(key) || seenRoutes.has(recipe.routePath)) {
      throw new Error(`Assistant catalog has a duplicated published identity or route: ${key}`);
    }
    seenIds.add(key);
    seenRoutes.add(recipe.routePath);
    translations.set(recipe.recipeId, { ...translations.get(recipe.recipeId), [recipe.locale]: recipe.routePath });
  }

  const recipes = publishedRecipes.filter((recipe) => recipe.locale === locale).map((recipe): AssistantCatalogRecipe => {
    const sourceVersion = sourceSha256(recipe);
    if (!sourceHashPattern.test(sourceVersion)) {
      throw new Error(`Assistant catalog requires a SHA-256 source version: ${recipe.recipeId}`);
    }
    return {
      ...summarizeRecipe(recipe),
      image: null,
      ingredients: recipe.ingredients.map(({ amount, unit, item, note }) => ({
        amount, unit, item, ...(note !== undefined ? { note } : {}),
      })),
      servings: recipe.servings,
      nutritionPerServing: withholdF25Nutrition(recipe.recipeId, recipe.locale)
        ? {carbsNetG:null, carbsTotalG:null, proteinG:null, fatG:null}
        : { ...recipe.nutrition }, // Withheld or unknown must stay null, never become zero.
      sourceVersion,
      publishedTranslations: { ...translations.get(recipe.recipeId) },
    };
  });
  return { schemaVersion: 1, locale, recipes };
}

export type AssistantSearchResult =
  | { status: "ok"; recipes: AssistantCatalogRecipe[] }
  | { status: "requires_gk_evidence"; recipes: [] };

/**
 * Use exactly the site's existing filterRecipes semantics.
 * GL categories must come from the *approved published* original GK filter map.
 * Without that map, a GK-filtered request explicitly fails closed.
 * A1 never exposes or calculates numerical GK.
 */
export function searchAssistantCatalog(
  catalog: AssistantCatalog,
  filters: RecipeFilters,
  approvedGlCategories?: Readonly<Record<string, GlycemicLoadFilterCategory>>,
): AssistantSearchResult {
  if (filters.gl && !approvedGlCategories) return { status: "requires_gk_evidence", recipes: [] };
  return {
    status: "ok",
    recipes: filterRecipes(catalog.recipes, filters, catalog.locale,
      publicF25GkFilterCategories(approvedGlCategories ?? {}, catalog.locale)),
  };
}

/** Return only a real, locale-specific published result; never synthesize a URL. */
export function findAssistantRecipe(catalog: AssistantCatalog, recipeId: string): AssistantCatalogRecipe | null {
  return catalog.recipes.find((recipe) => recipe.recipeId === recipeId && recipe.locale === catalog.locale) ?? null;
}
