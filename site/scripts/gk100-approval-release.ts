import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fingerprint } from './gk80-candidate-model';
import { historicalFarinataForApprovedPanVersion } from './gk100-farinata-sealed-source';
import { checkBatch, applyDecisions, type Batch, type Decisions, type prepareRelease } from './gk100-approval-factory';
import type { GkOnlyVariant } from '../src/features/recipes/gk-only-types';
import { gkVariantScope } from '../src/features/recipes/gk-estimate-scope';

type Manifest = ReturnType<typeof checkBatch>['manifest'];
type Bundle = {
  schemaVersion: 1;
  mainSha: string;
  batch: Batch;
  manifest: Manifest;
  decisions: Decisions;
  recipeIds: string[];
  expectedCoverageDelta: number;
  coverageScopeVersion?: 2;
  expectedOriginalCoverageDelta?: number;
  expectedVariantCoverageDelta?: number;
  expectedStudyServingDelta?: number;
  publicationAuthorized: false;
};
type Authorization = { schemaVersion: 1; bundleSha256: string; evidence: string };

export function makeReleaseBundle(checked: ReturnType<typeof checkBatch>, batch: Batch,
  decisions: Decisions, plan: ReturnType<typeof prepareRelease>) {
  const bundle: Bundle = {
    schemaVersion: 1, mainSha: plan.mainSha, batch, manifest: checked.manifest, decisions,
    recipeIds: plan.variants.map(variant => variant.recipeId),
    expectedCoverageDelta: plan.expectedCoverageDelta, coverageScopeVersion: 2,
    expectedOriginalCoverageDelta: plan.expectedOriginalCoverageDelta,
    expectedVariantCoverageDelta: plan.expectedVariantCoverageDelta,
    expectedStudyServingDelta: plan.expectedStudyServingDelta, publicationAuthorized: false,
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
      || bundle.recipeIds.length !== new Set(bundle.recipeIds).size) throw Error('GK100_RELEASE_AUTHORIZATION');
  const { manifestSha256, ...manifest } = bundle.manifest;
  if (manifestSha256 !== fingerprint(manifest)) throw Error('GK100_RELEASE_MANIFEST_HASH');
  const entries = bundle.batch.candidates.filter(entry => bundle.recipeIds.includes(entry.recipeId));
  if (entries.length !== bundle.recipeIds.length) throw Error('GK100_RELEASE_SCOPE');
  // The approved 18-version bundle includes a *separate* pan-farinata GK.
  // Preserve its sealed original source only for the exact reviewed oven-recipe
  // editorial correction. Unreviewed source changes still fail the manifest.
  const checked = checkBatch({ ...bundle.batch, candidates: entries }, (file) => {
    const source = read(file);
    return bundle.batch.batchId === 'gk100-owner-approved-eighteen'
      && bundle.recipeIds.includes('valimerellinen-farinata-aamupalaksi')
      ? historicalFarinataForApprovedPanVersion(file, source)
      : source;
  });
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
  const variants = applied.map(row => {
    const variant = checked.variants.get(row.recipeId);
    if (row.state !== 'OWNER_APPROVED' || !variant) throw Error('GK100_RELEASE_OWNER_APPROVAL');
    return variant;
  });
  if (bundle.coverageScopeVersion === undefined && [bundle.expectedOriginalCoverageDelta, bundle.expectedVariantCoverageDelta, bundle.expectedStudyServingDelta].some(value => value !== undefined)) {
    throw Error('GK100_RELEASE_COVERAGE_SCOPE');
  }
  const homeCount = bundle.coverageScopeVersion === 2
    ? variants.filter(variant => gkVariantScope(variant) === 'RECIPE_VARIANT').length
    : variants.filter(variant => !variant.studyServing).length;
  if (bundle.coverageScopeVersion !== undefined && bundle.coverageScopeVersion !== 2) throw Error('GK100_RELEASE_COVERAGE_SCOPE');
  if (bundle.coverageScopeVersion === 2 && (bundle.expectedOriginalCoverageDelta !== 0
      || bundle.expectedVariantCoverageDelta !== homeCount
      || bundle.expectedStudyServingDelta !== variants.length - homeCount)) throw Error('GK100_RELEASE_COVERAGE_SCOPE');
  if (bundle.expectedCoverageDelta !== homeCount) {
    throw Error('GK100_RELEASE_COVERAGE_DELTA');
  }
  return variants;
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
