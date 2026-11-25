import { readFile } from "node:fs/promises";
import path from "node:path";
import { assertSnackPublicationReady } from "../src/content/recipe-validation";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import type { z } from "zod";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import { nutritionKeys } from "./nutrition-field-approval";
import type { Calculation } from "./nutrition-model";
import { loadSemanticEvidence, semanticHash, semanticStatus } from "./translation-semantic-review";

type Recipe = z.infer<typeof recipeFrontmatterSchema>;

export async function assertReviewedSnackPublication(
  recipe: Recipe, root: string, sourcePath: string,
): Promise<void> {
  const withholdsAll = recipe.status === "published" && recipe.category === "valipala"
    && nutritionKeys.every(key => recipe[key] === null);
  if (!withholdsAll) {
    assertSnackPublicationReady(recipe);
    return;
  }

  assertSnackPublicationReady(recipe, true);

  const fiPath = recipe.language === "fi" ? sourcePath : `reseptit/valipalat/${recipe.recipe_id}.md`;
  if (recipe.language !== "fi" && (recipe.source_recipe !== fiPath
    || recipe.source_language !== "fi" || recipe.translation_of !== recipe.recipe_id)) {
    throw new Error(recipe.recipe_id + ": snack translation has no canonical Finnish source");
  }

  const reviewPath = "docs/reviews/new-recipes/" + recipe.recipe_id + ".json";
  const evidencePath = "docs/nutrition/calculations/" + recipe.recipe_id + ".json";
  const [source, reviewText, evidenceText] = await Promise.all(
    [fiPath, reviewPath, evidencePath].map(file => readFile(path.join(root, file), "utf8")),
  );
  const review = JSON.parse(reviewText);
  const evidence = JSON.parse(evidenceText) as Calculation;
  const { validateReview } = await import("./new-recipe-preflight.mjs");
  const fi = parseMarkdown(source);
  if (!fi) throw new Error(recipe.recipe_id + ": missing Finnish snack frontmatter");
  const fiData = recipeFrontmatterSchema.parse(fi.data);
  if (fiData.recipe_id !== recipe.recipe_id || fiData.language !== "fi" || fiData.status !== "published"
    || fiData.category !== "valipala" || !nutritionKeys.every(key => fiData[key] === null)) {
    throw new Error(recipe.recipe_id + ": Finnish snack withholding does not match the publication");
  }
  const reviewErrors = validateReview(fiPath, source, review);
  if (evidence?.publicationStatus !== "WITHHELD_SOURCE_INCOMPLETE" || !Array.isArray(evidence.ingredients)) {
    throw new Error(recipe.recipe_id + ": snack nutrition withholding review is missing or invalid");
  }
  const verified = verifyNutritionEvidence(recipe.language === "fi" ? recipe : fiData, evidence);
  if (reviewErrors.length || review.nutrition_evidence !== evidencePath
    || verified.status !== "INSUFFICIENT SOURCE DATA" || verified.errors.length) {
    throw new Error([recipe.recipe_id + ": snack nutrition withholding review is missing or invalid",
      ...reviewErrors, ...verified.errors].join("\n"));
  }

  if (recipe.language !== "fi") {
    const target = parseMarkdown(await readFile(path.join(root, sourcePath), "utf8"));
    if (!target) throw new Error(recipe.recipe_id + ": missing snack translation frontmatter");
    const semantic = await loadSemanticEvidence(root);
    const outcome = semanticStatus(
      semanticHash({ data: fiData, content: fi.content }),
      semanticHash({ data: recipe, content: target.content }),
      true,
      semantic[`${recipe.recipe_id}:${recipe.language}`],
    );
    if (outcome !== "REVIEW CURRENT") {
      throw new Error(`${recipe.recipe_id}:${recipe.language}: snack withholding translation ${outcome}`);
    }
  }
}
