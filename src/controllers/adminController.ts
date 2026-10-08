/**
 * Area customer per event. Semua fungsi membaca event dari req.event
 * (diisi middleware loadOwnEvent) dan base URL dari req.adminBase.
 */
import type { Request } from 'express';
import type { Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { getDb, nowDb } from '../db/database';
import { getUser, setFlash } from '../middleware/auth';
import { allowedTemplates } from './ownerController';
import { PREVIEWS, TEMPLATE_THEMES } from '../templates/registry';
import { GALLERY_ACTIVE_MAX, GALLERY_TRIAL_MAX, photosDir } from '../lib/upload';
import { renderPage, sharedData } from '../lib/render';
import { buildPagination } from '../lib/pagination';
import { eventSettingsSchema, toFieldErrors } from '../validation/schemas';
import type { EventRow, GuestRow, PhotoRow } from '../db/types';

interface EventRequest extends Request {
  event?: EventRow;
  adminBase?: string;
}

function ev(req: EventRequest): EventRow {
  const event = req.event;
  if (!event) throw new Error('Event tidak dimuat.');
  return event;
}

function base(req: EventRequest): string {
  return req.adminBase ?? '/admin';
}

function count(sql: string, ...params: unknown[]): number {
  return (getDb().prepare(sql).get(...params) as { c: number }).c;
}

/** Daftar event milik user. Satu event langsung dilempar ke dashboardnya. */
export async function myEvents(req: Request, res: Response): Promise<void> {
  const user = getUser(req);
  if (!user) {
    res.redirect('/login');
    return;
  }
  const db = getDb();
  const rows =
    user.role === 'owner'
      ? ((db.prepare('SELECT * FROM events ORDER BY id DESC').all() as EventRow[]))
      : ((db.prepare('SELECT * FROM events WHERE customer_id = ? ORDER BY id DESC').all(user.id) as EventRow[]));
  if (rows.length === 1) {
    res.redirect(`/admin/events/${rows[0].id}`);
    return;
  }
  await renderPage(res, 'admin/layouts/app', 'admin/myevents', sharedData(req, {
    title: 'Undangan Saya',
    subtitle: 'Pilih acara yang dikelola',
    activeNav: '',
    base: '/admin',
    events: rows,
  }));
}

export async function dashboard(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const totalGuests = count('SELECT COUNT(*) AS c FROM guests WHERE event_id = ?', event.id);
  const confirmedGuests = count('SELECT COUNT(*) AS c FROM guests WHERE event_id = ? AND is_confirmed = 1', event.id);
  const attendingGuests = count("SELECT COUNT(*) AS c FROM guests WHERE event_id = ? AND attendance = 'hadir'", event.id);
  const notAttendingGuests = count("SELECT COUNT(*) AS c FROM guests WHERE event_id = ? AND attendance = 'tidak_hadir'", event.id);
  const undecidedGuests = count("SELECT COUNT(*) AS c FROM guests WHERE event_id = ? AND attendance = 'masih_ragu'", event.id);
  const recentGuests = getDb().prepare('SELECT * FROM guests WHERE event_id = ? ORDER BY id DESC LIMIT 10').all(event.id) as GuestRow[];
  const attendanceStats = getDb()
    .prepare('SELECT attendance, COUNT(*) AS total FROM guests WHERE event_id = ? GROUP BY attendance')
    .all(event.id) as { attendance: string; total: number }[];
  const dailyRegistrations = getDb()
    .prepare(
      `SELECT date(created_at) AS date, COUNT(*) AS total FROM guests
       WHERE event_id = ? AND created_at >= datetime('now', 'localtime', '-7 days')
       GROUP BY date ORDER BY date ASC`,
    )
    .all(event.id) as { date: string; total: number }[];

  await renderPage(res, 'admin/layouts/app', 'admin/dashboard', sharedData(req, {
    title: 'Dashboard',
    subtitle: event.slug ? `/u/${event.slug}` : '',
    activeNav: 'dashboard',
    base: base(r),
    event,
    totalGuests,
    confirmedGuests,
    attendingGuests,
    notAttendingGuests,
    undecidedGuests,
    recentGuests,
    attendanceStats,
    dailyRegistrations,
  }));
}

const SORTABLE = new Set(['created_at', 'name', 'email', 'attendance']);

export async function guests(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const b = base(r);
  const db = getDb();
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const attendance = typeof req.query.attendance === 'string' ? req.query.attendance : '';
  const sortBy = SORTABLE.has(String(req.query.sort)) ? String(req.query.sort) : 'created_at';
  const sortOrder = String(req.query.order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const where: string[] = ['event_id = ?'];
  const params: unknown[] = [event.id];
  if (search) {
    where.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (attendance) {
    where.push('attendance = ?');
    params.push(attendance);
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;
  const orderSql = sortBy === 'created_at' ? `ORDER BY created_at ${sortOrder}, id ${sortOrder}` : `ORDER BY ${sortBy} ${sortOrder}`;

  const total = (db.prepare(`SELECT COUNT(*) AS c FROM guests ${whereSql}`).get(...params) as { c: number }).c;
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
  const perPage = 20;
  const query: Record<string, string> = {};
  if (search) query.search = search;
  if (attendance) query.attendance = attendance;
  const pagination = buildPagination(total, page, perPage, `${b}/guests`, query);
  const rows = db
    .prepare(`SELECT * FROM guests ${whereSql} ${orderSql} LIMIT ? OFFSET ?`)
    .all(...params, perPage, (pagination.page - 1) * perPage) as GuestRow[];

  await renderPage(res, 'admin/layouts/app', 'admin/guests/index', sharedData(req, {
    title: 'Manage Guests',
    subtitle: 'View and manage all RSVP responses',
    activeNav: 'guests',
    base: b,
    event,
    guests: rows,
    pagination,
    filters: { search, attendance },
  }));
}

export async function showGuest(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const guest = getDb().prepare('SELECT * FROM guests WHERE id = ? AND event_id = ?').get(req.params.id, event.id) as
    | GuestRow
    | undefined;
  if (!guest) {
    res.status(404).send('Tamu tidak ditemukan.');
    return;
  }
  await renderPage(res, 'admin/layouts/app', 'admin/guests/show', sharedData(req, {
    title: 'Guest Details',
    subtitle: 'View guest information',
    activeNav: 'guests',
    base: base(r),
    event,
    guest,
  }));
}

export function deleteGuest(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  const info = getDb().prepare('DELETE FROM guests WHERE id = ? AND event_id = ?').run(req.params.id, event.id);
  if (info.changes === 0) {
    setFlash(req, 'error', 'Tamu tidak ditemukan.');
  } else {
    setFlash(req, 'success', 'Tamu berhasil dihapus.');
  }
  res.redirect(`${base(r)}/guests`);
}

export function exportGuests(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  if (event.status === 'trial') {
    setFlash(req, 'error', 'Export CSV hanya untuk event aktif. Upgrade dulu.');
    res.redirect(`${base(r)}`);
    return;
  }
  const rows = getDb()
    .prepare('SELECT * FROM guests WHERE event_id = ? ORDER BY created_at DESC, id DESC')
    .all(event.id) as GuestRow[];
  const stamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="guests_${event.slug ?? event.id}_${stamp}.csv"`);
  const esc = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  res.write(['ID', 'Nama', 'Email', 'Kehadiran', 'Jumlah Tamu', 'Pesan', 'Tanggal Konfirmasi'].map(esc).join(',') + '\n');
  for (const g of rows) {
    res.write([g.id, g.name, g.email, g.attendance, g.number_of_guests, g.message ?? '', g.created_at].map(esc).join(',') + '\n');
  }
  res.end();
}

export async function settings(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  await renderPage(res, 'admin/layouts/app', 'admin/settings', sharedData(req, {
    title: 'Settings',
    subtitle: 'Manage your admin settings',
    activeNav: 'settings',
    base: base(r),
    event: ev(r),
  }));
}

export async function editEventSettings(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  await renderPage(res, 'admin/layouts/app', 'admin/event-settings', sharedData(req, {
    title: 'Event Settings',
    subtitle: 'Manage event and couple information',
    activeNav: 'settings',
    base: base(r),
    event: ev(r),
  }));
}

export async function updateEventSettings(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const b = base(r);
  const parsed = eventSettingsSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const errors = toFieldErrors(parsed.error);
    const fieldErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors)) fieldErrors[k] = v[0];
    res.status(422);
    await renderPage(res, 'admin/layouts/app', 'admin/event-settings', sharedData(req, {
      title: 'Event Settings',
      subtitle: 'Manage event and couple information',
      activeNav: 'settings',
      base: b,
      event: { ...event, ...((req.body ?? {}) as Record<string, unknown>) },
      errors: Object.values(errors).map((m) => m[0]),
      fieldErrors,
      old: req.body ?? {},
    }));
    return;
  }
  const updates: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(parsed.data)) {
    updates[k] = v ?? null;
  }
  const keys = Object.keys(updates);
  const now = nowDb();
  if (keys.length > 0) {
    getDb()
      .prepare(`UPDATE events SET ${keys.map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE id = ?`)
      .run(...keys.map((k) => updates[k]), now, event.id);
  }
  setFlash(req, 'success', 'Pengaturan event berhasil disimpan!');
  res.redirect(`${b}/settings`);
}

export async function editTemplate(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const user = getUser(req);
  const allowed = user ? allowedTemplates(event.customer_id ?? user.id) : [];
  await renderPage(res, 'admin/layouts/app', 'admin/template', sharedData(req, {
    title: 'Galeri Template',
    subtitle: 'Lihat preview lalu pilih untuk undanganmu',
    activeNav: 'template',
    base: base(r),
    event,
    allowed,
    previews: PREVIEWS,
    templateThemes: TEMPLATE_THEMES,
  }));
}

export function updateTemplate(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  const user = getUser(req);
  const slug = String(req.body?.template_slug ?? '');
  const ok = user && allowedTemplates(event.customer_id ?? user.id).some((t) => t.slug === slug);
  if (!ok) {
    setFlash(req, 'error', 'Template tidak tersedia untukmu.');
    res.redirect(`${base(r)}/template`);
    return;
  }
  getDb().prepare('UPDATE events SET template_slug = ?, updated_at = ? WHERE id = ?').run(slug, nowDb(), event.id);
  setFlash(req, 'success', 'Template berhasil diganti.');
  res.redirect(`${base(r)}/settings`);
}

export async function upgrade(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const db = getDb();
  const template = db.prepare('SELECT * FROM templates WHERE slug = ?').get(event.template_slug) as
    | { name: string; price: number }
    | undefined;
  const pending = db
    .prepare("SELECT * FROM payments WHERE event_id = ? AND status = 'pending' ORDER BY id DESC LIMIT 1")
    .get(event.id);
  const history = db.prepare('SELECT * FROM payments WHERE event_id = ? ORDER BY id DESC LIMIT 10').all(event.id);
  await renderPage(res, 'admin/layouts/app', 'admin/upgrade', sharedData(req, {
    title: 'Upgrade ke Aktif',
    subtitle: 'Bayar untuk masa aktif penuh',
    activeNav: 'settings',
    base: base(r),
    event,
    template,
    pending,
    history,
  }));
}

export function submitUpgrade(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  if (event.status === 'active') {
    setFlash(req, 'success', 'Event sudah aktif.');
    res.redirect(`${base(r)}/settings`);
    return;
  }
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if (!file) {
    setFlash(req, 'error', 'Lampirkan foto bukti transfer.');
    res.redirect(`${base(r)}/upgrade`);
    return;
  }
  const db = getDb();
  const template = db.prepare('SELECT price FROM templates WHERE slug = ?').get(event.template_slug) as
    | { price: number }
    | undefined;
  db.prepare(
    `INSERT INTO payments (event_id, amount, method, proof_image, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
  ).run(
    event.id,
    template?.price ?? 0,
    String(req.body?.method ?? 'transfer'),
    `/uploads/proofs/${file.filename}`,
    nowDb(),
    nowDb(),
  );
  setFlash(req, 'success', 'Bukti diterima. Tunggu verifikasi owner.');
  res.redirect(`${base(r)}/upgrade`);
}

export async function photos(req: Request, res: Response): Promise<void> {
  const r = req as EventRequest;
  const event = ev(r);
  const rows = getDb()
    .prepare('SELECT * FROM photos WHERE event_id = ? ORDER BY sort_order ASC, id ASC')
    .all(event.id) as PhotoRow[];
  const galleryCount = rows.filter((p) => p.kind === 'gallery').length;
  const galleryMax = event.status === 'trial' ? GALLERY_TRIAL_MAX : GALLERY_ACTIVE_MAX;
  await renderPage(res, 'admin/layouts/app', 'admin/photos', sharedData(req, {
    title: 'Foto',
    subtitle: 'Foto mempelai dan galeri',
    activeNav: 'photos',
    base: base(r),
    event,
    bride: rows.find((p) => p.kind === 'bride') ?? null,
    groom: rows.find((p) => p.kind === 'groom') ?? null,
    gallery: rows.filter((p) => p.kind === 'gallery'),
    galleryCount,
    galleryMax,
  }));
}

function savePhoto(eventId: number, kind: string, filename: string): void {
  const db = getDb();
  const now = nowDb();
  if (kind === 'bride' || kind === 'groom') {
    const old = db.prepare('SELECT * FROM photos WHERE event_id = ? AND kind = ?').get(eventId, kind) as PhotoRow | undefined;
    if (old) {
      fs.unlink(path.join(photosDir, path.basename(old.url)), () => undefined);
      db.prepare('UPDATE photos SET url = ? WHERE id = ?').run(`/uploads/photos/${filename}`, old.id);
      return;
    }
  }
  const maxSort = (db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM photos WHERE event_id = ?').get(eventId) as { m: number }).m;
  db.prepare('INSERT INTO photos (event_id, kind, url, sort_order) VALUES (?, ?, ?, ?)').run(eventId, kind, `/uploads/photos/${filename}`, maxSort + 1);
}

export function uploadCouplePhoto(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  const kind = String(req.body?.kind ?? '');
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if ((kind !== 'bride' && kind !== 'groom') || !file) {
    if (file) fs.unlink(path.join(photosDir, file.filename), () => undefined);
    setFlash(req, 'error', 'Pilih foto mempelai dan file gambar.');
    res.redirect(`${base(r)}/photos`);
    return;
  }
  savePhoto(event.id, kind, file.filename);
  setFlash(req, 'success', 'Foto tersimpan.');
  res.redirect(`${base(r)}/photos`);
}

export function uploadGalleryPhotos(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  const files = ((req as Request & { files?: Express.Multer.File[] }).files ?? []) as Express.Multer.File[];
  const db = getDb();
  const current = (db.prepare("SELECT COUNT(*) AS c FROM photos WHERE event_id = ? AND kind = 'gallery'").get(event.id) as { c: number }).c;
  const max = event.status === 'trial' ? GALLERY_TRIAL_MAX : GALLERY_ACTIVE_MAX;
  if (files.length === 0) {
    setFlash(req, 'error', 'Pilih minimal satu foto.');
    res.redirect(`${base(r)}/photos`);
    return;
  }
  if (current + files.length > max) {
    for (const f of files) fs.unlink(path.join(photosDir, f.filename), () => undefined);
    setFlash(req, 'error', `Maksimal ${max} foto galeri untuk status ${event.status}.`);
    res.redirect(`${base(r)}/photos`);
    return;
  }
  for (const f of files) savePhoto(event.id, 'gallery', f.filename);
  setFlash(req, 'success', `${files.length} foto ditambahkan.`);
  res.redirect(`${base(r)}/photos`);
}

export function deletePhoto(req: Request, res: Response): void {
  const r = req as EventRequest;
  const event = ev(r);
  const db = getDb();
  const photo = db.prepare('SELECT * FROM photos WHERE id = ? AND event_id = ?').get(req.params.photoId, event.id) as
    | PhotoRow
    | undefined;
  if (!photo) {
    setFlash(req, 'error', 'Foto tidak ditemukan.');
    res.redirect(`${base(r)}/photos`);
    return;
  }
  fs.unlink(path.join(photosDir, path.basename(photo.url)), () => undefined);
  db.prepare('DELETE FROM photos WHERE id = ?').run(photo.id);
  setFlash(req, 'success', 'Foto dihapus.');
  res.redirect(`${base(r)}/photos`);
}
