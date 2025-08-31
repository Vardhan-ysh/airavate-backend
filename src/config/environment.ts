import { config } from 'dotenv';

config();

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
};

// Helper function to get environment-specific URLs
export const getEnvironmentUrls = () => {
  const isProduction = environment.NODE_ENV === 'production';
  
  return {
    // Backend URLs
    backendUrl: isProduction ? 'https://airavate.in' : 'http://localhost:3000',
    // Frontend URLs (will be separate frontend project)
    frontendUrl: isProduction ? 'https://app.airavate.in' : 'http://localhost:5173',
    // Auth URLs
    authUrl: isProduction ? 'https://auth.airavate.in' : 'http://localhost:9000',
    // Monitoring URLs (development only)
    grafanaUrl: 'http://localhost:3001',
    prometheusUrl: 'http://localhost:9090',
    // OAuth redirect URI
    oauthRedirectUri: isProduction 
      ? 'https://airavate.in/api/v1/auth/callback'
      : 'http://localhost:3000/api/v1/auth/callback',
    // Authentik issuer
    authentikIssuer: isProduction
      ? 'https://auth.airavate.in/application/o/airavate-backend/'
      : 'http://localhost:9000/application/o/airavate-backend/',
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