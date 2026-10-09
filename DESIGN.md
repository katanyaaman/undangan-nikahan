# DESIGN.md — Digital Wedding Invitation Platform (`undangan-nikahan`)

> **Design System, UI Tokens, and Visual Architecture for AI Coding Agents and Frontend Engineers.**  
> Follows the [VoltAgent / Google Stitch DESIGN.md Standard](https://github.com/VoltAgent/awesome-design-md) and integrates with project [`antislop`](skills/antislop/SKILL.md) rules.

---

## 1. Design Philosophy & Visual Identity

Platform undangan digital pernikahan ini berfokus pada **sakralitas, keanggunan (elegance), kemudahan navigasi mobile-first, dan pengalaman emosional yang imersif**.

### Core Pillars
1. **Mobile-First Luxury**: 95%+ tamu membuka undangan via smartphone (WhatsApp/Telegram/Instagram). Layout desktop dibuat sebagai mobile-view wrapper (max 480px–520px) yang terpusat elegan dengan ambient background.
2. **Emotional Storytelling**: Setiap halaman disusun seperti alur cerita—dimulai dari Cover Pembuka (Curtain/Envelope), Doa & Ayat Suci, Profil Mempelai, Detail Acara & Peta, Galeri Foto, Love Story, RSVP & Ucapan, hingga Amplop Digital.
3. **Smooth Micro-Interactions**: Mengutamakan transisi halus (fade-up, gentle scale, glassmorphism blur) tanpa layout shift.
4. **Cultural & Linguistic Authenticity**: Menggunakan tata bahasa Indonesia dan adat yang hangat, sopan, dan bermakna (hindari copy klise atau placeholder tanpa konteks).

---

## 2. Color Systems & Design Tokens

### 2.1 Theme Presets

#### 🌟 Theme 1: Classic Romantic Floral
- **Mood**: Hangat, lembut, feminin, estetik bunga-bunga pastel.
- `--color-bg`: `#FAF7F2` (Cream warm)
- `--color-primary`: `#B08968` (Warm Terracotta / Dusty Rose)
- `--color-secondary`: `#7D9D8B` (Sage Green)
- `--color-text`: `#2D2522` (Deep Charcoal)
- `--color-accent`: `#D4AF37` (Soft Gold)

#### 🌿 Theme 2: Minimalist Modern Botanica
- **Mood**: Bersih, editorial, modern, kontras rapi.
- `--color-bg`: `#FFFFFF`
- `--color-primary`: `#2C3E35` (Deep Forest Green)
- `--color-secondary`: `#8C9B90` (Muted Sage)
- `--color-text`: `#1A1A1A` (Near Black)
- `--color-surface`: `#F4F6F4`

#### 👑 Theme 3: Royal Emerald & Gold
- **Mood**: Mewah, sakral, tradisional modern, elegan.
- `--color-bg`: `#F8FAF8`
- `--color-primary`: `#0F382C` (Royal Emerald)
- `--color-gold`: `#D4AF37` (Metallic Gold)
- `--color-gold-light`: `#F3E5AB`
- `--color-text`: `#1E2922`

#### 🎬 Theme 4: Cinematic Luxury Glossy Black
- **Mood**: Sinematik, eksklusif, glassmorphism, modern glam.
- `--color-bg`: `#0A0B0E` (Deep Obsidian)
- `--color-surface`: `rgba(255, 255, 255, 0.05)` (Glossy Glass Card)
- `--color-border`: `rgba(212, 175, 55, 0.25)` (Golden Shimmer Border)
- `--color-gold`: `#D4AF37` / `#E6CA65`
- `--color-text-primary`: `#F8FAFC` (Pure Pearl White)
- `--color-text-muted`: `#94A3B8` (Slate Gray)
- `--glass-blur`: `blur(16px)`

#### 💬 Theme 7: WhatsApp Native Messenger UI
- **Mood**: Interaktif, familiar, percakapan natural, layout pesan instan.
- `--wa-header`: `#1F2C34` (Dark) / `#008069` (Light)
- `--wa-bg`: `#0B141A` (Dark Chat) / `#EFEAE2` (Light Chat)
- `--wa-bubble-incoming`: `#202C33` (Dark) / `#FFFFFF` (Light)
- `--wa-bubble-outgoing`: `#005C4B` (Dark) / `#E7FFDB` (Light)
- `--wa-accent`: `#00A884` (WhatsApp Emerald)
- `--wa-text-primary`: `#E9EDEF` (Dark) / `#111B21` (Light)
- `--wa-text-muted`: `#8696A0` (Dark) / `#667781` (Light)

#### ✈️ Theme 8: Telegram Native Messenger UI
- **Mood**: Clean, modern chat, rounded bubbles, dynamic status indicators.
- `--tg-header`: `#212D3B` (Dark) / `#517DA2` (Light)
- `--tg-bg`: `#0E1621` (Dark) / `#E7EBF0` (Light)
- `--tg-bubble-in`: `#182533` (Dark) / `#FFFFFF` (Light)
- `--tg-bubble-out`: `#2B5278` (Dark) / `#EEF2F5` (Light)
- `--tg-accent`: `#50A7EA` (Telegram Blue)
- `--tg-text`: `#F5F5F5` (Dark) / `#222222` (Light)

---

## 3. Typography Hierarchy & Font Pairings

| Role | Font Family | Weight | Letter Spacing | Use Cases |
|------|-------------|--------|----------------|-----------|
| **Script / Accents** | `'Great Vibes'`, `'Alex Brush'`, cursive | 400 | Normal | Nama Panggilan Mempelai, Monogram, Kaligrafi Bismillah |
| **Editorial Heading** | `'Cinzel'`, `'Playfair Display'`, serif | 600, 700 | 0.05em – 0.15em | Judul Bab ("Akad Nikah", "Resepsi", "Love Story") |
| **Modern Sans Body** | `'Plus Jakarta Sans'`, `'Inter'`, sans-serif | 400, 500 | 0 – 0.01em | Deskripsi, Waktu, Alamat, Form, Pesan Ucapan |
| **Messenger UI** | System UI, `'Segoe UI'`, `Roboto`, sans-serif | 400, 600 | Normal | WhatsApp / Telegram bubble chats & headers |

### Type Scale (Mobile)
- `Display / Groom & Bride`: `2.25rem` – `3.25rem` (36px – 52px)
- `H1 / Section Title`: `1.5rem` – `1.875rem` (24px – 30px)
- `H2 / Subtitle`: `1.125rem` – `1.25rem` (18px – 20px)
- `Body Large (Ayat/Quote)`: `0.95rem` – `1.05rem` (15px – 17px, line-height 1.6)
- `Body Base`: `0.875rem` (14px, line-height 1.5)
- `Caption / Timestamps`: `0.75rem` – `0.8rem` (12px – 13px)

---

## 4. Spacing, Rhythm & Container Architecture

### 4.1 Layout Constraints
- **Mobile Container Wrapper**: `max-width: 480px` (atau `540px` untuk tablet hybrid), `margin: 0 auto`.
- **Desktop Ambient Frame**: Background desktop menggunakan blur ambient atau pattern redup dengan shadow lembut pada frame tengah.
- **Section Spacing**: `padding: 4rem 1.25rem` (64px top/bottom, 20px left/right).
- **Card Padding**: `1.25rem` – `1.75rem` (20px – 28px).

### 4.2 Spacing Grid (8pt system)
- `xs`: `4px`
- `sm`: `8px`
- `md`: `16px`
- `lg`: `24px`
- `xl`: `32px`
- `2xl`: `48px`
- `3xl`: `64px`

---

## 5. Component Patterns & UX Specifications

### 5.1 The Gatekeeper (Cover / Envelope Modal)
- **Cover Screen**: Full viewport (`100dvh`), menampilkan nama tamu penerima (`Dear: [Nama Tamu]`), judul pernikahan, avatar/monogram, dan tombol CTA utama.
- **CTA Button**: `"Buka Undangan"` dengan ikon amplop / cinta, animasi denyut lembut (*pulse*).
- **Behavior**: Saat diklik, trigger animasi slide-up/fade-out, trigger autoplay musik (dengan fallback mute aman), dan unlock scroll body.

### 5.2 Floating Audio Controller
- **Position**: Sticky di kanan bawah (`bottom: 24px`, `right: 20px`, `z-index: 50`) atau terintegrasi di navigation bar.
- **Visual**: Floating circular badge (44x44px min tap target) dengan vinyl rotation animation saat audio memutar, dan pause icon saat terhenti.
- **Autoplay Policy**: Browser memblokir autoplay tanpa gesture; buka undangan bertindak sebagai user gesture resmi.

### 5.3 Event Details & Countdown Timer
- **Countdown Box**: 4 card terpisah (Hari, Jam, Menit, Detik) dengan aksen border/glow.
- **Add to Calendar**: Tombol terintegrasi ke Google Calendar / iCal (.ics).
- **Maps CTA**: Tombol `"Buka Google Maps"` dengan ikon pin lokasi jelas, membuka tab baru ke koordinat/lokasi venue.

### 5.4 Digital Gift / Amplop Cashless
- **Bank Card UI**: Nomor rekening ditampilkan besar dan jelas dengan tombol `"Salin No. Rekening"` (disertai feedback toast *"Berhasil disalin"*).
- **QRIS Integration**: Preview QRIS dengan tombol perbesar / unduh.
- **Kirim Hadiah Fisik**: Accordion atau modal alamat pengiriman kado fisik.

### 5.5 Wishes Wall & RSVP Form
- **RSVP Form**: Input nama, konfirmasi kehadiran (Hadir, Ragu-ragu, Tidak Hadir), jumlah tamu, dan pesan doa restu.
- **Wishes Feed**: Daftar ucapan berformat card/bubble dengan timestamp humanized ("Baru saja", "2 jam lalu"), badge kehadiran, dan scrolling halus.

---

## 6. Motion, Animation & Depth Guidelines

```css
/* Token Durasi & Easing */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-smooth: 600ms cubic-bezier(0.16, 1, 0.3, 1);
--transition-cinematic: 1000ms cubic-bezier(0.22, 1, 0.36, 1);
```

- **Scroll Reveal**: Gunakan `IntersectionObserver` untuk menerapkan kelas `.active` / `.revealed` (translasi vertikal dari `translateY(30px)` ke `translateY(0)` disertai `opacity: 1`).
- **Glassmorphism Spec**:
  ```css
  background: rgba(18, 20, 29, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  ```

---

## 7. Anti-Patterns & Antislop Compliance

1. ❌ **Jangan gunakan placeholder dummy klise** seperti `"Lorem Ipsum"`, `"John Doe & Jane Doe"`, atau teks template generik yang merusak visual. Gunakan contoh nama Indonesia yang otentik, doa yang sopan, dan alamat nyata.
2. ❌ **Hindari tombol sempit di bawah 44px** untuk perangkat layar sentuh. Pastikan semua tombol aksi (Buka Undangan, Salin Rekening, Kirim Ucapan) memiliki touch area minimal 44×44px.
3. ❌ **Hindari animasi berlebihan yang mengganggu scroll**. Animasi harus mendukung kesan sakral dan halus, bukan transisi berkedip atau agresif.
4. ❌ **Jangan paksa audio bersuara keras tanpa kontrol pengguna**. Selalu sediakan tombol mute/unmute yang mudah terlihat.
5. ❌ **Jangan biarkan form submit me-reload seluruh halaman**. Gunakan Fetch/AJAX dengan feedback visual instan (toast / status badge).

---

## 8. File Structure Reference

```text
undangan-nikahan/
├── AGENTS.md               # Coding and agent behavior instructions
├── DESIGN.md               # Design tokens, color system, typography & UX guidelines (This file)
├── views/
│   ├── home.ejs            # Public landing & showcase
│   ├── layouts/            # Base layouts & head partials
│   ├── partials/           # Reusable navigation, audio controllers, modals
│   └── templates/          # Wedding invitation templates
│       ├── template-1/     # Classic Romantic Floral
│       ├── template-2/     # Minimalist Modern
│       ├── template-3/     # Traditional Emerald Gold
│       ├── template-4/     # Cinematic Luxury Glossy Black
│       ├── template-7/     # WhatsApp Chat Theme
│       └── template-8/     # Telegram Chat Theme
└── public/                 # Static assets (fonts, audio, images, icons)
```
