import { basename } from 'node:path';
import { fingerprint } from './gk80-candidate-model';
import { textHash } from './gk149-model';
import { parsePointReviewVariant, type PointReviewCandidate } from './gk100-point-packet';
import { calculateMixedEvidence, mixedApprovalPath, mixedBindingsPath, mixedPolicySha256, MIXED_EVIDENCE_METHOD, type MixedEvidencePacket } from './gk100-mixed-evidence';
import type { GkOnlyVariant } from '../src/features/recipes/gk-only-types';

type ReadFile = (path: string) => string;
type Risk = 'LOW' | 'MEDIUM' | 'HIGH';
type State = 'CANDIDATE' | 'TECHNICALLY_VALID' | 'REVIEW_REQUIRED' | 'OWNER_DECISION'
  | 'READY_FOR_APPROVAL' | 'OWNER_APPROVED' | 'RELEASE_READY' | 'PUBLISHED' | 'BLOCKED';

export type Classification = {
  candidateSha256: string;
  risk: Risk;
  reasons: string[];
  contentChange: 'NONE' | 'GK_ONLY' | 'ORIGINAL_CHANGE';
  contentSummary: string;
  outcome: 'REVIEW_REQUIRED' | 'OWNER_DECISION' | 'READY_FOR_APPROVAL' | 'BLOCKED';
  review?: { depth: 'LIGHT' | 'FOCUSED' | 'DEEP'; evidence: string; inputSha256?: string };
};
export type Batch = {
  schemaVersion: 1;
  batchId: string;
  candidates: Array<{ recipeId: string; packetPath: string; classification?: Classification; studyServing?: true }>;
};

type Binding = {
  recipeId: string;
  candidateSha256: string;
  originalSha256: string;
  inputSha256: string;
};
type Candidate = Binding & {
  packetPath: string;
  originalPath: string;
  supportFiles: Record<string, string>;
  studyServing?: true;
  servings: number;
  method: 'A' | 'B' | typeof MIXED_EVIDENCE_METHOD;
  mixedEvidence?: ReturnType<typeof calculateMixedEvidence>;
  methodApproval?: 'PENDING' | 'REVIEW_ONLY';
  methodApprovalSha256?: string;
  point: number | null;
  range: GkOnlyVariant['scenarioRange'];
  uncertainty: string;
  limitation: GkOnlyVariant['limitation'];
  omittedCho: number;
  omittedChoStressGkAtGi100: number;
  suggestedRisk: Risk;
  riskSignals: string[];
  sources: GkOnlyVariant['sources'];
  localeFields: 'PRESENT';
  classification: Classification | null;
  technical: 'PASS';
  state: State;
  reason: string | null;
  ownerStatus: 'PENDING';
  publicationAuthorized: false;
};

export type Decisions = {
  schemaVersion: 1;
  manifestSha256: string;
  records: Array<Binding & { decision: 'APPROVE' | 'REJECT' | 'RETURN'; evidence: string }>;
};

const packetPathPattern = /^docs\/nutrition\/[a-z0-9-]+-release-candidate\.json$/;
const originalPathPattern = /^reseptit\/[a-z0-9-]+\/[a-z0-9-]+\.md$/;
const sha = /^[a-f0-9]{64}$/;
const id = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const evidence = (v: unknown): v is string => typeof v === 'string' && !!v.trim();
const own = <T>(items: T[], key: (item: T) => string) => new Set(items.map(key)).size === items.length;
const fail = (reason: string): never => { throw new Error(reason); };

function classify(classification: Classification | null, candidateSha256: string, suggestedRisk: Risk) {
  let state: State = 'TECHNICALLY_VALID';
  let reason: string | null = 'CLASSIFICATION_REQUIRED';
  if (classification) {
    const depth = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    const reviewed = { LIGHT: 1, FOCUSED: 2, DEEP: 3 };
    if (classification.candidateSha256 !== candidateSha256 || !Object.hasOwn(depth, classification.risk)
        || !Array.isArray(classification.reasons) || !classification.reasons.length || !classification.reasons.every(evidence)
        || !evidence(classification.contentSummary)
        || !['NONE', 'GK_ONLY', 'ORIGINAL_CHANGE'].includes(classification.contentChange)
        || !['REVIEW_REQUIRED', 'OWNER_DECISION', 'READY_FOR_APPROVAL', 'BLOCKED'].includes(classification.outcome)) {
      fail('UNKNOWN_OR_STALE_CLASSIFICATION');
    }
    if (classification.contentChange === 'ORIGINAL_CHANGE' || classification.outcome === 'BLOCKED') {
      state = 'BLOCKED';
      reason = classification.contentChange === 'ORIGINAL_CHANGE' ? 'ORIGINAL_CHANGE_OUTSIDE_GK_ONLY_SCOPE' : classification.reasons.join(' / ');
    } else if (classification.outcome === 'REVIEW_REQUIRED' || !classification.review
        || !evidence(classification.review.evidence) || !Object.hasOwn(reviewed, classification.review.depth)
        || reviewed[classification.review.depth] < Math.max(depth[classification.risk], depth[suggestedRisk])) {
      state = 'REVIEW_REQUIRED';
      reason = 'RISK_MATCHED_REVIEW_REQUIRED';
    } else {
      state = classification.outcome;
      reason = null;
    }
  }
  return { state, reason };
}

function assess(entry: Batch['candidates'][number], read: ReadFile, methodApprovalSha256?: string) {
  if (!id.test(entry.recipeId) || !packetPathPattern.test(entry.packetPath)) fail('INVALID_CANDIDATE_PATH_OR_ID');
  const raw = read(entry.packetPath);
  const packet: PointReviewCandidate | MixedEvidencePacket = JSON.parse(raw);
  const candidateSha256 = textHash(raw);
  if (packet.recipeId !== entry.recipeId) fail('PACKET_RECIPE_ID_MISMATCH');
  const originals = Object.keys(packet.boundFiles).filter(path => originalPathPattern.test(path));
  if (originals.length !== 1 || basename(originals[0], '.md') !== packet.recipeId) fail('ORIGINAL_RECIPE_BINDING');
  const originalPath = originals[0];
  const readBound = (path: string) => {
    if (!originalPathPattern.test(path) && !/^docs\/nutrition\/[a-z0-9-]+\.md$/.test(path)) fail('INVALID_BOUND_PATH');
    return read(path);
  };
  if (entry.studyServing !== undefined && entry.studyServing !== true) fail('INVALID_STUDY_SERVING');
  if (packet.method !== undefined) {
    if (entry.studyServing) fail('INVALID_STUDY_SERVING');
    if (packet.method !== MIXED_EVIDENCE_METHOD) return fail('UNKNOWN_GK_METHOD');
    const mixedEvidence = calculateMixedEvidence(packet, originalPath, readBound, read(mixedBindingsPath));
    const classification = entry.classification ?? null;
    const classificationResult = classify(classification, candidateSha256, 'HIGH');
    let { state, reason } = classificationResult;
    if (state !== 'BLOCKED') {
      if (!methodApprovalSha256) {
        state = 'REVIEW_REQUIRED';
        reason = 'MIXED_EVIDENCE_METHOD_APPROVAL_REQUIRED';
      } else if (mixedEvidence.reviewFlags.length > 0) {
        state = 'REVIEW_REQUIRED';
        reason = 'MIXED_EVIDENCE_SPECIAL_REVIEW_REQUIRED';
      } else if (classification?.review?.inputSha256 !== mixedEvidence.inputSha256) {
        state = 'REVIEW_REQUIRED';
        reason = 'MIXED_EVIDENCE_INPUT_REVIEW_REQUIRED';
      }
    }

    // This lane produces a normal review manifest without a release variant.
    const row: Candidate = {
      recipeId: packet.recipeId, packetPath: entry.packetPath, originalPath,
      supportFiles: Object.fromEntries(Object.entries(packet.boundFiles).filter(([path]) => path !== originalPath)),
      candidateSha256, originalSha256: packet.boundFiles[originalPath], inputSha256: mixedEvidence.inputSha256,
      servings: packet.servings, method: MIXED_EVIDENCE_METHOD, mixedEvidence,
      methodApproval: methodApprovalSha256 ? 'REVIEW_ONLY' : 'PENDING',
      ...(methodApprovalSha256 && { methodApprovalSha256 }),
      point: mixedEvidence.point, range: null, uncertainty: 'MIXED_ASSUMPTION_STRESS', limitation: packet.limitation,
      omittedCho: mixedEvidence.omittedCho, omittedChoStressGkAtGi100: mixedEvidence.omittedCho,
      suggestedRisk: 'HIGH', riskSignals: [...(mixedEvidence.omittedCho > 0 ? ['CHO_OMITTED'] : []), 'ASSIGNED_GI', ...mixedEvidence.reviewFlags],
      sources: mixedEvidence.contributions.flatMap(({ binding }) => {
        const { composition, gi, applicability } = binding;
        const carbohydrate = { kind: 'CARBOHYDRATE' as const, title: composition.source.locator,
          url: composition.source.url, note: applicability };
        if (gi.kind === 'UNKNOWN') return [carbohydrate];
        return [carbohydrate, { kind: gi.kind, title: gi.source.locator, url: gi.source.url, note: applicability }];
      }),
      localeFields: 'PRESENT', classification, technical: 'PASS',
      state, reason, ownerStatus: 'PENDING', publicationAuthorized: false,
    };
    return { row, variant: undefined };
  }
  const variant = parsePointReviewVariant(raw, readBound);
  if (entry.studyServing) {
    if (variant.servings !== 1 || variant.omittedCho !== 0 || variant.scenarioRange || !variant.limitation) {
      fail('INVALID_STUDY_SERVING');
    }
    variant.studyServing = true;
  }
  const kinds = ['CARBOHYDRATE', 'HUMAN_GI', 'PUBLISHED_CODING', 'B_CODING', 'BOUND'];
  if (!variant.sources.some(source => source.kind === 'HUMAN_GI')
      || !variant.sources.some(source => source.kind === 'CARBOHYDRATE')
      || !variant.sources.every(source => kinds.includes(source.kind) && evidence(source.title)
        && evidence(source.note) && ['https:', 'http:'].includes(new URL(source.url).protocol))) {
    fail('INVALID_SOURCE_RECORD');
  }
  const inputSha256 = fingerprint({
    servings: packet.servings, inputs: packet.inputs, omissions: packet.omissions ?? [],
    upperScenario: packet.upperScenario ?? null, ...(packet.exclusions && { exclusions: packet.exclusions }),
    ingredients: packet.ingredients, sources: packet.sources,
  });
  // GI 100 is an editorial stress case, not a bound on biological response.
  const riskSignals = [
    ...(variant.scenarioRange ? ['NAMED_SCENARIO_RANGE'] : []),
    ...(variant.omittedCho > 0 ? ['CHO_OMITTED'] : []),
    ...(variant.sources.some(source => source.kind === 'PUBLISHED_CODING' || source.kind === 'B_CODING')
      ? ['ASSIGNED_GI'] : []),
  ];
  const suggestedRisk = variant.omittedCho >= 1 ? 'HIGH' : riskSignals.length ? 'MEDIUM' : 'LOW';
  const classification = entry.classification ?? null;
  const { state, reason } = classify(classification, candidateSha256, suggestedRisk);
  const row: Candidate = {
    recipeId: packet.recipeId, packetPath: entry.packetPath, originalPath,
    supportFiles: Object.fromEntries(Object.entries(packet.boundFiles).filter(([file]) => file !== originalPath)),
    candidateSha256, originalSha256: packet.boundFiles[originalPath], inputSha256,
    servings: variant.servings, method: variant.level, point: variant.point, range: variant.scenarioRange,
    ...(variant.studyServing && { studyServing: true as const }),
    uncertainty: variant.scenarioRange ? 'NAMED_SCENARIOS' : 'LOW_CONFIDENCE_POINT',
    limitation: variant.limitation, omittedCho: variant.omittedCho, sources: variant.sources,
    omittedChoStressGkAtGi100: variant.omittedCho, suggestedRisk, riskSignals,
    localeFields: 'PRESENT', classification, technical: 'PASS', state, reason, ownerStatus: 'PENDING',
    publicationAuthorized: false,
  };
  return { row, variant };
}

export function checkBatch(batch: Batch, read: ReadFile) {
  return evaluateBatch(batch, read);
}

export function checkMixedReviewBatch(batch: Batch, read: ReadFile, readMain: ReadFile) {
  let raw: string;
  try { raw = readMain(mixedApprovalPath); }
  catch { return fail('MIXED_EVIDENCE_METHOD_APPROVAL_REQUIRED'); }
  const approval = JSON.parse(raw);
  if (approval?.schemaVersion !== 1 || approval.decision !== 'APPROVE_REVIEW_ONLY'
      || approval.policySha256 !== mixedPolicySha256 || !evidence(approval.evidence)) {
    return fail('INVALID_OR_STALE_MIXED_EVIDENCE_METHOD_APPROVAL');
  }
  return evaluateBatch(batch, read, fingerprint(approval));
}

function evaluateBatch(batch: Batch, read: ReadFile, methodApprovalSha256?: string) {
  if (batch.schemaVersion !== 1 || !id.test(batch.batchId) || !Array.isArray(batch.candidates)
      || batch.candidates.length < 1 || batch.candidates.length > 30) fail('INVALID_BATCH_SCOPE');
  const counts = new Map<string, number>();
  for (const entry of batch.candidates) counts.set(entry.recipeId, (counts.get(entry.recipeId) ?? 0) + 1);
  const variants = new Map<string, GkOnlyVariant>();
  const candidates = batch.candidates.map(entry => {
    try {
      if (counts.get(entry.recipeId)! > 1) fail('DUPLICATE_RECIPE_ID');
      const { row, variant } = assess(entry, read, methodApprovalSha256);
      if (variant) variants.set(entry.recipeId, variant);
      return row;
    } catch (error) {
      return { recipeId: entry.recipeId, packetPath: entry.packetPath, technical: 'FAIL' as const,
        state: 'BLOCKED' as const, reason: error instanceof Error ? error.message : String(error),
        ownerStatus: 'PENDING' as const, publicationAuthorized: false as const };
    }
  });
  const manifest = { schemaVersion: 1 as const, batchId: batch.batchId, candidates };
  return { manifest: { ...manifest, manifestSha256: fingerprint(manifest) }, variants };
}

type Checked = ReturnType<typeof checkBatch>;
export function applyDecisions(checked: Checked, decisions: Decisions) {
  if (decisions.schemaVersion !== 1 || decisions.manifestSha256 !== checked.manifest.manifestSha256
      || !Array.isArray(decisions.records) || !own(decisions.records, record => record.recipeId)) fail('INVALID_OR_STALE_DECISIONS');
  const records = new Map(decisions.records.map(record => [record.recipeId, record]));
  for (const record of records.values()) {
    if (!checked.manifest.candidates.some(row => row.recipeId === record.recipeId)
        || !['APPROVE', 'REJECT', 'RETURN'].includes(record.decision) || !evidence(record.evidence)) fail('INVALID_DECISION_RECORD');
  }
  return checked.manifest.candidates.map(row => {
    if (row.technical !== 'PASS' || !['OWNER_DECISION', 'READY_FOR_APPROVAL'].includes(row.state)) return row;
    const record = records.get(row.recipeId);
    if (!record) return row;
    if (record.candidateSha256 !== row.candidateSha256 || record.originalSha256 !== row.originalSha256
        || record.inputSha256 !== row.inputSha256) return { ...row, state: 'BLOCKED' as const, reason: 'STALE_OR_WRONG_DECISION_BINDING' };
    if (record.decision === 'APPROVE') return { ...row, state: 'OWNER_APPROVED' as const, ownerStatus: 'APPROVED' as const };
    return { ...row, state: record.decision === 'REJECT' ? 'BLOCKED' as const : 'REVIEW_REQUIRED' as const,
      reason: record.decision === 'REJECT' ? 'OWNER_REJECTED' : 'OWNER_RETURNED', ownerStatus: record.decision };
  });
}

export type MainCoverage = { schemaVersion: 1; mainSha: string; numericRecipeIds: string[] };
export function prepareRelease(checked: Checked, decisions: Decisions, coverage: MainCoverage,
  currentMain: string, readMain: ReadFile) {
  if (coverage.schemaVersion !== 1 || !/^[a-f0-9]{40}$/.test(currentMain) || coverage.mainSha !== currentMain
      || !Array.isArray(coverage.numericRecipeIds) || !coverage.numericRecipeIds.every(recipeId => id.test(recipeId))
      || !own(coverage.numericRecipeIds, recipeId => recipeId)) fail('INVALID_OR_STALE_MAIN_COVERAGE');
  const existing = new Set(coverage.numericRecipeIds);
  const selected: GkOnlyVariant[] = [];
  const rows = applyDecisions(checked, decisions).map(row => {
    if (row.state !== 'OWNER_APPROVED' || row.technical !== 'PASS') return row;
    try {
      const variant = checked.variants.get(row.recipeId);
      if (!variant) return fail('NO_RELEASE_VARIANT_FOR_REVIEW_ONLY_METHOD');
      if (!sha.test(row.originalSha256) || textHash(readMain(row.originalPath)) !== row.originalSha256) fail('MAIN_ORIGINAL_CHANGED');
      if (existing.has(row.recipeId)) fail('MAIN_ALREADY_HAS_NUMERIC_GK');
      for (const [file, expected] of Object.entries({ ...row.supportFiles, [row.packetPath]: row.candidateSha256 })) {
        let existingText: string | undefined;
        try { existingText = readMain(file); } catch { /* A new evidence file can be added to the release PR. */ }
        if (existingText !== undefined && textHash(existingText) !== expected) fail('MAIN_EVIDENCE_PATH_CONFLICT: ' + file);
      }
      selected.push(variant);
      return { ...row, state: 'RELEASE_READY' as const };
    } catch (error) {
      return { ...row, state: 'BLOCKED' as const, reason: error instanceof Error ? error.message : String(error) };
    }
  });
  return { schemaVersion: 1, mainSha: currentMain, manifestSha256: checked.manifest.manifestSha256,
    decisionsSha256: fingerprint(decisions), expectedCoverageDelta: selected.length,
    publicationAuthorized: false, variants: selected, rows,
    files: rows.flatMap(row => row.technical === 'PASS' && row.state === 'RELEASE_READY'
      ? [{ path: row.packetPath, sha256: row.candidateSha256 },
        ...Object.entries(row.supportFiles).map(([path, sha256]) => ({ path, sha256 }))] : []),
  };
}
