import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { recipeUi } from "../src/features/recipes/recipe-i18n";
import { toolUi } from "../src/features/recipes/recipe-tools";
import { siteContent } from "../src/generated/content.generated";
import { glycemicLoadPilotReviewedRecipeCount, glycemicLoadPilotResults } from "../src/generated/glycemic-load-pilot.generated";

const dist = path.resolve(import.meta.dirname, "../dist");

test("recipe actions progressively enhance readable static pages in all four languages", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  for (const recipe of siteContent.recipes.filter(recipe => recipe.recipeId === "kermainen-lohipata")) {
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const root = html.slice(html.indexOf('<div id="root">'));
    assert.ok(root.indexOf('<h1>') < root.indexOf('class="recipe-image"'));
    assert.ok(root.includes(toolUi[recipe.locale].jump));
    assert.ok(root.includes(toolUi[recipe.locale].nutrition));
    assert.ok(root.includes(toolUi[recipe.locale].about));
    assert.ok(root.includes('id="recipe-instructions"'));
    assert.doesNotMatch(root, /<button|type="checkbox"/);
    assert.ok(recipe.instructionStepsHtml?.length === recipe.instructionsText.length);
  }
  for (const recipe of siteContent.recipes.filter(recipe => recipe.recipeId === "keto-kauralesesampylat")) {
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const schema = JSON.parse(html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(schema.totalTime, undefined, "unmeasured cooling cannot be excluded from schema total time");
  }
});

test("Italian bake estimated total time reaches visible notes and Recipe JSON-LD in every locale", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  const recipes = siteContent.recipes.filter((recipe) => recipe.recipeId === "italian-pata");
  assert.equal(recipes.length, 4);
  for (const recipe of recipes) {
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const schema = JSON.parse(html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(schema.totalTime, "PT60M");
    assert.match(html, /Arvioitu kokonaisaika|Estimated total time|Uppskattad totaltid|เวลารวมโดยประมาณ/);
  }
});

test("all static index descriptions use their locale text before JavaScript", async () => {
  for (const [locale, route] of [["fi", ""], ["en", "en/recipes"], ["sv", "sv/recept"], ["th", "th/recipes"]] as const) {
    const html = await readFile(path.join(dist, route, "index.html"), "utf8");
    for (const key of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
      assert.ok(html.includes(`<meta ${key} content="${recipeUi[locale].intro}"`), `${locale}: ${key}`);
    }
  }
});

test("localized hero copy is prerendered above the recipe filters", async () => {
  for (const [locale, route] of [["fi", ""], ["en", "en/recipes"], ["sv", "sv/recept"], ["th", "th/recipes"]] as const) {
    const html = await readFile(path.join(dist, route, "index.html"), "utf8");
    const root = html.slice(html.indexOf('<div id="root">'));
    const descriptionIndex = root.indexOf(`<p class="page-intro__description">${recipeUi[locale].intro}</p>`);
    const filtersIndex = root.indexOf('class="recipe-filters recipe-filters--placeholder"');
    assert.ok(descriptionIndex >= 0, `${locale}: localized hero description is visible before JavaScript`);
    assert.ok(filtersIndex > descriptionIndex, `${locale}: recipe filters follow the hero description`);
  }
});

test("recipe index is prerendered and links only published languages", async () => {
  const html = await readFile(path.join(dist, "index.html"), "utf8");
  assert.match(html, /<h1>Reseptit<\/h1>/);
  assert.match(html, /<a class="recipe-card__link" href="\/Reseptit\/kermainen-lohipata\/"[\s\S]*?<h2 class="recipe-card__title">Kermainen lohipata<\/h2>/);
  assert.match(html, /<a class="recipe-card__link" href="\/Reseptit\/keto-kauralesesampylat\/"[\s\S]*?<h2 class="recipe-card__title">Keto-kauralesesämpylät<\/h2>/);
  assert.match(html, /<div class="recipe-card-grid">/);
  assert.doesNotMatch(html, /<form class="recipe-filters" role="search"/);
  assert.doesNotMatch(html, /id="recipe-search"/);
  assert.match(html, /rel="canonical" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/"/);
  assert.match(html, /hreflang="fi"/);
  assert.match(html, /hreflang="en" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/en\/recipes\//);
  assert.match(html, /hreflang="sv" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/sv\/recept\//);
  assert.match(html, /hreflang="th" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/th\/recipes\//);
  assert.doesNotMatch(html, /href="[^"]+\?q=/);
  assert.doesNotMatch(html, /recipe-jsonld/);
  const allPreloads = [...html.matchAll(/<link rel="preload" as="image"[^>]*>/g)];
  // React also emits an unconditional preload for the first eager card.
  assert.equal(allPreloads.filter((item) => !item[0].includes("media=")).length, 1);
  const preloads = allPreloads.filter((item) => item[0].includes("media="));
  assert.equal(preloads.length, 2);
  assert.match(preloads[0][0], /media="\(min-width: 700px\)"/);
  assert.match(preloads[1][0], /media="\(min-width: 1100px\)"/);
});

test("vegetable lasagne publishes its supplied image and notes without unsupported nutrition or GK", async () => {
  const recipe = siteContent.recipes.find((recipe) => recipe.recipeId === "munakoiso-kesakurpitsalasagne" && recipe.locale === "fi");
  assert.ok(recipe);
  assert.equal(recipe.title, "Munakoiso-kesäkurpitsalasagne");
  assert.equal(recipe.timeTotalMin, 110);
  assert.deepEqual(recipe.nutrition, { carbsNetG: null, carbsTotalG: null, proteinG: null, fatG: null });
  const lasagneResults = glycemicLoadPilotResults.filter((result) => result.recipeId === recipe.recipeId);
  assert.equal(lasagneResults.length, 1);
  assert.equal(lasagneResults[0]?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(lasagneResults[0]?.glycemicLoadPerServing, null);
  assert.ok(recipe.image);
  assert.equal(recipe.image.src, "https://ozirix-dev.github.io/Reseptit/kuvat/munakoiso-kesakurpitsalasagne.webp");
  assert.equal(recipe.image.width, 1448);
  assert.equal(recipe.image.height, 1086);
  const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
  for (const note of ["havainnekuva", "ei ole koekeitetty", "Allergeenit", "Hans Välimäki", "kaupalliseksi yhteistyöksi", "ei ole hyväksyttyä GK-arvoa"]) {
    assert.ok(html.includes(note), `lasagne: ${note} is visible`);
  }
  assert.ok(!html.includes(recipeUi.fi.glycemicLoad), "an unsupported GK result is not displayed");
  assert.ok(!html.includes("Reseptiluonnos"));
});

test("GK values link to centralized recipe details on every published translation", async () => {
  const sourceRecipeIds = new Set(siteContent.recipes.filter((recipe) => recipe.locale === "fi").map((recipe) => recipe.recipeId));
  const audit = JSON.parse(await readFile(path.resolve(import.meta.dirname, "../../tmp/nutrition/glycemic-load-pilot.json"), "utf8")) as {
    results: Array<{ recipeId: string; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; glycemicLoadPerServing: number | null; omittedAvailableCarbohydratePerServingG: number; ingredients: Array<{ availableCarbohydratePerServingG: number | null; gi: number | null; fineliRecordId: string | null; giRecordId: string | null }> }>;
  };
  const publicAuditResults = audit.results.filter((result) => result.recipeId !== "maksalaatikko-kukkakaalilla");
  const reviewedRecipeIds = new Set(audit.results.map((result) => result.recipeId));
  assert.equal(reviewedRecipeIds.size, audit.results.length, "reviewed recipes stay unique");
  assert.equal(glycemicLoadPilotReviewedRecipeCount, reviewedRecipeIds.size);
  assert.ok([...reviewedRecipeIds].every((id) => sourceRecipeIds.has(id)), "every reviewed source is published");
  assert.deepEqual([...sourceRecipeIds].filter((id) => !reviewedRecipeIds.has(id)), [], "every published source recipe has one GK row");
  assert.deepEqual([...reviewedRecipeIds].filter((id) => !sourceRecipeIds.has(id)), [], "GK rows cannot outlive their published source");
  const lasagneAuditRows = audit.results.filter((result) => result.recipeId === "munakoiso-kesakurpitsalasagne");
  assert.equal(lasagneAuditRows.length, 1);
  assert.equal(lasagneAuditRows[0]?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(lasagneAuditRows[0]?.glycemicLoadPerServing, null);
  assert.equal(lasagneAuditRows[0]?.ingredients.length, 15);
  assert.ok(lasagneAuditRows[0]?.ingredients.every((ingredient) => ingredient.availableCarbohydratePerServingG === null && ingredient.gi === null && ingredient.fineliRecordId === null && ingredient.giRecordId === null));
  assert.equal(glycemicLoadPilotResults.length, publicAuditResults.length);
  assert.equal(glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED").length, publicAuditResults.filter((result) => result.status === "CALCULATED").length);
  assert.equal(glycemicLoadPilotResults.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length, publicAuditResults.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length);
  for (const [id, expected] of [
    ["indonesialainen-ketoprak-aamiaiskulho", 26.67],
    ["japanilainen-onigiri-lohella", 26.47],
    ["kiinalainen-soijamaito-aamiaisella", 0.67],
  ] as const) {
    const result = glycemicLoadPilotResults.find((entry) => entry.recipeId === id);
    assert.equal(result?.status, "CALCULATED", `${id}: reviewed current inputs have a complete result`);
    assert.equal(result?.glycemicLoadPerServing, expected, `${id}: current calculation is exposed`);
  }
  const bakeryReview = JSON.parse(await readFile(path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-bakery-final-source-review.json"), "utf8"));
  assert.equal(bakeryReview.withdrawnRecipeIds.length, 12);
  for (const id of bakeryReview.withdrawnRecipeIds) {
    const result = glycemicLoadPilotResults.find(entry => entry.recipeId === id);
    assert.equal(result?.status, "INSUFFICIENT SOURCE DATA", `${id}: bakery source withdrawal is public`);
    assert.equal(result?.glycemicLoadPerServing, null);
  }
  const releaseManifest=JSON.parse(await readFile(path.resolve(import.meta.dirname,'../../docs/nutrition/gk80-release-3/manifest.json'),'utf8'));
  const releaseIds=new Set<string>(releaseManifest.recipeIds);
  assert.deepEqual(publicAuditResults.filter(result=>result.status==='CALCULATED'&&releaseIds.has(result.recipeId)).map(result=>result.recipeId).sort(),[...releaseIds].sort());
  assert.equal(publicAuditResults.filter(result=>result.status==='CALCULATED'&&!releaseIds.has(result.recipeId)).length,83,'R1B legacy count remains 83 outside the eight intentional GK80 additions');
  assert.equal(publicAuditResults.filter(result=>result.status==='CALCULATED').length,95,'candidate adds exactly twelve complete modeled estimates');
  const paella = glycemicLoadPilotResults.find((entry) => entry.recipeId === "paella-valenciana");
  assert.equal(paella?.status, "INSUFFICIENT SOURCE DATA", "Paella remains blocked without a suitable chicken-stock GI source");
  assert.equal(paella?.glycemicLoadPerServing, null);
  const calculatedWithOmissions = glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED" && result.omittedAvailableCarbohydratePerServingG > 0);
  assert.ok(calculatedWithOmissions.every((result) => result.confidence === "LOW"), "omitted carbohydrate always lowers estimate confidence");
  const zeroWithOmissions = glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED" && result.glycemicLoadPerServing === 0 && result.omittedAvailableCarbohydratePerServingG > 0);
  assert.deepEqual(zeroWithOmissions.map(row => row.recipeId).sort(), publicAuditResults.filter(row => row.status === "CALCULATED" && row.glycemicLoadPerServing === 0 && row.omittedAvailableCarbohydratePerServingG > 0).map(row => row.recipeId).sort());
  const pork = zeroWithOmissions.find(row => row.recipeId === "uuniporsas-kermakastikkeessa-vhh");
  assert.ok(pork, "reviewed onion removal yields a disclosed LOW-confidence zero estimate");
  assert.equal(pork.confidence, "LOW");
  assert.ok(Math.abs(pork.omittedAvailableCarbohydratePerServingG - 1.5116333333333334) < 1e-12);
  for (const result of glycemicLoadPilotResults) {
    const translations = siteContent.recipes.filter((recipe) => recipe.recipeId === result.recipeId);
    assert.ok(translations.some((recipe) => recipe.locale === "fi"), `${result.recipeId}: Finnish recipe exists`);
    for (const recipe of translations) {
      const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
      if (result.status === "CALCULATED" && result.glycemicLoadPerServing !== null) {
        assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoad));
        assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoadMethod));
        assert.ok(html.includes(`${recipe.locale === "fi" ? "/Reseptit" : "/Reseptit"}${recipe.locale === "fi" ? "/glykeeminen-kuorma/" : recipe.locale === "en" ? "/en/glycemic-load/" : recipe.locale === "sv" ? "/sv/glykemisk-belastning/" : "/th/glycemic-load/"}#${result.recipeId}`));
        assert.ok(result.confidence && html.includes(recipeUi[recipe.locale].glycemicLoadConfidence(result.confidence)), `${result.recipeId}/${recipe.locale}: confidence is visible`);
        if (result.omittedAvailableCarbohydratePerServingG > 0) assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoadOmission(new Intl.NumberFormat({ fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale], { maximumSignificantDigits: 1 }).format(result.omittedAvailableCarbohydratePerServingG))), `${result.recipeId}/${recipe.locale}: omitted small carbohydrate is disclosed`);
        const displayNumber = new Intl.NumberFormat({ fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale], result.assessmentType ? {maximumFractionDigits:0} : {maximumSignificantDigits:1,minimumSignificantDigits:1});
        const displayed = result.glycemicLoadRangePerServing
          ? `${displayNumber.format(result.glycemicLoadRangePerServing.min)}–${displayNumber.format(result.glycemicLoadRangePerServing.max)}`
          : displayNumber.format(result.glycemicLoadPerServing);
        assert.ok(html.includes(displayed), `${result.recipeId}/${recipe.locale}: displayed GL value`);
        assert.ok(result.sourceReferences.length > 0, `${result.recipeId}: calculated result has source references`);
      } else {
        assert.ok(!html.includes(recipeUi[recipe.locale].glycemicLoad), `${result.recipeId}/${recipe.locale}: incomplete GK stays hidden`);
      }
    }
  }
  const pasteBlocker = glycemicLoadPilotResults.find((result) => result.recipeId === "kookos-lime-kanacurry");
  assert.ok(pasteBlocker?.incompleteReasons.length, "incomplete recipe includes a structured reason");
  const methodPagePaths = { fi: "glykeeminen-kuorma", en: "en/glycemic-load", sv: "sv/glykemisk-belastning", th: "th/glycemic-load" };
  const labels = { fi: "Miksi kokonaisarviota ei ole?", en: "Why is there no total estimate?", sv: "Varför saknas ett totalvärde?", th: "เหตุใดจึงไม่มีค่าประมาณรวม" };
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const html = await readFile(path.join(dist, methodPagePaths[locale], "index.html"), "utf8");
    const resultStart = html.indexOf('id="kookos-lime-kanacurry"');
    assert.ok(resultStart >= 0 && html.slice(resultStart, resultStart + 1_500).includes(labels[locale]), `${locale}: missing-result explanation is localized`);
  }
  const massaman = glycemicLoadPilotResults.find((result) => result.recipeId === "massaman-curry-kanalla-vhh");
  assert.ok(massaman, "Massaman stays represented in the central audit");
  assert.equal(glycemicLoadPilotResults.some((result) => result.recipeId === "maksalaatikko-kukkakaalilla"), false);
});

test("GI proxy matches remain visibly low confidence and incomplete totals are withheld", () => {
  for (const result of glycemicLoadPilotResults) {
    if (result.status === "INSUFFICIENT SOURCE DATA") assert.equal(result.glycemicLoadPerServing, null, `${result.recipeId}: no partial total`);
    if (result.status === "CALCULATED") {
      assert.notEqual(result.glycemicLoadPerServing, null, `${result.recipeId}: complete total`);
      if (result.sourceReferences.some((source) => source.matchKind === "ANALOG" || source.matchKind === "CATEGORY_MEAN")) {
        assert.equal(result.confidence, "LOW", `${result.recipeId}: proxy match lowers confidence`);
      }
    }
  }
});

test("localized central GL pages render complete SEO metadata with canonical and hreflang links", async () => {
  const pages = [
    { route: "glykeeminen-kuorma", locale: "fi", ogLocale: "fi_FI", title: "Glykeeminen kuorma: lähteet ja laskenta | Reseptit", description: "Reseptien glykeemisen kuorman laskentatapa, lähteet ja reseptikohtaiset oletukset.", canonical: "https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/" },
    { route: "en/glycemic-load", locale: "en", ogLocale: "en_GB", title: "Glycemic load: sources and method | Recipes", description: "Calculation method, sources and recipe-specific assumptions for glycemic-load estimates.", canonical: "https://ozirix-dev.github.io/Reseptit/en/glycemic-load/" },
    { route: "sv/glykemisk-belastning", locale: "sv", ogLocale: "sv_SE", title: "Glykemisk belastning: källor och metod | Recept", description: "Beräkningsmetod, källor och receptspecifika antaganden för uppskattningar av glykemisk belastning.", canonical: "https://ozirix-dev.github.io/Reseptit/sv/glykemisk-belastning/" },
    { route: "th/glycemic-load", locale: "th", ogLocale: "th_TH", title: "ภาระน้ำตาลในเลือด: แหล่งข้อมูลและวิธีคำนวณ | สูตรอาหาร", description: "วิธีคำนวณ แหล่งข้อมูล และสมมติฐานเฉพาะสูตรสำหรับค่าประมาณภาระน้ำตาลในเลือด", canonical: "https://ozirix-dev.github.io/Reseptit/th/glycemic-load/" },
  ];
  for (const page of pages) {
    const html = await readFile(path.join(dist, page.route, "index.html"), "utf8");
    assert.ok(html.includes(`<title>${page.title}</title>`));
    assert.ok(html.includes(`<meta name="description" content="${page.description}"`));
    assert.ok(html.includes(`<link rel="canonical" href="${page.canonical}"`));
    assert.ok(html.includes(`<meta property="og:title" content="${page.title}"`));
    assert.ok(html.includes(`<meta property="og:description" content="${page.description}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${page.canonical}"`));
    assert.ok(html.includes(`<meta property="og:locale" content="${page.ogLocale}"`));
    assert.ok(html.includes('<meta property="og:type" content="website"'));
    assert.ok(html.includes('<meta name="twitter:card" content="summary"'));
    assert.ok(html.includes(`<meta name="twitter:title" content="${page.title}"`));
    assert.ok(html.includes(`<meta name="twitter:description" content="${page.description}"`));
    assert.doesNotMatch(html, /<meta name="robots" content="noindex,follow">/);
    assert.match(html, new RegExp(`<html lang="${page.locale}">`));
    assert.match(html, /<h1/);
    assert.match(html, /hreflang="fi"/);
    assert.match(html, /hreflang="en"/);
    assert.match(html, /hreflang="sv"/);
    assert.match(html, /hreflang="th"/);
    assert.match(html, /hreflang="x-default"/);
    const liverResult = html.match(/<aside id="maksalaatikko-kukkakaalilla"[\s\S]*?<\/aside>/);
    assert.ok(liverResult, "the liver recipe has a centralized explanation");
    assert.doesNotMatch(liverResult[0], /GK-arvio|GL estimate|GL-uppskattning|GL-uppskattning|3,45 \/ annos/);
  }
});

test("prerendered recipe HTML includes useful content before JavaScript", async () => {
  const html = await readFile(path.join(dist, "kermainen-lohipata", "index.html"), "utf8");
  const root = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  assert.ok(root, "root element contains prerendered markup");
  assert.match(root[1], /<h1>Kermainen lohipata<\/h1>/);
  assert.match(root[1], /<h2 id="recipe-ingredients-title">Ainekset<\/h2>/);
  assert.match(root[1], /lohifilee/);
  assert.match(root[1], /<h2 id="recipe-instructions" tabindex="-1">Valmistus<\/h2>/);
  assert.match(root[1], /<h2>Ravintoarvot annosta kohti<\/h2>/);
  assert.match(html, /<html lang="fi">/);
  assert.match(html, /rel="canonical" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kermainen-lohipata\/"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kermainen-lohipata\/"/);
  assert.match(root[1], /class="recipe-languages"/);
  assert.match(root[1], /hrefLang="en" href="\/Reseptit\/en\/recipes\/kermainen-lohipata\/"/);
  assert.match(root[1], /hrefLang="sv" href="\/Reseptit\/sv\/recept\/kermainen-lohipata\/"/);
  assert.match(root[1], /hrefLang="th" href="\/Reseptit\/th\/recipes\/kermainen-lohipata\/"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /property="og:image" content="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\/paaruoat\/kermainen-lohipata\.webp"/);
  assert.match(root[1], /<img class="recipe-image" src="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\/paaruoat\/kermainen-lohipata\.webp"[^>]* alt="Kermainen lohipata lohipaloilla, pinaatilla ja tillillä" width="1254" height="1254"/);
  const jsonLdMatch = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch);
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Recipe");
  assert.equal(jsonLd.name, "Kermainen lohipata");
  assert.equal(jsonLd.recipeYield, "4");
  assert.deepEqual(jsonLd.image, ["https://ozirix-dev.github.io/Reseptit/kuvat/paaruoat/kermainen-lohipata.webp"]);
  assert.equal("author" in jsonLd, false);
  assert.equal("datePublished" in jsonLd, false);
  assert.equal("aggregateRating" in jsonLd, false);
});

test("translated macaroni bake pages have localized content, SEO metadata and matching recipe data", async () => {
  const expected = [
    { file: "en/recipes/high-protein-beef-macaroni-bake", locale: "en", title: "High-Protein Beef Macaroni Bake", route: "/en/recipes/high-protein-beef-macaroni-bake/", instructionHeading: "Method" },
    { file: "sv/recept/proteinrik-makaronilada-med-kottfars", locale: "sv", title: "Proteinrik makaronilåda med köttfärs", route: "/sv/recept/proteinrik-makaronilada-med-kottfars/", instructionHeading: "Gör så här" },
    { file: "th/recipes/makaroni-op-nuea-bot-protein-sung", locale: "th", title: "มักกะโรนีอบเนื้อบดโปรตีนสูง", route: "/th/recipes/makaroni-op-nuea-bot-protein-sung/", instructionHeading: "วิธีทำ" },
  ];
  const hreflangPaths = [
    ["fi", "/jauheliha-makaronilaatikko/"],
    ["en", "/en/recipes/high-protein-beef-macaroni-bake/"],
    ["sv", "/sv/recept/proteinrik-makaronilada-med-kottfars/"],
    ["th", "/th/recipes/makaroni-op-nuea-bot-protein-sung/"],
  ];
  for (const translation of expected) {
    const html = await readFile(path.join(dist, translation.file, "index.html"), "utf8");
    const root = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
    assert.ok(root, `${translation.locale} page has prerendered content`);
    assert.match(html, new RegExp(`<html lang="${translation.locale}">`));
    assert.ok(root[1].includes(`<h1>${translation.title}</h1>`));
    assert.ok(root[1].includes(`<h2 id="recipe-instructions" tabindex="-1">${translation.instructionHeading}</h2>`));
    assert.match(root[1], /class="recipe-languages"/);
    assert.match(root[1], /jauheliha-makaronilaatikko\.webp/);
    assert.ok(html.includes(`rel="canonical" href="https://ozirix-dev.github.io/Reseptit${translation.route}"`));
    for (const [locale, route] of hreflangPaths) {
      assert.ok(html.includes(`hreflang="${locale}" href="https://ozirix-dev.github.io/Reseptit${route}"`));
    }
    assert.ok(html.includes("hreflang=\"x-default\" href=\"https://ozirix-dev.github.io/Reseptit/jauheliha-makaronilaatikko/\""));
    const jsonLdMatch = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch);
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    assert.equal(jsonLd.name, translation.title);
    assert.equal(jsonLd.inLanguage, translation.locale);
    assert.equal(jsonLd.recipeYield, "8");
    assert.equal(jsonLd.recipeInstructions.length, 7);
    assert.equal(jsonLd.nutrition.proteinContent, "47.63 g");
    assert.deepEqual(jsonLd.image, ["https://ozirix-dev.github.io/Reseptit/kuvat/paaruoat/jauheliha-makaronilaatikko.webp"]);
  }
});

test("published keto bun page includes its content and omitted amounts remain omitted", async () => {
  const html = await readFile(path.join(dist, "keto-kauralesesampylat", "index.html"), "utf8");
  assert.match(html, /<h1>Keto-kauralesesämpylät<\/h1>/);
  assert.match(html, /seesaminsiemeniä/);
  assert.match(html, /halutessasi pinnalle/);
  assert.match(html, /Psyllium sitoo pehmeää taikinaa/);
  assert.doesNotMatch(html, /raakileiden raejuustopohja/);
  assert.match(html, /src="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\/leivonnaiset\/keto-kauralesesampylat\.webp"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /"image":\["https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\/leivonnaiset\/keto-kauralesesampylat\.webp"\]/);
});

test("unknown route output has no canonical or recipe structured data", async () => {
  const html = await readFile(path.join(dist, "404.html"), "utf8");
  assert.match(html, /<h1>Sivua ei löytynyt<\/h1>/);
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.doesNotMatch(html, /rel="canonical"|recipe-jsonld|"@type":"Recipe"/);
  assert.doesNotMatch(html, /hreflang=|x-default/);
  assert.doesNotMatch(html, /<script type="module"/);
});

test("sitemap and project robots reference the real Pages path", async () => {
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
  assert.match(sitemap, /https:\/\/ozirix-dev\.github\.io\/Reseptit\/kermainen-lohipata\//);
  assert.match(sitemap, /https:\/\/ozirix-dev\.github\.io\/Reseptit\/keto-kauralesesampylat\//);
  assert.match(sitemap, /https:\/\/ozirix-dev\.github\.io\/Reseptit\/en\/recipes\/high-protein-beef-macaroni-bake\//);
  assert.match(sitemap, /https:\/\/ozirix-dev\.github\.io\/Reseptit\/sv\/recept\/proteinrik-makaronilada-med-kottfars\//);
  assert.match(sitemap, /https:\/\/ozirix-dev\.github\.io\/Reseptit\/th\/recipes\/makaroni-op-nuea-bot-protein-sung\//);
  assert.doesNotMatch(sitemap, /https:\/\/ozirix-dev\.github\.io\/Reseptit\/kaalilaatikko\//);
  assert.doesNotMatch(sitemap, /raakileet|\.md/);
  assert.doesNotMatch(sitemap, /\?(?:q|category|diet)=/);
  assert.match(robots, /Project-path robots\.txt/);
  assert.match(robots, /Sitemap: https:\/\/ozirix-dev\.github\.io\/Reseptit\/sitemap\.xml/);
});

test("Google Search Console ownership verification file is published at the Pages root", async () => {
  const verification = await readFile(path.join(dist, "google0c6f9c0486376f0f.html"), "utf8");
  assert.equal(verification, "google-site-verification: google0c6f9c0486376f0f.html");
});

test("P2/P3 corrections reach static titles, route data and Recipe JSON-LD", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  const times: Record<string, number> = { "pekingin-ankka": 510, gazpacho: 80, "pizza-margherita": 100, tandoorikana: 130, "char-siu": 90, "chole-bhature": 900 };
  const renamed = ["keto-pinaattiletut", "keto-pannukakku", "keto-joulutortut", "keto-korvapuustit", "ketopizza-pofiber-pohjalla"];
  const recipes = siteContent.recipes.filter((recipe) => recipe.recipeId in times || renamed.includes(recipe.recipeId));
  assert.equal(recipes.length, 44);
  for (const recipe of recipes) {
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const jsonld = JSON.parse(html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    const page = JSON.parse(html.match(/<script id="page-content" type="application\/json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(jsonld.name, recipe.title);
    assert.equal(page.recipe.title, recipe.title);
    assert.ok(html.includes(`<h1>${recipe.title}</h1>`));
    assert.ok(html.includes(`rel="canonical" href="https://ozirix-dev.github.io/Reseptit${recipe.routePath}"`));
    if (recipe.recipeId in times) assert.equal(jsonld.totalTime, `PT${times[recipe.recipeId]}M`);
    if (renamed.includes(recipe.recipeId)) {
      assert.equal(page.recipe.dietClass, null);
      assert.doesNotMatch([jsonld.name, jsonld.keywords, jsonld.description].join(" "), /keto|คีโต|\bVHH\b|low.carb|lågkolhydrat/i);
    }
  }
});


test("translation self-review corrections are present in static HTML and recipe metadata", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  const cases = [
    ["keto-kauralesesampylat", "th", "รำข้าวโอ๊ตมีคาร์โบไฮเดรต", "รำข้าวโอ๊ตไม่มีคาร์โบไฮเดรต"],
    ["char-siu", "th", "ผงพะโล้จีน", "โหระพา"],
    ["lihapullat-kermakastikkeessa-vhh", "en", "for the mash", "to muse"],
    ["nakkikeitto-kukkakaalilla", "sv", "varmkorv", "smycke"],
    ["rogan-josh", "en", "curdling", "does not run"],
    ["tunisialainen-brik", "th", "ทอดบริก", "น้ำมูก"],
  ] as const;
  for (const [id, locale, expected, rejected] of cases) {
    const recipe = siteContent.recipes.find((r) => r.recipeId === id && r.locale === locale)!;
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    assert.ok(html.includes(expected), `${id}/${locale}: visible correction`);
    assert.ok(!html.includes(rejected), `${id}/${locale}: no old mistranslation`);
    const schema = JSON.parse(html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(schema.name, recipe.title);
    assert.ok(html.includes(`rel="canonical" href="https://ozirix-dev.github.io/Reseptit${recipe.routePath}"`));
  }
});

test("responsive image metadata reaches every route, SEO and matching preloads", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  const { contentManifest } = await import("../src/generated/routes.generated");
  const { recipeCardSizes, recipeHeroSizes } = await import("../src/features/recipes/image-layout");
  const { createHash } = await import("node:crypto");
  const attributes = (tag: string) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1].toLowerCase(), m[2]]));
  for (const [route, filename] of Object.entries(contentManifest)) {
    const html = await readFile(path.join(dist, route.slice(1), "index.html"), "utf8");
    const recipe = siteContent.recipes.find((r) => r.routePath === route);
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => attributes(m[0]));
    const payloadText = await readFile(path.join(dist, "data", filename), "utf8");
    assert.equal(filename, `${createHash("sha256").update(payloadText).digest("hex").slice(0, 20)}.json`);
    const payload = JSON.parse(payloadText);
    const expected = recipe ? [recipe] : payload.recipes;
    assert.equal(imgs.length, expected.filter((r: {image: unknown}) => r.image).length);
    for (const r of expected) {
      if (!r.image) continue;
      const img = imgs.find((image) => image.src === r.image.src)!;
      assert.ok(img, route);
      assert.equal(img.srcset, r.image.srcSet);
      assert.equal(img.sizes, recipe ? recipeHeroSizes : recipeCardSizes);
      assert.equal(Number(img.width), r.image.width);
      assert.equal(Number(img.height), r.image.height);
      assert.ok(img.alt);
      for (const candidate of img.srcset.split(", ")) {
        const [url, width] = candidate.split(" ");
        assert.match(url, /^https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\//);
        assert.match(width, /^\d+w$/);
        assert.ok((await readFile(path.join(dist, "kuvat", url.split("/kuvat/")[1]))).length);
      }
    }
    for (const tag of html.matchAll(/<link rel="preload" as="image"[^>]*>/g)) {
      const preload = attributes(tag[0]);
      const img = imgs.find((image) => image.srcset === preload.imagesrcset);
      assert.ok(img, `${route}: preload must match an image`);
      assert.equal(preload.imagesizes, img.sizes);
      if (preload.href) assert.equal(preload.href, img.src);
    }
    assert.ok(html.includes(`rel="canonical" href="https://ozirix-dev.github.io/Reseptit${route}"`));
    if (recipe) {
      assert.deepEqual(payload.recipe.image, recipe.image);
      const schema = JSON.parse(html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
      if (recipe.image) {
        assert.deepEqual(schema.image, [recipe.image.src]);
        assert.ok(html.includes(`property="og:image" content="${recipe.image.src}"`));
      }
      for (const translation of siteContent.recipes.filter((r) => r.recipeId === recipe.recipeId)) {
        assert.ok(html.includes(`hreflang="${translation.locale}" href="https://ozirix-dev.github.io/Reseptit${translation.routePath}"`));
      }
    }
  }
});

test('all twelve candidate recipe pages show the modeled label and carbohydrate information',async()=>{
  const manifest=JSON.parse(await readFile(path.resolve(import.meta.dirname,'../../docs/nutrition/gk80-release-3/manifest.json'),'utf8'));
  for(const id of manifest.recipeIds){const r=siteContent.recipes.find(r=>r.recipeId===id&&r.locale==='fi')!;
    const html=await readFile(path.join(dist,r.routePath.slice(1),'index.html'),'utf8');
    assert.match(html,/Mallinnettu/);assert.match(html,/hiilihydraatit/i);assert.match(html,/Luottamus|luottamus/);
  }
});
