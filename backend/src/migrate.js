import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  const sql = readFileSync(join(__dirname, './migrations/001_init.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migrations exécutées avec succès.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await runMigrations();
  process.exit(0);
}
