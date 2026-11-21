import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "rapeat-juustonaksut";
const sourcePath = "reseptit/valipalat/rapeat-juustonaksut.md";
const sourceBlobSha = "af69aab954bf3ed06e3eb5294d51954679a940ef";
const locales = ["en", "sv", "th"] as const;
const expectedMethods = {
  en: [/200 °C/, /12 equal/, /6–9 minutes/, /at least 5 minutes/, /three crisps per portion/i],
  sv: [/200 °C/, /12 lika/, /6–9 minuter/, /minst 5 minuter/, /tre flarn per portion/i],
  th: [/200 °C/, /12 กอง/, /6–9 นาที/, /อย่างน้อย 5 นาที/, /3 แผ่นต่อหนึ่งที่/],
} as const;
const expectedNotes = {
  en: [/Contains milk/i, /0\.04 g per portion/, /0\.25 g of the paprika/, /polyol/i, /No numerical glycaemic load/, /illustration/i],
  sv: [/Innehåller mjölk/, /0,04 g per portion/, /0,25 g paprikapulver/, /polyol/i, /Inget numeriskt glykemiskt/, /illustration/i],
  th: [/มีนมเป็นสารก่อภูมิแพ้/, /0\.04 กรัมต่อหนึ่งที่/, /0\.25 กรัม/, /โพลิออล/, /ยังไม่ได้กำหนดค่าภาระน้ำตาล/, /ภาพประกอบ/],
} as const;

const sourceBlob = (s: string) => createHash("sha1")
  .update("blob " + Buffer.byteLength(s, "utf8") + "\0")
  .update(s, "utf8")
  .digest("hex");

test("juustonaksut translations: three source-pinned draft files preserve every numeric FI recipe input", async () => {
  const source = await readFile(path.join(root, sourcePath), "utf8");
  assert.equal(sourceBlob(source), sourceBlobSha, "FI recipe source changed; renew translation review");
  const parsedSource = parseMarkdown(source);
  assert.ok(parsedSource);
  const fi = recipeFrontmatterSchema.parse(parsedSource.data);
  assert.equal(fi.status, "published");
  assert.equal(fi.servings, 4);
  assert.deepEqual(fi.ingredients.map(({amount,unit}) => [amount,unit]), [[140,"g"],[1,"g"]]);

  const index = JSON.parse(await readFile(path.join(root,
    "meta/kaannokset/published-translation-pairs.json"), "utf8")) as {
      sources: Array<{recipe_id: string; locales: string[]}>;
    };
  assert.equal(index.sources.some(x => x.recipe_id === recipeId), false,
    "draft translations must not be promoted by a sidecar");

  for (const locale of locales) {
    const file = await readFile(path.join(root,
      "kaannokset", locale, "valipalat", recipeId + ".md"), "utf8");
    const parsed = parseMarkdown(file);
    assert.ok(parsed, locale);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(data.status, "draft", locale);
    assert.equal(data.recipe_id, fi.recipe_id);
    assert.equal(data.url_slug, fi.url_slug);
    assert.equal(data.category, "valipala");
    assert.equal(data.language, locale);
    assert.equal(data.source_language, "fi");
    assert.equal(data.translation_of, recipeId);
    assert.equal(data.source_recipe, sourcePath);
    assert.equal(data.servings, fi.servings);
    assert.equal(data.time_total_min, fi.time_total_min);
    assert.deepEqual(data.ingredients.map(({amount,unit}) => [amount,unit]),
      fi.ingredients.map(({amount,unit}) => [amount,unit]));
    assert.deepEqual([
      data.carbs_net_per_serving_g, data.carbs_total_per_serving_g,
      data.protein_per_serving_g, data.fat_per_serving_g,
    ], [
      fi.carbs_net_per_serving_g, fi.carbs_total_per_serving_g,
      fi.protein_per_serving_g, fi.fat_per_serving_g,
    ]);
    assert.equal(data.image?.src, fi.image?.src);
    assert.equal(data.image?.width, fi.image?.width);
    assert.equal(data.image?.height, fi.image?.height);
    assert.ok(data.image?.alt, locale);
    assert.equal(data.ingredients.length, 2);
    assert.ok(data.ingredients[0].item.length > 8 && data.ingredients[1].item.length > 8);
    assert.ok(data.title.length > 4);
    assert.equal(siteContent.recipes.some(x => x.recipeId === recipeId && x.locale === locale),
      false, locale + " was accidentally published");
    for (const re of expectedMethods[locale]) assert.match(parsed.content, re, locale);
    for (const re of expectedNotes[locale]) assert.match(parsed.content, re, locale);
  }
});
