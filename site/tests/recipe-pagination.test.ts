import assert from "node:assert/strict";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { recipeLibraryPageSize, recipeLibraryRoots, recipeLibraryPagePath, parseRecipeLibraryPagePath, paginateRecipeLibrary } from "../src/features/recipes/recipe-pagination";

const languages = ["fi", "en", "sv", "th"] as const;

test("24-card catalogue pages cover every published recipe exactly once in each locale", () => {
  for (const locale of languages) {
    const expected = siteContent.recipes.filter((recipe) => recipe.locale === locale);
    const pageOne = paginateRecipeLibrary(siteContent.recipes, locale);
    assert.equal(pageOne.pageSize, 24);
    assert.equal(pageOne.totalItems, expected.length);
    assert.equal(pageOne.totalPages, Math.ceil(expected.length / recipeLibraryPageSize));
    assert.equal(pageOne.items.length, 24);
    const pages = Array.from({ length: pageOne.totalPages }, (_, i) => paginateRecipeLibrary(siteContent.recipes, locale, i + 1));
    const items = pages.flatMap((page) => page.items);
    assert.equal(items.length, expected.length);
    assert.equal(new Set(items.map((item) => item.recipeId)).size, expected.length);
    assert.deepEqual(items.map((item) => item.recipeId).sort(), expected.map((item) => item.recipeId).sort());
    assert.equal(pages[0].previousPath, null);
    assert.equal(pages.at(-1)!.nextPath, null);
    assert.equal(pages.at(-1)!.items.length, expected.length % 24 || 24);
    for (const page of pages) {
      assert.equal(page.canonicalPath, recipeLibraryPagePath(locale, page.page));
      assert.deepEqual(parseRecipeLibraryPagePath(page.canonicalPath), { locale, page: page.page });
      if (page.nextPath) assert.equal(parseRecipeLibraryPagePath(page.nextPath)?.page, page.page + 1);
      if (page.previousPath) assert.equal(parseRecipeLibraryPagePath(page.previousPath)?.page, page.page - 1);
    }
  }
});

test("catalogue pagination is deterministic regardless of original input order and never mutates input", () => {
  const original = siteContent.recipes.slice();
  const reversed = original.slice().reverse();
  for (const locale of languages) {
    assert.deepEqual(
      paginateRecipeLibrary(original, locale, 1).items.map((x) => x.recipeId),
      paginateRecipeLibrary(reversed, locale, 1).items.map((x) => x.recipeId),
    );
  }
  assert.deepEqual(original, siteContent.recipes);
});

test("language-specific catalogue URL inventory has no overlap with existing recipe routes", () => {
  const urls = languages.map((locale) => recipeLibraryRoots[locale]);
  assert.equal(new Set(urls).size, 4);
  for (const locale of languages) {
    assert.deepEqual(parseRecipeLibraryPagePath(recipeLibraryPagePath(locale, 1)), { locale, page: 1 });
    assert.deepEqual(parseRecipeLibraryPagePath(recipeLibraryPagePath(locale, 2)), { locale, page: 2 });
  }
  const existing = new Set(siteContent.recipes.map((recipe) => recipe.routePath));
  for (const locale of languages) {
    for (const page of [1, 2, 3]) {
      assert.equal(existing.has(recipeLibraryPagePath(locale, page)), false, locale);
    }
  }
});

test("invalid, unknown and non-canonical pagination paths cannot silently alias page one", () => {
  for (const input of [
    "/reseptit/sivu/1/", "/reseptit/sivu/02/", "/reseptit/sivu/0/",
    "/reseptit/sivu/-1/", "/reseptit/sivu/2.5/", "/reseptit/sivu/Infinity/",
    "/reseptit/sivu/9007199254740992/", "/reseptit/sivu/2/extra/",
    "/reseptit//sivu/2/", "/reseptit/sivu/2", "/RESEPTIT/",
    "/en/recipes/all/page/01/", "/sv/recept/alla/page/2/",
    "/th/recipes/all/sida/2/", "/missing/", "",
  ]) assert.equal(parseRecipeLibraryPagePath(input), null, input);
  for (const invalid of [-2, 0, 0.1, Number.NaN, Infinity, 9007199254740992]) {
    assert.throws(() => recipeLibraryPagePath("fi", invalid), RangeError);
    assert.throws(() => paginateRecipeLibrary(siteContent.recipes, "fi", invalid), RangeError);
  }
  assert.throws(() => paginateRecipeLibrary(siteContent.recipes, "fi", 9000), RangeError);
});

test("empty language index still has one stable empty page, not a fabricated recipe", () => {
  const page = paginateRecipeLibrary([], "fi");
  assert.equal(page.totalPages, 1);
  assert.equal(page.totalItems, 0);
  assert.deepEqual(page.items, []);
  assert.equal(page.nextPath, null);
  assert.throws(() => paginateRecipeLibrary([], "fi", 2), RangeError);
});
