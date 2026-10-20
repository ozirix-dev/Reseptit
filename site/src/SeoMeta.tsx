import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recipeJsonLd } from "@/features/recipes/schema";
import { getRecipeByPath, getRecipeTranslations, getRecipes } from "@/lib/content";
import type { RecipeLocale } from "@/types/content";

const siteBase = "https://ozirix-dev.github.io/Reseptit";
const sitePath = "/Reseptit";
const baseByLocale: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };
const titleByLocale: Record<RecipeLocale, string> = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };

function upsertMeta(key: string, keyValue: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${keyValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(key, keyValue);
    document.head.append(element);
  }
  element.content = content;
}

function indexPath(locale: RecipeLocale): string {
  return locale === "fi" ? "/" : `${baseByLocale[locale]}/`;
}

export function SeoMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const recipe = getRecipeByPath(pathname);
    const strippedPath = pathname.replace(new RegExp(`^${sitePath}(?=/|$)`), "") || "/";
    const routeLocale = (Object.keys(baseByLocale) as RecipeLocale[]).find((locale) =>
      locale === "fi" ? strippedPath === "/" : strippedPath === `${baseByLocale[locale]}/` || strippedPath === baseByLocale[locale]);
    const locale = recipe?.locale ?? routeLocale ?? "fi";
    const title = recipe ? `${recipe.title} | ${titleByLocale[locale]}` : `${titleByLocale[locale]} | Ozirix`;
    const description = recipe?.description || (locale === "fi" ? "Selkeitä reseptejä arkeen." : `${titleByLocale[locale]} for everyday cooking.`);
    const canonical = `${siteBase}${recipe?.routePath ?? indexPath(locale)}`;
    document.title = title;
    document.documentElement.lang = locale;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);

    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], script#recipe-jsonld').forEach((element) => element.remove());
    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = canonical;
    document.head.append(canonicalLink);

    const translations = recipe ? getRecipeTranslations(recipe) : getRecipes().filter((entry) => entry.locale === locale);
    const alternates = recipe
      ? translations.map((entry) => ({ locale: entry.locale, path: entry.routePath }))
      : (Object.keys(baseByLocale) as RecipeLocale[])
          .filter((entryLocale) => getRecipes(entryLocale).length > 0)
          .map((entryLocale) => ({ locale: entryLocale, path: indexPath(entryLocale) }));
    for (const alternate of alternates) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.locale;
      link.href = `${siteBase}${alternate.path}`;
      document.head.append(link);
    }
    if (alternates.some((entry) => entry.locale === "fi")) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = "x-default";
      link.href = `${siteBase}/`;
      document.head.append(link);
    }
    if (recipe) {
      const script = document.createElement("script");
      script.id = "recipe-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(recipeJsonLd(recipe));
      document.head.append(script);
    }
  }, [pathname]);

  return null;
}
