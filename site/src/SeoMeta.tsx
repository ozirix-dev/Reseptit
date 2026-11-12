import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recipeJsonLd } from "@/features/recipes/schema";
import { isRecipavoHeroPreviewEnabled, recipavoHeroCopy } from "@/features/recipes/recipavo-hero";
import { glycemicLoadMeta, recipeLocaleFromPath, recipeUi } from "@/features/recipes/recipe-i18n";
import { useContent } from "@/lib/content";
import { articles, articlePath, blogRoot, blogPosts, blogJsonLd } from "@/features/blog/blog-data";
import type { RecipeLocale } from "@/types/content";
import { siteTarget } from "@/content/site-target";

const siteBase = siteTarget.baseUrl;
const baseByLocale: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };
const titleByLocale: Record<RecipeLocale, string> = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };
const openGraphLocale: Record<RecipeLocale, string> = { fi: "fi_FI", en: "en_GB", sv: "sv_SE", th: "th_TH" };
const methodPaths: Record<RecipeLocale, string> = { fi: "/glykeeminen-kuorma/", en: "/en/glycemic-load/", sv: "/sv/glykemisk-belastning/", th: "/th/glycemic-load/" };

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

function normalizeRoutePath(path: string): string {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function SeoMeta() {
  const { pathname } = useLocation();

  const { recipe, translations, locales } = useContent();

  useEffect(() => {
    const normalizedPath = normalizeRoutePath(pathname);
    const routeLocale = (Object.keys(baseByLocale) as RecipeLocale[]).find((locale) =>
      locale === "fi" ? pathname === "/" : pathname === `${baseByLocale[locale]}/` || pathname === baseByLocale[locale]);
    const indexExists = routeLocale === "fi" || (routeLocale !== undefined && locales.includes(routeLocale));
    const methodLocale = (Object.keys(methodPaths) as RecipeLocale[]).find((item) => normalizedPath === normalizeRoutePath(methodPaths[item]));
    const isPilotPage = methodLocale !== undefined;
    const blogPost = articles.find(post => normalizeRoutePath(articlePath(post)) === normalizedPath);
    const blogIndex = normalizedPath === normalizeRoutePath(blogRoot);
    const isBlog = !!blogPost || blogIndex;
    const known = recipe !== null || indexExists || isPilotPage || isBlog;
    const preview = isRecipavoHeroPreviewEnabled();
    // Keep unknown deep links' metadata in the same locale as the visible not-found page.
    const locale = recipe?.locale ?? methodLocale ?? (isBlog ? "fi" : routeLocale) ?? recipeLocaleFromPath(pathname);
    const title = preview && indexExists ? `${recipavoHeroCopy[locale].title} | Recipavo` : blogPost ? `${blogPost.title} | Ruokaopas` : blogIndex ? "Ruokaopas | Reseptit" : isPilotPage ? glycemicLoadMeta[locale].title : known
      ? recipe ? `${recipe.title} | ${titleByLocale[locale]}` : `${titleByLocale[locale]} | Ozirix`
      : `${recipeUi[locale].notFound} | ${titleByLocale[locale]}`;
    const description = preview && indexExists ? recipavoHeroCopy[locale].intro : blogPost?.description ?? (blogIndex ? "Ruoanlaiton tekniikoita ja luotettavaa ravitsemustietoa." : undefined) ?? (isPilotPage ? glycemicLoadMeta[locale].description : recipe?.description || (!known ? recipeUi[locale].notFound : recipeUi[locale].intro));
    const canonical = blogPost ? `${siteBase}${articlePath(blogPost)}` : blogIndex ? `${siteBase}${blogRoot}` : isPilotPage ? `${siteBase}${methodPaths[locale]}` : recipe ? `${siteBase}${recipe.routePath}` : indexExists ? `${siteBase}${indexPath(locale)}` : null;
    document.title = title;
    document.documentElement.lang = locale;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", recipe || blogPost ? "article" : "website");
    upsertMeta("property", "og:locale", openGraphLocale[locale]);
    upsertMeta("property", "og:url", canonical ?? `${siteBase}/404.html`);
    upsertMeta("name", "twitter:card", recipe?.image || blogPost ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:image"], meta[name="twitter:image"], script#recipe-jsonld, script#blog-jsonld, meta[name="robots"]').forEach((element) => element.remove());
    if (preview || siteTarget.noIndex) upsertMeta("name", "robots", "noindex,nofollow");
    else if (!known) upsertMeta("name", "robots", "noindex,follow");
    if (canonical) {
      const canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      canonicalLink.href = canonical;
      document.head.append(canonicalLink);
    }
    const alternates = !known ? [] : isBlog ? [{locale: "fi" as RecipeLocale, path: blogPost ? articlePath(blogPost) : blogRoot}] : isPilotPage ? (Object.keys(methodPaths) as RecipeLocale[]).map((entryLocale) => ({ locale: entryLocale, path: methodPaths[entryLocale] })) : recipe
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
    if (blogPost) {
      const image = `${siteBase}${blogPost.image}`;
      upsertMeta("property", "og:image", image);
      upsertMeta("name", "twitter:image", image);
      const script = document.createElement("script");
      script.id = "blog-jsonld"; script.type = "application/ld+json";
      script.textContent = JSON.stringify(blogJsonLd(blogPosts.find(post => post.slug === blogPost.slug)!));
      document.head.append(script);
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
