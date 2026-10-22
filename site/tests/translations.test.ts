import assert from "node:assert/strict";
import { test } from "node:test";
import { auditTranslations, auditRecipePairs } from "../scripts/translation-audit";
import { semanticTermErrors, semanticProseErrors } from "../scripts/semantic-terms";

test("all published translations match the source structure and known critical terms", async () => {
  const result = await auditTranslations();
  const translatedSources = result.publishedSources;
  const expectedCount = translatedSources.reduce((sum, recipe) => sum +
    (["en", "sv", "th"] as const).filter((locale) => recipe.data.translation_status?.[locale] === "published").length, 0);
  assert.equal(result.publishedTranslations.length, expectedCount, "published translations declared by source metadata");
  assert.equal(result.rows.length, result.publishedTranslations.length, "one audit row per published translation");
  assert.deepEqual(result.errors, []);
  for (const recipe of translatedSources) {
    for (const locale of ["en", "sv", "th"] as const) {
      if (recipe.data.translation_status?.[locale] !== "published") continue;
      const target = result.publishedTranslations.find((entry) => entry.data.recipe_id === recipe.data.recipe_id && entry.data.language === locale);
      assert.ok(target, `${recipe.data.recipe_id} is published in ${locale}`);
      assert.equal(target.data.translation_of, recipe.data.recipe_id);
      assert.equal(target.data.servings, recipe.data.servings);
      assert.equal(target.data.image?.src, recipe.data.image?.src);
    }
  }
  const somTam = result.publishedTranslations.find((recipe) => recipe.data.recipe_id === "som-tam-vhh-kurkkuna" && recipe.data.language === "th");
  assert.ok(somTam, "som tam has a published Thai version");
  assert.equal(somTam.data.url_slug, "som-tam-taeng-kwa-vhh");
  assert.equal(somTam.data.source_recipe, "reseptit/alkuruoat/som-tam-vhh-kurkkuna.md");
  assert.equal(somTam.data.ingredients.length, 9);
});

test("metadata-driven pairs allow new sources and drafts but reject missing or duplicate published versions", async () => {
  const real = await auditTranslations();
  const source = structuredClone(real.publishedSources[0]);
  const target = structuredClone(real.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "en")!);
  source.data.translation_languages = ["en", "sv"];
  source.data.translation_status = { en: "published", sv: "draft" };
  assert.deepEqual(auditRecipePairs([source], [target]).errors, []);
  const newSource = structuredClone(source);
  newSource.data.recipe_id = "new-fixture";
  newSource.data.url_slug = "new-fixture";
  newSource.data.translation_status = { en: "draft" };
  const draft = structuredClone(target);
  draft.data.status = "draft";
  draft.data.recipe_id = "new-fixture";
  assert.deepEqual(auditRecipePairs([source, newSource], [target, draft]).errors, []);
  assert.match(auditRecipePairs([source], []).errors.join(" "), /no published file/);
  assert.match(auditRecipePairs([source], [target, target]).errors.join(" "), /duplicate published recipe locale/);
  const otherId = structuredClone(target);
  otherId.data.recipe_id = "other-id";
  assert.match(auditRecipePairs([source], [target, otherId]).errors.join(" "), /duplicate published route/);
  source.data.translation_status.en = "draft";
  assert.match(auditRecipePairs([source], [target]).errors.join(" "), /translation_status/);
});

test("pair audit detects changed servings, ingredient amounts, units and cooking method", async () => {
  const real = await auditTranslations();
  const source = structuredClone(real.publishedSources[0]);
  source.data.translation_languages = ["en"];
  source.data.translation_status = { en: "published" };
  const original = real.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "en")!;
  for (const [edit, expected] of [
    [(r: typeof original) => { r.data.servings += 1; }, /servings=/],
    [(r: typeof original) => { r.data.ingredients[0].amount = 999; }, /ingredient 1 amount=/],
    [(r: typeof original) => { r.data.ingredients[0].unit = "l"; }, /ingredient 1 unit=/],
    [(r: typeof original) => { r.data.cooking_method = ["wrong"]; }, /cooking_method=/],
  ] as const) {
    const target = structuredClone(original);
    edit(target);
    assert.match(auditRecipePairs([source], [target]).errors.join(" "), expected);
  }
});

test("V1.4 ingredient regressions distinguish species, dairy and raw ingredients", () => {
  const cases = [
    ["nakkeja", "trinkets", "frankfurters", "en"],
    ["lanttua", "avtar", "kålrot", "sv"],
    ["paksoita", "thicken", "pak choi", "en"],
    ["kardemummakotaa", "บ้านกระวาน", "ฝักกระวาน", "th"],
    ["poronkäristyslihaa", "reindeer jerky", "thinly sliced reindeer", "en"],
    ["maitorahkaa", "นมเปรี้ยว", "ควาร์กชีส", "th"],
    ["porsaan ulkofileetä", "fläskfilé", "fläskytterfilé", "sv"],
    ["broilerin paistileikettä", "ไก่ทอด", "เนื้อสะโพกไก่เลาะกระดูก", "th"],
    ["kypsiä kikherneitä", "ripe chickpeas", "cooked chickpeas", "en"],
    ["kiinalaisia vehnälettuja", "wheat dumplings", "wheat pancakes", "en"],
    ["kalafondia", "ฟองดูว์ปลา", "น้ำสต็อกปลาเข้มข้น", "th"],
    ["valutettuja konjaknuudeleita", "Brandynudlar", "konjaknudlar", "sv"],
  ] as const;
  for (const [source, bad, good, locale] of cases) {
    assert.equal(semanticTermErrors([source], [bad], locale).length, 1, source);
    assert.deepEqual(semanticTermErrors([source], [good], locale), []);
  }
  assert.deepEqual(semanticTermErrors(["tomaattia"], ["ripe tomatoes"], "en"), []);
});

test("known cooking-method and development-copy regressions remain fixed", async () => {
  const result = await auditTranslations();
  const panRecipes = ["jauhelihakastike-kesakurpitsanuudeleilla", "kanakorma-kukkakaaliriisilla", "paistettu-maksa-pekonilla", "poronkaristys-kukkakaalimuusilla"];
  for (const recipe of [...result.publishedSources, ...result.publishedTranslations]) {
    if (panRecipes.includes(recipe.data.recipe_id)) {
      assert.ok(recipe.data.cooking_method?.includes("paistinpannu"));
      assert.ok(!recipe.data.cooking_method?.includes("uuni"));
    }
    assert.doesNotMatch(recipe.content, /raakileiden raejuustopohja|tuttu suomalainen ruoka vähähiilihydraattisena kotiversiona|rewritten to suit your own kitchen/iu);
    if (recipe.data.recipe_id === "pad-thai-vhh-konjac") {
      const lastCookingStep = recipe.content.match(/^6\. (.+)$/m)?.[1] ?? "";
      assert.match(lastCookingStep, /katkaravut|prawns|räkor|กุ้ง/);
      assert.doesNotMatch(lastCookingStep, /Bake|Grädda|อบ/);
      assert.doesNotMatch(recipe.content, /กะปิ/);
    }
  }
});

test("known prose regressions are recipe-specific and cover captions", () => {
  for (const [id, locale, bad, good] of [
    ["nakkikeitto-kukkakaalilla", "en", "Slice walnuts", "Slice frankfurters"],
    ["khao-kha-moo-vhh", "en", "Add allspice", "Add Chinese five-spice"],
    ["vhh-lihamureke", "sv", "mördegskaka", "köttfärslimpa"],
    ["sichuan-hot-pot", "th", "กาต้มน้ำ", "หม้อไฟฟ้าสำหรับทำหม้อไฟ"],
    ["gulab-jamun", "en", "Kiehauta sokeri", "Bring the sugar and water to the boil"],
    ["keto-korvapuustit", "sv", "Öronproppar på ett fat", "Kanelbullar på ett fat"],
    ["vhh-pyttipannu", "en", "sausage and linguine", "sausage and swede"],
    ["xiaolongbao", "en", "steamed noodles", "steamed dumplings"],
  ] as const) {
    assert.equal(semanticProseErrors(id, locale, bad).length, 1, id);
    assert.deepEqual(semanticProseErrors(id, locale, good), []);
  }
  assert.deepEqual(semanticProseErrors("walnut-cake", "en", "walnuts"), []);
});

test("audit output distinguishes structural passes from pending human language review", async () => {
  const result = await auditTranslations();
  assert.ok(result.rows.every((row) => row.language_review.includes("independent human language review pending")));
  assert.ok(result.rows.every((row) => row.review_status.includes("HUMAN REVIEW PENDING")));
});
