import type { GkOnlyVariant } from './gk-only-types';

export type GkVariantScope = 'RECIPE_VARIANT' | 'STUDY_COMPARISON';

// PR #286, HEAD 68bb4987: presentation correction for one sealed study bread.
// Its approved packet, input, number, preparation and authorization remain intact.
export const manakishStudyBinding = {
  recipeId: 'lahi-ita-manakish-zaatarilla',
  versionId: 'gk-operation80-review-61b30ec793a7',
  inputSha256: '61b30ec793a7e0c6bad854f5035fca783ad914b9b828f58c7c56f9354ba8bcda',
} as const;

export function gkVariantScope(variant: Pick<GkOnlyVariant, 'recipeId' | 'versionId' | 'inputSha256' | 'studyServing'>): GkVariantScope {
  if (variant.recipeId === manakishStudyBinding.recipeId) {
    if (variant.versionId !== manakishStudyBinding.versionId || variant.inputSha256 !== manakishStudyBinding.inputSha256) {
      throw Error('GK_SCOPE_REVIEW_REQUIRED: manakish study binding changed');
    }
    return 'STUDY_COMPARISON';
  }
  return variant.studyServing ? 'STUDY_COMPARISON' : 'RECIPE_VARIANT';
}
