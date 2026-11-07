import type { RecipeLocale } from "../../types/content";
import { localeIndexes } from "../../content/route-data";
import type { RecipeFilters } from "../recipes/recipe-search";
import { emptyRecipeFilters } from "../recipes/recipe-search";
import type { AssistantCatalog, AssistantCatalogRecipe } from "./catalog";
import { searchAssistantCatalog } from "./catalog";

/** A2: deterministic browser-only prototype. No server calls containing user text. */
export type DemoPreset = "keto-30" | "breakfast" | "snack";
export type DemoSearch =
  | { kind: "preset"; preset: DemoPreset }
  | { kind: "text"; text: string };

const locales: readonly RecipeLocale[] = ["fi", "en", "sv", "th"];
const asciiSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sha256Pattern = /^[a-f0-9]{64}$/;
const pathPattern = /^\/(?:[a-z0-9-]+\/)*$/;

export function demoSearchFilters(search: DemoSearch): RecipeFilters {
  if (search.kind === "text") return { ...emptyRecipeFilters, query: search.text.replace(/\s+/gu, " ").trim().slice(0, 120) };
  if (search.preset === "keto-30") return { ...emptyRecipeFilters, diet: "keto", maxTime: 30 };
  if (search.preset === "breakfast") return { ...emptyRecipeFilters, category: "aamupala" };
  return { ...emptyRecipeFilters, category: "valipala" };
}

export function demoSearchCatalog(catalog: AssistantCatalog, search: DemoSearch, limit = 5): AssistantCatalogRecipe[] {
  const result = searchAssistantCatalog(catalog, demoSearchFilters(search));
  return result.recipes.slice(0, Math.max(0, Math.min(10, Math.trunc(limit))));
}

/** The locale's published route is the only valid href source. */
export function demoRecipeHref(basePath: string, recipe: AssistantCatalogRecipe): string {
  if (!isSafePublishedRoute(recipe.locale, recipe.routePath)) throw new Error("Invalid published recipe URL");
  const normalizedBase = "/" + basePath.replace(/^\/+|\/+$/g, "");
  return (normalizedBase === "/" ? "" : normalizedBase) + recipe.routePath;
}

function isSafePublishedRoute(locale: RecipeLocale, route: string): boolean {
  if (!locales.includes(locale) || !pathPattern.test(route)) return false;
  return route.startsWith(localeIndexes[locale]) && route !== localeIndexes[locale];
}

function isCatalogRow(value: unknown, locale: RecipeLocale): value is AssistantCatalogRecipe {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<AssistantCatalogRecipe>;
  if (!asciiSlug.test(String(row.recipeId ?? "")) || row.locale !== locale ||
      typeof row.routePath !== "string" || !isSafePublishedRoute(locale, row.routePath) ||
      typeof row.title !== "string" || !row.title || !sha256Pattern.test(String(row.sourceVersion ?? "")) ||
      row.image !== null || !Number.isInteger(row.servings) || !row.servings || row.servings < 1 ||
      !Array.isArray(row.ingredients) || !Array.isArray(row.tags) ||
      !row.nutritionPerServing || typeof row.nutritionPerServing !== "object" ||
      !row.publishedTranslations || typeof row.publishedTranslations !== "object") return false;
  const nutrition = row.nutritionPerServing;
  for (const key of ["carbsNetG", "carbsTotalG", "proteinG", "fatG"] as const) {
    const n = nutrition[key];
    if (n !== null && (typeof n !== "number" || !Number.isFinite(n) || n < 0)) return false;
  }
  for (const [translationLocale, route] of Object.entries(row.publishedTranslations)) {
    if (!locales.includes(translationLocale as RecipeLocale) || typeof route !== "string" ||
        !isSafePublishedRoute(translationLocale as RecipeLocale, route)) return false;
  }
  return true;
}

export function validateDemoCatalog(value: unknown, locale: RecipeLocale): AssistantCatalog {
  if (!value || typeof value !== "object") throw new Error("Invalid assistant catalog");
  const catalog = value as Partial<AssistantCatalog>;
  if (catalog.schemaVersion !== 1 || catalog.locale !== locale || !Array.isArray(catalog.recipes)) {
    throw new Error("Assistant catalog schema or locale mismatch");
  }
  const seen = new Set<string>();
  for (const row of catalog.recipes) {
    if (!isCatalogRow(row, locale) || seen.has(row.recipeId)) throw new Error("Invalid or duplicate published recipe");
    seen.add(row.recipeId);
  }
  return catalog as AssistantCatalog;
}

/**
 * Downloads only local, build-generated public assets.
 * Filename is allowlisted, and payload SHA-256 must match the versioned manifest.
 */
export async function loadDemoCatalog(
  locale: RecipeLocale,
  basePath: string,
  fetcher: typeof fetch = fetch,
): Promise<AssistantCatalog> {
  if (!locales.includes(locale)) throw new Error("Unsupported locale");
  const base = "/" + basePath.replace(/^\/+|\/+$/g, "");
  const dataBase = base === "/" ? "/data/" : `${base}/data/`;
  const manifestResponse = await fetcher(`${dataBase}assistant-manifest.json`, { cache: "no-store" });
  if (!manifestResponse.ok) throw new Error("Assistant catalog manifest not available");
  const manifest = await manifestResponse.json() as {
    schemaVersion?: number;
    locales?: Partial<Record<RecipeLocale, { file: string; sha256: string; count: number }>>;
  };
  const meta = manifest.schemaVersion === 1 ? manifest.locales?.[locale] : null;
  if (!meta || !new RegExp(`^assistant-${locale}-[a-f0-9]{20}\\.json$`).test(meta.file) ||
      !sha256Pattern.test(meta.sha256) || !Number.isInteger(meta.count) || meta.count < 0 ||
      !meta.file.includes(meta.sha256.slice(0, 20))) throw new Error("Invalid assistant manifest entry");
  const response = await fetcher(dataBase + meta.file);
  if (!response.ok) throw new Error("Assistant catalog not available");
  const raw = await response.text();
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const actual = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (actual !== meta.sha256) throw new Error("Assistant catalog checksum mismatch");
  const catalog = validateDemoCatalog(JSON.parse(raw), locale);
  if (catalog.recipes.length !== meta.count) throw new Error("Assistant catalog count mismatch");
  return catalog;
}
