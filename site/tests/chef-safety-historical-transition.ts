import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

// Two previously CI-approved and merged chef corrections are reconciled
// with the frozen 326-recipe historical baseline. No additional edits qualify.
export const reviewedChefSafetyPaths = Object.freeze([
  'reseptit/paaruoat/kana-yakitori-kaalilla.md',
  'reseptit/paaruoat/pho-bo.md',
]);
// Exact editorial versions checked against the unchanged historical source.
const editorialMethods: Readonly<Record<string, readonly [string, string]>> = {
  'reseptit/aamupalat/lahi-ita-fattet-hummus.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', 'e5592a7b299c89f423e8a12e4ef7ca1b3050e2013bd3c5fa12f42dd74e4c5984'],
  'reseptit/paaruoat/amritsari-kala.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '47e7de3be40b9d6f1caeba3894eb775a6590644156eb14812fe5d6f66cf3045b'],
  'reseptit/paaruoat/char-siu.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '1d07f8fa86cc9cba185e1dc0e2ccbd863ceff43943b656ed9b2c91b728ca0cab'],
  'reseptit/paaruoat/dal-makhani.md': ['17ef3e0f7581d8aa040e23a9bc73ff0887b76777', '36603564d7f196482f0a0d563a19e21417aa3cb6d3f5483ace22ec92a923b4bf'],
  'reseptit/paaruoat/broileri-kukkakaaligratiini.md': ['72da5c97fdc59f0d43bdc234bad88080a2168345', 'df3a3ab42344e39adf024062181a47444fabec51a3e6ec965b1ed9486d581e79'],
  'reseptit/paaruoat/kanakorma-kukkakaaliriisilla.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'c5aebce4250d0c10cbedc0d6a7ba8f2d1bc66e20f9c16e1e8a9efe603ec6bdd8'],
  'reseptit/paaruoat/kerala-kalacurry.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '59e0549acd3540f706cdb04cb4f07388634bc00d571c76e686d56c58d786ac08'],
  'reseptit/leivonnaiset/keto-joulutortut.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '4b3d436f943f55c956fcf7a8301ab4da6f3f0f47a31f37c4f0382aca42eac526'],
  'reseptit/alkuruoat/medu-vada.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'a1267b4a8eb2d91d4ff54fc77aeedb4ce682c019bf81435580d3ea06f09df677'],
  'reseptit/paaruoat/pad-kra-pao-vhh.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '380dff4c6cb59820c8f64be2edf1bff363c6da13cdc20aa488311656f5c6aaf0'],
  'reseptit/paaruoat/pad-thai-vhh-konjac.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'be2fc989ceca366800b87344676099ada26aedd71a6c26d93b2eede5ba7b2091'],
  'reseptit/paaruoat/paella-valenciana.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '9a12394a5c2e7d556fc9216667a5b9bfffbe1124745f4cdad7c5db0df2dfa35c'],
  'reseptit/paaruoat/paistettu-maksa-pekonilla.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', 'dc54fa69f2425530f3a75dadc617c01a27c7f55e0f2ebcfc0585eb5eeaf640db'],
  'reseptit/alkuruoat/pani-puri.md': ['bbe443ea57f40d5f0903300e3e10b0dede68d2fb', '7ad741915553b5bee21fef0558df3ad3e9228928ff8d194110f249d0601873c8'],
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
    const frontmatter = (source: string) => source.split('\n---\n', 1)[0];
    const originalFrontmatter = frontmatter(original);
    const expected = file === 'reseptit/alkuruoat/pani-puri.md'
      ? originalFrontmatter.replace('Noin 1/2 tl; säädä kalafondin suolaisuuden mukaan.', 'Täytteeseen ja yrttiveteen.')
      : originalFrontmatter;
    assert.equal(frontmatter(live), expected, file + ': changed protected recipe metadata');
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
