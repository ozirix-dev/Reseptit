import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FoodRecord } from "./nutrition-model";
import {
  calculateGlycemicLoad,
  CUMULATIVE_OMITTED_CARBOHYDRATE_TOLERANCE_G,
  MAX_UNMATCHED_GI_INGREDIENT_CARBOHYDRATE_G,
  type GlycemicIndexRecord,
  type GlycemicLoadRecipeInput,
} from "./glycemic-load-model";
import { glycemicLoadEvidenceHash, glycemicLoadInputHash, recipeBindingHash, recipeBindingMatches } from "./glycemic-load-recipe-binding";
import { siteContent } from "../src/generated/content.generated";
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
const publishedSourceRows = [...publishedRecipeSources.values()].map((source) => source.input);
const expectedRecipeIds = [...publishedRecipeSources.keys()].sort((left, right) => left.localeCompare(right));
const recipeBindings = JSON.parse(await readFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "utf8")) as {
  baselineCommit: string;
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
const sourceHashes = Object.fromEntries(expectedRecipeIds.map((recipeId) => {
  const source = publishedRecipeSources.get(recipeId);
  if (!source) throw new Error("Published source recipe is missing from the current GK set: " + recipeId);
  return [recipeId, recipeBindingHash(source.markdown, recipeAliases.aliases)];
}));

const rawResults = inputs.map((recipe) => calculateGlycemicLoad(recipe, foodRecords, giRecords));
const calculationInputHashes = Object.fromEntries(inputs.map((recipe) => [recipe.recipeId, glycemicLoadInputHash(recipe)]));
const calculationEvidenceHashes = Object.fromEntries(inputs.map((recipe) => [recipe.recipeId, glycemicLoadEvidenceHash(recipe, foodRecords, giRecords)]));
const results = rawResults.map((result) => {
  const boundHash = recipeBindings.recipes[result.recipeId];
  const recipeChanged = !recipeBindingMatches(boundHash, sourceHashes[result.recipeId]);
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
  return result;
});
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
  calculationInputs: inputs,
  recipeBindingMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.recipes[recipeId], sourceHashes[recipeId])),
  calculationInputMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.calculationInputs[recipeId], calculationInputHashes[recipeId])),
  calculationEvidenceMismatches: expectedRecipeIds.filter((recipeId) => !recipeBindingMatches(recipeBindings.calculationEvidence?.[recipeId], calculationEvidenceHashes[recipeId])),
  previousPublicBaseline: { sourceCommit: "b1c2bd3e036f0a17b3f61a560c39b5df56e1d8d5", calculated: 190, insufficientSourceData: 135, zeroTotals: 21, changedRecipeInputsAmongCalculated: 21 },
  giSourceCatalog: giSource.sources,
  sourceHashes,
  calculationInputHashes,
  calculationEvidenceHashes,
  results,
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
  // This recipe already has a dedicated central-page explanation for why its
  // earlier provisional total is withheld; keep its ingredient audit internal.
  if (result.recipeId === "maksalaatikko-kukkakaalilla") return [];
  const recipe = siteContent.recipes.find((entry) => entry.recipeId === result.recipeId && entry.locale === "fi");
  if (!recipe) {
    // Image-pipeline tests build a tiny one-recipe fixture. Keep that build
    // independent of the production-only GL pilot corpus, while still failing
    // a normal site build if any selected Finnish recipe disappears.
    if (isFixtureBuild) return [];
    throw new Error(`Finnish published recipe is missing for GL pilot item: ${result.recipeId}`);
  }
  const sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; note: string }> = result.status === "CALCULATED"
    ? [...new Set(result.ingredients.flatMap((ingredient) => ingredient.giRecordId ? [ingredient.giRecordId] : []))]
      .map((recordId) => giRecords.find((record) => record.id === recordId))
      .filter((record): record is GlycemicIndexRecord => record !== undefined)
      .map((record) => ({
        title: record.source.title,
        url: record.source.url,
        matchKind: record.matchKind ?? "EXACT",
        confidence: record.confidence ?? (record.qualityTier === "STRONG" ? "HIGH" : "LOW"),
        note: record.note ?? record.source.qualityEvidence,
      }))
    : [];
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
    const category = /GI/i.test(reason) ? "GI"
      : /food-specific mass conversion|food-specific.*mass|portion mass|gram conversion/i.test(reason) ? "PORTION"
      : /allows materially different|alternative|selected liquid|variant/i.test(reason) ? "VARIANT"
      : /amount|quantity|mass is missing|unweighed|implausible|unit or decimal/i.test(reason) ? "AMOUNT"
      : "SOURCE";
    const ingredientIndex = recipe.ingredients.findIndex((entry) => entry.item === ingredient);
    const translations = siteContent.recipes.filter((entry) => entry.recipeId === result.recipeId);
    const ingredientNames = Object.fromEntries(translations.map((entry) => [entry.locale, ingredientIndex >= 0 ? entry.ingredients[ingredientIndex]?.item : undefined]));
    return { ingredientIndex, ingredientNames, category };
  });
  return {
    recipeId: result.recipeId,
    title: recipe.title,
    routePath: recipe.routePath,
    localeRoutes: Object.fromEntries(siteContent.recipes.filter((entry) => entry.recipeId === result.recipeId).map((entry) => [entry.locale, { title: entry.title, routePath: entry.routePath }])),
    status: result.status,
    incompleteReasons,
    glycemicLoadPerServing: result.glycemicLoadPerServing,
    glycemicLoadRangePerServing: result.glycemicLoadRangePerServing,
    omittedAvailableCarbohydratePerServingG: result.omittedAvailableCarbohydratePerServingG,
    confidence: result.confidence,
    carbohydrateSources: [...new Set(result.ingredients.flatMap((ingredient) => ingredient.fineliRecordId ? [ingredient.fineliRecordId] : []))]
      .map((recordId) => foodRecords.find((record) => record.id === recordId))
      .filter((record): record is FoodRecord => record !== undefined)
      .map((record) => ({
        title: record.name,
        url: record.sourceUrl,
        note: record.id.startsWith("afcd-")
          ? "Available-carbohydrate value from AFCD Release 3; FSANZ attribution and CC BY-SA 3.0 Australia terms apply."
          : "Available-carbohydrate value from THL Fineli Rel20; CC BY 4.0.",
      })),
    sourceReferences,
  };
});
const expectedPublicResultCount = expectedRecipeIds.length - 1;
if (!isFixtureBuild && publicResults.length !== expectedPublicResultCount) {
  throw new Error(`Production GL pilot page must include all ${expectedPublicResultCount} publishable entries.`);
}
const publicModule = `/* Generated by scripts/glycemic-load-pilot.ts. Public-safe summary only. */\nexport interface GlycemicLoadPilotPublicResult { recipeId: string; title: string; routePath: string; localeRoutes: Partial<Record<"fi" | "en" | "sv" | "th", { title: string; routePath: string }>>; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; incompleteReasons: Array<{ ingredientIndex: number; ingredientNames: Partial<Record<"fi" | "en" | "sv" | "th", string>>; category: "GI" | "SOURCE" | "PORTION" | "VARIANT" | "AMOUNT" }>; glycemicLoadPerServing: number | null; glycemicLoadRangePerServing: { min: number; max: number } | null; omittedAvailableCarbohydratePerServingG: number; confidence: "HIGH" | "MEDIUM" | "LOW" | null; carbohydrateSources: Array<{ title: string; url: string; note: string }>; sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; note: string }>; }\nexport const glycemicLoadPilotReviewedRecipeCount = ${expectedRecipeIds.length};\nexport const glycemicLoadPilotResults: GlycemicLoadPilotPublicResult[] = ${JSON.stringify(publicResults, null, 2)};\n`;
await writeFile(path.join(siteDir, "src/generated/glycemic-load-pilot.generated.ts"), publicModule, "utf8");
console.log(JSON.stringify({ ...report.summary, output: path.relative(root, outputPath), blockers: results.map((result) => ({ recipeId: result.recipeId, count: result.blockers.length })) }, null, 2));
