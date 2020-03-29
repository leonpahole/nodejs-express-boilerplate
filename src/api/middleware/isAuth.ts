import jwt from 'express-jwt';
import { Request } from 'express';
import config from '../../config';

const getTokenFromHeader = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

export default jwt({
  secret: config.jwt.secret as jwt.secretType,
  userProperty: 'authPayload',
  getToken: getTokenFromHeader
});
