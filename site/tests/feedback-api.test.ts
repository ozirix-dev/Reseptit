import assert from "node:assert/strict";
import test from "node:test";
import { handleFeedback, onRequestGet, validateFeedback, type FeedbackEnvironment } from "../functions/api/feedback";

const origin = "https://www.recipavo.com";
const valid = {
  kind: "recipe_error", locale: "fi", pagePath: "/kermainen-lohipata/",
  recipeId: "kermainen-lohipata", message: "Reseptissä mainittu valmistusaika ei täsmää.",
  email: "lukija@example.org", turnstileToken: "valid-token", website: "",
};

function request(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(origin + "/api/feedback", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function mockDb() {
  const writes: { sql: string; values: (string | null)[] }[] = [];
  const database: NonNullable<FeedbackEnvironment["FEEDBACK_DB"]> = {
    prepare(sql) {
      return {
        bind(...values) {
          return { async run() { writes.push({ sql, values }); return { success: true }; } };
        },
      };
    },
  };
  return { database, writes };
}

function configured(database: NonNullable<FeedbackEnvironment["FEEDBACK_DB"]>): FeedbackEnvironment {
  return {
    FEEDBACK_ENABLED: "true", FEEDBACK_DB: database,
    FEEDBACK_ALLOWED_ORIGIN: origin, TURNSTILE_SECRET: "secret-not-exposed",
  };
}

function verifier(hostname = "www.recipavo.com", success = true): typeof fetch {
  return (async (_input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    assert.match(String(_input), /^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/siteverify$/);
    assert.equal(init?.method, "POST");
    const params = init?.body as URLSearchParams;
    assert.equal(params.get("secret"), "secret-not-exposed");
    assert.equal(params.get("response"), "valid-token");
    return new Response(JSON.stringify({ success, hostname }), { status: 200 });
  }) as typeof fetch;
}

test("feedback intake fails closed when bindings or explicit enablement are absent", async () => {
  const db = mockDb();
  for (const env of [{}, { FEEDBACK_ENABLED: "true" }, {
    ...configured(db.database), TURNSTILE_SECRET: undefined,
  }, { ...configured(db.database), FEEDBACK_ENABLED: "false" }]) {
    const response = await handleFeedback({ request: request(valid), env });
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
  assert.equal(db.writes.length, 0);
});

test("only explicit fields, source paths and plausible contact emails are accepted", () => {
  assert.deepEqual(validateFeedback(valid)?.recipeId, "kermainen-lohipata");
  assert.equal(validateFeedback({ ...valid, unknown: "private tracking" }), null);
  assert.equal(validateFeedback({ ...valid, pagePath: "https://evil.example/path" }), null);
  assert.equal(validateFeedback({ ...valid, pagePath: "/keto/?email=private" }), null);
  assert.equal(validateFeedback({ ...valid, message: "short" }), null);
  assert.equal(validateFeedback({ ...valid, email: "not-an-address" }), null);
  assert.equal(validateFeedback({ ...valid, locale: "xx" }), null);
  assert.equal(validateFeedback({ ...valid, kind: "auto_publish" }), null);
  assert.equal(validateFeedback({ ...valid, turnstileToken: "x".repeat(2049) }), null);
});

test("verified private report stores only approved fields and responds with opaque reference", async () => {
  const db = mockDb();
  const response = await handleFeedback({ request: request(valid), env: configured(db.database) }, verifier());
  assert.equal(response.status, 202);
  const result = await response.json() as { reference: string };
  assert.match(result.reference, /^[0-9a-f-]{36}$/i);
  assert.equal(db.writes.length, 1);
  assert.match(db.writes[0].sql, /^INSERT INTO feedback_submissions/u);
  assert.equal(db.writes[0].values[0], result.reference);
  assert.deepEqual(db.writes[0].values.slice(1, 7), [
    valid.kind, valid.locale, valid.pagePath, valid.recipeId, valid.message, valid.email,
  ]);
  assert.match(db.writes[0].values[7]!, /^[0-9a-f]{64}$/u);
  assert.ok(!JSON.stringify(result).includes(valid.message));
  assert.ok(!JSON.stringify(result).includes(valid.email));
  assert.ok(!db.writes[0].values.includes(valid.turnstileToken));
  assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
});

test("invalid origin, content-type, token, hostname and unsupported payload never enter D1", async () => {
  const db = mockDb();
  const env = configured(db.database);
  assert.equal((await handleFeedback({
    request: request(valid, { Origin: "https://attacker.example" }), env,
  }, verifier())).status, 403);
  assert.equal((await handleFeedback({
    request: request(valid, { "Content-Type": "text/plain" }), env,
  }, verifier())).status, 415);
  assert.equal((await handleFeedback({
    request: request({ ...valid, kind: "publish_now" }), env,
  }, verifier())).status, 400);
  assert.equal((await handleFeedback({ request: request(valid), env }, verifier("evil.example"))).status, 403);
  assert.equal((await handleFeedback({ request: request(valid), env }, verifier("www.recipavo.com", false))).status, 403);
  assert.equal(db.writes.length, 0);
});

test("oversized request and bot honeypot do not consume Turnstile or D1 writes", async () => {
  const db = mockDb();
  const env = configured(db.database);
  const tooLarge = { ...valid, message: "x".repeat(21_000) };
  const oversized = await handleFeedback({ request: request(tooLarge), env }, verifier());
  assert.equal(oversized.status, 413);
  const bot = await handleFeedback({ request: request({ ...valid, website: "https://spam.test" }), env },
    (async () => { throw new Error("Should not call verifier for honeypot"); }) as typeof fetch);
  assert.equal(bot.status, 202);
  assert.equal(db.writes.length, 0);
});

test("backend storage errors do not acknowledge a report as accepted", async () => {
  const failing: NonNullable<FeedbackEnvironment["FEEDBACK_DB"]> = {
    prepare() { return { bind() { return { async run() { throw new Error("D1 unavailable"); } }; } }; },
  };
  const response = await handleFeedback({ request: request(valid), env: configured(failing) }, verifier());
  assert.equal(response.status, 503);
  assert.equal((await response.json() as { error: string }).error, "storage_unavailable");
  assert.equal(onRequestGet().status, 405);
});
