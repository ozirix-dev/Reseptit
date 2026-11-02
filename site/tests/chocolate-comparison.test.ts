import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parse } from "yaml";
import { ChocolateComparisonFi, chocolateComparisonProducts } from "../src/features/recipes/ChocolateComparisonFi";
import { fingerprint } from "../scripts/gk80-candidate-model";
import { digest, textHash } from "../scripts/gk149-model";
import type { RecipeLocale } from "../src/types/content";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const render = (recipeId = "keto-mutakakku", locale: RecipeLocale = "fi") => renderToStaticMarkup(h(ChocolateComparisonFi, { recipeId, locale }));

test("two named Torras products retain their own verified manufacturer source bindings", () => {
  const pilot = JSON.parse(read("docs/nutrition/gk-scenarios-01/pilot.json"));
  assert.equal(chocolateComparisonProducts.length, 2);
  assert.deepEqual(chocolateComparisonProducts.map(p => p.id), ["torras-maltitol", "torras-stevia"]);
  for (const product of chocolateComparisonProducts) {
    const source = pilot.sources.find((s: { id: string }) => s.id === product.sourceId);
    const { evidenceHash, ...observation } = source;
    assert.equal(fingerprint(observation), evidenceHash);
    assert.equal(product.sourceEvidenceHash, evidenceHash);
    assert.equal(product.sourceUrl, source.url);
    assert.equal(new URL(product.sourceUrl).hostname, "chocolatestorras.com");
    assert.equal(source.retrievedAt.slice(0, 10), "2026-11-02");
    assert.ok(Number(source.observation.carbohydrate) > Number(source.observation.polyols), "Both descriptions retain non-polyol carbohydrate");
  }
  assert.match(chocolateComparisonProducts[0].note, /tunnistetiedot.*ristiriidassa/);
  assert.equal(pilot.sources.find((s: { id: string }) => s.id === "torras-maltitol").observation.polyolIngredients[0], "maltitol");
  assert.deepEqual(pilot.sources.find((s: { id: string }) => s.id === "torras-stevia").observation.polyolIngredients, ["erythritol", "steviol glycosides"]);
});

test("disclosure is confined to the two Finnish recipes and is collapsed in server HTML", () => {
  for (const recipeId of ["keto-mutakakku", "keto-suklaakeksit"]) {
    const html = render(recipeId);
    assert.match(html, /^<details class="recipe-panel chocolate-comparison"/);
    assert.doesNotMatch(html, /<details[^>]*\sopen(?:=|\s|>)/);
    assert.equal((html.match(/data-chocolate-product=/g) ?? []).length, 2);
    for (const locale of ["en", "sv", "th"] as const) assert.equal(render(recipeId, locale), "");
  }
  for (const id of ["vhh-juustokakku", "", "unknown"]) assert.equal(render(id), "");
});

test("public comparison explains sweeteners and missing whole-cake evidence without numerical GL or nutrition fields", () => {
  const cake = render();
  const cookies = render("keto-suklaakeksit");
  assert.match(cake, /ei voida määrittää koko kakun GK:ta/);
  assert.match(cookies, /ei voida määrittää valmiiden keksien GK:ta/);
  assert.match(cookies, /Suklaa käännellään taikinaan paloina/);
  assert.doesNotMatch(cookies, /kakun/);
  const html = cake + cookies;
  assert.ok(html.includes("Miten käyttämäsi suklaa vaikuttaa GK-arvioon?"));
  assert.ok(html.includes("Makeutusaineet: Maltitoli"));
  assert.ok(html.includes("Makeutusaineet: Erytritoli ja stevioliglykosidit"));
  assert.ok(html.includes("stevia-nimi ei tarkoita hiilihydraatitonta suklaata"));
  assert.ok(html.includes("ei voida määrittää koko kakun GK:ta tai tuotteiden välistä GK-eroa"));
  assert.ok(html.includes("erikseen lisättävä erytritoli"));
  assert.ok(html.includes("laskettu osuus koskee vain siinä kuvattua laskentaversiota"));
  assert.doesNotMatch(html, /0[,.]0[37]|3[,.]0|1[,.]97|35,4|48 g|29 g|GK\s*[≈=]|g\/annos|glykemi.*matala/i);
  assert.doesNotMatch(html, /<script|itemprop|itemscope|application\/ld\+json|data-gk-level|data-nutrition|<select|<input/);
  assert.doesNotMatch(html, /Wawel|AFCD|F009837/);
  for (const product of chocolateComparisonProducts) assert.ok(html.includes(`href="${product.sourceUrl}"`));
});

test("existing exact mud-cake version and original withheld macros remain unchanged", () => {
  const folder = "docs/nutrition/gk80-operation149/";
  const recipeCase = JSON.parse(read(folder + "cases.json")).cases.find((c: { recipeId: string }) => c.recipeId === "keto-mutakakku");
  const { inputSha256, ...body } = recipeCase;
  assert.equal(digest(body), inputSha256);
  assert.equal(inputSha256, "b373e5621c6c939eaec2af8c9c11cd687f0a4b0f179159b5d143d2d4141e6af3");
  const gold = JSON.parse(read(folder + "golden.json")).results.find((r: { recipeId: string }) => r.recipeId === "keto-mutakakku");
  assert.equal(gold.point, 0.07); assert.equal(gold.omittedCho, 1.3774);
  const recipeText = read(recipeCase.paths.fi);
  assert.equal(textHash(recipeText), recipeCase.recipeSha256.fi);
  const frontmatter = parse(recipeText.match(/^---\r?\n([\s\S]*?)\r?\n---/)![1]);
  for (const key of ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"]) assert.equal(frontmatter[key], null);
  assert.equal(frontmatter.servings, 8);
});
