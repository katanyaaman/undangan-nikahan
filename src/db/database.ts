/** Skema meniru migrasi Laravel: users, guests, events. */
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from '../config';

let instance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!instance) {
    fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
    instance = new Database(config.dbPath);
    instance.pragma('journal_mode = WAL');
    instance.pragma('foreign_keys = ON');
  }
  return instance;
}

/** Idempoten, aman dijalankan tiap start. */
export function migrate(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      number_of_guests INTEGER NOT NULL DEFAULT 1,
      message TEXT,
      attendance TEXT NOT NULL DEFAULT 'hadir',
      is_confirmed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL DEFAULT 'wedding',
      bride_name TEXT, bride_father TEXT, bride_mother TEXT,
      groom_name TEXT, groom_father TEXT, groom_mother TEXT,
      event_title TEXT, event_description TEXT,
      event_date TEXT, event_time_start TEXT, event_time_end TEXT,
      venue_name TEXT, venue_address TEXT, venue_city TEXT,
      venue_maps_url TEXT, venue_latitude REAL, venue_longitude REAL,
      instagram_bride TEXT, instagram_groom TEXT,
      love_story TEXT, gallery_folder TEXT, background_music TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    );
  `);
}

export function nowDb(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function futureDb(days: number): string {
  const d = new Date(Date.now() + days * 86400000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function columnNames(db: Database.Database, table: string): Set<string> {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return new Set(rows.map((r) => r.name));
}

function ensureColumn(db: Database.Database, table: string, col: string, def: string): void {
  if (!columnNames(db, table).has(col)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`);
  }
}

/** Kolom dan tabel untuk model multi-event. Idempoten untuk database lama. */
export function migrateMultiEvent(): void {
  const db = getDb();
  ensureColumn(db, 'users', 'role', "TEXT NOT NULL DEFAULT 'customer'");
  ensureColumn(db, 'users', 'status', "TEXT NOT NULL DEFAULT 'active'");
  ensureColumn(db, 'templates', 'demo_bride', 'TEXT');
  ensureColumn(db, 'templates', 'demo_groom', 'TEXT');
  ensureColumn(db, 'templates', 'demo_date', 'TEXT');
  ensureColumn(db, 'templates', 'demo_venue', 'TEXT');
  ensureColumn(db, 'templates', 'demo_address', 'TEXT');
  ensureColumn(db, 'templates', 'demo_bride_father', 'TEXT');
  ensureColumn(db, 'templates', 'demo_bride_mother', 'TEXT');
  ensureColumn(db, 'templates', 'demo_groom_father', 'TEXT');
  ensureColumn(db, 'templates', 'demo_groom_mother', 'TEXT');
  ensureColumn(db, 'templates', 'demo_instagram_bride', 'TEXT');
  ensureColumn(db, 'templates', 'demo_instagram_groom', 'TEXT');
  ensureColumn(db, 'templates', 'demo_bride_photo', 'TEXT');
  ensureColumn(db, 'templates', 'demo_groom_photo', 'TEXT');
  ensureColumn(db, 'events', 'customer_id', 'INTEGER');
  ensureColumn(db, 'events', 'template_slug', "TEXT NOT NULL DEFAULT 'template-1'");
  ensureColumn(db, 'events', 'slug', 'TEXT');
  ensureColumn(db, 'events', 'status', "TEXT NOT NULL DEFAULT 'active'");
  ensureColumn(db, 'events', 'paid_at', 'TEXT');
  ensureColumn(db, 'events', 'expired_at', 'TEXT');
  ensureColumn(db, 'guests', 'event_id', 'INTEGER');
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL DEFAULT 0,
      preview_image TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    );
    CREATE TABLE IF NOT EXISTS customer_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      template_slug TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'purchase',
      granted_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
      UNIQUE (customer_id, template_slug)
    );
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      amount INTEGER NOT NULL DEFAULT 0,
      method TEXT NOT NULL DEFAULT 'transfer',
      proof_image TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      verified_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests (event_id);
    CREATE INDEX IF NOT EXISTS idx_events_customer_id ON events (customer_id);
    CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      kind TEXT NOT NULL DEFAULT 'gallery',
      url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos (event_id);
  `);

  // Promosikan admin bawaan jadi owner bila belum ada owner sama sekali.
  const ownerCount = (db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'owner'").get() as { c: number }).c;
  if (ownerCount === 0) {
    db.prepare("UPDATE users SET role = 'owner' WHERE email = 'admin@example.com'").run();
  }

  // Event lama yang belum punya slug/pemilik/kadaluarsa: lengkapi agar bisa diakses per slug.
  const admin = db.prepare("SELECT id FROM users WHERE role = 'owner' ORDER BY id ASC LIMIT 1").get() as
    | { id: number }
    | undefined;
  if (admin) {
    db.prepare('UPDATE events SET customer_id = ? WHERE customer_id IS NULL').run(admin.id);
  }
  db.prepare("UPDATE events SET template_slug = 'template-1' WHERE template_slug IS NULL OR template_slug = ''").run();
  db.prepare("UPDATE events SET status = 'active' WHERE status IS NULL OR status = ''").run();
  db.prepare("UPDATE events SET expired_at = datetime('now', 'localtime', '+365 days') WHERE expired_at IS NULL").run();
  const slugRows = db.prepare('SELECT id FROM events WHERE slug IS NULL OR slug = ?').all('') as { id: number }[];
  const slugStmt = db.prepare('UPDATE events SET slug = ? WHERE id = ?');
  for (const row of slugRows) {
    slugStmt.run(`acara-${row.id}`, row.id);
  }
}
