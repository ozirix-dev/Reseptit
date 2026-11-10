import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { breakfastFiQualityPaths, projectBreakfastFiQualityDisplay } from "../scripts/fi-breakfast-quality-display";

const root = path.resolve(import.meta.dirname, "../..");
const sha = (raw: string) => createHash("sha256").update(raw.replaceAll("\r\n", "\n")).digest("hex");
const expected: Record<string,string> = {
  "yrttituorejuusto-kinkkurullat": "e5649f6b71fb0131def0f4332f1522e4c96c4e90af5abeed947df8681ec25363",
  "malesialainen-mee-goreng-aamunuudeleilla": "0fe3c4d4d2a129da4bc8fda84df1c9b96c501f1fdd5ee6be2733edc9f69e515d",
  "valimerellinen-ricotta-persikkakulho": "da520f24684e3d1dfa2ed786b4e1200605b588a413591e852b568b59d3968d5c",
  "thai-maissifritterit": "eca214c31e4a0f06a62f02e62b18f1f6ca9598cd3650cd09dd463b7f436d239a"
};
const macros = ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const;

test("SHA-pinned FI overlays correct four dishes without nutrition changes", () => {
  assert.equal(breakfastFiQualityPaths.length, 4);
  for (const relative of breakfastFiQualityPaths) {
    const raw = readFileSync(path.join(root, relative), "utf8");
    const beforeMd = parseMarkdown(raw);
    const afterMd = parseMarkdown(projectBreakfastFiQualityDisplay(relative, raw));
    assert.ok(beforeMd && afterMd);
    const before = recipeFrontmatterSchema.parse(beforeMd.data);
    const after = recipeFrontmatterSchema.parse(afterMd.data);
    assert.equal(sha(raw), expected[before.recipe_id]);
    assert.equal(after.recipe_id, before.recipe_id);
    assert.equal(after.servings, before.servings);
    assert.equal(after.time_total_min, before.time_total_min);
    assert.deepEqual(after.ingredients, before.ingredients);
    assert.deepEqual(after.image, before.image);
    for(const k of macros) assert.equal(after[k],before[k]);
    if (before.recipe_id === "yrttituorejuusto-kinkkurullat") {
      assert.equal(before.servings,4);
      assert.deepEqual(before.cooking_method, ["kypsentäminen"]);
      assert.deepEqual(after.cooking_method, ["kylmävalmistus"]);
      assert.match(beforeMd.content,/kahtena annoksena/);
      assert.match(afterMd.content,/neljänä annoksena/);
      assert.doesNotMatch(afterMd.content,/kahtena annoksena/);
    } else if (before.recipe_id === "malesialainen-mee-goreng-aamunuudeleilla") {
      const calc = JSON.parse(readFileSync(path.join(root, "docs/nutrition/calculations/malesialainen-mee-goreng-aamunuudeleilla.json"),"utf8"));
      const noodles = calc.ingredients.find((item: {item: string})=>item.item==="vehnänuudeli");
      assert.equal(noodles?.state,"dry plain wheat noodles as sold");
      assert.match(noodles?.record?.name ?? "", /VEHNÄNUUDELI/);
      assert.deepEqual(before.main_ingredient?.slice(0,1),["munanuudeli"]);
      assert.deepEqual(after.main_ingredient?.slice(0,1),["vehnänuudeli"]);
      assert.deepEqual(after.main_ingredient?.slice(1),before.main_ingredient?.slice(1));
      assert.deepEqual(after.cooking_method,before.cooking_method);
    } else if (before.recipe_id === "valimerellinen-ricotta-persikkakulho") {
      assert.deepEqual(before.cooking_method, ["paistaminen"]);
      assert.deepEqual(after.cooking_method, ["kylmävalmistus"]);
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.match(afterMd.content, /15 g annosta kohti/);
      assert.match(afterMd.content, /Älä lisää öljyä/);
      assert.doesNotMatch(afterMd.content, /kypsennä pavut|Paista tofu/);
    } else if (before.recipe_id === "thai-maissifritterit") {
      assert.deepEqual(after.cooking_method,before.cooking_method);
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.match(afterMd.content, /150 g jo kypsennettyjä maissinjyviä/);
      assert.match(afterMd.content, /yhteensä luettelon 1 rkl neutraalia paistoöljyä/);
      assert.match(afterMd.content, /lime ja makea chilikastike eivät sisälly/);
      assert.doesNotMatch(afterMd.content, /lisää vettä vain sen verran/);
    } else { assert.fail("Unexpected FI display patch: " + before.recipe_id); }
    assert.throws(()=>projectBreakfastFiQualityDisplay(relative,raw+"\nUNEXPECTED EDIT"),/FI_BREAKFAST_SOURCE_STALE/);
  }
  assert.equal(projectBreakfastFiQualityDisplay("reseptit/aamupalat/unrelated.md","plain"),"plain");
});

test("generated FI cards use four servings and the reviewed noodle ingredient facet",()=>{
  const recipes = new Map(siteContent.recipes.filter(r=>r.locale==="fi").map(r=>[r.recipeId,r]));
  const ham = recipes.get("yrttituorejuusto-kinkkurullat");
  assert.ok(ham);
  assert.equal(ham.servings,4);
  assert.match(ham.instructionsText.join(" "),/neljänä annoksena/);
  const noodles = recipes.get("malesialainen-mee-goreng-aamunuudeleilla");
  assert.ok(noodles);
  assert.equal(noodles.servings,2);
  const ricotta = recipes.get("valimerellinen-ricotta-persikkakulho");
  assert.ok(ricotta);
  assert.equal(ricotta.servings,2);
  assert.match(ricotta.instructionsText.join(" "),/tarjoa kylmänä/);
  const corn = recipes.get("thai-maissifritterit");
  assert.ok(corn);
  assert.equal(corn.servings,2);
  assert.match(corn.instructionsText.join(" "),/kauttaaltaan kypsiksi/);
  assert.doesNotMatch(corn.instructionsText.join(" "),/Tarjoa limetillä/);
});
