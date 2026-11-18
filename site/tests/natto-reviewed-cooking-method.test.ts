import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { projectPublicRecipeMethodCopy, reviewedPublicCookingMethod } from "../scripts/public-recipe-copy";
import { parseMarkdown } from "../src/content/markdown";
import { siteContent } from "../src/generated/content.generated";

const root = path.resolve(import.meta.dirname, "../..");
const id = "japanilainen-natto-riisikulho";
const cases = [
  {
    "locale": "fi",
    "path": "reseptit/aamupalat/japanilainen-natto-riisikulho.md",
    "blob": "941d0724416d00338277c9a2c2bd22ef981b8fc1",
    "riceName": "riisi",
    "methodPhrase": "Valmistustapa: keittäminen.",
    "dryPhrase": "Riisin 100 g tarkoittaa kuivapainoa.",
    "boilPhrase": "Keitä munat"
  },
  {
    "locale": "en",
    "path": "kaannokset/en/aamupalat/japanilainen-natto-riisikulho.md",
    "blob": "89727a0502a63aac3ece88ab1a28cef4194f4123",
    "riceName": "rice",
    "methodPhrase": "Cooking method: boiling.",
    "dryPhrase": "The listed 100 g of rice is its dry weight.",
    "boilPhrase": "Boil the eggs"
  },
  {
    "locale": "sv",
    "path": "kaannokset/sv/aamupalat/japanilainen-natto-riisikulho.md",
    "blob": "454c43a19b6fa7c302bc8f245057dea86a30680f",
    "riceName": "ris",
    "methodPhrase": "Tillagningssätt: kokning.",
    "dryPhrase": "De angivna 100 g ris är torrvikt.",
    "boilPhrase": "Koka äggen"
  },
  {
    "locale": "th",
    "path": "kaannokset/th/aamupalat/japanilainen-natto-riisikulho.md",
    "blob": "1218f9c352528dec894f02a99a230bfee8c20260",
    "riceName": "ข้าว",
    "methodPhrase": "วิธีปรุง: การต้ม",
    "dryPhrase": "ข้าวหอมมะลิ 100 กรัมเป็นน้ำหนักข้าวดิบก่อนหุง",
    "boilPhrase": "ต้มไข่"
  }
] as const;

test("natto's reviewed boiling method replaces frying metadata only in the public projection", () => {
  const published = siteContent.recipes.filter(recipe => recipe.recipeId === id);
  assert.deepEqual(published.map(recipe => recipe.locale).sort(), ["en", "fi", "sv", "th"]);

  for (const fixture of cases) {
    const raw = readFileSync(path.join(root, fixture.path), "utf8");
    const blob = createHash("sha1").update("blob " + Buffer.byteLength(raw) + "\0").update(raw).digest("hex");
    assert.equal(blob, fixture.blob, fixture.locale + ": source Git blob must stay locked");
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    assert.equal(parsed.data.status, "published");
    assert.equal(parsed.data.servings, 2);
    assert.deepEqual(parsed.data.cooking_method, ["paistaminen"],
      fixture.locale + ": historical raw metadata is preserved, not silently rewritten");
    assert.deepEqual(reviewedPublicCookingMethod(id, parsed.data.cooking_method), ["keittäminen"],
      fixture.locale + ": reviewed public metadata");

    const rice = (parsed.data.ingredients as {item:string;amount:number|null;unit:string}[])
      .find(item => item.item === fixture.riceName);
    assert.equal(rice?.amount, 100, fixture.locale + ": sealed quantity unchanged");
    assert.equal(rice?.unit, fixture.locale === "th" ? "กรัม" : "g");
    assert.ok(parsed.content.includes(fixture.boilPhrase), fixture.locale + ": the reviewed method boils the egg");
    const projected = projectPublicRecipeMethodCopy(id, fixture.locale, parsed.content, "Original note.");
    assert.equal(projected.instructions, parsed.content,
      fixture.locale + ": the culinary steps themselves must remain unchanged");
    assert.ok(projected.notes.includes(fixture.methodPhrase), fixture.locale);
    assert.ok(projected.notes.includes(fixture.dryPhrase), fixture.locale);

    const recipe = published.find(item => item.locale === fixture.locale);
    assert.ok(recipe);
    assert.deepEqual(recipe.cookingMethod, ["keittäminen"], fixture.locale + ": generated public metadata");
    assert.ok(recipe.instructionsText.join("\n").includes(fixture.boilPhrase), fixture.locale);
    assert.ok(recipe.notesHtml.includes(fixture.methodPhrase), fixture.locale + ": public reading view");
    assert.ok(recipe.notesHtml.includes(fixture.dryPhrase), fixture.locale + ": dry rice guidance");
    assert.deepEqual(recipe.nutrition,
      { carbsNetG: null, carbsTotalG: null, proteinG: null, fatG: null },
      fixture.locale + ": no new nutrition value");
  }

  assert.equal(reviewedPublicCookingMethod("unrelated", ["paistaminen"]), undefined,
    "unrelated recipes retain their existing metadata semantics");
  assert.throws(() => reviewedPublicCookingMethod(id, ["keittäminen"]),
    /NATTO_COOKING_METHOD_SOURCE_DRIFT/, "changed source requires a new review");
  assert.throws(() => projectPublicRecipeMethodCopy(id, "fi", "No rice or boiled eggs.", ""),
    /NATTO_COOKING_METHOD_TEXT_DRIFT/, "changed method text requires a new review");
});
