import { f25SourceReleaseGate, sourceReleaseGateDecision } from "./f25-source-release-gate";
import { createHash } from "node:crypto";
import { recipeTextForApprovedSnapshot, reviewedRecipesWithHistoricalGk } from "./approved-recipe-note-edits";
import { molletesHistoricalText } from "./molletes-reviewed-source";
import { koreanRiceBowlHistoricalText } from "./korean-rice-bowls-reviewed-source";
import { coconutBananaHistoricalBindingText, coconutBananaSourcePath } from "./coconut-banana-reviewed-source";
import { biryaniSourceBeforeReview, biryaniSourcePath } from "./biryani-reviewed-source";
import {isScopedPolyolEvidence,validateScopedPolyolC} from './gk80-polyol-c';
import {validateRecovery,isRecoveryEvidence,loadRecovery} from "./gk80-uunikanapasta";
import {validateGk80Candidate} from './gk80-release';
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { changedSemanticReviewErrors, loadSemanticEvidence, preparationRegressionErrors, semanticHash } from "./translation-semantic-review";
import { auditTranslations } from "./translation-audit";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import { assertPendingGkSources } from "./glycemic-coverage-inventory-model";
import { readNutritionFieldApproval } from "./nutrition-field-approval";
import type { Calculation } from "./nutrition-model";
import { recipeBindingHash, reviewedColdPuddingBindingText } from "./glycemic-load-recipe-binding";
import { assertChangedRecipeAuditIsClean, duplicateRoutesForChangedRecipes, nutritionBindingInputsChanged, type PublishedRoute } from "./changed-content-checks";
import { assertReviewedSnackPublication } from "./snack-publication-review";
import { parseMarkdown, renderInstructionSteps, renderSafeMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { assertKarnivoreDraftSafe, assertKarnivoreTranslationReady, isHistoricalKarnivoreRecipe } from "./karnivore-draft-gate";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";

const siteDir = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(siteDir, "..");
const suppliedPaths = process.argv.slice(2);
const recipePaths = suppliedPaths.filter((file) => /^(?:(?:reseptit|kaannokset)\/.+|tuonti\/karnivore\/paaruoat\/[^/]+)\.md$/i.test(file) && !file.includes("/_mallipohjat/"));
const evidencePaths = suppliedPaths.filter((file) => /^docs\/nutrition\/calculations\/[a-z0-9-]+\.json$/i.test(file));
const karnivoreReviewIds = new Set(suppliedPaths.flatMap(file => {
  const match = /^docs\/reviews\/new-recipes\/(karnivore-[a-z0-9-]+)\.json$/.exec(file);
  return match ? [match[1]] : [];
}));
const sourceCategories = ["alkuruoat", "paaruoat", "jalkiruoat", "leivonnaiset", "aamupalat", "valipalat"];
const translationLocales = ["en", "sv", "th"];

async function markdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(filename);
    return entry.isFile() && entry.name.endsWith(".md") ? [filename] : [];
  }));
  return nested.flat();
}

function resolveRepoFile(relativePath: string): string {
  const fullPath = path.resolve(repoRoot, relativePath);
  const relative = path.relative(repoRoot, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Changed path escapes the repository: ${relativePath}`);
  }
  return fullPath;
}

async function reviewKarnivorePublication(recipeId: string, sourcePath: string, markdown: string): Promise<boolean> {
  if (isHistoricalKarnivoreRecipe(recipeId)) return false;
  const reviewPath = resolveRepoFile(`docs/reviews/new-recipes/${recipeId}.json`);
  const reviewText = await readFile(reviewPath, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  const { validateReview } = await import("./new-recipe-preflight.mjs");
  const review = reviewText === null ? null : JSON.parse(reviewText);
  assert.deepEqual(validateReview(sourcePath, markdown, review), [], `${recipeId}: current Finnish publication review required`);
  const animalOrigin = review.checks?.animal_origin;
  assert(animalOrigin?.status === "pass"
    && typeof animalOrigin.notes === "string" && animalOrigin.notes.trim().length >= 20,
    `${recipeId}: publication requires documented Finnish animal-origin review`);
  const evidencePath = `docs/nutrition/calculations/${recipeId}.json`;
  assert.equal(review.nutrition_evidence, evidencePath, `${recipeId}: publication review must reference the recipe calculation`);
  await access(resolveRepoFile(evidencePath));
  return true;
}

function changedNutritionValues(relativePath: string): boolean {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA || "HEAD";
  if (!base || /^0+$/.test(base)) return false;
  const diff = execFileSync("git", ["diff", "--unified=0", base, head, "--", relativePath], { encoding: "utf8" });
  return diff.split(/\r?\n/).some((line) =>
    /^\+(?!\+).*\b(?:carbs_net_per_serving_g|carbs_total_per_serving_g|protein_per_serving_g|fat_per_serving_g)\s*:/.test(line));
}

function previousRecipe(relativePath: string): ReturnType<typeof parseMarkdown> {
  const base = process.env.BASE_SHA;
  if (!base || /^0+$/.test(base)) return null;
  try {
    execFileSync("git", ["cat-file", "-e", `${base}:${relativePath}`], { stdio: "ignore" });
  } catch {
    return null;
  }
  const previous = execFileSync("git", ["show", `${base}:${relativePath}`], { encoding: "utf8" });
  return parseMarkdown(previous);
}

const previousRecipes = new Map(recipePaths.map((file) => [file, previousRecipe(file)]));
const changedRecipes: { path: string; data: ReturnType<typeof recipeFrontmatterSchema.parse>; markdown: string }[] = [];
let semanticEvidence: Awaited<ReturnType<typeof loadSemanticEvidence>> | undefined;
for (const relativePath of recipePaths) {
  const fullPath = resolveRepoFile(relativePath);
  try {
    await access(fullPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    assert(previousRecipes.get(relativePath)?.data.recipe_id, `${relativePath}: deleted recipe has no previous version to validate`);
    continue;
  }
  const markdown = await readFile(fullPath, "utf8");
  const parsed = parseMarkdown(markdown);
  assert(parsed, `${relativePath}: recipe frontmatter is missing or malformed`);
  const data = recipeFrontmatterSchema.parse(parsed.data);
  const previous = previousRecipes.get(relativePath)?.data;
  if (typeof previous?.recipe_id === "string" && isHistoricalKarnivoreRecipe(previous.recipe_id)) {
    assert.equal(data.recipe_id, previous.recipe_id, `${relativePath}: historical karnivore recipe ID cannot change`);
    assert.equal(data.language, previous.language, `${relativePath}: historical karnivore recipe language cannot change`);
  }
  await assertReviewedSnackPublication(data, repoRoot, relativePath);
  if (data.recipe_id.startsWith("karnivore-")) {
    if (data.language === "fi") {
      const reviewed = data.status === "published"
        && await reviewKarnivorePublication(data.recipe_id, relativePath, markdown);
      assertKarnivoreDraftSafe(data, markdown, reviewed);
    } else if (data.status === "published" || isHistoricalKarnivoreRecipe(data.recipe_id)) {
      const sourcePath = isHistoricalKarnivoreRecipe(data.recipe_id)
        ? `reseptit/paaruoat/${data.recipe_id}.md`
        : data.source_recipe;
      assert(sourcePath && sourcePath.startsWith("reseptit/"), `${relativePath}: missing canonical Finnish source path`);
      const sourceText = await readFile(resolveRepoFile(sourcePath), "utf8");
      const source = parseMarkdown(sourceText);
      assert(source, `${sourcePath}: missing Finnish recipe source`);
      semanticEvidence ??= await loadSemanticEvidence(repoRoot);
      const reviewed = data.status === "published"
        && await reviewKarnivorePublication(data.recipe_id, sourcePath, sourceText);
      assertKarnivoreTranslationReady(
        { data, content: parsed.content },
        { data: recipeFrontmatterSchema.parse(source.data), content: source.content },
        semanticEvidence[`${data.recipe_id}:${data.language}`],
        reviewed,
      );
    }
  }
  if (data.status === "published") {
    const match = /^##\s+(?:Valmistus|Preparation|Instructions|Tillagning|Gör så här|การทำ|วิธีทำ)\s*$/im.exec(parsed.content);
    assert(match?.index !== undefined, `${relativePath}: published recipe has no instruction section`);
    const start = match.index + match[0].length;
    const next = parsed.content.slice(start).search(/^##\s+/m);
    const instructions = parsed.content.slice(start, next < 0 ? undefined : start + next).trim();
    assert.deepEqual(preparationRegressionErrors({ data, content: parsed.content }), [], `${relativePath}: preparation regression`);
    const renderedSteps = await renderInstructionSteps(instructions);
    const rendered = renderedSteps?.join("") ?? await renderSafeMarkdown(instructions);
    assert(rendered.trim(), `${relativePath}: recipe instructions render to empty output`);
  }
  if (data.image) {
    const sources = [data.image.src, ...(data.image.srcset ?? []).map((item) => item.src)];
    // Draft previews can live in versioned kuvat/ before owner approval and signed CI-image registration.
    // Published content must continue to use only the verified PROJECT_IMAGE_ROOT in CI.
    const imageRoot = path.resolve(data.status === "draft"
      ? path.join(repoRoot, "kuvat")
      : process.env.PROJECT_IMAGE_ROOT || path.join(repoRoot, "kuvat"));
    for (const source of sources) {
      const target = path.resolve(imageRoot, source);
      const relative = path.relative(imageRoot, target);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`Image source escapes its root: ${source}`);
      }
      await access(target);
    }
  }
  changedRecipes.push({ path: relativePath, data, markdown });
}

// Changed paths include both sides of a move. A replacement must still pass
// validation using the historical recipe ID and language.
const currentPaths = new Set(changedRecipes.map(recipe => recipe.path));
for (const [previousPath, previous] of previousRecipes) {
  const id = previous?.data.recipe_id;
  if (typeof id !== "string" || !isHistoricalKarnivoreRecipe(id) || currentPaths.has(previousPath)) continue;
  assert(changedRecipes.some(recipe => recipe.data.recipe_id === id && recipe.data.language === previous?.data.language
    && !previousRecipes.get(recipe.path)),
  `${previousPath}: historical karnivore recipe requires a replacement with the same ID and language`);
}

const evidenceIds = new Set<string>();
for (const relativePath of evidencePaths) {
  const fullPath = resolveRepoFile(relativePath);
  const expectedRecipeId = path.basename(relativePath, ".json");
  evidenceIds.add(expectedRecipeId);
  try {
    await access(fullPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
    throw error;
  }
  const evidence = JSON.parse(await readFile(fullPath, "utf8")) as Calculation;
  assert(evidence.recipeId, `${relativePath}: calculation evidence has no recipeId`);
  assert(relativePath === `docs/nutrition/calculations/${evidence.recipeId}.json`, `${relativePath}: filename must match recipeId`);
  assert.equal(evidence.recipeId, expectedRecipeId, `${relativePath}: filename must match recipeId`);
}

const recipeIds = new Set([
  ...changedRecipes.map((recipe) => recipe.data.recipe_id),
  ...[...previousRecipes.values()].map((recipe) => recipe?.data.recipe_id).filter((id): id is string => typeof id === "string"),
  ...evidenceIds,
  ...karnivoreReviewIds,
]);
assert(recipeIds.size > 0, "No changed recipe or evidence paths were supplied.");
const semanticallyChanged = new Set(changedRecipes.filter((recipe) => {
  if (recipe.data.status !== "published") return false;
  const previous = previousRecipes.get(recipe.path);
  if (previous?.data.status !== "published") return true;
  const previousData = recipeFrontmatterSchema.safeParse(previous.data);
  if (!previousData.success) return true;
  const current = parseMarkdown(recipe.markdown)!;
  return semanticHash({ data: previousData.data, content: previous.content }) !== semanticHash({ data: recipe.data, content: current.content });
}).map((recipe) => recipe.path));

const audit = await auditTranslations([...recipeIds]);
const pendingGkSources = JSON.parse(await readFile(
  resolveRepoFile("docs/nutrition/new-public-gk-pending-sources.json"), "utf8",
)) as Record<string, string>;
const recipeBindings = JSON.parse(await readFile(resolveRepoFile("docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8")) as {
  recipes?: Record<string, string>;
};
const recipeAliases = JSON.parse(await readFile(resolveRepoFile("docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8")) as {
  aliases?: Record<string, { canonical: string; evidence: string }>;
};

const changedRoutes: PublishedRoute[] = changedRecipes
  .filter((recipe) => recipe.data.status === "published")
  .map((recipe) => ({
    recipe_id: recipe.data.recipe_id,
    language: recipe.data.language,
    url_slug: recipe.data.url_slug,
    path: recipe.path,
  }));
if (changedRoutes.length > 0) {
  const collectionDirectories = [
    ...sourceCategories.map((category) => path.join(repoRoot, "reseptit", category)),
    ...translationLocales.map((locale) => path.join(repoRoot, "kaannokset", locale)),
  ];
  const collectionFiles = (await Promise.all(collectionDirectories.map(markdownFiles))).flat();
  const publishedRoutes: PublishedRoute[] = [];
  for (const filename of collectionFiles) {
    const parsed = parseMarkdown(await readFile(filename, "utf8"));
    if (parsed?.data.status !== "published") continue;
    // Match the real public route builder: a quarantined historical FI source
    // has no public URL and cannot collide with a reviewed published successor.
    if (isPublicRecipeQuarantined(String(parsed.data.recipe_id ?? ""))) continue;
    const { recipe_id, language, url_slug } = parsed.data;
    if (typeof recipe_id !== "string" || typeof language !== "string" || typeof url_slug !== "string") continue;
    publishedRoutes.push({
      recipe_id,
      language,
      url_slug,
      path: path.relative(repoRoot, filename).replaceAll("\\", "/"),
    });
  }
  const duplicateRoutes = duplicateRoutesForChangedRecipes(changedRoutes, publishedRoutes);
  assert.deepEqual(duplicateRoutes, [], "Changed recipe URLs must remain unique across all published recipes");
}

for (const recipeId of recipeIds) {
  const source = assertChangedRecipeAuditIsClean(audit, recipeId);
  const evidencePathRelative = `docs/nutrition/calculations/${recipeId}.json`;
  const evidencePath = resolveRepoFile(evidencePathRelative);
  const evidenceText = await readFile(evidencePath, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  const gkPending = Object.hasOwn(pendingGkSources, recipeId);
  if (!source) {
    assert(evidenceText === null, `${recipeId}: calculation evidence has no published Finnish source`);
    assert(!gkPending, `${recipeId}: new-public GK pending entry has no published Finnish source`);
    continue;
  }

  if (karnivoreReviewIds.has(recipeId) && !currentPaths.has(source.path)) {
    await reviewKarnivorePublication(recipeId, source.path, await readFile(resolveRepoFile(source.path), "utf8"));
  }

  const translations = audit.publishedTranslations.filter((recipe) => recipe.data.recipe_id === recipeId);

  const changedSource = changedRecipes.find((recipe) => recipe.data.recipe_id === recipeId && recipe.data.language === "fi");
  const boundRecipeHash = recipeBindings.recipes?.[recipeId];
  if (changedSource && boundRecipeHash && semanticallyChanged.has(changedSource.path) &&
      nutritionBindingInputsChanged(previousRecipes.get(changedSource.path)?.data, changedSource.data)) {
    // Do not silently approve a new ingredient, yield, or cooking-method
    // fingerprint. For instruction-only edits, an already-stale historical
    // fingerprint remains a separate audit issue, not a reason to block copy.
    const currentRecipeHash = recipeBindingHash(reviewedColdPuddingBindingText(changedSource.path, changedSource.markdown), recipeAliases.aliases ?? {});
    const historicalBiryani = biryaniSourceBeforeReview(changedSource.path, changedSource.markdown);
    const reviewedBiryaniWithoutGk = changedSource.path === biryaniSourcePath &&
      historicalBiryani !== changedSource.markdown &&
      recipeBindingHash(historicalBiryani, recipeAliases.aliases ?? {}) === boundRecipeHash;
    const historicalCoconutBanana = changedSource.path === coconutBananaSourcePath
      ? coconutBananaHistoricalBindingText(changedSource.markdown)
      : changedSource.markdown;
    const reviewedCoconutBananaWithoutGk = historicalCoconutBanana !== changedSource.markdown &&
      recipeBindingHash(historicalCoconutBanana, recipeAliases.aliases ?? {}) === boundRecipeHash;
    const historicalRiceBowl = koreanRiceBowlHistoricalText(changedSource.path, changedSource.markdown);
    const reviewedRiceBowlWithoutGk = historicalRiceBowl !== changedSource.markdown &&
      recipeBindingHash(historicalRiceBowl, recipeAliases.aliases ?? {}) === boundRecipeHash;
    const historicalMolletes = molletesHistoricalText(changedSource.path, changedSource.markdown);
    const reviewedMolletesWithoutGk = historicalMolletes !== changedSource.markdown &&
      recipeBindingHash(historicalMolletes, recipeAliases.aliases ?? {}) === boundRecipeHash;
    const historicalReviewedRecipe = reviewedRecipesWithHistoricalGk.has(changedSource.path)
      ? recipeTextForApprovedSnapshot(changedSource.path, changedSource.markdown.replaceAll("\r\n", "\n"), "original-gk")
      : changedSource.markdown;
    const historicalHash = recipeBindingHash(historicalReviewedRecipe, recipeAliases.aliases ?? {});
    const reviewedHistoricalSourceWithoutGk = historicalReviewedRecipe !== changedSource.markdown &&
      historicalHash === boundRecipeHash;
    // Some original F25 snapshots already disagreed with their stored GK fingerprints.
    // Recheck the exact historical Git blob and retain the mismatch; this route never
    // grants numeric GK or accepts a changed historical recipe.
    const historicalF25Fingerprints: Readonly<Record<string, string>> = {
      "japanilainen-hojicha-jogurtti-persimonilla": "e0a9054b5bea0325733540f7b5f7694c1010158cd34cc26e141f10f2dcc8e5b2",
      "vietnamilainen-papaija-kookospuuro": "2336164b42075032e6870eb4da1760eee74c93a8b33ace230adc518a16bb2e5f",
    };
    const f25 = f25SourceReleaseGate.sources.find(row => row.recipe_id === recipeId && row.source_path === changedSource.path);
    const historicalBytes = Buffer.from(historicalReviewedRecipe, "utf8");
    const historicalBlob = createHash("sha1").update("blob " + historicalBytes.length + "\0").update(historicalBytes).digest("hex");
    const reviewedF25WithoutGk = historicalReviewedRecipe !== changedSource.markdown &&
      f25?.approval?.gkDisposition === "GK_UNAVAILABLE_EXPLICITLY_REVIEWED" &&
      sourceReleaseGateDecision(recipeId).authorized &&
      historicalBlob === f25.baseline_git_blob_sha &&
      historicalHash === historicalF25Fingerprints[recipeId];
    assert(currentRecipeHash === boundRecipeHash || reviewedBiryaniWithoutGk || reviewedCoconutBananaWithoutGk || reviewedRiceBowlWithoutGk || reviewedMolletesWithoutGk || reviewedHistoricalSourceWithoutGk || reviewedF25WithoutGk || await validateGk80Candidate(repoRoot, recipeId) || await validateRecovery(repoRoot,recipeId) || await validateScopedPolyolC(repoRoot,recipeId), `${recipeId}: GI/GK recipe binding is stale; review the related calculation before accepting this content change`);
  }

  const evidence = evidenceText === null ? null : JSON.parse(evidenceText) as Calculation;
  const nutritionChanged = changedRecipes.some((recipe) =>
    recipe.data.recipe_id === recipeId && changedNutritionValues(recipe.path));
  if (nutritionChanged) assert(evidence, `${recipeId}: changed published nutrition values require matching calculation evidence`);
  if (evidence) {
    if (isRecoveryEvidence(evidence)) await loadRecovery(repoRoot,recipeId);
    if (isScopedPolyolEvidence(evidence)) assert(await validateScopedPolyolC(repoRoot,recipeId), `${recipeId}: scoped C preparation approval is stale`);
  } else {
    assert(!evidenceIds.has(recipeId), `${recipeId}: changed calculation evidence is unavailable`);
  }
  if (evidence || gkPending) {
    const approval = evidence ? await readNutritionFieldApproval(repoRoot, evidence, { requireBatchMembership: true }) : undefined;
    const result = verifyNutritionEvidence(source.data, evidence, translations, approval);
    if (evidence) assert.deepEqual(result.errors, [], `${recipeId}: nutrition evidence validation failed`);
    if (gkPending) {
      // Reuse the coverage audit's eligibility check on just the changed recipe.
      assertPendingGkSources([{
        recipeId, status: "INSUFFICIENT SOURCE DATA", glycemicLoadPerServing: null,
        sourceBlobSha: pendingGkSources[recipeId]!,
      }], [{
        recipe_id: recipeId, status: result.status, calculationEvidence: evidence ? evidencePathRelative : null,
        evidenceErrors: result.errors, values: result.values,
      }]);
    }
  }
}

if (process.env.BASE_SHA && !/^0+$/.test(process.env.BASE_SHA)) {
  if (semanticallyChanged.size) {
    const errors = changedSemanticReviewErrors(audit, semanticallyChanged, semanticEvidence ??= await loadSemanticEvidence(repoRoot));
    assert.deepEqual(errors, [], "Changed published translation pairs require current Codex source comparison evidence");
  }
}

console.log(`Changed-content check passed: ${changedRecipes.length} recipe file(s), ${evidenceIds.size} calculation evidence file(s), ${recipeIds.size} related recipe record(s).`);
