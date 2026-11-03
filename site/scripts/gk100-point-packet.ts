import type { GkOnlyVariant, LocalizedText } from '../src/features/recipes/gk-only-types';
import { textHash } from './gk149-model';

const locales = ['fi', 'en', 'sv', 'th'] as const;
export type PointReviewCandidate = {
  recipeId: string;
  servings: number;
  reviewState: string;
  publicationAuthorized: boolean;
  boundFiles: Record<string, string>;
  preparation: LocalizedText;
  limitation: LocalizedText;
  unroundedGk: string;
  exclusions?: { ingredientIndex: number; kind: 'ZERO_CHO' | 'ALREADY_COUNTED'; rationale: string; evidencePath: string }[];
  omissions?: ({ ingredientIndex: number } & ({ choPer100ml: number } | { choPer100g: number }))[];
  upperScenario?: {
    unroundedGk: string;
    replacements?: { inputIndex: number; ingredientIndex: number }[];
    giOverrides?: { inputIndex: number; gi: number }[];
    choOverrides?: { inputIndex: number; cho: number; gi?: number }[];
  };
  inputs: [amount: number, choPer100: number, gi: number, unit?: 'ml'][];
  ingredients: GkOnlyVariant['ingredients'];
  sources: GkOnlyVariant['sources'];
};

// The original five review packets predate explicit exclusions. Bind the
// compatibility data to their exact packet bytes and verified calculation notes.
const legacyExclusions: Record<string, NonNullable<PointReviewCandidate['exclusions']>> = {
  '6660ce5dbf2690ccb89c9da125a8c3ea00a6703a57ef92d33241a7f207932d9c': [
    { ingredientIndex: 8, kind: 'ZERO_CHO', rationale: 'Water', evidencePath: 'docs/nutrition/gk80-operation80-batch-35.md' },
    { ingredientIndex: 9, kind: 'ZERO_CHO', rationale: 'Sesame oil', evidencePath: 'docs/nutrition/gk80-operation80-batch-35.md' },
    { ingredientIndex: 10, kind: 'ZERO_CHO', rationale: 'Salt', evidencePath: 'docs/nutrition/gk80-operation80-batch-35.md' },
  ],
  '190fcd3422ebe04dee0a22d65d13ebca83c1de240e78898286fb75727623edf4': [
    { ingredientIndex: 8, kind: 'ZERO_CHO', rationale: 'Cooking oil', evidencePath: 'docs/nutrition/gk80-operation80-batch-25.md' },
    { ingredientIndex: 9, kind: 'ZERO_CHO', rationale: 'Sesame oil', evidencePath: 'docs/nutrition/gk80-operation80-batch-25.md' },
  ],
  '8fed31af6463e8c0907a294fc12b1e0162ee5cd86b986eeec7c04bd867b4b7ad': [
    { ingredientIndex: 4, kind: 'ZERO_CHO', rationale: 'Cooking oil', evidencePath: 'docs/nutrition/gk80-operation80-batch-28.md' },
  ],
  'ad22de231e93aa7f73a3ea6217d8ffadaf10994a1ce1cc1035f016503f2ba875': [
    { ingredientIndex: 8, kind: 'ALREADY_COUNTED', rationale: 'Cooking-water starch is counted in the uncooked noodle input', evidencePath: 'docs/nutrition/gk80-operation80-batch-26.md' },
    { ingredientIndex: 9, kind: 'ZERO_CHO', rationale: 'Cooking oil', evidencePath: 'docs/nutrition/gk80-operation80-batch-26.md' },
    { ingredientIndex: 10, kind: 'ZERO_CHO', rationale: 'Filtered chilli oil without solids or sugar', evidencePath: 'docs/nutrition/gk80-operation80-batch-26.md' },
  ],
};

export function parsePointReviewVariant(raw: string, read: (file: string) => string): GkOnlyVariant {
  const c: PointReviewCandidate = JSON.parse(raw);
  if (c.reviewState !== 'PREPARED_FOR_REVIEW' || c.publicationAuthorized !== false
      || !Number.isInteger(c.servings) || c.servings <= 0
      || c.inputs.length === 0 || c.inputs.length > c.ingredients.length
      || Object.keys(c.boundFiles).length !== 2) throw Error('Invalid GK point review: ' + c.recipeId);
  for (const [file, hash] of Object.entries(c.boundFiles)) {
    if (textHash(read(file)) !== hash) throw Error('GK point binding changed: ' + file);
  }
  for (const t of [c.preparation, c.limitation, ...c.ingredients.map(i => i.name)]) {
    if (!locales.every(locale => t[locale]?.trim())) throw Error('GK point translation missing: ' + c.recipeId);
  }
  for (const ingredient of c.ingredients) {
    const { grams, quantity } = ingredient;
    if (quantity ? grams !== null || !['ml', 'tbsp'].includes(quantity.unit)
      || !Number.isFinite(quantity.amount) || quantity.amount <= 0
      : grams !== null && (!Number.isFinite(grams) || grams <= 0)) {
      throw Error('Invalid GK ingredient quantity: ' + c.recipeId);
    }
  }
  for (const locale of locales) {
    for (const token of c.preparation[locale].matchAll(/\{\{(.*?)\}\}/g)) {
      if (token[1] !== 'servings' && !/^amount:\d+$/.test(token[1])) throw Error('Invalid preparation token');
      if (token[1] !== 'servings') {
        const ingredient = c.ingredients[Number(token[1].slice(7))];
        if (!ingredient || (ingredient.grams === null && !ingredient.quantity)) throw Error('Unbound preparation quantity');
      }
    }
  }
  const point = c.inputs.reduce((sum, [amount, cho, gi, unit], index) => {
    const ingredient = c.ingredients[index];
    const boundAmount = unit === 'ml' && ingredient.grams === null && ingredient.quantity?.unit === 'ml'
      ? ingredient.quantity.amount
      : unit === undefined ? ingredient.grams : null;
    if ((unit !== undefined && unit !== 'ml') || amount !== boundAmount || ![amount, cho, gi].every(n => Number.isFinite(n) && n >= 0)
        || cho > 100 || (cho > 0 && gi === 0)) throw Error('Invalid GK point input: ' + c.recipeId);
    return sum + amount * cho * gi;
  }, 0) / (10000 * c.servings);
  if (!Number.isFinite(Number(c.unroundedGk)) || Math.abs(point - Number(c.unroundedGk)) > 1e-10) {
    throw Error('GK point calculation changed: ' + c.recipeId);
  }
  const accounted = new Set<number>();
  function account(index: number) {
    if (!Number.isInteger(index) || index < c.inputs.length || index >= c.ingredients.length || accounted.has(index)) {
      throw Error('Invalid or duplicate GK ingredient accounting: ' + c.recipeId);
    }
    accounted.add(index);
  }
  let scenarioRange: GkOnlyVariant['scenarioRange'] = null;
  if (c.upperScenario) {
    if (c.omissions?.length && c.upperScenario.replacements?.length) {
      throw Error('Range omissions with ingredient replacements require scenario-specific bindings: ' + c.recipeId);
    }
    const indices = new Set<number>();
    let delta = 0;
    for (const { inputIndex, ingredientIndex } of c.upperScenario.replacements ?? []) {
      const row = c.inputs[inputIndex];
      const grams = c.ingredients[ingredientIndex]?.grams;
      if (!row || row[3] === 'ml' || indices.has(inputIndex)
          || grams == null || !Number.isFinite(grams) || grams < 0) {
        throw Error('Invalid GK range replacement: ' + c.recipeId);
      }
      indices.add(inputIndex);
      account(ingredientIndex);
      delta += (grams - row[0]) * row[1] * row[2];
    }
    for (const { inputIndex, gi } of c.upperScenario.giOverrides ?? []) {
      const row = c.inputs[inputIndex];
      if (!row || indices.has(inputIndex) || !Number.isFinite(gi) || gi <= 0) {
        throw Error('Invalid GK range GI override: ' + c.recipeId);
      }
      indices.add(inputIndex);
      delta += row[0] * row[1] * (gi - row[2]);
    }
    for (const { inputIndex, cho, gi } of c.upperScenario.choOverrides ?? []) {
      const row = c.inputs[inputIndex];
      const upperGi = gi ?? row?.[2] ?? NaN;
      if (!row || indices.has(inputIndex) || !Number.isFinite(cho) || cho < 0 || cho > 100
          || !Number.isFinite(upperGi) || upperGi < 0 || (cho > 0 && upperGi === 0)) {
        throw Error('Invalid GK range carbohydrate override: ' + c.recipeId);
      }
      indices.add(inputIndex);
      delta += row[0] * (cho * upperGi - row[1] * row[2]);
    }
    const max = point + delta / (10000 * c.servings);
    const expected = Number(c.upperScenario.unroundedGk);
    if (!Number.isFinite(expected) || max <= point || Math.abs(max - expected) > 1e-10) {
      throw Error('GK range calculation changed: ' + c.recipeId);
    }
    scenarioRange = { min: point, max };
  }
  const omittedCho = (c.omissions ?? []).reduce((sum, row) => {
    const ingredient = c.ingredients[row.ingredientIndex];
    const liquid = 'choPer100ml' in row;
    const amount = liquid
      ? (ingredient?.quantity?.unit === 'ml' ? ingredient.quantity.amount : null)
      : ingredient?.grams;
    const concentration = liquid ? row.choPer100ml : row.choPer100g;
    if (amount == null || !Number.isFinite(amount) || !Number.isFinite(concentration) || concentration > 100) {
      throw Error('Invalid GK omitted ingredient: ' + c.recipeId);
    }
    account(row.ingredientIndex);
    const cho = amount * concentration / (100 * c.servings);
    if (!(cho > 0 && cho < 1)) throw Error('GK omission exceeds ingredient limit: ' + c.recipeId);
    return sum + cho;
  }, 0);
  if (omittedCho >= 2) throw Error('GK omissions exceed cumulative limit: ' + c.recipeId);
  const inputSha256 = textHash(raw);
  for (const exclusion of c.exclusions ?? legacyExclusions[inputSha256] ?? []) {
    if (!['ZERO_CHO', 'ALREADY_COUNTED'].includes(exclusion.kind)
        || typeof exclusion.rationale !== 'string' || !exclusion.rationale.trim()
        || !/^docs\/nutrition\/[a-z0-9-]+\.md$/.test(exclusion.evidencePath)
        || !Object.hasOwn(c.boundFiles, exclusion.evidencePath)) {
      throw Error('Invalid GK ingredient exclusion: ' + c.recipeId);
    }
    account(exclusion.ingredientIndex);
  }
  const missing = c.ingredients.findIndex((_, index) => index >= c.inputs.length && !accounted.has(index));
  if (missing !== -1) throw Error('UNACCOUNTED_GK_INGREDIENT: ' + c.recipeId + ' index ' + missing);
  const level = omittedCho > 0 ? 'A' : 'B';
  if (level === 'A' && c.sources.some(source => source.kind === 'B_CODING')) {
    throw Error('B-only GI coding cannot be combined with A-method omissions: ' + c.recipeId);
  }
  return {
    recipeId: c.recipeId, versionId: 'gk-operation80-review-' + inputSha256.slice(0, 12), inputSha256,
    level, servings: c.servings, point: scenarioRange ? null : point, scenarioRange,
    rangeKind: scenarioRange ? 'NAMED_COMPARATOR_SCENARIOS' : null,
    omittedCho, confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
    quantityContract: 'GK_ONLY_NATIVE_UNITS_V1', standalonePreparation: true,
    ingredients: c.ingredients, preparation: c.preparation, limitation: c.limitation,
    codingKinds: [], sensitivity: null, sources: c.sources,
  };
}
