import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeTemplate, readRecipeIdentity } from './new-recipe-preflight.mjs';

const site = fileURLToPath(new URL('../', import.meta.url));
const root = path.dirname(site);
const sourcePath = /^reseptit\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)\/(?:[^/\\:]+\/)*[^/\\:]+\.md$/;
const translationPath = /^kaannokset\/(en|sv|th)\/(?:[^/\\:]+\/)+[^/\\:]+\.md$/;
const imagePath = /^kuvat\/(?:[^/\\:]+\/)+[^/\\:]+\.webp$/;
const shaPattern = /^[0-9a-f]{40}$/;
const sharedPaths = new Set([
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
    entries.push({ file, read: () => {
      const canonical = git(directory, ['show', head + ':' + file]);
      if (readFileSync(path.join(directory, file), 'utf8') !== canonical) {
        throw new Error('HOLD_BYTES: checked-out recipe differs from its canonical blob: ' + file);
      }
      return canonical;
    } });
  }

  const batch = collectCandidates(entries);
  const env = { ...process.env, BASE_SHA: base, HEAD_SHA: head };
  const editorial = editorialResults(directory, base, head, env);
  const candidates = [];
  for (const group of batch.groups.filter(item => item.published.length)) {
    const paths = [...group.published.map(item => item.path), ...group.evidence];
    const reasons = editorial.get(group.id)?.reasons ?? [];
    if (!reasons.length) {
      try {
        runNode(directory, 'scripts/validate-changed-content.ts',
          paths.filter(file => !file.startsWith('docs/reviews/')), env);
      } catch (error) {
        reasons.push(String(error.stderr || error.message).trim().slice(0, 3000));
      }
    }
    candidates.push({ ...group, paths, reasons, status: reasons.length ? 'HOLD' : 'CONTENT_CHECKS_PASSED' });
  }
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
