/** C20 preflight: fail closed before expensive CI, without modifying FI or GI/GK. */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

type Locale = "en" | "sv" | "th";
type Row = { recipe_id: string; source_path: string; source_blob_sha: string; release_authorized: boolean };
type Ledger = {
  schemaVersion: 1; batch: string; expectedSources: number; expectedPairs: number;
  recipeSources: Row[];
};
const locales: Locale[] = ["en", "sv", "th"];
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const macros = ["carbs_net_per_serving_g", "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g"] as const;
const genericSource = /Valmistele kulhon ainekset|kypsennä pavut tai proteiini|Sekoita jauhot tai viljat|Jos reseptissä on valmis leipä|Kypsennä liha tai muut täytteet kypsiksi/i;

export function gitBlobSha(content: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(content, "utf8") + "\0").update(content, "utf8").digest("hex");
}
export function preparationNumbers(text: string): string[] {
  return [...text.matchAll(/(?<![\p{L}\d])\d+(?:[.,]\d+)?/gu)]
    .map(match => String(Number(match[0].replace(",", "."))));
}
export function missingPreparationNumbers(sourceSteps: string[], targetSteps: string[]): string[] {
  const remaining = preparationNumbers(targetSteps.join("\n"));
  const missing: string[] = [];
  for (const num of preparationNumbers(sourceSteps.join("\n"))) {
    const index = remaining.indexOf(num);
    if (index < 0) missing.push(num);
    else remaining.splice(index, 1);
  }
  return missing;
}
export function sourceQualityFindings(content: string): string[] {
  return genericSource.test(content) ? ["FI preparation contains generic template text"] : [];
}
function steps(content: string): string[] {
  return content.split(/\r?\n/).filter(line => /^\d+[.)]\s+\S/.test(line))
    .map(line => line.replace(/^\d+[.)]\s+/, ""));
}
function stable(value: unknown): string { return JSON.stringify(value); }
function normalizedUnit(unit: string, locale: Locale): string {
  const units: Record<string, Record<Locale, string>> = {
    rkl: {en:"tbsp",sv:"msk",th:"ช้อนโต๊ะ"},
    tl: {en:"tsp",sv:"tsk",th:"ช้อนชา"},
    kpl: {en:"",sv:"",th:""},
  };
  return units[unit]?.[locale] ?? unit;
}
async function readRecipe(relativePath: string) {
  const bytes = await readFile(path.join(root, relativePath), "utf8");
  const parsed = parseMarkdown(bytes);
  if (!parsed) throw Error("Empty or invalid Markdown: " + relativePath);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  return {bytes, data, content:parsed.content};
}
export async function auditC20(): Promise<{sources:number; pairs:number; drafts:number; errors:string[]}> {
  const ledger = JSON.parse(await readFile(path.join(root, "meta/kaannokset/c20-translation-worklist.json"), "utf8")) as Ledger;
  if (ledger.schemaVersion !== 1 || ledger.expectedSources !== 20 || ledger.expectedPairs !== 60
      || !Array.isArray(ledger.recipeSources) || ledger.recipeSources.length !== 20) throw Error("C20 ledger cardinality invalid");
  const seen = new Set<string>();
  const errors: string[] = [];
  let pairs = 0, drafts = 0;
  for (const entry of ledger.recipeSources) {
    const id = entry.recipe_id;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || seen.has(id) ||
        entry.source_path !== "reseptit/aamupalat/" + id + ".md" ||
        !/^[0-9a-f]{40}$/.test(entry.source_blob_sha)) {
      errors.push("Invalid or duplicate worklist entry: " + id);
      continue;
    }
    seen.add(id);
    const source = await readRecipe(entry.source_path);
    if (source.data.recipe_id !== id || source.data.language !== "fi" || source.data.status !== "published") {
      errors.push(id + ": FI source must be published with stable identity");
      continue;
    }
    if (gitBlobSha(source.bytes) !== entry.source_blob_sha) errors.push(id + ": SOURCE SHA STALE");
    errors.push(...sourceQualityFindings(source.content).map(reason => id + ": " + reason));
    const sourceSteps = steps(source.content);
    if (sourceSteps.length < 2) errors.push(id + ": too few FI preparation steps");
    for (const locale of locales) {
      const targetPath = "kaannokset/" + locale + "/aamupalat/" + id + ".md";
      let target: Awaited<ReturnType<typeof readRecipe>>;
      try { target = await readRecipe(targetPath); }
      catch (error) { errors.push(id + ":" + locale + ": missing or invalid target " + String(error)); continue; }
      pairs++;
      const s = source.data, t = target.data;
      if (t.status === "draft") drafts++;
      if (t.status === "published" && entry.release_authorized !== true) errors.push(id + ":" + locale + ": release not authorized");
      if (t.language !== locale || t.recipe_id !== id || t.translation_of !== id ||
          t.source_recipe !== entry.source_path || t.source_language !== "fi")
        errors.push(id + ":" + locale + ": source/locale identity mismatch");
      for (const key of ["url_slug", "category", "servings", "diet_class", "time_total_min",
                          "main_ingredient", "cooking_method", ...macros] as const) {
        if (stable(s[key]) !== stable(t[key])) errors.push(id + ":" + locale + ": mismatch " + key);
      }
      if (s.image && (!t.image || s.image.src !== t.image.src ||
          s.image.width !== t.image.width || s.image.height !== t.image.height))
        errors.push(id + ":" + locale + ": image path or dimensions changed");
      if (s.ingredients.length !== t.ingredients.length) errors.push(id + ":" + locale + ": ingredient count changed");
      for (let i = 0; i < s.ingredients.length; i++) {
        const a = s.ingredients[i], b = t.ingredients[i];
        if (!b || a.amount !== b.amount || normalizedUnit(a.unit, locale) !== b.unit ||
            Boolean(a.note) !== Boolean(b.note))
          errors.push(id + ":" + locale + ": ingredient " + (i + 1) + " amount/unit/note mismatch");
      }
      const targetSteps = steps(target.content);
      if (sourceSteps.length !== targetSteps.length) errors.push(id + ":" + locale + ": preparation step count changed");
      const missing = missingPreparationNumbers(sourceSteps, targetSteps);
      if (missing.length) errors.push(id + ":" + locale + ": missing FI preparation numbers: " + missing.join(","));
      if (target.content.length < 100 || t.title === s.title) errors.push(id + ":" + locale + ": missing localized prose or title");
      if (locale === "th" && !/[\u0e00-\u0e7f]/u.test(target.content))
        errors.push(id + ":th: no Thai script in preparation");
    }
  }
  if (seen.size !== ledger.expectedSources || pairs !== ledger.expectedPairs)
    errors.push("C20 count mismatch: " + seen.size + " FI / " + pairs + " pairs");
  return { sources: seen.size, pairs, drafts, errors };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  auditC20().then(result => {
    console.log("C20 preflight:", result.sources, "FI,", result.pairs, "EN/SV/TH,", result.drafts, "drafts");
    for (const error of result.errors) console.error("HOLD:", error);
    if (result.errors.length) process.exitCode = 1;
  }).catch(error => { console.error(error); process.exitCode = 1; });
}
