import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { handleAssistantMock, type MockAssistantEnv } from "../workers/assistant-mock";
import { siteContent } from "../src/generated/content.generated";

const origin = "https://assistant-preview.example";
const api = origin + "/api/assistant/v1";
const dataDir = path.resolve(import.meta.dirname, "../public/data");
const publishedLocales = ["fi", "en", "sv", "th"] as const;

function mockEnv(enabled: boolean, options: { tamper?: boolean; missing?: boolean } = {}) {
  const calls: string[] = [];
  const env: MockAssistantEnv = {
    ASSISTANT_MOCK_ENABLED: enabled ? "true" : "false",
    ASSETS: {
      fetch: async (request) => {
        const p = new URL(request.url).pathname;
        calls.push(p);
        if (!p.startsWith("/data/")) return new Response("static", { status: 200 });
        const file = p.slice("/data/".length);
        assert.match(file, /^(assistant-manifest\.json|assistant-(fi|en|sv|th)-[a-f0-9]{20}\.json)$/);
        if (options.missing) return new Response("missing", { status: 404 });
        const raw = await readFile(path.join(dataDir, file), "utf8");
        return new Response(options.tamper && file !== "assistant-manifest.json" ? raw + " " : raw, { status: 200 });
      },
    },
  };
  return { env, calls };
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request(api, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
}

test("A3 mock remains disabled by default and does not access catalog/assets", async () => {
  const { env, calls } = mockEnv(false);
  const response = await handleAssistantMock(post({ version: 1, locale: "fi", search: { kind: "text", text: "kana" } }), env);
  assert.equal(response.status, 503);
  assert.equal((await response.json() as { error: string }).error, "ASSISTANT_DISABLED");
  assert.deepEqual(calls, []);
});

test("A3 returns only published recipes via A1/A2 deterministic search for all four locales", async () => {
  const { env, calls } = mockEnv(true);
  for (const locale of publishedLocales) {
    const response = await handleAssistantMock(post({ version: 1, locale, search: { kind: "preset", preset: "breakfast" } }), env);
    assert.equal(response.status, 200, locale);
    assert.equal(response.headers.get("Cache-Control"), "no-store, private");
    const result = await response.json() as { version: number; mode: string; locale: string;
      results: Array<{ recipeId: string; locale: string; title: string; routePath: string; nutritionPerServing: { carbsNetG: number | null }; sourceVersion: string }> };
    assert.equal(result.version, 1);
    assert.equal(result.mode, "mock");
    assert.equal(result.locale, locale);
    assert.ok(result.results.length <= 5);
    for (const recipe of result.results) {
      assert.equal(recipe.locale, locale);
      assert.match(recipe.sourceVersion, /^[a-f0-9]{64}$/);
      assert.ok(siteContent.recipes.some((published) => published.locale === locale && published.recipeId === recipe.recipeId
        && published.routePath === recipe.routePath));
      assert.equal("glycemicLoadPerServing" in recipe, false);
    }
  }
  assert.equal(calls.length, 8, "one manifest and one versioned data file per language");
});

test("A3 rejects cross-origin, oversized, malformed and unsupported requests before catalog lookup", async () => {
  const { env, calls } = mockEnv(true);
  const ok = { version: 1, locale: "fi", search: { kind: "text", text: "kana" } };
  const cases: Array<[Request, number]> = [
    [new Request(api, { method: "GET" }), 405],
    [post(ok, { Origin: "https://other.example" }), 403],
    [new Request(api, { method: "POST", body: "{}" }), 415],
    [new Request(api, { method: "POST", headers: { "Content-Type": "application/json" }, body: "not-json" }), 400],
    [post({ ...ok, locale: "xx" }), 400],
    [post({ ...ok, model: "free-internet-ai" }), 400],
    [post({ ...ok, search: { kind: "preset", preset: "unknown" } }), 400],
    [post({ ...ok, search: { kind: "text", text: "x".repeat(121) } }), 400],
    [post({ ...ok, search: { kind: "text", text: "keto", gl: "low" } }), 400],
    [post({ ...ok, search: { kind: "text", text: "x".repeat(3000) } }), 413],
  ];
  for (const [request, expected] of cases) {
    const response = await handleAssistantMock(request, env);
    assert.equal(response.status, expected);
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
  }
  assert.deepEqual(calls, [], "reject before reading catalogs or contacting any provider");
});

test("A3 fails closed if A1 catalog is unavailable or has a mismatched SHA-256", async () => {
  const request = post({ version: 1, locale: "fi", search: { kind: "text", text: "feta" } });
  for (const options of [{ missing: true }, { tamper: true }]) {
    const { env } = mockEnv(true, options);
    const response = await handleAssistantMock(request.clone(), env);
    assert.equal(response.status, 503);
    assert.equal((await response.json() as { error: string }).error, "CATALOG_UNAVAILABLE");
  }
});

test("A3 does not intercept other site routes", async () => {
  const { env, calls } = mockEnv(false);
  const response = await handleAssistantMock(new Request(origin + "/en/recipes/"), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "static");
  assert.deepEqual(calls, ["/en/recipes/"]);
});
