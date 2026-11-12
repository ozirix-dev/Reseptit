import { siteTarget } from "../src/content/site-target";
import { recipeCardSizes } from "../src/features/recipes/image-layout";
import { contentForRoute, serializeRouteContent } from "../src/content/route-data";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { RouterProvider } from "react-router-dom";
import { createServer } from "vite";
import { siteContent } from "../src/generated/content.generated";
import { glycemicLoadMeta, recipeUi } from "../src/features/recipes/recipe-i18n";
import { recipavoHeroCopy } from "../src/features/recipes/recipavo-hero";
import { recipeJsonLd } from "../src/features/recipes/schema";
import { articles, articlePath, blogRoot, blogPosts, blogJsonLd } from "../src/features/blog/blog-data";
import type { RecipeLocale } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(siteDir, "dist");
const baseUrl = siteTarget.baseUrl;
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
  const methodLocale = (Object.keys(methodRoutes) as RecipeLocale[]).find((locale) => route === methodRoutes[locale]);
  const pilotPage = methodLocale !== undefined;
  const blogPost = articles.find(post => articlePath(post) === route);
  const blogIndex = route === blogRoot;
  const isBlog = Boolean(blogPost || blogIndex);
  const indexLocale = (Object.keys(localeBase) as RecipeLocale[]).find((locale) =>
    locale === "fi" ? route === "/" : route === `${localeBase[locale]}/` || route === localeBase[locale]);
  if (!recipe && !pilotPage && !isBlog && indexLocale !== "fi" && (!indexLocale || !siteContent.recipes.some((item) => item.locale === indexLocale))) return null;
  const locale = recipe?.locale ?? methodLocale ?? indexLocale ?? "fi";
  const preview = !siteTarget.production && process.env.VITE_RECIPAVO_HERO_PREVIEW === "true";
  const branded = siteTarget.production || preview;
  const title = blogPost ? `${blogPost.title} | Ruokaopas` : blogIndex ? "Ruokaopas | Reseptit" : branded && indexLocale ? `${recipavoHeroCopy[locale].title} | Recipavo` : pilotPage ? glycemicLoadMeta[locale].title : recipe ? `${recipe.title} | ${indexNames[locale]}` : `${indexNames[locale]} | Ozirix`;
  const description = blogPost?.description ?? (blogIndex ? "Ruoanlaiton tekniikoita ja luotettavaa ravitsemustietoa." : undefined) ?? (branded && indexLocale ? recipavoHeroCopy[locale].intro : pilotPage ? glycemicLoadMeta[locale].description : recipe?.description || recipeUi[locale].intro);
  const url = `${baseUrl}${route}`;
  const translations = recipe ? siteContent.recipes.filter((item) => item.recipeId === recipe.recipeId) : [];
  const publishedLocales = isBlog ? [{locale: "fi" as RecipeLocale, path: route}] : pilotPage ? (Object.keys(methodRoutes) as RecipeLocale[]).map((itemLocale) => ({ locale: itemLocale, path: methodRoutes[itemLocale] })) : recipe
    ? translations.map((item) => ({ locale: item.locale, path: item.routePath }))
    : (Object.keys(localeBase) as RecipeLocale[])
        .filter((itemLocale) => siteContent.recipes.some((item) => item.locale === itemLocale))
        .map((itemLocale) => ({ locale: itemLocale, path: itemLocale === "fi" ? "/" : `${localeBase[itemLocale]}/` }));
  const alternates = publishedLocales.map(({ locale: altLocale, path: altPath }) =>
    `<link rel="alternate" hreflang="${altLocale}" href="${escapeHtml(`${baseUrl}${altPath}`)}" />`);
  const defaultAlternate = publishedLocales.find((item) => item.locale === "fi") ?? publishedLocales[0];
  if (defaultAlternate) alternates.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${baseUrl}${defaultAlternate.path}`)}" />`);
  const imageTags = recipe?.image ? [
    `<meta property="og:image" content="${escapeHtml(recipe.image.src)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(recipe.image.src)}" />`,
  ] : [];
  const jsonLd = blogPost ? `<script id="blog-jsonld" type="application/ld+json">${JSON.stringify(blogJsonLd(blogPosts.find(post => post.slug === blogPost.slug)!)).replaceAll("<", "\\u003c")}</script>` : recipe
    ? `<script id="recipe-jsonld" type="application/ld+json">${JSON.stringify(recipeJsonLd(recipe)).replaceAll("<", "\\u003c")}</script>`
    : "";
  // Match the card grid breakpoints. Do not eagerly fetch three cards on mobile.
  const desktopImages = recipe || pilotPage || isBlog ? [] : siteContent.recipes.filter((item) => item.locale === locale)
    .slice(1, 3).flatMap((item, index) => item.image ? [
      `<link rel="preload" as="image" fetchpriority="high" href="${escapeHtml(item.image.src)}" media="(min-width: ${index === 0 ? 700 : 1100}px)"${item.image.srcSet ? ` imagesrcset="${escapeHtml(item.image.srcSet)}"` : ""}${item.image.srcSet ? ` imagesizes="${escapeHtml(recipeCardSizes)}"` : ""} />`,
    ] : []);
  return {
    lang: locale,
    head: [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      ...(preview || siteTarget.noIndex ? ['<meta name="robots" content="noindex, nofollow" />'] : []),
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
      `<meta property="og:type" content="${recipe || blogPost ? "article" : "website"}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
      `<meta property="og:locale" content="${openGraphLocale[locale]}" />`,
      `<meta name="twitter:card" content="${recipe?.image || blogPost ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      ...imageTags, ...(blogPost ? [`<meta property="og:image" content="${baseUrl}${blogPost.image}" />`, `<meta name="twitter:image" content="${baseUrl}${blogPost.image}" />`] : []), ...alternates, ...desktopImages, jsonLd,
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
    blogRoot, ...articles.map(articlePath),
    ...Object.values(methodRoutes),
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

  for (const [locale, directory] of [["fi", ""], ["en", "en"], ["sv", "sv"], ["th", "th"]] as const) {
    const route = directory ? "/" + directory + "/404" : "/404";
    const router = createStaticRouter(route, contentForRoute(siteContent.recipes, route));
    const body = renderToString(React.createElement(RouterProvider, { router }));
    const title = recipeUi[locale].notFound;
    const head = [
      "<title>" + escapeHtml(title + " | " + indexNames[locale]) + "</title>",
      siteTarget.noIndex ? '<meta name="robots" content="noindex, nofollow" />' : '<meta name="robots" content="noindex,follow" />',
      '<meta name="description" content="' + escapeHtml(title) + '" />',
    ].join("\n    ");
    const html = replaceDocument(shell, head, locale, body)
      .replace(/\s*<script type="module"[^>]*><\/script>/i, "");
    const folder = path.join(distDir, directory);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, "404.html"), html, "utf8");
  }
  if (siteTarget.basePath === "/") {
    // The legacy Search Console verification belongs to GitHub Pages.
    await rm(path.join(distDir, "google0c6f9c0486376f0f.html"), { force: true });
  }
  if (siteTarget.noIndex) {
    await writeFile(path.join(distDir, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n", "utf8");
  }
  console.log(`Prerendered ${routes.length} routes with visible content, metadata, and a not-found page.`);
} finally {
  await vite.close();
}
