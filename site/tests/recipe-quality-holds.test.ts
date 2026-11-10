import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { editorialHoldRecipeIds, publicRecipeQualityHold } from "../scripts/recipe-quality-holds";

const originals = {
  "intialainen-idli-kookoschutneylla": "reseptit/aamupalat/intialainen-idli-kookoschutneylla.md",
  "vietnamilainen-banh-bao-kananmunalla": "reseptit/aamupalat/vietnamilainen-banh-bao-kananmunalla.md",
  "intialainen-aloo-paratha": "reseptit/aamupalat/intialainen-aloo-paratha.md",
  jiaozi: "reseptit/alkuruoat/jiaozi.md",
  "karibia-bammy-kassavaleipa": "reseptit/aamupalat/karibia-bammy-kassavaleipa.md",
  "kiinalainen-katkarapu-wontonkeitto": "reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md",
} as const;

test("six known unsafe or unfit originals are held visibly without changing ingredients or nutrition", async () => {
  assert.deepEqual([...editorialHoldRecipeIds].sort(), Object.keys(originals).sort());
  const repo = path.resolve(import.meta.dirname, "../..");
  for (const [recipeId, filename] of Object.entries(originals)) {
    const recipe = siteContent.recipes.find((entry) => entry.recipeId === recipeId && entry.locale === "fi");
    assert.ok(recipe, `${recipeId} must remain addressable`);
    assert.match(recipe.description, /LAATUHUOMAUTUS/);
    assert.match(recipe.description, /HOLD/);
    assert.match(recipe.instructionsText.join(" "), /Älä valmista|älä valmista/);
    assert.equal(recipe.instructionsText.length, 2, `${recipeId}: incomplete steps must not be published as instructions`);

    const old = parseMarkdown(await readFile(path.join(repo, filename), "utf8"));
    assert.ok(old);
    assert.deepEqual(recipe.ingredients, old.data.ingredients, `${recipeId}: source ingredient amounts must stay intact`);
    assert.deepEqual(recipe.nutrition, {
      carbsNetG: old.data.carbs_net_per_serving_g ?? null,
      carbsTotalG: old.data.carbs_total_per_serving_g ?? null,
      proteinG: old.data.protein_per_serving_g ?? null,
      fatG: old.data.fat_per_serving_g ?? null,
    }, `${recipeId}: no macro values are invented, removed, or recalculated by display guard`);
    assert.ok(!recipe.instructionsText.some((line) => /Siirry täyttöön|Liota riisi tai palkokasvit|24 osaan/.test(line)));
  }
});

test("the same quality-hold reasoning exists in every supported locale", () => {
  for (const recipeId of Object.keys(originals)) {
    for (const locale of ["fi", "en", "sv", "th"] as const) {
      const hold = publicRecipeQualityHold(recipeId, locale);
      assert.ok(hold, `${recipeId}/${locale}: no translated safety guard`);
      assert.ok(hold.description.length > 90);
      assert.match(hold.instructions, /^1\.[\s\S]*\n2\./);
      assert.ok(!/koepaisto tehty|test cooked|provlaga[dtd]|ทดลองปรุงแล้ว/i.test(hold.description));
    }
  }
  assert.equal(publicRecipeQualityHold("vhh-mustikkapiirakka", "fi"), null);
  assert.equal(publicRecipeQualityHold("karibia-ackee-ja-suolakala", "fi"), null,
    "ackee has its own stricter food-safety hold");
});


test("cassava and raw-shrimp recipes display a food-safety warning in all four languages", () => {
  for (const recipeId of ["karibia-bammy-kassavaleipa", "kiinalainen-katkarapu-wontonkeitto"]) {
    for (const locale of ["fi", "en", "sv", "th"] as const) {
      const hold = publicRecipeQualityHold(recipeId, locale);
      assert.ok(hold);
      assert.match(hold.description, /TURVALLISUUSVAROITUS|FOOD SAFETY WARNING|LIVSMEDELSVARNING|คำเตือนด้านความปลอดภัยอาหาร/);
      assert.match(hold.instructions, /^1\.[\s\S]*\n2\./);
    }
  }
});
