import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";

// Read-only release preflight. This script never publishes, edits or approves recipes.
export const karnivoreFi3Ids = ["karnivore-steak-and-eggs","karnivore-voilohi-pannulla","karnivore-jauhelihakulho-munalla"] as const;
export type Blocker =
  | "DRAFT_SOURCE_ONLY"
  | "IMAGE_NOT_VERSIONED"
  | "IMAGE_METADATA_MISSING"
  | "NUTRITION_CALCULATION_MISSING"
  | "PUBLIC_MACROS_WITHHELD"
  | "SOURCE_IDENTITY_NOT_APPROVED";
export type ReadinessRow = { recipeId: string; ready: false; blockers: Blocker[]; evidence: { recipePath: string; imagePath: string; nutritionPath: string; proxies: number; unresolved: number } };

async function exists(file: string): Promise<boolean> {
  try { await access(file); return true; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return false; throw error; }
}

export async function auditKarnivoreFi3Readiness(root: string): Promise<ReadinessRow[]> {
  const sourceMapPath = path.join(root, "docs/reviews/karnivore-10-nutrition-source-map-2026-11-11.json");
  const map = JSON.parse(await readFile(sourceMapPath, "utf8")) as {
    recipes: Array<{ recipeId: string; inputs: Array<{ sourceMatch: string }> }>;
  };
  const result: ReadinessRow[] = [];
  for (const recipeId of karnivoreFi3Ids) {
    const relativeRecipe = `tuonti/karnivore/paaruoat/${recipeId}.md`;
    const parsed = parseMarkdown(await readFile(path.join(root, relativeRecipe), "utf8"));
    if (!parsed) throw Error(`${recipeId}: missing recipe frontmatter`);
    const recipe = recipeFrontmatterSchema.parse(parsed.data);
    if (recipe.recipe_id !== recipeId || recipe.language !== "fi") throw Error(`${recipeId}: wrong recipe identity`);
    const row = map.recipes.find((candidate) => candidate.recipeId === recipeId);
    if (!row) throw Error(`${recipeId}: missing source-map row`);
    const proxies = row.inputs.filter((input) => input.sourceMatch === "proxy").length;
    const unresolved = row.inputs.filter((input) => input.sourceMatch === "unresolved").length;
    const imageRelative = `kuvat/paaruoat/${recipeId}.webp`;
    const nutritionRelative = `docs/nutrition/calculations/${recipeId}.json`;
    const blockers: Blocker[] = [];
    // This exact queue is not a public source even if its status is changed accidentally.
    blockers.push("DRAFT_SOURCE_ONLY");
    if (!(await exists(path.join(root, imageRelative)))) blockers.push("IMAGE_NOT_VERSIONED");
    if (recipe.image?.src !== `paaruoat/${recipeId}.webp` ||
        recipe.image?.width !== 1280 || recipe.image?.height !== 853 ||
        !recipe.image?.alt.trim()) blockers.push("IMAGE_METADATA_MISSING");
    if (!(await exists(path.join(root, nutritionRelative)))) blockers.push("NUTRITION_CALCULATION_MISSING");
    if (["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"]
        .some((key) => typeof recipe[key as keyof typeof recipe] !== "number"))
      blockers.push("PUBLIC_MACROS_WITHHELD");
    if (proxies || unresolved) blockers.push("SOURCE_IDENTITY_NOT_APPROVED");
    result.push({
      recipeId, ready: false, blockers,
      evidence: { recipePath: relativeRecipe, imagePath: imageRelative, nutritionPath: nutritionRelative, proxies, unresolved },
    });
  }
  return result;
}
