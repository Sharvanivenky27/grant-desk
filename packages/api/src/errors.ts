/**
 * AppError - Base error class for API errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
      },
    };
  }
}

/**
 * NotFoundError - 404
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

/**
 * AuthError - 401
 */
export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED');
  }
}

/**
 * ForbiddenError - 403
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(403, message, 'FORBIDDEN');
  }
}

/**
 * ValidationError - 400
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

/**
 * ConflictError - 409
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

/**
 * RateLimitError - 429
 */
export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(429, 'Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', { retryAfter });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
