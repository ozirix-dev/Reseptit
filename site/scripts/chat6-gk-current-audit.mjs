import assert from "node:assert/strict";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(process.cwd(), "..");
const outDir = path.join(root, "tmp/nutrition/chat6-gk-audit");
const read = (name) => JSON.parse(readFileSync(path.join(root, name), "utf8"));
const exec = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const sha256 = (name) => createHash("sha256").update(readFileSync(path.join(root, name))).digest("hex");
const counts = (rows, key) => Object.fromEntries([...rows.reduce((m, row) => {
  const k = String(key(row) ?? "UNKNOWN");
  m.set(k, (m.get(k) ?? 0) + 1);
  return m;
}, new Map())].sort(([a], [b]) => a.localeCompare(b)));
const sort = (items) => [...items].sort((a, b) => String(a).localeCompare(String(b), "fi"));
const percent = (num, total) => total ? Number((num * 100 / total).toFixed(1)) : 0;
const list = (arr) => arr.length ? sort(arr).join(", ") : "ei yhtään";
const state = read("tmp/recipe-state/current.json");
const pilot = read("tmp/nutrition/glycemic-load-pilot.json");
const coverage = read("tmp/nutrition/glycemic-coverage/current.json");
const nutrition = read("tmp/nutrition/audit.json");
const gi = read("docs/nutrition/glycemic-index-records.json");
const portion = read("docs/nutrition/gk-reviewed-portions.json");
const research = read("tmp/nutrition/chat6-gk-audit/research-queue.json");
const head = exec("rev-parse", "HEAD");
const base = exec("merge-base", "HEAD", "origin/main");
assert.match(head, /^[a-f0-9]{40}$/);
assert.equal(state.sourceCommit, head, "Recipe state must match checked-out HEAD");
assert.equal(coverage.sourceCommit, head, "Coverage inventory must match checked-out HEAD");
assert.equal(research.sourceCommit, head, "Research queue must match checked-out HEAD");
assert.equal(coverage.currentSummary.recipeCount, pilot.summary.recipes);
assert.equal(coverage.currentSummary.calculated, pilot.summary.calculated);
assert.equal(coverage.currentSummary.incomplete, pilot.summary.insufficientSourceData);
assert.equal(pilot.summary.recipes + pilot.newPublicGkPendingSources.length, pilot.publicRecipeCountIncludingPending);
assert.equal(pilot.results.length, pilot.summary.recipes);
assert.equal(new Set(pilot.results.map(x => x.recipeId)).size, pilot.results.length);
assert.equal(new Set(pilot.newPublicGkPendingSources.map(x => x.recipeId)).size, pilot.newPublicGkPendingSources.length);
assert.equal(coverage.recipes.length, pilot.results.length);
assert.equal(new Set(state.recipes.map(x => x.canonicalRecipeId)).size, state.recipes.length);
const publicRows = state.recipes.filter(x => x.publicSlug !== null);
const visible = state.recipes.filter(x => x.publicState === "visible");
assert.equal(state.counts.publicFi, publicRows.length);
const pilotById = new Map(pilot.results.map(row => [row.recipeId, row]));
const coverageById = new Map(coverage.recipes.map(row => [row.recipeId, row]));
const nutritionById = new Map(nutrition.inventory.map(row => [row.recipe_id, row]));
const pendingIds = new Set(pilot.newPublicGkPendingSources.map(row => row.recipeId));
const giById = new Map(gi.records.map(row => [row.id, row]));
const numbers = publicRows.filter(row => {
  const result = row.glycemicLoadStatus.publicOriginal;
  return result?.status === "CALCULATED" &&
    (result.point !== null && result.point !== undefined || result.range !== null && result.range !== undefined);
});
const numberIds = new Set(numbers.map(x => x.sourceRecipeId));
const words = publicRows.filter(row => !numberIds.has(row.sourceRecipeId) &&
  row.glycemicLoadStatus.publicOriginalVerbalGk != null);
const verbalIds = new Set(words.map(x => x.sourceRecipeId));
const absent = publicRows.filter(row => !numberIds.has(row.sourceRecipeId) && !verbalIds.has(row.sourceRecipeId));
const allIds = new Set(publicRows.map(row => row.sourceRecipeId));
const missingFromPublic = pilot.newPublicGkPendingSources.filter(row => !allIds.has(row.recipeId));
const unmatchedInventory = coverage.recipes.filter(row => !allIds.has(row.recipeId));
const sourceKinds = counts(gi.records, row => row.evidenceKind ?? "MISSING");
const matchKinds = counts(gi.records, row => row.matchKind ?? "MISSING");
const qualityKinds = counts(gi.records, row => row.qualityTier ?? "MISSING");
const exclusiveCategories = new Map();
const overlaps = new Map();
const numericDetails = [];
const rows = publicRows.map(row => {
  const id = row.sourceRecipeId;
  const stateGk = row.glycemicLoadStatus;
  const result = pilotById.get(id);
  const c = coverageById.get(id);
  const macro = nutritionById.get(id);
  const isNum = numberIds.has(id);
  const isVerbal = verbalIds.has(id);
  const isPending = pendingIds.has(id);
  const categories = c?.blockingCategories || (isPending ? ["NEW_PUBLIC_GK_REVIEW_PENDING"] : []);
  const publishedValue = stateGk.publicOriginal;
  const sourceRows = result?.ingredients?.filter(x => x.giRecordId && x.giContribution !== null && x.giContribution !== undefined) || [];
  const sourceRefs = [...new Set(sourceRows.map(x => x.giRecordId))].map(giId => giById.get(giId)).filter(Boolean);
  const recordKinds = [...new Set(sourceRefs.map(x => x.matchKind ?? "MISSING"))].sort();
  const evidenceKinds = [...new Set(sourceRefs.map(x => x.evidenceKind ?? "MISSING"))].sort();
  const hasCHO = stateGk.hasWholePortionCarbs === true;
  let group;
  if (isNum) group = "PUBLIC_NUMERIC";
  else if (isVerbal) group = "PUBLIC_VERBAL";
  else if (isPending) group = "NEW_PUBLIC_GK_REVIEW_PENDING";
  else if (c?.status === "CALCULATED") group = "INTERNAL_CALCULATION_NOT_PUBLIC";
  else if (stateGk.bindingDifferences?.length && !stateGk.unreviewedAutoIncluded) group = "BINDING_REVIEW";
  else if (hasCHO && categories.length > 0 &&
    categories.every(k => ["STRUCTURE", "INPUT", "EVIDENCE", "TOLERANCE"].includes(k))) group = "TECHNICAL_OR_TOLERANCE_REVIEW";
  else if (hasCHO && categories.some(k => k.startsWith("GI_"))) group = "GI_SOURCE_OR_MATCH_REVIEW";
  else if (!hasCHO) group = "CHO_OR_PORTION_EVIDENCE_REVIEW";
  else group = "MULTIPLE_OR_UNCLASSIFIED_REVIEW";
  exclusiveCategories.set(group, (exclusiveCategories.get(group) || 0) + 1);
  if (!isNum) for (const kind of new Set(categories)) overlaps.set(kind, (overlaps.get(kind) || 0) + 1);
  if (isNum) numericDetails.push({
    id, confidence: result?.confidence ?? "NOT_IN_INTERNAL_PILOT",
    withOmission: (result?.omittedAvailableCarbohydratePerServingG ?? 0) > 0,
    omissionsG: result?.omittedAvailableCarbohydratePerServingG ?? null,
    matchKinds: recordKinds, evidenceKinds,
    giRecords: sourceRefs.map(x => x.id),
    hasAnalogue: recordKinds.includes("ANALOG"),
    hasCategoryMean: recordKinds.includes("CATEGORY_MEAN"),
    hasImputation: evidenceKinds.includes("PUBLISHED_IMPUTATION"),
    hasUnclassifiedEvidence: evidenceKinds.includes("MISSING"),
    internalStatus: result?.status ?? "NOT_IN_PILOT",
    originalCoverage: publishedValue?.range ? "RANGE" : "POINT"
  });
  return {
    id: row.canonicalRecipeId, sourceRecipeId: id, sourcePath: row.sourcePath,
    publicState: row.publicState, gkGroup: group,
    publicOriginalGk: publishedValue?.status ?? null,
    numeric: isNum, verbal: isVerbal,
    publicPoint: isNum ? publishedValue?.point ?? null : null,
    publicRange: isNum ? publishedValue?.range ?? null : null,
    hasWholePortionCarbs: hasCHO, nutritionStatus: row.nutritionStatus,
    auditStatus: stateGk.auditStatus, confidence: isNum ? result?.confidence ?? null : null,
    originalInputBindingDifferences: stateGk.bindingDifferences || [],
    blockingCategories: categories,
    blockers: (c?.blockers || []).map(x => ({ category: x.category, message: x.message })),
    reviewWorkstream: c?.suggestedNextWorkstream ?? (isPending ? "NEW_PUBLIC_PENDING_REVIEW" : null),
    publicVariantScopes: (stateGk.variants || []).filter(x => x.public).map(x => x.scope),
    giSourceKinds: recordKinds,
    giEvidenceKinds: evidenceKinds,
    nutritionEvidenceStatus: macro?.status ?? null,
    isPendingSource: isPending,
    hasPortionReview: Boolean(portion[id])
  };
});
const numericSummary = {
  confidence: counts(numericDetails, x => x.confidence),
  pointOrRange: counts(numericDetails, x => x.originalCoverage),
  withPositiveOmission: numericDetails.filter(x => x.withOmission).length,
  withAnalogue: numericDetails.filter(x => x.hasAnalogue).length,
  withCategoryMean: numericDetails.filter(x => x.hasCategoryMean).length,
  withPublishedImputation: numericDetails.filter(x => x.hasImputation).length,
  withUnclassifiedGiEvidence: numericDetails.filter(x => x.hasUnclassifiedEvidence).length,
  withoutMatchingInternalPilot: numericDetails.filter(x => x.internalStatus !== "CALCULATED").map(x => x.id)
};
const summary = {
  schemaVersion: 1,
  sourceCommit: head,
  baselineMainCommit: base,
  corpus: {
    publicFi: publicRows.length, visible: visible.length, stateByPublicState: counts(state.recipes, x => x.publicState),
    numericOriginal: numbers.length, verbalOnlyOriginal: words.length,
    withoutNumericOriginal: publicRows.length - numbers.length, withoutAnyOriginalEstimate: absent.length,
    hasWholePortionCarbs: publicRows.filter(row => row.glycemicLoadStatus.hasWholePortionCarbs).length,
    originalPublicStatus: state.counts.publicOriginalGk,
    fourLanguages: state.counts.fourLanguages,
    conflicts: counts(state.conflicts, x => x.code)
  },
  pilot: {
    recipes: pilot.summary.recipes, numericCalculated: pilot.summary.calculated,
    insufficientSourceData: pilot.summary.insufficientSourceData,
    explicitPending: pendingIds.size, totalWithPending: pilot.publicRecipeCountIncludingPending,
    originalCoverageTarget: pilot.originalCoverageTarget,
    coverageViews: pilot.coverageViews,
    missingFromPublic, unmatchedInventory: unmatchedInventory.map(x=>x.recipeId),
    baselineMismatch: state.counts.publicFi !== pilot.publicRecipeCountIncludingPending
  },
  coverage: {
    currentSummary: coverage.currentSummary,
    allPublishedSummary: coverage.allPublishedSummary,
    blockerOverlapCounts: coverage.blockerOverlapCounts,
    withheldFromAvailableCarbs: coverage.currentSummary.incompleteWithSupportedNutrition,
    reviewedStructural: coverage.structuralBindingAnalysis && {
      withOtherBlockersAtReviewStart: coverage.structuralBindingAnalysis.withOtherBlockersAtReviewStart,
      potentiallyResolvableByBindingOnlyAtReviewStart: coverage.structuralBindingAnalysis.potentiallyResolvableByBindingOnlyAtReviewStart
    }
  },
  giRegistry: {
    total: gi.records.length, sources: gi.sources?.length ?? null,
    quality: qualityKinds, match: matchKinds, evidence: sourceKinds,
    referencesOnly: gi.records.filter(x => x.calculationUse === "REFERENCE_ONLY").length
  },
  numericEvidence: numericSummary,
  groupCounts: Object.fromEntries([...exclusiveCategories].sort(([a], [b]) => a.localeCompare(b))),
  blockerOverlapForMissing: Object.fromEntries([...overlaps].sort(([a], [b]) => a.localeCompare(b))),
  nutrition: { statuses: nutrition.counts },
  researchQueue: { limit: research.limit, counts: research.counts, next: research.next },
  comparisonPreviousPublic: {
    referenceRecipes: 398, referenceNumeric: 151,
    changeRecipes: publicRows.length - 398,
    changeNumeric: numbers.length - 151,
    caveat: "22.11 earlier public site observation, not matching a fixed source SHA"
  }
};
assert.equal(rows.length, publicRows.length);
assert.equal(numbers.length + words.length + absent.length, publicRows.length);
assert.equal(rows.filter(x => x.isPendingSource).length, pendingIds.size - missingFromPublic.length);
assert.equal(coverage.currentSummary.recipeCount + pendingIds.size, pilot.publicRecipeCountIncludingPending);
mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, "summary.json");
writeFileSync(file, JSON.stringify(summary, null, 2) + "\n");
writeFileSync(path.join(outDir, "recipes.json"), JSON.stringify({
  schemaVersion: 1, sourceCommit: head, baselineMainCommit: base, rows
}, null, 2) + "\n");
writeFileSync(path.join(outDir, "published-numeric-evidence.json"), JSON.stringify({
  sourceCommit: head, rows: numericDetails
}, null, 2) + "\n");
const table = (obj) => Object.entries(obj || {}).map(([k,v])=> "| " + k + " | " + JSON.stringify(v) + " |");
const markdown = [
  "# Chat-6: GK-kattavuuden nykytila-auditointi",
  "",
  "Lähde-SHA: " + head + ". Main-vertailun SHA: " + base + ".",
  "Tämä dokumentti kuvaa kertaluonteisen laskennan työtilannetta. Se ei anna julkaisulupaa tai muuta nykyisiä GK-HOLDeja.",
  "",
  "## Julkinen FI-kanta",
  "",
  "| Mittari | Määrä |", "| --- | ---: |",
  "| Julkinen FI-kanta (myös mahdolliset erilliset julkaisupidot) | " + publicRows.length + " |",
  "| Näkyvät (visible) | " + visible.length + " |",
  "| Numeerinen alkuperäinen GK | " + numbers.length + " |",
  "| Vain sanallinen GK | " + words.length + " |",
  "| Ei numeerista tai sanallista alkuperäis-GK:ta | " + absent.length + " |",
  "| Koko annoksen hiilihydraattitieto | " + summary.corpus.hasWholePortionCarbs + " |",
  "",
  "## Laskenta ja erilliset HOLDiset",
  "",
  "- GK-pilotti " + pilot.summary.recipes + ": " + pilot.summary.calculated + " CALCULATED; " +
    pilot.summary.insufficientSourceData + " INSUFFICIENT SOURCE DATA.",
  "- Erillinen, SHA-lukittu uusi GK-pending: " + pendingIds.size + ".",
  "- Julkinen 398/151-lähtötilavertailu: muutos resepteissä " +
    summary.comparisonPreviousPublic.changeRecipes + ", numeerisissa " + summary.comparisonPreviousPublic.changeNumeric + ".",
  "- Pilotin 156 CALCULATED ei tarkoita samaa kuin julkisen listan numeeriset arvot.",
  "",
  "## Julkaistun numeerisen GK:n epävarmuus",
  "",
  "| Merkintä | Reseptit |", "| --- | ---: |",
  ...table(numericSummary.confidence),
  "| Kirjattu poisjättö >0 g | " + numericSummary.withPositiveOmission + " |",
  "| Sisältää GI-analogian | " + numericSummary.withAnalogue + " |",
  "| Sisältää GI-ryhmäkeskiarvon | " + numericSummary.withCategoryMean + " |",
  "| Sisältää julkaistun imputoinnin | " + numericSummary.withPublishedImputation + " |",
  "| GI:n evidenceKind luokittelematon | " + numericSummary.withUnclassifiedGiEvidence + " |",
  "",
  "## Esteiden ensisijaiset käsittelyryhmät",
  "",
  "| Ryhmä | Reseptit |", "| --- | ---: |", ...table(summary.groupCounts),
  "",
  "## Päällekkäiset laskennan estoluokat",
  "",
  "Yhdellä reseptillä voi olla useita esteitä. Lukuja ei pidä summata reseptimääräksi.",
  "", "| Luokka | Reseptit |", "| --- | ---: |",
  ...Object.entries(coverage.blockerOverlapCounts || {}).map(([k,v])=> "| " + k + " | " + v.recipes + " |"),
  "",
  "## Tutkimusjonon käsittely",
  "",
  "| Tila | Reseptit |", "| --- | ---: |", ...table(research.counts),
  "",
  "Ensimmäiset jatkojonon tunnisteet: " + list(research.next || []),
  "",
  "## Tulkinta ja rajaus",
  "",
  "- Laskennallinen CALCULATED ei yksin ole julkaisulupa.",
  "- GI:n matchKind, qualityTier ja evidenceKind ovat eri ulottuvuuksia.",
  "- 'Tekninen katselmointi' tarkoittaa ehdokasta, ei varmistettua uutta GK-lukua.",
  "- 80 prosentin tavoitetta ei saa saavuttaa muuttamalla alkuperäisiä reseptejä.",
  "- Reseptikohtainen lista ja kunkin eston alkuperäinen selite ovat recipes.json-tiedostossa.",
  "- Kaikki ajonaikaiset raportit on kirjoitettu tmp/nutrition/chat6-gk-audit-hakemistoon.",
  ""
].join("\n");
writeFileSync(path.join(outDir, "current.md"), markdown);
console.log("CHAT6_GK_AUDIT_SUMMARY=" + JSON.stringify(summary));
console.log("CHAT6_GK_AUDIT_FILES=" + JSON.stringify(["summary.json", "recipes.json", "published-numeric-evidence.json", "current.md"]));
console.log("CHAT6_GK_AUDIT_SAMPLE=" + JSON.stringify(rows.filter(x=>!x.numeric && !x.verbal).slice(0,18).map(x=>({
  id:x.id,group:x.gkGroup,hasCHO:x.hasWholePortionCarbs,categories:x.blockingCategories
}))));
