import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { publicRecipeDescription } from "../scripts/public-recipe-copy";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "paprikauunimunakkaat";
const slug = "paprikauunimunakkaat";

const sources = {
  fi: ["reseptit/aamupalat/paprikauunimunakkaat.md", "a45b88711aa47d639407fa45d6c04720f4102250", /Sekoita .*3 g ruohosipulia/],
  en: ["kaannokset/en/aamupalat/paprikauunimunakkaat.md", "915236914cd5db1876653201f6c75e35d643c3ed", /Mix .*3 g of chives/],
  sv: ["kaannokset/sv/aamupalat/paprikauunimunakkaat.md", "2a904854829016e7d2985624d8d802641067fcc2", /Blanda .*3 g gräslök/],
  th: ["kaannokset/th/aamupalat/paprikauunimunakkaat.md", "f9ae87421f66ecb2c88813b5ff44d1c46415d2d6", /ผสม.*กุยช่ายฝรั่ง 3 กรัม/],
} as const;

const expected = {
  fi: "Punaiset paprikat toimivat uunissa pieninä vuokina kananmunalle ja juustolle. Ruohosipuli sekoitetaan munaseokseen.",
  en: "Red peppers act as small baking cups for the eggs and cheese. The chives are mixed into the egg mixture.",
  sv: "Röda paprikor fungerar som små formar för ägg och ost i ugnen. Gräslöken blandas i äggsmeten.",
  th: "ใช้พริกหวานแดงเป็นถ้วยอบไข่กับชีส โดยผสมกุยช่ายฝรั่งลงในส่วนผสมไข่",
} as const;

function gitBlobSha(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0" + text).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("paprikauunimunakkaat public description follows the source preparation (" + locale + ")", () => {
    const [relative, sha, firstStep] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlobSha(raw), sha, "protected source changed: " + relative);
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 30);
    const chives = source.ingredients.find(item => /ruohosipuli|chives|gräslök|กุยช่ายฝรั่ง/i.test(item.item));
    assert.ok(chives, "the source ingredient list contains chives");
    assert.equal(chives.amount, 3);
    assert.equal(chives.unit, "g");
    assert.match(parsed.content, firstStep, "the source mixes chives into the egg mixture");

    const copy = publicRecipeDescription(recipeId, slug, locale);
    assert.equal(copy, expected[locale]);
    assert.doesNotMatch(copy ?? "", /sprinkle|go on top|on top|toppa|strö|โรย/i);

    const matches = siteContent.recipes.filter(recipe => recipe.recipeId === recipeId && recipe.locale === locale);
    assert.equal(matches.length, 1, "exactly one published locale route");
    const visible = matches[0];
    assert.equal(visible.description, expected[locale]);
    assert.equal(visible.slug, source.url_slug);
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, source.time_total_min);
    assert.equal(visible.instructionsText.length, 3);
    assert.match(visible.instructionsText[0], firstStep);
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(visible.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(visible.ingredients[i].unit, source.ingredients[i].unit);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    }, "nutrition source fields remain unchanged");
  });
}
