/** Exact code compatibility for the reviewed carbohydrate and GK corrections.
 * PR #826 proposes exact compatibility for the independently compared EU-total guard.
 * Original approval/source receipts remain sealed. No source or release authority is added.
 * Regression evidence covers every current calculation and GK-only variant; this is not
 * permission to accept arbitrary calculator revisions or change an approved result.
 */
export function acceptsReviewedNutritionModelBinding(file: string, expected: unknown, actual: string): boolean {
  if (file === 'site/scripts/glycemic-load-model.ts') {
    return expected === '10ce09e465886e4538fc0b2ad2a54ca0b050a9e3729b7417eb0a91f2b946b48c'
      && actual === '7d602dd45be3e23b3e7036cf1671ec9d70fdd8cf580030a3b3aaa7e6de03e4ad';
  }
  return file === 'site/scripts/nutrition-model.ts'
    && expected === '6667190a6604523fe083d6d766cfbbdb7c2ce75366194f3036ce711a8218a7ce'
    && (actual === '05a3edc945b444edd4c99aff90be6a17129559ee7779f8f5e372bf46877195d3'
      || actual === '2bf067ad44544b1cce522304077a39eed0628a393a707d5ef6d1029747002045'
      || actual === '066c0549505ac49c3153b071d9cd9deba87948adfc6c18757558770819e161ed');
}
