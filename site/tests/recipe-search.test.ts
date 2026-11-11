import {originalGlycemicLoadCategory} from '../scripts/glycemic-load-filter';
import assert from "node:assert/strict";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { emptyRecipeFilters, filterRecipes, normalizeSearchText, parseRecipeFilters, recipeFiltersToSearch } from "../src/features/recipes/recipe-search";
import { recipeFacets } from "../src/content/recipe-facets";
import { isRecipavoHeroPreviewEnabled, recipavoHeroCopy } from "../src/features/recipes/recipavo-hero";
import { homepageLabels, homepagePickLimit, homepagePicks, homepageTopics } from "../src/features/recipes/home-preview";
import { glycemicLoadFilterCategories } from "../src/generated/glycemic-load-filters.generated";
import { glycemicLoadPilotResults } from "../src/generated/glycemic-load-pilot.generated";

const finnishRecipes = siteContent.recipes.filter((recipe) => recipe.locale === "fi");

test("browse facets derive from source metadata and remain identical across translations", () => {
  assert.deepEqual(recipeFacets(["kananmuna"], []), { cuisine: null, ingredientGroups: ["eggs"] });
  assert.deepEqual(recipeFacets(["broileri", "kikherne"], ["intialainen"]), { cuisine: "indian", ingredientGroups: ["chicken", "legumes"] });
  assert.equal(recipeFacets(["naudan jauheliha"], ["meksikolainen"]).cuisine, "mexican");
  assert.equal(recipeFacets(["lohi"], ["japanilainen"]).cuisine, "japanese");
  assert.equal(recipeFacets([], ["korealainen"]).cuisine, "korean");
  assert.equal(recipeFacets([], ["vietnamilainen"]).cuisine, "vietnamese");
  assert.equal(recipeFacets([], ["indonesialainen"]).cuisine, "indonesian");
  assert.equal(recipeFacets([], ["malesialainen"]).cuisine, "malaysian");
  assert.equal(recipeFacets([], ["karibia"]).cuisine, "caribbean");
  assert.equal(recipeFacets([], ["lähi-itä"]).cuisine, "middle-eastern");
  assert.equal(recipeFacets([], ["pohjoisafrikkalainen"]).cuisine, "north-african");
  for (const recipe of siteContent.recipes) {
    const source = finnishRecipes.find(item => item.recipeId === recipe.recipeId)!;
    assert.equal(recipe.cuisine, source.cuisine);
    assert.deepEqual(recipe.ingredientGroups, source.ingredientGroups);
  }
});

test("egg facets match an individual metadata value among other ingredients in every locale", () => {
  assert.deepEqual(recipeFacets(["kaura", " MUNA ", "kerma"], []).ingredientGroups, ["eggs"]);
  assert.deepEqual(recipeFacets(["muna", "muna"], []).ingredientGroups, ["eggs"]);
  assert.deepEqual(recipeFacets(["munakoiso"], []).ingredientGroups, ["vegetables"]);
  // Exercise the metadata with localized fixtures; no draft needs publishing.
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const recipe = { ...siteContent.recipes.find(recipe => recipe.locale === locale)!, ...recipeFacets(["kaura", "muna", "kerma"], []) };
    assert.ok(recipe.ingredientGroups?.includes("eggs"), recipe.locale);
    assert.equal(filterRecipes([recipe], { ...emptyRecipeFilters, ingredient: "eggs" }, recipe.locale).length, 1);
  }
});

test("browse groups cover observed Finnish inflections without substring false positives", () => {
  for (const value of ["nakki", "nakit", "makkara", "poronkäristys", "ankka", "porsaan lapaa"]) {
    assert.deepEqual(recipeFacets([value], []).ingredientGroups, ["meat"], value);
  }
  for (const value of ["sieni", "sienet", "kasvikset", "kesakurpitsa", "kesäkurpitsa"]) {
    assert.deepEqual(recipeFacets([value], []).ingredientGroups, ["vegetables"], value);
  }
  assert.deepEqual(recipeFacets(["kananmuna", "munakoiso", "riisi", "kerma", "kanaliemi"], ["constructor"]).ingredientGroups, ["vegetables", "eggs"]);
  assert.equal(recipeFacets([], ["constructor"]).cuisine, null);
  for (const recipeId of ["nakkikeitto-kukkakaalilla", "nakkikastike-kukkakaalimuusi"]) {
    const versions = siteContent.recipes.filter(recipe => recipe.recipeId === recipeId);
    assert.equal(versions.length, 4, recipeId);
    for (const recipe of versions) assert.equal(filterRecipes([recipe], { ...emptyRecipeFilters, ingredient: "meat" }, recipe.locale).length, 1, `${recipeId}/${recipe.locale}`);
  }
});

test("time, cuisine and main ingredient filters combine and survive URL round trips", () => {
  const filters = { ...emptyRecipeFilters, maxTime: 60, cuisine: "thai", ingredient: "chicken" };
  assert.deepEqual(parseRecipeFilters(recipeFiltersToSearch(filters), ["all"]), filters);
  assert.deepEqual(parseRecipeFilters("?time=-5&cuisine=bad&ingredient=bad", ["all"]), emptyRecipeFilters);
  const results = filterRecipes(finnishRecipes, filters, "fi");
  assert.ok(results.length > 0);
  assert.ok(results.every(recipe => recipe.timeTotalMin !== null && recipe.timeTotalMin <= 60 && recipe.cuisine === "thai" && recipe.ingredientGroups?.includes("chicken")));
  assert.equal(filterRecipes([{ ...results[0], timeTotalMin: null }], filters, "fi").length, 0);
  const thai = siteContent.recipes.filter(recipe => recipe.locale === "th");
  const resultsWithThaiVersion = results.filter(recipe => thai.some(thaiRecipe => thaiRecipe.recipeId === recipe.recipeId));
  assert.deepEqual(filterRecipes(thai, filters, "th").map(recipe => recipe.recipeId).sort(), resultsWithThaiVersion.map(recipe => recipe.recipeId).sort());
  for (const buns of siteContent.recipes.filter(recipe => recipe.recipeId === "keto-kauralesesampylat")) {
    assert.equal(buns.timeTotalMin, null, "45-minute work and baking estimate excludes unmeasured required cooling");
    assert.match(buns.notesHtml, /45/);
  }
  assert.equal(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, cuisine: "mexican" }, "fi").length, 15);
  const japanese = filterRecipes(finnishRecipes, { ...emptyRecipeFilters, cuisine: "japanese" }, "fi");
  assert.equal(japanese.length, 13, "miso-wakame and yaki-onigiri are both held outside the public menu");
  assert.ok(!japanese.some(recipe => recipe.recipeId === "japanilainen-yaki-onigiri-misolla"));
  assert.ok(!japanese.some(recipe => recipe.recipeId === "japanilainen-miso-tofu-paksoi"));
});

test("search normalization folds Finnish and Swedish diacritics while preserving Thai tone marks", () => {
  assert.equal(normalizeSearchText("  ÄÄKKÖSET   LOHI ", "fi"), "aakkoset lohi");
  assert.equal(normalizeSearchText("ÅÄÖ", "sv"), "aao");
  assert.equal(normalizeSearchText("ข้าว", "th"), "ข้าว");
  assert.equal(normalizeSearchText("ข่าว", "th"), "ข่าว");
  assert.notEqual(normalizeSearchText("ข้าว", "th"), normalizeSearchText("ข่าว", "th"));
  const thaiRecipe = siteContent.recipes.find((recipe) => recipe.locale === "th");
  assert.ok(thaiRecipe);
  const riceRecipe = { ...thaiRecipe, title: "ข้าว", ingredients: [], description: "", tags: [] };
  assert.equal(filterRecipes([riceRecipe], { ...emptyRecipeFilters, query: "ข้าว" }, "th").length, 1);
  assert.equal(filterRecipes([riceRecipe], { ...emptyRecipeFilters, query: "ข่าว" }, "th").length, 0);
});

test("search finds titles, ingredients, descriptions and tags; all words must match", () => {
  assert.ok(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "lohi kerma" }, "fi").some((recipe) => recipe.title.includes("lohikeitto")));
  assert.ok(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "raejuusto" }, "fi").length > 0);
  assert.ok(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "VHH" }, "fi").length > 0);
  assert.deepEqual(filterRecipes(finnishRecipes, { ...emptyRecipeFilters, query: "lohi mahdoton" }, "fi"), []);
});

test("category and diet filters use structured recipe fields and combine with AND", () => {
  const keto = filterRecipes(finnishRecipes, { ...emptyRecipeFilters, diet: "keto" }, "fi");
  assert.ok(keto.length > 0);
  assert.ok(keto.every((recipe) => recipe.dietClass === "keto"));
  const vhh = filterRecipes(finnishRecipes, { ...emptyRecipeFilters, diet: "vhh" }, "fi");
  assert.ok(vhh.length > keto.length);
  assert.ok(vhh.every((recipe) => recipe.dietClass !== null));
  const combined = filterRecipes(finnishRecipes, { query: "kukkakaali", category: "paaruoka", diet: "vhh" }, "fi");
  assert.ok(combined.length > 0);
  assert.ok(combined.every((recipe) => recipe.category === "paaruoka" && recipe.dietClass !== null));
});

test("valipala category survives URL filtering and combines with diet", () => {
  const sample = { ...finnishRecipes[0], category: "valipala" as const, dietClass: "keto" as const };
  const filters = parseRecipeFilters("?category=valipala&diet=keto", ["all", "valipala", "paaruoka"]);
  assert.equal(recipeFiltersToSearch(filters), "?category=valipala&diet=keto");
  assert.deepEqual(filterRecipes([sample, finnishRecipes[0]], filters, "fi").map(item => item.recipeId), [sample.recipeId]);
});

test("URL filters normalize whitespace and reject unknown categories and diet values", () => {
  const parsed = parseRecipeFilters("?q=%20lohi++kerma%20&category=unknown&diet=invalid", ["all", "paaruoka"]);
  assert.deepEqual(parsed, { query: "lohi kerma", category: "all", diet: "all" });
  const search = recipeFiltersToSearch({ query: "  lohi   kerma ", category: "paaruoka", diet: "keto" });
  assert.equal(search, "?q=lohi+kerma&category=paaruoka&diet=keto");
  assert.deepEqual(parseRecipeFilters(search, ["all", "paaruoka"]), { query: "lohi kerma", category: "paaruoka", diet: "keto" });
  assert.deepEqual(parseRecipeFilters("?diet=keto", ["all", "paaruoka"], ["vhh"]), { query: "", category: "all", diet: "all" });
  assert.equal(recipeFiltersToSearch(emptyRecipeFilters), "");
});

test("a search in a translated directory stays within that locale", () => {
  const english = siteContent.recipes.filter((recipe) => recipe.locale === "en");
  const results = filterRecipes(english, { ...emptyRecipeFilters, query: "beef macaroni" }, "en");
  assert.equal(results.length, 1);
  assert.equal(results[0].locale, "en");
  const thai = siteContent.recipes.filter((recipe) => recipe.locale === "th");
  const thaiResults = filterRecipes(thai, { ...emptyRecipeFilters, query: "โปรตีนสูง" }, "th");
  assert.equal(thaiResults.length, 1);
  assert.equal(thaiResults[0].locale, "th");
});

test("GK URL parameter is strict, composable and round-trippable", () => {
  assert.deepEqual(parseRecipeFilters("?gl=bad", ["all"]), emptyRecipeFilters);
  assert.deepEqual(parseRecipeFilters("?gl=low&diet=vhh", ["all"]), { ...emptyRecipeFilters, diet: "vhh", gl: "low" });
  assert.equal(recipeFiltersToSearch({ ...emptyRecipeFilters, gl: "medium", maxTime: 30 }), "?time=30&gl=medium");
  assert.deepEqual(parseRecipeFilters("?gl=medium&time=30", ["all"]), { ...emptyRecipeFilters, maxTime: 30, gl: "medium" });
  assert.equal(recipeFiltersToSearch({ ...emptyRecipeFilters, gl: undefined }), "");
});

test("GK filter excludes missing values and combines with category and time", () => {
  const low = finnishRecipes.find(recipe => recipe.category === "aamupala")!;
  const medium = finnishRecipes.find(recipe => recipe.category === "alkuruoka")!;
  const high = finnishRecipes.find(recipe => recipe.category === "paaruoka")!;
  const missing = finnishRecipes.find(recipe => recipe.category === "jalkiruoka")!;
  const sample = [low, medium, high, missing];
  const categories = { [low.recipeId]: "low", [medium.recipeId]: "medium", [high.recipeId]: "high" } as const;
  assert.deepEqual(filterRecipes(sample, { ...emptyRecipeFilters, gl: "low" }, "fi", categories).map(recipe => recipe.recipeId), [low.recipeId]);
  assert.deepEqual(filterRecipes(sample, { ...emptyRecipeFilters, gl: "medium" }, "fi", categories).map(recipe => recipe.recipeId), [medium.recipeId]);
  assert.deepEqual(filterRecipes(sample, { ...emptyRecipeFilters, gl: "high" }, "fi", categories).map(recipe => recipe.recipeId), [high.recipeId]);
  assert.deepEqual(filterRecipes(sample, { ...emptyRecipeFilters, gl: "low", category: "paaruoka" }, "fi", categories), []);
  assert.deepEqual(filterRecipes(sample, { ...emptyRecipeFilters, gl: "low" }, "fi"), [], "missing GK is not treated as low");
  assert.deepEqual(filterRecipes(sample, { ...emptyRecipeFilters, gl: "low", maxTime: 30 }, "fi", categories).every(recipe => recipe.timeTotalMin !== null && recipe.timeTotalMin <= 30), true);
});

test("GK index never exposes incomplete estimates or boundary-spanning ranges", () => {
  assert.ok(Object.keys(glycemicLoadFilterCategories).length > 0);
  for (const result of glycemicLoadPilotResults) {
    const category = glycemicLoadFilterCategories[result.recipeId];
    if (result.status !== "CALCULATED" || result.confidence === null || result.glycemicLoadPerServing === null) {
      assert.equal(category, undefined, result.recipeId);
      continue;
    }
    const min = Math.min(result.glycemicLoadPerServing, result.glycemicLoadRangePerServing?.min ?? result.glycemicLoadPerServing);
    const max = Math.max(result.glycemicLoadPerServing, result.glycemicLoadRangePerServing?.max ?? result.glycemicLoadPerServing);
    const expected = max <= 10 ? "low" : min > 10 && max < 20 ? "medium" : min >= 20 ? "high" : undefined;
    assert.equal(category, expected, result.recipeId);
  }
  const calculated = finnishRecipes.find(recipe => glycemicLoadFilterCategories[recipe.recipeId]);
  assert.ok(calculated);
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const translated: (typeof siteContent.recipes)[number] | undefined = siteContent.recipes.find(recipe => recipe.recipeId === calculated.recipeId && recipe.locale === locale);
    if (translated) assert.equal(filterRecipes([translated], { ...emptyRecipeFilters, gl: glycemicLoadFilterCategories[calculated.recipeId] }, locale, glycemicLoadFilterCategories).length, 1);
  }
});

test('original GK categories keep exact boundaries and reject contradictory or incomplete estimates', () => {
  const estimate = (point: number | null, min = point!, max = point!) => ({status: 'CALCULATED', confidence: 'LOW', glycemicLoadPerServing: point, glycemicLoadRangePerServing: {min, max}});
  for (const [point, expected] of [[0, 'low'], [10, 'low'], [10.01, 'medium'], [19.99, 'medium'], [20, 'high']] as const) {
    assert.equal(originalGlycemicLoadCategory(estimate(point)), expected);
  }
  for (const value of [estimate(10, 9, 11), estimate(20, 19, 21), estimate(30, 1, 3), estimate(2, 3, 1), estimate(-1), estimate(NaN), estimate(null), {...estimate(2), status: 'INSUFFICIENT SOURCE DATA'}, {...estimate(2), confidence: null}]) {
    assert.equal(originalGlycemicLoadCategory(value), null);
  }
});

test('rounded published points and precise scenario ranges must share the filter category', () => {
  const estimate = {status: 'CALCULATED', confidence: 'LOW', glycemicLoadPerServing: 20, glycemicLoadRangePerServing: {min: 20.00004, max: 20.00005}};
  assert.equal(originalGlycemicLoadCategory(estimate), 'high');
  assert.equal(originalGlycemicLoadCategory({...estimate, glycemicLoadPerServing: 9.99, glycemicLoadRangePerServing: {min: 10.01, max: 10.02}}), null);
});


test("Recipavo phase-1 preview copy is localized and never promises unavailable features", () => {
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const hero = recipavoHeroCopy[locale];
    assert.equal(hero.brand, "Recipavo");
    assert.ok(hero.brandHome && hero.tagline && hero.eyebrow && hero.title && hero.intro && hero.footer, locale);
    assert.ok(hero.title.length < 90 && hero.intro.length < 250, locale);
    assert.ok(!/Plus|Päiväkirja|Diary|สมัครสมาชิก/i.test([hero.title, hero.intro].join(" ")), locale);
  }
  // The feature must remain disabled in ordinary builds, including plain Node tests.
  if (!import.meta.env?.VITE_RECIPAVO_HERO_PREVIEW) assert.equal(isRecipavoHeroPreviewEnabled(), false);
});

test("Recipavo homepage preview examples are deterministic, localized and all link to published recipes", () => {
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const recipes = siteContent.recipes.filter((item) => item.locale === locale);
    const originalOrder = recipes.map((item) => item.recipeId);
    const picks = homepagePicks(recipes);
    assert.equal(picks.length, Math.min(homepagePickLimit, recipes.length), locale);
    assert.deepEqual(homepagePicks([...recipes].reverse()).map((item) => item.recipeId), picks.map((item) => item.recipeId), locale);
    assert.equal(new Set(picks.map((item) => item.recipeId)).size, picks.length, locale);
    assert.ok(picks.every((item) => item.locale === locale && item.routePath.startsWith("/") && recipes.includes(item)), locale);
    assert.ok(new Set(picks.map((item) => item.category)).size >= 3, locale);
    assert.deepEqual(recipes.map((item) => item.recipeId), originalOrder, "selection must not mutate the original order");
    const topics = homepageTopics(recipes);
    assert.ok(topics.length >= 4 && topics.length <= 6, locale);
    assert.ok(topics.every((topic) => recipes.some((item) => topic.kind === "category"
      ? item.category === topic.value : topic.value === "keto" ? item.dietClass === "keto" : item.dietClass !== null)), locale);
    assert.ok(homepageLabels[locale].topics && homepageLabels[locale].picks && homepageLabels[locale].allRecipes(recipes.length), locale);
  }
});

test("homepage preview keeps unillustrated recipes reachable when insufficient image picks exist", () => {
  const illustrated = finnishRecipes.find((item) => item.image !== null)!;
  const sample = [
    { recipeId: "third", category: "aamupala" as const, image: null },
    { recipeId: "first", category: "paaruoka" as const, image: illustrated.image },
    { recipeId: "second", category: "jalkiruoka" as const, image: null },
  ];
  assert.deepEqual(homepagePicks(sample, 3).map((item) => item.recipeId), ["first", "third", "second"]);
  assert.deepEqual(homepagePicks(sample, 0), []);
});


test("gluten-free filter is explicit, independent of keto/VHH and fail-closed", () => {
  const baseline = finnishRecipes[0];
  const verified = { ...baseline, recipeId: "gf-reviewed", glutenFree: true, dietClass: "keto" as const };
  const unreviewed = { ...baseline, recipeId: "gf-unknown", glutenFree: undefined, dietClass: "keto" as const };
  const falseClaim = { ...baseline, recipeId: "gf-rejected", glutenFree: false, dietClass: null };
  const items = [verified, unreviewed, falseClaim];
  const filter = { ...emptyRecipeFilters, glutenFree: true, diet: "keto" as const };
  assert.equal(recipeFiltersToSearch(filter), "?diet=keto&gluten_free=1");
  assert.deepEqual(parseRecipeFilters("?diet=keto&gluten_free=1", ["all"]), filter);
  assert.deepEqual(filterRecipes(items, filter, "fi").map(item => item.recipeId), ["gf-reviewed"]);
  assert.deepEqual(filterRecipes(items, { ...emptyRecipeFilters, glutenFree: true }, "fi").map(item => item.recipeId), ["gf-reviewed"]);
  assert.deepEqual(parseRecipeFilters("?gluten_free=yes", ["all"]), emptyRecipeFilters);
  assert.deepEqual(parseRecipeFilters("?gluten_free=0", ["all"]), emptyRecipeFilters);
  assert.equal(recipeFiltersToSearch({ ...emptyRecipeFilters, glutenFree: undefined }), "");
  assert.equal(filterRecipes([unreviewed, falseClaim], { ...emptyRecipeFilters, glutenFree: true }, "fi").length, 0, "unknown and explicitly false classifications fail closed");
});


test("source-pinned dietary reviews are consistent across all four published language routes", () => {
  const expected: Record<string, string[]> = {
    hummus: ["vegetarian", "vegan", "pescatarian"],
    caponata: ["vegetarian", "vegan", "pescatarian"],
    munakokkeli: ["vegetarian", "pescatarian"],
    bouillabaisse: ["pescatarian"],
    "kermainen-lohipata": ["pescatarian"],
  };
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const local = siteContent.recipes.filter((recipe) => recipe.locale === locale);
    for (const [id, tags] of Object.entries(expected)) {
      const recipe = local.find((recipe) => recipe.recipeId === id);
      assert.ok(recipe, `${locale}/${id} must be published`);
      assert.deepEqual(recipe.dietTags, tags, `${locale}/${id} has reviewed diet tags`);
      for (const diet of tags) {
        assert.equal(filterRecipes([recipe], { ...emptyRecipeFilters, diet: diet as "vegan" | "vegetarian" | "pescatarian" }, locale).length, 1);
      }
    }
    assert.ok(filterRecipes(local, { ...emptyRecipeFilters, diet: "vegan" }, locale).some(recipe => recipe.recipeId === "hummus"));
    assert.ok(!filterRecipes(local, { ...emptyRecipeFilters, diet: "vegan" }, locale).some(recipe => recipe.recipeId === "munakokkeli"));
    assert.ok(!filterRecipes(local, { ...emptyRecipeFilters, diet: "carnivore" }, locale).some(recipe => recipe.recipeId === "munakokkeli"));
  }
  const hummus = siteContent.recipes.find(recipe => recipe.recipeId === "hummus" && recipe.locale === "fi")!;
  assert.deepEqual(filterRecipes([hummus], { ...emptyRecipeFilters, category: "alkuruoka", diet: "vegan" }, "fi").map(x => x.recipeId), ["hummus"]);
  assert.deepEqual(filterRecipes([hummus], { ...emptyRecipeFilters, category: "paaruoka", diet: "vegan" }, "fi"), []);
  assert.deepEqual(filterRecipes([hummus], { ...emptyRecipeFilters, diet: "vegan", glutenFree: true }, "fi"), [],
    "vegan reviews do not imply a reviewed gluten-free claim");
});

test("new diet URL values round-trip, preserve keto/VHH and reject unapproved options", () => {
  const filters = { ...emptyRecipeFilters, diet: "pescatarian" as const, maxTime: 60, glutenFree: true };
  assert.equal(recipeFiltersToSearch(filters), "?diet=pescatarian&time=60&gluten_free=1");
  assert.deepEqual(parseRecipeFilters(recipeFiltersToSearch(filters), ["all"]), filters);
  assert.deepEqual(parseRecipeFilters("?diet=pescatarian", ["all"], ["keto", "vhh"]), emptyRecipeFilters);
  assert.deepEqual(parseRecipeFilters("?diet=carnivore", ["all"], ["carnivore"]), { ...emptyRecipeFilters, diet: "carnivore" });
  assert.deepEqual(parseRecipeFilters("?diet=unknown", ["all"]), emptyRecipeFilters);
  const base = siteContent.recipes.find(recipe => recipe.locale === "fi")!;
  assert.equal(filterRecipes([{ ...base, recipeId: "animal-only-fixture", dietTags: ["carnivore"] }], { ...emptyRecipeFilters, diet: "carnivore" }, "fi").length, 1);
  assert.equal(filterRecipes([{ ...base, recipeId: "not-reviewed", dietTags: undefined }], { ...emptyRecipeFilters, diet: "carnivore" }, "fi").length, 0);
});


test("diet review pins fail closed when Finnish source or a translation changes", async () => {
  const { reviewedDietTagsForSource } = await import("../scripts/reviewed-diet-filters");
  const { appendFile, copyFile, mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const path = await import("node:path");
  const root = path.resolve(import.meta.dirname, "../..");
  const fi = path.join(root, "reseptit/alkuruoat/hummus.md");
  const byLocale = {
    fi,
    en: path.join(root, "kaannokset/en/alkuruoat/hummus.md"),
    sv: path.join(root, "kaannokset/sv/alkuruoat/hummus.md"),
    th: path.join(root, "kaannokset/th/alkuruoat/hummus.md"),
  };
  const expected = ["vegetarian", "vegan", "pescatarian"];
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    assert.deepEqual(await reviewedDietTagsForSource("hummus", locale, byLocale[locale], fi), expected, locale);
    assert.deepEqual(await reviewedDietTagsForSource("hummus", locale, byLocale[locale]), [], `${locale}: no verified FI source`);
  }
  assert.deepEqual(await reviewedDietTagsForSource("__proto__", "fi", fi, fi), [], "unknown recipe must never use an inherited entry");
  const dir = await mkdtemp(path.join(tmpdir(), "reviewed-diets-"));
  try {
    const changedFi = path.join(dir, "hummus-fi.md");
    const changedSv = path.join(dir, "hummus-sv.md");
    await copyFile(fi, changedFi);
    await copyFile(byLocale.sv, changedSv);
    assert.deepEqual(await reviewedDietTagsForSource("hummus", "sv", changedSv, changedFi), expected);
    await appendFile(changedFi, "\n<!-- Simulated canonical source edit -->\n");
    assert.deepEqual(await reviewedDietTagsForSource("hummus", "sv", changedSv, changedFi), [],
      "a changed Finnish original invalidates even an unchanged translation");
    await copyFile(fi, changedFi);
    await appendFile(changedSv, "\n<!-- Simulated translation edit -->\n");
    assert.deepEqual(await reviewedDietTagsForSource("hummus", "sv", changedSv, changedFi), [],
      "a changed translation cannot keep its old review");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});


test("batch 2 reviews 12 additional source recipes in all published languages", async () => {
  const path = await import("node:path");
  const { reviewedDietTagsForSource } = await import("../scripts/reviewed-diet-filters");
  const root = path.resolve(import.meta.dirname, "../..");
  const candidates = [
    ["alkuruoat", "medu-vada", "vegan"],
    ["alkuruoat", "tabbouleh", "vegan"],
    ["paaruoat", "ratatouille", "vegan"],
    ["aamupalat", "shakshuka", "vegetarian"],
    ["aamupalat", "valimerellinen-farinata-aamupalaksi", "vegan"],
    ["aamupalat", "kiinalainen-soijamaito-aamiaisella", "vegan"],
    ["paaruoat", "lohikeitto-kuohukermalla", "pescatarian"],
    ["paaruoat", "silakkapihvit-tilli-kermakastike", "pescatarian"],
    ["aamupalat", "tonnikalamunakkaat-uunissa", "pescatarian"],
    ["alkuruoat", "paneer-tikka", "vegetarian"],
    ["alkuruoat", "gazpacho", "vegetarian"],
    ["paaruoat", "palak-paneer", "vegetarian"],
  ] as const;
  for (const [directory, id, level] of candidates) {
    const approvedTags = level === "vegan" ? ["vegetarian", "vegan", "pescatarian"]
      : level === "vegetarian" ? ["vegetarian", "pescatarian"] : ["pescatarian"];
    const fiFile = path.join(root, "reseptit", directory, id + ".md");
    for (const locale of ["fi", "en", "sv", "th"] as const) {
      const filename = locale === "fi" ? fiFile : path.join(root, "kaannokset", locale, directory, id + ".md");
      assert.deepEqual(await reviewedDietTagsForSource(id, locale, filename, fiFile), approvedTags,
        `${id}/${locale} must have exactly the reviewed source hash`);
      const recipe = siteContent.recipes.find(item => item.recipeId === id && item.locale === locale);
      assert.ok(recipe, `${id}/${locale} must already be published`);
      assert.deepEqual(recipe.dietTags, approvedTags, `${id}/${locale} built classification`);
      for (const diet of approvedTags) {
        assert.equal(filterRecipes([recipe], { ...emptyRecipeFilters, diet: diet as "vegetarian" | "vegan" | "pescatarian" }, locale).length, 1);
      }
      assert.deepEqual(filterRecipes([recipe], { ...emptyRecipeFilters, diet: "carnivore" }, locale), [],
        `${id}/${locale} not an animal-only recipe`);
    }
  }
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const recipes = siteContent.recipes.filter(item => item.locale === locale);
    assert.ok(filterRecipes(recipes, { ...emptyRecipeFilters, diet: "vegan" }, locale).length >= 7, locale);
    assert.ok(filterRecipes(recipes, { ...emptyRecipeFilters, diet: "pescatarian" }, locale).length >= 17, locale);
    const neverAssumeVegan = ["gazpacho", "shakshuka", "paneer-tikka", "palak-paneer"];
    assert.ok(neverAssumeVegan.every(id => !filterRecipes(recipes, { ...emptyRecipeFilters, diet: "vegan" }, locale).some(item => item.recipeId === id)), locale);
    assert.ok(!filterRecipes(recipes, { ...emptyRecipeFilters, diet: "vegetarian" }, locale).some(item => item.recipeId === "pasta-alla-norma"),
      "Animal-rennet Pecorino cannot be inferred vegetarian");
  }
});


test("FI-only dietary approvals require a valid FI source and never fabricate EN/SV/TH approval", async () => {
  const { reviewedDietTagsForVersion } = await import("../scripts/reviewed-diet-filters");
  const path = await import("node:path");
  const root = path.resolve(import.meta.dirname, "../..");
  const fi = path.join(root, "reseptit/alkuruoat/hummus.md");
  const en = path.join(root, "kaannokset/en/alkuruoat/hummus.md");
  // This test uses an existing reviewed vegetarian FI source as an exemplar;
  // it does NOT classify hummus as carnivore or publish any new recipe.
  const fiOnly = {
    tags: ["vegetarian"] as const,
    sourceBlobShas: { fi: "cd792d70d50753a5f8f93eeca030ec3743cfb209" },
  };
  assert.deepEqual(await reviewedDietTagsForVersion(fiOnly, "fi", fi, fi), ["vegetarian"]);
  assert.deepEqual(await reviewedDietTagsForVersion(fiOnly, "en", en, fi), [],
    "a published English version without an explicit reviewed SHA must fail closed");
  assert.deepEqual(await reviewedDietTagsForVersion(fiOnly, "sv", en, fi), []);
  assert.deepEqual(await reviewedDietTagsForVersion(fiOnly, "th", en, fi), []);
  assert.deepEqual(await reviewedDietTagsForVersion(fiOnly, "fi", en, fi), [],
    "Finnish approval cannot be used for the wrong file path");
  assert.deepEqual(await reviewedDietTagsForVersion(fiOnly, "fi", fi), [],
    "missing canonical source is not an approval");
  const withEnglishReview = {
    ...fiOnly,
    sourceBlobShas: {
      ...fiOnly.sourceBlobShas,
      en: "226fcc49b596963b806566d7d303f065b49ba257",
    },
  };
  assert.deepEqual(await reviewedDietTagsForVersion(withEnglishReview, "en", en, fi), ["vegetarian"]);
});
