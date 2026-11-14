#!/usr/bin/env node
// Read-only local worktree inspection. No delete, prune, fetch or branch mutation.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'ozirix-dev/Reseptit';
const ORIGIN_PATTERN = /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)(?:ozirix-dev\/Reseptit)(?:\.git)?\/?$/i;

export function parseWorktrees(porcelain) {
  // git worktree list --porcelain -z: records separated by an empty NUL.
  const records = [];
  let current = {};
  for (const field of porcelain.split('\0')) {
    if (!field) {
      if (current.path) records.push(current);
      current = {};
      continue;
    }
    const [key, ...rest] = field.split(' ');
    const value = rest.join(' ');
    if (key === 'worktree') current.path = value;
    else if (key === 'HEAD') current.head = value;
    else if (key === 'branch') current.branch = value.replace(/^refs\/heads\//, '');
    else if (key === 'detached') current.detached = true;
    else if (key === 'locked') current.locked = value || true;
    else if (key === 'prunable') current.prunable = value || true;
  }
  if (current.path) records.push(current);
  return records;
}

export function isExpectedOrigin(origin) {
  return ORIGIN_PATTERN.test(origin.trim());
}

export function assessStatic(wt, { isPrimary = false, openBranches = null } = {}) {
  const reasons = [];
  if (isPrimary) reasons.push('primary-worktree');
  if (wt.locked) reasons.push('locked');
  if (wt.prunable) reasons.push('prunable-registration');
  if (!wt.head || !/^[a-f0-9]{40}$/i.test(wt.head)) reasons.push('invalid-head');
  if (wt.detached || !wt.branch) reasons.push('detached-or-no-branch');
  if (wt.branch === 'main' || wt.branch === 'master') reasons.push('protected-main-branch');
  if (openBranches === null) reasons.push('open-pr-check-unavailable');
  else if (wt.branch && openBranches.has(wt.branch)) reasons.push('open-pr-branch');
  return reasons;
}

function git(repo, ...args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']
  });
}

function gitExitCode(repo, ...args) {
  const r = spawnSync('git', ['-C', repo, ...args], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
  });
  if (r.error) throw r.error;
  if (typeof r.status !== 'number') throw new Error('git exited without status: ' + args.join(' '));
  return r.status;
}

function loadOpenPrBranches() {
  const r = spawnSync('gh', [
    'pr', 'list', '--repo', REPO, '--state', 'open', '--limit', '500', '--json', 'headRefName'
  ], { encoding: 'utf8', timeout: 30000 });
  if (r.error || r.status !== 0) return null;
  try {
    const rows = JSON.parse(r.stdout);
    if (!Array.isArray(rows) || rows.length >= 500 ||
        rows.some(x => typeof x.headRefName !== 'string')) return null;
    return new Set(rows.map(x => x.headRefName));
  } catch { return null; }
}

export function inspect(root) {
  const origin = git(root, 'remote', 'get-url', 'origin').trim();
  if (!isExpectedOrigin(origin)) throw new Error('Wrong repository: origin ' + origin + ' is not ' + REPO);
  const rootPath = git(root, 'rev-parse', '--show-toplevel').trim();
  const records = parseWorktrees(git(root, 'worktree', 'list', '--porcelain', '-z'));
  const primaryPath = records[0]?.path;
  if (!primaryPath || records.length === 0) throw new Error('No registered worktrees');
  let hasOriginMain = false;
  try {
    hasOriginMain = /^[a-f0-9]{40}$/i.test(
      git(root, 'rev-parse', '--verify', 'refs/remotes/origin/main').trim()
    );
  } catch { /* stale/missing remote state: fail closed */ }
  const openBranches = loadOpenPrBranches();
  const normalize = x => path.resolve(x).toLowerCase();
  const worktrees = [];
  for (const wt of records) {
    const primary = normalize(wt.path) === normalize(primaryPath) ||
                    normalize(wt.path) === normalize(rootPath);
    const reasons = assessStatic(wt, { isPrimary: primary, openBranches });
    if (!existsSync(wt.path)) reasons.push('missing-directory');
    if (!hasOriginMain) reasons.push('origin-main-not-available');
    const inspectable = existsSync(wt.path) && !wt.locked && !wt.prunable &&
                        !wt.detached && wt.head;
    if (inspectable && !primary) {
      try {
        const status = git(wt.path, 'status', '--porcelain=v1', '--untracked-files=all');
        if (status.trim()) reasons.push('tracked-or-untracked-changes');
        const ignored = git(wt.path, 'ls-files', '--others', '--ignored',
                            '--exclude-standard', '--directory');
        if (ignored.trim()) reasons.push('ignored-files-present');
        if (hasOriginMain) {
          const ancestry = gitExitCode(wt.path, 'merge-base', '--is-ancestor',
                                       wt.head, 'refs/remotes/origin/main');
          if (ancestry === 1) reasons.push('head-not-in-origin-main');
          else if (ancestry !== 0) reasons.push('merge-base-error');
        }
      } catch { reasons.push('inspection-error'); }
    }
    worktrees.push({
      path: wt.path, branch: wt.branch ?? null, head: wt.head ?? null,
      classification: reasons.length ? 'KEEP' : 'MANUAL_REVIEW', reasons
    });
  }
  return {
    repository: REPO, readOnly: true,
    remoteBranchSnapshot: 'local origin/main (not fetched)',
    openPrVerification: openBranches === null ? 'UNAVAILABLE' : 'OK',
    summary: {
      registered: worktrees.length,
      manualReview: worktrees.filter(w => w.classification === 'MANUAL_REVIEW').length,
      keep: worktrees.filter(w => w.classification === 'KEEP').length
    },
    worktrees
  };
}

function main(argv) {
  const options = new Set(argv);
  if ([...options].some(x => x !== '--json' && x !== '--help')) {
    throw new Error('Only --json and --help are supported; no deletion capability');
  }
  if (options.has('--help')) {
    console.log('Usage: node tools/worktree-hygiene.mjs [--json]\nRead-only inventory. Never deletes worktrees or branches.');
    return;
  }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const data = inspect(root);
  if (options.has('--json')) console.log(JSON.stringify(data, null, 2));
  else {
    console.log(data.repository + ': ' + data.summary.registered +
      ' worktrees; ' + data.summary.manualReview + ' manual-review candidates; ' +
      data.summary.keep + ' protected.');
    console.log('Open PR check: ' + data.openPrVerification +
      '. No files, worktrees or branches have been deleted.');
    for (const w of data.worktrees.filter(x => x.classification === 'MANUAL_REVIEW').slice(0, 20)) {
      console.log('REVIEW  ' + w.branch + '  ' + w.path);
    }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error('Worktree hygiene: ' + error.message); process.exitCode = 1; }
}
