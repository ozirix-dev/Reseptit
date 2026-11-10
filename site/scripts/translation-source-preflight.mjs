/** Reusable fail-closed FI source batch preflight; no translations or publishing. */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as yamlParse } from "yaml";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourcePathPattern = /^reseptit\/(aamupalat|alkuruoat|paaruoat|jalkiruoat|leivonnaiset|valipalat)\/[a-z0-9-]+\.md$/;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const genericPreparationPatterns = Object.freeze([
  ["generic-bowl", /Valmistele kulhon ainekset|Paloittele tuoreet kasvikset ja valmistele yrtit/i],
  ["generic-pancake", /Sekoita jauhot tai viljat ja muut kuivat ainekset/i],
  ["generic-bread", /Jos reseptissä on valmis leipä tai taikina|Jos reseptissä on valmis leipä taikina/i],
  ["generic-grain", /Mittaa (?:riisi|tapioka) kattilaan ja lisää reseptin neste/i],
  ["generic-hot-protein", /Kypsennä liha tai muut täytteet kypsiksi/i],
  ["generic-egg-plate", /Valmistele ainekset: paloittele kasvikset ja kypsennä pavut tai liha/i],
  ["generic-rice-bowl", /Kypsennä riisi pakkauksen ohjeen mukaan\. Paista tofu/i],
  ["generic-oven", /Kuumenna uuni 200 asteeseen ja voitele pieni uunivuoka/i],
  ["generic-fritter", /Raasta, muussaa tai hienonna pääraaka-aine/i],
  ["generic-soup", /Kuumenna kattilassa öljy tai liemi\. Lisää aromit/i],
  ["generic-steamer", /Valmistele täyte ja taikina\. Liota riisi tai palkokasvit/i],
]);
export function genericSourceIssues(instructions) {
  return genericPreparationPatterns.filter(([, pattern]) => pattern.test(instructions)).map(([label]) => label);
}
export function gitBlobSha(raw) {
  return createHash("sha1").update("blob " + Buffer.byteLength(raw, "utf8") + "\0", "utf8")
    .update(raw, "utf8").digest("hex");
}
export function extractRecipe(raw) {
  const match = raw.match(/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) throw Error("Missing recipe YAML frontmatter");
  const data = yamlParse(match[1]);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw Error("Invalid YAML object");
  const content = raw.slice(match[0].length);
  const section = content.match(/^## Valmistus\s*\r?\n([\s\S]*?)(?=^##\s+|$)/m)?.[1] ?? "";
  const steps = section.match(/^\s*\d+[.)]\s+\S.*$/gm) ?? [];
  return { data, content, section, steps };
}
export async function auditSourceLedger({ root = repoRoot, ledgerPath }) {
  const absolute = path.resolve(root, ledgerPath);
  if (!absolute.startsWith(path.resolve(root, "meta/kaannokset") + path.sep) || !absolute.endsWith(".json"))
    throw Error("Worklist must be under meta/kaannokset/*.json");
  const ledger = JSON.parse(await readFile(absolute, "utf8"));
  if (ledger.schemaVersion !== 1 || !Array.isArray(ledger.recipeSources) ||
      !Number.isInteger(ledger.expectedSources) || ledger.expectedSources < 1 ||
      ledger.expectedSources > 100 || ledger.recipeSources.length !== ledger.expectedSources ||
      ledger.plannedPairs !== ledger.expectedSources * 3 || ledger.release_authorized !== false)
    throw Error("Invalid, oversized or publication-authorized worklist");
  const errors = [], rows = [], seen = new Set();
  for (const entry of ledger.recipeSources) {
    const id = entry?.recipe_id, rel = entry?.source_path;
    if (typeof id !== "string" || !idPattern.test(id) ||
        typeof rel !== "string" || !sourcePathPattern.test(rel) ||
        !rel.endsWith("/" + id + ".md") || seen.has(id) ||
        !/^[a-f0-9]{40}$/.test(entry?.source_blob_sha ?? "") ||
        !["needs-chef-review", "source-hold"].includes(entry?.review_state) ||
        entry?.release_authorized !== false) {
      errors.push("Malformed, duplicated or unapproved source: " + String(id)); continue;
    }
    seen.add(id);
    let raw;
    try { raw = await readFile(path.resolve(root, rel), "utf8"); }
    catch (error) { errors.push(id + ": source missing: " + String(error)); continue; }
    if (gitBlobSha(raw) !== entry.source_blob_sha) {
      errors.push(id + ": SOURCE SHA STALE"); continue;
    }
    try {
      const recipe = extractRecipe(raw);
      if (recipe.data.recipe_id !== id || recipe.data.status !== "published" ||
          recipe.data.language !== "fi" || !Array.isArray(recipe.data.ingredients) ||
          recipe.data.ingredients.length < 1) errors.push(id + ": not a published, structured FI recipe");
      const findings = genericSourceIssues(recipe.section);
      if (recipe.steps.length < 2) findings.push("missing-recipe-specific-steps");
      if (entry.review_state === "needs-chef-review" && findings.length)
        errors.push(id + ": incorrectly marked for review despite generic source: " + findings.join(", "));
      if (entry.review_state === "source-hold" && (!entry.blocker || !entry.blocker.trim()))
        errors.push(id + ": source HOLD missing rationale");
      rows.push({ recipe_id: id, review_state: entry.review_state, findings });
    } catch (error) { errors.push(id + ": " + String(error)); }
  }
  if (seen.size !== ledger.expectedSources || rows.length !== ledger.expectedSources)
    errors.push("Source ledger/cardinality mismatch");
  return { batch: ledger.batch, count: rows.length,
    needs_review: rows.filter(r => r.review_state === "needs-chef-review").length,
    source_hold: rows.filter(r => r.review_state === "source-hold").length,
    rows, errors, ready_to_publish: false, translations_created: 0 };
}
function option(prefix) {return process.argv.find(s=>s.startsWith(prefix+"="))?.slice(prefix.length+1);}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ledgerPath = option("--ledger");
  if (!ledgerPath) { console.error("Usage: node scripts/translation-source-preflight.mjs --ledger=meta/kaannokset/<name>.json");process.exitCode=2; }
  else auditSourceLedger({ledgerPath}).then(r=>{
    console.log("SOURCE_PREFLIGHT:", r.batch, r.count, "FI,",r.needs_review,"for review,",r.source_hold,"HOLD, 0 translations created");
    for (const error of r.errors) console.error("ERROR:", error);
    if (r.errors.length) process.exitCode=1;
  }).catch(e=>{console.error(e);process.exitCode=1;});
}
