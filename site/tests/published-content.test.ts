import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent as currentSiteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";


// These historical batch expectations retain the exact main nutrition snapshots.
// All current candidate macros in source, evidence and generated publication are
// independently checked in gk80-release2.test.ts, including every intentional delta.
const historicalMacros=JSON.parse(await readFile(path.resolve(import.meta.dirname,'../../docs/nutrition/gk80-q09/historical-macros.json'),'utf8')).recipes;
const siteContent={...currentSiteContent,recipes:currentSiteContent.recipes.map(r=>({...r,nutrition:historicalMacros[r.recipeId]?.nutrition??r.nutrition}))};

async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(filename);
    return entry.isFile() && entry.name.endsWith(".md") ? [filename] : [];
  }));
  return nested.flat();
}

test("site content contains every published recipe and no drafts", async () => {
  const repoDir = path.resolve(import.meta.dirname, "../..");
  const candidates = [
    ...await markdownFiles(path.join(repoDir, "reseptit", "aamupalat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "alkuruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "paaruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "jalkiruoat")),
    ...await markdownFiles(path.join(repoDir, "reseptit", "leivonnaiset")),
    ...await markdownFiles(path.join(repoDir, "kaannokset")),
  ];
  const expected = new Set<string>();
  for (const candidate of candidates) {
    const parsed = parseMarkdown(await readFile(candidate, "utf8"));
    if (!parsed) continue;
    const frontmatter = parsed.data;
    if (frontmatter.status === "published") expected.add(`${frontmatter.recipe_id}:${frontmatter.language}`);
  }
  const actual = new Set(siteContent.recipes.map((recipe) => `${recipe.recipeId}:${recipe.locale}`));
  assert.deepEqual(actual, expected);
  assert.equal(siteContent.recipes.length, actual.size);
});

test("published route paths stay within the recipe site's path space", () => {
  for (const recipe of siteContent.recipes) {
    assert.match(recipe.routePath, /^\/(?:en\/recipes\/|sv\/recept\/|th\/recipes\/)?[a-z0-9-]+\/$/);
  }
});

test("the ten additional Thai recipes are published in Finnish with their image assets", async () => {
  const expectedIds = [
    "gai-yang-vhh", "kai-jiew-vhh", "keltainen-kanacurry-vhh", "khao-kha-moo-vhh", "moo-ping-vhh",
    "pad-kee-mao-vhh-konjac", "pad-see-ew-vhh-konjac", "punainen-kanacurry-vhh", "tom-kha-gai-vhh", "yum-woon-sen-vhh",
  ];
  const recipes = siteContent.recipes.filter((recipe) => recipe.locale === "fi" && expectedIds.includes(recipe.recipeId));
  assert.deepEqual(recipes.map((recipe) => recipe.recipeId).sort(), expectedIds);
  assert.equal(recipes.length, 10);

  const repoDir = path.resolve(import.meta.dirname, "../..");
  for (const recipe of recipes) {
    assert.equal(recipe.locale, "fi");
    assert.ok(recipe.tags.includes("thaimaalainen"), `${recipe.recipeId} has the Thai tag`);
    assert.ok(recipe.image, `${recipe.recipeId} has a recipe image`);
    const relativeImagePath = recipe.image.src.split("/kuvat/").at(-1);
    assert.ok(relativeImagePath);
    assert.ok((await readFile(path.join(repoDir, "kuvat", relativeImagePath))).byteLength > 0);
  }
});

test("the Finnish breakfast and dessert collections contain 150 and ten published recipes with images", () => {
  const breakfast = siteContent.recipes.filter((recipe) => recipe.locale === "fi" && recipe.category === "aamupala");
  const desserts = siteContent.recipes.filter((recipe) => recipe.locale === "fi" && recipe.category === "jalkiruoka" && [
    "vhh-brita-kakku", "keto-mutakakku", "vhh-mokkapalat", "keto-suklaakeksit", "vhh-omenapiirakka",
    "vhh-juustokakku", "vhh-raparperipiirakka", "vhh-korvapuustit", "vhh-mansikkakakku", "vhh-letut",
  ].includes(recipe.recipeId));
  assert.equal(breakfast.length, 150);
  assert.equal(desserts.length, 10);
  const documentedBreakfastNetCarbs = new Map([
    ["indonesialainen-ketoprak-aamiaiskulho", 44.21], ["indonesialainen-pisang-goreng-aamiaiseksi", 63.85],
    ["indonesialainen-serabi-kookospannukakku", 57.3], ["japanilainen-onigiri-lohella", 37.06],
    ["japanilainen-tamago-kake-gohan", 38.04], ["japanilainen-kabocha-puuro", 47.22],
    ["karibia-bammy-kassavaleipa", 40.04], ["kiinalainen-soijamaito-aamiaisella", 1.31],
    ["lahi-ita-manakish-zaatarilla", 57.49], ["malesialainen-kaya-paahtoleipa", 36.59],
    ["japanilainen-hojicha-jogurtti-persimonilla", 17.03], ["meksikolainen-quesadilla-sienilla", 32.94],
    ["pohjoisafrikkalainen-harissa-shakshuka", 5.7], ["valimerellinen-farinata-aamupalaksi", 20.98],
    ["valimerellinen-halloumi-tomaattileipa", 27.58], ["keto-joulutortut", 3.44],
    ["munakokkeli", 0.8],
    ["munakasmuffinit", 0.6],
    ["munakasrulla-pinaatti-tuorejuustolla", 2.1],
    ["munatacot-huevos-rancheros", 4.2],
    ["paprikauunimunakkaat", 8.0],
    ["shakshuka", 8.9],
    ["uunimuna-avokadot", 1.1],
    ["uunimunat-pinaatilla", 1.3],
    ["halloumimunakas", 3.42],
    ["kaakao-kookos-chia", 2.53],
    ["kurkku-oliivi-aamiaiskulho", 2.07],
    ["raejuusto-pesto-kasviskulho", 2.99],
    ["marjainen-chiavanukas", 3.51],
    ["paahdettu-aamiaismunakoiso", 4.35],
    ["rahka-marjakerroskulho", 6.32],
    ["savulohi-avokadokulho", 0.89],
    ["tonnikalamunakkaat-uunissa", 0.53],
    ["lahi-ita-kikherne-shakshuka", 11.17],
    ["pohjoisafrikkalainen-maakouda", 4.84],
    ["valimerellinen-menemen-fetalla", 5.38],
    ["valimerellinen-tortilla-espanola-aamupalaksi", 6.14],
    ["valimerellinen-kikherne-yrttiaamiainen", 11.98],
    ["keto-mutakakku", 1.52], ["keto-suklaakeksit", 1.38],
    ["marjakiisseli-vaniljakastikkeella", 35.74], ["meheva-suklaakakku", 43.76],
    ["pannacotta-marjakastikkeella", 23.22], ["rahkapiirakka-vhh", 2.67],
    ["vhh-brita-kakku", 2.72], ["vhh-juustokakku", 2.81],
    ["vhh-korvapuustit", 1.66], ["vhh-letut", 2.57],
    ["vhh-mansikkakakku", 3.25], ["vhh-mokkapalat", 1.15],
    ["vhh-omenapiirakka", 4.24], ["vhh-raparperipiirakka", 3.46],
    ["keto-korvapuustit", 1.99], ["vhh-lihapiirakka", 2.27],
    ["vhh-runebergintortut", 2.16], ["siemengranola-jogurtilla", 8.09],
    ["karibia-callaloo-munakas", 2.12],
    ["yrttituorejuusto-kinkkurullat", 2.76],
    ["karibia-jamaikalainen-munakokkeli", 2.35],
    ["karibia-kookosriisi-pavuilla", 51.60],
    ["kiinalainen-tomaattimunakas-riisilla", 42.10],
    ["kiinalainen-riisipuuro-kananmunalla", 39.99],
    ["korealainen-yachaejuk-kasvisjuk", 45.54],
    ["lahi-ita-fattet-hummus", 33.61],
    ["lahi-ita-kikhernejauho-yrttilettu", 20.94],
    ["lahi-ita-menemen-sumakilla", 4.45],
    ["malesialainen-congee-inkivaarilla", 40.68],
    ["pohjoisafrikkalainen-lablabi", 33.84],
    ["thai-jok-kanalla", 39.71],
    ["thai-kai-jiao-yrteilla", 0.70],
    ["thai-khao-tom-katkaravuilla", 41.20],
    ["thai-porsasjok", 39.71],
    ["valimerellinen-ricotta-persikkakulho", 8.27],
    ["korealainen-gyeran-mari-kasviksilla", 2.11],
    ["intialainen-besan-chilla", 22.78],
    ["intialainen-rava-uttapam", 36.98],
    ["kiinalainen-kevatsipulipannukakku", 38.13],
    ["indonesialainen-bubur-ayam-kanariisipuuro", 37.32],
    ["indonesialainen-nasi-uduk-aamiaisella", 39.57],
    ["intialainen-aloo-paratha", 39.58],
    ["intialainen-pesarattu-mungpavuista", 68.49],
    ["pohjoisafrikkalainen-bissara", 28.24],
    ["vietnamilainen-banh-mi-munalla", 30.55],
    ["vietnamilainen-banh-xeo-aamiaisletut", 42.55],
    ["vietnamilainen-kahvijogurtti-banaanilla", 21.39],
    ["valimerellinen-tahinipuuro", 40.33],
    ["valimerellinen-jogurttikulho-hunajalla", 11.19],
    ["valimerellinen-pinaatti-fetashakshuka", 3.52],
    ["meksikolainen-huevos-a-la-mexicana", 3.72],
    ["meksikolainen-atole-maissipuuro", 47.4],
    ["thai-maissifritterit", 55.41],
    ["karibia-mango-limejogurtti", 15.12],
    ["vietnamilainen-banh-cuon-sienilla", 40.31],
    ["indonesialainen-bakwan-maissifritter", 45.19],
    ["meksikolainen-munakokkeli-pico-de-gallolla", 28.3],
    ["thai-roti-munalla-banaanilla", 50.17],
    ["valimerellinen-appelsiini-aamiaiskakku", 44.48],
    ["pohjoisafrikkalainen-msemen-hunajalla", 76.23],
    ["lahi-ita-taatelipuuro-tahinilla", 38.24],
    ["intialainen-mannasuurimoupma", 40.59],
    ["malesialainen-roti-jala-currykanalla", 38.73],
    ["pohjoisafrikkalainen-taatelipuuro-appelsiinilla", 41.3],
    ["pohjoisafrikkalainen-minttutee-kaurapuuro", 39.41],
    ["lahi-ita-ful-medames", 2.41],
    ["malesialainen-roti-canai-dhalilla", 61.41],
    ["korealainen-gyeranbap-riisikulho", 38.08],
    ["pohjoisafrikkalainen-baghrir", 76.19],
    ["karibia-johnny-cake", 38.99],
    ["kiinalainen-teehaudutetut-munat", 1.02],
    ["pohjoisafrikkalainen-harcha-juustolla", 35.66],
    ["meksikolainen-kurpitsapuuro-piloncillolla", 44.63],
    ["lahi-ita-zaatar-munat", 24.91],
    ["karibia-maissipuuro-kookoksella", 43.8],
    ["kiinalainen-hirssipuuro-taateleilla", 37.85],
    ["kiinalainen-musta-seesamipuuro", 46.5],
    ["thai-papaijajogurtti", 12.44],
    ["lahi-ita-pistaasijogurtti", 8.23],
    ["pohjoisafrikkalainen-kuskus-aamiaiskulho", 42.52],
    ["vietnamilainen-chao-ga-kanapuuro", 37.32],
    ["vietnamilainen-pho-ga-aamuksi", 40.87],
    ["vietnamilainen-papaija-kookospuuro", 49.7],
    ["vietnamilainen-hu-tieu-aamiaiskeitto", 42.08],
    ["korealainen-kongjuk-soijapapu-riisipuuro", 46.43],
    ["korealainen-jumeokbap-merilevalla", 38.73],
    ["thai-kookosriisi-mangolla", 48.05],
    ["malesialainen-nasi-lemak-aamiaisella", 39.78],
    ["malesialainen-mee-goreng-aamunuudeleilla", 35.42],
    ["indialainen-poha-maapahkinoilla", 43.06],
    ["intialainen-ven-pongal", 71.1],
    ["kiinalainen-jianbing-munaletty", 38.96],
    ["thai-kananmunat-kookoscurryssa", 43.31],
    ["malesialainen-apam-balik", 57.18],
  ]);
  for (const recipe of [...breakfast, ...desserts]) {
    assert.ok(recipe.image, `${recipe.recipeId} has an image`);
    assert.equal(
      recipe.nutrition.carbsNetG,
      documentedBreakfastNetCarbs.get(recipe.recipeId) ?? null,
      "only recipes with documented nutrition estimates have values",
    );
  }
});

test("the 40 new recipes are unique, published in Finnish, and have their own image assets", async () => {
  const expectedIds = [
    "marjainen-chiavanukas", "kaakao-kookos-chia", "rahka-marjakerroskulho", "siemengranola-jogurtilla", "savulohi-avokadokulho",
    "kurkku-oliivi-aamiaiskulho", "pellava-puuro-pahkinoilla", "yrttituorejuusto-kinkkurullat", "raejuusto-pesto-kasviskulho", "paahdettu-aamiaismunakoiso",
    "hernekeitto-savupotkalla", "kanaviillokki-kukkakaalilla", "siskonmakkarakeitto-juurekset", "janssoninkiusaus-juuriselleri", "lindstrominpihvit-kaalilla",
    "uunimakkara-sipulipedilla", "silakkapihvit-tilli-kermakastike", "lanttulaatikko-kermainen", "liha-juureskeitto-perunaton", "maksalaatikko-kukkakaalilla",
    "kreikkalainen-kanavuoka-oliiveilla", "uunikanapasta-kesakurpitsa", "kermainen-kanasienipannu", "sitruuna-yrttikana-parsa", "kanapyorykat-tomaattikastike",
    "kookos-lime-kanacurry", "kanasalaatti-pesto-mozzarella", "kanakeitto-pinaatti-sitruuna", "hunaja-sinappikana-kaalilla", "kana-parmesaanipannu-parsakaali",
    "chili-con-carne-kukkakaaliriisi", "kana-fajita-pelti", "kana-enchilada-kukkakaalivuoka", "tacokulho-nauta-avokado", "carnitas-salaattitacot",
    "miso-lohi-paksoi", "shoyu-kanakeitto-konjac", "kana-yakitori-kaalilla", "okonomiyaki-kaaliletut", "japanilainen-curry-tofulla",
  ];
  const recipes = siteContent.recipes.filter(recipe => expectedIds.includes(recipe.recipeId));
  assert.equal(recipes.length, 40);
  assert.deepEqual(recipes.map(recipe => recipe.recipeId).sort(), [...expectedIds].sort());
  assert.equal(new Set(recipes.map(recipe => recipe.recipeId)).size, 40);
  assert.equal(new Set(recipes.map(recipe => recipe.image?.src)).size, 40);
  assert.equal(recipes.filter(recipe => recipe.category === "aamupala").length, 10);
  assert.equal(recipes.filter(recipe => recipe.tags.includes("suomalainen")).length, 10);
  assert.equal(recipes.filter(recipe => ["kookos-lime-kanacurry", "kermainen-kanasienipannu", "kreikkalainen-kanavuoka-oliiveilla", "sitruuna-yrttikana-parsa", "kanapyorykat-tomaattikastike", "kanasalaatti-pesto-mozzarella", "kanakeitto-pinaatti-sitruuna", "hunaja-sinappikana-kaalilla", "kana-parmesaanipannu-parsakaali", "uunikanapasta-kesakurpitsa"].includes(recipe.recipeId)).length, 10);
  assert.equal(recipes.filter(recipe => recipe.cuisine === "mexican").length, 5);
  assert.equal(recipes.filter(recipe => recipe.cuisine === "japanese").length, 5);
  for (const recipe of recipes.filter(recipe => recipe.category === "aamupala")) {
    assert.ok(recipe.ingredients.every(ingredient => !/kananmuna/i.test(ingredient.item)), "breakfast recipes are egg-free");
  }
  const documentedNetCarbs = new Map([
    ["siskonmakkarakeitto-juurekset", 9.01], ["janssoninkiusaus-juuriselleri", 8.38],
    ["kookos-lime-kanacurry", 5.66], ["okonomiyaki-kaaliletut", 11.28],
    ["kung-pao-kana", 45.21], ["dan-dan-nuudelit", 53.48], ["carnitas-salaattitacot", 4.90],
    ["rogan-josh", 4.39], ["rendang-padang", 41.86], ["shoyu-kanakeitto-konjac", 4.50],
    ["falafel", 26.33], ["pav-bhaji", 65.29], ["jiaozi", 60.40], ["xiaolongbao", 59.50],
    ["jerk-kana", 77.22], ["miso-lohi-paksoi", 2.91], ["bouillabaisse", 37.69],
    ["paella-valenciana", 59.13], ["bun-cha-hanoi", 76.90], ["sate-ayam", 13.59],
    ["kreikkalainen-kanavuoka-oliiveilla", 4.1], ["hunaja-sinappikana-kaalilla", 12.22],
    ["marjainen-chiavanukas", 3.51], ["kaakao-kookos-chia", 2.53],
    ["rahka-marjakerroskulho", 6.32], ["savulohi-avokadokulho", 0.89],
    ["kurkku-oliivi-aamiaiskulho", 2.07], ["paahdettu-aamiaismunakoiso", 4.35],
    ["raejuusto-pesto-kasviskulho", 2.99],
    ["maksalaatikko-kukkakaalilla", 12.07],
    ["uunikanapasta-kesakurpitsa", 7.10], ["chili-con-carne-kukkakaaliriisi", 17.32],
    ["kana-fajita-pelti", 5.78],
    ["kanakeitto-pinaatti-sitruuna", 4.87],
    ["siemengranola-jogurtilla", 8.09],
    ["liha-juureskeitto-perunaton", 5.61],
    ["kermainen-kanasienipannu", 3.06],
    ["kana-parmesaanipannu-parsakaali", 2.91],
    ["raejuusto-pesto-kasviskulho", 2.99],
    ["lindstrominpihvit-kaalilla", 9.54],
    ["kanaviillokki-kukkakaalilla", 9.25],
    ["yrttituorejuusto-kinkkurullat", 2.76],
    ["uunimakkara-sipulipedilla", 12.02],
    ["silakkapihvit-tilli-kermakastike", 3.82],
    ["lanttulaatikko-kermainen", 16.68],
    ["sitruuna-yrttikana-parsa", 1.78],
    ["kanasalaatti-pesto-mozzarella", 1.88],
    ["kana-enchilada-kukkakaalivuoka", 8.13],
    ["tacokulho-nauta-avokado", 2.71],
    ["kana-yakitori-kaalilla", 9.16],
    ["kanapyorykat-tomaattikastike", 4.94],
  ]);
  const repoDir = path.resolve(import.meta.dirname, "../..");
  for (const recipe of recipes) {
    assert.equal(recipe.locale, "fi");
    assert.ok(recipe.image, `${recipe.recipeId} has an image`);
    const relativeImagePath = recipe.image.src.split("/kuvat/").at(-1);
    assert.ok(relativeImagePath);
    assert.ok((await readFile(path.join(repoDir, "kuvat", relativeImagePath))).byteLength > 0);
    assert.equal(
      recipe.nutrition.carbsNetG,
      documentedNetCarbs.get(recipe.recipeId) ?? null,
      `${recipe.recipeId} matches the documented nutrition estimate inventory`,
    );
  }
});

test("new recipe totals, servings, and ingredients match the preparation steps", () => {
  const recipes = new Map(siteContent.recipes.filter(recipe => recipe.locale === "fi").map(recipe => [recipe.recipeId, recipe]));
  assert.equal(recipes.get("marjainen-chiavanukas")?.timeTotalMin, 255);
  assert.equal(recipes.get("kaakao-kookos-chia")?.timeTotalMin, 255);
  assert.equal(recipes.get("hernekeitto-savupotkalla")?.timeTotalMin, 750);
  assert.match(recipes.get("hernekeitto-savupotkalla")?.notesHtml ?? "", /12 tunnin/);
  assert.match(recipes.get("savulohi-avokadokulho")?.instructionsText.join(" ") ?? "", /neljään kulhoon tai lautaselle/);
  assert.match(recipes.get("lanttulaatikko-kermainen")?.instructionsText.join(" ") ?? "", /siirappi/);
  const jansson = recipes.get("janssoninkiusaus-juuriselleri")!;
  assert.equal(jansson.ingredients.find(ingredient => ingredient.item.includes("anjovis"))?.item, "öljyyn säilöttyjä anjovisfileitä, valutettuna");
  assert.doesNotMatch(jansson.instructionsText.join(" "), /anjovisten maustelientä/);
});

test("the twenty Indian recipes are published in Finnish with their image assets", async () => {
  const expectedIds = [
    "aloo-paratha", "amritsari-kala", "butter-chicken", "chettinad-kana", "chole-bhature",
    "dal-makhani", "gulab-jamun", "hyderabadi-kanabiryani", "idli-sambar", "kerala-kalacurry",
    "masala-dosa", "medu-vada", "palak-paneer", "paneer-tikka", "pani-puri", "pav-bhaji",
    "rogan-josh", "samosa", "tandoorikana", "vada-pav",
  ];
  const recipes = siteContent.recipes.filter((recipe) => recipe.locale === "fi" && expectedIds.includes(recipe.recipeId));
  assert.deepEqual(recipes.map((recipe) => recipe.recipeId).sort(), expectedIds);
  assert.equal(recipes.length, 20);

  const repoDir = path.resolve(import.meta.dirname, "../..");
  for (const recipe of recipes) {
    assert.equal(recipe.locale, "fi");
    assert.ok(recipe.tags.includes("intialainen"), `${recipe.recipeId} has the Indian tag`);
    assert.ok(recipe.image, `${recipe.recipeId} has a recipe image`);
    const relativeImagePath = recipe.image.src.split("/kuvat/").at(-1);
    assert.ok(relativeImagePath);
    assert.ok((await readFile(path.join(repoDir, "kuvat", relativeImagePath))).byteLength > 0);
  }
});

test("the twelve published batch-five recipes expose all four documented nutrition values in every locale", () => {
  const expected = new Map([
    ["medu-vada", [30.54, 36.2, 15.44, 13.25]], ["pani-puri", [50.2, 55, 9.7, 7.81]],
    ["samosa", [73.37, 78.17, 11.99, 27.48]], ["vada-pav", [55, 63.21, 11.64, 14.48]],
    ["aloo-paratha", [71, 75.02, 10.63, 8.78]], ["butter-chicken", [12.99, 13.66, 37.37, 36.17]],
    ["chole-bhature", [105.3, 118.4, 27.69, 28.39]], ["ketopizza-pofiber-pohjalla", [4.1, 7.72, 34.32, 31.79]],
    ["lohikeitto-kuohukermalla", [17.8, 20.16, 23.39, 38.64]], ["uunilohi-smetanakuorrutteella", [2.03, 2.97, 36.76, 50.77]],
    ["vhh-lohikeitto-kukkakaalilla", [6.16, 9.66, 29.66, 41.89]], ["gulab-jamun", [93.18, 93.87, 14.96, 16.36]],
  ]);
  const recipes = siteContent.recipes.filter(recipe => expected.has(recipe.recipeId));
  assert.equal(recipes.length, expected.size * 4);
  for (const recipe of recipes) {
    const values = expected.get(recipe.recipeId)!;
    assert.deepEqual([recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG], values, `${recipe.recipeId}/${recipe.locale}`);
  }
});

test("the evidence-backed batch-six recipes expose synchronized values in all four locales", () => {
  const expected = new Map([
    ["kai-jiew-vhh", [1.14, 1.66, 14.47, 16.97]],
    ["som-tam-vhh-kurkkuna", [4.92, 9.76, 3.96, 3.7]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.equal(recipes.length, expected.size * 4);
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("the eight evidence-backed Thai batch-seven recipes expose synchronized values in all four locales", () => {
  const expected = new Map([
    ["yum-woon-sen-vhh", [2.15, 6.88, 18.98, 9.23]],
    ["gai-yang-vhh", [4.78, 9.45, 45.17, 35.05]],
    ["keltainen-kanacurry-vhh", [6.74, 10.79, 33.08, 22.78]],
    ["khao-kha-moo-vhh", [6.93, 13.87, 49.8, 38.91]],
    ["khao-man-gai-vhh", [6.75, 11.16, 38.57, 6]],
    ["khao-soi-vhh-konjac", [5.35, 10.69, 32.08, 21.05]],
    ["larb-moo-vhh", [6.82, 9.61, 33.83, 16.13]],
    ["massaman-curry-kanalla-vhh", [11.8, 19.38, 37.66, 24.85]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.equal(recipes.length, expected.size * 4);
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("the ten evidence-backed Thai batch-eight recipes expose synchronized values in all four locales", () => {
  const expected = new Map([
    ["moo-ping-vhh", [2, 4.44, 34.86, 34.69]],
    ["pad-kee-mao-vhh-konjac", [4.53, 12.09, 26.37, 10.81]],
    ["pad-kra-pao-vhh", [4.87, 9.85, 42.67, 28.2]],
    ["pad-see-ew-vhh-konjac", [3.39, 10.62, 37.05, 12.05]],
    ["pad-thai-vhh-konjac", [6.38, 12.71, 34.88, 18.21]],
    ["panang-curry-kanalla-vhh", [8.79, 14.91, 36.09, 23.57]],
    ["punainen-kanacurry-vhh", [9.15, 15.9, 34.74, 22.98]],
    ["thai-vihrea-curry-kanalla-vhh", [9.01, 15.82, 34.97, 23.97]],
    ["tom-kha-gai-vhh", [3.58, 6.85, 32.52, 21.37]],
    ["tom-yum-goong-vhh", [4.66, 7.25, 28.8, 2.38]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.equal(recipes.length, expected.size * 4);
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("the four evidence-backed batch-nine recipes expose synchronized values in all four locales", () => {
  const expected = new Map([
    ["italian-pata", [5.66, 8.58, 32.07, 32.56]],
    ["jauheliha-makaronilaatikko", [37.18, 38.79, 47.63, 27.93]],
    ["kermainen-lohipata", [4.79, 6.08, 35.85, 52.25]],
    ["keto-kauralesesampylat", [3.19, 6.77, 8.98, 12.41]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.equal(recipes.length, expected.size * 4);
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("batch twelve publishes recalculated macronutrients for every recipe and available translation", () => {
  const expected = new Map([
    ["kana-enchilada-kukkakaalivuoka", [8.13, 11.64, 46.66, 29.27]],
    ["kanasalaatti-pesto-mozzarella", [1.88, 4.36, 32, 24.19]],
    ["yangzhou-paistettu-riisi", [39.01, 40.38, 21.18, 11.11]],
    ["tacokulho-nauta-avokado", [2.71, 5.28, 31.27, 26.41]],
    ["silakkapihvit-tilli-kermakastike", [3.82, 4.76, 21.27, 30.04]],
    ["sitruuna-yrttikana-parsa", [1.78, 4.33, 36.34, 16.09]],
    ["karjalanpaisti-vhh", [6.6, 9.13, 28.79, 9.07]],
    ["lindstrominpihvit-kaalilla", [9.54, 12.77, 31.9, 18.32]],
    ["lanttulaatikko-kermainen", [16.68, 20.33, 4.75, 24.83]],
    ["uunimakkara-sipulipedilla", [12.02, 12.7, 19.58, 38.5]],
    ["paprikainen-vhh-gulassi", [8.72, 11.29, 40.59, 24.04]],
    ["nakkikeitto-kukkakaalilla", [11.55, 15.22, 13.94, 17.52]],
    ["nakkikastike-kukkakaalimuusi", [7.88, 10.96, 15.69, 45.87]],
    ["amritsari-kala", [10.74, 16.33, 32.17, 10.81]],
    ["kantonilainen-hoyrytetty-kala", [3.13, 4.58, 31.99, 9.04]],
    ["hyderabadi-kanabiryani", [60.47, 62.73, 37.41, 20.64]],
    ["kana-yakitori-kaalilla", [9.16, 12.35, 27.52, 6.23]],
    ["ropa-vieja", [7.67, 9.77, 34.06, 6.77]],
    ["kerala-kalacurry", [5.54, 6.67, 28.28, 22.7]],
    ["kanapyorykat-tomaattikastike", [4.94, 5.61, 29.44, 21.23]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.ok(recipes.length >= expected.size, "all batch recipes have published Finnish pages");
  assert.deepEqual(new Set(recipes.map((recipe) => recipe.recipeId)), new Set(expected.keys()));
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("batch thirteen publishes recalculated macronutrients for every recipe and available translation", () => {
  const expected = new Map([
    ["char-siu", [51.32, 53.07, 50.97, 5.5]],
    ["hapanimela-porsas", [54.86, 56.87, 41.4, 15.4]],
    ["kanaviillokki-kukkakaalilla", [9.25, 12.57, 38.04, 34.37]],
    ["karibia-callaloo-munakas", [2.12, 4.83, 9.32, 12.14]],
    ["karibia-jamaikalainen-munakokkeli", [2.35, 3.02, 7.45, 12.06]],
    ["karibia-kookosriisi-pavuilla", [51.6, 57.39, 10.47, 15.18]],
    ["kiinalainen-tomaattimunakas-riisilla", [42.1, 42.96, 11.45, 12.54]],
    ["kiinalainen-riisipuuro-kananmunalla", [39.99, 40.63, 11.11, 5.61]],
    ["korealainen-yachaejuk-kasvisjuk", [45.54, 50.26, 5.39, 8.03]],
    ["lahi-ita-fattet-hummus", [33.61, 37.78, 11.1, 8.04]],
    ["lahi-ita-kikhernejauho-yrttilettu", [20.94, 31.93, 10.49, 9.76]],
    ["lahi-ita-menemen-sumakilla", [4.45, 6.23, 8.08, 12.27]],
    ["malesialainen-congee-inkivaarilla", [40.68, 41.32, 4.64, 0.54]],
    ["pohjoisafrikkalainen-lablabi", [33.84, 37.7, 16.02, 9.82]],
    ["thai-jok-kanalla", [39.71, 40.24, 27.84, 7.11]],
    ["thai-kai-jiao-yrteilla", [0.7, 0.92, 7.87, 11.85]],
    ["thai-khao-tom-katkaravuilla", [41.2, 42.08, 15.01, 3.78]],
    ["thai-porsasjok", [39.71, 40.24, 25.12, 17.38]],
    ["valimerellinen-ricotta-persikkakulho", [8.27, 10.63, 8.3, 12.79]],
    ["yrttituorejuusto-kinkkurullat", [2.76, 3.66, 8.17, 6.26]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.ok(recipes.length >= expected.size, "all batch recipes have published Finnish pages");
  assert.deepEqual(new Set(recipes.map((recipe) => recipe.recipeId)), new Set(expected.keys()));
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("batch fourteen publishes recalculated macronutrients for every recipe and available translation", () => {
  const expected = new Map([
    ["korealainen-gyeran-mari-kasviksilla", [2.11, 2.94, 7.23, 18.65]],
    ["intialainen-besan-chilla", [22.78, 33.86, 10.63, 9.73]],
    ["intialainen-rava-uttapam", [36.98, 39.31, 7.94, 9.46]],
    ["kiinalainen-kevatsipulipannukakku", [38.13, 39.99, 6.37, 14.29]],
    ["indonesialainen-bubur-ayam-kanariisipuuro", [37.32, 37.87, 20.49, 1.07]],
    ["indonesialainen-nasi-uduk-aamiaisella", [39.57, 40.52, 12.16, 20.98]],
    ["intialainen-aloo-paratha", [39.58, 44.53, 7.42, 7.84]],
    ["intialainen-pesarattu-mungpavuista", [68.49, 79.38, 21.93, 8.7]],
    ["pohjoisafrikkalainen-bissara", [28.24, 42.55, 18.49, 8.59]],
    ["vietnamilainen-banh-mi-munalla", [30.55, 33.19, 11.93, 12.53]],
    ["vietnamilainen-banh-xeo-aamiaisletut", [42.55, 44.68, 17.47, 23.37]],
    ["vietnamilainen-kahvijogurtti-banaanilla", [21.39, 22.45, 3.8, 3.68]],
    ["valimerellinen-tahinipuuro", [40.33, 47.15, 8.13, 9.19]],
    ["valimerellinen-jogurttikulho-hunajalla", [11.19, 12.8, 6.7, 13.36]],
    ["valimerellinen-pinaatti-fetashakshuka", [3.52, 5.02, 21.98, 30.91]],
    ["meksikolainen-huevos-a-la-mexicana", [3.72, 5.26, 7.83, 12.06]],
    ["meksikolainen-atole-maissipuuro", [47.4, 49.04, 5.85, 4.21]],
    ["thai-maissifritterit", [55.41, 59.9, 14.82, 13.59]],
    ["karibia-mango-limejogurtti", [15.12, 18.23, 2.65, 8.5]],
    ["vietnamilainen-banh-cuon-sienilla", [40.31, 42.76, 21.37, 9.05]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.ok(recipes.length >= expected.size, "all batch recipes have published Finnish pages");
  assert.deepEqual(new Set(recipes.map((recipe) => recipe.recipeId)), new Set(expected.keys()));
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("batch fifteen publishes recalculated macronutrients for every recipe and available translation", () => {
  const expected = new Map([
    ["indonesialainen-bakwan-maissifritter", [45.19, 49.88, 7.89, 8.5]],
    ["meksikolainen-munakokkeli-pico-de-gallolla", [28.3, 29.23, 9.12, 16.67]],
    ["thai-roti-munalla-banaanilla", [50.17, 52.98, 14.77, 27.02]],
    ["valimerellinen-appelsiini-aamiaiskakku", [44.48, 47.79, 7.66, 16.31]],
    ["pohjoisafrikkalainen-msemen-hunajalla", [76.23, 79.73, 11.88, 28.4]],
    ["lahi-ita-taatelipuuro-tahinilla", [38.24, 44.28, 12.45, 14.43]],
    ["intialainen-mannasuurimoupma", [40.59, 45.38, 10.16, 1.2]],
    ["malesialainen-roti-jala-currykanalla", [38.73, 40.48, 28.35, 29.02]],
    ["pohjoisafrikkalainen-taatelipuuro-appelsiinilla", [41.3, 45.79, 6.27, 0.67]],
    ["pohjoisafrikkalainen-minttutee-kaurapuuro", [39.41, 44.38, 9.22, 8.28]],
    ["lahi-ita-ful-medames", [2.41, 8.38, 5.89, 7.36]],
    ["chow-mein", [27.51, 31.14, 26.36, 12.09]],
    ["malesialainen-roti-canai-dhalilla", [61.41, 70.01, 18.59, 22.64]],
    ["korealainen-gyeranbap-riisikulho", [38.08, 39.34, 12.07, 5.65]],
    ["pohjoisafrikkalainen-baghrir", [76.19, 80.36, 12.49, 8.2]],
    ["karibia-johnny-cake", [38.99, 40.75, 6.81, 14.68]],
    ["kiinalainen-teehaudutetut-munat", [1.02, 1.02, 7.48, 5.09]],
    ["pohjoisafrikkalainen-harcha-juustolla", [35.66, 37.69, 10.66, 20.2]],
    ["meksikolainen-kurpitsapuuro-piloncillolla", [44.63, 52.57, 7.12, 4.89]],
    ["lahi-ita-zaatar-munat", [24.91, 26.07, 12.18, 14.26]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.ok(recipes.length >= expected.size, "all batch recipes have published Finnish pages");
  assert.deepEqual(new Set(recipes.map((recipe) => recipe.recipeId)), new Set(expected.keys()));
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("batch sixteen publishes recalculated macronutrients for every recipe and available translation", () => {
  const expected = new Map([
    ["karibia-maissipuuro-kookoksella", [43.8, 44.75, 4.09, 14.87]],
    ["kiinalainen-hirssipuuro-taateleilla", [37.85, 40.42, 6.72, 3.85]],
    ["kiinalainen-musta-seesamipuuro", [46.5, 49.02, 7.64, 5.23]],
    ["thai-papaijajogurtti", [12.44, 15.96, 3.98, 8.81]],
    ["lahi-ita-pistaasijogurtti", [8.23, 10.92, 5.27, 8.82]],
    ["pohjoisafrikkalainen-kuskus-aamiaiskulho", [42.52, 45.83, 10.91, 7.18]],
    ["vietnamilainen-chao-ga-kanapuuro", [37.32, 37.87, 20.49, 1.07]],
    ["vietnamilainen-pho-ga-aamuksi", [40.87, 41.93, 18.6, 0.88]],
    ["vietnamilainen-papaija-kookospuuro", [49.7, 52.07, 1.85, 14.28]],
    ["vietnamilainen-hu-tieu-aamiaiskeitto", [42.08, 44.18, 21.61, 2.02]],
    ["korealainen-kongjuk-soijapapu-riisipuuro", [46.43, 62.47, 28.21, 18.59]],
    ["korealainen-jumeokbap-merilevalla", [38.73, 40.7, 4.86, 7.37]],
    ["thai-kookosriisi-mangolla", [48.05, 49.76, 5.83, 16.41]],
    ["malesialainen-nasi-lemak-aamiaisella", [39.78, 40.48, 11.92, 19.75]],
    ["malesialainen-mee-goreng-aamunuudeleilla", [35.42, 38.4, 21.71, 17.71]],
    ["indialainen-poha-maapahkinoilla", [43.06, 45.86, 7.79, 12.36]],
    ["intialainen-ven-pongal", [71.1, 82.62, 23.7, 13.9]],
    ["kiinalainen-jianbing-munaletty", [38.96, 41.6, 14.79, 15.39]],
    ["thai-kananmunat-kookoscurryssa", [43.31, 45.31, 12.68, 26.79]],
    ["malesialainen-apam-balik", [57.18, 60.75, 12.94, 15.13]],
  ]);
  const recipes = siteContent.recipes.filter((recipe) => expected.has(recipe.recipeId));
  assert.ok(recipes.length >= expected.size, "all batch recipes have published pages");
  assert.deepEqual(new Set(recipes.map((recipe) => recipe.recipeId)), new Set(expected.keys()));
  for (const recipe of recipes) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      expected.get(recipe.recipeId),
      `${recipe.recipeId}/${recipe.locale}`,
    );
  }
});

test("the twenty Chinese recipes are published in Finnish with their image assets", async () => {
  const expectedIds = [
    "baozi", "char-siu", "chow-mein", "congee-riisipuuro", "dan-dan-nuudelit", "dim-sum",
    "hapanimela-porsas", "jiaozi", "kantonilainen-hoyrytetty-kala", "kung-pao-kana",
    "lanzhou-naudanliha-nuudelikeitto", "mala-xiang-guo", "mapo-tofu", "pekingin-ankka",
    "roujiamo", "sichuan-hot-pot", "tangyuan", "tomaatti-kananmuna-wokki",
    "xiaolongbao", "yangzhou-paistettu-riisi",
  ];
  const recipes = siteContent.recipes.filter((recipe) => recipe.locale === "fi" && expectedIds.includes(recipe.recipeId));
  assert.deepEqual(recipes.map((recipe) => recipe.recipeId).sort(), expectedIds);
  assert.equal(recipes.length, 20);

  const repoDir = path.resolve(import.meta.dirname, "../..");
  for (const recipe of recipes) {
    assert.equal(recipe.locale, "fi");
    assert.ok(recipe.tags.includes("kiinalainen"), `${recipe.recipeId} has the Chinese tag`);
    assert.ok(recipe.image, `${recipe.recipeId} has a recipe image`);
    const relativeImagePath = recipe.image.src.split("/kuvat/").at(-1);
    assert.ok(relativeImagePath);
    assert.ok((await readFile(path.join(repoDir, "kuvat", relativeImagePath))).byteLength > 0);
  }
});

test("the twenty Mediterranean recipes are published in Finnish with their image assets", async () => {
  const expectedIds = [
    "bouillabaisse", "caponata", "doner-kebab", "gazpacho", "hummus", "kana-tagine-sitruunalla",
    "koshari", "kreikkalainen-moussaka", "marokkolainen-couscous", "menemen", "paella-valenciana",
    "pasta-alla-norma", "pizza-margherita", "ratatouille", "souvlaki", "spanakopita", "tabbouleh",
    "tortilla-de-patatas", "tunisialainen-brik", "tunisialainen-ojja",
  ];
  const recipes = siteContent.recipes.filter((recipe) => recipe.locale === "fi" && expectedIds.includes(recipe.recipeId));
  assert.deepEqual(recipes.map((recipe) => recipe.recipeId).sort(), expectedIds);
  assert.equal(recipes.length, 20);

  const repoDir = path.resolve(import.meta.dirname, "../..");
  for (const recipe of recipes) {
    assert.equal(recipe.locale, "fi");
    assert.ok(recipe.tags.includes("valimerellinen"), `${recipe.recipeId} has the Mediterranean tag`);
    assert.ok(recipe.image, `${recipe.recipeId} has a recipe image`);
    assert.equal(recipe.image.width, 1279);
    assert.equal(recipe.image.height, 853);
    const relativeImagePath = recipe.image.src.split("/kuvat/").at(-1);
    assert.ok(relativeImagePath);
    assert.ok((await readFile(path.join(repoDir, "kuvat", relativeImagePath))).byteLength > 0);
  }
});

test("the regional recipe additions are published in Finnish, categorized, and illustrated", async () => {
  const expected = new Map([
    ["bulgogi", "korean"], ["bibimbap", "korean"], ["kimchi-jjigae", "korean"],
    ["pho-bo", "vietnamese"], ["bun-cha-hanoi", "vietnamese"], ["goi-cuon", "vietnamese"],
    ["rendang-padang", "indonesian"], ["sate-ayam", "indonesian"], ["nasi-lemak", "malaysian"],
    ["jerk-kana", "caribbean"], ["ropa-vieja", "caribbean"], ["falafel", "middle-eastern"], ["harira", "north-african"],
    ["pannacotta-marjakastikkeella", null], ["marjakiisseli-vaniljakastikkeella", null], ["meheva-suklaakakku", null],
  ]);
  const recipes = siteContent.recipes.filter(recipe => recipe.locale === "fi" && expected.has(recipe.recipeId));
  assert.equal(recipes.length, expected.size);

  const repoDir = path.resolve(import.meta.dirname, "../..");
  for (const recipe of recipes) {
    assert.ok(recipe.image, `${recipe.recipeId} has an image`);
    assert.ok(recipe.ingredients.length > 0, `${recipe.recipeId} has structured ingredients`);
    assert.ok(recipe.instructionsText.length > 0, `${recipe.recipeId} has preparation steps`);
    const imagePath = recipe.image.src.split("/kuvat/").at(-1);
    assert.ok(imagePath);
    assert.ok((await readFile(path.join(repoDir, "kuvat", imagePath))).byteLength > 0, recipe.recipeId);
    assert.equal(recipe.cuisine, expected.get(recipe.recipeId), recipe.recipeId);
  }
});

test("the high-protein macaroni bake has four aligned published language versions", () => {
  const translations = siteContent.recipes.filter((recipe) => recipe.recipeId === "jauheliha-makaronilaatikko");
  assert.deepEqual(translations.map((recipe) => recipe.locale).sort(), ["en", "fi", "sv", "th"]);
  const source = translations.find((recipe) => recipe.locale === "fi");
  assert.ok(source);
  for (const translation of translations) {
    assert.equal(translation.servings, source.servings);
    assert.equal(translation.timeTotalMin, source.timeTotalMin);
    assert.deepEqual(translation.nutrition, source.nutrition);
    assert.equal(translation.ingredients.length, source.ingredients.length);
    assert.deepEqual(translation.ingredients.map((item) => item.amount), source.ingredients.map((item) => item.amount));
    assert.equal(translation.image?.src, source.image?.src);
  }
  assert.equal(translations.find((recipe) => recipe.locale === "en")?.routePath, "/en/recipes/high-protein-beef-macaroni-bake/");
  assert.equal(translations.find((recipe) => recipe.locale === "sv")?.routePath, "/sv/recept/proteinrik-makaronilada-med-kottfars/");
  assert.equal(translations.find((recipe) => recipe.locale === "th")?.routePath, "/th/recipes/makaroni-op-nuea-bot-protein-sung/");
});

test("minced beef cabbage soup metadata and image match the existing ingredient list", async () => {
  const repoDir = path.resolve(import.meta.dirname, "../..");
  const source = await readFile(path.join(repoDir, "reseptit", "paaruoat", "jauheliha-kaalikeitto-vhh.md"), "utf8");
  const parsed = parseMarkdown(source);
  assert.ok(parsed);
  const image = parsed.data.image as { src: string; alt: string };
  const ingredients = parsed.data.ingredients as { item: string }[];
  assert.deepEqual(parsed.data.cooking_method, ["liesi"]);
  assert.equal(image.src, "paaruoat/jauheliha-kaalikeitto-vhh.webp");
  assert.doesNotMatch(image.alt, /porkkana|peruna/i);
  assert.doesNotMatch(parsed.content, /kermaiset ainekset|kerma/i);
  assert.deepEqual(ingredients.map((ingredient) => ingredient.item), [
    "naudan jauhelihaa", "valkokaalia", "sipuli", "lihalientä", "tomaattipyreetä", "suolaa", "mustapippuria", "meiramia",
  ]);
});



test("R1B corrected Koshari nutrition evidence is synchronized across published locales", () => {
  const translations = siteContent.recipes.filter((recipe) => recipe.recipeId === "koshari");
  assert.deepEqual(translations.map((recipe) => recipe.locale).sort(), ["en", "fi", "sv", "th"]);
  for (const recipe of translations) {
    assert.deepEqual(
      [recipe.nutrition.carbsNetG, recipe.nutrition.carbsTotalG, recipe.nutrition.proteinG, recipe.nutrition.fatG],
      [95.91, 103.14, 22.26, 12.03],
      `koshari/${recipe.locale}`,
    );
  }
});
