import { config } from 'dotenv';
import path from 'path';

// Load environment-specific .env file based on NODE_ENV
const NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = `.env.${NODE_ENV}`;
const envPath = path.resolve(process.cwd(), envFile);

// Load environment-specific file first, then base .env (so base doesn't override)
config({ path: envPath }); // Load .env.{environment} first
config(); // Load .env as fallback for missing variables

console.log(`🌍 Environment: ${NODE_ENV}`);
console.log(`📁 Loading env from: ${envPath}`);

interface Environment {
  NODE_ENV: string;
  PORT: number;
  HOST: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
  BCRYPT_ROUNDS: number;
  // Authentik OAuth2/OpenID Configuration
  AUTHENTIK_ISSUER: string;
  AUTHENTIK_CLIENT_ID: string;
  AUTHENTIK_CLIENT_SECRET: string;
  AUTHENTIK_REDIRECT_URI: string;
  AUTHENTIK_SCOPE: string;
  // Environment-specific URLs
  BACKEND_URL: string;
  FRONTEND_URL: string;
  AUTH_URL: string;
  GRAFANA_URL: string;
  PROMETHEUS_URL: string;
}

const environment: Environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || 'localhost',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/airavate_dev',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  // Authentik OAuth2/OpenID Configuration
  AUTHENTIK_ISSUER: process.env.AUTHENTIK_ISSUER || 'http://localhost:9000/application/o/airavate-backend/',
  AUTHENTIK_CLIENT_ID: process.env.AUTHENTIK_CLIENT_ID || '',
  AUTHENTIK_CLIENT_SECRET: process.env.AUTHENTIK_CLIENT_SECRET || '',
  AUTHENTIK_REDIRECT_URI: process.env.AUTHENTIK_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  AUTHENTIK_SCOPE: process.env.AUTHENTIK_SCOPE || 'openid profile email offline_access',
  // Environment-specific URLs
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  AUTH_URL: process.env.AUTH_URL || 'http://localhost:9000',
  GRAFANA_URL: process.env.GRAFANA_URL || 'http://localhost:3001',
  PROMETHEUS_URL: process.env.PROMETHEUS_URL || 'http://localhost:9090',
};

// Helper function to get environment URLs (now pulled from env vars)
export const getEnvironmentUrls = () => {
  return {
    backendUrl: environment.BACKEND_URL,
    frontendUrl: environment.FRONTEND_URL,
    authUrl: environment.AUTH_URL,
    grafanaUrl: environment.GRAFANA_URL,
    prometheusUrl: environment.PROMETHEUS_URL,
    oauthRedirectUri: environment.AUTHENTIK_REDIRECT_URI,
    authentikIssuer: environment.AUTHENTIK_ISSUER,
  };
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default environment;
export { environment as env };