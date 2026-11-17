import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { siteContent } from "../src/generated/content.generated";
import { gkOnlyVariants, gkVersionCoverage } from "../src/generated/gk-only-variants.generated";
import { glycemicLoadAdditionalResults, glycemicLoadPendingRecipeIds, glycemicLoadPilotResults, glycemicLoadPilotReviewedRecipeCount, glycemicLoadPortions } from "../src/generated/glycemic-load-pilot.generated";
import { glycemicLoadFilterCategories } from "../src/generated/glycemic-load-filters.generated";
import { contentForRoute, localeIndexes, recipeLibraryRoutes, summarizeRecipe, type RecipeCatalog, type RouteContent } from "../src/content/route-data";
import { siteTarget } from "../src/content/site-target";
import { articles, articlePath, blogRoot } from "../src/features/blog/blog-data";
import { privacyPaths } from "../src/features/privacy/privacy-copy";
import { homepageTopics } from "../src/features/recipes/home-preview";
import { countGkPortionCoverage, originalPortionCarbs } from "../src/features/recipes/gk-portion";
import { withholdF25Nutrition } from "../src/features/recipes/f25-nutrition-withhold";
import { glycemicLoadPath } from "../src/features/recipes/recipe-i18n";
import { recipeSearchEntry, supportedRecipeDiets } from "../src/features/recipes/recipe-search";
import type { RecipeLocale } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(siteDir, "public");
const { recipes } = siteContent;
const locales = (Object.keys(localeIndexes) as RecipeLocale[]).filter(locale => recipes.some(recipe => recipe.locale === locale));
const featured = siteTarget.production || process.env.VITE_RECIPAVO_HERO_PREVIEW === "true";
const indexLocales = new Map(locales.map(locale => [localeIndexes[locale], locale]));
const methodPaths = new Set((Object.keys(localeIndexes) as RecipeLocale[]).map(glycemicLoadPath));
const libraryRoutes = recipeLibraryRoutes(recipes);
const routes = [...new Set([...indexLocales.keys(), ...Object.values(privacyPaths), blogRoot,
  ...articles.map(articlePath), ...methodPaths, ...libraryRoutes, ...recipes.map(recipe => recipe.routePath)])];

if (libraryRoutes.some(route => recipes.some(recipe => recipe.routePath === route))) {
  throw new Error("A published recipe path conflicts with a recipe library path.");
}

async function writeData(value: unknown, prefix = "") {
  const json = JSON.stringify(value);
  const hash = createHash("sha256").update(json).digest("hex").slice(0, 20);
  const file = prefix + hash + ".json";
  await writeFile(path.join(publicDir, "data", file), json, "utf8");
  return file;
}

const catalogs = new Map<RecipeLocale, RecipeCatalog>();
for (const locale of locales) {
  const entries = recipes.filter(recipe => recipe.locale === locale).map(summarizeRecipe);
  const searchFile = await writeData(entries.map(recipeSearchEntry), "search-" + locale + "-");
  const diets = supportedRecipeDiets.filter(diet => diet !== "all").filter(diet => entries.some(recipe =>
    diet === "keto" ? recipe.dietClass === "keto" :
      diet === "vhh" ? recipe.dietClass !== null : recipe.dietTags?.includes(diet)));
  catalogs.set(locale, {
    total: entries.length,
    searchFile,
    categories: [...new Set(entries.flatMap(recipe => [recipe.category, ...(recipe.additionalCategories ?? [])]))],
    diets,
    cuisines: [...new Set(entries.flatMap(recipe => recipe.cuisine ? [recipe.cuisine] : []))],
    ingredientGroups: [...new Set(entries.flatMap(recipe => recipe.ingredientGroups ?? []))],
    hasGlycemicLoad: entries.some(recipe => glycemicLoadFilterCategories[recipe.recipeId] !== undefined),
    topics: homepageTopics(entries),
  });
}

const results = [...glycemicLoadPilotResults, ...glycemicLoadAdditionalResults];
const resultsByRecipe = new Map(results.map(result => [result.recipeId, result]));
const pending = new Set(glycemicLoadPendingRecipeIds);
for (const result of results) {
  if (result.status !== "CALCULATED" && result.incompleteReasons.some(reason => reason.category === "REVIEW_PENDING")) {
    pending.add(result.recipeId);
  }
}
const originalRecipes = recipes.filter(recipe => recipe.locale === "fi");
const pendingRows = originalRecipes.filter(recipe => pending.has(recipe.recipeId) && !resultsByRecipe.has(recipe.recipeId)).map(recipe => ({
  recipeId: recipe.recipeId, title: recipe.title, routePath: recipe.routePath,
  localeRoutes: Object.fromEntries(recipes.filter(entry => entry.recipeId === recipe.recipeId)
    .map(({ locale, title, routePath }) => [locale, { title, routePath }])),
  status: "INSUFFICIENT SOURCE DATA" as const,
  incompleteReasons: [{ ingredientIndex: -1, ingredientNames: {}, category: "REVIEW_PENDING" as const }],
  glycemicLoadPerServing: null, glycemicLoadRangePerServing: null, omittedAvailableCarbohydratePerServingG: 0,
  confidence: null, carbohydrateSources: [], sourceReferences: [],
  portionEvidence: glycemicLoadPortions[recipe.recipeId],
}));
const portionCoverage = countGkPortionCoverage(originalRecipes.map(recipe => {
  const evidence = glycemicLoadPortions[recipe.recipeId];
  const withheld = withholdF25Nutrition(recipe.recipeId, recipe.locale);
  return {
    numeric: !withheld && resultsByRecipe.get(recipe.recipeId)?.status === "CALCULATED",
    carbs: withheld ? null : originalPortionCarbs(recipe.nutrition, evidence),
    evidence: withheld && evidence ? { driver: evidence.driver } : evidence,
    pending: pending.has(recipe.recipeId),
  };
}));
const overview: RouteContent["glycemicOverview"] = {
  results: [...results, ...pendingRows],
  variants: gkOnlyVariants,
  coverage: gkVersionCoverage,
  reviewedCount: glycemicLoadPilotReviewedRecipeCount,
  portionCoverage,
};
const manifest: Record<string, string> = {};
for (const route of routes) {
  const data = contentForRoute(recipes, route, featured);
  const locale = indexLocales.get(route);
  if (locale) data.catalog = catalogs.get(locale)!;
  if (data.recipe) {
    const id = data.recipe.recipeId;
    data.glycemicRecipe = {
      result: resultsByRecipe.get(id) ?? null,
      portionEvidence: glycemicLoadPortions[id],
      pending: pending.has(id),
      variants: gkOnlyVariants.filter(variant => variant.recipeId === id),
    };
  }
  if (methodPaths.has(route)) data.glycemicOverview = overview;
  manifest[route] = await writeData(data);
}

await writeFile(path.join(siteDir, "src", "generated", "routes.generated.ts"), `/* Generated by scripts/prepare-routes.ts. */
import type { RecipeLocale } from "../types/content";
export const publishedLocales: RecipeLocale[] = ${JSON.stringify(locales)};
export const contentManifest: Record<string, string> = ${JSON.stringify(manifest)};
`, "utf8");

const urls = routes.map(route => "  <url><loc>" + (siteTarget.baseUrl + route).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "</loc></url>").join("\n");
await writeFile(path.join(publicDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, "utf8");
const robots = "User-agent: *\nAllow: /\n"
  + (siteTarget.noIndex ? "" : "\nSitemap: " + siteTarget.baseUrl + "/sitemap.xml\n");
await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");
