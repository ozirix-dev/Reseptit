import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { projectPublicRecipeMethodCopy } from "../scripts/public-recipe-copy";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const cases = [
  {
    "locale": "fi",
    "path": "reseptit/jalkiruoat/gulab-jamun.md",
    "blob": "9454f0e89b8c738a20fdeb0f2cf56481062e742a",
    "before": "Kuumenna öljy miedolle lämmölle.",
    "methodPhrase": "Varaa friteeraukseen noin litra öljyä",
    "notePhrase": "Ravintoarvio olettaa koko erän imevän 30 g öljyä.",
    "quantityPhrase": "30 g"
  },
  {
    "locale": "en",
    "path": "kaannokset/en/jalkiruoat/gulab-jamun.md",
    "blob": "fa8e4f8eede0a2ac4eb273a0a81ce83d1a492717",
    "before": "Heat the oil gently.",
    "methodPhrase": "Use about 1 litre of oil for deep-frying",
    "notePhrase": "The nutrition estimate assumes 30 g of oil is absorbed by the whole batch.",
    "quantityPhrase": "30 g"
  },
  {
    "locale": "sv",
    "path": "kaannokset/sv/jalkiruoat/gulab-jamun.md",
    "blob": "13bb0c692822c93f936d7fb62d33a85a91445229",
    "before": "Värm oljan försiktigt.",
    "methodPhrase": "Använd cirka 1 liter olja för friteringen",
    "notePhrase": "Näringsvärdet bygger på att hela satsen beräknas ta upp 30 g olja.",
    "quantityPhrase": "30 g"
  },
  {
    "locale": "th",
    "path": "kaannokset/th/jalkiruoat/gulab-jamun.md",
    "blob": "7e8f4e8fe02e6fd1ee1c47a87bdf6c70cfc71e49",
    "before": "ตั้งน้ำมันให้ร้อนด้วยไฟอ่อน",
    "methodPhrase": "เตรียมน้ำมันประมาณ 1 ลิตรสำหรับทอดแบบน้ำมันท่วม",
    "notePhrase": "การประเมินโภชนาการสมมติว่าขนมทั้งสูตรดูดซึมน้ำมัน 30 กรัม",
    "quantityPhrase": "30 กรัม"
  }
] as const;

test("gulab jamun displays frying oil separately from the unmeasured 30 g absorption estimate in all locales", () => {
  const recipes = siteContent.recipes.filter(recipe => recipe.recipeId === "gulab-jamun");
  assert.deepEqual(recipes.map(recipe => recipe.locale).sort(), ["en", "fi", "sv", "th"]);

  for (const fixture of cases) {
    const raw = readFileSync(path.join(root, fixture.path), "utf8");
    const gitBlob = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0").update(raw).digest("hex");
    assert.equal(gitBlob, fixture.blob, fixture.locale + ": sealed recipe/translation changed");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    assert.equal(parsed.data.status, "published");
    assert.equal(parsed.data.servings, 4);
    assert.equal(parsed.content.split(fixture.before).length - 1, 1);
    const oil = (parsed.data.ingredients as { amount: number; unit: string; item: string; note?: string }[])
      .find(item => /^(?:öljyä|oil|olja|น้ำมัน)$/.test(item.item));
    assert.ok(oil, fixture.locale + ": original oil ingredient");
    assert.equal(oil.amount, 30);
    assert.equal(oil.unit, fixture.locale === "th" ? "g" : "g");
    assert.ok(oil.note?.includes(fixture.locale === "th" ? "1 ลิตร" : "1 l") ||
      (fixture.locale === "en" && oil.note?.includes("1 L")) ||
      (fixture.locale === "sv" && oil.note?.includes("1 l")), fixture.locale + ": supply is recorded in the sealed ingredient note");
    const projected = projectPublicRecipeMethodCopy("gulab-jamun", fixture.locale, parsed.content, "");
    assert.ok(projected.instructions.includes(fixture.methodPhrase), fixture.locale + ": public cooking amount");
    assert.ok(projected.instructions.includes(fixture.quantityPhrase), fixture.locale + ": estimated absorption");
    assert.equal(projected.instructions.includes(fixture.before), false, fixture.locale + ": old vague method is replaced");
    assert.ok(projected.notes.includes(fixture.notePhrase), fixture.locale + ": nutrition basis explicit");

    const page = recipes.find(recipe => recipe.locale === fixture.locale);
    assert.ok(page);
    assert.equal(page.servings, 4);
    assert.deepEqual(page.nutrition,
      { carbsNetG: 93.18, carbsTotalG: 93.87, proteinG: 14.96, fatG: 16.36 },
      fixture.locale + ": historical nutrition values stay untouched");
    assert.ok(page.instructionsHtml.includes(fixture.methodPhrase), fixture.locale + ": readable HTML");
    assert.ok(page.instructionsText.join("\n").includes(fixture.methodPhrase), fixture.locale + ": preparation steps");
    assert.ok(page.instructionStepsHtml?.some(step => step.includes(fixture.methodPhrase)), fixture.locale + ": enhanced steps");
    assert.ok(page.notesHtml.includes(fixture.notePhrase), fixture.locale + ": assumptions in notes");
    assert.equal(page.instructionsHtml.includes(fixture.before), false, fixture.locale);

    assert.throws(() => projectPublicRecipeMethodCopy("gulab-jamun", fixture.locale, "Different method text.", ""),
      /GULAB_JAMUN_OIL_SCOPE_SOURCE_DRIFT/, fixture.locale + ": changed source must fail closed");
  }
});
