/**
 * Read-only editorial inventory of the published, non-quarantined Finnish originals.
 * Heuristics produce review candidates, NEVER publication or nutrition decisions.
 * Usage: cd site && npx tsx scripts/editorial-fi-inventory.ts [--json]
 */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseMarkdown } from "../src/content/markdown";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceDirs = [
  "reseptit/aamupalat", "reseptit/valipalat", "reseptit/alkuruoat",
  "reseptit/paaruoat", "reseptit/jalkiruoat", "reseptit/leivonnaiset",
] as const;

export interface EditorialSource {
  path: string;
  raw: string;
}
export interface EditorialRow {
  recipeId: string;
  title: string;
  category: string;
  path: string;
  blobSha: string;
  timeTotalMin: number | null;
  difficulty: string | null;
  intro: string;
  firstStep: string;
  signals: string[];
}
export interface Repetition {
  text: string;
  recipeIds: string[];
  count: number;
}
export interface EditorialInventory {
  scannedFiles: number;
  publishedFiFiles: number;
  quarantinedFiFiles: number;
  skippedFiles: number;
  sourceParseErrors: string[];
  duplicateRecipeIds: string[];
  categoryCounts: Record<string, number>;
  difficultyCounts: Record<string, number>;
  timeBands: Record<string, number>;
  repeatedIntros: Repetition[];
  repeatedFirstSteps: Repetition[];
  rows: EditorialRow[];
}

function markdownSection(content: string, heading: string): string {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex(line => line.trim().toLocaleLowerCase("fi") === "## " + heading.toLocaleLowerCase("fi"));
  if (start < 0) return "";
  const next = lines.findIndex((line, index) => index > start && /^##\s+/.test(line));
  return lines.slice(start + 1, next < 0 ? undefined : next).join("\n").trim();
}

function cleanText(value: string): string {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_]/g, "").replace(/\s+/g, " ").trim();
}

function firstDescription(content: string): string {
  return cleanText(markdownSection(content, "Kuvaus").split(/\n\s*\n/)[0] ?? "");
}

function firstPreparationStep(content: string): string {
  const instruction = markdownSection(content, "Valmistus");
  const first = instruction.match(/^\s*\d+[.)]\s+(.+)$/m);
  return first ? cleanText(first[1]) : "";
}

function gitBlobSha(raw: string): string {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw, "utf8") + "\0" + raw).digest("hex");
}

function tally(rows: EditorialRow[], key: (row: EditorialRow) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const row of rows) {
    const value = key(row);
    result[value] = (result[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b, "fi")));
}

function repeated(rows: EditorialRow[], key: (row: EditorialRow) => string): Repetition[] {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    const value = key(row);
    if (!value) continue;
    groups.set(value, [...(groups.get(value) ?? []), row.recipeId]);
  }
  return [...groups.entries()]
    .filter(([, ids]) => ids.length >= 3)
    .map(([text, recipeIds]) => ({ text, count: recipeIds.length, recipeIds: recipeIds.sort() }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, "fi"));
}

function timeBand(time: number | null): string {
  if (time === null) return "puuttuu";
  if (time <= 30) return "0–30 min";
  if (time <= 60) return "31–60 min";
  if (time <= 120) return "61–120 min";
  return "yli 120 min";
}

export function auditEditorialSources(sources: EditorialSource[]): EditorialInventory {
  const rows: EditorialRow[] = [];
  const sourceParseErrors: string[] = [];
  let quarantinedFiFiles = 0;
  for (const source of [...sources].sort((a, b) => a.path.localeCompare(b.path))) {
    let parsed: ReturnType<typeof parseMarkdown>;
    try {
      parsed = parseMarkdown(source.raw);
    } catch (error) {
      sourceParseErrors.push(source.path + ": " + String(error));
      continue;
    }
    if (!parsed || parsed.data.status !== "published" || parsed.data.language !== "fi") continue;
    const data = parsed.data;
    if (typeof data.recipe_id !== "string" || !data.recipe_id.trim()) {
      sourceParseErrors.push(source.path + ": published FI recipe_id missing");
      continue;
    }
    if (isPublicRecipeQuarantined(data.recipe_id)) {
      quarantinedFiFiles++;
      continue;
    }
    const intro = firstDescription(parsed.content);
    const firstStep = firstPreparationStep(parsed.content);
    const time = typeof data.time_total_min === "number" && Number.isFinite(data.time_total_min)
      ? data.time_total_min : null;
    const signals: string[] = [];
    if (!intro) signals.push("MISSING_INTRO");
    if (!firstStep) signals.push("MISSING_PREPARATION");
    if (/\bTässä kotikeittiöön sovitetussa ohjeessa\b/i.test(intro) ||
        /Mausteisuutta ja lisukkeita voi säätää oman maun mukaan/i.test(intro)) {
      signals.push("GENERIC_INTRO");
    }
    if (/Valmistele kulhon ainekset|Sekoita jauhot tai viljat|Kuumenna kattilassa öljy tai liemi|Raasta, muussaa tai hienonna pääraaka-aine/i
      .test(markdownSection(parsed.content, "Valmistus"))) signals.push("GENERIC_PREPARATION");
    if (time === null) signals.push("MISSING_TOTAL_TIME");
    if (time !== null && time <= 60 && /yön yli|vähintään (?:8|10|12|24) tuntia/i.test(parsed.content)) {
      signals.push("TIME_SCOPE_REVIEW");
    }
    if (!/https?:\/\/|(?:^|\n)\s*(?:Lähde|Alkuperäislähde|Mukailtu|Tekijä)\s*:/i.test(parsed.content)) {
      signals.push("SOURCE_ATTRIBUTION_REVIEW");
    }
    rows.push({
      recipeId: data.recipe_id,
      title: typeof data.title === "string" ? data.title : "",
      category: typeof data.category === "string" ? data.category : source.path.split("/")[1] ?? "",
      path: source.path,
      blobSha: gitBlobSha(source.raw),
      timeTotalMin: time,
      difficulty: typeof data.difficulty === "string" ? data.difficulty : null,
      intro,
      firstStep,
      signals,
    });
  }
  const repeatedIntros = repeated(rows, row => row.intro);
  const repeatedFirstSteps = repeated(rows, row => row.firstStep);
  const addRepeated = (groups: Repetition[], signal: string) => {
    const flagged = new Set(groups.flatMap(group => group.recipeIds));
    for (const row of rows) if (flagged.has(row.recipeId)) row.signals.push(signal);
  };
  addRepeated(repeatedIntros, "REPEATED_EXACT_INTRO");
  addRepeated(repeatedFirstSteps, "REPEATED_EXACT_FIRST_STEP");
  const ids = tally(rows, row => row.recipeId);
  return {
    scannedFiles: sources.length,
    publishedFiFiles: rows.length,
    quarantinedFiFiles,
    skippedFiles: sources.length - rows.length - quarantinedFiFiles - sourceParseErrors.length,
    sourceParseErrors,
    duplicateRecipeIds: Object.entries(ids).filter(([, n]) => n > 1).map(([id]) => id),
    categoryCounts: tally(rows, row => row.category),
    difficultyCounts: tally(rows, row => row.difficulty ?? "puuttuu"),
    timeBands: tally(rows, row => timeBand(row.timeTotalMin)),
    repeatedIntros, repeatedFirstSteps,
    rows: rows.sort((a, b) => a.recipeId.localeCompare(b.recipeId, "fi")),
  };
}

async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  }));
  return nested.flat().sort();
}

export async function scanEditorialLibrary(root: string = repoRoot): Promise<EditorialInventory> {
  const filenames = (await Promise.all(sourceDirs.map(dir => markdownFiles(path.join(root, dir))))).flat();
  const sources = await Promise.all(filenames.map(async filename => ({
    path: path.relative(root, filename).replaceAll("\\", "/"),
    raw: await readFile(filename, "utf8"),
  })));
  return auditEditorialSources(sources);
}

export function inventoryMarkdown(result: EditorialInventory): string {
  const lines = [
    "# FI-reseptikirjaston toimituksellinen inventaario",
    "",
    "**Vain lukevia heuristiikkoja. Ei reseptien hyväksyntää, automaattista HOLDia, koekeittiökoetta eikä ravinto-/GI/GK-päätöksiä.**",
    "",
    "- Tarkastettuja Markdown-tiedostoja: " + result.scannedFiles,
    "- Julkaistuja, ei-karanteenissa olevia FI-alkuperäistiedostoja: " + result.publishedFiFiles,
    "- Karanteenissa olevia FI-tiedostoja: " + result.quarantinedFiFiles,
    "- Ohitettuja tiedostoja: " + result.skippedFiles,
    "- Luku-/metatietovirheitä: " + result.sourceParseErrors.length,
    "- Päällekkäisiä FI-resepti-ID:itä: " + result.duplicateRecipeIds.length,
    "- Täsmälleen toistuvia ingressiryhmiä (väh. 3): " + result.repeatedIntros.length,
    "- Täsmälleen toistuvia aloitusvaiheryhmiä (väh. 3): " + result.repeatedFirstSteps.length,
    "",
    "## Kategoriat, vaikeus ja valmistusajat",
    "",
    "Kategoriat: " + JSON.stringify(result.categoryCounts),
    "",
    "Vaikeudet: " + JSON.stringify(result.difficultyCounts),
    "",
    "Kokonaisajat: " + JSON.stringify(result.timeBands),
    "",
    "## Täsmällisesti toistuvat aloitukset",
    "",
  ];
  for (const item of result.repeatedIntros) lines.push("- " + item.count + " × " + item.text + " (" + item.recipeIds.join(", ") + ")");
  lines.push("", "## Täsmällisesti toistuvat aloitusvaiheet", "");
  for (const item of result.repeatedFirstSteps) lines.push("- " + item.count + " × " + item.text + " (" + item.recipeIds.join(", ") + ")");
  lines.push("", "## Tarkistettavat FI-lähteet (heuristiset signaalit)", "");
  lines.push("| Resepti | Lähde-blob | Signaalit |", "| --- | --- | --- |");
  for (const row of result.rows.filter(row => row.signals.length)) {
    lines.push("| " + row.recipeId + " | " + row.path + " @ " + row.blobSha + " | " + row.signals.join(", ") + " |");
  }
  if (result.sourceParseErrors.length) lines.push("", "## Parsintavirheet", "", ...result.sourceParseErrors.map(e => "- " + e));
  if (result.duplicateRecipeIds.length) lines.push("", "## Päällekkäiset ID:t", "", ...result.duplicateRecipeIds.map(id => "- " + id));
  lines.push("", "Huom: puuttuva URL ei yksin todista puuttuvaa tekijämainintaa; signaalit ovat toimituksellisen jatkokatselmoinnin ehdokkaita.", "");
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inventory = await scanEditorialLibrary();
  if (process.argv.slice(2).includes("--json")) {
    process.stdout.write(JSON.stringify(inventory, null, 2) + "\n");
  } else {
    process.stdout.write(inventoryMarkdown(inventory));
  }
}
