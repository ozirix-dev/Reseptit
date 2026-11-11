import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const sourceMapPath = path.join(repoRoot, "docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json");

type MappedInput = {
  grams: number;
  item: string;
  unit: string;
  sourceMatch: string;
  source?: {
    per100g?: { protein?: number; fat?: number; availableCarbohydrates?: number };
  };
};
type MappedRecipe = {
  recipeId: string;
  servings: number;
  status: string;
  inputs: MappedInput[];
  modelledCarbohydratePerServingFromMappedInputsG?: number;
};
type SourceMap = {
  evidenceType: string;
  publicationStatus: string;
  recipes: MappedRecipe[];
};

const firstThree = [
  "karnivore-steak-and-eggs",
  "karnivore-voilohi-pannulla",
  "karnivore-jauhelihakulho-munalla",
] as const;

// Recorded raw-input scenarios are reviewed *examples*, not publication nutrition metadata.
const lockedRawScenarios: Record<string, { protein: number; fat: number; carbs: number }> = {
  "karnivore-steak-and-eggs": { protein: 54.31945, fat: 36.294, carbs: 0.41 },
  "karnivore-voilohi-pannulla": { protein: 41.2177, fat: 47.6275, carbs: 0.14 },
  "karnivore-jauhelihakulho-munalla": { protein: 42.9481, fat: 45.082, carbs: 0.165 },
};

function rawPerServing(recipe: MappedRecipe) {
  assert(Number.isInteger(recipe.servings) && recipe.servings > 0, "servings must be positive");
  const result = { protein: 0, fat: 0, carbs: 0 };
  for (const input of recipe.inputs) {
    assert(Number.isFinite(input.grams) && input.grams > 0, "ingredient raw grams missing");
    assert.equal(input.unit, "g", "all scoped raw amounts must use grams");
    assert(input.source?.per100g, `missing per100g source for ${recipe.recipeId}: ${input.item}`);
    for (const [key, sourceKey] of [
      ["protein", "protein"], ["fat", "fat"], ["carbs", "availableCarbohydrates"],
    ] as const) {
      const value = input.source.per100g[sourceKey];
      assert(typeof value === "number" && Number.isFinite(value) && value >= 0,
        `missing/invalid ${sourceKey} for ${input.item}`);
      result[key] += input.grams * value / 100 / recipe.servings;
    }
  }
  return result;
}

test("first three raw-input nutrition scenarios reproduce source mapping without silent zero imputation", async () => {
  const sourceMap = JSON.parse(await readFile(sourceMapPath, "utf8")) as SourceMap;
  assert.equal(sourceMap.evidenceType, "NONPUBLISHABLE_RECIPE_NUTRITION_TRIAGE");
  assert.equal(sourceMap.publicationStatus, "DRAFT_ONLY_HOLD");

  for (const id of firstThree) {
    const mapped = sourceMap.recipes.find((x) => x.recipeId === id);
    assert(mapped, `missing ${id} in source map`);
    assert.equal(mapped.status, "HOLD", `${id} must remain on nutrition HOLD`);
    assert(mapped.inputs.some((x) => x.sourceMatch === "proxy"),
      `${id}: do not silently promote unresolved source match`);

    const markdown = await readFile(path.join(repoRoot, "tuonti/karnivore/paaruoat", `${id}.md`), "utf8");
    const parsed = parseMarkdown(markdown);
    assert(parsed, `missing markdown frontmatter: ${id}`);
    const recipe = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(recipe.status, "draft");
    assert.equal(recipe.servings, mapped.servings);
    assert.deepEqual(recipe.ingredients.map((x) => [x.item, x.amount, x.unit]),
      mapped.inputs.map((x) => [x.item, x.grams, x.unit]),
      `${id}: source mapping differs from recipe ingredients or amounts`);
    for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
      assert.equal(recipe[key], undefined, `${id}: unapproved macro published`);
    }

    const computed = rawPerServing(mapped);
    const locked = lockedRawScenarios[id];
    for (const key of ["protein", "fat", "carbs"] as const) {
      assert(Math.abs(computed[key] - locked[key]) < 0.0001,
        `${id}: ${key} scenario changed; recalculate and review before accepting`);
    }
    assert(Math.abs(computed.carbs - mapped.modelledCarbohydratePerServingFromMappedInputsG!) < 0.0001,
      `${id}: source-map carbohydrate differs from computed raw scenario`);
  }
});

test("source gaps cannot become zero during raw-input scenario calculations", () => {
  const example: MappedRecipe = {
    recipeId: "fixture", servings: 2, status: "HOLD",
    inputs: [{ item: "unmatched fish", grams: 100, unit: "g", sourceMatch: "proxy",
      source: { per100g: { protein: 20, fat: 10 } } }],
  };
  assert.throws(() => rawPerServing(example), /missing\/invalid availableCarbohydrates/);
  example.inputs[0].source = undefined;
  assert.throws(() => rawPerServing(example), /missing per100g source/);
});
