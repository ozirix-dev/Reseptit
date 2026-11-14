import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { breakfastFiQualityPaths, projectBreakfastFiQualityDisplay } from "../scripts/fi-breakfast-quality-display";
import { isPublicRecipeQuarantined } from "../scripts/public-recipe-quarantine";

const root = path.resolve(import.meta.dirname, "../..");
const sha = (raw: string) => createHash("sha256").update(raw.replaceAll("\r\n", "\n")).digest("hex");
const expected: Record<string,string> = {
  "thai-roti-munalla-banaanilla": "01b5f49344afa698e599aa1ae8672649a18182892227ae5aa8d49b07e582c0ba",
  "meksikolainen-chilaquiles-verdes": "84d2801095a02bb3c9a7d98b4c937653798ee84706fe032cf886365bd4ae4160",
  "meksikolainen-paputostada-aamupalaksi": "57e8193e7457a63d270b53386c030f2b905225b851e93c7c86941aa9e27aba5b",
  "indonesialainen-nasi-goreng-aamiaisriisi": "f55e64e3d2dd6080a7cbcde3b067cac696aaf8a5595b67a5615433d7a43689d7",
  "korealainen-kimchi-jeon-aamiaiseksi": "b7187bbba5e0e8f9632fd3e3885ddd2dd8716c27e93912836bf92eeea9fff3ef",

  "intialainen-pinaatti-paneer-chilla": "c4c77740d96d341f6530dc32275426bbf5fd6ed971dcad69d7f7d4e8de46fcd2",
  "uunimuna-avokadot": "7f93c5780c639a828a97932134f1568c265ba3f750c81fd62ee96d08e23d4b41",
  "intialainen-besan-chilla": "287c9e88b59c37d1ce84bb0c9021b5bc328a285dfba85a8cbba5f8d45e887010",
  "thai-kananmunat-kookoscurryssa": "1d127dee1a5b1e82c2cbbb7d71e41aac62e4d86266074d27d867197aa9e0ae83",

  "karibia-mango-limejogurtti": "91fcf9425bb58e499304414a99665cc01ba7c37a1a72115262d31e04b5c93a0f",
  "lahi-ita-pistaasijogurtti": "f9a1d41f86c92902bbda7c9f224cbc8de48900ec7726625a482f1ecea794a9e1",
  "vietnamilainen-kahvijogurtti-banaanilla": "73b5dbb717f3833c8354f1fcdfa0fdd86ca78a342d50625881133e44b3aba0e3",
  "valimerellinen-jogurttikulho-hunajalla": "d3b3fa89bf9fe3a4b04e70d3a0d0f8f4fbd957dec2a57cd786cbe8a0af00e0bb",
  "kiinalainen-soijamaito-aamiaisella": "e28b598683b1a561384eb300f6bd08d0a7603a8c2b7dc922b19ce569a51067cf",
  "korealainen-gyeranbap-riisikulho": "e9ee2e939778d57fafd4b9015b88a7b59669638f522ae7253446f531861034e8",
  "kiinalainen-teehaudutetut-munat": "bae898d991ed769ae2853f2860e1ebcd3629e292e0d5ca2901244c0377d640e1",
  "japanilainen-onigiri-lohella": "71de7695fefca8a5fe6d0d84e3343380ca06858b6cbdfdb539ff32296733cdbf",
  "yrttituorejuusto-kinkkurullat": "e5649f6b71fb0131def0f4332f1522e4c96c4e90af5abeed947df8681ec25363",
  "malesialainen-mee-goreng-aamunuudeleilla": "0fe3c4d4d2a129da4bc8fda84df1c9b96c501f1fdd5ee6be2733edc9f69e515d",
  "valimerellinen-ricotta-persikkakulho": "da520f24684e3d1dfa2ed786b4e1200605b588a413591e852b568b59d3968d5c",
  "thai-maissifritterit": "eca214c31e4a0f06a62f02e62b18f1f6ca9598cd3650cd09dd463b7f436d239a"
};
const macros = ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const;

test("SHA-pinned FI overlays correct twenty-one dishes without nutrition changes", () => {
  assert.equal(breakfastFiQualityPaths.length, 21);
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
    if (before.recipe_id === "intialainen-besan-chilla") {
      assert.equal(after.image?.src,before.image?.src);
      assert.equal(after.image?.width,before.image?.width);
      assert.equal(after.image?.height,before.image?.height);
      assert.equal(after.image?.alt,"Besan-chilla tomaatilla ja sipulilla tarjoiltuna aamiaisella");
      assert.equal(after.title,"Besan-chilla tomaatilla ja sipulilla");
      assert.doesNotMatch(afterMd.content,/tomaatti-chutneylla/);
      assert.match(afterMd.content,/125 g syötävää osaa/);
      assert.match(afterMd.content,/55 g syötävää osaa/);
    } else if (before.recipe_id === "thai-roti-munalla-banaanilla") {
      // Only the inaccurate old "roti" alt is editorially corrected; pixels and dimensions stay identical.
      assert.equal(after.image?.src, before.image?.src);
      assert.equal(after.image?.width, before.image?.width);
      assert.equal(after.image?.height, before.image?.height);
      assert.equal(after.image?.alt, "Thaityyliset kookos-banaanimunaletut tarjoiltuna aamiaisella");
      assert.equal(after.title, "Thaityyliset kookos-banaanimunaletut");
    } else assert.deepEqual(after.image, before.image);
    for(const k of macros) assert.equal(after[k],before[k]);
    if (before.recipe_id === "vietnamilainen-kahvijogurtti-banaanilla") {
      assert.match(afterMd.content,/30 g makeutettua kondensoitua maitoa/);
      assert.match(afterMd.content,/AFCD F005582/);
      assert.match(afterMd.content,/Fineli 620/);
      assert.match(afterMd.content,/Fineli 11049/);
      assert.match(afterMd.content,/125 g syötävää hedelmää/);
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length,4);
      assert.equal(after.title,before.title);
    }
    if (before.recipe_id === "thai-kananmunat-kookoscurryssa") {
      assert.match(afterMd.content,/Tuotetarkennus ja allergeenit/);
      assert.match(afterMd.content,/sisältää katkaraputahnaa eli äyriäisallergeenin/);
      assert.match(afterMd.content,/hiilihydraattia 24,2 g, proteiinia 6,1 g ja rasvaa 1,6 g/);
      assert.doesNotMatch(beforeMd.content,/katkaraputahnaa eli äyriäisallergeenin/);
    }
    if (new Set(["thai-roti-munalla-banaanilla","meksikolainen-chilaquiles-verdes","meksikolainen-paputostada-aamupalaksi","indonesialainen-nasi-goreng-aamiaisriisi","korealainen-kimchi-jeon-aamiaiseksi"]).has(before.recipe_id)) {
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.notEqual(afterMd.content, beforeMd.content);
      assert.doesNotMatch(afterMd.content.split("## Valmistus")[1] ?? "",/Valmistele ainekset: paloittele kasvikset|Sekoita jauhot tai viljat ja muut kuivat ainekset|Raasta, muussaa tai hienonna pääraaka-aine|hunajavoilla/);
    } else if (new Set(["intialainen-pinaatti-paneer-chilla","uunimuna-avokadot","intialainen-besan-chilla","thai-kananmunat-kookoscurryssa"]).has(before.recipe_id)) {
      const wantSteps = ["intialainen-pinaatti-paneer-chilla","uunimuna-avokadot"].includes(before.recipe_id) ? 5 : 4;
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, wantSteps);
      assert.notEqual(afterMd.content, beforeMd.content);
      assert.doesNotMatch(afterMd.content,/Valmistele ainekset: paloittele kasvikset|Sekoita jauhot tai viljat ja muut kuivat ainekset|Kypsennä liha tai muut täytteet kypsiksi|Tarjoa halutessasi korianterichutney/);
    } else if (new Set(["karibia-mango-limejogurtti","lahi-ita-pistaasijogurtti","vietnamilainen-kahvijogurtti-banaanilla","valimerellinen-jogurttikulho-hunajalla","kiinalainen-soijamaito-aamiaisella","korealainen-gyeranbap-riisikulho"]).has(before.recipe_id)) {
      assert.equal((afterMd.content.match(/^\d+\. /gm) ?? []).length, 4);
      assert.doesNotMatch(afterMd.content, /Valmistele kulhon ainekset|Paloittele tuoreet kasvikset ja valmistele yrtit|Kypsennä riisi pakkauksen ohjeen mukaan\. Paista tofu|kypsennä pavut tai liha tarvittaessa erikseen/);
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
  for (const id of ["karibia-mango-limejogurtti","lahi-ita-pistaasijogurtti","vietnamilainen-kahvijogurtti-banaanilla","valimerellinen-jogurttikulho-hunajalla","kiinalainen-soijamaito-aamiaisella","korealainen-gyeranbap-riisikulho"]) {
    const recipe = recipes.get(id);
    assert.ok(recipe, "FI generated missing: " + id);
    assert.equal(recipe.servings, 2);
    const fullText = recipe.instructionsText.join(" ");
    assert.doesNotMatch(fullText, /Valmistele kulhon ainekset|Paloittele tuoreet kasvikset ja valmistele yrtit|Kypsennä riisi pakkauksen ohjeen mukaan\. Paista tofu|kypsennä pavut tai liha tarvittaessa erikseen/);
  }
  for(const id of ["intialainen-pinaatti-paneer-chilla","uunimuna-avokadot","intialainen-besan-chilla","thai-kananmunat-kookoscurryssa"]) {
    const rec = recipes.get(id);
    assert.ok(rec, "Missing corrected FI recipe: "+id);
    assert.doesNotMatch(rec.instructionsText.join(" "),/Sekoita jauhot tai viljat ja muut kuivat ainekset|Kypsennä liha tai muut täytteet kypsiksi|Valmistele ainekset: paloittele kasvikset/);
  }
  for(const id of ["thai-roti-munalla-banaanilla","meksikolainen-chilaquiles-verdes","meksikolainen-paputostada-aamupalaksi","indonesialainen-nasi-goreng-aamiaisriisi","korealainen-kimchi-jeon-aamiaiseksi"]) {
    const rec=recipes.get(id);
    if (isPublicRecipeQuarantined(id)) {
      assert.equal(rec, undefined, id + ": sealed source still has overlay but is not a public recipe");
      continue;
    }
    assert.ok(rec,"Missing corrected FI recipe: "+id);
    assert.doesNotMatch(rec.instructionsText.join(" "),/Sekoita jauhot tai viljat ja muut kuivat ainekset|Raasta, muussaa tai hienonna pääraaka-aine|Valmistele ainekset: paloittele kasvikset/);
  }
  const rahka = recipes.get("rahka-marjakerroskulho");
  assert.ok(rahka);
  assert.equal(rahka.servings, 4);
  assert.equal(rahka.instructionsText.length, 3);
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

test("F25 unsweetened rosewater keeps FI source and nutrition sealed", () => {
  const relative = "reseptit/aamupalat/lahi-ita-pistaasijogurtti.md";
  const raw = readFileSync(path.join(root, relative), "utf8");
  const before = parseMarkdown(raw);
  const after = parseMarkdown(projectBreakfastFiQualityDisplay(relative, raw));
  assert.ok(before && after);
  assert.deepEqual(after.data.ingredients, before.data.ingredients);
  for (const key of macros) assert.equal(after.data[key], before.data[key], key);
  assert.match(after.content, /3,9 % jogurttia/);
  assert.match(after.content, /5 ml makeuttamatonta elintarvikekäyttöön tarkoitettua ruusuvettä/);
  assert.match(after.content, /Al Wadi Rose Water, ei ruusisiirappia/);
});

test("F25 doujiang and Thai coconut-pancake public corrections preserve source nutrition and all ingredient masses", () => {
  const targets = [
    ["kiinalainen-soijamaito-aamiaisella", /Lee Kum Kee Rice Vinegar/, /Sisältää soijaa ja seesamia/],
    ["thai-roti-munalla-banaanilla", /Thaityyliset kookos-banaanimunaletut/, /125 g syötävää osaa/],
  ] as const;
  for (const [id, titleOrIngredient, prep] of targets) {
    const relative = "reseptit/aamupalat/" + id + ".md";
    const raw = readFileSync(path.join(root, relative), "utf8");
    const original = parseMarkdown(raw), shown = parseMarkdown(projectBreakfastFiQualityDisplay(relative, raw));
    assert.ok(original && shown);
    assert.deepEqual(shown.data.ingredients, original.data.ingredients);
    assert.equal(shown.data.servings, original.data.servings);
    for (const macro of macros) assert.equal(shown.data[macro], original.data[macro]);
    assert.match(JSON.stringify(shown), titleOrIngredient);
    assert.match(shown.content, prep);
  }
});
