import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { calculate, type Calculation } from "../scripts/nutrition-model";
import { verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const root = path.resolve(import.meta.dirname, "../..");
const id = "kaurakeksit";
const macros = [
  "carbs_net_per_serving_g",
  "carbs_total_per_serving_g",
  "protein_per_serving_g",
  "fat_per_serving_g",
] as const;
const sources = {
  fi: "reseptit/jalkiruoat/kaurakeksit.md",
  en: "kaannokset/en/jalkiruoat/kaurakeksit.md",
  sv: "kaannokset/sv/jalkiruoat/kaurakeksit.md",
  th: "kaannokset/th/jalkiruoat/kaurakeksit.md",
} as const;

function source(locale: keyof typeof sources) {
  const raw = readFileSync(path.join(root, sources[locale]), "utf8");
  const parsed = parseMarkdown(raw);
  assert.ok(parsed, sources[locale]);
  return recipeFrontmatterSchema.parse(parsed.data);
}
function calculation(): Calculation {
  return JSON.parse(readFileSync(
    path.join(root, "docs/nutrition/calculations/kaurakeksit.json"), "utf8",
  )) as Calculation;
}

test("#652: four published oat-crisp languages must not publish an incomplete macro package", () => {
  for (const locale of Object.keys(sources) as Array<keyof typeof sources>) {
    const recipe = source(locale);
    assert.equal(recipe.recipe_id, id);
    assert.equal(recipe.language, locale);
    assert.equal(recipe.status, "published");
    assert.equal(recipe.servings, 30);
    for (const key of macros) assert.equal(recipe[key] ?? null, null, locale + ": " + key);
  }
});

test("#652: oats and baking powder retain unknown POLYL under the exact source evidence", () => {
  const evidence = calculation();
  assert.equal(evidence.recipeId, id);
  assert.equal(evidence.servings, 30);
  assert.equal(evidence.reviewerStatus, "AUTOMATED ONLY");
  assert.equal(evidence.publicationStatus, "WITHHELD_SOURCE_INCOMPLETE");
  assert.match(evidence.withholdingReason ?? "", /polyol/i);
  assert.equal(evidence.ingredients.length, 7);

  const oats = evidence.ingredients.find(x => x.record?.id === "fineli-153-release-20");
  assert.ok(oats);
  assert.equal(oats.amount, 140);
  assert.equal(oats.unit, "g");
  assert.equal(oats.record?.componentValues?.POLYL, null);
  assert.equal(oats.record?.per100g.polyols, null);
  assert.equal(oats.record?.polyolsSourceVerified, false);

  const baking = evidence.ingredients.find(x => x.record?.id === "fineli-74-2026-10-25");
  assert.ok(baking);
  assert.equal(baking.amount, 1);
  assert.equal(baking.unit, "tl", "FI recipe lists one teaspoon, not a weighed ingredient");
  assert.equal(baking.gramsPerUnit, 5, "a documented conversion assumption, not a weighed batch yield");
  assert.equal(baking.record?.per100g.polyols, null);
  assert.equal(baking.record?.polyolsSourceVerified, false);

  const calculated = calculate(evidence);
  assert.equal(calculated.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(calculated.total.netCarbohydrate, null);
});

test("#652: current FI nutrition evidence and translations preserve the HOLD gate", () => {
  const fi = source("fi");
  const evidence = calculation();
  const languages = (["en", "sv", "th"] as const).map(locale => ({
    path: sources[locale], data: source(locale),
  }));
  const result = verifyNutritionEvidence(fi, evidence, languages);
  assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
  assert.deepEqual(result.errors, []);
  assert.ok(macros.every(key => result.values[key] === null));
  assert.match(evidence.withholdingReason ?? "", /source|composition|Fineli|polyol/i);

  // A plausible partial carbohydrate sum is NOT an approved public value.
  const unsafe = { ...fi, carbs_net_per_serving_g: 8.94 };
  assert.equal(verifyNutritionEvidence(unsafe, evidence, languages).status, "CONFLICT REQUIRES REVIEW");
  const unsafeTranslation = languages.map((entry, index) => index === 0
    ? { ...entry, data: { ...entry.data, protein_per_serving_g: 1.14 } }
    : entry);
  assert.equal(verifyNutritionEvidence(fi, evidence, unsafeTranslation).status, "CONFLICT REQUIRES REVIEW");
});
