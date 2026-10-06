import type {} from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { id: number; name: string; email: string; role: string };
    csrfToken?: string;
    flash?: { success?: string; error?: string };
  }
}

export {};
