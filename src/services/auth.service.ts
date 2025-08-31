import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AuthentikService, AuthentikUser } from './authentik.service';
import { env } from '../config/environment';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name?: string | undefined;
    avatar?: string | undefined;
    provider: 'local' | 'google' | 'authentik';
  };
  token: string;
  refreshToken?: string | undefined;
}

export class AuthService {
  private authentikService: AuthentikService;

  constructor() {
    this.authentikService = new AuthentikService();
  }

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string, firstName?: string, lastName?: string): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await hash(password, 10);
    
    // Create user data object with proper types
    const userData: any = {
      email,
      password: hashedPassword,
      emailVerified: false,
    };
    
    // Only add optional fields if they have values
    if (firstName) userData.firstName = firstName;
    else userData.firstName = email.split('@')[0];
    
    if (lastName) userData.lastName = lastName;
    
    userData.username = email.split('@')[0];

    const user = await prisma.user.create({
      data: userData,
    });

    const token = this.generateJWT(user);
    
    logger.info('User registered successfully', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || email,
        avatar: user.avatar ? user.avatar : undefined,
        provider: 'local',
      },
      token,
    };
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateJWT(user);
    
    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email,
        avatar: user.avatar || undefined,
        provider: 'local',
      },
      token,
    };
  }

  /**
   * Handle OAuth login (Google via Authentik)
   */
  async handleOAuthLogin(code: string, state?: string): Promise<LoginResponse> {
    try {
      // Ensure Authentik service is initialized
      await this.authentikService.initialize();
      
      // Exchange code for tokens
      const tokens = await this.authentikService.exchangeCodeForTokens(code, state);
      
      // Get user info from Authentik
      const authentikUser = await this.authentikService.getUserInfo(tokens.access_token);
      
      // Find or create user in our database
      let user = await prisma.user.findUnique({
        where: { email: authentikUser.email },
      });

      if (!user) {
        // Create new user from OAuth data with proper type handling
        const userData: any = {
          email: authentikUser.email,
          emailVerified: authentikUser.email_verified,
          authentikId: authentikUser.sub,
          lastLoginAt: new Date(),
        };

        // Add optional fields only if they exist
        if (authentikUser.given_name || authentikUser.name) {
          userData.firstName = authentikUser.given_name || authentikUser.name;
        }
        if (authentikUser.family_name) {
          userData.lastName = authentikUser.family_name;
        }
        if (authentikUser.preferred_username) {
          userData.username = authentikUser.preferred_username;
        }
        if (authentikUser.picture) {
          userData.avatar = authentikUser.picture;
        }

        user = await prisma.user.create({
          data: userData,
        });
        
        logger.info('New OAuth user created', { userId: user.id, email: user.email });
      } else {
        // Update existing user with latest OAuth data
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: authentikUser.given_name || user.firstName,
            lastName: authentikUser.family_name || user.lastName,
            avatar: authentikUser.picture || user.avatar,
            emailVerified: authentikUser.email_verified,
            authentikId: authentikUser.sub,
            lastLoginAt: new Date(),
          },
        });
        
        logger.info('Existing OAuth user updated', { userId: user.id, email: user.email });
      }

      const token = this.generateJWT(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email,
          avatar: user.avatar || undefined,
          provider: 'google',
        },
        token,
        refreshToken: tokens.refresh_token,
      };
    } catch (error) {
      logger.error('OAuth login failed', { error });
      throw new Error('OAuth authentication failed');
    }
  }

  /**
   * Get authentication URL for OAuth flow
   */
  async getAuthUrl(provider: 'google' = 'google'): Promise<string> {
    try {
      return await this.authentikService.getAuthorizationUrl();
    } catch (error) {
      logger.error('Failed to get auth URL', { error });
      throw new Error('Failed to generate authentication URL');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Get Google OAuth URL for authentication
   */
  async getGoogleOAuthUrl(): Promise<string> {
    try {
      // Ensure Authentik service is initialized
      await this.authentikService.initialize();
      return await this.authentikService.getAuthorizationUrl();
    } catch (error) {
      logger.error('Failed to get OAuth URL', { error });
      throw new Error('OAuth URL generation failed');
    }
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(code: string, state?: string): Promise<LoginResponse> {
    try {
      return await this.handleOAuthLogin(code);
    } catch (error) {
      logger.error('OAuth callback failed', { error });
      throw new Error('OAuth callback processing failed');
    }
  }

  /**
   * Generate JWT token
   */
  private generateJWT(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      env.JWT_SECRET as string,
      { expiresIn: env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );
  }
}