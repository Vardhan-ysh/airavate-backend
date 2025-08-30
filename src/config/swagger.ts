import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { Application } from 'express';
import environment from './environment';

// Load OpenAPI specification from YAML file
const openApiSpec = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));

// Update server URLs based on environment
if (environment.NODE_ENV === 'production') {
  openApiSpec.servers = [
    {
      url: 'https://api.airavate.com',
      description: 'Production server'
    },
    {
      url: `http://${environment.HOST}:${environment.PORT}`,
      description: 'Development server'
    }
  ];
} else {
  openApiSpec.servers = [
    {
      url: `http://${environment.HOST}:${environment.PORT}`,
      description: 'Development server'
    },
    {
      url: 'https://api.airavate.com',
      description: 'Production server'
    }
  ];
}

// Swagger UI options
const swaggerOptions = {
  definition: openApiSpec,
  apis: [], // We're using YAML file instead of JSDoc comments
};

// Generate swagger specification
const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI setup options
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'list',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  },
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #2563eb; }
    .swagger-ui .info .description { font-size: 14px; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 5px; }
  `,
  customSiteTitle: 'Airavate API Documentation',
  customfavIcon: '/favicon.ico',
};

export function setupSwagger(app: Application): void {
  // Serve Swagger UI
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  // Serve OpenAPI JSON
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  // Serve OpenAPI YAML
  app.get('/api/v1/docs.yaml', (req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(YAML.stringify(specs, 2));
  });

  console.log(`📖 API Documentation available at: http://${environment.HOST}:${environment.PORT}/api/v1/docs`);
  console.log(`📄 OpenAPI JSON: http://${environment.HOST}:${environment.PORT}/api/v1/docs.json`);
  console.log(`📄 OpenAPI YAML: http://${environment.HOST}:${environment.PORT}/api/v1/docs.yaml`);
}

export { specs as swaggerSpec };
export default { setupSwagger, swaggerSpec: specs };
