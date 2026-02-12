import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tracker.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'saved'
      CHECK(status IN ('saved','applied','phone_screen','technical_interview','onsite','offer','negotiation','accepted','rejected','ghosted')),
    apply_url TEXT,
    linkedin_url TEXT,
    linkedin_job_id TEXT UNIQUE,
    notes TEXT,
    date_added TEXT NOT NULL DEFAULT (datetime('now')),
    date_applied TEXT,
    date_updated TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS saved_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    keywords TEXT NOT NULL,
    location TEXT,
    filters TEXT,
    auto_import INTEGER DEFAULT 0,
    schedule TEXT,
    last_run TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#6366f1'
  );

  CREATE TABLE IF NOT EXISTS job_tags (
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, tag_id)
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS cover_letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    generated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS adapted_cvs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    interview_date TEXT NOT NULL,
    interview_time TEXT,
    type TEXT NOT NULL DEFAULT 'phone'
      CHECK(type IN ('phone','technical','onsite','behavioral','final','other')),
    location TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Migrations - Add new columns to existing tables
const migrations = [
  // Enhanced job data fields
  { table: 'jobs', column: 'skills', type: 'TEXT' },
  { table: 'jobs', column: 'salary_range', type: 'TEXT' },
  { table: 'jobs', column: 'seniority_level', type: 'TEXT' },
  { table: 'jobs', column: 'employment_type', type: 'TEXT' },
  { table: 'jobs', column: 'remote_status', type: 'TEXT' },
  { table: 'jobs', column: 'benefits', type: 'TEXT' },
  { table: 'jobs', column: 'applicants_count', type: 'INTEGER' },
  { table: 'jobs', column: 'posted_date', type: 'TEXT' },
  { table: 'jobs', column: 'deadline', type: 'TEXT' },
  { table: 'jobs', column: 'company_url', type: 'TEXT' },
  { table: 'jobs', column: 'auto_imported', type: 'INTEGER DEFAULT 0' },
  { table: 'jobs', column: 'match_score', type: 'INTEGER' },
];

for (const migration of migrations) {
  try {
    // Check if column exists
    const columns = db.prepare(`PRAGMA table_info(${migration.table})`).all();
    const columnExists = columns.some(col => col.name === migration.column);

    if (!columnExists) {
      db.exec(`ALTER TABLE ${migration.table} ADD COLUMN ${migration.column} ${migration.type}`);
      console.log(`Added column ${migration.column} to ${migration.table}`);
    }
  } catch (err) {
    // Column might already exist, ignore
    if (!err.message.includes('duplicate column name')) {
      console.error(`Error adding column ${migration.column}:`, err.message);
    }
  }
}

export default db;
