import assert from 'node:assert/strict';
import test from 'node:test';
import { textHash } from '../scripts/gk149-model';
import { applyDecisions, checkBatch, prepareRelease, type Batch, type Decisions } from '../scripts/gk100-approval-factory';
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
