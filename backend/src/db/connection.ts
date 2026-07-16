import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// data/ lives at the repo root: backend/src/db -> ../../../data
export const DATA_DIR = join(__dirname, '..', '..', '..', 'data');
export const DB_PATH = process.env.DB_PATH || join(DATA_DIR, 'careergenie.db');

mkdirSync(DATA_DIR, { recursive: true });

let instance: DatabaseSync | null = null;

/** Returns a shared singleton SQLite connection with foreign keys enabled. */
export function getDb(): DatabaseSync {
  if (!instance) {
    instance = new DatabaseSync(DB_PATH);
    instance.exec('PRAGMA foreign_keys = ON;');
    instance.exec('PRAGMA journal_mode = WAL;');
  }
  return instance;
}

export function closeDb(): void {
  if (instance) {
    instance.close();
    instance = null;
  }
}

/** Typed convenience wrappers (node:sqlite returns loose Record types). */
export function queryAll<T>(sql: string, ...params: unknown[]): T[] {
  return getDb()
    .prepare(sql)
    .all(...(params as never[])) as unknown as T[];
}

export function queryOne<T>(sql: string, ...params: unknown[]): T | undefined {
  return getDb()
    .prepare(sql)
    .get(...(params as never[])) as unknown as T | undefined;
}
