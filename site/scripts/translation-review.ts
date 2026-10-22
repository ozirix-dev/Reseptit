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
export function buildRegistry(audit: TranslationAuditResult, hashes: Record<string, string>, evidence: ReviewEvidence[]) {
  const keys = evidence.map((e) => `${e.recipe_id}:${e.locale}`);
  if (new Set(keys).size !== keys.length) throw Error("Duplicate review evidence; resolve explicitly");
  const rows = audit.publishedSources.flatMap((source) => (["th", "en", "sv"] as const).flatMap((locale) => {
    const target = audit.publishedTranslations.find((r) => r.data.status === "published" && r.data.recipe_id === source.data.recipe_id && r.data.language === locale);
    if (!target && source.data.translation_status?.[locale] !== "published") return [];
    const pair = audit.rows.find((r) => r.recipe_id === source.data.recipe_id && r.locale === locale);
    const semantic = target ? knownTermErrors(source.data, target.data, locale, target.content) : [];
    const pairErrors = audit.errors.filter((e) => e.startsWith(`${source.data.recipe_id}:${locale}:`) || e.startsWith(`${source.data.recipe_id}:fi:`));
    const structural = !!pair && !pairErrors.some((e) => !semantic.some((s) => e.endsWith(s)));
    const sourceHash = hashes[source.path]; const translationHash = target ? hashes[target.path] : null;
    if (!sourceHash || (target && !translationHash)) throw Error("Missing file hash");
    const proof = evidence.find((e) => e.recipe_id === source.data.recipe_id && e.locale === locale);
    const risk = risks(JSON.stringify(source.data) + source.content, locale);
    return [{ recipe_id: source.data.recipe_id, locale, source_path: source.path, translation_path: target?.path ?? null,
      source_content_hash: sourceHash, translation_content_hash: translationHash,
      structural_status: structural ? "PASS" : "FAIL", automated_semantic_status: !target ? "NOT RUN" : semantic.length ? "FINDINGS" : "KNOWN RULES PASS; NOT GENERAL SEMANTIC PROOF",
      human_review_status: humanStatus(sourceHash, translationHash, proof, structural && !semantic.length),
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
  return { audit, files, rows: buildRegistry(audit, hashes, evidence) };
}
export async function writeReviewPack(output: string, audit: TranslationAuditResult, rows: ReturnType<typeof buildRegistry>, files: Record<string, string>) {
  await mkdir(output, { recursive: true });
  const links: string[] = [];
  for (const row of rows) {
    const name = `${row.recipe_id}.${row.locale}.html`;
    links.push(`<li><a href="${name}">${escapeHtml(row.recipe_id)} / ${row.locale}</a> — ${row.risk_level} — ${row.human_review_status}</li>`);
    const source = audit.publishedSources.find((r) => r.path === row.source_path)!;
    const target = audit.publishedTranslations.find((r) => r.path === row.translation_path);
    const fields = (entry: typeof source | undefined) => entry ? JSON.stringify({ title: entry.data.title, ingredients: entry.data.ingredients, servings: entry.data.servings, nutrition: { net: entry.data.carbs_net_per_serving_g ?? null, total: entry.data.carbs_total_per_serving_g ?? null, protein: entry.data.protein_per_serving_g ?? null, fat: entry.data.fat_per_serving_g ?? null }, image_alt: entry.data.image?.alt, tags: entry.data.tags }, null, 2) + "\n\n" + entry.content : "PUBLISHED TRANSLATION MISSING";
    await writeFile(path.join(output, name), `<!doctype html><html lang="fi"><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width"><title>${escapeHtml(row.recipe_id)} – toimituksellinen tarkistus</title><style>body{font:16px system-ui;margin:2rem}main{display:grid;grid-template-columns:1fr 1fr;gap:2rem}pre{white-space:pre-wrap;overflow-wrap:anywhere}section{min-width:0}@media(max-width:700px){main{grid-template-columns:1fr}}</style><a href="index.html">Rekisteri</a><h1>${escapeHtml(row.recipe_id)} / ${row.locale}</h1><p>${escapeHtml(row.human_review_status)}</p><pre>${escapeHtml(JSON.stringify(row, null, 2))}</pre><main><section lang="fi"><h2>Suomenkielinen lähde</h2><pre>${escapeHtml(fields(source))}</pre><details><summary>Koko lähdetiedosto</summary><pre>${escapeHtml(files[row.source_path])}</pre></details></section><section lang="${row.locale}"><h2>Käännös</h2><pre>${escapeHtml(fields(target))}</pre></section></main></html>`);
  }
  await writeFile(path.join(output, "index.html"), `<!doctype html><html lang="fi"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Käännösten toimituksellinen tarkistus</title><h1>Käännösten tarkistusjono</h1><p>Paikallinen aineisto. Thai: ainesosat ja valmistus ensin; sitten EN ja SV. Automaattinen tarkistus ei ole ihmisen hyväksyntä.</p><ol>${links.join("")}</ol></html>`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { audit, files, rows } = await loadCurrentReview();
  const output = path.join(root, "tmp/translation-review");
  await writeReviewPack(output, audit, rows, files);
  await writeFile(path.join(output, "registry.json"), JSON.stringify(rows, null, 2) + "\n");
  if (process.argv.includes("--snapshot")) await writeFile(path.join(root, "docs/reports/translation-review-registry.json"), JSON.stringify(rows, null, 2) + "\n");
  console.log(JSON.stringify({ pairs: rows.length, humanComplete: rows.filter((r) => r.human_review_status === "HUMAN REVIEW COMPLETE").length, statusCounts: Object.fromEntries([...new Set(rows.map((r) => r.human_review_status))].map((s) => [s, rows.filter((r) => r.human_review_status === s).length])), riskCounts: Object.fromEntries(["high", "medium", "low"].map((s) => [s, rows.filter((r) => r.risk_level === s).length])), errors: audit.errors, output }, null, 2));
  if (audit.errors.length) process.exitCode = 1;
}
