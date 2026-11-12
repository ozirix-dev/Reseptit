import assert from "node:assert/strict";
import type { recipeFrontmatterSchema } from "../src/content/schema";
import { semanticHash, semanticStatus, type SemanticEvidence } from "./translation-semantic-review";

// Scope-locked fail-closed gate for the 10 animal-ingredient FI drafts.
// Every publication or ingredient-set change must be deliberately reviewed.
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

const approvedFiPublished = new Set(["karnivore-steak-and-eggs","karnivore-voilohi-pannulla","karnivore-jauhelihakulho-munalla","karnivore-smashburger","karnivore-rapea-porsaan-kylki","karnivore-meatza","karnivore-lammaskyljykset-voissa","karnivore-rapeat-kananreisipalat","karnivore-naudan-lyhytkylki","karnivore-maksa-ja-pekoni"]);

type RecipeData = ReturnType<typeof recipeFrontmatterSchema.parse>;

export function assertKarnivoreDraftSafe(recipe: RecipeData, markdown: string): void {
  if (!recipe.recipe_id.startsWith("karnivore-")) return;
  const approved = karnivoreApprovedIngredients[recipe.recipe_id];
  assert(approved, `Unreviewed karnivore recipe ID: ${recipe.recipe_id}`);
  assert.equal(recipe.url_slug, recipe.recipe_id, `${recipe.recipe_id}: slug must match locked ID`);
  assert.equal(recipe.language, "fi", `${recipe.recipe_id}: translations need their own review`);
  assert.equal(recipe.category, "paaruoka", `${recipe.recipe_id}: scope is main dishes`);
  if (recipe.status === "published") {
    assert(approvedFiPublished.has(recipe.recipe_id), `${recipe.recipe_id}: publication blocked without separately reviewed FI evidence`);
    assert(recipe.image?.src === `paaruoat/${recipe.recipe_id}.webp` && recipe.image.width >= 480 && recipe.image.height >= 320 && recipe.image.alt.trim(),
      `${recipe.recipe_id}: published carnivore needs the scoped WebP and metadata`);
    for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
      assert(typeof recipe[key] === "number" && Number.isFinite(recipe[key]) && recipe[key]! >= 0,
        `${recipe.recipe_id}: published nutrition values require a calculation`);
    }
  } else {
    assert.equal(recipe.status, "draft", `${recipe.recipe_id}: publication blocked until images, nutrition and diet classification have passed review`);
  }
  assert.deepEqual(recipe.ingredients.map((ingredient) => ingredient.item), approved,
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
  if (recipe.status === "draft") for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
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
): void {
  const { data: recipe } = translation;
  const id = recipe.recipe_id;
  assert(["en", "sv", "th"].includes(recipe.language), `${id}: unsupported translation language`);
  assert(recipe.status === "published" && source.data.status === "published", `${id}: translation requires a published Finnish source and review`);
  assert.equal(source.data.recipe_id, id, `${id}: translation source identity mismatch`);
  assert.equal(recipe.source_recipe, `reseptit/paaruoat/${id}.md`, `${id}: translation source path mismatch`);
  assertKarnivoreDraftSafe(source.data, source.content);
  assert.equal(recipe.url_slug, source.data.url_slug, `${id}: translation slug differs from approved source`);
  assert.equal(recipe.diet_class, undefined, `${id}: do not apply unsupported keto/VHH class`);
  assert.notEqual(recipe.gluten_free, true, `${id}: gluten-free needs separate evidence`);
  assert.equal(recipe.gluten_free_review, undefined, `${id}: unsupported gluten-free review`);
  // Changed-content validation also checks locale, quantities, units, image,
  // preparation facts and nutrition against the source in auditTranslations.
  assert.equal(semanticStatus(semanticHash(source), semanticHash(translation), true, evidence), "REVIEW CURRENT",
    `${id}: translation requires current source-bound semantic review`);
}
