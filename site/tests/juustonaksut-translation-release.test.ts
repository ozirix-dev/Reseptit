import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";
import { loadSemanticEvidence, semanticHash, semanticStatus } from "../scripts/translation-semantic-review";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "rapeat-juustonaksut";
const sourcePath = "reseptit/valipalat/rapeat-juustonaksut.md";
const sourceBlobSha = "af69aab954bf3ed06e3eb5294d51954679a940ef";
const reference = "docs/reviews/2026-11-21-juustonaksut-final-translation-review.md";
const sourceSemanticHash = "0b57f0d1f9b437c7d6ca14e04d8d4f6772f762fd0269dd742cf4f8711d98e4ac";
const targetHashes = {
  en: "76cf3ca5267535d7214d7cf0150a6feb9b99029d31079a953b5e69412b665b87",
  sv: "eaa6c1123d8548b0892b737109e92b9e46cb50d1ed5aa69f309a1f50a32eceaa",
  th: "06fc67dbfbc7496f7f78f82d7043c758f6131ede9b2cd5f1b74268458153a70a",
} as const;
const locales = ["en", "sv", "th"] as const;
const routePrefix = { en: "/en/recipes/", sv: "/sv/recept/", th: "/th/recipes/" } as const;
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

test("juustonaksut translations: published EN/SV/TH are pinned to FI, reviewed semantically and live in generated routes", async () => {
  const source = await readFile(path.join(root, sourcePath), "utf8");
  assert.equal(sourceBlob(source), sourceBlobSha, "FI recipe changed without a new semantic review");
  const parsedSource = parseMarkdown(source);
  assert.ok(parsedSource);
  const fi = recipeFrontmatterSchema.parse(parsedSource.data);
  assert.equal(fi.status, "published");
  assert.equal(fi.servings, 4);
  assert.equal(semanticHash({ data: fi, content: parsedSource.content }), sourceSemanticHash);
  assert.deepEqual(fi.ingredients.map(({ amount, unit }) => [amount, unit]), [[140, "g"], [1, "g"]]);

  const index = JSON.parse(await readFile(path.join(root,
    "meta/kaannokset/published-translation-pairs.json"), "utf8")) as {
      sources: Array<{ recipe_id: string; locales: string[] }>;
    };
  const indexMatches = index.sources.filter(x => x.recipe_id === recipeId);
  assert.equal(indexMatches.length, 1, "published languages need one explicit index record");
  assert.deepEqual([...indexMatches[0].locales].sort(), [...locales].sort());

  const evidence = await loadSemanticEvidence(root);
  const report = await readFile(path.join(root, reference), "utf8");
  assert.match(report, /ChatGPT/);
  assert.match(report, /ei Codex-katselmointiväite/);
  for (const locale of locales) {
    const file = await readFile(path.join(root, "kaannokset", locale, "valipalat", recipeId + ".md"), "utf8");
    const parsed = parseMarkdown(file);
    assert.ok(parsed, locale);
    const data = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(data.status, "published", locale);
    assert.equal(data.recipe_id, fi.recipe_id);
    assert.equal(data.url_slug, fi.url_slug);
    assert.equal(data.category, fi.category);
    assert.equal(data.language, locale);
    assert.equal(data.source_language, "fi");
    assert.equal(data.translation_of, recipeId);
    assert.equal(data.source_recipe, sourcePath);
    assert.equal(data.servings, fi.servings);
    assert.equal(data.time_total_min, fi.time_total_min);
    assert.deepEqual(data.ingredients.map(({ amount, unit }) => [amount, unit]),
      fi.ingredients.map(({ amount, unit }) => [amount, unit]));
    for (const field of [
      "carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g",
      "fat_per_serving_g",
    ] as const) assert.equal(data[field], fi[field], field);
    assert.equal(data.image?.src, fi.image?.src);
    assert.equal(data.image?.width, fi.image?.width);
    assert.equal(data.image?.height, fi.image?.height);
    assert.ok(data.image?.alt);
    assert.equal(data.ingredients.length, 2);
    for (const re of expectedMethods[locale]) assert.match(parsed.content, re, locale);
    for (const re of expectedNotes[locale]) assert.match(parsed.content, re, locale);

    const hash = semanticHash({ data, content: parsed.content });
    assert.equal(hash, targetHashes[locale], locale + " unexpected meaning change");
    const reviewed = evidence[`${recipeId}:${locale}`];
    assert.ok(reviewed, locale + " missing SHA-bound semantic approval");
    assert.equal(reviewed.source_hash, sourceSemanticHash);
    assert.equal(reviewed.translation_hash, targetHashes[locale]);
    assert.equal(reviewed.reference, reference);
    assert.equal(reviewed.outcome, "pass");
    assert.deepEqual(reviewed.findings, []);
    assert.equal(semanticStatus(sourceSemanticHash, hash, true, reviewed), "REVIEW CURRENT");

    const publicPage = siteContent.recipes.find(r => r.recipeId === recipeId && r.locale === locale);
    assert.ok(publicPage, locale + " public route missing");
    assert.equal(publicPage.routePath, routePrefix[locale] + recipeId + "/");
    assert.equal(publicPage.servings, 4);
    assert.equal(publicPage.ingredients.length, 2);
    assert.ok(publicPage.instructionsText.length >= 4);
  }
});
