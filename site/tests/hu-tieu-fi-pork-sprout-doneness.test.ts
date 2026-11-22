import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const id = "vietnamilainen-hu-tieu-aamiaiskeitto";
const sources = {
  fi: ["reseptit/aamupalat/vietnamilainen-hu-tieu-aamiaiskeitto.md", "b5eca7502f5f067c345a6076117d6366007f1b70"],
  en: ["kaannokset/en/aamupalat/vietnamilainen-hu-tieu-aamiaiskeitto.md", "0c4779587b15e96bab0790c8fa96fb9ea8424489"],
  sv: ["kaannokset/sv/aamupalat/vietnamilainen-hu-tieu-aamiaiskeitto.md", "c22350d5b55784cfd7f9e275fb8eacdd05c26225"],
  th: ["kaannokset/th/aamupalat/vietnamilainen-hu-tieu-aamiaiskeitto.md", "90e960bceaef817b29856e07836f9008bcdd310f"],
} as const;
const amounts = [100, 150, 150, 6, 700, null] as const;
const nutrition = { carbsNetG: 42.08, carbsTotalG: 44.18, proteinG: 21.61, fatG: 2.02 };

function gitBlob(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 hu tieu: source, recipe amounts, serving/time and nutrition remain sealed (" + locale + ")", () => {
    const [relative, expectedBlob] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlob(raw), expectedBlob, locale + ": original recipe blob was modified");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 20);
    assert.deepEqual(source.ingredients.map(x => x.amount), [...amounts]);
    assert.equal(source.carbs_net_per_serving_g, nutrition.carbsNetG);
    assert.equal(source.carbs_total_per_serving_g, nutrition.carbsTotalG);
    assert.equal(source.protein_per_serving_g, nutrition.proteinG);
    assert.equal(source.fat_per_serving_g, nutrition.fatG);

    const matches = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(matches.length, 1);
    const publicRecipe = matches[0]!;
    assert.equal(publicRecipe.servings, 2);
    assert.equal(publicRecipe.timeTotalMin, 20);
    assert.equal(publicRecipe.ingredients.length, amounts.length);
    for (let i = 0; i < amounts.length; i++) {
      assert.equal(publicRecipe.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(publicRecipe.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(publicRecipe.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(publicRecipe.nutrition, nutrition);
    assert.equal(publicRecipe.instructionsText.length, 3);
    if (locale !== "fi") {
      assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
      return;
    }

    const edits = reviewedRecipeCopy(id, "fi")?.method;
    assert.equal(edits?.length, 1);
    const [before, after] = edits![0];
    assert.ok(parsed.content.includes(before), "old FI steps must match sealed source");
    assert.equal(applyCopyEdits(before, edits), after);
    assert.equal((before.match(/(?:^|\n)[12]\./g) ?? []).length, 2);
    assert.equal((after.match(/(?:^|\n)[12]\./g) ?? []).length, 2);
    const publicInstructions = publicRecipe.instructionsText.join("\n");
    assert.ok(!publicInstructions.includes(before), "ambiguous original FI instructions remained visible");
    assert.ok(publicInstructions.includes(after), "approved FI method overlay not applied");
    assert.match(publicInstructions, /kaikki 700 g vettä/);
    assert.match(publicInstructions, /150 g raakaa porsaan ulkofileetä/);
    assert.match(publicInstructions, /sisälämpötila .*vähintään 70 °C/);
    assert.match(publicInstructions, /Varmista lämpötila elintarvikelämpömittarilla/);
    assert.match(publicInstructions, /100 g kuivia riisinuudeleita/);
    assert.match(publicInstructions, /pakkauksen ohjeen mukaan/);
    assert.match(publicInstructions, /kaikki 150 g pavunituja/);
    assert.match(publicInstructions, /idut ovat kunnolla kuumentuneet kauttaaltaan/);
    assert.match(publicInstructions, /6 g|korianteri/);
    assert.doesNotMatch(publicInstructions, /lisäöljyä.*lisää/i);
  });
}
