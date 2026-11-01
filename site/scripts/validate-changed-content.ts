import {validateGk80Candidate} from './gk80-release';
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { auditTranslations } from "./translation-audit";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import type { Calculation } from "./nutrition-model";
import { recipeBindingHash } from "./glycemic-load-recipe-binding";
import { assertChangedRecipeAuditIsClean, duplicateRoutesForChangedRecipes, type PublishedRoute } from "./changed-content-checks";
import { parseMarkdown, renderInstructionSteps, renderSafeMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const siteDir = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(siteDir, "..");
const suppliedPaths = process.argv.slice(2);
const recipePaths = suppliedPaths.filter((file) => /^(?:reseptit|kaannokset)\/.+\.md$/i.test(file));
const evidencePaths = suppliedPaths.filter((file) => /^docs\/nutrition\/calculations\/[a-z0-9-]+\.json$/i.test(file));
const sourceCategories = ["alkuruoat", "paaruoat", "jalkiruoat", "leivonnaiset", "aamupalat"];
const translationLocales = ["en", "sv", "th"];

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(filename);
    return entry.isFile() && entry.name.endsWith(".md") ? [filename] : [];
  }));
  return nested.flat();
}

function resolveRepoFile(relativePath: string): string {
  const fullPath = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Changed path escapes the repository: ${relativePath}`);
  }
  return fullPath;
}

function changedNutritionValues(relativePath: string): boolean {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA || "HEAD";
  if (!base || /^0+$/.test(base)) return false;
  const diff = execFileSync("git", ["diff", "--unified=0", base, head, "--", relativePath], { encoding: "utf8" });
  return diff.split(/\r?\n/).some((line) =>
    /^\+(?!\+).*\b(?:carbs_net_per_serving_g|carbs_total_per_serving_g|protein_per_serving_g|fat_per_serving_g)\s*:/.test(line));
}

function previousRecipeId(relativePath: string): string | null {
  const base = process.env.BASE_SHA;
  if (!base || /^0+$/.test(base)) return null;
  try {
    execFileSync("git", ["cat-file", "-e", `${base}:${relativePath}`], { stdio: "ignore" });
  } catch {
    return null;
  }
  const previous = execFileSync("git", ["show", `${base}:${relativePath}`], { encoding: "utf8" });
  const parsed = parseMarkdown(previous);
  return typeof parsed?.data.recipe_id === "string" ? parsed.data.recipe_id : null;
}

const changedRecipes: { path: string; data: ReturnType<typeof recipeFrontmatterSchema.parse>; markdown: string }[] = [];
for (const relativePath of recipePaths) {
  const fullPath = resolveRepoFile(relativePath);
  try {
    await access(fullPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    assert(previousRecipeId(relativePath), `${relativePath}: deleted recipe has no previous version to validate`);
    continue;
  }
  const markdown = await readFile(fullPath, "utf8");
  const parsed = parseMarkdown(markdown);
  assert(parsed, `${relativePath}: recipe frontmatter is missing or malformed`);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  if (data.status === "published") {
    const match = /^##\s+(?:Valmistus|Preparation|Instructions|Tillagning|Gör så här|การทำ|วิธีทำ)\s*$/im.exec(parsed.content);
    assert(match?.index !== undefined, `${relativePath}: published recipe has no instruction section`);
    const start = match.index + match[0].length;
    const next = parsed.content.slice(start).search(/^##\s+/m);
    const instructions = parsed.content.slice(start, next < 0 ? undefined : start + next).trim();
    const renderedSteps = await renderInstructionSteps(instructions);
    const rendered = renderedSteps?.join("") ?? await renderSafeMarkdown(instructions);
    assert(rendered.trim(), `${relativePath}: recipe instructions render to empty output`);
  }
  if (data.image) {
    const sources = [data.image.src, ...(data.image.srcset ?? []).map((item) => item.src)];
    for (const source of sources) await access(resolveRepoFile(`kuvat/${source}`));
  }
  changedRecipes.push({ path: relativePath, data, markdown });
}

const evidenceIds = new Set<string>();
for (const relativePath of evidencePaths) {
  const fullPath = resolveRepoFile(relativePath);
  const expectedRecipeId = path.basename(relativePath, ".json");
  evidenceIds.add(expectedRecipeId);
  try {
    await access(fullPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
    throw error;
  }
  const evidence = JSON.parse(await readFile(fullPath, "utf8")) as Calculation;
  assert(evidence.recipeId, `${relativePath}: calculation evidence has no recipeId`);
  assert(relativePath === `docs/nutrition/calculations/${evidence.recipeId}.json`, `${relativePath}: filename must match recipeId`);
  assert.equal(evidence.recipeId, expectedRecipeId, `${relativePath}: filename must match recipeId`);
}

const recipeIds = new Set([
  ...changedRecipes.map((recipe) => recipe.data.recipe_id),
  ...recipePaths.map(previousRecipeId).filter((id): id is string => Boolean(id)),
  ...evidenceIds,
]);
assert(recipeIds.size > 0, "No changed recipe or nutrition evidence paths were supplied.");
const audit = await auditTranslations([...recipeIds]);
const recipeBindings = JSON.parse(await readFile(resolveRepoFile("docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8")) as {
  recipes?: Record<string, string>;
};
const recipeAliases = JSON.parse(await readFile(resolveRepoFile("docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8")) as {
  aliases?: Record<string, { canonical: string; evidence: string }>;
};

const changedRoutes: PublishedRoute[] = changedRecipes
  .filter((recipe) => recipe.data.status === "published")
  .map((recipe) => ({
    recipe_id: recipe.data.recipe_id,
    language: recipe.data.language,
    url_slug: recipe.data.url_slug,
    path: recipe.path,
  }));
if (changedRoutes.length > 0) {
  const collectionDirectories = [
    ...sourceCategories.map((category) => path.join(repoRoot, "reseptit", category)),
    ...translationLocales.map((locale) => path.join(repoRoot, "kaannokset", locale)),
  ];
  const collectionFiles = (await Promise.all(collectionDirectories.map(markdownFiles))).flat();
  const publishedRoutes: PublishedRoute[] = [];
  for (const filename of collectionFiles) {
    const parsed = parseMarkdown(await readFile(filename, "utf8"));
    if (parsed?.data.status !== "published") continue;
    const { recipe_id, language, url_slug } = parsed.data;
    if (typeof recipe_id !== "string" || typeof language !== "string" || typeof url_slug !== "string") continue;
    publishedRoutes.push({
      recipe_id,
      language,
      url_slug,
      path: path.relative(repoRoot, filename).replaceAll("\\", "/"),
    });
  }
  const duplicateRoutes = duplicateRoutesForChangedRecipes(changedRoutes, publishedRoutes);
  assert.deepEqual(duplicateRoutes, [], "Changed recipe URLs must remain unique across all published recipes");
}

for (const recipeId of recipeIds) {
  const source = assertChangedRecipeAuditIsClean(audit, recipeId);
  assert(source || !evidenceIds.has(recipeId), `${recipeId}: calculation evidence has no published Finnish source`);
  if (!source) continue;

  const translations = audit.publishedTranslations.filter((recipe) => recipe.data.recipe_id === recipeId);

  const changedSource = changedRecipes.find((recipe) => recipe.data.recipe_id === recipeId && recipe.data.language === "fi");
  const boundRecipeHash = recipeBindings.recipes?.[recipeId];
  if (changedSource && boundRecipeHash) {
    const currentRecipeHash = recipeBindingHash(changedSource.markdown, recipeAliases.aliases ?? {});
    assert(currentRecipeHash === boundRecipeHash || await validateGk80Candidate(repoRoot, recipeId), `${recipeId}: GI/GK recipe binding is stale; review the related calculation before accepting this content change`);
  }

  const evidencePath = resolveRepoFile(`docs/nutrition/calculations/${recipeId}.json`);
  let evidence: Calculation | null = null;
  try {
    evidence = JSON.parse(await readFile(evidencePath, "utf8")) as Calculation;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const nutritionChanged = changedRecipes.some((recipe) =>
    recipe.data.recipe_id === recipeId && changedNutritionValues(recipe.path));
  if (nutritionChanged) assert(evidence, `${recipeId}: changed published nutrition values require matching calculation evidence`);
  if (evidence) {
    const result = verifyNutritionEvidence(source.data, evidence, translations);
    assert.deepEqual(result.errors, [], `${recipeId}: nutrition evidence validation failed`);
  } else {
    assert(!evidenceIds.has(recipeId), `${recipeId}: changed calculation evidence is unavailable`);
  }
}

console.log(`Changed-content check passed: ${changedRecipes.length} recipe file(s), ${evidenceIds.size} calculation evidence file(s), ${recipeIds.size} related recipe record(s).`);
