/**
 * #369 advisory translation triage artifact for a PR's changed FI / locale files.
 * With no reviewed batch ledger or FI source-quality register the report is
 * intentionally HOLD-only, never a source of approval or release permissions.
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { partitionFromLedger } from "./translation-batch-partition";

type Decision = {recipe_id: string; group: string; reasons: string[]; pairs: number};
type Partition = {
  total: number; candidate: Decision[]; needs_review: Decision[];
  source_hold: Decision[]; auto_publish: boolean; auto_merge: boolean;
};

export function changedRecipeIds(changedPaths: string): string[] {
  const ids = new Set<string>();
  for (const raw of changedPaths.split(/\r?\n/)) {
    const value = raw.trim().replaceAll("\\", "/");
    const m = /^(?:reseptit\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)|kaannokset\/(?:en|sv|th)\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat))\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/.exec(value);
    if (m) ids.add(m[1]!);
  }
  return [...ids].sort();
}

export function markdownPartition(report: Partition, opts: {testedSha: string; mode: string}): string {
  const lines = [
    "# Translation source-quality triage (#369)",
    "",
    "Advisory only. Candidate is **not** release approval; all nutrition, GK, editorial and CI gates remain mandatory.",
    "",
    "Tested SHA: " + (opts.testedSha || "unknown"),
    "Mode: " + opts.mode,
    "",
    "| Queue | Count |", "| --- | ---: |",
    "| candidate | " + report.candidate.length + " |",
    "| needs_review | " + report.needs_review.length + " |",
    "| source_hold | " + report.source_hold.length + " |",
    "",
  ];
  for (const [title, decisions] of [
    ["candidate", report.candidate],
    ["needs_review", report.needs_review],
    ["source_hold", report.source_hold],
  ] as const) {
    lines.push("## " + title, "");
    if (!decisions.length) lines.push("None.", "");
    for (const row of decisions) {
      lines.push("- **" + row.recipe_id + "** (" + row.pairs + " current locale proofs)");
      for (const reason of row.reasons) lines.push("  - " + reason.replaceAll("\n", " "));
    }
    lines.push("");
  }
  return lines.join("\n") + "\n";
}

function arg(name: string): string | undefined {
  return process.argv.find(x => x.startsWith("--" + name + "="))?.slice(name.length + 3);
}
async function main() {
  const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
  const output = path.resolve(root, arg("out") ?? "tmp/translation-source-queues/current");
  const ledgerPath = arg("ledger");
  const ids = changedRecipeIds(process.env.CHANGED_PATHS ?? "");
  const ledger = ledgerPath
    ? JSON.parse(await readFile(path.resolve(root, ledgerPath), "utf8"))
    : {recipes: Object.fromEntries(ids.map(id => [id, {review_state: "unreviewed"}]))};
  const evidencePath = arg("evidence") ?? "meta/kaannokset/codex-review-evidence.json";
  const evidence = JSON.parse(await readFile(path.resolve(root, evidencePath), "utf8"));
  const fiQualityPath = arg("fi-quality");
  const fiQuality = fiQualityPath
    ? JSON.parse(await readFile(path.resolve(root, fiQualityPath), "utf8")) : {};
  const result = await partitionFromLedger(root, ledger, evidence, fiQuality) as Partition;
  const mode = ledgerPath ? "reviewed-ledger-with-explicit-evidence" : "changed-source-inventory-no-approvals";
  const testedSha = process.env.GITHUB_SHA ?? "";
  const report = {
    schemaVersion: 1, testedSha, mode,
    counts: {total: result.total, candidate: result.candidate.length,
      needs_review: result.needs_review.length, source_hold: result.source_hold.length},
    candidate: result.candidate, needs_review: result.needs_review, source_hold: result.source_hold,
    auto_publish: false, auto_merge: false, release_authorized: false,
  };
  await mkdir(path.dirname(output), {recursive: true});
  await writeFile(output + ".json", JSON.stringify(report, null, 2) + "\n", "utf8");
  await writeFile(output + ".md", markdownPartition(result, {testedSha, mode}), "utf8");
  process.stdout.write("FI source queues: " + JSON.stringify(report.counts) + "\n");
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(e => {console.error("SOURCE_QUEUE_REPORT_FAILED:", e); process.exitCode = 1;});
}
