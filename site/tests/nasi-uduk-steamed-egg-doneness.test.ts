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
const recipeId = "indonesialainen-nasi-uduk-aamiaisella";
const sources = {
  "fi": [
    "reseptit/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md",
    "901c74bd129f1d43dce9dbdbe70bb5796fd85d04"
  ],
  "en": [
    "kaannokset/en/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md",
    "0319f67ef7d747437bd8b4d518149057b649a27a"
  ],
  "sv": [
    "kaannokset/sv/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md",
    "83daee3763900f692909e788e34adbc07307a124"
  ],
  "th": [
    "kaannokset/th/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md",
    "f51189e725e40c4d6329da7ce1133424b0288ab9"
  ]
} as const;

const doneness = {
  "fi": [
    "sekä valkuainen että keltuainen ovat kauttaaltaan hyytyneet",
    "Tarkista kypsyys myös astian keskeltä",
    "ilman lisättyä rasvaa"
  ],
  "en": [
    "both egg whites and yolks are fully set throughout",
    "including the centre of the dish",
    "without added fat"
  ],
  "sv": [
    "både äggvita och äggula har stelnat helt",
    "även i mitten av formen",
    "utan tillsatt fett"
  ],
  "th": [
    "ทั้งไข่ขาวและไข่แดงสุกทั่วถึงและเซตตัว",
    "รวมถึงบริเวณกึ่งกลางภาชนะ",
    "ไม่เติมไขมัน"
  ]
} as const;

function gitBlob(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 nasi uduk: fully cooked steamed egg; sealed ingredients and macros (" + locale + ")", () => {
    const [relative, expectedSha] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlob(raw), expectedSha, locale + ": canonical source changed");
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
    const published = matches[0];
    assert.equal(published.servings, source.servings);
    assert.equal(published.timeTotalMin, source.time_total_min);
    assert.equal(published.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(published.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(published.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(published.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(published.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    assert.equal(published.instructionsText.length, 3);

    const changes = reviewedRecipeCopy(recipeId, locale);
    assert.deepEqual(Object.keys(changes ?? {}), ["method"]);
    assert.equal(changes?.method?.length, 1);
    const [oldText, newText] = changes!.method![0];
    assert.ok(parsed.content.includes(oldText), locale + ": original method step must still match");
    assert.equal(applyCopyEdits(oldText, changes!.method), newText);
    const instructions = published.instructionsText.join(" ");
    assert.ok(!instructions.includes(oldText), locale + ": old unclear egg step still visible");
    for (const phrase of doneness[locale]) {
      assert.ok(instructions.includes(phrase), locale + ": missing cooking detail: " + phrase);
    }
  });
}
