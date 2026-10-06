export const config = {
  port: Number(process.env.PORT ?? 3000),
  sessionSecret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
  dbPath: process.env.DB_PATH ?? './data/app.sqlite',
  appName: process.env.APP_NAME ?? 'Wedding Invitation',
  // Nilai default halaman undangan, sama seperti versi Laravel.
  eventDate: process.env.EVENT_DATE ?? '2025-12-31 19:00:00',
  totalCapacity: Number(process.env.TOTAL_CAPACITY ?? 200),
};
