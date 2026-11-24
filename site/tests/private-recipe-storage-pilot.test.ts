import { execFile } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { openSyntheticRecipeStore } from '../scripts/private-recipe-storage-pilot.mjs';

test('private draft persists, supports partial notes, and remains isolated after reopening', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'recipavo-private-fixture-'));
  const filename = path.join(directory, 'test.sqlite');
  let storage = openSyntheticRecipeStore(filename);
  try {
    const input = { note: 'Muistiinpano ilman ainemääriä' };
    const saved = storage.save('synthetic-a', 'draft-1', input);
    assert.equal(saved.code, 'SAVED');
    const id = saved.recipe.id;
    storage.close();
    storage = openSyntheticRecipeStore(filename);
    assert.deepEqual(storage.save('synthetic-a', 'draft-1', input), saved);
    assert.deepEqual(storage.load('synthetic-a', id), { code: 'FOUND', recipe: saved.recipe });
    assert.equal(storage.load('synthetic-b', id).code, 'NOT_FOUND');
    assert.equal(storage.load('unknown', id).code, 'UNAUTHORIZED');
    assert.equal(storage.save('synthetic-b', 'overwrite', { id, version: 1, title: 'Wrong owner' }).code, 'NOT_FOUND');
    const other = storage.save('synthetic-b', 'draft-1', { title: 'Pelkkä nimi' });
    assert.equal(other.code, 'SAVED');
    assert.notEqual(other.recipe.id, id);
    const update = { id, version: 1, title: 'Nimi lisätty', note: input.note };
    const updated = storage.save('synthetic-a', 'edit', update);
    assert.equal(updated.code, 'SAVED');
    assert.equal(updated.recipe.version, 2);
    assert.deepEqual(storage.save('synthetic-a', 'edit', update), updated);
    assert.equal(storage.save('synthetic-a', 'edit', { ...update, title: 'Eri sisältö' }).code, 'IDEMPOTENCY_CONFLICT');
    assert.equal(storage.save('synthetic-a', 'edit-2', update).code, 'VERSION_CONFLICT');
    assert.equal(storage.save('synthetic-a', 'empty', {}).code, 'INVALID_REQUEST');
    const reopened = storage.load('synthetic-a', id);
    assert.equal(reopened.code, 'FOUND');
    assert.equal(reopened.recipe.title, 'Nimi lisätty');
  } finally {
    storage.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

const run = promisify(execFile);

test('concurrent processes can replay the same durable request without a duplicate', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'recipavo-private-concurrent-'));
  const filename = path.join(directory, 'test.sqlite');
  openSyntheticRecipeStore(filename).close();
  const executable = new URL('../scripts/private-recipe-storage-pilot.mjs', import.meta.url).href;
  const command = [
    'const { openSyntheticRecipeStore } = await import(process.argv[1]);',
    'const store = openSyntheticRecipeStore(process.argv[2]);',
    'console.log(JSON.stringify(store.save("synthetic-a", "shared-request", {note:"Synthetic"})));',
    'store.close();',
  ];
  try {
    const results = await Promise.allSettled(Array.from({ length: 4 }, async () => {
      const { stdout } = await run(process.execPath, ['--input-type=module', '-e', command.join('\n'), executable, filename]);
      return JSON.parse(stdout);
    }));
    for (const result of results) assert.equal(result.status, 'fulfilled');
    const receipts = results.map(result => {
      if (result.status === 'rejected') throw result.reason;
      return result.value;
    });
    assert.equal(receipts[0].code, 'SAVED');
    for (const receipt of receipts) assert.deepEqual(receipt, receipts[0]);
    const db = new DatabaseSync(filename, { readOnly: true });
    try {
      assert.equal(db.prepare('SELECT COUNT(*) AS count FROM private_recipes').get()?.count, 1);
      assert.equal(db.prepare('SELECT COUNT(*) AS count FROM save_receipts').get()?.count, 1);
    } finally {
      db.close();
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
