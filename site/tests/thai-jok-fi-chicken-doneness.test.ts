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
const id = "thai-jok-kanalla";
const pinned = {
  fi: ["reseptit/aamupalat/thai-jok-kanalla.md", "62bba7f6b1fb304a1ce136dc3c72db0853b79de0"],
  en: ["kaannokset/en/aamupalat/thai-jok-kanalla.md", "294360a0ca5a03eed2cdc58208dbfbaa91518e3d"],
  sv: ["kaannokset/sv/aamupalat/thai-jok-kanalla.md", "3924d900457e180d6b0cf00a131b6236bce91962"],
  th: ["kaannokset/th/aamupalat/thai-jok-kanalla.md", "9c013e7ad4084914f28a4785ed360f7522c3c35e"],
} as const;

function blobSha(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 Thai chicken jok: raw source and published values remain sealed (" + locale + ")", () => {
    const [relative, sha] = pinned[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(blobSha(raw), sha, "protected source changed: " + locale);
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    assert.equal(source.time_total_min, 60);

    const matches = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(matches.length, 1, "exactly one public recipe per locale");
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
      const edits = reviewedRecipeCopy(id, locale)?.method;
      assert.equal(edits?.length, 1);
      const [before, after] = edits![0];
      assert.ok(parsed.content.includes(before), "original FI method is source-pinned");
      assert.equal(applyCopyEdits(before, edits), after);
      const instructions = visible.instructionsText.join(" ");
      assert.match(instructions, /150 g raakaa, nahatonta broilerin rintafileetä/);
      assert.match(instructions, /vähintään 75 °C/);
      assert.match(instructions, /elintarvikelämpömittarilla/);
      assert.match(instructions, /Keitä ainesluettelon kaksi kananmunaa/);
      assert.match(instructions, /Älä lisää paistorasvaa/);
      assert.doesNotMatch(instructions, /Keitä, kunnes kana on täysin kypsää/);
    } else {
      assert.equal(reviewedRecipeCopy(id, locale)?.method, undefined,
        "no display correction for the other locales");
      assert.equal(visible.instructionsText.length, 4);
    }
  });
}
