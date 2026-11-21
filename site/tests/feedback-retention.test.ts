import assert from "node:assert/strict";
import test from "node:test";
import type { FeedbackDatabase } from "../functions/api/feedback";
import { feedbackMaintenanceIsFresh, feedbackRetentionDays } from
  "../src/features/feedback/retention-policy";
import retentionWorker, { purgeExpiredFeedback } from "../workers/feedback-retention";

const scheduled = Date.UTC(2026, 10, 21, 3, 0, 0);
const cutoff = new Date(scheduled - feedbackRetentionDays * 86_400_000).toISOString();

function fakeD1(options: { failDelete?: boolean; failHeartbeat?: boolean } = {}) {
  const rows = [new Date(Date.parse(cutoff) - 1).toISOString(), cutoff,
    new Date(Date.parse(cutoff) + 1).toISOString()];
  let lastSuccessAt: string | null = null;
  const statements: { sql: string; values: (string | null)[] }[] = [];
  const db: FeedbackDatabase = {
    prepare(sql) {
      return {
        async first() { return null; },
        bind(...values) {
          return {
            async run() {
              statements.push({ sql, values });
              if (sql.startsWith("DELETE FROM")) {
                if (options.failDelete) return { success: false };
                const bound = values[0]!;
                for (let i = rows.length - 1; i >= 0; i--) {
                  if (rows[i] <= bound) rows.splice(i, 1);
                }
                return { success: true };
              }
              if (sql.startsWith("INSERT INTO feedback_maintenance")) {
                if (options.failHeartbeat) throw new Error("D1 heartbeat not written");
                lastSuccessAt = !lastSuccessAt || lastSuccessAt < values[0]! ? values[0]! : lastSuccessAt;
                return { success: true };
              }
              throw new Error("Unexpected feedback retention SQL");
            },
          };
        },
      };
    },
  };
  return { db, rows, statements, lastSuccessAt: () => lastSuccessAt };
}

test("scheduled retention deletes only data at or before UTC cutoff, then records success", async () => {
  const fake = fakeD1();
  const result = await purgeExpiredFeedback({
    FEEDBACK_RETENTION_ENABLED: "true", FEEDBACK_DB: fake.db,
  }, scheduled, scheduled + 60_000);
  assert.equal(feedbackRetentionDays, 30);
  assert.equal(result.cutoff, cutoff);
  assert.equal(result.lastSuccessAt, new Date(scheduled).toISOString());
  assert.deepEqual(fake.rows, [new Date(Date.parse(cutoff) + 1).toISOString()]);
  assert.equal(fake.statements.length, 2);
  assert.match(fake.statements[0].sql, /^DELETE FROM feedback_submissions WHERE received_at <= \?/u);
  assert.equal(fake.statements[0].values[0], cutoff);
  assert.match(fake.statements[1].sql, /^INSERT INTO feedback_maintenance /u);
  assert.ok(fake.statements[1].sql.includes("CASE WHEN"));
  assert.equal(fake.lastSuccessAt(), result.lastSuccessAt);
  assert.equal(feedbackMaintenanceIsFresh({ last_success_at: result.lastSuccessAt }, scheduled + 60_000), true);
});

test("failed deletion never updates the success heartbeat", async () => {
  const fake = fakeD1({ failDelete: true });
  await assert.rejects(() => purgeExpiredFeedback({
    FEEDBACK_RETENTION_ENABLED: "true", FEEDBACK_DB: fake.db,
  }, scheduled, scheduled + 60_000), /not confirmed/);
  assert.equal(fake.statements.length, 1);
  assert.equal(fake.lastSuccessAt(), null);
  assert.equal(feedbackMaintenanceIsFresh(null, scheduled), false);
});

test("failed heartbeat after deletion is not reported as a successful run", async () => {
  const fake = fakeD1({ failHeartbeat: true });
  await assert.rejects(() => purgeExpiredFeedback({
    FEEDBACK_RETENTION_ENABLED: "true", FEEDBACK_DB: fake.db,
  }, scheduled, scheduled + 60_000), /heartbeat/);
  assert.equal(fake.statements.length, 2);
  assert.equal(fake.lastSuccessAt(), null);
});

test("retention requires explicit binding, opt-in and a timely UTC scheduled event", async () => {
  const fake = fakeD1();
  for (const env of [{}, { FEEDBACK_RETENTION_ENABLED: "true" },
    { FEEDBACK_DB: fake.db, FEEDBACK_RETENTION_ENABLED: "false" }]) {
    await assert.rejects(() => purgeExpiredFeedback(env, scheduled, scheduled), /not configured/);
  }
  for (const time of [NaN, -1, scheduled + 15 * 60_000,
    scheduled - 7 * 60 * 60_000]) {
    await assert.rejects(() => purgeExpiredFeedback({
      FEEDBACK_RETENTION_ENABLED: "true", FEEDBACK_DB: fake.db,
    }, time, scheduled), /Invalid or stale/);
  }
  assert.equal(fake.statements.length, 0);
});

test("missing, malformed, 49h stale or far-future maintenance evidence fails closed", () => {
  const now = Date.UTC(2026, 10, 21, 12);
  for (const sample of [null, {}, { last_success_at: "yesterday" },
    { last_success_at: new Date(now - 49 * 60 * 60_000).toISOString() },
    { last_success_at: new Date(now + 10 * 60_000).toISOString() },
    { last_success_at: new Date(now).toISOString().replace(".000", "") }]) {
    assert.equal(feedbackMaintenanceIsFresh(sample, now), false);
  }
  assert.equal(feedbackMaintenanceIsFresh({
    last_success_at: new Date(now - 47 * 60 * 60_000).toISOString(),
  }, now), true);
  assert.equal("fetch" in retentionWorker, false, "Janitor is not a public HTTP endpoint");
});
