import { siteTitle } from "../../content/site-metadata";
import type { RecipeSummary } from "@/content/route-data";
import type { RecipeLocale } from "@/types/content";
import { recipeMatchesCategory } from "@/content/recipe-categories";

const categoryOrder: RecipeSummary["category"][] = ["paaruoka", "leivonnainen", "aamupala", "valipala", "alkuruoka", "jalkiruoka"];
export const homepagePickLimit = 9;

/**
 * Stable, source-derived examples: not popularity, ratings or publication order.
 * Prefer illustrated, published items and rotate between recipe categories.
 */
export function homepagePicks<T extends Pick<RecipeSummary, "recipeId" | "category" | "image">>(
  recipes: readonly T[],
  limit = homepagePickLimit,
): T[] {
  const picks: T[] = [];
  const used = new Set<string>();
  const sorted = [...recipes].sort((a, b) => a.recipeId.localeCompare(b.recipeId));

  function addFrom(rows: T[]) {
    const pools = categoryOrder.map((category) => rows.filter((recipe) => recipe.category === category));
    while (picks.length < limit) {
      let added = false;
      for (const pool of pools) {
        let next = pool.shift();
        while (next && used.has(next.recipeId)) next = pool.shift();
        if (next) {
          picks.push(next);
          used.add(next.recipeId);
          added = true;
        }
        if (picks.length === limit) break;
      }
      if (!added) break;
    }
  }

  if (limit <= 0) return [];
  addFrom(sorted.filter((recipe) => recipe.image !== null));
  if (picks.length < limit) addFrom(sorted);
  return picks;
}

export type HomepageTopic =
  | { kind: "category"; value: "paaruoka" | "aamupala" | "valipala" | "leivonnainen" | "jalkiruoka" }
  | { kind: "diet"; value: "keto" | "vhh" };

const topicOrder: HomepageTopic[] = [
  { kind: "category", value: "paaruoka" },
  { kind: "category", value: "aamupala" },
  { kind: "category", value: "valipala" },
  { kind: "category", value: "leivonnainen" },
  { kind: "category", value: "jalkiruoka" },
  { kind: "diet", value: "keto" },
  { kind: "diet", value: "vhh" },
];

export function homepageTopics(recipes: readonly Pick<RecipeSummary, "category" | "additionalCategories" | "dietClass">[]): HomepageTopic[] {
  return topicOrder.filter((topic) => recipes.some((recipe) => topic.kind === "category"
    ? recipeMatchesCategory(recipe, topic.value)
    : topic.value === "keto" ? recipe.dietClass === "keto" : recipe.dietClass !== null));
}

export const homepageLabels: Record<RecipeLocale, {
  topics: string;
  picks: string;
  allRecipes: (count: number) => string;
}> = {
  fi: { topics: "Mitä tänään kokattaisiin?", picks: "Kokeile näitä reseptejä", allRecipes: (count) => `Selaa kaikkia reseptejä (${count})` },
  en: { topics: "What shall we cook today?", picks: "Try these recipes", allRecipes: (count) => `See all recipes (${count})` },
  sv: { topics: "Vad ska vi laga idag?", picks: "Prova de här recepten", allRecipes: (count) => `Se alla recept (${count})` },
  th: { topics: "วันนี้ทำอะไรกินดี", picks: "ลองทำเมนูเหล่านี้", allRecipes: (count) => `ดูสูตรอาหารทั้งหมด (${count} สูตร)` },
};

export const libraryCopy = {
  fi: { title: "Reseptikirjasto", description: "Selaa kaikkia suomenkielisiä reseptejä.", page: "Sivu", previous: "Edellinen sivu", next: "Seuraava sivu", loading: "Ladataan reseptiluetteloa…", failed: "Reseptiluetteloa ei voitu ladata.", retry: "Yritä uudelleen" },
  en: { title: "Recipe library", description: "Browse all recipes available in English.", page: "Page", previous: "Previous page", next: "Next page", loading: "Loading recipes…", failed: "Could not load the recipe list.", retry: "Try again" },
  sv: { title: "Receptbibliotek", description: "Bläddra bland alla recept på svenska.", page: "Sida", previous: "Föregående sida", next: "Nästa sida", loading: "Laddar receptlistan…", failed: "Det gick inte att ladda receptlistan.", retry: "Försök igen" },
  th: { title: "คลังสูตรอาหาร", description: "เรียกดูสูตรอาหารทั้งหมดที่มีในภาษาไทย", page: "หน้า", previous: "หน้าก่อนหน้า", next: "หน้าถัดไป", loading: "กำลังโหลดรายการสูตรอาหาร…", failed: "โหลดรายการสูตรอาหารไม่สำเร็จ", retry: "ลองอีกครั้ง" },
} satisfies Record<RecipeLocale, Record<string, string>>;

export function libraryTitle(locale: RecipeLocale, page: number): string {
  const labels = libraryCopy[locale];
  return siteTitle(labels.title + (page > 1 ? " – " + labels.page + " " + page : ""));
}

export function librarySeoDescription(locale: RecipeLocale, page: number, recipes: readonly { title: string }[]): string {
  const examples = recipes.slice(0, 2).map(recipe => recipe.title).join(", ");
  if (!examples) return libraryCopy[locale].description;
  return {
    fi: `Suomenkielisen reseptikirjaston sivu ${page}. Tältä sivulta löydät esimerkiksi: ${examples}.`,
    en: `Page ${page} of the English recipe library. Recipes on this page include ${examples}.`,
    sv: `Sida ${page} i det svenska receptbiblioteket. Här hittar du bland annat ${examples}.`,
    th: `คลังสูตรอาหารภาษาไทย หน้า ${page} ตัวอย่างเมนูในหน้านี้ ได้แก่ ${examples}`,
  }[locale];
}
