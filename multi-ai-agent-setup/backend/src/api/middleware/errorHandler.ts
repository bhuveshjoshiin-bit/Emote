import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(
    {
      statusCode,
      message,
      path: req.path,
      method: req.method,
      error: err,
    },
    'Request error'
  );

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: err.details,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
