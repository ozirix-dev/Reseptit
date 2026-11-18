import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { applyCopyEdits, reviewedRecipeCopy } from "../scripts/public-recipe-copy-r2";
import { siteContent } from "../src/generated/content.generated";

const repo = path.resolve(import.meta.dirname, "../..");
const cases = [
  {
    "locale": "fi",
    "path": "reseptit/paaruoat/bibimbap.md",
    "blob": "fdfb2435d54591c0f11551bae84b53f0afb8f729",
    "before": "Ryöppää pinaatti ja pavunidut nopeasti kiehuvassa vedessä, valuta ja mausta tilkalla seesamiöljyä.",
    "after": "Ryöppää pinaatti nopeasti kiehuvassa vedessä. Kuumenna pavunidut erikseen kiehuvassa vedessä kunnolla kauttaaltaan; pelkkä nopea kastaminen ei riitä. Valuta molemmat ja mausta tilkalla seesamiöljyä."
  },
  {
    "locale": "en",
    "path": "kaannokset/en/paaruoat/bibimbap.md",
    "blob": "30f39be1d24cd91d240d68a48bb0a45e1ce85c4c",
    "before": "Quickly blanch the spinach and bean sprouts in boiling water, drain and dress with a little sesame oil.",
    "after": "Briefly blanch the spinach in boiling water. Cook the bean sprouts separately in boiling water until thoroughly heated through; a quick dip is not enough. Drain both and dress with a little sesame oil."
  },
  {
    "locale": "sv",
    "path": "kaannokset/sv/paaruoat/bibimbap.md",
    "blob": "a4b664f8057b890c140788e6324888c6bdd4a540",
    "before": "Förväll spenat och böngroddar snabbt i kokande vatten, låt rinna av och smaksätt med lite sesamolja.",
    "after": "Förväll spenaten snabbt i kokande vatten. Koka böngroddarna separat i kokande vatten tills de är ordentligt genomhetta; en snabb doppning räcker inte. Låt båda rinna av och smaksätt med lite sesamolja."
  },
  {
    "locale": "th",
    "path": "kaannokset/th/paaruoat/bibimbap.md",
    "blob": "7129e812cd21ee2507a9a8a210533be4c95f701d",
    "before": "ลวกผักโขมกับถั่วงอกในน้ำเดือดสั้น ๆ สะเด็ดน้ำแล้วคลุกน้ำมันงาเล็กน้อย",
    "after": "ลวกผักโขมในน้ำเดือดสั้น ๆ จากนั้นต้มถั่วงอกแยกในน้ำเดือดให้ร้อนทั่วถึงอย่างเพียงพอ ไม่ใช่แค่จุ่มน้ำเดือดอย่างรวดเร็ว สะเด็ดน้ำผักทั้งสองชนิดแล้วคลุกน้ำมันงาเล็กน้อย"
  }
] as const;

test("bibimbap bean sprouts are visibly cooked through in FI/EN/SV/TH without changing sealed sources", () => {
  const published = siteContent.recipes.filter(recipe => recipe.recipeId === "bibimbap");
  assert.deepEqual(published.map(recipe => recipe.locale).sort(), ["en", "fi", "sv", "th"]);

  for (const fixture of cases) {
    const raw = readFileSync(path.join(repo, fixture.path), "utf8");
    const blob = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0").update(raw).digest("hex");
    assert.equal(blob, fixture.blob, fixture.locale + ": source Git blob must remain sealed");
    assert.equal(raw.split(fixture.before).length - 1, 1, fixture.locale + ": one reviewed source sentence");

    const overlay = reviewedRecipeCopy("bibimbap", fixture.locale);
    assert.ok(overlay?.method, fixture.locale + ": visible method overlay must exist");
    const projected = applyCopyEdits(raw, overlay.method);
    assert.ok(projected.includes(fixture.after), fixture.locale + ": edited safety wording must replace source");
    assert.equal(projected.includes(fixture.before), false, fixture.locale + ": old joint quick blanch must disappear");

    const recipe = published.find(item => item.locale === fixture.locale);
    assert.ok(recipe, fixture.locale);
    assert.equal(recipe.servings, 4, fixture.locale);
    assert.ok(recipe.instructionsText.join("\n").includes(fixture.after), fixture.locale + ": active steps must display safety wording");
    assert.ok(recipe.instructionsHtml.includes(fixture.after), fixture.locale + ": static reading view must include safety wording");
    assert.ok(recipe.instructionStepsHtml?.some(step => step.includes(fixture.after)), fixture.locale + ": enhanced steps must include safety wording");
  }
});
