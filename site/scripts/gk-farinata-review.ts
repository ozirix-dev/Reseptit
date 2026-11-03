import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { GkOnlyVariantPanel } from '../src/features/recipes/GkOnlyVariantPanel';
import type { GkOnlyVariant, LocalizedText } from '../src/features/recipes/gk-only-types';
import { textHash } from './gk149-model';

const locales = ['fi', 'en', 'sv', 'th'] as const;
const candidatePath = 'docs/nutrition/gk80-operation80-farinata-release-candidate.json';

type Ingredient = {
  name: LocalizedText;
  grams?: number;
  quantity?: { amount: number; unit: 'ml' | 'tbsp' };
  choPer100g: number;
  gi?: number | null;
  composition?: { id: string; url: string };
  giEvidence?: { kind: 'HUMAN_GI' | 'B_CODING'; url: string; locator?: string; recordId?: string };
};

type Candidate = {
  recipeId: string;
  servings: number;
  reviewState: string;
  publicationAuthorized: boolean;
  boundFiles: Record<string, string>;
  preparation: LocalizedText;
  limitation: LocalizedText;
  ingredients: Ingredient[];
  unroundedGk: string;
  omittedCho: number;
};

export function buildFarinataReviewVariant(root: string): GkOnlyVariant {
  const read = (file: string) => readFileSync(join(root, file), 'utf8');
  const raw = read(candidatePath);
  const c: Candidate = JSON.parse(raw);
  if (c.recipeId !== 'valimerellinen-farinata-aamupalaksi' || c.servings !== 2
      || c.reviewState !== 'PREPARED_FOR_REVIEW' || c.publicationAuthorized !== false
      || c.omittedCho !== 0) throw Error('Unexpected farinata review scope');

  const boundPaths = [
    'reseptit/aamupalat/valimerellinen-farinata-aamupalaksi.md',
    'docs/nutrition/gk80-operation80-batch-01.md',
  ];
  for (const file of boundPaths) {
    if (textHash(read(file)) !== c.boundFiles[file]) throw Error('Farinata review binding changed: ' + file);
  }
  for (const value of [c.preparation, c.limitation, ...c.ingredients.map(i => i.name)]) {
    if (!locales.every(locale => value[locale]?.trim())) throw Error('Farinata translation missing');
  }

  const sources: GkOnlyVariant['sources'] = [];
  let sum = 0;
  for (const i of c.ingredients) {
    if (i.composition) {
      sources.push({ title: i.composition.id, url: i.composition.url, kind: 'CARBOHYDRATE',
        note: i.choPer100g + ' g available carbohydrate / 100 g' });
    }
    if (i.choPer100g === 0) continue;
    if (!i.composition || !i.giEvidence || i.grams == null || i.gi == null
        || ![i.grams, i.gi, i.choPer100g].every(v => Number.isFinite(v) && v > 0)) {
      throw Error('Farinata positive carbohydrate row lacks a calculation binding');
    }
    const { kind, url, locator, recordId } = i.giEvidence;
    sources.push({ title: locator ?? recordId ?? i.name.en, url, kind, note: 'GI ' + i.gi });
    sum += i.grams * i.choPer100g * i.gi;
  }
  const point = sum / (10000 * c.servings);
  if (!Number.isFinite(Number(c.unroundedGk)) || Math.abs(point - Number(c.unroundedGk)) > 1e-10) {
    throw Error('Farinata review calculation changed');
  }
  const inputSha256 = textHash(raw);
  return {
    recipeId: c.recipeId, versionId: 'gk-farinata-review-' + inputSha256.slice(0, 12), inputSha256,
    level: 'B', servings: c.servings, point, scenarioRange: null, rangeKind: null,
    omittedCho: c.omittedCho, confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
    quantityContract: 'GK_ONLY_NATIVE_UNITS_V1', standalonePreparation: true,
    ingredients: c.ingredients.map(({ name, grams, quantity }) => ({ name, grams: grams ?? null, quantity })),
    preparation: c.preparation, limitation: c.limitation, codingKinds: [], sensitivity: null, sources,
  };
}

export function renderFarinataReview(root: string) {
  const variant = buildFarinataReviewVariant(root);
  return Object.fromEntries(locales.map(locale =>
    [locale, renderToStaticMarkup(createElement(MemoryRouter, null, createElement(GkOnlyVariantPanel, { variant, locale })))]));
}
