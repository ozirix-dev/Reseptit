import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const recipeIds = [
  "suolasienisalaatti-sipulilla",
  "lasimestarin-silli",
  "graavisiika-tillilla",
  "uunissa-paistetut-silakkarullat",
  "muikunmati-rieskarullat",
  "savupororullat-kantarelleilla",
  "pienet-kantarellipiiraat",
  "punajuuricarpaccio-vuohenjuustolla",
  "sillikaviaari-ruisnapeilla",
  "nokkosletut-puolukoilla",
] as const;

const languageSections = {
  fi: "Valmistus",
  en: "Instructions",
  sv: "Tillagning",
  th: "วิธีทำ",
} as const;

function loadRecipe(id: string, locale: keyof typeof languageSections) {
  const relative = locale === "fi"
    ? `reseptit/alkuruoat/${id}.md`
    : `kaannokset/${locale}/alkuruoat/${id}.md`;
  const raw = readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const recipe = parseMarkdown(raw);
  assert.ok(recipe, `${relative}: parsed Markdown`);
  const section = languageSections[locale];
  const body = raw.split(`## ${section}\n\n`)[1];
  assert.ok(body, `${relative}: method section`);
  const stepCount = (body.match(/^\d+\. /gm) ?? []).length;
  assert.ok(stepCount >= 4, `${relative}: meaningful steps`);
  return { data: recipeFrontmatterSchema.parse(recipe.data), raw, stepCount };
}

test("Chat-4 starters remain ten distinct FI Drafts and thirty aligned translation Drafts", () => {
  assert.equal(new Set(recipeIds).size, 10);
  for (const id of recipeIds) {
    const fi = loadRecipe(id, "fi");
    assert.equal(fi.data.recipe_id, id);
    assert.equal(fi.data.language, "fi");
    assert.equal(fi.data.status, "draft");
    assert.deepEqual(fi.data.translation_languages, ["en", "sv", "th"]);
    for (const locale of ["en", "sv", "th"] as const) {
      assert.equal(fi.data.translation_status?.[locale], "draft");
      const tr = loadRecipe(id, locale);
      assert.equal(tr.data.recipe_id, id);
      assert.equal(tr.data.language, locale);
      assert.equal(tr.data.status, "draft");
      assert.equal(tr.data.translation_of, id);
      assert.equal(tr.data.source_recipe, `reseptit/alkuruoat/${id}.md`);
      assert.equal(tr.data.servings, fi.data.servings);
      assert.equal(tr.data.time_total_min, fi.data.time_total_min);
      assert.deepEqual(tr.data.ingredients.map(i => [i.amount, i.unit]), fi.data.ingredients.map(i => [i.amount, i.unit]));
      assert.equal(tr.stepCount, fi.stepCount);
    }
    assert.ok(!fi.raw.includes("Käännösten merkityskatselmointi puuttuu. Käännösten"), id);
  }
});

test("Chat-4 source-based risk fixes remain identical in all four languages", () => {
  const claims = [
    {
      id: "uunissa-paistetut-silakkarullat",
      total: 65,
      patterns: [/200 asteeseen[\s\S]+35–40 minuuttia/, /200 °C[\s\S]+35–40 minutes/, /200 °C[\s\S]+35–40 minuter/, /200°C[\s\S]+35–40 นาที/],
    },
    {
      id: "nokkosletut-puolukoilla",
      total: 65,
      patterns: [/30 minuuttia/, /30 minutes/, /30 minuter/, /30 นาที/],
    },
    {
      id: "pienet-kantarellipiiraat",
      total: 75,
      patterns: [/18–22 minuuttia/, /18–22 minutes/, /18–22 minuter/, /18–22 นาที/],
    },
  ] as const;
  for (const claim of claims) {
    for (const [i, locale] of (["fi", "en", "sv", "th"] as const).entries()) {
      const entry = loadRecipe(claim.id, locale);
      assert.equal(entry.data.time_total_min, claim.total, `${claim.id}/${locale}`);
      assert.match(entry.raw, claim.patterns[i]!, `${claim.id}/${locale}`);
    }
  }
});
