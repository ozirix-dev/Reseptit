import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";

const root = path.resolve(import.meta.dirname, "../..");
const id = "intialainen-rava-uttapam";
const locales = {
  fi: { base: "reseptit", preparation: "## Valmistus", water: "70 ml", rest: "10 minuuttia", oil: "1 rkl", coriander: "korianteri" },
  en: { base: "kaannokset/en", preparation: "## Preparation", water: "70 ml", rest: "10 minutes", oil: "1 tbsp", coriander: "coriander" },
  sv: { base: "kaannokset/sv", preparation: "## Gör så här", water: "70 ml", rest: "10 minuter", oil: "1 msk", coriander: "koriander" },
  th: { base: "kaannokset/th", preparation: "## วิธีทำ", water: "70 มล.", rest: "10 นาที", oil: "1 ช้อนโต๊ะ", coriander: "ผักชี" },
} as const;

test("issue #404 C/#27: four published rava uttapam versions have an actual semolina batter and frying method", () => {
  for (const [locale, check] of Object.entries(locales)) {
    const relative = `${check.base}/aamupalat/${id}.md`;
    const markdown = readFileSync(path.join(root, relative), "utf8");
    const parsed = parseMarkdown(markdown);
    assert.ok(parsed, relative);
    assert.equal(parsed.data.recipe_id, id, relative);
    assert.equal(parsed.data.language, locale, relative);
    assert.equal(parsed.data.status, "published", relative);
    assert.equal(parsed.data.servings, 2, relative);
    assert.equal(parsed.data.time_total_min, 25, relative);

    const ingredients = parsed.data.ingredients as Array<{
      amount: number | null; unit: string; item: string;
    }>;
    assert.equal(ingredients.length, 7, relative + ": measured ingredients");
    assert.deepEqual(ingredients.slice(0, 3).map(({amount}) => amount), [100, 100, 100], relative);
    assert.equal(ingredients[2]?.unit, "ml", relative + ": full batter water is explicitly measured");
    assert.equal(ingredients[5]?.amount, 1, relative + ": one measured spoon of oil for the batch");
    assert.equal(ingredients[6]?.amount, null, relative + ": optional salt is not guessed");

    const instructions = markdown.split(check.preparation)[1]?.split(/\n## /)[0] ?? "";
    assert.ok(instructions.includes(check.water), relative + ": measured initial water addition");
    assert.ok(instructions.includes(check.rest), relative + ": measured semolina hydration");
    assert.ok(instructions.includes(check.oil), relative + ": oil uses only the listed amount");
    assert.ok(instructions.includes("125"), relative + ": edible tomato weight");
    assert.ok(instructions.includes("55"), relative + ": edible onion weight");
    assert.ok(!instructions.toLowerCase().includes(check.coriander), relative + ": do not silently add unlisted coriander");
    assert.equal((instructions.match(/^\d+\./gm) ?? []).length, 4, relative + ": recipe-specific steps");
  }
});
