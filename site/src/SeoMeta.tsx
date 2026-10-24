import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recipeJsonLd } from "@/features/recipes/schema";
import { recipeLocaleFromPath, recipeUi } from "@/features/recipes/recipe-i18n";
import { useContent } from "@/lib/content";
import type { RecipeLocale } from "@/types/content";

const siteBase = "https://ozirix-dev.github.io/Reseptit";
const sitePath = "/Reseptit";
const baseByLocale: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };
const titleByLocale: Record<RecipeLocale, string> = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };
const openGraphLocale: Record<RecipeLocale, string> = { fi: "fi_FI", en: "en_GB", sv: "sv_SE", th: "th_TH" };
const methodPaths: Record<RecipeLocale, string> = { fi: "/glykeeminen-kuorma/", en: "/en/glycemic-load/", sv: "/sv/glykemisk-belastning/", th: "/th/glycemic-load/" };
const methodMeta: Record<RecipeLocale, { title: string; description: string }> = {
  fi: { title: "Glykeeminen kuorma: lähteet ja laskenta | Reseptit", description: "Reseptien glykeemisen kuorman laskentatapa, lähteet ja reseptikohtaiset oletukset." },
  en: { title: "Glycemic load: sources and method | Recipes", description: "Calculation method, sources and recipe-specific assumptions for glycemic-load estimates." },
  sv: { title: "Glykemisk belastning: källor och metod | Recept", description: "Beräkningsmetod, källor och receptspecifika antaganden för uppskattningar av glykemisk belastning." },
  th: { title: "ภาระน้ำตาลในเลือด: แหล่งข้อมูลและวิธีคำนวณ | สูตรอาหาร", description: "วิธีคำนวณ แหล่งข้อมูล และสมมติฐานเฉพาะสูตรสำหรับค่าประมาณภาระน้ำตาลในเลือด" },
};

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

  const { recipe, translations, locales } = useContent();

  useEffect(() => {
    const strippedPath = pathname.replace(new RegExp(`^${sitePath}(?=/|$)`), "") || "/";
    const routeLocale = (Object.keys(baseByLocale) as RecipeLocale[]).find((locale) =>
      locale === "fi" ? strippedPath === "/" : strippedPath === `${baseByLocale[locale]}/` || strippedPath === baseByLocale[locale]);
    const indexExists = routeLocale === "fi" || (routeLocale !== undefined && locales.includes(routeLocale));
    const methodLocale = (Object.keys(methodPaths) as RecipeLocale[]).find((item) => strippedPath === methodPaths[item].replace(/\/$/, ""));
    const isPilotPage = methodLocale !== undefined;
    const known = recipe !== null || indexExists || isPilotPage;
    // Keep unknown deep links' metadata in the same locale as the visible not-found page.
    const locale = recipe?.locale ?? methodLocale ?? routeLocale ?? recipeLocaleFromPath(strippedPath);
    const title = isPilotPage ? methodMeta[locale].title : known
      ? recipe ? `${recipe.title} | ${titleByLocale[locale]}` : `${titleByLocale[locale]} | Ozirix`
      : `${recipeUi[locale].notFound} | ${titleByLocale[locale]}`;
    const description = isPilotPage ? methodMeta[locale].description : recipe?.description || (!known ? recipeUi[locale].notFound : recipeUi[locale].intro);
    const canonical = isPilotPage ? `${siteBase}${methodPaths[locale]}` : recipe ? `${siteBase}${recipe.routePath}` : indexExists ? `${siteBase}${indexPath(locale)}` : null;
    document.title = title;
    document.documentElement.lang = locale;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", recipe ? "article" : "website");
    upsertMeta("property", "og:locale", openGraphLocale[locale]);
    upsertMeta("property", "og:url", canonical ?? `${siteBase}/404.html`);
    upsertMeta("name", "twitter:card", recipe?.image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:image"], meta[name="twitter:image"], script#recipe-jsonld, meta[name="robots"]').forEach((element) => element.remove());
    if (!known) upsertMeta("name", "robots", "noindex,follow");
    if (canonical) {
      const canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      canonicalLink.href = canonical;
      document.head.append(canonicalLink);
    }
    const alternates = !known ? [] : isPilotPage ? (Object.keys(methodPaths) as RecipeLocale[]).map((entryLocale) => ({ locale: entryLocale, path: methodPaths[entryLocale] })) : recipe
      ? translations.map((entry) => ({ locale: entry.locale, path: entry.routePath }))
      : (Object.keys(baseByLocale) as RecipeLocale[])
          .filter((entryLocale) => locales.includes(entryLocale))
          .map((entryLocale) => ({ locale: entryLocale, path: indexPath(entryLocale) }));
    for (const alternate of alternates) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.locale;
      link.href = `${siteBase}${alternate.path}`;
      document.head.append(link);
    }
    const defaultAlternate = alternates.find((entry) => entry.locale === "fi") ?? alternates[0];
    if (defaultAlternate) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = "x-default";
      link.href = `${siteBase}${defaultAlternate.path}`;
      document.head.append(link);
    }
    if (recipe?.image) {
      upsertMeta("property", "og:image", recipe.image.src);
      upsertMeta("name", "twitter:image", recipe.image.src);
    }
    if (recipe) {
      const script = document.createElement("script");
      script.id = "recipe-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(recipeJsonLd(recipe));
      document.head.append(script);
    }
  }, [pathname, recipe, translations, locales]);

  return null;
}
