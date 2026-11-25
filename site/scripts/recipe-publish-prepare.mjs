import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNewPublication, makeTemplate, readRecipeIdentity } from './new-recipe-preflight.mjs';

const site = fileURLToPath(new URL('../', import.meta.url));
const root = path.dirname(site);
const sourcePath = /^reseptit\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)\/(?:[^/\\:]+\/)*[^/\\:]+\.md$/;
const translationPath = /^kaannokset\/(en|sv|th)\/(?:[^/\\:]+\/)+[^/\\:]+\.md$/;
const imagePath = /^kuvat\/(?:[^/\\:]+\/)+[^/\\:]+\.webp$/;
const shaPattern = /^[0-9a-f]{40}$/;
const pendingGkPath = 'docs/nutrition/new-public-gk-pending-sources.json';
const sharedPaths = new Set([
  pendingGkPath,
  'assets/images.tracked-overlays.json',
  'meta/kaannokset/codex-review-evidence.json',
  'meta/kaannokset/published-translation-pairs.json',
]);

function git(directory, args) {
  return execFileSync('git', args, { cwd: directory, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'] });
}

export function templateFromIndex(file, directory = root) {
  if (!sourcePath.test(file) || path.posix.normalize(file) !== file) {
    throw new Error('Expected a canonical Finnish recipe path.');
  }
  try {
    return makeTemplate(file, git(directory, ['show', ':' + file]));
  } catch (error) {
    throw new Error('Cannot prepare the editorial template from the staged Finnish source: ' + error.message);
  }
}

function runNode(directory, script, values, env) {
  return execFileSync(process.execPath, [...(script.endsWith('.ts') ? ['--import', 'tsx'] : []), script, ...values], {
    cwd: path.join(directory, 'site'), env, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 120000,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function editorialResults(directory, base, head, env) {
  const args = ['--base=' + base, '--head=' + head, '--json'];
  let stdout;
  try {
    stdout = runNode(directory, 'scripts/new-recipe-preflight.mjs', args, env);
  } catch (error) {
    if (error.status !== 1 || !error.stdout) throw error;
    stdout = error.stdout;
  }
  return new Map(JSON.parse(stdout).assessments.map(row => [row.recipeId, row]));
}

export function collectCandidates(entries) {
  const groups = new Map();
  const evidence = [];
  const shared = [];
  const excluded = [];
  for (const { file, read } of entries) {
    const locale = sourcePath.test(file) ? 'fi' : translationPath.exec(file)?.[1];
    if (locale) {
      const identity = readRecipeIdentity(read());
      if (identity.language !== locale || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identity.recipe_id)) {
        throw new Error('Invalid recipe identity at ' + file);
      }
      const group = groups.get(identity.recipe_id) ?? { id: identity.recipe_id, published: [], drafts: [], evidence: [] };
      const version = { path: file, locale, slug: identity.url_slug };
      if (identity.status === 'published') group.published.push(version);
      else if (identity.status === 'draft') {
        group.drafts.push(version);
        excluded.push(file);
      } else throw new Error('Unsupported recipe status at ' + file);
      groups.set(identity.recipe_id, group);
    } else if (sharedPaths.has(file) || imagePath.test(file) || /^docs\/nutrition\/batches\/batch-[0-9]+\.json$/.test(file)) {
      shared.push(file);
    } else {
      const match = /^docs\/(?:reviews\/new-recipes|nutrition\/calculations)\/([a-z0-9-]+)\.json$/.exec(file);
      if (!match) throw new Error('Unsupported file in recipe-only candidate: ' + file);
      evidence.push({ file, id: match[1] });
    }
  }
  for (const { file, id } of evidence) {
    const group = groups.get(id);
    if (!group) throw new Error('Evidence file has no changed recipe identity: ' + file);
    if (group.published.length) group.evidence.push(file);
    else excluded.push(file);
  }
  return { groups: [...groups.values()], shared, excluded };
}

// This is a recipe-only scope check, not approval of an unknown or numeric GK value.
export function validatePendingGkChanges(previous, current, changedSources) {
  for (const registry of [previous, current]) {
    if (!registry || typeof registry !== 'object' || Array.isArray(registry) ||
        Object.entries(registry).some(([id, sha]) =>
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || typeof sha !== 'string' || !shaPattern.test(sha))) {
      throw new Error('HOLD_GK_PENDING: invalid pending source registry.');
    }
  }
  for (const id of Object.keys(previous)) {
    if (!Object.hasOwn(current, id) || current[id] !== previous[id]) {
      throw new Error('HOLD_GK_PENDING: removal or rebinding requires a separate GK review: ' + id);
    }
  }
  for (const [id, sha] of Object.entries(current)) {
    const changed = changedSources.get(id);
    const added = !Object.hasOwn(previous, id);
    if (added && !changed?.newPublication) {
      throw new Error('HOLD_GK_PENDING: registry addition is outside the new FI candidate: ' + id);
    }
    if (changed && changed.sha !== sha) {
      throw new Error('HOLD_GK_PENDING: source blob does not match the candidate: ' + id);
    }
  }
}

// Successful batches use the same validator as CI with all eligible paths.
// On failure, retain individual diagnostics but never turn an unexplained
// combined failure into a successful batch.
export function validateCandidateGroups(candidates, validate) {
  const results = candidates.map(candidate => ({ ...candidate, reasons: [...candidate.reasons] }));
  const eligible = results.filter(candidate => !candidate.reasons.length);
  const check = groups => validate(groups.flatMap(group =>
    group.paths.filter(file => !file.startsWith('docs/reviews/'))));
  const reason = error => String(error?.stderr || error?.message || error || 'Changed-content validation failed')
    .trim().slice(0, 3000) || 'Changed-content validation failed';
  if (eligible.length) {
    try {
      check(eligible);
    } catch (error) {
      const combinedReason = reason(error);
      if (eligible.length === 1) {
        eligible[0].reasons.push(combinedReason);
      } else {
        for (const candidate of eligible) {
          try {
            check([candidate]);
          } catch (individualError) {
            candidate.reasons.push(reason(individualError));
          }
        }
        if (eligible.every(candidate => !candidate.reasons.length)) {
          for (const candidate of eligible) {
            candidate.reasons.push('Combined changed-content validation failed: ' + combinedReason);
          }
        }
      }
    }
  }
  return results.map(candidate => ({
    ...candidate, status: candidate.reasons.length ? 'HOLD' : 'CONTENT_CHECKS_PASSED',
  }));
}

export function prepareBatch(base, expectedHead, directory = root) {
  if (!shaPattern.test(base) || !shaPattern.test(expectedHead)) {
    throw new Error('Preparation requires full --base and --head SHAs.');
  }
  const head = git(directory, ['rev-parse', 'HEAD']).trim();
  const workBranch = git(directory, ['branch', '--show-current']).trim();
  if (head !== expectedHead || !workBranch || workBranch === 'main') {
    throw new Error('HOLD_HEAD: check out the exact candidate on its work branch.');
  }
  if (git(directory, ['status', '--porcelain', '--untracked-files=normal']).trim()) {
    throw new Error('HOLD_WORKTREE: commit the candidate locally and use a clean worktree.');
  }
  git(directory, ['merge-base', '--is-ancestor', base, head]);
  const diff = git(directory, ['diff', '--name-status', '-z', '--no-renames', base, head, '--']).split('\0');
  const entries = [];
  for (let i = 0; i < diff.length - 1; i += 2) {
    const [status, file] = diff.slice(i, i + 2);
    if (!['A', 'M'].includes(status)) throw new Error('Candidate contains an unsupported removal or type change: ' + file);
    entries.push({ file, status, read: () => {
      const canonical = git(directory, ['show', head + ':' + file]);
      if (readFileSync(path.join(directory, file), 'utf8') !== canonical) {
        throw new Error('HOLD_BYTES: checked-out recipe differs from its canonical blob: ' + file);
      }
      return canonical;
    } });
  }

  const batch = collectCandidates(entries);
  const pendingEntry = entries.find(entry => entry.file === pendingGkPath);
  const changedFi = batch.groups.flatMap(group => group.published
    .filter(version => version.locale === 'fi').map(version => ({ id: group.id, ...version })));
  if (pendingEntry || changedFi.length) {
    const previous = JSON.parse(git(directory, ['show', base + ':' + pendingGkPath]));
    const current = pendingEntry ? JSON.parse(pendingEntry.read()) : previous;
    const changedSources = new Map();
    for (const version of changedFi) {
      if (changedSources.has(version.id)) {
        throw new Error('HOLD_GK_PENDING: multiple changed Finnish sources: ' + version.id);
      }
      const entry = entries.find(item => item.file === version.path);
      // Previous identity is only needed when introducing a new pending row.
      // Match the editorial gate's handling of an empty previous source.
      const addingPending = !Object.hasOwn(previous, version.id) && Object.hasOwn(current, version.id);
      const oldSource = addingPending && entry.status !== 'A'
        ? git(directory, ['show', base + ':' + version.path]) : null;
      const oldIdentity = oldSource ? readRecipeIdentity(oldSource) : null;
      changedSources.set(version.id, {
        sha: git(directory, ['rev-parse', head + ':' + version.path]).trim(),
        newPublication: addingPending &&
          isNewPublication({ recipe_id: version.id, language: 'fi', status: 'published' }, oldIdentity),
      });
    }
    validatePendingGkChanges(previous, current, changedSources);
  }
  const env = { ...process.env, BASE_SHA: base, HEAD_SHA: head };
  const editorial = editorialResults(directory, base, head, env);
  const candidates = validateCandidateGroups(batch.groups.filter(item => item.published.length).map(group => ({
    ...group,
    paths: [...group.published.map(item => item.path), ...group.evidence],
    reasons: editorial.get(group.id)?.reasons ?? [],
  })), paths => runNode(directory, 'scripts/validate-changed-content.ts', paths, env));
  if (candidates.some(item => !item.reasons.length)) {
    const python = process.platform === 'win32' ? 'python' : 'python3';
    try {
      const pythonOptions = { cwd: directory, stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 };
      if (env.PROJECT_IMAGE_ROOT) {
        execFileSync(python, ['-B', 'site/scripts/restore-image-inputs.py', '--manifest',
          'assets/images.manifest.json', '--project', 'ozirix-dev/Reseptit',
          '--verify-root', env.PROJECT_IMAGE_ROOT], pythonOptions);
      }
      execFileSync(python, ['-B', 'site/scripts/verified_image_overlay.py', '--manifest',
        'assets/images.tracked-overlays.json', '--source-root', 'kuvat',
        '--image-root', env.PROJECT_IMAGE_ROOT || 'kuvat', '--mode', 'verify'], pythonOptions);
      const imageFiles = ['assets/images.manifest.json', 'assets/images.tracked-overlays.json']
        .flatMap(file => JSON.parse(git(directory, ['show', head + ':' + file])).files.map(item => 'kuvat/' + item.path));
      for (const file of batch.shared.filter(file => imagePath.test(file))) {
        if (!imageFiles.includes(file)) throw new Error('Candidate image has no approved manifest entry: ' + file);
      }
    } catch (error) {
      // Existing overlay verification is global. Do not emit an apparently ready candidate when it fails.
      return { base, head, candidates, shared: batch.shared, excluded: batch.excluded,
        code: 'HOLD_IMAGES', error: String(error.stderr || error.message).trim().slice(0, 1500) };
    }
  }
  if (git(directory, ['rev-parse', 'HEAD']).trim() !== head ||
      git(directory, ['status', '--porcelain', '--untracked-files=normal']).trim()) {
    throw new Error('HOLD_CHANGED: candidate changed during inspection.');
  }
  const complete = candidates.length && candidates.every(item => !item.reasons.length) && !batch.excluded.length;
  return { base, head, candidates, shared: batch.shared, excluded: batch.excluded,
    code: complete ? 'PREPARATION_CHECKS_PASSED' : 'HOLD_BATCH',
    files: complete ? [...candidates.flatMap(item => item.paths), ...batch.shared].sort() : [] };
}
