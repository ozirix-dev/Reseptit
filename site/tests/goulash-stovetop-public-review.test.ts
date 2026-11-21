import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { reviewedPublicCookingMethod } from "../scripts/public-recipe-copy";
import { reviewedRecipeCopy, applyCopyEdits } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const id = "paprikainen-vhh-gulassi";
const sources = {
  fi: ["reseptit/paaruoat/paprikainen-vhh-gulassi.md",
    "5a8393e6bfd8646fc5bb24224792a09fff1a80d6", "Valmistus"],
  en: ["kaannokset/en/paaruoat/paprikainen-vhh-gulassi.md",
    "5a82be37c5aa6dbcff1354ee090852b7faa4080f", "Instructions"],
  sv: ["kaannokset/sv/paaruoat/paprikainen-vhh-gulassi.md",
    "1decf96700461c84756351fed352e3088ac059f0", "Tillagning"],
  th: ["kaannokset/th/paaruoat/paprikainen-vhh-gulassi.md",
    "0f58dd0c0c88a3ee46321ce8ccdb257408c5e678", "วิธีทำ"],
} as const;
const stove = {
  fi: /Hauduta liedellä kannellisessa padassa miedolla lämmöllä 1,5 tuntia/,
  en: /Simmer on the stovetop in a covered pot over low heat for 1.5 hours/,
  sv: /Låt sjuda på spisen under lock och på svag värme i 1,5 timmar/,
  th: /ปิดฝาเคี่ยวในหม้อบนเตาด้วยไฟอ่อน 1.5 ชั่วโมง/,
} as const;
function blobSha(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0" + raw).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 goulash: seal source and correct visible stovetop method (" + locale + ")", () => {
    const [sourcePath, expectedSha, heading] = sources[locale];
    const raw = readFileSync(path.join(root, sourcePath), "utf8");
    assert.equal(blobSha(raw), expectedSha, "historic source must stay unchanged");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.deepEqual(source.cooking_method, ["uuni"], "original oven metadata stays sealed");
    assert.equal(source.servings, 4);

    const matches = siteContent.recipes.filter(recipe => recipe.recipeId === id && recipe.locale === locale);
    assert.equal(matches.length, 1);
    const visible = matches[0];
    assert.deepEqual(visible.cookingMethod, ["liesi"], "public cooking method must match steps");
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, null, "do not invent a missing total time");
    assert.equal(visible.instructionsText.length, 3);
    assert.match(visible.instructionsText.join(" "), stove[locale]);
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let index = 0; index < source.ingredients.length; index++) {
      assert.equal(visible.ingredients[index].amount, source.ingredients[index].amount);
      assert.equal(visible.ingredients[index].unit, source.ingredients[index].unit);
      assert.equal(visible.ingredients[index].item, source.ingredients[index].item);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: null, carbsTotalG: null, proteinG: null, fatG: null,
    }, "unverified nutrition must remain hidden");

    const mark = "\n## " + heading + "\n";
    const start = parsed.content.indexOf(mark);
    assert.ok(start >= 0);
    const tail = parsed.content.slice(start + mark.length);
    const end = tail.indexOf("\n## ");
    const originalMethod = (end < 0 ? tail : tail.slice(0, end)).trim();
    const edits = reviewedRecipeCopy(id, locale)?.method;
    assert.ok(edits?.length);
    for (const [before] of edits) assert.ok(originalMethod.includes(before));
    const corrected = applyCopyEdits(originalMethod, edits);
    assert.match(corrected, stove[locale]);
  });
}
test("#327 goulash metadata overlay fails closed and leaves other recipes alone", () => {
  assert.deepEqual(reviewedPublicCookingMethod(id, ["uuni"]), ["liesi"]);
  assert.throws(() => reviewedPublicCookingMethod(id, ["liesi"]),
    /GOULASH_COOKING_METHOD_SOURCE_DRIFT/);
  assert.throws(() => reviewedPublicCookingMethod(id, undefined),
    /GOULASH_COOKING_METHOD_SOURCE_DRIFT/);
  assert.deepEqual(reviewedPublicCookingMethod("japanilainen-natto-riisikulho", ["paistaminen"]),
    ["keittäminen"]);
  assert.equal(reviewedPublicCookingMethod("no-overlay", ["uuni"]), undefined);
});
