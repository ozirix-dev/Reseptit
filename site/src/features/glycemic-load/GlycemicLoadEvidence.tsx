import type { ReactNode } from "react";
import type { RecipeLocale } from "@/types/content";
import type { GlycemicLoadPilotPublicResult } from "@/generated/glycemic-load-pilot.generated";
import { estimateBasis, evidenceLabel, gkCopy, missingReason } from "./glycemic-load-copy";

type EvidenceResult = Pick<GlycemicLoadPilotPublicResult,
  "assessmentType" | "sourceReferences" | "carbohydrateSources" | "confidence" |
  "omittedAvailableCarbohydratePerServingG" | "glycemicLoadRangePerServing" | "ingredientEvidence" | "originalGkCoverage">;

const coverageCopy = {
  fi: {
    all: "Ainesosa, josta GK-luku muodostuu",
    majority: "Ainesosa, josta tulee yli puolet GK-luvusta",
    group: "Ainesosan GI perustuu ruokaryhmän keskiarvoon.",
    estimated: (value: string) => `Malliin on kirjattu, että GK-laskelmasta jäi pois arviolta ${value} g imeytyvää hiilihydraattia.`,
    upperBound: (value: string) => `GK-laskelmasta pois rajatuille osuuksille kirjattu yläraja on ${value} g imeytyvää hiilihydraattia.`,
    additionalBound: (value: string) => `Muille pois rajatuille osuuksille kirjattu yläraja on ${value} g.`,
    assumptions: "GK-malli käyttää laskentaoletuksia, kun pois rajatun aineksen paino tai koostumus puuttuu.",
  },
  en: {
    all: "Ingredient that accounts for the GL figure",
    majority: "Ingredient that accounts for more than half of the GL figure",
    group: "The ingredient’s GI uses an average for its food group.",
    estimated: (value: string) => `The GL model records an estimated ${value} g of available carbohydrate left out of the calculation.`,
    upperBound: (value: string) => `The GL model records an upper limit of ${value} g of available carbohydrate for the omitted amounts.`,
    additionalBound: (value: string) => `The upper limit for the other recorded omissions is ${value} g.`,
    assumptions: "The GL model uses assumptions for omitted amounts with missing composition or weight data.",
  },
  sv: {
    all: "Ingrediensen som står för hela GL-värdet",
    majority: "Ingrediensen som står för mer än hälften av GL-värdet",
    group: "Ingrediensens GI bygger på ett genomsnitt för livsmedelsgruppen.",
    estimated: (value: string) => `GL-modellen redovisar uppskattningsvis ${value} g tillgängliga kolhydrater som utelämnats ur beräkningen.`,
    upperBound: (value: string) => `GL-modellen redovisar en övre gräns på ${value} g tillgängliga kolhydrater för de utelämnade mängderna.`,
    additionalBound: (value: string) => `Den övre gränsen för övriga dokumenterade utelämnade mängder är ${value} g.`,
    assumptions: "GL-modellen använder antaganden för utelämnade mängder när vikt eller sammansättning saknas.",
  },
  th: {
    all: "ส่วนผสมที่ให้ค่า GL ทั้งหมด",
    majority: "ส่วนผสมที่ให้ค่า GL มากกว่าครึ่ง",
    group: "ค่า GI ของส่วนผสมนี้อ้างอิงค่าเฉลี่ยของกลุ่มอาหาร",
    estimated: (value: string) => `แบบจำลอง GL บันทึกว่ามีคาร์โบไฮเดรตที่ย่อยได้ประมาณ ${value} กรัมที่เว้นจากการคำนวณ`,
    upperBound: (value: string) => `แบบจำลอง GL บันทึกขีดจำกัดบนของคาร์โบไฮเดรตที่ย่อยได้ที่เว้นจากการคำนวณไว้ที่ ${value} กรัม`,
    additionalBound: (value: string) => `ขีดจำกัดบนของปริมาณอื่นที่บันทึกว่าเว้นไว้คือ ${value} กรัม`,
    assumptions: "แบบจำลอง GL ใช้ค่าที่สมมติขึ้นสำหรับส่วนที่เว้นไว้เมื่อไม่มีข้อมูลน้ำหนักหรือองค์ประกอบอาหาร",
  },
};

export function OriginalGkCoverageNote({ coverage, locale, multiplier = 1 }: {
  coverage: EvidenceResult["originalGkCoverage"];
  locale: RecipeLocale;
  multiplier?: number;
}) {
  if (!coverage) return null;
  const { mainIngredient, estimatedOmissionG, upperBoundOmissionG, hasOmissionAssumptions } = coverage;
  const text = coverageCopy[locale];
  const main = mainIngredient?.names[locale];
  const format = new Intl.NumberFormat(locale, { maximumSignificantDigits: 2 });
  const bound = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
    .format(Math.ceil(upperBoundOmissionG * multiplier * 100) / 100);
  return <div data-original-gk-coverage>
    {main && mainIngredient ? <p className="recipe-disclosure" data-gk-contributor={mainIngredient.share}>
      {text[mainIngredient.share]} · <strong>{main}</strong>
      {mainIngredient.categoryMean ? <>. {text.group}</> : null}
    </p> : null}
    <p className="recipe-disclosure" data-gk-omissions aria-live="polite" aria-atomic="true">
      {estimatedOmissionG > 0 ? text.estimated(format.format(estimatedOmissionG * multiplier)) : null}
      {upperBoundOmissionG > 0 ? estimatedOmissionG > 0 ? ` ${text.additionalBound(bound)}` : text.upperBound(bound) : null}
      {hasOmissionAssumptions ? <span data-gk-omission-assumptions>
        {estimatedOmissionG > 0 || upperBoundOmissionG > 0 ? " " : null}{text.assumptions}
      </span> : null}
    </p>
  </div>;
}

export function EstimateConfidence({ locale, confidence }: {
  locale: RecipeLocale;
  confidence: EvidenceResult["confidence"];
}) {
  if (confidence === null) return null;
  const text = gkCopy[locale];
  return <p className="gk-evidence__confidence">
    <strong>{text.reliability} · {text.levels[confidence]}</strong>
    {" "}{text.levelNotes[confidence]}
  </p>;
}

export function EstimateSummary({ result, locale }: { result: EvidenceResult; locale: RecipeLocale }) {
  const text = gkCopy[locale];
  const basis = estimateBasis(result);
  return <>
    <EstimateConfidence locale={locale} confidence={result.confidence} />
    <p>{text.basis[basis]}
      {basis === "model" && result.sourceReferences.some((source) => {
        const kind = evidenceLabel(source);
        return kind === "comparison" || kind === "categoryMean";
      }) ? ` ${text.basis.comparison}` : ""}
      {result.omittedAvailableCarbohydratePerServingG > 0 && !result.originalGkCoverage ? ` ${text.omitted}` : ""}
      {result.glycemicLoadRangePerServing ? ` ${text.range}` : ""}
    </p>
  </>;
}

import { track } from "@/features/privacy/analytics";

export function EstimateDetails({ result, locale, notes, technicalNotes }: {
  result: EvidenceResult;
  locale: RecipeLocale;
  notes?: ReactNode;
  technicalNotes?: ReactNode;
}) {
  const text = gkCopy[locale];
  const kinds = [...new Set(result.sourceReferences.map(evidenceLabel))];
  return <>
    <details className="gk-evidence__details" onToggle={event => { if (event.currentTarget.open) track("Open Glycemic Evidence"); }}>
      <summary data-recipe-print-expanded>{text.how}</summary>
      <p>{text.personal}</p>
      {result.ingredientEvidence?.length ? (
        <ul>{result.ingredientEvidence.map((ingredient, index) => <li key={index}>
          <strong lang={ingredient.ingredientNames[locale] ? locale : "fi"}>{ingredient.ingredientNames[locale] ?? ingredient.name}</strong>
          {" · "}{text.kinds[evidenceLabel(ingredient)]}
        </li>)}</ul>
      ) : kinds.length ? <ul>{kinds.map((kind) => <li key={kind}>{text.kinds[kind]}</li>)}</ul> : null}
      {notes}
    </details>
    {result.sourceReferences.length || result.carbohydrateSources.length || technicalNotes ? (
      <details className="gk-evidence__details gk-evidence__technical">
        <summary data-recipe-print-expanded={technicalNotes ? true : undefined}>{text.sources}</summary>
        <p>{text.technicalNote}</p>
        {technicalNotes}
        {result.ingredientEvidence?.length ? <ul>{result.ingredientEvidence.map((ingredient, index) => (
          <li key={index}>
            <span lang={ingredient.ingredientNames[locale] ? locale : "fi"}>{ingredient.ingredientNames[locale] ?? ingredient.name}</span>
            {" · "}<code>{[ingredient.giRecordId, ingredient.foodRecordId].filter(Boolean).join(" · ")}</code>
          </li>
        ))}</ul> : null}
        {result.carbohydrateSources.length ? <>
          <p><strong>{text.carbs}</strong></p>
          <ul>{result.carbohydrateSources.map((source, index) => (
            <li key={index}><a href={source.url} rel="noopener noreferrer">{source.title}</a> · {source.note}</li>
          ))}</ul>
        </> : null}
        {result.sourceReferences.length ? <>
          <p><strong>{text.gi}</strong></p>
          <ul>{result.sourceReferences.map((source, index) => (
            <li key={index}>
              <a href={source.url} rel="noopener noreferrer">{source.title}</a>
              {" · "}{source.note} ({text.levels[source.confidence]})
              <small>{[source.matchKind, source.evidenceKind, source.applicationKind].filter(Boolean).join(" · ")}</small>
            </li>
          ))}</ul>
        </> : null}
      </details>
    ) : null}
  </>;
}

export function MissingEstimate({ result, locale, explanation }: {
  result: Pick<GlycemicLoadPilotPublicResult, "incompleteReasons">;
  locale: RecipeLocale;
  explanation?: string;
}) {
  const text = gkCopy[locale];
  const sharedPendingReview = result.incompleteReasons.length > 1 && result.incompleteReasons.every(reason =>
    reason.category === "REVIEW_PENDING" && (reason.ingredientNames[locale] ?? reason.ingredientNames.fi));
  return <>
    <p><strong>{text.missing}</strong></p>
    <p>{explanation ?? text.missingBasis}</p>
    {result.incompleteReasons.length ? <details className="gk-evidence__details">
      <summary data-recipe-print-expanded>{text.why}</summary>
      {sharedPendingReview ? <p>{text.pendingReviewGroup}</p> : null}
      <ul>{result.incompleteReasons.map((reason, index) => {
        const ingredient = reason.ingredientNames[locale] ?? reason.ingredientNames.fi;
        return <li key={index}>
          {ingredient ? <><strong lang={reason.ingredientNames[locale] ? locale : "fi"}>{ingredient}</strong></> : null}
          {!sharedPendingReview ? <>{ingredient ? " · " : null}{missingReason(locale, reason.category)}</> : null}
        </li>;
      })}</ul>
    </details> : null}
  </>;
}
