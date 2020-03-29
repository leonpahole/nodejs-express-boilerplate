import { Response, NextFunction, Request } from 'express';
import userService from '../../services/user';

const attachAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.authPayload) {
      const user = await userService.byId(req.authPayload.data.id);

      if (!user) {
        return res.sendStatus(401);
      }

      req.authenticatedUser = user;
      return next();
    }
    return next(new Error('Unathorized'));
  } catch (e) {
    return next(e);
  }
};

export default attachAuthenticatedUser;
