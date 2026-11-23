import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const id = "indonesialainen-pisang-goreng-aamiaiseksi";
const pinned = {
  fi: ["reseptit/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md", "8e1fd4aa993e01969e6e11dadf6b318e974307ee"],
  en: ["kaannokset/en/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md", "2ee81c5d730d3e101690f056e128ec9245d47692"],
  sv: ["kaannokset/sv/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md", "b992b92fc70880d59ccc7c8885500ab99ae579a4"],
  th: ["kaannokset/th/aamupalat/indonesialainen-pisang-goreng-aamiaiseksi.md", "8b2a919ce14908558a5a29f3a3ecc77ffe00e8b1"],
} as const;
function blob(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}
for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 pisang goreng: peeled banana amount and sealed sources (" + locale + ")", () => {
    const [relative, sha] = pinned[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(blob(raw), sha, "source changed: " + locale);
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 25);
    const matches = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(matches.length, 1);
    const visible = matches[0];
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, source.time_total_min);
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(visible.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(visible.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(visible.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    if (locale === "fi") {
      assert.equal(source.ingredients[0].amount, 120);
      assert.match(source.ingredients[0].item, /kuorittua banaania/);
      const corrections = reviewedRecipeCopy(id, locale)?.method;
      assert.equal(corrections?.length, 1);
      const [before, after] = corrections![0];
      assert.ok(parsed.content.includes(before), "original FI sentence drift");
      assert.equal(applyCopyEdits(before, corrections), after);
      assert.match(visible.instructionsText.join(" "), /punnitse vasta kuorinnan jälkeen 120 g syötävää banaania/);
      assert.doesNotMatch(visible.instructionsText.join(" "), /Kuori banaani ja leikkaa pitkittäisiksi/);
    } else {
      assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined);
      assert.match(visible.instructionsText.join(" "), {
        en: /Peel and slice the banana/,
        sv: /Skala bananen/,
        th: /ปอกกล้วย/,
      }[locale]);
    }
  });
}
