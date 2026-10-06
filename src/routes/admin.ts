/** Area customer per event + redirect rute lama. */
import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import {
  dashboard,
  deleteGuest,
  deletePhoto,
  editEventSettings,
  editTemplate,
  exportGuests,
  guests,
  myEvents,
  photos,
  settings,
  showGuest,
  submitUpgrade,
  updateEventSettings,
  updateTemplate,
  upgrade,
  uploadCouplePhoto,
  uploadGalleryPhotos,
} from '../controllers/adminController';
import { photoUpload, photosDir, proofUpload, uploadsDir } from '../lib/upload';
import fs from 'node:fs';
import path from 'node:path';
import { getUser, requireAuth, setFlash } from '../middleware/auth';
import { tokenSent } from '../middleware/csrf';
import { getEventById } from '../lib/events';
import { ah } from '../lib/asyncHandler';

const router = Router();

router.use(requireAuth);

/** Muat event milik user (owner boleh intip semua untuk bantu customer). */
function loadOwnEvent(req: Request, res: Response, next: NextFunction): void {
  const user = getUser(req);
  const event = getEventById(req.params.eventId ?? '');
  if (!event || !user || (user.role !== 'owner' && event.customer_id !== user.id)) {
    res.status(404).send('Event tidak ditemukan.');
    return;
  }
  (req as Request & { event?: unknown; adminBase?: string }).event = event;
  (req as Request & { event?: unknown; adminBase?: string }).adminBase = `/admin/events/${event.id}`;
  next();
}

// Rute lama single-event: arahkan ke daftar event.
for (const legacy of ['/dashboard', '/guests', '/guests/export/csv', '/settings', '/event-settings']) {
  router.get(legacy, (_req, res) => res.redirect('/admin'));
}
router.get('/guests/:id', (_req, res) => res.redirect('/admin'));

router.get('/', ah(myEvents));
router.get('/events/:eventId', loadOwnEvent, ah(dashboard));
router.get('/events/:eventId/guests', loadOwnEvent, ah(guests));
// /export/csv harus di atas /:id agar tidak ditangkap sebagai id
router.get('/events/:eventId/guests/export/csv', loadOwnEvent, exportGuests);
router.get('/events/:eventId/guests/:id', loadOwnEvent, ah(showGuest));
router.delete('/events/:eventId/guests/:id', loadOwnEvent, deleteGuest);
router.get('/events/:eventId/settings', loadOwnEvent, ah(settings));
router.get('/events/:eventId/event-settings', loadOwnEvent, ah(editEventSettings));
router.put('/events/:eventId/event-settings', loadOwnEvent, ah(updateEventSettings));
router.get('/events/:eventId/template', loadOwnEvent, ah(editTemplate));
router.post('/events/:eventId/template', loadOwnEvent, updateTemplate);
router.get('/events/:eventId/upgrade', loadOwnEvent, ah(upgrade));
router.post('/events/:eventId/upgrade', loadOwnEvent, (req, res, next) => {
  proofUpload.single('proof')(req, res, (err: unknown) => {
    const uploaded = (req as Request & { file?: Express.Multer.File }).file;
    if (err) {
      setFlash(req, 'error', err instanceof Error ? err.message : 'Upload gagal.');
      res.redirect(`/admin/events/${req.params.eventId}/upgrade`);
      return;
    }
    const sent = tokenSent(req);
    if (typeof sent !== 'string' || !req.session.csrfToken || sent !== req.session.csrfToken) {
      if (uploaded) {
        fs.unlink(path.join(uploadsDir, uploaded.filename), () => undefined);
      }
      setFlash(req, 'error', 'Sesi kadaluarsa. Coba lagi.');
      res.redirect(`/admin/events/${req.params.eventId}/upgrade`);
      return;
    }
    next();
  });
}, submitUpgrade);
router.get('/events/:eventId/photos', loadOwnEvent, ah(photos));

function withCsrfAfterUpload(
  upload: (req: Request, res: Response, next: NextFunction) => void,
  redirectTo: (req: Request) => string,
  cleanup: (req: Request) => void,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    upload(req, res, (err: unknown) => {
      if (err) {
        cleanup(req);
        setFlash(req, 'error', err instanceof Error ? err.message : 'Upload gagal.');
        res.redirect(redirectTo(req));
        return;
      }
      const sent = tokenSent(req);
      if (typeof sent !== 'string' || !req.session.csrfToken || sent !== req.session.csrfToken) {
        cleanup(req);
        setFlash(req, 'error', 'Sesi kadaluarsa. Coba lagi.');
        res.redirect(redirectTo(req));
        return;
      }
      next();
    });
  };
}

function deleteUploaded(req: Request): void {
  const r = req as Request & { file?: Express.Multer.File; files?: Express.Multer.File[] };
  const files = r.file ? [r.file] : (r.files ?? []);
  for (const f of files) {
    fs.unlink(path.join(photosDir, f.filename), () => undefined);
  }
}

router.post(
  '/events/:eventId/photos/couple',
  loadOwnEvent,
  withCsrfAfterUpload(
    (req, res, next) => photoUpload.single('photo')(req, res, next),
    (req) => `/admin/events/${req.params.eventId}/photos`,
    deleteUploaded,
  ),
  uploadCouplePhoto,
);
router.post(
  '/events/:eventId/photos/gallery',
  loadOwnEvent,
  withCsrfAfterUpload(
    (req, res, next) => photoUpload.array('photos', 10)(req, res, next),
    (req) => `/admin/events/${req.params.eventId}/photos`,
    deleteUploaded,
  ),
  uploadGalleryPhotos,
);
router.post('/events/:eventId/photos/:photoId/delete', loadOwnEvent, deletePhoto);

export default router;
