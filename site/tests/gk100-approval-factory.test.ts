import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fingerprint } from '../scripts/gk80-candidate-model';
import { mixedApprovalPath, mixedBindingsPath, mixedPolicySha256, MIXED_EVIDENCE_METHOD, type MixedEvidencePacket } from '../scripts/gk100-mixed-evidence';
import { parsePointReviewVariant, type PointReviewCandidate } from '../scripts/gk100-point-packet';
import { textHash } from '../scripts/gk149-model';
import { applyDecisions, checkBatch, checkMixedReviewBatch, prepareRelease, type Batch, type Classification, type Decisions } from '../scripts/gk100-approval-factory';
import { makeReleaseBundle, verifyReleaseBundle } from '../scripts/gk100-approval-release';

const base = '1'.repeat(40);
const original = 'original recipe';
const note = 'reviewed calculation note';
const locale = { fi: 'fi', en: 'en', sv: 'sv', th: 'th' };

function fixture(size = 2) {
  const files = new Map<string, string>();
  const batch: Batch = { schemaVersion: 1, batchId: 'test-batch', candidates: [] };
  for (let index = 0; index < size; index++) {
    const recipeId = 'fixture-' + index;
    const packetPath = 'docs/nutrition/' + recipeId + '-release-candidate.json';
    const originalPath = 'reseptit/paaruoat/' + recipeId + '.md';
    const evidencePath = 'docs/nutrition/' + recipeId + '.md';
    files.set(originalPath, original);
    files.set(evidencePath, note);
    const packet = {
      recipeId, servings: 2, reviewState: 'PREPARED_FOR_REVIEW', publicationAuthorized: false,
      boundFiles: { [originalPath]: textHash(original), [evidencePath]: textHash(note) },
      preparation: locale, limitation: locale, unroundedGk: '5',
      inputs: [[100, 20, 50]], ingredients: [{ name: locale, grams: 100 }],
      sources: ['HUMAN_GI', 'CARBOHYDRATE'].map(kind => ({
        kind, title: 'Fixture source', url: 'https://example.invalid/', note: 'Fixture only',
      })),
    };
    const raw = JSON.stringify(packet);
    files.set(packetPath, raw);
    batch.candidates.push({ recipeId, packetPath, classification: {
      candidateSha256: textHash(raw), risk: 'LOW', reasons: ['fixture'],
      contentChange: 'GK_ONLY', contentSummary: 'Fixture GK version', outcome: 'READY_FOR_APPROVAL',
      review: { depth: 'LIGHT', evidence: 'fixture review' },
    } });
  }
  const read = (file: string) => {
    const value = files.get(file);
    if (value === undefined) throw Error('Missing fixture ' + file);
    return value;
  };
  return { batch, files, read };
}

const coverage = { schemaVersion: 1 as const, mainSha: base, numericRecipeIds: [] };
function approve(checked: ReturnType<typeof checkBatch>, recipeId: string): Decisions {
  const row = checked.manifest.candidates.find(candidate => candidate.recipeId === recipeId);
  assert(row?.technical === 'PASS');
  const { candidateSha256, originalSha256, inputSha256 } = row;
  return { schemaVersion: 1, manifestSha256: checked.manifest.manifestSha256, records: [
    { recipeId, candidateSha256, originalSha256, inputSha256, decision: 'APPROVE', evidence: 'fixture approval' },
  ] };
}

test('25 recipes are handled independently, with explicit approval and no publication inference', () => {
  const { batch, files, read } = fixture(25);
  files.delete(batch.candidates[24].packetPath);
  const checked = checkBatch(batch, read);
  assert.equal(checked.manifest.candidates.filter(row => row.state === 'READY_FOR_APPROVAL').length, 24);
  const decisions = approve(checked, 'fixture-0');
  const plan = prepareRelease(checked, decisions, coverage, base, read);
  assert.deepEqual(plan.variants.map(variant => variant.recipeId), ['fixture-0']);
  assert.equal(plan.expectedCoverageDelta, 1);
  assert.equal(plan.rows[24].state, 'BLOCKED');
  assert.equal(plan.rows[1].state, 'READY_FOR_APPROVAL');
  assert(!plan.rows.some(row => row.state === 'PUBLISHED'));
  const bundle = makeReleaseBundle(checked, batch, decisions, plan);
  assert.throws(() => verifyReleaseBundle(bundle, { schemaVersion: 1, bundleSha256: '', evidence: '' }, read),
    /GK100_RELEASE_AUTHORIZATION/);
  assert.deepEqual(verifyReleaseBundle(bundle, {
    schemaVersion: 1, bundleSha256: bundle.bundleSha256, evidence: 'fixture authorization',
  }, read), plan.variants);
});

test('different recipe, candidate revision or original invalidates the approval', () => {
  const { batch, files, read } = fixture();
  const checked = checkBatch(batch, read);
  const decision = approve(checked, 'fixture-0');
  const borrowed = { ...decision, records: [{ ...decision.records[0], recipeId: 'fixture-1' }] };
  assert.equal(applyDecisions(checked, borrowed)[1].reason, 'STALE_OR_WRONG_DECISION_BINDING');
  const path = batch.candidates[0].packetPath;
  files.set(path, read(path) + '\n');
  const changed = checkBatch(batch, read);
  assert.throws(() => applyDecisions(changed, decision), /INVALID_OR_STALE_DECISIONS/);
  files.set(path, read(path).trimEnd());
  const incompatible = (file: string) => file.endsWith('fixture-0.md') ? 'changed' : read(file);
  assert.equal(prepareRelease(checked, decision, coverage, base, incompatible).rows[0].reason, 'MAIN_ORIGINAL_CHANGED');
});

test('unreviewed high risk, original content changes and unknown classifier outcomes fail closed', () => {
  const { batch, read } = fixture(3);
  batch.candidates[0].classification!.risk = 'HIGH';
  batch.candidates[1].classification!.contentChange = 'ORIGINAL_CHANGE';
  Object.assign(batch.candidates[2].classification!, { outcome: 'UNKNOWN' });
  assert.deepEqual(checkBatch(batch, read).manifest.candidates.map(row => row.state),
    ['REVIEW_REQUIRED', 'BLOCKED', 'BLOCKED']);
});

test('existing numeric coverage and duplicate recipe IDs are excluded', () => {
  const { batch, read } = fixture(3);
  batch.candidates[2] = batch.candidates[1];
  const checked = checkBatch(batch, read);
  const plan = prepareRelease(checked, approve(checked, 'fixture-0'),
    { ...coverage, numericRecipeIds: ['fixture-0'] }, base, read);
  assert.equal(plan.expectedCoverageDelta, 0);
  assert.deepEqual(plan.rows.map(row => row.reason), [
    'MAIN_ALREADY_HAS_NUMERIC_GK', 'DUPLICATE_RECIPE_ID', 'DUPLICATE_RECIPE_ID',
  ]);
});

test('an ingredient absent from the calculation and accounting blocks only its recipe', () => {
  const { batch, files, read } = fixture();
  const entry = batch.candidates[0];
  const packet = JSON.parse(read(entry.packetPath));
  packet.ingredients.push({ name: { ...locale, en: 'Sugar' }, grams: 500 });
  const raw = JSON.stringify(packet);
  files.set(entry.packetPath, raw);
  entry.classification!.candidateSha256 = textHash(raw);

  const checked = checkBatch(batch, read);
  assert.match(checked.manifest.candidates[0].reason!, /UNACCOUNTED_GK_INGREDIENT: fixture-0 index 1/);
  assert.equal(checked.manifest.candidates[0].state, 'BLOCKED');
  const plan = prepareRelease(checked, approve(checked, 'fixture-1'), coverage, base, read);
  assert.deepEqual(plan.variants.map(variant => variant.recipeId), ['fixture-1']);
});

test('an explicit exclusion requires a bound calculation note and cannot overlap another row', () => {
  const { batch, files, read } = fixture(1);
  const entry = batch.candidates[0];
  const packet = JSON.parse(read(entry.packetPath));
  packet.ingredients.push({ name: { ...locale, en: 'Water' }, grams: 100 });
  packet.exclusions = [{ ingredientIndex: 1, kind: 'ZERO_CHO', rationale: 'Plain water', evidencePath: 'docs/nutrition/fixture-0.md' }];
  const check = () => {
    const raw = JSON.stringify(packet);
    files.set(entry.packetPath, raw);
    entry.classification!.candidateSha256 = textHash(raw);
    return checkBatch(batch, read).manifest.candidates[0];
  };
  assert.equal(check().state, 'READY_FOR_APPROVAL');
  packet.exclusions[0].evidencePath = 'docs/nutrition/unbound.md';
  assert.match(check().reason!, /Invalid GK ingredient exclusion/);
  packet.exclusions[0].evidencePath = 'docs/nutrition/fixture-0.md';
  packet.omissions = [{ ingredientIndex: 1, choPer100g: 0.5 }];
  assert.match(check().reason!, /duplicate GK ingredient accounting/);
});


test('published ingredients contain display fields only', () => {
  const { batch, files, read } = fixture(1);
  const entry = batch.candidates[0];
  const packet = JSON.parse(read(entry.packetPath));
  Object.assign(packet.ingredients[0], { choPer100g: 20, gi: 50, composition: { id: 'evidence' } });
  const raw = JSON.stringify(packet);
  files.set(entry.packetPath, raw);
  entry.classification!.candidateSha256 = textHash(raw);

  const checked = checkBatch(batch, read);
  assert.equal(checked.manifest.candidates[0].state, 'READY_FOR_APPROVAL');
  assert.deepEqual(checked.variants.get(entry.recipeId)?.ingredients, [{ name: locale, grams: 100 }]);
});

test('legacy A and B retain their existing accounting and source gate', () => {
  const { batch, read, files } = fixture(1);
  const entry = batch.candidates[0];
  const packet = JSON.parse(read(entry.packetPath));
  delete entry.classification;
  const check = () => {
    files.set(entry.packetPath, JSON.stringify(packet));
    return checkBatch(batch, read).manifest.candidates[0];
  };
  let row = check();
  assert(row.technical === 'PASS');
  assert.equal(row.method, 'B');
  assert.equal(row.point, 5);
  packet.ingredients.push({ name: locale, grams: 100 });
  packet.omissions = [{ ingredientIndex: 1, choPer100g: 0.5 }];
  row = check();
  assert(row.technical === 'PASS');
  assert.equal(row.method, 'A');
  assert.equal(row.omittedCho, 0.25);
  packet.sources.push({ ...packet.sources[0], kind: 'B_CODING' });
  assert.match(check().reason!, /B-only GI coding cannot be combined with A-method omissions/);
  packet.ingredients.pop();
  delete packet.omissions;
  row = check();
  assert(row.technical === 'PASS');
  assert.equal(row.method, 'B');
});

function mixedFixture() {
  const { batch, read, files } = fixture(1);
  const entry = batch.candidates[0];
  const { recipeId, servings, boundFiles, preparation, limitation } = JSON.parse(read(entry.packetPath));
  const packet: MixedEvidencePacket = {
    recipeId, servings, boundFiles, preparation, limitation, method: MIXED_EVIDENCE_METHOD,
    reviewState: 'PREPARED_FOR_REVIEW', publicationAuthorized: false,
    ingredients: [{ name: locale, grams: 100 }, { name: locale, grams: 100 },
      { name: locale, grams: null, quantity: { unit: 'ml', amount: 100 } }],
    rows: [
      { ingredientIndex: 0, bindingId: 'human', kind: 'HUMAN_GI' },
      { ingredientIndex: 1, bindingId: 'coded', kind: 'B_CODING' },
      { ingredientIndex: 2, bindingId: 'omit', kind: 'UNKNOWN', omissionReason: 'Small measured CHO, GI unresolved' },
    ],
  };
  const scopeSha256 = fingerprint({
    recipeId, originalSha256: boundFiles['reseptit/paaruoat/' + recipeId + '.md'],
    servings, ingredients: packet.ingredients, preparation,
  });
  const source = { url: 'https://example.invalid/', locator: 'Synthetic test data' };
  const common = { scopeSha256, applicability: 'Synthetic matching preparation', approvalEvidence: 'Test fixture only' };
  const bindings = {
    human: { ...common, ingredientIndex: 0,
      composition: { id: 'main', unit: 'g', availablePer100: 20, source },
      gi: { kind: 'HUMAN_GI', value: 120, source } },
    coded: { ...common, ingredientIndex: 1,
      composition: { id: 'coded-food', unit: 'g', availablePer100: 2, source },
      gi: { kind: 'B_CODING', value: 50, source } },
    omit: { ...common, ingredientIndex: 2,
      composition: { id: 'broth', unit: 'ml', availablePer100: 0.4, source }, gi: { kind: 'UNKNOWN' } },
  };
  const check = () => {
    files.set(mixedBindingsPath, JSON.stringify({ schemaVersion: 1, bindings }));
    const raw = JSON.stringify(packet);
    files.set(entry.packetPath, raw);
    Object.assign(entry.classification!, { candidateSha256: textHash(raw), risk: 'HIGH',
      review: { depth: 'DEEP', evidence: 'Fixture review' } });
    return checkBatch(batch, read);
  };
  return { batch, read, files, check, packet, bindings };
}

test('Mixed Evidence keeps measured GI above 100, codes and omissions separate', () => {
  const { check, bindings, packet } = mixedFixture();
  for (const kind of ['B_CODING', 'PUBLISHED_CODING'] as const) {
    bindings.coded.gi.kind = kind;
    packet.rows[1].kind = kind;
    const { manifest, variants } = check();
    const [row] = manifest.candidates;
    assert(row.technical === 'PASS' && row.mixedEvidence);
    assert.equal(row.method, MIXED_EVIDENCE_METHOD);
    assert.equal(row.state, 'REVIEW_REQUIRED');
    assert.equal(row.methodApproval, 'PENDING');
    assert.equal(row.point, 12.5);
    assert.equal(row.mixedEvidence.humanGk, 12);
    assert.equal(row.mixedEvidence.codedGk, 0.5);
    assert.equal(row.mixedEvidence.codedShare, 0.04);
    assert.equal(row.mixedEvidence.codedPercent, 4);
    assert.deepEqual(row.mixedEvidence.reviewFlags, []);
    assert.equal(row.omittedCho, 0.2);
    assert.equal(row.range, null);
    assert.equal(row.sources.find(source => source.kind === kind)?.note, bindings.coded.applicability);
    const { scenarios, isBiologicalBound, isConfidenceInterval } = row.mixedEvidence.uncertainty;
    assert.equal(isBiologicalBound, false);
    assert.equal(isConfidenceInterval, false);
    assert.deepEqual(scenarios.map(scenario => scenario.assumedGi), [0, 100, 150]);
    assert.deepEqual(scenarios.map(scenario => scenario.codedScenarioGk), [0, 1, 1.5]);
    assert.deepEqual(scenarios.map(scenario => scenario.omissionDeltaGk), [0, 0.2, 0.3]);
    assert.equal(scenarios[1].omissionRelativeChange, 0.016);
    assert.equal(scenarios[1].codingDeltaGk, 0.5);
    assert.equal(variants.size, 0);
  }
});

test('Mixed Evidence flags dominant coding and large combined stress independently', () => {
  const { batch, bindings, check, read } = mixedFixture();
  const inspect = () => {
    const checked = check();
    const row = checked.manifest.candidates[0];
    assert(row.technical === 'PASS' && row.mixedEvidence);
    assert.equal(row.state, 'REVIEW_REQUIRED');
    assert.equal(checked.variants.size, 0);
    return row;
  };
  bindings.human.composition.availablePer100 = 1;
  bindings.human.gi.value = 100;
  bindings.coded.composition.availablePer100 = 20;
  let row = inspect();
  assert.equal(row.point, 5.5);
  assert.equal(row.mixedEvidence!.codedShare, 5 / 5.5);
  assert.deepEqual(row.mixedEvidence!.uncertainty.scenarios.map(s => s.combinedGk), [0.5, 10.7, 15.8]);
  assert.equal(row.mixedEvidence!.uncertainty.scenarios[1].combinedRelativeChange, 5.2 / 5.5);
  assert.deepEqual(row.riskSignals.slice(-2), ['MIXED_CODE_DOMINANCE', 'MIXED_LARGE_GI100_STRESS_CHANGE']);
  batch.candidates[0].classification!.review!.inputSha256 = row.inputSha256;
  const approval = { schemaVersion: 1, decision: 'APPROVE_REVIEW_ONLY', policySha256: mixedPolicySha256, evidence: 'Fixture only' };
  assert.equal(checkMixedReviewBatch(batch, read, () => JSON.stringify(approval)).manifest.candidates[0].reason,
    'MIXED_EVIDENCE_SPECIAL_REVIEW_REQUIRED');

  // High code share with a code whose GI 100 stress has little effect.
  bindings.coded.gi.value = 100;
  assert.deepEqual(inspect().mixedEvidence!.reviewFlags, ['MIXED_CODE_DOMINANCE']);
  // Half of the point comes from the code, but the stress change exceeds 20%.
  bindings.human.composition.availablePer100 = 10;
  bindings.coded.gi.value = 50;
  row = inspect();
  assert.equal(row.mixedEvidence!.codedShare, 0.5);
  assert.deepEqual(row.mixedEvidence!.reviewFlags, ['MIXED_LARGE_GI100_STRESS_CHANGE']);

  bindings.human.composition.availablePer100 = 8.4;
  bindings.coded.composition.availablePer100 = 3.2;
  row = inspect();
  assert.equal(row.mixedEvidence!.uncertainty.scenarios[1].combinedRelativeChange, 0.2);
  assert.deepEqual(row.mixedEvidence!.reviewFlags, []);
});

test('Mixed Evidence blocks unknown GI, missing approval and reclassified coding', () => {
  const { packet, bindings, check } = mixedFixture();
  const row = () => check().manifest.candidates[0];
  packet.rows[2] = { ingredientIndex: 2, bindingId: 'omit', kind: 'UNKNOWN' };
  assert.equal(row().state, 'BLOCKED');
  assert.match(row().reason!, /UNRESOLVED_POSITIVE_MIXED_GI/);
  packet.rows[2] = { ...packet.rows[2], omissionReason: 'Documented' };
  packet.rows[1].bindingId = 'unapproved-composition';
  assert.match(row().reason!, /UNAPPROVED_MIXED_COMPOSITION_GI_BINDING/);
  packet.rows[1].bindingId = 'coded';
  packet.rows[1].kind = 'HUMAN_GI';
  assert.match(row().reason!, /MIXED_GI_EVIDENCE_KIND_MISMATCH/);
  packet.rows[1].kind = 'B_CODING';
  bindings.coded.scopeSha256 = '0'.repeat(64);
  assert.match(row().reason!, /UNAPPROVED_MIXED_COMPOSITION_GI_BINDING/);
});

test('Mixed Evidence checks individual, cumulative and absolute or relative omission limits', () => {
  const { packet, bindings, check } = mixedFixture();
  const reason = () => check().manifest.candidates[0].reason!;
  bindings.omit.composition.availablePer100 = 2;
  assert.match(reason(), /MIXED_OMISSION_EXCEEDS_INGREDIENT_LIMIT/);
  bindings.omit.composition.availablePer100 = 1.2;
  assert.match(reason(), /MIXED_OMISSION_STRESS_EXCEEDS_REVIEW_SCREEN/);
  bindings.omit.composition.availablePer100 = 0.4;
  bindings.human.composition.availablePer100 = 2;
  assert.match(reason(), /MIXED_OMISSION_STRESS_EXCEEDS_REVIEW_SCREEN/);

  for (let index = 3; index <= 4; index++) {
    packet.ingredients.push(packet.ingredients[2]);
    packet.rows.push({ ingredientIndex: index, bindingId: 'extra-' + index, kind: 'UNKNOWN', omissionReason: 'Documented' });
  }
  const scopeSha256 = fingerprint({ recipeId: packet.recipeId,
    originalSha256: packet.boundFiles['reseptit/paaruoat/fixture-0.md'], servings: packet.servings,
    ingredients: packet.ingredients, preparation: packet.preparation });
  for (const binding of Object.values(bindings)) binding.scopeSha256 = scopeSha256;
  bindings.omit.composition.availablePer100 = 1.6;
  Object.assign(bindings, {
    'extra-3': { ...bindings.omit, ingredientIndex: 3 },
    'extra-4': { ...bindings.omit, ingredientIndex: 4 },
  });
  assert.match(reason(), /MIXED_OMISSIONS_EXCEED_CUMULATIVE_LIMIT/);
});

test('Mixed Evidence binds both source input and original and cannot enter either release path', () => {
  const { batch, packet, bindings, check, files, read } = mixedFixture();
  const checked = check();
  const decisions = approve(checked, 'fixture-0');
  assert.equal(applyDecisions(checked, decisions)[0].state, 'REVIEW_REQUIRED');
  const plan = prepareRelease(checked, decisions, coverage, base, read);
  assert.equal(plan.expectedCoverageDelta, 0);
  const bundle = makeReleaseBundle(checked, batch, decisions, plan);
  assert.throws(() => verifyReleaseBundle(bundle, { schemaVersion: 1, bundleSha256: '', evidence: '' }, read),
    /GK100_RELEASE_AUTHORIZATION/);
  const { bundleSha256: _, ...body } = bundle;
  const forgedBody = { ...body, recipeIds: [packet.recipeId], expectedCoverageDelta: 1 };
  const forged = { ...forgedBody, bundleSha256: fingerprint(forgedBody) };
  assert.throws(() => verifyReleaseBundle(forged, {
    schemaVersion: 1, bundleSha256: forged.bundleSha256, evidence: 'Fixture publication authorization',
  }, read), /GK100_RELEASE_OWNER_APPROVAL/);

  bindings.coded.gi.value = 45;
  assert.throws(() => applyDecisions(check(), decisions), /INVALID_OR_STALE_DECISIONS/);
  files.set('reseptit/paaruoat/fixture-0.md', 'altered original');
  assert.match(check().manifest.candidates[0].reason!, /GK point binding changed/);
  assert.throws(() => parsePointReviewVariant(read(batch.candidates[0].packetPath), read), /Invalid GK point review/);
});

test('the Lontong quantities fail even if its rice and tofu are treated as bound', () => {
  const { packet, bindings, check } = mixedFixture();
  bindings.human.composition.availablePer100 = 31.6;
  bindings.human.gi.value = 89;
  bindings.coded.composition.availablePer100 = 1.8;
  // Isolate each unresolved row with the rice and tofu retained.
  for (const availableCho of [3.40, 4.97, 0.70]) {
    bindings.omit.composition.availablePer100 = 2 * availableCho;
    packet.rows[2] = { ingredientIndex: 2, bindingId: 'omit', kind: 'UNKNOWN' };
    assert.match(check().manifest.candidates[0].reason!, /UNRESOLVED_POSITIVE_MIXED_GI/);
    packet.rows[2] = { ...packet.rows[2], omissionReason: 'Stress-test the omission route' };
    assert.match(check().manifest.candidates[0].reason!,
      availableCho >= 1 ? /MIXED_OMISSION_EXCEEDS_INGREDIENT_LIMIT/ : /MIXED_OMISSION_STRESS_EXCEEDS_REVIEW_SCREEN/);
  }
});

test('the sealed Okayu version passes review with zero omissions and an exact method decision', () => {
  const packetPath = 'docs/nutrition/gk80-operation80-okayu-release-candidate.json';
  const readRepo = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
  const legacyRaw = readRepo(packetPath);
  // Reuse the exact version and sources reviewed for PR #240. The registry
  // below exists only in this test, never in the Factory's live registry.
  assert.equal(textHash(legacyRaw), '7cb7dcc89d49a7b869197100bd7a4611c6666f3878bdb5528cae8be906484a7b');
  const { recipeId, servings, boundFiles, preparation, limitation, ingredients, reviewState, publicationAuthorized,
    inputs, sources } = JSON.parse(legacyRaw) as PointReviewCandidate;
  const originalPath = 'reseptit/aamupalat/' + recipeId + '.md';
  const scopeSha256 = fingerprint({ recipeId, originalSha256: boundFiles[originalPath], servings, ingredients, preparation });
  const source = ({ url, title }: typeof sources[number]) => ({ url, locator: title });
  const rows: MixedEvidencePacket['rows'] = [
    { ingredientIndex: 0, bindingId: 'rice', kind: 'HUMAN_GI' },
    { ingredientIndex: 1, bindingId: 'umeboshi', kind: 'B_CODING' },
    { ingredientIndex: 2, bindingId: 'sesame', kind: 'B_CODING' },
    { ingredientIndex: 3, bindingId: 'spring-onion', kind: 'B_CODING' },
    { ingredientIndex: 4, bindingId: 'water', kind: 'UNKNOWN' },
  ];
  const bindings = Object.fromEntries(rows.map(({ ingredientIndex, bindingId, kind }) => {
    const input = inputs[ingredientIndex];
    return [bindingId, {
      scopeSha256, ingredientIndex,
      composition: { id: bindingId, unit: input ? 'g' : 'ml', availablePer100: input?.[1] ?? 0,
        source: input ? source(sources[ingredientIndex + 1])
          : { url: 'https://github.com/ozirix-dev/Reseptit/blob/3cb570f53ae5506831efc9ff9e9a0f6f8de19705/docs/nutrition/gk80-operation80-batch-08.md', locator: 'Plain cooking water' } },
      gi: input ? { kind, value: input[2], source: source(sources[kind === 'HUMAN_GI' ? 0 : 5]) } : { kind },
      applicability: 'Exact Okayu preparation reviewed in PR #240',
      approvalEvidence: 'PR #240 archive reference for test only',
    }];
  }));
  const packet: MixedEvidencePacket = { recipeId, servings, boundFiles, preparation, limitation, ingredients,
    reviewState, publicationAuthorized, rows, method: MIXED_EVIDENCE_METHOD };
  const raw = JSON.stringify(packet);
  const read = (path: string) => {
    if (path === packetPath) return raw;
    if (path === mixedBindingsPath) return JSON.stringify({ schemaVersion: 1, bindings });
    return readRepo(path);
  };
  const batch: Batch = { schemaVersion: 1, batchId: 'okayu-validation', candidates: [{ recipeId, packetPath }] };
  const [row] = checkBatch(batch, read).manifest.candidates;
  assert(row.technical === 'PASS' && row.mixedEvidence);
  assert.equal(row.state, 'REVIEW_REQUIRED');
  assert.equal(row.mixedEvidence.policySha256, mixedPolicySha256);
  assert.equal(row.omittedCho, 0);
  assert.deepEqual(row.riskSignals, ['ASSIGNED_GI']);
  assert.equal(row.mixedEvidence.point.toFixed(4), '36.7676');
  assert.equal(row.mixedEvidence.codedGk.toFixed(4), '0.2301');
  assert.deepEqual(row.mixedEvidence.uncertainty.scenarios.map(s => s.combinedGk.toFixed(4)),
    ['36.5375', '37.0925', '37.3700']);

  const approval = { schemaVersion: 1, decision: 'APPROVE_REVIEW_ONLY', policySha256: mixedPolicySha256, evidence: 'Test only' };
  const readMain = (path: string) => {
    assert.equal(path, mixedApprovalPath);
    return JSON.stringify(approval);
  };
  const readMainWithoutApproval = (path: string) => {
    if (path === mixedApprovalPath) throw Object.assign(new Error('Approval file absent in test'), { code: 'ENOENT' });
    return readRepo(path);
  };
  assert.throws(() => checkMixedReviewBatch(batch, read, readMainWithoutApproval), /MIXED_EVIDENCE_METHOD_APPROVAL_REQUIRED/);
  assert.throws(() => checkMixedReviewBatch(batch, read, () => JSON.stringify({ ...approval, policySha256: '0'.repeat(64) })),
    /INVALID_OR_STALE_MIXED_EVIDENCE_METHOD_APPROVAL/);
  const [entry] = batch.candidates;
  const review: NonNullable<Classification['review']> = { depth: 'FOCUSED', evidence: 'Test only', inputSha256: row.inputSha256 };
  entry.classification = { candidateSha256: textHash(raw), risk: 'HIGH', contentChange: 'GK_ONLY',
    contentSummary: 'Water-based Okayu with weighed toppings', reasons: ['Test only'], outcome: 'OWNER_DECISION', review };
  assert.equal(checkMixedReviewBatch(batch, read, readMain).manifest.candidates[0].reason, 'RISK_MATCHED_REVIEW_REQUIRED');
  review.depth = 'DEEP';
  const checked = checkMixedReviewBatch(batch, read, readMain);
  assert.equal(checked.manifest.candidates[0].state, 'OWNER_DECISION');
  assert.equal(checkBatch(batch, read).manifest.candidates[0].state, 'REVIEW_REQUIRED');
  const decisions = approve(checked, recipeId);
  assert.equal(applyDecisions(checked, decisions)[0].state, 'OWNER_APPROVED');
  const plan = prepareRelease(checked, decisions, coverage, base, read);
  assert.equal(plan.rows[0].reason, 'NO_RELEASE_VARIANT_FOR_REVIEW_ONLY_METHOD');
  assert.equal(plan.expectedCoverageDelta, 0);
  bindings['spring-onion'].composition.availablePer100 = 4.75;
  assert.equal(checkMixedReviewBatch(batch, read, readMain).manifest.candidates[0].reason, 'MIXED_EVIDENCE_INPUT_REVIEW_REQUIRED');
});
