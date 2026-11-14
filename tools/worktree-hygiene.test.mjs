import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseWorktrees, isExpectedOrigin, assessStatic } from './worktree-hygiene.mjs';

const commit = 'f'.repeat(40);

test('NUL-separated worktrees tolerate spaces and protected branches', () => {
  const raw = 'worktree C:/Projects/My Reseptit\0HEAD ' + commit +
    '\0branch refs/heads/main\0\0' +
    'worktree C:/Projects/working recipe\0HEAD ' + commit +
    '\0branch refs/heads/codex/review-1\0locked ongoing\0\0';
  assert.deepEqual(parseWorktrees(raw), [
    { path: 'C:/Projects/My Reseptit', head: commit, branch: 'main' },
    { path: 'C:/Projects/working recipe', head: commit,
      branch: 'codex/review-1', locked: 'ongoing' }
  ]);
});

test('unavailable PR verification fails closed', () => {
  assert.deepEqual(assessStatic({ head: commit, branch: 'codex/x' },
    { openBranches: null }), ['open-pr-check-unavailable']);
});

test('open PR and locked worktree are protected', () => {
  const reasons = assessStatic({ head: commit, branch: 'codex/x', locked: true },
    { openBranches: new Set(['codex/x']) });
  assert.ok(reasons.includes('locked'));
  assert.ok(reasons.includes('open-pr-branch'));
});

test('detached and primary worktrees never qualify', () => {
  assert.ok(assessStatic({ head: commit, detached: true },
    { openBranches: new Set() }).includes('detached-or-no-branch'));
  assert.ok(assessStatic({ head: commit, branch: 'feature/test' },
    { isPrimary: true, openBranches: new Set() }).includes('primary-worktree'));
});

test('clean non-PR branch only qualifies for manual review, never deletion', () => {
  assert.deepEqual(assessStatic({ head: commit, branch: 'codex/old' },
    { openBranches: new Set() }), []);
});

test('repository origin must match exactly', () => {
  assert.ok(isExpectedOrigin('https://github.com/ozirix-dev/Reseptit.git'));
  assert.ok(isExpectedOrigin('git@github.com:ozirix-dev/Reseptit.git'));
  assert.ok(!isExpectedOrigin('https://github.com/ozirix-dev/Ravinto.git'));
  assert.ok(!isExpectedOrigin('https://evil.example.com/ozirix-dev/Reseptit.git'));
});
