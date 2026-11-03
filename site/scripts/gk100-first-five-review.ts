import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { GkOnlyVariantPanel } from '../src/features/recipes/GkOnlyVariantPanel';
import type { GkOnlyVariant, LocalizedText } from '../src/features/recipes/gk-only-types';
import { textHash } from './gk149-model';

const locales = ['fi', 'en', 'sv', 'th'] as const;
type PointReviewCandidate = {
  recipeId: string;
  servings: number;
  reviewState: string;
  publicationAuthorized: boolean;
  boundFiles: Record<string, string>;
  preparation: LocalizedText;
  limitation: LocalizedText;
  unroundedGk: string;
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

export function buildPointReviewVariant(root: string, packetPath: string): GkOnlyVariant {
  const read = (file: string) => readFileSync(join(root, file), 'utf8');
  const raw = read(packetPath);
  const c: PointReviewCandidate = JSON.parse(raw);
  if (c.reviewState !== 'PREPARED_FOR_REVIEW' || c.publicationAuthorized !== false
      || !Number.isInteger(c.servings) || c.servings <= 0
      || c.inputs.length === 0 || c.inputs.length > c.ingredients.length
      || Object.keys(c.boundFiles).length !== 2) throw Error('Invalid GK point review: ' + packetPath);
  for (const [file, hash] of Object.entries(c.boundFiles)) {
    if (textHash(read(file)) !== hash) throw Error('GK point binding changed: ' + file);
  }
  for (const t of [c.preparation, c.limitation, ...c.ingredients.map(i => i.name)]) {
    if (!locales.every(locale => t[locale]?.trim())) throw Error('GK point translation missing: ' + c.recipeId);
  }
  const point = c.inputs.reduce((sum, [amount, cho, gi, unit], index) => {
    const ingredient = c.ingredients[index];
    const boundAmount = unit === 'ml' && ingredient.grams === null && ingredient.quantity?.unit === 'ml'
      ? ingredient.quantity.amount
      : unit === undefined ? ingredient.grams : null;
    if (amount !== boundAmount || ![amount, cho, gi].every(n => Number.isFinite(n) && n >= 0)
        || cho > 100 || (cho > 0 && gi === 0)) throw Error('Invalid GK point input: ' + c.recipeId);
    return sum + amount * cho * gi;
  }, 0) / (10000 * c.servings);
  if (!Number.isFinite(Number(c.unroundedGk)) || Math.abs(point - Number(c.unroundedGk)) > 1e-10) {
    throw Error('GK point calculation changed: ' + c.recipeId);
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
      if (!row || row[3] === 'ml' || indices.has(inputIndex) || ingredientIndex < c.inputs.length
          || grams == null || !Number.isFinite(grams) || grams < 0) {
        throw Error('Invalid GK range replacement: ' + c.recipeId);
      }
      indices.add(inputIndex);
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
  const seen = new Set<number>();
  const omittedCho = (c.omissions ?? []).reduce((sum, row) => {
    const ingredient = c.ingredients[row.ingredientIndex];
    const liquid = 'choPer100ml' in row;
    const amount = liquid
      ? (ingredient?.quantity?.unit === 'ml' ? ingredient.quantity.amount : null)
      : ingredient?.grams;
    const concentration = liquid ? row.choPer100ml : row.choPer100g;
    if (row.ingredientIndex < c.inputs.length || seen.has(row.ingredientIndex)
        || amount == null || !Number.isFinite(amount) || !Number.isFinite(concentration)) {
      throw Error('Invalid GK omitted ingredient: ' + c.recipeId);
    }
    seen.add(row.ingredientIndex);
    const cho = amount * concentration / (100 * c.servings);
    if (!(cho > 0 && cho < 1)) throw Error('GK omission exceeds ingredient limit: ' + c.recipeId);
    return sum + cho;
  }, 0);
  if (omittedCho >= 2) throw Error('GK omissions exceed cumulative limit: ' + c.recipeId);
  const inputSha256 = textHash(raw);
  return {
    recipeId: c.recipeId, versionId: 'gk-operation80-review-' + inputSha256.slice(0, 12), inputSha256,
    level: 'B', servings: c.servings, point: scenarioRange ? null : point, scenarioRange,
    rangeKind: scenarioRange ? 'NAMED_COMPARATOR_SCENARIOS' : null,
    omittedCho, confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
    quantityContract: 'GK_ONLY_NATIVE_UNITS_V1', standalonePreparation: true,
    ingredients: c.ingredients, preparation: c.preparation, limitation: c.limitation,
    codingKinds: [], sensitivity: null, sources: c.sources,
  };
}


const packets = [
  'gk100-rescue-jiaozi',
  'gk80-operation80-chow-mein',
  'gk100-rescue-serabi',
  'gk100-rescue-dan-dan',
  'gk80-operation80-soba',
];
const root = join(import.meta.dirname, '..', '..');
const variants = packets.map(packet => buildPointReviewVariant(
  root, 'docs/nutrition/' + packet + '-release-candidate.json',
));
if (new Set(variants.map(variant => variant.recipeId)).size !== packets.length) {
  throw new Error('Duplicate recipe in first-five GK review');
}
for (const variant of variants) {
  for (const locale of locales) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null,
      createElement(GkOnlyVariantPanel, { variant, locale, servings: variant.servings })));
    const limitation = variant.limitation?.[locale];
    if (!limitation || !html.includes(limitation.replaceAll('&', '&amp;'))) {
      throw new Error('GK review limitation missing: ' + variant.recipeId + ' ' + locale);
    }
  }
}
console.log(JSON.stringify(variants.map(({ recipeId, inputSha256, point, scenarioRange }) =>
  ({ recipeId, inputSha256, point, scenarioRange })), null, 2));
