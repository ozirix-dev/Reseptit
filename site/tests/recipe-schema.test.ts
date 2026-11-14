import assert from "node:assert/strict";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { assertQuantifiedCriticalIngredients, assertUniqueRecipes, assertSnackPublicationReady, snackPublicationErrors } from "../src/content/recipe-validation";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { assertGlutenFreeReviewRecord } from "../scripts/gluten-free-review";
import { siteContent } from "../src/generated/content.generated";
import { recipeJsonLd } from "../src/features/recipes/schema";
import { sourceReviewNotice, sourceReviewNotices } from "../src/features/recipes/source-review-notices";

test("Recipe yield is Schema.org Text and preserves the source serving count", () => {
  for (const recipe of siteContent.recipes) {
    assert.equal(recipeJsonLd(recipe).recipeYield, String(recipe.servings));
  }
});

test("malformed frontmatter and unsupported fields are rejected", () => {
  assert.throws(() => parseMarkdown("---\ntitle: [broken\n---\nText"));
  const recipe = siteContent.recipes[0];
  assert.throws(() => recipeFrontmatterSchema.parse({
    title: recipe.title, recipe_id: recipe.recipeId, url_slug: recipe.slug,
    category: recipe.category, language: recipe.locale, status: "published",
    ingredients: recipe.ingredients, servings: recipe.servings,
    unexpected_field: "must not be silently ignored",
  }));
});

test("recipe images require relative WebP paths and descriptive dimensions", () => {
  const recipe = siteContent.recipes[0];
  const input = {
    title: recipe.title, recipe_id: recipe.recipeId, url_slug: recipe.slug,
    category: recipe.category, language: recipe.locale, status: "published",
    ingredients: recipe.ingredients, servings: recipe.servings,
    image: { src: "../outside.webp", alt: "Valmis ruoka", width: 1200, height: 800 },
  };
  assert.equal(recipeFrontmatterSchema.safeParse(input).success, false);
  assert.equal(recipeFrontmatterSchema.safeParse({
    ...input,
    image: { ...input.image, src: "paaruoat/ruoka.webp" },
  }).success, true);
});

test("aamupala is a supported recipe category", () => {
  const recipe = siteContent.recipes.find((entry) => entry.category === "aamupala");
  assert.ok(recipe);
  assert.equal(recipeFrontmatterSchema.safeParse({
    title: recipe.title, recipe_id: recipe.recipeId, url_slug: recipe.slug,
    category: "aamupala", language: "fi", status: "published",
    ingredients: recipe.ingredients, servings: recipe.servings,
  }).success, true);
});

test("valipala category is accepted, but drafts do not imply publication", () => {
  assert.equal(recipeFrontmatterSchema.safeParse({
    title: "Välipalaluonnos", recipe_id: "valipala-koe", url_slug: "valipala-koe",
    category: "valipala", language: "fi", status: "draft",
    ingredients: [{amount: 100, unit: "g", item: "kurkkua"}], servings: 2,
  }).success, true);
  assert.ok(!siteContent.recipes.some((entry) => entry.recipeId === "valipala-koe"));
});

test("duplicate published recipe locale and route are rejected", () => {
  const recipe = siteContent.recipes[0];
  assert.throws(() => assertUniqueRecipes([recipe, { ...recipe }]), /Duplicate published recipe translation/);
  assert.throws(() => assertUniqueRecipes([recipe, { ...recipe, recipeId: "other-recipe" }]), /Duplicate published recipe URL/);
});

test("new recipes require exact amounts for nutrition-critical ingredients", () => {
  const recipe = { ...siteContent.recipes[0], recipeId: "future-recipe", locale: "fi" as const,
    ingredients: [{ amount: null, unit: "", item: "oliiviöljyä" }] };
  assert.throws(() => assertQuantifiedCriticalIngredients([recipe]), /oliiviöljyä needs a numeric amount and unit/);
  assert.doesNotThrow(() => assertQuantifiedCriticalIngredients([{
    ...recipe, ingredients: [{ amount: 15, unit: "ml", item: "oliiviöljyä" }],
  }]));
  assert.doesNotThrow(() => assertQuantifiedCriticalIngredients(siteContent.recipes));
});


test("second snack review batch matches its source ledger and cannot publish duplicates", async () => {
  const { readFileSync } = await import("node:fs");
  const path = await import("node:path");
  const root = path.resolve(import.meta.dirname, "../..");
  const ledger = JSON.parse(readFileSync(path.join(root, "docs/reviews/valipalat/era-02/source-bindings.json"), "utf8")) as {
    status: string; published: boolean; publicationAuthorized: boolean; glycemicLoadStatus: string;
    recipes: Array<{ id: string; servings: number; status: string; gk: string;
      sourceFile: string; ingredients: Array<{ grams: number; unit: string; item: string; sourceId: string | null }> }>;
  };
  const foodRecords = JSON.parse(readFileSync(path.join(root, "docs/nutrition/food-records.json"), "utf8")) as Array<{ id: string }>;
  const knownIds = new Set(foodRecords.map(row => row.id));
  assert.equal(ledger.status, "DRAFT_SOURCE_MAPPING_ONLY");
  assert.equal(ledger.published, false);
  assert.equal(ledger.publicationAuthorized, false);
  assert.equal(ledger.glycemicLoadStatus, "HOLD_ALL");
  assert.equal(ledger.recipes.length, 5);
  for (const recipe of ledger.recipes) {
    const md = parseMarkdown(readFileSync(path.join(root, recipe.sourceFile), "utf8"));
    assert.ok(md, recipe.sourceFile);
    const actual = recipeFrontmatterSchema.parse(md.data);
    assert.equal(actual.recipe_id, recipe.id);
    assert.equal(actual.url_slug, recipe.id);
    assert.equal(actual.category, "valipala");
    assert.equal(actual.language, "fi");
    assert.equal(actual.status, "draft");
    assert.equal(actual.servings, recipe.servings);
    assert.equal(recipe.status, "REVIEW_REQUIRED");
    assert.equal(recipe.gk, "HOLD");
    assert.equal(actual.ingredients.length, recipe.ingredients.length);
    for (let i = 0; i < actual.ingredients.length; i++) {
      assert.equal(actual.ingredients[i].amount, recipe.ingredients[i].grams);
      assert.equal(actual.ingredients[i].unit, recipe.ingredients[i].unit);
      assert.equal(actual.ingredients[i].item, recipe.ingredients[i].item);
      const id = recipe.ingredients[i].sourceId;
      if (id !== null) assert.ok(knownIds.has(id), `${recipe.id} unknown food source: ${id}`);
    }
    assert.ok(!siteContent.recipes.some(item => item.recipeId === recipe.id),
      `${recipe.id} unexpectedly already published`);
  }
  assert.ok(siteContent.recipes.some(item => item.recipeId === "munakasmuffinit" && item.locale === "fi"),
    "existing muffins must be reused, not duplicated");
  assert.ok(!siteContent.recipes.some(item => item.recipeId === "suklaamousse-keto" && item.locale === "fi"),
    "the old mousse title-only stub must not be presented as published");
});

test("new published snacks fail closed without photo and nutrition evidence", () => {
  const candidate = {
    recipe_id: "valipala-julkaisukoe",
    category: "valipala",
    status: "draft",
    ingredients: [{ amount: 80, unit: "g", item: "juustoa" }],
  };
  assert.deepEqual(snackPublicationErrors(candidate), []);
  const proposed = { ...candidate, status: "published" };
  assert.throws(() => assertSnackPublicationReady(proposed), /approved WebP image/);
  assert.ok(snackPublicationErrors(proposed).some(error => error.includes("carbs_net_per_serving_g")));
  const withImage = {
    ...proposed,
    image: { src: "valipalat/test-recipe.webp", alt: "Valmis välipala", width: 1600, height: 900 },
  };
  assert.ok(!snackPublicationErrors(withImage).some(error => error.includes("WebP image")));
  const ready = {
    ...withImage, carbs_net_per_serving_g: 1, carbs_total_per_serving_g: 2,
    protein_per_serving_g: 12, fat_per_serving_g: 10,
  };
  assert.doesNotThrow(() => assertSnackPublicationReady(ready));
  assert.ok(snackPublicationErrors({ ...ready, carbs_total_per_serving_g: 0.5 })
    .some(error => error.includes("below net carbohydrates")));
  assert.ok(snackPublicationErrors({ ...ready, ingredients: [{ amount: null, unit: "", item: "juustoa" }] })
    .some(error => error.includes("quantified amount")));
  assert.ok(snackPublicationErrors({ ...ready, image: { ...ready.image, src: "paaruoat/test.webp" } })
    .some(error => error.includes("kuvat/valipalat/")));
  assert.doesNotThrow(() => assertSnackPublicationReady({ ...proposed, category: "paaruoka" }));
});

test("gluten-free metadata fails closed without dated recipe-level evidence", () => {
  const base = {
    title: "Gluteeniton laatutesti", recipe_id: "gluteeniton-laatutesti",
    url_slug: "gluteeniton-laatutesti", language: "fi", category: "leivonnainen",
    status: "draft", servings: 4, ingredients: [{ amount: 150, unit: "g", item: "perunajauhoa" }],
  };
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, gluten_free: true }).success, false);
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, gluten_free: false }).success, true);
  const review = { evidence_ref: "docs/reviews/gluteeniton/gluteeniton-laatutesti.md", reviewed_at: "2026-11-11", reviewer: "Resepti katselmoija" };
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, gluten_free: true, gluten_free_review: review }).success, true);
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, gluten_free: true, gluten_free_review: { ...review, evidence_ref: "../other.md" } }).success, false);
  assert.equal(recipeFrontmatterSchema.safeParse({ ...base, gluten_free_review: review }).success, false);
});

test("gluten-free source-evidence binding refuses missing, stale and incomplete approvals", () => {
  const bind = { recipeId: "gf-demo", language: "fi" as const, reviewedAt: "2026-11-11", reviewer: "Toimitus", sourceSha256: "a".repeat(64) };
  const evidence = [
    "recipe_id: gf-demo", "language: fi", "reviewed_at: 2026-11-11",
    "reviewer: Toimitus", `source_sha256: ${"a".repeat(64)}`,
    "decision: approved", "ingredient_checks: complete", "cross_contact: reviewed",
  ].join("\n");
  assert.doesNotThrow(() => assertGlutenFreeReviewRecord(bind, evidence));
  assert.throws(() => assertGlutenFreeReviewRecord({ ...bind, sourceSha256: "b".repeat(64) }, evidence), /GLUTEN_FREE_REVIEW_MISMATCH/);
  assert.throws(() => assertGlutenFreeReviewRecord(bind, evidence.replace("decision: approved", "decision: hold")), /GLUTEN_FREE_REVIEW_MISMATCH/);
  assert.throws(() => assertGlutenFreeReviewRecord(bind, evidence.replace("cross_contact: reviewed", "")), /GLUTEN_FREE_REVIEW_MISMATCH/);
  assert.throws(() => assertGlutenFreeReviewRecord(bind, ""), /GLUTEN_FREE_REVIEW_MISMATCH/);
});


test("F25 consumer-facing review notices are separate from GK-sealed recipe Markdown", () => {
  const ids = [
    "intialainen-pinaatti-paneer-chilla",
    "meksikolainen-chilaquiles-verdes",
    "meksikolainen-paputostada-aamupalaksi",
    "korealainen-kimchi-jeon-aamiaiseksi",
    "karibia-plantain-aamiaislautanen",
  ];
  assert.deepEqual(Object.keys(sourceReviewNotices).sort(), [...ids].sort());
  for (const id of ids) {
    const notice = sourceReviewNotice(id);
    assert.ok(notice, id);
    assert.ok(notice.heading.length > 10 && notice.details.length > 35 && notice.allergens.length > 15);
    const recipe = siteContent.recipes.find((x) => x.recipeId === id && x.locale === "fi");
    assert.ok(recipe, id + " remains a FI source");
    assert.equal(sourceReviewNotice("thai-roti-munalla-banaanilla"), null);
    assert.ok(!JSON.stringify(recipe).includes(notice.heading), "separate UI notice must not rewrite recipe content");
  }
  assert.match(sourceReviewNotice("meksikolainen-chilaquiles-verdes")!.details,/51,845 g/);
  assert.match(sourceReviewNotice("korealainen-kimchi-jeon-aamiaiseksi")!.details,/4,5 g/);
});
