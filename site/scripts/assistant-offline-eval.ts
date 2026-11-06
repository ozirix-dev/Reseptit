import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteContent } from "../src/generated/content.generated";
import { createAssistantCatalog } from "../src/features/assistant/catalog";
import { assistantEvalCases } from "../src/features/assistant/eval-cases";
import { evaluateAssistantCases, type OfflineCandidate } from "../src/features/assistant/offline-evaluation";
import type { RecipeEntry, RecipeLocale } from "../src/types/content";

/**
 * Offline A4 evaluation. No provider SDK, network request, token usage or
 * fabricated "model accuracy" claims. Optional candidate JSON was created
 * elsewhere; this command NEVER starts an API benchmark.
 */
const args = process.argv.slice(2);
if (args.length !== 0 && (args.length !== 2 || args[0] !== "--candidate-file")) {
  throw new Error("Usage: npm run audit:assistant -- [--candidate-file LOCAL_JSON_PATH]");
}
const candidatePath = args.length ? path.resolve(args[1]) : null;
let candidates: OfflineCandidate[] | undefined;
if (candidatePath) {
  const raw = await readFile(candidatePath, "utf8");
  if (Buffer.byteLength(raw, "utf8") > 1024 * 1024) throw new Error("Candidate file exceeds 1 MiB");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every((row) => row !== null && typeof row === "object" &&
      typeof row.id === "string" && row.id.length < 60 && "output" in row &&
      Object.keys(row).every((key) => ["id", "output"].includes(key)))) {
    throw new Error("Candidate JSON must be an array of {id, output}");
  }
  candidates = parsed as OfflineCandidate[];
}

const locales: readonly RecipeLocale[] = ["fi", "en", "sv", "th"];
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const catalogs = Object.fromEntries(locales.map((locale) => [
  locale,
  createAssistantCatalog(siteContent.recipes, locale, (recipe: RecipeEntry) => sha256(JSON.stringify(recipe))),
])) as Record<RecipeLocale, ReturnType<typeof createAssistantCatalog>>;

const evaluation = evaluateAssistantCases(assistantEvalCases, catalogs, candidates);
const report = {
  schemaVersion: 1,
  measurement: "offline_gold_reference_or_saved_candidate_only",
  paidApiCalls: 0,
  modelCalls: 0,
  tokenCostUsd: 0,
  modelAccuracy: evaluation.mode === "candidate_file" ? evaluation.candidateMatched : null,
  modelAccuracyDenominator: evaluation.mode === "candidate_file" ? evaluation.candidateEvaluated : null,
  note: evaluation.mode === "reference_only"
    ? "80 gold intents checked against published source; this is NOT evidence that an AI can interpret natural-language prompts."
    : "These are locally supplied candidate predictions; this program did not invoke or verify the claimed model.",
  ...evaluation,
};
const dest = path.resolve(import.meta.dirname, "../../tmp/assistant-a4");
await mkdir(dest, { recursive: true });
const outputPath = path.join(dest, evaluation.mode === "candidate_file" ? "candidate-evaluation.json" : "reference-evaluation.json");
await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  outputPath,
  totalCases: report.totalCases,
  referencePassed: report.referencePassed,
  candidateEvaluated: report.candidateEvaluated,
  candidateMatched: report.candidateMatched,
  candidateInvalid: report.candidateInvalid,
  safetyMismatches: report.safetyMismatches,
  paidApiCalls: 0,
  modelCalls: 0,
}, null, 2));
if (evaluation.referencePassed !== 80) process.exitCode = 1;
