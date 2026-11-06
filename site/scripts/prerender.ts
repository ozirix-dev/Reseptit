import { recipeCardSizes } from "../src/features/recipes/image-layout";
import { contentForRoute, serializeRouteContent } from "../src/content/route-data";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { RouterProvider } from "react-router-dom";
import { createServer } from "vite";
import { siteContent } from "../src/generated/content.generated";
import { glycemicLoadMeta, recipeUi } from "../src/features/recipes/recipe-i18n";
import { recipeJsonLd } from "../src/features/recipes/schema";
import { blogIndexPath, blogIndexTitle, blogIndexDescription, blogPostForRoute, blogRoutes, blogJsonLd } from "../src/features/blog/blog-data";
import type { RecipeLocale } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(siteDir, "dist");
const baseUrl = "https://ozirix-dev.github.io/Reseptit";
const localeBase: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };
const indexNames: Record<RecipeLocale, string> = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };
const openGraphLocale: Record<RecipeLocale, string> = { fi: "fi_FI", en: "en_GB", sv: "sv_SE", th: "th_TH" };
const methodRoutes: Record<RecipeLocale, string> = { fi: "/glykeeminen-kuorma/", en: "/en/glycemic-load/", sv: "/sv/glykemisk-belastning/", th: "/th/glycemic-load/" };
function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function outputPaths(route: string): string[] {
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  return [clean ? path.join(distDir, clean, "index.html") : path.join(distDir, "index.html")];
}

function routeMetadata(route: string) {
  const recipe = siteContent.recipes.find((item) => item.routePath === route);
  const blogPost = blogPostForRoute(route);
  const isBlogIndex = route === blogIndexPath;
  const methodLocale = (Object.keys(methodRoutes) as RecipeLocale[]).find((locale) => route === methodRoutes[locale]);
  const pilotPage = methodLocale !== undefined;
  const indexLocale = (Object.keys(localeBase) as RecipeLocale[]).find((locale) =>
    locale === "fi" ? route === "/" : route === `${localeBase[locale]}/` || route === localeBase[locale]);
  if (!recipe && !pilotPage && !blogPost && !isBlogIndex && indexLocale !== "fi" && (!indexLocale || !siteContent.recipes.some((item) => item.locale === indexLocale))) return null;
  const locale = blogPost || isBlogIndex ? "fi" : recipe?.locale ?? methodLocale ?? indexLocale ?? "fi";
  const title = blogPost ? blogPost.seoTitle : isBlogIndex ? blogIndexTitle : pilotPage ? glycemicLoadMeta[locale].title : recipe ? `${recipe.title} | ${indexNames[locale]}` : `${indexNames[locale]} | Ozirix`;
  const description = blogPost ? blogPost.excerpt : isBlogIndex ? blogIndexDescription : pilotPage ? glycemicLoadMeta[locale].description : recipe?.description || recipeUi[locale].intro;
  const url = `${baseUrl}${route}`;
  const translations = recipe ? siteContent.recipes.filter((item) => item.recipeId === recipe.recipeId) : [];
  const publishedLocales = blogPost || isBlogIndex ? [{ locale: "fi" as const, path: route }] : pilotPage ? (Object.keys(methodRoutes) as RecipeLocale[]).map((itemLocale) => ({ locale: itemLocale, path: methodRoutes[itemLocale] })) : recipe
    ? translations.map((item) => ({ locale: item.locale, path: item.routePath }))
    : (Object.keys(localeBase) as RecipeLocale[])
        .filter((itemLocale) => siteContent.recipes.some((item) => item.locale === itemLocale))
        .map((itemLocale) => ({ locale: itemLocale, path: itemLocale === "fi" ? "/" : `${localeBase[itemLocale]}/` }));
  const alternates = publishedLocales.map(({ locale: altLocale, path: altPath }) =>
    `<link rel="alternate" hreflang="${altLocale}" href="${escapeHtml(`${baseUrl}${altPath}`)}" />`);
  const defaultAlternate = publishedLocales.find((item) => item.locale === "fi") ?? publishedLocales[0];
  if (defaultAlternate) alternates.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${baseUrl}${defaultAlternate.path}`)}" />`);
  const pageImage = recipe?.image?.src ?? blogPost?.image;
  const imageTags = pageImage ? [
    `<meta property="og:image" content="${escapeHtml(pageImage)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(pageImage)}" />`,
  ] : [];
  const jsonLd = recipe
    ? `<script id="recipe-jsonld" type="application/ld+json">${JSON.stringify(recipeJsonLd(recipe)).replaceAll("<", "\\u003c")}</script>`
    : blogPost ? `<script id="blog-jsonld" type="application/ld+json">${JSON.stringify(blogJsonLd(blogPost)).replaceAll("<", "\\u003c")}</script>` : "";
  // Match the card grid breakpoints. Do not eagerly fetch three cards on mobile.
  const desktopImages = recipe || pilotPage || blogPost || isBlogIndex ? [] : siteContent.recipes.filter((item) => item.locale === locale)
    .slice(1, 3).flatMap((item, index) => item.image ? [
      `<link rel="preload" as="image" fetchpriority="high" href="${escapeHtml(item.image.src)}" media="(min-width: ${index === 0 ? 700 : 1100}px)"${item.image.srcSet ? ` imagesrcset="${escapeHtml(item.image.srcSet)}"` : ""}${item.image.srcSet ? ` imagesizes="${escapeHtml(recipeCardSizes)}"` : ""} />`,
    ] : []);
  return {
    lang: locale,
    head: [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
      `<meta property="og:type" content="${recipe || blogPost ? "article" : "website"}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
      `<meta property="og:locale" content="${openGraphLocale[locale]}" />`,
      `<meta name="twitter:card" content="${pageImage ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      ...imageTags, ...alternates, ...desktopImages, jsonLd,
    ].filter(Boolean).join("\n    "),
  };
}

function replaceDocument(shell: string, head: string, locale: string, body: string): string {
  return shell
    .replace(/<html([^>]*)\slang=["'][^"']+["']([^>]*)>/i, `<html$1 lang="${escapeHtml(locale)}"$2>`)
    .replace(/<title>.*?<\/title>/is, head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const vite = await createServer({
  configFile: path.join(siteDir, "vite.config.ts"),
  root: siteDir,
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { createStaticRouter } = await vite.ssrLoadModule("/src/router.tsx");
  const shell = await readFile(path.join(distDir, "index.html"), "utf8");
  if (!shell.includes('<div id="root"></div>')) {
    throw new Error("Prerender requires a fresh Vite build. Run npm run build.");
  }
  const routes = [...new Set([
    "/",
    ...Object.values(methodRoutes),
    ...blogRoutes,
    ...(Object.keys(localeBase) as RecipeLocale[])
      .filter((locale) => locale !== "fi" && siteContent.recipes.some((recipe) => recipe.locale === locale))
      .map((locale) => `${localeBase[locale]}/`),
    ...siteContent.recipes.map((recipe) => recipe.routePath),
  ])];

  for (const route of routes) {
    const metadata = routeMetadata(route);
    if (!metadata) continue;
    const initial = contentForRoute(siteContent.recipes, route);
    const router = createStaticRouter(route, initial);
    const body = renderToString(React.createElement(RouterProvider, { router }));
    const html = replaceDocument(shell, `${metadata.head}\n<script id="page-content" type="application/json">${serializeRouteContent(initial)}</script>`, metadata.lang, body);
    for (const outputPath of outputPaths(route)) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, "utf8");
    }
  }

  const notFoundRouter = createStaticRouter("/404", contentForRoute(siteContent.recipes, "/404"));
  const notFoundBody = renderToString(React.createElement(RouterProvider, { router: notFoundRouter }));
  const notFoundHead = [
    "<title>Sivua ei löytynyt | Reseptit</title>",
    '<meta name="robots" content="noindex,follow" />',
    '<meta name="description" content="Pyytämääsi sivua ei löytynyt." />',
  ].join("\n    ");
  const notFoundHtml = replaceDocument(shell, notFoundHead, "fi", notFoundBody)
    .replace(/\s*<script type="module"[^>]*><\/script>/i, "");
  await writeFile(path.join(distDir, "404.html"), notFoundHtml, "utf8");
  console.log(`Prerendered ${routes.length} routes with visible content, metadata, and a not-found page.`);
} finally {
  await vite.close();
}
