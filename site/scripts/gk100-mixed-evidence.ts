import { fingerprint } from './gk80-candidate-model';
import { validatePointReview, type PointReviewBase } from './gk100-point-packet';

export const MIXED_EVIDENCE_METHOD = 'MIXED_EVIDENCE_V1';
export const mixedBindingsPath = 'docs/nutrition/gk100-mixed-evidence-bindings.json';

type Source = { url: string; locator: string };
type GiKind = 'HUMAN_GI' | 'PUBLISHED_CODING' | 'B_CODING';
type Binding = {
  scopeSha256: string;
  ingredientIndex: number;
  composition: {
    id: string;
    unit: 'g' | 'ml';
    availablePer100: number;
    source: Source;
  };
  gi: { kind: GiKind; value: number; source: Source } | { kind: 'UNKNOWN' };
  applicability: string;
  approvalEvidence: string;
};
type MixedRow =
  | { ingredientIndex: number; bindingId: string; kind: GiKind }
  | { ingredientIndex: number; bindingId: string; kind: 'UNKNOWN'; omissionReason?: string };

export type MixedEvidencePacket = PointReviewBase & {
  method: typeof MIXED_EVIDENCE_METHOD;
  rows: MixedRow[];
};

const nonempty = (value: unknown): value is string => typeof value === 'string' && !!value.trim();
const validSource = (source: Source) => nonempty(source?.locator) && nonempty(source.url)
  && ['https:', 'http:'].includes(new URL(source.url).protocol);
const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function blocked(reason: string, index: number): never {
  throw Error(reason + ': ingredient index ' + index);
}

export function calculateMixedEvidence(packet: MixedEvidencePacket, originalPath: string,
  readBound: (path: string) => string, registryText: string) {
  validatePointReview(packet, readBound);
  if (packet.method !== MIXED_EVIDENCE_METHOD || !Array.isArray(packet.rows)
      || packet.rows.length === 0 || packet.rows.length !== packet.ingredients.length
      || ['inputs', 'omissions', 'exclusions', 'sources', 'upperScenario', 'unroundedGk'].some(key => Object.hasOwn(packet, key))) {
    throw Error('INVALID_MIXED_EVIDENCE_PACKET');
  }
  const scopeSha256 = fingerprint({
    recipeId: packet.recipeId, originalSha256: packet.boundFiles[originalPath], servings: packet.servings,
    ingredients: packet.ingredients, preparation: packet.preparation,
  });
  const registry: { schemaVersion: number; bindings: Record<string, Binding> } = JSON.parse(registryText);
  if (registry.schemaVersion !== 1 || !registry.bindings || Array.isArray(registry.bindings)
      || typeof registry.bindings !== 'object') throw Error('INVALID_MIXED_EVIDENCE_REGISTRY');

  const seen = new Set<number>();
  const contributions = packet.rows.map(row => {
    const index = row.ingredientIndex;
    const ingredient = packet.ingredients[index];
    if (!Number.isInteger(index) || !ingredient || seen.has(index)) blocked('INVALID_MIXED_INGREDIENT_INDEX', index);
    seen.add(index);

    const binding = registry.bindings[row.bindingId];
    if (typeof row.bindingId !== 'string' || !identifier.test(row.bindingId)
        || !Object.hasOwn(registry.bindings, row.bindingId) || !binding
        || binding.scopeSha256 !== scopeSha256 || binding.ingredientIndex !== index
        || !nonempty(binding.applicability) || !nonempty(binding.approvalEvidence)) {
      blocked('UNAPPROVED_MIXED_COMPOSITION_GI_BINDING', index);
    }
    const { composition, gi } = binding;
    if (row.kind !== gi.kind || !['HUMAN_GI', 'PUBLISHED_CODING', 'B_CODING', 'UNKNOWN'].includes(gi.kind)) {
      blocked('MIXED_GI_EVIDENCE_KIND_MISMATCH', index);
    }
    const amount = composition.unit === 'g' ? ingredient.grams
      : composition.unit === 'ml' && ingredient.quantity?.unit === 'ml' ? ingredient.quantity.amount : null;
    if (amount === null || !Number.isFinite(amount) || !nonempty(composition.id) || !validSource(composition.source)
        || !Number.isFinite(composition.availablePer100) || composition.availablePer100 < 0
        || composition.availablePer100 > 100) {
      blocked('INVALID_MIXED_COMPOSITION', index);
    }
    const availableCho = amount * composition.availablePer100 / (100 * packet.servings);
    let gk: number | null = null;
    if (gi.kind === 'UNKNOWN') {
      if (availableCho > 0 && (!('omissionReason' in row) || !nonempty(row.omissionReason))) {
        blocked('UNRESOLVED_POSITIVE_MIXED_GI', index);
      }
      if (availableCho >= 1) blocked('MIXED_OMISSION_EXCEEDS_INGREDIENT_LIMIT', index);
    } else {
      if (!(availableCho > 0) || !Number.isFinite(gi.value) || gi.value <= 0 || !validSource(gi.source)) {
        blocked('INVALID_MIXED_GI', index);
      }
      gk = availableCho * gi.value / 100;
    }
    return { ingredientIndex: index, bindingId: row.bindingId, binding, availableCho, gk,
      ...('omissionReason' in row ? { omissionReason: row.omissionReason } : {}) };
  });
  const humanGk = contributions.reduce((sum, row) => sum + (row.binding.gi.kind === 'HUMAN_GI' ? row.gk! : 0), 0);
  const coded = contributions.filter(row => row.binding.gi.kind === 'PUBLISHED_CODING' || row.binding.gi.kind === 'B_CODING');
  const codedGk = coded.reduce((sum, row) => sum + row.gk!, 0);
  const codedCho = coded.reduce((sum, row) => sum + row.availableCho, 0);
  const omittedCho = contributions.reduce((sum, row) => sum + (row.gk === null ? row.availableCho : 0), 0);
  const point = humanGk + codedGk;
  if (![humanGk, codedGk, omittedCho, point].every(Number.isFinite) || humanGk <= 0 || codedGk <= 0 || omittedCho <= 0) {
    throw Error('MIXED_REQUIRES_HUMAN_GI_CODE_AND_OMISSION');
  }
  if (omittedCho >= 2) throw Error('MIXED_OMISSIONS_EXCEED_CUMULATIVE_LIMIT');
  // Both editorial screens apply to omissions only. Coding uncertainty is reported separately.
  if (omittedCho > 0.5 || omittedCho / point > 0.10) throw Error('MIXED_OMISSION_STRESS_EXCEEDS_REVIEW_SCREEN');

  const sensitivity = [0, 100, 150].map(gi => {
    const omissionDelta = omittedCho * gi / 100;
    const codedScenarioGk = codedCho * gi / 100;
    const codingDelta = codedScenarioGk - codedGk;
    const combinedDeltaGk = codingDelta + omissionDelta;
    return { name: 'ASSUMPTION_STRESS_GI_' + gi, assumedGi: gi, omissionDeltaGk: omissionDelta,
      omissionRelativeChange: omissionDelta / point, codedScenarioGk, codingDeltaGk: codingDelta,
      codingRelativeChange: codingDelta / point, combinedGk: point + combinedDeltaGk,
      combinedDeltaGk, combinedRelativeChange: combinedDeltaGk / point };
  });
  if (sensitivity.some(scenario => Object.values(scenario).some(value => typeof value === 'number' && !Number.isFinite(value)))) {
    throw Error('NONFINITE_MIXED_SENSITIVITY');
  }
  const codedShare = codedGk / point;
  const gi100 = sensitivity.find(scenario => scenario.assumedGi === 100)!;
  // Editorial review flags only. Method approval and publication remain separate.
  const reviewFlags = [
    ...(codedShare > 0.50 ? ['MIXED_CODE_DOMINANCE'] : []),
    ...(Math.abs(gi100.combinedRelativeChange) > 0.20 ? ['MIXED_LARGE_GI100_STRESS_CHANGE'] : []),
  ];
  const inputSha256 = fingerprint({ method: packet.method, scopeSha256, contributions });
  return { inputSha256, scopeSha256, contributions, point, humanGk, codedGk, codedShare, codedPercent: 100 * codedShare, omittedCho, reviewFlags,
    uncertainty: { confidence: 'LOW' as const, scenarios: sensitivity, isBiologicalBound: false, isConfidenceInterval: false } };
}
