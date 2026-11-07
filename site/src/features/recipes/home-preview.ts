import type { RecipeSummary } from "@/content/route-data";
import type { RecipeLocale } from "@/types/content";

const categoryOrder: RecipeSummary["category"][] = ["paaruoka", "leivonnainen", "aamupala", "valipala", "alkuruoka", "jalkiruoka"];
export const homepagePickLimit = 9;

/**
 * Stable, source-derived examples: not popularity, ratings or publication order.
 * Prefer illustrated, published items and rotate between recipe categories.
 * The full recipe collection remains available through native <details>.
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

export function homepageTopics(recipes: readonly Pick<RecipeSummary, "category" | "dietClass">[]): HomepageTopic[] {
  return topicOrder.filter((topic) => recipes.some((recipe) => topic.kind === "category"
    ? recipe.category === topic.value
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
