import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { createAssistantCatalog } from "../src/features/assistant/catalog";
import { assistantDemoCopy } from "../src/features/assistant/demo-i18n";
import { demoRecipeHref, demoSearchCatalog, demoSearchFilters, loadDemoCatalog, validateDemoCatalog } from "../src/features/assistant/demo";
import type { RecipeEntry, RecipeLocale } from "../src/types/content";

const locales = ["fi", "en", "sv", "th"] as const;
const version = (recipe: RecipeEntry) => createHash("sha256").update(JSON.stringify(recipe)).digest("hex");

test("A2 presets map to existing filters; free text is plain search, not invented natural-language intent", () => {
  assert.deepEqual(demoSearchFilters({ kind: "preset", preset: "keto-30" }), { query: "", category: "all", diet: "keto", maxTime: 30 });
  assert.deepEqual(demoSearchFilters({ kind: "preset", preset: "breakfast" }), { query: "", category: "aamupala", diet: "all" });
  assert.deepEqual(demoSearchFilters({ kind: "preset", preset: "snack" }), { query: "", category: "valipala", diet: "all" });
  assert.deepEqual(demoSearchFilters({ kind: "text", text: "  kana\n  feta  " }), { query: "kana feta", category: "all", diet: "all" });
  assert.equal(demoSearchFilters({ kind: "text", text: "a".repeat(300) }).query.length, 120);
});

test("A2 returns only published source-bound recipes and safe links for FI/EN/SV/TH", () => {
  for (const locale of locales) {
    const catalog = createAssistantCatalog(siteContent.recipes, locale, version);
    assert.equal(validateDemoCatalog(JSON.parse(JSON.stringify(catalog)), locale).locale, locale);
    for (const preset of ["keto-30", "breakfast", "snack"] as const) {
      const results = demoSearchCatalog(catalog, { kind: "preset", preset });
      assert.ok(results.length <= 5);
      for (const recipe of results) {
        assert.ok(siteContent.recipes.some((r) => r.recipeId === recipe.recipeId && r.locale === locale && r.routePath === recipe.routePath));
        const url = demoRecipeHref("/Reseptit/", recipe);
        assert.ok(url.startsWith("/Reseptit/"));
        assert.ok(!url.startsWith("//"));
        assert.doesNotMatch(url, /https?:|\.\./);
      }
    }
    assert.ok(demoSearchCatalog(catalog, { kind: "text", text: "very-unlikely-recipe-zz999" }).length === 0);
  }
});

test("A2 demo copy is complete and the prototype labels make its non-AI status clear", () => {
  for (const locale of locales) {
    const copy = assistantDemoCopy[locale];
    for (const key of ["title", "intro", "warning", "language", "loading", "unavailable", "search",
      "send", "noResults", "unknown", "netCarbs", "regularSearch", "log", "note", "suggestions"] as const) {
      assert.ok(copy[key].length >= 3, `${locale}: ${key}`);
    }
    assert.ok(copy.results(2).includes("2"), `${locale}: result count`);
    assert.ok(copy.presets["keto-30"] && copy.presets.breakfast && copy.presets.snack);
  }
});

test("A2 catalog validation rejects wrong locale, fake routes, duplicates and corrupt nutrition", () => {
  const good = createAssistantCatalog(siteContent.recipes.filter((r) => r.locale === "fi").slice(0, 2), "fi", version);
  assert.throws(() => validateDemoCatalog(good, "en"), /locale/);
  const tamper = structuredClone(good);
  tamper.recipes[0].routePath = "https://evil.test/";
  assert.throws(() => validateDemoCatalog(tamper, "fi"), /Invalid/);
  assert.throws(() => demoRecipeHref("/", tamper.recipes[0]), /Invalid/);
  const dup = structuredClone(good);
  dup.recipes.push(dup.recipes[0]);
  assert.throws(() => validateDemoCatalog(dup, "fi"), /duplicate/);
  const corrupt = structuredClone(good);
  corrupt.recipes[0].nutritionPerServing.carbsNetG = Number.NaN;
  assert.throws(() => validateDemoCatalog(corrupt, "fi"), /Invalid/);
  const noValue = structuredClone(good);
  noValue.recipes[0].nutritionPerServing.carbsNetG = null;
  assert.equal(validateDemoCatalog(noValue, "fi").recipes[0].nutritionPerServing.carbsNetG, null);
});

test("A2 loads the versioned catalog with SHA-256 verification (local fetch fixture, no network)", async () => {
  const dataDir = path.resolve(import.meta.dirname, "../public/data");
  const files: string[] = [];
  const fakeFetch: typeof fetch = async (input) => {
    const url = String(input);
    assert.ok(url.startsWith("/Reseptit/data/"), "must fetch only local data artifacts");
    const filename = url.slice("/Reseptit/data/".length);
    assert.match(filename, /^(assistant-manifest\.json|assistant-(fi|en|sv|th)-[a-f0-9]{20}\.json)$/);
    files.push(filename);
    return new Response(await readFile(path.join(dataDir, filename), "utf8"), { status: 200 });
  };
  for (const locale of locales) {
    const catalog = await loadDemoCatalog(locale, "/Reseptit/", fakeFetch);
    assert.equal(catalog.locale, locale);
    assert.equal(catalog.recipes.length, siteContent.recipes.filter((r) => r.locale === locale).length);
  }
  assert.equal(files.length, 8);
  const broken: typeof fetch = async (input) => {
    const response = await fakeFetch(input);
    if (String(input).endsWith("assistant-manifest.json")) return response;
    return new Response((await response.text()) + " ", { status: 200 });
  };
  await assert.rejects(loadDemoCatalog("fi", "/Reseptit/", broken), /checksum mismatch/);
});
