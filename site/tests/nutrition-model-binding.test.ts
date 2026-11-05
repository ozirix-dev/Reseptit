import test from 'node:test';
import assert from 'node:assert/strict';
import {copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {loadPadSeeEw} from '../scripts/gk-next-seven';
import {buildTehoajoVariants} from '../scripts/gk-tehoajo-era1';
import {loadApprovedFour} from '../scripts/gk-next-four';
import {textHash} from '../scripts/gk149-model';
import {acceptsReviewedNutritionModelBinding} from '../scripts/reviewed-nutrition-model-binding';

const root = fileURLToPath(new URL('../../', import.meta.url));
const model = 'site/scripts/nutrition-model.ts';
const originalHash = '6667190a6604523fe083d6d766cfbbdb7c2ce75366194f3036ce711a8218a7ce';
const read = (file: string) => readFileSync(path.join(root, file), 'utf8');

test('calculator compatibility admits only the exact reviewed model revision and original lineage', () => {
  const actual = textHash(read(model));
  assert.notEqual(actual, originalHash);
  assert.ok(acceptsReviewedNutritionModelBinding(model, originalHash, actual));
  for (const args of [
    ['site/scripts/glycemic-load-model.ts', originalHash, actual],
    [model, '0'.repeat(64), actual],
    [model, originalHash, textHash(read(model) + '\n// unreviewed change\n')],
  ]) assert.equal(acceptsReviewedNutritionModelBinding(...args as [string, string, string]), false);
});

test('all three sealed loaders accept LF/CRLF code compatibility and reject changed code or sources', () => {
  const fixture = mkdtempSync(path.join(os.tmpdir(), 'gk-us-normalization-'));
  const padFolder = 'docs/research/afcd-polyol-03/noodle-campaign/';
  const approvalFile = 'docs/nutrition/gk80-tehoajo-era1/approval.json';
  const sources = JSON.parse(read(padFolder + 'sources.json'));
  const padCase = JSON.parse(read(padFolder + 'cases.json')).cases[0];
  const approval = JSON.parse(read(approvalFile));
  const fourFolder = 'docs/nutrition/gk80-next-four/';
  const fourManifest = JSON.parse(read(fourFolder + 'integration.json'));
  const fourSources = JSON.parse(read(fourFolder + 'sources.json'));
  const fourCases = JSON.parse(read(fourFolder + 'cases.json'));
  const paths = new Set<string>([
    'docs/research/afcd-polyol-03/pad-see-ew-approval.json',
    ...['cases.json', 'sources.json', 'engine-results.json', 'decimal-results.json', 'manifest.json'].map(f => padFolder + f),
    ...Object.values(padCase.paths) as string[],
    'docs/nutrition/fineli-release-20-reference.json', 'docs/nutrition/afcd-release-3-reference.json',
    'docs/nutrition/food-records.json', 'docs/nutrition/glycemic-index-records.json',
    'site/scripts/glycemic-load-model.ts', model, approvalFile,
    ...sources.products.flatMap((p: {pinnedPath?: string}) => p.pinnedPath ? [p.pinnedPath] : []),
    ...approval.cases.flatMap((c: {bindings: Record<string, string>}) => Object.keys(c.bindings)),
    fourFolder + 'integration.json',
    ...Object.keys(fourManifest.filesLfSha256), ...Object.keys(fourSources.sharedFilesLfSha256),
    ...fourCases.cases.flatMap((c: {paths: Record<string, string>}) => Object.values(c.paths)),
    ...Object.values(fourSources.contexts).flatMap((c: any) => c.giBindings.map((g: {path?: string}) => g.path ?? 'docs/nutrition/glycemic-index-records.json')),
  ]);
  const write = (file: string, contents: string) => writeFileSync(path.join(fixture, file), contents);
  try {
    for (const file of paths) {
      mkdirSync(path.dirname(path.join(fixture, file)), {recursive: true});
      copyFileSync(path.join(root, file), path.join(fixture, file));
    }
    const pad = loadPadSeeEw(root), pav = buildTehoajoVariants(root), four = loadApprovedFour(root);
    for (const eol of ['\n', '\r\n']) {
      write(model, read(model).replaceAll('\r\n', '\n').replaceAll('\n', eol));
      assert.deepEqual(loadPadSeeEw(fixture), pad);
      assert.deepEqual(buildTehoajoVariants(fixture), pav);
      assert.deepEqual(loadApprovedFour(fixture), four);
    }
    write(model, read(model) + '\n// unreviewed change\n');
    assert.throws(() => loadPadSeeEw(fixture), /Pad shared evidence changed: site\/scripts\/nutrition-model.ts/);
    assert.throws(() => buildTehoajoVariants(fixture), /GK80 tehoajo source changed: site\/scripts\/nutrition-model.ts/);
    assert.throws(() => loadApprovedFour(fixture), /Next-four: shared source changed: site\/scripts\/nutrition-model.ts/);
    write(model, read(model));
    const otherModel = 'site/scripts/glycemic-load-model.ts';
    write(otherModel, read(otherModel) + '\n// unreviewed change\n');
    assert.throws(() => loadPadSeeEw(fixture), /Pad shared evidence changed: site\/scripts\/glycemic-load-model.ts/);
    assert.throws(() => buildTehoajoVariants(fixture), /GK80 tehoajo source changed: site\/scripts\/glycemic-load-model.ts/);
    assert.throws(() => loadApprovedFour(fixture), /Next-four: shared source changed: site\/scripts\/glycemic-load-model.ts/);
    write(otherModel, read(otherModel));
    const source = 'docs/nutrition/fineli-release-20-reference.json';
    write(source, read(source) + '\n');
    assert.throws(() => loadPadSeeEw(fixture), /Pad shared evidence changed: docs\/nutrition\/fineli-release-20-reference.json/);
  } finally {
    rmSync(fixture, {recursive: true, force: true});
  }
});
