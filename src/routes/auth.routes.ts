import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validation.middleware';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', validateRegister, authController.register.bind(authController));
router.post('/login', validateLogin, authController.login.bind(authController));
router.post('/logout', authMiddleware, authController.logout.bind(authController));

// OAuth routes
router.get('/oauth/google', authController.oauthGoogleLogin.bind(authController));
router.get('/oauth/callback', authController.oauthCallback.bind(authController));

// User profile route
router.get('/me', authMiddleware, (req, res) => {
  res.status(501).json({
    message: 'Get user profile endpoint - Coming soon',
  });
});

export default router;