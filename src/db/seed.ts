/**
 * Admin owner + event contoh + katalog template (npm run db:seed).
 * Idempoten: aman dijalankan berulang.
 * Kredensial owner: admin@example.com / password
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { futureDb, getDb, migrate, migrateMultiEvent, nowDb } from './database';

migrate();
migrateMultiEvent();
const db = getDb();
const now = nowDb();

db.prepare(
  `INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
   VALUES ('Admin', 'admin@example.com', ?, 'owner', ?, ?)
   ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'owner', updated_at = excluded.updated_at`,
).run(bcrypt.hashSync('password', 10), now, now);
const owner = db.prepare("SELECT id FROM users WHERE email = 'admin@example.com'").get() as { id: number };

interface CatalogSeed {
  slug: string;
  name: string;
  description: string;
  price: number;
  sort: number;
  bride: string | null;
  groom: string | null;
  date: string | null;
  venue: string | null;
  address: string | null;
  brideFather: string | null;
  brideMother: string | null;
  groomFather: string | null;
  groomMother: string | null;
  instaBride: string | null;
  instaGroom: string | null;
}

const none = { brideFather: null, brideMother: null, groomFather: null, groomMother: null, instaBride: null, instaGroom: null };

const catalog: CatalogSeed[] = [
  { slug: 'template-1', name: 'Elegant Modern', description: 'Modern dengan animasi smooth, glassmorphism, galeri, dan buku tamu.', price: 49000, sort: 1, bride: null, groom: null, date: null, venue: null, address: null, ...none },
  { slug: 'template-2', name: 'Classic Romantic', description: 'Klasik romantis dengan ornamen floral dan warna lembut.', price: 49000, sort: 2, bride: null, groom: null, date: null, venue: null, address: null, ...none },
  { slug: 'template-3', name: 'Elegant Nature', description: 'Nuansa natural earthy dengan efek parallax, cocok outdoor.', price: 79000, sort: 3, bride: null, groom: null, date: null, venue: null, address: null, ...none },
  { slug: 'template-4', name: 'Bugis Emerald', description: 'Adat Bugis dengan ornamen khas dan sentuhan islami.', price: 79000, sort: 4, bride: 'Sarah Johnson', groom: 'David Anderson', date: '2025-12-31 19:00:00', venue: 'Grand Ballroom Hotel', address: 'Jl. Sudirman No. 123, Jakarta', brideFather: 'Bapak Michael Johnson', brideMother: 'Ibu Emily Johnson', groomFather: 'Bapak Robert Anderson', groomMother: 'Ibu Jennifer Anderson', instaBride: '@sarahjohnson', instaGroom: '@davidanderson' },
  { slug: 'template-5', name: 'WhatsApp Story', description: 'Interaktif chat WhatsApp dengan lockscreen notifikasi, status story, VN audio, dan live RSVP.', price: 89000, sort: 5, bride: 'Sarah Johnson', groom: 'David Anderson', date: '2025-12-31 19:00:00', venue: 'Grand Ballroom Hotel', address: 'Jl. Sudirman No. 123, Jakarta', brideFather: 'Bapak Michael Johnson', brideMother: 'Ibu Emily Johnson', groomFather: 'Bapak Robert Anderson', groomMother: 'Ibu Jennifer Anderson', instaBride: '@sarahjohnson', instaGroom: '@davidanderson' },
];
for (const t of catalog) {
  db.prepare(
    `INSERT INTO templates (slug, name, description, price, active, sort_order, demo_bride, demo_groom, demo_date, demo_venue, demo_address,
      demo_bride_father, demo_bride_mother, demo_groom_father, demo_groom_mother, demo_instagram_bride, demo_instagram_groom, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET name = excluded.name, description = excluded.description, updated_at = excluded.updated_at`,
  ).run(t.slug, t.name, t.description, t.price, t.sort, t.bride, t.groom, t.date, t.venue, t.address, t.brideFather, t.brideMother, t.groomFather, t.groomMother, t.instaBride, t.instaGroom, now, now);
}

db.prepare(
  `INSERT INTO events (customer_id, template_slug, slug, status, paid_at, expired_at, event_type, bride_name, bride_father, bride_mother, groom_name, groom_father, groom_mother,
    event_title, event_description, event_date, event_time_start, event_time_end, venue_name, venue_address,
    venue_city, venue_maps_url, venue_latitude, venue_longitude, instagram_bride, instagram_groom,
    love_story, background_music, is_active, created_at, updated_at)
   SELECT ?, 'template-1', 'contoh-undangan', 'active', ?, ?, 'wedding', 'Sarah Johnson', 'Mr. Michael Johnson', 'Mrs. Emily Johnson', 'David Anderson',
    'Mr. Robert Anderson', 'Mrs. Jennifer Anderson', 'The Wedding of Sarah & David',
    'Join us as we celebrate our love and commitment to each other', '2025-12-31 19:00:00',
    '19:00:00', '22:00:00', 'Grand Ballroom Hotel', 'Jl. Sudirman No. 123, Jakarta Pusat', 'Jakarta',
    'https://maps.google.com/?q=-6.200000,106.816666', -6.2, 106.816666, '@sarahjohnson', '@davidanderson',
    'We met in the autumn of 2020, and since then, every moment has been a beautiful journey together.',
    'wedding-song.mp3', 1, ?, ?
   WHERE NOT EXISTS (SELECT 1 FROM events)`,
).run(owner.id, now, futureDb(365), now, now);

const first = db.prepare('SELECT id FROM events ORDER BY id ASC LIMIT 1').get() as { id: number } | undefined;
if (first) {
  db.prepare('UPDATE guests SET event_id = ? WHERE event_id IS NULL').run(first.id);
}

console.log('Seed selesai. Owner: admin@example.com / password');
