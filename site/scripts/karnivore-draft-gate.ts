import assert from "node:assert/strict";
import type { recipeFrontmatterSchema } from "../src/content/schema";
import { semanticHash, semanticStatus, type SemanticEvidence } from "./translation-semantic-review";

// Preserve the original ten recipes' ingredient locks as historical regression
// evidence. Other recipes can enter as drafts; publication requires a current
// animal-origin review of the Finnish source.
export const karnivoreApprovedIngredients: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "karnivore-steak-and-eggs": ["entrecôte-pihviä","kananmunaa ilman kuoria","voita","suolaa"],
  "karnivore-smashburger": ["naudan jauhelihaa","naudan talia","suolaa"],
  "karnivore-voilohi-pannulla": ["nahallista lohifileetä","voita","suolaa"],
  "karnivore-naudan-lyhytkylki": ["luullisia naudan short ribs -kylkipaloja","vettä","suolaa"],
  "karnivore-rapeat-kananreisipalat": ["nahallisia, luullisia broilerin reisipaloja","voita","suolaa"],
  "karnivore-jauhelihakulho-munalla": ["naudan jauhelihaa","kananmunaa ilman kuoria","suolaa"],
  "karnivore-rapea-porsaan-kylki": ["nahallista porsaan kylkeä","suolaa"],
  "karnivore-maksa-ja-pekoni": ["naudanmaksaa","sokeritonta pekonia","voita","suolaa"],
  "karnivore-meatza": ["naudan jauhelihaa","sokeritonta pekonia","mozzarellajuustoa","suolaa"],
  "karnivore-lammaskyljykset-voissa": ["luullisia lammaskyljyksiä","voita","suolaa"],
});

type RecipeData = ReturnType<typeof recipeFrontmatterSchema.parse>;

export function isHistoricalKarnivoreRecipe(recipeId: string): boolean {
  return Object.hasOwn(karnivoreApprovedIngredients, recipeId);
}

const nutritionFields = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;

export function assertKarnivoreDraftSafe(
  recipe: RecipeData,
  markdown: string,
  animalOriginReviewed = false,
): void {
  if (!recipe.recipe_id.startsWith("karnivore-")) return;
  if (!isHistoricalKarnivoreRecipe(recipe.recipe_id)) {
    if (recipe.status === "published") {
      assert(animalOriginReviewed, `${recipe.recipe_id}: publication requires current Finnish animal-origin review`);
      assert(recipe.image, `${recipe.recipe_id}: published carnivore needs a WebP and metadata`);
      assert(nutritionFields.every(key => typeof recipe[key] === "number" && Number.isFinite(recipe[key]) && recipe[key]! >= 0),
        `${recipe.recipe_id}: published nutrition values require a calculation`);
    }
    return;
  }
  const historicalIngredients = karnivoreApprovedIngredients[recipe.recipe_id];
  assert.equal(recipe.url_slug, recipe.recipe_id, `${recipe.recipe_id}: slug must match locked ID`);
  assert.equal(recipe.language, "fi", `${recipe.recipe_id}: translations need their own review`);
  assert.equal(recipe.category, "paaruoka", `${recipe.recipe_id}: scope is main dishes`);
  if (recipe.status === "published") {
    assert(recipe.image?.src === `paaruoat/${recipe.recipe_id}.webp` && recipe.image.width >= 480 && recipe.image.height >= 320 && recipe.image.alt.trim(),
      `${recipe.recipe_id}: published carnivore needs the scoped WebP and metadata`);
    for (const key of nutritionFields) {
      assert(typeof recipe[key] === "number" && Number.isFinite(recipe[key]) && recipe[key]! >= 0,
        `${recipe.recipe_id}: published nutrition values require a calculation`);
    }
  } else {
    assert.equal(recipe.status, "draft", `${recipe.recipe_id}: publication blocked until images, nutrition and diet classification have passed review`);
  }
  assert.deepEqual(recipe.ingredients.map((ingredient) => ingredient.item), historicalIngredients,
    `${recipe.recipe_id}: ingredient identity changed; explicit animal-origin review needed`);
  assert(recipe.ingredients.every((ingredient) => ingredient.unit === "g" && typeof ingredient.amount === "number" && ingredient.amount > 0),
    `${recipe.recipe_id}: all scoped ingredients must have positive edible/raw gram amounts`);
  assert(recipe.tags.includes("carnivore") && recipe.tags.includes("karnivore"),
    `${recipe.recipe_id}: missing canonical carnivore search tags`);
  assert.equal(recipe.diet_class, undefined, `${recipe.recipe_id}: do not apply unsupported keto/VHH class`);
  assert.notEqual(recipe.gluten_free, true, `${recipe.recipe_id}: gluten-free needs separate evidence`);
  assert.equal(recipe.gluten_free_review, undefined, `${recipe.recipe_id}: unsupported gluten-free review`);
  assert.deepEqual(recipe.translation_languages ?? [], [], `${recipe.recipe_id}: translations are outside this PR`);
  assert.deepEqual(recipe.translation_status ?? {}, {}, `${recipe.recipe_id}: translations are outside this PR`);
  if (recipe.status === "draft") for (const key of nutritionFields) {
    assert.equal(recipe[key], undefined, `${recipe.recipe_id}: nutrition fields require an approved calculation`);
  }
  const steps = markdown.match(/^\d+\.\s+.+$/gm) ?? [];
  assert(steps.length >= 4, `${recipe.recipe_id}: missing or too-short numbered cooking instructions`);
  assert(/\d+\s*°C/.test(markdown), `${recipe.recipe_id}: no measurable cooking temperature in text`);
}

type ReviewInput = { data: RecipeData; content: string };

export function assertKarnivoreTranslationReady(
  translation: ReviewInput,
  source: ReviewInput,
  evidence?: SemanticEvidence[string],
  sourceAnimalOriginReviewed = false,
): void {
  const { data: recipe } = translation;
  const id = recipe.recipe_id;
  const historical = isHistoricalKarnivoreRecipe(id);
  if (!historical && recipe.status === "draft") return;
  assert(["en", "sv", "th"].includes(recipe.language), `${id}: unsupported translation language`);
  assert(recipe.status === "published" && source.data.status === "published", `${id}: translation requires a published Finnish source and review`);
  assert.equal(source.data.recipe_id, id, `${id}: translation source identity mismatch`);
  if (historical) {
    assert.equal(recipe.source_recipe, `reseptit/paaruoat/${id}.md`, `${id}: translation source path mismatch`);
  }
  assertKarnivoreDraftSafe(source.data, source.content, sourceAnimalOriginReviewed);
  if (historical) {
    assert.equal(recipe.url_slug, source.data.url_slug, `${id}: translation slug differs from approved source`);
    assert.equal(recipe.diet_class, undefined, `${id}: do not apply unsupported keto/VHH class`);
    assert.notEqual(recipe.gluten_free, true, `${id}: gluten-free needs separate evidence`);
    assert.equal(recipe.gluten_free_review, undefined, `${id}: unsupported gluten-free review`);
  }
  // Changed-content validation also checks locale, quantities, units, image,
  // preparation facts and nutrition against the source in auditTranslations.
  assert.equal(semanticStatus(semanticHash(source), semanticHash(translation), true, evidence), "REVIEW CURRENT",
    `${id}: translation requires current source-bound semantic review`);
}
