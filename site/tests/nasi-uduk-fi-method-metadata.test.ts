import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { reviewedPublicCookingMethod } from "../scripts/public-recipe-copy";
import { recipeJsonLd } from "../src/features/recipes/schema";

const root = path.resolve(import.meta.dirname, "../..");
const id = "indonesialainen-nasi-uduk-aamiaisella";
const sources = {
  fi: ["reseptit/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md", "901c74bd129f1d43dce9dbdbe70bb5796fd85d04"],
  en: ["kaannokset/en/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md", "0319f67ef7d747437bd8b4d518149057b649a27a"],
  sv: ["kaannokset/sv/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md", "83daee3763900f692909e788e34adbc07307a124"],
  th: ["kaannokset/th/aamupalat/indonesialainen-nasi-uduk-aamiaisella.md", "f51189e725e40c4d6329da7ce1133424b0288ab9"],
} as const;

function blobSha(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 nasi uduk: FI method metadata matches cooked dish while all sources remain sealed (" + locale + ")", () => {
    const [relative, pinnedSha] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(blobSha(raw), pinnedSha, locale + ": source blob changed");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 25);

    const matching = siteContent.recipes.filter(recipe => recipe.recipeId === id && recipe.locale === locale);
    assert.equal(matching.length, 1);
    const visible = matching[0];
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
    const method = visible.instructionsText.join(" ");
    if (locale === "fi") {
      assert.deepEqual(source.cooking_method, ["paistaminen"], "historical FI source remains untouched");
      assert.deepEqual(visible.cookingMethod, ["keittäminen"]);
      assert.match(method, /100 g kuivaa valkoista jasmiiniriisiä/);
      assert.match(method, /200 g kookosmaidossa/);
      assert.match(method, /kananmunaa höyryssä/);
      assert.match(visible.notesHtml, /Valmistustapa: keittäminen \(riisi kookosmaidossa\) ja kananmunan höyrykypsennys/);
      assert.equal(recipeJsonLd(visible).cookingMethod, "Keittäminen");
    } else {
      assert.deepEqual(source.cooking_method, ["keittäminen"]);
      assert.equal(reviewedPublicCookingMethod(id, source.cooking_method), undefined);
      assert.equal(recipeJsonLd(visible).cookingMethod, undefined);
    }
  });
}

test("#327 nasi uduk: FI metadata correction fails closed when source metadata drifts", () => {
  assert.deepEqual(reviewedPublicCookingMethod(id, ["paistaminen"]), ["keittäminen"]);
  assert.equal(reviewedPublicCookingMethod(id, ["keittäminen"]), undefined);
  assert.throws(() => reviewedPublicCookingMethod(id, ["uuni"]), /NASI_UDUK_COOKING_METHOD_SOURCE_DRIFT/);
  assert.throws(() => reviewedPublicCookingMethod(id, undefined), /NASI_UDUK_COOKING_METHOD_SOURCE_DRIFT/);
  assert.equal(reviewedPublicCookingMethod("unrelated-recipe", ["paistaminen"]), undefined);
});
