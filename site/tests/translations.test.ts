import assert from "node:assert/strict";
import { test } from "node:test";
import { auditTranslations, auditRecipePairs } from "../scripts/translation-audit";
import { semanticTermErrors, semanticProseErrors, semanticNoteErrors, semanticTagErrors } from "../scripts/semantic-terms";

test("review backlog fixes stay aligned in all four recipe locales", async () => {
  const real = await auditTranslations();
  const all = [...real.publishedSources, ...real.publishedTranslations];
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const get = (id: string) => all.find(r => r.data.recipe_id === id && r.data.language === locale)!;
    const garlic = get("italian-pata").data.ingredients[5];
    assert.equal(garlic.amount, 3.5);
    assert.equal(garlic.unit, "g");
    assert.doesNotMatch(garlic.note ?? "", /1[–-]2/);
    const pizza = get("ketopizza-pofiber-pohjalla");
    assert.match(pizza.data.ingredients.at(-1)?.note ?? "", /50/);
    assert.match(pizza.content.match(/^1\. (.+)$/m)?.[1] ?? "", /enimmäislämpötilaa|maximum temperature|maxvärmen|ค่าสูงสุด/);
    assert.match(get("jauheliha-makaronilaatikko").content.match(/^1\. (.+)$/m)?.[1] ?? "", /kolmanneksella|one third|tredjedel|หนึ่งในสาม/);
    assert.match(get("jauheliha-makaronilaatikko").content.match(/^3\. (.+)$/m)?.[1] ?? "", /loppu öljy|remaining oil|resten av oljan|น้ำมันที่เหลือ/);
    assert.match(get("yum-woon-sen-vhh").content.match(/^2\. (.+)$/m)?.[1] ?? "", /neljänneksellä|one quarter|fjärdedel|หนึ่งในสี่/);
    assert.match(get("yum-woon-sen-vhh").content.match(/^4\. (.+)$/m)?.[1] ?? "", /loppu kalakastike|remaining fish sauce|resten av fisksåsen|น้ำปลาที่เหลือ/);
    assert.ok(get("pad-thai-vhh-konjac").data.ingredients.some(i => /limelohkoja|lime wedges|limeklyftor|มะนาวหั่นเสี้ยว/.test(i.item)));
    assert.equal(get("vhh-pyttipannu").data.diet_class, "vhh_valjempi");
    assert.equal(get("tom-yum-goong-vhh").data.fat_per_serving_g, 2.38);
    assert.equal(get("khao-soi-vhh-konjac").data.image?.src, "paaruoat/khao-soi-vhh-konjac-v2.webp");
    assert.match(get("khao-soi-vhh-konjac").data.image?.alt ?? "", /luuttomilla|boneless|benfria|ไม่มีกระดูก/);
  }
  const somTam = all.find(r => r.data.recipe_id === "som-tam-vhh-kurkkuna" && r.data.language === "th")!;
  assert.doesNotMatch(somTam.content + somTam.data.image?.alt, /ถั่วฝักยาว/);
  assert.match(somTam.content, /ถั่วแขก/);
  assert.ok(semanticNoteErrors(["tai juustokuminaa"], ["eller ostkummin"], "sv").length);
  assert.deepEqual(semanticNoteErrors(["tai juustokuminaa"], ["eller spiskummin"], "sv"), []);
});

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
    ["vhh-pyttipannu", "en", "lentil, Lantu, lantus and lard", "swede and courgette"],
    ["vhh-pyttipannu", "sv", "linser, Lantu, lantus och ister", "kålrot och zucchini"],
    ["vhh-pyttipannu", "th", "ถั่วเลนทิล ลันตู ลันทัส น้ำมันหมู", "รูตาบากา ซูกินี"],
    ["xiaolongbao", "en", "steamed noodles", "steamed dumplings"],
  ] as const) {
    assert.equal(semanticProseErrors(id, locale, bad).length, 1, id);
    assert.deepEqual(semanticProseErrors(id, locale, good), []);
  }
  assert.deepEqual(semanticProseErrors("walnut-cake", "en", "walnuts"), []);
  assert.deepEqual(semanticProseErrors("dal-makhani", "sv", "linser"), []);
});

test("fish-stock prose regressions include titles, descriptions, notes and image captions", async () => {
  const result = await auditTranslations();
  const source = result.publishedSources.find((r) => r.data.recipe_id === "vhh-lohikeitto-kukkakaalilla")!;
  const target = result.publishedTranslations.find((r) => r.data.recipe_id === source.data.recipe_id && r.data.language === "th")!;
  const allTargets = result.publishedTranslations.filter((r) => r.data.recipe_id === source.data.recipe_id);
  for (const bad of ["ฟองดูปลา", "ฟองดูว์ปลา", "น้ำสต๊อกข้าว", "น้ำสต็อกข้าว"]) {
    for (const field of ["title", "content", "alt"] as const) {
      const changed = structuredClone(target);
      if (field === "content") changed.content += `\n\n## หมายเหตุ\n\n${bad}`;
      if (field === "title") changed.data.title += bad;
      if (field === "alt") changed.data.image!.alt += bad;
      const audit = auditRecipePairs([source], allTargets.map((r) => r === target ? changed : r));
      assert.ok(audit.errors.some((error) => error.includes("fish stock concentrate mistranslated in Thai prose")), `${field}: ${bad}`);
    }
  }
});

test("butter chicken quantifies frying oil and preserves optional honey and cooking meaning", async () => {
  const result = await auditTranslations();
  const recipes = [...result.publishedSources, ...result.publishedTranslations];
  const expectations = {
    fi: { oil: "öljyä", optional: /halutessasi hunaja/, aside: /Nosta sivuun/, minute: /minuutti/ },
    en: { oil: "oil", optional: /honey if desired/, aside: /Set aside/, minute: /a minute/ },
    sv: { oil: "olja", optional: /honung om du vill/, aside: /Lägg åt sidan/, minute: /en minut/ },
    th: { oil: "น้ำมัน", optional: /น้ำผึ้งหากต้องการ/, aside: /ตักพักไว้/, minute: /หนึ่งนาที/ },
  };
  for (const [locale, expected] of Object.entries(expectations)) {
    const recipe = recipes.find((r) => r.data.recipe_id === "butter-chicken" && r.data.language === locale)!;
    assert.ok(recipe, locale);
    const oil = recipe.data.ingredients.filter((i) => i.item === expected.oil);
    assert.equal(oil.length, 1, `${locale}: frying oil must appear exactly once`);
    assert.equal(oil[0].amount, 15, `${locale}: frying oil amount`);
    assert.equal(oil[0].unit, "ml");
    assert.ok(oil[0].note);
    assert.match(recipe.content.match(/^2\. (.+)$/m)?.[1] ?? "", expected.aside);
    assert.match(recipe.content.match(/^3\. (.+)$/m)?.[1] ?? "", expected.minute);
    assert.match(recipe.content.match(/^5\. (.+)$/m)?.[1] ?? "", expected.optional);
    assert.equal(recipe.data.servings, 4);
    assert.equal(recipe.data.time_total_min, 60);
  }
});

test("Italian bake timing is an explicit estimate including preparation, baking and rest in all locales", async () => {
  const result = await auditTranslations();
  const recipes = [...result.publishedSources, ...result.publishedTranslations].filter((r) => r.data.recipe_id === "italian-pata");
  assert.equal(recipes.length, 4);
  const estimateWords = { fi: /Arvioitu kokonaisaika/, en: /Estimated total time/, sv: /Uppskattad totaltid/, th: /เวลารวมโดยประมาณ/ };
  for (const recipe of recipes) {
    assert.equal(recipe.data.time_total_min, 60);
    assert.match(recipe.content, estimateWords[recipe.data.language as keyof typeof estimateWords]);
    assert.match(recipe.content, /60.*25.*20.*15/);
    assert.match(recipe.content.match(/^8\. (.+)$/m)?.[1] ?? "", /20/);
    assert.match(recipe.content.match(/^9\. (.+)$/m)?.[1] ?? "", /15/);
  }
});

test("audit output distinguishes structural passes from pending human language review", async () => {
  const result = await auditTranslations();
  assert.ok(result.rows.every((row) => row.language_review.includes("independent human language review pending")));
  assert.ok(result.rows.every((row) => row.review_status.includes("HUMAN REVIEW PENDING")));
});

test("V1.4 source safety and batter corrections remain aligned in all languages", async () => {
  const result = await auditTranslations();
  const recipes = [...result.publishedSources, ...result.publishedTranslations];
  for (const locale of ["fi", "en", "sv", "th"]) {
    const get = (id: string) => recipes.find((r) => r.data.recipe_id === id && r.data.language === locale)!;
    const liver = get("paistettu-maksa-pekonilla");
    assert.match(liver.content.match(/^4\. (.+)$/m)?.[1] ?? "", /72 °C/);
    for (const id of ["masala-dosa", "idli-sambar"]) {
      const recipe = get(id);
      const water = recipe.data.ingredients.at(-1)!;
      assert.equal(water.amount, null, `${id}/${locale}: water added gradually`);
      assert.equal(water.unit, "");
      assert.ok(water.note && water.note.length > 30);
      assert.match(recipe.content.match(/^2\. (.+)$/m)?.[1] ?? "", /kaadettavaksi|pourable|häll|เทได้/);
    }
    const biryani = get("hyderabadi-kanabiryani");
    const spices = /kaneli|kardemumma|cinnamon|cardamom|kanel|อบเชย|กระวาน/i;
    assert.match(biryani.content.match(/^3\. (.+)$/m)?.[1] ?? "", spices);
    assert.doesNotMatch(biryani.content.match(/^5\. (.+)$/m)?.[1] ?? "", spices);
    assert.doesNotMatch(get("masala-dosa").content, /crispy lettu|krispig sallad|ผักกาดกรอบ/i);
  }
});

test("corrected image captions do not reintroduce absent fillings or toppings", async () => {
  const result = await auditTranslations();
  for (const recipe of [...result.publishedSources, ...result.publishedTranslations]) {
    const alt = recipe.data.image?.alt ?? "";
    if (recipe.data.recipe_id === "rahkapiirakka-vhh") assert.doesNotMatch(alt, /marj|berr|bär|เบอร์รี่/i);
    if (recipe.data.recipe_id === "vhh-runebergintortut") assert.doesNotMatch(alt, /hillo|kuorrute|icing|jam|sylt|glasyr|แยม|ไอซิ่ง/i);
    if (recipe.data.recipe_id === "vhh-lihapiirakka") assert.match(alt, /avoin|open|öppen|เปิดหน้า/i);
    if (recipe.data.recipe_id === "mapo-tofu") assert.doesNotMatch(alt, /silk|silkig|silken|ไหม/i);
  }
});

test("P2/P3 corrections include waiting time and ingredient use in every language", async () => {
  const result = await auditTranslations();
  const recipes = [...result.publishedSources, ...result.publishedTranslations];
  const times: Record<string, number> = { "pekingin-ankka": 510, gazpacho: 80, "pizza-margherita": 100, tandoorikana: 130, "char-siu": 90, "chole-bhature": 900 };
  const uses: Record<string, [number, RegExp]> = {
    "uuniporsas-kermakastikkeessa-vhh": [4, /voi|butter|smör|เนย/],
    "kai-jiew-vhh": [1, /kevätsipuli|spring onion|salladslök|ต้นหอม/],
    "sichuan-hot-pot": [5, /kevätsipuli|spring onion|salladslök|ต้นหอม/],
    "paella-valenciana": [3, /rosmariini|rosemary|rosmarin|โรสแมรี/],
  };
  for (const locale of ["fi", "en", "sv", "th"]) {
    for (const [id, time] of Object.entries(times)) {
      const recipe = recipes.find((r) => r.data.recipe_id === id && r.data.language === locale)!;
      assert.equal(recipe.data.time_total_min, time, `${id}/${locale}`);
      assert.ok(recipe.content.includes(String(time)), `visible time explanation: ${id}/${locale}`);
    }
    for (const [id, [step, ingredient]] of Object.entries(uses)) {
      const recipe = recipes.find((r) => r.data.recipe_id === id && r.data.language === locale)!;
      assert.match(recipe.content.match(new RegExp(`^${step}\\. (.+)$`, "m"))?.[1] ?? "", ingredient, `${id}/${locale}`);
    }
  }
});

test("recipes without a documented calculation make no keto or low-carb promise", async () => {
  const result = await auditTranslations();
  const ids = ["keto-joulutortut", "keto-korvapuustit"];
  const recipes = [...result.publishedSources, ...result.publishedTranslations].filter((r) => ids.includes(r.data.recipe_id));
  assert.equal(recipes.length, 8);
  for (const { data, content } of recipes) {
    assert.equal(data.diet_class, undefined, data.recipe_id);
    assert.doesNotMatch([data.title, ...data.tags, data.image?.alt, content].join(" "), /keto|คีโต|\bVHH\b|low.car[b]|lågkolhydrat|vähähiilihydraatti/i);
    assert.doesNotMatch(content, /(?:alle|less than|mindre än|น้อยกว่า)\s*5\s*(?:g|กรัม)/i);
    assert.equal(data.carbs_total_per_serving_g, undefined, "no invented nutrition number");
  }
});


test("ingredient notes and tags reject observed false friends without rejecting unrelated senses", () => {
  for (const [source, locale, bad, good] of [
    ["hienonnettuna", "en", "refined", "finely chopped"],
    ["hienonnettuna", "sv", "förfinad", "finhackad"],
    ["hienonnettuna", "th", "ขัดเกลา", "สับละเอียด"],
    ["muusiin", "en", "to muse", "for the mash"],
    ["muusiin", "sv", "att fundera", "till moset"],
    ["muusiin", "th", "รำพึง", "สำหรับส่วนผสมบด"],
    ["nahallisina ja luullisina", "en", "leathery and bony", "skin-on and bone-in"],
    ["nahattomina, viillotettuina", "th", "ไม่มีผิวหนังหั่นบาง ๆ", "ลอกหนังออกและบั้งเนื้อ"],
    ["lohkoina", "sv", "i block", "i klyftor"],
    ["halutessasi pinnalle", "en", "if you want to surface", "optional topping"],
    ["pieninä nuppuina", "en", "small buttons", "small florets"],
    ["esimerkiksi kuhaa tai turskaa", "en", "pike or cod", "zander or cod"],
    ["viipaloituna, tulisuus oman maun mukaan", "th", "หั่นเป็นชิ้นตั้งไฟตามชอบ", "หั่นเป็นแว่น ปรับความเผ็ดตามชอบ"],
  ] as const) {
    assert.equal(semanticNoteErrors([source], [bad], locale).length, 1);
    assert.deepEqual(semanticNoteErrors([source], [good], locale), []);
  }
  for (const [source, locale, bad, good] of [
    ["Isan", "en", "Dad", "Isan"], ["Isan", "sv", "Pappa", "Isan"], ["Isan", "th", "พ่อ", "อีสาน"],
    ["valimerellinen", "en", "marine", "Mediterranean"],
    ["valimerellinen", "sv", "marina", "medelhavsmat"],
    ["valimerellinen", "th", "มารีน", "เมดิเตอร์เรเนียน"],
    ["nakit", "en", "jewelry", "frankfurter sausages"],
    ["nakit", "sv", "smycke", "varmkorv"],
    ["nakit", "th", "เครื่องประดับ", "ไส้กรอกแฟรงก์เฟิร์ต"],
    ["linssi", "en", "lens", "lentils"], ["paneer", "th", "บานหน้าต่าง", "พาเนียร์"],
  ] as const) {
    assert.equal(semanticTagErrors([source], [bad], locale).length, 1);
    assert.deepEqual(semanticTagErrors([source], [good], locale), []);
    // Tags are unordered: moving either side must not hide a bad translation.
    assert.equal(semanticTagErrors(["other", source], [bad, "other"], locale).length, 1);
    assert.equal(semanticTagErrors([source, "other"], ["other", bad], locale).length, 1);
    assert.deepEqual(semanticTagErrors(["other", source], [good, "other"], locale), []);
    assert.deepEqual(semanticTagErrors(["other"], [bad, "other"], locale), []);
  }
  assert.deepEqual(semanticNoteErrors(["puhdistettua öljyä"], ["refined oil"], "en"), []);
  assert.deepEqual(semanticTagErrors(["merenelävät"], ["marine"], "en"), []);
  for (const source of [["valimerellinen", "merenelävät"], ["merenelävät", "valimerellinen"]]) {
    for (const target of [["Mediterranean", "marine"], ["marine", "Mediterranean"]]) {
      assert.deepEqual(semanticTagErrors(source, target, "en"), []);
    }
  }
  assert.equal(semanticTagErrors(["valimerellinen", "kala"], ["fish", "marine"], "en").length, 1);
  assert.equal(semanticTagErrors(["valimerellinen", "merenelävät", "nakit"], ["marine", "jewelry", "Mediterranean"], "en").length, 1);
  assert.deepEqual(semanticNoteErrors(["esimerkiksi kuhaa tai turskaa"], ["pikeperch or cod"], "en"), []);
  assert.deepEqual(semanticNoteErrors(["esimerkiksi kuhaa tai turskaa"], ["pike-perch or cod"], "en"), []);
});

test("translation audit checks notes and tags as well as prose negation and cooking meaning", async () => {
  const result = await auditTranslations();
  for (const [id, locale, field, bad, message] of [
    ["lihapullat-kermakastikkeessa-vhh", "en", "note", "to muse", "ingredient note"],
    ["nakkikeitto-kukkakaalilla", "sv", "tag", "smycke", "tag"],
    ["keto-kauralesesampylat", "th", "content", "รำข้าวโอ๊ตไม่มีคาร์โบไฮเดรต", "carbohydrate warning negated"],
    ["char-siu", "th", "content", "โหระพา", "five-spice mistranslated"],
    ["rogan-josh", "en", "content", "does not run", "curdling mistranslated"],
    ["tunisialainen-brik", "th", "content", "น้ำมูก", "runny egg or frying"],
    ["bouillabaisse", "th", "content", "ยี่หร่า", "fennel mistranslated"],
  ] as const) {
    const source = result.publishedSources.find((r) => r.data.recipe_id === id)!;
    const targets = result.publishedTranslations.filter((r) => r.data.recipe_id === id);
    const target = structuredClone(targets.find((r) => r.data.language === locale)!);
    if (field === "content") target.content += `\n${bad}`;
    if (field === "note") {
      const index = source.data.ingredients.findIndex((i) => i.note === "muusiin");
      assert.notEqual(index, -1);
      target.data.ingredients[index].note = bad;
    }
    if (field === "tag") {
      const index = source.data.tags.indexOf("nakit");
      assert.notEqual(index, -1);
      target.data.tags[index] = bad;
      target.data.tags.unshift(target.data.tags.pop()!);
      assert.notEqual(target.data.tags.indexOf(bad), index);
    }
    const audit = auditRecipePairs([source], targets.map((r) => r.data.language === locale ? target : r));
    assert.ok(audit.errors.some((error) => error.includes(message)), `${id}/${locale}/${field}`);
  }
  const buns = result.publishedTranslations.find((r) => r.data.recipe_id === "keto-kauralesesampylat" && r.data.language === "th")!;
  assert.match(buns.content, /รำข้าวโอ๊ตมีคาร์โบไฮเดรต/);
  assert.doesNotMatch(buns.content, /รำข้าวโอ๊ตไม่มีคาร์โบไฮเดรต/);
});
