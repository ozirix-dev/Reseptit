/**
 * Issue #342: offline launch-readiness gap report.
 * Never uses model providers, secrets, Cloudflare APIs or live prompts.
 * A file of claimed review flags cannot authorize deployment by itself.
 */
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assistantEvalCases } from "../src/features/assistant/eval-cases";
import { assistantLanguageReviewRows } from "../src/features/assistant/language-review";
import {
  DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS, NANODOLLARS_PER_USD,
  newBudgetMonth, type FrozenModelCostCeiling, worstCaseRequestNanos,
} from "../src/features/assistant/ai-budget";

export type ReadinessBlocker = {
  key: string; status: "HOLD"; reason: string; evidence: string;
};

export function assistantLaunchPreflight() {
  const rows = assistantLanguageReviewRows(assistantEvalCases);
  const languages = ["fi", "en", "sv", "th"] as const;
  const byLocale = Object.fromEntries(languages.map(locale => [
    locale, {total: rows.filter(row => row.locale === locale).length,
      pending: rows.filter(row => row.locale === locale && row.status === "PENDING").length},
  ])) as Record<(typeof languages)[number], {total: number; pending: number}>;

  // Real pricing/model ID are deliberately NOT supplied. This synthetic rate
  // validates only the local arithmetic interface, not any production tariff.
  const fixture: FrozenModelCostCeiling = {
    modelId: "synthetic-unapproved-cost-fixture",
    maxInputTokens: 1000, maxOutputTokens: 200,
    inputUsdPerMillion: 1, outputUsdPerMillion: 4,
    maxAdditionalUsdPerCall: 0,
  };
  const simulatedMaxNanos = worstCaseRequestNanos(fixture);
  const offlineBudget = newBudgetMonth("2026-11");
  const blockers: ReadinessBlocker[] = [
    {key: "independent_language_review", status: "HOLD",
      reason: "80 prompt/intent pairs are pending authenticated reviewer decisions",
      evidence: "Versioned A4 review worksheet and source hashes; AI-generated questions are not human approvals"},
    {key: "approved_provider_model_pricing", status: "HOLD",
      reason: "No externally approved provider/model identity, current prices or approved token ceiling",
      evidence: "The local model price is a synthetic fixture, not a provider contract"},
    {key: "global_atomic_budget", status: "HOLD",
      reason: "A single live globally coordinated Durable Object/provider hard cap has not been verified",
      evidence: "Existing local budget tests cannot establish Cloudflare persistence and concurrency"},
    {key: "server_auth_and_abuse", status: "HOLD",
      reason: "No production auth/CORS/Turnstile and request-limiting proof",
      evidence: "No production endpoint inspection or security test was performed"},
    {key: "privacy_logs_and_retention", status: "HOLD",
      reason: "AI Gateway/provider logging, region, retention, PII handling and lawful basis need review",
      evidence: "Do not send real user prompts or health information to a model for this audit"},
    {key: "live_model_quality", status: "HOLD",
      reason: "No owner-authorized paid dual-model 80-case benchmark or error-rate evaluation",
      evidence: "80 offline gold intents are not measured model accuracy"},
    {key: "release_approval", status: "HOLD",
      reason: "No explicitly approved deployment SHA, owner release consent or verified kill switch",
      evidence: "The audit never grants Cloudflare deployment authority"},
  ];
  const output = {
    schemaVersion: 1,
    scope: "A4.2/A4.3 read-only readiness assessment, not a production gate",
    readiness: "HOLD" as const,
    languageReview: {
      total: rows.length,
      pending: rows.filter(row => row.status === "PENDING").length,
      byLocale, humanApproved: 0,
    },
    offlineBudgetMath: {
      defaultMonthlyAdditionalUsd: DEFAULT_MONTHLY_EXTRA_AI_BUDGET_NANOS / NANODOLLARS_PER_USD,
      syntheticWorstCaseNanos: simulatedMaxNanos,
      fixtureOnly: true,
      newLedgerDisabled: offlineBudget.disabled,
      productionHardCapVerified: false,
    },
    blockers,
    providerCalls: 0, modelResponses: 0, actualModelAccuracy: null,
    productionCredentialsRead: false, cloudflareChanged: false,
    releaseAuthorized: false, paidCallsAuthorized: false,
    autoMerge: false, autoDeploy: false,
  };
  if (rows.length !== 80 || languages.some(l => byLocale[l].total !== 20 ||
    byLocale[l].pending !== 20) || blockers.length < 7) {
    throw new Error("A4 readiness input changed; independent human review required");
  }
  return output;
}

export function verifyReadinessRevision(root: string, expectedSha: string | undefined): string {
  if (expectedSha === undefined) return "";
  if (!/^[a-f0-9]{40}$/.test(expectedSha)) throw new Error("Invalid A4 audit GITHUB_SHA");
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  if (head !== expectedSha) throw new Error("A4 audit GITHUB_SHA differs from checkout HEAD");
  const changes = execFileSync("git", ["diff", "--name-only", "HEAD", "--"],
    { cwd: root, encoding: "utf8" });
  if (changes.trim()) throw new Error("A4 audit checkout has tracked changes");
  return head;
}

export function readinessMarkdown(data: ReturnType<typeof assistantLaunchPreflight>, testedSha = "") {
  const lines = [
    "# Recipavo Keittiöapuri A4 – käyttöönoton HOLD-auditointi",
    "", "Read-only. Ei mallikutsuja, hyväksyttyä mallia, maksua tai julkaisulupaa.",
    "", "Tila: " + data.readiness,
    "Tarkistettu Git-revisio: " + (testedSha || "ei varmennettu"),
    "Kielikatselmoinnit: " + data.languageReview.pending + "/80 PENDING",
    "Offline-budjettimallin oletusraja: " + data.offlineBudgetMath.defaultMonthlyAdditionalUsd + " USD/UTC-kk",
    "Tuotannon atominen hard cap: NOT VERIFIED",
    "", "| Portti | Tila | Perustelu |", "| --- | --- | --- |",
  ];
  for (const row of data.blockers) {
    lines.push("| " + row.key + " | " + row.status + " | " + row.reason + " |");
  }
  lines.push("", "Käyttäjän oikeaa kysymystä, henkilötietoja tai salaisuuksia ei luettu.",
    "Jatkossa tarvitaan erillinen riippumaton katselmointi ja omistajan päätös.", "");
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
  const dir = path.join(root, "tmp/assistant-launch-preflight");
  const testedSha = verifyReadinessRevision(root, process.env.GITHUB_SHA);
  const data = assistantLaunchPreflight();
  await mkdir(dir, {recursive: true});
  await writeFile(path.join(dir, "current.json"),
    JSON.stringify({...data, testedSha}, null, 2) + "\n");
  await writeFile(path.join(dir, "current.md"), readinessMarkdown(data, testedSha));
  console.log(JSON.stringify({readiness: data.readiness, pending: data.languageReview.pending,
    blockers: data.blockers.length, providerCalls: data.providerCalls}));
}
