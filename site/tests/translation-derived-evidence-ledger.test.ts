import assert from "node:assert/strict";
import { test } from "node:test";
import { projectEvidenceLedger } from "../scripts/translation-derived-evidence-ledger";
import { semanticHash, type SemanticEvidence } from "../scripts/translation-semantic-review";
import type { FiSourceQualityEvidence } from "../scripts/translation-fi-source-quality";
import type { TranslationAuditResult } from "../scripts/translation-audit";

type Recipe = TranslationAuditResult["publishedSources"][number];
const fi = (): Recipe => ({
  path: "reseptit/paaruoat/soup.md",
  data: {title: "Soup", recipe_id: "soup", url_slug: "soup",
    category: "paaruoka", language: "fi", status: "published",
    servings: 2, main_ingredient: ["kana"], cooking_method: ["keittäminen"],
    tags: [], ingredients: [{amount: 100, unit: "g", item: "kana"}]},
  content: "# Soup\n\n## Valmistus\n\n1. Kypsennä kana.",
});
const translated = (locale: "en" | "sv" | "th"): Recipe => ({
  path: "kaannokset/" + locale + "/paaruoat/soup.md",
  data: {...fi().data, language: locale, status: "draft",
    source_language: "fi", source_recipe: fi().path, translation_of: "soup"},
  content: "# Soup\n\n## Instructions\n\n1. Cook chicken.",
});
const fixture = () => {
  const source = fi();
  const translations = {en: translated("en"), sv: translated("sv"), th: translated("th")};
  const proofs: SemanticEvidence = Object.fromEntries(
    (["en", "sv", "th"] as const).map(locale => [
      "soup:" + locale,
      {source_hash: semanticHash(source), translation_hash: semanticHash(translations[locale]),
        reviewed_at: "2026-11-21", reference: "synthetic test comparison",
        outcome: "pass" as const, findings: []},
    ]),
  );
  const quality: FiSourceQualityEvidence = {
    soup: {
      source_hash: semanticHash(source), decision: "pass",
      reviewed_at: "2026-11-21", reviewed_by: "Synthetic fixture reviewer",
      reference: "synthetic source quality fixture",
      checks: {
        ingredients: {status: "pass", reference: "fixture ingredients"},
        method: {status: "pass", reference: "fixture method"},
        food_safety: {status: "pass", reference: "fixture safety"},
        servings_and_time: {status: "pass", reference: "fixture servings"},
        nutrition: {status: "pass", reference: "fixture nutrition"},
        glycemic: {status: "unavailable", reference: "fixture GK unknown"},
      },
      findings: [],
    },
  };
  return {source, translations, proofs, quality};
};
test("current 3-locale evidence derives hashes but never releases", () => {
  const {source, translations, proofs, quality} = fixture();
  const result = projectEvidenceLedger([{id: "soup", source, translations}], proofs, quality);
  assert.equal(result.recipes.soup?.fi, semanticHash(source));
  assert.equal(result.recipes.soup?.review_state, "ai-compared-draft");
  assert.equal(result.decisions[0]?.source_quality, "EVIDENCE CURRENT");
  assert.equal(result.decisions[0]?.GK_seal, "NOT ASSERTED");
  assert.equal(result.decisions[0]?.release_ci, "NOT ASSERTED");
  assert.equal(result.auto_merge, false);
  assert.equal(result.release_authorized, false);
});
test("changing FI invalidates all three locale evidence pairs without rewriting evidence", () => {
  const {source, translations, proofs, quality} = fixture();
  source.content += "\nUpdated source method.";
  const result = projectEvidenceLedger([{id: "soup", source, translations}], proofs, quality);
  assert.equal(result.recipes.soup?.review_state, "unreviewed");
  assert.equal(result.decisions[0]?.source_quality, "SOURCE HOLD");
  assert.deepEqual(Object.values(result.decisions[0]!.semantic_review),
    ["REVIEW STALE", "REVIEW STALE", "REVIEW STALE"]);
});
test("a missing locale or missing FI-quality proof never fabricates an approval", () => {
  const {source, translations, proofs} = fixture();
  delete (translations as Partial<typeof translations>).th;
  const result = projectEvidenceLedger([{id: "soup", source, translations}], proofs);
  assert.equal(result.recipes.soup?.review_state, "unreviewed");
  assert.equal(result.decisions[0]?.source_quality, "SOURCE HOLD");
  assert.equal(result.decisions[0]?.semantic_review.th, "NOT REVIEWED");
});
test("duplicate or mismatched recipe identity fails closed", () => {
  const {source, translations, proofs} = fixture();
  const entry = {id: "soup", source, translations};
  assert.throws(() => projectEvidenceLedger([entry, entry], proofs), /duplicated/);
  assert.throws(() => projectEvidenceLedger([{...entry, id: "wrong"}], proofs), /Mismatched/);
});
