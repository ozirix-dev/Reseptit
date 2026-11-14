import { molletesHistoricalText, molletesRecipeId, molletesSourcePath } from "./molletes-reviewed-source";
import { koreanRiceBowlHistoricalText } from "./korean-rice-bowls-reviewed-source";
import { coconutBananaHistoricalBindingText, coconutBananaRecipeId } from "./coconut-banana-reviewed-source";
import { biryaniSourceBeforeReview, biryaniSourcePath } from "./biryani-reviewed-source";
import {countPublishedGkEstimates} from '../src/features/recipes/gk-estimate';
import {publicGiSourceNote} from "./gk-source-copy";
import {originalGlycemicLoadCategory} from './glycemic-load-filter';
import { loadAuthorizedGk100Variants } from './gk100-approval-release';
import {buildTwoAlmondPieVariants} from './gk-two-almond-pies';
import {buildTehoajoVariants} from './gk-tehoajo-era1';
import {buildPohaHoneyMustardVariants} from './gk-poha-honey-mustard';
import {buildReviewedGkVariants} from './gk-four-reviewed';
import {buildLindstromBrineVariant} from './gk-lindstrom-brine';
import {buildThreeCurryVariants} from './gk-three-curries';
import {buildApprovedFourVariants} from './gk-next-four';
import {buildApprovedBVariants} from './gk-four-approved-b';
import {buildProductAVariants} from './gk-four-product-a';
import {recipeTextForApprovedSnapshot} from './approved-recipe-note-edits';
import {buildBlueberryPieVariant} from './gk-blueberry-pie';
import {buildPanangKimchiVariants} from './gk-panang-kimchi';
import {buildGkOnlyVariants} from './gk149-integration';
import {buildApprovedSevenVariants} from './gk-next-seven';
import {countGkVersions} from '../src/features/recipes/gk-only-types';
import {catalogSourceApplication} from "./gk80-source-classification";
import {applyScopedPolyolC} from './gk80-polyol-c';
import {applyRecovery} from './gk80-uunikanapasta';
import {withdrawQ09Tea} from './gk80-q09-withdrawal';
import {applyGk80Release} from './gk80-release';
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import type { FoodRecord } from "./nutrition-model";
import {
  calculateGlycemicLoad,
  CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G,
  MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G,
  type GlycemicIndexRecord,
  type GlycemicLoadRecipeInput,
} from "./glycemic-load-model";
import { glycemicLoadEvidenceHash, glycemicLoadInputHash, recipeBindingHash, recipeBindingMatches, exactRecipeTextBindingMatches, reviewedColdPuddingBindingText } from "./glycemic-load-recipe-binding";
import { siteContent } from "../src/generated/content.generated";
import { isPublicRecipeQuarantined } from "./public-recipe-quarantine";
import { parseMarkdown } from "../src/content/markdown";
import { completePublishedRecipeInputs, type PublishedRecipeInputSource } from "./glycemic-load-pilot-input";

const siteDir = path.resolve(import.meta.dirname, "..");
const root = path.resolve(siteDir, "..");
async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const nested = await Promise.all(entries.map(async (entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(file);
    return entry.isFile() && entry.name.endsWith(".md") ? [file] : [];
  }));
  return nested.flat();
}

const [input, foodRecords, giSource] = await Promise.all([
  readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((text) => JSON.parse(text)),
  readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((text) => JSON.parse(text) as FoodRecord[]),
  readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((text) => JSON.parse(text)),
]);
const publishedRecipeSources = new Map<string, { markdown: string; input: PublishedRecipeInputSource }>();
for (const filename of await markdownFiles(path.join(root, "reseptit"))) {
  const markdown = (await readFile(filename, "utf8")).replaceAll("\r\n", "\n");
  const parsed = parseMarkdown(markdown);
  if (parsed?.data.status !== "published" || parsed.data.language !== "fi") continue;
  const recipeId = String(parsed.data.recipe_id ?? "");
  const servings = parsed.data.servings;
  const sourceIngredients = parsed.data.ingredients;
  if (!recipeId || !Number.isInteger(servings) || !Array.isArray(sourceIngredients) || sourceIngredients.length === 0) {
    throw new Error("Published Finnish recipe has incomplete structured GI/GK source data: " + filename);
  }
  if (publishedRecipeSources.has(recipeId)) throw new Error("Published Finnish recipe ID is duplicated: " + recipeId);
  const ingredients = sourceIngredients.map((ingredient) => {
    if (!ingredient || typeof ingredient !== "object" || typeof ingredient.item !== "string") {
      throw new Error("Published recipe ingredient is malformed: " + recipeId);
    }
    return {
      item: ingredient.item,
      amount: typeof ingredient.amount === "number" && Number.isFinite(ingredient.amount) ? ingredient.amount : null,
      unit: typeof ingredient.unit === "string" ? ingredient.unit : null,
    };
  });
  publishedRecipeSources.set(recipeId, {
    markdown,
    input: { recipeId, servings: Number(servings), ingredients },
  });
}
// The first FI-only carnivore releases are public but its GI/GK input is unresolved.
// Keep the historically reviewed GK calculation corpus byte-for-byte comparable,
// while reporting these exact, SHA-pinned new public sources separately.
// No GI or zero-GL approval follows from this quarantine.
const newPublicGkPendingSources = JSON.parse(await readFile(path.join(root, "docs/nutrition/new-public-gk-pending-sources.json"), "utf8")) as Record<string, string>;
const separatelyTrackedPublishedGk = [...publishedRecipeSources.entries()]
  .filter(([id]) => Object.hasOwn(newPublicGkPendingSources, id))
  .map(([id, source]) => {
    const bytes = Buffer.from(source.markdown, "utf8");
    const actual = createHash("sha1").update(`blob ${bytes.byteLength}\0`).update(bytes).digest("hex");
    if (actual !== newPublicGkPendingSources[id]) throw new Error(`${id}: new public GK HOLD source bytes changed; explicit re-review required`);
    return { recipeId: id, status: "INSUFFICIENT SOURCE DATA" as const, glycemicLoadPerServing: null,
      reason: "NEW_PUBLIC_RECIPE_GI_SOURCE_UNREVIEWED", sourceBlobSha: actual };
  });
if (separatelyTrackedPublishedGk.length !== Object.keys(newPublicGkPendingSources).length) {
  throw new Error("Incomplete new-public GK HOLD source inventory");
}
const publishedSourceRows = [...publishedRecipeSources.entries()]
  .filter(([id]) => !Object.hasOwn(newPublicGkPendingSources, id))
  .map(([,source]) => source.input);
const expectedRecipeIds = [...publishedRecipeSources.keys()]
  .filter((id) => !Object.hasOwn(newPublicGkPendingSources, id))
  .sort((left, right) => left.localeCompare(right));
const recipeBindings = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8")) as {
  baselineCommit: string;
  exactRecipeText?: Record<string, { sourceSha256: string; locales: Record<string, {path: string; sha256: string}> }>;
  recipes: Record<string, string | null>;
  calculationInputs: Record<string, string | null>;
  calculationEvidence?: Record<string, string | null>;
};
const recipeAliases = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-aliases.json"), "utf8")) as {
  aliases: Record<string, { canonical: string; evidence: string }>;
};
for (const [alias, value] of Object.entries(recipeAliases.aliases)) {
  if (!alias.trim() || !value.canonical.trim() || !value.evidence.trim()) throw new Error(`Recipe ingredient alias requires canonical identity and evidence: ${alias}`);
}

const { recipes: inputs, autoIncludedRecipeIds } = completePublishedRecipeInputs(
  input.recipes as GlycemicLoadRecipeInput[],
  publishedSourceRows,
);

const giRecords = giSource.records as GlycemicIndexRecord[];
if (!Array.isArray(giSource.sources) || new Set(giRecords.map((record) => record.id)).size !== giRecords.length) {
  throw new Error("GI source catalog and uniquely identified GI records are required.");
}
for (const record of giRecords) {
  if (record.referenceScale !== "GLUCOSE_100" || !record.source?.url || !record.source.qualityEvidence
      || !["STRONG", "SUPPLEMENTARY"].includes(record.qualityTier)) {
    throw new Error(`GI record has incomplete provenance or quality tier: ${record.id}`);
  }
  if (record.qualityTier === "STRONG" && (!record.source.published || !record.source.iso26642Confirmed)) {
    throw new Error(`Strong GI record must be published and ISO 26642-confirmed: ${record.id}`);
  }
}
const biryaniMarkdown = publishedRecipeSources.get("hyderabadi-kanabiryani")?.markdown;
const biryaniUsesReviewedMilk = biryaniMarkdown !== undefined &&
  biryaniSourceBeforeReview(biryaniSourcePath, biryaniMarkdown) !== biryaniMarkdown;

const coconutBananaMarkdown = publishedRecipeSources.get(coconutBananaRecipeId)?.markdown;
const coconutBananaNeedsGkReview = coconutBananaMarkdown !== undefined &&
  coconutBananaHistoricalBindingText(coconutBananaMarkdown) !== coconutBananaMarkdown;

const molletesMarkdown = publishedRecipeSources.get(molletesRecipeId)?.markdown;
const molletesNeedsGkReview = molletesMarkdown !== undefined &&
  molletesHistoricalText(molletesSourcePath, molletesMarkdown) !== molletesMarkdown;

const koreanRiceBowlsNeedingGkReview = new Set<string>();
const dashimakiId = "japanilainen-dashimaki-tamago-aamiaislautasella";
const dashimakiSourcePath = "reseptit/aamupalat/japanilainen-dashimaki-tamago-aamiaislautasella.md";
const dashimakiMarkdown = publishedRecipeSources.get(dashimakiId)?.markdown;
const dashimakiNeedsGkReview = dashimakiMarkdown !== undefined &&
  recipeTextForApprovedSnapshot(dashimakiSourcePath, dashimakiMarkdown) !== dashimakiMarkdown;

const sourceHashes = Object.fromEntries(expectedRecipeIds.map((recipeId) => {
  const source = publishedRecipeSources.get(recipeId);
  if (!source) throw new Error("Published source recipe is missing from the current GK set: " + recipeId);
  // The legacy inputs still describe the historical biryani recipe.
  const markdown = recipeId === "hyderabadi-kanabiryani"
    ? biryaniSourceBeforeReview(biryaniSourcePath, source.markdown)
    : recipeId === coconutBananaRecipeId
      ? coconutBananaHistoricalBindingText(source.markdown)
      : recipeId === dashimakiId
        ? recipeTextForApprovedSnapshot(dashimakiSourcePath, source.markdown)
      : recipeId === molletesRecipeId
        ? molletesHistoricalText(molletesSourcePath, source.markdown)
        : koreanRiceBowlHistoricalText(`reseptit/aamupalat/${recipeId}.md`, source.markdown);
  if (recipeId !== coconutBananaRecipeId && recipeId !== "hyderabadi-kanabiryani" && recipeId !== molletesRecipeId && markdown !== source.markdown) {
    koreanRiceBowlsNeedingGkReview.add(recipeId);
  }
  return [recipeId, recipeBindingHash(reviewedColdPuddingBindingText(`reseptit/aamupalat/${recipeId}.md`, markdown), recipeAliases.aliases)];
}));

// Only explicitly bound new versions require whole preparation/translation text.
const exactTextMismatches = new Set<string>();
for (const [recipeId, binding] of Object.entries(recipeBindings.exactRecipeText ?? {})) {
  const source = publishedRecipeSources.get(recipeId);
  if (!source || !exactRecipeTextBindingMatches(binding.sourceSha256, source.markdown)) exactTextMismatches.add(recipeId);
  for (const locale of ["en", "sv", "th"]) {
    const item = binding.locales?.[locale];
    if (!item || !item.path.startsWith(`kaannokset/${locale}/`) || item.path.includes("..") || path.isAbsolute(item.path)) {
      exactTextMismatches.add(recipeId); continue;
    }
    const text = await readFile(path.join(root, item.path), "utf8").catch((error:NodeJS.ErrnoException) => { if(error.code==="ENOENT")return null;throw error; });
    if (text === null || !exactRecipeTextBindingMatches(item.sha256,
      recipeTextForApprovedSnapshot(item.path, text.replaceAll("\r\n", "\n")))) exactTextMismatches.add(recipeId);
  }
}

const rawResults = inputs.map((recipe) => calculateGlycemicLoad(recipe, foodRecords, giRecords));
const calculationInputHashes = Object.fromEntries(inputs.map((recipe) => [recipe.recipeId, glycemicLoadInputHash(recipe)]));
const calculationEvidenceHashes = Object.fromEntries(inputs.map((recipe) => [recipe.recipeId, glycemicLoadEvidenceHash(recipe, foodRecords, giRecords)]));
const legacyResults = rawResults.map((result) => {
  const boundHash = recipeBindings.recipes[result.recipeId];
  const recipeChanged = !recipeBindingMatches(boundHash, sourceHashes[result.recipeId]) || exactTextMismatches.has(result.recipeId);
  const inputChanged = !recipeBindingMatches(recipeBindings.calculationInputs[result.recipeId], calculationInputHashes[result.recipeId]);
  const evidenceChanged = !recipeBindingMatches(recipeBindings.calculationEvidence?.[result.recipeId], calculationEvidenceHashes[result.recipeId]);
  if (recipeChanged || inputChanged || evidenceChanged) {
    return {
      ...result,
      status: "INSUFFICIENT SOURCE DATA" as const,
      glycemicLoadPerServing: null,
      glycemicLoadRangePerServing: null,
      confidence: null,
      blockers: [
        ...result.blockers,
        ...(recipeChanged ? [`${result.recipeId}: recipe structure differs from the last GL review (${recipeBindings.baselineCommit}); ingredient mapping and calculation must be reviewed again.`] : []),
        ...(inputChanged ? [`${result.recipeId}: GI/food mapping, portion, conversion, source evidence or calculation assumptions differ from the last GL review; the input must be reviewed again.`] : []),
        ...(evidenceChanged ? [`${result.recipeId}: a calculation-relevant food or GI source value/state differs from the last GL review; source mapping and calculation must be reviewed again.`] : []),
      ],
    };
  }
  const usesImputation = result.ingredients.some((ingredient) =>
    giRecords.find((record) => record.id === ingredient.giRecordId)?.evidenceKind === "PUBLISHED_IMPUTATION");
  return usesImputation ? {...result, assessmentType: "PUBLISHED_IMPUTATION" as const, modelScenario: "POINT_SCENARIO" as const} : result;
});
const results = await applyScopedPolyolC(root, await applyRecovery(root, await withdrawQ09Tea(root, await applyGk80Release(root, legacyResults))));
const gkOnlyVariants = [...buildGkOnlyVariants(root),...buildApprovedSevenVariants(root),...buildApprovedFourVariants(root),...buildApprovedBVariants(root),...buildProductAVariants(root),...buildPanangKimchiVariants(root),buildBlueberryPieVariant(root),...buildThreeCurryVariants(root),buildLindstromBrineVariant(root),...buildReviewedGkVariants(root),...buildPohaHoneyMustardVariants(root),...buildTehoajoVariants(root),...buildTwoAlmondPieVariants(root),...loadAuthorizedGk100Variants(root)];
const versionCoverage = countGkVersions(results,gkOnlyVariants);
const report = {
  generatedAt: new Date().toISOString(),
  scope: "Internal provenance report for ingredient-based per-serving estimates. These are not measurements of prepared meals or individual glucose responses.",
  formula: "sum(GI_i × available carbohydrate_i per serving) / 100",
  fineliEvidence: input.fineliEvidence,
  additionalCarbohydrateEvidence: input.additionalCarbohydrateEvidence ?? null,
  massEvidence: input.massEvidence,
  selectionNotes: input.selectionNotes ?? {},
  giSourcePolicy: `Published, traceable glucose-scale GI values may support a public ingredient estimate as a direct match, justified analogue, or category mean. Match quality is separate from study quality: analogues and category means force LOW confidence. A missing GI match for an individual contribution below ${MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G} g available carbohydrate per serving may be omitted only while all such recipe contributions sum to less than ${CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G} g per serving; larger known carbohydrate contributions require GI evidence. An assigned but invalid or mismatched GI record remains blocking regardless of contribution size, and unknown carbohydrate remains blocking. The cumulative value is a user-centered editorial tolerance, not a clinical precision threshold.`,
  recipeBindingBaseline: recipeBindings.baselineCommit,
  autoIncludedRecipeIds,
  newPublicGkPendingSources: separatelyTrackedPublishedGk,
  newPublicGkPendingCount: separatelyTrackedPublishedGk.length,
  publicRecipeCountIncludingPending: results.length + separatelyTrackedPublishedGk.length,
  calculationInputs: inputs,
  recipeBindingMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.recipes[recipeId], sourceHashes[recipeId]) || exactTextMismatches.has(recipeId)),
  calculationInputMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.calculationInputs[recipeId], calculationInputHashes[recipeId])),
  calculationEvidenceMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.calculationEvidence?.[recipeId], calculationEvidenceHashes[recipeId])),
  previousPublicBaseline: { sourceCommit: "b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5", calculated: 190, insufficientSourceData: 135, zeroTotals: 21, changedRecipeInputsAmongCalculated: 21 },
  giSourceCatalog: giSource.sources,
  sourceHashes,
  calculationInputHashes,
  calculationEvidenceHashes,
  results,
  gkOnlyVariants,
  versionCoverage,
  estimateCoverage: countPublishedGkEstimates(results,gkOnlyVariants),
  coveragePolicyVersion: 2,
  originalCoverageTarget: { numeric: versionCoverage.originalNumeric, total: versionCoverage.total, target: versionCoverage.originalTarget, gap: versionCoverage.originalTargetGap },
  coverageViews:{originalRecipe:{total:versionCoverage.total,numeric:versionCoverage.originalNumeric,missing:versionCoverage.total-versionCoverage.originalNumeric},atLeastOneExactVersion:{total:versionCoverage.total,numeric:versionCoverage.numericRecipes,missing:versionCoverage.missing,additionalApprovedVersions:versionCoverage.additionalA+versionCoverage.additionalB}, separateVariants:{numeric:versionCoverage.variantNumeric,recipeIds:versionCoverage.variantRecipeIds}, studyComparisons:{numeric:versionCoverage.studyServingRecipeIds.length,recipeIds:versionCoverage.studyServingRecipeIds}, legacyMixed:{numeric:versionCoverage.legacyNumericRecipes,historicalOnly:true}},
  summary: {
    recipes: results.length,
    calculated: results.filter((result) => result.status === "CALCULATED").length,
    insufficientSourceData: results.filter((result) => result.status === "INSUFFICIENT SOURCE DATA").length,
  },
};

const outputDir = path.join(root, "tmp/nutrition");
await mkdir(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "glycemic-load-pilot.json");
await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n");
const isFixtureBuild = process.env.RECIPE_SOURCE_ROOT !== undefined;
const publicResults = results.flatMap((result) => {
  const recipe = siteContent.recipes.find((entry) => entry.recipeId === result.recipeId && entry.locale === "fi");
  if (!recipe) {
    // Image-pipeline tests build a tiny one-recipe fixture. Keep that build
    // independent of the production-only GL pilot corpus, while still failing
    // a normal site build if any selected Finnish recipe disappears.
    if (isFixtureBuild) return [];
    // The sealed legacy source/approved GK study stays in the internal audit,
    // but its explicitly quarantined recipe must have no public route/GL card.
    if (isPublicRecipeQuarantined(result.recipeId) && publishedRecipeSources.has(result.recipeId)) return [];
    throw new Error(`Finnish published recipe is missing for GL pilot item: ${result.recipeId}`);
  }
  const translations = siteContent.recipes.filter((entry) => entry.recipeId === result.recipeId);
  const recipeIdentity = {
    recipeId: result.recipeId,
    title: recipe.title,
    routePath: recipe.routePath,
    localeRoutes: Object.fromEntries(translations.map((entry) => [entry.locale, { title: entry.title, routePath: entry.routePath }])),
  };
  // Include this recipe in search while keeping its ingredient audit internal.
  if (result.recipeId === "maksalaatikko-kukkakaalilla" ||
      (result.recipeId === "hyderabadi-kanabiryani" && biryaniUsesReviewedMilk) ||
      (result.recipeId === coconutBananaRecipeId && coconutBananaNeedsGkReview) ||
      koreanRiceBowlsNeedingGkReview.has(result.recipeId) ||
      (result.recipeId === molletesRecipeId && molletesNeedsGkReview) ||
      (result.recipeId === dashimakiId && dashimakiNeedsGkReview)) return {
    ...recipeIdentity,
    status: "INSUFFICIENT SOURCE DATA",
    glycemicLoadPerServing: null,
    glycemicLoadRangePerServing: null,
    omittedAvailableCarbohydratePerServingG: 0,
    confidence: null,
    incompleteReasons: [],
    carbohydrateSources: [],
    sourceReferences: [],
  };
  const sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; evidenceKind?: "HUMAN_GI" | "PUBLISHED_IMPUTATION"; applicationKind?: "DIRECT" | "FOOD_ANALOGUE" | "PUBLISHED_IMPUTATION"; note: string }> = result.status === "CALCULATED"
    ? [...new Set(result.ingredients.flatMap((ingredient) => ingredient.giRecordId ? [ingredient.giRecordId] : []))]
      .map((recordId) => giRecords.find((record) => record.id === recordId))
      .filter((record): record is GlycemicIndexRecord => record !== undefined)
      .map((record) => ({
        title: record.source.title,
        url: record.source.url,
        matchKind: record.evidenceKind === "PUBLISHED_IMPUTATION" ? "CALCULATION_POLICY" : record.matchKind ?? "EXACT",
        evidenceKind: record.evidenceKind,
        applicationKind: catalogSourceApplication(record.evidenceKind, record.matchKind ?? "EXACT"),
        confidence: record.confidence ?? (record.qualityTier === "STRONG" ? "HIGH" : "LOW"),
        note: publicGiSourceNote(record),
      }))
    : [];
  if (result.candidateSources) sourceReferences.push(...result.candidateSources);
  if (result.status === "CALCULATED" && result.omittedAvailableCarbohydratePerServingG > 0 && sourceReferences.length === 0) {
    sourceReferences.push({
      title: "Documented small-contribution editorial tolerance",
      url: "/glykeeminen-kuorma/",
      matchKind: "CALCULATION_POLICY",
      confidence: "LOW",
      note: `Unmatched portions totalling ${result.omittedAvailableCarbohydratePerServingG.toFixed(3)} g available carbohydrate per serving were omitted within the cumulative ${CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G} g editorial tolerance.`,
    });
  }
  const incompleteReasons = result.blockers.map((blocker) => {
    const detail = blocker.startsWith(`${result.recipeId}: `) ? blocker.slice(result.recipeId.length + 2) : blocker;
    const separator = detail.indexOf(": ");
    const ingredient = separator >= 0 ? detail.slice(0, separator) : "";
    const reason = separator >= 0 ? detail.slice(separator + 2) : detail;
    // Pending review is not evidence that a source search failed.
    const category = /\bnot (?:yet )?(?:been )?reviewed\b/i.test(reason) ? "REVIEW_PENDING"
      : /GI/i.test(reason) ? "GI"
      : /food-specific mass conversion|food-specific.*mass|portion mass|gram conversion/i.test(reason) ? "PORTION"
      : /allows materially different|alternative|selected liquid|variant/i.test(reason) ? "VARIANT"
      : /amount|quantity|mass is missing|unweighed|implausible|unit or decimal/i.test(reason) ? "AMOUNT"
      : "SOURCE";
    const ingredientIndex = recipe.ingredients.findIndex((entry) => entry.item === ingredient);
    const ingredientNames = Object.fromEntries(translations.map((entry) => [entry.locale, ingredientIndex >= 0 ? entry.ingredients[ingredientIndex]?.item : undefined]));
    return { ingredientIndex, ingredientNames, category };
  });
  const ingredientEvidence = result.status === "CALCULATED" ? result.ingredients.flatMap((ingredient) => {
    if (!ingredient.matchKind || !ingredient.giRecordId || ingredient.gi === null) return [];
    const source = giRecords.find((record) => record.id === ingredient.giRecordId);
    const index = recipe.ingredients.findIndex((entry) => entry.item === ingredient.name);
    const ingredientNames = Object.fromEntries(translations.map((entry) => [entry.locale, index >= 0 ? entry.ingredients[index]?.item : undefined]));
    return [{
      name: ingredient.name,
      ingredientNames,
      matchKind: ingredient.matchKind,
      evidenceKind: source?.evidenceKind,
      applicationKind: catalogSourceApplication(source?.evidenceKind, ingredient.matchKind),
      giRecordId: ingredient.giRecordId,
      foodRecordId: ingredient.fineliRecordId,
    }];
  }) : [];
  return {
    ...recipeIdentity,
    ...(ingredientEvidence.length ? { ingredientEvidence } : {}),
    status: result.status,
    incompleteReasons,
    glycemicLoadPerServing: result.glycemicLoadPerServing,
    glycemicLoadRangePerServing: result.glycemicLoadRangePerServing,
    omittedAvailableCarbohydratePerServingG: result.omittedAvailableCarbohydratePerServingG,
    confidence: result.confidence,
    assessmentType: result.assessmentType,
    closedRecoveryC: result.closedRecoveryC,
    ...(result.boundedPolyolC ? {boundedPolyolC:true} : {}),
    modelScenario: result.modelScenario,
    carbohydrateSources: result.candidateCarbohydrateSources ?? [...new Set(result.ingredients.flatMap((ingredient) => ingredient.fineliRecordId ? [ingredient.fineliRecordId] : []))]
      .map((recordId) => foodRecords.find((record) => record.id === recordId))
      .filter((record): record is FoodRecord => record !== undefined)
      .map((record) => ({
        // Repair legacy Fineli label encoding in the public citation only.
        title: record.id.startsWith("fineli-")
          ? record.name.replaceAll("Ã¤", "ä").replaceAll("Ã¶", "ö").replaceAll("Ã„", "Ä")
          : record.name,
        url: record.sourceUrl,
        note: record.id.startsWith("afcd-")
          ? "Available-carbohydrate value from AFCD Release 3; FSANZ attribution and CC BY-SA 3.0 Australia terms apply."
          : "Available-carbohydrate value from THL Fineli Rel20; CC BY 4.0.",
      })),
    sourceReferences,
  };
});
// The internal, source-sealed GI/GK report retains all historical originals,
// while deliberately quarantined recipes must not have public GL cards.
const expectedPublicResultCount = expectedRecipeIds.filter(
  (id) => !isPublicRecipeQuarantined(id),
).length;
if (!isFixtureBuild && publicResults.length !== expectedPublicResultCount) {
  throw new Error(`Production GL pilot page must include all ${expectedPublicResultCount} publishable entries.`);
}
// Fixture content cannot inherit approval for the real published source versions.
const publicGkOnlyVariants = isFixtureBuild ? [] :
  gkOnlyVariants.filter(variant => !isPublicRecipeQuarantined(variant.recipeId));
const publicVersionCoverage = countGkVersions(
  isFixtureBuild ? results.filter(result => !isPublicRecipeQuarantined(result.recipeId)) : publicResults,
  publicGkOnlyVariants,
);
const gkOnlyModule = `/* Generated. Explicit GK-only version data; parent macros are separate. */\nimport type {GkOnlyVariant,GkVersionCoverage} from '../features/recipes/gk-only-types';\nexport const gkOnlyVariants:GkOnlyVariant[]=${JSON.stringify(publicGkOnlyVariants,null,2)};\nexport const gkVersionCoverage:GkVersionCoverage=${JSON.stringify(publicVersionCoverage,null,2)};\n`;
await writeFile(path.join(siteDir,'src/generated/gk-only-variants.generated.ts'),gkOnlyModule,'utf8');
const publicModule = `/* Generated by scripts/glycemic-load-pilot.ts. Public-safe summary only. */\nexport interface GlycemicLoadPilotPublicResult { recipeId: string; title: string; routePath: string; localeRoutes: Partial<Record<"fi" | "en" | "sv" | "th", { title: string; routePath: string }>>; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; ingredientEvidence?: Array<{ name: string; ingredientNames: Partial<Record<"fi" | "en" | "sv" | "th", string>>; matchKind: string; evidenceKind?: string; applicationKind?: string; giRecordId: string; foodRecordId: string | null }>; assessmentType?: "PUBLISHED_IMPUTATION"; closedRecoveryC?: boolean; boundedPolyolC?: boolean; modelScenario?: "POINT_SCENARIO" | "NAMED_SCENARIO_RANGE"; incompleteReasons: Array<{ ingredientIndex: number; ingredientNames: Partial<Record<"fi" | "en" | "sv" | "th", string>>; category: "GI" | "SOURCE" | "PORTION" | "VARIANT" | "AMOUNT" | "REVIEW_PENDING" }>; glycemicLoadPerServing: number | null; glycemicLoadRangePerServing: { min: number; max: number } | null; omittedAvailableCarbohydratePerServingG: number; confidence: "HIGH" | "MEDIUM" | "LOW" | null; carbohydrateSources: Array<{ title: string; url: string; note: string }>; sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; evidenceKind?: "HUMAN_GI" | "PUBLISHED_IMPUTATION"; applicationKind?: "DIRECT" | "FOOD_ANALOGUE" | "PUBLISHED_IMPUTATION"; note: string }>; }\nexport const glycemicLoadPilotReviewedRecipeCount = ${expectedRecipeIds.length};\nexport const glycemicLoadPilotResults: GlycemicLoadPilotPublicResult[] = ${JSON.stringify(publicResults, null, 2)};\n`;
await writeFile(path.join(siteDir, "src/generated/glycemic-load-pilot.generated.ts"), publicModule, "utf8");
// Emit only original-recipe categories; keep modified versions and evidence out of the listing bundle.
const glFilterCategories = Object.fromEntries(publicResults.flatMap(result => {
  const category = originalGlycemicLoadCategory(result);
  return category ? [[result.recipeId, category]] : [];
}));
const filterModule = '/* Generated: original-recipe GK categories only. */\n'
  + 'export type GlycemicLoadFilterCategory = "low" | "medium" | "high";\n'
  + 'export const glycemicLoadFilterCategories: Record<string, GlycemicLoadFilterCategory> = '
  + JSON.stringify(glFilterCategories) + ';\n';
await writeFile(path.join(siteDir, 'src/generated/glycemic-load-filters.generated.ts'), filterModule, 'utf8');
console.log(JSON.stringify({ ...report.summary, versionCoverage: {numericRecipes:versionCoverage.numericRecipes,additionalA:versionCoverage.additionalA,additionalB:versionCoverage.additionalB,missing:versionCoverage.missing,studyServings:versionCoverage.studyServingRecipeIds.length}, output: path.relative(root, outputPath), blockers: results.map((result) => ({ recipeId: result.recipeId, count: result.blockers.length })) }, null, 2));
