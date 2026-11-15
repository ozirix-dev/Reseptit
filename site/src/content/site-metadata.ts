import type { RecipeEntry, RecipeLocale } from "../types/content";

export const siteName = "Recipavo";

export function siteTitle(title: string): string {
  return `${title} | ${siteName}`;
}

const localizedRecipeTitles: Record<string, Partial<Record<RecipeLocale, string>>> = {
  "meksikolainen-huevos-a-la-mexicana": {
    fi: "Huevos a la mexicana – meksikolainen munakokkeli",
    en: "Huevos a la mexicana – Mexican scrambled eggs",
    sv: "Huevos a la mexicana – mexikansk äggröra",
  },
  "ropa-vieja": {
    en: "Ropa vieja – Cuban shredded beef",
    sv: "Ropa vieja – kubanskt långkok på nötkött",
  },
};

export function recipePageTitle(recipe: Pick<RecipeEntry, "recipeId" | "locale" | "title">): string {
  return siteTitle(localizedRecipeTitles[recipe.recipeId]?.[recipe.locale] ?? recipe.title);
}

export function websiteJsonLd(url: string) {
  return { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url };
}
