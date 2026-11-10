import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  changesFromDiff, hashContent, isNewPublication, makeTemplate,
  readRecipeIdentity, runCli, validateReview,
} from './new-recipe-preflight.mjs';

const recipePath = 'reseptit/aamupalat/omena-puuro.md';
const source = (status = 'published', id = 'omena-puuro') =>
  '---\ntitle: "Omenapuuro"\nrecipe_id: ' + id + '\nurl_slug: ' + id +
  '\ncategory: aamupala\nlanguage: fi\nstatus: ' + status + '\n---\n## Valmistus\n1. Kypsennä puuro.\n';
function approval(markdown = source()) {
  const review = makeTemplate(recipePath, markdown);
  review.decision = 'approved';
  review.reviewed_by = 'AI-editorial review';
  review.reviewed_at = '2026-11-10';
  review.nutrition_evidence = 'docs/nutrition/reviews/omena-puuro.md';
  for (const item of Object.values(review.checks)) {
    item.status = 'pass';
    item.notes = 'Checked against the quantified source recipe and instructions.';
  }
  review.checks.glycemic.status = 'unavailable';
  review.checks.glycemic.notes = 'No defensible GI source is available, and no GK is claimed.';
  return review;
}

test('an unchanged published recipe is not a new publication', () => {
  assert.equal(isNewPublication({ status: 'published' }, { status: 'published' }), false);
  assert.equal(isNewPublication({ status: 'published' }, { status: 'draft' }), true);
  assert.equal(isNewPublication({ status: 'draft' }, null), false);
  assert.equal(isNewPublication({ status: 'published' }, null), true);
});

test('diff includes additions and modifications, but not renames/deletions or templates', () => {
  const changed = changesFromDiff('A\treseptit/aamupalat/omena-puuro.md\nM\treseptit/aamupalat/omena-puuro.md\nD\treseptit/paaruoat/kala.md\nR100\treseptit/paaruoat/a.md\treseptit/paaruoat/b.md\nA\treseptit/_mallipohjat/pohja.md');
  assert.deepEqual(changed.map((r) => r.action), ['A', 'M']);
});

test('source must be SHA-bound, attributable, and have a real checklist', () => {
  const review = approval();
  assert.deepEqual(validateReview(recipePath, source(), review), []);
  assert.equal(hashContent(source()), review.source_sha256);
  assert.equal(readRecipeIdentity(source()).recipe_id, 'omena-puuro');
  assert(validateReview(recipePath, source() + '\nchanged', review).some((r) => r.includes('stale')));
  assert(validateReview(recipePath, source(), null).includes('review evidence missing'));
  assert(validateReview(recipePath, source(), { ...review, decision: 'hold' }).some((r) => r.includes('not approved')));
  assert(validateReview(recipePath, source(), { ...review, reviewed_by: 'UNREVIEWED' }).some((r) => r.includes('reviewer')));
});

test('method, ingredients, nutrition and glycemic signoffs cannot be empty', () => {
  const review = approval();
  review.checks.method = { status: 'pending', notes: '' };
  review.checks.nutrition = { status: 'pass', notes: '' };
  review.nutrition_evidence = '';
  const errors = validateReview(recipePath, source(), review);
  assert(errors.some((r) => r.startsWith('method:')));
  assert(errors.some((r) => r.startsWith('nutrition:')));
  assert(errors.some((r) => r.includes('nutrition evidence')));
});

test('adaptations require a traceable source and duplicate IDs/slugs block publication', () => {
  const review = approval();
  review.origin = { kind: 'adaptation', sources: [] };
  assert(validateReview(recipePath, source(), review).some((r) => r.includes('HTTPS')));
  review.origin.sources = ['https://example.org/original'];
  assert.deepEqual(validateReview(recipePath, source(), review), []);
  assert(validateReview(recipePath, source(), review, [
    { path: 'reseptit/valipalat/other.md', recipe_id: 'omena-puuro', url_slug: 'other' },
  ]).some((r) => r.includes('already exists')));
});

test('CLI skips drafts and existing publications but blocks newly published content without review', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'recipe-new-gate-'));
  const dir = path.join(root, 'reseptit', 'aamupalat');
  const exec = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  try {
    mkdirSync(dir, { recursive: true });
    exec('init', '-q'); exec('config', 'user.name', 'Test'); exec('config', 'user.email', 'test@example.org');
    writeFileSync(path.join(dir, 'old.md'), source('published', 'old'));
    writeFileSync(path.join(dir, 'draft.md'), source('draft', 'draft'));
    exec('add', '.'); exec('commit', '-qm', 'baseline');
    const base = exec('rev-parse', 'HEAD');
    writeFileSync(path.join(dir, 'old.md'), source('published', 'old') + '\nupdated');
    writeFileSync(path.join(dir, 'draft.md'), source('published', 'draft'));
    writeFileSync(path.join(dir, 'omena-puuro.md'), source('draft'));
    exec('add', '.'); exec('commit', '-qm', 'stage one');
    assert.throws(() => runCli(root, ['--base=' + base, '--head=HEAD']), /publication blocked/);
    writeFileSync(path.join(dir, 'draft.md'), source('draft', 'draft'));
    exec('add', '.'); exec('commit', '-qm', 'restore draft');
    const result = runCli(root, ['--base=' + base, '--head=HEAD']);
    assert.equal(result.checked, 0);
    writeFileSync(path.join(dir, 'omena-puuro.md'), source());
    const review = approval();
    const reviewDir = path.join(root, 'docs/reviews/new-recipes');
    mkdirSync(reviewDir, { recursive: true });
    writeFileSync(path.join(reviewDir, 'omena-puuro.json'), JSON.stringify(review));
    exec('add', '.'); exec('commit', '-qm', 'approve new recipe');
    assert.equal(runCli(root, ['--base=' + base, '--head=HEAD']).checked, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
