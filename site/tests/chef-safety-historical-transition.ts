import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

// Two previously CI-approved and merged chef corrections are reconciled
// with the frozen 326-recipe historical baseline. No additional edits qualify.
export const reviewedChefSafetyPaths = Object.freeze([
  'reseptit/paaruoat/kana-yakitori-kaalilla.md',
  'reseptit/paaruoat/pho-bo.md',
]);
const accepted = new Set<string>(reviewedChefSafetyPaths);
const before = '7fa68e909a7dfd1920f7d8701a9669fba440d68f'; // main before #365
const after = '90278e1fdc42772241b069fe2904888fcbd38221'; // merged #365
const lf = (s: string) => s.replaceAll('\r\n', '\n');
const historical = (root: string, commit: string, file: string) =>
  lf(execFileSync('git', ['show', commit + ':' + file], {cwd: root, encoding: 'utf8'}));

export function originalForReviewedChefSafety(root: string, file: string, current: string): string {
  if (!accepted.has(file)) return current;
  const live = lf(current);
  const reviewed = historical(root, after, file);
  assert.equal(live, reviewed, file + ': unreviewed source modification cannot inherit historical approval');
  const original = historical(root, before, file);
  const frontmatter = (s: string) => s.slice(0, s.indexOf('\n---\n', 4));
  assert.equal(frontmatter(original), frontmatter(reviewed), file + ': ingredient or metadata change');
  assert.notEqual(reviewed, original, file + ': missing reviewed chef correction');
  return original;
}
