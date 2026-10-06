import type { Request } from 'express';
import { getDb, nowDb } from '../db/database';
import type { EventRow } from '../db/types';

export type EventAccess = 'live' | 'trial' | 'closed';

/** Batas paket. Diubah owner manual per event bila perlu (tahap lanjut). */
export const TRIAL_DAYS = 7;
export const TRIAL_MAX_GUESTS = 20;
export const ACTIVE_DEFAULT_DAYS = 90;
export const ACTIVE_MAX_GUESTS = 500;

export function maxGuestsFor(event: EventRow): number {
  return event.status === 'trial' ? TRIAL_MAX_GUESTS : ACTIVE_MAX_GUESTS;
}

/** Ambil event dari slug undangan. */
export function getEventBySlug(slug: string): EventRow | undefined {
  return getDb().prepare('SELECT * FROM events WHERE slug = ?').get(slug) as EventRow | undefined;
}

/** Ambil event dari id numerik. */
export function getEventById(id: string | number): EventRow | undefined {
  return getDb().prepare('SELECT * FROM events WHERE id = ?').get(id) as EventRow | undefined;
}

/** Tandai expired bila lewat expired_at. Mengembalikan status terbaru. */
export function refreshEventStatus(event: EventRow): EventRow {
  if ((event.status === 'active' || event.status === 'trial') && event.expired_at && event.expired_at < nowDb()) {
    getDb().prepare("UPDATE events SET status = 'expired', updated_at = ? WHERE id = ?").run(nowDb(), event.id);
    return { ...event, status: 'expired' };
  }
  return event;
}

/** Status tampil undangan: trial tetap tampil (dengan watermark di tahap 5). */
export function eventAccess(event: EventRow): EventAccess {
  const fresh = refreshEventStatus(event);
  return fresh.status === 'active' || fresh.status === 'trial' ? (fresh.status as EventAccess) : 'closed';
}

export function getEventParam(req: Request): string {
  return typeof req.params.slug === 'string' ? req.params.slug : '';
}
