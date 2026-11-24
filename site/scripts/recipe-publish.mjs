import { execFile } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { promisify, parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { prepareBatch, templateFromIndex } from './recipe-publish-prepare.mjs';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('../..', import.meta.url));
const repo = 'ozirix-dev/Reseptit';
const apiRoot = 'repos/' + repo;
const branch = 'main';
const production = 'recipavo-production';
const workflow = 'recipavo-production-manual.yml';
const shaPattern = /^[a-f0-9]{40}$/;
const liveProbeStep = 'Avoid redeploying a revision that is already live';
const uploadStep = 'Deploy exact SHA to existing Cloudflare Pages production branch';
const verifyStep = 'Verify production pages, SEO, assets, SHA and Functions GET 405';
const active = ['requested', 'queued', 'pending', 'in_progress', 'waiting'];
const watchable = new Set([
  'REVIEW_REQUIRED', 'PR_CI_PENDING', 'MAIN_CI_PENDING', 'PRODUCTION_OCCUPIED',
  'PRODUCTION_ACTIVE', 'ENVIRONMENT_APPROVAL', 'UPLOADING', 'VERIFY_PENDING', 'VERIFYING',
]);

export function assertOrigin(remote) {
  const canonical = remote.trim().replace(/\.git$/, '').toLowerCase();
  if (!['https://github.com/', 'git@github.com:', 'ssh://git@github.com/']
    .some(prefix => canonical === prefix + repo.toLowerCase())) {
    throw new Error('HOLD_REPOSITORY: origin must be ozirix-dev/Reseptit on GitHub.');
  }
}

export async function readGitHub(endpoint, { pages = false, run = exec, delay = wait } = {}) {
  const args = ['api', '--hostname', 'github.com', '--method', 'GET', endpoint];
  if (pages) args.push('--paginate', '--slurp');
  for (let attempt = 0; ; attempt += 1) {
    try {
      const { stdout } = await run('gh', args, { cwd: root, timeout: 20000, maxBuffer: 16 * 1024 * 1024 });
      return JSON.parse(stdout);
    } catch (error) {
      const status = /\(HTTP (\d{3})\)/.exec(error.stderr ?? '')?.[1];
      const temporary = status === '429' || /^5\d\d$/.test(status ?? '') || error.killed ||
        /timeout|connection reset|unexpected EOF|temporary failure/i.test(error.stderr ?? '');
      if (temporary && attempt < 2) {
        await delay(1000 * (attempt + 1));
        continue;
      }
      const label = status === '401' || status === '403' ? 'HOLD_PERMISSION' : 'HOLD_GITHUB';
      throw new Error(label + ': GET ' + endpoint + (status ? ' (HTTP ' + status + ')' : ' failed') + '.');
    }
  }
}

function validatePr(pr, number, pins) {
  if (pr.number !== number || pr.base?.repo?.full_name?.toLowerCase() !== repo.toLowerCase() ||
      pr.head?.repo?.full_name?.toLowerCase() !== repo.toLowerCase() ||
      pr.base.ref !== branch || pr.head.ref === branch || !pr.head.ref ||
      !shaPattern.test(pr.head.sha) || !shaPattern.test(pr.base.sha)) {
    throw new Error('HOLD_BRANCH: expected a same-repository PR from a work branch into main.');
  }
  if (pins.head && pins.head !== pr.head.sha) throw new Error('HOLD_HEAD: PR HEAD has changed.');
}

function workflowRuns(get, filename, query) {
  const options = new URLSearchParams({ branch, per_page: '100', ...query });
  return get(apiRoot + '/actions/workflows/' + filename + '/runs?' + options, { pages: true })
    .then(pages => pages.flatMap(page => page.workflow_runs));
}

function latest(runs) {
  return [...runs].sort((a, b) => b.run_number - a.run_number || b.run_attempt - a.run_attempt)[0];
}

function runSummary(run) {
  return run ? { id: run.id, status: run.status, conclusion: run.conclusion, sha: run.head_sha,
    attempt: run.run_attempt, url: run.html_url } : null;
}

function stepState(step) {
  if (!step) return 'missing';
  if (step.status !== 'completed') return step.status;
  return step.conclusion ?? 'unknown';
}

export function interpretProduction({ run, jobs, pending, liveSha }) {
  const steps = jobs.flatMap(job => job.steps ?? []);
  const upload = stepState(steps.find(step => step.name === uploadStep));
  const verification = stepState(steps.find(step => step.name === verifyStep));
  const liveProbe = stepState(steps.find(step => step.name === liveProbeStep));
  const status = { upload, verification };
  if (pending.some(row => row.environment?.name === production)) {
    return { ...status, code: 'ENVIRONMENT_APPROVAL', next: 'The authorized Environment reviewer can review this run.' };
  }

  // The workflow skips upload on already_live=true. A successful probe and a
  // verifier that actually ran prove that the skip was intentional.
  const confirmedAlreadyLive = liveProbe === 'success' && upload === 'skipped' &&
    ['in_progress', 'success', 'failure'].includes(verification);
  if (upload === 'success' || confirmedAlreadyLive) {
    if (verification === 'success') {
      return liveSha === run.head_sha
        ? { ...status, code: 'VERIFIED', next: 'No work remains for this release.' }
        : { ...status, code: 'VERIFIED_PREVIOUSLY', next: 'This run verified the release. Its SHA is not confirmed as currently live.' };
    }
    if (verification === 'in_progress') {
      return { ...status, code: 'VERIFYING', next: 'Wait for the active production verifier.' };
    }
    if (active.includes(run.status) && verification !== 'failure') {
      return { ...status, code: 'VERIFY_PENDING', next: 'Wait for the existing release run to reach verification.' };
    }
    return { ...status, code: 'VERIFY_RELEASE',
      next: liveSha && liveSha !== run.head_sha
        ? 'Live SHA differs. Check the exact deployment and current revision before running the read-only verifier. Do not upload again.'
        : 'Use the existing read-only verifier with the exact release artifact. Do not upload again.' };
  }
  if (upload === 'in_progress') {
    return { upload, verification, code: 'UPLOADING', next: 'Wait for the existing upload.' };
  }
  if (upload === 'failure' || upload === 'cancelled') {
    return { upload, verification, code: 'HOLD_UPLOAD', next: 'Check the deployment record before deciding whether any new upload is needed.' };
  }
  return active.includes(run.status)
    ? { upload, verification, code: 'PRODUCTION_ACTIVE', next: 'Wait for this run and refresh its job state.' }
    : { upload, verification, code: 'HOLD_BEFORE_UPLOAD', next: 'Inspect the workflow. No successful upload or already-live evidence was found.' };
}

function summarizeChecks(rules, checks) {
  const required = rules.filter(rule => rule.type === 'required_status_checks')
    .flatMap(rule => rule.parameters.required_status_checks);
  const activeRules = required.some(check => check.context === 'build' && check.integration_id === 15368);
  if (!activeRules) throw new Error('HOLD_RULES: expected required GitHub Actions build rule was not returned.');
  return required.map(check => {
    const result = [...checks].filter(item => item.name === check.context &&
      (check.integration_id == null || item.app?.id === check.integration_id)).sort((a, b) => b.id - a.id)[0];
    return { name: check.context, app: check.integration_id, result: stepState(result) };
  });
}

async function readMainSha(get) {
  const ref = await get(apiRoot + '/git/ref/heads/main');
  const sha = ref?.object?.sha;
  if (ref?.ref !== 'refs/heads/main' || typeof sha !== 'string' || !shaPattern.test(sha)) {
    throw new Error('HOLD_BASE: main ref unavailable.');
  }
  return sha;
}

export async function prepareForCurrentMain(base, head, { get = readGitHub, prepare = prepareBatch } = {}) {
  if (typeof base !== 'string' || !shaPattern.test(base) || typeof head !== 'string' || !shaPattern.test(head)) {
    throw new Error('Preparation requires full --base and --head SHAs.');
  }
  if (await readMainSha(get) !== base) {
    throw new Error('HOLD_BASE: preparation base differs from current GitHub main.');
  }
  const plan = prepare(base, head);
  if (await readMainSha(get) !== base) {
    throw new Error('HOLD_BASE: GitHub main changed during preparation. Re-evaluate the candidate.');
  }
  return plan;
}


export async function inspectPublish(number, { get = readGitHub, live = readLiveSha, head, base } = {}) {
  const prEndpoint = apiRoot + '/pulls/' + number;
  const [pr, main] = await Promise.all([get(prEndpoint), readMainSha(get)]);
  validatePr(pr, number, { head });
  if (base && base !== main) throw new Error('HOLD_BASE: main has changed; re-evaluate the candidate.');

  const [rules, checkPages, reviewPages] = await Promise.all([
    get(apiRoot + '/rules/branches/main'),
    get(apiRoot + '/commits/' + pr.head.sha + '/check-runs?per_page=100', { pages: true }),
    get(prEndpoint + '/reviews?per_page=100', { pages: true }),
  ]);
  const latestChecks = new Map();
  for (const check of checkPages.flatMap(page => page.check_runs).sort((a, b) => a.id - b.id)) {
    latestChecks.set(JSON.stringify([check.name, check.app?.id]), check);
  }
  const checks = [...latestChecks.values()];
  const required = summarizeChecks(rules, checks);
  const observed = checks.map(check => ({ name: check.name, result: stepState(check) }));
  const decisions = new Map();
  for (const review of reviewPages.flat().sort((a, b) => a.id - b.id)) {
    if (review.user?.id && ['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)) {
      decisions.set(review.user.id, review);
    }
  }
  const reviews = [...decisions.values()];
  const minimum = Math.max(0, ...rules.filter(rule => rule.type === 'pull_request')
    .map(rule => rule.parameters.required_approving_review_count ?? 0));
  const result = { repository: repo, pr: number, branch: pr.head.ref, head: pr.head.sha, main,
    prBase: pr.base.sha, prState: pr.state, draft: pr.draft, merge: pr.merged ? pr.merge_commit_sha : null, required, observed,
    reviews: { required: minimum,
      currentApprovals: reviews.filter(review => review.state === 'APPROVED' &&
        review.commit_id === pr.head.sha && review.user.id !== pr.user?.id).length,
      changesRequested: reviews.some(review => review.state === 'CHANGES_REQUESTED') } };
  const releaseState = await nextReleaseState(pr, result, { get, live });
  const [currentPr, currentMain] = await Promise.all([get(prEndpoint), readMainSha(get)]);
  validatePr(currentPr, number, { head: result.head });
  if (currentMain !== main || currentPr.base.sha !== pr.base.sha ||
      currentPr.state !== pr.state || currentPr.draft !== pr.draft || currentPr.merged !== pr.merged) {
    throw new Error('HOLD_CHANGED: PR or main changed during inspection. Read the current state again.');
  }
  return { ...result, ...releaseState };
}

async function readyMetadata(pr, get) {
  if (pr.draft) return null;
  const timeline = await get(apiRoot + '/issues/' + pr.number + '/timeline?per_page=100', { pages: true });
  const readyEvents = timeline.flat().filter(row => row.event === 'ready_for_review');
  if (!readyEvents.length) return null; // The PR was opened Ready.
  const threshold = Math.max(...readyEvents.map(row => Date.parse(row.created_at)));
  const runs = await workflowRuns(get, 'chat-owner-metadata.yml', {
    branch: pr.head.ref, head_sha: pr.head.sha, event: 'pull_request',
  });
  const fresh = latest(runs.filter(run => run.workflow_id === 425934650 &&
    run.head_branch === pr.head.ref && run.head_sha === pr.head.sha &&
    run.head_repository?.full_name?.toLowerCase() === repo.toLowerCase() &&
    run.event === 'pull_request' && Date.parse(run.created_at) > threshold));
  return fresh ? stepState(fresh) : 'missing';
}

async function nextReleaseState(pr, snapshot, { get, live }) {
  const { main, merge, required, observed, reviews } = snapshot;
  if (!pr.merged) {
    if (pr.state !== 'open') return { code: 'HOLD_CLOSED', next: 'Inspect the closed PR.' };
    if (reviews.changesRequested || reviews.currentApprovals < reviews.required) {
      return { code: 'REVIEW_REQUIRED', next: 'Resolve the review decision on the exact HEAD.' };
    }
    if ([...required, ...observed].some(check => check.result === 'missing' || active.includes(check.result))) {
      return { code: 'PR_CI_PENDING', next: 'Wait for exact-HEAD PR checks, including checks triggered by Ready.' };
    }
    if (required.some(check => check.result !== 'success') ||
        observed.some(check => !['success', 'skipped'].includes(check.result))) {
      return { code: 'HOLD_PR_CI', next: 'Inspect the non-passing required check.' };
    }
    const metadata = await readyMetadata(pr, get);
    if (metadata === 'missing' || active.includes(metadata)) {
      return { code: 'PR_CI_PENDING', next: 'Wait for a fresh metadata run created after the Ready event.' };
    }
    if (metadata !== null && metadata !== 'success') {
      return { code: 'HOLD_PR_CI', next: 'Inspect the fresh Ready metadata run.' };
    }
    if (pr.base.sha !== main || pr.mergeable !== true || ['behind', 'dirty', 'blocked', 'unknown'].includes(pr.mergeable_state)) {
      return { code: 'HOLD_PR_BASE', next: 'Re-evaluate current base, mergeability and Repo Guard conditions.' };
    }
    return { code: pr.draft ? 'DRAFT_CHECKS_PASSED' : 'READY_CHECKS_PASSED',
      next: 'The integration owner can assess approvals and run the existing Repo Guard preflight.' };
  }

  if (!shaPattern.test(merge)) throw new Error('HOLD_MERGE: merged PR has no valid merge commit.');
  const [ciRuns, releaseRuns] = await Promise.all([
    workflowRuns(get, 'pages.yml', { head_sha: merge, event: 'push' }),
    workflowRuns(get, workflow, { head_sha: merge, event: 'workflow_dispatch' }),
  ]);
  const ci = latest(ciRuns.filter(run => run.head_sha === merge && run.head_branch === branch && run.event === 'push'));
  const releases = releaseRuns.filter(run => run.head_sha === merge && run.head_branch === branch && run.event === 'workflow_dispatch');
  const current = latest(releases);
  const result = { mainCi: runSummary(ci), production: runSummary(current) };
  if (current) {
    const endpoint = apiRoot + '/actions/runs/' + current.id;
    const [jobs, pending, liveSha] = await Promise.all([
      get(endpoint + '/attempts/' + current.run_attempt + '/jobs?per_page=100', { pages: true }),
      get(endpoint + '/pending_deployments'),
      live(),
    ]);
    return { ...result, liveSha, ...interpretProduction({ run: current, jobs: jobs.flatMap(page => page.jobs), pending, liveSha }) };
  }
  if (main !== merge) return { ...result, code: 'HOLD_SUPERSEDED', next: 'Inspect the current main release candidate.' };
  if (!ci || ci.status !== 'completed') return { ...result, code: 'MAIN_CI_PENDING', next: 'Wait for exact-SHA main CI.' };
  if (ci.conclusion !== 'success') return { ...result, code: 'HOLD_MAIN_CI', next: 'Inspect exact-SHA main CI.' };

  const activeRuns = await Promise.all(active.map(status => workflowRuns(get, workflow, { status })));
  const occupying = latest(activeRuns.flat().filter(run => run.event === 'workflow_dispatch' && run.head_branch === branch));
  if (occupying) return { ...result, occupying: runSummary(occupying), code: 'PRODUCTION_OCCUPIED',
    next: 'Refresh after the existing production run. Use its ID to inspect any Environment wait.' };
  return { ...result, code: 'DISPATCH_REQUIRED', next: 'An authorized operator can assess and start the protected workflow.' };
}

async function readLiveSha() {
  try {
    const response = await fetch('https://www.recipavo.com/', { redirect: 'error', signal: AbortSignal.timeout(10000) });
    const sha = response.headers.get('x-recipavo-commit');
    await response.body?.cancel();
    return response.status === 200 && shaPattern.test(sha) ? sha : null;
  } catch {
    return null;
  }
}

export async function waitForPublish(number, options, {
  inspect = inspectPublish, delay = wait, now = () => performance.now(),
  period = 15000, onChange = () => {},
} = {}) {
  const { seconds, head, base } = options;
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > 1800) {
    throw new Error('Wait requires 1 to 1800 seconds.');
  }
  const until = now() + seconds * 1000;
  const pins = { head, base };
  let previous;
  for (;;) {
    let state;
    try {
      state = await inspect(number, pins);
    } catch (error) {
      const remaining = until - now();
      // A transition during the double read is safe to re-read with the same pins.
      if (remaining <= 0 || !String(error?.message).startsWith('HOLD_CHANGED:')) throw error;
      await delay(Math.min(period, remaining));
      continue;
    }
    pins.head ??= state.head;
    pins.base ??= state.main;
    if (state.code !== previous) {
      onChange(state);
      previous = state.code;
    }
    if (!watchable.has(state.code)) return state;
    const remaining = until - now();
    if (remaining <= 0) return { ...state, waitTimedOut: true };
    await delay(Math.min(period, remaining));
  }
}

export async function cli(argv = process.argv.slice(2)) {
  const { values } = parseArgs({ args: argv, options: {
    pr: { type: 'string' }, prepare: { type: 'boolean' }, template: { type: 'string' }, head: { type: 'string' }, base: { type: 'string' }, json: { type: 'boolean' }, wait: { type: 'string' },
  }, allowPositionals: false });
  const modes = [values.pr, values.prepare, values.template].filter(value => value !== undefined);
  if (modes.length !== 1 || values.pr !== undefined && (!/^[1-9]\d*$/.test(values.pr) || !Number.isSafeInteger(Number(values.pr)))) {
    throw new Error('Usage: recipe:publish -- --pr NUMBER [--wait SECONDS] | --prepare --base SHA --head SHA | --template PATH');
  }
  if (values.wait !== undefined && (values.pr === undefined || !/^[1-9]\d{0,3}$/.test(values.wait) || Number(values.wait) > 1800)) {
    throw new Error('--wait requires --pr and 1 to 1800 seconds.');
  }
  for (const pin of [values.head, values.base]) {
    if (pin !== undefined && !shaPattern.test(pin)) throw new Error('Expected a full lowercase Git SHA.');
  }
  const { stdout } = await exec('git', ['remote', 'get-url', 'origin'], { cwd: root });
  assertOrigin(stdout);
  if (values.template !== undefined) {
    if (values.head || values.base) throw new Error('Template mode reads the Git index.');
    console.log(JSON.stringify(templateFromIndex(values.template), null, 2));
    return;
  }
  if (values.prepare) {
    const plan = await prepareForCurrentMain(values.base, values.head);
    console.log(JSON.stringify(plan, null, 2));
    if (plan.code.startsWith('HOLD_')) process.exitCode = 1;
    return;
  }
  const number = Number(values.pr);
  const result = values.wait === undefined ? await inspectPublish(number, values) : await waitForPublish(number, {
    ...values, seconds: Number(values.wait),
  }, { onChange: state => console.error(state.code + ' â€” ' + state.next) });
  if (values.json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(result.repository + ' #' + result.pr + ' â€” ' + result.code);
    console.log('HEAD ' + result.head + ' | main ' + result.main);
    console.log('PR: ' + result.prState + (result.draft ? ' (Draft)' : '') +
      ' | approvals on HEAD: ' + result.reviews.currentApprovals + '/' + result.reviews.required +
      ' | checks: ' + result.required.map(check => check.name + '=' + check.result).join(', '));
    if (result.merge) console.log('Merge ' + result.merge + ' | main CI ' + (result.mainCi?.conclusion ?? result.mainCi?.status ?? 'missing'));
    for (const run of [result.production, result.occupying].filter(Boolean)) {
      console.log('Run ' + run.id + ' | ' + run.status + ' | ' + run.sha + ' | ' + run.url);
    }
    if (result.upload) console.log('Upload ' + result.upload + ' | verification ' + result.verification + ' | live ' + (result.liveSha ?? 'unknown'));
    console.log(result.next);
    if (result.waitTimedOut) console.log('Monitoring limit reached. Resume with the same PR and SHA pins.');
  }
  if (result.code.startsWith('HOLD_')) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await cli(); }
  catch (error) {
    if (process.argv.includes('--json')) {
      const code = /^HOLD_[A-Z_]+/.exec(error.message)?.[0] ?? 'HOLD_COMMAND';
      console.log(JSON.stringify({ code, error: error.message }));
    } else console.error(error.message);
    process.exitCode = 1;
  }
}
