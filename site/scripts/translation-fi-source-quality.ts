/** Independent, source-bound FI cookability decision for translation batch triage.
 * An automated heuristic cannot grant a PASS. This record is an externally
 * reviewed assertion, not a claim that this module verifies culinary truth.
 */
import { z } from "zod";
import { semanticHash } from "./translation-semantic-review";
import type { TranslationAuditResult } from "./translation-audit";

type Recipe = TranslationAuditResult["publishedSources"][number];
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const check = z.object({
  status: z.enum(["pass", "hold"]),
  reference: z.string().trim().min(3),
}).strict();

export const fiSourceQualitySchema = z.record(
  z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  z.object({
    source_hash: digest,
    decision: z.enum(["pass", "hold"]),
    reviewed_at: z.iso.date(),
    reviewed_by: z.string().trim().min(3),
    reference: z.string().trim().min(3),
    checks: z.object({
      ingredients: check,
      method: check,
      food_safety: check,
      servings_and_time: check,
      nutrition: check,
      glycemic: z.object({
        status: z.enum(["pass", "hold", "unavailable"]),
        reference: z.string().trim().min(3),
      }).strict(),
    }).strict(),
    findings: z.array(z.object({
      severity: z.enum(["P0", "P1", "P2", "P3"]),
      status: z.enum(["open", "resolved"]),
      summary: z.string().trim().min(3),
    }).strict()),
  }).strict(),
);
export type FiSourceQualityEvidence = z.infer<typeof fiSourceQualitySchema>;

export function fiSourceQualityDecision(
  source: Recipe,
  proof: FiSourceQualityEvidence[string] | undefined,
): { accepted: boolean; reason: string } {
  if (!proof) return { accepted: false, reason: "FI quality evidence missing" };
  if (proof.source_hash !== semanticHash(source))
    return { accepted: false, reason: "FI quality evidence stale: source hash changed" };
  if (proof.decision !== "pass")
    return { accepted: false, reason: "FI independent source quality HOLD" };
  if (Object.entries(proof.checks).some(([key, value]) =>
    key !== "glycemic" && value.status !== "pass"))
    return { accepted: false, reason: "FI mandatory source quality check incomplete" };
  if (proof.checks.glycemic.status === "hold")
    return { accepted: false, reason: "FI glycemic source quality HOLD" };
  if (proof.findings.some(f => f.status === "open" &&
    (f.severity === "P0" || f.severity === "P1")))
    return { accepted: false, reason: "FI unresolved P0/P1 source quality finding" };
  return { accepted: true, reason: "FI independent source quality evidence current" };
}
