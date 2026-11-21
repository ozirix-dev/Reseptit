/**
 * #369: read-only pilot against five existing written FI approval records.
 * AI/Codex editorial approval is NOT independent human approval.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { evaluateBatchEntry, type BatchEntry, type Locale } from "./translation-batch-partition";
import { fiSourceQualityDecision, fiSourceQualitySchema, type FiSourceQualityEvidence } from "./translation-fi-source-quality";
import { loadSemanticEvidence, semanticHash, semanticStatus } from "./translation-semantic-review";
import type { TranslationAuditResult } from "./translation-audit";

type Recipe = TranslationAuditResult["publishedSources"][number];
const ROOT = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const PILOT_IDS = [
  "ananas-kanelijuoma-sitruunalla",
  "fetavaahto-kasvistikuilla",
  "rapeat-juustonaksut",
  "taytetyt-kananmunat-yrteilla",
  "tonnikalatayte-kurkkukupeissa",
] as const;
const locales = ["en", "sv", "th"] as const;
const required = ["ingredients", "method", "food_safety", "servings_and_time", "nutrition"] as const;

export function verifyWrittenApproval(id: string, relativePath: string, sourceText: string, review: any) {
  const digest = createHash("sha256").update(sourceText, "utf8").digest("hex");
  const errors: string[] = [];
  if (review?.schema_version !== 1 || review?.decision !== "approved") errors.push("Review decision is not approved");
  if (review?.recipe_id !== id || review?.source_path !== relativePath) errors.push("Review source identity mismatch");
  if (review?.source_sha256 !== digest) errors.push("FI source SHA-256 differs from written review");
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(review?.reviewed_at ?? "")) errors.push("Review date missing");
  if (!String(review?.reviewed_by ?? "").trim()) errors.push("Reviewer attribution missing");
  if (!String(review?.nutrition_evidence ?? "").trim()) errors.push("Nutrition evidence reference missing");
  for (const key of required) {
    if (review?.checks?.[key]?.status !== "pass" || !String(review?.checks?.[key]?.notes ?? "").trim()) {
      errors.push(key + ": written PASS with explanatory notes required");
    }
  }
  if (!["pass", "unavailable"].includes(review?.checks?.glycemic?.status) ||
      !String(review?.checks?.glycemic?.notes ?? "").trim()) errors.push("Glycemic source evidence missing or HOLD");
  return {current: errors.length === 0, sourceSha256: digest, errors};
}

async function parseRecipe(file: string): Promise<Recipe> {
  const raw = await readFile(path.join(ROOT, file), "utf8");
  const parsed = parseMarkdown(raw);
  assert.ok(parsed, "Recipe has no readable frontmatter: " + file);
  return {path: file, data: recipeFrontmatterSchema.parse(parsed.data), content: parsed.content};
}

function qualityFromReview(id: string, recipe: Recipe, review: any, reviewFile: string): FiSourceQualityEvidence {
  const checks = Object.fromEntries([...required, "glycemic"].map(key => [
    key,
    {status: review.checks[key].status === "unavailable" ? "unavailable" : "pass",
      reference: reviewFile + "#" + key},
  ]));
  return fiSourceQualitySchema.parse({
    [id]: {
      source_hash: semanticHash(recipe),
      decision: "pass",
      reviewed_at: review.reviewed_at,
      reviewed_by: review.reviewed_by,
      reference: reviewFile,
      checks, findings: [],
    },
  });
}

export async function runFiveSourcePilot() {
  const evidence = await loadSemanticEvidence(ROOT);
  const cases = [];
  for (const id of PILOT_IDS) {
    const sourceFile = "reseptit/valipalat/" + id + ".md";
    const reviewFile = "docs/reviews/new-recipes/" + id + ".json";
    const sourceText = await readFile(path.join(ROOT, sourceFile), "utf8");
    const review = JSON.parse(await readFile(path.join(ROOT, reviewFile), "utf8"));
    const written = verifyWrittenApproval(id, sourceFile, sourceText, review);
    const source = await parseRecipe(sourceFile);
    assert.equal(source.data.recipe_id, id);
    assert.equal(source.data.language, "fi");
    assert.equal(source.data.status, "published");
    const quality = written.current ? qualityFromReview(id, source, review, reviewFile) : {};
    const gate = fiSourceQualityDecision(source, quality[id]);
    const targets: BatchEntry["targets"] = {};
    const hashes: BatchEntry["hashes"] = {fi: semanticHash(source)};
    const localeResults: Record<string, string> = {};
    for (const locale of locales) {
      const filename = "kaannokset/" + locale + "/valipalat/" + id + ".md";
      try {
        targets[locale] = await parseRecipe(filename);
        hashes[locale] = semanticHash(targets[locale]!);
        localeResults[locale] = semanticStatus(hashes.fi!, hashes[locale]!, true, evidence[id + ":" + locale]);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        localeResults[locale] = "TRANSLATION MISSING";
      }
    }
    // A documented AI editorial review is not a new human review or automatic
    // authorization to classify the translated recipe as release candidate.
    const entry: BatchEntry = {id, category: "valipalat", source, targets, hashes,
      reviewState: "unreviewed"};
    const triage = evaluateBatchEntry(entry, evidence, quality);
    cases.push({
      recipe_id: id, source_path: sourceFile, review_path: reviewFile,
      reviewed_at: review.reviewed_at, reviewed_by: review.reviewed_by,
      source_sha256: written.sourceSha256, written_approval_current: written.current,
      written_approval_errors: written.errors, source_gate_pass: gate.accepted,
      source_gate_reason: gate.reason, locale_status: localeResults,
      triage_group: triage.group, triage_reasons: triage.reasons,
      independent_human_approval_verified: false, release_authorized: false,
    });
  }
  return {
    schemaVersion: 1, testedSha: process.env.GITHUB_SHA ?? "",
    notice: "Only checks recorded approvals and current source bytes. AI reviews do not become human approvals.",
    cases, counts: {
      checked: cases.length,
      source_bound_approved: cases.filter(x => x.source_gate_pass).length,
      stale_or_blocked: cases.filter(x => !x.source_gate_pass).length,
      human_approved: 0, release_authorized: 0,
    },
    auto_merge: false, auto_publish: false, release_authorized: false,
  };
}
export function pilotMarkdown(result: Awaited<ReturnType<typeof runFiveSourcePilot>>): string {
  const lines = [
    "# Chat 5 – five documented FI source approvals, SHA-checked pilot",
    "",
    "No human approval or release authorization is established by this report.",
    "",
    "Tested SHA: " + (result.testedSha || "not supplied"),
    "",
    "| Recipe | Original approval current | FI source gate | EN / SV / TH |",
    "| --- | --- | --- | --- |",
  ];
  for (const c of result.cases) {
    lines.push("| \`" + c.recipe_id + "\` | " + (c.written_approval_current ? "YES" : "NO") +
      " | " + (c.source_gate_pass ? "PASS" : "HOLD") + " | " +
      locales.map(l => c.locale_status[l]).join(" / ") + " |");
  }
  lines.push("", "All five records were AI/Codex-attributed written reviews; they are not independent human sign-offs.",
    "", "No GK value, recipe source, translation evidence or release permission was changed.", "");
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const output = await runFiveSourcePilot();
    const dir = path.join(ROOT, "tmp/fi-source-approved-pilot");
    await mkdir(dir, {recursive: true});
    await writeFile(path.join(dir, "current.json"), JSON.stringify(output, null, 2) + "\n");
    await writeFile(path.join(dir, "current.md"), pilotMarkdown(output) + "\n");
    process.stdout.write(JSON.stringify(output.counts) + "\n");
    // Fail closed if a previously reviewed file no longer matches the approval.
    if (output.counts.stale_or_blocked) process.exitCode = 1;
  } catch (e) {
    console.error("FI_APPROVED_SOURCE_PILOT_FAILED:", e);
    process.exitCode = 1;
  }
}
