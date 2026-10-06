/** Dashboard owner: ringkasan bisnis, customers, dan semua event. */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { getDb, nowDb } from '../db/database';
import { getUser, setFlash } from '../middleware/auth';
import { renderPage, renderView, sharedData } from '../lib/render';
import { buildPagination } from '../lib/pagination';
import type { EventRow, PaymentRow, TemplateRow, UserRow } from '../db/types';
import { ACTIVE_DEFAULT_DAYS } from '../lib/events';
import { demoPhotoDir } from '../lib/upload';
import { PREVIEWS } from '../templates/registry';

interface StatusCount {
  status: string;
  total: number;
}

export async function dashboard(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const customers = (db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'customer'").get() as { c: number }).c;
  const byStatus = db
    .prepare('SELECT status, COUNT(*) AS total FROM events GROUP BY status')
    .all() as StatusCount[];
  const count = (s: string): number => byStatus.find((r) => r.status === s)?.total ?? 0;
  const revenueMonth = (
    db
      .prepare(
        `SELECT COALESCE(SUM(amount), 0) AS s FROM payments
         WHERE status = 'verified' AND strftime('%Y-%m', created_at, 'localtime') = strftime('%Y-%m', 'now', 'localtime')`,
      )
      .get() as { s: number }
  ).s;
  const pendingPayments = (
    db.prepare("SELECT COUNT(*) AS c FROM payments WHERE status = 'pending'").get() as { c: number }
  ).c;
  const expiringSoon = db
    .prepare(
      `SELECT * FROM events WHERE status IN ('active', 'trial') AND expired_at IS NOT NULL
       AND expired_at <= datetime('now', 'localtime', '+7 days') ORDER BY expired_at ASC LIMIT 10`,
    )
    .all() as EventRow[];
  const recentEvents = db.prepare('SELECT * FROM events ORDER BY id DESC LIMIT 10').all() as EventRow[];

  await renderPage(res, 'owner/layouts/app', 'owner/dashboard', sharedData(req, {
    title: 'Owner Dashboard',
    subtitle: 'Ringkasan bisnis undangan',
    activeNav: 'dashboard',
    customers,
    trialCount: count('trial'),
    activeCount: count('active'),
    expiredCount: count('expired'),
    suspendedCount: count('suspended'),
    revenueMonth,
    pendingPayments,
    expiringSoon,
    recentEvents,
  }));
}

export async function customers(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const where = search ? `WHERE role = 'customer' AND (name LIKE ? OR email LIKE ?)` : `WHERE role = 'customer'`;
  const params: unknown[] = search ? [`%${search}%`, `%${search}%`] : [];
  const total = (db.prepare(`SELECT COUNT(*) AS c FROM users ${where}`).get(...params) as { c: number }).c;
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
  const pagination = buildPagination(total, page, 20, '/owner/customers', search ? { search } : {});
  const rows = db
    .prepare(
      `SELECT u.*, (SELECT COUNT(*) FROM events e WHERE e.customer_id = u.id) AS event_count
       FROM users u ${where} ORDER BY u.id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, 20, (pagination.page - 1) * 20) as (UserRow & { event_count: number })[];

  await renderPage(res, 'owner/layouts/app', 'owner/customers/index', sharedData(req, {
    title: 'Customers',
    subtitle: 'Semua akun customer',
    activeNav: 'customers',
    customers: rows,
    pagination,
    filters: { search },
  }));
}

export async function customerDetail(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const customer = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'customer'").get(req.params.id) as
    | UserRow
    | undefined;
  if (!customer) {
    res.status(404).send('Customer tidak ditemukan.');
    return;
  }
  const events = db.prepare('SELECT * FROM events WHERE customer_id = ? ORDER BY id DESC').all(customer.id) as EventRow[];
  const grants = db
    .prepare('SELECT template_slug, source FROM customer_templates WHERE customer_id = ? ORDER BY template_slug')
    .all(customer.id) as { template_slug: string; source: string }[];
  const allTemplates = db
    .prepare('SELECT slug, name, active FROM templates ORDER BY sort_order ASC, id ASC')
    .all() as { slug: string; name: string; active: number }[];
  const granted = new Set(grants.map((g) => g.template_slug));

  await renderPage(res, 'owner/layouts/app', 'owner/customers/show', sharedData(req, {
    title: customer.name,
    subtitle: customer.email,
    activeNav: 'customers',
    customer,
    events,
    grants,
    allTemplates,
    granted: [...granted],
  }));
}

export function suspendCustomer(req: Request, res: Response): void {
  const db = getDb();
  const customer = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'customer'").get(req.params.id) as
    | UserRow
    | undefined;
  if (!customer) {
    setFlash(req, 'error', 'Customer tidak ditemukan.');
    res.redirect('/owner/customers');
    return;
  }
  const next = (customer.status ?? 'active') === 'active' ? 'suspended' : 'active';
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(next, customer.id);
  setFlash(req, 'success', next === 'suspended' ? 'Customer dinonaktifkan.' : 'Customer diaktifkan lagi.');
  res.redirect(`/owner/customers/${customer.id}`);
}

export async function events(req: Request, res: Response): Promise<void> {
  const db = getDb();
  const status = typeof req.query.status === 'string' ? req.query.status : '';
  const where = status ? 'WHERE e.status = ?' : '';
  const params: unknown[] = status ? [status] : [];
  const total = (db.prepare(`SELECT COUNT(*) AS c FROM events e ${where}`).get(...params) as { c: number }).c;
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
  const query: Record<string, string> = status ? { status } : {};
  const pagination = buildPagination(total, page, 20, '/owner/events', query);
  const rows = db
    .prepare(
      `SELECT e.*, u.name AS customer_name, u.email AS customer_email,
        (SELECT COUNT(*) FROM guests g WHERE g.event_id = e.id) AS guest_count
       FROM events e LEFT JOIN users u ON u.id = e.customer_id
       ${where} ORDER BY e.id DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, 20, (pagination.page - 1) * 20) as (EventRow & {
    customer_name: string | null;
    customer_email: string | null;
    guest_count: number;
  })[];

  await renderPage(res, 'owner/layouts/app', 'owner/events/index', sharedData(req, {
    title: 'Events',
    subtitle: 'Semua undangan customer',
    activeNav: 'events',
    events: rows,
    pagination,
    filters: { status },
  }));
}

export function extendEvent(req: Request, res: Response): void {
  const db = getDb();
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id) as EventRow | undefined;
  if (!event) {
    setFlash(req, 'error', 'Event tidak ditemukan.');
    res.redirect('/owner/events');
    return;
  }
  db.prepare(
    `UPDATE events SET status = 'active',
      expired_at = datetime(CASE WHEN expired_at > datetime('now', 'localtime') THEN expired_at ELSE datetime('now', 'localtime') END, '+30 days'),
      updated_at = ? WHERE id = ?`,
  ).run(nowDb(), event.id);
  setFlash(req, 'success', 'Event diperpanjang 30 hari dan diaktifkan.');
  res.redirect('/owner/events');
}

export function setEventStatus(req: Request, res: Response): void {
  const allowed = new Set(['active', 'expired', 'suspended']);
  const status = String(req.body?.status ?? '');
  if (!allowed.has(status)) {
    setFlash(req, 'error', 'Status tidak valid.');
    res.redirect('/owner/events');
    return;
  }
  const db = getDb();
  const info = db.prepare('UPDATE events SET status = ?, updated_at = ? WHERE id = ?').run(status, nowDb(), req.params.id);
  setFlash(req, info.changes > 0 ? 'success' : 'error', info.changes > 0 ? 'Status event diubah.' : 'Event tidak ditemukan.');
  res.redirect('/owner/events');
}

export async function templateList(req: Request, res: Response): Promise<void> {
  const rows = getDb().prepare('SELECT * FROM templates ORDER BY sort_order ASC, id ASC').all();
  await renderPage(res, 'owner/layouts/app', 'owner/templates/index', sharedData(req, {
    title: 'Katalog Template',
    subtitle: 'Kelola template yang dijual',
    activeNav: 'templates',
    templates: rows,
    previews: PREVIEWS,
  }));
}

export function templateUpdate(req: Request, res: Response): void {
  const db = getDb();
  const slug = String(req.params.slug ?? '');
  const price = Math.max(0, Math.floor(Number(req.body?.price ?? NaN)));
  const active = req.body?.active === '1' ? 1 : 0;
  const name = String(req.body?.name ?? '').trim().slice(0, 255);
  const description = String(req.body?.description ?? '').trim().slice(0, 1000);
  const text = (v: unknown): string | null => {
    const s = String(v ?? '').trim().slice(0, 255);
    return s === '' ? null : s;
  };
  if (!Number.isFinite(price) || !name) {
    setFlash(req, 'error', 'Nama dan harga wajib diisi dengan benar.');
    res.redirect('/owner/templates');
    return;
  }
  const info = db
    .prepare(
      `UPDATE templates SET name = ?, description = ?, price = ?, active = ?,
        demo_bride = ?, demo_groom = ?, demo_date = ?, demo_venue = ?, demo_address = ?, updated_at = ?
       WHERE slug = ?`,
    )
    .run(
      name,
      description || null,
      price,
      active,
      text(req.body?.demo_bride),
      text(req.body?.demo_groom),
      text(req.body?.demo_date),
      text(req.body?.demo_venue),
      text(req.body?.demo_address),
      nowDb(),
      slug,
    );
  setFlash(req, info.changes > 0 ? 'success' : 'error', info.changes > 0 ? 'Template disimpan.' : 'Template tidak ditemukan.');
  res.redirect('/owner/templates');
}

/** Halaman editor preview demo untuk satu template (khusus owner). */
export async function templatePreview(req: Request, res: Response): Promise<void> {
  const row = getDb().prepare('SELECT * FROM templates WHERE slug = ?').get(req.params.slug) as TemplateRow | undefined;
  if (!row) {
    res.status(404).send('Template tidak ditemukan.');
    return;
  }
  await renderView(res, 'owner/templates/preview', sharedData(req, {
    title: `Edit Demo ${row.name}`,
    template: row,
    demoSrc: `/template-${row.slug.replace('template-', '')}`,
  }));
}

const DEMO_TEXT_FIELDS = [
  'demo_bride', 'demo_groom', 'demo_date', 'demo_venue', 'demo_address',
  'demo_bride_father', 'demo_bride_mother', 'demo_groom_father', 'demo_groom_mother',
  'demo_instagram_bride', 'demo_instagram_groom',
] as const;

/** Simpan teks demo dari editor (JSON, whitelist kolom). */
export function saveDemoText(req: Request, res: Response): void {
  const slug = String(req.params.slug ?? '');
  const exists = getDb().prepare('SELECT slug FROM templates WHERE slug = ?').get(slug) as { slug: string } | undefined;
  if (!exists) {
    res.status(404).json({ message: 'Template tidak ditemukan.' });
    return;
  }
  const body = (req.body ?? {}) as Record<string, unknown>;
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const col of DEMO_TEXT_FIELDS) {
    if (!(col in body)) continue;
    const s = String(body[col] ?? '').trim().slice(0, 255);
    sets.push(`${col} = ?`);
    vals.push(s === '' ? null : s);
  }
  if (sets.length > 0) {
    getDb().prepare(`UPDATE templates SET ${sets.join(', ')}, updated_at = ? WHERE slug = ?`).run(...vals, nowDb(), slug);
  }
  res.json({ ok: true });
}

/** Upload foto demo (slot bride/groom). Langsung tersimpan + tampil. */
export function uploadDemoPhoto(req: Request, res: Response): void {
  const slug = String(req.params.slug ?? '');
  const slot = String(req.body?.slot ?? '');
  const file = (req as Request & { file?: Express.Multer.File }).file;
  if ((slot !== 'bride' && slot !== 'groom') || !file) {
    if (file) fs.unlink(path.join(demoPhotoDir, file.filename), () => undefined);
    res.status(422).json({ message: 'Slot bride/groom dan file gambar wajib.' });
    return;
  }
  const col = slot === 'bride' ? 'demo_bride_photo' : 'demo_groom_photo';
  const db = getDb();
  const old = db.prepare(`SELECT ${col} AS url FROM templates WHERE slug = ?`).get(slug) as { url: string | null } | undefined;
  if (!old) {
    fs.unlink(path.join(demoPhotoDir, file.filename), () => undefined);
    res.status(404).json({ message: 'Template tidak ditemukan.' });
    return;
  }
  if (old.url) fs.unlink(path.join(demoPhotoDir, path.basename(old.url)), () => undefined);
  const url = `/uploads/demo/${file.filename}`;
  db.prepare(`UPDATE templates SET ${col} = ?, updated_at = ? WHERE slug = ?`).run(url, nowDb(), slug);
  res.json({ ok: true, url });
}

/** Beri atau cabut akses template untuk satu customer. */
export function grantTemplate(req: Request, res: Response): void {
  const db = getDb();
  const customerId = req.params.id;
  const customer = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'customer'").get(customerId) as
    | UserRow
    | undefined;
  const slug = String(req.body?.template_slug ?? '');
  const template = db.prepare('SELECT slug FROM templates WHERE slug = ?').get(slug) as { slug: string } | undefined;
  if (!customer || !template) {
    setFlash(req, 'error', 'Customer atau template tidak ditemukan.');
    res.redirect(`/owner/customers/${customerId}`);
    return;
  }
  const user = getUser(req);
  if (req.body?.action === 'revoke') {
    db.prepare('DELETE FROM customer_templates WHERE customer_id = ? AND template_slug = ?').run(customerId, slug);
    setFlash(req, 'success', `Akses ${slug} dicabut.`);
  } else {
    db.prepare(
      `INSERT INTO customer_templates (customer_id, template_slug, source, granted_by, created_at)
       VALUES (?, ?, 'grant', ?, ?) ON CONFLICT(customer_id, template_slug) DO NOTHING`,
    ).run(customerId, slug, user?.id ?? null, nowDb());
    setFlash(req, 'success', `Akses ${slug} diberikan.`);
  }
  res.redirect(`/owner/customers/${customerId}`);
}

/** Daftar template yang boleh dipakai satu customer (aktif + punya akses). */
export function allowedTemplates(customerId: number): { slug: string; name: string }[] {
  return getDb()
    .prepare(
      `SELECT t.slug, t.name FROM templates t
       INNER JOIN customer_templates c ON c.template_slug = t.slug AND c.customer_id = ?
       WHERE t.active = 1 ORDER BY t.sort_order ASC, t.id ASC`,
    )
    .all(customerId) as { slug: string; name: string }[];
}

export async function payments(req: Request, res: Response): Promise<void> {
  const filter = String((req.query as Record<string, unknown>).status ?? 'pending');
  const where = filter === 'all' ? '' : "WHERE p.status = 'pending'";
  const rows = getDb()
    .prepare(
      `SELECT p.*, e.slug AS event_slug, u.name AS customer_name
       FROM payments p LEFT JOIN events e ON e.id = p.event_id LEFT JOIN users u ON u.id = e.customer_id
       ${where} ORDER BY p.id DESC LIMIT 100`,
    )
    .all() as (PaymentRow & { event_slug: string | null; customer_name: string | null })[];
  await renderPage(res, 'owner/layouts/app', 'owner/payments/index', sharedData(req, {
    title: 'Pembayaran',
    subtitle: 'Verifikasi bukti transfer',
    activeNav: 'payments',
    payments: rows,
    filter,
  }));
}

export function verifyPayment(req: Request, res: Response): void {
  const db = getDb();
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id) as PaymentRow | undefined;
  if (!payment || payment.status !== 'pending') {
    setFlash(req, 'error', 'Pembayaran tidak ditemukan atau sudah diproses.');
    res.redirect('/owner/payments');
    return;
  }
  const user = getUser(req);
  const now = nowDb();
  if (req.body?.action === 'reject') {
    db.prepare('UPDATE payments SET status = ?, verified_by = ?, updated_at = ? WHERE id = ?').run('rejected', user?.id ?? null, now, payment.id);
    setFlash(req, 'success', 'Pembayaran ditolak.');
  } else {
    db.prepare('UPDATE payments SET status = ?, verified_by = ?, updated_at = ? WHERE id = ?').run('verified', user?.id ?? null, now, payment.id);
    db.prepare(
      `UPDATE events SET status = 'active', paid_at = ?,
        expired_at = datetime(CASE WHEN expired_at > datetime('now', 'localtime') THEN expired_at ELSE datetime('now', 'localtime') END, '+${ACTIVE_DEFAULT_DAYS} days'),
        updated_at = ? WHERE id = ?`,
    ).run(now, now, payment.event_id);
    setFlash(req, 'success', 'Pembayaran diverifikasi. Event aktif.');
  }
  res.redirect('/owner/payments');
}

/** Reset password customer (min 8 karakter). */
export function resetCustomerPassword(req: Request, res: Response): void {
  const db = getDb();
  const customer = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'customer'").get(req.params.id) as
    | UserRow
    | undefined;
  const password = String(req.body?.password ?? '');
  if (!customer) {
    setFlash(req, 'error', 'Customer tidak ditemukan.');
    res.redirect('/owner/customers');
    return;
  }
  if (password.length < 8) {
    setFlash(req, 'error', 'Password baru minimal 8 karakter.');
    res.redirect(`/owner/customers/${customer.id}`);
    return;
  }
  db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
    bcrypt.hashSync(password, 10),
    nowDb(),
    customer.id,
  );
  setFlash(req, 'success', 'Password customer direset.');
  res.redirect(`/owner/customers/${customer.id}`);
}
