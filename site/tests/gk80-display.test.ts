import test from 'node:test';import assert from 'node:assert/strict';
import {formatGlycemicLoadNumber} from '../src/features/recipes/gk80-format';
import {roundedCandidatePoint} from '../scripts/gk80-candidate-policy';
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { catalogSourceApplication } from "../scripts/gk80-source-classification";
import { EstimateDetails, EstimateSummary, MissingEstimate } from "../src/features/glycemic-load/GlycemicLoadEvidence";
import { evidenceLabel, gkCopy } from "../src/features/glycemic-load/glycemic-load-copy";
test('positive modeled GK never renders as zero; true zero and historical precision remain distinct',()=>{
 for(const locale of ['fi-FI','en-GB','sv-SE','th-TH']){assert.equal(formatGlycemicLoadNumber(.2,locale,true),'<1');assert.equal(formatGlycemicLoadNumber(.99,locale,true),'<1');assert.equal(formatGlycemicLoadNumber(0,locale,true),'0');}
 assert.equal(formatGlycemicLoadNumber(.2,'fi-FI',false),'0,2');assert.equal(formatGlycemicLoadNumber(22.3745,'fi-FI',true),'22');assert.equal(formatGlycemicLoadNumber(26.4445,'fi-FI',true),'26');
 assert.equal(roundedCandidatePoint(0),0);assert.equal(roundedCandidatePoint(.8661),.87);
 for(const tiny of [.004,.0001]){assert.ok(roundedCandidatePoint(tiny)>0);assert.equal(formatGlycemicLoadNumber(roundedCandidatePoint(tiny),'fi-FI',true),'<1');}
});

test("ingredient evidence requires reviewed direct applicability", () => {
  const human = { evidenceKind: "HUMAN_GI" } as const;
  const catalogExact = { ...human, matchKind: "EXACT", applicationKind: catalogSourceApplication(human.evidenceKind, "EXACT") };
  assert.equal(catalogExact.applicationKind, undefined);
  assert.equal(evidenceLabel(catalogExact), "published");
  assert.equal(evidenceLabel({ matchKind: "EXACT" }), "published");
  assert.equal(evidenceLabel({ matchKind: "EXACT", applicationKind: "DIRECT" }), "unknown");
  assert.equal(evidenceLabel({ ...human, applicationKind: "DIRECT" }), "unknown");
  assert.equal(evidenceLabel({ ...human, matchKind: "EXACT", applicationKind: "DIRECT" }), "direct");
  assert.equal(evidenceLabel({ ...human, matchKind: "EXACT", applicationKind: "FOOD_ANALOGUE" }), "comparison");
  assert.equal(evidenceLabel({ matchKind: "ANALOG" }), "comparison");
  assert.equal(evidenceLabel({ matchKind: "ANALOG", evidenceKind: "PUBLISHED_IMPUTATION" }), "model");
  assert.equal(evidenceLabel({ matchKind: "CATEGORY_MEAN" }), "categoryMean");
  assert.equal(evidenceLabel({ matchKind: "CALCULATION_POLICY" }), "policy");
  assert.equal(evidenceLabel({ ...human, matchKind: "UNRECOGNIZED", applicationKind: "DIRECT" }), "unknown");
  assert.equal(evidenceLabel({ matchKind: "EXACT", evidenceKind: "UNRECOGNIZED" }), "unknown");
  assert.equal(evidenceLabel({ ...human, matchKind: "EXACT", applicationKind: "UNRECOGNIZED" }), "unknown");
  assert.equal(evidenceLabel({}), "unknown");
});

test("measured ingredient GI never labels the serving estimate as measured", () => {
  const source = {
    title: "Reviewed source", url: "https://example.test/study", note: "Reviewed ingredient preparation",
    matchKind: "EXACT", evidenceKind: "HUMAN_GI", applicationKind: "DIRECT", confidence: "HIGH",
  } as const;
  const evidence: ComponentProps<typeof EstimateDetails>["result"] = {
    sourceReferences: [source], carbohydrateSources: [], confidence: "HIGH",
    omittedAvailableCarbohydratePerServingG: 0, glycemicLoadRangePerServing: null,
    ingredientEvidence: [{ ...source, name: "ingredient", ingredientNames: {}, giRecordId: "gi-test", foodRecordId: null }],
  };
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const copy = gkCopy[locale];
    const summary = renderToStaticMarkup(createElement(EstimateSummary, { result: evidence, locale }));
    assert.ok(summary.includes(copy.basis.published));
    assert.ok(summary.includes(copy.levels.HIGH));
    assert.ok(!summary.includes(copy.kinds.direct));
    const details = renderToStaticMarkup(createElement(EstimateDetails, { result: evidence, locale }));
    const [calculation, technical] = details.split('</details>');
    assert.ok(calculation.includes(copy.kinds.direct));
    assert.ok(calculation.includes(copy.personal));
    assert.ok(!calculation.includes("gi-test"));
    assert.ok(technical.includes("gi-test"));
    assert.ok(technical.includes(source.url));
  }
});

test("missing estimates show a localized explanation with or without a known ingredient issue", () => {
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    const copy = gkCopy[locale];
    const unknown = renderToStaticMarkup(createElement(MissingEstimate, { locale, result: { incompleteReasons: [] } }));
    assert.ok(unknown.includes(copy.missing));
    assert.ok(unknown.includes(copy.missingBasis));
    assert.ok(!unknown.includes("<details"));
    const known = renderToStaticMarkup(createElement(MissingEstimate, {
      locale,
      result: { incompleteReasons: [{ ingredientIndex: 0, ingredientNames: { [locale]: "Ingredient" }, category: "GI" }] },
    }));
    assert.ok(known.includes(copy.why));
    assert.ok(known.includes(copy.blockers.GI));
  }
});
