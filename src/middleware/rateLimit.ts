/** Batas request per IP untuk endpoint sensitif (anti brute force dan spam). */
import { rateLimit } from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan. Coba lagi 15 menit.' },
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak order. Coba lagi nanti.' },
});

const rsvpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak RSVP. Coba lagi nanti.' },
});

export const limiters = { loginLimiter, orderLimiter, rsvpLimiter };
