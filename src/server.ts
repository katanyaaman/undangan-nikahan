/** Entry point: load env -> migrate DB -> listen. */
import 'dotenv/config';
import { createApp } from './app';
import { config } from './config';
import { migrate, migrateMultiEvent } from './db/database';

migrate();
migrateMultiEvent();

const app = createApp();
app.listen(config.port, () => {
  console.log(`${config.appName} jalan di http://localhost:${config.port}`);
});
