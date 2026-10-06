/** Hapus file SQLite, lalu jalankan migrate dan seed ulang. */
import 'dotenv/config';
import fs from 'node:fs';
import { config } from '../config';

if (fs.existsSync(config.dbPath)) fs.rmSync(config.dbPath);
if (fs.existsSync(config.dbPath + '-wal')) fs.rmSync(config.dbPath + '-wal');
if (fs.existsSync(config.dbPath + '-shm')) fs.rmSync(config.dbPath + '-shm');
console.log('Database dihapus, jalankan: npm run db:migrate && npm run db:seed');
