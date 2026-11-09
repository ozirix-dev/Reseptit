/**
 * Chef quality gate V1: review-led, reproducible pilot.
 *
 * This is NOT an automated assertion of culinary correctness. It verifies
 * source snapshots and measurable claims, then routes evidence gaps to HOLD.
 * A green test can never mean that a dish has been cooked or approved.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const DEFAULT_PILOT = "docs/reviews/chef-quality-pilot-five-20261109.json";
const RECIPE_FIELDS = [
  "recipe_id", "language", "status", "ingredients", "servings",
  "time_total_min", "cooking_method", "carbs_net_per_serving_g",
  "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g",
];
const MATERIAL_FIELDS = new Set([
  "recipe_id", "ingredients", "servings", "carbs_net_per_serving_g",
  "carbs_total_per_serving_g", "protein_per_serving_g", "fat_per_serving_g",
]);
const VALID_PROBES = new Set([
  "instruction_contains", "ingredient_absent", "ingredient_amount",
  "time_equals", "ratio_at_least", "translation_published",
]);
const VALID_FINDINGS = new Set([
  "generic_instruction", "unquantified_edible_liquid", "implausible_quantity",
  "unrealistic_time", "unsafe_or_incomplete_handling", "translation_dependency",
]);

export function gitBlobSha(content) {
  const raw = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
  return createHash("sha1").update("blob " + raw.length + "\0").update(raw).digest("hex");
}

export function parseRecipeMarkdown(source, sourcePath = "<memory>") {
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(source);
  assert.ok(match, sourcePath + ": frontmatter missing");
  const data = parseYaml(match[1]);
  assert.ok(data && typeof data === "object" && !Array.isArray(data), sourcePath + ": frontmatter must be an object");
  assert.ok(Array.isArray(data.ingredients), sourcePath + ": ingredient list missing");
  const sections = source.slice(match[0].length);
  const heading = /^##\s+Valmistus\s*$/mi.exec(sections);
  assert.ok(heading, sourcePath + ": Finnish preparation section missing");
  const from = heading.index + heading[0].length;
  const next = sections.slice(from).search(/^##\s+/m);
  const instructions = sections.slice(from, next < 0 ? undefined : from + next).trim();
  assert.ok(instructions.length > 0, sourcePath + ": preparation is empty");
  return { data, content: sections, instructions };
}

const ingredientName = (row) => String(row?.item ?? "").toLocaleLowerCase("fi").trim();
const ingredientMatches = (recipe, fragment) => recipe.data.ingredients.filter(
  (row) => ingredientName(row).includes(String(fragment).toLocaleLowerCase("fi")),
);

export function evaluateProbe(recipe, probe, publishedTranslations = []) {
  assert.ok(VALID_PROBES.has(probe.kind), "Unknown probe: " + probe.kind);
  let ok = false;
  let found = null;
  if (probe.kind === "instruction_contains") {
    ok = recipe.instructions.toLocaleLowerCase("fi").includes(String(probe.text).toLocaleLowerCase("fi"));
    found = ok ? probe.text : "(not present)";
  } else if (probe.kind === "ingredient_absent") {
    const rows = ingredientMatches(recipe, probe.item);
    ok = rows.length === 0;
    found = rows.map((r) => r.item);
  } else if (probe.kind === "ingredient_amount") {
    const rows = ingredientMatches(recipe, probe.item);
    ok = rows.some((r) => Number(r.amount) === probe.amount && r.unit === probe.unit);
    found = rows.map((r) => ({ amount: r.amount, unit: r.unit, item: r.item }));
  } else if (probe.kind === "time_equals") {
    ok = recipe.data.time_total_min === probe.minutes;
    found = recipe.data.time_total_min ?? null;
  } else if (probe.kind === "ratio_at_least") {
    const a = ingredientMatches(recipe, probe.numerator);
    const b = ingredientMatches(recipe, probe.denominator);
    if (a.length === 1 && b.length === 1 && a[0].unit === "g" && b[0].unit === "g" && Number(b[0].amount) > 0) {
      found = Number(a[0].amount) / Number(b[0].amount);
      ok = found >= probe.minimum;
    }
  } else if (probe.kind === "translation_published") {
    found = publishedTranslations.slice().sort();
    ok = probe.locales.every((l) => publishedTranslations.includes(l));
  }
  return { probe: probe.kind, expected: probe, observed: found, pass: ok };
}

export function compareRecipeVersions(before, after) {
  const changedFields = RECIPE_FIELDS.filter((field) =>
    JSON.stringify(before.data[field] ?? null) !== JSON.stringify(after.data[field] ?? null));
  const instructionsChanged = before.instructions !== after.instructions;
  const materialChanged = changedFields.some((field) => MATERIAL_FIELDS.has(field));
  const methodMetadataChanged = changedFields.includes("cooking_method");
  const timeChanged = changedFields.includes("time_total_min");
  // Text-only means *structural data* remained equal, not that cooking or
  // GI/GL meaning is proven unchanged.
  const textOnly = instructionsChanged && changedFields.length === 0;
  return {
    changedFields, instructionsChanged, textOnly, materialChanged,
    requiresNutritionEvidence: materialChanged,
    requiresGlycemicReview: materialChanged || methodMetadataChanged || timeChanged || instructionsChanged,
    requiresTranslationReview: instructionsChanged || changedFields.length > 0,
    requiresCulinaryReview: instructionsChanged || changedFields.length > 0,
    requiresMethodMeaningReview: instructionsChanged || methodMetadataChanged || timeChanged,
    approval: "NOT_AUTO_APPROVED",
  };
}

export function classifyPilotCase(caseData, recipe, translations = []) {
  const openFindings = caseData.findings.filter((f) => f.status === "open");
  const kinds = new Set(openFindings.map((f) => f.kind));
  const highRisk = openFindings.some((f) => f.severity === "P0" || f.severity === "P1");
  const material = kinds.has("unquantified_edible_liquid") || kinds.has("implausible_quantity");
  const timeOrSafety = kinds.has("unrealistic_time") || kinds.has("unsafe_or_incomplete_handling");
  const instructions = kinds.has("generic_instruction");
  const changesDirections = instructions || timeOrSafety;
  const translationRisk = translations.length > 0 && changesDirections;
  // A single headline must not conceal independent blockers. Example:
  // implausible miso/nori quantities AND unsafe/unclear rice preparation.
  const blockers = [];
  if (material) blockers.push("MATERIAL_QUANTITY_OR_LIQUID");
  if (timeOrSafety) blockers.push("TIME_OR_HANDLING");
  if (instructions) blockers.push("GENERIC_OR_WRONG_INSTRUCTIONS");
  if (translationRisk || kinds.has("translation_dependency")) blockers.push("PUBLISHED_TRANSLATION_SYNC");
  if (caseData.proposed_change?.related_pr) blockers.push("EXTERNAL_PR_NOT_VERIFIED");
  if (highRisk && blockers.length === 0) blockers.push("UNRESOLVED_P0_P1");
  let decision = "EDITORIAL_REVIEW";
  if (material && timeOrSafety) decision = "HOLD_MULTI_AXIS";
  else if (timeOrSafety) decision = "HOLD_TIME_SAFETY";
  else if (material) decision = "HOLD_MATERIAL_EVIDENCE";
  else if (translationRisk || kinds.has("translation_dependency")) decision = "HOLD_TRANSLATION_SYNC";
  else if (highRisk && instructions) decision = "TEXT_REPAIR_CANDIDATE";
  else if (highRisk) decision = "HOLD_UNRESOLVED";
  return {
    decision, releaseEligible: false, highRisk, material, timeOrSafety,
    blockers, translatedLocales: translations, requiresTranslationSync: translationRisk,
    requiresNutritionReview: material,
    // Text-only change can still alter cooking, hydration or GI/GL meaning.
    requiresMethodMeaningReview: instructions || timeOrSafety,
    requiresGlycemicReview: material || timeOrSafety || instructions,
    requiresChefReview: highRisk,
  };
}

async function publishedTranslationLocales(root, recipe, relativeSourcePath) {
  const statuses = recipe.data.translation_status ?? {};
  const reported = [];
  for (const locale of ["en", "sv", "th"]) {
    if (statuses[locale] !== "published") continue;
    const targetPath = path.join(root, "kaannokset", locale, relativeSourcePath.replace(/^reseptit\//, ""));
    // Check actual files rather than trusting only the source metadata.
    await access(targetPath);
    const target = parseRecipeMarkdownTranslations(await readFile(targetPath, "utf8"), targetPath);
    assert.equal(target.status, "published", targetPath + ": translation metadata says published but file is not");
    assert.equal(target.recipe_id, recipe.data.recipe_id, targetPath + ": translation ID mismatch");
    reported.push(locale);
  }
  return reported;
}

function parseRecipeMarkdownTranslations(content, targetPath) {
  const match = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(content);
  assert.ok(match, targetPath + ": translation YAML missing");
  return parseYaml(match[1]);
}

export async function runPilot(pilot, root = ROOT) {
  assert.equal(pilot.schema_version, 1, "Unsupported pilot schema");
  assert.ok(Array.isArray(pilot.cases) && pilot.cases.length === 5, "The pilot must contain exactly five distinct recipes");
  const seen = new Set();
  const results = [];
  for (const row of pilot.cases) {
    assert.ok(typeof row.recipe_id === "string" && row.recipe_id && !seen.has(row.recipe_id), "Duplicate or missing recipe ID");
    seen.add(row.recipe_id);
    assert.ok(/^reseptit\/[a-z-]+\/[a-z0-9-]+\.md$/.test(row.path), "Invalid source recipe path: " + row.path);
    assert.ok(Array.isArray(row.findings) && row.findings.length, row.recipe_id + ": findings missing");
    assert.ok(Array.isArray(row.probes) && row.probes.length, row.recipe_id + ": measurable probes missing");
    assert.ok(Array.isArray(row.references) && row.references.length &&
      row.references.every((ref) => /^https:\/\//.test(ref.url) && ref.relevance?.length > 12),
      row.recipe_id + ": named external culinary evidence required");
    for (const finding of row.findings) {
      assert.ok(VALID_FINDINGS.has(finding.kind), row.recipe_id + ": invalid finding kind");
      assert.ok(["P0", "P1", "P2", "P3"].includes(finding.severity), row.recipe_id + ": invalid severity");
      assert.ok(["open", "fixed"].includes(finding.status), row.recipe_id + ": invalid finding status");
      assert.ok(finding.explanation?.length > 16, row.recipe_id + ": finding rationale required");
    }
    const file = path.join(root, row.path);
    const bytes = await readFile(file);
    const actualSha = gitBlobSha(bytes);
    const recipe = parseRecipeMarkdown(bytes.toString("utf8"), row.path);
    assert.equal(recipe.data.recipe_id, row.recipe_id, row.path + ": wrong identity");
    assert.equal(recipe.data.language, "fi", row.path + ": must be FI source");
    assert.equal(recipe.data.status, "published", row.path + ": pilot expects published source");
    const translated = await publishedTranslationLocales(root, recipe, row.path);
    const probes = row.probes.map((p) => evaluateProbe(recipe, p, translated));
    const isFresh = actualSha === row.source_blob_sha;
    const allProbesPass = probes.every((p) => p.pass);
    const assessment = classifyPilotCase(row, recipe, translated);
    const decision = !isFresh || !allProbesPass ? "STALE_EVIDENCE" : assessment.decision;
    results.push({
      recipe_id: row.recipe_id, path: row.path, source_blob_sha: actualSha,
      expected_blob_sha: row.source_blob_sha, sourceFresh: isFresh, probes,
      decision, releaseEligible: false, findings: row.findings,
      summary: row.summary, proposed_change: row.proposed_change ?? null,
      assessment, refs: row.references,
    });
  }
  return {
    schema_version: 1,
    outcome: results.every((r) => r.sourceFresh && r.probes.every((p) => p.pass)) ?
      "PILOT_EVIDENCE_CURRENT" : "PILOT_EVIDENCE_STALE",
    guardrail: "No recipe passes publication by automation; method, provenance, translations, nutrition and frozen GI/GL versions need separate review.",
    inspected: results.length, stale: results.filter((r) => r.decision === "STALE_EVIDENCE").length,
    textRepairCandidates: results.filter((r) => r.decision === "TEXT_REPAIR_CANDIDATE").length,
    holdCases: results.filter((r) => r.decision.startsWith("HOLD_")).length,
    results,
  };
}

export function markdownPilotReport(report) {
  const lines = [
    "# Chef-quality V1: five real source-recipe cases",
    "",
    "**Evidence status:** " + report.outcome,
    "**Inspected:** " + report.inspected + "; text-repair candidates: " + report.textRepairCandidates +
    "; HOLD: " + report.holdCases + "; stale: " + report.stale + ".",
    "",
    "The pilot is NOT a cooking trial. No findings are auto-fixed, no nutrients or GI/GL values are updated.",
    "",
    "| Recipe | Decision | Evidence |",
    "| --- | --- | --- |",
    ...report.results.map((r) => "| " + r.recipe_id + " | " + r.decision +
      " | " + (r.sourceFresh ? "snapshot OK" : "snapshot STALE") +
      ", " + r.probes.filter((p) => p.pass).length + "/" + r.probes.length + " probes |"),
    "",
    "## Per-recipe observations",
  ];
  for (const r of report.results) {
    lines.push("", "### " + r.recipe_id, "", r.summary,
      "", "Decision: **" + r.decision + "**. Publication: **NO**.",
      "", "Independent blockers: " + (r.assessment.blockers.length ? r.assessment.blockers.join(", ") : "none recorded") + ".",
      "", "Claims measured: " + r.probes.map((p) => p.probe + "=" + (p.pass ? "PASS" : "FAIL")).join(", ") + ".",
      "", "Evidence: " + r.refs.map((x) => x.url).join(", "),
      "", "Required next step: " + String(r.proposed_change?.next_step ?? "Investigate and review before edits") + ".");
  }
  lines.push("", "## Limitation", "",
    "Automated probes confirm that stated observations match the pinned source. They do not prove cultural authenticity, safety, measured yield, nutrition correctness, or that an external PR has passed its own CI.",
    "");
  return lines.join("\n");
}

export async function main(args = process.argv.slice(2), root = ROOT) {
  const pilotName = args.find((x) => x.startsWith("--pilot="))?.slice(8) ?? DEFAULT_PILOT;
  const pilotPath = path.resolve(root, pilotName);
  assert.ok(pilotPath.startsWith(root + path.sep), "Pilot path must stay inside repository");
  const pilot = JSON.parse(await readFile(pilotPath, "utf8"));
  const report = await runPilot(pilot, root);
  const out = args.find((x) => x.startsWith("--out="))?.slice(6);
  if (out) {
    const base = path.resolve(root, out);
    assert.ok(base.startsWith(root + path.sep), "Output path must stay inside repository");
    await mkdir(path.dirname(base), { recursive: true });
    await writeFile(base + ".json", JSON.stringify(report, null, 2) + "\n", "utf8");
    await writeFile(base + ".md", markdownPilotReport(report), "utf8");
  }
  console.log("CHEF_QUALITY_PILOT " + JSON.stringify({
    inspected: report.inspected, outcome: report.outcome, hold: report.holdCases,
    candidate: report.textRepairCandidates, stale: report.stale,
    decisions: report.results.map((r) => [r.recipe_id, r.decision]),
  }));
  if (report.stale > 0) process.exitCode = 1;
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
