import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { parseMarkdown } from "../src/content/markdown";
import type { GkOnlyVariant } from "../src/features/recipes/gk-only-types";
import type { GlycemicLoadResult } from "./glycemic-load-model";
import { projectPublishedMarkdown } from "./build-content";
import { f25SourceGatePreflight } from "./f25-source-release-gate";
import { contentHash, loadCurrentReview } from "./translation-review";

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
  results: Pick<GlycemicLoadResult, "recipeId" | "status" | "blockers">[];
  newPublicGkPendingSources: { recipeId: string; sourceBlobSha: string; reason: string }[];
  sourceHashes: Record<string, string>;
  recipeBindingMismatches: string[];
  calculationInputMismatches: string[];
  calculationEvidenceMismatches: string[];
  gkOnlyVariants: GkOnlyVariant[];
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
  return { sources, review, nutrition, glycemic, publicRecipes: siteContent.recipes,
    publicGk: glycemicLoadPilotResults, publicVariants: gkOnlyVariants, f25: f25SourceGatePreflight().rows, blobs };
}

export type RecipeStateInputs = Awaited<ReturnType<typeof readRecipeStateInputs>>;
