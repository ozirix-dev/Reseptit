import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { TranslationAuditResult } from "./translation-audit";

type Recipe = TranslationAuditResult["publishedSources"][number];
export const semanticEvidencePath = "meta/kaannokset/codex-review-evidence.json";
const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const semanticEvidenceSchema = z.record(
  z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*:(en|sv|th)$/),
  z.object({
    source_hash: digest,
    translation_hash: digest,
    reviewed_at: z.iso.date(),
    reference: z.string().trim().min(1),
    correction_pr: z.number().int().positive().optional(),
    outcome: z.enum(["pass", "human-required"]),
    findings: z.array(z.object({
      severity: z.enum(["P0", "P1", "P2", "P3"]),
      status: z.enum(["open", "fixed"]),
      summary: z.string().trim().min(1),
    }).strict()),
  }).strict(),
);
export type SemanticEvidence = z.infer<typeof semanticEvidenceSchema>;
export type SemanticStatus = "NOT REVIEWED" | "REVIEW CURRENT" | "REVIEW STALE" | "BLOCKED" | "HUMAN REVIEW REQUIRED";

export function semanticHash({ data, content }: Pick<Recipe, "data" | "content">): string {
  // The schema provides a stable property order. Preserve Markdown structure and
  // meaning-bearing whitespace, including hard line breaks and list indentation.
  const { status, translation_languages, translation_status, source_language, source_recipe, translation_of, image, ...fields } = data;
  return createHash("sha256").update(JSON.stringify({
    ...fields,
    imageAlt: image?.alt,
    content: content.replaceAll("\r\n", "\n").trimEnd(),
  })).digest("hex");
}

export async function loadSemanticEvidence(root: string): Promise<SemanticEvidence> {
  return semanticEvidenceSchema.parse(JSON.parse(await readFile(path.join(root, semanticEvidencePath), "utf8")));
}

export function hasOpenCriticalFinding(proof?: SemanticEvidence[string]): boolean {
  return proof?.findings.some((finding) => finding.status === "open" && (finding.severity === "P0" || finding.severity === "P1")) ?? false;
}

export function semanticStatus(sourceHash: string, targetHash: string | null, automatedPass: boolean, proof?: SemanticEvidence[string]): SemanticStatus {
  if (!automatedPass) return "BLOCKED";
  if (!proof) return "NOT REVIEWED";
  if (proof.source_hash !== sourceHash || proof.translation_hash !== targetHash) return "REVIEW STALE";
  if (proof.outcome === "human-required") return "HUMAN REVIEW REQUIRED";
  return hasOpenCriticalFinding(proof) ? "BLOCKED" : "REVIEW CURRENT";
}

export function changedSemanticReviewErrors(
  audit: TranslationAuditResult,
  changed: ReadonlySet<string>,
  evidence: SemanticEvidence,
): string[] {
  const sources = new Map(audit.publishedSources.map((recipe) => [recipe.data.recipe_id, recipe]));
  return audit.publishedTranslations.flatMap((target) => {
    const source = sources.get(target.data.recipe_id);
    if (!source || (!changed.has(source.path) && !changed.has(target.path))) return [];
    const key = `${target.data.recipe_id}:${target.data.language}`;
    // Existing structural validation runs first in validate-changed-content.
    const status = semanticStatus(semanticHash(source), semanticHash(target), true, evidence[key]);
    return status === "REVIEW CURRENT" ? [] : [`${key}: ${status}`];
  });
}


export function preparationRegressionErrors({ data, content }: Pick<Recipe, "data" | "content">): string[] {
  const steps = content.split(/\r?\n/).filter((line) => /^\s*\d+[.)]\s/.test(line));
  const issues: string[] = [];
  if (data.recipe_id === "bouillabaisse" && data.language === "th") {
    if (steps.some((step) => /ใส่กุ้ง[^.\n]*ผัด/.test(step))) issues.push("cook the shrimp in the broth");
  }
  if (data.recipe_id === "hyderabadi-kanabiryani" && data.language === "th") {
    if (steps.some((step) => /(?:ขยี้|บดข้าว)/.test(step))) issues.push("fluff the rice without crushing it");
    const marinade = steps.find((step) => step.includes("โยเกิร์ต")) ?? "";
    const layers = steps.find((step) => /หญ้าฝรั่น/.test(step)) ?? "";
    if (!/(?:เมล็ดผักชี|ลูกผักชี).*(?:ป่น|บด)/.test(marinade) || !/ผักชีสด|ใบผักชี/.test(layers)) {
      issues.push("distinguish ground coriander seed in the marinade from fresh coriander in the layers");
    }
  }
  if (data.recipe_id === "kantonilainen-hoyrytetty-kala") {
    if (data.language === "sv" && steps.some((step) => /värmetålig\s+(?:ugns)?plåt/i.test(step))) {
      issues.push("use a heatproof plate for steaming");
    }
    const noSmoke = {
      fi: /(?:älä|ei saa|savuttamatta)[^.]*savu|savuttamatta/i,
      en: /(?:not|without|before|avoid|never)[^.]*smok/i,
      sv: /(?:inte|utan|innan|undvik)[^.]*ryk/i,
      th: /(?:ไม่|อย่า|ก่อน)[^.]*ควัน/,
    };
    if (!steps.some((step) => noSmoke[data.language].test(step))) issues.push("retain the warning against heating oil until it smokes");
  }
  return issues;
}
