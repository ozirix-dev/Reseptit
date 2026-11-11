import { createHash } from 'node:crypto';

const recipes = {
  'reseptit/aamupalat/indonesialainen-serabi-kookospannukakku.md': {
    batchId: 'gk100-pr233-content-decisions',
    reviewedSha: '43e49cef638b2825703e60ef9c477b979f193c2536c151b768a51b01131e64c8',
    sealedSha: '3c3948cb2d5e7092f203c3656f023a9c041066c4a364c624c1dea7ed82f8de70',
    lastStep: '4. Sekoita riisijauho, kookosmaito ja kookoshiutaleet tasaiseksi taikinaksi. Anna levätä 10 minuuttia. Paista pieniksi paksuiksi pannukakuiksi öljytyssä pannussa miedolla lämmöllä. Ripottele fariinisokeri päälle ja kuumenna, kunnes se sulaa.',
  },
  'reseptit/aamupalat/malesialainen-apam-balik.md': {
    batchId: 'gk100-owner-approved-eighteen',
    reviewedSha: '09ae31511967f7cab6f686da6c0a499c8b2d3832c2f318c6b3ad8ea4024a0e49',
    sealedSha: 'e79cae619673433b33136e61e4ca91d14daa02a4c226645347b386ef38893f80',
    lastStep: '4. Vatkaa vehnäjauho, kananmuna ja vesi tasaiseksi taikinaksi. Anna levätä kymmenen minuuttia. Kypsennä öljytyllä pannulla paksuksi kuplivaksi letuksi, lisää maissi, maapähkinä ja sokeri, taita puolikuuksi ja kypsennä loppuun.',
  },
} as const;

export const reviewedBreakfastPaths = Object.freeze(Object.keys(recipes));

const preparation = '\n## Valmistus\n\n';
const historicalSteps = [
  '1. Sekoita jauhot tai viljat ja muut kuivat ainekset kulhossa. Lisää neste vähitellen ja vatkaa tasaiseksi taikinaksi.',
  '2. Anna taikinan levätä 10 minuuttia. Jos käytät kokonaisia palkokasveja tai viljoja taikinapohjana, niiden tulee olla liotettuja ja hienonnettuja.',
  '3. Kuumenna öljytty pannu keskilämmölle. Paista taikina ohuina annoksina; käännä, kun reunat kuivuvat ja pinta alkaa asettua.',
];
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

/** Recover the previously sealed source only for either exact reviewed preparation correction. */
export function historicalBreakfastRecipe(path: string, current: string): string {
  if (!Object.hasOwn(recipes, path)) return current;
  const recipe = recipes[path as keyof typeof recipes];
  const normalized = current.replaceAll('\r\n', '\n');
  if (sha256(normalized) !== recipe.reviewedSha) return current;

  const beforeSteps = normalized.indexOf(preparation);
  if (beforeSteps < 0) throw Error('GK100_BREAKFAST_PREPARATION_MISSING');
  const historical = normalized.slice(0, beforeSteps + preparation.length)
    + [...historicalSteps, recipe.lastStep].join('\n') + '\n';
  if (sha256(historical) !== recipe.sealedSha) throw Error('GK100_BREAKFAST_HISTORICAL_SOURCE_MISMATCH');
  return historical;
}

/** The approved estimates describe separate thin versions, scoped to their existing bundles. */
export function historicalBreakfastForApprovedThinVersion(batchId: string, path: string, current: string): string {
  if (!Object.hasOwn(recipes, path) || recipes[path as keyof typeof recipes].batchId !== batchId) return current;
  return historicalBreakfastRecipe(path, current);
}
