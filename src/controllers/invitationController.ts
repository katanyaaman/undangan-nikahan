/**
 * Data undangan untuk semua template, kolomnya sama seperti versi Laravel.
 * Bila event null: angka global (rute demo /template-N lama).
 * Bila event diisi: angka + tanggal + venue dari acara itu.
 */
import type { Request } from 'express';
import { getDb } from '../db/database';
import { buildPagination } from '../lib/pagination';
import { dateParts, formatLongId, formatShortId, timeColon, timeHM } from '../lib/dates';
import { config } from '../config';
import type { EventRow, GuestRow } from '../db/types';

export interface EventPhotos {
  bridePhoto: string | null;
  groomPhoto: string | null;
  galleryPhotos: string[];
}

/** Foto acara: bride/groom (1 tiap) + galeri berurutan. */
export function eventPhotos(eventId: number | null): EventPhotos {
  const empty: EventPhotos = { bridePhoto: null, groomPhoto: null, galleryPhotos: [] };
  if (!eventId) return empty;
  const rows = getDb()
    .prepare('SELECT kind, url FROM photos WHERE event_id = ? ORDER BY sort_order ASC, id ASC')
    .all(eventId) as { kind: string; url: string }[];
  for (const row of rows) {
    if (row.kind === 'bride' && !empty.bridePhoto) empty.bridePhoto = row.url;
    else if (row.kind === 'groom' && !empty.groomPhoto) empty.groomPhoto = row.url;
    else if (row.kind === 'gallery') empty.galleryPhotos.push(row.url);
  }
  return empty;
}

export interface InvitationData {
  event: EventRow | null;
  eventDate: string;
  eventDateLong: string | null;
  eventDateShort: string | null;
  eventDayName: string | null;
  eventDayNum: string | null;
  eventMonthYear: string | null;
  eventTimeStart: string | null;
  eventTimeRange: string | null;
  eventTimeWita: string | null;
  rsvpPath: string;
  venueName: string | null;
  venueAddress: string | null;
  confirmedGuests: number;
  totalCapacity: number;
  wishes: GuestRow[];
  wishesPagination: ReturnType<typeof buildPagination>;
  totalWishes: number;
  attendingCount: number;
  notAttendingCount: number;
  totalGuests: number;
  bridePhoto: string | null;
  groomPhoto: string | null;
  galleryPhotos: string[];
}

export function getInvitationData(req: Request, event: EventRow | null = null, rsvpPath = ''): InvitationData {
  const db = getDb();
  // Rute demo (tanpa event): tampilkan angka nol, jangan bocorkan data customer.
  if (!event) {
    return {
      event: null,
      eventDate: config.eventDate,
      eventDateLong: null,
      eventDateShort: null,
      eventDayName: null,
      eventDayNum: null,
      eventMonthYear: null,
      eventTimeStart: null,
      eventTimeRange: null,
      eventTimeWita: null,
      rsvpPath,
      venueName: null,
      venueAddress: null,
      confirmedGuests: 0,
      totalCapacity: config.totalCapacity,
      wishes: [],
      wishesPagination: buildPagination(0, 1, 10, req.path, {}),
      totalWishes: 0,
      attendingCount: 0,
      notAttendingCount: 0,
      totalGuests: 0,
      bridePhoto: null,
      groomPhoto: null,
      galleryPhotos: [],
    };
  }
  const scope = 'AND event_id = ?';
  const params = [event.id];
  const one = (sql: string): number => (db.prepare(sql).get(...params) as { c: number }).c;

  const eventDate = event?.event_date ?? config.eventDate;
  const totalCapacity = config.totalCapacity;

  const confirmedGuests = one(`SELECT COUNT(*) AS c FROM guests WHERE is_confirmed = 1 ${scope}`);
  const totalWishes = one(`SELECT COUNT(*) AS c FROM guests WHERE message IS NOT NULL AND message != '' ${scope}`);
  const attendingCount = one(`SELECT COUNT(*) AS c FROM guests WHERE attendance = 'hadir' ${scope}`);
  const notAttendingCount = one(`SELECT COUNT(*) AS c FROM guests WHERE attendance = 'tidak_hadir' ${scope}`);
  const totalGuests = (
    db.prepare(`SELECT COALESCE(SUM(number_of_guests), 0) AS s FROM guests WHERE attendance = 'hadir' ${scope}`).get(...params) as { s: number }
  ).s;

  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
  const perPage = 10;
  const wishesPagination = buildPagination(totalWishes, page, perPage, req.path, {});
  const wishes = db
    .prepare(
      `SELECT * FROM guests WHERE message IS NOT NULL AND message != '' ${scope} ORDER BY id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, perPage, (wishesPagination.page - 1) * perPage) as GuestRow[];

  const startHM = event ? timeHM(event.event_time_start) : null;
  const endHM = event ? timeHM(event.event_time_end) : null;
  const parts = event ? dateParts(event.event_date) : null;
  const startColon = event ? timeColon(event.event_time_start) : null;
  const endColon = event ? timeColon(event.event_time_end) : null;

  return {
    event,
    eventDate,
    eventDateLong: event ? formatLongId(event.event_date) : null,
    eventDateShort: event ? formatShortId(event.event_date) : null,
    eventDayName: parts?.day ?? null,
    eventDayNum: parts?.num ?? null,
    eventMonthYear: parts?.monthYear ?? null,
    eventTimeStart: startHM ? `Pukul ${startHM} WIB` : null,
    eventTimeRange: startHM ? `${startHM} - ${endHM ?? 'Selesai'}` : null,
    eventTimeWita: startColon ? `${startColon}${endColon ? ` - ${endColon}` : ''} WITA` : null,
    rsvpPath,
    venueName: event?.venue_name ?? null,
    venueAddress: event?.venue_address ?? null,
    confirmedGuests,
    totalCapacity,
    wishes,
    wishesPagination,
    totalWishes,
    attendingCount,
    notAttendingCount,
    totalGuests,
    ...eventPhotos(event?.id ?? null),
  };
}
