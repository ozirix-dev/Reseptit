/**
 * Read-only, pinned old-vs-new nutrition-model regression.
 * This comparison cannot approve a code seal or release any GK value.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { calculate, normalizeCarbohydrate, type Calculation, type FoodRecord } from "./nutrition-model";
import { buildGkOnlyVariants } from "./gk149-integration";
import { buildApprovedSixVariants } from "./gk149-approved-six";
import { loadPadSeeEw } from "./gk-next-seven";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const oldBlob = "de8d7189d786b06c93e13afb378f8861a70542c6";
const catalog = "docs/nutrition/food-records.json";
const calculations = "docs/nutrition/calculations";

function capture(fn: () => unknown) {
  try { return {ok: true, result: fn()}; }
  catch (error) { return {ok: false, error: String(error)}; }
}
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export async function audit() {
  // git cat-file verifies the exact historical Git blob, not an arbitrary
  // user-supplied, mutable source path or external download.
  const original = execFileSync("git", ["cat-file", "blob", oldBlob], {
    cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
  });
  const tmp = path.join(root, "tmp", "eu-polyol-impact");
  await mkdir(tmp, {recursive: true});
  const oldFile = path.join(tmp, "historical-nutrition-model.ts");
  await writeFile(oldFile, original);
  const previous = await import(pathToFileURL(oldFile).href) as typeof import("./nutrition-model");
  const records = JSON.parse(await readFile(path.join(root, catalog), "utf8")) as FoodRecord[];
  const sourceChanges: Array<{id: string; before: unknown; after: unknown}> = [];
  const counts: Record<string, number> = {};
  for (const record of records) {
    counts[record.carbohydrateDefinition] = (counts[record.carbohydrateDefinition] ?? 0) + 1;
    const before = capture(() => previous.normalizeCarbohydrate(record));
    const after = capture(() => normalizeCarbohydrate(record));
    if (!equal(before, after)) sourceChanges.push({id: record.id, before, after});
  }

  const files = (await readdir(path.join(root, calculations), {withFileTypes: true}))
    .filter(x => x.isFile() && x.name.endsWith(".json")).map(x => x.name).sort();
  const calculationChanges: Array<{file: string; recipe_id?: string; before: unknown; after: unknown}> = [];
  const invalidOrOther: string[] = [];
  let evaluated = 0, equalErrors = 0;
  let nestedEuTotal = 0, nestedEuTotalUnverified = 0;
  const unverifiedInputs: Array<{recipe_id: string; file: string; item: string;
    record_id: string; before: unknown; after: unknown; oldRecipeStatus?: string;
    newRecipeStatus?: string}> = [];
  for (const name of files) {
    const rel = calculations + "/" + name;
    let input: Calculation;
    try { input = JSON.parse(await readFile(path.join(root, rel), "utf8")) as Calculation; }
    catch { invalidOrOther.push(rel + ": invalid JSON"); continue; }
    if (!Array.isArray(input.ingredients) || typeof input.recipeId !== "string"
      || typeof input.sourceHash !== "string") {
      invalidOrOther.push(rel + ": not a Calculation input"); continue;
    }
    for (const ingredient of input.ingredients) {
      const record = ingredient.record;
      if (record?.carbohydrateDefinition !== "EU_TOTAL_INCLUDING_POLYOLS") continue;
      nestedEuTotal++;
      const verified = (record.polyolsSourceVerified === true && Boolean(record.polyolsEvidence?.trim()))
        || Boolean(record.componentValues && record.componentIds?.POLYL === 2260
          && Object.hasOwn(record.componentValues, "POLYL"));
      if (!verified) {
        nestedEuTotalUnverified++;
        unverifiedInputs.push({recipe_id: input.recipeId, file: rel,
          item: ingredient.item, record_id: record.id,
          before: capture(() => previous.normalizeCarbohydrate(record)),
          after: capture(() => normalizeCarbohydrate(record))});
      }
    }
    const before = capture(() => previous.calculate(input));
    const after = capture(() => calculate(input));
    evaluated++;
    for (const row of unverifiedInputs.filter(x => x.file === rel)) {
      row.oldRecipeStatus = before.ok ? (before.result as {status?: string}).status : "ERROR";
      row.newRecipeStatus = after.ok ? (after.result as {status?: string}).status : "ERROR";
    }
    if (!before.ok && !after.ok && equal(before, after)) equalErrors++;
    if (!equal(before, after)) calculationChanges.push({
      file: rel, recipe_id: input.recipeId, before, after,
    });
  }
  // Run real, previously sealed GK149 arithmetic through the *changed* model
  // without relaxing any approval.  These builders check all their existing
  // input/source bindings and goldens; this is not a release or a new seal.
  const original16 = buildGkOnlyVariants(root);
  const nextSix = buildApprovedSixVariants(root);
  if (original16.length !== 16 || nextSix.length !== 6 ||
      new Set([...original16, ...nextSix].map(v => v.recipeId)).size !== 22 ||
      [...original16, ...nextSix].some(v => v.macroScope !== "NO_MACRO_PACKAGE_FOR_THIS_VERSION")) {
    throw Error("GK149 current approved variant scope changed");
  }
  // The separately guarded pad-see-ew seventh case MUST still fail closed:
  // successfully evaluating 22 cases does not approve a different code SHA.
  const padGuard = capture(() => loadPadSeeEw(root));
  if (padGuard.ok || !/Pad shared evidence changed: site\\/scripts\\/nutrition-model\\.ts/.test(String(padGuard.error))) {
    throw Error("Expected pad-see-ew nutrition code seal HOLD changed: " + JSON.stringify(padGuard));
  }
  const protectedGk149 = {
    scope: "Audited approved GK149 arithmetic only: 16 originals plus six next-six versions; pad see ew stays sealed.",
    approvedOriginalVersions: original16.length,
    approvedNextSixVersions: nextSix.length,
    unchangedGoldensAndSourceBindings: true,
    distinctIds: 22,
    padSeeEw: "EXPECTED_SEAL_BLOCK",
    publicationAuthorized: false,
    sourceSealApproved: false,
  };
  const currentModel = await readFile(path.join(root, "site/scripts/nutrition-model.ts"), "utf8");
  const result = {
    schemaVersion: 1,
    scope: "Read-only historical vs changed calculation comparison; no GK release approval.",
    testedSha: process.env.GITHUB_SHA ?? "",
    oldGitBlob: oldBlob,
    oldCodeSha256: createHash("sha256").update(original).digest("hex"),
    newCodeSha256: createHash("sha256").update(currentModel).digest("hex"),
    catalogue: {path: catalog, count: records.length, carbohydrateDefinitions: counts,
      differentNormalizedRecords: sourceChanges.length, differences: sourceChanges},
    calculationInputs: {
      directory: calculations, scannedJsonFiles: files.length, evaluated, equalErrors,
      skipped: invalidOrOther, nestedEuTotal, nestedEuTotalUnverified,
      unverifiedInputs,
      changedResults: calculationChanges.length, differences: calculationChanges,
    },
    protectedGk149,
    readyAuthorized: false, mergeAuthorized: false, deployAuthorized: false,
    sourceSealApproved: false,
  };
  const dest = path.join(tmp, "current.json");
  await writeFile(dest, JSON.stringify(result, null, 2) + "\n");
  const lines = [
    "# EU-polyolien vaikutusauditointi – ei julkaisuhyväksyntää", "",
    "HEAD: " + (result.testedSha || "not supplied"),
    "Vanha nutrition-model.ts blob: " + oldBlob,
    "Vanhan koodin SHA-256: " + result.oldCodeSha256,
    "Uuden koodin SHA-256: " + result.newCodeSha256, "",
    "| Mittari | Arvo |", "| --- | ---: |",
    "| Kanonisia ravintotietueita | " + records.length + " |",
    "| Muuttuneita normalisointituloksia | " + sourceChanges.length + " |",
    "| Reseptilaskennan JSON-tiedostoja | " + files.length + " |",
    "| Vertailtuja reseptilaskelmia | " + evaluated + " |",
    "| Muuttuneita reseptilaskentatuloksia | " + calculationChanges.length + " |",
    "| Sisäisiä EU-total-ainesosasyötteitä | " + nestedEuTotal + " |",
    "| Niistä varmentamattomia | " + nestedEuTotalUnverified + " |",
    "| GK149 alkuperäisiä lukittuja versioita tarkistettu | " + protectedGk149.approvedOriginalVersions + " |",
    "| GK149 seuraavan kuuden lukittuja versioita tarkistettu | " + protectedGk149.approvedNextSixVersions + " |",
    "| Pad see ew -koodisinetti | EXPECTED_SEAL_BLOCK |", "",
    "Tämä on kattavuudeltaan rajattu auditointi; hyväksyttyihin GK-only-variantteihin",
    "ei saa soveltaa uutta koodihashia ilman niiden erillistä sinettikatselmointia.", "",
  ];
  if (unverifiedInputs.length) {
    lines.push("## Varmentamattomien syötteiden tapausluettelo", "");
    for (const row of unverifiedInputs) lines.push("- `" + row.recipe_id + "` / `" + row.record_id
      + "`: " + row.item + "; normalisointi ennen: " + JSON.stringify(row.before)
      + ", jälkeen: " + JSON.stringify(row.after) + "; reseptitila: "
      + (row.oldRecipeStatus ?? "unknown") + " → " + (row.newRecipeStatus ?? "unknown"));
    lines.push("");
  }
  if (invalidOrOther.length) lines.push("Muita/ohitettuja laskentatiedostoja: " + invalidOrOther.length, "");
  await writeFile(path.join(tmp, "current.md"), lines.join("\n"));
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  audit().then(result => {
    console.log(JSON.stringify({
      catalogue: result.catalogue.count,
      changedSourceRecords: result.catalogue.differentNormalizedRecords,
      calculationInputs: result.calculationInputs.evaluated,
      changedCalculations: result.calculationInputs.changedResults,
      nestedEuTotalUnverified: result.calculationInputs.nestedEuTotalUnverified,
      protectedGk149: result.protectedGk149,
      unverifiedInputs: result.calculationInputs.unverifiedInputs.map(x => ({
        recipe_id: x.recipe_id, record_id: x.record_id,
        before: x.before, after: x.after,
        oldRecipeStatus: x.oldRecipeStatus, newRecipeStatus: x.newRecipeStatus,
      })),
      report: "tmp/eu-polyol-impact/current.json",
    }));
    if (result.catalogue.differentNormalizedRecords || result.calculationInputs.changedResults) process.exitCode = 1;
  }).catch(error => {console.error("EU_POLYOL_IMPACT_AUDIT_FAILED:", error); process.exitCode = 1;});
}
