import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteContent } from "../src/generated/content.generated";
import { recipeJsonLd } from "../src/features/recipes/schema";
import type { RecipeLocale } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(siteDir, "dist");
const baseUrl = "https://ozirix-dev.github.io/Reseptit";
const localeBase: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };
const indexNames: Record<RecipeLocale, string> = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };
const indexDescriptions: Record<RecipeLocale, string> = {
  fi: "Selkeitä reseptejä arkeen.", en: "Straightforward recipes for everyday cooking.",
  sv: "Enkla recept för vardagen.", th: "สูตรอาหารเรียบง่ายสำหรับทุกวัน",
};

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function outputPaths(route: string): string[] {
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  return clean ? [path.join(distDir, clean, "index.html"), path.join(distDir, `${clean}.html`)] : [path.join(distDir, "index.html")];
}

function routeMetadata(route: string) {
  const recipe = siteContent.recipes.find((item) => item.routePath === route);
  const indexLocale = (Object.keys(localeBase) as RecipeLocale[]).find((locale) =>
    locale === "fi" ? route === "/" : route === `${localeBase[locale]}/`);
  const locale = recipe?.locale ?? indexLocale ?? "fi";
  const title = recipe ? `${recipe.title} | ${indexNames[locale]}` : `${indexNames[locale]} | Ozirix`;
  const description = recipe?.description || indexDescriptions[locale];
  const pathAndBase = `${baseUrl}${route}`;
  const translations = recipe ? siteContent.recipes.filter((item) => item.recipeId === recipe.recipeId) : [];
  const publishedLocales = recipe
    ? translations.map((item) => ({ locale: item.locale, path: item.routePath }))
    : (Object.keys(localeBase) as RecipeLocale[])
        .filter((itemLocale) => siteContent.recipes.some((item) => item.locale === itemLocale))
        .map((itemLocale) => ({ locale: itemLocale, path: itemLocale === "fi" ? "/" : `${localeBase[itemLocale]}/` }));
  const alternates = publishedLocales.map(({ locale: altLocale, path: altPath }) =>
    `<link rel="alternate" hreflang="${altLocale}" href="${escapeHtml(`${baseUrl}${altPath}`)}" />`);
  if (publishedLocales.some((item) => item.locale === "fi")) alternates.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${baseUrl}/`)}" />`);
  const jsonLd = recipe
    ? `<script id="recipe-jsonld" type="application/ld+json">${JSON.stringify(recipeJsonLd(recipe)).replaceAll("<", "\\u003c")}</script>`
    : "";
  return {
    lang: locale, title, description, canonical: pathAndBase,
    tags: [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      `<link rel="canonical" href="${escapeHtml(pathAndBase)}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${escapeHtml(pathAndBase)}" />`,
      ...alternates, jsonLd,
    ].filter(Boolean).join("\n    "),
  };
}

function routesToPrerender(): string[] {
  const localeIndexes = (Object.keys(localeBase) as RecipeLocale[])
    .filter((locale) => locale === "fi" || siteContent.recipes.some((recipe) => recipe.locale === locale))
    .map((locale) => locale === "fi" ? "/" : `${localeBase[locale]}/`);
  return [...new Set([...localeIndexes, ...siteContent.recipes.map((recipe) => recipe.routePath)])];
}

const routes = routesToPrerender();
const shell = await readFile(path.join(distDir, "index.html"), "utf8");
for (const route of routes) {
  const metadata = routeMetadata(route);
  const html = shell
    .replace(/<html([^>]*)\slang=["'][^"']+["']([^>]*)>/i, `<html$1 lang="${metadata.lang}"$2>`)
    .replace("<title>Reseptit</title>", metadata.tags);
  for (const outputPath of outputPaths(route)) {
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, "utf8");
  }
}
console.log(`Prerendered ${routes.length} recipe routes with canonical, hreflang, and structured data.`);
