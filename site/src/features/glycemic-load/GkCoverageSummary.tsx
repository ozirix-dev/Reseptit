import type { RecipeLocale } from '@/types/content';
import type { GkVersionCoverage } from '../recipes/gk-only-types';

export const coverageCopy = {
  fi: {
    title: 'Alkuperäisten reseptien GK-kattavuus',
    original: 'Alkuperäiset reseptit, joilla on julkaistu GK-arvio',
    variants: 'Erillisversiot, joilla on GK-arvio ja joiden alkuperäisestä reseptistä arvio puuttuu',
    studies: 'Tutkimusannosvertailut',
    combined: 'Reseptit, joilla on GK-arvio alkuperäiselle tai erillisversiolle',
    target: 'Alkuperäisten reseptien 80 %:n tavoite',
    gap: 'Alkuperäisten reseptien arvioita tarvitaan vielä tavoitteeseen',
    note: 'Osuus kertoo, kuinka monella alkuperäisellä reseptillä on julkaistu GK-arvio. Laskelmien luotettavuus arvioidaan erikseen. Erillisversiot ja tutkimusannosvertailut eivät kasvata tätä osuutta.',
  },
  en: {
    title: 'GL coverage of original recipes',
    original: 'Original recipes with a published GL estimate',
    variants: 'Separate versions with a GL estimate where the original recipe has none',
    studies: 'Study serving comparisons',
    combined: 'Recipes with a GL estimate for the original or a separate version',
    target: '80% target for original recipes',
    gap: 'More original-recipe estimates needed to reach the target',
    note: 'This share shows how many original recipes have a published GL estimate. The reliability of the calculations is assessed separately. Separate versions and study serving comparisons do not count towards this share.',
  },
  sv: {
    title: 'GL-täckning för originalrecept',
    original: 'Originalrecept med en publicerad GL-uppskattning',
    variants: 'Separata versioner med GL-uppskattning där originalreceptet saknar en uppskattning',
    studies: 'Jämförelser med studieportioner',
    combined: 'Recept med en GL-uppskattning för originalet eller en separat version',
    target: 'Mål på 80 % för originalrecept',
    gap: 'Fler originalrecept som behöver en uppskattning för att nå målet',
    note: 'Andelen visar hur många originalrecept som har en publicerad GL-uppskattning. Beräkningarnas tillförlitlighet bedöms separat. Separata versioner och jämförelser med studieportioner räknas inte in i den här andelen.',
  },
  th: {
    title: 'สัดส่วนสูตรเดิมที่มีค่าประมาณ GL',
    original: 'สูตรเดิมที่เผยแพร่ค่าประมาณ GL แล้ว',
    variants: 'สูตรที่ปรับแยกต่างหากและมีค่าประมาณ GL โดยสูตรเดิมยังไม่มีค่าประมาณ',
    studies: 'การเปรียบเทียบกับหนึ่งหน่วยบริโภคในงานวิจัย',
    combined: 'สูตรที่มีค่าประมาณ GL สำหรับสูตรเดิมหรือสูตรที่ปรับแยกต่างหาก',
    target: 'เป้าหมาย 80% สำหรับสูตรเดิม',
    gap: 'จำนวนสูตรเดิมที่ยังต้องมีค่าประมาณเพื่อให้ถึงเป้าหมาย',
    note: 'สัดส่วนนี้แสดงว่ามีสูตรเดิมกี่สูตรที่เผยแพร่ค่าประมาณ GL แล้ว ความน่าเชื่อถือของการคำนวณประเมินแยกต่างหาก สัดส่วนนี้ไม่นับสูตรที่ปรับแยกต่างหากหรือการเปรียบเทียบกับหนึ่งหน่วยบริโภคในงานวิจัย',
  },
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
