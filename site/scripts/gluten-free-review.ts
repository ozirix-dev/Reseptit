/**
 * Recipe-specific gluten-free review evidence is checked when building a published
 * recipe. This does not certify the food or kitchen: it prevents unsupported,
 * nonexistent or stale editorial metadata from silently entering the index.
 */
export interface GlutenFreeReviewBinding {
  recipeId: string;
  language: "fi" | "en" | "sv" | "th";
  reviewedAt: string;
  reviewer: string;
  sourceSha256: string;
}
export function assertGlutenFreeReviewRecord(binding: GlutenFreeReviewBinding, markdown: string): void {
  const lines = new Set(markdown.replaceAll("\r\n", "\n").split("\n").map(row => row.trim()));
  const required = [
    `recipe_id: ${binding.recipeId}`,
    `language: ${binding.language}`,
    `reviewed_at: ${binding.reviewedAt}`,
    `reviewer: ${binding.reviewer}`,
    `source_sha256: ${binding.sourceSha256}`,
    "decision: approved",
    "ingredient_checks: complete",
    "cross_contact: reviewed",
  ];
  for (const line of required) {
    if (!lines.has(line)) throw new Error(`GLUTEN_FREE_REVIEW_MISMATCH: ${binding.recipeId}/${binding.language} missing ${line}`);
  }
}
