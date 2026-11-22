/**
 * #369: intake of existing written FI recipe reviews, not independent approval.
 * No changes to the canonical review files or translation evidence.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyWrittenApproval, PILOT_IDS } from "./fi-approved-source-pilot";
import { readEvidenceEntries } from "./translation-derived-evidence-cli";

export const verifiedPilotIds = [...PILOT_IDS].sort();
const validId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type WrittenReview = {
  schema_version?: number;
  recipe_id?: string;
  source_path?: string;
  source_sha256?: string;
  decision?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  nutrition_evidence?: string;
  checks?: Record<string, { status?: string; notes?: string }>;
};

export type IntakeRow = {
  recipe_id: string;
  source_path: string | null;
  source_sha256: string | null;
  written_review_path: string;
  written_review_present: boolean;
  written_review_current: boolean;
  written_decision: string | null;
  reviewer_attribution: "AI_OR_CODEX" | "UNVERIFIED";
  reviewer_label: string | null;
  reviewed_at: string | null;
  status: "WRITTEN_AI_REVIEW_CURRENT" | "WRITTEN_REVIEW_UNVERIFIED" | "REVIEW_STALE_OR_INCOMPLETE" | "REVIEW_MISSING";
  issues: string[];
  independent_human_approval: false;
  source_quality_approved: false;
  publication_authorized: false;
};

async function readJsonOrMissing(file: string): Promise<WrittenReview | null> {
  try {
    const raw = await readFile(file, "utf8");
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error("Review must be a JSON object: " + file);
    return value as WrittenReview;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function intakeWrittenFiReviews(root: string, ids: readonly string[]) {
  const ordered = [...new Set(ids)].sort();
  if (ordered.length !== ids.length || ordered.some(id => !validId.test(id)))
    throw Error("Duplicate or unsafe recipe IDs");
  const entries = await readEvidenceEntries(root, ordered);
  const rows: IntakeRow[] = [];
  for (const entry of entries) {
    const source = entry.source;
    const reviewPath = "docs/reviews/new-recipes/" + entry.id + ".json";
    const review = await readJsonOrMissing(path.join(root, reviewPath));
    const sourcePath = source?.path ?? null;
    const raw = sourcePath ? await readFile(path.join(root, sourcePath), "utf8") : null;
    const currentHash = raw === null ? null : createHash("sha256").update(raw).digest("hex");
    const attribution = review?.reviewed_by ?? "";
    const isAi = /\b(?:AI|Codex|GPT(?:-\d+)?)\b/i.test(attribution);
    const errors = review && raw !== null && sourcePath !== null
      ? verifyWrittenApproval(entry.id, sourcePath, raw, review).errors
      : [source === null ? "FI published source missing" : "Written review record missing"];
    const current = errors.length === 0;
    const status: IntakeRow["status"] = !review ? "REVIEW_MISSING"
      : !current ? "REVIEW_STALE_OR_INCOMPLETE"
      : isAi ? "WRITTEN_AI_REVIEW_CURRENT" : "WRITTEN_REVIEW_UNVERIFIED";
    rows.push({
      recipe_id: entry.id, source_path: sourcePath, source_sha256: currentHash,
      written_review_path: reviewPath, written_review_present: Boolean(review),
      written_review_current: current, written_decision: review?.decision ?? null,
      reviewer_attribution: isAi ? "AI_OR_CODEX" : "UNVERIFIED",
      reviewer_label: attribution || null, reviewed_at: review?.reviewed_at ?? null,
      status, issues: errors,
      independent_human_approval: false, source_quality_approved: false,
      publication_authorized: false,
    });
  }
  return {
    schemaVersion: 1,
    scope: "Existing written FI review intake; no new independent sign-off",
    checked: rows.length,
    counts: {
      written_ai_current: rows.filter(r => r.status === "WRITTEN_AI_REVIEW_CURRENT").length,
      written_unverified: rows.filter(r => r.status === "WRITTEN_REVIEW_UNVERIFIED").length,
      stale_or_incomplete: rows.filter(r => r.status === "REVIEW_STALE_OR_INCOMPLETE").length,
      review_missing: rows.filter(r => r.status === "REVIEW_MISSING").length,
      human_approved: 0,
    },
    rows,
    release_authorized: false, auto_merge: false, auto_publish: false,
    writes_review_evidence: false,
  };
}

export function writtenIntakeMarkdown(report: Awaited<ReturnType<typeof intakeWrittenFiReviews>>) {
  const lines = [
    "# FI written-review intake (#369)", "",
    "A SHA-current AI/Codex editorial note is NOT independent human approval.",
    "No GK, source-quality, translation or publication permission is granted.",
    "",
    "| Recipe ID | Written review | FI SHA current | Reviewer attribution |",
    "| --- | --- | --- | --- |",
  ];
  for (const row of report.rows) {
    lines.push("| \`" + row.recipe_id + "\` | " + row.status + " | "
      + (row.written_review_current ? "YES" : "NO") + " | "
      + row.reviewer_attribution + " |");
    for (const issue of row.issues) lines.push("- \`" + row.recipe_id + "\`: " + issue);
  }
  lines.push("", "Reviewer names and dates are historic file metadata, not authenticated reviewer identities.", "");
  return lines.join("\n");
}
