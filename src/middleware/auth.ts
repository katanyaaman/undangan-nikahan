import type { NextFunction, Request, Response } from 'express';

declare module 'express-session' {
  interface SessionData {
    user?: { id: number; name: string; email: string; role: string };
    csrfToken?: string;
    flash?: { success?: string; error?: string };
  }
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function getUser(req: Request): SessionUser | null {
  return req.session.user ?? null;
}

/** Flash ala Laravel: dibaca sekali lalu dihapus. */
export function consumeFlash(req: Request): { success?: string; error?: string } {
  const flash = req.session.flash ?? {};
  delete req.session.flash;
  return flash;
}

export function setFlash(req: Request, type: 'success' | 'error', message: string): void {
  req.session.flash = { ...req.session.flash, [type]: message };
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.user) {
    res.redirect('/login');
    return;
  }
  next();
}

export function redirectIfAuth(req: Request, res: Response, next: NextFunction): void {
  const user = getUser(req);
  if (user) {
    res.redirect(user.role === 'owner' ? '/owner' : '/admin/dashboard');
    return;
  }
  next();
}

/** Area owner: belum login dilempar ke /login, bukan owner balas 403. */
export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const user = getUser(req);
  if (!user) {
    res.redirect('/login');
    return;
  }
  if (user.role !== 'owner') {
    res.status(403).send('Akses khusus owner.');
    return;
  }
  next();
}
