import assert from 'node:assert/strict';
import test from 'node:test';
import { inputMode, buildEnvironment } from './build-production.mjs';
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
