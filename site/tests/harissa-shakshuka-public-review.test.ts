import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";
import { recipeFrontmatterSchema } from "../src/content/schema";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "pohjoisafrikkalainen-harissa-shakshuka";
const sourcePaths = {
  fi: ["reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md",
    "141033fde71e0b24fa23adc77c5ba9c14350d3bc"],
  en: ["kaannokset/en/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md",
    "5d587ed6e00289c44584adb68c55b83818756778"],
  sv: ["kaannokset/sv/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md",
    "c5de31c2d1ed8ddb8aeca9462334795ba7857436"],
  th: ["kaannokset/th/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md",
    "c37bab9096b6406eec69a9971e481ce94c9dee2d"],
} as const;
const eggText = {
  fi: /aineslistan kananmunat/,
  en: /the listed eggs/,
  sv: /äggen enligt ingredienslistan/,
  th: /ไข่ตามรายการ/,
} as const;
const nutritionNote = {
  fi: /Mittaamattomia kypsennyshävikkejä ei ole vähennetty/,
  en: /Unmeasured cooking losses are not deducted/,
  sv: /Omätta tillagningsförluster har inte dragits av/,
  th: /ไม่ได้หักการสูญเสียระหว่างปรุง/,
} as const;
const genericBoilerplate = /Punnitse luetellut syötävät raaka-aineet grammoina|Kypsennä kaikki raakaa eläinperäistä ainesta|Weigh all listed edible ingredients|Cook all ingredients containing raw animal products|Väg alla angivna ätbara ingredienser|Tillaga alla råa animaliska ingredienser|ชั่งส่วนผสมที่รับประทานได้ทั้งหมดเป็นกรัม|ปรุงวัตถุดิบดิบจากสัตว์ทั้งหมดให้สุกทั่วถึง/;

function gitBlobSha(raw: string): string {
  const sha = createHash("sha1");
  sha.update("blob " + Buffer.byteLength(raw) + "\0");
  sha.update(raw);
  return sha.digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 harissa: source is pinned and only public copy changes (" + locale + ")", () => {
    const [relative, expectedGitSha] = sourcePaths[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlobSha(raw), expectedGitSha, locale + " source changed; review new semantics");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 2);
    if (locale === "fi") assert.equal(source.ingredients[0].item, "kananmunaa kuoretta");
    const matching = siteContent.recipes.filter(recipe =>
      recipe.recipeId === recipeId && recipe.locale === locale);
    assert.equal(matching.length, 1);
    const publicRecipe = matching[0];
    assert.equal(publicRecipe.servings, source.servings);
    assert.equal(publicRecipe.instructionsText.length, 5, locale + " GK80 five-step display contract");
    const instructions = publicRecipe.instructionsText.join("\n");
    assert.match(instructions, eggText[locale]);
    assert.doesNotMatch(instructions, genericBoilerplate);
    // The nutrition-model scope is user-facing metadata, not a cooking step.
    assert.doesNotMatch(instructions, /Raakojen ainesten ravintokoostumusta|raw ingredients' nutrient composition|Råvarornas näringssammansättning|การคำนวณสารอาหารใช้ข้อมูล/);
    assert.match(publicRecipe.notesHtml, nutritionNote[locale]);
    assert.equal(publicRecipe.ingredients.length, source.ingredients.length);
    for (let index = 0; index < source.ingredients.length; index++) {
      assert.equal(publicRecipe.ingredients[index].amount, source.ingredients[index].amount);
      assert.equal(publicRecipe.ingredients[index].unit, source.ingredients[index].unit);
      // The pinned GK80 display projector already fixes the FI typo.
      const expectedItem = locale === "fi" && index === 0
        ? "kananmunaa kuorettomana"
        : source.ingredients[index].item;
      assert.equal(publicRecipe.ingredients[index].item, expectedItem);
    }
    // The accounting input is 110 g edible egg; the user-facing portion
    // selector intentionally converts that amount to two shell-free eggs.
    const visibleEgg = (publicRecipe.kitchenIngredients ?? publicRecipe.ingredients)[0];
    if (locale === "fi") assert.match(visibleEgg.item, /kuorettomana|ilman kuorta/);
    if (publicRecipe.kitchenIngredients) assert.equal(visibleEgg.amount, 2);
    else assert.equal(visibleEgg.amount, 110);
    assert.deepEqual(publicRecipe.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
  });
}
