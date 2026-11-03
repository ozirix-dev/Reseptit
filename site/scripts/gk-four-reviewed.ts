import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {textHash} from './gk149-model';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadIngredientInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const folder = 'docs/nutrition/gk80-four-reviewed-versions/';
type Ingredient = GlycemicLoadIngredientInput & {recipeQuantity?: {amount: number; unit: 'ml'}};
type Row = {input: Ingredient; food: FoodRecord | null; sourceEvidence?: {url: string}};
type Packet = {
  recipeId: string; servings: number; ingredients?: Ingredient[]; rows?: Row[];
  expected: {unroundedGk: string; omittedChoG?: string; omittedChoUpperG?: string};
  templateSourceCard?: {sourceUrl: string; maxCarbohydratePerServing: number; maxCumulativeCarbohydratePerServing: number};
};

const display = {
  granola: {
    preparation: 'Paahda siemenet, mantelilastut, voi ja punnittu kaneli yhdessä 160 °C:ssa 18–22 minuuttia. Käytä koko seos ja tarjoa jogurtin ja vadelmien kanssa.',
    limitation: 'Jogurtille ja vadelmille käytetään ryhmä-GI-arvioita. GI 50 on mallin oletus vain tämän erän jauhetulle kanelille.',
  },
  pistachio: {
    preparation: 'Sekoita maustamaton jogurtti ja {{amount:2}} ml Steenbergs-ruusuvettä. Lisää pistaasit ja granaattiomenansiemenet sekä halutessasi suolaa.',
    limitation: 'Jogurtille, pistaasille ja granaattiomenalle käytetään ryhmä-GI-arvioita. Ruusuveden hiilihydraatti perustuu nimetyn tuotteen etikettiin.',
  },
  kongjuk: {
    preparation: 'Liota kuivat soijapavut yön yli ja valuta. Keitä pavut kuivan pitkäjyväisen riisin kanssa vedessä. Soseuta puuro osittain ja lisää kuorimattomat seesaminsiemenet sekä suola.',
    limitation: 'Pavuille ja riisille käytetään ryhmä-GI-arvioita. Liotukselle ei lasketa hiilihydraattivähennystä.',
  },
  falafel: {
    preparation: 'Liota kuivat kikherneet, valuta ja jauha sipulin, valkosipulin, yrttien ja mausteiden kanssa. Lisää leivinjauhe, suola ja taikinan sitruunamehu. Muotoile falafelit, voitele öljyllä ja paista 220 °C:ssa 20–25 minuuttia. Sekoita kastikkeen tahini, vesi ja sitruunamehu erikseen.',
    limitation: 'Kikherneille käytetään palkokasvien ryhmä-GI-arviota. Tahinikastike sisältyy laskelmaan. Määrättömät pita- ja salaattitarjoiluehdotukset ovat laskennan ulkopuolella.',
  },
} as const;

export function buildReviewedGkVariants(root: string): GkOnlyVariant[] {
  const readText = (file: string) => readFileSync(join(root, file), 'utf8');
  const approvalText = readText(folder + 'approval.json');
  if (textHash(approvalText) !== '75db052b76b8ed61623cb2a36ee631c5fdf262192814f2c64d7845abb7de99b6') throw Error('GK80 four-version approval changed');
  const approval = JSON.parse(approvalText);
  for (const [file, expected] of Object.entries(approval.boundFiles)) {
    if (textHash(readText(file)) !== expected) throw Error('GK80 four-version binding changed: ' + file);
  }
  const catalog: Record<string, FoodRecord[]> = JSON.parse(readText(folder + 'foods.json'));
  const nativeGi: GlycemicIndexRecord[] = JSON.parse(readText('docs/nutrition/glycemic-index-records.json')).records;

  return Object.entries(display).map(([key, copy]) => {
    const file = folder + key + '.json';
    const packet: Packet = JSON.parse(readText(file));
    const {recipeId, servings, rows, expected} = packet;
    const ingredients = packet.ingredients ?? rows!.map(row => row.input);
    const foods = catalog[key] ?? rows!.flatMap(row => row.food ? [row.food] : []);
    const giRecords = nativeGi.filter(record => ingredients.some(ingredient => ingredient.giRecordId === record.id));
    if (key === 'granola') {
      const cinnamon = ingredients[5];
      const food = foods.find(record => record.id === cinnamon.fineliRecordId);
      const policy = packet.templateSourceCard!;
      const cho = (food?.per100g.carbohydrate ?? Infinity) * (cinnamon.grams ?? Infinity) / 100 / servings;
      if (cinnamon.name !== 'kanelia' || cinnamon.grams !== 2.55
          || cho > policy.maxCarbohydratePerServing || cho > policy.maxCumulativeCarbohydratePerServing) {
        throw Error('Approved granola cinnamon binding changed');
      }
      const card: GlycemicIndexRecord = {
        id: 'gk80-granola-cinnamon-50', gi: 50, foodKey: 'research-cinnamon',
        preparationKey: 'ground-cinnamon-fully-retained', food: 'Jauhettu kaneli',
        preparation: '2,55 g neljän annoksen granolaerässä', qualityTier: 'SUPPLEMENTARY',
        referenceScale: 'GLUCOSE_100', matchKind: 'ANALOG', confidence: 'LOW', evidenceKind: 'PUBLISHED_IMPUTATION',
        source: {title: 'Kanelin rajattu GI-oletus', url: policy.sourceUrl, table: 'Published GI coding method', year: 2007, published: true,
          iso26642Confirmed: false, qualityEvidence: 'Projektin reseptikohtainen sovellus julkaistusta koodausmenetelmästä.'},
        note: 'Oletus koskee vain tämän granolan kanelimäärää. Kanelin GI:tä ei ole mitattu tässä lähteessä.',
      };
      Object.assign(cinnamon, {giRecordId: card.id, foodKey: card.foodKey,
        preparationKey: card.preparationKey, giMatchEvidence: card.note});
      giRecords.push(card);
    }

    const result = calculateGlycemicLoad({recipeId, servings, ingredients}, foods, giRecords);
    if (result.status !== 'CALCULATED' || result.blockers.length || result.unroundedGlycemicLoadPerServing === null
        || Math.abs(result.unroundedGlycemicLoadPerServing - Number(expected.unroundedGk)) > 1e-10
        || Math.abs(result.omittedAvailableCarbohydratePerServingG - Number(expected.omittedChoG ?? expected.omittedChoUpperG)) > 1e-10) {
      throw Error('Approved GK result changed: ' + recipeId);
    }
    const inputSha256: string = approval.boundFiles[file];
    return {
      recipeId, versionId: 'gk-reviewed-' + inputSha256.slice(0, 12), inputSha256, level: 'A', servings,
      point: result.glycemicLoadPerServing, scenarioRange: null, rangeKind: null,
      omittedCho: result.omittedAvailableCarbohydratePerServingG, confidence: 'LOW',
      macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION', quantityContract: 'GK_ONLY_NATIVE_UNITS_V1',
      ingredients: ingredients.map((ingredient, index) => {
        const labels: Partial<Record<string, Record<number, string>>> = {
          granola: {5: 'Punnittu jauhettu kaneli', 6: 'Maustamaton kreikkalainen jogurtti, 10 % rasvaa'},
          pistachio: {0: 'Maustamaton jogurtti', 1: 'Kuoritut pistaasit', 2: 'Steenbergs-ruusuvesi'},
          kongjuk: {0: 'Kuivat soijapavut', 1: 'Kuiva pitkäjyväinen riisi', 2: 'Kuorimattomat seesaminsiemenet'},
          falafel: {9: 'Sitruunamehu taikinaan', 11: 'Suolaton tahini kastikkeeseen',
            12: 'Kylmä vesi kastikkeeseen', 13: 'Sitruunamehu kastikkeeseen'},
        };
        const label = labels[key]?.[index] ?? ingredient.name;
        const quantity = (key === 'kongjuk' && index === 4) ? {amount: 700, unit: 'ml' as const}
          : (key === 'falafel' && index === 12) ? {amount: 100, unit: 'ml' as const}
          : ingredient.recipeQuantity;
        return {name: fiOnly(label), grams: quantity ? null : ingredient.grams,
          ...(quantity ? {quantity: {amount: quantity.amount, unit: quantity.unit}} : {})};
      }),
      standalonePreparation: true, preparation: fiOnly(copy.preparation), limitation: fiOnly(copy.limitation),
      codingKinds: [], sensitivity: null,
      sources: [
        ...foods.map(food => ({title: food.name, url: food.sourceUrl, kind: 'CARBOHYDRATE' as const,
          note: food.per100g.carbohydrate + ' g saatavaa hiilihydraattia / 100 g'})),
        ...giRecords.map(gi => ({title: gi.source.title, url: gi.source.url,
          kind: gi.evidenceKind === 'HUMAN_GI' ? 'HUMAN_GI' as const : 'PUBLISHED_CODING' as const,
          note: gi.note ?? gi.source.qualityEvidence})),
        ...(key === 'pistachio' ? [{title: 'Steenbergs-ruusuvesi', url: rows![2].sourceEvidence!.url,
          kind: 'CARBOHYDRATE' as const, note: 'Etiketissä 0 g hiilihydraattia / 100 g.'}] : []),
      ],
    };
  });
}

// These four recipes currently have only Finnish pages.
function fiOnly(value: string): GkOnlyVariant['preparation'] {
  return {fi: value, en: value, sv: value, th: value};
}
