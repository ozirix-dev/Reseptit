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
  const presentationChecks = await Promise.all(
    Object.entries(glycemic.originalReleaseBindings ?? {}).map(async ([id, binding]) => {
      const current = fiPublic.get(id);
      const source = sources.find(row => row.language === "fi" && row.recipe_id === id && row.file === binding.sourcePath);
      if (!current || !source || source.hash !== binding.sourceSha256) return null;
      const markdown = (await readFile(path.join(repoRoot, source.file), "utf8")).replaceAll("\r\n", "\n");
      if (contentHash(markdown) !== source.hash) return null;
      const parsed = parseMarkdown(markdown);
      if (!parsed) return null;
      const differences: ReleasePresentationDifference[] = [];
      if (source.effectiveHash !== source.hash) {
        const projected = projectPublishedMarkdown(source.file, markdown);
        if (contentHash(projected) !== source.effectiveHash || !onlyCookingMethodMetadataChanged(markdown, projected)) {
          differences.push("effective-source");
        }
      }
      const ingredients = parsed.data.ingredients;
      const { instructions, notes } = recipePreparationSections(markdown);
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
