import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { publicRecipeDescription } from "../scripts/public-recipe-copy";

const root = path.resolve(import.meta.dirname, "../..");
const id = "meksikolainen-atole-maissipuuro";
const expectedFI = "Hieno maissijauho kypsennetään ensin vedessä puuroksi. " +
  "Maito, kaneli ja vaniljauute lisätään valmiin puuron joukkoon.";
const sources = {
  fi: ["reseptit/aamupalat/meksikolainen-atole-maissipuuro.md", "2b590527bb2bde67da5ff60f1326f499043ebb54"],
  en: ["kaannokset/en/aamupalat/meksikolainen-atole-maissipuuro.md", "0f1ed9dab9c1514bd0498e606311b0113650aa2e"],
  sv: ["kaannokset/sv/aamupalat/meksikolainen-atole-maissipuuro.md", "b3820ebf9b547293e9c361de697b7a6a93170e56"],
  th: ["kaannokset/th/aamupalat/meksikolainen-atole-maissipuuro.md", "50262a5eab9558cfd218e8a191af692e27a5581d"],
} as const;

function gitBlobSha(content: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(content) + "\0" + content).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 atole: water-first FI description, protected four-locale sources (" + locale + ")", () => {
    const [relative, sourceSha] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlobSha(raw), sourceSha, "protected source changed: " + locale);
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 25);

    const entries = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(entries.length, 1, "exactly one public locale entry");
    const published = entries[0];
    assert.equal(published.servings, source.servings);
    assert.equal(published.timeTotalMin, source.time_total_min);
    assert.equal(published.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(published.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(published.ingredients[i].unit, source.ingredients[i].unit);
    }
    assert.deepEqual(published.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    assert.equal(published.instructionsText.length, 3);
    const cooking = published.instructionsText.join(" ");
    if (locale === "fi") {
      assert.equal(publicRecipeDescription(id, source.url_slug, locale), expectedFI);
      assert.equal(published.description, expectedFI);
      assert.doesNotMatch(published.description, /maitoon keitettävän/);
      assert.match(cooking, /100 g hienoa ei-nixtamalisoitua maissijauhoa 700 g veteen/);
      assert.match(cooking, /Lisää 200 g täysmaitoa/);
      assert.ok(cooking.indexOf("700 g veteen") < cooking.indexOf("200 g täysmaitoa"));
    } else {
      assert.notEqual(published.description, expectedFI, "non-FI description remains localized");
      assert.equal(published.description, publicRecipeDescription(id, source.url_slug, locale),
        "keep pre-existing translated public copy without new overrides");
      assert.ok(published.description.length > 10);
    }
  });
}
