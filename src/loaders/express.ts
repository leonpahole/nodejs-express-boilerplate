import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../config';
import ApiResponse from '../lib/types/ApiResponse';
import ApiError from '../lib/types/ApiError';
import { HttpStatus } from '../lib/types/HttpStatus';
import logger from '../lib/logger';

export default ({ app }: { app: express.Application }) => {
  app.use(cors());

  app.use(bodyParser.json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method}: ${req.url}`);
    next();
  });

  app.use(config.api.prefix, routes());

  app.use((req: Request, res: Response, next: NextFunction) => {
    // api will return success data in locals.data
    if (res.locals.data !== undefined) {
      res.status(200).json(ApiResponse.success(res.locals.data));
      return;
    }

    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError('Not Found', HttpStatus.NOT_FOUND));
  });

  app.use(
    (err: ApiError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error(err.message);
      res.status(err.code || HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(err.message));
    }
  );
};
