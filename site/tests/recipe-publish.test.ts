import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { assertOrigin, inspectPublish, prepareForCurrentMain, readGitHub, waitForPublish } from '../scripts/recipe-publish.mjs';
import { collectCandidates, templateFromIndex } from '../scripts/recipe-publish-prepare.mjs';
import { hashContent, validateReview } from '../scripts/new-recipe-preflight.mjs';

test('waiting pins the first snapshot and advances only through observable states', async () => {
  const states = ['REVIEW_REQUIRED', 'REVIEW_REQUIRED', 'PR_CI_PENDING', 'READY_CHECKS_PASSED'];
  const notifications: string[] = [];
  const seen: unknown[] = [];
  let time = 0;
  const final = await waitForPublish(7, { seconds: 100 }, {
    inspect: async (number, pins) => {
      seen.push({ number, ...pins });
      return { code: states.shift()!, head, main: base, next: 'next' };
    },
    delay: async ms => { time += ms; },
    now: () => time,
    onChange: state => notifications.push(state.code),
  });
  assert.equal(final.code, 'READY_CHECKS_PASSED');
  assert.equal(time, 45000);
  assert.deepEqual(seen.slice(1), Array(3).fill({ number: 7, head, base }));
  assert.deepEqual(notifications, ['REVIEW_REQUIRED', 'PR_CI_PENDING', 'READY_CHECKS_PASSED']);
});

test('waiting times out without changing state and never repeats a terminal action', async () => {
  const waiting = { code: 'ENVIRONMENT_APPROVAL', head, main: base, next: 'review' };
  const elapsed: number[] = [];
  let time = 0;
  const final = await waitForPublish(7, { seconds: 20, head, base }, {
    inspect: async () => waiting,
    delay: async ms => { elapsed.push(ms); time += ms; },
    now: () => time,
  });
  assert.deepEqual(elapsed, [15000, 5000]);
  assert.deepEqual(final, { ...waiting, waitTimedOut: true });
  for (const code of ['DISPATCH_REQUIRED', 'HOLD_SUPERSEDED', 'VERIFY_RELEASE', 'VERIFIED']) {
    const stopped = await waitForPublish(7, { seconds: 20, head, base }, {
      inspect: async () => ({ ...waiting, code }),
      delay: async () => assert.fail('Terminal state must not wait'),
    });
    assert.equal(stopped.code, code);
  }
});

const repo = 'ozirix-dev/Reseptit';
const head = 'a'.repeat(40);
const base = 'b'.repeat(40);
const merge = 'c'.repeat(40);
const older = 'd'.repeat(40);
type Step = { name: string; status: string; conclusion: string | null };
const liveProbe = 'Avoid redeploying a revision that is already live';
const upload = 'Deploy exact SHA to existing Cloudflare Pages production branch';
const verify = 'Verify production pages, SEO, assets, SHA and Functions GET 405';

function run(sha = merge, status = 'completed', conclusion = 'success') {
  return { id: 50, run_number: 50, run_attempt: 1, head_branch: 'main', head_sha: sha,
    status, conclusion, html_url: 'https://github.com/' + repo + '/actions/runs/50' };
}

function scenario() {
  const snapshot = {
    pr: {
      number: 7, head: { sha: head, ref: 'owner/work', repo: { full_name: repo } },
      base: { sha: base, ref: 'main', repo: { full_name: repo } },
      state: 'open', draft: true, merged: false, merge_commit_sha: merge, mergeable: true, mergeable_state: 'clean',
      user: { id: 1 },
    },
    main: base,
    checks: [{ id: 1, name: 'build', status: 'completed', conclusion: 'success', app: { id: 15368 } }],
    approvalCount: 0,
    reviews: [] as { id: number; state: string; commit_id: string; user: { id: number } }[],
    ci: [run()], releases: [] as ReturnType<typeof run>[], occupying: [] as ReturnType<typeof run>[],
    steps: [] as Step[], pending: [] as { environment: { name: string } }[],
  };
  const get = async (url: string) => {
    if (url.endsWith('/pulls/7')) return structuredClone(snapshot.pr);
    if (url.endsWith('/git/ref/heads/main')) return { ref: 'refs/heads/main', object: { sha: snapshot.main } };
    if (url.endsWith('/rules/branches/main')) return [
      { type: 'required_status_checks', parameters: { required_status_checks: [{ context: 'build', integration_id: 15368 }] } },
      { type: 'pull_request', parameters: { required_approving_review_count: snapshot.approvalCount } },
    ];
    if (url.includes('/check-runs?')) return [{ check_runs: snapshot.checks }];
    if (url.includes('/reviews?')) return [snapshot.reviews];
    if (url.includes('/pages.yml/runs?')) return [{ workflow_runs: snapshot.ci.map(item => ({ ...item, event: 'push' })) }];
    if (url.includes('/recipavo-production-manual.yml/runs?')) {
      const rows = url.includes('head_sha=') ? snapshot.releases :
        snapshot.occupying.filter(item => url.includes('status=' + item.status));
      return [{ workflow_runs: rows.map(item => ({ ...item, event: 'workflow_dispatch' })) }];
    }
    if (url.includes('/attempts/1/jobs?')) return [{ jobs: [{ steps: snapshot.steps }] }];
    if (url.endsWith('/pending_deployments')) return snapshot.pending;
    throw new Error('Unexpected GET ' + url);
  };
  const merged = () => {
    snapshot.pr = { ...snapshot.pr, merged: true, state: 'closed', draft: false };
    snapshot.main = merge;
  };
  return { snapshot, get, merged };
}

test('validates repository, branch and exact pins before reporting progress', async () => {
  assertOrigin('https://github.com/' + repo + '.git\r\n');
  assert.throws(() => assertOrigin('https://github.com/ozirix-dev/Ravinto.git'), /HOLD_REPOSITORY/);
  assert.throws(() => assertOrigin('https://example.net/' + repo), /HOLD_REPOSITORY/);
  const { get, snapshot } = scenario();
  await assert.rejects(inspectPublish(7, { get, head: older }), /HOLD_HEAD/);
  await assert.rejects(inspectPublish(7, { get, base: older }), /HOLD_BASE/);
  snapshot.pr.base.ref = 'other';
  await assert.rejects(inspectPublish(7, { get }), /HOLD_BRANCH/);
});

test('distinguishes pending, failing and passing checks and exact-HEAD reviews', async () => {
  const { get, snapshot } = scenario();
  snapshot.approvalCount = 1;
  snapshot.reviews = [{ id: 1, state: 'APPROVED', commit_id: older, user: { id: 2 } }];
  assert.equal((await inspectPublish(7, { get })).code, 'REVIEW_REQUIRED');
  snapshot.reviews[0].commit_id = head;
  const passing = snapshot.checks[0];
  snapshot.checks = [];
  assert.equal((await inspectPublish(7, { get })).code, 'PR_CI_PENDING');
  snapshot.checks = [{ ...passing, conclusion: 'failure' }];
  assert.equal((await inspectPublish(7, { get })).code, 'HOLD_PR_CI');
  snapshot.checks = [passing];
  assert.equal((await inspectPublish(7, { get })).code, 'DRAFT_CHECKS_PASSED');
  snapshot.pr.draft = false;
  assert.equal((await inspectPublish(7, { get })).code, 'READY_CHECKS_PASSED');
  snapshot.main = older;
  assert.equal((await inspectPublish(7, { get })).code, 'HOLD_PR_BASE');
});

test('merged candidate uses exact-SHA main CI and recognizes an older in-flight release', async () => {
  const { get, snapshot, merged } = scenario();
  merged();
  snapshot.ci = [run(older)];
  assert.equal((await inspectPublish(7, { get })).code, 'MAIN_CI_PENDING');
  snapshot.ci = [run(merge, 'completed', 'failure')];
  assert.equal((await inspectPublish(7, { get })).code, 'HOLD_MAIN_CI');
  snapshot.ci = [run()];
  snapshot.occupying = [run(older, 'waiting')];
  assert.equal((await inspectPublish(7, { get })).code, 'PRODUCTION_OCCUPIED');
  snapshot.occupying = [];
  assert.equal((await inspectPublish(7, { get })).code, 'DISPATCH_REQUIRED');
  snapshot.main = older;
  assert.equal((await inspectPublish(7, { get })).code, 'HOLD_SUPERSEDED');
});

test('separates Environment wait, upload in progress, stale live SHA and verified release', async () => {
  const { get, snapshot, merged } = scenario();
  merged();
  const read = (sha: string) => inspectPublish(7, { get, live: async () => sha });
  snapshot.releases = [run(merge, 'in_progress')];
  snapshot.pending = [{ environment: { name: 'recipavo-production' } }];
  assert.equal((await read(older)).code, 'ENVIRONMENT_APPROVAL');
  snapshot.pending = [];
  snapshot.steps = [{ name: upload, status: 'in_progress', conclusion: null }];
  assert.equal((await read(older)).code, 'UPLOADING');
  snapshot.steps = [{ name: upload, status: 'completed', conclusion: 'success' },
    { name: verify, status: 'completed', conclusion: 'failure' }];
  const first = await read(older);
  assert.equal(first.code, 'VERIFY_RELEASE');
  assert.deepEqual(await read(older), first);
  assert.equal((await read(merge)).code, 'VERIFY_RELEASE');
  snapshot.steps[1].conclusion = 'success';
  snapshot.releases = [run()];
  assert.equal((await read(older)).code, 'VERIFIED_PREVIOUSLY');
  assert.equal((await read(merge)).code, 'VERIFIED');
});

test('holds before upload when both upload and verification were skipped', async () => {
  const { get, snapshot, merged } = scenario();
  merged();
  snapshot.releases = [run(merge, 'completed', 'failure')];
  snapshot.steps = [liveProbe, upload, verify].map(name => ({ name, status: 'completed', conclusion: 'skipped' }));
  const read = () => inspectPublish(7, { get, live: async () => merge });
  assert.equal((await read()).code, 'HOLD_BEFORE_UPLOAD');

  snapshot.steps[0].conclusion = 'success';
  assert.equal((await read()).code, 'HOLD_BEFORE_UPLOAD');
  snapshot.steps[2] = { name: verify, status: 'in_progress', conclusion: null };
  snapshot.releases = [run(merge, 'in_progress')];
  assert.equal((await read()).code, 'VERIFYING');

  snapshot.steps[0].conclusion = 'skipped';
  assert.equal((await read()).code, 'PRODUCTION_ACTIVE');
  snapshot.steps[0].conclusion = 'success';
  snapshot.steps[2] = { name: verify, status: 'completed', conclusion: 'failure' };
  snapshot.releases = [run(merge, 'completed', 'failure')];
  assert.equal((await read()).code, 'VERIFY_RELEASE');
});

test('batch preparation checks the live GitHub main before and after validation', async () => {
  let current = older;
  let reads = 0;
  const get = async (endpoint: string) => {
    assert.equal(endpoint, 'repos/ozirix-dev/Reseptit/git/ref/heads/main');
    reads++;
    return { ref: 'refs/heads/main', object: { sha: current } };
  };
  await assert.rejects(prepareForCurrentMain(base, head, { get,
    prepare: () => assert.fail('A stale base must stop before validation'),
  }), /HOLD_BASE.*differs/);
  assert.equal(reads, 1);

  current = base;
  await assert.rejects(prepareForCurrentMain(base, head, { get, prepare: (candidateBase, candidateHead) => {
    assert.equal(candidateBase, base);
    assert.equal(candidateHead, head);
    current = older;
    return { code: 'PREPARATION_CHECKS_PASSED' };
  } }), /HOLD_BASE.*changed during/);
  assert.equal(reads, 3);

  current = base;
  const plan = { code: 'PREPARATION_CHECKS_PASSED' };
  assert.deepEqual(await prepareForCurrentMain(base, head, { get, prepare: () => plan }), plan);
  assert.equal(reads, 5);
});

test('restarts cleanly when the snapshot changes while reading GitHub', async () => {
  const { get, snapshot } = scenario();
  await assert.rejects(inspectPublish(7, { get: async url => {
    if (url.includes('/check-runs?')) snapshot.pr.head.sha = older;
    return get(url);
  } }), /HOLD_HEAD/);
  assert.equal((await inspectPublish(7, { get })).head, older);
});

test('GET retries transient failures and distinguishes permissions', async () => {
  const observed: string[][] = [];
  const delays: number[] = [];
  const result = await readGitHub('example', { pages: true, delay: async ms => { delays.push(ms); },
    run: async (_name, args) => {
      observed.push(args);
      if (observed.length < 3) throw { stderr: 'gh: error (HTTP ' + (observed.length === 1 ? '429' : '503') + ')' };
      return { stdout: '[{}]' };
    } });
  assert.deepEqual(result, [{}]);
  assert.deepEqual(delays, [1000, 2000]);
  assert.ok(observed.every(args => args.includes('GET') && args.includes('--paginate')));
  await assert.rejects(readGitHub('example', { run: async () => { throw { stderr: 'gh: access (HTTP 403)' }; },
    delay: async () => assert.fail('403 must not retry') }), /HOLD_PERMISSION/);
});

function fixture(locale: string, status: string, id = 'synthetic-recipe') {
  return ['---', 'recipe_id: ' + id, 'url_slug: ' + id + '-' + locale, 'language: ' + locale,
    'status: ' + status, '---', '', 'Synthetic fixture', ''].join('\n');
}

test('FI-only and same-PR four-language candidates use one identity and omit drafts', () => {
  for (const published of [false, true]) {
    const items = ['fi', 'en', 'sv', 'th'].map(locale => ({
      file: (locale === 'fi' ? 'reseptit' : 'kaannokset/' + locale) + '/paaruoat/synthetic-recipe.md',
      read: () => fixture(locale, locale === 'fi' || published ? 'published' : 'draft'),
    }));
    items.push({ file: 'reseptit/paaruoat/second.md', read: () => fixture('fi', 'draft', 'second') });
    const candidates = collectCandidates(items);
    assert.deepEqual(candidates.groups[0].published.map(row => row.locale), published ? ['fi', 'en', 'sv', 'th'] : ['fi']);
    assert.equal(candidates.groups[1].published.length, 0);
    assert.equal(candidates.excluded.length, published ? 1 : 4);
  }
});

test('template binds to Git index bytes under LF and CRLF; edited content invalidates the review', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'recipe-publish-fixture-'));
  const relative = 'reseptit/paaruoat/synthetic-recipe.md';
  const absolute = path.join(root, relative);
  const git = (...args: string[]) => execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    git('init');
    mkdirSync(path.dirname(absolute), { recursive: true });
    writeFileSync(path.join(root, '.gitattributes'), '/reseptit/**/*.md text eol=lf\n');
    const lf = fixture('fi', 'published');
    for (const source of [lf, lf.replaceAll('\n', '\r\n')]) {
      writeFileSync(absolute, source);
      git('add', '--', '.gitattributes', relative);
      assert.equal(readFileSync(absolute, 'utf8'), source);
      const review = templateFromIndex(relative, root);
      assert.equal(review.source_sha256, hashContent(lf));
      assert.equal(review.decision, 'hold');
      assert.equal(review.reviewed_by, 'UNREVIEWED');
      assert.ok(!validateReview(relative, lf, review).some(message => message.includes('source_sha256')));
      assert.ok(validateReview(relative, lf + 'Changed', review).some(message => message.includes('source_sha256')));
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});


test('a Ready-triggered auxiliary check blocks reporting readiness until it passes', async () => {
  const { snapshot, get } = scenario();
  snapshot.pr.draft = false;
  snapshot.checks.push({ id: 2, name: 'check', status: 'completed', conclusion: 'cancelled', app: { id: 15368 } });
  snapshot.checks.push({ id: 3, name: 'check', status: 'in_progress', conclusion: '', app: { id: 15368 } });
  assert.equal((await inspectPublish(7, { get, head, base })).code, 'PR_CI_PENDING');
  Object.assign(snapshot.checks[2], { status: 'completed', conclusion: 'failure' });
  assert.equal((await inspectPublish(7, { get, head, base })).code, 'HOLD_PR_CI');
  Object.assign(snapshot.checks[2], { conclusion: 'success' });
  assert.equal((await inspectPublish(7, { get, head, base })).code, 'READY_CHECKS_PASSED');
});
