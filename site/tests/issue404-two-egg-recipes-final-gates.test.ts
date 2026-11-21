import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import type { Calculation } from "../scripts/nutrition-model";

const root = path.resolve(import.meta.dirname, "../..");
const macros = [
  "carbs_net_per_serving_g",
  "carbs_total_per_serving_g",
  "protein_per_serving_g",
  "fat_per_serving_g",
] as const;
type Locale = "fi" | "en" | "sv" | "th";

const cases = [
  {
    id: "valimerellinen-menemen-fetalla",
    expected: [5.35, 7.13, 21.58, 31.02],
  },
  {
    id: "valimerellinen-pinaatti-fetashakshuka",
    expected: [3.52, 5.02, 21.98, 30.91],
  },
] as const;

const eggSafetyCues: Record<string, Record<Locale, string>> = {
  "valimerellinen-menemen-fetalla": {
    fi: "munaseos on kauttaaltaan hyytynyt eikä nestemäistä munaa näy",
    en: "set throughout, with no liquid egg remaining",
    sv: "stelnat helt och inget flytande ägg finns kvar",
    th: "สุกจับตัวทั่วและไม่มีไข่เหลวเหลืออยู่",
  },
  "valimerellinen-pinaatti-fetashakshuka": {
    fi: "sekä valkuaiset että keltuaiset ovat hyytyneet",
    en: "both the whites and the yolks are firm",
    sv: "både vitor och gulor har stelnat",
    th: "ไข่ขาวและไข่แดงสุกจับตัวทั้งคู่",
  },
};

const allergenCues: Record<Locale, string> = {
  fi: "Sisältää kananmunaa ja maitoa",
  en: "Contains eggs and milk",
  sv: "Innehåller ägg och mjölk",
  th: "มีไข่และนม",
};

const picturedExtras: Record<Locale, string> = {
  fi: "leipää, yrttejä ja siemeniä",
  en: "bread, herbs and seeds",
  sv: "bröd, örter och frön",
  th: "ขนมปัง สมุนไพร และเมล็ดพืช",
};

function readRecipe(id: string, locale: Locale) {
  const relative = locale === "fi"
    ? `reseptit/aamupalat/${id}.md`
    : `kaannokset/${locale}/aamupalat/${id}.md`;
  const markdown = readFileSync(path.join(root, relative), "utf8");
  const parsed = parseMarkdown(markdown);
  assert.ok(parsed, relative);
  return { data: recipeFrontmatterSchema.parse(parsed.data), markdown, path: relative };
}

function readEvidence(id: string): Calculation {
  return JSON.parse(readFileSync(
    path.join(root, "docs/nutrition/calculations", id + ".json"), "utf8",
  )) as Calculation;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

for (const row of cases) {
  test(`#404 ${row.id}: independently recomputed macros match the source and all translations`, () => {
    const fi = readRecipe(row.id, "fi");
    const evidence = readEvidence(row.id);
    assert.equal(fi.data.status, "published");
    assert.equal(fi.data.servings, 2);
    assert.equal(evidence.reviewerStatus, "AUTOMATED ONLY",
      "Do not mistake an automated calculation for an independent final food approval");
    assert.equal(evidence.carbohydrateOutput, "AVAILABLE_EXCLUDING_FIBRE");
    assert.equal(evidence.ingredients.length, fi.data.ingredients.length);
    assert.match(evidence.scope, /feta/i);
    assert.match(evidence.scope, /25%/i);
    assert.match(evidence.scope, /oil/i);

    const translations = (["en", "sv", "th"] as const).map(locale => {
      const t = readRecipe(row.id, locale);
      assert.equal(t.data.status, "published");
      assert.equal(t.data.language, locale);
      assert.equal(t.data.recipe_id, fi.data.recipe_id);
      assert.equal(t.data.translation_of, row.id);
      assert.equal(t.data.source_recipe, fi.path);
      assert.equal(t.data.servings, fi.data.servings);
      assert.equal(t.data.ingredients.length, fi.data.ingredients.length);
      t.data.ingredients.forEach((ingredient, index) => {
        const original = fi.data.ingredients[index]!;
        assert.equal(ingredient.amount, original.amount, `${locale} amount ${index}`);
        if (ingredient.amount !== null) {
          assert.ok(ingredient.unit.trim().length > 0, `${locale} unit ${index}`);
        }
      });
      assert.ok(t.markdown.includes(eggSafetyCues[row.id][locale]), locale + " egg safety");
      assert.ok(t.markdown.includes(allergenCues[locale]), locale + " allergens");
      if (row.id.includes("shakshuka")) {
        assert.ok(t.markdown.includes(picturedExtras[locale]), locale + " image extras");
      }
      return { path: t.path, data: t.data };
    });
    assert.ok(fi.markdown.includes(eggSafetyCues[row.id].fi), "Finnish egg safety");
    assert.ok(fi.markdown.includes(allergenCues.fi), "Finnish allergens");
    if (row.id.includes("shakshuka")) {
      assert.ok(fi.markdown.includes(picturedExtras.fi), "Finnish image extras");
    }

    const audit = verifyNutritionEvidence(fi.data, evidence, translations);
    assert.equal(audit.status, "ESTIMATE WITH EVIDENCE", audit.errors.join("; "));
    assert.deepEqual(audit.errors, []);

    // Independent arithmetic uses source-record per-100-g values, not the
    // nutrition calculator's already-rounded output.
    const total = { net: 0, fibre: 0, polyols: 0, protein: 0, fat: 0 };
    evidence.ingredients.forEach((input, index) => {
      const sourceIngredient = fi.data.ingredients[index]!;
      assert.equal(input.item, sourceIngredient.item);
      assert.equal(input.amount, sourceIngredient.amount);
      assert.equal(input.unit, sourceIngredient.unit);
      if (input.excludedReason) {
        assert.match(input.item, /suolaa/);
        assert.equal(input.omissionImpactUpperBoundPerServing?.netCarbohydrate, 0);
        assert.equal(input.omissionImpactUpperBoundPerServing?.totalCarbohydrate, 0);
        return;
      }
      const rec = input.record;
      assert.ok(rec, input.item + " has no source food record");
      assert.equal(rec.carbohydrateDefinition, "EU_AVAILABLE");
      assert.equal(rec.polyolsSourceVerified, true);
      assert.ok(rec.polyolsEvidence?.trim(), input.item + " missing polyol evidence");
      assert.ok(typeof input.amount === "number");
      const gramsPerUnit = input.unit === "g" ? 1 : input.gramsPerUnit;
      assert.ok(typeof gramsPerUnit === "number" && gramsPerUnit > 0);
      assert.ok(typeof input.edibleFraction === "number");
      assert.ok(typeof input.retainedFraction === "number");
      const factor = input.amount * gramsPerUnit * input.edibleFraction * input.retainedFraction / 100;
      for (const key of ["carbohydrate", "fibre", "polyols", "protein", "fat"] as const) {
        assert.ok(typeof rec.per100g[key] === "number", input.item + ": " + key);
      }
      total.net += factor * rec.per100g.carbohydrate!;
      total.fibre += factor * rec.per100g.fibre!;
      total.polyols += factor * rec.per100g.polyols!;
      total.protein += factor * rec.per100g.protein!;
      total.fat += factor * rec.per100g.fat!;
    });
    const values = [
      round2(total.net / fi.data.servings),
      round2((total.net + total.fibre + total.polyols) / fi.data.servings),
      round2(total.protein / fi.data.servings),
      round2(total.fat / fi.data.servings),
    ];
    assert.deepEqual(values, row.expected);
    assert.deepEqual(macros.map(key => fi.data[key]), values);
    for (const t of translations) {
      assert.deepEqual(macros.map(key => t.data[key]), values, t.path);
    }
  });
}
