import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

// Two previously CI-approved and merged chef corrections are reconciled
// with the frozen 326-recipe historical baseline. No additional edits qualify.
export const reviewedChefSafetyPaths = Object.freeze([
  'reseptit/paaruoat/kana-yakitori-kaalilla.md',
  'reseptit/paaruoat/pho-bo.md',
]);
// Preparation-only versions checked against the unchanged historical source.
const editorialMethods: Readonly<Record<string, readonly [string, string]>> = {
  'reseptit/aamupalat/lahi-ita-fattet-hummus.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', 'e5592a7b299c89f423e8a12e4ef7ca1b3050e2013bd3c5fa12f42dd74e4c5984'],
  'reseptit/paaruoat/amritsari-kala.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '47e7de3be40b9d6f1caeba3894eb775a6590644156eb14812fe5d6f66cf3045b'],
  'reseptit/paaruoat/char-siu.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '1d07f8fa86cc9cba185e1dc0e2ccbd863ceff43943b656ed9b2c91b728ca0cab'],
  'reseptit/paaruoat/dal-makhani.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '36603564d7f196482f0a0d563a19e21417aa3cb6d3f5483ace22ec92a923b4bf'],
  'reseptit/paaruoat/broileri-kukkakaaligratiini.md': ['72da5c97fdc59f0d43bdc234bad88080a2168345', 'df3a3ab42344e39adf024062181a47444fabec51a3e6ec965b1ed9486d581e79'],
};
export const editorialMethodHistoryPaths = Object.freeze(Object.keys(editorialMethods));
const accepted = new Set<string>(reviewedChefSafetyPaths);
const before = '7fa68e909a7dfd1920f7d8701a9669fba440d68f'; // main before #365
const after = '90278e1fdc42772241b069fe2904888fcbd38221'; // merged #365
const lf = (s: string) => s.replaceAll('\r\n', '\n');
const historical = (root: string, commit: string, file: string) =>
  lf(execFileSync('git', ['show', commit + ':' + file], {cwd: root, encoding: 'utf8'}));

export function originalForReviewedChefSafety(root: string, file: string, current: string): string {
  const method = Object.hasOwn(editorialMethods, file) ? editorialMethods[file] : undefined;
  if (method) {
    const [base, reviewedSha] = method;
    const live = lf(current);
    assert.equal(createHash('sha256').update(live).digest('hex'), reviewedSha,
      file + ': unreviewed source modification cannot inherit historical approval');
    const original = historical(root, base, file);
    const beforeMethod = (source: string) => source.split('\n## Valmistus\n', 1)[0];
    assert.equal(beforeMethod(live), beforeMethod(original), file + ': changed protected recipe metadata');
    assert.notEqual(live, original);
    return original;
  }
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
