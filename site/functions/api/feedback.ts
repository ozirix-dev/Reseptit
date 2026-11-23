/**
 * Cloudflare Pages Function: private feedback intake, never a publication API.
 * Enabled only when all production bindings and Turnstile are configured.
 */
import { feedbackMaintenanceIsFresh } from "../../src/features/feedback/retention-policy";
import { feedbackIntakeQuota, feedbackQuotaCutoffs, feedbackQuotaInsertSql, feedbackInsertOutcome } from "../../src/features/feedback/intake-quota";

const validKinds = new Set(["recipe_error", "improvement", "new_recipe", "technical", "other"]);
const validLocales = new Set(["fi", "en", "sv", "th"]);
const allowedFields = new Set([
  "kind", "message", "email", "locale", "pagePath", "recipeId", "turnstileToken", "website",
]);
const MAX_BODY_BYTES = 20_000;

export interface FeedbackDatabase {
  prepare(sql: string): {
    bind(...values: (string | null | number)[]): { run(): Promise<{ success: boolean; meta?: { changes: number } }> };
    first(): Promise<unknown>;
  };
}
export interface FeedbackEnvironment {
  FEEDBACK_ENABLED?: string;
  FEEDBACK_ALLOWED_ORIGIN?: string;
  FEEDBACK_DB?: FeedbackDatabase;
  TURNSTILE_SECRET?: string;
}
export interface FeedbackFunctionContext {
  request: Request;
  env: FeedbackEnvironment;
}
interface FeedbackInput {
  kind: string;
  message: string;
  email: string | null;
  locale: string;
  pagePath: string;
  recipeId: string | null;
  turnstileToken: string;
  website: string;
}

function json(status: number, body: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function limitedJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty");
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("too_large");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } finally {
    reader.releaseLock();
  }
}

export function validateFeedback(value: unknown): FeedbackInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some(key => !allowedFields.has(key))) return null;
  const { kind, message, email, locale, pagePath, recipeId, turnstileToken, website } = input;
  if (typeof kind !== "string" || !validKinds.has(kind) ||
      typeof locale !== "string" || !validLocales.has(locale)) return null;
  if (typeof message !== "string" || message.trim().length < 20 ||
      Array.from(message).length > 4000 || /[\u0000-\u0008\u000B-\u001F\u007F]/u.test(message)) return null;
  if (typeof pagePath !== "string" || pagePath.length > 180 ||
      !/^\/(?:[a-z0-9-]+\/)*$/u.test(pagePath)) return null;
  if (recipeId !== null && recipeId !== undefined &&
      (typeof recipeId !== "string" || recipeId.length > 100 ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(recipeId))) return null;
  if (typeof turnstileToken !== "string" || !turnstileToken ||
      turnstileToken.length > 2048) return null;
  if (email !== null && email !== undefined && email !== "" &&
      (typeof email !== "string" || email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email))) return null;
  if (website !== undefined && (typeof website !== "string" || website.length > 256)) return null;
  return {
    kind, message: message.trim(), locale, pagePath,
    email: typeof email === "string" && email.trim() ? email.trim() : null,
    recipeId: typeof recipeId === "string" ? recipeId : null,
    turnstileToken, website: typeof website === "string" ? website : "",
  };
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function handleFeedback(
  { request, env }: FeedbackFunctionContext,
  verifyFetch: typeof fetch = fetch,
): Promise<Response> {
  // Never accept a submission if a resource or permission is only partly configured.
  if (env.FEEDBACK_ENABLED !== "true" || !env.FEEDBACK_DB?.prepare ||
      !env.TURNSTILE_SECRET || !env.FEEDBACK_ALLOWED_ORIGIN) {
    return json(503, { error: "unavailable" });
  }
  let expectedOrigin: URL;
  try {
    expectedOrigin = new URL(env.FEEDBACK_ALLOWED_ORIGIN);
    if (expectedOrigin.protocol !== "https:" || expectedOrigin.origin !== env.FEEDBACK_ALLOWED_ORIGIN ||
        expectedOrigin.pathname !== "/") return json(503, { error: "unavailable" });
  } catch {
    return json(503, { error: "unavailable" });
  }
  if (request.headers.get("Origin") !== expectedOrigin.origin) {
    return json(403, { error: "forbidden" });
  }
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/iu.test(request.headers.get("Content-Type") ?? "")) {
    return json(415, { error: "unsupported_media_type" });
  }
  const length = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) return json(413, { error: "too_large" });
  let raw: unknown;
  try {
    raw = await limitedJson(request);
  } catch (error) {
    return json(error instanceof Error && error.message === "too_large" ? 413 : 400, { error: "invalid_request" });
  }
  const input = validateFeedback(raw);
  if (!input) return json(400, { error: "invalid_request" });
  // A field intended for bots: acknowledge without storing or making a paid verification call.
  if (input.website) return json(202, { reference: crypto.randomUUID() });

  // A working daily deletion job is a mandatory condition for collecting messages.
  // Missing, stale, future or malformed maintenance evidence blocks intake.
  try {
    const maintenance = await env.FEEDBACK_DB.prepare(
      "SELECT last_success_at FROM feedback_maintenance WHERE singleton = 1",
    ).first();
    if (!feedbackMaintenanceIsFresh(maintenance)) {
      return json(503, { error: "maintenance_unavailable" });
    }
  } catch {
    return json(503, { error: "maintenance_unavailable" });
  }

  let verified: unknown;
  try {
    const params = new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: input.turnstileToken,
    });
    const response = await verifyFetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", body: params,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return json(503, { error: "verification_unavailable" });
    verified = await response.json();
  } catch {
    return json(503, { error: "verification_unavailable" });
  }
  // Siteverify is an external service: HTTP 200 with null/array/malformed JSON
  // is not evidence of a verified user. Treat malformed responses as unavailable
  // rather than throwing outside the catch or touching the private database.
  if (!verified || typeof verified !== "object" || Array.isArray(verified) ||
      !("success" in verified) || typeof verified.success !== "boolean") {
    return json(503, { error: "verification_unavailable" });
  }
  if (verified.success !== true || !("hostname" in verified) ||
      verified.hostname !== expectedOrigin.hostname) {
    return json(403, { error: "verification_failed" });
  }
  const reference = crypto.randomUUID();
  let outcome: ReturnType<typeof feedbackInsertOutcome>;
  try {
    const cutoff = feedbackQuotaCutoffs();
    // Both rolling global limits are enforced within the same atomic SQLite
    // INSERT/SELECT. A separate COUNT followed by INSERT would race under load.
    // No IP address, User-Agent, visitor token, cookies or raw query is stored.
    const written = await env.FEEDBACK_DB.prepare(feedbackQuotaInsertSql).bind(
      reference, input.kind, input.locale, input.pagePath, input.recipeId,
      input.message, input.email, await sha256(input.turnstileToken),
      cutoff.quarterHour, feedbackIntakeQuota.quarterHourMax,
      cutoff.rollingDay, feedbackIntakeQuota.rollingDayMax,
    ).run();
    outcome = feedbackInsertOutcome(written);
  } catch {
    return json(503, { error: "storage_unavailable" });
  }
  if (outcome === "full") return json(429, { error: "quota_exceeded" });
  if (outcome !== "stored") return json(503, { error: "storage_unavailable" });
  return json(202, { reference });

}

export async function onRequestPost(context: FeedbackFunctionContext): Promise<Response> {
  return handleFeedback(context);
}

export function onRequestGet(): Response {
  return json(405, { error: "method_not_allowed" });
}
