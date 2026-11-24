import { createHash, randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const owners = new Set(['synthetic-a', 'synthetic-b']);
const keyPattern = /^[A-Za-z0-9_-]{1,100}$/;

export function openSyntheticRecipeStore(file) {
  const db = new DatabaseSync(file);
  db.exec('PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL;');
  db.exec([
    'CREATE TABLE IF NOT EXISTS private_recipes (',
    '  owner TEXT NOT NULL, id TEXT NOT NULL, version INTEGER NOT NULL,',
    '  title TEXT NOT NULL, note TEXT NOT NULL, PRIMARY KEY (owner, id)',
    ');',
    'CREATE TABLE IF NOT EXISTS save_receipts (',
    '  owner TEXT NOT NULL, request_key TEXT NOT NULL, digest TEXT NOT NULL,',
    '  receipt TEXT NOT NULL, PRIMARY KEY (owner, request_key)',
    ');',
  ].join('\n'));
  const find = db.prepare('SELECT id, version, title, note FROM private_recipes WHERE owner = ? AND id = ?');
  const receipt = db.prepare('SELECT digest, receipt FROM save_receipts WHERE owner = ? AND request_key = ?');
  const insert = db.prepare('INSERT INTO private_recipes (owner, id, version, title, note) VALUES (?, ?, 1, ?, ?)');
  const update = db.prepare([
    'UPDATE private_recipes SET title = ?, note = ?, version = version + 1',
    'WHERE owner = ? AND id = ? AND version = ?',
  ].join(' '));
  const record = db.prepare('INSERT INTO save_receipts (owner, request_key, digest, receipt) VALUES (?, ?, ?, ?)');

  function load(owner, id) {
    if (!owners.has(owner)) return { code: 'UNAUTHORIZED' };
    if (typeof id !== 'string' || !keyPattern.test(id)) return { code: 'INVALID_REQUEST' };
    const row = find.get(owner, id);
    return row ? { code: 'FOUND', recipe: { ...row } } : { code: 'NOT_FOUND' };
  }

  function save(owner, requestKey, input) {
    if (!owners.has(owner)) return { code: 'UNAUTHORIZED' };
    if (typeof requestKey !== 'string' || !keyPattern.test(requestKey) || !input || typeof input !== 'object') {
      return { code: 'INVALID_REQUEST' };
    }
    const { id = null, version = null, title = '', note = '' } = input;
    if (typeof title !== 'string' || typeof note !== 'string' || title.length > 200 || note.length > 16000 ||
        (!title.trim() && !note.trim()) ||
        (id === null ? version !== null : typeof id !== 'string' || !keyPattern.test(id) ||
          !Number.isSafeInteger(version) || version < 1)) {
      return { code: 'INVALID_REQUEST' };
    }
    const digest = createHash('sha256').update(JSON.stringify([id, version, title, note])).digest('hex');
    try {
      db.exec('BEGIN IMMEDIATE');
      const previous = receipt.get(owner, requestKey);
      if (previous) {
        db.exec('COMMIT');
        return previous.digest === digest ? JSON.parse(previous.receipt) : { code: 'IDEMPOTENCY_CONFLICT' };
      }
      const recipeId = id ?? randomUUID();
      if (id === null) insert.run(owner, recipeId, title, note);
      else if (update.run(title, note, owner, id, version).changes !== 1) {
        const code = find.get(owner, id) ? 'VERSION_CONFLICT' : 'NOT_FOUND';
        db.exec('ROLLBACK');
        return { code };
      }
      const result = { code: 'SAVED', recipe: { ...find.get(owner, recipeId) } };
      record.run(owner, requestKey, digest, JSON.stringify(result));
      db.exec('COMMIT');
      return result;
    } catch {
      if (db.isTransaction) db.exec('ROLLBACK');
      return { code: 'STORAGE_ERROR' };
    }
  }
  return { load, save, close: () => db.close() };
}
