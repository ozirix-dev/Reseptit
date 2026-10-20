import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { RouterProvider } from "react-router-dom";
import { createServer } from "vite";
import { siteContent } from "../src/generated/content.generated";
import { recipeJsonLd } from "../src/features/recipes/schema";
import type { RecipeLocale } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(siteDir, "dist");
const baseUrl = "https://ozirix-dev.github.io/Reseptit";
const localeBase: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };
const indexNames: Record<RecipeLocale, string> = { fi: "Reseptit", en: "Recipes", sv: "Recept", th: "สูตรอาหาร" };
const openGraphLocale: Record<RecipeLocale, string> = { fi: "fi_FI", en: "en_GB", sv: "sv_SE", th: "th_TH" };
const indexDescriptions: Record<RecipeLocale, string> = {
  fi: "Selkeitä reseptejä arkeen.", en: "Straightforward recipes for everyday cooking.",
  sv: "Enkla recept för vardagen.", th: "สูตรอาหารเรียบง่ายสำหรับทุกวัน",
};

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function outputPaths(route: string): string[] {
  const clean = route.replace(/^\//, "").replace(/\/$/, "");
  return [clean ? path.join(distDir, clean, "index.html") : path.join(distDir, "index.html")];
}

function routeMetadata(route: string) {
  const recipe = siteContent.recipes.find((item) => item.routePath === route);
  const indexLocale = (Object.keys(localeBase) as RecipeLocale[]).find((locale) =>
    locale === "fi" ? route === "/" : route === `${localeBase[locale]}/` || route === localeBase[locale]);
  if (!recipe && indexLocale !== "fi" && (!indexLocale || !siteContent.recipes.some((item) => item.locale === indexLocale))) return null;
  const locale = recipe?.locale ?? indexLocale ?? "fi";
  const title = recipe ? `${recipe.title} | ${indexNames[locale]}` : `${indexNames[locale]} | Ozirix`;
  const description = recipe?.description || indexDescriptions[locale];
  const url = `${baseUrl}${route}`;
  const translations = recipe ? siteContent.recipes.filter((item) => item.recipeId === recipe.recipeId) : [];
  const publishedLocales = recipe
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
  const jsonLd = recipe
    ? `<script id="recipe-jsonld" type="application/ld+json">${JSON.stringify(recipeJsonLd(recipe)).replaceAll("<", "\\u003c")}</script>`
    : "";
  return {
    lang: locale,
    head: [
      `<title>${escapeHtml(title)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
      `<meta property="og:type" content="${recipe ? "article" : "website"}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
      `<meta property="og:locale" content="${openGraphLocale[locale]}" />`,
      `<meta name="twitter:card" content="${recipe?.image ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      ...imageTags, ...alternates, jsonLd,
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
  const routes = [...new Set([
    "/",
    ...(Object.keys(localeBase) as RecipeLocale[])
      .filter((locale) => locale !== "fi" && siteContent.recipes.some((recipe) => recipe.locale === locale))
      .map((locale) => `${localeBase[locale]}/`),
    ...siteContent.recipes.map((recipe) => recipe.routePath),
  ])];

  for (const route of routes) {
    const metadata = routeMetadata(route);
    if (!metadata) continue;
    const router = createStaticRouter(route);
    const body = renderToString(React.createElement(RouterProvider, { router }));
    const html = replaceDocument(shell, metadata.head, metadata.lang, body);
    for (const outputPath of outputPaths(route)) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, "utf8");
    }
  }

  const notFoundRouter = createStaticRouter("/404");
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
