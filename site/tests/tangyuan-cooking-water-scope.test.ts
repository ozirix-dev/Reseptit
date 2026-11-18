import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { projectPublicRecipeMethodCopy } from "../scripts/public-recipe-copy";
import { parseMarkdown } from "../src/content/markdown";
import { scaleIngredient } from "../src/features/recipes/servings";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const cases = [
  {
    "locale": "fi",
    "path": "reseptit/jalkiruoat/tangyuan.md",
    "blob": "0b7e835d81a22887cccfb33c40f0d2a23b6e4b24",
    "before": "Keitä riisipalloja erissä miedosti poreilevassa vedessä 5–6 minuuttia, kunnes ne nousevat pintaan. Nosta kulhoihin ja kaada päälle inkiväärilientä.",
    "methodPhrase": "Kiehauta toisessa kattilassa riittävästi tavallista vettä",
    "notePhrase": "Alkuperäisen neljän annoksen perusohjeen ainesluettelon 1 litra vettä ja 60 g sokeria kuuluvat tarjottavaan inkivääriliemeen."
  },
  {
    "locale": "en",
    "path": "kaannokset/en/jalkiruoat/tangyuan.md",
    "blob": "0453a55994a80d9c1d3907df23dd1020a6168647",
    "before": "Cook the rice balls in batches in a separate pot of gently simmering water for 5–6 minutes, until they float. Lift into bowls and pour over the sweet ginger syrup.",
    "methodPhrase": "This is additional cooking water, separate from the water reserved for ginger broth in the ingredient list.",
    "notePhrase": "In the original four-serving batch, the listed 1 litre of water and 60 g of sugar are for the ginger broth"
  },
  {
    "locale": "sv",
    "path": "kaannokset/sv/jalkiruoat/tangyuan.md",
    "blob": "1a87c9e738609670a6d1113ef7c30dfe4b1b8d0c",
    "before": "Koka risbollarna i omgångar i en separat kastrull med sjudande vatten i 5–6 minuter tills de flyter upp. Lägg dem i skålar och häll över den söta ingefärslagen.",
    "methodPhrase": "Det är extra kokvatten, skilt från vattnet som enligt ingredienslistan används till ingefärslagen.",
    "notePhrase": "I grundsatsen på fyra portioner används den angivna litern vatten och 60 g socker till ingefärslagen"
  },
  {
    "locale": "th",
    "path": "kaannokset/th/jalkiruoat/tangyuan.md",
    "blob": "c7cfc6ee86e495a70a463009059ecf098f7d3eda",
    "before": "ต้มลูกแป้งทีละชุดในหม้อน้ำอีกใบที่เดือดเบา ๆ ประมาณ 5–6 นาทีจนลอย ตักใส่ชามแล้วราดด้วยน้ำขิงหวาน",
    "methodPhrase": "น้ำส่วนนี้เป็นน้ำสำหรับต้มแยกต่างหาก ไม่ใช่น้ำที่ระบุไว้สำหรับทำน้ำขิงหวานในรายการส่วนผสม",
    "notePhrase": "น้ำ 1 ลิตรและน้ำตาล 60 กรัมในรายการส่วนผสมของสูตรพื้นฐาน 4 ที่ใช้ทำน้ำขิงหวาน"
  }
] as const;

test("tangyuan keeps 1 l ginger broth separate from discarded boiling water in four published locales", () => {
  const published = siteContent.recipes.filter(item => item.recipeId === "tangyuan");
  assert.deepEqual(published.map(item => item.locale).sort(), ["en", "fi", "sv", "th"]);
  for (const fixture of cases) {
    const raw = readFileSync(path.join(root, fixture.path), "utf8");
    const blob = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0").update(raw).digest("hex");
    assert.equal(blob, fixture.blob, fixture.locale + ": the reviewed source and translation must be unchanged");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    assert.equal(parsed.data.status, "published");
    assert.equal(parsed.data.servings, 4);
    assert.equal(parsed.content.split(fixture.before).length - 1, 1);
    const ingredients = parsed.data.ingredients as { amount: number; unit: string; item: string; note?: string }[];
    const syrupWater = ingredients.find(item => item.amount === 1 && item.unit === "l" && /^(?:vettä|water|vatten|น้ำ)$/.test(item.item));
    const doughWater = ingredients.find(item => item.amount === 1.8 && item.unit === "dl");
    const syrupSugar = ingredients.find(item => item.amount === 60 && item.unit === "g");
    assert.ok(syrupWater, fixture.locale + ": one litre remains in the original ingredient list");
    assert.equal(scaleIngredient(syrupWater, 2, 4).amount, 0.5, fixture.locale + ": scaled two-serving broth");
    assert.equal(scaleIngredient(syrupWater, 8, 4).amount, 2, fixture.locale + ": scaled eight-serving broth");
    assert.ok(projectPublicRecipeMethodCopy("tangyuan", fixture.locale, parsed.content, "").notes.includes(fixture.notePhrase), fixture.locale + ": one-litre reference is for original batch");
    assert.ok(doughWater, fixture.locale + ": original 1.8 dl dough water remains");
    assert.ok(syrupSugar, fixture.locale + ": original 60 g ginger syrup sugar remains");
    assert.equal(ingredients.length, 8, fixture.locale + ": no extra weighed cooking-water ingredient");
    const projected = projectPublicRecipeMethodCopy("tangyuan", fixture.locale, parsed.content, "");
    assert.ok(projected.instructions.includes(fixture.methodPhrase), fixture.locale);
    assert.ok(projected.instructions.includes("5–6"), fixture.locale + ": time is not silently changed");
    assert.ok(projected.notes.includes(fixture.notePhrase), fixture.locale);
    assert.equal(projected.instructions.includes(fixture.before), false, fixture.locale + ": old ambiguous step replaced");

    const page = published.find(item => item.locale === fixture.locale);
    assert.ok(page);
    assert.equal(page.servings, 4);
    assert.deepEqual(page.nutrition,
      { carbsNetG: null, carbsTotalG: null, proteinG: null, fatG: null },
      fixture.locale + ": no new nutrition numbers");
    assert.ok(page.instructionsHtml.includes(fixture.methodPhrase), fixture.locale + ": readable static method");
    assert.ok(page.instructionsText.join("\n").includes(fixture.methodPhrase), fixture.locale + ": public steps");
    assert.ok(page.instructionStepsHtml?.some(step => step.includes(fixture.methodPhrase)), fixture.locale + ": enhanced steps");
    assert.ok(page.notesHtml.includes(fixture.notePhrase), fixture.locale + ": public note");
    assert.throws(() => projectPublicRecipeMethodCopy("tangyuan", fixture.locale, "Unreviewed cooking method.", ""),
      /TANGYUAN_COOKING_WATER_SOURCE_DRIFT/, fixture.locale + ": changed source must fail closed");
  }
});
