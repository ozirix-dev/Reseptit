import { readFile } from "node:fs/promises";
import path from "node:path";
import { assertSnackPublicationReady } from "../src/content/recipe-validation";
import type { recipeFrontmatterSchema } from "../src/content/schema";
import type { z } from "zod";
import { validateReview } from "./new-recipe-preflight.mjs";
import { verifyNutritionEvidence } from "./nutrition-evidence";
import { nutritionKeys } from "./nutrition-field-approval";
import type { Calculation } from "./nutrition-model";

type Recipe = z.infer<typeof recipeFrontmatterSchema>;

export async function assertReviewedSnackPublication(
  recipe: Recipe, root: string, sourcePath: string,
): Promise<void> {
  const withholdsAll = recipe.status === "published" && recipe.category === "valipala"
    && recipe.language === "fi" && nutritionKeys.every(key => recipe[key] === null);
  if (!withholdsAll) {
    assertSnackPublicationReady(recipe);
    return;
  }

  const reviewPath = "docs/reviews/new-recipes/" + recipe.recipe_id + ".json";
  const evidencePath = "docs/nutrition/calculations/" + recipe.recipe_id + ".json";
  const [source, reviewText, evidenceText] = await Promise.all(
    [sourcePath, reviewPath, evidencePath].map(file => readFile(path.join(root, file), "utf8")),
  );
  const review = JSON.parse(reviewText);
  const evidence = JSON.parse(evidenceText) as Calculation;
  const reviewErrors = validateReview(sourcePath, source, review);
  const verified = verifyNutritionEvidence(recipe, evidence);
  if (reviewErrors.length || review.nutrition_evidence !== evidencePath
    || evidence.publicationStatus !== "WITHHELD_SOURCE_INCOMPLETE"
    || verified.status !== "INSUFFICIENT SOURCE DATA" || verified.errors.length) {
    throw new Error([recipe.recipe_id + ": snack nutrition withholding review is missing or invalid",
      ...reviewErrors, ...verified.errors].join("\n"));
  }

  assertSnackPublicationReady(recipe, true);
}
