import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { reviewedPublicCookingMethod } from "../scripts/public-recipe-copy";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "lahi-ita-ful-medames";
const evidence = {
  fi: "Kuumenna pavut miedolla lämmöllä",
  en: "Warm the beans gently",
  sv: "Värm bönorna på svag värme",
  th: "อุ่นถั่วด้วยไฟอ่อน",
} as const;

test("issue #404: non-fried ful medames does not claim unreviewed cooking metadata in any locale", () => {
  for (const [locale, warmingInstruction] of Object.entries(evidence)) {
    const relative = locale === "fi"
      ? `reseptit/aamupalat/${recipeId}.md`
      : `kaannokset/${locale}/aamupalat/${recipeId}.md`;
    const source = readFileSync(path.join(root, relative), "utf8");
    const parsed = parseMarkdown(source);
    assert.ok(parsed, relative);
    assert.equal(parsed.data.recipe_id, recipeId);
    assert.equal(parsed.data.status, "published");
    assert.deepEqual(parsed.data.cooking_method, ["paistaminen"], "reviewed original method tag must remain unchanged");
    assert.ok(parsed.content.includes(warmingInstruction), relative + ": reviewed warming method");
    assert.ok(parsed.content.includes("150"), relative + ": cooked bean quantity");
    assert.deepEqual(
      reviewedPublicCookingMethod(recipeId, parsed.data.cooking_method as string[]),
      [],
      relative + ": suppress unsupported frying tag without changing the nutrition-bound source",
    );
  }
});

test("the scoped cooking-method projection fails closed on drift and leaves unrelated recipes alone", () => {
  assert.throws(
    () => reviewedPublicCookingMethod(recipeId, ["uuni"]),
    /FUL_MEDAMES_COOKING_METHOD_SOURCE_DRIFT/,
  );
  assert.throws(
    () => reviewedPublicCookingMethod(recipeId, undefined),
    /FUL_MEDAMES_COOKING_METHOD_SOURCE_DRIFT/,
  );
  assert.equal(reviewedPublicCookingMethod("another-recipe", ["paistaminen"]), undefined);
  assert.deepEqual(reviewedPublicCookingMethod("japanilainen-natto-riisikulho", ["paistaminen"]), ["keittäminen"]);
});
