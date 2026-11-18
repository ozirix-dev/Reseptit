import { siteTarget } from "../src/content/site-target";

const buildOriginPattern = siteTarget.baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
import { estimateBasis, evidenceLabel, gkCopy, missingReason } from "../src/features/glycemic-load/glycemic-load-copy";
import {gkOnlyVariants,gkVersionCoverage} from '../src/generated/gk-only-variants.generated';
import { gkVariantScope } from '../src/features/recipes/gk-estimate-scope';
import { verbalGkForPortion, type IngredientPortion, type OriginalGkCoverage, type PortionEvidence } from '../src/features/recipes/gk-portion';
import { IngredientPortionDetails, portionCopy } from '../src/features/recipes/RecipePortionSummary';
import {loadAuthorizedGk100Variants} from '../scripts/gk100-approval-release';
import {gkOnlyUi,gkOnlyValue,gkScopeUi,studyServingTitle} from '../src/features/recipes/GkOnlyVariantPanel';
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import { recipeLibraryPagePath, recipeLibraryPageSize } from "../src/features/recipes/recipe-pagination";
import { parseRecipeSearch, parseRouteContent } from "../src/lib/load-content";
import { glycemicLoadPath, recipeDifficultyLabel, recipeUi } from "../src/features/recipes/recipe-i18n";
import { copyrightSourceUrl, copyrightUi } from "../src/features/recipes/recipe-copyright";
import { toolUi } from "../src/features/recipes/recipe-tools";
import { siteContent } from "../src/generated/content.generated";
import { contentManifest } from "../src/generated/routes.generated";
import { glycemicLoadAdditionalResults, glycemicLoadPilotReviewedRecipeCount, glycemicLoadPilotResults, glycemicLoadPortions, type GlycemicLoadPilotPublicResult } from "../src/generated/glycemic-load-pilot.generated";
import { glycemicLoadFilterCategories } from "../src/generated/glycemic-load-filters.generated";
import { isPublicRecipeQuarantined, publicRecipeQuarantineIds } from "../scripts/public-recipe-quarantine";
import { f25ExplicitUndefinedGkLabel, withholdF25Nutrition } from "../src/features/recipes/f25-nutrition-withhold";
import { loadReviewedPortions } from "../scripts/gk-portion-projection";
import type { GlycemicLoadResult } from "../scripts/glycemic-load-model";

const dist = path.resolve(import.meta.dirname, "../dist");

test("new verbal estimates qualify the legacy numerical notices in all published languages", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const checked = [
    ["pohjoisafrikkalainen-msemen-hunajalla-punnittu-v2", "HIGH"],
    ["karnivore-voilohi-pannulla", "LOW"],
    ["karnivore-lammaskyljykset-voissa", "LOW"],
    ["karnivore-jauhelihakulho-munalla", "LOW"],
    ["karnivore-rapeat-kananreisipalat", "LOW"],
    ["karnivore-naudan-lyhytkylki", "LOW"],
    ["karnivore-rapea-porsaan-kylki", "LOW"],
    ["karnivore-steak-and-eggs", "LOW"],
    ["indonesialainen-nasi-goreng-aamiaisriisi-punnittu-v2", "HIGH"],
    ["malesialainen-roti-canai-dhalilla-punnittu-v2", "HIGH"],
    ["japanilainen-yaki-onigiri-misolla-punnittu-v2", "HIGH"],
    ["intialainen-aloo-paratha-punnittu-v2", "HIGH"],
    ["karnivore-smashburger", "LOW"],
    ["karnivore-meatza", "LOW"],
    ["japanilainen-miso-tofu-paksoi-punnittu-v2", "LOW"],
  ] as const;
  for (const [id, category] of checked) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    for (const recipe of entries) {
      const { locale, routePath } = recipe;
      const note = reviews[id]?.verbalNoteEdits?.[locale];
      assert.ok(note, `${id}/${locale}: reviewed notice`);
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      assert.match(rendered, /data-gk-status="QUALITATIVE"/);
      assert.doesNotMatch(rendered, /data-portion-gk/);
      assert.ok(rendered.includes(note.after), `${id}/${locale}: numerical limitation`);
      assert.ok(!rendered.includes(note.before), `${id}/${locale}: no conflicting old notice`);
      assert.ok(rendered.includes(portionCopy[locale].class[category]), `${id}/${locale}: reviewed class`);
      assert.match(rendered, /data-verbal-portion-scope/);
      assert.ok(rendered.includes(`${glycemicLoadPath(locale)}#${id}`), `${id}/${locale}: guide link`);
    }
  }
});

test("reviewed portion notes preserve carbohydrate-only estimates when comparison foods disagree", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  for (const id of ["raejuustopizza-kaurajauhopohjalla", "xiaolongbao", "malesialainen-roti-jala-currykanalla-punnittu-v2", "indonesialainen-lontong-sayur-aamiaiseksi-punnittu-v2", "vietnamilainen-banh-bao-kananmunalla-punnittu-v2", "ananas-kanelijuoma-sitruunalla", "jaaiset-banaani-suklaapalat"]) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    for (const { locale, routePath } of entries) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      const scope = reviews[id]?.condition?.[locale];
      assert.ok(scope && rendered.includes(scope), `${id}/${locale}: reviewed scope`);
      const source = reviews[id]?.publicSource;
      if (source) assert.ok(rendered.includes(`href="${source.replaceAll("&", "&amp;")}"`), routePath);
      assert.match(rendered, /data-portion-carbohydrate/);
      assert.doesNotMatch(rendered, /data-gk-status="(?:CALCULATED|QUALITATIVE)"|data-portion-gk/);
    }
  }
});

test("incomplete recipes keep ingredient weights and optional foods separate from the whole serving", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  for (const id of ["dal-makhani", "mala-xiang-guo", "kana-tagine-sitruunalla"]) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    for (const { locale, routePath } of entries) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      const review = reviews[id];
      const scope = review?.condition?.[locale];
      assert.ok(scope && rendered.includes(scope), routePath);
      const source = review.publicSource?.replaceAll("&", "&amp;");
      assert.ok(source && rendered.includes(`href="${source}"`), routePath);
      assert.doesNotMatch(rendered, /data-portion-carbohydrate=|data-gk-status="(?:CALCULATED|QUALITATIVE)"|data-portion-gk=/);
      assert.match(rendered, /data-ingredient-portion="true"/, routePath);
      assert.equal(rendered.includes('data-ingredient-carbohydrate="available"'), id === "dal-makhani", routePath);
    }
  }
});

test("a pending GL leaves the reviewed whole-serving and ingredient carbohydrate visible", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const id = "malesialainen-laksa-lemak-aamiaiseksi-punnittu-v2";
  const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
  assert.equal(entries.length, 4, id);
  for (const { locale, routePath } of entries) {
    const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
    const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.match(rendered, /data-portion-carbohydrate="available"/);
    assert.match(rendered, /data-ingredient-carbohydrate="available"/);
    assert.doesNotMatch(rendered, /data-portion-gk=|data-gk-status="(?:QUALITATIVE|CALCULATED)"/);
    assert.ok(rendered.includes(gkCopy[locale].missingBasis), routePath);
    assert.ok(rendered.includes(reviews[id].condition![locale]), routePath);
  }
});

test("an independently reviewed carb estimate does not publish the other nutrition values or GL", async () => {
  const id = "indonesialainen-bakwan-jagung-kotiversio";
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
  assert.equal(entries.length, 4, id);
  for (const recipe of entries) {
    const { locale, routePath } = recipe;
    for (const key of ["carbsNetG", "carbsTotalG", "fatG", "proteinG"] as const) {
      assert.equal(recipe.nutrition[key], null, routePath);
    }
    const note = reviews[id].wholeCarbohydrateOnly!.noteEdits![locale]!;
    assert.ok(recipe.notesHtml.includes(note.before), routePath);
    const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
    const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.ok(rendered.includes(note.after), routePath);
    assert.ok(!rendered.includes(note.before), routePath);
    assert.match(rendered, /data-portion-carbohydrate="available"/);
    assert.match(rendered, /data-ingredient-carbohydrate="available"/);
    assert.doesNotMatch(rendered, /data-portion-gk=|data-gk-status="(?:QUALITATIVE|CALCULATED)"/);
  }
});

test("standalone carbohydrate and source warnings follow reviewed quantities and locales", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const whole = Object.entries(reviews).filter(([, review]) => review.wholeCarbohydrateOnly?.localizedScopeSha256);
  assert.ok(whole.some(([id]) => id === "uuniriisipuuro"));
  assert.ok(whole.some(([id]) => id === "avokado-perunasampylat-pellilla"));
  assert.ok(whole.some(([id]) => id === "paahtopaistileivat-kauralesesampyloilla"));
  for (const [id, review] of whole) {
    const entries = siteContent.recipes.filter(entry => entry.recipeId === id);
    assert.deepEqual(entries.map(recipe => recipe.locale).sort(), Object.keys(review.wholeCarbohydrateOnly!.localizedScopeSha256!).sort());
    for (const { locale, routePath, nutrition } of entries) {
      assert.ok(Object.values(nutrition).every(value => value === null), routePath);
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      assert.match(rendered, /data-portion-carbohydrate="available"/);
      assert.doesNotMatch(rendered, /data-portion-gk=|data-gk-status="(?:QUALITATIVE|CALCULATED)"/);
      const condition = renderToStaticMarkup(createElement("p", { className: "recipe-disclosure" }, review.condition![locale]));
      assert.ok(rendered.includes(condition), routePath);
      assert.ok(rendered.includes('href="' + (review.publicSource ?? review.source) + '"'), routePath);
      const preparations = review.wholeCarbohydrateOnly!.preparationChoices;
      if (preparations) {
        assert.equal([...rendered.matchAll(/data-carbohydrate-choice="whole"/g)].length, preparations.choices.length, routePath);
        assert.ok(rendered.indexOf(condition) < rendered.indexOf('data-portion-preparations'), routePath);
        for (const choice of preparations.choices) {
          assert.ok(rendered.includes(choice.label[locale]), routePath);
          assert.ok(rendered.includes('href="' + choice.record.sourceUrl + '"'), routePath);
        }
        assert.equal([...rendered.matchAll(/data-ingredient-carb-alternative=/g)].length,
          review.ingredientPortion?.carbohydrateAlternatives?.length ?? 0, routePath);
      }
      if (id === "porkkanaletut") {
        assert.ok(rendered.indexOf(condition) < rendered.indexOf('data-portion-carbohydrate="available"'), routePath);
        assert.match(rendered, /data-ingredient-carbohydrate="declared"/, routePath);
        assert.match(rendered, /href="https:\/\/apetit\.fi\/tuotteet\//, routePath);
        assert.match(rendered, /href="https:\/\/www\.matvaretabellen\.no\/en\/carrot-cooked\//, routePath);
        assert.ok(rendered.includes(portionCopy[locale].declaredIngredientCarbsSource), routePath);
      }
      if (id === "piparkakkulatte-hunajalla" && locale === "en") {
        assert.match(rendered, /Beat again briefly\./, routePath);
        assert.doesNotMatch(rendered, /Vatkaa vielä hetki/, routePath);
      }
      if (id === "paahtopaistileivat-kauralesesampyloilla") {
        const wholeCarbs = rendered.match(/data-portion-carbohydrate="available"[^>]*>([\s\S]*?)<\/div>/)?.[1];
        const rollCarbs = rendered.match(/data-ingredient-carbohydrate="available"[^>]*>([\s\S]*?)<\/div>/)?.[1];
        assert.ok(wholeCarbs?.includes(new Intl.NumberFormat(locale).format(4.6)), routePath);
        assert.ok(rollCarbs?.includes(new Intl.NumberFormat(locale).format(1.6)), routePath);
        assert.notEqual(review.ingredientPortion?.source, review.publicSource, routePath);
        assert.ok(rollCarbs?.includes('href="' + review.ingredientPortion!.source + '"'), routePath);
      }
    }
  }

  for (const id of ["thai-jok-kanalla", "japanilainen-onigiri-lohella", "korealainen-yachaejuk-kasvisjuk"]) {
    const result = glycemicLoadPilotResults.find(row => row.recipeId === id);
    assert.equal(result?.status, "CALCULATED", id);
    assert.equal(glycemicLoadFilterCategories[id], undefined, id);
    assert.ok(result?.sourceReferences.some(source => source.note.includes("rice-product group mean")), id);
    for (const { locale, routePath } of siteContent.recipes.filter(entry => entry.recipeId === id)) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      assert.match(rendered, /data-portion-gk=/, routePath);
      assert.ok(rendered.includes(reviews[id].classLimitation![locale]), routePath);
      assert.ok(!rendered.includes(portionCopy[locale].class.HIGH), routePath);
    }
  }
});

test("preparation and optional-side evidence stays visibly scoped", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  for (const id of ["gazpacho", "medu-vada", "marjakiisseli-vaniljakastikkeella", "malesialainen-mee-goreng-aamunuudeleilla",
    "pannacotta-marjakastikkeella", "lahi-ita-kikhernejauho-yrttilettu", "kantonilainen-hoyrytetty-kala",
    "larb-moo-vhh", "pohjoisafrikkalainen-kuskus-aamiaiskulho", "ropa-vieja", "amritsari-kala", "kiinalainen-hirssipuuro-taateleilla",
    "lihapullat-kermakastikkeessa-vhh", "jauhelihakastike-kesakurpitsanuudeleilla", "kanakorma-kukkakaaliriisilla",
    "lohikeitto-kuohukermalla", "tortilla-de-patatas", "indonesialainen-ketoprak-aamiaiskulho",
    "valimerellinen-pinaatti-fetashakshuka", "karjalanpaisti-vhh", "keto-pinaattiletut"]) {
    assert.equal(glycemicLoadFilterCategories[id], undefined, id);
    for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === id)) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      assert.match(rendered, /data-portion-gk=/, routePath);
      assert.ok(rendered.includes(reviews[id].condition![locale]), routePath);
      if (reviews[id].classLimitation) assert.ok(rendered.includes(reviews[id].classLimitation[locale]), routePath);
    }
  }
  for (const [id, classification] of [["doner-kebab", "high"], ["pohjoisafrikkalainen-lablabi", "medium"]] as const) {
    assert.equal(glycemicLoadFilterCategories[id], classification, id);
    for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === id)) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      assert.match(rendered, /data-portion-gk=/, routePath);
      assert.ok(rendered.includes(reviews[id].condition![locale]), routePath);
    }
  }
});

test("carbohydrate and GL describe their separate recipe assumptions before and beside the respective amounts", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const numeric = new Set([...glycemicLoadPilotResults, ...glycemicLoadAdditionalResults]
    .filter(result => result.status === "CALCULATED").map(result => result.recipeId));
  for (const id of ["karnivore-maksa-ja-pekoni", "palsternakkasosekeitto", "timjami-uunijuurekset", "valimerellinen-kikherne-yrttiaamiainen-punnittu-v2"]) {
    assert.ok(reviews[id]?.carbohydrateScope, id);
    assert.ok(!numeric.has(id), id);
    assert.equal(glycemicLoadFilterCategories[id], undefined, id);
  }
  for (const [id, review] of Object.entries(reviews).filter(([, review]) => review.carbohydrateScope)) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    if (review.classLimitation) assert.equal(glycemicLoadFilterCategories[id], undefined, id);
    for (const { locale, routePath } of entries) {
      const html = (await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"))
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      const guide = await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8");
      const start = guide.indexOf(`id="${id}"`);
      const row = guide.slice(start, guide.indexOf("<li ", start + 1));
      const carbsScope = review.carbohydrateScope![locale];
      const recipeCarbs = html.indexOf('data-portion-carbohydrate="available"');
      const recipeScope = renderToStaticMarkup(createElement("p", {className: "recipe-disclosure"}, carbsScope));
      const guideScope = renderToStaticMarkup(createElement("p", {"data-portion-preparation-scope": true}, carbsScope));
      assert.ok(html.includes(recipeScope), routePath);
      assert.ok(html.indexOf(recipeScope) < recipeCarbs, routePath);
      assert.ok(row.includes(guideScope), routePath);
      assert.ok(row.includes('href="' + (review.publicSource ?? review.source) + '"'), routePath);
      if (!numeric.has(id)) {
        assert.doesNotMatch(html, /data-portion-gk|data-original-gk-class=/, routePath);
        assert.doesNotMatch(row, /class="gk-evidence__value"(?! data-gk-estimate="VERBAL")|data-original-gk-class=/, routePath);
        continue;
      }
      const limitation = review.classLimitation?.[locale];
      const glScope = limitation ?? review.condition?.[locale];
      assert.ok(glScope, routePath);
      const recipeGl = html.indexOf("data-portion-gk");
      const recipeGlScope = html.indexOf(renderToStaticMarkup(createElement("p", {
        className: limitation ? "recipe-glycemic-load__class" : "recipe-disclosure",
      }, glScope)));
      const guideGlScope = row.indexOf(renderToStaticMarkup(createElement("p", null, glScope)));
      const guideGl = row.indexOf("gk-evidence__value");
      assert.ok(recipeCarbs < recipeGl, routePath);
      assert.ok(guideGl > row.indexOf(guideScope), routePath);
      assert.ok(recipeGlScope > recipeCarbs && (limitation ? recipeGlScope > recipeGl : recipeGlScope < recipeGl), routePath);
      assert.ok(guideGlScope > row.indexOf(guideScope) && (limitation ? guideGlScope > guideGl : guideGlScope < guideGl), routePath);
    }
  }
  assert.equal(glycemicLoadFilterCategories["valimerellinen-jogurttikulho-hunajalla"], "low");
});

test("reviewed ingredient contributions and the dry risotto rice amount are visible beside the supported portion information", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const expected = {
    "pinaattikeitto": /12.*9/,
    "perunarieskat-ohrajauhoilla": /8[,.]9.*5[,.]5/,
    "ruis-puolukkapuuro": /22.*16/,
    "omena-kaurapaistos": /16.*11/,
    "punajuuririsotto": /0,8 dl|80 mL|80 มล\./,
  };
  const guides = new Map(await Promise.all((["fi", "en", "sv", "th"] as const).map(async locale =>
    [locale, await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8")] as const)));
  for (const [id, ingredients] of Object.entries(expected)) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    assert.equal(glycemicLoadFilterCategories[id], undefined, id);
    for (const { locale, routePath } of entries) {
      const note = reviews[id]?.condition?.[locale];
      assert.ok(note, routePath);
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const guide = guides.get(locale)!;
      const start = guide.indexOf(`id="${id}" class="glycemic-pilot__recipe"`);
      assert.ok(start >= 0, routePath);
      const row = guide.slice(start, guide.indexOf("<li ", start + 1));
      assert.ok(html.includes(renderToStaticMarkup(createElement("p", { className: "recipe-disclosure" }, note))), routePath);
      assert.ok(row.includes(renderToStaticMarkup(createElement("p", null, note)))
        || row.includes(renderToStaticMarkup(createElement("p", { "data-portion-preparation-scope": true }, note))), routePath);
      assert.doesNotMatch(html, /data-portion-gk|data-original-gk-class=/, routePath);
      assert.doesNotMatch(row, /class="gk-evidence__value"/);
      if (id === "punajuuririsotto") {
        assert.match(html.replaceAll("<!-- -->", ""), ingredients, routePath);
        assert.match(row.replaceAll("<!-- -->", ""), ingredients, routePath);
        assert.doesNotMatch(html, /data-portion-carbohydrate=/, routePath);
      } else {
        assert.match(note, ingredients, routePath);
      }
    }
  }
});

test("reviewed ingredient quantities retain their own scope on recipes and in the GK guide", async () => {
  const expected = {
    bibimbap: [75, 59.25], "goi-cuon": [37.5, 30.615], "hernekeitto-savupotkalla": [125, undefined],
    "idli-sambar": [50, 22.9], "japanilainen-natto-riisikulho": [50, 39.5], "mapo-tofu": [150, 35.3415],
    "pho-bo": [400 / 6, 54.42666666666667], roujiamo: [75, 55.4985], "vhh-pyttipannu": [50, 2.94],
    "japanilainen-curry-tofulla": [0.25, undefined, "kpl"], "japanilainen-soba-aamiaiskeitto": [50, undefined],
    "keto-mutakakku": [18.75, undefined], "keto-suklaakeksit": [18, undefined],
    "korealainen-bindaetteok-aamiaiseksi": [75, undefined], "lanzhou-naudanliha-nuudelikeitto": [87.5, undefined],
    "masala-dosa": [62.5, undefined], "meksikolainen-huevos-divorciados": [75, 7.2375], "paneer-tikka": [0.25, undefined, "kpl"],
  } as const;
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const route = glycemicLoadPath(locale);
    const [html, raw] = await Promise.all([
      readFile(path.join(dist, route.slice(1), "index.html"), "utf8"),
      readFile(path.join(dist, "data", contentManifest[route]), "utf8"),
    ]);
    const guide = parseRouteContent(JSON.parse(raw), route).glycemicOverview;
    assert.ok(guide, locale);
    for (const [id, [amount, carbs, unit = "g"]] of Object.entries(expected)) {
      const recipe = siteContent.recipes.find(entry => entry.recipeId === id && entry.locale === locale);
      const result: GlycemicLoadPilotPublicResult | undefined = guide.results.find(entry => entry.recipeId === id);
      const ingredient: IngredientPortion | undefined = result?.portionEvidence?.ingredientPortion;
      assert.ok(recipe && ingredient, `${id}/${locale}`);
      assert.equal(ingredient.amountPerServing, amount, recipe.routePath);
      assert.equal(ingredient.unit, unit, recipe.routePath);
      assert.equal(ingredient.name[locale], reviews[id].ingredientPortion?.labels[locale], recipe.routePath);
      if (carbs === undefined) {
        assert.equal(ingredient.availableCarbsGPerServing, undefined, recipe.routePath);
      } else {
        assert.ok(Math.abs((ingredient.availableCarbsGPerServing ?? Infinity) - carbs) < 1e-9, recipe.routePath);
        assert.equal(ingredient.source, reviews[id].source, recipe.routePath);
      }
      assert.equal(guide.knownIngredientNames?.[id], undefined, recipe.routePath);
      assert.equal(guide.carbsByRecipe?.[id], undefined, recipe.routePath);
      assert.equal(glycemicLoadFilterCategories[id], undefined, recipe.routePath);
      const start = html.indexOf(`id="${id}" class="glycemic-pilot__recipe"`);
      assert.ok(start >= 0, recipe.routePath);
      const end = html.indexOf('class="glycemic-pilot__recipe"', start + `id="${id}" class="glycemic-pilot__recipe"`.length);
      const row = html.slice(start, end < 0 ? undefined : end).split('<section class="gk-only-variant"', 1)[0];
      const detail = renderToStaticMarkup(createElement(IngredientPortionDetails, { ingredient, locale }));
      assert.ok(row.replaceAll("<!-- -->", "").includes(detail), recipe.routePath);
      assert.doesNotMatch(row, /gk-evidence__value|data-gk-known-ingredient|data-original-gk-class=/, recipe.routePath);
      const recipeHtml = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
      assert.ok(recipeHtml.replaceAll("<!-- -->", "").includes(detail), recipe.routePath);
      assert.doesNotMatch(recipeHtml, /data-portion-carbohydrate=|data-portion-gk=|data-original-gk-class=/, recipe.routePath);
      const scope: string | undefined = reviews[id].condition?.[locale];
      if (scope) {
        assert.ok(row.includes(renderToStaticMarkup(createElement("p", null, scope))), recipe.routePath);
        assert.ok(recipeHtml.includes(renderToStaticMarkup(createElement("p", { className: "recipe-disclosure" }, scope))), recipe.routePath);
      }
      if (ingredient.source) {
        const href: string = `href="${ingredient.source.replaceAll("&", "&amp;")}"`;
        assert.equal(row.split(href).length, 2, recipe.routePath);
        assert.equal(recipeHtml.split(href).length, 2, recipe.routePath);
      }
    }
  }
});

test("reviewed legacy portions name the applicable GI group on the recipe and in the guide", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const groups = {
    "vegetables-category-mean-gi-66": [
      "kana-yakitori-kaalilla", "khao-man-gai-vhh", "jauhelihakastike-kesakurpitsanuudeleilla",
      "lihapullat-kermakastikkeessa-vhh", "kanakorma-kukkakaaliriisilla", "larb-moo-vhh",
      "kai-jiew-vhh", "kantonilainen-hoyrytetty-kala",
    ],
    "dairy-category-mean-gi-35": ["kermainen-lohipata", "keto-pannukakku", "keto-pinaattiletut", "vhh-mokkapalat"],
    "fruit-category-mean-gi-51": ["vhh-brita-kakku"],
    "legumes-category-mean-gi-34": ["amritsari-kala"],
  };
  const guides = new Map(await Promise.all((["fi", "en", "sv", "th"] as const).map(async locale =>
    [locale, await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8")] as const)));
  const groupWords = {
    fi: /GI.*keskiarvo|keskiarvo.*GI/u, en: /(?:average|mean).*GI|GI.*(?:average|mean)/u,
    sv: /genomsnitt.*GI|GI.*genomsnitt/u, th: /GI.*เฉลี่ย|เฉลี่ย.*GI/u,
  };
  for (const [sourceId, ids] of Object.entries(groups)) {
    for (const id of ids) {
      const result = glycemicLoadPilotResults.find(row => row.recipeId === id);
      assert.ok(result, id);
      assert.equal(result.status, "CALCULATED", id);
      assert.ok(result.ingredientEvidence?.some(row => row.giRecordId === sourceId), id);
      assert.equal(glycemicLoadFilterCategories[id], undefined, id);
      const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
      assert.equal(entries.length, 4, id);
      for (const { locale, routePath } of entries) {
        const limit = reviews[id].classLimitation?.[locale];
        const condition = reviews[id].condition?.[locale];
        const disclosure = [condition, limit].find(value => value && groupWords[locale].test(value));
        assert.ok(disclosure, routePath);
        const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
        const guide = guides.get(locale)!;
        const start = guide.indexOf(`id="${id}"`);
        const row = guide.slice(start, guide.indexOf("<li ", start + 1));
        const className = disclosure === limit ? "recipe-glycemic-load__class" : "recipe-disclosure";
        assert.ok(html.includes(renderToStaticMarkup(createElement("p", { className }, disclosure))), routePath);
        assert.ok(row.includes(renderToStaticMarkup(createElement("p", null, disclosure)))
          || row.includes(renderToStaticMarkup(createElement("p", { "data-portion-preparation-scope": true }, disclosure))), routePath);
      }
    }
  }
});

test("numeric original GK follows the same class on the recipe, in the guide and in the catalog", async () => {
  const results = new Map([...glycemicLoadPilotResults, ...glycemicLoadAdditionalResults]
    .filter(result => result.status === "CALCULATED").map(result => [result.recipeId, result]));
  const checkedClasses = new Set<string>();
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const guide = await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8");
    const rows = [...guide.matchAll(/<li id="([^"]+)" class="glycemic-pilot__recipe"/g)];
    const guideByRecipe = new Map(rows.map((row, index) => [row[1], guide.slice(row.index, rows[index + 1]?.index)]));
    for (const { recipeId, routePath } of siteContent.recipes.filter(recipe => recipe.locale === locale && results.has(recipe.recipeId))) {
      const html = (await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"))
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      const row = guideByRecipe.get(recipeId);
      assert.ok(row, `${routePath}: guide row`);
      const category = glycemicLoadFilterCategories[recipeId]?.toUpperCase() as keyof (typeof portionCopy)[typeof locale]["class"] | undefined;
      for (const surface of [html, row]) {
        const classes = [...surface.matchAll(/data-original-gk-class="([A-Z]+)"/g)].map(match => match[1]);
        assert.deepEqual(classes, category ? [category] : [], routePath);
        if (category) assert.ok(surface.includes(portionCopy[locale].class[category]), routePath);
      }
      if (category) checkedClasses.add(category);
      assert.equal(row.includes(portionCopy[locale].rounding), html.includes(portionCopy[locale].rounding), routePath);
    }
  }
  assert.deepEqual([...checkedClasses].sort(), ["HIGH", "LOW", "MEDIUM"]);
});

test("guide coverage and recipe labels distinguish documented GK ingredient subsets from recorded omissions", async () => {
  const subsets = [
    "gai-yang-vhh", "jauhelihakastike-kesakurpitsanuudeleilla", "kana-yakitori-kaalilla",
    "kanakorma-kukkakaaliriisilla", "khao-kha-moo-vhh", "khao-man-gai-vhh",
    "kiinalainen-soijamaito-aamiaisella", "lahi-ita-ful-medames", "larb-moo-vhh",
    "lihapullat-kermakastikkeessa-vhh", "medu-vada",
  ];
  const numeric = [...glycemicLoadPilotResults, ...glycemicLoadAdditionalResults].filter(row => row.status === "CALCULATED");
  const tagged = numeric.filter(row => row.portionEvidence?.gkIngredientSubset);
  assert.deepEqual(tagged.map(row => row.recipeId).sort(), subsets);
  assert.ok(tagged.some(row => row.omittedAvailableCarbohydratePerServingG === 0));
  assert.ok(tagged.some(row => row.omittedAvailableCarbohydratePerServingG > 0));
  const omissionCount = numeric.filter(row => row.omittedAvailableCarbohydratePerServingG > 0).length;
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const guide = await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8");
    assert.ok(guide.includes(`data-gk-coverage="NUMERIC_INGREDIENT_SUBSET"><strong>${subsets.length}</strong>`), locale);
    assert.ok(guide.includes(`data-gk-coverage="NUMERIC_RECORDED_OMISSIONS"><strong>${omissionCount}</strong>`), locale);
    assert.equal(guide.match(/data-gk-ingredient-subset="true"/g)?.length, subsets.length, locale);
    for (const recipeId of subsets) {
      const recipe = siteContent.recipes.find(row => row.recipeId === recipeId && row.locale === locale);
      assert.ok(recipe, `${recipeId}/${locale}`);
      const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
      assert.ok(html.includes(`<dt data-gk-ingredient-subset="true">${portionCopy[locale].ingredientGk}</dt>`), recipe.routePath);
      const start = guide.indexOf(`<li id="${recipeId}" class="glycemic-pilot__recipe"`);
      assert.ok(start > -1, recipe.routePath);
      const end = guide.indexOf('class="glycemic-pilot__recipe"', start + `<li id="${recipeId}" class="glycemic-pilot__recipe"`.length);
      const row = guide.slice(start, end < 0 ? undefined : end);
      assert.ok(row.includes(`data-gk-ingredient-subset="true"><strong>${portionCopy[locale].ingredientGk}`), recipe.routePath);
      assert.equal(glycemicLoadFilterCategories[recipeId], undefined, recipe.routePath);
    }
  }
});

test("khao kha moo identifies the vegetable-side GK and withholds the whole-serving class", async () => {
  const id = "khao-kha-moo-vhh";
  const result = glycemicLoadPilotResults.find(row => row.recipeId === id);
  assert.ok(result);
  assert.equal(result.status, "CALCULATED");
  assert.equal(result.unroundedGlycemicLoadPerServing, 2.7769500000000003);
  assert.equal(result.omittedAvailableCarbohydratePerServingG, 0);
  assert.equal(glycemicLoadFilterCategories[id], undefined);
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
  assert.equal(entries.length, 4);
  for (const { locale, routePath } of entries) {
    const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
    const guide = await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8");
    const start = guide.indexOf(`<li id="${id}" class="glycemic-pilot__recipe"`);
    assert.ok(start > -1, routePath);
    const end = guide.indexOf('class="glycemic-pilot__recipe"', start + `<li id="${id}" class="glycemic-pilot__recipe"`.length);
    const row = guide.slice(start, end < 0 ? undefined : end);
    const condition = reviews[id]?.condition?.[locale];
    const limitation = reviews[id]?.classLimitation?.[locale];
    assert.ok(condition && limitation, routePath);
    assert.ok(html.indexOf(condition) >= 0 && html.indexOf(condition) < html.indexOf("data-portion-gk"), routePath);
    assert.ok(row.indexOf(condition) >= 0 && row.indexOf(condition) < row.indexOf("gk-evidence__value"), routePath);
    for (const surface of [html, row]) {
      assert.ok(surface.includes(limitation), routePath);
      assert.doesNotMatch(surface, /data-original-gk-class=/, routePath);
    }
  }
});

test("legacy GL coverage uses the approved ingredient sum and distinguishes estimated omissions from bounds", async () => {
  const file = path.resolve(import.meta.dirname, "../../tmp/nutrition/glycemic-load-pilot.json");
  const audit = JSON.parse(await readFile(file, "utf8")) as { results: GlycemicLoadResult[] };
  const scoped = glycemicLoadPilotResults.filter(result => result.originalGkCoverage);
  assert.equal(scoped.length, 80);
  assert.equal(scoped.filter(result => result.originalGkCoverage?.hasOmissionAssumptions).length, 22);
  for (const [id, unit] of [
    ["munakasrulla-pinaatti-tuorejuustolla", "all"],
    ["valimerellinen-menemen-fetalla", "majority"],
  ] as const) {
    const main = scoped.find(result => result.recipeId === id)?.originalGkCoverage?.mainIngredient;
    assert.equal(main?.share, unit, id);
    assert.equal(main?.categoryMean, true, id);
    assert.equal(Object.keys(main.names).length, 4, id);
  }
  assert.ok(scoped.some(result => result.originalGkCoverage!.upperBoundOmissionG > 0));
  assert.ok(scoped.some(result => result.originalGkCoverage!.estimatedOmissionG > 0));
  const pancake = glycemicLoadPilotResults.find(result => result.recipeId === "keto-pannukakku");
  assert.ok(pancake?.originalGkCoverage);
  assert.equal(pancake.originalGkCoverage.mainIngredient, undefined);
  assert.ok(Math.abs(pancake.originalGkCoverage.estimatedOmissionG - 0.555) < 1e-9);
  const assumptionsOnly = ["kukkakaaligratiini-pekonilla", "kiinalainen-soijamaito-aamiaisella"];
  for (const id of assumptionsOnly) {
    const coverage: OriginalGkCoverage | undefined = scoped.find(result => result.recipeId === id)?.originalGkCoverage;
    assert.ok(coverage, id);
    assert.equal(coverage.estimatedOmissionG, 0, id);
    assert.equal(coverage.upperBoundOmissionG, 0, id);
    assert.equal(coverage.hasOmissionAssumptions, true, id);
  }
  for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === pancake?.recipeId)) {
    const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
    const limitation: string = pancake.portionEvidence!.classLimitation![locale];
    assert.ok(html.includes(renderToStaticMarkup(createElement("p", { className: "recipe-glycemic-load__class" }, limitation))), routePath);
  }
  const guides = await Promise.all((["fi", "en", "sv", "th"] as const).map(async locale =>
    [locale, await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8")] as const));
  const guideByLocale = new Map(guides);
  for (const result of scoped) {
    const id = result.recipeId;
    const archived = audit.results.find(row => row.recipeId === id);
    assert.ok(archived, id);
    assert.equal(result.unroundedGlycemicLoadPerServing, archived.unroundedGlycemicLoadPerServing, id);
    const coverage = result.originalGkCoverage!;
    assert.equal(coverage.upperBoundOmissionG, archived.omittedAvailableCarbohydrateUpperBoundPerServingG, id);
    const omitted = archived.omittedAvailableCarbohydratePerServingG;
    if (coverage.hasOmissionAssumptions) {
      assert.ok(coverage.estimatedOmissionG + coverage.upperBoundOmissionG < omitted, id);
    } else {
      assert.ok(Math.abs(coverage.estimatedOmissionG + coverage.upperBoundOmissionG - omitted) < 1e-9, id);
    }
    for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === id)) {
      const recipeHtml = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const guide = guideByLocale.get(locale)!;
      const start = guide.indexOf(`id="${id}"`);
      const guideRow = guide.slice(start, guide.indexOf("<li ", start + 1));
      const section = recipeHtml.slice(recipeHtml.indexOf('data-portion-gk="true"'));
      for (const markup of [section, guideRow]) {
        const note = markup.indexOf('data-original-gk-coverage="true"');
        assert.ok(note >= 0 && note < markup.indexOf("<details"), routePath);
        const omissions: string | undefined = markup.match(/data-gk-omissions="true" aria-live="polite"[^>]*>([\s\S]*?)<\/p>/)?.[1];
        assert.ok(omissions, routePath);
        assert.equal(omissions.includes('data-gk-omission-assumptions="true"'), coverage.hasOmissionAssumptions === true, routePath);
        if (assumptionsOnly.includes(id)) assert.doesNotMatch(omissions, /[0-9]/, routePath);
        if (coverage.mainIngredient?.names[locale]) {
          assert.ok(markup.includes(renderToStaticMarkup(createElement("strong", null, coverage.mainIngredient.names[locale]))), routePath);
        }
      }
    }
  }
});

test("research handoff portions keep plain apple, tomato and honey in their supported scopes", async () => {
  const cases = {
    "suklaa-raejuustokakku": [12.726, true], "punajuuri-suklaakakku": [13.5744, true],
    "mustikka-jogurttijaatelo": [8.484, true], taateliketsuppi: [1.39125, false], omenavaahtokarkit: [null, true],
    "ananas-kanelijuoma-sitruunalla": [null, true],
  } as const;
  for (const [id, [ingredientG, whole]] of Object.entries(cases)) {
    const evidence: PortionEvidence | undefined = glycemicLoadPortions[id];
    assert.ok(evidence, id);
    assert.equal(glycemicLoadFilterCategories[id], undefined, id);
    assert.equal(Boolean(evidence.availableCarbs), whole, id);
    assert.equal(evidence.verbal, undefined, id);
    if (ingredientG !== null) assert.ok(Math.abs((evidence.ingredientPortion?.availableCarbsGPerServing ?? Infinity) - ingredientG) < 1e-9, id);
    if (id === "omenavaahtokarkit") assert.equal(evidence.piecesPerServing, 1, id);
    for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === id)) {
      const [recipe, guide] = await Promise.all([
        readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"),
        readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8"),
      ]);
      const start = guide.indexOf(`id="${id}" class="glycemic-pilot__recipe"`);
      assert.ok(start >= 0, routePath);
      const row = guide.slice(start, guide.indexOf("<li ", start + 1));
      assert.doesNotMatch(recipe, /data-portion-gk=|data-gk-status="(?:CALCULATED|QUALITATIVE)"/, routePath);
      assert.doesNotMatch(row, /gk-evidence__value|data-original-gk-class=/, routePath);
      assert.equal(recipe.includes('data-portion-carbohydrate="available"'), whole, routePath);
      for (const markup of [recipe, row]) {
        if (evidence.ingredientPortion?.source) assert.ok(markup.includes(`href="${evidence.ingredientPortion.source}"`), routePath);
        if (id === "taateliketsuppi") assert.ok(markup.includes('href="https://fdc.nal.usda.gov/fdc-app.html#/food-details/168191/nutrients"'), routePath);
        if (id === "ananas-kanelijuoma-sitruunalla") assert.ok(markup.includes(new Intl.NumberFormat(locale).format(0.35)), routePath);
      }
    }
  }
});

test("weighed or measured ingredient portions remain separate from whole-serving carbohydrates", async () => {
  const cases = {
    linssimakaronilaatikko: [220 / 6, "g"], "marry-me-kanapasta": [60, "g"],
    "uunifetapasta-kirsikkatomaateilla": [60, "g"], punajuuririsotto: [0.8, "dl"], "kaali-omenasalaatti": [1 / 6, "dl"],
  } as const;
  for (const [id, [amount, unit]] of Object.entries(cases)) {
    const evidence: PortionEvidence | undefined = glycemicLoadPortions[id];
    assert.equal(evidence?.ingredientPortion?.amountPerServing, amount, id);
    assert.equal(evidence?.ingredientPortion?.unit, unit, id);
    assert.equal(evidence?.availableCarbs, undefined, id);
    assert.equal(evidence?.verbal, undefined, id);
    assert.equal(glycemicLoadFilterCategories[id], undefined, id);
    const hasLabel = id === "linssimakaronilaatikko";
    assert.equal(evidence?.ingredientPortion?.availableCarbsGPerServing, undefined, id);
    if (hasLabel) {
      assert.ok(Math.abs((evidence?.ingredientPortion?.declaredCarbsGPerServing ?? Infinity) - 220 / 6 * 0.68) < 1e-9, id);
    } else {
      assert.equal(evidence?.ingredientPortion?.declaredCarbsGPerServing, undefined, id);
    }
    for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === id)) {
      const [recipe, guide] = await Promise.all([
        readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"),
        readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8"),
      ]);
      const start = guide.indexOf(`id="${id}" class="glycemic-pilot__recipe"`);
      assert.ok(start >= 0, routePath);
      const row = guide.slice(start, guide.indexOf("<li ", start + 1));
      for (const html of [recipe, row]) {
        assert.match(html, /data-ingredient-portion="true"/, routePath);
        assert.equal(html.includes('data-ingredient-carbohydrate="declared"'), hasLabel, routePath);
        assert.doesNotMatch(html, /data-portion-carbohydrate=|data-portion-gk=|data-original-gk-class=/, routePath);
        if (unit === "dl") {
          const metricUnit = { fi: "dl", en: "mL", sv: "dl", th: "มล." }[locale];
          const details = html.match(/data-ingredient-portion="true"[^>]*>(.*?)<\/dl>/s)?.[1];
          assert.ok(details?.includes(`${metricUnit}</dd>`), routePath);
        }
      }
    }
  }
});

test("modeled GL with withheld whole-serving carbohydrates shows the scaled ingredient and its evidence limit", async () => {
  const cases = {
    "janssoninkiusaus-juuriselleri": 175, "marokkolainen-couscous": 62.5,
    "paprikainen-vhh-gulassi": 75, "pasta-alla-norma": 87.5, "sitruuna-yrttikana-parsa": 100,
  };
  for (const [id, amount] of Object.entries(cases)) {
    const evidence: PortionEvidence | undefined = glycemicLoadPortions[id];
    assert.equal(evidence?.ingredientPortion?.amountPerServing, amount, id);
    assert.equal(evidence?.ingredientPortion?.availableCarbsGPerServing, undefined, id);
    assert.equal(evidence?.ingredientPortion?.declaredCarbsGPerServing, undefined, id);
    assert.equal(evidence?.availableCarbs, undefined, id);
    const locales = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(locales.length, 4, id);
    for (const { locale, routePath, nutrition } of locales) {
      const [recipe, guide] = await Promise.all([
        readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"),
        readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8"),
      ]);
      assert.ok(Object.values(nutrition).every(value => value === null), routePath);
      assert.match(recipe, /data-gk-status="CALCULATED"/, routePath);
      assert.match(recipe, /data-portion-gk=/, routePath);
      const start = guide.indexOf(`id="${id}" class="glycemic-pilot__recipe"`);
      assert.ok(start >= 0, routePath);
      const row = guide.slice(start, guide.indexOf("<li ", start + 1));
      const condition: string | undefined = evidence?.condition?.[locale];
      assert.ok(condition, routePath);
      const scope = renderToStaticMarkup(createElement("span", null, condition)).slice(6, -7);
      for (const html of [recipe, row]) {
        assert.match(html, /data-ingredient-portion="true"/, routePath);
        assert.ok(html.includes(scope), routePath);
        assert.doesNotMatch(html, /data-portion-carbohydrate=|data-ingredient-carbohydrate=/, routePath);
      }
    }
  }
});

test("optional side references remain separate from original nutrition on recipe and guide pages", async () => {
  const cases = { "kerala-kalacurry": 23.561, "dal-makhani": 23.561, "kana-tagine-sitruunalla": 63.6 };
  for (const [id, amount] of Object.entries(cases)) {
    const evidence: PortionEvidence | undefined = glycemicLoadPortions[id];
    const side = evidence?.sideCarbohydrate;
    assert.ok(side, id);
    assert.equal(side.availableCarbsGPer100g, amount, id);
    const locales = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(locales.length, 4, id);
    for (const { locale, routePath } of locales) {
      const [recipe, guide] = await Promise.all([
        readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"),
        readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8"),
      ]);
      const start = guide.indexOf(`id="${id}" class="glycemic-pilot__recipe"`);
      assert.ok(start >= 0, routePath);
      const row = guide.slice(start, guide.indexOf("<li ", start + 1));
      assert.match(recipe, /data-side-comparison="true"/, routePath);
      for (const html of [recipe, row]) {
        const reference = html.match(/<p data-side-reference="true"[^>]*>(.*?)<\/p>/s)?.[1];
        assert.ok(reference?.includes(side.name[locale]) && reference.includes(`href="${side.source}"`), routePath);
        assert.doesNotMatch(html, /data-side-combined-carbohydrate=|id="recipe-side-weight"/, routePath);
      }
    }
  }
});

test("whole-portion comparisons link to the exact other recipe in each shared language", async () => {
  for (const [[left, leftAmount], [right, rightAmount]] of [
    [["paahtopaistileivat-kauralesesampyloilla", 4.57], ["paahtopaistileipa-piparjuurikastikkeella", 22.70]],
    [["avokado-perunasampylat", 5.42], ["avokado-perunasampylat-pellilla", 7.01]],
    [["pinaattikeitto", 21.82], ["palsternakkasosekeitto", 30.59]],
  ] as const) {
    for (const [id, other, amount] of [[left, right, rightAmount], [right, left, leftAmount]] as const) {
      for (const { locale, routePath } of siteContent.recipes.filter(recipe => recipe.recipeId === id)) {
        const partner = siteContent.recipes.find(recipe => recipe.recipeId === other && recipe.locale === locale);
        const recipe = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
        const guide = await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8");
        const start = guide.indexOf(`id="${id}"`);
        const guideRow = guide.slice(start, guide.indexOf("<li ", start + 1));
        for (const html of [recipe, guideRow]) {
          const note = html.match(/<p[^>]*data-compared-carbohydrates="true"[^>]*>([\s\S]*?)<\/p>/)?.[1];
          if (!partner) {
            assert.equal(note, undefined, routePath);
            continue;
          }
          assert.ok(note, routePath);
          assert.ok(note.includes('href="' + partner.routePath + '"'), routePath);
          assert.ok(note.includes(new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(amount)), routePath);
          assert.doesNotMatch(note, /data-portion-gk=/, routePath);
        }
      }
    }
  }
});

test("guide and recipe show the unresolved whole-serving inputs for each reviewed preparation", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const ids = [
    "sitruuna-parsapasta", "taateliketsuppi", "punajuuririsotto", "lammin-chia-puuro-rouva-keto",
    "rasvakaakao-rouva-keto", "uunifetapasta-kirsikkatomaateilla", "raejuustobagelit-ilman-kohotusta",
    "karjalanpiirakat-riisipuurolla", "marry-me-kanapasta", "linssimakaronilaatikko",
  ];
  const guides = new Map(await Promise.all((["fi", "en", "sv", "th"] as const).map(async locale =>
    [locale, await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8")] as const)));
  for (const id of ids) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    for (const { locale, routePath } of entries) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const review = reviews[id];
      const condition = review.condition![locale];
      assert.ok(html.includes(renderToStaticMarkup(createElement("p", { className: "recipe-disclosure" }, condition))), routePath);
      assert.doesNotMatch(html, /data-portion-carbohydrate=|data-portion-gk=|data-gk-status="(?:CALCULATED|QUALITATIVE)"/, routePath);
      const guide = guides.get(locale)!;
      const start = guide.indexOf(`id="${id}"`);
      const guideRow = guide.slice(start, guide.indexOf("<li ", start + 1));
      assert.ok(guideRow.includes(renderToStaticMarkup(createElement("p", null, condition))), routePath);
      assert.ok(guideRow.includes('href="' + (review.publicSource ?? review.source) + '"'), routePath);

      if (id === "karjalanpiirakat-riisipuurolla" || id === "raejuustobagelit-ilman-kohotusta") {
        const filename = contentManifest[routePath];
        assert.ok(filename, routePath);
        const payload = parseRouteContent(JSON.parse(await readFile(path.join(dist, "data", filename), "utf8")), routePath);
        const evidence = payload.glycemicRecipe?.portionEvidence;
        assert.equal(evidence?.piecesPerServing, 1, routePath);
        assert.ok(html.includes(portionCopy[locale].pieces("1")), routePath);
        assert.equal(payload.recipe?.servings, id === "karjalanpiirakat-riisipuurolla" ? 24 : 6, routePath);
        assert.equal(evidence?.availableCarbs, undefined, routePath);
        assert.equal(evidence?.ingredientPortion?.availableCarbsGPerServing, undefined, routePath);
        if (id === "raejuustobagelit-ilman-kohotusta") {
          const [cheese] = evidence?.additionalIngredientPortions ?? [];
          assert.equal(evidence?.ingredientPortion?.amountPerServing, 50, routePath);
          assert.equal(evidence?.ingredientPortion?.declaredCarbsGPerServing, 33, routePath);
          assert.ok(Math.abs((cheese?.declaredCarbsGPerServing ?? 0) - 1.2) < 1e-10, routePath);
          assert.ok(html.includes('href="https://www.myllynparas.fi/tuotteet/emannan-puolikarkea-vehnajauho-1-kg"'), routePath);
          assert.ok(html.includes('href="https://www.valio.fi/tuotteet/valio-raejuusto/"'), routePath);
        }
      }
    }
  }
});

test("reviewed seasoning, syrup and dressing quantities stay scoped to their named inputs", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const amounts = { "naudan-paahtopaisti-uunissa": 0.4, "indonesialainen-bubur-sumsum-punnittu-v2": 23.5, "kaali-omenasalaatti": 1.3 };
  for (const [id, amount] of Object.entries(amounts)) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    for (const { locale, routePath } of entries) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const condition = reviews[id].condition![locale];
      assert.ok(condition.includes(new Intl.NumberFormat(locale).format(amount)), routePath);
      assert.ok(html.includes(renderToStaticMarkup(createElement("p", {className: "recipe-disclosure"}, condition))), routePath);
      assert.ok(html.includes('href="' + reviews[id].publicSource + '"'), routePath);
      assert.doesNotMatch(html, /data-portion-carbohydrate=|data-portion-gk=|data-gk-status="(?:CALCULATED|QUALITATIVE)"/, routePath);
      if (id === "kaali-omenasalaatti") {
        assert.ok(condition.includes(new Intl.NumberFormat(locale).format(5.5)), routePath);
        const guide = await readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8");
        const start = guide.indexOf(`id="${id}"`);
        const row = guide.slice(start, guide.indexOf("<li ", start + 1));
        assert.ok(row.includes(renderToStaticMarkup(createElement("p", null, condition))), routePath);
        assert.doesNotMatch(row, /gk-evidence__value|data-original-gk-class=/, routePath);
      }
    }
  }
});

test("the dark semolina measure is visible before the whole porridge estimate in all locales", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const id = "mustaherukkavispipuuro";
  for (const recipe of siteContent.recipes.filter(entry => entry.recipeId === id)) {
    const { locale, routePath } = recipe;
    const [html, guide] = await Promise.all([
      readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8"),
      readFile(path.join(dist, glycemicLoadPath(locale).slice(1), "index.html"), "utf8"),
    ]);
    const scope = reviews[id].carbohydrateScope![locale];
    const start = guide.indexOf(`id="${id}"`);
    const row = guide.slice(start, guide.indexOf("<li ", start + 1));
    const escaped = renderToStaticMarkup(createElement("p", null, scope)).slice(3, -4);
    for (const markup of [html, row]) {
      assert.match(scope, /200/);
      assert.match(scope, /140/);
      const estimate = locale === "th" ? /29(?:<!-- -->|\s)+กรัม/ : /29(?:<!-- -->|\s)+g/;
      const scopeIndex = markup.indexOf(escaped);
      assert.ok(scopeIndex >= 0 && scopeIndex < markup.search(estimate), routePath);
      assert.ok(markup.includes('href="' + reviews[id].publicSource + '"'), routePath);
      assert.ok(markup.includes('href="' + reviews[id].ingredientPortion!.source + '"'), routePath);
    }
    assert.doesNotMatch(html, /data-portion-gk=|data-gk-status="(?:CALCULATED|QUALITATIVE)"/, routePath);
    assert.doesNotMatch(row, /gk-evidence__value|data-original-gk-class=/, routePath);
  }
});

test("labelled ingredient totals and a low tomato estimate stay in their reviewed scopes", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const tomatoId = "metabolic-boost-tomaattisoseella";
  for (const id of [tomatoId, "gluteeniton-uunipannukakku", "gluteeniton-siemenvuokaleipa", "gluteenittomat-kauralesesampylat", "gluteeniton-durrapizzapohja", "karjalanpiirakat-riisipuurolla"]) {
    const entries = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(entries.length, 4, id);
    for (const { locale, routePath } of entries) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      assert.doesNotMatch(rendered, /data-portion-gk=/);
      assert.ok(rendered.includes('href="' + reviews[id].source + '"'), routePath);
      if (id === tomatoId) {
        assert.match(rendered, /data-gk-status="QUALITATIVE"/);
        assert.ok(rendered.includes(portionCopy[locale].class.LOW), routePath);
        assert.ok(rendered.includes(reviews[id].verbal!.rationale[locale]), routePath);
      } else {
        assert.match(rendered, /data-ingredient-carbohydrate="declared"/);
        assert.ok(rendered.includes(portionCopy[locale].declaredIngredientCarbs), routePath);
        assert.doesNotMatch(rendered, /data-ingredient-carbohydrate="available"|data-gk-status="(?:CALCULATED|QUALITATIVE)"/);
        if (id === "karjalanpiirakat-riisipuurolla") {
          assert.doesNotMatch(rendered, /data-portion-carbohydrate=/);
          assert.ok(rendered.includes(new Intl.NumberFormat(locale).format(6.4)), routePath);
          assert.ok(rendered.includes('href="' + reviews[id].ingredientPortion!.source + '"'), routePath);
        }
      }
    }
  }
});

test("a fresh egg pasta reference estimate stays scoped to the uncooked ingredient", async () => {
  const recipe = siteContent.recipes.find(entry => entry.recipeId === "sitruuna-parsapasta" && entry.locale === "fi");
  assert.ok(recipe);
  const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
  assert.match(html, /data-ingredient-portion=/);
  assert.match(html, /Tuore kananmunafettuccine ennen keittämistä/);
  assert.match(html, /Luku koskee tuoretta kananmunapastaa/);
  assert.match(html, /valutetun pastan ja lautaselle päätyvän kypsän parsan painot ja niitä vastaavat koostumustiedot/);
  assert.match(html, /paljonko parsan keitinvettä päätyy annokseen, ja punnitse sitruunankuoriraaste/);
  assert.match(html, /href="https:\/\/fineli\.fi\/fineli\/fi\/elintarvikkeet\/31256"/);
  assert.match(html, /href="https:\/\/fineli\.fi\/fineli\/fi\/elintarvikkeet\/31257"/);
  assert.doesNotMatch(html, /data-portion-carbohydrate=|data-portion-gk=/);
});

test("the Finnish roast pork serving includes its share of the whole cream sauce", async () => {
  const recipe = siteContent.recipes.find(entry => entry.recipeId === "uuniporsas-kermakastikkeessa-vhh" && entry.locale === "fi");
  assert.ok(recipe);
  assert.equal(recipe.servings, 6);
  const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
  assert.match(html, /Jaa kaikki liha ja kastike kuuteen yhtä suureen annokseen/);
  const result = glycemicLoadPilotResults.find(row => row.recipeId === recipe.recipeId);
  assert.equal(result?.glycemicLoadPerServing, 0.51);
});

test("generated route and search data satisfy the browser parser contracts", async () => {
  const dir = path.join(dist, "data");
  const files = await readdir(dir);
  const searches = files.filter(file => /^search-/.test(file) && file.endsWith(".json"));
  assert.equal(searches.length, 4);
  let recipePage: unknown;
  let searchIndex: unknown;
  let pages = 0;
  const routeFiles = new Set(Object.values(contentManifest));
  for (const file of [...searches, ...routeFiles]) {
    const payload = JSON.parse(await readFile(path.join(dir, file), "utf8"));
    if (searches.includes(file)) {
      assert.ok(parseRecipeSearch(payload).length > 0, file);
      searchIndex ??= payload;
    } else {
      assert.equal(parseRouteContent(payload, payload.path).path, payload.path, file);
      pages++;
      if (payload.recipe) recipePage ??= payload;
    }
  }
  assert.equal(pages, routeFiles.size);
  assert.ok(pages >= siteContent.recipes.length);
  assert.ok(recipePage);
  assert.ok(Array.isArray(searchIndex) && searchIndex.length);
  const first = searchIndex[0];
  for (const change of [{ locale: "xx" }, { category: "unknown" }, { dietTags: 42 }]) {
    assert.throws(() => parseRecipeSearch([{ ...first, ...change }]), /Invalid recipe search index/);
  }
  const invalid = structuredClone(recipePage) as { path: string; recipe: { ingredients: unknown[] } };
  invalid.recipe.ingredients = [null];
  assert.throws(() => parseRouteContent(invalid, invalid.path), /Invalid recipe page data/);
});

test("recipe actions progressively enhance readable static pages in all four languages", async () => {
  const { siteContent } = await import("../src/generated/content.generated");
  for (const recipe of siteContent.recipes.filter(recipe => recipe.recipeId === "kermainen-lohipata")) {
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const root = html.slice(html.indexOf('<div id="root">'));
    assert.ok(root.indexOf('<h1>') < root.indexOf('class="recipe-image"'));
    assert.ok(root.includes(toolUi[recipe.locale].jump));
    assert.ok(root.includes(toolUi[recipe.locale].nutrition));
    assert.ok(root.includes(`<summary>${toolUi[recipe.locale].nutritionPerRecipeServing}</summary>`), recipe.routePath);
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

test("the English oven recipes display explicit Celsius units in the rendered instructions", async () => {
  for (const [slug, steps] of [
    ["kermainen-lohipata", ["Heat the oven to 200 °C."]],
    ["kreikkalainen-moussaka", ["Heat the oven to 200 °C.", "Bake at 190 °C for about 35 minutes"]],
  ] as const) {
    const html = await readFile(path.join(dist, "en/recipes", slug, "index.html"), "utf8");
    const start = html.indexOf('id="recipe-instructions"');
    const end = html.indexOf("</section>", start);
    assert.ok(start >= 0 && end > start, slug);
    const instructions = html.slice(start, end);
    for (const step of steps) assert.ok(instructions.includes(step), slug + ": " + step);
    assert.doesNotMatch(instructions, /(?:190|200) degrees/);
  }
});

test("the FI coconut curry displays its allergen note on the static recipe page", async () => {
  const recipe = siteContent.recipes.find(({ recipeId, locale }) =>
    recipeId === "thai-kananmunat-kookoscurryssa" && locale === "fi");
  assert.ok(recipe);
  const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
  const visiblePage = html.slice(html.indexOf('<div id="root">')).split('</main>')[0];
  assert.match(visiblePage, /sisältää katkaraputahnaa eli äyriäisallergeenin/);
  assert.match(visiblePage, /voi sisältää myös kalajäämiä/);
  assert.match(visiblePage, /Tarkista oman pakkauksen ainesosat/);
});

test("difficulty is localized in every affected recipe page and library card", async () => {
  assert.equal(recipeDifficultyLabel("helppo", "fi"), "helppo");
  assert.equal(recipeDifficultyLabel(null, "en"), null);
  assert.equal(recipeDifficultyLabel("Advanced", "en"), "Advanced");
  const ids = [
    "indonesialainen-serabi-kookospannukakku", "intialainen-mannasuurimoupma", "japanilainen-soba-aamiaiskeitto",
    "kiinalainen-jianbing-munaletty", "kiinalainen-katkarapu-wontonkeitto", "malesialainen-apam-balik",
    "malesialainen-kaya-paahtoleipa", "meksikolainen-aamiais-tacot-mustapavuilla", "meksikolainen-huevos-divorciados",
  ];
  for (const [locale, label] of [["en", "Easy"], ["sv", "Lätt"], ["th", "ง่าย"]] as const) {
    const recipes = siteContent.recipes.filter(recipe => recipe.locale === locale)
      .sort((a, b) => a.recipeId < b.recipeId ? -1 : a.recipeId > b.recipeId ? 1 : 0);
    for (const id of ids) {
      const index = recipes.findIndex(recipe => recipe.recipeId === id);
      const context = `${locale}/${id}`;
      assert.ok(index >= 0, context);
      const recipe = recipes[index];
      const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
      assert.ok(html.replaceAll("<!-- -->", "").includes(`${recipeUi[locale].difficulty}: ${label}</span>`), context);
      const libraryPath = recipeLibraryPagePath(locale, Math.floor(index / recipeLibraryPageSize) + 1);
      const library = await readFile(path.join(dist, libraryPath.slice(1), "index.html"), "utf8");
      const card = library.split('<article class="recipe-card">').slice(1)
        .map(fragment => fragment.split("</article>", 1)[0])
        .find(fragment => fragment.includes(`href="${recipe.routePath}"`));
      assert.ok(card, context);
      assert.ok(card.includes(`${label}</span>`), context);
      assert.doesNotMatch(card, /Helppo/, context);
    }
  }
});

test("the three carnivore recipes show their published nutrition calculation basis", async () => {
  for (const [id, product] of [
    ["karnivore-jauhelihakulho-munalla", "Snellman Kunnon naudan jauheliha 20 % EAN 6409620011856"],
    ["karnivore-steak-and-eggs", "HK Naudan entrecôte 1824"],
    ["karnivore-voilohi-pannulla", "Kalaneuvos Atlantin lohifilee"],
  ]) {
    const recipe = siteContent.recipes.find(entry => entry.recipeId === id && entry.locale === "fi");
    assert.ok(recipe, id);
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const visiblePage = html.slice(html.indexOf('<div id="root">')).split("</main>", 1)[0];
    for (const output of [recipe.notesHtml, visiblePage]) {
      assert.ok(output.includes("Ravintoarvojen laskentaperuste"), id);
      assert.ok(output.includes("raaka-ainepanoksen arvioita per annos"), id);
      assert.ok(output.includes(product), id);
    }
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
  assert.equal([...html.matchAll(/class="recipe-card__link"/g)].length, 24);
  assert.match(html, /href="\/reseptit\/"/);
  assert.match(html, /<div class="recipe-card-grid">/);
  assert.doesNotMatch(html, /<form class="recipe-filters" role="search"/);
  assert.doesNotMatch(html, /id="recipe-search"/);
  assert.match(html, new RegExp(String.raw`rel="canonical" href="${buildOriginPattern}/"`));
  assert.match(html, /hreflang="fi"/);
  assert.match(html, new RegExp(String.raw`hreflang="en" href="${buildOriginPattern}/en\/recipes\/`));
  assert.match(html, new RegExp(String.raw`hreflang="sv" href="${buildOriginPattern}/sv\/recept\/`));
  assert.match(html, new RegExp(String.raw`hreflang="th" href="${buildOriginPattern}/th\/recipes\/`));
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

test("vegetable lasagne publishes its supplied image and reviewed macros without unsupported GK", async () => {
  const recipe = siteContent.recipes.find((recipe) => recipe.recipeId === "munakoiso-kesakurpitsalasagne" && recipe.locale === "fi");
  assert.ok(recipe);
  assert.equal(recipe.title, "Munakoiso-kesäkurpitsalasagne");
  assert.equal(recipe.timeTotalMin, 110);
  assert.deepEqual(recipe.nutrition, { carbsNetG: 48.32, carbsTotalG: 56.24, proteinG: 27.24, fatG: 35.18 });
  const lasagneResults = glycemicLoadPilotResults.filter((result) => result.recipeId === recipe.recipeId);
  assert.equal(lasagneResults.length, 1);
  assert.equal(lasagneResults[0]?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(lasagneResults[0]?.glycemicLoadPerServing, null);
  assert.ok(recipe.image);
  assert.equal(recipe.image.src, `${siteTarget.baseUrl}/kuvat/munakoiso-kesakurpitsalasagne.webp`);
  assert.equal(recipe.image.width, 1448);
  assert.equal(recipe.image.height, 1086);
  const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
  for (const note of ["havainnekuva", "ei ole koekeitetty", "Allergeenit", "kaupalliseksi yhteistyöksi", "ei ole hyväksyttyä GK-arvoa"]) {
    assert.ok(html.includes(note), `lasagne: ${note} is visible`);
  }
  assert.ok(!html.includes('data-gk-status="CALCULATED"'), "an unsupported numeric GK result is not displayed");
  assert.ok(html.includes(gkCopy.fi.missing), "the unavailable original estimate is explained");
  assert.ok(!html.includes("Reseptiluonnos"));
});

test("GK values link to centralized recipe details on every published translation", async () => {
  const sourceRecipeIds = new Set(siteContent.recipes.filter((recipe) => recipe.locale === "fi").map((recipe) => recipe.recipeId));
  const audit = JSON.parse(await readFile(path.resolve(import.meta.dirname, "../../tmp/nutrition/glycemic-load-pilot.json"), "utf8")) as {
    results: Array<{ recipeId: string; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; glycemicLoadPerServing: number | null; omittedAvailableCarbohydratePerServingG: number; ingredients: Array<{ availableCarbohydratePerServingG: number | null; gi: number | null; fineliRecordId: string | null; giRecordId: string | null }> }>;
    newPublicGkPendingSources?: Array<{recipeId:string;status:"INSUFFICIENT SOURCE DATA";glycemicLoadPerServing:null;sourceBlobSha:string}>;
  };
  const reviewedRecipeIds = new Set(audit.results.map((result) => result.recipeId));
  assert.equal(reviewedRecipeIds.size, audit.results.length, "reviewed recipes stay unique");
  assert.equal(glycemicLoadPilotReviewedRecipeCount, reviewedRecipeIds.size);
  assert.deepEqual([...reviewedRecipeIds].filter(id => !sourceRecipeIds.has(id)).sort(),
    [...publicRecipeQuarantineIds].sort(), "only explicit quarantines lack public routes");
  const pending = audit.newPublicGkPendingSources ?? [];
  const expectedPending = JSON.parse(await readFile(path.resolve(import.meta.dirname,
    "../../docs/nutrition/new-public-gk-pending-sources.json"), "utf8")) as Record<string, string>;
  const pendingPins = Object.fromEntries(pending.map(row => [row.recipeId, row.sourceBlobSha]));
  assert.deepEqual(pendingPins, expectedPending, "every approved pending source has its exact pin");
  assert.equal(Object.keys(pendingPins).length, pending.length, "pending sources must be unique");
  for(const row of pending){
    assert.equal(row.status,"INSUFFICIENT SOURCE DATA");
    assert.equal(row.glycemicLoadPerServing,null);
    assert.ok(sourceRecipeIds.has(row.recipeId));
    assert.ok(!reviewedRecipeIds.has(row.recipeId),"pending GK must not inherit a historical approval");
  }
  const allAccountedFor = new Set([...reviewedRecipeIds,...pending.map(row=>row.recipeId)]);
  assert.deepEqual([...sourceRecipeIds].filter(id => !allAccountedFor.has(id)), [],
    "every visible FI recipe needs legacy GK evidence or exact SHA-pinned pending status");
  assert.ok(glycemicLoadPilotResults.every(row => sourceRecipeIds.has(row.recipeId)),
    "no quarantined recipe can leak through the public GL data");
  const lasagneAuditRows = audit.results.filter((result) => result.recipeId === "munakoiso-kesakurpitsalasagne");
  assert.equal(lasagneAuditRows.length, 1);
  assert.equal(lasagneAuditRows[0]?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(lasagneAuditRows[0]?.glycemicLoadPerServing, null);
  assert.equal(lasagneAuditRows[0]?.ingredients.length, 15);
  assert.ok(lasagneAuditRows[0]?.ingredients.every((ingredient) => ingredient.availableCarbohydratePerServingG === null && ingredient.gi === null && ingredient.fineliRecordId === null && ingredient.giRecordId === null));
  assert.equal(glycemicLoadPilotResults.length, sourceRecipeIds.size-pending.length,
    "new public FI3 GK-HOLD cases are tracked separately, never shown as approved GK");
  const historicalMolletes = audit.results.find(result => result.recipeId === "meksikolainen-molletes-pico-de-gallolla");
  assert.equal(historicalMolletes?.glycemicLoadPerServing, 20.01, "historical molletes audit remains exact");
  const historicalOnly = new Set([
    historicalMolletes?.recipeId, "lahi-ita-zaatar-munat", "pohjoisafrikkalainen-baghrir",
    "meksikolainen-aamiais-tacot-mustapavuilla",
  ]);
  const tacosId = "meksikolainen-aamiais-tacot-mustapavuilla";
  const archivedTacos = audit.results.find(result => result.recipeId === tacosId);
  assert.equal(archivedTacos?.glycemicLoadPerServing, 16.04);
  const publicTacos = glycemicLoadPilotResults.find(result => result.recipeId === tacosId);
  assert.equal(publicTacos?.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(publicTacos?.glycemicLoadPerServing, null);
  assert.equal(glycemicLoadFilterCategories[tacosId], undefined);
  assert.equal(publicTacos?.portionEvidence?.ingredientPortion?.availableCarbsGPerServing, 25.9225);
  const tacosRoutes = siteContent.recipes.filter(recipe => recipe.recipeId === tacosId);
  assert.equal(tacosRoutes.length, 4);
  for (const recipe of tacosRoutes) {
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    assert.ok(Object.values(recipe.nutrition).every(value => value === null), recipe.routePath);
    assert.doesNotMatch(html, /data-portion-carbohydrate=|data-portion-gk=|data-gk-status="(?:CALCULATED|QUALITATIVE)"/, recipe.routePath);
    assert.match(html, /data-ingredient-carbohydrate="available"/, recipe.routePath);
    assert.ok(html.includes(publicTacos.portionEvidence!.condition![recipe.locale]), recipe.routePath);
  }
  const visibleReviewed = audit.results.filter(result => !isPublicRecipeQuarantined(result.recipeId)).map(result =>
    historicalOnly.has(result.recipeId) ? { ...result, status: "INSUFFICIENT SOURCE DATA" } : result);
  for (const id of ["lahi-ita-zaatar-munat", "pohjoisafrikkalainen-baghrir", "rahka-marjakerroskulho", "japanilainen-hojicha-jogurtti-persimonilla", "vietnamilainen-papaija-kookospuuro", "vietnamilainen-banh-xeo-aamiaisletut", "munakoiso-kesakurpitsalasagne", "vietnamilainen-banh-cuon-sienilla",
    "intialainen-pinaatti-paneer-chilla", "meksikolainen-paputostada-aamupalaksi", "meksikolainen-chilaquiles-verdes", "korealainen-kimchi-jeon-aamiaiseksi"]) {
    const current = glycemicLoadPilotResults.find(result => result.recipeId === id);
    assert.equal(current?.glycemicLoadPerServing, null, id + ": old GK is never the current estimate");
    const locales = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(locales.length, 4, id);
    for (const recipe of locales) {
      const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
      assert.doesNotMatch(html, /data-gk-status="CALCULATED"/, recipe.routePath);
      assert.match(html, /"@type":"NutritionInformation"/, recipe.routePath);
    }
  }
  const molletes = glycemicLoadPilotResults.find(result => result.recipeId === historicalMolletes?.recipeId);
  assert.equal(molletes?.glycemicLoadPerServing, null, "current molletes cannot display its historical estimate");
  assert.equal(glycemicLoadPilotResults.filter(result => result.status === "CALCULATED").length,
    visibleReviewed.filter(result => result.status === "CALCULATED").length);
  assert.equal(glycemicLoadPilotResults.filter(result => result.status === "INSUFFICIENT SOURCE DATA").length,
    visibleReviewed.filter(result => result.status === "INSUFFICIENT SOURCE DATA").length);
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
    if (isPublicRecipeQuarantined(id)) {
      assert.equal(result, undefined, `${id}: quarantined source must have no public GL row`);
      assert.ok(audit.results.some(entry => entry.recipeId === id), `${id}: the historical GK audit must remain`);
      continue;
    }
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
      if (withholdF25Nutrition(result.recipeId, recipe.locale)) {
        const undefinedLabel = f25ExplicitUndefinedGkLabel(result.recipeId, recipe.locale);
        const expectedStatus = undefinedLabel ? "NOT_DEFINED" : "WITHHELD_SOURCE_REVIEW";
        assert.ok(html.includes(`data-gk-status="${expectedStatus}"`), result.recipeId + ": explicitly withheld GK");
        assert.ok(!html.includes('data-gk-status="CALCULATED"'), result.recipeId + ": no stale original GK");
        assert.ok(!html.includes('data-gk-status="UNAVAILABLE"'), result.recipeId + ": explicitly withheld, not historically unavailable");
        assert.ok(html.includes('data-f25-nutrition-status="SOURCE_REVIEW_WITHHELD"'), result.recipeId + ": four old macros withheld");
        assert.ok(html.includes(undefinedLabel ?? "GK-arviota ei näytetä"), result.recipeId + ": withholding notice is visible");
        continue;
      }
      const methodPath = `${glycemicLoadPath(recipe.locale)}#${result.recipeId}`;
      const verbalClass = verbalGkForPortion(result.portionEvidence?.verbal, 1);
      if (result.status === "CALCULATED" && result.glycemicLoadPerServing !== null) {
        assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoad));
        assert.ok(html.includes(gkCopy[recipe.locale].see));
        assert.ok(html.includes(methodPath));
        assert.ok(result.confidence && html.includes(gkCopy[recipe.locale].levelNotes[result.confidence]), `${result.recipeId}/${recipe.locale}: confidence is visible`);
        if (result.originalGkCoverage) assert.match(html, /data-original-gk-coverage=/, recipe.routePath);
        else if (result.omittedAvailableCarbohydratePerServingG > 0) assert.ok(html.includes(recipeUi[recipe.locale].glycemicLoadOmission(new Intl.NumberFormat({ fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale], { maximumSignificantDigits: 1 }).format(result.omittedAvailableCarbohydratePerServingG))), `${result.recipeId}/${recipe.locale}: omitted small carbohydrate is disclosed`);
        const displayNumber = new Intl.NumberFormat({ fi: "fi-FI", en: "en-GB", sv: "sv-SE", th: "th-TH" }[recipe.locale], result.assessmentType ? {maximumFractionDigits:0} : {maximumSignificantDigits:1,minimumSignificantDigits:1});
        const displayed = result.glycemicLoadRangePerServing
          ? `${displayNumber.format(result.glycemicLoadRangePerServing.min)}–${displayNumber.format(result.glycemicLoadRangePerServing.max)}`
          : displayNumber.format(result.glycemicLoadPerServing);
        assert.ok(html.includes(displayed), `${result.recipeId}/${recipe.locale}: displayed GL value`);
        assert.ok(result.sourceReferences.length > 0, `${result.recipeId}: calculated result has source references`);
      } else if (verbalClass) {
        assert.equal(result.glycemicLoadPerServing, null, `${result.recipeId}: verbal class leaves numeric GK withheld`);
        assert.match(html, /data-gk-status="QUALITATIVE"/);
        assert.doesNotMatch(html, /data-portion-gk/);
        assert.ok(html.includes(methodPath), `${result.recipeId}/${recipe.locale}: verbal estimate links to its guide card`);
        assert.ok(html.includes(portionCopy[recipe.locale].class[verbalClass]), `${result.recipeId}/${recipe.locale}: standard portion class is visible`);
        assert.ok(result.portionEvidence?.reviewedSource && html.includes(result.portionEvidence.reviewedSource), `${result.recipeId}/${recipe.locale}: verbal estimate has a reviewed source`);
      } else {
        if(gkOnlyVariants.some(v=>v.recipeId===result.recipeId)){
          assert.ok(html.includes('data-macro-scope="NO_MACRO_PACKAGE_FOR_THIS_VERSION"'),`${result.recipeId}/${recipe.locale}: separately approved GK-only version is explicit`);
          assert.ok(html.includes('data-gk-status="UNAVAILABLE"'),`${result.recipeId}/${recipe.locale}: original missing GK stays explicit`);
          assert.ok(!html.includes('data-gk-status="CALCULATED"'),`${result.recipeId}/${recipe.locale}: variant never supplies original GK`);
        }
        assert.ok(html.includes(gkCopy[recipe.locale].missing), `${result.recipeId}/${recipe.locale}: missing original GK is explained`);
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
    { route: "glykeeminen-kuorma", locale: "fi", ogLocale: "fi_FI", title: "Reseptien glykeeminen kuorma (GK) | Recipavo", description: "Löydä reseptien glykeemisen kuorman (GK) arviot, luotettavuustiedot ja tarvittaessa tarkat laskentalähteet.", canonical: `${siteTarget.baseUrl}/glykeeminen-kuorma/` },
    { route: "en/glycemic-load", locale: "en", ogLocale: "en_GB", title: "Glycemic load (GL) of recipes | Recipavo", description: "Explore calculated glycemic load estimates for recipes, their reliability and detailed sources.", canonical: `${siteTarget.baseUrl}/en/glycemic-load/` },
    { route: "sv/glykemisk-belastning", locale: "sv", ogLocale: "sv_SE", title: "Receptens glykemiska belastning (GL) | Recipavo", description: "Hitta uppskattningar av receptens glykemiska belastning, tillförlitlighet och detaljerade källor.", canonical: `${siteTarget.baseUrl}/sv/glykemisk-belastning/` },
    { route: "th/glycemic-load", locale: "th", ogLocale: "th_TH", title: "ค่าภาระน้ำตาลในเลือด (GL) ของสูตรอาหาร | Recipavo", description: "ค้นหาค่าภาระน้ำตาลในเลือด (GL) ของสูตรอาหาร พร้อมระดับความน่าเชื่อถือและแหล่งข้อมูลการคำนวณ", canonical: `${siteTarget.baseUrl}/th/glycemic-load/` },
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
    assert.match(html, /name="robots" content="noindex, nofollow"/);
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
  const root = html.match(/<div id="root">([\s\S]*)<\/div>\s*<script id="page-content" type="application\/json">/);
  assert.ok(root, "root element contains prerendered markup");
  assert.match(root[1], /<h1>Kermainen lohipata<\/h1>/);
  assert.match(root[1], /<h2 id="recipe-ingredients-title">Ainekset<\/h2>/);
  assert.match(root[1], /lohifilee/);
  assert.match(root[1], /<h2 id="recipe-instructions" tabindex="-1">Valmistus<\/h2>/);
  assert.match(root[1], /<h2>Ravintoarvot annosta kohti<\/h2>/);
  assert.match(html, /<html lang="fi">/);
  assert.match(html, new RegExp(String.raw`rel="canonical" href="${buildOriginPattern}/kermainen-lohipata\/"`));
  assert.match(html, new RegExp(String.raw`hreflang="x-default" href="${buildOriginPattern}/kermainen-lohipata\/"`));
  assert.match(root[1], /class="recipe-languages"/);
  assert.match(root[1], /hrefLang="en" href="\/en\/recipes\/kermainen-lohipata\/"/);
  assert.match(root[1], /hrefLang="sv" href="\/sv\/recept\/kermainen-lohipata\/"/);
  assert.match(root[1], /hrefLang="th" href="\/th\/recipes\/kermainen-lohipata\/"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, new RegExp(String.raw`property="og:image" content="${buildOriginPattern}/kuvat\/paaruoat\/kermainen-lohipata\.webp"`));
  assert.match(root[1], new RegExp(String.raw`<img class="recipe-image" src="${buildOriginPattern}/kuvat\/paaruoat\/kermainen-lohipata\.webp"[^>]* alt="Kermainen lohipata lohipaloilla, pinaatilla ja tillillä" width="1254" height="1254"`));
  const jsonLdMatch = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch);
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Recipe");
  assert.equal(jsonLd.name, "Kermainen lohipata");
  assert.equal(jsonLd.recipeYield, "4");
  assert.deepEqual(jsonLd.image, [`${siteTarget.baseUrl}/kuvat/paaruoat/kermainen-lohipata.webp`]);
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
    assert.ok(html.includes(`rel="canonical" href="${siteTarget.baseUrl}${translation.route}"`));
    for (const [locale, route] of hreflangPaths) {
      assert.ok(html.includes(`hreflang="${locale}" href="${siteTarget.baseUrl}${route}"`));
    }
    assert.ok(html.includes(`hreflang="x-default" href="${siteTarget.baseUrl}/jauheliha-makaronilaatikko/"`));
    const jsonLdMatch = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch);
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    assert.equal(jsonLd.name, translation.title);
    assert.equal(jsonLd.inLanguage, translation.locale);
    assert.equal(jsonLd.recipeYield, "8");
    assert.equal(jsonLd.recipeInstructions.length, 7);
    assert.equal(jsonLd.nutrition.proteinContent, "47.63 g");
    assert.deepEqual(jsonLd.image, [`${siteTarget.baseUrl}/kuvat/paaruoat/jauheliha-makaronilaatikko.webp`]);
  }
});

test("published keto bun page includes its content and omitted amounts remain omitted", async () => {
  const html = await readFile(path.join(dist, "keto-kauralesesampylat", "index.html"), "utf8");
  assert.match(html, /<h1>Keto-kauralesesämpylät<\/h1>/);
  assert.match(html, /seesaminsiemeniä/);
  assert.match(html, /halutessasi pinnalle/);
  assert.match(html, /Psyllium sitoo pehmeää taikinaa/);
  assert.doesNotMatch(html, /raakileiden raejuustopohja/);
  assert.match(html, new RegExp(String.raw`src="${buildOriginPattern}/kuvat\/leivonnaiset\/keto-kauralesesampylat\.webp"`));
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, new RegExp(String.raw`"image":\["${buildOriginPattern}/kuvat\/leivonnaiset\/keto-kauralesesampylat\.webp"\]`));
});

test("localized 404 pages never hydrate a recipe or emit indexable metadata", async () => {
  for (const [locale, directory, indexPath] of [["fi", "", "/"], ["en", "en", "/en/recipes/"], ["sv", "sv", "/sv/recept/"], ["th", "th", "/th/recipes/"]] as const) {
    const html = await readFile(path.join(dist, directory, "404.html"), "utf8");
    assert.ok(html.includes('<html lang="' + locale + '">'));
    assert.ok(html.includes("<h1>" + recipeUi[locale].notFound + "</h1>"));
    assert.ok(html.includes('<p><a href="' + indexPath + '"'));
    assert.ok(html.includes('>' + recipeUi[locale].backToRecipes + '</a></p>'));
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html, /rel="canonical"|recipe-jsonld|"@type":"Recipe"|hreflang=|x-default|<script type="module"/);
  }
});

test("local sitemap uses root paths and robots lets crawlers read noindex", async () => {
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
  assert.match(sitemap, new RegExp(String.raw`${buildOriginPattern}/kermainen-lohipata\/`));
  assert.match(sitemap, new RegExp(String.raw`${buildOriginPattern}/keto-kauralesesampylat\/`));
  assert.match(sitemap, new RegExp(String.raw`${buildOriginPattern}/en\/recipes\/high-protein-beef-macaroni-bake\/`));
  assert.match(sitemap, new RegExp(String.raw`${buildOriginPattern}/sv\/recept\/proteinrik-makaronilada-med-kottfars\/`));
  assert.match(sitemap, new RegExp(String.raw`${buildOriginPattern}/th\/recipes\/makaroni-op-nuea-bot-protein-sung\/`));
  assert.doesNotMatch(sitemap, new RegExp(String.raw`${buildOriginPattern}/kaalilaatikko\/`));
  assert.doesNotMatch(sitemap, /raakileet|\.md/);
  assert.doesNotMatch(sitemap, /\?(?:q|category|diet)=/);
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /^Sitemap:/mi);
});

test("the root build omits the retired GitHub Pages ownership file", async () => {
  await assert.rejects(readFile(path.join(dist, "google0c6f9c0486376f0f.html")), { code: "ENOENT" });
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
    assert.ok(html.includes(`rel="canonical" href="${siteTarget.baseUrl}${recipe.routePath}"`));
    if (recipe.recipeId in times) assert.equal(jsonld.totalTime, `PT${times[recipe.recipeId]}M`);
    if (renamed.includes(recipe.recipeId)) {
      assert.equal(page.recipe.dietClass, null);
      assert.doesNotMatch([jsonld.name, jsonld.keywords, jsonld.description].join(" "), /keto|คีโต|\bVHH\b|low.carb|lågkolhydrat/i);
    }
  }
});


test("published serving instructions keep baked portions and retained ingredients with the GL estimate", async () => {
  const cases = [
    ["munakasmuffinit", "fi", 3, "Yksi annos on kaksi muffinssia."],
    ["munakasmuffinit", "en", 3, "six muffins, two per serving."],
    ["munakasmuffinit", "sv", 3, "sex muffins, två per portion."],
    ["munakasmuffinit", "th", 3, "มัฟฟิน 6 ชิ้น เสิร์ฟที่ละ 2 ชิ้น"],
    ["tonnikalamunakkaat-uunissa", "fi", 3, "Yksi annos on kaksi pientä munakasta."],
    ["tonnikalamunakkaat-uunissa", "en", 3, "six mini omelettes, two per serving."],
    ["tonnikalamunakkaat-uunissa", "sv", 3, "sex små omeletter, två per portion."],
    ["tonnikalamunakkaat-uunissa", "th", 3, "ไข่อบ 6 ชิ้น เสิร์ฟที่ละ 2 ชิ้น"],
    ["uunimuna-avokadot", "fi", 2, "Säästä kaikki koverrettu hedelmäliha tarjoiluun.",
      "kahteen yhtä suureen annokseen. Ota mukaan myös erillisessä vuoassa kypsennetty muna."],
    ["vhh-lihamureke", "fi", 6, "koko mureke ja paistoneste kuuteen yhtä suureen annokseen."],
    ["vhh-lihamureke", "en", 6, "the meatloaf and all the cooking juices into six equal portions."],
    ["vhh-lihamureke", "sv", 6, "hela limpan och all steksky på sex lika stora portioner."],
    ["vhh-lihamureke", "th", 6, "พร้อมน้ำจากการอบทั้งหมดเป็น 6 ส่วนเท่า ๆ กัน"],
  ] as const;
  for (const [id, locale, servings, ...copy] of cases) {
    const recipe = siteContent.recipes.find(row => row.recipeId === id && row.locale === locale);
    assert.ok(recipe, id + "/" + locale);
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const filename = contentManifest[recipe.routePath];
    assert.ok(filename, recipe.routePath);
    const payload = parseRouteContent(JSON.parse(await readFile(path.join(dist, "data", filename), "utf8")), recipe.routePath);
    assert.ok(payload?.recipe, recipe.routePath);
    assert.equal(payload.recipe.servings, servings, recipe.routePath);
    assert.match(markup, /data-portion-gk=/, recipe.routePath);
    for (const line of copy) {
      assert.ok(markup.includes(line), recipe.routePath + " prerendered instruction");
      assert.ok(payload.recipe.instructionsHtml.includes(line), recipe.routePath + " interactive route");
      if (payload.recipe.instructionStepsHtml?.length) {
        assert.ok(payload.recipe.instructionStepsHtml.some(step => step.includes(line)), recipe.routePath + " checklist");
      }
    }
  }
});

test("portion cards show the baked-piece equivalence and the jasmine rice preparation limit", async () => {
  const reviews = await loadReviewedPortions(path.resolve(import.meta.dirname, "../.."));
  const pieceRecipes = ["munakasmuffinit", "tonnikalamunakkaat-uunissa"];
  const rice = "indonesialainen-nasi-uduk-aamiaisella";
  for (const id of [...pieceRecipes, rice]) {
    const recipes = siteContent.recipes.filter(recipe => recipe.recipeId === id);
    assert.equal(recipes.length, 4, id);
    for (const { routePath, locale } of recipes) {
      const html = await readFile(path.join(dist, routePath.slice(1), "index.html"), "utf8");
      const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      const filename = contentManifest[routePath];
      assert.ok(filename, routePath);
      const payload = parseRouteContent(JSON.parse(await readFile(path.join(dist, "data", filename), "utf8")), routePath);
      const portion = payload.glycemicRecipe?.portionEvidence;
      assert.match(visible, /data-portion-gk=/, routePath);
      assert.match(visible, /data-portion-carbohydrate="available"/, routePath);
      if (id === rice) {
        const condition = reviews[id].condition?.[locale];
        assert.ok(condition && visible.includes(condition), routePath);
        assert.equal(portion?.condition?.[locale], condition, routePath);
        assert.equal(payload.glycemicRecipe?.result?.glycemicLoadPerServing, 26.37, routePath);
        assert.equal(portion?.reviewedSource, "https://doi.org/10.1186/1475-2891-13-50", routePath);
      } else {
        assert.equal(portion?.piecesPerServing, 2, routePath);
        assert.ok(visible.includes(portionCopy[locale].pieces("2")), routePath);
        assert.equal(payload.recipe?.servings, 3, routePath);
      }
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
    ["tunisialainen-brik", "th", "ต้มไข่จนทั้งไข่ขาวและไข่แดงแข็ง", "ตามแบบดั้งเดิม ไข่ด้านในยังเยิ้มอยู่"],
  ] as const;
  for (const [id, locale, expected, rejected] of cases) {
    const recipe = siteContent.recipes.find((r) => r.recipeId === id && r.locale === locale)!;
    const html = await readFile(path.join(dist, recipe.routePath.slice(1), "index.html"), "utf8");
    assert.ok(html.includes(expected), `${id}/${locale}: visible correction`);
    assert.ok(!html.includes(rejected), `${id}/${locale}: no old mistranslation`);
    const schema = JSON.parse(html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(schema.name, recipe.title);
    assert.ok(html.includes(`rel="canonical" href="${siteTarget.baseUrl}${recipe.routePath}"`));
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
    const embedded = html.match(/<script id="page-content" type="application\/json">([\s\S]*?)<\/script>/);
    assert.deepEqual(JSON.parse(embedded![1]), payload, route + ": SSR and navigation data match");
    if (recipe) {
      assert.ok(payload.glycemicRecipe);
      assert.ok(!payload.glycemicRecipe.result || payload.glycemicRecipe.result.recipeId === recipe.recipeId);
      assert.ok(payload.glycemicRecipe.variants.every((item: { recipeId: string }) => item.recipeId === recipe.recipeId));
    } else {
      assert.equal(payload.glycemicRecipe, undefined);
    }
    if (["/glykeeminen-kuorma/", "/en/glycemic-load/", "/sv/glykemisk-belastning/", "/th/glycemic-load/"].includes(route)) {
      assert.ok(payload.glycemicOverview.results.length > 0);
    } else {
      assert.equal(payload.glycemicOverview, undefined);
    }
    const expected = recipe ? [recipe] : payload.recipes;
    if (route.startsWith("/ruokaopas/")) {
      assert.equal(imgs.length, route === "/ruokaopas/" ? 12 : 1);
      for (const img of imgs) {
        assert.ok(img.alt, route);
        assert.match(img.src, /^\/ruokaopas\/(?:kuvitus\/[a-z0-9-]+|briossi|gk)\.svg$/);
        assert.ok((await readFile(path.join(dist, img.src.replace(/^\//, "")))).length > 0);
      }
    } else {
      assert.equal(imgs.length, expected.filter((r: {image: unknown}) => r.image).length);
    }
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
        assert.match(url, new RegExp(String.raw`^${buildOriginPattern}/kuvat\/`));
        assert.match(width, /^\d+w$/);
        assert.ok((await readFile(path.join(dist, "kuvat", url.split("/kuvat/")[1]))).length);
      }
    }
    for (const tag of html.matchAll(/<link rel="preload" as="image"[^>]*>/g)) {
      const preload = attributes(tag[0]);
      if (preload.type === "image/avif") {
        const sources = [...html.matchAll(/<source\b[^>]*>/g)].map((match) => attributes(match[0]));
        assert.ok(sources.some((source) => source.type === preload.type &&
          source.media === preload.media && source.srcset === preload.href), 'AVIF preload must match a picture source at ' + route);
        assert.match(preload.href, new RegExp(String.raw`^${buildOriginPattern}/kuvat\/_variants\/.+\.avif$`));
        assert.ok((await readFile(path.join(dist, "kuvat", preload.href.split("/kuvat/")[1]))).length);
        continue;
      }
      const img = imgs.find((image) => image.srcset === preload.imagesrcset);
      assert.ok(img, `${route}: preload must match an image`);
      assert.equal(preload.imagesizes, img.sizes);
      if (preload.href) assert.equal(preload.href, img.src);
    }
    assert.ok(html.includes(`rel="canonical" href="${siteTarget.baseUrl}${route}"`));
    if (recipe) {
      assert.deepEqual(payload.recipe.image, recipe.image);
      const structured = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
      if (recipe.image) {
        assert.ok(structured, route);
        assert.deepEqual(JSON.parse(structured[1]).image, [recipe.image.src]);
        assert.ok(html.includes(`property="og:image" content="${recipe.image.src}"`));
      } else {
        assert.equal(structured, null, route);
        assert.doesNotMatch(html, /property="og:image"|name="twitter:image"/);
      }
      for (const translation of siteContent.recipes.filter((r) => r.recipeId === recipe.recipeId)) {
        assert.ok(html.includes(`hreflang="${translation.locale}" href="${siteTarget.baseUrl}${translation.routePath}"`));
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
    fi:{omitted:'Dokumentoituja pieniä osuuksia on jätetty pois',none:'Laskelma kattaa ohjeen ainesluettelon imeytyvät hiilihydraatit',method:'Mahdolliset pienet poisrajaukset',path:'glykeeminen-kuorma',oldMethod:'Tässä polussa kaikki imeytyvät hiilihydraatit lasketaan mukaan eikä pieniä osuuksia jätetä pois.'},
    en:{omitted:'Small amounts of available carbohydrate are left out',none:'The calculation covers the available carbohydrate in the listed ingredients',method:'Each recipe shows the total amount of available carbohydrate left out',path:'en/glycemic-load',oldMethod:'This path includes all available carbohydrate and omits no small portions.'},
    sv:{omitted:'Dokumenterade små mängder har utelämnats',none:'Beräkningen omfattar de tillgängliga kolhydraterna i de angivna ingredienserna',method:'Eventuella utelämnade små mängder',path:'sv/glykemisk-belastning',oldMethod:'Här räknas alla tillgängliga kolhydrater med utan utelämnade små mängder.'},
    th:{omitted:'การคำนวณนี้ไม่รวมส่วนผสมปริมาณเล็กน้อย',none:'การคำนวณครอบคลุมคาร์โบไฮเดรตที่ใช้ได้ในวัตถุดิบตามรายการ',method:'หากมีส่วนผสมปริมาณเล็กน้อยที่ไม่รวมในการคำนวณ',path:'th/glycemic-load',oldMethod:'แนวทางนี้รวมคาร์โบไฮเดรตที่ใช้ได้ทั้งหมดโดยไม่ตัดส่วนเล็กน้อยออก'},
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
    if (locale === 'en') {
      assert.match(method, /without a matching GI value.*less than 1 g of available carbohydrate per serving.*below 2 g per serving/);
      assert.match(method, /The amount left out is shown/);
    }
  }
});

test('approved GK-only versions appear on each locale and home-recipe coverage is reported separately',async()=>{

 for(const variant of gkOnlyVariants){
  const recipePages=siteContent.recipes.filter(r=>r.recipeId===variant.recipeId);
  assert.ok(recipePages.some(recipe=>recipe.locale==='fi'),variant.recipeId);
  for(const recipe of recipePages){
   const html=await readFile(path.join(dist,recipe.routePath.slice(1),'index.html'),'utf8'),t=gkOnlyUi[recipe.locale];
   assert.ok(html.includes(`data-gk-version="${variant.versionId}"`),recipe.routePath);
   if (gkVariantScope(variant) === 'STUDY_COMPARISON') {
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
   const withheld = withholdF25Nutrition(variant.recipeId, recipe.locale);
   const explicitlyUndefined = f25ExplicitUndefinedGkLabel(variant.recipeId, recipe.locale) !== null;
   assert.equal(html.includes('data-gk-status="CALCULATED"'), originalHasGk && !withheld, recipe.routePath);
   assert.equal(html.includes('data-gk-status="UNAVAILABLE"'), !originalHasGk && !withheld, recipe.routePath);
   assert.equal(html.includes('data-gk-status="WITHHELD_SOURCE_REVIEW"'), withheld && !explicitlyUndefined, recipe.routePath);
   assert.equal(html.includes('data-gk-status="NOT_DEFINED"'), explicitlyUndefined, recipe.routePath);
   if (!originalHasGk && !withheld) assert.ok(html.includes(gkCopy[recipe.locale].missing), recipe.routePath);
   if (withheld) assert.ok(html.includes('data-f25-nutrition-status="SOURCE_REVIEW_WITHHELD"'), recipe.routePath);
   if(variant.scenarioRange)assert.ok(html.includes(t.range));if(variant.sensitivity)assert.ok(html.includes(t.sensitivityNote));

  }
 }
 const releases=loadAuthorizedGk100Variants(path.resolve(import.meta.dirname,'../..'));
 for(const release of releases){
  assert.equal(gkOnlyVariants.some(variant=>variant.versionId===release.versionId),
     !isPublicRecipeQuarantined(release.recipeId),
     release.versionId + ": approval survives internally but cannot leak into public GK");
 }
 for(const p of ['glykeeminen-kuorma','en/glycemic-load','sv/glykemisk-belastning','th/glycemic-load']){
  const html=await readFile(path.join(dist,p,'index.html'),'utf8');assert.ok(html.replaceAll('<!-- -->','').includes(`data-gk-coverage="version-aware"><li><strong>${gkVersionCoverage.numericRecipes}</strong> / ${gkVersionCoverage.total}`));assert.ok(html.includes(`<strong>${gkVersionCoverage.missing}</strong>`));assert.ok(html.includes('data-gk-coverage="version-aware"'));assert.ok(html.includes('data-gk-coverage="original"'));assert.ok(html.includes(`<strong>${gkVersionCoverage.originalNumeric}</strong>`));assert.ok(html.includes(`<strong>${gkVersionCoverage.total - gkVersionCoverage.originalNumeric}</strong>`));
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
    assert.ok(!html.includes('data-gk-status="CALCULATED"'));
    assert.ok(html.includes(gkCopy[locale].missing));
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

test("copyright policy is unobtrusive, accessible and prerendered in all four languages", async () => {
  for (const [locale, route] of [["fi", ""], ["en", "en/recipes"], ["sv", "sv/recept"], ["th", "th/recipes"]] as const) {
    const html = await readFile(path.join(dist, route, "index.html"), "utf8");
    const footer = html.slice(html.indexOf('<footer class="site-footer">'));
    assert.ok(footer.includes('<details class="recipe-about recipe-copyright">'), `${locale}: rights disclosure in footer`);
    assert.ok(footer.includes(`<summary>${copyrightUi[locale].title}</summary>`), `${locale}: translated summary`);
    assert.ok(footer.includes(copyrightUi[locale].background), `${locale}: SSR policy available before JavaScript`);
    assert.ok(footer.includes(copyrightUi[locale].sourceLabel), `${locale}: recognized guidance linked`);
    assert.ok(footer.includes(`href="${copyrightSourceUrl}"`), `${locale}: source URL`);
    assert.ok(footer.includes('href="https://github.com/ozirix-dev/Reseptit/issues"'), `${locale}: correction channel`);
  }
});


test("reviewed historical recipe links resolve to public routes in the reader's language", async () => {
  for (const prefix of ["", "/en/recipes", "/sv/recept", "/th/recipes"]) {
    const roastBeef = await readFile(path.join(dist, prefix, "naudan-paahtopaisti-uunissa/index.html"), "utf8");
    for (const slug of ["paahtopaistileipa-piparjuurikastikkeella", "paahtopaistileivat-kauralesesampyloilla"]) {
      assert.ok(roastBeef.includes(` href="${prefix}/${slug}/"`), ` ${prefix}: ${slug}`);
      const related = await readFile(path.join(dist, prefix, slug, "index.html"), "utf8");
      assert.ok(related.includes(` href="${prefix}/naudan-paahtopaisti-uunissa/"`));
      assert.doesNotMatch(related, /href="https:\/\/ozirix-dev\.github\.io\//);
    }
  }
});

test("GL evidence keeps localized names when a Finnish ingredient is reformatted", () => {
  const result = glycemicLoadPilotResults.find(entry => entry.recipeId === "jauhelihapihvit-vhh-kermakastikkeella");
  const cream = result?.ingredientEvidence?.find(ingredient => ingredient.ingredientNames.fi === "kuohukermaa pihveihin, 38 %");
  assert.ok(cream, "the reformatted cream still has a GL evidence row");
  for (const locale of ["en", "sv", "th"] as const) {
    assert.ok(cream.ingredientNames[locale], "missing cream label for " + locale);
  }
});
