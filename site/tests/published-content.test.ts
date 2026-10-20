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
