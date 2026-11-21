import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import {
  handleFeedback, onRequestGet, type FeedbackDatabase, type FeedbackEnvironment,
} from "../functions/api/feedback";
import { feedbackRetentionDays } from "../src/features/feedback/retention-policy";
import { purgeExpiredFeedback } from "../workers/feedback-retention";

const origin = "https://www.recipavo.com";
const valid = {
  kind: "recipe_error",
  locale: "fi",
  pagePath: "/kermainen-lohipata/",
  recipeId: "kermainen-lohipata",
  message: "Valmistusajan arvio ei täsmää ohjeessa mainittuun haudutukseen.",
  email: "synthetic@example.invalid",
  turnstileToken: "single-use-demo-token-a",
  website: "",
};

function request(input: typeof valid): Request {
  return new Request(origin + "/api/feedback", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

function verified(hostname = "www.recipavo.com"): typeof fetch {
  return (async (_url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    assert.equal(String(_url), "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(options?.method, "POST");
    assert.ok((options?.body as URLSearchParams).get("response"));
    return new Response(JSON.stringify({ success: true, hostname }), { status: 200 });
  }) as typeof fetch;
}

/**
 * Minimal D1 adapter backed by real SQLite rather than a mocked SQL result.
 * It does not call Cloudflare, touch a production database or persist a file.
 */
function sqliteD1(database: DatabaseSync): FeedbackDatabase {
  return {
    prepare(sql) {
      return {
        async first() {
          return database.prepare(sql).get() ?? null;
        },
        bind(...values) {
          return {
            async run() {
              database.prepare(sql).run(...values);
              return { success: true };
            },
          };
        },
      };
    },
  };
}

async function schema(database: DatabaseSync): Promise<void> {
  for (const name of ["0001_feedback.sql", "0002_feedback_retention.sql"]) {
    const sql = await readFile(path.resolve(import.meta.dirname, "../migrations", name), "utf8");
    database.exec(sql);
  }
}

function configured(database: FeedbackDatabase): FeedbackEnvironment {
  return {
    FEEDBACK_ENABLED: "true",
    FEEDBACK_ALLOWED_ORIGIN: origin,
    FEEDBACK_DB: database,
    TURNSTILE_SECRET: "only-a-synthetic-test-secret",
  };
}

test("real SQLite migrations and the complete retention-gated feedback flow agree", async () => {
  const db = new DatabaseSync(":memory:");
  try {
    await schema(db);
    const adapter = sqliteD1(db);
    const env = configured(adapter);
    const now = Date.now();

    // The migration must not fake a successful deletion. Without a real purge,
    // even correctly configured feedback intake must remain unavailable.
    assert.equal(db.prepare("SELECT count(*) AS n FROM feedback_maintenance").get()?.n, 0);
    const before = await handleFeedback({ request: request(valid), env },
      (async () => { throw new Error("Turnstile must not be called before retention"); }) as typeof fetch);
    assert.equal(before.status, 503);
    assert.equal((await before.json() as { error: string }).error, "maintenance_unavailable");
    assert.equal(db.prepare("SELECT count(*) AS n FROM feedback_submissions").get()?.n, 0);

    // The real SQL DELETE + monotonic heartbeat are executed on the actual
    // migrated schema; only the D1 promise-shaped API is adapted.
    const maintenance = await purgeExpiredFeedback({
      FEEDBACK_RETENTION_ENABLED: "true", FEEDBACK_DB: adapter,
    }, now, now + 1_000);
    assert.equal(maintenance.lastSuccessAt, new Date(now).toISOString());
    assert.equal(db.prepare(
      "SELECT last_success_at FROM feedback_maintenance WHERE singleton = 1",
    ).get()?.last_success_at, maintenance.lastSuccessAt);

    const response = await handleFeedback({ request: request(valid), env }, verified());
    assert.equal(response.status, 202);
    const receipt = await response.json() as { reference: string };
    assert.match(receipt.reference, /^[a-f0-9-]{36}$/u);
    assert.ok(!JSON.stringify(receipt).includes(valid.email));
    assert.ok(!JSON.stringify(receipt).includes(valid.message));
    const row = db.prepare(
      "SELECT reference, kind, locale, page_path, recipe_id, message, contact_email, " +
      "review_status, token_sha256, received_at FROM feedback_submissions WHERE reference = ?",
    ).get(receipt.reference);
    assert.ok(row);
    assert.equal(row.kind, valid.kind);
    assert.equal(row.locale, valid.locale);
    assert.equal(row.page_path, valid.pagePath);
    assert.equal(row.recipe_id, valid.recipeId);
    assert.equal(row.message, valid.message);
    assert.equal(row.contact_email, valid.email);
    assert.equal(row.review_status, "new");
    assert.match(String(row.token_sha256), /^[a-f0-9]{64}$/u);
    assert.ok(row.token_sha256 !== valid.turnstileToken);
    assert.equal(onRequestGet().status, 405, "no public inbox endpoint");

    // The D1 UNIQUE constraint is a second replay barrier even if a broken
    // test verifier incorrectly claims the token is valid a second time.
    const duplicate = await handleFeedback({ request: request(valid), env }, verified());
    assert.equal(duplicate.status, 503);
    assert.equal((await duplicate.json() as { error: string }).error, "storage_unavailable");
    assert.equal(db.prepare("SELECT count(*) AS n FROM feedback_submissions").get()?.n, 1);

    // An expired row is removed on the next purge; the receiving date and
    // cutoff are compared as ISO UTC timestamps, not local clock strings.
    const expired = new Date(now - feedbackRetentionDays * 86_400_000 - 1_000).toISOString();
    db.prepare("UPDATE feedback_submissions SET received_at = ? WHERE reference = ?")
      .run(expired, receipt.reference);
    const newer = now + 60_000;
    await purgeExpiredFeedback({
      FEEDBACK_RETENTION_ENABLED: "true", FEEDBACK_DB: adapter,
    }, newer, newer + 1_000);
    assert.equal(db.prepare("SELECT count(*) AS n FROM feedback_submissions").get()?.n, 0);
    assert.equal(db.prepare(
      "SELECT last_success_at FROM feedback_maintenance WHERE singleton = 1",
    ).get()?.last_success_at, new Date(newer).toISOString());

    // The original schema's kind and status constraints remain effective.
    assert.throws(() => db.prepare(
      "INSERT INTO feedback_submissions (reference, kind, locale, page_path, message, token_sha256) " +
      "VALUES (?, ?, ?, ?, ?, ?)",
    ).run("synthetic-bad", "auto_publish", "fi", "/", valid.message, "synthetic-digest"));
  } finally {
    db.close();
  }
});

test("real SQLite supports private manual deletion by opaque reference without other rows changing", async () => {
  const db = new DatabaseSync(":memory:");
  try {
    await schema(db);
    const insert = db.prepare(
      "INSERT INTO feedback_submissions " +
      "(reference, kind, locale, page_path, message, token_sha256) VALUES (?, ?, ?, ?, ?, ?)",
    );
    insert.run("synthetic-first", "technical", "en", "/", "First synthetic private report", "token-one");
    insert.run("synthetic-second", "other", "sv", "/", "Second synthetic private report", "token-two");
    const deletion = db.prepare("DELETE FROM feedback_submissions WHERE reference = ?");
    assert.equal(deletion.run("synthetic-first").changes, 1);
    assert.equal(db.prepare("SELECT reference FROM feedback_submissions").get()?.reference, "synthetic-second");
    assert.equal(deletion.run("synthetic-first").changes, 0);
  } finally {
    db.close();
  }
});
