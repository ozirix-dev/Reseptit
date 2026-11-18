import { readFileSync } from "node:fs";
import path from "node:path";
import { gkResearchDecisionPath, gkResearchDisposition, gkResearchRecipeBinding, gkResearchRegistry, researchTextHash } from "./gk-research-decisions";
import { git, repoRoot } from "./recipe-state-inputs";
import { projectPublishedMarkdown } from "./build-content";
import type { projectRecipeState } from "./recipe-state";

const [limitArg, ...selectors] = process.argv.slice(2);
const limit = Number(limitArg);
if (!/^(?:[1-9]|[12][0-9]|30)$/.test(limitArg ?? "") || !selectors.length ||
  selectors.some(selector => !/^(?:--priority=)?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(selector))) {
  throw Error("Usage: gk-research-queue.ts <1-30> <recipe-id | --priority=recipe-id> [...]");
}
const priorityIds = new Set(selectors.filter(selector => selector.startsWith("--priority="))
  .map(selector => selector.slice("--priority=".length)));
const ids = [...new Set(selectors.map(selector => selector.replace(/^--priority=/, "")))];
const head = git("rev-parse", "HEAD").trim();
const state: ReturnType<typeof projectRecipeState> =
  JSON.parse(readFileSync(path.join(repoRoot, "tmp/recipe-state/current.json"), "utf8"));
if (state.schemaVersion !== 1 || state.sourceCommit !== head || git("status", "--porcelain", "--untracked-files=no")) {
  throw Error("Refresh recipe-state-cli.ts in the clean checkout for the current HEAD");
}

const readAtHead = (file: string) => git("show", `${head}:${file}`);
const decisions = new Map(gkResearchRegistry.parse(JSON.parse(readAtHead(gkResearchDecisionPath))).decisions
  .map(row => [row.canonicalRecipeId, row] as const));
const selected = new Set<string>();
const results = ids.flatMap(requestedId => {
  const matches = state.recipes.filter(row => row.canonicalRecipeId === requestedId || row.sourceRecipeId === requestedId);
  const row = matches.length === 1 ? matches[0] : undefined;
  const canonicalId = row?.canonicalRecipeId ?? requestedId;
  if (selected.has(canonicalId)) return [];
  selected.add(canonicalId);
  const priority = priorityIds.has(requestedId) || priorityIds.has(canonicalId) ||
    (row !== undefined && (priorityIds.has(row.sourceRecipeId) || row.publicState === "quarantine" || row.publicState === "editorial-hold"));
  const currentDecision = decisions.get(canonicalId);
  const unclear = matches.length !== 1 || row?.publicState !== "visible" || state.conflicts.some(conflict =>
    (conflict.recipeId === row?.sourceRecipeId || conflict.recipeId === canonicalId) &&
    ["ambiguous-fi-source", "unverified-successor", "missing-public-gk-disposition"].includes(conflict.code));
  let recipeSha256: string | null = null;
  let contextSha256: string | null = null;
  if (row && !unclear) {
    try {
      const source = readAtHead(row.sourcePath);
      if (researchTextHash(source) === row.contentHash) {
        const binding = gkResearchRecipeBinding(projectPublishedMarkdown(row.sourcePath, source));
        recipeSha256 = binding.recipeSha256;
        contextSha256 = researchTextHash(JSON.stringify([
          binding.narrativeSha256, row.glycemicLoadStatus.calculationContextSha256,
        ]));
      }
    } catch {
      // A recipe that cannot be bound stays available for manual review.
    }
  }
  const original = row?.glycemicLoadStatus.publicOriginal;
  const publishedNumeric = original != null && (original.point != null || original.range != null);
  const publicOriginalVerbalGk = row?.glycemicLoadStatus.publicOriginalVerbalGk;
  const published = publishedNumeric || publicOriginalVerbalGk != null;
  const unreviewedAutoIncluded = !publishedNumeric && row?.glycemicLoadStatus.unreviewedAutoIncluded === true;
  const disposition = gkResearchDisposition({
    sourceRecipeId: row?.sourceRecipeId ?? requestedId,
    recipeSha256,
    calculationInputSha256: row?.glycemicLoadStatus.calculationInputSha256 ?? null,
    calculationEvidenceSha256: row?.glycemicLoadStatus.calculationEvidenceSha256 ?? null,
    contextSha256,
    hasPublicEstimate: published,
    bindingConflict: Boolean(row?.glycemicLoadStatus.bindingDifferences.length) && !unreviewedAutoIncluded,
    ambiguous: unclear || (publicOriginalVerbalGk != null && !recipeSha256) ||
      row?.glycemicLoadStatus.calculationInputSha256 === undefined ||
      row?.glycemicLoadStatus.calculationEvidenceSha256 === undefined ||
      row?.glycemicLoadStatus.calculationContextSha256 === undefined,
    priority,
  }, currentDecision, evidence => {
    try {
      return researchTextHash(readAtHead(evidence.path)) === evidence.sha256;
    } catch {
      return false;
    }
  });
  return [{ recipeId: canonicalId, sourceRecipeId: row?.sourceRecipeId ?? null, ...disposition,
    hasPublicEstimate: published,
    ...(publicOriginalVerbalGk != null ? { publicOriginalVerbalGk } : {}),
    bindingDifferences: row?.glycemicLoadStatus.bindingDifferences ?? [],
    ...(unreviewedAutoIncluded ? { unreviewedAutoIncluded } : {}),
    historicalSourceBindingDifference: row?.glycemicLoadStatus.historicalSourceBindingDifference ?? false,
    verifiedRawGkRelease: row?.glycemicLoadStatus.verifiedRawGkRelease ?? null,
    releasePresentationDifferences: row?.glycemicLoadStatus.releasePresentationDifferences ?? null,
    binding: { recipeSha256, contextSha256, calculationInputSha256: row?.glycemicLoadStatus.calculationInputSha256 ?? null,
      calculationEvidenceSha256: row?.glycemicLoadStatus.calculationEvidenceSha256 ?? null },
    decision: currentDecision ? { reviewedAt: currentDecision.reviewedAt, recipeSha256: currentDecision.recipeSha256,
      evidence: currentDecision.evidence, reopen: currentDecision.reopen } : null }];
});

const statuses = ["new", "reopened", "skip", "approved", "review", "priority"] as const;
const counts = Object.fromEntries(statuses.map(status => [status, results.filter(row => row.status === status).length]));
const next = results.filter(row => row.status === "new" || row.status === "reopened").slice(0, limit).map(row => row.recipeId);
if (git("rev-parse", "HEAD").trim() !== head) throw Error("HEAD changed during GK research selection");
console.log(JSON.stringify({ sourceCommit: head, limit, counts, next, results }, null, 2));
