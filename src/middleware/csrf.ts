/** CSRF token per session (pengganti @csrf). Gagal validasi balas 419. */
import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export function ensureCsrfToken(req: Request, _res: Response, next: NextFunction): void {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  next();
}

export function tokenSent(req: Request): unknown {
  return (req.body as Record<string, unknown> | undefined)?._csrf ?? req.get('x-csrf-token');
}

export function validateCsrf(req: Request, res: Response, next: NextFunction): void {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }
  // Multipart (upload) dicek di route setelah multer parsing body.
  if ((req.get('content-type') ?? '').startsWith('multipart/')) {
    next();
    return;
  }
  const sent = tokenSent(req);
  if (typeof sent !== 'string' || !req.session.csrfToken || sent !== req.session.csrfToken) {
    res.status(419).json({ message: 'CSRF token mismatch.' });
    return;
  }
  next();
}
