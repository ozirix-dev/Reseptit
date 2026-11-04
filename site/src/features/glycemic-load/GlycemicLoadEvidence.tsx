import type { ReactNode } from "react";
import type { RecipeLocale } from "@/types/content";
import type { GlycemicLoadPilotPublicResult } from "@/generated/glycemic-load-pilot.generated";
import { estimateBasis, evidenceLabel, gkCopy, missingReason } from "./glycemic-load-copy";

type EvidenceResult = Pick<GlycemicLoadPilotPublicResult,
  "assessmentType" | "sourceReferences" | "carbohydrateSources" | "confidence" |
  "omittedAvailableCarbohydratePerServingG" | "glycemicLoadRangePerServing" | "ingredientEvidence">;

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
      {basis === "model" && result.sourceReferences.some((source) => evidenceLabel(source) === "comparison") ? ` ${text.basis.comparison}` : ""}
      {result.omittedAvailableCarbohydratePerServingG > 0 ? ` ${text.omitted}` : ""}
      {result.glycemicLoadRangePerServing ? ` ${text.range}` : ""}
    </p>
  </>;
}

export function EstimateDetails({ result, locale, notes, technicalNotes }: {
  result: EvidenceResult;
  locale: RecipeLocale;
  notes?: ReactNode;
  technicalNotes?: ReactNode;
}) {
  const text = gkCopy[locale];
  const kinds = [...new Set(result.sourceReferences.map(evidenceLabel))];
  return <>
    <details className="gk-evidence__details">
      <summary>{text.how}</summary>
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
        <summary>{text.sources}</summary>
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
  return <>
    <p><strong>{text.missing}</strong></p>
    <p>{explanation ?? text.missingBasis}</p>
    {result.incompleteReasons.length ? <details className="gk-evidence__details">
      <summary>{text.why}</summary>
      <ul>{result.incompleteReasons.map((reason, index) => {
        const ingredient = reason.ingredientNames[locale] ?? reason.ingredientNames.fi;
        return <li key={index}>
          {ingredient ? <><strong lang={reason.ingredientNames[locale] ? locale : "fi"}>{ingredient}</strong> · </> : null}
          {missingReason(locale, reason.category)}
        </li>;
      })}</ul>
    </details> : null}
  </>;
}
