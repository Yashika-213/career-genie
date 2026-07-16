import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getDb, DB_PATH } from './connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Creates all tables from schema.sql (idempotent). */
export function initDb(): void {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  const db = getDb();
  db.exec(schema);
}

// Allow running directly: `tsx src/db/init.ts`
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('init.ts')) {
  initDb();
  console.log(`[careergenie] schema initialized at ${DB_PATH}`);
}
