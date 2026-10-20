import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";

async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(filename);
    return entry.isFile() && entry.name.endsWith(".md") ? [filename] : [];
  }));
  return nested.flat();
}

test("site content contains every published recipe and no drafts", async () => {
  const repoDir = path.resolve(import.meta.dirname, "../..");
  const candidates = [
    ...await markdownFiles(path.join(repoDir, "reseptit", "alkuruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "paaruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "jalkiruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "leivonnaiset")),
    ...await markdownFiles(path.join(repoDir, "kaannokset")),
  ];
  const expected = new Set<string>();
  for (const candidate of candidates) {
    const parsed = parseMarkdown(await readFile(candidate, "utf8"));
    if (!parsed) continue;
    const frontmatter = parsed.data;
    if (frontmatter.status === "published") expected.add(`${frontmatter.recipe_id}:${frontmatter.language}`);
  }
  const actual = new Set(siteContent.recipes.map((recipe) => `${recipe.recipeId}:${recipe.locale}`));
  assert.deepEqual(actual, expected);
  assert.equal(siteContent.recipes.length, actual.size);
});

test("published route paths stay within the recipe site's path space", () => {
  for (const recipe of siteContent.recipes) {
    assert.match(recipe.routePath, /^\/(?:en\/recipes\/|sv\/recept\/|th\/recipes\/)?[a-z0-9-]+\/$/);
  }
});

test("the high-protein macaroni bake has four aligned published language versions", () => {
  const translations = siteContent.recipes.filter((recipe) => recipe.recipeId === "jauheliha-makaronilaatikko");
  assert.deepEqual(translations.map((recipe) => recipe.locale).sort(), ["en", "fi", "sv", "th"]);
  const source = translations.find((recipe) => recipe.locale === "fi");
  assert.ok(source);
  for (const translation of translations) {
    assert.equal(translation.servings, source.servings);
    assert.equal(translation.timeTotalMin, source.timeTotalMin);
    assert.deepEqual(translation.nutrition, source.nutrition);
    assert.equal(translation.ingredients.length, source.ingredients.length);
    assert.deepEqual(translation.ingredients.map((item) => item.amount), source.ingredients.map((item) => item.amount));
    assert.equal(translation.image?.src, source.image?.src);
  }
  assert.equal(translations.find((recipe) => recipe.locale === "en")?.routePath, "/en/recipes/high-protein-beef-macaroni-bake/");
  assert.equal(translations.find((recipe) => recipe.locale === "sv")?.routePath, "/sv/recept/proteinrik-makaronilada-med-kottfars/");
  assert.equal(translations.find((recipe) => recipe.locale === "th")?.routePath, "/th/recipes/makaroni-op-nuea-bot-protein-sung/");
});
