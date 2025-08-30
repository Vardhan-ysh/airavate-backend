import { Request, Response, NextFunction } from 'express';
import environment from '../config/environment';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  errors?: any[];
}

// Global error handler middleware
export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Send error response
  res.status(status).json({
    success: false,
    message,
    ...(environment.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
};

// 404 Not Found middleware
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Route ${req.originalUrl} not found`) as CustomError;
  error.status = 404;
  next(error);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Validation error handler
export const validationErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error: any) => ({
      field: error.path,
      message: error.message,
    }));
    
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
    return;
  }
  
  next(err);
};

export default errorMiddleware;