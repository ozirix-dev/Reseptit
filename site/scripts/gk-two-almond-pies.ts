import {recipeTextForApprovedSnapshot} from './approved-recipe-note-edits';
import {publicGiSourceNote} from './gk-source-copy';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {textHash} from './gk149-model';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadIngredientInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const archive = 'docs/research/gk80-international-20261102/almond-reuse-and-oman/';
const approvalPath = 'docs/nutrition/gk80-two-almond-pies/approval.json';
const localized = (fi: string) => ({fi, en: fi, sv: fi, th: fi});
const variants = [
  {
    id: 'vhh-omenapiirakka',
    preparation: 'Punnitse kuivat, paahtamattomat mantelit kuorineen ja jauha ne. Käytä kaikki jauhettu manteli. Nypi manteli ja kylmä voi, lisää pohjan muna ja Foodin-erytritoli ja painele vuokaan. Esipaista 180 °C:ssa 8 minuuttia. Viipaloi punnittu kuorellinen Granny Smith ja sekoita kanelin ja sitruunamehun kanssa. Levitä pohjalle rahka, täytteen muna ja Foodin-erytritoli, asettele omenat päälle ja paista 25–30 minuuttia. Jäähdytä.',
    limitation: 'Omenalle ja rahkalle käytetään ryhmä-GI-arvioita. Mantelin hiilihydraatti perustuu kuivaan kokonaiseen manteliin ennen jauhamista.',
    names: ['Itse jauhettu kuorellinen manteli', 'Kylmä voi', 'Kananmuna pohjaan', 'Foodin-erytritoli pohjaan',
      'Kuorellinen Granny Smith, syötävä osa', 'Jauhettu kaneli', 'Sitruunamehu', 'Maustamaton maitorahka',
      'Kananmuna täytteeseen', 'Foodin-erytritoli täytteeseen'],
  },
  {
    id: 'vhh-raparperipiirakka',
    preparation: 'Punnitse kuivat, paahtamattomat mantelit kuorineen ja jauha ne. Käytä kaikki jauhettu manteli. Sekoita manteli, sulatettu voi ja pohjan muna ja painele vuokaan. Levitä paloiteltu raparperi pohjalle. Sekoita rahka, täytteen munat, Foodin-erytritoli, punnittu vaniljauute ja psyllium. Kaada täyte päälle ja paista 180 °C:ssa 30–35 minuuttia. Jäähdytä.',
    limitation: 'Raparperille ja rahkalle käytetään ryhmä-GI-arvioita. Vaniljauutteen koko punnittu massa toimii hiilihydraatin ylärajana.',
    names: ['Itse jauhettu kuorellinen manteli', 'Sulatettu voi', 'Kananmuna pohjaan', 'Raparperi',
      'Maustamaton maitorahka', 'Kananmunat täytteeseen', 'Foodin-erytritoli', 'Punnittu vaniljauute', 'Psyllium'],
  },
];

type Packet = {
  recipeId: string; servings: number;
  ingredients: Array<GlycemicLoadIngredientInput & {recipeQuantity?: {amount: number; unit: string}}>;
  expected: {unroundedGk: string; omittedChoIncludingCeilingsG: string};
};

export function buildTwoAlmondPieVariants(root: string): GkOnlyVariant[] {
  const read = (file: string) => readFileSync(join(root, file), 'utf8');
  const approval = read(approvalPath);
  if (textHash(approval) !== '50f215e418e57b4e6cecfbee553adb69f5bb23c15be0f96743677699f15a3b6f') throw Error('Almond pie approval changed');
  const {boundFiles}: {boundFiles: Record<string, string>} = JSON.parse(approval);
  for (const [file, expected] of Object.entries(boundFiles)) {
    const contents = read(file);
    const snapshot = file.startsWith('reseptit/')
      ? recipeTextForApprovedSnapshot(file, contents.replaceAll('\r\n','\n'))
      : contents;
    if (textHash(snapshot) !== expected) throw Error('Almond pie binding changed: ' + file);
  }

  const catalog: {foods: Record<string, FoodRecord>; existingGiIds: string[]} = JSON.parse(read(archive + 'source-catalog.json'));
  const foods = Object.values(catalog.foods);
  const nativeGi: GlycemicIndexRecord[] = JSON.parse(read('docs/nutrition/glycemic-index-records.json')).records;
  const gis = nativeGi.filter(gi => catalog.existingGiIds.includes(gi.id));

  return variants.map(variant => {
    const path = archive + variant.id + '.json';
    const {recipeId, servings, ingredients, expected}: Packet = JSON.parse(read(path));
    const result = calculateGlycemicLoad({recipeId, servings, ingredients}, foods, gis);
    if (recipeId !== variant.id || ingredients.length !== variant.names.length
        || result.status !== 'CALCULATED' || result.blockers.length || result.unroundedGlycemicLoadPerServing === null
        || Math.abs(result.unroundedGlycemicLoadPerServing - Number(expected.unroundedGk)) > 1e-10
        || Math.abs(result.omittedAvailableCarbohydratePerServingG - Number(expected.omittedChoIncludingCeilingsG)) > 1e-10) {
      throw Error('Approved almond pie calculation changed: ' + recipeId);
    }

    const inputSha256 = boundFiles[path];
    return {
      recipeId, versionId: 'gk-almond-pie-' + inputSha256.slice(0, 12), inputSha256, level: 'A',
      servings, point: result.glycemicLoadPerServing, scenarioRange: null, rangeKind: null,
      omittedCho: result.omittedAvailableCarbohydratePerServingG, confidence: 'LOW',
      macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION', quantityContract: 'GK_ONLY_NATIVE_UNITS_V1',
      ingredients: ingredients.map((ingredient, index) => {
        const name = localized(variant.names[index]);
        const quantity = ingredient.recipeQuantity;
        return ingredient.grams === 0 && quantity?.unit === 'rkl'
          ? {name, grams: null, quantity: {amount: quantity.amount, unit: 'tbsp'}}
          : {name, grams: ingredient.grams};
      }),
      standalonePreparation: true, preparation: localized(variant.preparation), limitation: localized(variant.limitation),
      codingKinds: [], sensitivity: null,
      sources: [
        ...foods.filter(food => ingredients.some(row => row.fineliRecordId === food.id)).map(food => ({
          title: food.name, url: food.sourceUrl, kind: 'CARBOHYDRATE' as const,
          note: food.per100g.carbohydrate + ' g saatavaa hiilihydraattia / 100 g',
        })),
        ...gis.filter(gi => ingredients.some(row => row.giRecordId === gi.id)).map(gi => ({
          title: gi.source.title, url: gi.source.url, kind: 'PUBLISHED_CODING' as const,
          note: publicGiSourceNote(gi),
        })),
        ...(recipeId === 'vhh-raparperipiirakka' ? [{title: 'Punnitun vaniljauutteen massavaraus',
          url: 'https://github.com/ozirix-dev/Reseptit/blob/b7096c7/' + path, kind: 'BOUND' as const,
          note: '5 g jaettuna kahdeksaan annokseen.'}] : []),
      ],
    };
  });
}
