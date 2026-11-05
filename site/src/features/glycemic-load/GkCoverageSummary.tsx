import type { RecipeLocale } from '@/types/content';
import type { GkVersionCoverage } from '../recipes/gk-only-types';

export const coverageCopy = {
  fi: { title: 'Alkuperäisten reseptien GK-kattavuus', original: 'Alkuperäiseen reseptiin sidottu arvio', variants: 'Erillinen GK-versio, alkuperäisen arvio puuttuu', studies: 'Tutkimusvertailut', combined: 'Alkuperäinen arvio tai erillinen reseptiversio', target: 'Alkuperäisten reseptien 80 %:n tavoite', gap: 'Puuttuvia alkuperäisreseptien arvioita tavoitteeseen', note: 'Kattavuus kuvaa nykyisiä reseptisidoksia. Se ei ole laskelmien uusi tieteellinen hyväksyntä. Erillisversiot ja tutkimusvertailut eivät kasvata alkuperäisten reseptien kattavuutta.' },
  en: { title: 'GL coverage of original recipes', original: 'Estimate bound to the original recipe', variants: 'Separate GL version; original estimate unavailable', studies: 'Study comparisons', combined: 'Original estimate or separate recipe version', target: '80% target for original recipes', gap: 'Original-recipe estimates still needed', note: 'Coverage describes current recipe bindings, not a new scientific approval of the calculations. Separate versions and study comparisons do not increase original-recipe coverage.' },
  sv: { title: 'GL-täckning för originalrecept', original: 'Uppskattning knuten till originalreceptet', variants: 'Separat GL-version; originalets uppskattning saknas', studies: 'Forskningsjämförelser', combined: 'Originalets uppskattning eller separat receptversion', target: '80-procentsmål för originalrecept', gap: 'Ytterligare uppskattningar för originalrecept som behövs', note: 'Täckningen beskriver nuvarande receptkopplingar, inte ett nytt vetenskapligt godkännande av beräkningarna. Separata versioner och forskningsjämförelser ökar inte originalreceptens täckning.' },
  th: { title: 'สัดส่วนสูตรเดิมที่มีค่าประมาณ GL', original: 'ค่าประมาณที่ผูกกับสูตรเดิม', variants: 'มีค่า GL ของสูตรเวอร์ชันแยก แต่ยังไม่มีค่าของสูตรเดิม', studies: 'อาหารจากงานวิจัยสำหรับเปรียบเทียบ', combined: 'มีค่าของสูตรเดิมหรือสูตรเวอร์ชันแยก', target: 'เป้าหมาย 80% สำหรับสูตรเดิม', gap: 'จำนวนสูตรเดิมที่ยังต้องมีค่าประมาณเพื่อให้ถึงเป้าหมาย', note: 'สัดส่วนนี้แสดงการผูกข้อมูลกับสูตรในปัจจุบัน ไม่ใช่การรับรองการคำนวณทางวิทยาศาสตร์ครั้งใหม่ สูตรเวอร์ชันแยกและอาหารเปรียบเทียบจากงานวิจัยไม่เพิ่มสัดส่วนของสูตรเดิม' },
} satisfies Record<RecipeLocale, Record<string, string>>;

export function GkCoverageSummary({ coverage: c, locale }: { coverage: GkVersionCoverage; locale: RecipeLocale }) {
  const t = coverageCopy[locale];
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
  return <section className="glycemic-pilot__method" aria-labelledby="gk-original-coverage-title">
    <h2 id="gk-original-coverage-title">{t.title}</h2>
    <p data-gk-coverage="ORIGINAL_COVERAGE"><strong>{c.originalNumeric}/{c.total} ({percent.format(c.total ? c.originalNumeric / c.total : 0)})</strong> — {t.original}</p>
    <ul>
      <li data-gk-coverage="VARIANT_COVERAGE"><strong>{c.variantNumeric}</strong> — {t.variants}</li>
      <li data-gk-coverage="STUDY_SERVINGS"><strong>{c.studyServingRecipeIds.length}</strong> — {t.studies}</li>
      <li data-gk-coverage="HOME_VERSION_COVERAGE"><strong>{c.numericRecipes}/{c.total}</strong> — {t.combined}</li>
      <li data-gk-target="ORIGINAL_COVERAGE"><strong>{c.originalTarget}/{c.total}</strong> — {t.target}</li>
      <li data-gk-target-gap="ORIGINAL_COVERAGE"><strong>{c.originalTargetGap}</strong> — {t.gap}</li>
    </ul>
    <p>{t.note}</p>
  </section>;
}
