/** Pengganti Carbon: format 'd M Y, H:i' dan diffForHumans Bahasa Inggris. */
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  // 'YYYY-MM-DD HH:MM:SS' bukan ISO valid, sisipkan T agar konsisten.
  const iso = value.includes('T') ? value : value.replace(' ', 'T');
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: string | Date | null | undefined, fmt = 'd M Y, H:i'): string {
  const d = toDate(value);
  if (!d) return '-';
  const p = (n: number) => String(n).padStart(2, '0');
  return fmt
    .replace('d', p(d.getDate()))
    .replace('M', MONTHS_SHORT[d.getMonth()])
    .replace('Y', String(d.getFullYear()))
    .replace('H', p(d.getHours()))
    .replace('i', p(d.getMinutes()))
    .replace('s', p(d.getSeconds()));
}

export function timeAgo(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return '-';
  const sec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min > 1 ? 's' : ''} ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/** 'Rabu, 31 Desember 2025' atau null bila tanggal kosong/tak valid. */
export function formatLongId(value: string | null | undefined): string | null {
  const d = toDate(value);
  if (!d) return null;
  return `${DAYS_ID[d.getDay()]}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/** '31 Desember 2025' atau null. */
export function formatShortId(value: string | null | undefined): string | null {
  const d = toDate(value);
  if (!d) return null;
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/** '19:00:00' -> '19.00'. */
export function timeHM(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = value.match(/(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}.${m[2]}` : null;
}

/** Bagian tanggal untuk tampilan terpisah (nama hari, nomor, 'Bulan Tahun'). */
export function dateParts(value: string | null | undefined): { day: string; num: string; monthYear: string } | null {
  const d = toDate(value);
  if (!d) return null;
  return { day: DAYS_ID[d.getDay()], num: String(d.getDate()), monthYear: `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}` };
}

/** '19:00:00' -> '19:00' (format titik dua). */
export function timeColon(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = value.match(/(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null;
}

/** Nilai dengan fallback: teks asli template bila data acara kosong. */
export function fv(value: string | null | undefined, fallback: string): string {
  const v = (value ?? '').trim();
  return v === '' ? fallback : v;
}
