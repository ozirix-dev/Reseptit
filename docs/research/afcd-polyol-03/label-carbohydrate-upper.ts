/** Isolated source-model bound. Never imported by the publication pipeline. */
export function labelAvailableUpper(observation: any, quantityUnit: 'g' | 'ml') {
  if (quantityUnit !== 'g' || observation.basisUnit !== 'g' || observation.basisAmount !== 100) {
    throw Error('A gram quantity requires an explicit per100g label; density is not inferred');
  }
  if (observation.carbohydrateDefinition !== 'EU_CARBOHYDRATE_INCLUDING_POLYOLS') {
    throw Error('Label carbohydrate definition not verified for this adapter');
  }
  const value = observation.carbohydrate;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw Error('Label carbohydrate unknown or invalid; never coerce it to zero');
  }
  if (!observation.sourceUrl?.startsWith('https://') || !/^[0-9a-f]{64}$/.test(observation.sourceSha256)) {
    throw Error('Primary product source and document hash required');
  }
  return {
    availableMin: 0,
    availableUpper: value,
    valueState: value === 0 ? 'SOURCE_DECLARED_ZERO' : 'SOURCE_MODEL_UPPER_ONLY',
    totalPolyols: null,
    macroAuthorization: false,
    publicationAuthorization: false,
    interpretation: 'Upper only under the declared source composition; label variability is not a measured biological bound. No fibre or polyol-zero deduction.',
  };
}
