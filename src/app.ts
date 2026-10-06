/** Express app: middleware global + mount routes. Dipakai server.ts. */
import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import methodOverride from 'method-override';
import path from 'node:path';
import { config } from './config';
import { ensureCsrfToken, validateCsrf } from './middleware/csrf';
import indexRoutes from './routes/index';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import ownerRoutes from './routes/owner';

const isProd = (process.env.NODE_ENV ?? 'local') === 'production';

export function createApp(): express.Express {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(process.cwd(), 'views'));
  app.set('trust proxy', 1);

  // Header keamanan. CSP dimatikan karena template memakai inline script/style.
  app.use(helmet({ contentSecurityPolicy: false }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride('_method'));
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax', secure: isProd },
    }),
  );
  app.use(ensureCsrfToken);
  app.use(validateCsrf);
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.use('/', indexRoutes);
  app.use('/', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/owner', ownerRoutes);

  app.use((_req, res) => {
    res.status(404).send('Halaman tidak ditemukan.');
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).send('Terjadi kesalahan server.');
  });

  return app;
}
