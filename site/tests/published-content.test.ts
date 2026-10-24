import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";

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
    ["marjainen-chiavanukas", 3.51],
    ["paahdettu-aamiaismunakoiso", 4.35],
    ["rahka-marjakerroskulho", 6.32],
    ["savulohi-avokadokulho", 0.89],
    ["tonnikalamunakkaat-uunissa", 0.53],
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
  const documentedFineliNetCarbs = new Map([
    ["marjainen-chiavanukas", 3.51], ["kaakao-kookos-chia", 2.53],
    ["rahka-marjakerroskulho", 6.32], ["savulohi-avokadokulho", 0.89],
    ["kurkku-oliivi-aamiaiskulho", 2.07], ["paahdettu-aamiaismunakoiso", 4.35],
    ["maksalaatikko-kukkakaalilla", 12.07],
    ["uunikanapasta-kesakurpitsa", 7.10], ["chili-con-carne-kukkakaaliriisi", 17.32],
    ["kana-fajita-pelti", 5.78],
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
      documentedFineliNetCarbs.get(recipe.recipeId) ?? null,
      `${recipe.recipeId} matches the documented Fineli estimate inventory`,
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
  assert.equal(jansson.ingredients.find(ingredient => ingredient.item.includes("anjovis"))?.item, "anjovisfileitä mausteliemessä");
  assert.match(jansson.instructionsText.join(" "), /anjovisten maustelientä/);
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
