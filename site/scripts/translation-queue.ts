
import {execFileSync} from "node:child_process";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {parseMarkdown} from "../src/content/markdown";
import {sourceReleaseGateDecision} from "./f25-source-release-gate";
import {isPublicRecipeQuarantined, publicRecipeQuarantineIds} from "./public-recipe-quarantine";
import {editorialHoldRecipeIds} from "./recipe-quality-holds";
import {markdownFiles, type TranslationAuditResult} from "./translation-audit";
import {loadCurrentReview} from "./translation-review";
import {loadSemanticEvidence, semanticEvidencePath, semanticEvidenceSchema, semanticHash, semanticStatus, type SemanticEvidence} from "./translation-semantic-review";

const root = path.resolve(import.meta.dirname, "../..");
const locales = ["en", "sv", "th"] as const;
type Locale = typeof locales[number];
type Audit = TranslationAuditResult;
type Review = Awaited<ReturnType<typeof loadCurrentReview>>;
type Draft = {recipe_id: string; locale: Locale; path: string};
type Reasons = "missing" | "draft" | "review_missing" | "review_stale" | "fi_source_changed" |
  "translation_changed" | "human_review_required" | "blocked" | "invalid_source";

const keyOf = (id: string, locale: string) => id + ":" + locale;
const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale);
// The source remains public in Finnish while the listed recipe work is pending.
const translationSourceHolds = new Map([
  ["indonesialainen-bakwan-maissifritter", "bakwan_v2_frying_yield_oil_and_nutrition_review"],
  ["malesialainen-roti-jala-currykanalla", "roti_jala_batter_yield_curry_oil_and_nutrition_review"],
]);

const holdReason = (id: string) => {
  if (editorialHoldRecipeIds.includes(id)) return "editorial_hold";
  const gate = sourceReleaseGateDecision(id);
  return gate.authorized ? translationSourceHolds.get(id) ?? null : gate.reason;
};

async function localeFiles() {
  const files = (await Promise.all(locales.map(locale => markdownFiles(path.join(root, "kaannokset", locale))))).flat();
  const drafts: Draft[] = [];
  const published: Draft[] = [];
  for (const file of files) {
    const parsed = parseMarkdown(await readFile(file, "utf8"));
    const data = parsed?.data;
    if (!data || typeof data.recipe_id !== "string" || !isLocale(data.language)) continue;
    const record = {recipe_id: data.recipe_id, locale: data.language, path: path.relative(root, file).replaceAll("\\", "/")};
    if (data.status === "draft") drafts.push(record);
    if (data.status === "published") published.push(record);
  }
  return {drafts, published};
}

export function translationQueue({audit, rows}: Pick<Review, "audit" | "rows">, drafts: Draft[], limit: number) {
  const sources = new Map(audit.publishedSources.filter(entry => entry.data.language === "fi" &&
    !isPublicRecipeQuarantined(entry.data.recipe_id)).map(entry => [entry.data.recipe_id, entry]));
  const reviews = new Map(rows.map(row => [keyOf(row.recipe_id, row.locale), row]));
  const targets = new Map(audit.publishedTranslations.map(entry => [keyOf(entry.data.recipe_id, entry.data.language), entry]));
  const draftPaths = new Map<string, string[]>();
  for (const draft of drafts) {
    const key = keyOf(draft.recipe_id, draft.locale);
    draftPaths.set(key, [...(draftPaths.get(key) ?? []), draft.path]);
  }
  const queue = [];
  const counts = {fi: sources.size, en: 0, sv: 0, th: 0, four_languages: 0};
  const excluded = [...publicRecipeQuarantineIds].sort();
  for (const [id, source] of [...sources].sort(([a], [b]) => a.localeCompare(b, "en"))) {
    const hold = holdReason(id);
    if (locales.every(locale => targets.has(keyOf(id, locale)))) counts.four_languages++;
    for (const locale of locales) {
      const key = keyOf(id, locale);
      const row = reviews.get(key);
      const target = targets.get(key);
      const paths = draftPaths.get(key) ?? [];
      const reasons: Reasons[] = [];
      if (target) counts[locale]++;
      if (!target) reasons.push(paths.length || source.data.translation_status?.[locale] === "draft" ? "draft" : "missing");
      if (target && !row?.codex_review) reasons.push("review_missing");
      if (target && row?.codex_review) {
        if (row.codex_review.source_hash !== row.source_semantic_hash) reasons.push("fi_source_changed");
        if (row.codex_review.translation_hash !== row.translation_semantic_hash) reasons.push("translation_changed");
        if (reasons.length) reasons.push("review_stale");
      }
      if (row?.codex_review?.outcome === "human-required") reasons.push("human_review_required");
      if (row?.codex_review_status === "BLOCKED") reasons.push("blocked");
      if (hold && target && hold !== "editorial_hold") reasons.push("invalid_source");
      if (reasons.length || hold) queue.push({
        recipe_id: id, locale, source_path: source.path, translation_path: target?.path ?? null, draft_paths: paths,
        source_hash: row?.source_semantic_hash ?? semanticHash(source), translation_hash: row?.translation_semantic_hash ?? null,
        review_status: row?.codex_review_status ?? null, reasons, hold,
      });
    }
  }
  const invalidSources = audit.publishedTranslations.filter(target => !sources.has(target.data.recipe_id))
    .map(target => ({recipe_id: target.data.recipe_id, locale: target.data.language, path: target.path, reason: "invalid_source"}));
  const eligible = queue.filter(entry => !entry.hold && !entry.reasons.some(reason =>
    reason === "human_review_required" || reason === "invalid_source" || reason === "blocked"));
  const prioritized = [...eligible].sort((a, b) =>
    Number(b.reasons.includes("review_stale")) - Number(a.reasons.includes("review_stale")) ||
    Number(b.reasons.includes("review_missing")) - Number(a.reasons.includes("review_missing")));
  const nextIds = new Set([...new Set(prioritized.map(entry => entry.recipe_id))].slice(0, limit));
  return {
    schema_version: 1, published: counts, four_language_percent: counts.fi ? Math.round(counts.four_languages * 10000 / counts.fi) / 100 : 0,
    quarantined_recipe_ids: excluded, invalid_sources: invalidSources, queue,
    summary: {
      pending_pairs: queue.length, held_pairs: queue.filter(entry => entry.hold).length,
      actionable_pairs: eligible.length, pending_recipes: new Set(queue.map(entry => entry.recipe_id)).size,
    },
    next_batch: prioritized.filter(entry => nextIds.has(entry.recipe_id)),
    errors: audit.errors,
  };
}

export function changedReviewLedgerErrors(
  audit: Audit, previous: SemanticEvidence, current: SemanticEvidence,
  humanReviewed: ReadonlySet<string> = new Set(),
) {
  const sources = new Map(audit.publishedSources.map(source => [source.data.recipe_id, source]));
  const targets = new Map(audit.publishedTranslations.map(target => [keyOf(target.data.recipe_id, target.data.language), target]));
  const keys = new Set([...Object.keys(previous), ...Object.keys(current)]);
  return [...keys].flatMap(key => {
    if (JSON.stringify(previous[key]) === JSON.stringify(current[key])) return [];
    const target = targets.get(key);
    if (!target) return current[key] ? [key + ": review evidence has no published translation"] : [];
    const source = sources.get(target.data.recipe_id);
    if (!source) return [key + ": review evidence has no published FI source"];
    const status = semanticStatus(semanticHash(source), semanticHash(target), true, current[key]);
    const translationSourceHold = translationSourceHolds.get(target.data.recipe_id);
    if (translationSourceHold) return [key + ": FI source has a translation HOLD (" + translationSourceHold + ")"];
    const editorialHold = editorialHoldRecipeIds.includes(target.data.recipe_id);
    if (editorialHold && status === "HUMAN REVIEW REQUIRED") return [];
    if (editorialHold && status === "REVIEW CURRENT") return [key + ": FI source has an editorial HOLD"];
    if (previous[key]?.outcome === "human-required" && current[key]?.outcome === "pass" && !humanReviewed.has(key) &&
        previous[key].source_hash === current[key].source_hash && previous[key].translation_hash === current[key].translation_hash)
      return [key + ": unchanged recipe cannot supersede a required human review with a Codex pass"];
    return status === "REVIEW CURRENT" ? [] : [key + ": " + status];
  });
}

function priorLedger(base: string) {
  if (!/^[a-f0-9]{40}$/.test(base)) throw Error("Translation publication gate requires a full BASE_SHA");
  const tree = execFileSync("git", ["ls-tree", "--name-only", base, "--", semanticEvidencePath], {cwd: root, encoding: "utf8"}).trim();
  return tree ? semanticEvidenceSchema.parse(JSON.parse(execFileSync("git", ["show", base + ":" + semanticEvidencePath],
    {cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024}))) : {};
}

export async function runQueue() {
  const limitArg = process.argv.find(arg => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : 10;
  if (!Number.isSafeInteger(limit) || limit < 1) throw Error("Use a positive integer for --limit");
  const base = process.argv.find(arg => arg.startsWith("--base="))?.slice("--base=".length);
  const out = path.join(root, "tmp/translation-review/queue.json");
  const files = await localeFiles();
  let report;
  try {
    const review = await loadCurrentReview();
    report = translationQueue(review, files.drafts, limit);
    if (base && !/^0+$/.test(base)) {
      const current = await loadSemanticEvidence(root);
      const humanReviewed = new Set(review.rows.filter(row => row.human_review_status === "HUMAN REVIEW COMPLETE")
        .map(row => keyOf(row.recipe_id, row.locale)));
      report.errors.push(...changedReviewLedgerErrors(review.audit, priorLedger(base), current, humanReviewed));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const match = /^(?:TRANSLATION_QUARANTINED_FI|TRANSLATION_INDEX_MISSING_PUBLISHED_FI|F25_SOURCE_HOLD|F25_SOURCE_APPROVAL_STALE): ([a-z0-9-]+)/.exec(message);
    report = {
      schema_version: 1, published: null, quarantined_recipe_ids: [...publicRecipeQuarantineIds].sort(),
      invalid_sources: files.published.filter(file => file.recipe_id === match?.[1]).map(file => ({...file, reason: "invalid_source"})),
      queue: [], next_batch: [], errors: [message],
    };
  }
  await mkdir(path.dirname(out), {recursive: true});
  await writeFile(out, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({file: out, published: report.published, errors: report.errors}, null, 2));
  if (report.errors.length || report.invalid_sources.length) process.exitCode = 1;
}
