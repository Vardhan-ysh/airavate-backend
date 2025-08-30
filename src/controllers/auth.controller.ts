import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const newUser = await this.authService.register(email, password);
            return res.status(201).json(newUser);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return res.status(500).json({ message: errorMessage });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const user = await this.authService.login(email, password);
            if (user) {
                // In a real app, you'd create a JWT token here
                return res.status(200).json({ user: { id: user.id, email: user.email } });
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
}