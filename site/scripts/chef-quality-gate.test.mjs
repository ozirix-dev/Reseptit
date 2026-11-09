import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  parseRecipeMarkdown, gitBlobSha, evaluateProbe, compareRecipeVersions,
  classifyPilotCase, runPilot, markdownPilotReport,
} from "./chef-quality-gate.mjs";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const ledgerPath = path.join(root, "docs/reviews/chef-quality-pilot-five-20261109.json");
const load = async () => JSON.parse(await readFile(ledgerPath, "utf8"));

test("five distinct real FI recipes are pinned to their exact Git blobs", async () => {
  const pilot = await load();
  assert.equal(pilot.cases.length, 5);
  assert.equal(new Set(pilot.cases.map((x) => x.recipe_id)).size, 5);
  for (const row of pilot.cases) {
    const raw = await readFile(path.join(root, row.path));
    assert.equal(gitBlobSha(raw), row.source_blob_sha, row.recipe_id + " content is stale");
    const parsed = parseRecipeMarkdown(raw.toString("utf8"), row.path);
    assert.equal(parsed.data.recipe_id, row.recipe_id);
    assert.equal(parsed.data.language, "fi");
    assert.equal(parsed.data.status, "published");
  }
});

test("pilot routes all five observed cases without publishing anything automatically", async () => {
  const result = await runPilot(await load(), root);
  assert.equal(result.outcome, "PILOT_EVIDENCE_CURRENT");
  assert.equal(result.inspected, 5);
  assert.equal(result.stale, 0);
  const states = Object.fromEntries(result.results.map((row) => [row.recipe_id, row.decision]));
  assert.deepEqual(states, {
    "indonesialainen-serabi-kookospannukakku": "TEXT_REPAIR_CANDIDATE",
    "indonesialainen-bakwan-maissifritter": "HOLD_MATERIAL_EVIDENCE",
    "pohjoisafrikkalainen-bissara": "HOLD_TIME_SAFETY",
    "japanilainen-yaki-onigiri-misolla": "HOLD_MULTI_AXIS",
    "indialainen-poha-maapahkinoilla": "HOLD_TRANSLATION_SYNC",
  });
  assert.equal(result.textRepairCandidates, 1);
  assert.equal(result.holdCases, 4);
  const serabi = result.results.find((r) => r.recipe_id === "indonesialainen-serabi-kookospannukakku");
  assert.ok(serabi.assessment.blockers.includes("EXTERNAL_PR_NOT_VERIFIED"));
  assert.equal(serabi.assessment.requiresMethodMeaningReview, true);
  assert.equal(serabi.assessment.requiresGlycemicReview, true);
  assert.ok(result.results.every((row) => row.releaseEligible === false));
  assert.match(markdownPilotReport(result), /Publication: \*\*NO\*\*/);
});

test("published translations are read from actual locale subdirectories", async () => {
  const result = await runPilot(await load(), root);
  const poha = result.results.find((r) => r.recipe_id === "indialainen-poha-maapahkinoilla");
  assert.deepEqual(poha.assessment.translatedLocales, ["en", "sv", "th"]);
  assert.equal(poha.assessment.requiresTranslationSync, true);
});

test("missing water in a flour batter is not treated like boiling or rinsing water", async () => {
  const result = await runPilot(await load(), root);
  const bakwan = result.results.find((r) => r.recipe_id === "indonesialainen-bakwan-maissifritter");
  assert.equal(bakwan.assessment.requiresNutritionReview, true);
  assert.equal(bakwan.decision, "HOLD_MATERIAL_EVIDENCE");
  assert.ok(bakwan.probes.some((p) => p.probe === "ingredient_absent" && p.pass));
});

test("confirmed amounts and stated times are checked from source, not guessed", async () => {
  const result = await runPilot(await load(), root);
  const bissara = result.results.find((r) => r.recipe_id === "pohjoisafrikkalainen-bissara");
  assert.ok(bissara.probes.some((p) => p.probe === "time_equals" && p.observed === 25));
  const onigiri = result.results.find((r) => r.recipe_id === "japanilainen-yaki-onigiri-misolla");
  assert.equal(onigiri.probes.filter((p) => p.probe === "ratio_at_least" && p.pass).length, 2);
  assert.ok(onigiri.probes.every((p) => p.pass));
  assert.deepEqual(onigiri.assessment.blockers.slice(0,2), ["MATERIAL_QUANTITY_OR_LIQUID", "TIME_OR_HANDLING"]);
  assert.equal(onigiri.assessment.requiresNutritionReview, true);
  assert.equal(onigiri.assessment.requiresGlycemicReview, true);
});

test("changed source snapshot invalidates observations instead of silently passing", async () => {
  const pilot = await load();
  pilot.cases[0].source_blob_sha = "0".repeat(40);
  const result = await runPilot(pilot, root);
  assert.equal(result.outcome, "PILOT_EVIDENCE_STALE");
  assert.equal(result.stale, 1);
  assert.equal(result.results[0].decision, "STALE_EVIDENCE");
  assert.ok(!result.results[0].releaseEligible);
});

test("false observation invalidates pilot evidence even if review says it is open", async () => {
  const pilot = await load();
  pilot.cases[1].probes[1].item = "maissinjyviä";
  const result = await runPilot(pilot, root);
  assert.equal(result.stale, 1);
  assert.equal(result.results[1].decision, "STALE_EVIDENCE");
});

function modelRecipe(ingredientRows, steps, extras = {}) {
  return {
    data: {
      recipe_id: "test-source", language: "fi", status: "published",
      ingredients: ingredientRows, servings: 2,
      time_total_min: 20, cooking_method: ["paistaminen"],
      carbs_net_per_serving_g: 20,
      carbs_total_per_serving_g: 22,
      protein_per_serving_g: 10,
      fat_per_serving_g: 8,
      ...extras,
    },
    instructions: steps,
  };
}

test("text-only changes are not equivalent to a fully reviewed culinary method", () => {
  const before = modelRecipe([{ item: "riisijauhoa", amount: 100, unit: "g" }], "1. Tee taikina.");
  const after = modelRecipe([{ item: "riisijauhoa", amount: 100, unit: "g" }], "1. Sekoita ja paista.");
  const delta = compareRecipeVersions(before, after);
  assert.equal(delta.textOnly, true);
  assert.equal(delta.materialChanged, false);
  assert.equal(delta.requiresCulinaryReview, true);
  assert.equal(delta.requiresGlycemicReview, true, "method meaning remains unverified");
  assert.equal(delta.approval, "NOT_AUTO_APPROVED");
  // The review cannot be bypassed with a bare boolean. CI must not treat
  // "text-only" as scientific evidence of equivalent preparation or GI/GL.
  const claimedReviewed = compareRecipeVersions(before, after, { methodMeaningReviewed: true });
  assert.equal(claimedReviewed.requiresGlycemicReview, true);
  assert.equal(claimedReviewed.requiresMethodMeaningReview, true);
  assert.equal(claimedReviewed.requiresTranslationReview, true);
});

test("added oil or changed servings can never pass as a text-only edit", () => {
  const before = modelRecipe([{ item: "vehnäjauho", amount: 100, unit: "g" }], "1. Sekoita.");
  const changed = modelRecipe([
    { item: "vehnäjauho", amount: 100, unit: "g" },
    { item: "öljyä", amount: 10, unit: "g" },
  ], "1. Sekoita öljy ja jauho.", { servings: 4 });
  const delta = compareRecipeVersions(before, changed);
  assert.equal(delta.materialChanged, true);
  assert.equal(delta.textOnly, false);
  assert.equal(delta.requiresNutritionEvidence, true);
  assert.equal(delta.requiresGlycemicReview, true);
  assert.deepEqual(delta.changedFields.sort(), ["ingredients", "servings"]);
});

test("unknown finding classes are rejected rather than treated as approved", async () => {
  const pilot = await load();
  pilot.cases[0].findings[0].kind = "everything-is-fine";
  await assert.rejects(runPilot(pilot, root), /invalid finding kind/);
});

test("no release verdict is possible even with no high-priority findings", async () => {
  const data = (await load()).cases[0];
  const alternative = { ...data, findings: [{kind:"generic_instruction",status:"fixed",severity:"P2",explanation:"Historical note is resolved through a separate review."}] };
  const snapshot = parseRecipeMarkdown(await readFile(path.join(root, data.path), "utf8"));
  const result = classifyPilotCase(alternative, snapshot, []);
  assert.equal(result.releaseEligible, false);
  assert.equal(result.decision, "EDITORIAL_REVIEW");
});
