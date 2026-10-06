import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/database';
import { setFlash } from '../middleware/auth';
import { renderView, sharedData } from '../lib/render';
import { loginSchema } from '../validation/schemas';
import type { UserRow } from '../db/types';

export async function showLoginForm(req: Request, res: Response): Promise<void> {
  await renderView(res, 'auth/login', sharedData(req, { title: 'Login - Admin Panel Wedding Invitation' }));
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => i.message);
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'email');
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    res.status(422);
    await renderView(res, 'auth/login', sharedData(req, {
      title: 'Login - Admin Panel Wedding Invitation',
      errors,
      fieldErrors,
      old: { email: (req.body as Record<string, unknown>)?.email ?? '' },
    }));
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(parsed.data.email) as UserRow | undefined;
  const suspended = user && (user.status ?? 'active') !== 'active';
  const ok = user && !suspended && bcrypt.compareSync(parsed.data.password, user.password_hash);
  if (!ok) {
    const msg = suspended ? 'Akun dinonaktifkan. Hubungi admin.' : 'Email atau password salah.';
    res.status(422);
    await renderView(res, 'auth/login', sharedData(req, {
      title: 'Login - Admin Panel Wedding Invitation',
      errors: [msg],
      fieldErrors: { email: msg },
      old: { email: parsed.data.email },
    }));
    return;
  }

  const remember = Boolean((req.body as Record<string, unknown>)?.remember);
  req.session.regenerate((err) => {
    if (err) {
      setFlash(req, 'error', 'Gagal membuat sesi login.');
      res.redirect('/login');
      return;
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role ?? 'customer' };
    if (remember) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }
    res.redirect(req.session.user.role === 'owner' ? '/owner' : '/admin/dashboard');
  });
}

export function logout(req: Request, res: Response): void {
  req.session.destroy(() => {
    res.redirect('/login');
  });
}
