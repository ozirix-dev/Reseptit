import type { RecipeLocale } from "../../types/content";
import type { AssistantCatalog } from "./catalog";
import type { AssistantEvalCase } from "./eval-cases";
import { parseAssistantIntent, resolveAssistantIntent } from "./intent-contract";

export interface OfflineCandidate {
  id: string;
  output: unknown; // File-backed model output, NEVER queried from this harness.
}

export interface OfflineCaseResult {
  id: string;
  locale: RecipeLocale;
  topic: string;
  reference: "pass" | "fail";
  referenceStatus: string;
  candidate?: "match" | "mismatch" | "invalid";
  safetyMismatch?: boolean;
}

export interface OfflineEvaluation {
  mode: "reference_only" | "candidate_file";
  totalCases: number;
  referencePassed: number;
  candidateEvaluated: number;
  candidateMatched: number | null; // null means no candidate model was run.
  candidateInvalid: number | null;
  safetyMismatches: number | null;
  byLocale: Record<RecipeLocale, { cases: number; referencePassed: number; candidateMatched: number | null }>;
  cases: OfflineCaseResult[];
}

function normalized(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(normalized).join(",")}]`;
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    return `{${Object.keys(row).sort().map((key) => `${JSON.stringify(key)}:${normalized(row[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function evaluateAssistantCases(
  cases: readonly AssistantEvalCase[],
  catalogs: Readonly<Record<RecipeLocale, AssistantCatalog>>,
  candidateOutputs?: readonly OfflineCandidate[],
): OfflineEvaluation {
  if (candidateOutputs && (candidateOutputs.length !== cases.length ||
      new Set(candidateOutputs.map((item) => item.id)).size !== cases.length ||
      candidateOutputs.some((item) => !cases.some((expected) => expected.id === item.id)))) {
    throw new Error("Candidate file must contain exactly one result for every golden case");
  }
  const candidates = candidateOutputs ? new Map(candidateOutputs.map(({ id, output }) => [id, output])) : null;
  const totals: OfflineEvaluation["byLocale"] = {
    fi: { cases: 0, referencePassed: 0, candidateMatched: candidates ? 0 : null },
    en: { cases: 0, referencePassed: 0, candidateMatched: candidates ? 0 : null },
    sv: { cases: 0, referencePassed: 0, candidateMatched: candidates ? 0 : null },
    th: { cases: 0, referencePassed: 0, candidateMatched: candidates ? 0 : null },
  };
  let referencePassed = 0;
  let candidateMatched = 0;
  let candidateInvalid = 0;
  let safetyMismatches = 0;
  const result: OfflineCaseResult[] = cases.map((item) => {
    const perLocale = totals[item.locale];
    perLocale.cases++;
    const record: OfflineCaseResult = { id: item.id, locale: item.locale, topic: item.topic, reference: "fail", referenceStatus: "not_run" };
    try {
      const intent = parseAssistantIntent(item.expected);
      const resolution = resolveAssistantIntent(catalogs[item.locale], intent);
      // A1 requires evidence for any GK-category request; A4 must not silently
      // treat a GK HOLD/unknown as proof that no published recipes match.
      if (item.topic === "gk_fail_closed" && resolution.action === "search" && resolution.status !== "requires_gk_evidence") {
        throw new Error("GK request did not fail closed");
      }
      if (item.topic !== "gk_fail_closed" && resolution.action === "search" && resolution.status !== "ok") {
        throw new Error("Non-GK search incorrectly blocked");
      }
      record.reference = "pass";
      record.referenceStatus = resolution.action === "search" ? resolution.status : resolution.action;
      referencePassed++;
      perLocale.referencePassed++;
    } catch {
      record.referenceStatus = "reference_error";
    }
    if (candidates) {
      try {
        const predicted = parseAssistantIntent(candidates.get(item.id));
        // The model must match the authored reference intent, not merely produce
        // any output that the ordinary search engine can execute.
        const match = normalized(predicted) === normalized(parseAssistantIntent(item.expected));
        record.candidate = match ? "match" : "mismatch";
        if (match) {
          candidateMatched++;
          perLocale.candidateMatched = (perLocale.candidateMatched ?? 0) + 1;
        } else if (item.expected.action === "unsupported" && predicted.action !== "unsupported") {
          record.safetyMismatch = true;
          safetyMismatches++;
        }
      } catch {
        record.candidate = "invalid";
        candidateInvalid++;
      }
    }
    return record;
  });
  return {
    mode: candidates ? "candidate_file" : "reference_only",
    totalCases: cases.length,
    referencePassed,
    candidateEvaluated: candidates ? cases.length : 0,
    candidateMatched: candidates ? candidateMatched : null,
    candidateInvalid: candidates ? candidateInvalid : null,
    safetyMismatches: candidates ? safetyMismatches : null,
    byLocale: totals,
    cases: result,
  };
}
