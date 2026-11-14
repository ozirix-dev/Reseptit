import { siteTarget } from "../src/content/site-target";
import { createHash } from "node:crypto";
import { publicRecipeQualityHold } from "./recipe-quality-holds";
import { projectSafeWontonFiDisplay } from "./wonton-fi-public-display";
import { projectMaterial21FiDisplay } from "./material21-fi-public-display";
import { projectMaterial21MethodsFi } from "./material21-methods-public-display";
import { projectC13FiDisplay } from "./c13-fi-public-display";
import { projectHuevosFiPublicPreparation } from "./huevos-c5-fi-public-preparation";
import { projectJianbingC5FiPublicNote } from "./jianbing-c5-fi-public-note";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";
import { projectReviewedFiEditorialSource } from "./gk80-editorial-display";
import { projectA8FiEditorialSource } from "./a8-editorial-display";
import { projectC20FiDisplay } from "./c20-fi-editorial-display";
import { projectMintWholeMilkFiDisplay } from "./d30-fi-mint-milk-display";
import { projectBreakfastFiQualityDisplay } from "./fi-breakfast-quality-display";
import { recipeFacets } from "../src/content/recipe-facets";
import { reviewedDietTagsForSource } from "./reviewed-diet-filters";
import { articles, articlePath, blogRoot } from "../src/features/blog/blog-data";
import { contentForRoute } from "../src/content/route-data";
import { createAssistantCatalog } from "../src/features/assistant/catalog";
import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown, renderSafeMarkdown, renderInstructionSteps } from "../src/content/markdown";
import { assertQuantifiedCriticalIngredients, assertUniqueRecipes, assertSnackPublicationReady } from "../src/content/recipe-validation";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { assertGlutenFreeReviewRecord } from "./gluten-free-review";
import { rebuildPublishedImages } from "../src/content/published-images";
import type { RecipeEntry, RecipeLocale, SiteContentIndex } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const repoDir = path.resolve(process.env.RECIPE_SOURCE_ROOT ?? path.resolve(siteDir, ".."));
const outputDir = path.join(siteDir, "src", "generated");
const baseUrl = siteTarget.baseUrl;
const imageSourceDir = path.join(repoDir, "kuvat");
const localeBase: Record<RecipeLocale, string> = { fi: "", en: "/en/recipes", sv: "/sv/recept", th: "/th/recipes" };

function routeForRecipe(locale: RecipeLocale, slug: string): string {
  return `${localeBase[locale]}/${slug}/`;
}

async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  }));
  return files.flat();
}

function section(markdown: string, titles: string[]): string {
  const heading = new RegExp(`^##\\s+(?:${titles.join("|")})\\s*$`, "im");
  const match = heading.exec(markdown);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const next = markdown.slice(start).search(/^##\s+/m);
  return markdown.slice(start, next < 0 ? undefined : start + next).trim();
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function recipeDescription(markdown: string, descriptionSection: string, locale: RecipeLocale, ingredients: { item: string }[]): string {
  const paragraphs = markdown.replace(/^\s*#\s+.*$/m, "").split(/\n\s*\n/);
  const lead = paragraphs.find((paragraph) => paragraph.trim() && !paragraph.trim().startsWith("##"));
  const isBoilerplate = (value: string) => /familiar finnish (?:food|dish)|rewritten to suit your own kitchen|familiar taste in food is built from simple ingredients|vegetables and creamy ingredients bring juiciness|portion size can be adjusted with the portion counter|tuttu suomalainen ruoka vähähiilihydraattisena kotiversiona|kirjoitettu uudelleen omaan keittiöön sopivaksi|tuttu maku rakentuu yksinkertaisista raaka-aineista|annoskokoa voi säätää reseptin annoslaskurilla/i.test(value);
  // Prefer a useful explicit description, then a useful lead. Older files often
  // contain the same generic copy in both places, so fall back to actual ingredients.
  const useful = [descriptionSection, lead].map((value) => stripHtml(value ?? "")).find((value) => value && !isBoilerplate(value));
  if (useful) return useful;
  const mainIngredients = ingredients.slice(0, 3).map(({ item }) => item);
  const list = mainIngredients.length > 1
    ? `${mainIngredients.slice(0, -1).join(", ")} ${locale === "fi" ? "ja" : locale === "sv" ? "och" : locale === "th" ? "และ" : "and"} ${mainIngredients.at(-1)}`
    : mainIngredients[0] ?? "";
  if (!list) return "";
  return {
    fi: `Valmistuksessa käytetään muun muassa ${list}.`,
    en: `Made with ${list}.`,
    sv: `Tillagas med bland annat ${list}.`,
    th: `เมนูนี้ใช้วัตถุดิบหลัก ได้แก่ ${list}`,
  }[locale];
}


/** Temporary public presentation guard. Do not edit protected nutrition-bound source for safety copy. */
function publicSafetyHold(recipeId: string, locale: RecipeLocale): { description: string; instructions: string } | null {
  if (recipeId !== "karibia-ackee-ja-suolakala") return null;
  const source = "https://www.fda.gov/food/natural-toxins-food/hypoglycin-and-ackee-fruit";
  const copy: Record<RecipeLocale, { description: string; instructions: string }> = {
    fi: {
      description: "TURVALLISUUSVAROITUS: Tämä ackee- ja suolakalaresepti on keskeneräinen. Älä valmista ruokaa näillä ainesmäärillä: 1 tl suolakalaa ja 1 kpl ackeea eivät ole luotettavia määriä. Käytä vain asianmukaisesti käsiteltyä, syötäväksi tarkoitettua ackee-tuotetta. Kypsymätön ackee sekä siemenet ja kuori ovat vaarallisia; kuumentaminen ei poista hypoglysiini A -toksiinia.",
      instructions: `1. Älä valmista tätä ruokalajia tämän keskeneräisen reseptin ainesmäärien tai alkuperäisten valmistusvaiheiden perusteella.
2. Turvallinen, punnittu resepti sekä suolakalan liotus-/suolanpoisto-ohje on vielä tarkistettava. Älä käytä raakaa tai kypsymätöntä ackeea, siemeniä tai kuorta. FDA: ${source}`,
    },
    en: {
      description: "FOOD SAFETY WARNING: This ackee and saltfish recipe is incomplete. Do not cook from these unreliable ingredient amounts. Only use properly processed ackee intended for consumption. Unripe ackee, its seeds and rind are hazardous; cooking does not destroy hypoglycin A.",
      instructions: `1. Do not cook from the ingredient quantities or preparation steps in this unfinished recipe.
2. A weighed recipe and saltfish desalting instructions are pending review. Never use unripe ackee, its seeds or rind. FDA: ${source}`,
    },
    sv: {
      description: "LIVSMEDELSVARNING: Detta recept med ackee och saltfisk är ofullständigt. Tillaga inte rätten med de opålitliga ingrediensmängderna. Använd endast ackee som har bearbetats på ett säkert sätt för konsumtion. Omogen ackee, kärnor och skal är farliga; upphettning förstör inte hypoglycin A.",
      instructions: `1. Laga inte rätten med mängderna eller tillagningsstegen i detta ofullständiga recept.
2. Ett uppvägt recept och instruktioner för avsaltning av saltfisk återstår att granska. Använd aldrig omogen ackee, kärnor eller skal. FDA: ${source}`,
    },
    th: {
      description: "คำเตือนด้านความปลอดภัยอาหาร: สูตรแอ็กกีและปลาเค็มนี้ยังไม่สมบูรณ์ อย่าปรุงตามปริมาณวัตถุดิบที่ระบุไว้ ใช้เฉพาะเนื้อแอ็กกีที่ผ่านกระบวนการอย่างปลอดภัยสำหรับการบริโภค แอ็กกีที่ยังไม่สุก เมล็ดและเปลือกมีอันตราย ความร้อนไม่สามารถทำลายสารไฮโปไกลซินเอได้",
      instructions: `1. ห้ามทำอาหารตามปริมาณวัตถุดิบหรือขั้นตอนในสูตรที่ยังไม่สมบูรณ์นี้
2. ต้องตรวจสอบสูตรที่ชั่งตวงและวิธีลดความเค็มของปลาเค็มก่อน ห้ามใช้แอ็กกีที่ยังไม่สุก เมล็ดหรือเปลือก แหล่งข้อมูล FDA: ${source}`,
    },
  };
  return copy[locale];
}

const editorialProjections = [
  projectHuevosFiPublicPreparation,
  projectJianbingC5FiPublicNote,
  projectReviewedFiEditorialSource,
  projectA8FiEditorialSource,
  projectC20FiDisplay,
  projectMintWholeMilkFiDisplay,
  projectBreakfastFiQualityDisplay,
  projectSafeWontonFiDisplay,
  projectMaterial21FiDisplay,
  projectMaterial21MethodsFi,
  projectC13FiDisplay,
];

function projectPublishedMarkdown(relativePath: string, canonical: string): string {
  return editorialProjections.reduce((text, project) => project(relativePath, text), canonical);
}

async function buildRecipes(): Promise<RecipeEntry[]> {
  const paths = [
    ...await markdownFiles(path.join(repoDir, "reseptit", "aamupalat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "valipalat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "alkuruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "paaruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "jalkiruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "leivonnaiset")),
    ...await markdownFiles(path.join(repoDir, "kaannokset")),
  ];
  const recipes: RecipeEntry[] = [];
  const sourceFacets = new Map<string, ReturnType<typeof recipeFacets>>();
  // Finnish sources are enumerated before all translations. Track their real
  // published paths so a changed original invalidates every locale review.
  const finnishSources = new Map<string, string>();
  const publishedImagePaths = new Set<string>();
  for (const filePath of paths) {
    const relativePath = path.relative(repoDir, filePath).replaceAll("\\", "/");
    const parsed = parseMarkdown(projectPublishedMarkdown(relativePath, await readFile(filePath, "utf8")));
    if (!parsed) continue;
    if (parsed.data.status === "draft") continue;
    // Exact safety quarantine retains sealed source/GK evidence while suppressing public routes.
    if (isPublicRecipeQuarantined(String(parsed.data.recipe_id ?? ""))) continue;
    if (parsed.data.status !== "published") throw new Error(`Recipe status must be draft or published: ${filePath}`);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    if (data.gluten_free === true) {
      const review = data.gluten_free_review!;
      // A fabricated, missing or stale review record cannot turn a recipe into a gluten-free listing.
      const reviewedText = await readFile(path.resolve(repoDir, review.evidence_ref), "utf8");
      const originalText = await readFile(filePath);
      const sourceSha256 = createHash("sha256").update(originalText).digest("hex");
      assertGlutenFreeReviewRecord({
        recipeId: data.recipe_id, language: data.language,
        reviewedAt: review.reviewed_at, reviewer: review.reviewer, sourceSha256,
      }, reviewedText);
    }
    assertSnackPublicationReady(data);
    if (data.language === "fi") {
      sourceFacets.set(data.recipe_id, recipeFacets(data.main_ingredient ?? [], data.tags));
      finnishSources.set(data.recipe_id, filePath);
    }
    const imagePaths = data.image
      ? [data.image.src, ...(data.image.srcset ?? []).map((item) => item.src)]
      : [];
    imagePaths.forEach((imagePath) => publishedImagePaths.add(imagePath));
    const instructions = section(parsed.content, ["Valmistus", "Preparation", "Instructions", "Tillagning", "Gör så här", "การทำ", "วิธีทำ"]);
    const safetyHold = publicSafetyHold(data.recipe_id, data.language);
    const visibleHold = safetyHold ?? publicRecipeQualityHold(data.recipe_id, data.language);
    const publicInstructions = visibleHold?.instructions ?? instructions;
    if (!instructions) throw new Error(`Published recipe has no instructions: ${filePath}`);
    const descriptionSection = section(parsed.content, ["Kuvaus", "Description", "Beskrivning", "คำอธิบาย"]);
    const notes = section(parsed.content, ["Muistiinpanot", "Notes", "Anteckningar", "หมายเหตุ"]);
    const dietTags = await reviewedDietTagsForSource(data.recipe_id, data.language, filePath, finnishSources.get(data.recipe_id));
    const instructionSteps = [...publicInstructions.matchAll(/^\s*\d+[.)]\s+(.+)$/gm)].map((match) => match[1].trim());
    recipes.push({
      kind: "recipe", recipeId: data.recipe_id, slug: data.url_slug, locale: data.language,
      title: data.title, category: data.category, dietClass: data.diet_class ?? null, ...(dietTags.length ? { dietTags } : {}), ...(data.gluten_free === true ? { glutenFree: true } : {}), routePath: routeForRecipe(data.language, data.url_slug),
      description: visibleHold?.description ?? recipeDescription(parsed.content, descriptionSection, data.language, data.ingredients), ingredients: data.ingredients,
      instructionsHtml: await renderSafeMarkdown(publicInstructions),
      instructionStepsHtml: await renderInstructionSteps(publicInstructions),
      instructionsText: instructionSteps.length ? instructionSteps : publicInstructions.split(/\n\s*\n/).filter(Boolean),
      notesHtml: await renderSafeMarkdown(!safetyHold && visibleHold ? "" : notes), servings: data.servings,
      timeTotalMin: data.time_total_min ?? null,
      difficulty: data.difficulty ?? null, tags: data.tags,
      image: data.image ? {
        src: `${baseUrl}/kuvat/${data.image.src}`,
        alt: data.image.alt, width: data.image.width, height: data.image.height,
        sizes: data.image.sizes ?? null,
        srcSet: data.image.srcset?.map((item) => `${baseUrl}/kuvat/${item.src} ${item.width}w`).join(", ") ?? null,
      } : null,
      nutrition: {
        carbsNetG: data.carbs_net_per_serving_g ?? null, carbsTotalG: data.carbs_total_per_serving_g ?? null,
        proteinG: data.protein_per_serving_g ?? null, fatG: data.fat_per_serving_g ?? null,
      },
    });
  }
  assertUniqueRecipes(recipes);
  assertQuantifiedCriticalIngredients(recipes);
  for (const recipe of recipes) Object.assign(recipe, sourceFacets.get(recipe.recipeId) ?? { cuisine: null, ingredientGroups: [] });
  const images = await rebuildPublishedImages(imageSourceDir, path.join(siteDir, "public"), [...publishedImagePaths]);
  const byPath = new Map(images.images.map((image) => [image.path, image]));
  for (const recipe of recipes) {
    if (!recipe.image) continue;
    const source = byPath.get(recipe.image.src.slice(`${baseUrl}/kuvat/`.length))!;
    recipe.image.width = source.width;
    recipe.image.height = source.height;
    // Keep the unchanged original as src and the largest candidate (also used by SEO).
    recipe.image.srcSet = [...source.variants, source]
      .map((image) => `${baseUrl}/kuvat/${image.path} ${image.width}w`).join(", ");
  }
  return recipes.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
}

function xmlEscape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function main() {
  const recipes = await buildRecipes();
  const index: SiteContentIndex = { articles: [], recipes };
  await mkdir(outputDir, { recursive: true });
  // Avoid TypeScript inferring an enormous union from thousands of recipes.
  // Input was schema-validated above; this module is used only by build/SSR/tests.
  await writeFile(path.join(outputDir, "content.generated.ts"), `/* Generated by scripts/build-content.ts. */\nimport type { SiteContentIndex } from "../types/content";\n\nexport const siteContent: SiteContentIndex = JSON.parse(${JSON.stringify(JSON.stringify(index))});\n`, "utf8");
  const routes = ["/", blogRoot, ...articles.map(articlePath), "/glykeeminen-kuorma/", "/en/glycemic-load/", "/sv/glykemisk-belastning/", "/th/glycemic-load/", ...recipes.map((recipe) => recipe.routePath)];
  for (const locale of ["en", "sv", "th"] as const) {
    if (recipes.some((recipe) => recipe.locale === locale)) routes.push(`${localeBase[locale]}/`);
  }
  const dataDir = path.join(siteDir, "public", "data");
  // This directory is exclusively generated; remove stale published payloads.
  await rm(dataDir, { recursive: true, force: true });
  await mkdir(dataDir, { recursive: true });
  const manifest: Record<string, string> = {};
  for (const route of routes) {
    const json = JSON.stringify(contentForRoute(recipes, route));
    const filename = `${createHash("sha256").update(json).digest("hex").slice(0, 20)}.json`;
    manifest[route] = filename;
    await writeFile(path.join(dataDir, filename), json, "utf8");
  }
  // A1: lazily consumed, language-scoped assistant catalogs, never loaded into the main JS bundle.
  // This is published content only; no AI generation, GK estimates, drafts or private user data.
  const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
  const recipeVersions = new Map(recipes.map((recipe) => [recipe, sha256(JSON.stringify(recipe))]));
  const assistantManifest: Partial<Record<RecipeLocale, { file: string; sha256: string; count: number }>> = {};
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    if (!recipes.some((recipe) => recipe.locale === locale)) continue;
    const catalog = createAssistantCatalog(recipes, locale, (recipe) => recipeVersions.get(recipe)!);
    const json = JSON.stringify(catalog);
    const digest = sha256(json);
    const filename = `assistant-${locale}-${digest.slice(0, 20)}.json`;
    await writeFile(path.join(dataDir, filename), json, "utf8");
    assistantManifest[locale] = { file: filename, sha256: digest, count: catalog.recipes.length };
  }
  await writeFile(path.join(dataDir, "assistant-manifest.json"),
    JSON.stringify({ schemaVersion: 1, locales: assistantManifest }), "utf8");
  const locales = [...new Set(recipes.map((recipe) => recipe.locale))];
  await writeFile(path.join(outputDir, "routes.generated.ts"), `/* Generated; route addresses only, no recipe content. */
import type { RecipeLocale } from "../types/content";
export const publishedLocales: RecipeLocale[] = ${JSON.stringify(locales)};
export const contentManifest: Record<string, string> = ${JSON.stringify(manifest)};
`, "utf8");
  const urls = [...new Set(routes)].map((route) => `  <url><loc>${xmlEscape(`${baseUrl}${route}`)}</loc></url>`).join("\n");
  const publicDir = path.join(siteDir, "public");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, "utf8");
  const robots = (siteTarget.basePath === "/Reseptit/"
    ? "# Project-path robots.txt; host-wide crawling policy is controlled at /robots.txt.\n"
    : "")
    + "User-agent: *\nAllow: " + siteTarget.basePath + "\n"
    + (siteTarget.noIndex ? "" : "\nSitemap: " + baseUrl + "/sitemap.xml\n");
  await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");
  await writeFile(path.join(publicDir, ".nojekyll"), "", "utf8");
  console.log(`Built ${recipes.length} published recipe translations from local Markdown.`);
}

await main();
