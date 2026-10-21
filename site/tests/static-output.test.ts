import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const dist = path.resolve(import.meta.dirname, "../dist");

test("recipe index is prerendered and links only published languages", async () => {
  const html = await readFile(path.join(dist, "index.html"), "utf8");
  assert.match(html, /<h1>Reseptit<\/h1>/);
  assert.match(html, /<a class="recipe-card__link" href="\/Reseptit\/kermainen-lohipata\/"[\s\S]*?<h3 class="recipe-card__title">Kermainen lohipata<\/h3>/);
  assert.match(html, /<a class="recipe-card__link" href="\/Reseptit\/keto-kauralesesampylat\/"[\s\S]*?<h3 class="recipe-card__title">Keto-kauralesesämpylät<\/h3>/);
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
});

test("prerendered recipe HTML includes useful content before JavaScript", async () => {
  const html = await readFile(path.join(dist, "kermainen-lohipata", "index.html"), "utf8");
  const root = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  assert.ok(root, "root element contains prerendered markup");
  assert.match(root[1], /<h1>Kermainen lohipata<\/h1>/);
  assert.match(root[1], /<h2 id="recipe-ingredients-title">Ainekset<\/h2>/);
  assert.match(root[1], /lohifilee/);
  assert.match(root[1], /<h2>Valmistus<\/h2>/);
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
  assert.match(root[1], /<img class="recipe-image" src="https:\/\/ozirix-dev\.github\.io\/Reseptit\/kuvat\/paaruoat\/kermainen-lohipata\.webp" alt="Kermainen lohipata lohipaloilla, pinaatilla ja tillillä" width="1254" height="1254"/);
  const jsonLdMatch = html.match(/<script id="recipe-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch);
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Recipe");
  assert.equal(jsonLd.name, "Kermainen lohipata");
  assert.equal(jsonLd.recipeYield, 4);
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
    assert.ok(root[1].includes(`<h2>${translation.instructionHeading}</h2>`));
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
    assert.equal(jsonLd.recipeYield, 8);
    assert.equal(jsonLd.recipeInstructions.length, 7);
    assert.equal(jsonLd.nutrition.proteinContent, "45 g");
    assert.deepEqual(jsonLd.image, ["https://ozirix-dev.github.io/Reseptit/kuvat/paaruoat/jauheliha-makaronilaatikko.webp"]);
  }
});

test("published keto bun page includes its content and omitted amounts remain omitted", async () => {
  const html = await readFile(path.join(dist, "keto-kauralesesampylat", "index.html"), "utf8");
  assert.match(html, /<h1>Keto-kauralesesämpylät<\/h1>/);
  assert.match(html, /seesaminsiemeniä/);
  assert.match(html, /halutessasi pinnalle/);
  assert.match(html, /Pehmeät, proteiinia sisältävät sämpylät/);
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
