import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { knownTermErrors } from "../scripts/translation-audit";
import { preparationRegressionErrors, semanticHash } from "../scripts/translation-semantic-review";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const locales = ["en", "sv", "th"] as const;
const recipes = [
  ["paaruoat", "bulgogi"],
  ["paaruoat", "bun-cha-hanoi"],
  ["paaruoat", "carnitas-salaattitacot"],
  ["paaruoat", "chili-con-carne-kukkakaaliriisi"],
  ["paaruoat", "falafel"],
  ["paaruoat", "harira"],
  ["paaruoat", "jerk-kana"],
  ["paaruoat", "kana-enchilada-kukkakaalivuoka"],
  ["paaruoat", "kana-fajita-pelti"],
  ["paaruoat", "kanakeitto-pinaatti-sitruuna"],
  ["paaruoat", "kanapyorykat-tomaattikastike"],
  ["paaruoat", "kimchi-jjigae"],
  ["paaruoat", "kreikkalainen-kanavuoka-oliiveilla"],
  ["paaruoat", "lanttulaatikko-kermainen"],
  ["paaruoat", "lindstrominpihvit-kaalilla"],
  ["paaruoat", "maksalaatikko-kukkakaalilla"],
  ["paaruoat", "shoyu-kanakeitto-konjac"],
  ["paaruoat", "silakkapihvit-tilli-kermakastike"],
  ["paaruoat", "uunikanapasta-kesakurpitsa"],
  ["jalkiruoat", "vhh-brita-kakku"],
] as const;

async function getRecipe(relativePath: string) {
  const parsed = parseMarkdown(await readFile(path.join(repoRoot, relativePath), "utf8"));
  assert.ok(parsed, "Malformed recipe Markdown: " + relativePath);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  return { data, content: parsed.content };
}

function matchingUnit(unit: string, locale: (typeof locales)[number]): string {
  if (unit === "kpl") return "";
  if (unit === "rkl") return { en: "tbsp", sv: "msk", th: "ช้อนโต๊ะ" }[locale];
  if (unit === "tl") return { en: "tsp", sv: "tsk", th: "ช้อนชา" }[locale];
  return unit;
}

function preparation(content: string): string {
  const heading = /^##\s+(?:Valmistus|Instructions|Tillagning|วิธีทำ)\s*$/m.exec(content);
  assert.ok(heading && heading.index !== undefined, "Missing preparation heading");
  const tail = content.slice(heading.index + heading[0].length);
  const next = tail.search(/^##\s/m);
  return tail.slice(0, next < 0 ? undefined : next).trim();
}

function numberTokens(text: string): number[] {
  return [...text.matchAll(/(?<![\p{L}\d])\d+(?:[.,]\d+)?/gu)].map((match) => Number(match[0].replace(",", ".")));
}

test("batch 20: all 60 unpublished locale drafts remain structurally and numerically tied to FI", async () => {
  const unique = new Set(recipes.map(([, id]) => id));
  assert.equal(recipes.length, 20);
  assert.equal(unique.size, 20);
  const ledger = JSON.parse(await readFile(path.join(repoRoot, "docs/reviews/translation-batch20-digests-2026-11-09.json"), "utf8")) as {
    human_attestation: boolean;
    recipes: Record<string, { fi: string; en: string; sv: string; th: string; review_state: string; publish_authorized: boolean }>;
  };
  assert.equal(ledger.human_attestation, false, "No human review was performed");
  assert.equal(Object.keys(ledger.recipes).length, 20, "Every recipe must have an exact fingerprint record");
  let pairs = 0;
  for (const [category, id] of recipes) {
    const fiPath = "reseptit/" + category + "/" + id + ".md";
    const source = await getRecipe(fiPath);
    assert.equal(source.data.status, "published", fiPath);
    assert.equal(source.data.language, "fi", fiPath);
    const sourceNumbers = numberTokens(preparation(source.content));
    const sourceDigest = semanticHash(source);
    const approvedSnapshot = ledger.recipes[id];
    assert.ok(approvedSnapshot, "Missing snapshot: " + id);
    assert.equal(approvedSnapshot.fi, sourceDigest, "Stale FI source fingerprint: " + id);
    assert.equal(approvedSnapshot.publish_authorized, false, "Draft snapshot must not authorize publication");
    assert.match(approvedSnapshot.review_state, /^(?:ai-compared-draft|source-hold)$/);
    const hashes: Record<string, string> = {};
    for (const locale of locales) {
      const targetPath = "kaannokset/" + locale + "/" + category + "/" + id + ".md";
      const target = await getRecipe(targetPath);
      const origin = source.data;
      const translated = target.data;
      assert.equal(translated.status, "draft", targetPath + ": not approved for release");
      assert.equal(translated.language, locale, targetPath);
      assert.equal(translated.recipe_id, origin.recipe_id, targetPath);
      assert.equal(translated.url_slug, origin.url_slug, targetPath);
      assert.equal(translated.category, origin.category, targetPath);
      assert.equal(translated.source_language, "fi", targetPath);
      assert.equal(translated.source_recipe, fiPath, targetPath);
      assert.equal(translated.translation_of, origin.recipe_id, targetPath);
      assert.equal(translated.servings, origin.servings, targetPath);
      assert.equal(translated.time_total_min, origin.time_total_min, targetPath);
      assert.equal(translated.diet_class, origin.diet_class, targetPath);
      assert.deepEqual(translated.main_ingredient, origin.main_ingredient, targetPath);
      assert.deepEqual(translated.cooking_method, origin.cooking_method, targetPath);
      for (const field of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const) {
        assert.equal(translated[field], origin[field], targetPath + ": " + field);
      }
      assert.deepEqual(
        { ...translated.image, alt: null },
        { ...origin.image, alt: null },
        targetPath + ": image paths and dimensions"
      );
      assert.equal(translated.ingredients.length, origin.ingredients.length, targetPath);
      for (let i = 0; i < origin.ingredients.length; i++) {
        const src = origin.ingredients[i]!;
        const tgt = translated.ingredients[i]!;
        assert.equal(tgt.amount, src.amount, targetPath + ": ingredient " + (i + 1) + " amount");
        assert.equal(tgt.unit, matchingUnit(src.unit, locale), targetPath + ": ingredient " + (i + 1) + " unit");
        assert.ok(tgt.item.trim().length, targetPath + ": ingredient " + (i + 1) + " name");
        assert.equal(tgt.note !== undefined, src.note !== undefined, targetPath + ": ingredient " + (i + 1) + " note presence");
      }
      assert.deepEqual(knownTermErrors(origin, translated, locale, target.content), [], targetPath + ": known translation regressions");
      assert.deepEqual(preparationRegressionErrors(target), [], targetPath + ": known preparation regressions");
      const sourceSteps = (preparation(source.content).match(/^\s*\d+[.)]\s/gm) ?? []).length;
      const targetPreparation = preparation(target.content);
      const targetSteps = (targetPreparation.match(/^\s*\d+[.)]\s/gm) ?? []).length;
      assert.equal(targetSteps, sourceSteps, targetPath + ": step count");
      const remaining = numberTokens(targetPreparation);
      for (const n of sourceNumbers) {
        const found = remaining.indexOf(n);
        assert.ok(found >= 0, targetPath + ": missing preparation numeric fact " + n);
        remaining.splice(found, 1);
      }
      hashes[locale] = semanticHash(target);
      assert.equal(approvedSnapshot[locale], hashes[locale], targetPath + ": stale translation fingerprint");
      pairs++;
    }
    // Fingerprints only; they do not attest to semantic or human review.
    console.log("DRAFT-I18N-20-HASH " + JSON.stringify({ recipe_id: id, fi: sourceDigest, ...hashes }));
  }
  assert.equal(pairs, 60);
});
