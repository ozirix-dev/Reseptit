import { estimateBasis, evidenceLabel, gkCopy, missingReason } from "../src/features/glycemic-load/glycemic-load-copy";
import {gkOnlyVariants,gkVersionCoverage} from '../src/generated/gk-only-variants.generated';
import {loadAuthorizedGk100Variants} from '../scripts/gk100-approval-release';
import {gkOnlyUi,gkOnlyValue,gkScopeUi,studyServingTitle} from '../src/features/recipes/GkOnlyVariantPanel';
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
  assert.equal(glycemicLoadPilotResults.length, audit.results.length);
  assert.equal(glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED").length, audit.results.filter((result) => result.status === "CALCULATED").length);
  assert.equal(glycemicLoadPilotResults.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length, audit.results.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length);
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
  const op146Ids=new Set(JSON.parse(await readFile(path.resolve(import.meta.dirname,'../../docs/nutrition/gk80-operation146/integration.json'),'utf8')).recipes.map((e:any)=>e.recipeId));
  for (const id of bakeryReview.withdrawnRecipeIds) {
    const result = glycemicLoadPilotResults.find(entry => entry.recipeId === id);
    if(op146Ids.has(id)){assert.equal(result?.status,'CALCULATED',`${id}: fresh source-bound operation146 replacement`);continue;}
    assert.equal(result?.status, "INSUFFICIENT SOURCE DATA", `${id}: bakery source withdrawal is public`);
    assert.equal(result?.glycemicLoadPerServing, null);
  }
  const releaseManifest=JSON.parse(await readFile(path.resolve(import.meta.dirname,'../../docs/nutrition/gk80-q09/manifest.json'),'utf8'));
  const releaseIds=new Set<string>(releaseManifest.recipeIds);
  assert.deepEqual(audit.results.filter(result=>result.status==='CALCULATED'&&releaseIds.has(result.recipeId)).map(result=>result.recipeId).sort(),[...releaseIds].sort());
  assert.equal(audit.results.filter(result=>result.status==='CALCULATED'&&!releaseIds.has(result.recipeId)).length,148,'156 current estimates outside the eight Q09 entries');
  assert.equal(audit.results.filter(result=>result.status==='CALCULATED').length,156,'operation146 adds exactly nine complete-macro GK candidates to147 main results');
  const paella = glycemicLoadPilotResults.find((entry) => entry.recipeId === "paella-valenciana");
  assert.equal(paella?.status, "INSUFFICIENT SOURCE DATA", "Paella remains blocked without a suitable chicken-stock GI source");
  assert.equal(paella?.glycemicLoadPerServing, null);
  const calculatedWithOmissions = glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED" && result.omittedAvailableCarbohydratePerServingG > 0);
  assert.ok(calculatedWithOmissions.every((result) => result.confidence === "LOW"), "omitted carbohydrate always lowers estimate confidence");
  const zeroWithOmissions = glycemicLoadPilotResults.filter((result) => result.status === "CALCULATED" && result.glycemicLoadPerServing === 0 && result.omittedAvailableCarbohydratePerServingG > 0);
  assert.deepEqual(zeroWithOmissions.map(row => row.recipeId).sort(), audit.results.filter(row => row.status === "CALCULATED" && row.glycemicLoadPerServing === 0 && row.omittedAvailableCarbohydratePerServingG > 0).map(row => row.recipeId).sort());
  assert.deepEqual(zeroWithOmissions,[], 'Q09 removes every known positive-CHO zero');
  for (const result of glycemicLoadPilotResults) {
    const translations = siteContent.recipes.filter((recipe) => recipe.recipeId === result.recipeId);
    assert.ok(translations.some((recipe) => recipe.locale === "fi"), `${result.recipeId}: Finnish recipe exists`);
    for (const recipe of translations) {
      const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
      if (result.status === "CALCULATED" && result.glycemicLoadPerServing !== null) {
        assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoad));
        assert.ok(html.includes(gkCopy[recipe.locale].see));
        assert.ok(html.includes(`${recipe.locale === "fi" ? "/Reseptit" : "/Reseptit"}${recipe.locale === "fi" ? "/glykeeminen-kuorma/" : recipe.locale === "en" ? "/en/glycemic-load/" : recipe.locale === "sv" ? "/sv/glykemisk-belastning/" : "/th/glycemic-load/"}#${result.recipeId}`));
        assert.ok(result.confidence && html.includes(gkCopy[recipe.locale].levelNotes[result.confidence]), `${result.recipeId}/${recipe.locale}: confidence is visible`);
        if (result.omittedAvailableCarbohydratePerServingG > 0) assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoadOmission(new Intl.NumberFormat({ fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale], { maximumSignificantDigits: 1 }).format(result.omittedAvailableCarbohydratePerServingG))), `${result.recipeId}/${recipe.locale}: omitted small carbohydrate is disclosed`);
        const displayNumber = new Intl.NumberFormat({ fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale], result.assessmentType ? {maximumFractionDigits:0} : {maximumSignificantDigits:1,minimumSignificantDigits:1});
        const displayed = result.glycemicLoadRangePerServing
          ? `${displayNumber.format(result.glycemicLoadRangePerServing.min)}–${displayNumber.format(result.glycemicLoadRangePerServing.max)}`
          : displayNumber.format(result.glycemicLoadPerServing);
        assert.ok(html.includes(displayed), `${result.recipeId}/${recipe.locale}: displayed GL value`);
        assert.ok(result.sourceReferences.length > 0, `${result.recipeId}: calculated result has source references`);
      } else {
        if(gkOnlyVariants.some(v=>v.recipeId===result.recipeId)){
          assert.ok(html.includes('data-macro-scope="NO_MACRO_PACKAGE_FOR_THIS_VERSION"'),`${result.recipeId}/${recipe.locale}: separately approved GK-only version is explicit`);
          assert.ok(!html.includes('class="recipe-glycemic-load"'),`${result.recipeId}/${recipe.locale}: original incomplete GK is not relabeled as complete`);
        }else assert.ok(!html.includes(recipeUi[recipe.locale].glycemicLoad), `${result.recipeId}/${recipe.locale}: incomplete GK stays hidden`);
      }
    }
  }
  const pasteBlocker = glycemicLoadPilotResults.find((result) => result.recipeId === "kookos-lime-kanacurry");
  assert.ok(pasteBlocker?.incompleteReasons.length, "incomplete recipe includes a structured reason");
  const methodPagePaths = { fi: "glykeeminen-kuorma", en: "en/glycemic-load", sv: "sv/glykemisk-belastning", th: "th/glycemic-load" };
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const html = await readFile(path.join(dist, methodPagePaths[locale], "index.html"), "utf8");
    assert.ok(html.includes("Kikherne, kypsä tai säilyke"), "Fineli source label displays Finnish characters");
    assert.ok(html.includes("TÄYSMEHU, SITRUUNATÄYSMEHU, LAIMENTAMATON"), "Fineli source label displays uppercase Ä");
    assert.ok(!html.includes("kypsÃ¤ tai sÃ¤ilyke"));
    const resultStart = html.indexOf('id="kookos-lime-kanacurry"');
    assert.ok(resultStart >= 0 && html.slice(resultStart, resultStart + 1_500).includes(gkCopy[locale].why), `${locale}: missing-result explanation is localized`);
  }
  const massaman = glycemicLoadPilotResults.find((result) => result.recipeId === "massaman-curry-kanalla-vhh");
  assert.ok(massaman, "Massaman stays represented in the central audit");
  const liver = glycemicLoadPilotResults.find((result) => result.recipeId === "maksalaatikko-kukkakaalilla");
  assert.equal(liver?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(liver?.glycemicLoadPerServing, null);
  assert.equal(liver?.glycemicLoadRangePerServing, null);
  assert.deepEqual(liver?.carbohydrateSources, []);
  assert.deepEqual(liver?.sourceReferences, []);
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
    { route: "glykeeminen-kuorma", locale: "fi", ogLocale: "fi_FI", title: "Reseptien glykeeminen kuorma (GK) | Reseptit", description: "Löydä reseptien glykeemisen kuorman (GK) arviot, luotettavuustiedot ja tarvittaessa tarkat laskentalähteet.", canonical: "https://ozirix-dev.github.io/Reseptit/glykeeminen-kuorma/" },
    { route: "en/glycemic-load", locale: "en", ogLocale: "en_GB", title: "Glycemic load (GL) of recipes | Recipes", description: "Explore calculated glycemic load estimates for recipes, their reliability and detailed sources.", canonical: "https://ozirix-dev.github.io/Reseptit/en/glycemic-load/" },
    { route: "sv/glykemisk-belastning", locale: "sv", ogLocale: "sv_SE", title: "Receptens glykemiska belastning (GL) | Recept", description: "Hitta uppskattningar av receptens glykemiska belastning, säkerhet och detaljerade källor.", canonical: "https://ozirix-dev.github.io/Reseptit/sv/glykemisk-belastning/" },
    { route: "th/glycemic-load", locale: "th", ogLocale: "th_TH", title: "ค่าภาระน้ำตาลในเลือด (GL) ของสูตรอาหาร | สูตรอาหาร", description: "ค้นหาค่าภาระน้ำตาลในเลือด (GL) ของสูตรอาหาร พร้อมระดับความน่าเชื่อถือและแหล่งข้อมูลการคำนวณ", canonical: "https://ozirix-dev.github.io/Reseptit/th/glycemic-load/" },
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
    const liverResult = html.match(/<li id="maksalaatikko-kukkakaalilla"[\s\S]*?<\/li>/);
    assert.ok(liverResult, "the liver recipe is in the prerendered results");
    assert.match(liverResult[0], /GI/);
    assert.doesNotMatch(liverResult[0], /<details|3[.,]45/);
    assert.equal(html.match(/id="maksalaatikko-kukkakaalilla"/g)?.length, 1);
  }
});

test("GK evidence copy separates measured, comparison, modeled, and unrecognized inputs", () => {
  assert.equal(evidenceLabel({ matchKind: "EXACT", evidenceKind: "HUMAN_GI", applicationKind: "DIRECT" }), "direct");
  assert.equal(evidenceLabel({ matchKind: "EXACT" }), "published");
  assert.equal(evidenceLabel({ matchKind: "CATEGORY_MEAN" }), "categoryMean");
  assert.equal(estimateBasis({ sourceReferences: [{ matchKind: "CATEGORY_MEAN" }] }), "comparison");
  assert.equal(evidenceLabel({ matchKind: "CALCULATION_POLICY", evidenceKind: "PUBLISHED_IMPUTATION" }), "model");
  assert.equal(estimateBasis({ sourceReferences: [{ matchKind: "EXACT", evidenceKind: "UNRECOGNIZED" }] }), "unknown");
  assert.equal(missingReason("fi", "CONFLICT"), gkCopy.fi.blockers.CONFLICT);
  assert.equal(missingReason("fi", "UNRECOGNIZED"), gkCopy.fi.blockers.UNKNOWN);
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
  const manifest=JSON.parse(await readFile(path.resolve(import.meta.dirname,'../../docs/nutrition/gk80-q09/manifest.json'),'utf8'));
  for(const id of manifest.recipeIds){const r=siteContent.recipes.find(r=>r.recipeId===id&&r.locale==='fi')!;
    const html=await readFile(path.join(dist,r.routePath.slice(1),'index.html'),'utf8');
    assert.match(html,/Mallinnettu/);assert.match(html,/hiilihydraatit/i);assert.match(html,/Luotettavuus/);
  }
});

test('modeled calculation details disclose omissions in every locale and retain omission-free controls',async()=>{
  const copy={
    fi:{omitted:'Dokumentoituja pieniä osuuksia on jätetty pois',none:'Ei pieniä pois jätettyjä osuuksia',method:'Mahdolliset pienet poisrajaukset',path:'glykeeminen-kuorma',oldMethod:'Tässä polussa kaikki imeytyvät hiilihydraatit lasketaan mukaan eikä pieniä osuuksia jätetä pois.'},
    en:{omitted:'Documented small portions are omitted',none:'no small portions omitted',method:'Any small portions omitted',path:'en/glycemic-load',oldMethod:'This path includes all available carbohydrate and omits no small portions.'},
    sv:{omitted:'Dokumenterade små mängder har utelämnats',none:'utan utelämnade små mängder',method:'Eventuella utelämnade små mängder',path:'sv/glykemisk-belastning',oldMethod:'Här räknas alla tillgängliga kolhydrater med utan utelämnade små mängder.'},
    th:{omitted:'การคำนวณนี้ไม่รวมส่วนผสมปริมาณเล็กน้อย',none:'โดยไม่ตัดส่วนเล็กน้อยออก',method:'หากมีส่วนผสมปริมาณเล็กน้อยที่ไม่รวมในการคำนวณ',path:'th/glycemic-load',oldMethod:'แนวทางนี้รวมคาร์โบไฮเดรตที่ใช้ได้ทั้งหมดโดยไม่ตัดส่วนเล็กน้อยออก'},
  };
  for(const locale of ['fi','en','sv','th'] as const){
    let omitted=0,complete=0;const expected=copy[locale];
    for(const result of glycemicLoadPilotResults.filter(r=>r.status==='CALCULATED'&&r.assessmentType&&!r.closedRecoveryC&&!r.boundedPolyolC)){
      const recipe=siteContent.recipes.find(r=>r.recipeId===result.recipeId&&r.locale===locale);if(!recipe)continue;
      const html=await readFile(path.join(dist,recipe.routePath.slice(1),'index.html'),'utf8');
      const caption=html.match(/<details class="gk-evidence__details">([\s\S]*?)<\/details>/)![1].replace(/<[^>]+>/g,'');
      if(result.omittedAvailableCarbohydratePerServingG>0){omitted++;assert.ok(caption.includes(expected.omitted),recipe.recipeId+'/'+locale);assert.ok(!caption.includes(expected.none),recipe.recipeId+'/'+locale+': no contradictory completeness claim');}
      else{complete++;assert.ok(caption.includes(expected.none),recipe.recipeId+'/'+locale+': omission-free disclosure retained');assert.ok(!caption.includes(expected.omitted));}
    }
    assert.ok(omitted>=10,locale+': all ten new omission cases covered');assert.ok(complete>0,locale+': real omission-free control covered');
    const method=await readFile(path.join(dist,expected.path,'index.html'),'utf8');assert.ok(method.includes(expected.method),locale);assert.ok(!method.includes(expected.oldMethod),locale+': central method is consistent');
  }
});

test('approved GK-only versions appear on each locale and home-recipe coverage is reported separately',async()=>{
 let pages=0;
 for(const variant of gkOnlyVariants){
  for(const recipe of siteContent.recipes.filter(r=>r.recipeId===variant.recipeId)){
   const html=await readFile(path.join(dist,recipe.routePath.slice(1),'index.html'),'utf8'),t=gkOnlyUi[recipe.locale];
   assert.ok(html.includes(`data-gk-version="${variant.versionId}"`),recipe.routePath);
   if (variant.studyServing) {
     const panel = html.match(new RegExp(`<section[^>]*data-gk-version="${variant.versionId}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
     assert.ok(panel, recipe.routePath);
     const [summary] = panel.split('<details');
     assert.ok(summary.includes(studyServingTitle[recipe.locale]), recipe.routePath);
     const limitation = variant.limitation![recipe.locale]
       .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
       .replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
     assert.ok(summary.includes(limitation), recipe.routePath);
   } else {
     assert.ok(html.includes(t.scope));assert.ok(html.includes(t.low));
   }
   assert.ok(html.includes(gkScopeUi[recipe.locale].macroNotice));assert.ok(html.includes('data-nutrition-scope="ORIGINAL_RECIPE"'));assert.ok(html.includes('data-macro-separation="gk-only"'));assert.ok(html.includes(gkOnlyValue(variant,recipe.locale)));
   const originalHasGk = glycemicLoadPilotResults.some(result => result.recipeId === variant.recipeId
     && result.status === 'CALCULATED' && result.glycemicLoadPerServing !== null);
   assert.equal(html.includes('class="recipe-glycemic-load"'), originalHasGk, recipe.routePath);
   if(variant.scenarioRange)assert.ok(html.includes(t.range));if(variant.sensitivity)assert.ok(html.includes(t.sensitivityNote));
   const addedTorrasPage = (recipe.locale === "en" && ["keto-mutakakku", "keto-suklaakeksit"].includes(recipe.recipeId))
     || (recipe.recipeId === "keto-mutakakku" && (recipe.locale === "sv" || recipe.locale === "th"))
     || (recipe.recipeId === "keto-suklaakeksit" && (recipe.locale === "sv" || recipe.locale === "th"));
   if (!addedTorrasPage) pages++;
  }
 }
 const releases=loadAuthorizedGk100Variants(path.resolve(import.meta.dirname,'../..'));
 const additionalPages=releases.reduce((sum,v)=>sum+siteContent.recipes.filter(r=>r.recipeId===v.recipeId).length,0);
 assert.equal(pages,101+siteContent.recipes.filter(r=>r.recipeId==='lindstrominpihvit-kaalilla').length+additionalPages);
 for(const p of ['glykeeminen-kuorma','en/glycemic-load','sv/glykemisk-belastning','th/glycemic-load']){
  const html=await readFile(path.join(dist,p,'index.html'),'utf8');assert.ok(html.replaceAll('<!-- -->','').includes(`data-gk-coverage="version-aware"><li><strong>${gkVersionCoverage.numericRecipes}</strong> / ${gkVersionCoverage.total}`));assert.ok(html.includes(`<strong>${gkVersionCoverage.missing}</strong>`));assert.ok(html.includes('data-gk-coverage="version-aware"'));assert.ok(html.includes('data-gk-coverage="original"'));assert.ok(html.includes('<strong>156</strong>'));assert.ok(html.includes('<strong>170</strong>'));
  for(const v of gkOnlyVariants)assert.ok(html.includes(`data-gk-version="${v.versionId}"`));
 }
});

test("Swedish and Thai keto mud cake show only the approved modified GL and its sources", async () => {
  const variant = gkOnlyVariants.find((entry) => entry.recipeId === "keto-mutakakku");
  assert.ok(variant);
  for (const [locale, route] of [["sv", "sv/recept"], ["th", "th/recipes"]] as const) {
    const html = await readFile(path.join(dist, route, "keto-mutakakku", "index.html"), "utf8");
    const panel: string | undefined = html.match(new RegExp(`<section[^>]*data-gk-version="${variant.versionId}"[^>]*>([\\s\\S]*?)</section>`))?.[1];
    assert.ok(panel, locale);
    assert.ok(panel.includes(gkCopy[locale].modified));
    assert.ok(panel.includes(gkScopeUi[locale].originalMissing));
    assert.ok(panel.includes(gkOnlyValue(variant, locale)));
    assert.ok(panel.includes(gkCopy[locale].sources));
    assert.ok(panel.includes("gk-evidence__technical"));
    for (const { url } of variant.sources.filter(({ url }) => url.startsWith("https://"))) {
      assert.ok(panel.includes(`href="${url.replaceAll("&", "&amp;")}"`), `${locale}: ${url}`);
    }
    assert.ok(!html.includes('class="recipe-glycemic-load"'));
  }
});

test("all three English Torras comparisons are present with both products", async () => {
  for (const slug of ["keto-mutakakku", "keto-suklaakeksit", "meheva-suklaakakku"]) {
    const html = await readFile(path.join(dist, "en/recipes", slug, "index.html"), "utf8");
    assert.match(html, /data-chocolate-comparison="en"/, slug);
    assert.match(html, /data-chocolate-product="torras-maltitol"/, slug);
    assert.match(html, /data-chocolate-product="torras-stevia"/, slug);
    if (slug.startsWith("keto-")) assert.match(html, /calculated part below 1/, slug);
  }
});

test("Swedish and Thai Torras comparisons include both products on the published recipe pages", async () => {
  for (const [locale, route, calculatedPart] of [
    ["sv", "sv/recept", "beräknad del under 1"],
    ["th", "th/recipes", "ส่วนที่คำนวณต่ำกว่า 1"],
  ]) {
    for (const slug of ["keto-mutakakku", "keto-suklaakeksit", "meheva-suklaakakku"]) {
      const html = await readFile(path.join(dist, route, slug, "index.html"), "utf8");
      assert.ok(html.includes('data-chocolate-comparison="' + locale + '"'), slug);
      assert.match(html, /data-chocolate-product="torras-maltitol"/, slug);
      assert.match(html, /data-chocolate-product="torras-stevia"/, slug);
      if (slug.startsWith("keto-")) assert.ok(html.includes(calculatedPart), slug);
    }
  }
});
