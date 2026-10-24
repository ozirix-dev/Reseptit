import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FoodRecord } from "./nutrition-model";
import { calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadRecipeInput } from "./glycemic-load-model";
import { siteContent } from "../src/generated/content.generated";

const siteDir = path.resolve(import.meta.dirname, "..");
const root = path.resolve(siteDir, "..");
const expectedRecipeIds = [
  "munakokkeli", "munakasmuffinit", "munakasrulla-pinaatti-tuorejuustolla", "munatacot-huevos-rancheros",
  "paprikauunimunakkaat", "shakshuka", "uunimuna-avokadot", "uunimunat-pinaatilla", "tortilla-de-patatas", "vhh-lihamureke",
  "hummus", "chili-con-carne-kukkakaaliriisi", "ratatouille", "vhh-kaalikaarryleet", "jauheliha-kaalikeitto-vhh",
  "taytetyt-paprikat-vhh", "vhh-kaalilaatikko", "munakoiso-jauhelihavuoka-vhh", "valimerellinen-kikherne-yrttiaamiainen", "lahi-ita-kikherne-shakshuka", "massaman-curry-kanalla-vhh",
  "chole-bhature", "gulab-jamun", "samosa", "aloo-paratha", "vada-pav", "pani-puri", "jauheliha-makaronilaatikko",
  "medu-vada", "lohikeitto-kuohukermalla", "butter-chicken", "punainen-kanacurry-vhh", "thai-vihrea-curry-kanalla-vhh",
  "panang-curry-kanalla-vhh", "menemen", "lihapullat-kermakastikkeessa-vhh", "kanakorma-kukkakaaliriisilla",
  "uunikanapasta-kesakurpitsa", "khao-kha-moo-vhh", "larb-moo-vhh", "jauhelihakastike-kesakurpitsanuudeleilla",
  "pizza-margherita", "meheva-suklaakakku", "marjakiisseli-vaniljakastikkeella",
  "pannacotta-marjakastikkeella", "caponata", "siemengranola-jogurtilla",
];
const recipeCategories: Record<string, string> = {
  "tortilla-de-patatas": "paaruoat", "vhh-lihamureke": "paaruoat", hummus: "alkuruoat",
  "chili-con-carne-kukkakaaliriisi": "paaruoat", ratatouille: "paaruoat", "vhh-kaalikaarryleet": "paaruoat",
  "jauheliha-kaalikeitto-vhh": "paaruoat", "taytetyt-paprikat-vhh": "paaruoat", "vhh-kaalilaatikko": "paaruoat",
  "munakoiso-jauhelihavuoka-vhh": "paaruoat", "valimerellinen-kikherne-yrttiaamiainen": "aamupalat",
  "lahi-ita-kikherne-shakshuka": "aamupalat",
  "massaman-curry-kanalla-vhh": "paaruoat",
  "chole-bhature": "paaruoat", "gulab-jamun": "jalkiruoat", samosa: "alkuruoat", "aloo-paratha": "paaruoat",
  "vada-pav": "alkuruoat", "pani-puri": "alkuruoat", "jauheliha-makaronilaatikko": "paaruoat", "medu-vada": "alkuruoat",
  "lohikeitto-kuohukermalla": "paaruoat", "butter-chicken": "paaruoat", "punainen-kanacurry-vhh": "paaruoat",
  "thai-vihrea-curry-kanalla-vhh": "paaruoat", "panang-curry-kanalla-vhh": "paaruoat", menemen: "paaruoat",
  "lihapullat-kermakastikkeessa-vhh": "paaruoat", "kanakorma-kukkakaaliriisilla": "paaruoat",
  "uunikanapasta-kesakurpitsa": "paaruoat", "khao-kha-moo-vhh": "paaruoat", "larb-moo-vhh": "paaruoat",
  "jauhelihakastike-kesakurpitsanuudeleilla": "paaruoat",
  "pizza-margherita": "paaruoat", "meheva-suklaakakku": "jalkiruoat",
  "marjakiisseli-vaniljakastikkeella": "jalkiruoat", "pannacotta-marjakastikkeella": "jalkiruoat",
  caponata: "alkuruoat", "siemengranola-jogurtilla": "aamupalat",
};
const recipeFileNames: Record<string, string> = { "vhh-kaalilaatikko": "kaalilaatikko" };

const [input, foodRecords, giSource] = await Promise.all([
  readFile(path.join(root, "docs/nutrition/glycemic-load-pilot-input.json"), "utf8").then((text) => JSON.parse(text)),
  readFile(path.join(root, "docs/nutrition/food-records.json"), "utf8").then((text) => JSON.parse(text) as FoodRecord[]),
  readFile(path.join(root, "docs/nutrition/glycemic-index-records.json"), "utf8").then((text) => JSON.parse(text)),
]);

const inputs = input.recipes as GlycemicLoadRecipeInput[];
const actualIds = inputs.map((recipe) => recipe.recipeId);
if (actualIds.length !== expectedRecipeIds.length || new Set(actualIds).size !== actualIds.length
    || expectedRecipeIds.some((id) => !actualIds.includes(id))) {
  throw new Error(`Glycemic-load pilot input must contain exactly the ${expectedRecipeIds.length} selected recipes.`);
}

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
const sourceHashes = Object.fromEntries(await Promise.all(expectedRecipeIds.map(async (recipeId) => {
  const category = recipeCategories[recipeId] ?? "aamupalat";
  const recipePath = path.join(root, "reseptit", category, `${recipeFileNames[recipeId] ?? recipeId}.md`);
  const contents = (await readFile(recipePath, "utf8")).replaceAll("\r\n", "\n");
  return [recipeId, createHash("sha256").update(contents).digest("hex")];
})));

const results = inputs.map((recipe) => calculateGlycemicLoad(recipe, foodRecords, giRecords));
input.selectionNotes.newBatch = "Six further recipes were added in this batch because matching ingredient-level Fineli/AFCD calculation records were available. Fourteen other high-ranking candidates remain for later batches until ingredient mappings, masses and preparation details are checked. Existing recipe-level carbohydrate estimates were used only to rank candidates; each published GL is recalculated ingredient by ingredient.";
const report = {
  generatedAt: new Date().toISOString(),
  scope: "Internal provenance report for ingredient-based per-serving estimates. These are not measurements of prepared meals or individual glucose responses.",
  formula: "sum(GI_i × available carbohydrate_i per serving) / 100",
  fineliEvidence: input.fineliEvidence,
  additionalCarbohydrateEvidence: input.additionalCarbohydrateEvidence ?? null,
  massEvidence: input.massEvidence,
  selectionNotes: input.selectionNotes ?? {},
  giSourcePolicy: "Published, traceable glucose-scale GI values are preferred. Explicit analogs and category means are accepted with match type, confidence, source and limitation recorded. Ingredient portions below 1 g available carbohydrate per serving are omitted. This is an estimate, not a measurement of a mixed meal.",
  giSourceCatalog: giSource.sources,
  sourceHashes,
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
  if (result.status === "CALCULATED" && sourceReferences.length === 0) {
    sourceReferences.push({
      title: "Pilot calculation policy: omit contributions below 1 g per serving",
      url: "/glykeeminen-kuorma/",
      matchKind: "CALCULATION_POLICY",
      confidence: "LOW",
      note: "This is a site-specific calculation convention, not a measured GI value. No ingredient reaches the 1 g available-carbohydrate threshold in this recipe.",
    });
  }
  return {
    recipeId: result.recipeId,
    title: recipe.title,
    routePath: recipe.routePath,
    localeRoutes: Object.fromEntries(siteContent.recipes.filter((entry) => entry.recipeId === result.recipeId).map((entry) => [entry.locale, { title: entry.title, routePath: entry.routePath }])),
    status: result.status,
    glycemicLoadPerServing: result.glycemicLoadPerServing,
    glycemicLoadRangePerServing: result.glycemicLoadRangePerServing,
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
if (!isFixtureBuild && publicResults.length !== expectedRecipeIds.length) {
  throw new Error(`Production GL pilot page must include all ${expectedRecipeIds.length} selected recipes.`);
}
const publicModule = `/* Generated by scripts/glycemic-load-pilot.ts. Public-safe summary only. */\nexport interface GlycemicLoadPilotPublicResult { recipeId: string; title: string; routePath: string; localeRoutes: Partial<Record<"fi" | "en" | "sv" | "th", { title: string; routePath: string }>>; status: "CALCULATED" | "INSUFFICIENT SOURCE DATA"; glycemicLoadPerServing: number | null; glycemicLoadRangePerServing: { min: number; max: number } | null; confidence: "HIGH" | "MEDIUM" | "LOW" | null; carbohydrateSources: Array<{ title: string; url: string; note: string }>; sourceReferences: Array<{ title: string; url: string; matchKind: "EXACT" | "ANALOG" | "CATEGORY_MEAN" | "CALCULATION_POLICY"; confidence: "HIGH" | "MEDIUM" | "LOW"; note: string }>; }\nexport const glycemicLoadPilotResults: GlycemicLoadPilotPublicResult[] = ${JSON.stringify(publicResults, null, 2)};\n`;
await writeFile(path.join(siteDir, "src/generated/glycemic-load-pilot.generated.ts"), publicModule, "utf8");
console.log(JSON.stringify({ ...report.summary, output: path.relative(root, outputPath), blockers: results.map((result) => ({ recipeId: result.recipeId, count: result.blockers.length })) }, null, 2));
