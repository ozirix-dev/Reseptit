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
} as const;

test("published and quarantined quality-hold sources preserve their original ingredients", async () => {
  assert.deepEqual([...editorialHoldRecipeIds].sort(), Object.keys(originals).sort());
  const repo = path.resolve(import.meta.dirname, "../..");
  const withdrawnIds = new Set(["karibia-bammy-kassavaleipa", "vietnamilainen-banh-bao-kananmunalla"]);
  for (const [recipeId, filename] of Object.entries(originals)) {
    const repoRecipe = parseMarkdown(await readFile(path.join(repo, filename), "utf8"));
    assert.ok(repoRecipe);
    const recipe = siteContent.recipes.find((entry) => entry.recipeId === recipeId && entry.locale === "fi");
    if (withdrawnIds.has(recipeId)) {
      assert.equal(repoRecipe.data.status, "draft", `${recipeId} must stay withdrawn pending source review`);
      assert.equal(recipe, undefined, `${recipeId} must not be published`);
      continue;
    }
    assert.ok(recipe, `${recipeId} must remain addressable`);
    assert.match(recipe.description, /LAATUHUOMAUTUS/);
    assert.match(recipe.description, /HOLD/);
    assert.match(recipe.instructionsText.join(" "), /Älä valmista|älä valmista/);
    assert.equal(recipe.instructionsText.length, 2, `${recipeId}: incomplete steps must not be published as instructions`);
    assert.deepEqual(recipe.ingredients, repoRecipe.data.ingredients);
    assert.deepEqual(recipe.nutrition, {
      carbsNetG: repoRecipe.data.carbs_net_per_serving_g ?? null,
      carbsTotalG: repoRecipe.data.carbs_total_per_serving_g ?? null,
      proteinG: repoRecipe.data.protein_per_serving_g ?? null,
      fatG: repoRecipe.data.fat_per_serving_g ?? null,
    });
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


test("withdrawn cassava source still carries a safety warning in four languages", () => {
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const hold = publicRecipeQualityHold("karibia-bammy-kassavaleipa", locale);
    assert.ok(hold);
    assert.match(hold.description, /TURVALLISUUSVAROITUS|FOOD SAFETY WARNING|LIVSMEDELSVARNING|คำเตือนด้านความปลอดภัยอาหาร/);
  }
});

test("corrected shrimp wonton is published without an unfinished-recipe hold", async () => {
  const recipe = siteContent.recipes.find((entry) => entry.recipeId === "kiinalainen-katkarapu-wontonkeitto" && entry.locale === "fi");
  assert.ok(recipe);
  assert.equal(publicRecipeQualityHold(recipe.recipeId, "fi"), null);
  const text = recipe.instructionsText.join(" ");
  assert.match(text, /wonton-taikinaa/);
  assert.match(text, /tiiviiksi/);
  assert.match(text, /katkaravut/);
  assert.match(text, /läpinäkymättömiä/);
  assert.doesNotMatch(text, /Kuumenna kattilassa öljy tai liemi|Lisää nuudelit, lehtivihannekset/);
  const raw = parseMarkdown(await readFile(path.resolve(import.meta.dirname, "../../reseptit/aamupalat/kiinalainen-katkarapu-wontonkeitto.md"), "utf8"));
  assert.ok(raw);
  assert.deepEqual(recipe.ingredients, raw.data.ingredients);
  assert.equal(recipe.nutrition.carbsNetG, null);
  assert.equal(recipe.nutrition.carbsTotalG, null);
});
