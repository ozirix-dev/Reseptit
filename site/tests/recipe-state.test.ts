import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { before, test } from "node:test";
import type { RouteContent } from "../src/content/route-data";
import { localeIndexes } from "../src/content/route-data";
import { withholdF25Nutrition } from "../src/features/recipes/f25-nutrition-withhold";
import { parseRecipeLibraryPagePath } from "../src/features/recipes/recipe-pagination";
import type { SearchRecipe } from "../src/features/recipes/recipe-search";
import { contentManifest } from "../src/generated/routes.generated";
import { f25SourceGatePreflight } from "../scripts/f25-source-release-gate";
import { publicRecipeQuarantineIds } from "../scripts/public-recipe-quarantine";
import { applyReviewedGramListSpacing } from "../scripts/public-recipe-copy-r2";
import { projectEggWeightReferences } from "../scripts/public-ingredient-list";
import { git, matchesReviewedReleasePresentation, onlyCookingMethodMetadataChanged, readRecipeStateInputs, recipePresentationDifferences, repoRoot, reviewedReleasePresentation, verifiedFiEggPresentationWeights, type RecipeStateInputs } from "../scripts/recipe-state-inputs";
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
  const searchIndexes = await Promise.all(catalogs.map(async ({ catalog }) => {
    assert.ok(catalog);
    const data: SearchRecipe[] = JSON.parse(await readFile(path.join(repoRoot, "site/public/data", catalog.searchFile), "utf8"));
    assert.equal(data.length, catalog.total);
    return data;
  }));
  const libraryPaths = Object.keys(contentManifest).filter(route => parseRecipeLibraryPagePath(route));
  const libraryPages = await Promise.all(libraryPaths.map(readPayload));
  const expectedRoutes = projectedRoutes.sort();
  assert.deepEqual(searchIndexes.flat().map(recipe => recipe.routePath).sort(), expectedRoutes);
  assert.deepEqual(libraryPages.flatMap(page => page.recipes.map(recipe => recipe.routePath)).sort(), expectedRoutes);

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
    const original = withholdF25Nutrition(row.sourceRecipeId, "fi") ? undefined
      : inputs.publicGk.find(item => item.recipeId === row.sourceRecipeId);
    assert.equal(row.glycemicLoadStatus.publicOriginal?.point ?? null, original?.glycemicLoadPerServing ?? null);
    assert.deepEqual(row.glycemicLoadStatus.publicOriginal?.range ?? null, original?.glycemicLoadRangePerServing ?? null);
    assert.equal(row.nutritionStatus, inputs.nutrition.inventory.find(item => item.recipe_id === row.sourceRecipeId)?.status ?? "NOT AUDITED");
  }
  for (const pending of inputs.glycemic.newPublicGkPendingSources) {
    const row = state.recipes.find(row => row.sourceRecipeId === pending.recipeId);
    if (!row) continue;
    const status = row.glycemicLoadStatus;
    assert.equal(status.auditStatus, "PENDING REVIEW");
    if (status.publicOriginal !== null) {
      assert.ok(status.publicOriginalVerbalGk || status.publicOriginal.point === 0,
        `${pending.recipeId}: only explicitly reviewed verbal or zero GK may supplement the pending legacy audit`);
    }
  }
});

test("reviewed gram-list punctuation cannot change gram amounts, decimal commas or preparation", () => {
  const raw = "Lisää kookosmaito,2,6 g kanelia ja 5 g vaniljaa.";
  const spaced = "Lisää kookosmaito, 2,6 g kanelia ja 5 g vaniljaa.";
  assert.equal(applyReviewedGramListSpacing(raw), raw);
  assert.equal(applyReviewedGramListSpacing(raw, [[raw, spaced]]), spaced);
  const literal = raw.replace("kookosmaito", () => "$&-tuote");
  const spacedLiteral = spaced.replace("kookosmaito", () => "$&-tuote");
  assert.equal(applyReviewedGramListSpacing(literal, [[literal, spacedLiteral]]), spacedLiteral);
  for (const changed of [
    "Lisää kookosmaito, 2, 6 g kanelia ja 5 g vaniljaa.",
    "Lisää kookosmaito, 26 g kanelia ja 5 g vaniljaa.",
    "Keitä kookosmaito, 2,6 g kanelia ja 5 g vaniljaa.",
  ]) {
    assert.equal(applyReviewedGramListSpacing(raw, [[raw, changed]]), raw);
  }
});

test("GK presentation accepts the reviewed whole-egg count only alongside its exact edible weight", async () => {
  const id = "karibia-callaloo-munakas";
  const recipe = inputs.publicRecipes.find(row => row.recipeId === id && row.locale === "fi")!;
  const source = recipe.ingredients;
  const unweighed = recipe.kitchenIngredients!.map(row => {
    const withoutWeight = { ...row };
    Reflect.deleteProperty(withoutWeight, "eggWeightWithoutShellG");
    return withoutWeight;
  });
  const weighedEgg = { ...unweighed[2], eggWeightWithoutShellG: 110 };
  const withEgg = (egg: typeof weighedEgg) => unweighed.map((row, index) => index === 2 ? egg : row);
  const weighed = { ...recipe, kitchenIngredients: withEgg(weighedEgg) };
  const proof = verifiedFiEggPresentationWeights(id, source, weighed);
  assert.deepEqual(proof, [[110, 2]]);
  assert.deepEqual(verifiedFiEggPresentationWeights(id, source, { ...recipe, kitchenIngredients: unweighed }), []);
  for (const egg of [
    { ...weighedEgg, eggWeightWithoutShellG: 109 },
    { ...weighedEgg, item: "valkuaista" },
    { ...weighedEgg, amount: 3 },
    { ...weighedEgg, note: "jaa muna kahtia" },
  ]) assert.deepEqual(verifiedFiEggPresentationWeights(id, source, { ...recipe, kitchenIngredients: withEgg(egg) }), []);
  const changed = weighed.kitchenIngredients.map((row, index) => index === 0 ? { ...row, amount: 1 } : row);
  assert.deepEqual(verifiedFiEggPresentationWeights(id, source, { ...recipe, kitchenIngredients: changed }), []);
  const rawScope = withId(id).sourcePath;
  const raw = await readFile(path.join(repoRoot, rawScope), "utf8");
  const strayWeight = source.map((row, index) => index === 0 ? { ...row, eggWeightWithoutShellG: 200 } : row);
  for (const current of [{ ...recipe, kitchenIngredients: strayWeight },
    { ...recipe, ingredients: strayWeight, kitchenIngredients: source }]) {
    assert.ok((await recipePresentationDifferences(id, raw, current))?.includes("ingredients"));
  }
  const instructions = "Vatkaa 110 g kuoretonta kananmunaa. Lisää 110 g tomaattia. Kypsennä kauttaaltaan.";
  assert.equal(projectEggWeightReferences("fi", instructions, proof),
    "Vatkaa aineslistan kananmunat. Lisää 110 g tomaattia. Kypsennä kauttaaltaan.");
  for (const otherAmount of ["0,110", "0, 110", "0.110", "1 110", "1  110", "1110", "1/110", "100–110", "100—110",
    "100 – 110", "100 tai 110", "2 × 110", "+110", "-110", "−110", "±110", "≥110", "noin 110", "vähintään 110"]) {
    const other = instructions.replace("110 g", otherAmount + " g");
    assert.equal(projectEggWeightReferences("fi", other, proof), other);
  }
});

test("cooking-method metadata alone is independent of the recipe content used for GK", () => {
  const original = "---\ncooking_method: [paistaminen]\nservings: 2\n---\n\n## Valmistus\n\nKeitä 20 minuuttia.";
  const corrected = original.replace("paistaminen", "keittäminen");
  assert.equal(onlyCookingMethodMetadataChanged(original, corrected), true);
  assert.equal(onlyCookingMethodMetadataChanged(original, corrected.replace("20 minuuttia", "10 minuuttia")), false);
  assert.equal(onlyCookingMethodMetadataChanged(original, corrected.replace("servings: 2", "servings: 3")), false);
});

test("current release pins distinguish historical source differences from open publication checks", async () => {
  for (const id of ["koshari", "jauheliha-kaalikeitto-vhh", "uunikanapasta-kesakurpitsa",
    "harira", "karibia-maissipuuro-kookoksella"]) {
    const row = withId(id);
    const status = row.glycemicLoadStatus;
    assert.equal(status.historicalSourceBindingDifference, true, id);
    assert.ok(!status.bindingDifferences.includes("source"), id);
    assert.equal(status.verifiedRawGkRelease?.sourcePath, row.sourcePath, id);
    assert.equal(status.verifiedRawGkRelease?.sourceSha256, row.contentHash, id);
    assert.equal(status.verifiedRawGkRelease?.point, status.publicOriginal?.point, id);
  }
  const editorial = withId("thai-kookosriisi-mangolla");
  assert.ok(editorial.effectiveContentHash);
  assert.ok(editorial.glycemicLoadStatus.verifiedRawGkRelease);
  assert.ok(!editorial.glycemicLoadStatus.bindingDifferences.includes("source"));
  assert.equal(editorial.glycemicLoadStatus.historicalSourceBindingDifference, true);
  assert.equal(editorial.glycemicLoadStatus.releasePresentationDifferences, undefined);
  for (const id of ["vietnamilainen-chao-ga-kanapuuro", "indonesialainen-bubur-ayam-kanariisipuuro",
    "shoyu-kanakeitto-konjac", "pohjoisafrikkalainen-minttutee-kaurapuuro", "yrttituorejuusto-kinkkurullat"]) {
    const row = withId(id);
    const status = row.glycemicLoadStatus;
    const { evidencePath } = status.verifiedRawGkRelease!;
    const evidenceHash = contentHash(await readFile(path.join(repoRoot, evidencePath), "utf8"));
    assert.ok(row.effectiveContentHash, id);
    assert.ok(matchesReviewedReleasePresentation(row.sourcePath, evidencePath, evidenceHash, row.effectiveContentHash), id);
    assert.ok(!matchesReviewedReleasePresentation(row.sourcePath, evidencePath, evidenceHash, row.contentHash), id);
    assert.ok(!matchesReviewedReleasePresentation(row.sourcePath, evidencePath + ".other", evidenceHash, row.effectiveContentHash), id);
    assert.ok(!matchesReviewedReleasePresentation(row.sourcePath, evidencePath, "0".repeat(64), row.effectiveContentHash), id);
    assert.ok(!matchesReviewedReleasePresentation(row.sourcePath, evidencePath, undefined, row.effectiveContentHash), id);
    assert.ok(!matchesReviewedReleasePresentation("different-source.md", evidencePath, evidenceHash, row.effectiveContentHash), id);
    assert.deepEqual(status.bindingDifferences, [], id);
    assert.equal(status.historicalSourceBindingDifference, true, id);
    assert.equal(status.releasePresentationDifferences, undefined, id);
  }
  for (const id of ["lanttulaatikko-kermainen", "pohjoisafrikkalainen-harissa-shakshuka"]) {
    const row = withId(id);
    const { evidencePath } = row.glycemicLoadStatus.verifiedRawGkRelease!;
    const evidenceHash = contentHash(await readFile(path.join(repoRoot, evidencePath), "utf8"));
    assert.ok(row.effectiveContentHash, id);
    assert.ok(matchesReviewedReleasePresentation(row.sourcePath, evidencePath, evidenceHash, row.effectiveContentHash), id);
    assert.ok(!row.glycemicLoadStatus.releasePresentationDifferences?.includes("effective-source"), id);
  }
  const yangzhouId = "yangzhou-paistettu-riisi";
  const yangzhou = inputs.publicRecipes.find(row => row.recipeId === yangzhouId && row.locale === "fi")!;
  const yangzhouStatus = withId(yangzhouId).glycemicLoadStatus;
  assert.ok(yangzhouStatus.verifiedRawGkRelease);
  const showsWeight = yangzhou.kitchenIngredients?.some(row =>
    "eggWeightWithoutShellG" in row && row.eggWeightWithoutShellG === 110);
  if (showsWeight) {
    assert.equal(yangzhouStatus.historicalSourceBindingDifference, true);
    assert.equal(yangzhouStatus.releasePresentationDifferences, undefined);
  } else {
    assert.deepEqual(yangzhouStatus.releasePresentationDifferences, ["ingredients", "preparation"]);
    assert.ok(yangzhouStatus.bindingDifferences.includes("source"));
    assert.equal(yangzhouStatus.historicalSourceBindingDifference, undefined);
  }

  const porkId = "uuniporsas-kermakastikkeessa-vhh";
  const pork = withId(porkId).glycemicLoadStatus;
  const porkRecipe = inputs.publicRecipes.find(row => row.recipeId === porkId && row.locale === "fi")!;
  assert.ok(pork.verifiedRawGkRelease);
  if (porkRecipe.instructionsHtml.includes("Jaa kaikki liha ja kastike kuuteen yhtä suureen annokseen.")) {
    assert.equal(pork.historicalSourceBindingDifference, true);
    assert.equal(pork.releasePresentationDifferences, undefined);
  } else {
    assert.deepEqual(pork.releasePresentationDifferences, ["preparation", "notes"]);
    assert.ok(pork.bindingDifferences.includes("source"));
    assert.equal(pork.historicalSourceBindingDifference, undefined);
  }
  const nasi = withId("indonesialainen-nasi-uduk-aamiaisella").glycemicLoadStatus;
  assert.ok(nasi.releasePresentationDifferences?.includes("effective-source"));
  assert.ok(nasi.releasePresentationDifferences?.includes("preparation"));
  assert.ok(nasi.bindingDifferences.includes("source"));

  const id = "koshari";
  const unverified = projectRecipeState(commit, { ...inputs, originalReleasePresentationDifferences: new Map() });
  const unverifiedStatus = unverified.recipes.find(row => row.sourceRecipeId === id)!.glycemicLoadStatus;
  assert.ok(unverifiedStatus.bindingDifferences.includes("source"));
  assert.ok(unverifiedStatus.verifiedRawGkRelease);
  assert.equal(unverifiedStatus.historicalSourceBindingDifference, undefined);
  const releases = inputs.glycemic.originalReleaseBindings!;
  const exact = releases[id];
  for (const invalid of [
    { ...exact, sourcePath: "reseptit/paaruoat/different-source.md" },
    { ...exact, sourceSha256: "0".repeat(64) },
    { ...exact, point: (exact.point ?? 0) + 1 },
    { ...exact, servings: exact.servings + 1 },
  ]) {
    const changed = projectRecipeState(commit, { ...inputs, glycemic: {
      ...inputs.glycemic, originalReleaseBindings: { ...releases, [id]: invalid },
    } });
    const status = changed.recipes.find(row => row.sourceRecipeId === id)!.glycemicLoadStatus;
    assert.ok(status.bindingDifferences.includes("source"));
    assert.equal(status.historicalSourceBindingDifference, undefined);
    assert.equal(status.verifiedRawGkRelease, undefined);
    assert.deepEqual(status.publicOriginal, withId(id).glycemicLoadStatus.publicOriginal);
  }
  const oldReport = projectRecipeState(commit, { ...inputs, glycemic: {
    ...inputs.glycemic, originalReleaseBindings: undefined,
  } });
  assert.ok(oldReport.recipes.find(row => row.sourceRecipeId === id)?.glycemicLoadStatus.bindingDifferences.includes("source"));
});

test("only unbound automatic coverage without an original estimate is marked as unreviewed", () => {
  const id = "gluteeniton-durrapizzapohja";
  const status = withId(id).glycemicLoadStatus;
  assert.equal(status.unreviewedAutoIncluded, true);
  assert.deepEqual(status.bindingDifferences, ["source", "input", "evidence"]);
  assert.equal(status.auditStatus, "INSUFFICIENT SOURCE DATA");
  assert.equal(status.publicOriginal?.point, null);
  assert.equal(status.publicOriginal?.range, null);

  const findStatus = (changedInputs: RecipeStateInputs) =>
    projectRecipeState(commit, changedInputs).recipes.find(row => row.sourceRecipeId === id)!.glycemicLoadStatus;
  const oldReport = findStatus({ ...inputs, glycemic: { ...inputs.glycemic, unreviewedAutoIncludedRecipeIds: undefined } });
  assert.equal(oldReport.unreviewedAutoIncluded, undefined);
  assert.deepEqual(oldReport.bindingDifferences, status.bindingDifferences);

  const audited = inputs.glycemic.results.map(row => row.recipeId === id
    ? { ...row, status: "CALCULATED" as const, glycemicLoadPerServing: 0 }
    : row);
  assert.equal(findStatus({ ...inputs, glycemic: { ...inputs.glycemic, results: audited } }).unreviewedAutoIncluded, undefined);
  const publicGk = inputs.publicGk.map(row => row.recipeId === id
    ? { ...row, glycemicLoadRangePerServing: { min: 2, max: 3 } }
    : row);
  assert.equal(findStatus({ ...inputs, publicGk }).unreviewedAutoIncluded, undefined);

  const trueConflictId = "indonesialainen-nasi-uduk-aamiaisella";
  const trueConflict = withId(trueConflictId).glycemicLoadStatus;
  assert.equal(trueConflict.unreviewedAutoIncluded, undefined);
  assert.ok(trueConflict.bindingDifferences.includes("source"));
});

test("public verbal GK requires the reviewed original serving", () => {
  const ids = ["briossisampylat-joshua-weissman", "hampurilaissampylat-moomie", "kevyet-briossisampylat-clever-carrot"];
  for (const id of ids) {
    const status = withId(id).glycemicLoadStatus;
    assert.equal(status.publicOriginalVerbalGk, "HIGH", id);
    assert.equal(status.unreviewedAutoIncluded, true, id);
    assert.equal(status.publicOriginal?.point, null, id);
    assert.equal(status.publicOriginal?.range, null, id);
  }

  const id = ids[0];
  const reviewed = inputs.publicGkPortions[id];
  const onlyHalfServing = { ...reviewed, verbal: { ...reviewed.verbal!, portions: [0.5] } };
  const differentScope = projectRecipeState(commit, {
    ...inputs, publicGkPortions: { ...inputs.publicGkPortions, [id]: onlyHalfServing },
  });
  assert.equal(differentScope.recipes.find(row => row.sourceRecipeId === id)?.glycemicLoadStatus.publicOriginalVerbalGk, undefined);
  const numericalOriginal = inputs.publicGk.map(row => row.recipeId === id
    ? { ...row, status: "CALCULATED" as const, glycemicLoadPerServing: 22 }
    : row);
  assert.equal(projectRecipeState(commit, { ...inputs, publicGk: numericalOriginal }).recipes
    .find(row => row.sourceRecipeId === id)?.glycemicLoadStatus.publicOriginalVerbalGk, undefined);
  assert.equal(withId("raejuustobagelit-ilman-kohotusta").glycemicLoadStatus.publicOriginalVerbalGk, undefined);
});

test("verified batch preparation and notes are accepted only as the exact reviewed presentation", async () => {
  const id = "munakokkeli";
  const row = withId(id);
  const receipt = row.glycemicLoadStatus.verifiedRawGkRelease!;
  const recipe = inputs.publicRecipes.find(candidate => candidate.recipeId === id && candidate.locale === "fi")!;
  const source = await readFile(path.join(repoRoot, row.sourcePath), "utf8");
  const evidence = contentHash(await readFile(path.join(repoRoot, receipt.evidencePath), "utf8"));
  const proof = reviewedReleasePresentation(row.sourcePath, receipt.evidencePath, evidence, contentHash(source))?.[2];
  assert.ok(proof);
  const exact = await recipePresentationDifferences(id, source, recipe, proof);
  assert.ok(exact && !exact.includes("preparation") && !exact.includes("notes"));
  const wrongEvidence = reviewedReleasePresentation(row.sourcePath, receipt.evidencePath, "0".repeat(64), contentHash(source));
  assert.equal(wrongEvidence, undefined);

  const updated = [
    { ...recipe, notesHtml: recipe.notesHtml + "<p>Leave the cooking fat behind.</p>" },
    { ...recipe, instructionsHtml: recipe.instructionsHtml + "<p>Discard the egg.</p>" },
    { ...recipe, instructionStepsHtml: ["Discard the egg."] },
    { ...recipe, ingredientPreparation: ["Discard the butter."] },
  ];
  for (const [index, altered] of updated.entries()) {
    const differences = await recipePresentationDifferences(id, source, altered, proof);
    assert.ok(differences?.includes(index === 0 ? "notes" : "preparation"));
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
