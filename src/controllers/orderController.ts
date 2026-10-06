/** Order template: buat akun customer + event trial + hak akses purchase. */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { futureDb, getDb, nowDb } from '../db/database';
import { setFlash } from '../middleware/auth';
import { renderView, sharedData } from '../lib/render';
import { orderAccountSchema, orderEventSchema, toFieldErrors } from '../validation/schemas';
import { getTemplate } from '../templates/registry';
import { TRIAL_DAYS } from '../lib/events';
import type { TemplateRow } from '../db/types';

function activeTemplates(): TemplateRow[] {
  return getDb().prepare('SELECT * FROM templates WHERE active = 1 ORDER BY sort_order ASC, id ASC').all() as TemplateRow[];
}

export async function showOrderForm(req: Request, res: Response): Promise<void> {
  const slug = String(req.params.template ?? '');
  const meta = getTemplate(slug);
  const row = meta
    ? (getDb().prepare('SELECT * FROM templates WHERE slug = ? AND active = 1').get(slug) as TemplateRow | undefined)
    : undefined;
  if (!meta || !row) {
    res.status(404).send('Template tidak ditemukan.');
    return;
  }
  await renderView(res, 'order', sharedData(req, {
    title: `Pesan ${row.name}`,
    template: row,
    templates: activeTemplates(),
    loggedIn: Boolean(req.session.user),
  }));
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const sessionUser = req.session.user ?? null;

  const errors: Record<string, string[]> = {};
  if (!sessionUser) {
    const account = orderAccountSchema.safeParse(body);
    if (!account.success) Object.assign(errors, toFieldErrors(account.error));
  }
  const eventPart = orderEventSchema.safeParse(body);
  if (!eventPart.success) Object.assign(errors, toFieldErrors(eventPart.error));
  const fieldErrors: Record<string, string> = {};
  for (const [k, v] of Object.entries(errors)) fieldErrors[k] = v[0];

  const db = getDb();
  const templateSlug = String(body.template_slug ?? '');
  const meta = getTemplate(templateSlug);
  const row = meta
    ? (db.prepare('SELECT * FROM templates WHERE slug = ? AND active = 1').get(templateSlug) as TemplateRow | undefined)
    : undefined;
  if (!row) {
    fieldErrors.template_slug = 'Template tidak tersedia.';
  }
  const slug = String(body.slug ?? '').trim().toLowerCase();
  const slugTaken = slug ? db.prepare('SELECT id FROM events WHERE slug = ?').get(slug) : null;
  if (slug && slugTaken) {
    (errors.slug = errors.slug ?? []).push('Slug undangan sudah dipakai.');
    fieldErrors.slug = 'Slug undangan sudah dipakai.';
  }
  let email = '';
  let password = '';
  let name = '';
  let customerId = sessionUser?.id ?? 0;
  if (!sessionUser) {
    email = String(body.email ?? '').trim();
    password = String(body.password ?? '');
    name = String(body.name ?? '').trim();
    if (email && db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
      (errors.email = errors.email ?? []).push('Email sudah terdaftar. Silakan login.');
      fieldErrors.email = 'Email sudah terdaftar. Silakan login.';
    }
  }

  if (Object.keys(fieldErrors).length > 0 || !row || !slug || slugTaken) {
    res.status(422);
    await renderView(res, 'order', sharedData(req, {
      title: 'Pesan Template',
      template: row ?? null,
      templates: activeTemplates(),
      loggedIn: Boolean(sessionUser),
      errors: Object.values(errors).map((m) => m[0]),
      fieldErrors,
      old: body,
    }));
    return;
  }

  const now = nowDb();
  if (!sessionUser) {
    const info = db
      .prepare(`INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at) VALUES (?, ?, ?, 'customer', 'active', ?, ?)`)
      .run(name, email, bcrypt.hashSync(password, 10), now, now);
    customerId = Number(info.lastInsertRowid);
  }
  const eventInfo = db
    .prepare(
      `INSERT INTO events (customer_id, template_slug, slug, status, expired_at, event_type, is_active, created_at, updated_at)
       VALUES (?, ?, ?, 'trial', ?, 'wedding', 1, ?, ?)`,
    )
    .run(customerId, templateSlug, slug, futureDb(TRIAL_DAYS), now, now);
  db.prepare(
    `INSERT OR IGNORE INTO customer_templates (customer_id, template_slug, source, created_at) VALUES (?, ?, 'purchase', ?)`,
  ).run(customerId, templateSlug, now);

  if (!sessionUser) {
    req.session.regenerate((err) => {
      if (err) {
        setFlash(req, 'error', 'Order berhasil. Silakan login.');
        res.redirect('/login');
        return;
      }
      const created = db.prepare('SELECT * FROM users WHERE id = ?').get(customerId) as { id: number; name: string; email: string; role: string };
      req.session.user = { id: created.id, name: created.name, email: created.email, role: created.role };
      setFlash(req, 'success', 'Undangan trial dibuat. Lengkapi data acaramu.');
      res.redirect(`/admin/events/${eventInfo.lastInsertRowid}`);
    });
    return;
  }
  setFlash(req, 'success', 'Undangan trial dibuat. Lengkapi data acaramu.');
  res.redirect(`/admin/events/${eventInfo.lastInsertRowid}`);
}
