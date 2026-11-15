import { execFileSync } from "node:child_process";
import { hasOpenCriticalFinding, loadSemanticEvidence, semanticHash, semanticStatus, type SemanticEvidence } from "./translation-semantic-review";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { auditTranslations, knownTermErrors, type TranslationAuditResult } from "./translation-audit";

const root = path.resolve(import.meta.dirname, "../..");
export const scopes = ["title", "description", "ingredients", "instructions", "notes", "nutrition", "alt", "tags"] as const;
export type HumanStatus = "NOT REVIEWED" | "AUTOMATED REVIEW ONLY" | "HUMAN REVIEW IN PROGRESS" | "HUMAN REVIEW COMPLETE" | "REVIEW STALE";
export interface ReviewEvidence {
  recipe_id: string; locale: "en" | "sv" | "th"; evidence_id: string;
  source_content_hash: string; translation_content_hash: string;
  reviewed_at: string; scope: string[]; status: "in-progress" | "complete";
  human_attestation: boolean;
}
export const evidenceSchema = z.array(z.object({
  recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), locale: z.enum(["en", "sv", "th"]),
  evidence_id: z.string().trim().min(1), source_content_hash: z.string().regex(/^[a-f0-9]{64}$/),
  translation_content_hash: z.string().regex(/^[a-f0-9]{64}$/), reviewed_at: z.string(),
  scope: z.array(z.enum(scopes)), status: z.enum(["in-progress", "complete"]), human_attestation: z.boolean(),
}).strict());
export const contentHash = (text: string) => createHash("sha256").update(text.replaceAll("\r\n", "\n")).digest("hex");
export function humanStatus(source: string, translation: string | null, evidence?: ReviewEvidence, automatedPass = true): HumanStatus {
  if (!evidence) return translation ? "AUTOMATED REVIEW ONLY" : "NOT REVIEWED";
  if (source !== evidence.source_content_hash || translation !== evidence.translation_content_hash) return "REVIEW STALE";
  const timestamp = Date.parse(evidence.reviewed_at);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(evidence.reviewed_at) && Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === evidence.reviewed_at && timestamp <= Date.now();
  if (!date || !evidence.evidence_id.trim() || !evidence.human_attestation || !scopes.every((scope) => evidence.scope.includes(scope))) return "NOT REVIEWED";
  if (evidence.status === "in-progress") return "HUMAN REVIEW IN PROGRESS";
  return automatedPass && evidence.status === "complete" ? "HUMAN REVIEW COMPLETE" : "REVIEW STALE";
}
export function risks(text: string, locale: string) {
  const reasons = [
    [/lohi|kala|katkarapu|simpuk|äyriäi/i, "fish/shellfish"],
    [/liha|broileri|kana|porsaa|nauda|kalkkuna/i, "meat/raw/cooked"],
    [/muna|maito|kerma|juusto|vehnä|pähkin|soija|seesam/i, "allergens"],
    [/aste|°|kyps|säily|jäähd|raaka/i, "temperature/cooking/storage"],
    [/älä|\bei\b|ilman/i, "negation"],
    [/keto|vhh|hiilihydraa/i, "diet claim"],
    [/null|maun mukaan|tilkka|halutessasi/i, "ambiguous/optional quantity"],
  ] as const;
  const notes = reasons.filter(([pattern]) => pattern.test(text)).map(([, reason]) => reason);
  return { level: locale === "th" || notes.length >= 3 ? "high" : notes.length ? "medium" : "low", reasons: notes };
}
export function buildRegistry(audit: TranslationAuditResult, hashes: Record<string, string>, evidence: ReviewEvidence[], codexEvidence: SemanticEvidence = {}) {
  const keys = evidence.map((e) => `${e.recipe_id}:${e.locale}`);
  if (new Set(keys).size !== keys.length) throw Error("Duplicate review evidence; resolve explicitly");
  const rows = audit.publishedSources.flatMap((source) => (["th", "en", "sv"] as const).flatMap((locale) => {
    const target = audit.publishedTranslations.find((r) => r.data.status === "published" && r.data.recipe_id === source.data.recipe_id && r.data.language === locale);
    if (!target && source.data.translation_status?.[locale] !== "published") return [];
    const pair = audit.rows.find((r) => r.recipe_id === source.data.recipe_id && r.locale === locale);
    const semantic = target ? knownTermErrors(source.data, target.data, locale, target.content) : [];
    const pairErrors = audit.errors.filter((e) => e.startsWith(`${source.data.recipe_id}:${locale}:`) || e.startsWith(`${source.data.recipe_id}:${source.data.language}:`));
    const structural = !!pair && !pairErrors.some((e) => !semantic.some((s) => e.endsWith(s)));
    const sourceHash = hashes[source.path]; const translationHash = target ? hashes[target.path] : null;
    if (!sourceHash || (target && !translationHash)) throw Error("Missing file hash");
    const proof = evidence.find((e) => e.recipe_id === source.data.recipe_id && e.locale === locale);
    const risk = risks(JSON.stringify(source.data) + source.content, locale);
    const codex = codexEvidence[`${source.data.recipe_id}:${locale}`];
    const sourceSemanticHash = semanticHash(source);
    const targetSemanticHash = target ? semanticHash(target) : null;
    return [{ recipe_id: source.data.recipe_id, locale, source_path: source.path, translation_path: target?.path ?? null,
      source_content_hash: sourceHash, translation_content_hash: translationHash,
      structural_status: structural ? "PASS" : "FAIL", automated_semantic_status: !target ? "NOT RUN" : semantic.length ? "FINDINGS" : "KNOWN RULES PASS; NOT GENERAL SEMANTIC PROOF",
      human_review_status: humanStatus(sourceHash, translationHash, proof, structural && !semantic.length),
      source_semantic_hash: sourceSemanticHash, translation_semantic_hash: targetSemanticHash,
      codex_review_status: semanticStatus(sourceSemanticHash, targetSemanticHash, structural && !semantic.length, codex),
      codex_review: codex ?? null, priority_score: risk.reasons.length,
      last_reviewed_at: proof?.reviewed_at ?? null, review_evidence_id: proof?.evidence_id ?? null,
      risk_level: risk.level, notes: [...risk.reasons, ...pairErrors, ...semantic],
    }];
  }));
  for (const key of keys) {
    const matches = rows.filter((row) => `${row.recipe_id}:${row.locale}` === key);
    if (matches.length !== 1) throw Error(`Review evidence must match exactly one registry pair: ${key} (${matches.length} matches)`);
  }
  const order = { th: 0, en: 1, sv: 2 }, priority: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return rows.sort((a, b) => order[a.locale] - order[b.locale] || priority[a.risk_level] - priority[b.risk_level] || a.recipe_id.localeCompare(b.recipe_id));
}
export const escapeHtml = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
export async function loadCurrentReview() {
  const audit = await auditTranslations();
  const files: Record<string, string> = Object.fromEntries(await Promise.all([...audit.publishedSources, ...audit.publishedTranslations].map(async (r) => [r.path, await readFile(path.join(root, r.path), "utf8")] as const)));
  const hashes = Object.fromEntries(Object.entries(files).map(([name, content]) => [name, contentHash(content)]));
  const evidence = evidenceSchema.parse(JSON.parse(await readFile(path.join(root, "meta/kaannokset/human-review-evidence.json"), "utf8")));
  return { audit, files, rows: buildRegistry(audit, hashes, evidence, await loadSemanticEvidence(root)) };
}
type RegistryRow = ReturnType<typeof buildRegistry>[number];

export function reviewSummary(audit: TranslationAuditResult, rows: RegistryRow[], changedPaths = new Set<string>()) {
  const published = [...new Map(rows.filter((row) => row.translation_path)
    .map((row) => [`${row.recipe_id}:${row.locale}`, row])).values()];
  const rate = (count: number, total = published.length) => ({
    count, percent: total ? Math.round(count * 10000 / total) / 100 : 0,
  });
  const severity = (row: RegistryRow) => row.codex_review?.findings.some((f) => f.status === "open" && f.severity === "P0") ? 0
    : hasOpenCriticalFinding(row.codex_review ?? undefined) || row.codex_review_status === "BLOCKED" || row.codex_review_status === "HUMAN REVIEW REQUIRED" ? 1
    : row.codex_review_status === "REVIEW STALE" || changedPaths.has(row.source_path) || changedPaths.has(row.translation_path ?? "") ? 2 : 3;
  const nextIds = [...new Set(rows.filter((row) => row.codex_review_status !== "REVIEW CURRENT")
    .sort((a, b) => severity(a) - severity(b) || b.priority_score - a.priority_score
      || Number(b.locale === "th") - Number(a.locale === "th") || a.recipe_id.localeCompare(b.recipe_id))
    .map((row) => row.recipe_id))].slice(0, 10);
  const sourceCount = new Set(audit.publishedSources.map((entry) => entry.data.recipe_id)).size;
  const expectedPairs = sourceCount * 3;
  const findings = published.flatMap((row) => row.codex_review?.findings ?? []);
  return {
    published_sources: sourceCount,
    published_pairs: rate(published.length, expectedPairs),
    unpublished_or_missing_pairs: rate(expectedPairs - published.length, expectedPairs),
    structure_pass: rate(published.filter((row) => row.structural_status === "PASS").length),
    semantic_current: rate(published.filter((row) => row.codex_review_status === "REVIEW CURRENT").length),
    semantic_stale: rate(published.filter((row) => row.codex_review_status === "REVIEW STALE").length),
    semantic_unreviewed: rate(published.filter((row) => !row.codex_review).length),
    human_complete: rate(published.filter((row) => row.human_review_status === "HUMAN REVIEW COMPLETE").length),
    open_critical_findings: rate(findings.filter((f) => f.status === "open" && (f.severity === "P0" || f.severity === "P1")).length, findings.length),
    semantic_blocked: rate(published.filter((row) => row.codex_review_status === "BLOCKED" || row.codex_review_status === "HUMAN REVIEW REQUIRED").length),
    fixed_findings: rate(published.filter((row) => row.codex_review_status === "REVIEW CURRENT")
      .flatMap((row) => row.codex_review?.findings ?? []).filter((f) => f.status === "fixed").length, findings.length),
    fixed_findings_on_stale_versions: rate(published.filter((row) => row.codex_review_status === "REVIEW STALE")
      .flatMap((row) => row.codex_review?.findings ?? []).filter((f) => f.status === "fixed").length, findings.length),
    next: nextIds.map((id) => ({
      recipe_id: id,
      pairs: rows.filter((row) => row.recipe_id === id).map(({ locale, source_path, translation_path, codex_review_status, codex_review }) =>
        ({ locale, source_path, translation_path, codex_review_status, review_reference: codex_review?.reference ?? null })),
    })),
  };
}

export async function writeReviewPack(output: string, audit: TranslationAuditResult, rows: ReturnType<typeof buildRegistry>, files: Record<string, string>) {
  await mkdir(output, { recursive: true });
  const links: string[] = [];
  for (const row of rows) {
    const name = `${row.recipe_id}.${row.locale}.html`;
    links.push(`<li><a href="${name}">${escapeHtml(row.recipe_id)} / ${row.locale}</a> — ${row.risk_level} — ${row.codex_review_status} / ${row.human_review_status}</li>`);
    const source = audit.publishedSources.find((r) => r.path === row.source_path)!;
    const target = audit.publishedTranslations.find((r) => r.path === row.translation_path);
    const fields = (entry: typeof source | undefined) => entry ? JSON.stringify({ title: entry.data.title, ingredients: entry.data.ingredients, servings: entry.data.servings, nutrition: { net: entry.data.carbs_net_per_serving_g ?? null, total: entry.data.carbs_total_per_serving_g ?? null, protein: entry.data.protein_per_serving_g ?? null, fat: entry.data.fat_per_serving_g ?? null }, image_alt: entry.data.image?.alt, tags: entry.data.tags }, null, 2) + "\n\n" + entry.content : "PUBLISHED TRANSLATION MISSING";
    await writeFile(path.join(output, name), `<!doctype html><html lang="fi"><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width"><title>${escapeHtml(row.recipe_id)} – toimituksellinen tarkistus</title><style>body{font:16px system-ui;margin:2rem}main{display:grid;grid-template-columns:1fr 1fr;gap:2rem}pre{white-space:pre-wrap;overflow-wrap:anywhere}section{min-width:0}@media(max-width:700px){main{grid-template-columns:1fr}}</style><a href="index.html">Rekisteri</a><h1>${escapeHtml(row.recipe_id)} / ${row.locale}</h1><p>${escapeHtml(row.human_review_status)}</p><pre>${escapeHtml(JSON.stringify(row, null, 2))}</pre><main><section lang="fi"><h2>Suomenkielinen lähde</h2><pre>${escapeHtml(fields(source))}</pre><details><summary>Koko lähdetiedosto</summary><pre>${escapeHtml(files[row.source_path])}</pre></details></section><section lang="${row.locale}"><h2>Käännös</h2><pre>${escapeHtml(fields(target))}</pre></section></main></html>`);
  }
  await writeFile(path.join(output, "index.html"), `<!doctype html><html lang="fi"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Käännösten toimituksellinen tarkistus</title><h1>Käännösten tarkistusjono</h1><p>Paikallinen aineisto. Seuraava riskierä on listan alussa. Codexin ja ihmisen tarkistukset näkyvät erillisinä tiloina.</p><ol>${links.join("")}</ol></html>`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { audit, files, rows } = await loadCurrentReview();
  const output = path.join(root, "tmp/translation-review");
  const baseArgument = process.argv.find((arg) => arg.startsWith("--changed-from="));
  const changedPaths = baseArgument
    ? new Set(execFileSync("git", ["diff", "--name-only", "--end-of-options", baseArgument.slice("--changed-from=".length), "--", "reseptit", "kaannokset"], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/))
    : new Set<string>();
  const summary = reviewSummary(audit, rows, changedPaths);
  if (!process.argv.includes("--summary")) {
    const queue = new Map(summary.next.map((recipe, index) => [recipe.recipe_id, index]));
    rows.sort((a, b) => (queue.get(a.recipe_id) ?? Infinity) - (queue.get(b.recipe_id) ?? Infinity));
    await writeReviewPack(output, audit, rows, files);
    await writeFile(path.join(output, "registry.json"), JSON.stringify(rows, null, 2) + "\n");
  }
  console.log(JSON.stringify({ ...summary, errors: audit.errors }, null, 2));
  if (audit.errors.length) process.exitCode = 1;
}
