import { test } from "node:test";
import assert from "node:assert/strict";
import { assertKarnivoreDraftSafe, karnivoreApprovedIngredients } from "../scripts/karnivore-draft-gate";
import type { recipeFrontmatterSchema } from "../src/content/schema";

type RecipeData = ReturnType<typeof recipeFrontmatterSchema.parse>;
const sample = (id = "karnivore-steak-and-eggs"): RecipeData => ({
  title: "Test fixture", recipe_id: id, url_slug: id, category: "paaruoka",
  language: "fi", status: "draft", servings: 2,
  ingredients: karnivoreApprovedIngredients[id]!.map((item) => ({ amount: 100, unit: "g", item })),
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
test("unreviewed recipe ID is blocked", () => {
  const candidate = { ...sample(), recipe_id: "karnivore-unknown", url_slug: "karnivore-unknown" };
  assert.throws(() => assertKarnivoreDraftSafe(candidate, prep), /Unreviewed karnivore recipe ID/);
});
test("published status cannot bypass the nutrition and image gate", () => {
  const held = sample("karnivore-maksa-ja-pekoni");
  held.status = "published";
  assert.throws(() => assertKarnivoreDraftSafe(held, prep), /publication blocked/);

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
test("no cooking temperature cannot pass", () => {
  assert.throws(() => assertKarnivoreDraftSafe(sample(), prep.replace("75 °C", "riittävän kuumaksi")), /no measurable cooking temperature/);
});
