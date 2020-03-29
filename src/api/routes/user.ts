import { Router, Request, Response, NextFunction } from 'express';
import userService from '../../services/user';
import logger from '../../lib/logger';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuth from '../middleware/isAuth';
import attachAuthenticatedUser from '../middleware/attachAuthenticatedUser';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get(
    '/me',
    isAuth,
    attachAuthenticatedUser,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.byId(req.authenticatedUser.id);
        return res.json({ user }).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  );

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.all();
      return res.json({ users }).status(200);
    } catch (e) {
      logger.info(e);
      return next(e);
    }
  });

  route.get(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number()
          .integer()
          .min(1)
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.byId(req.params.id);
        return res.json({ user }).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  );

  route.post(
    '/register',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string()
          .min(4)
          .max(20)
          .required(),
        surname: Joi.string().required(),
        password: Joi.string()
          .min(4)
          .required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.create(req.body.name, req.body.surname, req.body.password);
        return res.json({ user }).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  );

  route.post(
    '/login',
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string()
          .min(4)
          .max(20)
          .required(),
        password: Joi.string()
          .min(4)
          .required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = await userService.login(req.body.name, req.body.password);
        return res.json({ token }).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  );

  route.patch(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number()
          .integer()
          .min(1)
      }),
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string()
          .min(4)
          .max(20),
        surname: Joi.string()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.update(req.params.id, req.body.name, req.body.surname);
        return res.json({ user }).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  );

  route.delete(
    '/:id',
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number()
          .integer()
          .min(1)
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.delete(req.params.id);
        return res.json({ status: user > 0 }).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    }
  );
};
