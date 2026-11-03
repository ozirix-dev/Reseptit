import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fingerprint } from './gk80-candidate-model';
import { checkBatch, applyDecisions, type Batch, type Decisions, type prepareRelease } from './gk100-approval-factory';
import type { GkOnlyVariant } from '../src/features/recipes/gk-only-types';

type Manifest = ReturnType<typeof checkBatch>['manifest'];
type Bundle = {
  schemaVersion: 1;
  mainSha: string;
  batch: Batch;
  manifest: Manifest;
  decisions: Decisions;
  recipeIds: string[];
  expectedCoverageDelta: number;
  publicationAuthorized: false;
};
type Authorization = { schemaVersion: 1; bundleSha256: string; evidence: string };

export function makeReleaseBundle(checked: ReturnType<typeof checkBatch>, batch: Batch,
  decisions: Decisions, plan: ReturnType<typeof prepareRelease>) {
  const bundle: Bundle = {
    schemaVersion: 1, mainSha: plan.mainSha, batch, manifest: checked.manifest, decisions,
    recipeIds: plan.variants.map(variant => variant.recipeId),
    expectedCoverageDelta: plan.expectedCoverageDelta, publicationAuthorized: false,
  };
  return { ...bundle, bundleSha256: fingerprint(bundle) };
}

export function verifyReleaseBundle(sealed: Bundle & { bundleSha256: string }, authorization: Authorization,
  read: (file: string) => string): GkOnlyVariant[] {
  const { bundleSha256, ...bundle } = sealed;
  if (bundle.schemaVersion !== 1 || bundle.publicationAuthorized !== false
      || bundleSha256 !== fingerprint(bundle) || authorization.schemaVersion !== 1
      || authorization.bundleSha256 !== bundleSha256 || typeof authorization.evidence !== 'string'
      || !authorization.evidence.trim() || !Array.isArray(bundle.recipeIds) || bundle.recipeIds.length === 0
      || bundle.recipeIds.length !== new Set(bundle.recipeIds).size
      || bundle.recipeIds.length !== bundle.expectedCoverageDelta) throw Error('GK100_RELEASE_AUTHORIZATION');
  const { manifestSha256, ...manifest } = bundle.manifest;
  if (manifestSha256 !== fingerprint(manifest)) throw Error('GK100_RELEASE_MANIFEST_HASH');
  const entries = bundle.batch.candidates.filter(entry => bundle.recipeIds.includes(entry.recipeId));
  if (entries.length !== bundle.recipeIds.length) throw Error('GK100_RELEASE_SCOPE');
  const checked = checkBatch({ ...bundle.batch, candidates: entries }, read);
  const decisions = bundle.decisions;
  if (decisions.manifestSha256 !== manifestSha256) throw Error('GK100_RELEASE_DECISION_HASH');
  for (const row of checked.manifest.candidates) {
    const original = bundle.manifest.candidates.find(item => item.recipeId === row.recipeId);
    if (row.technical !== 'PASS' || !original || fingerprint(row) !== fingerprint(original)) throw Error('GK100_RELEASE_CANDIDATE_CHANGED');
  }
  const applied = applyDecisions(checked, {
    ...decisions, manifestSha256: checked.manifest.manifestSha256,
    records: decisions.records.filter(record => bundle.recipeIds.includes(record.recipeId)),
  });
  return applied.map(row => {
    const variant = checked.variants.get(row.recipeId);
    if (row.state !== 'OWNER_APPROVED' || !variant) throw Error('GK100_RELEASE_OWNER_APPROVAL');
    return variant;
  });
}

export function loadAuthorizedGk100Variants(root: string): GkOnlyVariant[] {
  const folder = join(root, 'docs/nutrition/gk100-approved-releases');
  const read = (file: string) => {
    const absolute = join(root, file);
    if (relative(realpathSync(root), realpathSync(absolute)).replaceAll('\\', '/') !== file) {
      throw Error('GK100_RELEASE_PATH');
    }
    return readFileSync(absolute, 'utf8');
  };
  let files: string[];
  try {
    files = readdirSync(folder);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  return files.sort().flatMap(file => {
    if (!/^[a-z0-9-]+\.json$/.test(file)) throw Error('GK100_RELEASE_FILE');
    const { bundle, authorization } = JSON.parse(read('docs/nutrition/gk100-approved-releases/' + file));
    return verifyReleaseBundle(bundle, authorization, read);
  });
}
