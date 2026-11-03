import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {textHash} from './gk149-model';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadIngredientInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant} from '../src/features/recipes/gk-only-types';

const archive = 'docs/research/gk80-international-20261102/';
const approvalPath = 'docs/nutrition/gk80-poha-honey-mustard/approval.json';
/** These strings are display-only; never alter the sealed calculation inputs. */
const translations = [
  {
    en: {
      names: ['Rice flakes', 'Raw unsalted peanuts', 'Fresh curry leaves', 'Fresh green peas', 'Neutral cooking oil', 'Fresh coriander', 'Lemon juice', 'Salt to taste'],
      preparation: 'Rinse the rice flakes briefly and drain. Sauté the peanuts, peas and fresh curry leaves in oil. Add the rice flakes and heat through. Finish with coriander, lemon juice and salt.',
      limitation: 'Rice flakes, peanuts and peas use food-category GI estimates, not measured values for this exact dish. No carbohydrate reduction is assumed for rinsing.',
    },
    sv: {
      names: ['Risflingor', 'Råa osaltade jordnötter', 'Färska curryblad', 'Färska gröna ärter', 'Neutral matolja', 'Färsk koriander', 'Citronsaft', 'Salt efter smak'],
      preparation: 'Skölj risflingorna snabbt och låt dem rinna av. Fräs jordnötter, ärter och färska curryblad i olja. Tillsätt risflingorna och värm igenom. Avsluta med koriander, citronsaft och salt.',
      limitation: 'För risflingor, jordnötter och ärter används GI-uppskattningar för livsmedelsgrupper, inte uppmätta värden för denna rätt. Ingen minskning av kolhydrater genom sköljningen antas.',
    },
    th: {
      names: ['ข้าวแผ่นแบน (โปฮา)', 'ถั่วลิสงดิบไม่ใส่เกลือ', 'ใบแกงกะหรี่สด', 'ถั่วลันเตาสด', 'น้ำมันปรุงอาหารรสกลาง', 'ผักชีสด', 'น้ำมะนาวเหลือง', 'เกลือตามชอบ'],
      preparation: 'ล้างข้าวแผ่นอย่างรวดเร็วแล้วสะเด็ดน้ำ ผัดถั่วลิสง ถั่วลันเตา และใบแกงกะหรี่สดในน้ำมัน ใส่ข้าวแผ่นแล้วผัดให้ร้อนทั่ว โรยผักชี เติมน้ำมะนาวและเกลือ',
      limitation: 'ข้าวแผ่น ถั่วลิสง และถั่วลันเตาใช้ค่า GI โดยประมาณจากกลุ่มอาหาร ไม่ใช่ค่าที่วัดจากอาหารจานนี้โดยตรง และไม่ได้หักคาร์โบไฮเดรตจากการล้างข้าวแผ่น',
    },
  },
  {
    en: {
      names: ['Skinless chicken thigh meat', 'White cabbage', 'Maille Dijon Original mustard, 865 g pack', 'Honey', 'Olive oil', 'Garlic powder', 'Paprika powder', 'Black pepper', 'Salt to taste'],
      preparation: 'Spread the cabbage and chicken on a baking tray. Mix the weighed mustard, honey, oil and spices and coat the tray contents. Roast as directed in the original recipe until the chicken is cooked through. Divide all the cabbage, coating and tray juices among the servings.',
      limitation: 'Cabbage and honey use food-category GI estimates. The carbohydrate allowance for the named Maille mustard is label-based, and the garlic powder allowance uses its full weighed mass.',
    },
    sv: {
      names: ['Skinnfritt kycklinglårkött', 'Vitkål', 'Maille Dijon Original-senap, förpackning 865 g', 'Honung', 'Olivolja', 'Vitlökspulver', 'Paprikapulver', 'Svartpeppar', 'Salt efter smak'],
      preparation: 'Lägg vitkål och kyckling på en ugnsplåt. Blanda uppmätt senap, honung, olja och kryddor och fördela blandningen över plåten. Tillaga enligt grundreceptet tills kycklingen är genomstekt. Fördela all vitkål, marinad och steksky mellan portionerna.',
      limitation: 'För vitkål och honung används GI-uppskattningar för livsmedelsgrupper. Kolhydratreserven för den angivna Maille-senapen bygger på etiketten och reserven för vitlökspulver på hela den vägda mängden.',
    },
    th: {
      names: ['เนื้อสะโพกไก่เลาะหนัง', 'กะหล่ำปลีขาว', 'มัสตาร์ด Maille Dijon Original ขนาด 865 กรัม', 'น้ำผึ้ง', 'น้ำมันมะกอก', 'ผงกระเทียม', 'ผงปาปริกา', 'พริกไทยดำ', 'เกลือตามชอบ'],
      preparation: 'วางกะหล่ำปลีและไก่บนถาดอบ ผสมมัสตาร์ด น้ำผึ้ง น้ำมัน และเครื่องเทศตามปริมาณที่ชั่งไว้ แล้วคลุกให้ทั่ว อบตามสูตรต้นฉบับจนไก่สุกทั่ว แบ่งกะหล่ำปลี ซอสที่เคลือบ และน้ำจากถาดอบทั้งหมดให้ครบทุกที่',
      limitation: 'กะหล่ำปลีและน้ำผึ้งใช้ค่า GI ประมาณจากกลุ่มอาหาร ปริมาณคาร์โบไฮเดรตเผื่อสำหรับมัสตาร์ด Maille ที่ระบุอ้างอิงจากฉลาก และสำหรับผงกระเทียมอ้างอิงจากน้ำหนักที่ชั่งทั้งหมด',
    },
  },
] as const;
const versions = [
  {
    directory: 'poha-and-main179', file: 'poha-fresh-leaf-version.json',
    names: ['Riisihiutaleet', 'Raa’at suolaamattomat maapähkinät', 'Tuore currylehti', 'Tuoreet vihreät herneet',
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

  return versions.map((version, versionIndex) => {
    const directory = archive + version.directory + '/';
    const path = directory + version.file;
    const packet: Packet = JSON.parse(read(path));
    const {recipeId, servings, ingredients, expected} = packet;
    if (textHash(pohaHoneySourceSnapshot(packet.sourcePath, read(packet.sourcePath))) !== packet.sourceLfSha256 || ingredients.length !== version.names.length) {
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
    const tr = translations[versionIndex];
    if ([tr.en.names, tr.sv.names, tr.th.names].some(names => names.length !== ingredients.length)) {
      throw Error('GK-only translations do not cover every ingredient: ' + recipeId);
    }
    const preparation = {
      fi: version.preparation, en: tr.en.preparation, sv: tr.sv.preparation, th: tr.th.preparation,
    };
    const limitation = {
      fi: version.limitation, en: tr.en.limitation, sv: tr.sv.limitation, th: tr.th.limitation,
    };
    return {
      recipeId, versionId: 'gk-poha-honey-' + inputSha256.slice(0, 12), inputSha256, level: 'A',
      servings, point: result.glycemicLoadPerServing, scenarioRange: null, rangeKind: null,
      omittedCho: result.omittedAvailableCarbohydratePerServingG, confidence: 'LOW',
      macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
      ingredients: ingredients.map((ingredient, index) => ({
        name: {fi: version.names[index], en: tr.en.names[index], sv: tr.sv.names[index], th: tr.th.names[index]},
        grams: ingredient.grams,
      })),
      standalonePreparation: true, preparation, limitation,
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

export function pohaHoneySourceSnapshot(file: string, text: string): string {
  if (file === "reseptit/aamupalat/indialainen-poha-maapahkinoilla.md" ||
      file === "reseptit/paaruoat/hunaja-sinappikana-kaalilla.md") {
    text = text.replace(
      "\nstatus: published\ntranslation_languages: [en, sv, th]\ntranslation_status: {en: published, sv: published, th: published}\n",
      "\nstatus: published\n",
    );
  }
  return text;
}
