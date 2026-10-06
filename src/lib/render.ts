/** Data yang selalu tersedia di semua view EJS. */
import ejs from 'ejs';
import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response } from 'express';
import { consumeFlash, getUser } from '../middleware/auth';
import { formatDate, fv, timeAgo } from '../lib/dates';
import { paginationLinks } from '../lib/pagination';

export const viewsDir = path.join(process.cwd(), 'views');

function readExpressVersion(): string {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'node_modules', 'express', 'package.json'), 'utf8'),
    ) as { version?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

const expressVersion = readExpressVersion();

export interface SharedViewData {
  user: { id: number; name: string; email: string; role: string } | null;
  csrfToken: string;
  flash: { success?: string; error?: string };
  errors: string[];
  fieldErrors: Record<string, string>;
  old: Record<string, unknown>;
  filters: Record<string, string>;
  title: string;
  subtitle: string;
  metaDescription: string;
  activeNav: string;
  formatDate: typeof formatDate;
  timeAgo: typeof timeAgo;
  paginationLinks: typeof paginationLinks;
  fv: typeof fv;
  formatIDR: (n: number) => string;
  appVersion: string;
  appEnv: string;
  appDebug: boolean;
  expressVersion: string;
}

export function sharedData(req: Request, extra: Record<string, unknown> = {}): Record<string, unknown> {
  const base: SharedViewData = {
    user: getUser(req),
    csrfToken: req.session.csrfToken ?? '',
    flash: consumeFlash(req),
    errors: [],
    fieldErrors: {},
    old: {},
    filters: {},
    title: '',
    subtitle: '',
    metaDescription: 'Undangan Pernikahan Digital',
    activeNav: '',
    formatDate,
    timeAgo,
    paginationLinks,
    fv,
    formatIDR: (n: number) => `Rp ${Number(n).toLocaleString('id-ID')}`,
    appVersion: process.version,
    appEnv: process.env.NODE_ENV ?? 'local',
    appDebug: (process.env.NODE_ENV ?? 'local') !== 'production',
    expressVersion,
  };
  return { ...base, ...extra };
}

/** Halaman penuh tanpa layout. */
export async function renderView(res: Response, view: string, data: Record<string, unknown>): Promise<void> {
  const html = await ejs.renderFile(path.join(viewsDir, `${view}.ejs`), data, { async: false });
  res.send(html);
}

/** Banner trial disisipkan tepat setelah <body> tanpa mengubah template. */
export function injectTrialBanner(html: string, expiresText: string): string {
  const banner =
    `<div style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#713f12;color:#fefce8;` +
    `text-align:center;font-size:13px;padding:8px 12px;font-family:system-ui,sans-serif">` +
    `Undangan trial, berakhir ${expiresText}. Upgrade untuk masa aktif penuh.` +
    `</div>`;
  return html.replace(/<body([^>]*)>/i, `<body$1>${banner}`);
}

/**
 * Render undangan live: string penuh lalu sisipkan banner bila trial.
 * trial = { active: true, expiresText: '...' } atau null.
 */
export async function renderInvitation(
  res: Response,
  layout: string | null,
  view: string,
  data: Record<string, unknown>,
  trial: { expiresText: string } | null,
): Promise<void> {
  const body = await ejs.renderFile(path.join(viewsDir, `${view}.ejs`), data, { async: false });
  const full = layout
    ? await ejs.renderFile(path.join(viewsDir, `${layout}.ejs`), { ...data, body }, { async: false })
    : body;
  res.send(trial ? injectTrialBanner(String(full), trial.expiresText) : full);
}

/** View konten di dalam layout (pengganti @extends/@yield). */
export async function renderPage(
  res: Response,
  layout: string,
  view: string,
  data: Record<string, unknown>,
): Promise<void> {
  const body = await ejs.renderFile(path.join(viewsDir, `${view}.ejs`), data, { async: false });
  const html = await ejs.renderFile(path.join(viewsDir, `${layout}.ejs`), { ...data, body }, { async: false });
  res.send(html);
}
