# 🚀 Airavate Backend

A scalable, production-grade backend application built with modern technologies and best practices.

## 📋 Overview

Airavate Backend is a robust REST API built to support scalable web applications. It features a modular architecture, comprehensive security measures, and is ready for integration with external services like Razorpay (payments) and Authentik (authentication).

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT (ready for Authentik integration)
- **Caching**: Redis (included in Docker setup)
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest & Supertest
- **Code Quality**: ESLint & Prettier
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 🏗 Architecture

```
airavate-backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   ├── database.ts           # Prisma database config
│   │   ├── environment.ts        # Environment variables
│   │   └── index.ts
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication endpoints
│   │   ├── user.controller.ts    # User management
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT validation
│   │   ├── error.middleware.ts   # Global error handling
│   │   ├── validation.middleware.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.routes.ts        # Auth route definitions
│   │   ├── user.routes.ts        # User route definitions
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts       # Business logic for auth
│   │   ├── user.service.ts       # Business logic for users
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.types.ts         # Authentication types
│   │   ├── user.types.ts         # User-related types
│   │   └── index.ts
│   └── utils/
│       ├── logger.ts             # Winston logger config
│       ├── validators.ts         # Custom validators
│       └── index.ts
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Database seeding
├── tests/
│   ├── setup.ts                  # Test configuration
│   ├── unit/                     # Unit tests
│   └── integration/              # Integration tests
├── docker/
│   ├── Dockerfile                # Multi-stage Docker build
│   ├── docker-compose.yml        # Development environment
│   └── docker-compose.prod.yml   # Production environment
└── [config files]
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd airavate-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed the database (optional)
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### 🐳 Docker Development

1. **Start all services**
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose -f docker/docker-compose.yml exec app npm run db:migrate
   ```

3. **Seed database**
   ```bash
   docker-compose -f docker/docker-compose.yml exec app npm run db:seed
   ```

Services available:
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:8080 (admin@airavate.com / admin123)

## 📖 API Documentation

### Health Check
```
GET /health
```

### API Endpoints
```
GET  /api/v1           # API information
POST /api/v1/auth      # Authentication endpoints (coming soon)
GET  /api/v1/users     # User management endpoints (coming soon)
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Docker Build

1. **Build production image**
   ```bash
   docker-compose -f docker/docker-compose.prod.yml build
   ```

2. **Start production services**
   ```bash
   docker-compose -f docker/docker-compose.prod.yml up -d
   ```

### Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://yourdomain.com
# Add other production variables
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks (to be added)

## 🔒 Security Features

- **Helmet**: Sets security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt with configurable rounds
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 📊 Monitoring & Logging

- **Winston**: Structured logging with multiple transports
- **Health Checks**: Built-in health check endpoint
- **Audit Logs**: Database audit trail
- **Error Tracking**: Comprehensive error handling

## 🔮 Future Integrations

The architecture is designed to easily integrate:

- **Authentik**: Enterprise SSO/OAuth provider
- **Razorpay**: Payment processing
- **Redis**: Caching and session storage
- **Bull Queue**: Background job processing
- **Elasticsearch**: Search and analytics
- **Prometheus**: Metrics and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ for scalable applications
│   │   └── index.ts          # Exports all middleware
│   ├── routes
│   │   ├── auth.routes.ts     # Authentication routes
│   │   ├── user.routes.ts     # User management routes
│   │   └── index.ts          # Combines all routes
│   ├── services
│   │   ├── auth.service.ts    # Business logic for authentication
│   │   ├── user.service.ts     # Business logic for user management
│   │   └── index.ts          # Exports all services
│   ├── utils
│   │   ├── logger.ts          # Logging utility functions
│   │   ├── validators.ts      # Data validation functions
│   │   └── index.ts          # Exports all utilities
│   └── types
│       ├── auth.types.ts      # TypeScript types for authentication
│       ├── user.types.ts      # TypeScript types for user management
│       └── index.ts          # Exports all types
├── prisma
│   ├── schema.prisma          # Prisma schema definition
│   ├── migrations              # Database migration files
│   └── seed.ts                # Database seeding logic
├── tests
│   ├── unit
│   │   └── services           # Unit tests for services
│   ├── integration
│   │   └── routes             # Integration tests for routes
│   └── setup.ts               # Testing environment setup
├── docker
│   ├── Dockerfile             # Docker image build instructions
│   └── docker-compose.yml     # Docker service configurations
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── package.json                # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.js             # Jest testing configuration
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- Docker (optional, for containerization)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd airavate-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database and update the connection details in the `.env` file.

4. Run migrations:
   ```
   npx prisma migrate dev
   ```

5. Seed the database (optional):
   ```
   npx prisma db seed
   ```

### Running the Application
To start the server, run:
```
npm run start
```

### Running Tests
To execute the tests, run:
```
npm run test
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.