import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration, httpRequestTotal, activeConnections } from '../config/metrics';

interface RequestWithStartTime extends Request {
  startTime?: number;
}

// Middleware to track HTTP metrics
export const metricsMiddleware = (req: RequestWithStartTime, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  req.startTime = startTime;
  
  // Increment active connections
  activeConnections.inc();
  
  // Track request completion
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const route = req.route?.path || req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();
    
    // Record metrics
    httpRequestDuration
      .labels(method, route, statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(method, route, statusCode)
      .inc();
    
    // Decrement active connections
    activeConnections.dec();
  });
  
  next();
};

// Middleware to track database connection metrics
export const trackDatabaseMetrics = (connectionCount: number): void => {
  const { databaseConnections } = require('../config/metrics');
  databaseConnections.set(connectionCount);
};

// Middleware to track authentication metrics
export const trackAuthMetrics = (status: 'success' | 'failure'): void => {
  const { authenticationAttempts } = require('../config/metrics');
  authenticationAttempts.labels(status).inc();
};

export default metricsMiddleware;
