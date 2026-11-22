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
const recipeId = "thai-porsasjok";
const sources = {
  fi: ["reseptit/aamupalat/thai-porsasjok.md", "7a59279acd49a5e664dc3f2396fe1f208c373ead"],
  en: ["kaannokset/en/aamupalat/thai-porsasjok.md", "969ce8c48d951c44c367da8d54d1518d50aeeff1"],
  sv: ["kaannokset/sv/aamupalat/thai-porsasjok.md", "00b909501222158b4c75292047f90f3994b2aac1"],
  th: ["kaannokset/th/aamupalat/thai-porsasjok.md", "3f38bbac376698d3278f6671d54584be354dc0ec"],
} as const;

function gitBlob(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 pork jok: FI cooking safety and four immutable sources (" + locale + ")", () => {
    const [relative, sha] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlob(raw), sha, locale + " protected source has changed");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 60);
    const projected = siteContent.recipes.filter(r => r.recipeId === recipeId && r.locale === locale);
    assert.equal(projected.length, 1);
    const visible = projected[0];
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, source.time_total_min);
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let index = 0; index < source.ingredients.length; index++) {
      assert.equal(visible.ingredients[index].amount, source.ingredients[index].amount);
      assert.equal(visible.ingredients[index].unit, source.ingredients[index].unit);
      assert.equal(visible.ingredients[index].item, source.ingredients[index].item);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    if (locale === "fi") {
      const edits = reviewedRecipeCopy(recipeId, locale)?.method;
      assert.equal(edits?.length, 1);
      const [before, after] = edits![0];
      assert.ok(parsed.content.includes(before), "original FI preparation must be pinned");
      assert.equal(applyCopyEdits(before, edits), after);
      const instructions = visible.instructionsText.join(" ");
      assert.match(instructions, /150 g raakaa sianjauhelihaa/);
      assert.match(instructions, /vähintään 70 °C/);
      assert.match(instructions, /elintarvikelämpömittarilla/);
      assert.match(instructions, /Keitä ainesluettelon kaksi kananmunaa/);
      assert.match(instructions, /Älä lisää paistorasvaa/);
      assert.doesNotMatch(instructions, /kunnes liha on täysin kypsää/);
    } else {
      assert.equal(reviewedRecipeCopy(recipeId, locale)?.method, undefined);
      assert.equal(visible.instructionsText.length, 4);
    }
  });
}
