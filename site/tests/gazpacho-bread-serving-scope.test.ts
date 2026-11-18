import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { projectPublicRecipeMethodCopy } from "../scripts/public-recipe-copy";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";

const repo = path.resolve(import.meta.dirname, "../..");
const cases = [
  {
    "locale": "fi",
    "path": "reseptit/alkuruoat/gazpacho.md",
    "blob": "61b92f37817a09c4d04bdaba1acc378c1918f0a3",
    "old": "Lisää halutessasi leipä.",
    "newPhrase": "Näytetyt ravintoarvot on laskettu leivän sisältävälle neljän annoksen peruserälle.",
    "notePhrase": "Ilmoitetut ravintoarvot sisältävät koko neljän annoksen peruserän kaksi vaalean leivän viipaletta (yhteensä 50 g)."
  },
  {
    "locale": "en",
    "path": "kaannokset/en/alkuruoat/gazpacho.md",
    "blob": "ceab50d7bd11dac188c93a02564415920061ae2a",
    "old": "Add bread if you want.",
    "newPhrase": "The displayed nutrition figures are calculated for the four-serving batch with bread included.",
    "notePhrase": "The displayed nutrition figures include two slices of white bread (50 g total)"
  },
  {
    "locale": "sv",
    "path": "kaannokset/sv/alkuruoat/gazpacho.md",
    "blob": "3cfcd586c9777924e8e7edd1842ece128343a707",
    "old": "Lägg till bröd om du vill.",
    "newPhrase": "De visade näringsvärdena har beräknats för en sats på fyra portioner där brödet ingår.",
    "notePhrase": "De visade näringsvärdena omfattar två skivor vitt bröd (sammanlagt 50 g)"
  },
  {
    "locale": "th",
    "path": "kaannokset/th/alkuruoat/gazpacho.md",
    "blob": "853306ba95c59d523b2d4111438ab56d9e6530e8",
    "old": "เพิ่มขนมปังถ้าคุณต้องการ",
    "newPhrase": "ข้อมูลโภชนาการที่แสดงคำนวณจากสูตรพื้นฐานสำหรับ 4 ที่ซึ่งใส่ขนมปัง",
    "notePhrase": "ข้อมูลโภชนาการที่แสดงรวมขนมปังขาว 2 แผ่น (รวม 50 กรัม)"
  }
] as const;

test("gazpacho bread-inclusive nutrition scope is visible in every locale with sealed source intact", () => {
  const published = siteContent.recipes.filter(recipe => recipe.recipeId === "gazpacho");
  assert.deepEqual(published.map(recipe => recipe.locale).sort(), ["en", "fi", "sv", "th"]);
  for (const fixture of cases) {
    const raw = readFileSync(path.join(repo, fixture.path), "utf8");
    const blob = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0").update(raw).digest("hex");
    assert.equal(blob, fixture.blob, fixture.locale + ": source changed without a separate review");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    assert.equal(parsed.data.servings, 4);
    assert.equal(parsed.data.status, "published");
    assert.equal(parsed.content.split(fixture.old).length - 1, 1);
    const originalIngredient = (parsed.data.ingredients as {amount: number;item:string}[]).find(i =>
      /leipää|bread|bröd|ขนมปัง/.test(i.item));
    assert.equal(originalIngredient?.amount, 2, fixture.locale + ": sealed bread amount");
    const projected = projectPublicRecipeMethodCopy("gazpacho", fixture.locale, parsed.content, "");
    assert.ok(projected.instructions.includes(fixture.newPhrase), fixture.locale);
    assert.equal(projected.instructions.includes(fixture.old), false, fixture.locale);
    assert.ok(projected.notes.includes(fixture.notePhrase), fixture.locale);

    const recipe = published.find(item => item.locale === fixture.locale);
    assert.ok(recipe);
    assert.equal(recipe.servings, 4);
    assert.deepEqual(recipe.nutrition, { carbsNetG: 18.61, carbsTotalG: 21.91, proteinG: 3.6, fatG: 14.69 });
    assert.ok(recipe.instructionsHtml.includes(fixture.newPhrase), fixture.locale + ": static text");
    assert.ok(recipe.instructionsText.join("\n").includes(fixture.newPhrase), fixture.locale + ": active steps");
    assert.ok(recipe.instructionStepsHtml?.some(step => step.includes(fixture.newPhrase)), fixture.locale + ": enhanced steps");
    assert.ok(recipe.notesHtml.includes(fixture.notePhrase), fixture.locale + ": explanatory note");
    assert.equal(recipe.instructionsHtml.includes(fixture.old), false);
    assert.throws(() =>
      projectPublicRecipeMethodCopy("gazpacho", fixture.locale, "Unrelated original instructions", ""),
      /GAZPACHO_BREAD_SCOPE_SOURCE_DRIFT/);
  }
});
