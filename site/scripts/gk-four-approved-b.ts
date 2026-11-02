import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {calculateGlycemicLoad} from './glycemic-load-model';
import type {GkOnlyVariant, LocalizedText} from '../src/features/recipes/gk-only-types';

const folder = 'docs/nutrition/gk80-four-approved-b';
const packets = {
  'gi-fallback': '4cfb2c7414344c3dcdbb800f72a352f440ed10b511c00985a4da71397adc42f0',
  'pongal-followup': '826667962c3ae62fd6b845d3b0e9325b162305b9c43a864a6559d0adc41c2df4',
} as const;

type Composition = {
  id: string; name: string; kind: string; availablePer100g: number; limitation?: string;
};
type Gi = {
  id: string; kind: string; nativeId?: string; sourceUrl?: string;
  locator: string; limitation: string; values: number[]; allowedCompositionIds: string[];
};
type Ingredient = {name: string; grams: number; compositionId: string; giId: string | null; note: string};
type Scenario = {
  id: string; replaceCompositionByIngredientIndex?: Record<number, string>;
  riceCompositionId?: string; mungGi?: number; cashewGi?: number;
};
type Case = {
  recipeId: string; level: string; servings: number; inputSha256: string;
  paths: Record<string, string>; recipeSha256: Record<string, string>;
  candidateIngredients: Ingredient[]; scenarios: Scenario[]; preparationDecision: string;
};
type Copy = {
  names: LocalizedText[]; preparation: LocalizedText; limitation: LocalizedText;
  millilitres: Record<number, number>;
};
type Records = Parameters<typeof calculateGlycemicLoad>[2];
type Foods = Parameters<typeof calculateGlycemicLoad>[1];

function hash(text: string) {
  return createHash('sha256').update(text).digest('hex');
}
function requireBinding(ok: unknown, reason: string): asserts ok {
  if (!ok) throw new Error('GK80 approved B: ' + reason);
}

function evaluate(
  c: Case, scenario: Scenario, composition: Map<string, Composition>,
  giBindings: Map<string, Gi>, nativeGi: Records,
) {
  const foods: Foods = [];
  const records: Records = [];
  const usedFoods = new Set<string>();
  const usedGi = new Set<string>();
  let traceCho = 0;
  const ingredients = c.candidateIngredients.map((ingredient, index) => {
    const compositionId = scenario.replaceCompositionByIngredientIndex?.[index]
      ?? (index === 0 ? scenario.riceCompositionId : undefined) ?? ingredient.compositionId;
    const food = composition.get(compositionId);
    requireBinding(food, 'missing composition ' + compositionId);
    const giId = index === 1 && scenario.mungGi !== undefined
      ? (scenario.mungGi === 42 ? 'mung42' : 'mung31.43') : ingredient.giId;
    const binding = giId ? giBindings.get(giId) : undefined;
    const cho = ingredient.grams * food.availablePer100g / 100 / c.servings;
    requireBinding(cho === 0 || binding, 'positive carbohydrate without GI');
    requireBinding(!giId || binding?.allowedCompositionIds.includes(food.id), 'GI and food pairing');
    const gi = binding?.id === 'cashew22-27' ? scenario.cashewGi : binding?.values[0];
    requireBinding(!binding || (gi !== undefined && binding.values.includes(gi)), 'unknown scenario GI');
    if (giId === 'trace50') {
      requireBinding(cho <= 0.5, 'individual trace50 limit');
      traceCho += cho;
    }
    if (!usedFoods.has(food.id)) {
      usedFoods.add(food.id);
      foods.push({
        id: food.id, name: food.name, sourceUrl: 'native:' + food.id, retrievedAt: '2026-11-02',
        licence: 'See sealed source catalog', state: food.name, basis: 'per100g-edible',
        carbohydrateDefinition: 'EU_AVAILABLE', per100g: {carbohydrate: food.availablePer100g},
      });
    }
    const native = binding?.nativeId ? nativeGi.find(row => row.id === binding.nativeId) : undefined;
    if (binding?.kind === 'EXISTING_PUBLISHED_CODING') {
      requireBinding(native && native.gi === gi && native.matchKind !== 'CATEGORY_MEAN'
        && native.calculationUse !== 'REFERENCE_ONLY', 'published GI coding changed');
    }
    const recordId = binding ? native?.id ?? binding.id + ':' + gi : null;
    const record = native ?? (binding && recordId && gi !== undefined ? {
      id: recordId, gi, foodKey: recordId, preparationKey: recordId,
      food: binding.id, preparation: binding.locator, qualityTier: 'SUPPLEMENTARY' as const,
      referenceScale: 'GLUCOSE_100' as const, matchKind: 'ANALOG' as const, confidence: 'LOW' as const,
      evidenceKind: binding.id === 'trace50' ? 'PUBLISHED_IMPUTATION' as const : 'HUMAN_GI' as const,
      source: {
        title: binding.id, url: binding.sourceUrl!, table: binding.locator, published: true,
        year: binding.id === 'whole-cheela42-recovery' ? 1994 : binding.id === 'upittu69' ? 2000
          : binding.id === 'trace50' ? 2007 : binding.id === 'mung31.43' ? 2012 : 2021,
        iso26642Confirmed: false, qualityEvidence: binding.limitation,
      },
      note: binding.limitation,
    } : null);
    if (record && !usedGi.has(record.id)) {
      records.push(record);
      usedGi.add(record.id);
    }
    return {
      name: ingredient.name, grams: ingredient.grams, fineliRecordId: food.id, giRecordId: recordId,
      foodKey: record?.foodKey, preparationKey: record?.preparationKey,
      massEvidence: ingredient.note, giMatchEvidence: c.preparationDecision,
    };
  });
  requireBinding(traceCho <= 1, 'aggregate trace50 limit');
  const result = calculateGlycemicLoad({recipeId: c.recipeId, servings: c.servings, ingredients}, foods, records);
  requireBinding(result.status === 'CALCULATED' && !result.blockers.length
    && result.omittedAvailableCarbohydratePerServingG === 0
    && result.unroundedGlycemicLoadPerServing !== null, 'strict B calculation failed for ' + c.recipeId);
  return {value: result.unroundedGlycemicLoadPerServing, foods: usedFoods, gis: records};
}

export function buildApprovedBVariants(root: string): GkOnlyVariant[] {
  const text = (file: string) => readFileSync(join(root, file), 'utf8').replaceAll('\r\n', '\n');
  const copy: Record<string, Copy> = JSON.parse(text(folder + '/public-copy.json'));
  const nativeGi: Records = JSON.parse(text('docs/nutrition/glycemic-index-records.json')).records;
  const variants: GkOnlyVariant[] = [];
  for (const [packet, receiptHash] of Object.entries(packets)) {
    const dir = folder + '/' + packet + '/';
    const receiptText = text(dir + 'approval.json');
    requireBinding(hash(receiptText) === receiptHash, 'approval receipt changed');
    const approval = JSON.parse(receiptText);
    requireBinding(approval.sourceAndContentApproved && approval.existingBContractExactSourceApplicationsAccepted
      && approval.integrationAuthorizedForOwnerInLaterBatch && approval.displayPreference.roundingStep === 1
      && !approval.publicationAuthorized, 'approval scope');
    for (const name of ['cases.json', 'sources.json']) {
      requireBinding(hash(text(dir + name)) === approval.reviewedPacketFilesLfSha256[name], 'reviewed packet changed');
    }
    const {composition, giBindings, sourceFilesLfSha256} = JSON.parse(text(dir + 'sources.json')) as {
      composition: Composition[]; giBindings: Gi[]; sourceFilesLfSha256: Record<string, string>;
    };
    for (const [file, seal] of Object.entries(sourceFilesLfSha256)) {
      requireBinding(hash(text(file)) === seal, 'native source or engine changed: ' + file);
    }
    const compositions = new Map(composition.map(row => [row.id, row]));
    const bindings = new Map(giBindings.map(row => [row.id, row]));
    const {cases} = JSON.parse(text(dir + 'cases.json')) as {cases: Case[]};
    requireBinding(cases.length === approval.acceptedVersions.length, 'unexpected case count');
    for (const c of cases) {
      const {inputSha256, ...input} = c;
      const accepted = approval.acceptedVersions.find((row: {recipeId: string}) => row.recipeId === c.recipeId);
      requireBinding(c.level === 'B' && c.servings === 2 && accepted?.inputSha256 === inputSha256
        && approval.approvedInputs[c.recipeId] === inputSha256 && hash(JSON.stringify(input)) === inputSha256,
      'exact approved input changed: ' + c.recipeId);
      for (const [locale, file] of Object.entries(c.paths)) {
        requireBinding(hash(text(file)) === c.recipeSha256[locale], 'parent recipe changed: ' + file);
      }
      const results = c.scenarios.map(scenario => evaluate(c, scenario, compositions, bindings, nativeGi));
      const min = Math.min(...results.map(result => result.value));
      const max = Math.max(...results.map(result => result.value));
      requireBinding(Math.abs(min - Number(accepted.sourceScenarioMin)) < 1e-10
        && Math.abs(max - Number(accepted.sourceScenarioMax)) < 1e-10
        && Math.floor(min) === accepted.integerDisplay.min && Math.ceil(max) === accepted.integerDisplay.max,
      'approved scenario range changed: ' + c.recipeId);
      const labels = copy[c.recipeId];
      requireBinding(labels?.names.length === c.candidateIngredients.length, 'missing public ingredient names');
      const ingredients = c.candidateIngredients.map((ingredient, index) => {
        const name = labels.names[index];
        const ml = labels.millilitres[index];
        return ml === undefined ? {name, grams: ingredient.grams || null}
          : {name, grams: null, quantity: {amount: ml, unit: 'ml' as const}};
      });
      const usedFoods = new Set(results.flatMap(result => [...result.foods]));
      const records = new Map(results.flatMap(result => result.gis).map(record => [record.id, record]));
      const sources: GkOnlyVariant['sources'] = composition.filter(food => usedFoods.has(food.id)).map(food => ({
        title: food.name, kind: 'CARBOHYDRATE',
        url: food.kind === 'FINELI_CHOAVL' ? 'https://fineli.fi/fineli/fi/index'
          : food.kind === 'AFCD_WITHOUT_SUGAR_ALCOHOLS' ? 'https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd'
            : 'https://www.nin.res.in/ebooks/IFCT2017_16122024.pdf',
        note: food.limitation ?? food.kind,
      }));
      for (const record of records.values()) {
        sources.push({
          title: record.source.title, url: record.source.url,
          kind: record.evidenceKind === 'HUMAN_GI' ? 'HUMAN_GI' : 'PUBLISHED_CODING',
          note: record.note ?? record.source.qualityEvidence,
        });
      }
      variants.push({
        recipeId: c.recipeId, versionId: 'gk-b4-' + inputSha256.slice(0, 12), inputSha256,
        level: 'B', servings: c.servings, point: null, scenarioRange: {min, max},
        rangeKind: 'NAMED_COMPARATOR_SCENARIOS', rangeDisplay: 'OUTWARD_INTEGER',
        omittedCho: 0, confidence: 'LOW', macroScope: 'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
        quantityContract: 'GK_ONLY_NATIVE_UNITS_V1', ingredients,
        preparation: labels.preparation, standalonePreparation: true, limitation: labels.limitation,
        codingKinds: c.candidateIngredients.some(row => row.giId === 'trace50') ? ['TRACE50'] : [],
        sensitivity: null, sources,
      });
    }
  }
  requireBinding(variants.length === 4 && new Set(variants.map(row => row.recipeId)).size === 4, 'expected four distinct recipes');
  return variants;
}
