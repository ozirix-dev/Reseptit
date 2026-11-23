/** Exact code compatibility for the reviewed carbohydrate and GK corrections.
 * PR #826 proposes exact compatibility for the independently compared EU-total guard.
 * Original approval/source receipts remain sealed. No source or release authority is added.
 * Regression evidence covers every current calculation and GK-only variant; this is not
 * permission to accept arbitrary calculator revisions or change an approved result.
 */
export function acceptsReviewedNutritionModelBinding(file: string, expected: unknown, actual: string): boolean {
  if (file === 'site/scripts/glycemic-load-model.ts') {
    return expected === '10ce09e465886e4538fc0b2ad2a54ca0b050a9e3729b7417eb0a91f2b946b48c'
      && actual === '70da5ceaf41a98b12c55674ae9f14b00f7b8ceb6e9f36274f2357230b2015eaa';
  }
  return file === 'site/scripts/nutrition-model.ts'
    && expected === '6667190a6604523fe083d6d766cfbbdb7c2ce75366194f3036ce711a8218a7ce'
    && (actual === '05a3edc945b444edd4c99aff90be6a17129559ee7779f8f5e372bf46877195d3'
      || actual === '2bf067ad44544b1cce522304077a39eed0628a393a707d5ef6d1029747002045'
      || actual === '5eaac9834ef966378d117633b6f2d84b438ca3a3eb36876d8c5d1513cc0bc4f4');
}
