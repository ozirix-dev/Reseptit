/**
 * Offline Pages Functions smoke test using Wrangler/workerd.
 * No Cloudflare login, credentials, D1 remote binding, deployment or real feedback.
 * Execute from site/: node scripts/feedback-pages-local-smoke.mjs
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const site = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sleep = ms => new Promise(done => setTimeout(done, ms));

async function availablePort() {
  const server = createServer();
  await new Promise((done, fail) => server.once("error", fail)
    .listen(0, "127.0.0.1", done));
  const port = server.address().port;
  await new Promise((done, fail) => server.close(error => error ? fail(error) : done()));
  return port;
}

async function check(base) {
  const response = await fetch(base + "/", { signal: AbortSignal.timeout(3000), redirect: "manual" });
  assert.equal(response.status, 200, "Temporary Pages fixture should serve HTML");
  const get = await fetch(base + "/api/feedback", {
    signal: AbortSignal.timeout(3000), redirect: "manual",
  });
  assert.equal(get.status, 405, "GET /api/feedback must reach the Pages Function");
  assert.deepEqual(await get.json(), { error: "method_not_allowed" });
  // The service has NO bindings or enabled flags; this synthetic request
  // must fail closed before body processing, Turnstile or D1.
  const post = await fetch(base + "/api/feedback", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ synthetic: true }),
    signal: AbortSignal.timeout(3000), redirect: "manual",
  });
  assert.equal(post.status, 503, "Disabled feedback intake must never accept a report");
  assert.deepEqual(await post.json(), { error: "unavailable" });
  assert.match(post.headers.get("cache-control") ?? "", /\bno-store\b/u);
}

async function main() {
  const temp = await mkdtemp(join(tmpdir(), "recipavo-pages-rehearsal-"));
  let child;
  try {
    const fixture = join(temp, "public");
    await mkdir(fixture);
    await writeFile(join(fixture, "index.html"),
      "<!doctype html><html lang=\"fi\"><title>Pages smoke</title><body>Offline fixture</body></html>");
    const port = await availablePort();
    const args = ["--yes", "wrangler@4.165.0", "pages", "dev", fixture,
      "--ip", "127.0.0.1", "--port", String(port), "--persist-to", join(temp, "state")];
    const env = { ...process.env, CI: "true", NO_COLOR: "1", WRANGLER_SEND_METRICS: "false" };
    // A successful rehearsal must never depend on inherited Cloudflare credentials.
    for (const key of ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_API_KEY", "CLOUDFLARE_EMAIL",
      "CLOUDFLARE_ACCOUNT_ID", "CF_API_TOKEN", "CF_ACCOUNT_ID"]) delete env[key];
    child = spawn(process.platform === "win32" ? "npx.cmd" : "npx", args, {
      cwd: site, env, stdio: ["ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
    });
    // Process output is intentionally not copied to Actions logs.
    child.stdout?.resume();
    child.stderr?.resume();
    const base = "http://127.0.0.1:" + port;
    let ok = false;
    for (let attempt = 0; attempt < 160; attempt++) {
      if (child.exitCode !== null) throw new Error("Wrangler exited before the Functions rehearsal");
      try {
        const root = await fetch(base + "/", { signal: AbortSignal.timeout(1000) });
        if (root.ok) { ok = true; break; }
      } catch { /* local workerd still starting */ }
      await sleep(250);
    }
    assert.equal(ok, true, "Local Pages runtime did not start");
    await check(base);
    console.log("PASS: offline Pages route GET=405, POST without configuration=503, static HTML=200");
  } finally {
    if (child?.pid && process.platform !== "win32") {
      try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill(); }
    } else {
      child?.kill();
    }
    await rm(temp, { recursive: true, force: true });
  }
}

main().catch(error => {
  console.error("FAIL: offline Pages smoke: " + (error instanceof Error ? error.message : "unknown"));
  process.exitCode = 1;
});
