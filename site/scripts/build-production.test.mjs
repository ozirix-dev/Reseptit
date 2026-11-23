import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync, readFileSync, rmdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inputMode, buildEnvironment, trackedInputsComplete, runProductionNpmTasks } from './build-production.mjs';
test('missing CI inputs fail closed instead of selecting the public snapshot', () => {
  assert.throws(() => inputMode({ CI: 'true' }, false), /CI must provide/);
  assert.throws(() => inputMode({ GITHUB_ACTIONS: 'true' }, false), /CI must provide/);
});
test('partial credentials cannot silently fall back', () => {
  for (const key of ['IMAGE_CI_ACCESS_KEY_ID', 'IMAGE_CI_SECRET_ACCESS_KEY', 'IMAGE_CI_SESSION_TOKEN']) assert.throws(() => inputMode({ [key]: 'fixture' }, false), /Both CI reader/);
});
test('a complete reader selects R2; a credential-free local clone selects published inputs', () => {
  assert.equal(inputMode({ IMAGE_CI_ACCESS_KEY_ID: 'fixture', IMAGE_CI_SECRET_ACCESS_KEY: 'fixture' }, false), 'r2');
  assert.equal(inputMode({}, false), 'public');
  assert.equal(inputMode({}, true), 'tracked');
  assert.equal(inputMode({ PROJECT_IMAGE_ROOT: '/fixture' }, false), 'explicit');
});
test('reader secrets do not reach build children and the parent environment is unchanged', () => {
  const original = { IMAGE_CI_ACCESS_KEY_ID: 'fixture', IMAGE_CI_SECRET_ACCESS_KEY: 'fixture', IMAGE_CI_SESSION_TOKEN: 'fixture', OTHER: 'kept' };
  const child = buildEnvironment(original, '/verified');
  assert.deepEqual(child, { OTHER: 'kept', PROJECT_IMAGE_ROOT: '/verified' });
  assert.equal(original.IMAGE_CI_ACCESS_KEY_ID, 'fixture');
});

test('leftover legacy images and gitkeep do not masquerade as the complete tracked input set', () => {
  const scratch = process.platform === 'win32' ? 'D:/Temp' : os.tmpdir();
  const root = mkdtempSync(path.join(scratch, 'recipavo-input-test-'));
  try {
    const files = [{ path: 'aamupalat/selected.webp', build: true }];
    writeFileSync(path.join(root, '.gitkeep'), '');
    writeFileSync(path.join(root, 'legacy.webp'), 'fixture');
    assert.equal(trackedInputsComplete(root, files), false);
    assert.equal(inputMode({}, trackedInputsComplete(root, files)), 'public');
    mkdirSync(path.join(root, 'aamupalat'));
    writeFileSync(path.join(root, files[0].path), 'fixture');
    assert.equal(trackedInputsComplete(root, files), true);
  } finally {
    assert.equal(path.dirname(realpathSync(root)), realpathSync(scratch));
    rmSync(root, { recursive: true });
  }
});

test('production propagates a strict nutrition failure after a successful build', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'recipavo-npm-test-'));
  const stub = path.join(root, 'npm.cjs');
  const calls = path.join(root, 'calls.log');
  t.after(() => {
    rmSync(stub, { force: true });
    rmSync(calls, { force: true });
    rmdirSync(root);
  });

  writeFileSync(stub, `
    const { appendFileSync } = require('node:fs');
    const args = process.argv.slice(2).join(' ');
    appendFileSync(process.env.RECIPAVO_TEST_CALLS, args + '\\n');
    const statuses = {
      'run build': Number(process.env.RECIPAVO_TEST_BUILD_STATUS),
      'run audit:nutrition -- --strict': Number(process.env.RECIPAVO_TEST_AUDIT_STATUS),
    };
    process.exitCode = statuses[args] ?? 99;
  `);

  const runTasks = (buildStatus, auditStatus) => {
    writeFileSync(calls, '');
    const status = runProductionNpmTasks(stub, {
      cwd: root,
      env: {
        ...process.env,
        RECIPAVO_TEST_CALLS: calls,
        RECIPAVO_TEST_BUILD_STATUS: String(buildStatus),
        RECIPAVO_TEST_AUDIT_STATUS: String(auditStatus),
      },
    });
    return { status, calls: readFileSync(calls, 'utf8').trim().split('\n') };
  };
  const productionCalls = ['run build', 'run audit:nutrition -- --strict'];
  assert.deepEqual(runTasks(0, 7), { status: 7, calls: productionCalls });
  assert.deepEqual(runTasks(0, 0), { status: 0, calls: productionCalls });
  assert.deepEqual(runTasks(6, 0), { status: 6, calls: ['run build'] });
});
