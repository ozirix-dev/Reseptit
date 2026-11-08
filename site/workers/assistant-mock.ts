import type { RecipeLocale } from "../src/types/content";
import type { DemoSearch, DemoPreset } from "../src/features/assistant/demo";
import { demoSearchCatalog, loadDemoCatalog } from "../src/features/assistant/demo";

/**
 * A3 MOCK ONLY. No AI provider, credentials, paid inference, user profile or state.
 * Defaults OFF even if this bundle is accidentally deployed.
 *
 * Future public activation requires a separate security/release approval and
 * strict cost controls before any paid model can be plugged in.
 */
export interface MockAssistantEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ASSISTANT_MOCK_ENABLED?: string;
}

const locales: readonly RecipeLocale[] = ["fi", "en", "sv", "th"];
const presets: readonly DemoPreset[] = ["keto-30", "breakfast", "snack"];
const maxBodyBytes = 2048;
const apiPath = "/api/assistant/v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function onlyKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function validateRequest(body: unknown): { locale: RecipeLocale; search: DemoSearch } | null {
  if (!isRecord(body) || !onlyKeys(body, ["version", "locale", "search"]) || body.version !== 1 ||
      !locales.includes(body.locale as RecipeLocale) || !isRecord(body.search)) return null;
  const search = body.search;
  if (search.kind === "preset" && onlyKeys(search, ["kind", "preset"]) &&
      presets.includes(search.preset as DemoPreset)) {
    return { locale: body.locale as RecipeLocale, search: { kind: "preset", preset: search.preset as DemoPreset } };
  }
  if (search.kind === "text" && onlyKeys(search, ["kind", "text"]) &&
      typeof search.text === "string" && search.text.trim().length > 0 &&
      search.text.length <= 120) {
    return { locale: body.locale as RecipeLocale, search: { kind: "text", text: search.text } };
  }
  return null;
}

async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        size += value.byteLength;
        if (size > maxBodyBytes) {
          await reader.cancel();
          return null;
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }
  const raw = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { raw.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder("utf-8", { fatal: true }).decode(raw);
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function handleAssistantMock(request: Request, env: MockAssistantEnv): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname !== apiPath) return env.ASSETS.fetch(request);

  // Reject before reading, parsing, logging, accessing assets or making any provider call.
  if (env.ASSISTANT_MOCK_ENABLED !== "true") return jsonResponse({ error: "ASSISTANT_DISABLED" }, 503);
  if (request.method !== "POST") return jsonResponse({ error: "METHOD_NOT_ALLOWED" }, 405);
  const origin = request.headers.get("Origin");
  if (origin !== null && origin !== url.origin) return jsonResponse({ error: "CROSS_ORIGIN_BLOCKED" }, 403);
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "JSON_REQUIRED" }, 415);
  }
  const declaredLength = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBodyBytes) {
    return jsonResponse({ error: "REQUEST_TOO_LARGE" }, 413);
  }
  let body: unknown;
  try {
    const raw = await readLimitedBody(request);
    if (raw === null) return jsonResponse({ error: "REQUEST_TOO_LARGE" }, 413);
    body = JSON.parse(raw);
  } catch {
    return jsonResponse({ error: "INVALID_JSON" }, 400);
  }
  const input = validateRequest(body);
  if (!input) return jsonResponse({ error: "INVALID_REQUEST" }, 400);

  try {
    // Shared published JSON built by A1; no drafts or raw user entries.
    const assetsFetcher: typeof fetch = async (inputUrl, init) => {
      if (typeof inputUrl !== "string" || !inputUrl.startsWith("/data/")) throw new Error("Invalid internal asset path");
      const assetUrl = new URL(inputUrl, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl.toString(), init));
    };
    const catalog = await loadDemoCatalog(input.locale, "/", assetsFetcher);
    const recipes = demoSearchCatalog(catalog, input.search).map((item) => ({
      recipeId: item.recipeId,
      locale: item.locale,
      title: item.title,
      routePath: item.routePath,
      sourceVersion: item.sourceVersion,
      nutritionPerServing: item.nutritionPerServing,
      timeTotalMin: item.timeTotalMin,
    }));
    return jsonResponse({ version: 1, mode: "mock", locale: input.locale, results: recipes });
  } catch {
    // Intentionally omit user input, upstream URLs, full stack traces and internal details.
    return jsonResponse({ error: "CATALOG_UNAVAILABLE" }, 503);
  }
}

export default { fetch: handleAssistantMock };
