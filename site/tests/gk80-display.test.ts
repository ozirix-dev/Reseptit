import test from 'node:test';import assert from 'node:assert/strict';
import {formatGlycemicLoadNumber} from '../src/features/recipes/gk80-format';
import {roundedCandidatePoint} from '../scripts/gk80-candidate-policy';
import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { catalogSourceApplication } from "../scripts/gk80-source-classification";
import { EstimateDetails, EstimateSummary, MissingEstimate } from "../src/features/glycemic-load/GlycemicLoadEvidence";
import { glycemicLoadPilotResults } from "../src/generated/glycemic-load-pilot.generated";
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


const pendingEvidenceText = {
  fi: "Näiden raaka-aineiden GK-arvioon tarvittavaa näyttöä ei ole vielä katselmoitu.",
  en: "The evidence needed to estimate the glycemic load of these ingredients has not yet been reviewed.",
  sv: "Underlaget som behövs för att uppskatta dessa ingrediensers glykemiska belastning har ännu inte granskats.",
  th: "ยังไม่ได้ทบทวนหลักฐานที่จำเป็นต่อการประมาณค่าภาระน้ำตาลของวัตถุดิบเหล่านี้",
};

for (const locale of ["fi", "en", "sv", "th"] as const) {
  test(`unreviewed evidence differs from unavailable GI and nutrition sources (${locale})`, () => {
    const result = glycemicLoadPilotResults.find(item => item.recipeId === "munakoiso-kesakurpitsalasagne")!;
    assert.equal(result.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(result.glycemicLoadPerServing, null);
    assert.equal(result.glycemicLoadRangePerServing, null);
    assert.equal(result.incompleteReasons.length, 15);
    assert.ok(result.incompleteReasons.every(reason => reason.category === "REVIEW_PENDING"));
    const html = renderToStaticMarkup(createElement(MissingEstimate, { locale, result }));
    assert.equal(html.split(pendingEvidenceText[locale]).length - 1, 1);
    assert.equal((html.match(/<li>/g) ?? []).length, 15);
    for (const reason of result.incompleteReasons) {
      const name = reason.ingredientNames[locale] ?? reason.ingredientNames.fi;
      const ingredient = renderToStaticMarkup(createElement("strong", { lang: reason.ingredientNames[locale] ? locale : "fi" }, name));
      assert.ok(html.includes(ingredient), `ingredient retained: ${name}`);
    }
    assert.ok(html.includes(gkCopy[locale].missing));
    assert.ok(!html.includes(gkCopy[locale].blockers.GI));
    assert.ok(!html.includes(gkCopy[locale].blockers.SOURCE));
    for (const category of ["REVIEW_PENDING", "GI", "SOURCE", "PORTION", "AMOUNT"] as const) {
      const unavailable = renderToStaticMarkup(createElement(MissingEstimate, {
        locale,
        result: { incompleteReasons: [{ ingredientIndex: 0, ingredientNames: {}, category }] },
      }));
      assert.ok(unavailable.includes(gkCopy[locale].blockers[category]));
      assert.ok(!unavailable.includes(pendingEvidenceText[locale]));
    }
    const categories = ["REVIEW_PENDING", "GI", "SOURCE", "PORTION", "AMOUNT"] as const;
    const mixed = renderToStaticMarkup(createElement(MissingEstimate, {
      locale,
      result: { incompleteReasons: categories.map((category, ingredientIndex) => ({
        ingredientIndex, ingredientNames: { [locale]: category }, category,
      })) },
    }));
    assert.ok(!mixed.includes(pendingEvidenceText[locale]));
    for (const category of categories) assert.ok(mixed.includes(gkCopy[locale].blockers[category]));
    const unnamed = renderToStaticMarkup(createElement(MissingEstimate, {
      locale,
      result: { incompleteReasons: [0, 1].map(ingredientIndex => ({
        ingredientIndex, ingredientNames: {}, category: "REVIEW_PENDING" as const,
      })) },
    }));
    assert.equal(unnamed.split(gkCopy[locale].blockers.REVIEW_PENDING).length - 1, 2);
    assert.ok(!unnamed.includes(pendingEvidenceText[locale]));
  });
}
