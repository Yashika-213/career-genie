import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { initDb } from './db/init.js';

export function createApp() {
  // Ensure the schema exists (safe if already seeded).
  initDb();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
