import assert from "node:assert/strict";
import transition from "../../docs/nutrition/gk-original-content-transition.json";

const mainAddition = transition.mainAddition;
export const mainAdditionFiles: Readonly<Record<string, string>> = mainAddition.addedFileHashes;

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
    if (report[field]) report[field] = restoreRows(report[field], field);
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
  assert.deepEqual(report.autoIncludedRecipeIds, [id]);
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
  const addition = rows.filter(row => row.recipe_id === mainAddition.recipeId);
  assert.deepEqual(addition.map(inventoryRowWithLfNotes), [inventoryRowWithLfNotes(mainAddition.inventory)]);
  return rows.filter(row => row.recipe_id !== mainAddition.recipeId).map(row => {
    const change = changes.get(row.recipe_id);
    if (!change || !("inventory" in change.after) || !("inventory" in change.before)) return row;
    assert.deepEqual(inventoryRowWithLfNotes(row), inventoryRowWithLfNotes(change.after.inventory), row.recipe_id + " current nutrition inventory");
    return structuredClone(change.before.inventory);
  });
}
