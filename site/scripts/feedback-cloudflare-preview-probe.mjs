/**
 * Read-only smoke check for a Cloudflare Pages *preview* deployment.
 * Never deploys, sends a POST, uses credentials, or touches production.
 */
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

export function previewOrigin(raw) {
  if (typeof raw !== "string") throw new Error("A preview URL is required");
  const url = new URL(raw);
  // Cloudflare branch/commit preview URLs have at least two labels before pages.dev.
  // Disallow a project root .pages.dev, the Recipavo production domain,
  // redirects to arbitrary origins and nonstandard ports.
  if (url.protocol !== "https:" || url.username || url.password || url.port ||
      url.pathname !== "/" || url.search || url.hash ||
      !/^(?:[a-z0-9-]+\.){2,}pages\.dev$/u.test(url.hostname)) {
    throw new Error("Expected a specific HTTPS Pages preview URL, not production");
  }
  return url.origin;
}

export async function probePreview(rawUrl, expectedSha, request = fetch) {
  const origin = previewOrigin(rawUrl);
  assert.match(expectedSha, /^[a-f0-9]{40}$/u, "Full release commit SHA required");
  const options = { method: "GET", redirect: "manual", signal: AbortSignal.timeout(15000) };
  const page = await request(origin + "/", options);
  assert.equal(page.status, 200, "Preview root must serve HTML without redirect");
  assert.match(page.headers.get("content-type") ?? "", /text\/html/iu);
  assert.match(page.headers.get("x-robots-tag") ?? "", /\bnoindex\b/iu,
    "Preview must not be indexed");
  assert.equal(page.headers.get("x-recipavo-commit"), expectedSha,
    "Preview content is not the approved release SHA");

  const api = await request(origin + "/api/feedback",
    { ...options, signal: AbortSignal.timeout(15000) });
  assert.equal(api.status, 405, "The Cloudflare Pages Function is missing or misrouted");
  assert.match(api.headers.get("content-type") ?? "", /application\/json/iu);
  assert.match(api.headers.get("cache-control") ?? "", /\bno-store\b/iu);
  const payload = await api.json();
  assert.deepEqual(payload, { error: "method_not_allowed" },
    "Static fallback or unrelated Worker is not the intended Pages Function");

  return { result: "PASS", origin, sha: expectedSha, checks: ["HTML", "NOINDEX", "REVISION", "FEEDBACK_GET_405"] };
}

async function main() {
  if (process.argv.length !== 6 || process.argv[2] !== "--url" || process.argv[4] !== "--sha") {
    throw new Error("Usage: node scripts/feedback-cloudflare-preview-probe.mjs --url https://branch.project.pages.dev/ --sha <40-hex-sha>");
  }
  const result = await probePreview(process.argv[3], process.argv[5]);
  console.log("PASS: non-production Pages preview has expected revision and feedback Function route");
  console.log("Checked SHA: " + result.sha);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch(error => {
    console.error("HOLD: preview smoke check failed: " + (error instanceof Error ? error.message : "unknown error"));
    process.exitCode = 1;
  });
}
