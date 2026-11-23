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
const id = "karibia-maissipuuro-kookoksella";
const expectedFI = "Maissijauho kypsennetään ensin vedessä puuroksi. " +
  "Kookosmaito, kaneli ja vaniljauute lisätään kypsän puuron joukkoon.";
const sources = {
  fi: ["reseptit/aamupalat/karibia-maissipuuro-kookoksella.md", "333d09f877aeb75e74fdc7661691de20ab972954"],
  en: ["kaannokset/en/aamupalat/karibia-maissipuuro-kookoksella.md", "dbeb5cc13dfa107d45692e22d8d5b0c05bb087df"],
  sv: ["kaannokset/sv/aamupalat/karibia-maissipuuro-kookoksella.md", "d08e8609799fda8cfb2fe3068877a5da533fa8e3"],
  th: ["kaannokset/th/aamupalat/karibia-maissipuuro-kookoksella.md", "7f2f67973cf3912dba0e53c932e47001f9ffc285"],
} as const;

function gitBlobSha(content: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(content) + "\0" + content).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 Caribbean corn porridge: water-first FI description, protected four-locale sources (" + locale + ")", () => {
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
      assert.doesNotMatch(published.description, /kypsyy kookosmaidossa/);
      assert.match(cooking, /100 g hienoa ei-nixtamalisoitua maissijauhoa 700 g veteen/);
      assert.match(cooking, /Lisää 184 g kookosmaitoa/);
      assert.ok(cooking.indexOf("700 g veteen") < cooking.indexOf("184 g kookosmaitoa"));
    } else {
      assert.notEqual(published.description, expectedFI, "non-FI description remains localized");
      assert.equal(published.description, publicRecipeDescription(id, source.url_slug, locale),
        "keep pre-existing translated public copy without new overrides");
      assert.ok(published.description.length > 10);
    }
  });
}
