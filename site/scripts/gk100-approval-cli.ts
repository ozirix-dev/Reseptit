import { makeReleaseBundle } from './gk100-approval-release';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkBatch, checkMixedReviewBatch, prepareRelease, type Batch, type Decisions, type MainCoverage } from './gk100-approval-factory';

const root = resolve(import.meta.dirname, '../..');
const [mode, candidateCommit, batchPath, decisionsPath, coveragePath] = process.argv.slice(2);
if (!['check', 'review-mixed', 'prepare'].includes(mode) || !/^[a-f0-9]{40}$/.test(candidateCommit ?? '') || !batchPath
    || (mode === 'prepare' ? !decisionsPath || !coveragePath : !!decisionsPath) || process.argv.length > 7) {
  throw Error('Usage: gk:approval-check -- check COMMIT BATCH | review-mixed COMMIT BATCH | prepare COMMIT BATCH DECISIONS MAIN_COVERAGE');
}
const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const readAt = (sha: string) => (file: string) => git('show', sha + ':' + file);
const json = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8'));
if (git('cat-file', '-t', candidateCommit).trim() !== 'commit') throw Error('Candidate ref must be a commit');
function currentMain() {
  const remote = git('ls-remote', 'https://github.com/ozirix-dev/Reseptit.git', 'refs/heads/main').trim().split(/\s+/);
  if (remote.length !== 2 || remote[1] !== 'refs/heads/main' || git('cat-file', '-t', remote[0]).trim() !== 'commit') {
    throw Error('Current main commit must be available locally');
  }
  return remote[0];
}
const batch = json<Batch>(batchPath);
if (mode === 'review-mixed') {
  console.log(JSON.stringify(checkMixedReviewBatch(batch, readAt(candidateCommit), readAt(currentMain())).manifest, null, 2));
} else if (mode === 'check') {
  console.log(JSON.stringify(checkBatch(batch, readAt(candidateCommit)).manifest, null, 2));
} else {
  const checked = checkBatch(batch, readAt(candidateCommit));
  const main = currentMain();
  const decisions = json<Decisions>(decisionsPath);
  const plan = prepareRelease(checked, decisions, json<MainCoverage>(coveragePath), main, readAt(main));
  console.log(JSON.stringify({ ...plan, candidateCommit, bundle: makeReleaseBundle(checked, batch, decisions, plan) }, null, 2));
}
