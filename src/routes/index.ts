import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

// API Information endpoint
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Airavate Backend API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      health: '/health',
    },
    documentation: '/api/v1/docs',
    openapi: {
      json: '/api/v1/docs.json',
      yaml: '/api/v1/docs.yaml',
    },
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;