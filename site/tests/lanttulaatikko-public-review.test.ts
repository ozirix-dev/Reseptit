import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { reviewedRecipeCopy, applyCopyEdits } from "../scripts/public-recipe-copy-r2";

const root = path.resolve(import.meta.dirname, "../..");
const id = "lanttulaatikko-kermainen";
const sourcePaths = {
  fi: ["reseptit/paaruoat/lanttulaatikko-kermainen.md", "49203a7f821aac73f34eb59b72dd2e9d74bcd8f4", "Valmistus"],
  en: ["kaannokset/en/paaruoat/lanttulaatikko-kermainen.md", "1f481e154d055e0beca0822d8c98248279091542", "Instructions"],
  sv: ["kaannokset/sv/paaruoat/lanttulaatikko-kermainen.md", "2c75733ad4f573cca4254e6e74916816493894e8", "Tillagning"],
  th: ["kaannokset/th/paaruoat/lanttulaatikko-kermainen.md", "d4154d9645346221da6c4d7486583a752ab86a3c", "วิธีทำ"],
} as const;

const checks = {
  fi: [/800 g kuorittua lanttua/, /100 g vettä/, /150 g kuohukermaa/, /yhteensä 50 g voita/, /175 °C/, /60 minuuttia/, /10 minuuttia/, /neljään annokseen/, /mittaamatonta kypsennyshävikkiä/],
  en: [/800 g peeled swede/, /100 g water/, /150 g whipping cream/, /50 g butter in total/, /175 °C/, /60 minutes/, /10 minutes/, /four portions/, /unmeasured cooking losses/],
  sv: [/800 g skalad kålrot/, /100 g vatten/, /150 g vispgrädde/, /totalt 50 g smör/, /175 °C/, /60 minuter/, /10 minuter/, /fyra portioner/, /omätta tillagningsförluster/],
  th: [/800 กรัม/, /100 กรัม/, /150 กรัม/, /50 กรัม/, /175 °C/, /60 นาที/, /10 นาที/, /4 ที่/, /ไม่ได้วัด/],
} as const;
const oldCopy = /Punnitse luetellut syötävät raaka-aineet grammoina|Kypsennä kaikki raakaa eläinperäistä ainesta|Weigh the listed edible ingredients in grams|Cook all components containing raw animal-derived ingredients|Väg de angivna ätbara ingredienserna i gram|Tillaga alla delar som innehåller råa animaliska ingredienser|ชั่งวัตถุดิบส่วนที่รับประทานได้ทั้งหมดเป็นกรัม|ปรุงส่วนผสมที่มาจากสัตว์และยังดิบให้สุกทั่วถึง/;

function gitBlobSha(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0" + text).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("#327 unsweetened lanttulaatikko: sealed source and revised public method (" + locale + ")", () => {
    const [sourcePath, expectedSha, heading] = sourcePaths[locale];
    const raw = readFileSync(path.join(root, sourcePath), "utf8");
    assert.equal(gitBlobSha(raw), expectedSha, "source has changed without review");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, id);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 4);
    assert.equal(source.time_total_min, 100);
    const matches = siteContent.recipes.filter(r => r.recipeId === id && r.locale === locale);
    assert.equal(matches.length, 1);
    const visible = matches[0];
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, source.time_total_min);
    assert.equal(visible.instructionsText.length, 5, "preserve five visible preparation steps");
    const stepsText = visible.instructionsText.join("\n");
    assert.doesNotMatch(stepsText, oldCopy);
    for (const phrase of checks[locale].slice(0, 8)) assert.match(stepsText, phrase);
    assert.match(visible.notesHtml, checks[locale][8], "nutrient retention proxy belongs in notes");
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(visible.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(visible.ingredients[i].unit, source.ingredients[i].unit);
      const item = locale === "fi" && i === 3 ? "kananmunaa kuorettomana" : source.ingredients[i].item;
      assert.equal(visible.ingredients[i].item, item);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    });
    const marker = "\n## " + heading + "\n";
    const offset = parsed.content.indexOf(marker);
    assert.ok(offset >= 0, "preparation heading must be present");
    const part = parsed.content.slice(offset + marker.length);
    const nextHeading = part.indexOf("\n## ");
    const before = (nextHeading < 0 ? part : part.slice(0, nextHeading)).trim();
    const edits = reviewedRecipeCopy(id, locale)?.method;
    assert.ok(edits && edits.length === 1, "exactly one reviewed public correction");
    assert.equal(edits[0][0], before, "source text must be pinned");
    assert.equal(applyCopyEdits(before, edits), edits[0][1]);
  });
}
