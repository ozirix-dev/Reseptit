import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const dist = path.resolve(import.meta.dirname, "../dist");

test("recipe index is prerendered and links only published languages", async () => {
  const html = await readFile(path.join(dist, "index.html"), "utf8");
  assert.match(html, /<h1>Reseptit<\/h1>/);
  assert.match(html, /<h3><a href="\/Reseptit\/kermainen-lohipata\/"/);
  assert.match(html, /<h3><a href="\/Reseptit\/keto-kauralesesampylat\/"/);
  assert.match(html, /rel="canonical" href="https:\/\/ozirix-dev\.github\.io\/Reseptit\/"/);
  assert.match(html, /hreflang="fi"/);
  assert.doesNotMatch(html, /hreflang="(?:en|sv|th)"|recipe-jsonld/);
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
  assert.doesNotMatch(html, /en\/recipes|sv\/recept|th\/recipes/);
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
  assert.doesNotMatch(sitemap, /kaalilaatikko|raakileet|\.md/);
  assert.match(robots, /Project-path robots\.txt/);
  assert.match(robots, /Sitemap: https:\/\/ozirix-dev\.github\.io\/Reseptit\/sitemap\.xml/);
});
