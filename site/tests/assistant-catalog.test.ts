import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { summarizeRecipe } from "../src/content/route-data";
import { createAssistantCatalog, findAssistantRecipe, searchAssistantCatalog } from "../src/features/assistant/catalog";
import { emptyRecipeFilters, filterRecipes, type RecipeFilters } from "../src/features/recipes/recipe-search";
import {withholdF25Nutrition} from "../src/features/recipes/f25-nutrition-withhold";
import type { RecipeEntry, RecipeLocale } from "../src/types/content";

const locales = ["fi", "en", "sv", "th"] as const;
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const version = (recipe: RecipeEntry) => sha(JSON.stringify(recipe));

test("A1 catalogs use only the published, schema-validated content build", () => {
  const ids = new Set<string>();
  for (const locale of locales) {
    const catalog = createAssistantCatalog(siteContent.recipes, locale, version);
    const source = siteContent.recipes.filter((recipe) => recipe.locale === locale);
    assert.equal(catalog.schemaVersion, 1);
    assert.equal(catalog.locale, locale);
    assert.equal(catalog.recipes.length, source.length);
    for (const [i, recipe] of source.entries()) {
      const row = catalog.recipes[i];
      assert.equal(row.recipeId, recipe.recipeId);
      assert.equal(row.routePath, recipe.routePath);
      assert.equal(row.sourceVersion, version(recipe), "each result is bound to the full published recipe version");
      assert.equal(row.servings, recipe.servings);
      assert.deepEqual(row.nutritionPerServing, withholdF25Nutrition(recipe.recipeId,recipe.locale)
        ? {carbsNetG:null, carbsTotalG:null, proteinG:null, fatG:null}
        : recipe.nutrition);
      assert.deepEqual(row.ingredients, recipe.ingredients);
      assert.equal(row.image, null);
      assert.equal("instructionsHtml" in row, false);
      assert.equal("notesHtml" in row, false);
      assert.ok(!ids.has(`${row.locale}:${row.recipeId}`));
      ids.add(`${row.locale}:${row.recipeId}`);
      assert.equal(findAssistantRecipe(catalog, row.recipeId), row);
      for (const [otherLocale, routePath] of Object.entries(row.publishedTranslations)) {
        assert.ok(siteContent.recipes.some((candidate) =>
          candidate.recipeId === row.recipeId && candidate.locale === otherLocale && candidate.routePath === routePath),
          "translation URL must exist in the published corpus");
      }
    }
    assert.equal(findAssistantRecipe(catalog, "not-a-published-recipe"), null);
  }
});

test("A1 search uses exactly the public catalog filter semantics in four locales", () => {
  const filters: RecipeFilters[] = [
    { ...emptyRecipeFilters },
    { ...emptyRecipeFilters, category: "paaruoka", diet: "keto", maxTime: 30 },
    { ...emptyRecipeFilters, category: "aamupala", diet: "vhh" },
    { ...emptyRecipeFilters, maxTime: 60 },
    { ...emptyRecipeFilters, cuisine: "thai" },
    { ...emptyRecipeFilters, ingredient: "eggs" },
    { ...emptyRecipeFilters, query: "kanan" },
    { ...emptyRecipeFilters, query: "keto" },
  ];
  for (const locale of locales) {
    const catalog = createAssistantCatalog(siteContent.recipes, locale, version);
    const publicSummaries = siteContent.recipes
      .filter((recipe) => recipe.locale === locale)
      .map(summarizeRecipe);
    for (const selected of filters) {
      const result = searchAssistantCatalog(catalog, selected);
      assert.equal(result.status, "ok");
      assert.deepEqual(result.recipes.map((recipe) => recipe.recipeId),
        filterRecipes(publicSummaries, selected, locale).map((recipe) => recipe.recipeId),
        `Search parity for ${locale}: ${JSON.stringify(selected)}`);
    }
    const sample = catalog.recipes[0];
    assert.ok(sample, `missing published ${locale} recipes`);
    const byTitle = searchAssistantCatalog(catalog, { ...emptyRecipeFilters, query: sample.title });
    assert.equal(byTitle.status, "ok");
    assert.ok(byTitle.recipes.some((recipe) => recipe.recipeId === sample.recipeId));
  }
});

test("GK requests fail closed unless the caller supplies the published GL category map", () => {
  const catalog = createAssistantCatalog(siteContent.recipes, "fi", version);
  const filters: RecipeFilters = { ...emptyRecipeFilters, gl: "low" };
  assert.deepEqual(searchAssistantCatalog(catalog, filters),
    { status: "requires_gk_evidence", recipes: [] });
  const first = catalog.recipes[0];
  const approved = { [first.recipeId]: "low" as const };
  const result = searchAssistantCatalog(catalog, filters, approved);
  assert.equal(result.status, "ok");
  assert.deepEqual(result.recipes.map((recipe) => recipe.recipeId), [first.recipeId]);
  assert.equal("glycemicLoadPerServing" in result.recipes[0], false, "A1 does not invent numeric GK");
});

test("unpublished, forged, duplicate or unversioned recipes fail before catalog export", () => {
  const source = siteContent.recipes.find((recipe) => recipe.locale === "fi")!;
  assert.throws(() => createAssistantCatalog([{ ...source, status: "draft" } as RecipeEntry], "fi", version), /unpublished/);
  assert.throws(() => createAssistantCatalog([{ ...source, routePath: "/offsite/" }], "fi", version), /canonical/);
  assert.throws(() => createAssistantCatalog([source, source], "fi", version), /duplicated/);
  assert.throws(() => createAssistantCatalog([source], "fi", () => "short"), /SHA-256/);
  const nullNutrition: RecipeEntry = { ...source, nutrition: { carbsNetG: null, carbsTotalG: null, proteinG: null, fatG: null } };
  const row = createAssistantCatalog([nullNutrition], "fi", version).recipes[0];
  assert.deepEqual(row.nutritionPerServing, nullNutrition.nutrition);
  assert.equal(row.nutritionPerServing.carbsNetG, null);
  assert.throws(() => createAssistantCatalog([{ ...source, nutrition: { ...source.nutrition, carbsNetG: Number.NaN } }], "fi", version), /nutrition/);
});

test("missing translated version is never synthesized from a slug", () => {
  const source = siteContent.recipes.find((recipe) => recipe.locale === "fi"
    && siteContent.recipes.some((translation) => translation.recipeId === recipe.recipeId && translation.locale === "th"))!;
  assert.ok(source, "test requires a published Finnish/Thai translation pair");
  const reduced = siteContent.recipes.filter((recipe) => recipe.recipeId !== source.recipeId || recipe.locale !== "th");
  const catalog = createAssistantCatalog(reduced, "fi", version);
  assert.equal(catalog.recipes.find((recipe) => recipe.recipeId === source.recipeId)?.publishedTranslations.th, undefined);
});

test("build publishes per-locale content-addressed JSON with a verifiable manifest", async () => {
  const dataDir = path.resolve(import.meta.dirname, "../public/data");
  const manifest = JSON.parse(await readFile(path.join(dataDir, "assistant-manifest.json"), "utf8")) as {
    schemaVersion: number;
    locales: Partial<Record<RecipeLocale, { file: string; sha256: string; count: number }>>;
  };
  assert.equal(manifest.schemaVersion, 1);
  for (const locale of locales) {
    const meta = manifest.locales[locale];
    assert.ok(meta, `missing ${locale} assistant catalog`);
    assert.match(meta.file, new RegExp(`^assistant-${locale}-[a-f0-9]{20}\\.json$`));
    const raw = await readFile(path.join(dataDir, meta.file), "utf8");
    assert.equal(sha(raw), meta.sha256);
    assert.equal(meta.file, `assistant-${locale}-${meta.sha256.slice(0, 20)}.json`);
    const parsed = JSON.parse(raw);
    assert.deepEqual(parsed, createAssistantCatalog(siteContent.recipes, locale, version));
    assert.equal(meta.count, parsed.recipes.length);
    assert.ok(parsed.recipes.every((recipe: { locale: string; image: unknown }) => recipe.locale === locale && recipe.image === null));
  }
});
