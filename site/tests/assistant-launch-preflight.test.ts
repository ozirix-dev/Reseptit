import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { assistantLaunchPreflight, readinessMarkdown, verifyReadinessRevision } from "../scripts/assistant-launch-preflight";

test("A4.2 remains HOLD with 80 source-bound pending language reviews", () => {
  const audit = assistantLaunchPreflight();
  assert.equal(audit.readiness, "HOLD");
  assert.equal(audit.languageReview.total, 80);
  assert.equal(audit.languageReview.pending, 80);
  assert.equal(audit.languageReview.humanApproved, 0);
  for (const locale of ["fi", "en", "sv", "th"] as const) {
    assert.deepEqual(audit.languageReview.byLocale[locale], {total: 20, pending: 20});
  }
});

test("synthetic budget fixture never becomes a real price or paid-call approval", () => {
  const audit = assistantLaunchPreflight();
  assert.equal(audit.offlineBudgetMath.defaultMonthlyAdditionalUsd, 5);
  assert.equal(audit.offlineBudgetMath.fixtureOnly, true);
  assert.equal(audit.offlineBudgetMath.productionHardCapVerified, false);
  assert.equal(audit.providerCalls, 0);
  assert.equal(audit.paidCallsAuthorized, false);
  assert.equal(audit.actualModelAccuracy, null);
});

test("privacy, authentication and kill-switch requirements cannot be silently skipped", () => {
  const audit = assistantLaunchPreflight();
  const keys = new Set(audit.blockers.map(x => x.key));
  for (const key of ["independent_language_review", "approved_provider_model_pricing",
    "global_atomic_budget", "server_auth_and_abuse", "privacy_logs_and_retention",
    "live_model_quality", "release_approval"]) assert.equal(keys.has(key), true, key);
  assert.ok(audit.blockers.every(x => x.status === "HOLD"));
  assert.equal(audit.productionCredentialsRead, false);
  assert.equal(audit.cloudflareChanged, false);
  assert.equal(audit.releaseAuthorized, false);
  assert.equal(audit.autoDeploy, false);
  assert.equal(audit.autoMerge, false);
});

test("readiness evidence is bound to the checked-out Git revision when CI supplies one", (t) => {
  const root = mkdtempSync(path.join(tmpdir(), "assistant-audit-revision-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  git("init", "--quiet");
  const fixture = path.join(root, "audit-input.txt");
  writeFileSync(fixture, "committed");
  git("add", "audit-input.txt");
  git("-c", "user.name=Audit Test", "-c", "user.email=audit@example.invalid",
    "-c", "commit.gpgsign=false", "-c", "core.hooksPath=.git/no-hooks",
    "commit", "--quiet", "-m", "Audit fixture");
  const head = git("rev-parse", "HEAD");
  const other = (head[0] === "0" ? "1" : "0") + head.slice(1);
  assert.equal(verifyReadinessRevision(root, head), head);
  assert.equal(verifyReadinessRevision(root, undefined), "");
  assert.throws(() => verifyReadinessRevision(root, other), /differs from checkout HEAD/);
  assert.throws(() => verifyReadinessRevision(root, "short"), /Invalid A4 audit GITHUB_SHA/);
  writeFileSync(fixture, "modified");
  assert.throws(() => verifyReadinessRevision(root, head), /checkout has tracked changes/);
  assert.ok(readinessMarkdown(assistantLaunchPreflight(), head).includes(head));
  assert.match(readinessMarkdown(assistantLaunchPreflight()), /Git-revisio: ei varmennettu/);
});

test("the Markdown and JSON projection identify all blockers without claiming quality", () => {
  const audit = assistantLaunchPreflight();
  const markdown = readinessMarkdown(audit);
  assert.match(markdown, /80\/80 PENDING/);
  assert.match(markdown, /NOT VERIFIED/);
  assert.match(markdown, /privacy_logs_and_retention/);
  assert.doesNotMatch(markdown, /100 % mallin tarkkuus|ready to deploy/i);
});
