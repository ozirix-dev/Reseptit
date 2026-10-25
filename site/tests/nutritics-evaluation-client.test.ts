import assert from "node:assert/strict";
import { test } from "node:test";
import { EvaluationClientError, NutriticsEvaluationClient } from "../scripts/nutritics-evaluation-client";
import { syntheticFoodSearch, syntheticRecipeAnalysis } from "./fixtures/nutritics-evaluation";

test("requires an API key and confirmed header before calling the injected transport", async () => {
  let calls = 0;
  const client = new NutriticsEvaluationClient({ fetcher: async () => { calls += 1; return Response.json({}); } });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.equal(calls, 0);
});

test("sends the API key only in the configured header and reports call metrics", async () => {
  const secret = "synthetic-test-key";
  const metrics: unknown[] = [];
  let requestedUrl = "";
  let receivedHeader: string | null = null;
  const client = new NutriticsEvaluationClient({
    apiKey: secret,
    apiKeyHeader: "X-Synthetic-Key",
    costPerRequest: 0.02,
    fetcher: async (input, init) => {
      requestedUrl = String(input);
      receivedHeader = new Headers(init?.headers).get("X-Synthetic-Key");
      return Response.json(syntheticFoodSearch);
    },
    onMetric: (metric) => metrics.push(metric),
  });
  const result = await client.request<typeof syntheticFoodSearch>({ path: "/api/v1.2/LIST/food=rice" });
  assert.deepEqual(result, syntheticFoodSearch);
  assert.equal(syntheticRecipeAnalysis.recipeId, "fixture-recipe-001");
  assert.equal(receivedHeader, secret);
  assert.equal(requestedUrl.includes(secret), false);
  assert.deepEqual(metrics.map((metric) => (metric as { outcome: string; estimatedCost: number }).outcome), ["success"]);
  assert.equal((metrics[0] as { estimatedCost: number }).estimatedCost, 0.02);
});

test("reports HTTP errors without retaining response bodies", async () => {
  const client = new NutriticsEvaluationClient({
    apiKey: "synthetic-key",
    apiKeyHeader: "X-Synthetic-Key",
    fetcher: async () => new Response("synthetic private error", { status: 403 }),
  });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "http" && error.status === 403 && !error.message.includes("private"));
});

test("times out and aborts the injected request", async () => {
  let aborted = false;
  const client = new NutriticsEvaluationClient({
    apiKey: "synthetic-key",
    apiKeyHeader: "X-Synthetic-Key",
    timeoutMs: 5,
    fetcher: async (_input, init) => ({
      ok: true,
      status: 200,
      json: () => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => { aborted = true; reject(new Error("aborted")); }, { once: true });
      }),
    } as Response),
  });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "timeout");
  assert.equal(aborted, true);
});

test("rejects credential-bearing URLs and non-HTTPS endpoints", async () => {
  const client = new NutriticsEvaluationClient({ apiKey: "synthetic-key", apiKeyHeader: "X-Synthetic-Key" });
  await assert.rejects(client.request({ path: "/api/v1.2/LIST/food=rice?api_key=bad" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.throws(() => new NutriticsEvaluationClient({ baseUrl: "http://localhost" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
  assert.throws(() => new NutriticsEvaluationClient({ baseUrl: "https://user:password@www.nutritics.com" }), (error: unknown) => error instanceof EvaluationClientError && error.kind === "configuration");
});
