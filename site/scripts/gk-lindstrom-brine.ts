import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadIngredientInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant, LocalizedText} from '../src/features/recipes/gk-only-types';

const seal = '81140c8ab3a82f6c577350f8e232069f6c30118e9d8f724cde3db7ee6a5eb13a';
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const locales = ['fi', 'en', 'sv', 'th'] as const;

interface Packet {
  case: {
    recipeId: string;
    servings: number;
    ingredients: GlycemicLoadIngredientInput[];
    expected: {gk: string; omittedChoIncludingCeilingsG: string};
  };
  sourceFilesLfSha256: Record<string, string>;
  foods: FoodRecord[];
  gis: GlycemicIndexRecord[];
  mustard: {name: string; url: string};
  copy: {
    names: Record<keyof LocalizedText, string[]>;
    preparation: LocalizedText;
    limitation: LocalizedText;
  };
}

export function buildLindstromBrineVariant(root: string): GkOnlyVariant {
  const read = (file: string) => readFileSync(join(root, file), 'utf8').replaceAll('\r\n', '\n');
  const raw = read('docs/nutrition/gk80-lindstrom-brine/packet.json');
  if (sha(raw) !== seal) throw Error('Lindström approval packet changed');
  const packet: Packet = JSON.parse(raw);
  for (const [file, hash] of Object.entries(packet.sourceFilesLfSha256)) {
    if (sha(read(file)) !== hash) throw Error('Lindström recipe or source changed: ' + file);
  }
  const {recipeId, servings, ingredients, expected} = packet.case;
  const result = calculateGlycemicLoad({recipeId, servings, ingredients}, packet.foods, packet.gis);
  if (result.status !== 'CALCULATED' || result.blockers.length
      || Math.abs(result.unroundedGlycemicLoadPerServing! - Number(expected.gk)) > 1e-10
      || Math.abs(result.omittedAvailableCarbohydratePerServingG - Number(expected.omittedChoIncludingCeilingsG)) > 1e-10) {
    throw Error('Lindström calculation differs from the approved result');
  }

  const inputSha256 = sha(JSON.stringify({recipeId, servings, ingredients}));
  return {
    recipeId, versionId: 'gk-lindstrom-brine-' + inputSha256.slice(0, 12), inputSha256,
    level: 'A', servings, point: result.glycemicLoadPerServing,
    scenarioRange: null, rangeKind: null, omittedCho: result.omittedAvailableCarbohydratePerServingG,
    confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
    ingredients: ingredients.map((ingredient, index) => ({
      grams: ingredient.grams,
      name: Object.fromEntries(locales.map(locale => [locale, packet.copy.names[locale][index]])) as LocalizedText,
    })),
    standalonePreparation: true, preparation: packet.copy.preparation, limitation: packet.copy.limitation,
    codingKinds: [], sensitivity: null,
    sources: [
      ...packet.foods.map(food => ({title: food.name, url: food.sourceUrl, kind: 'CARBOHYDRATE' as const,
        note: `${food.per100g.carbohydrate} g / 100 g`})),
      ...packet.gis.map(gi => ({title: gi.source.title, url: gi.source.url, kind: 'PUBLISHED_CODING' as const,
        note: `${gi.food}, GI ${gi.gi} · LOW`})),
      {title: packet.mustard.name, url: packet.mustard.url, kind: 'BOUND',
        note: '3.5 g / 100 g declared carbohydrate; nominal label-based allowance'},
    ],
  };
}
