import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown } from "../src/content/markdown";
import { assessRecipeSimilarity, auditRecipeLibrary, checkPublicRecipeSubmission } from "../src/content/recipe-similarity";
import type { SimilarityAssessment, SimilarityRecipe } from "../src/content/recipe-similarity";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const publishedDirs = ["reseptit/aamupalat", "reseptit/valipalat", "reseptit/alkuruoat",
  "reseptit/paaruoat", "reseptit/jalkiruoat", "reseptit/leivonnaiset"];
const pendingDirs = ["docs/reviews/valipalat/katselmointi", "docs/reviews/valipalat/luonnokset"];
const args = process.argv.slice(2);
const isAll = args.includes("--all");
const isChanged = args.includes("--changed");
const submissionArg = args.find((arg) => arg.startsWith("--submission="));
const outputArg = args.find((arg) => arg.startsWith("--output="));
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const limit = Math.max(0, Math.min(100, Number(limitArg?.split("=")[1] ?? 20) || 20));

if ([isAll, isChanged, Boolean(submissionArg)].filter(Boolean).length !== 1) {
  throw new Error("Choose exactly one of --all, --changed, or --submission=path");
}

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(path.resolve(repoRoot, directory), { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const paths = await Promise.all(entries.map(async (entry) => {
    const child = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(child);
    return entry.isFile() && entry.name.endsWith(".md") ? [child] : [];
  }));
  return paths.flat();
}

function section(markdown: string, titles: string[]): string {
  const header = new RegExp("^##\\s+(?:" + titles.join("|") + ")\\s*$", "im");
  const match = header.exec(markdown);
  if (!match) return "";
  const start = match.index + match[0].length;
  const end = markdown.slice(start).search(/^##\s+/m);
  return markdown.slice(start, end < 0 ? undefined : start + end).trim();
}

function toRecipe(markdown: string, file: string, scope: "published" | "pending"): SimilarityRecipe | null {
  const parsed = parseMarkdown(markdown);
  if (!parsed || typeof parsed.data !== "object") return null;
  const data = parsed.data as Record<string, unknown>;
  if (scope === "published" && (data.status !== "published" || data.language !== "fi")) return null;
  if (scope === "pending" && data.status === "published") return null;
  if (!Array.isArray(data.ingredients) || typeof data.recipe_id !== "string" ||
      typeof data.title !== "string" || typeof data.servings !== "number" || data.servings <= 0 ||
      typeof data.language !== "string") return null;
  const ingredients = data.ingredients.map((entry) => {
    const ingredient = entry as Record<string, unknown>;
    return {
      item: typeof ingredient.item === "string" ? ingredient.item : "",
      amount: typeof ingredient.amount === "number" ? ingredient.amount : null,
      unit: typeof ingredient.unit === "string" ? ingredient.unit : "",
      ...(typeof ingredient.note === "string" ? { note: ingredient.note } : {}),
    };
  }).filter((ingredient) => ingredient.item);
  if (!ingredients.length) return null;
  const instructions = section(parsed.content, ["Valmistus", "Preparation", "Instructions",
    "Tillagning", "Gör så här", "การทำ", "วิธีทำ"]);
  return {
    recipeId: data.recipe_id, title: data.title, locale: data.language, servings: data.servings,
    ingredients, instructions: instructions.split(/\n+/).filter(Boolean),
    cookingMethods: Array.isArray(data.cooking_method) ? data.cooking_method.filter((item): item is string => typeof item === "string") : [],
    category: typeof data.category === "string" ? data.category : undefined,
    sourcePath: file, scope,
  };
}

async function readRecipes(directories: string[], scope: "published" | "pending"): Promise<SimilarityRecipe[]> {
  const files = (await Promise.all(directories.map(markdownFiles))).flat();
  const recipes = await Promise.all(files.map(async (file) => toRecipe(await readFile(path.join(repoRoot, file), "utf8"), file, scope)));
  return recipes.filter((recipe): recipe is SimilarityRecipe => recipe !== null);
}

function changedPaths(): string[] {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA || "HEAD";
  if (!base || /^0+$/.test(base)) throw new Error("BASE_SHA required for --changed mode");
  return execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", base, head], {
    cwd: repoRoot, encoding: "utf8",
  }).trim().split(/\r?\n/).filter(Boolean).map((file) => file.replaceAll("\\", "/"));
}

function toMarkdown(results: SimilarityAssessment[], comparedCount: number, mode: string): string {
  const matches = results.reduce((sum, result) => sum + result.matches.length, 0);
  const lines = [
    "# Recipavo – reseptien samankaltaisuustarkistus",
    "",
    "Tila: **vain katselmointiehdotus**. Ei automaattisia poistoja, julkaisuja eikä GK-muutoksia.",
    "",
    "- Tila: " + mode,
    "- Verrattuja ehdokkaita: " + comparedCount,
    "- Epäilyttäviä ehdokkaita: " + results.length,
    "- Raporttiin sisältyviä osumia: " + matches,
    "",
  ];
  if (!results.length) lines.push("Ei raportoituja osumia. Tämä ei yksin todista, että duplikaatteja ei ole.");
  for (const result of results.slice(0, limit)) {
    lines.push("## " + result.candidateRecipeId + " — " + result.status, "");
    for (const match of result.matches) {
      lines.push("- **" + match.kind + "**: " + match.title + " (" + match.recipeId + ")" +
        (match.sourcePath ? " – " + match.sourcePath : "") + "; score " + match.score.toFixed(3) +
        "; ainesosat " + Math.round(match.ingredientOverlap * 100) + " %");
      for (const reason of match.reasons) lines.push("  - " + reason);
    }
    for (const warning of result.warnings) lines.push("- VAROITUS: " + warning);
    lines.push("");
  }
  if (results.length > limit) lines.push("Raportista rajattu pois " + (results.length - limit) + " muuta ehdokasta; JSON sisältää kaiken arvioidun.");
  lines.push("", "Samankaltaisuusluvut ovat heuristisia eivätkä ihmisen hyväksymiä todennäköisyyksiä.", "");
  return lines.join("\n");
}

const published = await readRecipes(publishedDirs, "published");
const pending = await readRecipes(pendingDirs, "pending");
let results: SimilarityAssessment[] = [];
let count = 0;
let mode = "";

if (isAll) {
  results = auditRecipeLibrary(published);
  for (const proposal of pending) {
    const assessment = assessRecipeSimilarity(proposal, [...published, ...pending]);
    if (assessment.matches.length || assessment.warnings.length) results.push(assessment);
  }
  count = published.length + pending.length;
  mode = "Koko kirjasto + tuetut katselmointiluonnokset";
} else if (isChanged) {
  const paths = changedPaths();
  const changed = [...published, ...pending].filter((recipe) => recipe.sourcePath && paths.includes(recipe.sourcePath));
  results = changed.map((recipe) => assessRecipeSimilarity(recipe, [...published, ...pending]))
    .filter((result) => result.matches.length || result.warnings.length);
  count = changed.length;
  mode = "Muutetut reseptit PR:ssä";
} else {
  const file = submissionArg!.slice("--submission=".length);
  const candidate = toRecipe(await readFile(path.resolve(repoRoot, file), "utf8"), file, "pending");
  if (!candidate) throw new Error("Submission must be a Markdown recipe with structured ingredients");
  // Same gate used by future authenticated T4 submissions; never print other users' private pending text.
  const result = checkPublicRecipeSubmission(candidate, published, pending);
  results = [result.internal];
  count = 1;
  mode = "Julkinen reseptiehdotus (paikallinen testitila)";
}
const report = toMarkdown(results, count, mode);
console.log("Similarity audit: " + count + " candidates, " + results.length + " flagged.");
console.log(report);
if (outputArg) {
  const output = path.resolve(repoRoot, outputArg.slice("--output=".length));
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, report, "utf8");
  await writeFile(output.replace(/\.md$/i, "") + ".json", JSON.stringify({
    mode, comparedCandidates: count, publishedCount: published.length, pendingCount: pending.length, results,
  }, null, 2) + "\n", "utf8");
  console.log("Wrote report: " + output);
}
