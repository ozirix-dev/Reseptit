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
import type { RecipeEntry } from "../src/types/content";

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
  gkOnlyVariants: GkOnlyVariant[];
}

type ReleasePresentationDifference = "effective-source" | "servings" | "ingredients" | "preparation" | "notes";

// These published FI overlays were already reviewed against their sealed GK serving scope.
// The pins are used for queue diagnostics only, after verifying the original raw release.
const reviewedReleasePresentations = new Map([
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
  // FI breakfast quality overlay: four cold portions as in the sealed calculation.
  ["reseptit/aamupalat/yrttituorejuusto-kinkkurullat.md", ["gk80-release-2",
    "843ec4e3120c3d15cc03f9d6046345c5d5bd8a0dc60f5a579764cd6dca91b537"]],
]);

const reviewedGoldenHashes = new Map([
  ["docs/nutrition/gk80-release-1/golden.json", "e3d3bdff7371ea597ec793e2b170ffbf89566e5053fc0ba21f80bbf68fbd9b32"],
  ["docs/nutrition/gk80-release-2/golden.json", "e460c7754833adbf7672bd1070910be85b98cd0dd342e526f590abdae0ac808d"],
  ["docs/nutrition/gk80-release-3/golden.json", "0165778d3eb2bd2924930ff80c96a1740ec2bc71df3eb66e73ddd7a9d4b67247"],
]);

export function matchesReviewedReleasePresentation(
  sourcePath: string, evidencePath: string, evidenceHash: string | undefined, effectiveHash: string,
) {
  const reviewed = reviewedReleasePresentations.get(sourcePath);
  return reviewed !== undefined && evidencePath === `docs/nutrition/${reviewed[0]}/golden.json` &&
    evidenceHash !== undefined && evidenceHash === reviewedGoldenHashes.get(evidencePath) && effectiveHash === reviewed[1];
}

export function onlyCookingMethodMetadataChanged(raw: string, projected: string) {
  const original = parseMarkdown(raw);
  const effective = parseMarkdown(projected);
  if (!original || !effective || original.content !== effective.content) return false;
  const { cooking_method: originalMethod, ...originalMetadata } = original.data;
  const { cooking_method: effectiveMethod, ...effectiveMetadata } = effective.data;
  return !isDeepStrictEqual(originalMethod, effectiveMethod) && isDeepStrictEqual(originalMetadata, effectiveMetadata);
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
  const ingredientScope = (rows: RecipeEntry["ingredients"]) =>
    JSON.stringify(rows.map(row => [row.item, row.amount, row.unit, row.note ?? null]));
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
      let presentation = markdown;
      if (source.effectiveHash !== source.hash) {
        const projected = projectPublishedMarkdown(source.file, markdown);
        const projectedHash = contentHash(projected);
        if (projectedHash === source.effectiveHash &&
            matchesReviewedReleasePresentation(source.file, binding.evidencePath,
              goldenHashes.get(binding.evidencePath), projectedHash)) {
          presentation = projected;
        } else if (projectedHash !== source.effectiveHash || !onlyCookingMethodMetadataChanged(markdown, projected)) {
          differences.push("effective-source");
        }
      }
      const parsed = parseMarkdown(presentation);
      if (!parsed) return null;
      const ingredients = parsed.data.ingredients;
      const { instructions, notes } = recipePreparationSections(presentation);
      const reviewedInstructions = applyReviewedGramListSpacing(instructions, reviewedRecipeCopy(id, "fi")?.method);
      const [instructionsHtml, steps, notesHtml] = await Promise.all([
        renderSafeMarkdown(reviewedInstructions), renderInstructionSteps(reviewedInstructions), renderSafeMarkdown(notes),
      ]);
      if (parsed.data.servings !== current.servings) differences.push("servings");
      if (!Array.isArray(ingredients) ||
          ingredientScope(ingredients) !== ingredientScope(current.kitchenIngredients ?? current.ingredients)) {
        differences.push("ingredients");
      }
      if (current.ingredientPreparation?.length || instructionsHtml !== current.instructionsHtml ||
          !isDeepStrictEqual(steps, current.instructionStepsHtml)) differences.push("preparation");
      if (notesHtml !== current.notesHtml) differences.push("notes");
      return [id, differences] as const;
    }),
  );
  const originalReleasePresentationDifferences = new Map(presentationChecks.filter(check => check !== null));
  return { sources, review, nutrition, glycemic, publicRecipes: siteContent.recipes, originalReleasePresentationDifferences,
    publicGk: glycemicLoadPilotResults, publicVariants: gkOnlyVariants, f25: f25SourceGatePreflight().rows, blobs };
}

export type RecipeStateInputs = Awaited<ReturnType<typeof readRecipeStateInputs>>;
