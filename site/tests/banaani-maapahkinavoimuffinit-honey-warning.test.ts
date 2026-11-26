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
const recipeId = "banaani-maapahkinavoimuffinit";

const sources = {
  fi: ["reseptit/leivonnaiset/banaani-maapahkinavoimuffinit.md", "72a99472f8281712a9b626e3c70051d913c34f70"],
  en: ["kaannokset/en/leivonnaiset/banaani-maapahkinavoimuffinit.md", "b798273c3131b047074573f1bb455d62c8b773d7"],
  sv: ["kaannokset/sv/leivonnaiset/banaani-maapahkinavoimuffinit.md", "b607019dc95b9104cbfc3dc22bb367b2b3706fbc"],
  th: ["kaannokset/th/leivonnaiset/banaani-maapahkinavoimuffinit.md", "7546ed1fc5dc92e05ae7241b2bea256fef9e1c64"],
} as const;

const sourceNotes = {
  fi: "- Sisältää vehnää, maitoa, kananmunaa, mantelia ja maapähkinää.",
  en: "- Contains wheat, milk, egg, almonds and peanuts.",
  sv: "- Innehåller vete, mjölk, ägg, mandel och jordnötter.",
  th: "- มีข้าวสาลี นม ไข่ อัลมอนด์ และถั่วลิสง",
} as const;

const warnings = {
  fi: "- Hunajaa ei saa käyttää alle 1-vuotiaiden ruoissa eikä antaa sellaisenaan ([Ruokavirasto](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/)).",
  en: "- Do not use honey in food for children under 12 months or give it to them on its own ([Finnish Food Authority](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/)).",
  sv: "- Använd inte honung i mat för barn under 12 månader och ge den inte heller som den är ([Livsmedelsverket](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/)).",
  th: "- ห้ามใช้น้ำผึ้งในอาหารสำหรับเด็กอายุต่ำกว่า 12 เดือน และห้ามให้กินน้ำผึ้งโดยตรง ([สำนักงานอาหารฟินแลนด์](https://www.ruokavirasto.fi/elintarvikkeet/ohjeita-kuluttajille/turvallisen-kayton-ohjeet/))",
} as const;

function gitBlobSha(text: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(text) + "\0" + text).digest("hex");
}

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test("banana peanut-butter muffins: official honey warning is visible (" + locale + ")", () => {
    const [relative, sha] = sources[locale];
    const raw = readFileSync(path.join(root, relative), "utf8");
    assert.equal(gitBlobSha(raw), sha, "protected recipe source changed: " + relative);
    const parsed = parseMarkdown(raw);
    assert.ok(parsed);
    const source = recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(source.recipe_id, recipeId);
    assert.equal(source.language, locale);
    assert.equal(source.status, "published");
    assert.equal(source.servings, 12);
    assert.equal(source.time_total_min, 45);
    const honey = source.ingredients.find(item => /hunaj|honey|honung|น้ำผึ้ง/i.test(item.item));
    assert.ok(honey, "the source recipe contains honey");
    assert.equal(honey.amount, 170);
    assert.equal(honey.unit, "g");
    assert.ok(parsed.content.includes(sourceNotes[locale]), "the original allergen note stays intact");

    const edits = reviewedRecipeCopy(recipeId, locale)?.notes;
    assert.ok(edits && edits.length === 1, "one source-pinned public note edit");
    assert.equal(edits[0][0], sourceNotes[locale]);
    assert.equal(edits[0][1], sourceNotes[locale] + "\n" + warnings[locale]);
    assert.equal(applyCopyEdits(sourceNotes[locale], edits), edits[0][1]);

    const matches = siteContent.recipes.filter(recipe => recipe.recipeId === recipeId && recipe.locale === locale);
    assert.equal(matches.length, 1, "exactly one published locale route");
    const visible = matches[0];
    assert.ok(visible.notesHtml.includes(warnings[locale]), "the public note contains the under-12-month restriction");
    assert.equal(visible.servings, source.servings);
    assert.equal(visible.timeTotalMin, source.time_total_min);
    assert.equal(visible.ingredients.length, source.ingredients.length);
    for (let i = 0; i < source.ingredients.length; i++) {
      assert.equal(visible.ingredients[i].amount, source.ingredients[i].amount);
      assert.equal(visible.ingredients[i].unit, source.ingredients[i].unit);
    }
    assert.deepEqual(visible.nutrition, {
      carbsNetG: source.carbs_net_per_serving_g,
      carbsTotalG: source.carbs_total_per_serving_g,
      proteinG: source.protein_per_serving_g,
      fatG: source.fat_per_serving_g,
    }, "nutrition fields remain source-bound");
  });
}
