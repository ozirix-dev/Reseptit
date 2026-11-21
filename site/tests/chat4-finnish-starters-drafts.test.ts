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

function comparableUnit(unit: string): string {
  if (["tl", "tsp", "tsk", "ช้อนชา"].includes(unit)) return "tsp";
  if (["kpl", "pcs", "st", "ชิ้น", "ฟอง", "ลูก", "เม็ด", "ใบ"].includes(unit)) return "each";
  return unit;
}

const pendingFiIds = new Set(["graavisiika-tillilla", "muikunmati-rieskarullat"]);

test("Chat-4 starters keep eight published FI and two held FI drafts with thirty translation drafts", () => {
  assert.equal(new Set(recipeIds).size, 10);
  for (const id of recipeIds) {
    const fi = loadRecipe(id, "fi");
    assert.equal(fi.data.recipe_id, id);
    assert.equal(fi.data.language, "fi");
    assert.equal(fi.data.status, pendingFiIds.has(id) ? "draft" : "published");
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
      assert.deepEqual(
        tr.data.ingredients.map(i => [i.amount, comparableUnit(i.unit)]),
        fi.data.ingredients.map(i => [i.amount, comparableUnit(i.unit)]),
      );
      assert.equal(tr.stepCount, fi.stepCount);
    }
    assert.ok(!fi.raw.includes("Käännösten merkityskatselmointi puuttuu. Käännösten"), id);
  }
});

test("eight published FI starter translations use target-locale units but remain draft", () => {
  for (const id of recipeIds) {
    if (pendingFiIds.has(id)) continue;
    for (const locale of ["en", "sv", "th"] as const) {
      const tr = loadRecipe(id, locale);
      assert.equal(tr.data.status, "draft");
      assert.ok(tr.data.ingredients.every(i => i.unit !== "tl" && i.unit !== "kpl"),
        `${id}/${locale}: no Finnish teaspoon or piece abbreviations`);
      for (const item of tr.data.ingredients) {
        if (item.unit === "g" || item.unit === "ml") continue;
        assert.ok(locale === "en" ? ["tsp", "pcs"].includes(item.unit)
          : locale === "sv" ? ["tsk", "st"].includes(item.unit)
          : ["ช้อนชา", "ชิ้น", "ฟอง", "เม็ด", "ใบ"].includes(item.unit),
        `${id}/${locale}: unexpected unit ${item.unit}`);
      }
    }
  }
});

test("Thai count classifiers match the actual food item instead of generic pieces", () => {
  const expected = [
    ["lasimestarin-silli", [["เม็ดออลสไปซ์", "เม็ด"], ["ใบกระวาน", "ใบ"]]],
    ["pienet-kantarellipiiraat", [["ไข่ไก่", "ฟอง"]]],
    ["sillikaviaari-ruisnapeilla", [["ไข่ไก่", "ฟอง"]]],
    ["nokkosletut-puolukoilla", [["ไข่ไก่", "ฟอง"]]],
  ] as const;
  for (const [id, rows] of expected) {
    const tr = loadRecipe(id, "th");
    for (const [item, unit] of rows) {
      const ingredient = tr.data.ingredients.find(i => i.item === item);
      assert.ok(ingredient, `${id}: ingredient ${item}`);
      assert.equal(ingredient.unit, unit, `${id}: correct Thai classifier for ${item}`);
    }
  }
});

test("lasimestarin-silli Thai leek remains distinct from garlic shoots", () => {
  const fi = loadRecipe("lasimestarin-silli", "fi");
  const th = loadRecipe("lasimestarin-silli", "th");
  assert.ok(fi.data.ingredients.some(i => i.item === "purjosipulia"));
  assert.ok(th.data.ingredients.some(i => i.item === "กระเทียมต้น"));
  assert.ok(!th.raw.includes("ต้นกระเทียม"));
  assert.match(th.raw, /หั่นบาง ๆ พร้อมกระเทียมต้น/);
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
