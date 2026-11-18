/**
 * Persistent, read-only research gate for reviewed NO_RELIABLE_GK decisions.
 * Recording a HOLD never changes the public GK, HH, F25 or safety approval.
 * node site/scripts/gk-review-stop-gate.mjs check --id idli-sambar
 * node site/scripts/gk-review-stop-gate.mjs record --id idli-sambar --recipe-path reseptit/paaruoat/idli-sambar.md
 *   --evidence docs/nutrition/gk100-idli-sambar-component-review.md --source https://doi.org/example
 *   --reason "Preparation-specific human GI evidence is missing" --review-ref https://github.com/ozirix-dev/Reseptit/issues/717
 *   --reviewer "reviewer" --reviewed-at 2026-11-18
 */
import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../../', import.meta.url));
const registryPath = 'docs/nutrition/gk-review-stops.json';
const hash = value => createHash('sha256').update(value).digest('hex');
const lf = text => text.replaceAll('\r\n', '\n');
const validId = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const validUrl = value => typeof value === 'string' && /^https:\/\/[^\s]+$/.test(value);
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const originalPath = value => typeof value === 'string' && /^reseptit\/[a-z0-9-]+\/[a-z0-9-]+\.md$/.test(value);

function sourceFile(root, name) {
  if (typeof name !== 'string' || !/^[a-zA-Z0-9_./-]+\.(?:md|json|txt)$/.test(name)
      || name.startsWith('/') || name.split('/').includes('..') || name.includes('\\')) {
    throw new Error('Unsafe repository file path: ' + name);
  }
  const base = realpathSync(root);
  const full = realpathSync(path.join(base, name));
  if (!full.startsWith(base + path.sep)) throw new Error('File escapes repository: ' + name);
  return full;
}
const fileHash = (root, name) => hash(lf(readFileSync(sourceFile(root, name), 'utf8')));
function readRegistry(root) {
  const data = JSON.parse(readFileSync(sourceFile(root, registryPath), 'utf8'));
  if (data.schemaVersion !== 1 || !Array.isArray(data.decisions)) throw new Error('Invalid GK research registry');
  for (const row of data.decisions) {
    if (!validId(row.recipeId) || row.status !== 'NO_RELIABLE_GK'
      || !originalPath(row.recipePath) || path.posix.basename(row.recipePath) !== row.recipeId + '.md'
      || !/^[a-f0-9]{64}$/.test(row.recipeSha256 || '')
      || !Array.isArray(row.evidenceFiles) || !row.evidenceFiles.length
      || !row.evidenceFiles.every(v => v && typeof v.path === 'string' && /^[a-f0-9]{64}$/.test(v.sha256 || ''))
      || !Array.isArray(row.sourceUrls) || !row.sourceUrls.length || !row.sourceUrls.every(validUrl)
      || !validUrl(row.reviewRef) || !validDate(row.reviewedAt)
      || typeof row.reviewedBy !== 'string' || !row.reviewedBy.trim()
      || typeof row.reason !== 'string' || row.reason.trim().length < 20) {
      throw new Error('Invalid GI/GK research HOLD in registry');
    }
    const { decisionSha256, ...body } = row;
    if (decisionSha256 !== hash(JSON.stringify(body))) throw new Error('Modified HOLD without review: ' + row.recipeId);
  }
  return data;
}
function recipeHash(root, id, name) {
  if (!originalPath(name) || path.posix.basename(name) !== id + '.md') throw new Error('Wrong original recipe identity/path');
  const content = lf(readFileSync(sourceFile(root, name), 'utf8'));
  if (!new RegExp('^recipe_id:\\s*' + id + '\\s*$', 'm').test(content)
      || !/^status:\s*published\s*$/m.test(content)) {
    throw new Error('Original recipe is not published or its identity changed');
  }
  return hash(content);
}
function parseArgs(argv) {
  const [mode, ...list] = argv;
  if (!['check', 'record'].includes(mode)) throw new Error('Use check or record');
  const allowed = new Set(['id','recipe-path','evidence','source','reason','review-ref','reviewer','reviewed-at','repo-root','new-evidence']);
  const multi = new Set(['id','evidence','source']);
  const opts = {};
  for (let i = 0; i < list.length; i += 2) {
    const key = list[i]?.replace(/^--/, '');
    if (!list[i]?.startsWith('--') || !allowed.has(key) || !list[i+1] || list[i+1].startsWith('--'))
      throw new Error('Invalid option: ' + list[i]);
    if (multi.has(key)) (opts[key] ??= []).push(list[i+1]);
    else if (opts[key] === undefined) opts[key] = list[i+1];
    else throw new Error('Repeated option: ' + key);
  }
  return { mode, opts };
}
function check(root, data, id, newEvidence) {
  const last = data.decisions.findLast(item => item.recipeId === id);
  if (!last) return { recipeId: id, action: 'REVIEW_REQUIRED', reason: 'NO_RECORDED_DECISION' };
  if (newEvidence) return { recipeId: id, action: 'REVIEW_REQUIRED', reason: 'NEW_EVIDENCE_OR_EXPLICIT_REVIEW', detail: newEvidence };
  try {
    if (recipeHash(root, id, last.recipePath) !== last.recipeSha256)
      return { recipeId: id, action: 'REVIEW_REQUIRED', reason: 'RECIPE_CHANGED' };
    if (last.evidenceFiles.some(item => fileHash(root, item.path) !== item.sha256))
      return { recipeId: id, action: 'REVIEW_REQUIRED', reason: 'EVIDENCE_CHANGED' };
  } catch (error) {
    // Never suppress research when the binding is missing or cannot be verified.
    return { recipeId: id, action: 'REVIEW_REQUIRED', reason: 'BINDING_UNAVAILABLE', detail: String(error.message) };
  }
  return { recipeId: id, action: 'SKIP_REPEAT_GI_RESEARCH',
    reason: 'SAME_REVIEWED_RECIPE_AND_EVIDENCE', decisionSha256: last.decisionSha256, reviewRef: last.reviewRef };
}
function record(root, data, opts) {
  if (opts.id?.length !== 1 || !validId(opts.id[0])) throw new Error('Record exactly one original recipe ID');
  if (!Array.isArray(opts.evidence) || !opts.evidence.length || new Set(opts.evidence).size !== opts.evidence.length)
    throw new Error('At least one distinct tracked research evidence file is required');
  if (!Array.isArray(opts.source) || !opts.source.length || !opts.source.every(validUrl))
    throw new Error('At least one HTTPS source reference is required');
  if (!validUrl(opts['review-ref']) || !validDate(opts['reviewed-at'])
      || typeof opts.reviewer !== 'string' || !opts.reviewer.trim()
      || typeof opts.reason !== 'string' || opts.reason.trim().length < 20)
    throw new Error('Review reference, date, reviewer and specific blocking reason required');
  const id = opts.id[0];
  const body = {
    recipeId: id, status: 'NO_RELIABLE_GK', recipePath: opts['recipe-path'],
    recipeSha256: recipeHash(root, id, opts['recipe-path']),
    evidenceFiles: opts.evidence.map(name => ({ path: name, sha256: fileHash(root, name) })),
    sourceUrls: [...new Set(opts.source)], reviewRef: opts['review-ref'],
    reviewedAt: opts['reviewed-at'], reviewedBy: opts.reviewer.trim(), reason: opts.reason.trim()
  };
  const last = data.decisions.findLast(item => item.recipeId === id);
  if (last && last.recipeSha256 === body.recipeSha256
      && JSON.stringify(last.evidenceFiles) === JSON.stringify(body.evidenceFiles))
    throw new Error('Identical HOLD already recorded: use check or provide new evidence');
  const decision = { ...body, decisionSha256: hash(JSON.stringify(body)) };
  data.decisions.push(decision);
  writeFileSync(sourceFile(root, registryPath), JSON.stringify(data, null, 2) + '\n', 'utf8');
  return { recipeId: id, action: 'RECORDED_RESEARCH_HOLD', decisionSha256: decision.decisionSha256 };
}
try {
  const { mode, opts } = parseArgs(process.argv.slice(2));
  const root = opts['repo-root'] ? path.resolve(opts['repo-root']) : defaultRoot;
  const data = readRegistry(root);
  if (mode === 'check') {
    if (!opts.id?.length || !opts.id.every(validId)) throw new Error('One or more --id required');
    if (['recipe-path','evidence','source','reason','review-ref','reviewer','reviewed-at'].some(key => key in opts))
      throw new Error('Unsupported option for check');
    console.log(JSON.stringify({ outcomes: [...new Set(opts.id)].map(id => check(root, data, id, opts['new-evidence'])) }, null, 2));
  } else {
    if ('new-evidence' in opts) throw new Error('--new-evidence is only for check');
    console.log(JSON.stringify(record(root, data, opts), null, 2));
  }
} catch (error) {
  console.error('GK research stop gate: ' + error.message);
  process.exitCode = 2;
}
