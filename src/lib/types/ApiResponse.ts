export default class ApiResponse {
  data: any;
  success: boolean = true;
  error?: string;

  constructor(data: any, success: boolean, error?: string) {
    this.data = data;
    this.success = success;
    this.error = error;
  }

  static success(data: any) {
    return new ApiResponse(data, true);
  }

  static error(error: string) {
    return new ApiResponse(null, false, error);
  }
}
