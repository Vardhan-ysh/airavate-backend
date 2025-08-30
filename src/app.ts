import express, { Application, Request, Response } from 'express';
import environment from '@config/environment';
import { connectToDatabase } from '@config/database';
import { setupSwagger } from '@config/swagger';
import routes from '@routes/index';
import { errorMiddleware, notFoundMiddleware } from '@middleware/error.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Basic middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    this.app.use((req: Request, res: Response, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
      });
      next();
    });
  }

  private initializeSwagger(): void {
    // Setup Swagger/OpenAPI documentation
    setupSwagger(this.app);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: environment.NODE_ENV,
        version: '1.0.0',
      });
    });

    // API routes
    this.app.use('/api/v1', routes);

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        message: 'Welcome to Airavate Backend API',
        version: '1.0.0',
        documentation: '/api/v1/docs',
        endpoints: {
          api: '/api/v1',
          health: '/health',
          docs: '/api/v1/docs',
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundMiddleware);
    
    // Global error handler
    this.app.use(errorMiddleware);
  }

  public async listen(): Promise<void> {
    try {
      // Connect to database
      await connectToDatabase();
      
      // Start server
      this.app.listen(environment.PORT, environment.HOST, () => {
        console.log(`🚀 Server running on http://${environment.HOST}:${environment.PORT}`);
        console.log(`🌍 Environment: ${environment.NODE_ENV}`);
        console.log(`📊 Health check: http://${environment.HOST}:${environment.PORT}/health`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default App;