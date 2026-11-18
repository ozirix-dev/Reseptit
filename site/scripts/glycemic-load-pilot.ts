import { molletesHistoricalText, molletesRecipeId, molletesSourcePath } from "./molletes-reviewed-source";
import { koreanRiceBowlHistoricalText } from "./korean-rice-bowls-reviewed-source";
import { coconutBananaHistoricalBindingText, coconutBananaRecipeId } from "./coconut-banana-reviewed-source";
import { biryaniSourceBeforeReview, biryaniSourcePath } from "./biryani-reviewed-source";
import {countPublishedGkEstimates} from '../src/features/recipes/gk-estimate';
import { loadReviewedPortions, projectPortionEvidence } from "./gk-portion-projection";
import type { OriginalGkCoverage, PortionEvidence } from "../src/features/recipes/gk-portion";
import { withholdF25Nutrition } from "../src/features/recipes/f25-nutrition-withhold";
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
import {recipeTextForApprovedSnapshot, reviewedRecipesWithHistoricalGk} from './approved-recipe-note-edits';
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
import { applyCopyEdits, reviewedRecipeCopy } from "./public-recipe-copy-r2";
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

const [input, historicalFoodRecords, giSource, correctedCreamCheeseEvidence] = await Promise.all([
  readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((text) => JSON.parse(text)),
  readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((text) => JSON.parse(text) as FoodRecord[]),
  readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((text) => JSON.parse(text)),
  readFile(path.join(root, "docs/nutrition/calculations/keto-joulutortut.json"), "utf8").then((text) => JSON.parse(text)),
]);
const correctedCreamCheese = (correctedCreamCheeseEvidence.ingredients as { record?: FoodRecord }[])
  .find(({ record }) => record?.id === "fineli-34764-release-20")?.record;
if (!correctedCreamCheese || historicalFoodRecords.some(({ id }) => id === correctedCreamCheese.id)) {
  throw new Error("Expected one scoped composition record for the corrected joulutortut cream cheese.");
}
const foodRecords = [...historicalFoodRecords, correctedCreamCheese];
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
const sourceHashes = Object.fromEntries(expectedRecipeIds.map((recipeId) => {
  const source = publishedRecipeSources.get(recipeId);
  if (!source) throw new Error("Published source recipe is missing from the current GK set: " + recipeId);
  const file = recipeId === "munakoiso-kesakurpitsalasagne"
    ? "reseptit/paaruoat/munakoiso-kesakurpitsalasagne.md"
    : `reseptit/aamupalat/${recipeId}.md`;
  // The legacy inputs still describe the historical biryani recipe.
  const markdown = recipeId === "hyderabadi-kanabiryani"
    ? biryaniSourceBeforeReview(biryaniSourcePath, source.markdown)
    : recipeId === coconutBananaRecipeId
      ? coconutBananaHistoricalBindingText(source.markdown)
      : reviewedRecipesWithHistoricalGk.has(file)
        ? recipeTextForApprovedSnapshot(file, source.markdown, "original-gk")
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
const currentLegacyInputs = new Map<string, (typeof rawResults)[number]>();
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
  currentLegacyInputs.set(result.recipeId, result);
  const usesImputation = result.ingredients.some((ingredient) =>
    giRecords.find((record) => record.id === ingredient.giRecordId)?.evidenceKind === "PUBLISHED_IMPUTATION");
  return usesImputation ? {...result, assessmentType: "PUBLISHED_IMPUTATION" as const, modelScenario: "POINT_SCENARIO" as const} : result;
});
const namedScenarios = new Map<string, ReadonlyMap<string, number>>();
const results = await applyScopedPolyolC(root, await applyRecovery(root, await withdrawQ09Tea(root, await applyGk80Release(root, legacyResults, namedScenarios))));
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
const reviewedPortions = await loadReviewedPortions(root);
// Alternate names in older, already-bound calculation inputs.
const coverageIngredientNames: Record<string, Record<string, string>> = {
  "munakasrulla-pinaatti-tuorejuustolla": { tuorejuusto: "tuorejuustoa" },
  halloumimunakas: { halloumijuustoa: "halloumia" },
  "paahdettu-aamiaismunakoiso": { munakoisoa: "munakoiso" },
  "valimerellinen-menemen-fetalla": { "vihreää paprikaa": "vihreä paprika" },
};
const legacyPublicResults = results.flatMap((result) => {
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
      reviewedPortions[result.recipeId]?.legacyGkHold === true ||
      (result.recipeId === "hyderabadi-kanabiryani" && biryaniUsesReviewedMilk) ||
      (result.recipeId === coconutBananaRecipeId && coconutBananaNeedsGkReview) ||
      koreanRiceBowlsNeedingGkReview.has(result.recipeId) ||
      (result.recipeId === molletesRecipeId && molletesNeedsGkReview)) return {
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
  // Evidence refers to the canonical ingredient names. Locate their display
  // rows using the same wording as the recipe builder before localizing them.
  const ingredientItemEdits = reviewedRecipeCopy(recipe.recipeId, "fi")?.ingredientItem;
  const findIngredientIndex = (canonicalName: string) => {
    const displayName = applyCopyEdits(canonicalName, ingredientItemEdits);
    return recipe.ingredients.findIndex((entry) => entry.item === displayName);
  };
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
    const ingredientIndex = findIngredientIndex(ingredient);
    const ingredientNames = Object.fromEntries(translations.map((entry) => [entry.locale, ingredientIndex >= 0 ? entry.ingredients[ingredientIndex]?.item : undefined]));
    return { ingredientIndex, ingredientNames, category };
  });
  const ingredientEvidence = result.status === "CALCULATED" ? result.ingredients.flatMap((ingredient) => {
    if (!ingredient.matchKind || !ingredient.giRecordId || ingredient.gi === null) return [];
    const source = giRecords.find((record) => record.id === ingredient.giRecordId);
    const index = findIngredientIndex(ingredient.name);
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
  const review = reviewedPortions[result.recipeId];
  if (review?.ingredientGkEvidenceSha256 !== undefined && (
    result.status !== "CALCULATED" || result.ingredients !== currentLegacyInputs.get(result.recipeId)?.ingredients
    || review.ingredientGkEvidenceSha256 !== calculationEvidenceHashes[result.recipeId]
  )) {
    throw new Error(`${result.recipeId}: re-review the GK subtotal against the current calculation evidence.`);
  }
  const omission = result.omittedAvailableCarbohydratePerServingG;
  const upperBound = result.omittedAvailableCarbohydrateUpperBoundPerServingG;
  let originalGkCoverage: OriginalGkCoverage | undefined;
  if (result.status === "CALCULATED" && result.ingredients === currentLegacyInputs.get(result.recipeId)?.ingredients
      && result.unroundedGlycemicLoadPerServing !== null && !result.glycemicLoadRangePerServing
      && omission > 0 && upperBound >= 0 && upperBound <= omission
      && !review?.condition && !review?.carbohydrateScope && !review?.classLimitation) {
    originalGkCoverage = { estimatedOmissionG: omission - upperBound, upperBoundOmissionG: upperBound };
    const positive = result.ingredients.filter(row => row.giContribution !== null && row.giContribution > 0);
    const total = result.unroundedGlycemicLoadPerServing;
    const main = positive.find(row => total !== null && row.giContribution! > total / 2);
    const totalByIngredient = positive.reduce((sum, row) => sum + row.giContribution!, 0);
    if (main && total !== null && Math.abs(total - totalByIngredient) < 1e-9) {
      const canonical = coverageIngredientNames[result.recipeId]?.[main.name] ?? main.name;
      const displayName = applyCopyEdits(canonical, ingredientItemEdits);
      const index = findIngredientIndex(canonical);
      if (index >= 0 && recipe.ingredients.filter(row => row.item === displayName).length === 1) {
        const { amount } = recipe.ingredients[index];
        const names = Object.fromEntries(translations.flatMap(entry => {
          const ingredient = entry.ingredients[index];
          return entry.ingredients.length === recipe.ingredients.length
            && ingredient && ingredient.amount === amount ? [[entry.locale, ingredient.item]] : [];
        }));
        originalGkCoverage.mainIngredient = {
          names, share: positive.length === 1 ? "all" : "majority", categoryMean: main.matchKind === "CATEGORY_MEAN",
        };
      }
    }
  }
  return {
    ...recipeIdentity,
    ...(ingredientEvidence.length ? { ingredientEvidence } : {}),
    ...(originalGkCoverage && { originalGkCoverage }),
    status: result.status,
    unroundedGlycemicLoadPerServing: result.unroundedGlycemicLoadPerServing,
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
if (!isFixtureBuild && legacyPublicResults.length !== expectedPublicResultCount) {
  throw new Error(`Production GL pilot page must include all ${expectedPublicResultCount} publishable entries.`);
}
// Fixture content cannot inherit approval for the real published source versions.
const publicGkOnlyVariants = isFixtureBuild ? [] :
  gkOnlyVariants.filter(variant => !isPublicRecipeQuarantined(variant.recipeId));
const publicVersionCoverage = countGkVersions(
  isFixtureBuild ? results.filter(result => !isPublicRecipeQuarantined(result.recipeId)) : legacyPublicResults,
  publicGkOnlyVariants,
);
const gkOnlyModule = `/* Generated. Explicit GK-only version data; parent macros are separate. */\nimport type {GkOnlyVariant,GkVersionCoverage} from '../features/recipes/gk-only-types';\nexport const gkOnlyVariants:GkOnlyVariant[]=${JSON.stringify(publicGkOnlyVariants,null,2)};\nexport const gkVersionCoverage:GkVersionCoverage=${JSON.stringify(publicVersionCoverage,null,2)};\n`;
await writeFile(path.join(siteDir,'src/generated/gk-only-variants.generated.ts'),gkOnlyModule,'utf8');
const originals = siteContent.recipes.filter(recipe => recipe.locale === "fi");
const legacyPublicByRecipe = new Map(legacyPublicResults.map(result => [result.recipeId, result]));
const portions = await Promise.all(originals.map(async recipe => {
  const source = publishedRecipeSources.get(recipe.recipeId);
  if (isFixtureBuild || !source) return { recipe, projection: null };
  const review = reviewedPortions[recipe.recipeId];
  const projection = await projectPortionEvidence(root, recipe.recipeId, source.markdown, review);
  if (review?.alternativeLabels) {
    const scenarios = namedScenarios.get(recipe.recipeId);
    const labels = Object.entries(review.alternativeLabels);
    const publicResult = legacyPublicByRecipe.get(recipe.recipeId);
    const range = publicResult?.glycemicLoadRangePerServing;
    if (publicResult?.status !== "CALCULATED" || !("modelScenario" in publicResult) || publicResult.modelScenario !== "NAMED_SCENARIO_RANGE"
      || !range || !scenarios || scenarios.size !== labels.length
      || Math.min(...scenarios.values()) !== range.min || Math.max(...scenarios.values()) !== range.max
      || labels.some(([id]) => !scenarios.has(id))) {
      throw new Error(`${recipe.recipeId}: alternative labels must match the released GK scenarios.`);
    }
    projection.portion.alternatives = labels.map(([id, label]) => ({ label, gkPerServing: scenarios.get(id)! }));
  }
  if (review?.versionAlternativeLabels) {
    const { versionId, lower, upper } = review.versionAlternativeLabels;
    const approved = publicGkOnlyVariants.find(variant => variant.recipeId === recipe.recipeId && variant.versionId === versionId);
    if (!approved?.scenarioRange || approved.point !== null || !approved.limitation) {
      throw new Error(`${recipe.recipeId}: the reviewed separate-version comparison is unavailable.`);
    }
    const { min, max } = approved.scenarioRange;
    projection.portion.versionAlternatives = { versionId, choices: [
      { label: lower, gkPerServing: min }, { label: upper, gkPerServing: max },
    ] };
  }
  const knownCarbIngredient = review?.knownCarbIngredient;
  if (review && knownCarbIngredient && !projection.portion.driver) {
    const actualBinding = recipeBindingHash(source.markdown, recipeAliases.aliases);
    const verified = (actualBinding === sourceHashes[recipe.recipeId] ? currentLegacyInputs.get(recipe.recipeId) : undefined)?.ingredients.find(row => row.name === knownCarbIngredient
      && row.grams !== null && row.fineliRecordId && row.availableCarbohydratePerServingG !== null
      && row.availableCarbohydratePerServingG > 0 && !row.availableCarbohydratePerServingRangeG && !row.excludedReason);
    const record = foodRecords.find(record => record.id === verified?.fineliRecordId);
    const index = recipe.ingredients.findIndex(row => row.item === applyCopyEdits(knownCarbIngredient,
      reviewedRecipeCopy(recipe.recipeId, "fi")?.ingredientItem));
    if (!verified || verified.grams === null || record?.sourceUrl !== review.source || index < 0) {
      throw new Error(`${recipe.recipeId}: named carbohydrate source must be reviewed against current evidence.`);
    }
    const partial = projection.portion.ingredientPortion;
    if (partial && review.ingredientPortion?.index === index) {
      const verifiedCarbs = verified.availableCarbohydratePerServingG;
      const matchesCarbs = partial.availableCarbsGPerServing === undefined
        || (partial.unit === "g" && Math.abs(partial.amountPerServing * source.input.servings - verified.grams) < 1e-9
          && partial.source === (review.publicSource ?? review.source) && verifiedCarbs !== null
          && Math.abs(partial.availableCarbsGPerServing - verifiedCarbs) < 1e-9);
      if (!matchesCarbs || partial.declaredCarbsGPerServing !== undefined || partial.carbohydrateAlternatives) {
        throw new Error(`${recipe.recipeId}: partial carbohydrate amount must match the reviewed named source.`);
      }
    } else {
      projection.portion.driver = { ingredientIndex: index, coversMajority: false };
    }
  }
  return { recipe, projection };
}));
const publicPortions: Record<string, PortionEvidence> = Object.fromEntries(portions.flatMap(({ recipe, projection }) =>
  projection && Object.keys(projection.portion).length ? [[recipe.recipeId, projection.portion]] : []));
if (!isFixtureBuild) {
  for (const [id, review] of Object.entries(reviewedPortions)) {
    const otherId = review.carbohydrateComparisonRecipeId;
    if (otherId === undefined) continue;
    const local = publicPortions[id];
    const other = publicPortions[otherId];
    if (id === otherId || reviewedPortions[otherId]?.carbohydrateComparisonRecipeId !== id
        || !local?.availableCarbs || !other?.availableCarbs || local.wholeCarbohydrateChoices || other.wholeCarbohydrateChoices) {
      throw new Error(`${id}: paired recipe comparison needs two reciprocal whole-serving carbohydrate estimates.`);
    }
    const range = other.availableCarbs;
    local.carbohydrateComparisons = Object.fromEntries(siteContent.recipes.flatMap(({ recipeId, locale, title, routePath }) =>
      recipeId === otherId && !withholdF25Nutrition(id, locale) && !withholdF25Nutrition(otherId, locale)
        && siteContent.recipes.some(entry => entry.recipeId === id && entry.locale === locale)
        ? [[locale, { title, routePath, range }]] : []));
    if (!local.carbohydrateComparisons.fi) throw new Error(`${id}: paired carbohydrate comparison is missing its public original.`);
  }
}
const additional = portions.flatMap(({ recipe, projection }) => {
  if (!projection || !projection.zeroCarbohydrate && !projection.portion.verbal) return [];
  if (legacyPublicByRecipe.has(recipe.recipeId)) return [];
  const localeRoutes = Object.fromEntries(siteContent.recipes.filter(entry => entry.recipeId === recipe.recipeId)
    .map(({ locale, title, routePath }) => [locale, { title, routePath }]));
  return [{
    recipeId: recipe.recipeId, title: recipe.title, routePath: recipe.routePath, localeRoutes,
    status: projection.zeroCarbohydrate ? "CALCULATED" as const : "INSUFFICIENT SOURCE DATA" as const,
    glycemicLoadPerServing: projection.zeroCarbohydrate ? 0 : null, glycemicLoadRangePerServing: null,
    omittedAvailableCarbohydratePerServingG: 0, confidence: projection.zeroCarbohydrate ? "HIGH" as const : null,
    incompleteReasons: [], sourceReferences: [], carbohydrateSources: projection.source ? [{
      title: "Carbohydrate evidence", url: projection.source, note: "",
    }] : [],
  }];
});
const publicResults = [...legacyPublicResults, ...additional].map(result => ({
  ...result,
  ...(publicPortions[result.recipeId] ? { portionEvidence: publicPortions[result.recipeId] } : {}),
}));
const reviewedInSupplement = new Set(portions.filter(({ projection }) =>
  projection?.zeroCarbohydrate || projection?.portion.verbal).map(({ recipe }) => recipe.recipeId));
const publicPending = separatelyTrackedPublishedGk.map(result => result.recipeId).filter(id =>
  !reviewedInSupplement.has(id) && originals.some(recipe => recipe.recipeId === id));
const publicModule = `/* Generated by scripts/glycemic-load-pilot.ts. Public-safe summary only. */\nimport type { OriginalGkCoverage, PortionEvidence } from "../features/recipes/gk-portion";
export interface GlycemicLoadPilotPublicResult { portionEvidence?: PortionEvidence; originalGkCoverage?: OriginalGkCoverage; unroundedGlycemicLoadPerServing?: number | null; recipeId: string; title: string; routePath: string; localeRoutes: Partial<Record<"fi" | "en" | "sv" | "th", { title: string; routePath: string }>>; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; ingredientEvidence?: Array<{ name: string; ingredientNames: Partial<Record<"fi" | "en" | "sv" | "th", string>>; matchKind: string; evidenceKind?: string; applicationKind?: string; giRecordId: string; foodRecordId: string | null }>; assessmentType?: "PUBLISHED_IMPUTATION"; closedRecoveryC?: boolean; boundedPolyolC?: boolean; modelScenario?: "POINT_SCENARIO" | "NAMED_SCENARIO_RANGE"; incompleteReasons: Array<{ ingredientIndex: number; ingredientNames: Partial<Record<"fi" | "en" | "sv" | "th", string>>; category: "GI" | "SOURCE" | "PORTION" | "VARIANT" | "AMOUNT" | "REVIEW_PENDING" }>; glycemicLoadPerServing: number | null; glycemicLoadRangePerServing: { min: number; max: number } | null; omittedAvailableCarbohydratePerServingG: number; confidence: "HIGH" | "MEDIUM" | "LOW" | null; carbohydrateSources: Array<{ title: string; url: string; note: string }>; sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; evidenceKind?: "HUMAN_GI" | "PUBLISHED_IMPUTATION"; applicationKind?: "DIRECT" | "FOOD_ANALOGUE" | "PUBLISHED_IMPUTATION"; note: string }>; }\nexport const glycemicLoadPilotReviewedRecipeCount = ${expectedRecipeIds.length};\nexport const glycemicLoadPortions: Record<string, PortionEvidence> = ${JSON.stringify(publicPortions)};
export const glycemicLoadPendingRecipeIds: string[] = ${JSON.stringify(publicPending)};
export const glycemicLoadAdditionalResults: GlycemicLoadPilotPublicResult[] = ${JSON.stringify(publicResults.slice(legacyPublicResults.length), null, 2)};
export const glycemicLoadPilotResults: GlycemicLoadPilotPublicResult[] = ${JSON.stringify(publicResults.slice(0, legacyPublicResults.length), null, 2)};\n`;
await writeFile(path.join(siteDir, "src/generated/glycemic-load-pilot.generated.ts"), publicModule, "utf8");
// Emit only original-recipe categories; keep modified versions and evidence out of the listing bundle.
const glFilterCategories = Object.fromEntries(publicResults.flatMap(result => {
  const category = originalGlycemicLoadCategory(result, result.portionEvidence);
  return category ? [[result.recipeId, category]] : [];
}));
const filterModule = '/* Generated: original-recipe GK categories only. */\n'
  + 'export type GlycemicLoadFilterCategory = "low" | "medium" | "high";\n'
  + 'export const glycemicLoadFilterCategories: Record<string, GlycemicLoadFilterCategory> = '
  + JSON.stringify(glFilterCategories) + ';\n';
await writeFile(path.join(siteDir, 'src/generated/glycemic-load-filters.generated.ts'), filterModule, 'utf8');
console.log(JSON.stringify({ ...report.summary, versionCoverage: {numericRecipes:versionCoverage.numericRecipes,additionalA:versionCoverage.additionalA,additionalB:versionCoverage.additionalB,missing:versionCoverage.missing,studyServings:versionCoverage.studyServingRecipeIds.length}, output: path.relative(root, outputPath), blockers: results.map((result) => ({ recipeId: result.recipeId, count: result.blockers.length })) }, null, 2));
