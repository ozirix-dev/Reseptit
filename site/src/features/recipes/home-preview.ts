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
  fi: { topics: "Mitä tänään kokattaisiin?", picks: "Poimintoja resepteistä", allRecipes: (count) => `Selaa koko reseptikirjastoa (${count} reseptiä)` },
  en: { topics: "What shall we cook today?", picks: "Recipe picks", allRecipes: (count) => `Browse all recipes (${count})` },
  sv: { topics: "Vad ska vi laga idag?", picks: "Recepttips", allRecipes: (count) => `Bläddra bland alla recept (${count})` },
  th: { topics: "วันนี้ทำอะไรกินดี", picks: "สูตรอาหารที่แนะนำ", allRecipes: (count) => `ดูสูตรอาหารทั้งหมด (${count} สูตร)` },
};

export const libraryCopy = {
  fi: { title: "Reseptikirjasto", description: "Selaa kaikkia suomenkielisiä reseptejä.", page: "Sivu", previous: "Edellinen sivu", next: "Seuraava sivu", loading: "Ladataan hakua…", failed: "Hakua ei voitu ladata.", retry: "Yritä uudelleen" },
  en: { title: "Recipe library", description: "Browse all recipes available in English.", page: "Page", previous: "Previous page", next: "Next page", loading: "Loading search…", failed: "Could not load search.", retry: "Try again" },
  sv: { title: "Receptbibliotek", description: "Bläddra bland alla recept på svenska.", page: "Sida", previous: "Föregående sida", next: "Nästa sida", loading: "Laddar sökningen…", failed: "Sökningen kunde inte laddas.", retry: "Försök igen" },
  th: { title: "คลังสูตรอาหาร", description: "เรียกดูสูตรอาหารทั้งหมดที่มีในภาษาไทย", page: "หน้า", previous: "หน้าก่อนหน้า", next: "หน้าถัดไป", loading: "กำลังโหลดการค้นหา…", failed: "โหลดการค้นหาไม่สำเร็จ", retry: "ลองอีกครั้ง" },
} satisfies Record<RecipeLocale, Record<string, string>>;

export function libraryTitle(locale: RecipeLocale, page: number): string {
  const labels = libraryCopy[locale];
  return labels.title + (page > 1 ? " – " + labels.page + " " + page : "") + " | Recipavo";
}
