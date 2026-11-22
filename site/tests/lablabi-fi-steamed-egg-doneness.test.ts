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
const recipeId = "pohjoisafrikkalainen-lablabi";
const sources = {
  fi: ["reseptit/aamupalat/pohjoisafrikkalainen-lablabi.md", "73c8b66cf393d985426c6138fce16e5ea27c99df"],
  en: ["kaannokset/en/aamupalat/pohjoisafrikkalainen-lablabi.md", "97d80669d74d2cb83fe0d83b04534a4cf94b667d"],
  sv: ["kaannokset/sv/aamupalat/pohjoisafrikkalainen-lablabi.md", "b6b9774acc8a5c770e1f234ef5a334a5fc83ae2f"],
  th: ["kaannokset/th/aamupalat/pohjoisafrikkalainen-lablabi.md", "b7bf90049603d4a05a9f3aec9ff91522ba64ab74"],
} as const;

function gitBlob(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 lablabi: egg cooked through; source and nutrition sealed (" + locale + ")", () => {
    const [relative, sha] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlob(raw), sha, locale + ": protected recipe source has changed");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 25);

    const matches = siteContent.recipes.filter(r => r.recipeId === recipeId && r.locale === locale);
    assert.equal(matches.length, 1);
    const publicRecipe = matches[0];
    assert.equal(publicRecipe.servings, source.servings);
    assert.equal(publicRecipe.timeTotalMin, source.time_total_min);
    assert.equal(publicRecipe.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(publicRecipe.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(publicRecipe.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(publicRecipe.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(publicRecipe.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    assert.equal(publicRecipe.instructionsText.length, 3);
    if (locale === "fi") {
      const edits = reviewedRecipeCopy(recipeId, locale)?.method;
      assert.equal(edits?.length, 1);
      const [before, after] = edits![0];
      assert.ok(parsed.content.includes(before), "the original FI step must still match");
      assert.equal(applyCopyEdits(before, edits), after);
      const instructions = publicRecipe.instructionsText.join(" ");
      assert.match(instructions, /110 g kananmunaa ilman kuorta/);
      assert.match(instructions, /sekä valkuainen että keltuainen ovat kauttaaltaan hyytyneet/);
      assert.match(instructions, /tarkista kypsyys myös astian keskeltä/);
      assert.match(instructions, /ilman lisättyä rasvaa/);
      assert.doesNotMatch(instructions, /Kypsennä 110 g kuorettomana punnittua kananmunaa/);
    } else {
      assert.equal(reviewedRecipeCopy(recipeId, locale)?.method, undefined);
      const instructions = publicRecipe.instructionsText.join(" ");
      assert.match(instructions, {
        en: /Cook the egg thoroughly/,
        sv: /Tillaga ägget tills det är helt genomlagat/,
        th: /ปรุงจนไข่สุกทั่วถึง/,
      }[locale]);
    }
  });
}
