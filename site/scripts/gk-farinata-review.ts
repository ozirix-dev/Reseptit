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
  return renderGkReview(buildFarinataReviewVariant(root));
}

export function renderGkReview(variant: GkOnlyVariant, servings = variant.servings) {
  return Object.fromEntries(locales.map(locale =>
    [locale, renderToStaticMarkup(createElement(MemoryRouter, null, createElement(GkOnlyVariantPanel, { variant, locale, servings })))]));
}


type LabnehCandidate = Pick<Candidate, 'recipeId' | 'servings' | 'reviewState' | 'publicationAuthorized'
  | 'boundFiles' | 'preparation' | 'limitation' | 'omittedCho'> & {
  commonSources: { id: string; url: string }[];
  giCoding: { url: string };
  scenarioProducts: { name: string; url: string; inputs: [number, number, number][]; unroundedGk: string }[];
};

export function buildLabnehReviewVariant(root: string): GkOnlyVariant {
  const read = (file: string) => readFileSync(join(root, file), 'utf8');
  const raw = read('docs/nutrition/gk80-operation80-labneh-release-candidate.json');
  const c: LabnehCandidate = JSON.parse(raw);
  const recipePath = 'reseptit/aamupalat/lahi-ita-labneh-kulho-zaatarilla.md';
  if (c.recipeId !== 'lahi-ita-labneh-kulho-zaatarilla' || c.servings !== 2 || c.omittedCho !== 0
      || c.reviewState !== 'PREPARED_FOR_REVIEW' || c.publicationAuthorized !== false
      || c.scenarioProducts.length !== 2 || c.commonSources.length !== 3) {
    throw Error('Unexpected labneh review scope');
  }
  for (const file of [recipePath, 'docs/nutrition/gk80-operation80-batch-01.md']) {
    if (textHash(read(file)) !== c.boundFiles[file]) throw Error('Labneh review binding changed: ' + file);
  }
  const [first, second] = c.scenarioProducts;
  if (first.inputs.length !== 4 || second.inputs.length !== 4
      || !first.inputs.every(([grams, cho, gi], index) =>
        second.inputs[index][0] === grams && second.inputs[index][2] === gi
        && (index === 0 || second.inputs[index][1] === cho))) {
    throw Error('Labneh scenarios must differ only in product carbohydrate');
  }
  const [min, max] = c.scenarioProducts.map(({ inputs, unroundedGk }) => {
    const value = inputs.reduce((sum, [g, cho, gi]) => sum + g * cho * gi, 0) / (10000 * c.servings);
    if (!Number.isFinite(value) || !Number.isFinite(Number(unroundedGk))
        || Math.abs(value - Number(unroundedGk)) > 1e-10) throw Error('Labneh review calculation changed');
    return value;
  });
  if (min >= max) throw Error('Labneh range is not ordered');
  const names: LocalizedText[] = [
    { fi: 'Maustamaton labneh', en: 'Plain labneh', sv: 'Naturell labneh', th: 'ลาบเนห์รสธรรมชาติ' },
    { fi: 'Raaka kurkku', en: 'Raw cucumber', sv: 'Rå gurka', th: 'แตงกวาดิบ' },
    { fi: 'KFF Za’atar', en: 'KFF Za’atar', sv: 'KFF Za’atar', th: 'ซาอาตาร์ KFF' },
    { fi: 'Valutetut vihreät oliivit', en: 'Drained green olives', sv: 'Avrunna gröna oliver', th: 'มะกอกเขียวสะเด็ดน้ำ' },
  ];
  for (const locale of locales) {
    if (!c.preparation[locale]?.trim() || !c.limitation[locale]?.trim()) throw Error('Labneh translation missing');
  }
  const inputSha256 = textHash(raw);
  return {
    recipeId: c.recipeId, versionId: 'gk-labneh-review-' + inputSha256.slice(0, 12), inputSha256,
    level: 'B', servings: c.servings, point: null, scenarioRange: { min, max }, rangeKind: 'NAMED_COMPARATOR_SCENARIOS',
    omittedCho: 0, confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION', standalonePreparation: true,
    ingredients: names.map((name, index) => ({ name, grams: first.inputs[index][0] })),
    preparation: c.preparation, limitation: c.limitation, codingKinds: [], sensitivity: null,
    sources: [
      ...c.scenarioProducts.map(p => ({ title: p.name, url: p.url, kind: 'CARBOHYDRATE' as const,
        note: p.inputs[0][1] + ' g available carbohydrate / 100 g' })),
      ...c.commonSources.map((s, index) => ({ title: s.id, url: s.url, kind: 'CARBOHYDRATE' as const,
        note: first.inputs[index + 1][1] + ' g available carbohydrate / 100 g' })),
      { title: 'Assigned GI codes', url: c.giCoding.url, kind: 'B_CODING', note: 'Labneh 30, cucumber 40, za’atar 50' },
    ],
  };
}

type AckeeCandidate = Omit<Candidate, 'ingredients'> & {
  foodSafety: { url: string; preparedRecipeSha256: string };
  inputs: [number, number, number][];
  sources: { id: string; url: string; note?: string }[];
};

export function buildAckeeReviewVariant(root: string): GkOnlyVariant {
  const read = (file: string) => readFileSync(join(root, file), 'utf8');
  const raw = read('docs/nutrition/gk80-operation80-ackee-release-candidate.json');
  const c: AckeeCandidate = JSON.parse(raw);
  const recipePath = 'reseptit/aamupalat/karibia-ackee-ja-suolakala.md';
  const evidencePath = 'docs/nutrition/gk80-operation80-batch-10.md';
  if (c.recipeId !== 'karibia-ackee-ja-suolakala' || c.servings !== 2 || c.omittedCho !== 0
      || c.reviewState !== 'PREPARED_FOR_REVIEW' || c.publicationAuthorized !== false
      || c.inputs.length !== 4) throw Error('Unexpected ackee review scope');
  if (textHash(read(recipePath)) !== c.foodSafety.preparedRecipeSha256
      || textHash(read(evidencePath)) !== c.boundFiles[evidencePath]) {
    throw Error('Ackee safety or evidence binding changed');
  }
  for (const locale of locales) {
    if (!c.preparation[locale]?.trim() || !c.limitation[locale]?.trim()) throw Error('Ackee translation missing');
  }
  const point = c.inputs.reduce((sum, [g, cho, gi]) => sum + g * cho * gi, 0) / (10000 * c.servings);
  if (!Number.isFinite(point) || !Number.isFinite(Number(c.unroundedGk))
      || Math.abs(point - Number(c.unroundedGk)) > 1e-10) throw Error('Ackee review calculation changed');
  const names: LocalizedText[] = [
    { fi: 'Valutettu kaupallinen ackee-säilyke', en: 'Commercially canned ackee, drained', sv: 'Kommersiellt konserverad ackee, avrunnen', th: 'แอกกีกระป๋องที่ผลิตเพื่อจำหน่ายและสะเด็ดน้ำ' },
    { fi: 'Kypsä, ruodoton suolattu turska', en: 'Cooked boneless salted cod', sv: 'Tillagad benfri saltad torsk', th: 'ปลาค็อดเค็มปรุงสุกไม่มีก้าง' },
    { fi: 'Tomaatti', en: 'Tomato', sv: 'Tomat', th: 'มะเขือเทศ' },
    { fi: 'Kevätsipuli', en: 'Spring onion', sv: 'Salladslök', th: 'ต้นหอม' },
  ];
  const inputSha256 = textHash(raw);
  return {
    recipeId: c.recipeId, versionId: 'gk-ackee-review-' + inputSha256.slice(0, 12), inputSha256,
    level: 'B', servings: c.servings, point, scenarioRange: null, rangeKind: null,
    omittedCho: 0, confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
    quantityContract: 'GK_ONLY_NATIVE_UNITS_V1', standalonePreparation: true,
    ingredients: [
      ...names.map((name, index) => ({ name, grams: c.inputs[index][0] })),
      { name: { fi: 'Neutraali öljy', en: 'Neutral oil', sv: 'Neutral olja', th: 'น้ำมันรสกลาง' },
        grams: null, quantity: { amount: 1, unit: 'tbsp' } },
    ],
    preparation: c.preparation, limitation: c.limitation, codingKinds: ['TRACE50'], sensitivity: null,
    sources: c.sources.map(({ id, url, note }) => ({
      title: id, url, note: note ?? '',
      kind: id.endsWith('coding') ? 'B_CODING' : 'CARBOHYDRATE',
    })),
  };
}

type PointReviewCandidate = Omit<Candidate, 'ingredients' | 'omittedCho'> & {
  omissions?: ({ ingredientIndex: number } & ({ choPer100ml: number } | { choPer100g: number }))[];
  upperScenario?: { replacements: { inputIndex: number; ingredientIndex: number }[]; unroundedGk: string };
  inputs: [number, number, number][];
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
  const point = c.inputs.reduce((sum, [g, cho, gi], index) => {
    if (g !== c.ingredients[index].grams || ![g, cho, gi].every(n => Number.isFinite(n) && n >= 0)
        || cho > 100 || (cho > 0 && gi === 0)) throw Error('Invalid GK point input: ' + c.recipeId);
    return sum + g * cho * gi;
  }, 0) / (10000 * c.servings);
  if (!Number.isFinite(Number(c.unroundedGk)) || Math.abs(point - Number(c.unroundedGk)) > 1e-10) {
    throw Error('GK point calculation changed: ' + c.recipeId);
  }
  let scenarioRange: GkOnlyVariant['scenarioRange'] = null;
  if (c.upperScenario) {
    if (c.omissions?.length) throw Error('Range omissions require scenario-specific bindings: ' + c.recipeId);
    const indices = new Set<number>();
    let delta = 0;
    for (const { inputIndex, ingredientIndex } of c.upperScenario.replacements) {
      const row = c.inputs[inputIndex];
      const grams = c.ingredients[ingredientIndex]?.grams;
      if (!row || indices.has(inputIndex) || ingredientIndex < c.inputs.length
          || grams == null || !Number.isFinite(grams) || grams < 0) {
        throw Error('Invalid GK range replacement: ' + c.recipeId);
      }
      indices.add(inputIndex);
      delta += (grams - row[0]) * row[1] * row[2];
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
