/** Upload bukti bayar (multer, gambar maks 2MB ke public/uploads/proofs). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';

const dir = path.join(process.cwd(), 'public', 'uploads', 'proofs');
fs.mkdirSync(dir, { recursive: true });

export const uploadsDir = dir;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : '.png';
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`);
  },
});

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function imageOnly(_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME.has(file.mimetype) && ALLOWED_EXT.has(ext)) {
    cb(null, true);
    return;
  }
  cb(new Error('Bukti harus gambar JPG, PNG, atau WebP.'));
}

export const proofUpload = multer({
  storage,
  fileFilter: imageOnly,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});

const photoDir = path.join(process.cwd(), 'public', 'uploads', 'photos');
fs.mkdirSync(photoDir, { recursive: true });

export const photosDir = photoDir;

const demoDir = path.join(process.cwd(), 'public', 'uploads', 'demo');
fs.mkdirSync(demoDir, { recursive: true });

export const demoPhotoDir = demoDir;

export const demoPhotoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, demoDir),
    filename: (req, file, cb) => {
      const slug = String((req.params as Record<string, unknown>)?.slug ?? 'template').replace(/[^a-z0-9-]/g, '');
      const slot = String((req.body as Record<string, unknown>)?.slot ?? 'photo');
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
      cb(null, `${slug}-${slot}${safeExt}`);
    },
  }),
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export const photoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, photoDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`);
    },
  }),
  fileFilter: imageOnly,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

export const GALLERY_TRIAL_MAX = 6;
export const GALLERY_ACTIVE_MAX = 30;
