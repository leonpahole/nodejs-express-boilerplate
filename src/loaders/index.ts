import expressLoader from './express';
import databaseLoader from './database';
import logger from '../lib/logger';
import express from 'express';

export default async ({ expressApp }: { expressApp: express.Application }) => {
  await databaseLoader();
  logger.info('Database loaded');

  await expressLoader({ app: expressApp });
  logger.info('Express loaded');
};
