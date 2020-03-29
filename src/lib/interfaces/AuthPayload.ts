import User from '../../db/models/user';

export interface AuthPayload {
  id: string;
  name: string;
  surname: string;
}

interface AuthPayloadData {
  data: AuthPayload;
}

// extend request from express to also include auth data
declare global {
  namespace Express {
    export interface Request {
      authPayload?: AuthPayloadData;
      authenticatedUser: User;
    }
  }
}
