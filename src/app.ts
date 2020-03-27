import 'reflect-metadata';

import config from './config';
import express from 'express';
import logger from './lib/logger';

async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, (err: Error) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.info(`Server listening on port ${config.port}`);
  });
}

startServer();
