/** Operational error with an HTTP status code, thrown by controllers/services. */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details);
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }
  static internal(message = 'Internal server error', details?: unknown) {
    return new ApiError(500, message, details);
  }
}
