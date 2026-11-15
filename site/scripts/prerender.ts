import { recipePageTitle, siteName, siteTitle, websiteJsonLd } from "../src/content/site-metadata";
import { siteTarget } from "../src/content/site-target";
import { recipeCardAvifMedia, recipeCardSizes, recipeHeroAvifMedia } from "../src/features/recipes/image-layout";
import { contentForRoute, localeIndexes, serializeRouteContent, type RouteContent } from "../src/content/route-data";
import { contentManifest } from "../src/generated/routes.generated";
import { librarySeoDescription, libraryTitle } from "../src/features/recipes/home-preview";
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
import { privacyCopy, privacyLocaleFromPath, privacyPaths } from "../src/features/privacy/privacy-copy";

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

function routeMetadata(route: string, content: RouteContent) {
  const privacyLocale = privacyLocaleFromPath(route);
  const privacy = privacyLocale ? privacyCopy[privacyLocale] : null;
  const { recipe, pagination } = content;
  const methodLocale = (Object.keys(methodRoutes) as RecipeLocale[]).find((locale) => route === methodRoutes[locale]);
  const pilotPage = methodLocale !== undefined;
  const blogPost = articles.find(post => articlePath(post) === route);
  const blogIndex = route === blogRoot;
  const isBlog = Boolean(blogPost || blogIndex);
  const indexLocale = (Object.keys(localeBase) as RecipeLocale[]).find((locale) =>
    locale === "fi" ? route === "/" : route === `${localeBase[locale]}/` || route === localeBase[locale]);
  if (!pagination && !privacy && !recipe && !pilotPage && !isBlog && indexLocale !== "fi" && (!indexLocale || !siteContent.recipes.some((item) => item.locale === indexLocale))) return null;
  const locale = privacyLocale ?? recipe?.locale ?? pagination?.locale ?? methodLocale ?? indexLocale ?? "fi";
  const preview = !siteTarget.production && process.env.VITE_RECIPAVO_HERO_PREVIEW === "true";
  const branded = siteTarget.production || preview;
  const title = pagination ? libraryTitle(locale, pagination.page)
    : pilotPage ? glycemicLoadMeta[locale].title
    : recipe ? recipePageTitle(recipe)
    : siteTitle(privacy?.title ?? blogPost?.title ?? (blogIndex ? "Ruokaopas" : undefined)
      ?? (branded && indexLocale ? recipavoHeroCopy[locale].tagline : undefined)
      ?? indexNames[locale]);
  const description = (pagination ? librarySeoDescription(locale, pagination.page, content.recipes) : undefined)
    ?? privacy?.description ?? blogPost?.description
    ?? (blogIndex ? "Ruoanlaiton tekniikoita ja luotettavaa ravitsemustietoa." : undefined)
    ?? (branded && indexLocale ? recipavoHeroCopy[locale].intro : undefined)
    ?? (pilotPage ? glycemicLoadMeta[locale].description : undefined)
    ?? (recipe?.seoDescription || recipe?.description || recipeUi[locale].intro);
  const url = `${baseUrl}${route}`;
  const translations = recipe ? siteContent.recipes.filter((item) => item.recipeId === recipe.recipeId) : [];
  const publishedLocales = pagination ? [{ locale, path: route }] : privacy ? (Object.keys(privacyPaths) as RecipeLocale[]).map(locale => ({ locale, path: privacyPaths[locale] })) : isBlog ? [{locale: "fi" as RecipeLocale, path: route}] : pilotPage ? (Object.keys(methodRoutes) as RecipeLocale[]).map((itemLocale) => ({ locale: itemLocale, path: methodRoutes[itemLocale] })) : recipe
    ? translations.map((item) => ({ locale: item.locale, path: item.routePath }))
    : (Object.keys(localeBase) as RecipeLocale[])
        .filter((itemLocale) => siteContent.recipes.some((item) => item.locale === itemLocale))
        .map((itemLocale) => ({ locale: itemLocale, path: itemLocale === "fi" ? "/" : `${localeBase[itemLocale]}/` }));
  const alternates = publishedLocales.map(({ locale: altLocale, path: altPath }) =>
    `<link rel="alternate" hreflang="${altLocale}" href="${escapeHtml(`${baseUrl}${altPath}`)}" />`);
  const defaultAlternate = publishedLocales.find((item) => item.locale === "fi") ?? publishedLocales[0];
  if (defaultAlternate) alternates.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${baseUrl}${defaultAlternate.path}`)}" />`);
  const cardAvifSrc = pagination ? content.recipes[0]?.image?.homeAvifSrc : undefined;
  const avifSrc = recipe?.image?.heroAvifSrc ?? cardAvifSrc;
  const avifMedia = cardAvifSrc ? recipeCardAvifMedia : recipeHeroAvifMedia;
  const avifPreload = avifSrc
    ? `<link rel="preload" as="image" type="image/avif" media="${avifMedia}" href="${escapeHtml(avifSrc)}" fetchpriority="high" />`
    : "";
  const imageTags = recipe?.image ? [
    `<meta property="og:image" content="${escapeHtml(recipe.image.src)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(recipe.image.src)}" />`,
  ] : [];
  const jsonLd = blogPost ? `<script id="blog-jsonld" type="application/ld+json">${JSON.stringify(blogJsonLd(blogPosts.find(post => post.slug === blogPost.slug)!)).replaceAll("<", "\\u003c")}</script>` : recipe?.image
    ? `<script id="recipe-jsonld" type="application/ld+json">${JSON.stringify(recipeJsonLd(recipe)).replaceAll("<", "\\u003c")}</script>`
    : "";
  // Match the card grid breakpoints. Do not eagerly fetch three cards on mobile.
  // Let a picture with a mobile AVIF choose once the viewport is known.
  const desktopImages = content.recipes.slice(1, 3).flatMap((item, index) => item.image && !(branded && indexLocale && item.image.homeAvifSrc) ? [
      `<link rel="preload" as="image" fetchpriority="high" href="${escapeHtml(item.image.src)}" media="(min-width: ${index === 0 ? 700 : 1100}px)"${item.image.srcSet ? ` imagesrcset="${escapeHtml(item.image.srcSet)}"` : ""}${item.image.srcSet ? ` imagesizes="${escapeHtml(recipeCardSizes)}"` : ""} />`,
    ] : []);
  return {
    lang: locale,
    priorityImageMedia: avifSrc ? avifMedia : undefined,
    head: [
      `<title>${escapeHtml(title)}</title>`,
      avifPreload,
      `<meta name="description" content="${escapeHtml(description)}" />`,
      ...(preview || siteTarget.noIndex ? ['<meta name="robots" content="noindex, nofollow" />'] : []),
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
      `<meta property="og:type" content="${recipe || blogPost ? "article" : "website"}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:site_name" content="${siteName}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`,
      `<meta property="og:locale" content="${openGraphLocale[locale]}" />`,
      `<meta name="twitter:card" content="${recipe?.image || blogPost ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
      ...imageTags, ...(blogPost ? [`<meta property="og:image" content="${baseUrl}${blogPost.image}" />`, `<meta name="twitter:image" content="${baseUrl}${blogPost.image}" />`] : []), ...alternates, ...desktopImages, jsonLd,
      ...(siteTarget.production && route === "/"
        ? [`<script id="website-jsonld" type="application/ld+json">${JSON.stringify(websiteJsonLd(url))}</script>`]
        : []),
    ].filter(Boolean).join("\n    "),
  };
}

function imagePriorityEntry(entrySrc: string, media: string): string {
  // This module runs after parsing so the responsive picture and payload exist.
  // Let the image finish first, with a bounded wait and an immediate interaction path.
  return `<script type="module">
    const image = matchMedia(${JSON.stringify(media)}).matches &&
      document.querySelector("#root img[fetchpriority=high]");
    const importEntry = () => { void import(${JSON.stringify(entrySrc)}); };
    if (!image || image.complete) {
      importEntry();
    } else {
      const listeners = new AbortController();
      const start = () => {
        listeners.abort();
        clearTimeout(timeout);
        importEntry();
      };
      const options = { signal: listeners.signal };
      const timeout = setTimeout(start, 1000);
      image.addEventListener("load", start, options);
      image.addEventListener("error", start, options);
      document.addEventListener("pointerdown", start, { ...options, capture: true });
      document.addEventListener("keydown", start, { ...options, capture: true });
    }
  </script>`;
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
  // Inline the built CSS on home, library and optimized recipe pages so the
  // first paint can use the existing styles before any stylesheet request.
  const stylesheet = /<link rel="stylesheet"[^>]* href="[^"]*\/(assets\/[\w.-]+\.css)"[^>]*>/.exec(shell);
  if (!stylesheet) throw new Error("Missing Vite stylesheet in the HTML shell.");
  const css = await readFile(path.join(distDir, stylesheet[1]), "utf8");
  if (/<\/style/i.test(css)) throw new Error("Vite stylesheet cannot be safely inlined.");
  const inlineStyleShell = shell.replace(stylesheet[0], () => `<style>${css}</style>`);
  const entry = /<script type="module"[^>]* src="([^"]+)"[^>]*><\/script>/.exec(shell);
  if (!entry) throw new Error("Missing Vite entry module in the HTML shell.");
  const homeRoutes = new Set(Object.values(localeIndexes));
  const routes = Object.keys(contentManifest);
  for (const route of routes) {
    const initial: RouteContent = JSON.parse(await readFile(path.join(distDir, "data", contentManifest[route]), "utf8"));
    const metadata = routeMetadata(route, initial);
    if (!metadata) throw new Error("Missing prerender metadata for " + route);
    const router = await createStaticRouter(route, initial);
    const body = renderToString(React.createElement(RouterProvider, { router }));
    const data = `<script id="page-content" type="application/json">${serializeRouteContent(initial)}</script>`;
    const { priorityImageMedia } = metadata;
    const routeShell = priorityImageMedia
      ? inlineStyleShell.replace(entry[0], () => imagePriorityEntry(entry[1], priorityImageMedia))
      : homeRoutes.has(route) || initial.pagination ? inlineStyleShell : shell;
    const html = routeShell !== shell
      ? replaceDocument(routeShell, metadata.head, metadata.lang, body)
        .replace("</body>", () => `    ${data}\n  </body>`)
      : replaceDocument(shell, `${metadata.head}\n${data}`, metadata.lang, body);
    for (const outputPath of outputPaths(route)) {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, html, "utf8");
    }
  }

  for (const [locale, directory] of [["fi", ""], ["en", "en"], ["sv", "sv"], ["th", "th"]] as const) {
    const route = directory ? "/" + directory + "/404" : "/404";
    const router = await createStaticRouter(route, contentForRoute(siteContent.recipes, route));
    const body = renderToString(React.createElement(RouterProvider, { router }));
    const title = recipeUi[locale].notFound;
    const head = [
      "<title>" + escapeHtml(siteTitle(title)) + "</title>",
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
  if (siteTarget.basePath === "/" && siteTarget.noIndex) {
    await writeFile(path.join(distDir, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n", "utf8");
  }
  console.log(`Prerendered ${routes.length} routes with visible content, metadata, and a not-found page.`);
} finally {
  await vite.close();
}
