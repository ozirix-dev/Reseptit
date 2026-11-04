// Evidence and recipe applicability are separate review decisions.
export type EvidenceKind = 'HUMAN_GI' | 'PUBLISHED_IMPUTATION';
export type ApplicationKind = 'DIRECT' | 'FOOD_ANALOGUE' | 'PUBLISHED_IMPUTATION';
/** Catalog matches alone do not establish that a measured preparation applies to a recipe. */
export function catalogSourceApplication(kind: EvidenceKind | undefined, match: string): ApplicationKind | undefined {
  if (kind === 'PUBLISHED_IMPUTATION') return 'PUBLISHED_IMPUTATION';
  if (kind === 'HUMAN_GI' && match === 'ANALOG') return 'FOOD_ANALOGUE';
  return undefined;
}

export function classifyGk80Source(kind: unknown, match: string) {
  if (kind !== 'HUMAN_GI' && kind !== 'PUBLISHED_IMPUTATION') throw Error('UNKNOWN_EVIDENCE_KIND');
  if (kind === 'PUBLISHED_IMPUTATION' && match === 'DIRECT') throw Error('IMPUTATION_NOT_MEASURED');
  return {evidenceKind: kind as EvidenceKind,
    applicationKind: (kind === 'PUBLISHED_IMPUTATION' ? 'PUBLISHED_IMPUTATION' : match === 'DIRECT' ? 'DIRECT' : 'FOOD_ANALOGUE') as ApplicationKind,
    matchKind: kind === 'PUBLISHED_IMPUTATION' ? 'CALCULATION_POLICY' as const : match === 'DIRECT' ? 'EXACT' as const : 'ANALOG' as const};
}
