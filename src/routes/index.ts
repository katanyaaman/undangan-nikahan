/** Route publik: home, template undangan, RSVP. */
import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { getInvitationData } from '../controllers/invitationController';
import { storeRsvp } from '../controllers/guestController';
import { renderPage, renderView, renderInvitation, sharedData } from '../lib/render';
import { ah } from '../lib/asyncHandler';
import { eventAccess, getEventBySlug, getEventParam } from '../lib/events';
import { formatDate } from '../lib/dates';
import { createOrder, showOrderForm } from '../controllers/orderController';
import { limiters } from '../middleware/rateLimit';
import { getDb } from '../db/database';
import type { EventRow } from '../db/types';
import type { TemplateRow } from '../db/types';
import { getTemplate, PREVIEWS, templates } from '../templates/registry';

const router = Router();

router.get('/', ah(async (req: Request, res: Response) => {
  const rows = getDb()
    .prepare('SELECT * FROM templates WHERE active = 1 ORDER BY sort_order ASC, id ASC')
    .all() as TemplateRow[];
  await renderView(res, 'home', sharedData(req, {
    title: 'Katalog Undangan Digital - Wedding Invitation',
    templates: rows,
    previews: PREVIEWS,
  }));
}));

// Legacy Laravel: /invitation -> template-1
router.get('/invitation', (_req: Request, res: Response) => {
  res.redirect('/template-1');
});

// Dibuat otomatis dari registry. Tambah template cukup edit registry.ts..
// template-1 & invitation dibungkus layouts/app (dulu @extends);
// template-2/3/4 halaman penuh sendiri (standalone seperti di Blade).
for (const t of templates) {
  const standalone = t.slug !== 'template-1';
  router.get(`/${t.slug}`, ah(async (req: Request, res: Response) => {
    const tpl = getTemplate(t.slug);
    if (!tpl) {
      res.status(404).send('Template tidak ditemukan.');
      return;
    }
    // Demo untuk jualan: event semu dari konten staging owner (fallback teks asli bila kosong).
    const staged = getDb().prepare('SELECT * FROM templates WHERE slug = ?').get(t.slug) as TemplateRow | undefined;
    const demoEvent = staged
      ? ({
          id: 0,
          customer_id: null,
          template_slug: staged.slug,
          slug: null,
          status: 'active',
          paid_at: null,
          expired_at: null,
          event_type: 'wedding',
          bride_name: staged.demo_bride,
          bride_father: staged.demo_bride_father,
          bride_mother: staged.demo_bride_mother,
          groom_name: staged.demo_groom,
          groom_father: staged.demo_groom_father,
          groom_mother: staged.demo_groom_mother,
          event_title: null,
          event_description: null,
          event_date: staged.demo_date,
          event_time_start: null,
          event_time_end: null,
          venue_name: staged.demo_venue,
          venue_address: staged.demo_address,
          venue_city: null,
          venue_maps_url: null,
          venue_latitude: null,
          venue_longitude: null,
          instagram_bride: staged.demo_instagram_bride,
          instagram_groom: staged.demo_instagram_groom,
          love_story: null,
          gallery_folder: null,
          background_music: null,
          is_active: 1,
          created_at: '',
          updated_at: '',
        } as EventRow)
      : null;
    const data = sharedData(req, {
      title: 'Undangan Pernikahan - Nama Pengantin',
      ...getInvitationData(req, demoEvent, `/${t.slug}/rsvp`),
      bridePhoto: staged?.demo_bride_photo ?? null,
      groomPhoto: staged?.demo_groom_photo ?? null,
    });
    if (standalone) {
      await renderView(res, tpl.view, data);
    } else {
      await renderPage(res, 'layouts/app', tpl.view, data);
    }
  }));
  router.post(`/${t.slug}/rsvp`, limiters.rsvpLimiter, storeRsvp);
}

// Order template: form + simpan.
router.get('/order/:template', ah(showOrderForm));
router.post('/order', limiters.orderLimiter, createOrder);

// Health check (pengganti /up Laravel)
router.get('/up', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Undangan live per event: /u/:slug
router.get('/u/:slug', ah(async (req: Request, res: Response) => {
  const event = getEventBySlug(getEventParam(req));
  if (!event || eventAccess(event) === 'closed') {
    res.status(404);
    await renderView(res, 'invitation/closed', sharedData(req, { title: 'Undangan Tidak Tersedia' }));
    return;
  }
  const tpl = getTemplate(event.template_slug);
  if (!tpl) {
    res.status(404);
    await renderView(res, 'invitation/closed', sharedData(req, { title: 'Undangan Tidak Tersedia' }));
    return;
  }
  const data = sharedData(req, {
    title: event.event_title || 'Undangan Pernikahan',
    ...getInvitationData(req, event, `/u/${event.slug}/rsvp`),
  });
  const trial = event.status === 'trial' && event.expired_at
    ? { expiresText: formatDate(event.expired_at, 'd M Y') }
    : null;
  if (tpl.slug === 'template-1') {
    await renderInvitation(res, 'layouts/app', tpl.view, data, trial);
  } else {
    await renderInvitation(res, null, tpl.view, data, trial);
  }
}));

// RSVP per event. Event tutup (expired/suspend) ditolak.
router.post('/u/:slug/rsvp', (req: Request, res: Response, next: NextFunction) => {
  const event = getEventBySlug(getEventParam(req));
  if (!event || eventAccess(event) === 'closed') {
    res.status(410).json({ message: 'Undangan ini sudah tidak menerima RSVP.' });
    return;
  }
  const r = req as Request & { eventId?: number; eventRow?: EventRow };
  r.eventId = event.id;
  r.eventRow = event;
  next();
}, limiters.rsvpLimiter, storeRsvp);

export default router;
