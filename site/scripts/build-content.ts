import { createHash } from "node:crypto";
import { contentForRoute } from "../src/content/route-data";
import { mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown, renderSafeMarkdown } from "../src/content/markdown";
import { assertUniqueRecipes } from "../src/content/recipe-validation";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { rebuildPublishedImages } from "../src/content/published-images";
import type { RecipeEntry, RecipeLocale, SiteContentIndex } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const repoDir = path.resolve(process.env.RECIPE_SOURCE_ROOT ?? path.resolve(siteDir, ".."));
const outputDir = path.join(siteDir, "src", "generated");
const baseUrl = "https://ozirix-dev.github.io/Reseptit";
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

async function buildRecipes(): Promise<RecipeEntry[]> {
  const paths = [
    ...await markdownFiles(path.join(repoDir, "reseptit", "alkuruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "paaruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "jalkiruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "leivonnaiset")),
    ...await markdownFiles(path.join(repoDir, "kaannokset")),
  ];
  const recipes: RecipeEntry[] = [];
  const publishedImagePaths = new Set<string>();
  for (const filePath of paths) {
    const parsed = parseMarkdown(await readFile(filePath, "utf8"));
    if (!parsed) continue;
    if (parsed.data.status === "draft") continue;
    if (parsed.data.status !== "published") throw new Error(`Recipe status must be draft or published: ${filePath}`);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    const imagePaths = data.image
      ? [data.image.src, ...(data.image.srcset ?? []).map((item) => item.src)]
      : [];
    imagePaths.forEach((imagePath) => publishedImagePaths.add(imagePath));
    const instructions = section(parsed.content, ["Valmistus", "Preparation", "Instructions", "Tillagning", "Gör så här", "การทำ", "วิธีทำ"]);
    if (!instructions) throw new Error(`Published recipe has no instructions: ${filePath}`);
    const descriptionSection = section(parsed.content, ["Kuvaus", "Description", "Beskrivning", "คำอธิบาย"]);
    const notes = section(parsed.content, ["Muistiinpanot", "Notes", "Anteckningar", "หมายเหตุ"]);
    const instructionSteps = [...instructions.matchAll(/^\s*\d+[.)]\s+(.+)$/gm)].map((match) => match[1].trim());
    recipes.push({
      kind: "recipe", recipeId: data.recipe_id, slug: data.url_slug, locale: data.language,
      title: data.title, category: data.category, dietClass: data.diet_class ?? null, routePath: routeForRecipe(data.language, data.url_slug),
      description: recipeDescription(parsed.content, descriptionSection, data.language, data.ingredients), ingredients: data.ingredients,
      instructionsHtml: await renderSafeMarkdown(instructions),
      instructionsText: instructionSteps.length ? instructionSteps : instructions.split(/\n\s*\n/).filter(Boolean),
      notesHtml: await renderSafeMarkdown(notes), servings: data.servings, timeTotalMin: data.time_total_min ?? null,
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
  const routes = ["/", ...recipes.map((recipe) => recipe.routePath)];
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
  await writeFile(path.join(publicDir, "robots.txt"), `# Project-path robots.txt; host-wide crawling policy is controlled at /robots.txt.\nUser-agent: *\nAllow: /Reseptit/\n\nSitemap: ${baseUrl}/sitemap.xml\n`, "utf8");
  await writeFile(path.join(publicDir, ".nojekyll"), "", "utf8");
  console.log(`Built ${recipes.length} published recipe translations from local Markdown.`);
}

await main();
