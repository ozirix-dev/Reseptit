import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import type { RecipeEntry, RecipeLocale, SiteContentIndex } from "../src/types/content";

const siteDir = path.resolve(import.meta.dirname, "..");
const repoDir = path.resolve(siteDir, "..");
const outputDir = path.join(siteDir, "src", "generated");
const baseUrl = "https://ozirix-dev.github.io/Reseptit";
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

function recipeDescription(markdown: string, descriptionSection: string): string {
  const paragraphs = markdown.replace(/^\s*#\s+.*$/m, "").split(/\n\s*\n/);
  const lead = paragraphs.find((paragraph) => paragraph.trim() && !paragraph.trim().startsWith("##"));
  return stripHtml(lead ?? descriptionSection);
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
  for (const filePath of paths) {
    const parsed = parseMarkdown(await readFile(filePath, "utf8"));
    if (!parsed) continue;
    if (parsed.data.status !== "published") continue;
    const data = recipeFrontmatterSchema.parse(parsed.data);
    const instructions = section(parsed.content, ["Valmistus", "Preparation", "Instructions", "Tillagning", "การทำ"]);
    if (!instructions) throw new Error(`Published recipe has no instructions: ${filePath}`);
    const descriptionSection = section(parsed.content, ["Kuvaus", "Description", "Beskrivning", "คำอธิบาย"]);
    const notes = section(parsed.content, ["Muistiinpanot", "Notes", "Anteckningar", "หมายเหตุ"]);
    const instructionSteps = [...instructions.matchAll(/^\s*\d+[.)]\s+(.+)$/gm)].map((match) => match[1].trim());
    recipes.push({
      kind: "recipe", recipeId: data.recipe_id, slug: data.url_slug, locale: data.language,
      title: data.title, category: data.category, routePath: routeForRecipe(data.language, data.url_slug),
      description: recipeDescription(parsed.content, descriptionSection), ingredients: data.ingredients,
      instructionsHtml: await marked.parse(instructions),
      instructionsText: instructionSteps.length ? instructionSteps : instructions.split(/\n\s*\n/).filter(Boolean),
      notesHtml: await marked.parse(notes), servings: data.servings, timeTotalMin: data.time_total_min ?? null,
      difficulty: data.difficulty ?? null, tags: data.tags,
      nutrition: {
        carbsNetG: data.carbs_net_per_serving_g ?? null, carbsTotalG: data.carbs_total_per_serving_g ?? null,
        proteinG: data.protein_per_serving_g ?? null, fatG: data.fat_per_serving_g ?? null,
      },
    });
  }
  const ids = new Set<string>();
  const routes = new Set<string>();
  for (const recipe of recipes) {
    const id = `${recipe.recipeId}:${recipe.locale}`;
    const route = `${recipe.locale}:${recipe.routePath}`;
    if (ids.has(id)) throw new Error(`Duplicate published recipe translation: ${id}`);
    if (routes.has(route)) throw new Error(`Duplicate published recipe URL: ${route}`);
    ids.add(id);
    routes.add(route);
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
  await writeFile(path.join(outputDir, "content.generated.ts"), `/* Generated by scripts/build-content.ts. */\nimport type { SiteContentIndex } from "../types/content";\n\nexport const siteContent: SiteContentIndex = ${JSON.stringify(index, null, 2)};\n`, "utf8");
  const routes = ["/", ...recipes.map((recipe) => recipe.routePath)];
  for (const locale of ["en", "sv", "th"] as const) {
    if (recipes.some((recipe) => recipe.locale === locale)) routes.push(`${localeBase[locale]}/`);
  }
  const urls = [...new Set(routes)].map((route) => `  <url><loc>${xmlEscape(`${baseUrl}${route}`)}</loc></url>`).join("\n");
  const publicDir = path.join(siteDir, "public");
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, "utf8");
  await writeFile(path.join(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`, "utf8");
  await writeFile(path.join(publicDir, ".nojekyll"), "", "utf8");
  console.log(`Built ${recipes.length} published recipe translations from local Markdown.`);
}

await main();
