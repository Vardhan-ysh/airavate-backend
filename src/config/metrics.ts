import client from 'prom-client';
import { Request, Response } from 'express';

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({
  register,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  prefix: 'airavate_backend_',
});

// Custom metrics
export const httpRequestDuration = new client.Histogram({
  name: 'airavate_backend_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export const httpRequestTotal = new client.Counter({
  name: 'airavate_backend_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const activeConnections = new client.Gauge({
  name: 'airavate_backend_active_connections',
  help: 'Number of active connections',
});

export const databaseConnections = new client.Gauge({
  name: 'airavate_backend_database_connections',
  help: 'Number of active database connections',
});

export const authenticationAttempts = new client.Counter({
  name: 'airavate_backend_auth_attempts_total',
  help: 'Total number of authentication attempts',
  labelNames: ['status'],
});

export const businessMetrics = {
  userRegistrations: new client.Counter({
    name: 'airavate_backend_user_registrations_total',
    help: 'Total number of user registrations',
  }),
  
  apiCalls: new client.Counter({
    name: 'airavate_backend_api_calls_total',
    help: 'Total number of API calls',
    labelNames: ['endpoint'],
  }),
};

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseConnections);
register.registerMetric(authenticationAttempts);
register.registerMetric(businessMetrics.userRegistrations);
register.registerMetric(businessMetrics.apiCalls);

// Metrics endpoint handler
export const metricsHandler = async (req: Request, res: Response): Promise<void> => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
};

export { register };
export default client;
