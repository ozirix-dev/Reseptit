import {acceptsReviewedNutritionModelBinding} from './reviewed-nutrition-model-binding';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadRecipeInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const copy = [
  {
    en: 'Potato,cauliflower,fresh peas,carrot,oil,butter,onion,garlic,crushed tomatoes,ground cumin,ground coriander,smoked paprika,turmeric,chilli powder,salt,soft wheat rolls,fresh coriander',
    sv: 'Potatis,blomkål,färska ärter,morot,olja,smör,lök,vitlök,krossade tomater,mald spiskummin,mald koriander,rökt paprika,gurkmeja,chilipulver,salt,mjuka vetefrallor,färsk koriander',
    th: 'มันฝรั่ง,ดอกกะหล่ำ,ถั่วลันเตาสด,แครอต,น้ำมัน,เนย,หอมหัวใหญ่,กระเทียม,มะเขือเทศบด,ยี่หร่าป่น,เมล็ดผักชีป่น,ปาปริการมควัน,ขมิ้น,พริกป่น,เกลือ,ขนมปังข้าวสาลีเนื้อนุ่ม,ผักชีสด',
    preparation: {
      fi: 'Keitä kasvikset ja muussaa karkeasti. Hauduta tomaattimurskan ja mausteiden kanssa. Tarjoa kaikki sämpylät ja tuore korianteri.',
      en: 'Boil and roughly mash the vegetables, then simmer with crushed tomatoes and spices. Include all rolls and fresh coriander.',
      sv: 'Koka och mosa grönsakerna grovt. Sjud med krossade tomater och kryddor. Servera med alla frallor och färsk koriander.',
      th: 'ต้มผักแล้วบดหยาบ เคี่ยวกับมะเขือเทศบดและเครื่องเทศ เสิร์ฟพร้อมขนมปังและผักชีสดทั้งหมด',
    },
  },
];

interface ApprovalCase {
  recipeId: string;
  proposal: string;
  catalog: string;
  bindings: Record<string, string>;
}

export function buildTehoajoVariants(root: string): GkOnlyVariant[] {
  const read = (file: string) => readFileSync(join(root, file), 'utf8').replaceAll('\r\n', '\n');
  const raw = read('docs/nutrition/gk80-tehoajo-era1/approval.json');
  if (sha(raw) !== '38cc7a702605c323db9f62b0f7a0df517d4cab24cc094eb3bfbe872645111582') {
    throw Error('GK80 tehoajo approval packet changed');
  }
  const approval: {cases: ApprovalCase[]} = JSON.parse(raw);
  const registry: {records: GlycemicIndexRecord[]} = JSON.parse(read('docs/nutrition/glycemic-index-records.json'));
  return approval.cases.map(({recipeId, proposal, catalog, bindings}, index) => {
    for (const [file, hash] of Object.entries(bindings)) {
      const actual = sha(read(file));
      if (actual !== hash && !acceptsReviewedNutritionModelBinding(file, hash, actual)) throw Error('GK80 tehoajo source changed: ' + file);
    }
    const input: GlycemicLoadRecipeInput & {
      expected: {unroundedGk: string; omittedChoG?: string; omittedChoUpperG?: string};
    } = JSON.parse(read(proposal));
    const sources: {
      foods: Record<string, FoodRecord>;
      existingGiIds?: string[];
      existingGiCards?: Record<string, GlycemicIndexRecord>;
    } = JSON.parse(read(catalog));
    const foods = Object.values(sources.foods);
    const gis = sources.existingGiCards ? Object.values(sources.existingGiCards)
      : registry.records.filter(record => sources.existingGiIds?.includes(record.id));
    const result = calculateGlycemicLoad(input, foods, gis);
    if (input.recipeId !== recipeId || result.status !== 'CALCULATED' || result.blockers.length
        || Math.abs(Number(result.unroundedGlycemicLoadPerServing) - Number(input.expected.unroundedGk)) > 1e-10
        || Math.abs(result.omittedAvailableCarbohydratePerServingG - Number(input.expected.omittedChoG ?? input.expected.omittedChoUpperG)) > 1e-10) {
      throw Error('GK80 tehoajo result changed: ' + recipeId);
    }
    const inputSha256 = sha(read(proposal));
    const {en, sv, th, preparation} = copy[index];
    const names = [en.split(','), sv.split(','), th.split(',')];
    if (names.some(list => list.length !== input.ingredients.length)) throw Error('GK80 ingredient labels incomplete: ' + recipeId);
    return {
      recipeId, inputSha256, versionId: 'gk-tehoajo-' + inputSha256.slice(0, 12),
      level: 'A', servings: input.servings, point: result.glycemicLoadPerServing,
      scenarioRange: null, rangeKind: null, confidence: 'LOW',
      omittedCho: result.omittedAvailableCarbohydratePerServingG,
      macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION', standalonePreparation: true,
      ingredients: input.ingredients.map((ingredient, i) => ({
        grams: ingredient.grams,
        name: {fi: ingredient.name, en: names[0][i], sv: names[1][i], th: names[2][i]},
      })),
      preparation, codingKinds: [], sensitivity: null,
      sources: [
        ...foods.filter(food => input.ingredients.some(row => row.fineliRecordId === food.id))
          .map(food => ({title: food.name, url: food.sourceUrl, kind: 'CARBOHYDRATE' as const, note: `${food.per100g.carbohydrate} g / 100 g`})),
        ...gis.filter(gi => input.ingredients.some(row => row.giRecordId === gi.id))
          .map(gi => ({title: gi.source.title, url: gi.source.url, kind: 'PUBLISHED_CODING' as const, note: `${gi.food}, GI ${gi.gi} · LOW`})),
      ],
    };
  });
}
