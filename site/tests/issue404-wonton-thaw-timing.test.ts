import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { projectPublicRecipeMethodCopy } from "../scripts/public-recipe-copy";
import type { RecipeLocale } from "../src/types/content";

const root = path.resolve(import.meta.dirname, "../..");
const recipeId = "kiinalainen-katkarapu-wontonkeitto";
const cases: ReadonlyArray<{
  locale: RecipeLocale;
  file: string;
  heading: string;
  evidence: string;
  note: string;
}> = [
  {
    locale: "fi", file: `reseptit/aamupalat/${recipeId}.md`,
    heading: "Valmistus", evidence: "sulata ne jääkaapissa",
    note: "sulatusaika ei sisälly 25 minuuttiin"
  },
  {
    locale: "en", file: `kaannokset/en/aamupalat/${recipeId}.md`,
    heading: "Preparation", evidence: "Thaw frozen shrimp in the refrigerator",
    note: "thawing time is not included"
  },
  {
    locale: "sv", file: `kaannokset/sv/aamupalat/${recipeId}.md`,
    heading: "Tillagning", evidence: "Tina frysta räkor i kylskåpet",
    note: "upptiningstiden ingår inte"
  },
  {
    locale: "th", file: `kaannokset/th/aamupalat/${recipeId}.md`,
    heading: "วิธีทำ", evidence: "ละลายในตู้เย็น",
    note: "ไม่รวมเวลาละลายใน 25 นาที"
  }
];

test("issue #404: wonton preparation time excludes prior refrigerated thawing in FI/EN/SV/TH", () => {
  for (const { locale, file, heading, evidence, note } of cases) {
    const source = readFileSync(path.join(root, file), "utf8");
    const parsed = parseMarkdown(source);
    assert.ok(parsed, file);
    assert.equal(parsed.data.recipe_id, recipeId, file);
    assert.equal(parsed.data.status, "published", file);
    assert.equal(parsed.data.servings, 2, file);
    assert.equal(parsed.data.time_total_min, 25, file);
    const quantities = (parsed.data.ingredients as Array<{amount: number | null}>)
      .map(row => row.amount);
    assert.deepEqual(quantities, [150, 150, 1, 1, 700, null], file);
    const afterHeading = source.split(`## ${heading}\n\n`)[1];
    assert.ok(afterHeading, file + ": preparation present");
    const instructions = afterHeading.split(/\n## /)[0];
    assert.ok(instructions.includes(evidence), file);
    assert.equal((instructions.match(/^\d+\./gm) ?? []).length, 4, file);
    const result = projectPublicRecipeMethodCopy(recipeId, locale, instructions, "original notes");
    assert.equal(result.instructions, instructions, file + ": no cooking step change");
    assert.ok(result.notes.includes("original notes"), file);
    assert.ok(result.notes.includes(note), file + ": prior thaw excluded");
    assert.throws(
      () => projectPublicRecipeMethodCopy(recipeId, locale, "1. Unsupported steps", ""),
      /WONTON_THAW_TIME_SOURCE_DRIFT/,
      file + ": notes must not be projected onto an unrelated source"
    );
  }
});

test("wonton timing note is recipe-scoped", () => {
  const ordinary = projectPublicRecipeMethodCopy("example-other", "fi", "1. Sekoita ainekset.", "Tavallinen huomautus");
  assert.equal(ordinary.instructions, "1. Sekoita ainekset.");
  assert.equal(ordinary.notes, "Tavallinen huomautus");
});
