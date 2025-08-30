import axios, { AxiosResponse } from 'axios';
import logger from '../utils/logger';
import { env } from '../config/environment';
import crypto from 'crypto';

/**
 * Authentik User Information
 */
export interface AuthentikUser {
  sub: string; // User ID from Authentik
  email: string;
  email_verified: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  preferred_username: string;
  picture?: string;
  groups?: string[];
  aud: string;
  iss: string;
  iat: number;
  exp: number;
}

/**
 * Authentik OAuth2 Token Response
 */
export interface AuthentikTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string;
}

/**
 * OpenID Connect Discovery Document
 */
interface OpenIDConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  end_session_endpoint: string;
  scopes_supported: string[];
  response_types_supported: string[];
  grant_types_supported: string[];
}

/**
 * Authentik Service for OAuth2/OpenID Connect integration
 */
export class AuthentikService {
  private oidcConfig: OpenIDConfiguration | null = null;
  private isInitialized = false;

  /**
   * Initialize the Authentik service by discovering endpoints
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      logger.info('Initializing Authentik service...');

      // Discover OpenID Connect configuration
      const configUrl = `${env.AUTHENTIK_ISSUER.replace(/\/$/, '')}/.well-known/openid_configuration`;
      
      const response: AxiosResponse<OpenIDConfiguration> = await axios.get(configUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Airavate-Backend/1.0.0',
        },
      });

      this.oidcConfig = response.data;
      this.isInitialized = true;

      logger.info('Authentik service initialized successfully', {
        issuer: this.oidcConfig.issuer,
        authorization_endpoint: this.oidcConfig.authorization_endpoint,
        token_endpoint: this.oidcConfig.token_endpoint,
        userinfo_endpoint: this.oidcConfig.userinfo_endpoint,
      });
    } catch (error) {
      logger.error('Failed to initialize Authentik service', { error });
      throw new Error('Authentik service initialization failed');
    }
  }

  /**
   * Get the authorization URL for OAuth2 flow
   */
  getAuthorizationUrl(state?: string): string {
    if (!this.oidcConfig) {
      throw new Error('Authentik service not initialized');
    }

    const generatedState = state || this.generateState();
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.AUTHENTIK_CLIENT_ID,
      redirect_uri: env.AUTHENTIK_REDIRECT_URI,
      scope: env.AUTHENTIK_SCOPE,
      state: generatedState,
    });

    const authUrl = `${this.oidcConfig.authorization_endpoint}?${params.toString()}`;

    logger.info('Generated authorization URL', { authUrl });
    return authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string, state?: string): Promise<AuthentikTokens> {
    if (!this.oidcConfig) {
      throw new Error('Authentik service not initialized');
    }

    try {
      logger.info('Exchanging authorization code for tokens');

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: env.AUTHENTIK_CLIENT_ID,
        client_secret: env.AUTHENTIK_CLIENT_SECRET,
        code,
        redirect_uri: env.AUTHENTIK_REDIRECT_URI,
      });

      const response: AxiosResponse<AuthentikTokens> = await axios.post(
        this.oidcConfig.token_endpoint,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      logger.info('Successfully exchanged code for tokens');
      return response.data;
    } catch (error) {
      logger.error('Failed to exchange code for tokens', { error });
      throw new Error('Token exchange failed');
    }
  }

  /**
   * Get user information using access token
   */
  async getUserInfo(accessToken: string): Promise<AuthentikUser> {
    if (!this.oidcConfig) {
      throw new Error('Authentik service not initialized');
    }

    try {
      logger.info('Fetching user information from Authentik');

      const response: AxiosResponse<AuthentikUser> = await axios.get(
        this.oidcConfig.userinfo_endpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
          timeout: 10000,
        }
      );

      logger.info('Successfully fetched user information', {
        userId: response.data.sub,
        email: response.data.email,
        name: response.data.name,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch user information', { error });
      throw new Error('Failed to fetch user information');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthentikTokens> {
    if (!this.oidcConfig) {
      throw new Error('Authentik service not initialized');
    }

    try {
      logger.info('Refreshing access token');

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: env.AUTHENTIK_CLIENT_ID,
        client_secret: env.AUTHENTIK_CLIENT_SECRET,
        refresh_token: refreshToken,
      });

      const response: AxiosResponse<AuthentikTokens> = await axios.post(
        this.oidcConfig.token_endpoint,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          timeout: 10000,
        }
      );

      logger.info('Successfully refreshed access token');
      return response.data;
    } catch (error) {
      logger.error('Failed to refresh access token', { error });
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Validate ID token and extract claims (simplified version)
   */
  async validateIdToken(idToken: string): Promise<AuthentikUser> {
    try {
      logger.info('Validating ID token');

      // For production, you should properly validate the JWT signature
      // This is a simplified version for development
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid ID token format');
      }

      // Convert base64url to base64
      const payloadPart = parts[1];
      if (!payloadPart) {
        throw new Error('Invalid ID token payload');
      }
      
      let base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }

      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
      
      // Basic validation
      if (payload.exp < Date.now() / 1000) {
        throw new Error('ID token has expired');
      }

      if (payload.iss !== env.AUTHENTIK_ISSUER.replace(/\/$/, '')) {
        throw new Error('Invalid issuer');
      }

      logger.info('Successfully validated ID token', {
        userId: payload.sub,
        email: payload.email,
      });

      return payload as AuthentikUser;
    } catch (error) {
      logger.error('Failed to validate ID token', { error });
      throw new Error('ID token validation failed');
    }
  }

  /**
   * Logout user from Authentik
   */
  async logout(idToken?: string): Promise<string> {
    if (!this.oidcConfig) {
      throw new Error('Authentik service not initialized');
    }

    try {
      const params = new URLSearchParams({
        post_logout_redirect_uri: `${env.CORS_ORIGIN}/logout`,
      });

      if (idToken) {
        params.append('id_token_hint', idToken);
      }

      const logoutUrl = `${this.oidcConfig.end_session_endpoint}?${params.toString()}`;

      logger.info('Generated logout URL', { logoutUrl });
      return logoutUrl;
    } catch (error) {
      logger.error('Failed to generate logout URL', { error });
      throw new Error('Logout URL generation failed');
    }
  }

  /**
   * Generate a random state parameter for OAuth2 security
   */
  private generateState(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Check if the service is properly initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.oidcConfig !== null;
  }

  /**
   * Get OIDC configuration (for debugging)
   */
  getOIDCConfig(): OpenIDConfiguration | null {
    return this.oidcConfig;
  }
}

// Export singleton instance
export const authentikService = new AuthentikService();
