import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/gk-review-stop-gate.mjs', import.meta.url));
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'gk-review-stop-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const dir of ['docs/nutrition', 'reseptit/paaruoat']) mkdirSync(path.join(root, dir), { recursive: true });
  const recipe = path.join(root, 'reseptit/paaruoat/idli-sambar.md');
  const evidence = path.join(root, 'docs/nutrition/review.md');
  const registry = path.join(root, 'docs/nutrition/gk-review-stops.json');
  writeFileSync(recipe, '---\nrecipe_id: idli-sambar\nstatus: published\n---\n\n## Valmistus\nHöyrytä.\n');
  writeFileSync(evidence, '# GI evidence review\nGI not applicable to this fermentation.\n');
  writeFileSync(registry, JSON.stringify({ schemaVersion: 1, purpose: 'Research hold only', decisions: [] }) + '\n');
  const exec = (...args) => {
    const x = spawnSync(process.execPath, [script, ...args, '--repo-root', root], { encoding: 'utf8' });
    return { ...x, json: x.status === 0 ? JSON.parse(x.stdout) : null };
  };
  const check = (...extra) => exec('check', '--id', 'idli-sambar', ...extra);
  const record = () => exec('record', '--id', 'idli-sambar', '--recipe-path', 'reseptit/paaruoat/idli-sambar.md',
    '--evidence', 'docs/nutrition/review.md', '--source', 'https://doi.org/10.0000/example',
    '--reason', 'Fermentation and GI measurement do not match the recipe.',
    '--review-ref', 'https://github.com/ozirix-dev/Reseptit/issues/717', '--reviewer', 'Test reviewer', '--reviewed-at', '2026-11-18');
  return { root, recipe, evidence, registry, exec, check, record };
}

test('first HOLD is recorded without modifying the recipe or publishing a GK', t => {
  const f = fixture(t);
  assert.equal(f.check().json.outcomes[0].reason, 'NO_RECORDED_DECISION');
  const before = readFileSync(f.recipe, 'utf8');
  assert.equal(f.record().status, 0);
  assert.equal(f.check().json.outcomes[0].action, 'SKIP_REPEAT_GI_RESEARCH');
  assert.equal(readFileSync(f.recipe, 'utf8'), before);
  const decision = JSON.parse(readFileSync(f.registry)).decisions[0];
  assert.equal(decision.status, 'NO_RELIABLE_GK');
  assert.equal(decision.publicationAuthorized, undefined);
});
test('subsequent independent invocations and batch selection reuse the same HOLD', t => {
  const f = fixture(t); f.record();
  assert.equal(f.check().json.outcomes[0].action, 'SKIP_REPEAT_GI_RESEARCH');
  const batch = f.exec('check', '--id', 'idli-sambar', '--id', 'unreviewed', '--id', 'idli-sambar');
  assert.deepEqual(batch.json.outcomes.map(x => x.action), ['SKIP_REPEAT_GI_RESEARCH', 'REVIEW_REQUIRED']);
  assert.equal(JSON.parse(readFileSync(f.registry)).decisions.length, 1);
});
test('changing the published recipe requires renewed review', t => {
  const f = fixture(t); f.record();
  writeFileSync(f.recipe, readFileSync(f.recipe, 'utf8') + '\nNew cooking step.\n');
  assert.equal(f.check().json.outcomes[0].reason, 'RECIPE_CHANGED');
});
test('changing, deleting or losing a source never silently preserves the HOLD', t => {
  const f = fixture(t); f.record();
  writeFileSync(f.evidence, '# New GI evidence\n');
  assert.equal(f.check().json.outcomes[0].reason, 'EVIDENCE_CHANGED');
  rmSync(f.evidence);
  assert.equal(f.check().json.outcomes[0].reason, 'BINDING_UNAVAILABLE');
});
test('new external evidence or explicit safety review overrides unchanged bindings', t => {
  const f = fixture(t); f.record();
  assert.equal(f.check('--new-evidence', 'New GI trial DOI 10.0000/new').json.outcomes[0].reason,
    'NEW_EVIDENCE_OR_EXPLICIT_REVIEW');
});
test('unsafe, unsupported and unpublished decisions are refused', t => {
  const f = fixture(t);
  assert.equal(f.exec('record', '--id', 'idli-sambar', '--recipe-path', '../escape.md').status, 2);
  assert.equal(f.exec('record', '--id', 'idli-sambar', '--recipe-path', 'reseptit/paaruoat/idli-sambar.md',
    '--reason', 'Unsupported').status, 2);
  writeFileSync(f.recipe, readFileSync(f.recipe, 'utf8').replace('published', 'draft'));
  assert.equal(f.record().status, 2);
  assert.equal(JSON.parse(readFileSync(f.registry)).decisions.length, 0);
});
test('tampered decision cannot suppress investigation', t => {
  const f = fixture(t); f.record();
  const data = JSON.parse(readFileSync(f.registry, 'utf8'));
  data.decisions[0].reason = 'Changed rationale after original review';
  writeFileSync(f.registry, JSON.stringify(data));
  assert.equal(f.check().status, 2);
});
test('re-recording identical evidence does not rewrite audit history', t => {
  const f = fixture(t); f.record();
  const before = readFileSync(f.registry, 'utf8');
  assert.equal(f.record().status, 2);
  assert.equal(readFileSync(f.registry, 'utf8'), before);
});
