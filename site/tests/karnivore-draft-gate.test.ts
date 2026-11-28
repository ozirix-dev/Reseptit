import { test } from "node:test";
import assert from "node:assert/strict";
import { assertKarnivoreDraftSafe, assertKarnivoreTranslationReady, isHistoricalKarnivoreRecipe, karnivoreApprovedIngredients } from "../scripts/karnivore-draft-gate";
import type { recipeFrontmatterSchema } from "../src/content/schema";
import { semanticHash } from "../scripts/translation-semantic-review";

type RecipeData = ReturnType<typeof recipeFrontmatterSchema.parse>;
const sample = (id = "karnivore-steak-and-eggs"): RecipeData => ({
  title: "Test fixture", recipe_id: id, url_slug: id, category: "paaruoka",
  language: "fi", status: "draft", servings: 2,
  ingredients: (karnivoreApprovedIngredients[id] ?? ["naudansisäfileetä", "suolaa"])
    .map((item) => ({ amount: 100, unit: "g", item })),
  tags: ["carnivore", "karnivore"], translation_languages: [], translation_status: {},
});
const prep = "# Recipe\n\n## Valmistus\n\n1. First\n2. Second\n3. Third\n4. Cook to 75 °C\n";

test("all ten reviewed draft ingredient sets are accepted", () => {
  assert.equal(Object.keys(karnivoreApprovedIngredients).length, 10);
  for (const id of Object.keys(karnivoreApprovedIngredients)) assert.doesNotThrow(() => assertKarnivoreDraftSafe(sample(id), prep), id);
});
test("unapproved vegetable ingredient is blocked", () => {
  const candidate = sample();
  candidate.ingredients.push({ amount: 10, unit: "g", item: "sipuli" });
  assert.throws(() => assertKarnivoreDraftSafe(candidate, prep), /ingredient identity changed/);
});
test("new recipe IDs and their translations can enter the normal draft workflow", () => {
  const draft = { ...sample("karnivore-new-recipe"), carbs_net_per_serving_g: null };
  assert.equal(isHistoricalKarnivoreRecipe(draft.recipe_id), false);
  assert.equal(isHistoricalKarnivoreRecipe("constructor"), false);
  const source = { data: draft, content: prep };
  const translation = { data: { ...draft, language: "en" as const }, content: prep };
  assert.doesNotThrow(() => assertKarnivoreDraftSafe(draft, prep));
  assert.doesNotThrow(() => assertKarnivoreTranslationReady(translation, source));
});

test("new published recipes require current animal-origin review, image and nutrition", () => {
  const draft = sample("karnivore-new-recipe");
  const published: RecipeData = { ...draft, status: "published" };
  assert.throws(() => assertKarnivoreDraftSafe(published, prep), /current Finnish animal-origin review/);
  assert.throws(() => assertKarnivoreDraftSafe(published, prep, true), /WebP and metadata/);
  published.image = { src: "paaruoat/karnivore-new-recipe.webp", alt: "Steak", width: 1280, height: 853 };
  assert.throws(() => assertKarnivoreDraftSafe(published, prep, true), /published nutrition values require a calculation/);
  Object.assign(published, {
    carbs_net_per_serving_g: 0, carbs_total_per_serving_g: 0, protein_per_serving_g: 10, fat_per_serving_g: 5,
  });
  assert.doesNotThrow(() => assertKarnivoreDraftSafe(published, prep, true));

  const source = { data: published, content: prep };
  const translation = { data: {
    ...published, language: "en" as const, source_recipe: "reseptit/paaruoat/karnivore-new-recipe.md",
  }, content: prep };
  const evidence = {
    source_hash: semanticHash(source), translation_hash: semanticHash(translation),
    reviewed_at: "2026-11-28", reference: "test fixture", outcome: "pass" as const, findings: [],
  };
  assert.throws(() => assertKarnivoreTranslationReady(translation, source, evidence), /current Finnish animal-origin review/);
  assert.throws(() => assertKarnivoreTranslationReady(translation, source, undefined, true), /current source-bound semantic review/);
  assert.doesNotThrow(() => assertKarnivoreTranslationReady(translation, source, evidence, true));
});
test("published status cannot bypass the nutrition and image gate", () => {
  const approved = sample();
  approved.status = "published";
  assert.throws(() => assertKarnivoreDraftSafe(approved, prep), /published carnivore needs the scoped WebP and metadata/);
  approved.image = { src: "paaruoat/karnivore-steak-and-eggs.webp", alt: "Steak and eggs", width: 1280, height: 853 };
  assert.throws(() => assertKarnivoreDraftSafe(approved, prep), /published nutrition values require a calculation/);
});
test("unsupported nutrition, keto/VHH or gluten-free claims are blocked", () => {
  const macros = sample(); macros.carbs_net_per_serving_g = 0;
  assert.throws(() => assertKarnivoreDraftSafe(macros, prep), /nutrition fields/);
  const keto = sample(); keto.diet_class = "keto";
  assert.throws(() => assertKarnivoreDraftSafe(keto, prep), /unsupported keto/);
  const gluten = sample(); gluten.gluten_free = true;
  assert.throws(() => assertKarnivoreDraftSafe(gluten, prep), /gluten-free/);
});
test("published translations need current review against the approved Finnish recipe", () => {
  const data: RecipeData = { ...sample(), status: "published",
    image: { src: "paaruoat/karnivore-steak-and-eggs.webp", alt: "Steak and eggs", width: 1280, height: 853 },
    carbs_net_per_serving_g: 0, carbs_total_per_serving_g: 0, protein_per_serving_g: 10, fat_per_serving_g: 5,
  };
  const source = { data, content: prep };
  const translated = { data: { ...data, language: "en" as const, source_recipe: "reseptit/paaruoat/karnivore-steak-and-eggs.md" }, content: prep };
  const evidence = { source_hash: semanticHash(source), translation_hash: semanticHash(translated),
    reviewed_at: "2026-11-12", reference: "test fixture", outcome: "pass" as const, findings: [],
  };
  assert.doesNotThrow(() => assertKarnivoreTranslationReady(translated, source, evidence));
  assert.throws(() => assertKarnivoreTranslationReady(translated, source), /current source-bound semantic review/);
  assert.throws(() => assertKarnivoreTranslationReady({ ...translated, content: prep.replace("75", "40") }, source, evidence), /current source-bound semantic review/);
  assert.throws(() => assertKarnivoreTranslationReady(translated, { ...source, data: { ...data, status: "draft" } }, evidence), /published Finnish source/);
  assert.throws(() => assertKarnivoreTranslationReady(translated, { ...source, data: { ...data, ingredients: [{ amount: 100, unit: "g", item: "sipuli" }] } }, evidence), /ingredient identity changed/);
});

test("no cooking temperature cannot pass", () => {
  assert.throws(() => assertKarnivoreDraftSafe(sample(), prep.replace("75 °C", "riittävän kuumaksi")), /no measurable cooking temperature/);
});
