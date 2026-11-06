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

import { buildBlueberryPieVariant } from "../scripts/gk-blueberry-pie";
import { buildTwoAlmondPieVariants } from "../scripts/gk-two-almond-pies";

test("sealed GK-only variants use safe public GI source notes without touching calculations", () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const variants = [buildBlueberryPieVariant(root), ...buildTwoAlmondPieVariants(root)];
  assert.deepEqual(variants.map((variant) => variant.recipeId).sort(), [
    "vhh-mustikkapiirakka", "vhh-omenapiirakka", "vhh-raparperipiirakka",
  ]);
  for (const variant of variants) {
    assert.ok(variant.point !== null, `${variant.recipeId} retains approved calculated GK`);
    const giNotes = variant.sources.filter((source) => source.kind === "PUBLISHED_CODING" || source.kind === "HUMAN_GI")
      .map((source) => source.note);
    assert.ok(giNotes.length > 0, `${variant.recipeId} retains GI evidence`);
    assert.ok(giNotes.some((note) => note.includes("Low-confidence")), `${variant.recipeId} must expose uncertainty`);
    for (const note of giNotes) {
      assert.doesNotMatch(note, /cream cheese|tamarind.paste|category mean for peanuts/i,
        `${variant.recipeId} must not inherit another ingredient's GI label`);
    }
  }
});
