export class APIError extends Error {
  statusCode: number;
  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}
