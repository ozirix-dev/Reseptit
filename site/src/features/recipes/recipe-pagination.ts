import type { RecipeLocale } from "@/types/content";

export const recipeLibraryPageSize = 24;

/**
 * Future catalogue routes. Current recipe detail routes and existing language
 * indexes are intentionally unchanged until the H2 route/SEO integration.
 */
export const recipeLibraryRoots: Readonly<Record<RecipeLocale, string>> = {
  fi: "/reseptit/",
  en: "/en/recipes/all/",
  sv: "/sv/recept/alla/",
  th: "/th/recipes/all/",
};

const pageSegments: Readonly<Record<RecipeLocale, string>> = {
  fi: "sivu",
  en: "page",
  sv: "sida",
  th: "page",
};

export type RecipeLibraryPage = { locale: RecipeLocale; page: number };

function validPage(page: number): boolean {
  return Number.isSafeInteger(page) && page >= 1;
}

export function recipeLibraryPagePath(locale: RecipeLocale, page = 1): string {
  if (!validPage(page)) throw new RangeError("Recipe library page must be a positive safe integer");
  if (page === 1) return recipeLibraryRoots[locale];
  return `${recipeLibraryRoots[locale]}${pageSegments[locale]}/${page}/`;
}

/**
 * Exact matches only: no /page/1/, /page/02/, unknown locale or misspelt
 * path aliases. The router will use this in H2 for real 404 responses.
 */
export function parseRecipeLibraryPagePath(path: string): RecipeLibraryPage | null {
  const pathname = path.split(/[?#]/, 1)[0];
  if (!pathname.startsWith("/") || !pathname.endsWith("/") || pathname.includes("//")) return null;
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const root = recipeLibraryRoots[locale];
    if (pathname === root) return { locale, page: 1 };
    const prefix = `${root}${pageSegments[locale]}/`;
    if (!pathname.startsWith(prefix)) continue;
    const suffix = pathname.slice(prefix.length, -1);
    if (!/^[1-9][0-9]*$/.test(suffix)) return null;
    const page = Number(suffix);
    return validPage(page) && page >= 2 && String(page) === suffix ? { locale, page } : null;
  }
  return null;
}

export type RecipeLibraryPageData<T> = {
  locale: RecipeLocale;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
  canonicalPath: string;
  previousPath: string | null;
  nextPath: string | null;
};

/**
 * Pure pagination for published recipe summaries only. Stable ID ordering
 * ensures that SSG page boundaries do not depend on server/browser locale
 * collation behavior or on an unsourced "most popular" ranking.
 */
export function paginateRecipeLibrary<T extends { recipeId: string; locale: RecipeLocale }>(
  recipes: readonly T[],
  locale: RecipeLocale,
  page = 1,
): RecipeLibraryPageData<T> {
  if (!validPage(page)) throw new RangeError("Invalid recipe library page");
  const matching = recipes.filter((recipe) => recipe.locale === locale)
    .sort((a, b) => a.recipeId < b.recipeId ? -1 : a.recipeId > b.recipeId ? 1 : 0);
  const totalItems = matching.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / recipeLibraryPageSize));
  if (page > totalPages) throw new RangeError("Recipe library page out of bounds");
  const start = (page - 1) * recipeLibraryPageSize;
  return {
    locale,
    page,
    pageSize: recipeLibraryPageSize,
    totalItems,
    totalPages,
    items: matching.slice(start, start + recipeLibraryPageSize),
    canonicalPath: recipeLibraryPagePath(locale, page),
    previousPath: page === 1 ? null : recipeLibraryPagePath(locale, page - 1),
    nextPath: page === totalPages ? null : recipeLibraryPagePath(locale, page + 1),
  };
}
