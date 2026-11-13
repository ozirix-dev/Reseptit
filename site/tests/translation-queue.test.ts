
import {strict as assert} from "node:assert";
import {test} from "node:test";
import {loadCurrentReview} from "../scripts/translation-review";
import {changedReviewLedgerErrors, translationQueue} from "../scripts/translation-queue";
import {semanticHash} from "../scripts/translation-semantic-review";

const review = await loadCurrentReview();

test("queue identifies missing and draft languages and keeps quarantines out of actionable work", () => {
  const source = review.audit.publishedSources.find(entry => entry.data.recipe_id === "kaurakeksit")!;
  const draftSource = {...source, data:{...source.data, recipe_id:"draft-queue-fixture", translation_status:{en:"draft" as const}}};
  const queue = translationQueue({...review, audit:{...review.audit, publishedSources:[...review.audit.publishedSources,draftSource]}}, [
    {recipe_id:"draft-queue-fixture",locale:"en",path:"kaannokset/en/jalkiruoat/draft-queue-fixture.md"},
  ], 2);
  assert.equal(queue.published.fi, review.audit.publishedSources.filter(source => !queue.quarantined_recipe_ids.some(id => id === source.data.recipe_id)).length + 1);
  assert.ok(queue.queue.some(entry => entry.recipe_id === "draft-queue-fixture" && entry.locale === "en" && entry.reasons.includes("draft")));
  assert.ok(queue.queue.some(entry => entry.recipe_id === "draft-queue-fixture" && entry.locale === "sv" && entry.reasons.includes("missing")));
  assert.ok(!queue.queue.some(entry => queue.quarantined_recipe_ids.some(id => id === entry.recipe_id)));
  assert.ok(queue.queue.some(entry => entry.recipe_id === "vietnamilainen-banh-cuon-sienilla" && entry.hold?.startsWith("F25_SOURCE_HOLD")));
  assert.ok(!queue.next_batch.some(entry => entry.hold));
  assert.equal(new Set(queue.next_batch.map(entry => entry.recipe_id)).size, 2);
});

test("queue distinguishes FI source edits, stale reviews and orphaned published translations", () => {
  const sample = review.rows.find(row => row.codex_review_status === "REVIEW CURRENT")!;
  const rows = review.rows.map(row => row === sample ? {...row, source_semantic_hash:"0".repeat(64), codex_review_status:"REVIEW STALE" as const} : row);
  const orphan = structuredClone(review.audit.publishedTranslations[0]);
  orphan.data.recipe_id = "missing-finnish-fixture";
  const queue = translationQueue({
    rows,
    audit:{...review.audit,publishedTranslations:[...review.audit.publishedTranslations,orphan]},
  }, [], 2);
  const stale = queue.queue.find(row => row.recipe_id === sample.recipe_id && row.locale === sample.locale);
  assert.ok(stale?.reasons.includes("fi_source_changed"));
  assert.ok(stale?.reasons.includes("review_stale"));
  assert.ok(queue.invalid_sources.some(row => row.recipe_id === orphan.data.recipe_id));
});

test("CI rejects a removed or invalid review and preserves required human review on unchanged text", () => {
  const row = review.rows.find(row => row.codex_review_status === "REVIEW CURRENT" && row.recipe_id === "bibimbap")!;
  const key = row.recipe_id + ":" + row.locale;
  const proof = row.codex_review!;
  const previous = {[key]:proof};
  assert.deepEqual(changedReviewLedgerErrors(review.audit, previous, {}), [key + ": NOT REVIEWED"]);
  assert.deepEqual(changedReviewLedgerErrors(review.audit, {}, {[key]:{...proof,source_hash:"0".repeat(64)}}), [key + ": REVIEW STALE"]);
  assert.deepEqual(changedReviewLedgerErrors(review.audit, {}, previous), []);
  const human = {[key]:{...proof,outcome:"human-required" as const}};
  assert.match(changedReviewLedgerErrors(review.audit,human,previous)[0], /required human review/);
  assert.deepEqual(changedReviewLedgerErrors(review.audit,human,previous,new Set([key])), []);
  const source = review.audit.publishedSources.find(s => s.data.recipe_id === row.recipe_id)!;
  assert.equal(proof.source_hash, semanticHash(source));
});
