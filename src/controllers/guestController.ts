import type { Request, Response } from 'express';
import { getDb, nowDb } from '../db/database';
import { maxGuestsFor } from '../lib/events';
import { rsvpSchema, toFieldErrors } from '../validation/schemas';
import type { EventRow } from '../db/types';

function normalize<T>(v: T | undefined): T | null {
  return v === undefined ? null : v;
}

export function storeRsvp(req: Request, res: Response): void {
  const parsed = rsvpSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    res.status(422).json({ message: 'Validasi gagal.', errors });
    return;
  }
  const db = getDb();
  const eventId = (req as Request & { eventId?: number }).eventId ?? null;
  const eventRow = (req as Request & { eventRow?: EventRow }).eventRow ?? null;
  if (eventRow) {
    const total = (db.prepare('SELECT COUNT(*) AS c FROM guests WHERE event_id = ?').get(eventRow.id) as { c: number }).c;
    if (total >= maxGuestsFor(eventRow)) {
      res.status(422).json({
        message: 'Validasi gagal.',
        errors: { guests: ['Kuota RSVP acara ini sudah penuh.'] },
      });
      return;
    }
  }
  const exists = db
    .prepare('SELECT id FROM guests WHERE email = ? AND COALESCE(event_id, -1) = COALESCE(?, -1)')
    .get(parsed.data.email, eventId);
  if (exists) {
    res.status(422).json({
      message: 'Validasi gagal.',
      errors: { email: ['The email has already been taken.'] },
    });
    return;
  }
  const now = nowDb();
  const info = db
    .prepare(
      `INSERT INTO guests (event_id, name, email, phone, number_of_guests, message, attendance, is_confirmed, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    )
    .run(
      eventId,
      parsed.data.name,
      parsed.data.email,
      normalize(parsed.data.phone),
      parsed.data.number_of_guests,
      normalize(parsed.data.message),
      parsed.data.attendance,
      now,
      now,
    );
  const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({
    success: true,
    message: 'Terima kasih! RSVP Anda telah berhasil dikirim.',
    data: guest,
  });
}
