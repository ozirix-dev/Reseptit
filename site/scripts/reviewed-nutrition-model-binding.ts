/** Exact code-only compatibility for PR #168's US C-F-P correction.
 * Original approval/source receipts remain sealed. No source or release authority is added.
 * Regression evidence covers every current calculation and GK-only variant; this is not
 * permission to accept arbitrary calculator revisions or change an approved result.
 */
export function acceptsReviewedNutritionModelBinding(file: string, expected: string, actual: string): boolean {
  return file === 'site/scripts/nutrition-model.ts'
    && expected === '6667190a6604523fe083d6d766cfbbdb7c2ce75366194f3036ce711a8218a7ce'
    && actual === '05a3edc945b444edd4c99aff90be6a17129559ee7779f8f5e372bf46877195d3';
}
