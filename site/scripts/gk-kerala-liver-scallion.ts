import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {textHash} from './gk149-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const github = 'https://github.com/ozirix-dev/Reseptit/blob/';
const locale = (fi: string, en = fi) => ({fi, en, sv: en, th: en});
type Row = {name: string; grams: number; url?: string; excluded?: boolean};
type ApprovedA = {
  inputs: {recipeId: string; servings: number; rows: Row[]; lfSha256: Record<string, string>};
  inputSha256: string;
  calculatedGkPart: number;
  omittedChoPerServing: number;
};

export function buildKeralaLiverScallionVariants(root: string): GkOnlyVariant[] {
  const read = (path: string) => readFileSync(join(root, path), 'utf8');
  const raw = read('docs/nutrition/gk80-kerala-liver-scallion.json');
  const hash = textHash(raw);
  if (hash !== '1afb69ea8defa7dd2379b3b63561b78ffbfed539b909dac1780913c067c4c5aa') throw Error('Approved GK packet changed');
  const {kerala, liver, scallion}: {
    kerala: ApprovedA;
    liver: ApprovedA;
    scallion: {recipeId: string; servings: number; ingredients: Array<Row & {choBatchMinG: string}>};
  } = JSON.parse(raw);
  const common = {confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION', sensitivity: null} as const;

  function buildA(packet: ApprovedA, route: string, preparation: ReturnType<typeof locale>,
      limitation: ReturnType<typeof locale>): GkOnlyVariant {
    const {recipeId, servings, rows, lfSha256} = packet.inputs;
    for (const [path, expected] of Object.entries(lfSha256)) {
      if (textHash(read(path)) !== expected) throw Error('Approved GK input changed: ' + path);
    }
    return {
      ...common, recipeId, servings, level: 'A', inputSha256: packet.inputSha256,
      versionId: 'gk-' + recipeId + '-' + packet.inputSha256.slice(0, 12),
      point: packet.calculatedGkPart, scenarioRange: null, rangeKind: null,
      omittedCho: packet.omittedChoPerServing, codingKinds: [],
      standalonePreparation: true, preparation, limitation,
      ingredients: rows.filter(row => !row.excluded).map(row => ({name: locale(row.name), grams: row.grams})),
      sources: [{title: 'Approved calculation and source bindings',
        url: github + '91772afb4778f8ba818cf23ce32db7b52a8d498b/docs/research/afcd-polyol-03/' + route,
        kind: 'PUBLISHED_CODING', note: 'Ingredient composition and preparation-specific model bindings.'},
        ...rows.flatMap(row => row.url ? [{title: row.name, url: row.url,
          kind: 'CARBOHYDRATE' as const, note: 'Product or composition source.'}] : [])],
    };
  }

  // Soy sauce is outside the prepared bread comparator and contributes separately.
  const soy = Number(scallion.ingredients[4].choBatchMinG) / scallion.servings * 0.5;
  const bread = scallion.ingredients.reduce((sum, row, index) =>
    sum + (index === 4 ? 0 : Number(row.choBatchMinG)), 0) / scallion.servings;
  const scenarioRange = {min: bread * 0.318 + soy, max: bread * 0.53 + soy};
  if (Math.floor(scenarioRange.min) !== 11 || Math.ceil(scenarioRange.max) !== 20) {
    throw Error('Approved scallion pancake display bounds changed');
  }
  return [
    buildA(kerala, 'kerala-a-route/kerala-result.json',
      locale('Sekoita tamarinditahna lämpimään veteen ja siivilöi. Kuumenna öljy ja sinapinsiemenet. Kuullota sipuli, valkosipuli ja inkivääri. Lisää kurkuma, chili, tamarindivesi ja suola ja hauduta 5 minuuttia. Lisää kookosmaito ja kypsennä seiti miedolla lämmöllä 8–10 minuuttia. Jaa kaikki kastike neljälle.',
        'Mix the tamarind paste with warm water and strain. Heat the oil and mustard seeds. Sauté the onion, garlic and ginger. Add turmeric, chilli, tamarind water and salt and simmer for 5 minutes. Add coconut milk and gently cook the saithe for 8–10 minutes. Divide all the sauce among four servings.'),
      locale('Sipulille ja valkosipulille käytetään GI 40 -mallia. Currylehdet ja erillinen riisi eivät kuulu versioon.',
        'Onion and garlic use GI 40. Curry leaves and separately served rice are outside this version.')),
    buildA(liver, 'beef-liver-a-route/liver-result.json',
      locale('Paloittele ja paista pekoni. Ruskista sipuli pannurasvassa ja ruskista ohuet maksaviipaleet voissa. Lisää kerma, pekoni ja mausteet. Kypsennä kastikkeessa, kunnes maksan sisälämpötila on vähintään 72 °C. Jaa kaikki pekoni, kastike ja pannuneste neljälle.',
        'Chop and fry the bacon. Brown the onion in the pan fat and thin liver slices in butter. Add cream, bacon and seasoning. Cook in the sauce until the liver reaches 72 °C internally. Divide all the bacon, sauce and pan juices among four servings.'),
      locale('Maksan hiilihydraatti perustuu MEXT 11092:n arvioituun massaan. Maksalle käytetään GI 50 -mallia ja sipulille GI 40 -mallia.',
        'Liver carbohydrate uses the estimated mass in MEXT 11092. Liver uses GI 50 and onion uses GI 40.')),
    {
      ...common, recipeId: scallion.recipeId, servings: scallion.servings, level: 'B',
      versionId: 'gk-scallion-pancake-' + hash.slice(0, 12), inputSha256: hash,
      point: null, scenarioRange, rangeDisplay: 'OUTWARD_INTEGER', rangeKind: 'NAMED_COMPARATOR_SCENARIOS',
      omittedCho: 0, codingKinds: [],
      preparation: locale('Vaivaa ja kauli taikina, kerrosta se kevätsipulin ja seesamiöljyn kanssa ja paista pannulla. Tarjoa soijakastike erikseen.',
        'Knead and roll the dough, layer with scallion and sesame oil and pan-fry. Serve the soy sauce separately.'),
      limitation: locale('Arvio käyttää kahta mitattua parathavertailua. Soijakastike lasketaan erikseen GI 50 -mallilla.',
        'The estimate uses two measured paratha comparators. Soy sauce is calculated separately using GI 50.'),
      ingredients: scallion.ingredients.map((row, index) => ({
        name: locale(row.name, ['Wheat flour', 'Water', 'Scallion', 'Sesame oil', 'Soy sauce', 'Neutral frying oil', 'Salt to taste'][index]),
        grams: index === 6 ? null : row.grams,
      })),
      sources: [{title: 'Omani unfilled paratha GI 31.8 and Kawan frozen paratha GI 53',
        url: github + '24d109dbcb2f3fdc9363aee12720bd677249c6e4/docs/research/gk80-international-20261102/paratha-component-routes/source-catalog.json',
        kind: 'HUMAN_GI', note: 'Named comparator scenarios with soy sauce calculated separately.'}],
    },
  ];
}
