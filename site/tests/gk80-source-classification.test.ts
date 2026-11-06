import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyGk80Source as classify} from '../scripts/gk80-source-classification';
test('human evidence remains human when applied as an analogue',()=>{
 assert.deepEqual(classify('HUMAN_GI','DIRECT'),{evidenceKind:'HUMAN_GI',applicationKind:'DIRECT',matchKind:'EXACT'});
 assert.deepEqual(classify('HUMAN_GI','APPLIED'),{evidenceKind:'HUMAN_GI',applicationKind:'FOOD_ANALOGUE',matchKind:'ANALOG'});
});
test('published assignments cannot be relabeled as measured human GI',()=>{
 assert.deepEqual(classify('PUBLISHED_IMPUTATION','APPLIED'),{evidenceKind:'PUBLISHED_IMPUTATION',applicationKind:'PUBLISHED_IMPUTATION',matchKind:'CALCULATION_POLICY'});
 assert.throws(()=>classify('PUBLISHED_IMPUTATION','DIRECT'),/IMPUTATION_NOT_MEASURED/);
 assert.throws(()=>classify('MODELLED_SCENARIO','APPLIED'),/UNKNOWN_EVIDENCE_KIND/);
});


import { readFile } from "node:fs/promises";
import path from "node:path";
import { publicGiSourceNote } from "../scripts/gk-source-copy";

test("shared GI category mean notes avoid unrelated ingredient examples", async () => {
  const data = JSON.parse(await readFile(
    path.resolve(import.meta.dirname, "../../docs/nutrition/glycemic-index-records.json"), "utf8"
  )) as { records: Array<{ id: string; note?: string; gi: number; source: { qualityEvidence: string } }> };
  for (const id of ["dairy-category-mean-gi-35", "fruit-category-mean-gi-51", "nuts-category-mean-gi-22"]) {
    const record = data.records.find((item) => item.id === id);
    assert.ok(record);
    const before = structuredClone(record);
    const visible = publicGiSourceNote(record);
    assert.match(visible, /Low-confidence.+(group mean|mean from few observations)/);
    assert.doesNotMatch(visible, /cream cheese|tamarind.paste|peanuts/i);
    assert.deepEqual(record, before, "display helper must not mutate the evidence record");
  }
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { gkOnlyVariants } from "../src/generated/gk-only-variants.generated";
import { GkOnlyVariantPanel } from "../src/features/recipes/GkOnlyVariantPanel";
import { publicGkOnlySourceNote } from "../src/features/recipes/gk-only-public-note";

test("GK-only citation display removes cross-ingredient notes without modifying sealed variant objects", () => {
  const ids = ["vhh-mustikkapiirakka", "vhh-omenapiirakka", "vhh-raparperipiirakka"];
  const variants = gkOnlyVariants.filter((variant) => ids.includes(variant.recipeId));
  assert.deepEqual(variants.map((variant) => variant.recipeId).sort(), [...ids].sort());
  let totalCorrected = 0;
  for (const variant of variants) {
    const before = structuredClone(variant);
    const relevant = variant.sources.filter((source) =>
      source.kind === "PUBLISHED_CODING" || source.kind === "HUMAN_GI");
    assert.ok(relevant.length, `${variant.recipeId} must carry GI citations`);
    for (const source of relevant) {
      const visible = publicGkOnlySourceNote(source);
      if (visible !== source.note) totalCorrected++;
      assert.doesNotMatch(visible, /cream cheese|tamarind.paste|category mean for peanuts/i);
    }
    const html = renderToStaticMarkup(createElement(GkOnlyVariantPanel, {
      variant, locale: "fi", compact: true,
    }));
    assert.doesNotMatch(html, /cream cheese|tamarind.paste|category mean for peanuts/i);
    assert.deepEqual(variant, before, `${variant.recipeId}: rendering cannot mutate signed GK object`);
  }
  assert.ok(totalCorrected >= 3, "the display mapping must correct real reviewed source notes");
});
