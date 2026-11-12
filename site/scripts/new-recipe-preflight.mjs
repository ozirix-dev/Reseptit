/**
 * New FI recipe release gate: checks evidence before a new recipe is published.
 * Existing published recipe edits remain governed by the current content checks.
 * This validates evidence provenance, NOT culinary truth or a physical cook test.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const RECIPE_PATH = /^reseptit\/(?:alkuruoat|paaruoat|jalkiruoat|leivonnaiset|aamupalat|valipalat)\/(?:[^/\\]+\/)*[^/\\]+\.md$/;
const isRecipePath = (file) => RECIPE_PATH.test(file) && path.posix.normalize(file) === file;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REQUIRED_CHECKS = ['duplicates', 'ingredients', 'method', 'food_safety', 'servings_and_time', 'nutrition', 'glycemic'];

export function hashContent(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function readRecipeIdentity(source) {
  const frontmatter = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(source);
  assert(frontmatter, 'YAML frontmatter missing');
  const scalar = (key) => {
    const match = new RegExp('^' + key + ':\\s*(.*?)\\s*$', 'm').exec(frontmatter[1]);
    assert(match, 'Missing recipe field: ' + key);
    const raw = match[1].trim();
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw.slice(1, -1);
    return raw.split(/\s+#/)[0].trim();
  };
  return { recipe_id: scalar('recipe_id'), url_slug: scalar('url_slug'), language: scalar('language'), status: scalar('status') };
}

export function isNewPublication(current, previous) {
  return current?.status === 'published' && (previous?.status !== 'published' ||
    previous.recipe_id !== current.recipe_id || previous.language !== current.language);
}

function listRecipes(root) {
  const base = path.join(root, 'reseptit');
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true, recursive: true })
    .filter(entry => entry.isFile())
    .map(entry => path.relative(root, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))
    .filter(isRecipePath);
}

export function validateReview(recipePath, source, review, allRecipes = []) {
  const errors = [];
  let identity;
  try { identity = readRecipeIdentity(source); } catch (error) { return [String(error.message)]; }
  if (!isRecipePath(recipePath) || !ID.test(identity.recipe_id)) errors.push('invalid canonical FI recipe path or ID');
  if (identity.language !== 'fi' || identity.status !== 'published') errors.push('expected published Finnish source');
  const occurrences = allRecipes.filter((row) => row.path !== recipePath &&
    (row.recipe_id === identity.recipe_id || row.url_slug === identity.url_slug));
  if (occurrences.length) errors.push('recipe_id/url_slug already exists: ' + occurrences.map((r) => r.path).join(', '));
  if (!review || typeof review !== 'object' || Array.isArray(review)) return [...errors, 'review evidence missing'];
  if (review.schema_version !== 1 || review.decision !== 'approved') errors.push('review decision is not approved (schema_version=1)');
  if (review.recipe_id !== identity.recipe_id || review.source_path !== recipePath) errors.push('review source identity mismatch');
  if (review.source_sha256 !== hashContent(source)) errors.push('review source_sha256 stale or incorrect');
  if (typeof review.reviewed_by !== 'string' || review.reviewed_by.trim().length < 3 || review.reviewed_by === 'UNREVIEWED') errors.push('reviewer attribution missing');
  if (typeof review.reviewed_at !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewed_at) || Number.isNaN(Date.parse(review.reviewed_at))) errors.push('review date missing or invalid');
  const origin = review.origin ?? {};
  if (!['original', 'adaptation'].includes(origin.kind)) errors.push('origin.kind must be original or adaptation');
  if (origin.kind === 'adaptation' && (!Array.isArray(origin.sources) || !origin.sources.length ||
    !origin.sources.every((url) => typeof url === 'string' && /^https:\/\//.test(url)))) errors.push('adaptation requires HTTPS source URL(s)');
  for (const check of REQUIRED_CHECKS) {
    const item = review.checks?.[check];
    if (!item || !['pass', ...(check === 'glycemic' ? ['unavailable'] : [])].includes(item.status) ||
      typeof item.notes !== 'string' || item.notes.trim().length < 20) errors.push(check + ': documented review PASS required (glycemic may be unavailable with explanation)');
  }
  if (typeof review.nutrition_evidence !== 'string' || !review.nutrition_evidence.trim()) errors.push('independent nutrition evidence reference required');
  return errors;
}

export function makeTemplate(recipePath, source) {
  const { recipe_id } = readRecipeIdentity(source);
  return {
    schema_version: 1, recipe_id, source_path: recipePath,
    source_sha256: hashContent(source), decision: 'hold',
    reviewed_by: 'UNREVIEWED', reviewed_at: '',
    origin: { kind: 'original', sources: [] },
    nutrition_evidence: '',
    checks: Object.fromEntries(REQUIRED_CHECKS.map((name) => [name, { status: 'pending', notes: '' }])),
  };
}

function git(args, root = ROOT) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
}

export function changesFromDiff(diff) {
  const fields = diff.split('\0');
  const changes = [];
  for (let i = 0; i < fields.length - 1;) {
    const status = fields[i++];
    const action = status[0];
    const firstPath = fields[i++];
    const renamed = action === 'R';
    const file = renamed || action === 'C' ? fields[i++] : firstPath;
    if (/^[ACMR]$/.test(action) && isRecipePath(file)) {
      changes.push({ file, previousFile: renamed || action === 'M' ? firstPath : null });
    }
  }
  return changes;
}

function previousSource(root, base, file) {
  try { return git(['show', base + ':' + file], root); } catch { return null; }
}

function reviewFile(root, recipePath, id) {
  const filename = path.join(root, 'docs', 'reviews', 'new-recipes', id + '.json');
  if (!existsSync(filename)) return null;
  try { return JSON.parse(readFileSync(filename, 'utf8')); }
  catch (error) { throw new Error(recipePath + ': invalid review JSON: ' + error.message); }
}

function inventory(root) {
  const items = [];
  for (const file of listRecipes(root)) {
    try { items.push({ path: file, ...readRecipeIdentity(readFileSync(path.join(root, file), 'utf8')) }); }
    catch { /* The existing content validator reports malformed legacy files. */ }
  }
  return items;
}

export function runCli(root = ROOT, argv = process.argv.slice(2), env = process.env) {
  const argValue = (name) => argv.find((arg) => arg.startsWith(name + '='))?.slice(name.length + 1);
  const templatePath = argValue('--template');
  if (templatePath) {
    assert(isRecipePath(templatePath), 'Provide a canonical FI recipe path');
    const source = readFileSync(path.join(root, templatePath), 'utf8');
    console.log(JSON.stringify(makeTemplate(templatePath, source), null, 2));
    return { checked: 0, candidates: 0 };
  }
  const single = argValue('--recipe');
  const base = argValue('--base') || env.BASE_SHA;
  const head = argValue('--head') || env.HEAD_SHA || 'HEAD';
  if (!single && !base) throw new Error('BASE_SHA is required (or use --recipe=path / --template=path)');
  if (single && !isRecipePath(single)) throw new Error('Invalid recipe path');
  const candidates = single ? [{ file: single, previousFile: null }] :
    changesFromDiff(git(['diff', '--name-status', '-z', '--find-renames', base, head, '--', 'reseptit/'], root));
  const json = argv.includes('--json');
  const assessments = [];
  const all = inventory(root);
  for (const { file, previousFile } of candidates) {
    const source = readFileSync(path.join(root, file), 'utf8');
    const current = readRecipeIdentity(source);
    // A draft directory is outside the published recipe tree, regardless of its metadata.
    const previous = previousFile && isRecipePath(previousFile) ? previousSource(root, base, previousFile) : null;
    const oldIdentity = previous ? readRecipeIdentity(previous) : null;
    if (!single && !isNewPublication(current, oldIdentity)) continue;
    if (current.status !== 'published') continue;
    const review = reviewFile(root, file, current.recipe_id);
    const errors = validateReview(file, source, review, all);
    const code = errors.length ? 'HOLD_NEW_RECIPE_EVIDENCE' : 'EDITORIAL_EVIDENCE_CURRENT';
    assessments.push({ recipeId: current.recipe_id, path: file, code, reasons: errors });
    if (!json) {
      if (errors.length) console.error('HOLD ' + file + ':\n  - ' + errors.join('\n  - '));
      else console.log('PASS ' + file + ': SHA-bound editorial approval verified');
    }
  }
  const checked = assessments.length;
  const blocked = assessments.filter(row => row.reasons.length > 0).length;
  const result = { checked, candidates: candidates.length, blocked, assessments };
  if (json) console.log(JSON.stringify(result));
  else console.log('New-recipe gate: ' + checked + ' published candidate(s), ' + blocked + ' HOLD; untouched published recipes and drafts unaffected.');
  if (blocked) throw new Error('New recipe publication blocked pending documented review');
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { runCli(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
