import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import manifest from "./history/gk005-partial-nutrition-transition.json";
import { restoreGk005Source, restoreGk005Inventory } from "./history/gk005-partial-nutrition-transition";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { calculate, type Calculation } from "../scripts/nutrition-model";
import { nutritionCalculationFingerprint, readNutritionFieldApproval, resolveNutritionFieldApproval } from "../scripts/nutrition-field-approval";
import { verifyNutritionEvidence } from "../scripts/nutrition-evidence";
import { portionPreparationHash, loadReviewedPortions, projectPortionEvidence } from "../scripts/gk-portion-projection";
import { recipeBindingHash, exactRecipeTextBindingMatches } from "../scripts/glycemic-load-recipe-binding";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { semanticHash } from "../scripts/translation-semantic-review";
import { siteContent } from "../src/generated/content.generated";
import { glycemicLoadPilotResults, glycemicLoadPortions } from "../src/generated/glycemic-load-pilot.generated";

const root = path.resolve(import.meta.dirname, "../..");
const read = (file: string) => readFile(path.join(root, file), "utf8");
const json = async (file: string) => JSON.parse(await read(file));
const sha = (text: string) => createHash("sha256").update(text.replaceAll("\r\n", "\n")).digest("hex");
const recipe = (text: string) => recipeFrontmatterSchema.parse(parseMarkdown(text)!.data);

test("GK-005 reconstructs only eight exact predecessor files and rejects mutated transitions", async () => {
  assert.equal(Object.keys(manifest.files).length, 8);
  for (const [file, transition] of Object.entries(manifest.files)) {
    const live = await read(file);
    const prior = restoreGk005Source(file, live);
    assert.equal(sha(prior), transition.beforeSha256, file);
    assert.notEqual(prior, live, file);
    assert.throws(() => restoreGk005Source(file, live + "\nUnreviewed change\n"), /unreviewed GK-005 successor/);
    assert.throws(() => restoreGk005Source(file, prior), /unreviewed GK-005 successor/);
    const corrupt = { ...manifest.files, [file]: { ...transition, beforeGitBlob: "0".repeat(40) } };
    assert.throws(() => restoreGk005Source(file, live, corrupt), /historical transition fixture changed/);
    const corruptInverse = { ...manifest.files, [file]: { ...transition, inverseEdits: [["wrong", "fixture"]] } };
    assert.throws(() => restoreGk005Source(file, live, corruptInverse), /historical transition fixture changed/);
    const before = recipe(prior), after = recipe(live);
    assert.deepEqual(after, { ...before, protein_per_serving_g: after.protein_per_serving_g, fat_per_serving_g: after.fat_per_serving_g }, file);
    assert.equal(before.protein_per_serving_g, null);
    assert.equal(before.fat_per_serving_g, null);
    assert.equal(after.carbs_net_per_serving_g, null);
    assert.equal(after.carbs_total_per_serving_g, null);
    assert.equal(sha(live.replaceAll("\r\n", "\n")), transition.afterSha256);
    assert.equal(semanticHash({ data: before, content: parseMarkdown(prior)!.content }), transition.priorSemanticSha256, file);
    assert.equal(semanticHash({ data: after, content: parseMarkdown(live)!.content }), transition.candidateSemanticSha256, file);
  }
  assert.throws(() => restoreGk005Source("reseptit/paaruoat/marokkolainen-couscous.md", ""), /unknown GK-005 source/);
});

test("GK-005 canonical calculation and verification keep only protein and fat as candidates", async () => {
  for (const [id, entry] of Object.entries(manifest.recipes)) {
    const sourcePath = `reseptit/paaruoat/${id}.md`;
    const text = await read(sourcePath);
    const data = recipe(text);
    const previous = recipe(restoreGk005Source(sourcePath, text));
    const evidenceText = await read(`docs/nutrition/calculations/${id}.json`);
    const evidence = JSON.parse(evidenceText) as Calculation;
    assert.equal(sha(evidenceText), entry.rawEvidenceSha256, id);
    assert.equal(nutritionCalculationFingerprint(evidence), entry.approval.evidenceSha256, id);
    assert.equal(evidence.publicationStatus, "WITHHELD_SOURCE_INCOMPLETE", id);
    const translations = await Promise.all(Object.values(entry.candidateExactRecipeText.locales).map(async ({ path }) => ({ path, data: recipe(await read(path)) })));
    const oldTranslations = await Promise.all(translations.map(async ({ path }) => ({ path, data: recipe(restoreGk005Source(path, await read(path))) })));
    assert.equal(verifyNutritionEvidence(previous, evidence, oldTranslations).status, "INSUFFICIENT SOURCE DATA", id);
    const approval = await resolveNutritionFieldApproval(root, evidence, entry.approval);
    assert.ok(approval, id);
    const calculated = calculate(evidence, { verifiedAvailableRows: approval.verifiedAvailableRows });
    assert.equal(calculated.status, "INSUFFICIENT SOURCE DATA", id);
    assert.equal(calculated.perServing.protein, entry.protein, id);
    assert.equal(calculated.perServing.fat, entry.fat, id);
    assert.equal(calculated.perServing.netCarbohydrate, null, id);
    assert.equal(calculated.totalCarbohydratePerServingG, null, id);
    assert.ok(calculated.omissionWithinTolerance, id);
    const checked = verifyNutritionEvidence(data, evidence, translations, approval);
    const expected = { carbs_net_per_serving_g: null, carbs_total_per_serving_g: null,
      protein_per_serving_g: entry.protein, fat_per_serving_g: entry.fat };
    assert.equal(checked.status, "PARTIAL ESTIMATE WITH EVIDENCE", id);
    assert.deepEqual(checked.errors, [], id);
    assert.deepEqual(checked.values, expected, id);
    assert.deepEqual(checked.fieldEstimates, expected, id);

    // Test the real gate, not a replacement validator or altered tolerance.
    const reject = (candidate: typeof data, candidateEvidence = evidence, targets = translations, scope = approval) => {
      const result = verifyNutritionEvidence(candidate, candidateEvidence, targets, scope);
      assert.equal(result.status, "CONFLICT REQUIRES REVIEW", id);
      assert.ok(result.errors.length > 0, id);
    };
    const badHash = await resolveNutritionFieldApproval(root, evidence, { ...entry.approval, evidenceSha256: "0".repeat(64) });
    const missingField = await resolveNutritionFieldApproval(root, evidence, { ...entry.approval, fields: ["protein_per_serving_g"] });
    const extraField = await resolveNutritionFieldApproval(root, evidence, { ...entry.approval, fields: [...entry.approval.fields, "carbs_total_per_serving_g"] });
    reject(data, evidence, translations, badHash);
    reject(data, evidence, translations, missingField);
    reject(data, evidence, translations, extraField);
    reject({ ...data, protein_per_serving_g: entry.protein + 1 });
    reject({ ...data, fat_per_serving_g: null });
    reject({ ...data, carbs_net_per_serving_g: 0 });
    reject({ ...data, carbs_total_per_serving_g: 0 });
    reject({ ...data, servings: data.servings + 1 });
    reject({ ...data, ingredients: data.ingredients.map((row, index) => index === 0 ? { ...row, amount: (row.amount ?? 0) + 1 } : row) });
    reject({ ...data, ingredients: data.ingredients.map((row, index) => index === 0 ? { ...row, unit: "kg" } : row) });
    reject(data, { ...evidence, scope: evidence.scope + " unreviewed edit" });
    reject(data, evidence, translations.map((target, index) => index === 0 ? { ...target, data: { ...target.data, fat_per_serving_g: 0 } } : target));
  }
});

test("GK-005 approved successor retains exact GK and portion evidence without historical shortcuts in live gates", async () => {
  const bindings = await json("docs/nutrition/glycemic-load-recipe-bindings.json");
  const aliases = (await json("docs/nutrition/glycemic-load-recipe-aliases.json")).aliases;
  const reviews = await loadReviewedPortions(root);
  const report = await json("tmp/nutrition/glycemic-load-pilot.json");
  const audit = await json("tmp/nutrition/audit.json");
  const historical = restoreGk005Inventory(audit.inventory);
  for (const [id, entry] of Object.entries(manifest.recipes)) {
    const sourcePath = `reseptit/paaruoat/${id}.md`;
    const live = await read(sourcePath), prior = restoreGk005Source(sourcePath, live);
    const evidence = await json(`docs/nutrition/calculations/${id}.json`) as Calculation;
    const approval = await readNutritionFieldApproval(root, evidence, { requireBatchMembership: true });
    assert.deepEqual(approval?.scope, entry.approval, id + ": active batch approval");
    assert.deepEqual(bindings.exactRecipeText[id], entry.candidateExactRecipeText, id + ": current whole-text binding");
    assert.equal(recipeBindingHash(live, aliases), entry.recipeBinding, id);
    assert.equal(recipeBindingHash(prior, aliases), entry.recipeBinding, id);
    assert.equal(bindings.recipes[id], entry.recipeBinding, id);
    assert.equal(bindings.calculationInputs[id], entry.calculationInput, id);
    assert.equal(bindings.calculationEvidence[id], entry.calculationEvidence, id);
    assert.equal(report.sourceHashes[id], entry.recipeBinding, id);
    assert.equal(report.calculationInputHashes[id], entry.calculationInput, id);
    assert.equal(report.calculationEvidenceHashes[id], entry.calculationEvidence, id);
    for (const key of ["recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches"]) {
      assert.ok(!report[key].includes(id), id + ": " + key);
    }
    assert.equal(exactRecipeTextBindingMatches(entry.candidateExactRecipeText.sourceSha256, live), true);
    assert.equal(exactRecipeTextBindingMatches(entry.candidateExactRecipeText.sourceSha256, live + "\nUnreviewed\n"), false);
    for (const { path, sha256 } of Object.values(entry.candidateExactRecipeText.locales)) {
      const target = (await read(path)).replaceAll("\r\n", "\n");
      assert.equal(exactRecipeTextBindingMatches(sha256, recipeTextForApprovedSnapshot(path, target)), true, path);
      assert.equal(exactRecipeTextBindingMatches(sha256, target + "\nUnreviewed\n"), false, path);
    }
    const currentReview = reviews[id];
    assert.equal(currentReview.preparationSha256, entry.afterPreparation, id);
    assert.equal(currentReview.nutritionSha256, entry.rawEvidenceSha256, id);
    assert.equal(portionPreparationHash(prior), entry.beforePreparation, id);
    assert.equal(portionPreparationHash(live), entry.afterPreparation, id);
    const before = await projectPortionEvidence(root, id, prior, { ...currentReview, preparationSha256: entry.beforePreparation });
    const after = await projectPortionEvidence(root, id, live, currentReview);
    assert.deepEqual(after, before, id + ": same reviewed portion scope");
    assert.equal(after.portion.availableCarbs, undefined, id);
    await assert.rejects(projectPortionEvidence(root, id, live, { ...currentReview, preparationSha256: entry.beforePreparation }), /reviewed preparation or serving notes changed/);
    const result = report.results.find((row: { recipeId: string }) => row.recipeId === id);
    assert.equal(result?.status, "CALCULATED", id);
    assert.equal(result?.glycemicLoadPerServing, entry.gk, id);
    const publicResult = glycemicLoadPilotResults.find(row => row.recipeId === id);
    assert.equal(publicResult?.glycemicLoadPerServing, entry.gk, id);
    assert.equal(glycemicLoadPortions[id]?.availableCarbs, undefined, id);
    const locales = siteContent.recipes.filter(row => row.recipeId === id);
    assert.deepEqual(locales.map(row => row.locale).sort(), ["en", "fi", "sv", "th"], id);
    for (const page of locales) {
      assert.deepEqual(page.nutrition, { carbsNetG: null, carbsTotalG: null, proteinG: entry.protein, fatG: entry.fat }, page.routePath);
      const rec = Object.values(manifest.files).find(row => row.recipeId === id && row.locale === page.locale);
      assert.ok(rec, page.routePath);
      const note = rec.inverseEdits[0]![0]!;
      assert.ok(page.notesHtml.includes(note), page.routePath + ": localized partial nutrition scope");
    }
    const row = audit.inventory.find((row: { recipe_id: string }) => row.recipe_id === id);
    assert.equal(row?.status, "PARTIAL ESTIMATE WITH EVIDENCE", id);
    assert.deepEqual(row?.values, { carbs_net_per_serving_g: null, carbs_total_per_serving_g: null,
      protein_per_serving_g: entry.protein, fat_per_serving_g: entry.fat }, id);
    assert.deepEqual(historical.find(row => row.recipe_id === id), entry.inventory.before, id);
    const mutated = audit.inventory.map((item: { recipe_id: string; notes: string }) => item.recipe_id === id ? { ...item, notes: item.notes + " unreviewed" } : item);
    assert.throws(() => restoreGk005Inventory(mutated), /unreviewed GK-005 live inventory/);
  }
});
