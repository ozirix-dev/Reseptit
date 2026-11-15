import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { before, test } from "node:test";
import type { RouteContent } from "../src/content/route-data";
import { localeIndexes } from "../src/content/route-data";
import { contentManifest } from "../src/generated/routes.generated";
import { f25SourceGatePreflight } from "../scripts/f25-source-release-gate";
import { publicRecipeQuarantineIds } from "../scripts/public-recipe-quarantine";
import { git, readRecipeStateInputs, repoRoot, type RecipeStateInputs } from "../scripts/recipe-state-inputs";
import { projectRecipeState } from "../scripts/recipe-state";
import { buildRegistry, contentHash } from "../scripts/translation-review";

let inputs: RecipeStateInputs;
let state: ReturnType<typeof projectRecipeState>;
const commit = git("rev-parse", "HEAD").trim();
const withId = (id: string) => {
  const row = state.recipes.find(row => row.sourceRecipeId === id);
  assert.ok(row, id);
  return row;
};
const readPayload = async (route: string): Promise<RouteContent> => {
  assert.ok(contentManifest[route], route);
  return JSON.parse(await readFile(path.join(repoRoot, "site/public/data", contentManifest[route]), "utf8"));
};

before(async () => {
  inputs = await readRecipeStateInputs(commit);
  state = projectRecipeState(commit, inputs);
});

test("state is deterministic, and every catalog entry and recipe payload agrees with the projection", async () => {
  assert.equal(JSON.stringify(projectRecipeState(commit, await readRecipeStateInputs(commit))), JSON.stringify(state));
  const projectedRoutes = state.recipes.flatMap(row => row.languages.flatMap(locale => locale.route ? [locale.route] : []));
  const catalogs = await Promise.all(Object.values(localeIndexes).filter(route => contentManifest[route]).map(readPayload));
  assert.deepEqual(projectedRoutes.sort(), catalogs.flatMap(catalog => catalog.recipes.map(recipe => recipe.routePath)).sort());

  const published = state.recipes.filter(row => row.publicSlug);
  assert.ok(published.length > 0);
  for (const row of published) {
    const locales = row.languages.flatMap(locale => locale.route ? [{ locale: locale.locale, routePath: locale.route }] : []);
    for (const { locale, routePath } of locales) {
      const payload = await readPayload(routePath);
      assert.equal(payload.path, routePath);
      assert.equal(payload.recipe?.recipeId, row.sourceRecipeId);
      assert.equal(payload.recipe?.locale, locale);
      assert.deepEqual(payload.translations.sort((a, b) => a.locale.localeCompare(b.locale)),
        [...locales].sort((a, b) => a.locale.localeCompare(b.locale)));
    }
  }
});

test("quarantines remain absent and registered successors retain the exact predecessor identity", () => {
  const projectedSources = new Set(state.recipes.map(row => row.sourceRecipeId));
  for (const id of publicRecipeQuarantineIds) {
    assert.equal(inputs.publicRecipes.some(recipe => recipe.recipeId === id), false, id);
    const predecessor = state.recipes.find(row => row.successorReferences.some(link => link.sourceRecipeId === id));
    if (predecessor) {
      assert.equal(projectedSources.has(id), false);
      assert.equal(predecessor.canonicalRecipeId, id);
      assert.equal(predecessor.publicSlug, predecessor.successorReferences[0].publicSlug);
    } else {
      assert.equal(withId(id).publicState, "quarantine");
    }
  }
  for (const gate of f25SourceGatePreflight().rows.filter(row => !row.authorized)) {
    const current = state.recipes.find(row => row.sourceRecipeId === gate.recipe_id);
    if (current) {
      assert.ok(current.currentBlockers.some(block => block.code === gate.reason));
      assert.ok(current.languages.filter(lang => lang.locale !== "fi").every(lang => !lang.route));
    } else {
      assert.ok(state.recipes.some(row => row.successorReferences.some(link =>
        link.sourceRecipeId === gate.recipe_id && link.historicalF25Hold === gate.reason)));
    }
  }
  for (const row of state.recipes) {
    const source = inputs.sources.find(item => item.file === row.sourcePath)!;
    if (source.status !== "draft") continue;
    assert.equal(row.publicState, "draft");
    assert.equal(row.publicSlug, null);
    if (!source.imagePath) assert.equal(row.imageStatus.state, "missing");
  }

  const successor = state.recipes.find(row => row.successorReferences.length);
  if (successor) {
    const old = successor.successorReferences[0];
    assert.ok(old.gitBlob);
    assert.ok(!successor.currentBlockers.some(block => block.code === "quarantine"));
    const changed = { ...inputs, sources: inputs.sources.map(source => source.file === old.path ? { ...source, blob: "changed" } : source) };
    const conflict = projectRecipeState(commit, changed);
    assert.ok(conflict.conflicts.some(item => item.recipeId === successor.sourceRecipeId && item.code === "unverified-successor"));
    assert.equal(conflict.recipes.find(row => row.sourceRecipeId === old.sourceRecipeId)?.publicState, "quarantine");
  }
});

test("effective FI and evidence statuses preserve the build, including absent original GK", () => {
  for (const row of state.recipes) {
    const source = inputs.sources.find(item => item.file === row.sourcePath)!;
    if (source.hash !== source.effectiveHash && row.publicState === "visible") {
      assert.equal(row.effectiveContentHash, source.effectiveHash);
    }
    const original = inputs.publicGk.find(item => item.recipeId === row.sourceRecipeId);
    assert.equal(row.glycemicLoadStatus.publicOriginal?.point ?? null, original?.glycemicLoadPerServing ?? null);
    assert.deepEqual(row.glycemicLoadStatus.publicOriginal?.range ?? null, original?.glycemicLoadRangePerServing ?? null);
    assert.equal(row.nutritionStatus, inputs.nutrition.inventory.find(item => item.recipe_id === row.sourceRecipeId)?.status ?? "NOT AUDITED");
  }
  for (const pending of inputs.glycemic.newPublicGkPendingSources) {
    const row = state.recipes.find(row => row.sourceRecipeId === pending.recipeId);
    if (!row) continue;
    assert.equal(row.glycemicLoadStatus.publicOriginal, null);
    assert.equal(row.glycemicLoadStatus.auditStatus, "PENDING REVIEW");
  }
});

test("draft translations and stale pair reviews stay distinct from publication", () => {
  const reviewed = inputs.review.rows.find(row => row.codex_review_status === "REVIEW CURRENT" && row.codex_review)!;
  const candidate = state.recipes.find(row => row.publicSlug && row.sourceRecipeId !== reviewed.recipe_id)!;
  const candidateId = candidate.sourceRecipeId;
  const draft = { ...inputs.sources.find(source => source.file === candidate.sourcePath)!, language: "en" as const,
    status: "draft" as const, file: "kaannokset/en/draft.md" };
  const key = `${reviewed.recipe_id}:${reviewed.locale}`;
  const rows = buildRegistry(inputs.review.audit, Object.fromEntries(Object.entries(inputs.review.files)
    .map(([file, raw]) => [file, contentHash(raw)])), [], { [key]: { ...reviewed.codex_review!, source_hash: "0".repeat(64) } });
  const changed = projectRecipeState(commit, { ...inputs,
    sources: [...inputs.sources.filter(source => source.language !== "en" || source.recipe_id !== candidateId), draft],
    publicRecipes: inputs.publicRecipes.filter(recipe => recipe.locale !== "en" || recipe.recipeId !== candidateId),
    review: { ...inputs.review, rows: rows.filter(row => row.locale !== "en" || row.recipe_id !== candidateId) } });
  const language = (id: string, locale: string) => changed.recipes.find(row => row.sourceRecipeId === id)!.languages.find(lang => lang.locale === locale)!;
  assert.equal(language(candidateId, "en").state, "draft");
  assert.equal(language(candidateId, "en").route, null);
  const stale = language(reviewed.recipe_id, reviewed.locale);
  assert.equal(stale.review?.codex, "REVIEW STALE");
  assert.equal(stale.state, "public");
});
