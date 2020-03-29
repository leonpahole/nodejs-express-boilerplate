import { HttpStatus } from './HttpStatus';

export default class ApiError {
  message: string;
  code: HttpStatus;

  constructor(message: string, code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    this.message = message;
    this.code = code;
  }
}
