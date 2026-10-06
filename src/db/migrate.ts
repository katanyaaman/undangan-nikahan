/** Buat tabel jika belum ada (npm run db:migrate). */
import 'dotenv/config';
import { migrate, migrateMultiEvent } from './database';

migrate();
migrateMultiEvent();
console.log('Migrasi selesai.');
