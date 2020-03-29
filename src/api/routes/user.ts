import { Router, Request, Response, NextFunction } from 'express';
import userService from '../../services/user';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuth from '../middleware/isAuth';
import attachAuthenticatedUser from '../middleware/attachAuthenticatedUser';
import ApiError from '../../lib/types/ApiError';
import { HttpStatus } from '../../lib/types/HttpStatus';

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

        if (!user) {
          return next(new ApiError('User not found', HttpStatus.NOT_FOUND));
        }

        res.locals.data = user;
        return next();
      } catch (e) {
        return next(new ApiError(e.message));
      }
    }
  );

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.all();

      res.locals.data = users;
      return next();
    } catch (e) {
      return next(new ApiError(e.message));
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

        if (!user) {
          return next(new ApiError('User not found', HttpStatus.NOT_FOUND));
        }

        res.locals.data = user;
        return next();
      } catch (e) {
        return next(new ApiError(e.message));
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

        if (!user) {
          return next(new ApiError('User registration error'));
        }

        res.locals.data = user;
        return next();
      } catch (e) {
        return next(new ApiError(e.message));
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

        if (!token) {
          return next(new ApiError('Invalid username/password', HttpStatus.UNAUTHORIZED));
        }

        res.locals.data = token;
        next();
      } catch (e) {
        return next(new ApiError(e.message));
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

        if (!user) {
          return next(new ApiError('User not found', HttpStatus.NOT_FOUND));
        }

        res.locals.data = user;
      } catch (e) {
        return next(new ApiError(e.message));
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
        const deletedCount = await userService.delete(req.params.id);

        if (deletedCount === 0) {
          return next(new ApiError('User not found', HttpStatus.NOT_FOUND));
        }

        res.locals.data = deletedCount;
        next();
      } catch (e) {
        return next(new ApiError(e.message));
      }
    }
  );
};
