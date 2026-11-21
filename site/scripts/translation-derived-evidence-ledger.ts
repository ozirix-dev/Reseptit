/**
 * #369 read-only evidence projection. A ledger hash is derived from actual
 * parsed FI/EN/SV/TH content, never copied from a chatbot approval flag.
 * Does not grant source, GK, release, human-review or deployment authority.
 */
import { semanticHash, semanticStatus, type SemanticEvidence } from "./translation-semantic-review";
import { fiSourceQualityDecision, type FiSourceQualityEvidence } from "./translation-fi-source-quality";
import type { TranslationAuditResult } from "./translation-audit";

type Recipe = TranslationAuditResult["publishedSources"][number];
type Locale = "en" | "sv" | "th";
const locales = ["en", "sv", "th"] as const;

export type EvidenceProjectionEntry = {
  id: string;
  source: Recipe | null;
  translations: Partial<Record<Locale, Recipe>>;
};

export function projectEvidenceLedger(
  entries: readonly EvidenceProjectionEntry[],
  semanticEvidence: SemanticEvidence,
  sourceEvidence: FiSourceQualityEvidence = {},
) {
  const seen = new Set<string>();
  const ledger: Record<string, {
    fi?: string; en?: string; sv?: string; th?: string;
    review_state: "unreviewed" | "ai-compared-draft";
    publish_authorized: false;
  }> = {};
  const decisions = [];
  for (const item of [...entries].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || seen.has(item.id))
      throw new Error("Invalid or duplicated FI evidence identity: " + item.id);
    seen.add(item.id);
    const fiHash = item.source ? semanticHash(item.source) : null;
    if (item.source && (item.source.data.recipe_id !== item.id ||
        item.source.data.language !== "fi" || item.source.data.status !== "published"))
      throw new Error("Mismatched or unpublished FI evidence source: " + item.id);

    const hashes: { fi?: string; en?: string; sv?: string; th?: string } = {};
    if (fiHash !== null) hashes.fi = fiHash;
    const localeStatuses: Record<Locale, string> = {
      en: "NOT REVIEWED", sv: "NOT REVIEWED", th: "NOT REVIEWED",
    };
    for (const locale of locales) {
      const target = item.translations[locale];
      if (!target) continue;
      if (target.data.recipe_id !== item.id || target.data.language !== locale)
        throw new Error("Mismatched locale evidence source: " + item.id + ":" + locale);
      const targetHash = semanticHash(target);
      hashes[locale] = targetHash;
      // This checks evidence currency, not culinary truth or cross-language
      // structural equality. The downstream partitioner still checks structure.
      localeStatuses[locale] = fiHash === null ? "SOURCE MISSING" :
        semanticStatus(fiHash, targetHash, true, semanticEvidence[item.id + ":" + locale]);
    }
    const allCurrent = fiHash !== null &&
      locales.every(locale => localeStatuses[locale] === "REVIEW CURRENT");
    const sourceDecision = item.source
      ? fiSourceQualityDecision(item.source, sourceEvidence[item.id])
      : {accepted: false, reason: "FI source missing"};
    ledger[item.id] = {
      ...hashes,
      review_state: allCurrent ? "ai-compared-draft" : "unreviewed",
      publish_authorized: false,
    };
    decisions.push({
      recipe_id: item.id,
      source_hash: fiHash,
      source_quality: sourceDecision.accepted ? "EVIDENCE CURRENT" : "SOURCE HOLD",
      source_quality_reason: sourceDecision.reason,
      semantic_review: localeStatuses,
      GK_seal: "NOT ASSERTED",
      release_ci: "NOT ASSERTED",
      human_review: "NOT ASSERTED",
    });
  }
  return {
    schemaVersion: 1,
    semantics: "Read-only evidence-derived triage input, not a review or release approval",
    recipes: ledger,
    decisions,
    auto_merge: false,
    auto_publish: false,
    release_authorized: false,
  };
}
