import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

const root = path.resolve(import.meta.dirname, "../..");
const ledgerPath = "docs/reviews/valipalat/era-01/nutrition-source-ledger.json";
const readJson = (relative: string) => JSON.parse(readFileSync(path.join(root, relative), "utf8"));
type Match = "EXACT" | "PROVISIONAL" | "BLOCKED";
interface InputMapping { amountG: number; sourceId: string; match: Match; note: string }
interface Candidate {
  id: string; source: string; servings: number; reviewStatus: string; glycemicLoadStatus: string;
  ingredients: InputMapping[];
  illustrativeMacroPreviewPerServing: null | Record<"carbsNetG" | "carbsTotalG" | "proteinG" | "fatG" | "fibreG", number>;
}
interface Ledger {
  status: string; publicNutritionAuthorized: boolean; publicGlycemicLoadAuthorized: boolean;
  recipes: Candidate[];
}
type RecordEntry = { id: string; name: string; sourceUrl: string; licence: string;
  per100g: { carbohydrate?: number|null; fibre?: number|null; polyols?: number|null; protein?: number|null; fat?: number|null } };
const ledger = readJson(ledgerPath) as Ledger;
const records = new Map((readJson("docs/nutrition/food-records.json") as RecordEntry[]).map((row) => [row.id, row]));
function recipeFrontmatter(relative: string) {
  const markdown = parseMarkdown(readFileSync(path.join(root, relative), "utf8"));
  assert.ok(markdown, `${relative}: cannot parse frontmatter`);
  return recipeFrontmatterSchema.parse(markdown.data);
}
const numeric = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;
const almost = (a: number, b: number) => Math.abs(a - b) < 0.011;

test("three snack review drafts, nine translations and their quantities remain aligned", () => {
  assert.equal(ledger.status, "EDITORIAL_CANDIDATES_ONLY");
  assert.equal(ledger.publicNutritionAuthorized, false);
  assert.equal(ledger.publicGlycemicLoadAuthorized, false);
  assert.equal(ledger.recipes.length, 3);
  for (const item of ledger.recipes) {
    const source = recipeFrontmatter(item.source);
    assert.equal(source.recipe_id, item.id);
    assert.equal(source.category, "valipala");
    assert.equal(source.language, "fi");
    assert.equal(source.status, "draft");
    assert.equal(source.servings, item.servings);
    assert.deepEqual(source.translation_languages, ["en", "sv", "th"]);
    assert.deepEqual(source.translation_status, { en: "draft", sv: "draft", th: "draft" });
    assert.equal(source.ingredients.length, item.ingredients.length);
    for (let index = 0; index < item.ingredients.length; index++) {
      assert.equal(source.ingredients[index].unit, "g");
      assert.equal(source.ingredients[index].amount, item.ingredients[index].amountG, item.id);
    }
    for (const locale of ["en", "sv", "th"] as const) {
      const translatedPath = `docs/reviews/valipalat/era-01/translations/${locale}/${item.id}.md`;
      const translated = recipeFrontmatter(translatedPath);
      assert.equal(translated.recipe_id, source.recipe_id);
      assert.equal(translated.language, locale);
      assert.equal(translated.category, "valipala");
      assert.equal(translated.status, "draft");
      assert.equal(translated.translation_of, item.id);
      assert.equal(translated.source_recipe, item.source);
      assert.equal(translated.servings, source.servings);
      assert.deepEqual(translated.ingredients.map(({amount,unit}) => ({ amount,unit })),
        source.ingredients.map(({amount,unit}) => ({ amount,unit })));
    }
  }
});

test("source-bound macro previews stay preliminary; blockers never become zero", () => {
  for (const item of ledger.recipes) {
    assert.equal(item.glycemicLoadStatus, "HOLD");
    const source = recipeFrontmatter(item.source);
    const totals = { carbsNetG: 0, carbsTotalG: 0, proteinG: 0, fatG: 0, fibreG: 0 };
    let complete = true;
    for (let index = 0; index < item.ingredients.length; index++) {
      const binding = item.ingredients[index];
      assert.equal(binding.amountG, source.ingredients[index].amount);
      assert.ok(["EXACT","PROVISIONAL","BLOCKED"].includes(binding.match));
      assert.ok(binding.note.length > 8);
      const record = records.get(binding.sourceId);
      assert.ok(record, `${item.id}: source record missing: ${binding.sourceId}`);
      assert.ok(record.sourceUrl.startsWith("https://") && record.licence.length > 4);
      const {carbohydrate, fibre, polyols, protein, fat} = record.per100g;
      if (![carbohydrate, fibre, polyols, protein, fat].every(numeric)) {
        complete = false;
        continue;
      }
      const ratio = binding.amountG / 100 / item.servings;
      totals.carbsNetG += carbohydrate! * ratio;
      totals.carbsTotalG += (carbohydrate! + fibre! + polyols!) * ratio;
      totals.proteinG += protein! * ratio;
      totals.fatG += fat! * ratio;
      totals.fibreG += fibre! * ratio;
    }
    if (!complete) {
      assert.equal(item.illustrativeMacroPreviewPerServing, null,
        `${item.id}: incomplete ingredient evidence cannot yield a full nutrition value`);
      assert.equal(item.reviewStatus, "HOLD");
      continue;
    }
    assert.ok(item.illustrativeMacroPreviewPerServing);
    for (const key of Object.keys(totals) as Array<keyof typeof totals>) {
      assert.ok(almost(totals[key], item.illustrativeMacroPreviewPerServing[key]),
        `${item.id}: mismatch for ${key}: source ${totals[key]} vs expected ${item.illustrativeMacroPreviewPerServing[key]}`);
    }
    if (item.ingredients.some(({match}) => match !== "EXACT")) assert.equal(item.reviewStatus,"HOLD");
    else assert.equal(item.reviewStatus,"CANDIDATE_FOR_NUTRITION_REVIEW");
  }
});


test("brand-labelled candidates have matching EAN in all four draft languages, without inventing missing nutrients", () => {
  const expected: Record<string, Array<[number, string]>> = {
    "rapeat-juustonaksut": [[1, "7311311015243"]],
    "taytetyt-kananmunat-yrteilla": [[1, "5000184321064"], [2, "3036810201280"], [4, "7311311015243"]],
  };
  for (const item of ledger.recipes) {
    if (!expected[item.id]) continue;
    const fi = recipeFrontmatter(item.source);
    const translations = ["en", "sv", "th"].map(locale =>
      recipeFrontmatter(`docs/reviews/valipalat/era-01/translations/${locale}/${item.id}.md`));
    for (const [ingredientIndex, ean] of expected[item.id]) {
      assert.ok(fi.ingredients[ingredientIndex].item.includes(ean));
      for (const translated of translations) {
        assert.ok(translated.ingredients[ingredientIndex].item.includes(ean),
          `${item.id}/${translated.language}: wrong product EAN`);
        assert.equal(translated.status, "draft");
      }
      const candidate = (item.ingredients[ingredientIndex] as InputMapping & {
        labelCandidate?: { ean: string; sourceUrl: string; per100g: { fibre: number|null; polyols: number|null } };
      }).labelCandidate;
      assert.ok(candidate && candidate.ean === ean);
      assert.ok(candidate.sourceUrl.startsWith("https://"));
      assert.equal(candidate.per100g.polyols, null, "unreported polyols remain unknown, not zero");
      if (ean !== "7311311015243") {
        assert.equal(candidate.per100g.fibre, null, "missing fibre cannot be inferred from other packages");
      }
    }
  }
});
