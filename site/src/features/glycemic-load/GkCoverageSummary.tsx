import type { RecipeLocale } from '@/types/content';
import type { GkVersionCoverage } from '../recipes/gk-only-types';
import type { GkPortionCoverage } from '../recipes/gk-portion';

export const coverageCopy = {
  fi: {
    title: 'Mitä tietoa resepteistä löytyy?',
    original: 'Alkuperäisreseptit, joilla on GK-luku tai vaihteluväli',
    verbal: 'Reseptit, joilla on sanallinen GK-arvio',
    carbs: 'Reseptit, joilla on koko annoksen hiilihydraattimäärä',
    carbsOnly: 'Näistä reseptit, joilla ei ole GK-arviota',
    foodOnly: 'Reseptit, joilla on vain ruokakohtainen huomio hiilihydraateista',
    limited: 'Reseptit, joista voidaan kertoa vain, mitä tietoa puuttuu',
    reviewed: 'Reseptit, joiden GI-lähteet on katselmoitu',
    pending: 'Reseptit, joiden GI-lähteiden katselmointi on kesken',
    useful: 'Reseptit, joista on GK-arvio, annoksen hiilihydraattimäärä tai ruokakohtainen huomio',
    variants: 'Erillisversiot, joilla on GK-arvio ja joiden alkuperäisestä reseptistä arvio puuttuu',
    studies: 'Tutkimusannosvertailut',
    combined: 'Reseptit, joilla on GK-arvio alkuperäiselle tai erillisversiolle',
    target: 'Alkuperäisten reseptien 80 %:n tavoite',
    gap: 'Alkuperäisten reseptien arvioita tarvitaan vielä tavoitteeseen',
    note: 'Luvut koskevat julkisia alkuperäisreseptejä. Sama resepti voi näkyä usealla rivillä, esimerkiksi GK-lukuna ja hiilihydraattimääränä. Yhteismäärässä kukin resepti lasketaan kerran. Erillisversiot ja tutkimusvertailut näytetään erikseen.',
  },
  en: {
    title: 'What information is available for recipes?',
    original: 'Original recipes with a GL number or range',
    verbal: 'Recipes with a GL estimate in words',
    carbs: 'Recipes with a carbohydrate amount for the whole serving',
    carbsOnly: 'Of these, recipes without a GL estimate',
    foodOnly: 'Recipes with only a food-specific note about carbohydrate',
    limited: 'Recipes that can only say what information is missing',
    reviewed: 'Recipes whose GI sources have been reviewed',
    pending: 'Recipes awaiting a GI source review',
    useful: 'Recipes with a GL estimate, a carbohydrate amount or a food-specific note',
    variants: 'Separate versions with a GL estimate where the original recipe has none',
    studies: 'Study serving comparisons',
    combined: 'Recipes with a GL estimate for the original or a separate version',
    target: '80% target for original recipes',
    gap: 'More original-recipe estimates needed to reach the target',
    note: 'These figures cover public original recipes. A recipe may appear on multiple lines, for example under both a GL number and carbohydrate amount. Each recipe is counted once in the combined figure. Separate versions and study comparisons are listed separately.',
  },
  sv: {
    title: 'Vilken information finns för recepten?',
    original: 'Originalrecept med GL-värde eller GL-intervall',
    verbal: 'Recept med en GL-uppskattning i ord',
    carbs: 'Recept med kolhydratmängd för hela portionen',
    carbsOnly: 'Av dessa: recept utan GL-uppskattning',
    foodOnly: 'Recept som enbart har en kommentar om kolhydraterna i just den rätten',
    limited: 'Recept där vi bara kan ange vilka uppgifter som saknas',
    reviewed: 'Recept vars GI-källor har granskats',
    pending: 'Recept vars GI-källor väntar på granskning',
    useful: 'Recept med GL-uppskattning, kolhydratmängd eller en kommentar om rätten',
    variants: 'Separata versioner med GL-uppskattning där originalreceptet saknar en uppskattning',
    studies: 'Jämförelser med studieportioner',
    combined: 'Recept med en GL-uppskattning för originalet eller en separat version',
    target: 'Mål på 80 % för originalrecept',
    gap: 'Fler originalrecept som behöver en uppskattning för att nå målet',
    note: 'Siffrorna gäller publicerade originalrecept. Ett recept kan stå på flera rader, till exempel både under GL-värde och kolhydratmängd. I den sammanlagda siffran räknas varje recept en gång. Separata versioner och jämförelser med studieportioner redovisas för sig.',
  },
  th: {
    title: 'มีข้อมูลอะไรบ้างสำหรับแต่ละสูตร',
    original: 'สูตรต้นฉบับที่มีค่า GL เป็นตัวเลขหรือช่วงค่า',
    verbal: 'สูตรที่อธิบายระดับ GL เป็นคำพูด',
    carbs: 'สูตรที่ระบุปริมาณคาร์โบไฮเดรตสำหรับอาหารทั้งหนึ่งที่',
    carbsOnly: 'ในจำนวนนี้มีสูตรที่ยังไม่มีค่าประมาณ GL',
    foodOnly: 'สูตรที่มีเพียงข้อสังเกตเกี่ยวกับคาร์โบไฮเดรตในอาหารจานนั้น',
    limited: 'สูตรที่ระบุได้เพียงว่าข้อมูลใดขาดหาย',
    reviewed: 'สูตรที่ตรวจสอบแหล่งข้อมูล GI แล้ว',
    pending: 'สูตรที่รอตรวจสอบแหล่งข้อมูล GI',
    useful: 'สูตรที่มีค่าประมาณ GL ปริมาณคาร์โบไฮเดรต หรือข้อสังเกตเฉพาะจาน',
    variants: 'สูตรที่ปรับแยกต่างหากและมีค่าประมาณ GL โดยสูตรเดิมยังไม่มีค่าประมาณ',
    studies: 'การเปรียบเทียบกับหนึ่งหน่วยบริโภคในงานวิจัย',
    combined: 'สูตรที่มีค่าประมาณ GL สำหรับสูตรเดิมหรือสูตรที่ปรับแยกต่างหาก',
    target: 'เป้าหมาย 80% สำหรับสูตรเดิม',
    gap: 'จำนวนสูตรเดิมที่ยังต้องมีค่าประมาณเพื่อให้ถึงเป้าหมาย',
    note: 'ตัวเลขนี้นับเฉพาะสูตรต้นฉบับที่เผยแพร่แล้ว สูตรเดียวกันอาจอยู่ได้หลายรายการ เช่น มีทั้งค่า GL และปริมาณคาร์โบไฮเดรต แต่ในยอดรวมจะนับสูตรละหนึ่งครั้ง สูตรเวอร์ชันแยกและการเปรียบเทียบกับหน่วยบริโภคในงานวิจัยแสดงแยกต่างหาก',
  },
} satisfies Record<RecipeLocale, Record<string, string>>;

export function GkCoverageSummary({ coverage: c, portionCoverage: p, locale }: {
  coverage: GkVersionCoverage;
  portionCoverage: GkPortionCoverage;
  locale: RecipeLocale;
}) {
  const t = coverageCopy[locale];
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
  const target = Math.ceil(p.total * 0.8);
  return <details className="glycemic-pilot__method glycemic-pilot__disclosure">
    <summary id="gk-original-coverage-title">{t.title}</summary>
    <p data-gk-coverage="ORIGINAL_COVERAGE"><strong>{p.originalNumeric}/{p.total} ({percent.format(p.total ? p.originalNumeric / p.total : 0)})</strong> — {t.original}</p>
    <ul>
      <li data-gk-coverage="ORIGINAL_VERBAL"><strong>{p.originalVerbal}/{p.total}</strong> — {t.verbal}</li>
      <li data-gk-coverage="WHOLE_PORTION_CARBS"><strong>{p.wholePortionCarbs}/{p.total}</strong> — {t.carbs}</li>
      <li data-gk-coverage="CARBS_ONLY"><strong>{p.carbOnly}</strong> — {t.carbsOnly}</li>
      <li data-gk-coverage="FOOD_NOTE_ONLY"><strong>{p.foodNoteOnly}/{p.total}</strong> — {t.foodOnly}</li>
      <li data-gk-coverage="LIMITED"><strong>{p.limited}/{p.total}</strong> — {t.limited}</li>
      <li data-gk-coverage="USEFUL"><strong>{p.useful}/{p.total}</strong> — {t.useful}</li>
      <li data-gk-coverage="REVIEWED"><strong>{p.total - p.pending}/{p.total}</strong> — {t.reviewed}</li>
      <li data-gk-coverage="PENDING"><strong>{p.pending}/{p.total}</strong> — {t.pending}</li>
    </ul>
    <p>{t.note}</p>
    <ul>
      <li data-gk-coverage="VARIANT_COVERAGE"><strong>{c.variantNumeric}</strong> — {t.variants}</li>
      <li data-gk-coverage="STUDY_SERVINGS"><strong>{c.studyServingRecipeIds.length}</strong> — {t.studies}</li>
      <li data-gk-coverage="HOME_VERSION_COVERAGE"><strong>{p.originalNumeric + c.variantNumeric}/{p.total}</strong> — {t.combined}</li>
      <li data-gk-target="ORIGINAL_COVERAGE"><strong>{target}/{p.total}</strong> — {t.target}</li>
      <li data-gk-target-gap="ORIGINAL_COVERAGE"><strong>{Math.max(0, target - p.originalNumeric)}</strong> — {t.gap}</li>
    </ul>
  </details>;
}
