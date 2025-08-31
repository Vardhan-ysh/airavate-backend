import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password, firstName, lastName } = req.body;
            const newUser = await this.authService.register(email, password, firstName, lastName);
            return res.status(201).json(newUser);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            return res.status(400).json({ message: errorMessage });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const loginResult = await this.authService.login(email, password);
            if (loginResult) {
                return res.status(200).json(loginResult);
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            return res.status(401).json({ message: errorMessage });
        }
    }

    public async logout(req: Request, res: Response): Promise<Response> {
        try {
            // In a stateless JWT system, logout is handled client-side
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Logout failed';
            return res.status(500).json({ message: errorMessage });
        }
    }

    /**
     * OAuth Google login endpoint
     * This redirects to Authentik for Google OAuth
     */
    public async oauthGoogleLogin(req: Request, res: Response): Promise<Response> {
        try {
            const authUrl = await this.authService.getGoogleOAuthUrl();
            return res.status(200).json({ authUrl });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'OAuth initialization failed';
            return res.status(500).json({ message: errorMessage });
        }
    }

    /**
     * OAuth callback endpoint
     * Handles the callback from Authentik after Google OAuth
     */
    public async oauthCallback(req: Request, res: Response): Promise<Response> {
        try {
            const { code, state } = req.query;
            
            if (!code || typeof code !== 'string') {
                return res.status(400).json({ message: 'Authorization code is required' });
            }

            const loginResult = await this.authService.handleOAuthCallback(code, state as string);
            return res.status(200).json(loginResult);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'OAuth callback failed';
            return res.status(500).json({ message: errorMessage });
        }
    }
}