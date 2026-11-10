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
  "karibia-mango-limejogurtti": "91fcf9425bb58e499304414a99665cc01ba7c37a1a72115262d31e04b5c93a0f",
  "japanilainen-hojicha-jogurtti-persimonilla": "cae50573ff18898460b95e9c674d0bc39514c7cbaaaa502d4008171b14261cfe",
  "lahi-ita-pistaasijogurtti": "f9a1d41f86c92902bbda7c9f224cbc8de48900ec7726625a482f1ecea794a9e1",
  "vietnamilainen-kahvijogurtti-banaanilla": "73b5dbb717f3833c8354f1fcdfa0fdd86ca78a342d50625881133e44b3aba0e3",
  "valimerellinen-jogurttikulho-hunajalla": "d3b3fa89bf9fe3a4b04e70d3a0d0f8f4fbd957dec2a57cd786cbe8a0af00e0bb",
  "kiinalainen-soijamaito-aamiaisella": "e28b598683b1a561384eb300f6bd08d0a7603a8c2b7dc922b19ce569a51067cf",
  "korealainen-gyeranbap-riisikulho": "e9ee2e939778d57fafd4b9015b88a7b59669638f522ae7253446f531861034e8",
  "lahi-ita-zaatar-munat": "2abaf61e4abd891bb20d3372d24fb45150566a7ff4b1750dd6db976fda0e4924",
  "kiinalainen-teehaudutetut-munat": "bae898d991ed769ae2853f2860e1ebcd3629e292e0d5ca2901244c0377d640e1",
  "japanilainen-onigiri-lohella": "71de7695fefca8a5fe6d0d84e3343380ca06858b6cbdfdb539ff32296733cdbf",
  "yrttituorejuusto-kinkkurullat": "e5649f6b71fb0131def0f4332f1522e4c96c4e90af5abeed947df8681ec25363",
  "malesialainen-mee-goreng-aamunuudeleilla": "0fe3c4d4d2a129da4bc8fda84df1c9b96c501f1fdd5ee6be2733edc9f69e515d",
  "valimerellinen-ricotta-persikkakulho": "da520f24684e3d1dfa2ed786b4e1200605b588a413591e852b568b59d3968d5c",
  "thai-maissifritterit": "eca214c31e4a0f06a62f02e62b18f1f6ca9598cd3650cd09dd463b7f436d239a"
};
const macros = ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const;

test("SHA-pinned FI overlays correct fourteen dishes without nutrition changes", () => {
  assert.equal(breakfastFiQualityPaths.length, 14);
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
    if (new Set(["karibia-mango-limejogurtti","japanilainen-hojicha-jogurtti-persimonilla","lahi-ita-pistaasijogurtti","vietnamilainen-kahvijogurtti-banaanilla","valimerellinen-jogurttikulho-hunajalla","kiinalainen-soijamaito-aamiaisella","korealainen-gyeranbap-riisikulho","lahi-ita-zaatar-munat"]).has(before.recipe_id)) {
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.doesNotMatch(afterMd.content, /Valmistele kulhon ainekset|Paloittele tuoreet kasvikset ja valmistele yrtit|Kypsennä riisi pakkauksen ohjeen mukaan\\. Paista tofu|kypsennä pavut tai liha tarvittaessa erikseen/);
      assert.notEqual(afterMd.content, beforeMd.content);
      assert.match(afterMd.content, /Jaa|jaa|annosta|annoksille|annokseen/);
    } else if (before.recipe_id === "kiinalainen-teehaudutetut-munat") {
      assert.deepEqual(before.cooking_method, ["paistaminen"]);
      assert.deepEqual(after.cooking_method, ["keittäminen"]);
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.match(afterMd.content, /kuoriin pieniä säröjä/);
      assert.match(afterMd.content, /Kuori munat vasta maustumisen jälkeen/);
      assert.doesNotMatch(afterMd.content, /Kuori ja puolita munat/);
    } else if (before.recipe_id === "japanilainen-onigiri-lohella") {
      assert.deepEqual(after.cooking_method, before.cooking_method);
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.match(afterMd.content, /100 g kuivaa valkoista riisiä/);
      assert.match(afterMd.content, /150 g raakaa lohta/);
      assert.match(afterMd.content, /5 g seesaminsiemeniä/);
      assert.doesNotMatch(afterMd.content, /Paista tofu|Paloittele tuoreet kasvikset/);
    } else if (before.recipe_id === "yrttituorejuusto-kinkkurullat") {
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

test("generated FI cards use chef-corrected instructions and the reviewed noodle facet",()=>{
  const recipes = new Map(siteContent.recipes.filter(r=>r.locale==="fi").map(r=>[r.recipeId,r]));
  for (const id of ["karibia-mango-limejogurtti","japanilainen-hojicha-jogurtti-persimonilla","lahi-ita-pistaasijogurtti","vietnamilainen-kahvijogurtti-banaanilla","valimerellinen-jogurttikulho-hunajalla","kiinalainen-soijamaito-aamiaisella","korealainen-gyeranbap-riisikulho","lahi-ita-zaatar-munat"]) {
    const recipe = recipes.get(id);
    assert.ok(recipe, "FI generated missing: " + id);
    assert.equal(recipe.servings, 2);
    const fullText = recipe.instructionsText.join(" ");
    assert.doesNotMatch(fullText, /Valmistele kulhon ainekset|Paloittele tuoreet kasvikset ja valmistele yrtit|Kypsennä riisi pakkauksen ohjeen mukaan\\. Paista tofu|kypsennä pavut tai liha tarvittaessa erikseen/);
  }
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
  const eggs = recipes.get("kiinalainen-teehaudutetut-munat");
  assert.ok(eggs);
  assert.equal(eggs.servings,2);
  assert.match(eggs.instructionsText.join(" "),/Kuori munat vasta maustumisen jälkeen/);
  assert.doesNotMatch(eggs.instructionsText.join(" "),/Kuori ja puolita munat/);
  const onigiri = recipes.get("japanilainen-onigiri-lohella");
  assert.ok(onigiri);
  assert.equal(onigiri.servings,2);
  assert.match(onigiri.instructionsText.join(" "),/150 g raakaa lohta/);
  assert.doesNotMatch(onigiri.instructionsText.join(" "),/Paista tofu/);
});
