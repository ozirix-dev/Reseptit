/**
 * Fail-closed triage for FI -> EN/SV/TH recipe batches.
 * Generates a release-candidate shortlist, NEVER publishes or changes files.
 * Existing strict audits, GK seals, route checks and HEAD CI are still required.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { knownTermErrors, sourceCategories } from "./translation-audit";
import {
  semanticHash, semanticEvidenceSchema, semanticStatus, preparationRegressionErrors,
  type SemanticEvidence,
} from "./translation-semantic-review";
import type { TranslationAuditResult } from "./translation-audit";

type Recipe = TranslationAuditResult["publishedSources"][number];
export type Locale = "en" | "sv" | "th";
export type BatchGroup = "source-hold" | "needs-review" | "candidate";
export type BatchEntry = {
  id: string; category: string; source: Recipe | null;
  targets: Partial<Record<Locale, Recipe>>;
  reviewState: string;
  hashes: Record<string, string | undefined>;
};
export type BatchDecision = { recipe_id: string; group: BatchGroup; reasons: string[]; pairs: number };
const locales = ["en", "sv", "th"] as const;
const macros = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;
const validDigest = /^[a-f0-9]{64}$/;

function equal(a: unknown, b: unknown): boolean { return JSON.stringify(a) === JSON.stringify(b); }
function normUnit(unit: string, locale: Locale): string {
  const localized = { rkl: { en: "tbsp", sv: "msk", th: "ช้อนโต๊ะ" },
    tl: { en: "tsp", sv: "tsk", th: "ช้อนชา" }, kpl: { en: "", sv: "", th: "" } };
  return localized[unit as keyof typeof localized]?.[locale] ?? unit;
}
function steps(content: string): string[] {
  const m = /^##\s+(?:Valmistus|Instructions|Tillagning|วิธีทำ)\s*$/m.exec(content);
  if (!m) return [];
  const remainder = content.slice(m.index + m[0].length);
  const end = remainder.search(/^##\s+/m);
  const body = remainder.slice(0, end < 0 ? undefined : end);
  return body.split(/\r?\n/).filter(x => /^\d+[.)]\s/.test(x.trim()));
}
function numbers(text: string): number[] {
  return [...text.matchAll(/(?<![\p{L}\d])\d+(?:[.,]\d+)?/gu)]
    .map(m => Number(m[0].replace(",", ".")));
}
function structuralErrors(source: Recipe, target: Recipe, locale: Locale): string[] {
  const s = source.data, t = target.data, issues: string[] = [];
  if (s.status !== "published" || s.language !== "fi") issues.push("unpublished or non-FI source");
  if (t.language !== locale || t.recipe_id !== s.recipe_id || t.translation_of !== s.recipe_id
    || t.source_language !== "fi" || t.source_recipe !== source.path) issues.push("wrong source/locale linkage");
  if (t.status !== "draft" && t.status !== "published") issues.push("invalid translation status");
  for (const key of ["servings", "time_total_min", "url_slug", "category", "diet_class",
    "main_ingredient", "cooking_method", ...macros] as const) {
    if (!equal(s[key], t[key])) issues.push("metadata mismatch: " + key);
  }
  if (!equal(s.image && { ...s.image, alt: "" }, t.image && { ...t.image, alt: "" }))
    issues.push("image path/dimensions changed");
  if (s.ingredients.length !== t.ingredients.length) issues.push("ingredient count mismatch");
  s.ingredients.forEach((ing, i) => {
    const translated = t.ingredients[i];
    if (!translated) return;
    if (translated.amount !== ing.amount || translated.unit !== normUnit(ing.unit, locale))
      issues.push("ingredient " + (i + 1) + " amount/unit mismatch");
    if (Boolean(ing.note) !== Boolean(translated.note)) issues.push("ingredient " + (i + 1) + " note missing");
  });
  const fiSteps = steps(source.content), translatedSteps = steps(target.content);
  if (!fiSteps.length || translatedSteps.length !== fiSteps.length) issues.push("instruction steps mismatch");
  const remaining = numbers(translatedSteps.join("\n"));
  for (const number of numbers(fiSteps.join("\n"))) {
    const index = remaining.indexOf(number);
    if (index < 0) issues.push("missing preparation number " + number);
    else remaining.splice(index, 1);
  }
  issues.push(...knownTermErrors(s, t, locale, target.content));
  issues.push(...preparationRegressionErrors(target));
  return issues;
}

/** A candidate is only eligible for downstream release gates, not approved for deployment. */
export function evaluateBatchEntry(entry: BatchEntry, evidence: SemanticEvidence): BatchDecision {
  const reasons: string[] = [];
  if (entry.reviewState === "source-hold") return { recipe_id: entry.id, group: "source-hold",
    reasons: ["FI source HOLD; must be corrected and independently re-reviewed"], pairs: 0 };
  if (!entry.source || entry.source.data.status !== "published")
    return { recipe_id: entry.id, group: "source-hold", reasons: ["missing or unpublished FI source"], pairs: 0 };
  if (entry.reviewState !== "ai-compared-draft")
    reasons.push("AI source-to-target comparison not documented");
  const fiHash = semanticHash(entry.source);
  if (!validDigest.test(entry.hashes.fi ?? "") || fiHash !== entry.hashes.fi)
    reasons.push("FI source hash stale or missing");
  let verified = 0;
  for (const locale of locales) {
    const t = entry.targets[locale];
    if (!t) { reasons.push(locale + ": translation missing"); continue; }
    const errs = structuralErrors(entry.source, t, locale);
    for (const e of errs) reasons.push(locale + ": " + e);
    const h = semanticHash(t);
    if (!validDigest.test(entry.hashes[locale] ?? "") || entry.hashes[locale] !== h)
      reasons.push(locale + ": draft hash stale or missing");
    const proof = evidence[entry.id + ":" + locale];
    const status = semanticStatus(fiHash, h, errs.length === 0, proof);
    if (status !== "REVIEW CURRENT") reasons.push(locale + ": " + status);
    else if (entry.hashes.fi === fiHash && entry.hashes[locale] === h) verified++;
  }
  return { recipe_id: entry.id, group: reasons.length ? "needs-review" : "candidate",
    reasons: [...new Set(reasons)], pairs: verified };
}

function requested(arg: string): string | null { return process.argv.find(a => a.startsWith(arg + "="))?.slice(arg.length + 1) ?? null; }
async function readRecipe(root: string, rel: string): Promise<Recipe | null> {
  try {
    const parsed = parseMarkdown(await readFile(path.join(root, rel), "utf8"));
    if (!parsed) return null;
    return { path: rel, data: recipeFrontmatterSchema.parse(parsed.data), content: parsed.content };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

export async function partitionFromLedger(root: string, raw: unknown, evidenceRaw: unknown) {
  const ledger = raw as { recipes?: Record<string, { fi?: string; en?: string; sv?: string; th?: string;
    review_state?: string; publish_authorized?: boolean }> };
  if (!ledger || typeof ledger !== "object" || !ledger.recipes
    || typeof ledger.recipes !== "object" || Array.isArray(ledger.recipes)) throw Error("Invalid batch ledger");
  const evidence = semanticEvidenceSchema.parse(evidenceRaw);
  const decisions: BatchDecision[] = [];
  for (const [id, record] of Object.entries(ledger.recipes).sort(([a],[b]) => a.localeCompare(b))) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !record || typeof record !== "object") throw Error("Malformed recipe entry: " + id);
    const matches: { category: string; source: Recipe }[] = [];
    for (const category of sourceCategories) {
      const source = await readRecipe(root, "reseptit/" + category + "/" + id + ".md");
      if (source) matches.push({ category, source });
    }
    if (matches.length !== 1) {
      decisions.push({ recipe_id: id, group: "source-hold",
        reasons: ["FI source missing, duplicated or unparseable across categories"], pairs: 0 }); continue;
    }
    const { category, source } = matches[0]!;
    const targets: Partial<Record<Locale, Recipe>> = {};
    for (const locale of locales) {
      const t = await readRecipe(root, "kaannokset/" + locale + "/" + category + "/" + id + ".md");
      if (t) targets[locale] = t;
    }
    decisions.push(evaluateBatchEntry({ id, category, source, targets,
      reviewState: record.review_state ?? "unreviewed", hashes: record }, evidence));
  }
  return {
    version: 1, semantics: "candidate is an input to, not a substitute for, release CI/GK/route gates",
    total: decisions.length, candidate: decisions.filter(x => x.group === "candidate"),
    needs_review: decisions.filter(x => x.group === "needs-review"),
    source_hold: decisions.filter(x => x.group === "source-hold"),
    requires_human_review_if_safety_unclear: true,
    auto_publish: false, auto_merge: false,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(requested("--root") ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."));
  const ledgerFile = requested("--ledger");
  if (!ledgerFile) {
    console.error("Usage: tsx scripts/translation-batch-partition.ts --ledger=path-to-ledger.json [--evidence=path] [--out=path]");
    process.exitCode = 2;
  } else {
    try {
      const input = JSON.parse(await readFile(path.resolve(root, ledgerFile), "utf8"));
      const proofs = JSON.parse(await readFile(path.resolve(root, requested("--evidence") ??
        "meta/kaannokset/codex-review-evidence.json"), "utf8"));
      const result = await partitionFromLedger(root, input, proofs);
      const output = JSON.stringify(result, null, 2) + "\n";
      const destination = requested("--out");
      if (destination) await writeFile(path.resolve(root, destination), output, "utf8");
      else process.stdout.write(output);
    } catch (error) {
      console.error("TRANSLATION_PARTITION_BLOCKED: " + String(error));
      process.exitCode = 1;
    }
  }
}
