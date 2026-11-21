import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { reviewedRecipeCopy, applyCopyEdits } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const id = "som-tam-vhh-kurkkuna";
const sources = {
  fi: ["reseptit/alkuruoat/som-tam-vhh-kurkkuna.md", "7970074d99e33b3d1e7dee5f45ac838e07605293", "Valmistus"],
  en: ["kaannokset/en/alkuruoat/som-tam-vhh-kurkkuna.md", "4507e1f7af670bfc329feb6544d7ae3daf6c1c0a", "Instructions"],
  sv: ["kaannokset/sv/alkuruoat/som-tam-vhh-kurkkuna.md", "4e66a7f45579f9d9cfb92615a58839bd4e96dd72", "Tillagning"],
  th: ["kaannokset/th/alkuruoat/som-tam-vhh-kurkkuna.md", "ed31818ae17b9fa8aa719b58e1ceb296bc337b0b", "วิธีทำ"],
} as const;
const checks = {
  fi: [/500 g/, /150 g/, /100 g/, /älä käytä papuja raakoina/, /30 g/, /15 g/, /4 g Foodin/, /neljään annokseen/],
  en: [/500 g/, /150 g/, /100 g/, /do not use raw beans/, /30 g/, /15 g/, /4 g Foodin/, /four servings/],
  sv: [/500 g/, /150 g/, /100 g/, /använd inte råa bönor/, /30 g/, /15 g/, /4 g Foodin/, /fyra portioner/],
  th: [/500 กรัม/, /150 กรัม/, /100 กรัม/, /ห้ามใช้ถั่วแขกดิบ/, /30 กรัม/, /15 กรัม/, /Foodin 4 กรัม/, /4 ที่/],
} as const;
const descriptions = {
  fi: /Kurkkusuikaleet, tomaatti/,
  en: /Cucumber, tomato/,
  sv: /Gurka, tomat/,
  th: /ส้มตำแตงกวาใส่มะเขือเทศ/,
} as const;
const generic = /Punnitse luetellut syötävät raaka-aineet grammoina|Weigh all listed edible ingredients|Väg alla angivna ätliga ingredienser|ชั่งวัตถุดิบส่วนที่กินได้ทั้งหมดตามรายการ/;

function blobSha(text: string) {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0" + text).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 cucumber som tam: public method keeps sealed source quantities (" + locale + ")", () => {
    const [file, expectedSha, heading] = sources[locale];
    const original = readFileSync(path.join(root, file), "utf8");
    assert.equal(blobSha(original), expectedSha, "historical source SHA drift");
    const parsed = parseMarkdown(original);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.status, "published");
    assert.equal(source.language, locale);
    assert.equal(source.recipe_id, id);
    assert.equal(source.servings, 4);

    const recipes = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(recipes.length, 1);
    const displayed = recipes[0];
    assert.equal(displayed.servings, source.servings);
    assert.equal(displayed.timeTotalMin, source.time_total_min);
    assert.equal(displayed.instructionsText.length, 4);
    const instructions = displayed.instructionsText.join("\n");
    assert.doesNotMatch(instructions, generic, "generic step still present");
    for (const expected of checks[locale]) assert.match(instructions, expected);
    assert.match(displayed.description, descriptions[locale]);
    assert.equal(displayed.ingredients.length, source.ingredients.length);
    for (let i = 0; i < displayed.ingredients.length; i++) {
      assert.equal(displayed.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(displayed.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(displayed.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(displayed.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    const marker = "\n## " + heading + "\n";
    const start = parsed.content.indexOf(marker);
    assert.ok(start >= 0);
    const tail = parsed.content.slice(start + marker.length);
    const end = tail.indexOf("\n## ");
    const before = (end < 0 ? tail : tail.slice(0, end)).trim();
    const correction = reviewedRecipeCopy(id, locale)?.method;
    assert.ok(correction && correction.length === 1);
    assert.equal(correction[0][0], before, "public copy anchor must match source");
    assert.equal(applyCopyEdits(before, correction), correction[0][1]);
  });
}
