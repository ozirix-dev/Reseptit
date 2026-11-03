import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {textHash} from './gk149-model';
import {calculateGlycemicLoad, type GlycemicIndexRecord} from './glycemic-load-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const folder = 'docs/nutrition/gk80-blueberry-pie/';

export function buildBlueberryPieVariant(root: string): GkOnlyVariant {
  const read = (file: string) => JSON.parse(readFileSync(join(root, folder, file), 'utf8'));
  const approvalText = readFileSync(join(root, folder, 'approval.json'), 'utf8');
  if (textHash(approvalText) !== 'f808a3bc4127115179532d138278d04814c5db45bb32c3db7b559bf716b9694a') throw Error('Blueberry pie GK approval changed');
  const approval = JSON.parse(approvalText);
  const hash = (file: string) => textHash(readFileSync(join(root, file), 'utf8'));
  for (const [file, expected] of Object.entries(approval.boundFiles)) {
    if (hash(file) !== expected) throw Error('Blueberry pie GK binding changed: ' + file);
  }

  const proposal = read('proposal.json');
  const copy = read('public-copy.json');
  const foods = read('foods.json');
  const giRecords: GlycemicIndexRecord[] = JSON.parse(
    readFileSync(join(root, 'docs/nutrition/glycemic-index-records.json'), 'utf8'),
  ).records;
  const gis = giRecords.filter(record => proposal.ingredients.some(
    (ingredient: {giRecordId: string | null}) => ingredient.giRecordId === record.id,
  ));
  const {recipeId, servings, ingredients, expected} = proposal;
  const result = calculateGlycemicLoad({recipeId, servings, ingredients}, foods, gis);
  if (result.status !== 'CALCULATED' || result.blockers.length
      || result.unroundedGlycemicLoadPerServing === null
      || Math.abs(result.unroundedGlycemicLoadPerServing - Number(expected.gk)) > 1e-10
      || Math.abs(result.omittedAvailableCarbohydratePerServingG - Number(expected.omittedChoIncludingCeilingsG)) > 1e-10) {
    throw Error('Approved blueberry pie GK calculation changed');
  }

  const inputSha256 = approval.boundFiles[folder + 'proposal.json'];
  return {
    recipeId, versionId: 'gk-blueberry-' + inputSha256.slice(0, 12), inputSha256,
    level: 'A', servings, point: result.glycemicLoadPerServing, scenarioRange: null, rangeKind: null,
    omittedCho: result.omittedAvailableCarbohydratePerServingG, confidence: 'LOW',
    macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
    ingredients: ingredients.map((ingredient: {grams: number}, index: number) => ({
      name: copy.names[index], grams: ingredient.grams,
    })),
    standalonePreparation: true, preparation: copy.preparation, limitation: copy.limitation,
    codingKinds: [], sensitivity: null,
    sources: [
      ...foods.map((food: {name: string; sourceUrl: string; per100g: {carbohydrate: number}}) => ({
        title: food.name, url: food.sourceUrl, kind: 'CARBOHYDRATE' as const, note: food.per100g.carbohydrate + ' g CHO / 100 g',
      })),
      ...gis.map(gi => ({
        title: gi.source.title, url: gi.source.url,
        kind: gi.evidenceKind === 'HUMAN_GI' ? 'HUMAN_GI' as const : 'PUBLISHED_CODING' as const,
        note: gi.note ?? gi.source.qualityEvidence,
      })),
    ],
  };
}
