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
  {
    en: 'Skinless chicken thighs,white cabbage,Maille Dijon DK mustard,honey,olive oil,garlic powder,paprika,black pepper,salt to taste',
    sv: 'Kycklinglår utan skinn,vitkål,Maille Dijon DK-senap,honung,olivolja,vitlökspulver,paprikapulver,svartpeppar,salt efter smak',
    th: 'เนื้อสะโพกไก่ไม่ติดหนัง,กะหล่ำปลีขาว,มัสตาร์ด Maille Dijon DK,น้ำผึ้ง,น้ำมันมะกอก,ผงกระเทียม,ปาปริกา,พริกไทยดำ,เกลือตามชอบ',
    preparation: {
      fi: 'Paahda kana ja kaali reseptin mukaan. Käytä Maille Dijon DK -sinappia (EAN 3036810201761) ja tarjoa kaikki kastike.',
      en: 'Roast the chicken and cabbage as directed. Use Maille Dijon DK mustard (EAN 3036810201761) and serve all the sauce.',
      sv: 'Ugnsstek kycklingen och kålen enligt receptet. Använd Maille Dijon DK-senap (EAN 3036810201761) och servera all sås.',
      th: 'อบไก่และกะหล่ำตามสูตร ใช้มัสตาร์ด Maille Dijon DK (EAN 3036810201761) และเสิร์ฟซอสทั้งหมด',
    },
  },
  {
    en: 'Rice flakes,raw unsalted peanuts,fresh curry leaves,fresh peas,neutral cooking oil,fresh coriander,lemon juice,salt to taste',
    sv: 'Risflingor,råa osaltade jordnötter,färska curryblad,färska ärter,neutral matolja,färsk koriander,citronsaft,salt efter smak',
    th: 'ข้าวแผ่น,ถั่วลิสงดิบไม่ใส่เกลือ,ใบกะหรี่สด,ถั่วลันเตาสด,น้ำมันรสกลาง,ผักชีสด,น้ำมะนาวเลมอน,เกลือตามชอบ',
    preparation: {
      fi: 'Huuhtele ja valuta riisihiutaleet. Kypsennä pannulla vaiheen 4 mukaan käyttäen tuoreita currylehtiä ja herneitä.',
      en: 'Rinse and drain the rice flakes. Cook in a pan as in step 4, using fresh curry leaves and peas.',
      sv: 'Skölj och låt risflingorna rinna av. Tillaga i panna enligt steg 4 med färska curryblad och ärter.',
      th: 'ล้างข้าวแผ่นแล้วสะเด็ดน้ำ ผัดตามขั้นตอนที่ 4 โดยใช้ใบกะหรี่สดและถั่วลันเตาสด',
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
  if (sha(raw) !== 'fa210b984770a5fb3a2e3f0a7ecff76941c9459cc0b197ad17de3c86315e33ee') {
    throw Error('GK80 tehoajo approval packet changed');
  }
  const approval: {cases: ApprovalCase[]} = JSON.parse(raw);
  const registry: {records: GlycemicIndexRecord[]} = JSON.parse(read('docs/nutrition/glycemic-index-records.json'));
  return approval.cases.map(({recipeId, proposal, catalog, bindings}, index) => {
    for (const [file, hash] of Object.entries(bindings)) {
      if (sha(read(file)) !== hash) throw Error('GK80 tehoajo source changed: ' + file);
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
        ...(recipeId === 'hunaja-sinappikana-kaalilla' ? [{
          title: 'Maille Dijon DK (EAN 3036810201761)',
          url: 'https://www.unileverfoodsolutions.dk/produkt/maille-dijon-original-865-g-24-DA-384452.html',
          kind: 'BOUND' as const, note: '3.5 g / 100 g declared carbohydrate',
        }] : []),
      ],
    };
  });
}
