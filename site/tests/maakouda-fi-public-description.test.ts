import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "pohjoisafrikkalainen-maakouda-punnittu-v2";
const expectedDescription =
  "Marokkolaiset maakouda-perunapihvit tehdään keitetyistä perunoista, kananmunasta ja vehnäjauhoista. " +
  "Persiljalla ja juustokuminalla maustetusta massasta muotoillaan kuusi pihviä, jotka paistetaan pannulla kullanruskeiksi.";

const sourceFiles = {
  fi: ["reseptit/aamupalat/pohjoisafrikkalainen-maakouda-punnittu-v2.md", "132b4a58a54c042e4701bbd6b0d98973de32aeab"],
  en: ["kaannokset/en/aamupalat/pohjoisafrikkalainen-maakouda-punnittu-v2.md", "4822dd2ffa23d6049098248550cbab4b617bc7a4"],
  sv: ["kaannokset/sv/aamupalat/pohjoisafrikkalainen-maakouda-punnittu-v2.md", "94ce5f6260a99ee46e66f511ff63123b55741171"],
  th: ["kaannokset/th/aamupalat/pohjoisafrikkalainen-maakouda-punnittu-v2.md", "d579fcc6a645fe180441f30cb1d6ed2714d82e80"],
} as const;

function gitBlobSha(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0" + text).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 maakouda: only the FI public intro changes (" + locale + ")", () => {
    const [relative, sha] = sourceFiles[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlobSha(raw), sha, locale + ": protected recipe source changed");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 60);
    const matching = siteContent.recipes.filter(recipe => recipe.recipeId === recipeId && recipe.locale === locale);
    assert.equal(matching.length, 1, locale + ": missing or duplicated public recipe");
    const recipe = matching[0];
    assert.equal(recipe.servings, source.servings);
    assert.equal(recipe.timeTotalMin, source.time_total_min);
    assert.equal(recipe.instructionsText.length, 4, locale + ": keep four source method steps");
    assert.equal(recipe.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(recipe.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(recipe.ingredients[i].unit, source.ingredients[i].unit);
    }
    assert.deepEqual(recipe.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    }, "the nutrition-bound source stays unchanged");

    if (locale === "fi") {
      assert.match(raw, /Tässä kotikeittiöön sovitetussa ohjeessa/);
      assert.equal(reviewedRecipeCopy(recipeId, "fi")?.description, expectedDescription);
      assert.equal(recipe.description, expectedDescription);
      assert.doesNotMatch(recipe.description, /Tässä kotikeittiöön sovitetussa/i);
      assert.match(recipe.description, /kuusi pihviä/);
      assert.match(recipe.notesHtml, /GK: ei määritetty/);
    } else {
      assert.equal(reviewedRecipeCopy(recipeId, locale)?.description, undefined);
      assert.notEqual(recipe.description, expectedDescription, "foreign locale should not show FI copy");
      assert.ok(recipe.description.length > 20, locale + ": previous translated description preserved");
    }
  });
}
