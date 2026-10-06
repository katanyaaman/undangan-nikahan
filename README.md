# Undangan Online (Express + TypeScript)

Platform jualan template undangan pernikahan: katalog publik, order trial, undangan live per acara (`/u/:slug`), dashboard customer per event, dan dashboard owner (customers, events, template, pembayaran).

## Syarat

- Node.js 20+
- NPM

## Cara jalan

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Buka `http://localhost:3000`.

Login owner: `http://localhost:3000/login`

- Email: `admin@example.com`
- Password: `password`

## Alur bisnis singkat

1. Customer pilih template di katalog → order → akun + event **trial 7 hari** langsung jadi (maks 20 tamu, ada watermark, export dikunci)
2. Customer isi data acara dari dashboardnya, sebarkan tautan `/u/:slug-acara`
3. Customer upload bukti bayar di halaman Upgrade → owner verifikasi di `/owner/payments` → event **aktif 90 hari**, limit dibuka
4. Event lewat masa aktif otomatis jadi halaman tutup (RSVP ikut ditolak)

## Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` | jalan mode development (auto reload) |
| `npm run build` | compile TypeScript ke `dist/` |
| `npm start` | jalan hasil build |
| `npm run db:migrate` | buat/tambah tabel SQLite |
| `npm run db:seed` | owner + event contoh + katalog template |
| `npm run db:reset` | hapus database (lalu migrate + seed lagi) |
| `npm run css:build` | build ulang Tailwind dari `assets/css` |

## Route

Publik: `/` katalog, `/template-1..4` demo, `/order/:template`, `POST /order`, `/u/:slug` undangan live, `POST /u/:slug/rsvp`, `/login`, `/logout`.

Customer (`/admin`, login): `/admin` daftar event, `/admin/events/:id` dashboard, `/guests`, `/guests/export/csv`, `/guests/:id`, `/settings`, `/event-settings`, `/template` ganti template, `/upgrade` bayar.

Owner (`/owner`, role owner): `/owner/dashboard`, `/customers`, `/customers/:id` (+ grant akses template, suspend), `/events` (+ perpanjang, ubah status), `/templates` (harga, aktif), `/payments` (verifikasi/tolak).

## Tambah template baru

1. Buat folder `views/templates/template-5/` (contoh: copy dari `template-1`, lalu ubah).
2. Tambah 1 baris di `src/templates/registry.ts`:

```ts
{ slug: 'template-5', name: 'Nama Template', view: 'templates/template-5/index', rsvpPath: '/template-5/rsvp' },
```

3. Daftarkan di katalog (tambah baris seed di `src/db/seed.ts` agar ikut migrate berikutnya):

```ts
{ slug: 'template-5', name: 'Nama Template', description: '...', price: 49000, sort: 5 },
```

Katalog, demo, dan order ikut otomatis dari data tersebut.

## Struktur

```
src/
  server.ts            entry point
  app.ts               aplikasi Express (middleware + routes)
  config.ts            baca environment variables
  routes/              index.ts (publik), auth.ts, admin.ts (customer), owner.ts
  controllers/         invitation, guest (RSVP), auth, admin, owner, order
  middleware/          auth (role), csrf
  validation/          skema zod + pesan error
  db/                  database.ts, migrate.ts, seed.ts, reset.ts, types.ts
  lib/                 render (EJS+layout), dates, pagination, events, upload, asyncHandler
  templates/           registry.ts (katalog view template)
views/                 EJS (home katalog, order, auth, admin, owner, templates/*)
public/css             Tailwind hasil build
public/uploads/proofs  bukti bayar (tidak ikut git)
assets/css/app.css     sumber Tailwind (untuk css:build)
data/                  file SQLite (tidak ikut git)
```

## Catatan

- Session login disimpan di memori server. Cukup untuk dipakai sendiri. Kalau mau multi proses atau production, ganti ke session store persisten.
- CSRF dipakai di semua form dan fetch RSVP. Upload bukti dicek setelah multer parsing body.
- Batas trial: 20 tamu, watermark, export dikunci. Event aktif default 90 hari, maks 500 tamu.
- Keamanan bawaan: header helmet, rate limit login/order/RSVP, validasi upload gambar, semua query parameterisasi, output EJS diescape, cookie httpOnly + secure saat production.
- Hapus `data/app.sqlite` + migrate + seed untuk database baru.
