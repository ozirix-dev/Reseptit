/**
 * Read-only, changed-recipe source/evidence projection for #369.
 * Not a food review, not an evidence writer, and not a release gate.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { sourceCategories, type TranslationAuditResult } from "./translation-audit";
import { loadSemanticEvidence } from "./translation-semantic-review";
import { fiSourceQualitySchema, type FiSourceQualityEvidence } from "./translation-fi-source-quality";
import { projectEvidenceLedger, type EvidenceProjectionEntry } from "./translation-derived-evidence-ledger";
import { changedRecipeIds } from "./translation-batch-ci-report";
import { PILOT_IDS } from "./fi-approved-source-pilot";

type Recipe = TranslationAuditResult["publishedSources"][number];
const locales = ["en", "sv", "th"] as const;
const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));

function option(name: string): string | undefined {
  return process.argv.find(arg => arg.startsWith("--" + name + "="))?.slice(name.length + 3);
}

export async function readEvidenceEntries(
  projectRoot: string, ids: readonly string[],
): Promise<EvidenceProjectionEntry[]> {
  const seen = new Set<string>();
  const result: EvidenceProjectionEntry[] = [];
  for (const id of ids) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || seen.has(id))
      throw new Error("Unsafe or duplicate recipe identity: " + id);
    seen.add(id);
    const candidates: Recipe[] = [];
    for (const category of sourceCategories) {
      const relative = "reseptit/" + category + "/" + id + ".md";
      let raw: string;
      try { raw = await readFile(path.join(projectRoot, relative), "utf8"); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw error;
      }
      const parsed = parseMarkdown(raw);
      if (!parsed) throw new Error("Unparseable FI recipe: " + relative);
      const data = recipeFrontmatterSchema.parse(parsed.data);
      if (data.recipe_id !== id || data.language !== "fi")
        throw new Error("FI identity mismatch: " + relative);
      if (data.status === "published")
        candidates.push({path: relative, data, content: parsed.content});
    }
    if (candidates.length > 1) throw new Error("Duplicate published FI source: " + id);
    const source = candidates[0] ?? null;
    const translations: EvidenceProjectionEntry["translations"] = {};
    if (source) {
      const category = source.path.split("/")[1];
      for (const locale of locales) {
        const relative = "kaannokset/" + locale + "/" + category + "/" + id + ".md";
        let raw: string;
        try { raw = await readFile(path.join(projectRoot, relative), "utf8"); }
        catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
          throw error;
        }
        const parsed = parseMarkdown(raw);
        if (!parsed) throw new Error("Unparseable translation: " + relative);
        const data = recipeFrontmatterSchema.parse(parsed.data);
        if (data.language !== locale || data.recipe_id !== id
          || data.translation_of !== id || data.source_language !== "fi"
          || data.source_recipe !== source.path) throw new Error("Translation linkage mismatch: " + relative);
        if (data.status === "draft" || data.status === "published")
          translations[locale] = {path: relative, data, content: parsed.content};
      }
    }
    result.push({id, source, translations});
  }
  return result;
}

export async function runDerivedEvidenceReport(args: {
  projectRoot: string; changedPaths: string; sourceEvidence?: FiSourceQualityEvidence;
  outputBase: string; testedSha?: string; includePilot?: boolean;
}) {
  const ids = changedRecipeIds(args.changedPaths);
  const semanticEvidence = await loadSemanticEvidence(args.projectRoot);
  const reportIds = args.includePilot ? [...new Set([...ids, ...PILOT_IDS])].sort() : ids;
  const entries = await readEvidenceEntries(args.projectRoot, reportIds);
  const result = projectEvidenceLedger(entries, semanticEvidence, args.sourceEvidence ?? {});
  const output = {
    ...result, testedSha: args.testedSha ?? "",
    changedRecipeIds: ids,
    source_quality_evidence_provided: Boolean(args.sourceEvidence),
  };
  const lines = [
    "# FI-/käännösevidenssin projektio – vain katselmointi", "",
    "Lukittu tarkistettu SHA: " + (output.testedSha || "ei saatavilla"), "",
    "Ei automaattisia FI-laatuhyväksyntöjä, GK-sinettejä tai julkaisulupia.", "",
    "| FI-resepti | FI-lähde | EN | SV | TH | GK / julkaisu |",
    "| --- | --- | --- | --- | --- | --- |",
  ];
  for (const row of result.decisions) {
    const locale = row.semantic_review;
    lines.push("| \`" + row.recipe_id + "\` | " + row.source_quality
      + " | " + locale.en + " | " + locale.sv + " | " + locale.th
      + " | NOT ASSERTED |");
  }
  if (!result.decisions.length) lines.push("| Ei muuttuneita FI-/kielireseptejä | - | - | - | - | - |");
  lines.push("", "Tämä projektio ei kirjoita yhtään hyväksyntätiedostoa eikä merkitse ihmiskatselmoituksi.", "");
  await mkdir(path.dirname(args.outputBase), {recursive: true});
  await writeFile(args.outputBase + ".json", JSON.stringify(output, null, 2) + "\n");
  await writeFile(args.outputBase + ".md", lines.join("\n"));
  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const qualityPath = option("fi-quality");
    const sourceEvidence = qualityPath
      ? fiSourceQualitySchema.parse(JSON.parse(await readFile(path.resolve(root, qualityPath), "utf8")))
      : undefined;
    const report = await runDerivedEvidenceReport({
      projectRoot: root,
      changedPaths: process.env.CHANGED_PATHS ?? "",
      sourceEvidence,
      includePilot: process.argv.includes("--pilot"),
      outputBase: path.resolve(root, option("out") ?? "tmp/translation-derived-evidence/current"),
      testedSha: process.env.GITHUB_SHA ?? "",
    });
    console.log(JSON.stringify({
      checked: report.decisions.length,
      sourceEvidenceProvided: report.source_quality_evidence_provided,
      releaseAuthorized: report.release_authorized,
    }));
  } catch (error) {
    console.error("TRANSLATION_DERIVED_EVIDENCE_FAILED: " + String(error));
    process.exitCode = 1;
  }
}
