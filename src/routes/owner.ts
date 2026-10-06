/** Route owner (wajib role owner). */
import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {
  customerDetail,
  customers,
  dashboard,
  events,
  extendEvent,
  grantTemplate,
  payments,
  resetCustomerPassword,
  saveDemoText,
  setEventStatus,
  suspendCustomer,
  templateList,
  templatePreview,
  templateUpdate,
  uploadDemoPhoto,
  verifyPayment,
} from '../controllers/ownerController';
import { demoPhotoDir, demoPhotoUpload } from '../lib/upload';
import { requireOwner } from '../middleware/auth';
import { tokenSent } from '../middleware/csrf';
import { ah } from '../lib/asyncHandler';

const router = Router();

router.use(requireOwner);

router.get('/', (_req, res) => res.redirect('/owner/dashboard'));
router.get('/dashboard', ah(dashboard));
router.get('/customers', ah(customers));
router.get('/customers/:id', ah(customerDetail));
router.post('/customers/:id/suspend', suspendCustomer);
router.post('/customers/:id/reset-password', resetCustomerPassword);
router.get('/events', ah(events));
router.post('/events/:id/extend', extendEvent);
router.post('/events/:id/status', setEventStatus);
router.get('/templates', ah(templateList));
router.post('/templates/:slug', templateUpdate);
router.get('/templates/:slug/preview', ah(templatePreview));
router.post('/templates/:slug/demo', saveDemoText);
router.post('/templates/:slug/demo-photo', (req, res, next) => {
  demoPhotoUpload.single('photo')(req, res, (err: unknown) => {
    if (err) {
      res.status(422).json({ message: err instanceof Error ? err.message : 'Upload gagal.' });
      return;
    }
    const sent = tokenSent(req);
    if (typeof sent !== 'string' || !req.session.csrfToken || sent !== req.session.csrfToken) {
      const f = (req as Request & { file?: Express.Multer.File }).file;
      if (f) fs.unlink(path.join(demoPhotoDir, f.filename), () => undefined);
      res.status(419).json({ message: 'CSRF token mismatch.' });
      return;
    }
    next();
  });
}, uploadDemoPhoto);
router.post('/customers/:id/grants', grantTemplate);
router.get('/payments', ah(payments));
router.post('/payments/:id/verify', verifyPayment);

export default router;
