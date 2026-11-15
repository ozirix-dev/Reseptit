/** F25 source-review notices shown without altering source recipe Markdown or GK-sealed content.
 *  A disclaimer is not a release authorization, nutrition recalculation, or quarantine action.
 */
export interface SourceReviewNotice {
  heading: string;
  details: string;
  allergens: string;
}

export const sourceReviewNotices: Readonly<Record<string, SourceReviewNotice>> = Object.freeze({});

export function sourceReviewNotice(recipeId: string): SourceReviewNotice | null {
  return sourceReviewNotices[recipeId] ?? null;
}
