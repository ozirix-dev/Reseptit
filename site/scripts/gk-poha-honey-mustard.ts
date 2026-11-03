import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {textHash} from './gk149-model';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadIngredientInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const archive = 'docs/research/gk80-international-20261102/';
const approvalPath = 'docs/nutrition/gk80-poha-honey-mustard/approval.json';
const localized = (fi: string) => ({fi, en: fi, sv: fi, th: fi});
const versions = [
  {
    directory: 'poha-and-main179', file: 'poha-fresh-leaf-version.json',
    names: ['Riisihiutaleet', 'Raa’at suolattomat maapähkinät', 'Tuore currylehti', 'Tuoreet vihreät herneet',
      'Neutraali paistoöljy', 'Tuore korianteri', 'Sitruunamehu', 'Suolaa maun mukaan'],
    preparation: 'Huuhtele riisihiutaleet nopeasti ja valuta. Kuullota maapähkinät, herneet ja tuoreet currylehdet öljyssä. Lisää hiutaleet ja kuumenna. Viimeistele korianterilla, sitruunamehulla ja suolalla.',
    limitation: 'Riisihiutaleille, maapähkinöille ja herneille käytetään ryhmä-GI-arvioita. Huuhtelulle ei lasketa hiilihydraattivähennystä.',
    extraSources: [],
  },
  {
    directory: 'pancake-source-and-fixed-input', file: 'honey-mustard-chicken-fixed-input-proposal.json',
    names: ['Nahaton broilerin reisiliha', 'Valkokaali', 'Maille Dijon Original, 865 g pakkaus', 'Hunaja',
      'Oliiviöljy', 'Valkosipulijauhe', 'Paprikajauhe', 'Mustapippuri', 'Suolaa maun mukaan'],
    preparation: 'Levitä kaali ja broileri uunipellille. Sekoita punnittu sinappi, hunaja, öljy ja mausteet ja levitä kuorrute pellille. Paista alkuperäisen ohjeen mukaan, kunnes kana on kypsää. Jaa kaikki kaali, kuorrute ja pellille kertynyt neste annoksiin.',
    limitation: 'Kaalille ja hunajalle käytetään ryhmä-GI-arvioita. Maille-sinapin hiilihydraattivaraus perustuu etikettiin ja valkosipulijauheen varaus koko punnittuun massaan.',
    extraSources: [{title: 'Maille-sinapin etiketti ja valkosipulijauheen massavaraus', url: 'https://github.com/ozirix-dev/Reseptit/blob/b7096c7/' + archive + 'pancake-source-and-fixed-input/honey-mustard-chicken-fixed-input-proposal.json', kind: 'BOUND' as const, note: 'Positiiviset varaukset sisältyvät poisjättöön.'}],
  },
];

type Packet = {
  recipeId: string; sourcePath: string; sourceLfSha256: string; servings: number;
  ingredients: GlycemicLoadIngredientInput[];
  expected: {unroundedGk: string; omittedChoG?: string; omittedChoUpperG?: string};
};

export function buildPohaHoneyMustardVariants(root: string): GkOnlyVariant[] {
  const read = (file: string) => readFileSync(join(root, file), 'utf8');
  const approvalText = read(approvalPath);
  if (textHash(approvalText) !== 'b9419b7a18182f0ab978015040d5686a29096eb01ae855aed12d4d3e64eba9af') throw Error('Poha and honey mustard approval changed');
  const {boundFiles}: {boundFiles: Record<string, string>} = JSON.parse(approvalText);
  for (const [file, hash] of Object.entries(boundFiles)) {
    if (textHash(read(file)) !== hash) throw Error('Approved GK binding changed: ' + file);
  }

  return versions.map(version => {
    const directory = archive + version.directory + '/';
    const path = directory + version.file;
    const packet: Packet = JSON.parse(read(path));
    const {recipeId, servings, ingredients, expected} = packet;
    if (textHash(read(packet.sourcePath)) !== packet.sourceLfSha256 || ingredients.length !== version.names.length) {
      throw Error('Approved GK recipe binding changed: ' + recipeId);
    }
    const catalog: {foods: Record<string, FoodRecord>; existingGiCards: Record<string, GlycemicIndexRecord>} =
      JSON.parse(read(directory + 'source-catalog.json'));
    const foods = Object.values(catalog.foods);
    const gis = Object.values(catalog.existingGiCards);
    const result = calculateGlycemicLoad({recipeId, servings, ingredients}, foods, gis);
    if (result.status !== 'CALCULATED' || result.blockers.length || result.unroundedGlycemicLoadPerServing === null
        || Math.abs(result.unroundedGlycemicLoadPerServing - Number(expected.unroundedGk)) > 1e-10
        || Math.abs(result.omittedAvailableCarbohydratePerServingG - Number(expected.omittedChoG ?? expected.omittedChoUpperG)) > 1e-10) {
      throw Error('Approved GK result changed: ' + recipeId);
    }
    const inputSha256 = boundFiles[path];
    return {
      recipeId, versionId: 'gk-poha-honey-' + inputSha256.slice(0, 12), inputSha256, level: 'A',
      servings, point: result.glycemicLoadPerServing, scenarioRange: null, rangeKind: null,
      omittedCho: result.omittedAvailableCarbohydratePerServingG, confidence: 'LOW',
      macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
      ingredients: ingredients.map((ingredient, index) => ({name: localized(version.names[index]), grams: ingredient.grams})),
      standalonePreparation: true, preparation: localized(version.preparation), limitation: localized(version.limitation),
      codingKinds: [], sensitivity: null,
      sources: [
        ...foods.filter(food => ingredients.some(row => row.fineliRecordId === food.id)).map(food => ({
          title: food.name, url: food.sourceUrl, kind: 'CARBOHYDRATE' as const,
          note: food.per100g.carbohydrate + ' g saatavaa hiilihydraattia / 100 g',
        })),
        ...gis.filter(gi => ingredients.some(row => row.giRecordId === gi.id)).map(gi => ({
          title: gi.source.title, url: gi.source.url, kind: 'PUBLISHED_CODING' as const,
          note: gi.note ?? gi.source.qualityEvidence,
        })),
        ...version.extraSources,
      ],
    };
  });
}
