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
const recipeId = "moo-ping-vhh";
const sources = {
  fi: ["reseptit/paaruoat/moo-ping-vhh.md", "4948610ff9661538e2d744863d18eaa789bb3335", "Valmistus"],
  en: ["kaannokset/en/paaruoat/moo-ping-vhh.md", "8fedc4870f0556c834003baf4f3822bd7ae86cf7", "Instructions"],
  sv: ["kaannokset/sv/paaruoat/moo-ping-vhh.md", "607cc0b6a08218a4b705e704b4921b667ff57c4e", "Tillagning"],
  th: ["kaannokset/th/paaruoat/moo-ping-vhh.md", "9fb88e451a22d4d4251dca7c82e4bb9089c1543d", "วิธีทำ"],
} as const;
const checks = {
  fi: [/jääkaapissa 30 minuuttia/, /marinadi on kiehunut kunnolla/, /neljään annokseen/, /mittaamattomia kypsennyshävikkejä/],
  en: [/refrigerator for 30 minutes/, /marinade that touched raw meat has come to a full simmer/, /four portions/, /unmeasured cooking losses/],
  sv: [/kylskåp i 30 minuter/, /marinaden som varit i kontakt med rått kött har fått sjuda ordentligt/, /fyra portioner/, /omätta tillagningsförluster/],
  th: [/ตู้เย็น 30 นาที/, /น้ำหมักที่สัมผัสเนื้อดิบเดือดอย่างทั่วถึง/, /4 ที่/, /ไม่ได้วัด/],
} as const;

const boilerplate = /Punnitse luetellut syötävät raaka-aineet grammoina|Kypsennä kaikki raakaa eläinperäistä ainesta|Weigh all listed edible ingredients|Cook every part that contains raw animal ingredients|Väg alla angivna ätliga ingredienser|Tillaga alla delar som innehåller råa animaliska ingredienser|ชั่งวัตถุดิบส่วนที่กินได้ทั้งหมดตามรายการ|ปรุงส่วนที่มีวัตถุดิบจากสัตว์ดิบให้สุกทั่วถึง|Raw ingredient composition is a nutrient-retention proxy|Raakojen ainesten ravintokoostumusta käytetään/;

function gitBlobSha(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0" + text).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 moo ping: pan method and nutrition evidence stay in sync (" + locale + ")", () => {
    const [sourcePath, expectedSha, sectionHeading] = sources[locale];
    const raw = readFileSync(path.join(root, sourcePath), "utf8");
    assert.equal(gitBlobSha(raw), expectedSha, "sealed source changed: " + sourcePath);
    const sourceMarkdown = parseMarkdown(raw);
    assert.ok(sourceMarkdown, "published recipe source missing");
    const source = recipeFrontmatterSchema.parse(sourceMarkdown.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 4);
    const visible = siteContent.recipes.filter(r => r.recipeId === recipeId && r.locale === locale);
    assert.equal(visible.length, 1, "expected exactly one public locale route");
    const recipe = visible[0];
    assert.equal(recipe.servings, source.servings);
    assert.equal(recipe.timeTotalMin, source.time_total_min);
    assert.equal(recipe.instructionsText.length, 5, "keep five-step GK80 display contract");
    const instructions = recipe.instructionsText.join("\n");
    assert.doesNotMatch(instructions, boilerplate, "removed generic cooking step reappeared");
    assert.match(instructions, checks[locale][0], "refrigerated 30-min marinade");
    assert.match(instructions, checks[locale][1], "raw-pork marinade must be cooked through");
    assert.match(instructions, checks[locale][2], "all four servings accounted for");
    assert.match(recipe.notesHtml, checks[locale][3], "nutrition proxy belongs in notes");
    assert.equal(recipe.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(recipe.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(recipe.ingredients[i].unit, source.ingredients[i].unit);
      assert.equal(recipe.ingredients[i].item, source.ingredients[i].item);
    }
    assert.deepEqual(recipe.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    }, "macro inputs are unchanged");

    // Fail if the exact 5-step source block is no longer present.
    const marker = "\n## " + sectionHeading + "\n";
    const start = sourceMarkdown.content.indexOf(marker);
    assert.ok(start >= 0, "source preparation heading exists");
    const tail = sourceMarkdown.content.slice(start + marker.length);
    const end = tail.indexOf("\n## ");
    const before = (end < 0 ? tail : tail.slice(0, end)).trim();
    const correction = reviewedRecipeCopy(recipeId, locale)?.method;
    assert.equal(correction?.length, 1, "only one documented correction");
    assert.equal(correction[0][0], before, "before-text is pinned to source instructions");
    assert.equal(applyCopyEdits(before, correction), correction[0][1]);
  });
}
