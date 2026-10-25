import assert from "node:assert/strict";
import { test } from "node:test";
import { EvaluationClientError, NutriticsEvaluationClient } from "../scripts/nutritics-evaluation-client";
import { syntheticFoodSearch, syntheticRecipeAnalysis } from "./fixtures/nutritics-evaluation";

test("synthetic mode requires an injected fake transport and works without an API key", async () => {
  const client = new NutriticsEvaluationClient();
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  const result = new NutriticsEvaluationClient({ fetcher: async () => Response.json(syntheticFoodSearch) });
  assert.deepEqual(await result.request({ path: "/api/v1.2/LIST/food=rice" }), syntheticFoodSearch);
});

test("live mode is opt-in and requires confirmed auth plus an explicit endpoint allowlist", async () => {
  let calls = 0;
  const fetcher = async () => { calls += 1; return Response.json({}); };
  assert.throws(() => new NutriticsEvaluationClient({ mode: "live", fetcher }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.throws(() => new NutriticsEvaluationClient({ mode: "live", apiKey: "synthetic-only", apiKeyHeader: "X-Test", apiKeyHeaderVerified: true, fetcher }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.throws(() => liveClient(fetcher, { apiKeyHeader: "Host" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  const client = liveClient(fetcher);
  await assert.rejects(client.request({ path: "/api/v1.2/OTHER/resource" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.equal(calls, 0);
});

test("allowlist keeps documented dynamic food search while rejecting route continuations and encoded separators", async () => {
  const requested: string[] = [];
  const client = liveClient(async (input) => {
    requested.push(String(input));
    return Response.json(syntheticFoodSearch);
  });
  await client.request({ path: "/api/v1.2/LIST/food=cat:Sauces%20%26%20Condiments&limit=0,3" });
  assert.equal(requested.length, 1);

  for (const path of [
    "/api/v1.2/LIST/food=rice/recipe=123",
    "/api/v1.2/LIST/food=rice%2frecipe=123",
    "/api/v1.2/LIST/food=rice%252frecipe=123",
    "/api/v1.2/LIST/food=rice&apiKey=secret",
    "/api/v1.2/LIST/food=rice&auth=secret",
    "/api/v1.2/LIST/food=rice&recipe=123",
    "/api/v1.2/LIST/food=rice&limit=0,3&recipe=123",
    "/api/v1.2/LIST/food=rice&limit=0,3&limit=3,3",
    "/api/v1.2/LIST/food=rice?token=secret",
    "/api/v1.2/LIST/food=rice/../recipe=123",
  ]) {
    await assert.rejects(client.request({ path }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration", path);
  }
  assert.equal(requested.length, 1, "rejected paths must not reach the transport");
});

test("sends a synthetic API key only in the configured header and reports call metrics", async () => {
  const secret = "synthetic-test-key";
  const metrics: Array<{ outcome: string; estimatedCost: number | "UNKNOWN" }> = [];
  let requestedUrl = "";
  let receivedHeader: string | null = null;
  const client = liveClient(async (input, init) => {
    requestedUrl = String(input);
    receivedHeader = new Headers(init?.headers).get("X-Synthetic-Key");
    return Response.json(syntheticFoodSearch);
  }, { apiKey: secret, pricePerRequest: { amount: 0.02, currency: "EUR" }, onMetric: (metric) => metrics.push(metric) });
  const result = await client.request<typeof syntheticFoodSearch>({ path: "/api/v1.2/LIST/food=rice" });
  assert.deepEqual(result, syntheticFoodSearch);
  assert.equal(syntheticRecipeAnalysis.recipeId, "fixture-recipe-001");
  assert.equal(receivedHeader, secret);
  assert.equal(requestedUrl.includes(secret), false);
  assert.equal(metrics[0]?.outcome, "success");
  assert.equal(metrics[0]?.estimatedCost, 0.02);
  assert.equal(client.getUsage().estimatedCost.status, "KNOWN");
  assert.equal(client.getUsage().calls, 1);
});

test("unknown price stays UNKNOWN and quota headers are aggregated", async () => {
  const client = liveClient(async () => new Response("{}", { headers: { "ratelimit-limit": "20", "ratelimit-remaining": "17" } }));
  await client.request({ path: "/api/v1.2/LIST/food=rice" });
  assert.deepEqual(client.getUsage(), {
    calls: 1, successfulCalls: 1, failedCalls: 0, httpErrors: 0, redirects: 0,
    timeouts: 0, networkErrors: 0, totalDurationMs: client.getUsage().totalDurationMs,
    quotaLimit: 20, quotaRemaining: 17, quotaUsed: 3, estimatedCost: { status: "UNKNOWN" },
  });
});

test("HTTP errors do not retain response bodies or log secrets", async () => {
  const secret = "synthetic-secret-do-not-leak";
  const metrics: string[] = [];
  const client = liveClient(async () => new Response(`private body ${secret}`, { status: 403 }), {
    apiKey: secret,
    onMetric: (metric) => metrics.push(JSON.stringify(metric)),
  });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "http" && error.status === 403 && !error.message.includes("private") && !error.message.includes(secret));
  assert.equal(metrics.join("").includes(secret), false);
  assert.equal(client.getUsage().httpErrors, 1);
});

test("timeout aborts request and increments timeout metrics", async () => {
  let aborted = false;
  const client = liveClient(async (_input, init) => new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => { aborted = true; reject(new Error("private transport detail")); }, { once: true });
  }), { timeoutMs: 10 });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "timeout");
  assert.equal(aborted, true);
  assert.equal(client.getUsage().timeouts, 1);
});

test("refuses redirects without following them", async () => {
  let redirectMode: RequestRedirect | undefined;
  const client = liveClient(async (_input, init) => {
    redirectMode = init?.redirect;
    return new Response(null, { status: 302, headers: { location: "https://attacker.invalid/collect" } });
  });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "redirect");
  assert.equal(redirectMode, "manual");
  assert.equal(client.getUsage().redirects, 1);
});

test("rejects credential URLs, external origins, traversal and non-HTTPS configuration", async () => {
  const client = new NutriticsEvaluationClient({ fetcher: async () => Response.json({}) });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice?api_key=bad" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  await assert.rejects(client.request({ path: "//attacker.invalid/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  await assert.rejects(client.request({ path: "/api/v1.2/../collect" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.throws(() => new NutriticsEvaluationClient({ baseUrl: "http://localhost" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.throws(() => new NutriticsEvaluationClient({ baseUrl: "https://user:password@www.nutritics.com" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
});

test("network errors expose no transport details and increment usage", async () => {
  const client = liveClient(async () => { throw new Error("synthetic private transport message"); });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "network" && !error.message.includes("private"));
  assert.equal(client.getUsage().networkErrors, 1);
});

function liveClient(fetcher: typeof fetch, overrides: Partial<ConstructorParameters<typeof NutriticsEvaluationClient>[0]> = {}): NutriticsEvaluationClient {
  return new NutriticsEvaluationClient({
    mode: "live",
    apiKey: "synthetic-test-key",
    apiKeyHeader: "X-Synthetic-Key",
    apiKeyHeaderVerified: true,
    approvedEndpoints: [{ method: "GET", pathPrefix: "/api/v1.2/LIST/food=" }],
    fetcher,
    ...overrides,
  });
}
