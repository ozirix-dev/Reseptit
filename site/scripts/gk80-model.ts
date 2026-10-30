// Isolated research prototype: no imports from the production app.
import { createHash } from 'node:crypto';

export type Method = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type Macro = { availableCarbohydrate: number; protein: number; fat: number; fibre: number };
export type Source = { id: string; gi: number; scale: string; family: string; evidenceHash: string; [key: string]: unknown };
export type Ingredient = {
  index: number; name: string; massG: number | null; certifiedZeroSalt?: boolean;
  per100g: Macro | null; retention: number; carbohydrateDefinition: string;
  giId: string | null; giEvidenceHash: string | null; family: string;
  match: string; applicability: string;
};
export type Scenario = { id: string; ingredients: Ingredient[] };
export type Recipe = { recipeId: string; sourceSha256: string; servings: number; method: Method;
  completeInputScope: boolean; coverageProposalEligible: boolean; scenarios: Scenario[] };
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical((value as Record<string, unknown>)[k])).join(',') + '}';
  return JSON.stringify(value);
}
export const fingerprint = (value: unknown) => createHash('sha256').update(canonical(value)).digest('hex');
export function verifySource(source: Source): void {
  const { evidenceHash, ...payload } = source;
  if (fingerprint(payload) !== evidenceHash) throw new Error('STALE_SOURCE');
  if (source.scale !== 'GLUCOSE_100' || !Number.isFinite(source.gi) || source.gi < 0) throw new Error('INVALID_GI');
  // GI can exceed 100. No implicit cap, scale conversion or SEM expansion.
}
export function normalizeGi(gi: number, scale: 'GLUCOSE_100' | 'WHITE_BREAD_100', conversion?: { factor: number; evidence: string }) {
  if (!Number.isFinite(gi) || gi < 0) throw new Error('INVALID_GI');
  if (scale === 'GLUCOSE_100') {
    if (conversion) throw new Error('DOUBLE_NORMALIZATION');
    return gi;
  }
  if (!conversion || !conversion.evidence || !Number.isFinite(conversion.factor) || conversion.factor <= 0) throw new Error('MISSING_SCALE_EVIDENCE');
  return gi * conversion.factor;
}
export function calculate(recipe: Recipe, sources: Source[], currentRecipeHash: string, expectedInputHash: string) {
  if (recipe.sourceSha256 !== currentRecipeHash || fingerprint(recipe) !== expectedInputHash) throw new Error('STALE_INPUT');
  if (!Number.isFinite(recipe.servings) || recipe.servings <= 0 || recipe.scenarios.length === 0) throw new Error('INVALID_SCOPE');
  const map = new Map(sources.map(s => [s.id, s]));
  if (map.size !== sources.length) throw new Error('DUPLICATE_SOURCE');
  const scenarioIds = recipe.scenarios.map(s => s.id);
  if (new Set(scenarioIds).size !== scenarioIds.length) throw new Error('DUPLICATE_SCENARIO');
  const scenarios = recipe.scenarios.map(s => {
    const seen = new Set<number>();
    const macros: Macro = { availableCarbohydrate: 0, protein: 0, fat: 0, fibre: 0 };
    let subtotal = 0;
    const contributions = s.ingredients.map(i => {
      if (seen.has(i.index)) throw new Error('DUPLICATE_INGREDIENT');
      seen.add(i.index);
      if (!Number.isFinite(i.retention) || i.retention < 0 || i.retention > 1) throw new Error('INVALID_RETENTION');
      if (i.carbohydrateDefinition !== 'AVAILABLE_EXCLUDING_FIBRE_AND_POLYOLS') throw new Error('CARBOHYDRATE_DEFINITION');
      const zeroSalt = i.certifiedZeroSalt === true && /^(ripaus )?suolaa?( maun mukaan)?$/.test(i.name) && i.per100g && Object.values(i.per100g).every(v => v === 0);
      if (!i.per100g || (i.massG === null && !zeroSalt)) return { index: i.index, carbohydrate: null, gk: null, reason: 'MISSING_MASS_OR_COMPOSITION', giForOneGk: null };
      if (Object.values(i.per100g).some(v => !Number.isFinite(v) || v < 0) || (i.massG !== null && (!Number.isFinite(i.massG) || i.massG < 0))) throw new Error('INVALID_NUTRITION');
      const factor = zeroSalt ? 0 : i.massG! * i.retention / 100 / recipe.servings;
      for (const key of Object.keys(macros) as (keyof Macro)[]) macros[key] += i.per100g[key] * factor;
      const carbohydrate = i.per100g.availableCarbohydrate * factor;
      if (carbohydrate === 0) return { index: i.index, carbohydrate, gk: 0, reason: 'EXPLICIT_ZERO_CHO', giForOneGk: null };
      if (!i.giId) return { index: i.index, carbohydrate, gk: null, reason: 'MISSING_GI', giForOneGk: 100 / carbohydrate };
      const source = map.get(i.giId);
      if (!source) throw new Error('UNKNOWN_GI');
      verifySource(source);
      if (source.evidenceHash !== i.giEvidenceHash) throw new Error('STALE_BINDING');
      if (source.family !== i.family) throw new Error('WRONG_FOOD_FAMILY');
      if (!i.applicability || (recipe.method === 'A' && i.match !== 'DIRECT')) throw new Error('UNREVIEWED_MATCH');
      if (source.gi === 0) throw new Error('POSITIVE_CHO_ZERO_GI');
      const gk = carbohydrate * source.gi / 100;
      subtotal += gk;
      return { index: i.index, carbohydrate, gk, reason: i.match, giForOneGk: null };
    });
    const missing = contributions.filter(x => x.gk === null);
    return { id: s.id, macros, contributions, missing, knownSubtotal: subtotal,
      wholeGk: missing.length === 0 && recipe.completeInputScope ? subtotal : null,
      wholeCarbohydrate: contributions.every(x => x.carbohydrate !== null) && recipe.completeInputScope ? macros.availableCarbohydrate : null };
  });
  const complete = scenarios.every(s => s.wholeGk !== null);
  const min = complete ? Math.min(...scenarios.map(s => s.wholeGk!)) : null;
  const max = complete ? Math.max(...scenarios.map(s => s.wholeGk!)) : null;
  const broad = min !== null && max !== null && min <= 10 && max >= 20;
  const numericProposal = complete && ['A','B','C','D'].includes(recipe.method) && recipe.coverageProposalEligible && !broad;
  return { recipeId: recipe.recipeId, method: recipe.method, scenarios, min, max, broad, numericProposal,
    classes: min === null || max === null ? [] : [...new Set([gkClass(min),gkClass(max)])],
    interpretation: 'Named model scenarios, not a statistical confidence interval, measured meal response or individual prediction.' };
}
export function gkClass(v: number) { return v <= 10 ? 'LOW' : v < 20 ? 'MEDIUM' : 'HIGH'; }
export function rounded(value: number): string { return value > 0 && value < 1 ? '<1' : String(Math.round(value)); }
const labels = {
  fi: ['GK-arvio noin', 'Mallinnettu skenaarioalue; ei tilastollinen luottamusväli.', 'GK ei arvioitavissa'],
  en: ['Estimated GL about', 'Modelled scenario range; not a statistical confidence interval.', 'GL unavailable'],
  sv: ['Uppskattad GL cirka', 'Modellerat scenariointervall; inte ett statistiskt konfidensintervall.', 'GL kan inte bedömas'],
  th: ['ค่าประมาณ GL ประมาณ', 'ช่วงค่าจากสถานการณ์จำลอง ไม่ใช่ช่วงความเชื่อมั่นทางสถิติ', 'ยังประเมิน GL ไม่ได้'],
};
export function display(result: ReturnType<typeof calculate>, locale: keyof typeof labels) {
  const [prefix, note, unavailable] = labels[locale];
  if (!result.numericProposal) return { text: unavailable, note, classes: [] };
  const low = rounded(result.min!), high = rounded(result.max!);
  return { text: `${prefix} ${low === high ? low : low + '–' + high}`, note, classes: result.classes };
}
export function proposalCount(results: ReturnType<typeof calculate>[]) {
  return new Set(results.filter(r => r.numericProposal).map(r => r.recipeId)).size;
}

