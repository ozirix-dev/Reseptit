import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { parseMarkdown, renderInstructionSteps, renderSafeMarkdown } from "../src/content/markdown";
import type { GkOnlyVariant } from "../src/features/recipes/gk-only-types";
import type { GlycemicLoadRecipeInput, GlycemicLoadResult } from "./glycemic-load-model";
import type { OriginalGkReleaseBinding } from "./gk80-release";
import { projectPublishedMarkdown, recipePreparationSections } from "./build-content";
import { f25SourceGatePreflight } from "./f25-source-release-gate";
import { applyReviewedGramListSpacing, reviewedRecipeCopy } from "./public-recipe-copy-r2";
import { contentHash, loadCurrentReview } from "./translation-review";
import { projectEggWeightReferences, projectIngredientList } from "./public-ingredient-list";
import { reviewedEggCounts } from "./reviewed-egg-counts";
import type { RecipeEntry, RecipeIngredient } from "../src/types/content";

export const repoRoot = path.resolve(import.meta.dirname, "../..");
export const git = (...args: string[]) => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
const json = async <T>(file: string): Promise<T> => JSON.parse(await readFile(path.join(repoRoot, file), "utf8"));

const identity = z.object({
  recipe_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  language: z.enum(["fi", "en", "sv", "th"]),
  status: z.enum(["published", "draft"]),
  url_slug: z.string(),
});

interface NutritionReport {
  inventory: { recipe_id: string; source_path: string; source_content_hash: string; status: string; calculationEvidence: string | null }[];
}

interface GlycemicReport {
  results: Pick<GlycemicLoadResult, "recipeId" | "status" | "blockers" | "servings" |
    "glycemicLoadPerServing" | "glycemicLoadRangePerServing">[];
  originalReleaseBindings?: Record<string, OriginalGkReleaseBinding>;
  newPublicGkPendingSources: { recipeId: string; sourceBlobSha: string; reason: string }[];
  sourceHashes: Record<string, string>;
  calculationInputs: GlycemicLoadRecipeInput[];
  calculationInputHashes: Record<string, string>;
  calculationEvidenceHashes: Record<string, string>;
  recipeBindingMismatches: string[];
  calculationInputMismatches: string[];
  calculationEvidenceMismatches: string[];
  unreviewedAutoIncludedRecipeIds?: string[];
  gkOnlyVariants: GkOnlyVariant[];
}

type ReleasePresentationDifference = "effective-source" | "servings" | "ingredients" | "preparation" | "notes";

// These published FI overlays were already reviewed against their sealed GK serving scope.
// The pins are used for queue diagnostics only, after verifying the original raw release.
type ReviewedReleasePresentation = readonly [pack: string, sourceSha: string, servingSha?: string];
const reviewedReleasePresentations = new Map<string, ReviewedReleasePresentation>([
  // gk80-fi-editorial-display-pilot: dry rice, chicken and retained broth in two portions.
  ["reseptit/aamupalat/vietnamilainen-chao-ga-kanapuuro.md", ["gk80-release-1",
    "2468c93fa4f1391f327a366775895a12a7868a0326f768123c30460470ca0620"]],
  ["reseptit/aamupalat/indonesialainen-bubur-ayam-kanariisipuuro.md", ["gk80-release-1",
    "001e5cfa6974116dae4f884248ef215d320bae6eab1fb04ddf2c773ffbd512cb"]],
  // a8-fi-editorial-overlay: drained konjac, all broth and sauces in four portions.
  ["reseptit/paaruoat/shoyu-kanakeitto-konjac.md", ["gk80-release-3",
    "33491312853f4b8ca7d4ca652f33484e78ade5df99a4879d2e67c0ab201eec5b"]],
  // d30-whole-milk-fi-display: the sealed calculation already specifies whole milk.
  ["reseptit/aamupalat/pohjoisafrikkalainen-minttutee-kaurapuuro.md", ["gk80-release-1",
    "f36d39e0a35112562f4d55925cb2aceed07b009281775ca4ea1432f671ebef1e"]],
  // A8 and GK80 editorial reviews: only the label for the same weighed, shelled egg changed.
  ["reseptit/paaruoat/lanttulaatikko-kermainen.md", ["gk80-release-6",
    "42563d373a73be18c8c85548c9c11090ba51c3efa0c221afd8df65c5117ef8a0"]],
  ["reseptit/aamupalat/pohjoisafrikkalainen-harissa-shakshuka.md", ["gk80-release-6",
    "049f9f2af7e74c36efce86a08cff98cc0fff649d66d8242327402c898c7d2b06"]],
  // Release-4 preparation and serving checks retain the complete weighed batch.
  // six equal cups, all bacon fat and two muffins per serving.
  ["reseptit/aamupalat/munakasmuffinit.md", ["gk80-release-4",
    "65afd469eca8f049e276edf3b51e8ffac1199c4bc5da7721079b07e19f85b5bd",
    "dad60a3ab8b912a76c763a312193ce828daaab3e25c6187fdf5b52303622e518"]],
  // two servings using the listed butter.
  ["reseptit/aamupalat/munakokkeli.md", ["gk80-release-4",
    "73b70be874882bb17388243182623522ee3411596115ec0443f9fe8bc87e2420",
    "32a44096d3fcb3cf41390afdb2c3188ca765a54619260feb93533c6eb55730fc"]],
  // two servings, 10 g of rapeseed oil included in the estimate.
  ["reseptit/aamupalat/thai-kai-jiao-yrteilla.md", ["gk80-release-4",
    "eeb0a0f1144002bebf46019403e5a2632217c16479cbfc01a482d5b9936c613e",
    "42c9e18a0689555d396df8e6fe6fa540fee70b44cf53252dd468f20af725006b"]],
  // six equal cups, drained tuna and two omelettes per serving.
  ["reseptit/aamupalat/tonnikalamunakkaat-uunissa.md", ["gk80-release-4",
    "4d4146f05c46dd4a3fbc95549eac4e6309c85d11028bc406dba489edb1683a61",
    "4683b9ea7e43192f421c5855e5b3197e49c91978abb1fed0dede6c18c8799a01"]],
  // all edible avocado and eggs in two equal servings.
  ["reseptit/aamupalat/uunimuna-avokadot.md", ["gk80-release-4",
    "56f5467028835328447e427fb0d226314180b920101205d88c4a2e3297f07546",
    "be090da8d4fcf18fffd774a149f02fd78c75dd1bac30cc28dc5ab73d2af37b5a"]],
  // two ramekins using the listed butter.
  ["reseptit/aamupalat/uunimunat-pinaatilla.md", ["gk80-release-4",
    "f9a686ffdb677d17ebeda6c06f90dd04734d8d0c2a544194ade2ab251d754ff6",
    "d3f5d63a25c5da04a766205bb2e04cbe6fec6394e03ea367da7dd7b59d0745c7"]],
  // six equal servings of all the pork and pan sauce.
  ["reseptit/paaruoat/uuniporsas-kermakastikkeessa-vhh.md", ["gk80-release-4",
    "540781106356ae605314d1fc849ea40277ba0da7db6afef4effd6fbb9ef43293",
    "a05e466256c885c0ae34e930b647e51a9a0ddca7f41979551568f90d21c6d160"]],
  // unpressed zucchini and six equal servings including all the cooking juices.
  ["reseptit/paaruoat/vhh-lihamureke.md", ["gk80-release-4",
    "4f759af39411b2253278348fd02abb4710a8d4fd6c2b67b463db7dcebc1ae4d7",
    "281cfedc780b515ff3cc7b0407dbff80c4c68929347f0d58d99d55781a6a0959"]],
  // FI breakfast quality overlay: four cold portions as in the sealed calculation.
  ["reseptit/aamupalat/yrttituorejuusto-kinkkurullat.md", ["gk80-release-2",
    "843ec4e3120c3d15cc03f9d6046345c5d5bd8a0dc60f5a579764cd6dca91b537"]],
]);

const reviewedGoldenHashes = new Map([
  ["docs/nutrition/gk80-release-4/golden.json", "11c689fd455dbe5a8164261c23fa5cf4cf401ec540f415595acea9b9423dc831"],
  ["docs/nutrition/gk80-release-6/golden.json", "b3f8cf53f6421133b4dd73b8b1e8846f76a57dc7e368a541a3cb228315b77483"],
  ["docs/nutrition/gk80-release-1/golden.json", "e3d3bdff7371ea597ec793e2b170ffbf89566e5053fc0ba21f80bbf68fbd9b32"],
  ["docs/nutrition/gk80-release-2/golden.json", "e460c7754833adbf7672bd1070910be85b98cd0dd342e526f590abdae0ac808d"],
  ["docs/nutrition/gk80-release-3/golden.json", "0165778d3eb2bd2924930ff80c96a1740ec2bc71df3eb66e73ddd7a9d4b67247"],
]);

export function reviewedReleasePresentation(
  sourcePath: string, evidencePath: string, evidenceHash: string | undefined, effectiveHash: string,
) {
  const reviewed = reviewedReleasePresentations.get(sourcePath);
  if (reviewed && evidencePath === `docs/nutrition/${reviewed[0]}/golden.json` &&
      evidenceHash !== undefined && evidenceHash === reviewedGoldenHashes.get(evidencePath) && effectiveHash === reviewed[1]) {
    return reviewed;
  }
  return undefined;
}

export function matchesReviewedReleasePresentation(
  sourcePath: string, evidencePath: string, evidenceHash: string | undefined, effectiveHash: string,
) {
  return reviewedReleasePresentation(sourcePath, evidencePath, evidenceHash, effectiveHash) !== undefined;
}

export function onlyCookingMethodMetadataChanged(raw: string, projected: string) {
  const original = parseMarkdown(raw);
  const effective = parseMarkdown(projected);
  if (!original || !effective || original.content !== effective.content) return false;
  const { cooking_method: originalMethod, ...originalMetadata } = original.data;
  const { cooking_method: effectiveMethod, ...effectiveMetadata } = effective.data;
  return !isDeepStrictEqual(originalMethod, effectiveMethod) && isDeepStrictEqual(originalMetadata, effectiveMetadata);
}

const ingredientScope = ({ item, amount, unit, note }: RecipeIngredient) =>
  [item, amount, unit, note ?? null];

export function verifiedFiEggPresentationWeights(
  id: string, source: RecipeIngredient[], current: Pick<RecipeEntry, "ingredients" | "kitchenIngredients">,
): (readonly [grams: number, count: number])[] {
  const kitchen = current.kitchenIngredients;
  if (!kitchen?.some(row => "eggWeightWithoutShellG" in row) || kitchen.length !== source.length ||
      current.ingredients.some(row => "eggWeightWithoutShellG" in row) ||
      !isDeepStrictEqual(source.map(ingredientScope), current.ingredients.map(ingredientScope))) return [];

  const weights: (readonly [number, number])[] = [];
  const equivalent = source.every((ingredient, index) => {
    const row = kitchen[index];
    if (isDeepStrictEqual(ingredientScope(ingredient), ingredientScope(row))) {
      return !("eggWeightWithoutShellG" in row);
    }
    const measurement = reviewedEggCounts[id]?.[index];
    if (!measurement || ingredient.unit !== "g" ||
        !/^(?:kuoretonta )?kananmunaa?(?: kuoretta| kuorettomana)?$/iu.test(ingredient.item) ||
        !("eggWeightWithoutShellG" in row) ||
        row.eggWeightWithoutShellG !== measurement[0] || ingredient.amount !== measurement[0] ||
        row.amount !== measurement[1]) return false;
    weights.push([measurement[0], measurement[1]]);
    return true;
  });
  if (!equivalent || !weights.length) return [];

  const expected = projectIngredientList(id, "fi", source, source).items;
  return kitchen.every((row, index) => isDeepStrictEqual(ingredientScope(row), ingredientScope(expected[index])) &&
    row.eggSingular === expected[index].eggSingular) ? weights : [];
}

export async function recipePresentationDifferences(
  id: string, markdown: string, current: RecipeEntry, reviewedServingSha?: string,
) {
  const differences: ReleasePresentationDifference[] = [];
  const parsed = parseMarkdown(markdown);
  if (!parsed) return null;
  const ingredients = parsed.data.ingredients;
  const { instructions, notes } = recipePreparationSections(markdown);
  const weights = Array.isArray(ingredients) ? verifiedFiEggPresentationWeights(id, ingredients, current) : [];
  const reviewedInstructions = projectEggWeightReferences("fi",
    applyReviewedGramListSpacing(instructions, reviewedRecipeCopy(id, "fi")?.method), weights);
  const [instructionsHtml, steps, notesHtml] = await Promise.all([
    renderSafeMarkdown(reviewedInstructions), renderInstructionSteps(reviewedInstructions), renderSafeMarkdown(notes),
  ]);
  if (parsed.data.servings !== current.servings) differences.push("servings");
  const kitchen = current.kitchenIngredients ?? current.ingredients;
  if (!Array.isArray(ingredients) || (!weights.length &&
      ([...current.ingredients, ...kitchen].some(row => "eggWeightWithoutShellG" in row) ||
        !isDeepStrictEqual(ingredients.map(ingredientScope), kitchen.map(ingredientScope))))) {
    differences.push("ingredients");
  }
  const matchesReviewedServing = reviewedServingSha !== undefined && !current.ingredientPreparation?.length &&
    contentHash(JSON.stringify([current.instructionsHtml, current.instructionStepsHtml ?? null, current.notesHtml])) === reviewedServingSha;
  if (!matchesReviewedServing) {
    if (current.ingredientPreparation?.length || instructionsHtml !== current.instructionsHtml ||
        !isDeepStrictEqual(steps, current.instructionStepsHtml)) differences.push("preparation");
    if (notesHtml !== current.notesHtml) differences.push("notes");
  }
  return differences;
}

export async function readRecipeStateInputs(sourceCommit: string) {
  const blobs = new Map(git("ls-tree", "-rz", sourceCommit, "--", "reseptit", "kaannokset", "kuvat").split("\0")
    .filter(Boolean).map(entry => {
      const [metadata, file] = entry.split("\t");
      return [file, metadata.split(" ")[2]] as const;
    }));
  const markdown = [...blobs.keys()].filter(file => /^(?:reseptit\/(?!_mallipohjat\/)|kaannokset\/).*\.md$/.test(file));
  const [sources, review, nutrition, glycemic, { siteContent }, { glycemicLoadPilotResults }, { gkOnlyVariants }] = await Promise.all([
    Promise.all(markdown.map(async file => {
      const raw = (await readFile(path.join(repoRoot, file), "utf8")).replaceAll("\r\n", "\n");
      const parsed = parseMarkdown(raw);
      if (!parsed) return [];
      const metadata = identity.parse(parsed.data);
      const hash = contentHash(raw);
      const effective = metadata.status === "published" ? projectPublishedMarkdown(file, raw) : raw;
      const data = effective === raw ? parsed.data : parseMarkdown(effective)!.data;
      const image = data.image as { src?: string } | undefined;
      return [{ ...metadata, file, blob: blobs.get(file)!, hash, effectiveHash: contentHash(effective),
        imagePath: typeof image?.src === "string" ? `kuvat/${image.src}` : null }];
    })).then(rows => rows.flat()),
    loadCurrentReview(Date.parse(git("show", "-s", "--format=%cI", sourceCommit).trim())),
    json<NutritionReport>("tmp/nutrition/audit.json"),
    json<GlycemicReport>("tmp/nutrition/glycemic-load-pilot.json"),
    import("../src/generated/content.generated"),
    import("../src/generated/glycemic-load-pilot.generated"),
    import("../src/generated/gk-only-variants.generated"),
  ]);
  const fiPublic = new Map(siteContent.recipes.filter(recipe => recipe.locale === "fi")
    .map(recipe => [recipe.recipeId, recipe]));
  const releases = Object.entries(glycemic.originalReleaseBindings ?? {});
  const currentReviewedEvidence = new Set(releases.map(([, binding]) => binding.evidencePath)
    .filter(file => reviewedGoldenHashes.has(file)));
  const goldenHashes = new Map(await Promise.all([...currentReviewedEvidence].map(async file =>
    [file, contentHash(await readFile(path.join(repoRoot, file), "utf8"))] as const)));
  const presentationChecks = await Promise.all(
    releases.map(async ([id, binding]) => {
      const current = fiPublic.get(id);
      const source = sources.find(row => row.language === "fi" && row.recipe_id === id && row.file === binding.sourcePath);
      if (!current || !source || source.hash !== binding.sourceSha256) return null;
      const markdown = (await readFile(path.join(repoRoot, source.file), "utf8")).replaceAll("\r\n", "\n");
      if (contentHash(markdown) !== source.hash) return null;
      const differences: ReleasePresentationDifference[] = [];
      const projected = source.effectiveHash === source.hash ? markdown : projectPublishedMarkdown(source.file, markdown);
      const projectedHash = contentHash(projected);
      const reviewed = projectedHash === source.effectiveHash ? reviewedReleasePresentation(
        source.file, binding.evidencePath, goldenHashes.get(binding.evidencePath), projectedHash) : undefined;
      if (source.effectiveHash !== source.hash && !reviewed &&
          (projectedHash !== source.effectiveHash || !onlyCookingMethodMetadataChanged(markdown, projected))) {
        differences.push("effective-source");
      }
      const renderedDifferences = await recipePresentationDifferences(
        id, reviewed ? projected : markdown, current, reviewed?.[2]);
      if (!renderedDifferences) return null;
      differences.push(...renderedDifferences);
      return [id, differences] as const;
    }),
  );
  const originalReleasePresentationDifferences = new Map(presentationChecks.filter(check => check !== null));
  return { sources, review, nutrition, glycemic, publicRecipes: siteContent.recipes, originalReleasePresentationDifferences,
    publicGk: glycemicLoadPilotResults, publicVariants: gkOnlyVariants, f25: f25SourceGatePreflight().rows, blobs };
}

export type RecipeStateInputs = Awaited<ReturnType<typeof readRecipeStateInputs>>;
