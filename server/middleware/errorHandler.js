import config from '../config/env.js';
import AppError from '../utils/appError.js';
import ApiResponse from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404));
};

export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal Server Error';
  error.statusCode = err.statusCode || 500;

  // Log error details for server diagnostics
  console.error(`[Error] [${req.method}] ${req.originalUrl}:`, {
    message: err.message,
    statusCode: error.statusCode,
    stack: config.isDevelopment ? err.stack : undefined,
  });

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid resource identifier: ${err.value}`;
    error = new AppError(message, 400);
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `A record with this ${field} already exists.`;
    error = new AppError(message, 409);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Validation failed: ${errors.join('. ')}`;
    error = new AppError(message, 422, errors);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your authentication session has expired. Please log in again.', 401);
  }

  return ApiResponse.error(res, {
    statusCode: error.statusCode || 500,
    message: error.message || 'An unexpected server error occurred.',
    errors: error.errors || null,
    stack: config.isDevelopment ? err.stack : undefined,
  });
};

export default {
  notFoundHandler,
  globalErrorHandler,
};

