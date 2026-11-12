import assert from "node:assert/strict";
import transition from "../../docs/nutrition/gk-original-content-transition.json";
import historicalBaseline from "../../docs/nutrition/gk-legacy-reconciliation/baseline.json";

// Membership belongs to the sealed history, independent of the live inventory.
export const frozenOriginalRecipeIds: ReadonlySet<string> = new Set(Object.keys(historicalBaseline.resultHashes));

export function frozenOriginalRows<T>(rows: readonly T[], recipeId: (row: T) => string): T[] {
  const scoped = rows.filter(row => frozenOriginalRecipeIds.has(recipeId(row)));
  assert.deepEqual(scoped.map(recipeId).sort(), [...frozenOriginalRecipeIds].sort(),
    "The historical corpus must contain each pinned recipe exactly once");
  return scoped;
}

const mainAddition = transition.mainAddition;
export const mainAdditionFiles: Readonly<Record<string, string>> = mainAddition.addedFileHashes;

// PR #302 introduced three new published recipes after the sealed 326-recipe
// baselines (and after the separate #294 raejuustopizza transition).
// Keep a closed allowlist: new future additions must still be reviewed.
export const postBaselineBriocheIds = [
  "briossisampylat-joshua-weissman",
  "hampurilaissampylat-moomie",
  "kevyet-briossisampylat-clever-carrot",
] as const;
const postBaselineBrioche = new Set<string>(postBaselineBriocheIds);

// PR #311's five published classics are excluded only when reconstructing
// the frozen GK history, never from the live site or calculation report.
export const postBaselineClassicIds = [
  "karjalanpiirakat-riisipuurolla",
  "marry-me-kanapasta",
  "uunifetapasta-kirsikkatomaateilla",
  "raejuustobagelit-ilman-kohotusta",
  "linssimakaronilaatikko",
] as const;
const postBaselineClassics = new Set<string>(postBaselineClassicIds);

// PR #412: two individually reviewed cake additions after the frozen GK baselines.
// They remain in the live 337-recipe report and cannot inherit a numeric GK.
export const postBaselineCakeIds = ["perinteinen-mansikkataytekakku-sienikakkupohjalla","sienikakkupohja"] as const;
const postBaselineCakes = new Set<string>(postBaselineCakeIds);

// Two original FI gluten-free releases, one later pancake and two exact-reviewed
// gluten-free breads. Frozen GK history remains unchanged: all five have
// INSUFFICIENT SOURCE DATA, never invented numeric GK. The historical replay
// permits only these exact 2-, 3- or 5-recipe release stages.
export const postBaselineGlutenFreeFiIds = [
  "gluteeniton-perunajauhokakkupohja",
  "gluteeniton-durrapizzapohja",
  "gluteeniton-uunipannukakku",
  "gluteeniton-siemenvuokaleipa",
  "gluteenittomat-kauralesesampylat",
] as const;
const originalGlutenFreeFiIds = postBaselineGlutenFreeFiIds.slice(0, 2);
const pancakeStageGlutenFreeFiIds = postBaselineGlutenFreeFiIds.slice(0, 3);
const allowedGlutenFreeHistoryStages = [originalGlutenFreeFiIds, pancakeStageGlutenFreeFiIds, postBaselineGlutenFreeFiIds] as const;
const postBaselineGlutenFreeFi = new Set<string>(postBaselineGlutenFreeFiIds);

function omitGlutenFreeFiForFrozenHistory(report: any) {
  if (!report.results) return;
  const added = report.results.filter((row: {recipeId: string}) => postBaselineGlutenFreeFi.has(row.recipeId));
  if (!added.length) return;
  const present = added.map((row: {recipeId: string}) => row.recipeId).sort();
  assert.ok(allowedGlutenFreeHistoryStages.some(ids => JSON.stringify(present) === JSON.stringify([...ids].sort())),
    "Only exact reviewed 2, 3 or 5 gluten-free recipes may enter historical projection");
  for (const row of added) {
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA", row.recipeId);
    assert.equal(row.glycemicLoadPerServing, null, row.recipeId);
    assert.equal(row.glycemicLoadRangePerServing, null, row.recipeId);
  }
  report.results = report.results.filter((row: {recipeId: string}) => !postBaselineGlutenFreeFi.has(row.recipeId));
  if (report.calculationInputs) report.calculationInputs = report.calculationInputs.filter((row: {recipeId: string}) => !postBaselineGlutenFreeFi.has(row.recipeId));
  if (report.summary) {
    report.summary.recipes -= added.length;
    report.summary.insufficientSourceData -= added.length;
  }
  if (report.autoIncludedRecipeIds) report.autoIncludedRecipeIds = report.autoIncludedRecipeIds.filter((id: string) => !postBaselineGlutenFreeFi.has(id));
  for (const field of ["recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"])
    if (report[field]) report[field] = report[field].filter((id: string) => !postBaselineGlutenFreeFi.has(id));
}

function omitCakesForFrozenHistory(report: any) {
  if (!report.results) return;
  const added = report.results.filter((row: {recipeId:string}) => postBaselineCakes.has(row.recipeId));
  if (!added.length) return;
  assert.deepEqual(added.map((row: {recipeId:string}) => row.recipeId).sort(), [...postBaselineCakeIds].sort());
  for (const row of added) {
    assert.equal(row.status, 'INSUFFICIENT SOURCE DATA', row.recipeId);
    assert.equal(row.glycemicLoadPerServing, null, row.recipeId);
    assert.equal(row.glycemicLoadRangePerServing, null, row.recipeId);
  }
  report.results = report.results.filter((row: {recipeId:string}) => !postBaselineCakes.has(row.recipeId));
  if (report.calculationInputs) report.calculationInputs = report.calculationInputs.filter((row: {recipeId:string}) => !postBaselineCakes.has(row.recipeId));
  if (report.summary) { report.summary.recipes -= added.length; report.summary.insufficientSourceData -= added.length; }
  if (report.autoIncludedRecipeIds) report.autoIncludedRecipeIds = report.autoIncludedRecipeIds.filter((id:string) => !postBaselineCakes.has(id));
  for (const field of ['recipeBindingMismatches','calculationInputMismatches','calculationEvidenceMismatches'])
    if (report[field]) report[field] = report[field].filter((id:string) => !postBaselineCakes.has(id));
}


function omitNewClassicsForFrozenHistory(report: any) {
  if (!report.results) return;
  const added = report.results.filter((row: {recipeId: string}) => postBaselineClassics.has(row.recipeId));
  if (!added.length) return;
  assert.deepEqual(added.map((row: {recipeId: string}) => row.recipeId).sort(), [...postBaselineClassicIds].sort());
  for (const row of added) {
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA", row.recipeId);
    assert.equal(row.glycemicLoadPerServing, null, row.recipeId);
    assert.equal(row.glycemicLoadRangePerServing, null, row.recipeId);
  }
  report.results = report.results.filter((row: {recipeId: string}) => !postBaselineClassics.has(row.recipeId));
  if (report.calculationInputs) report.calculationInputs = report.calculationInputs.filter(
    (row: {recipeId: string}) => !postBaselineClassics.has(row.recipeId));
  if (report.summary) {
    report.summary.recipes -= added.length;
    report.summary.insufficientSourceData -= added.length;
  }
  if (report.autoIncludedRecipeIds) report.autoIncludedRecipeIds = report.autoIncludedRecipeIds.filter(
    (id: string) => !postBaselineClassics.has(id));
  for (const field of ["recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
    if (report[field]) report[field] = report[field].filter((id: string) => !postBaselineClassics.has(id));
  }
}

function omitBriocheForFrozenHistory(report: any) {
  if (!report.results) return;
  const added = report.results.filter((row: {recipeId: string}) => postBaselineBrioche.has(row.recipeId));
  if (!added.length) return;
  // This is strictly a frozen-history projection, not a change to live GK.
  // Every new recipe must remain explicitly INSUFFICIENT, not a fake zero.
  assert.deepEqual(added.map((row: {recipeId: string}) => row.recipeId).sort(), [...postBaselineBriocheIds].sort());
  for (const row of added) {
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA", row.recipeId);
    assert.equal(row.glycemicLoadPerServing, null, row.recipeId);
  }
  report.results = report.results.filter((row: {recipeId: string}) => !postBaselineBrioche.has(row.recipeId));
  if (report.calculationInputs) report.calculationInputs = report.calculationInputs.filter(
    (row: {recipeId: string}) => !postBaselineBrioche.has(row.recipeId));
  if (report.summary) {
    report.summary.recipes -= added.length;
    report.summary.insufficientSourceData -= added.length;
  }
  if (report.autoIncludedRecipeIds) report.autoIncludedRecipeIds = report.autoIncludedRecipeIds.filter(
    (id: string) => !postBaselineBrioche.has(id));
  for (const field of ["recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
    if (report[field]) report[field] = report[field].filter((id: string) => !postBaselineBrioche.has(id));
  }
}


const reviewedFiBreakfastIds = new Set([
  "rasvakaakao-rouva-keto",
  "lammin-chia-puuro-rouva-keto",
]);

function assertFiBreakfastHasNoNumericGk(row: any) {
  assert.equal(row.status, "INSUFFICIENT SOURCE DATA", row.recipeId);
  assert.equal(row.glycemicLoadPerServing, null, row.recipeId);
  assert.equal(row.glycemicLoadRangePerServing, null, row.recipeId);
}

const changes = new Map(Object.entries(transition.changes));
const bindingFields = {
  recipes: "sourceHashes",
  calculationInputs: "calculationInputHashes",
  calculationEvidence: "calculationEvidenceHashes",
} as const;

function historicalValue<T>(current: T, before: T, after: T, label: string): T {
  if (JSON.stringify(current) === JSON.stringify(before)) return current;
  assert.deepEqual(current, after, label);
  return structuredClone(before);
}

function restoreRows(rows: any[], field: "results" | "calculationInputs") {
  return rows.map(row => {
    const change = changes.get(row.recipeId);
    return change ? historicalValue(row, change.before[field], change.after[field], row.recipeId + " " + field) : row;
  });
}

export function restoreBeforeOriginalContent(report: any) {
  const isReviewedFiBreakfast = (row: { recipeId: string }) => reviewedFiBreakfastIds.has(row.recipeId);
  const addedBreakfasts = report.results?.filter(isReviewedFiBreakfast) ?? [];
  if (addedBreakfasts.length) {
    addedBreakfasts.forEach(assertFiBreakfastHasNoNumericGk);
    report.results = report.results.filter((row: { recipeId: string }) => !isReviewedFiBreakfast(row));
    if (report.calculationInputs) {
      report.calculationInputs = report.calculationInputs.filter((row: { recipeId: string }) => !isReviewedFiBreakfast(row));
    }
    if (report.summary) {
      report.summary.recipes -= addedBreakfasts.length;
      report.summary.insufficientSourceData -= addedBreakfasts.length;
    }
    for (const field of ["autoIncludedRecipeIds", "recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
      if (report[field]) report[field] = report[field].filter((id: string) => !reviewedFiBreakfastIds.has(id));
    }
  }
  omitGlutenFreeFiForFrozenHistory(report);
  omitCakesForFrozenHistory(report);
  omitNewClassicsForFrozenHistory(report);
  omitBriocheForFrozenHistory(report);
  // This recipe was published on main after the historical 326-recipe baseline.
  if (report.results?.some((row: {recipeId: string}) => row.recipeId === mainAddition.recipeId)) {
    assertMainAddition(report);
    report.results = report.results.filter((row: {recipeId: string}) => row.recipeId !== mainAddition.recipeId);
    if (report.calculationInputs) {
      report.calculationInputs = report.calculationInputs.filter((row: {recipeId: string}) => row.recipeId !== mainAddition.recipeId);
    }
    if (report.summary) {
      report.summary.recipes -= 1;
      report.summary.insufficientSourceData -= 1;
    }
    report.autoIncludedRecipeIds = [];
    for (const field of ["recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
      if (report[field]) report[field] = report[field].filter((id: string) => id !== mainAddition.recipeId);
    }
  }
  for (const field of ["results", "calculationInputs"] as const) {
    if (report[field]) {
      report[field] = restoreRows(frozenOriginalRows(report[field], (row: { recipeId: string }) => row.recipeId), field);
    }
  }
  if (report.summary && report.results) {
    report.summary.recipes = report.results.length;
    report.summary.calculated = report.results.filter((row: { status: string }) => row.status === "CALCULATED").length;
    report.summary.insufficientSourceData = report.results.filter((row: { status: string }) => row.status === "INSUFFICIENT SOURCE DATA").length;
  }
  for (const field of ["autoIncludedRecipeIds", "recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
    if (report[field]) report[field] = report[field].filter((id: string) => frozenOriginalRecipeIds.has(id));
  }
  for (const field of Object.values(bindingFields)) {
    if (!report[field]) continue;
    for (const [id, change] of changes) {
      report[field][id] = historicalValue(report[field][id], change.before[field], change.after[field], id + " " + field);
    }
  }
  return report;
}

export function originalContentSourceBefore(file: string, text: string): string {
  if (file === "docs/nutrition/glycemic-load-pilot-input.json") {
    const data = JSON.parse(text);
    data.recipes = restoreRows(data.recipes, "calculationInputs");
    return JSON.stringify(data, null, 2) + "\n";
  }
  if (file === "docs/nutrition/glycemic-load-recipe-bindings.json") {
    const data = JSON.parse(text);
    for (const [key, field] of Object.entries(bindingFields)) {
      for (const [id, change] of changes) {
        data[key][id] = historicalValue(data[key][id], change.before[field], change.after[field], id + " " + key);
      }
    }
    return JSON.stringify(data, null, 2) + "\n";
  }
  return text;
}

function assertMainAddition(report: any) {
  const id = mainAddition.recipeId;
  const classics = report.results.filter((row: {recipeId: string}) => postBaselineClassics.has(row.recipeId));
  if (classics.length) {
    assert.deepEqual(classics.map((row: {recipeId: string}) => row.recipeId).sort(), [...postBaselineClassicIds].sort());
    for (const row of classics) {
      assert.equal(row.status, "INSUFFICIENT SOURCE DATA", row.recipeId);
      assert.equal(row.glycemicLoadPerServing, null, row.recipeId);
      assert.equal(row.glycemicLoadRangePerServing, null, row.recipeId);
    }
  }
  assert.deepEqual((report.autoIncludedRecipeIds ?? []).filter((key: string) => key === id), [id]);
  assert.deepEqual(report.results.filter((row: {recipeId: string}) => row.recipeId === id), [mainAddition.result]);
  if (report.calculationInputs) {
    assert.deepEqual(report.calculationInputs.filter((row: {recipeId: string}) => row.recipeId === id), [mainAddition.input]);
  }
  for (const field of ["recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
    if (report[field]) assert.equal(report[field].filter((key: string) => key === id).length, 1, field);
  }
  assert.equal(mainAddition.result.status, "INSUFFICIENT SOURCE DATA");
  assert.equal(mainAddition.result.glycemicLoadPerServing, null);
}

export function assertOriginalContentTransition(report: any) {
  assertMainAddition(report);
  const addedBreakfasts = report.results.filter((row: { recipeId: string }) => reviewedFiBreakfastIds.has(row.recipeId));
  assert.deepEqual(addedBreakfasts.map((row: { recipeId: string }) => row.recipeId).sort(), [...reviewedFiBreakfastIds].sort());
  addedBreakfasts.forEach(assertFiBreakfastHasNoNumericGk);
  for (const [id, change] of changes) {
    for (const field of ["results", "calculationInputs"] as const) {
      assert.deepEqual(report[field].filter((r: {recipeId: string}) => r.recipeId === id), [change.after[field]], id + " " + field);
    }
    for (const field of Object.values(bindingFields)) {
      assert.equal(report[field][id], change.after[field], id + " " + field);
    }
    assert.equal(change.after.results.status, "INSUFFICIENT SOURCE DATA");
    assert.equal(change.after.results.glycemicLoadPerServing, null);
    assert.equal(change.after.results.glycemicLoadRangePerServing, null);
  }
}

// Recipe notes in the audit follow the checkout's line endings.
function inventoryRowWithLfNotes<T extends {notes: string}>(row: T): T {
  return { ...row, notes: row.notes.replaceAll("\r\n", "\n") };
}

// Inventory rows carry recipe text metadata even when the macro values are missing.
export function originalContentInventoryBefore(rows: any[]) {
  const addedBreakfasts = rows.filter(row => reviewedFiBreakfastIds.has(row.recipe_id));
  assert.deepEqual(addedBreakfasts.map(row => row.recipe_id).sort(), [...reviewedFiBreakfastIds].sort());
  for (const row of addedBreakfasts) {
    assert.equal(row.source_path, `reseptit/aamupalat/${row.recipe_id}.md`);
    assert.equal(row.status, "INSUFFICIENT SOURCE DATA");
    assert.ok(Object.values(row.values).every(value => value === null));
  }
  rows = rows.filter(row => !reviewedFiBreakfastIds.has(row.recipe_id));
  const addedGlutenFree = rows.filter(row => postBaselineGlutenFreeFi.has(row.recipe_id));
  if (addedGlutenFree.length) {
    const present = addedGlutenFree.map(row => row.recipe_id).sort();
    assert.ok(allowedGlutenFreeHistoryStages.some(ids => JSON.stringify(present) === JSON.stringify([...ids].sort())),
      "Inventory may contain only exact reviewed 2, 3 or 5 gluten-free recipes");
    for (const row of addedGlutenFree) {
      const expectedCategory = row.recipe_id === "gluteeniton-perunajauhokakkupohja" || row.recipe_id === "gluteeniton-uunipannukakku" ? "jalkiruoat" : "leivonnaiset";
      assert.equal(row.source_path, `reseptit/${expectedCategory}/${row.recipe_id}.md`, row.recipe_id);
      assert.equal(row.carbs_total_per_serving_g ?? null, null, row.recipe_id);
    }
  }
  rows = rows.filter(row => !postBaselineGlutenFreeFi.has(row.recipe_id));
  const addedCakes = rows.filter(row => postBaselineCakes.has(row.recipe_id));
  if (addedCakes.length) {
    assert.deepEqual(addedCakes.map(row => row.recipe_id).sort(), [...postBaselineCakeIds].sort());
    for (const row of addedCakes) assert.equal(row.source_path, 'reseptit/jalkiruoat/' + row.recipe_id + '.md', row.recipe_id);
  }
  rows = rows.filter(row => !postBaselineCakes.has(row.recipe_id));
  const classics = rows.filter(row => postBaselineClassics.has(row.recipe_id));
  if (classics.length) {
    assert.deepEqual(classics.map(row => row.recipe_id).sort(), [...postBaselineClassicIds].sort());
    for (const row of classics) {
      assert.equal(row.carbs_total_per_serving_g ?? null, null, row.recipe_id);
    }
  }
  rows = rows.filter(row => !postBaselineClassics.has(row.recipe_id));
  const brioche = rows.filter(row => postBaselineBrioche.has(row.recipe_id));
  if (brioche.length) assert.deepEqual(brioche.map(row => row.recipe_id).sort(), [...postBaselineBriocheIds].sort());
  rows = rows.filter(row => !postBaselineBrioche.has(row.recipe_id));
  const addition = rows.filter(row => row.recipe_id === mainAddition.recipeId);
  assert.deepEqual(addition.map(inventoryRowWithLfNotes), [inventoryRowWithLfNotes(mainAddition.inventory)]);
  return rows.filter(row => row.recipe_id !== mainAddition.recipeId).map(row => {
    const change = changes.get(row.recipe_id);
    if (!change || !("inventory" in change.after) || !("inventory" in change.before)) return row;
    assert.deepEqual(inventoryRowWithLfNotes(row), inventoryRowWithLfNotes(change.after.inventory), row.recipe_id + " current nutrition inventory");
    return structuredClone(change.before.inventory);
  });
}
