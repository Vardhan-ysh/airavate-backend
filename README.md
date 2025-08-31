# 🚀 Airavate Backend

A scalable, production-grade backend API for the Airavate project with integrated OAuth2/OpenID Connect authentication via Authentik.

## 📋 Features

- ✅ **Dual Authentication System** (Email/Password + Google OAuth via Authentik)
- ✅ **User Management** with JWT tokens
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **Comprehensive API Documentation** (Swagger/OpenAPI)
- ✅ **Health Monitoring** & Winston logging
- ✅ **Rate Limiting** & Security headers
- ✅ **CORS Support** & Input validation
- ✅ **TypeScript** with strict type checking
- ✅ **Jest Testing** framework
- ✅ **Docker Compose** for Authentik services
- 🔄 **Payment Processing** (Razorpay - Coming Soon)

## 🏗️ Project Structure

```
airavate-backend/
├── 📁 src/                          # Source code
│   ├── app.ts                       # Express app configuration
│   ├── server.ts                    # Server entry point
│   ├── 📁 config/                   # Configuration files
│   │   ├── database.ts              # Prisma database config
│   │   ├── environment.ts           # Environment variables
│   │   ├── swagger.ts               # OpenAPI/Swagger setup
│   │   └── index.ts                 # Config exports
│   ├── 📁 controllers/              # Route controllers
│   │   ├── auth.controller.ts       # Authentication logic
│   │   ├── user.controller.ts       # User management
│   │   └── index.ts                 # Controller exports
│   ├── 📁 middleware/               # Express middleware
│   │   ├── auth.middleware.ts       # JWT validation
│   │   ├── error.middleware.ts      # Error handling
│   │   ├── validation.middleware.ts # Request validation
│   │   └── index.ts                 # Middleware exports
│   ├── 📁 routes/                   # API routes
│   │   ├── auth.routes.ts           # Authentication endpoints
│   │   ├── user.routes.ts           # User endpoints
│   │   └── index.ts                 # Route exports
│   ├── 📁 services/                 # Business logic
│   │   ├── auth.service.ts          # Authentication service
│   │   ├── authentik.service.ts     # Authentik integration
│   │   ├── user.service.ts          # User service
│   │   └── index.ts                 # Service exports
│   ├── 📁 types/                    # TypeScript types
│   │   ├── auth.types.ts            # Authentication types
│   │   ├── user.types.ts            # User types
│   │   └── index.ts                 # Type exports
│   └── 📁 utils/                    # Utility functions
│       ├── logger.ts                # Winston logger
│       └── index.ts                 # Utility exports
├── 📁 prisma/                       # Database schema & migrations
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Database seeding
│   └── 📁 migrations/               # Database migrations
├── 📁 authentik/                    # Authentik authentication server
│   ├── docker-compose.yml          # Authentik services
│   ├── .env.example                # Environment template
│   ├── 📁 certs/                   # SSL certificates
│   ├── 📁 custom-templates/        # Custom auth templates
│   └── 📁 media/                   # Static files
├── 📁 docs/                        # API documentation
│   └── openapi.yaml                # OpenAPI specification
├── 📁 tests/                       # Test files
│   └── setup.ts                    # Jest configuration
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── jest.config.js                   # Jest test config
├── eslint.config.js                 # ESLint config
├── setup.ps1                        # Initial project setup
├── start-dev.ps1                    # Development startup script
└── .env.example                     # Environment template
```

## 🗄️ Database Schema

### User Table
```sql
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String?
  lastName  String?
  picture   String?
  provider  String   @default("email") // "email" or "google"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

**Fields:**
- `id`: Unique identifier (CUID)
- `email`: User email address (unique)
- `firstName`: User's first name (optional)
- `lastName`: User's last name (optional)
- `picture`: Profile picture URL (optional)
- `provider`: Authentication provider ("email" or "google")
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

## 🛣️ API Routes & Endpoints

### Health Check Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/health` | System health status | ❌ |

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-31T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register with email/password | ❌ |
| POST | `/api/v1/auth/login` | Login with email/password | ❌ |
| GET | `/api/v1/auth/oauth/google` | Get Google OAuth URL | ❌ |
| GET | `/api/v1/auth/oauth/callback` | OAuth callback handler | ❌ |
| POST | `/api/v1/auth/logout` | Logout user | ✅ |
| GET | `/api/v1/auth/me` | Get current user info | ✅ |

**Registration Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**OAuth Flow:**
1. **GET** `/api/v1/auth/oauth/google` - Returns Google OAuth URL
2. User authenticates with Google via Authentik
3. **GET** `/api/v1/auth/oauth/callback?code=...` - Exchanges code for token
4. Returns JWT token for subsequent requests

**Auth Response Example:**
```json
{
  "user": {
    "id": "clx123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "provider": "email"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/profile` | Get user profile | ✅ |
| PUT | `/api/v1/users/profile` | Update user profile | ✅ |
| DELETE | `/api/v1/users/account` | Delete user account | ✅ |

**Profile Update Request:**
```json
{
  "name": "Updated Name",
  "picture": "https://example.com/new-avatar.jpg"
}
```

### API Documentation Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/docs` | Swagger UI documentation | ❌ |
| GET | `/api/v1/docs.json` | OpenAPI JSON specification | ❌ |
| GET | `/api/v1/docs.yaml` | OpenAPI YAML specification | ❌ |

## 🔐 Authentication Flow

### Email/Password Authentication
1. **Registration**: User registers with email/password via `/api/v1/auth/register`
2. **Login**: User logs in with credentials via `/api/v1/auth/login`
3. **JWT Token**: Backend issues JWT for subsequent requests
4. **Protected Routes**: JWT required for protected endpoints

### Google OAuth Authentication
1. **Initiate OAuth**: User visits `/api/v1/auth/oauth/google`
2. **OAuth URL**: Backend returns Google OAuth authorization URL
3. **User Authentication**: User authenticates with Google via Authentik
4. **Authorization Code**: Authentik redirects to `/api/v1/auth/oauth/callback`
5. **Token Exchange**: Backend exchanges code for user information
6. **User Creation/Login**: User profile is created or updated
7. **JWT Token**: Backend issues JWT for subsequent requests
8. **Protected Routes**: JWT required for protected endpoints

## 🚀 Complete Setup Instructions

### Prerequisites
- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **PostgreSQL** database (we recommend Neon for cost-effectiveness)
- **PowerShell** (for Windows setup scripts)

### 1. Clone Repository
```bash
git clone https://github.com/Vardhan-ysh/airavate-backend.git
cd airavate-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment templates
cp .env.example .env
cp authentik/.env.example authentik/.env

# Run initial setup (Windows PowerShell)
./setup.ps1
```

### 4. Configure Environment Variables

#### Backend (.env)
```bash
# Database (Use your Neon PostgreSQL connection string)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development

# JWT Configuration
JWT_SECRET="your-super-secure-jwt-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Authentik OAuth Configuration
AUTHENTIK_ISSUER="http://localhost:9000/application/o/airavate-backend/"
AUTHENTIK_CLIENT_ID="your-authentik-client-id"
AUTHENTIK_CLIENT_SECRET="your-authentik-client-secret"
AUTHENTIK_REDIRECT_URI="http://localhost:3000/api/v1/auth/oauth/callback"
AUTHENTIK_SCOPE="openid profile email"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
PRISMA_LOG_LEVEL="info"
```

#### Authentik (authentik/.env)
```bash
# PostgreSQL Database (Authentik's internal database)
PG_PASS=authentik_secure_password_change_me
PG_USER=authentik
PG_DB=authentik

# Authentik Configuration
AUTHENTIK_SECRET_KEY="generate-a-secure-50-character-secret-key-here"
AUTHENTIK_ERROR_REPORTING__ENABLED=false
AUTHENTIK_DISABLE_UPDATE_CHECK=true
AUTHENTIK_DISABLE_STARTUP_ANALYTICS=true

# Email Configuration (Optional - for password resets)
AUTHENTIK_EMAIL__HOST=smtp.gmail.com
AUTHENTIK_EMAIL__PORT=587
AUTHENTIK_EMAIL__USERNAME=your-email@gmail.com
AUTHENTIK_EMAIL__PASSWORD=your-app-password
AUTHENTIK_EMAIL__USE_TLS=true
AUTHENTIK_EMAIL__USE_SSL=false
AUTHENTIK_EMAIL__FROM=authentik@yourdomain.com
```

### 5. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name initial

# Optional: Seed database with sample data
npx prisma db seed
```

### 6. Start Authentik Authentication Server

```bash
# Navigate to authentik directory
cd authentik

# Start Authentik services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs if needed
docker-compose logs -f
```

Wait 2-3 minutes for all services to fully start and become healthy.

### 7. Configure Authentik OAuth Setup

#### 7.1 Access Authentik Admin
1. **Open**: http://localhost:9000
2. **Login with**: `akadmin` / `admin123!` (or your admin credentials)

#### 7.2 Create Google OAuth Source
1. **Navigate**: Directory → Federation & Social login
2. **Create Source**: Google
3. **Configure**:
   - **Name**: `Google OAuth`
   - **Slug**: `google`
   - **Consumer key**: Your Google OAuth Client ID
   - **Consumer secret**: Your Google OAuth Client Secret
4. **Save**

#### 7.3 Create OAuth2 Provider
1. **Navigate**: Applications → Providers
2. **Create Provider**: OAuth2/OpenID Provider
3. **Configure**:
   - **Name**: `Airavate Backend OAuth`
   - **Client type**: `Confidential`
   - **Redirect URIs**: `http://localhost:3000/api/v1/auth/oauth/callback`
   - **Scopes**: `openid profile email`
4. **Save** and copy the **Client ID** and **Client Secret**

#### 7.4 Create Application
1. **Navigate**: Applications → Applications
2. **Create Application**:
   - **Name**: `Airavate Backend`
   - **Slug**: `airavate-backend`
   - **Provider**: Select the provider from step 7.3
3. **Save**

#### 7.5 Update Environment Variables
Copy the Client ID and Secret to your `.env` file:
```bash
AUTHENTIK_CLIENT_ID="your-copied-client-id"
AUTHENTIK_CLIENT_SECRET="your-copied-client-secret"
```

### 8. Start Development Server

#### Option A: Automated Start (Recommended)
```bash
# This script checks if Authentik is running and starts it if needed
./start-dev.ps1
```

#### Option B: Manual Start
```bash
# Terminal 1: Ensure Authentik is running
cd authentik
docker-compose up -d

# Terminal 2: Start Backend (from project root)
npm run dev
```

### 9. Verify Complete Setup

#### 9.1 Check All Services
- **Backend API**: http://localhost:3000/api/v1/health
- **API Documentation**: http://localhost:3000/api/v1/docs
- **Authentik Admin**: http://localhost:9000/if/admin/
- **Authentik User Portal**: http://localhost:9000

#### 9.2 Test Authentication Endpoints

**Test Email/Password Registration:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!","firstName":"Test","lastName":"User"}'
```

**Test Email/Password Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPassword123!"}'
```

**Test Google OAuth URL Generation:**
```bash
curl http://localhost:3000/api/v1/auth/oauth/google
```

**Test Protected Route (use token from login response):**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/v1/auth/me
```

#### 9.3 Create Test User (Optional)
1. **Access Authentik Admin**: http://localhost:9000/if/admin/
2. **Go to Directory** → **Users**
3. **Create User**: Add test user with email and password
4. **Test Login**: Use the test user to verify authentication

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Authentication Flow
1. Visit: http://localhost:3000/api/v1/auth/login
2. Complete Authentik authentication
3. Verify redirect to callback
4. Check JWT token in response

## 📝 Development Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Database Operations
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio GUI

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🔧 Production Deployment

For production deployment, ensure you:

1. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Use secure, production-grade secrets
   - Configure production database URL
   - Set proper CORS origins

2. **Security**:
   - Use HTTPS/SSL certificates
   - Secure JWT secrets (minimum 32 characters)
   - Configure proper authentication scopes
   - Set up rate limiting

3. **Database**:
   - Use production PostgreSQL (e.g., Neon, AWS RDS)
   - Run migrations: `npx prisma migrate deploy`
   - Set up database backups

4. **Monitoring**:
   - Configure production logging
   - Set up health check monitoring
   - Configure error tracking
   - Set up performance monitoring

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentik Not Starting
```bash
# Check Docker services status
docker-compose -f authentik/docker-compose.yml ps

# View service logs
docker-compose -f authentik/docker-compose.yml logs authentik-server
docker-compose -f authentik/docker-compose.yml logs authentik-worker
docker-compose -f authentik/docker-compose.yml logs postgresql
docker-compose -f authentik/docker-compose.yml logs redis

# Restart services
docker-compose -f authentik/docker-compose.yml restart
```

#### 2. Database Connection Issues
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test database connection
npx prisma db pull

# Regenerate Prisma client
npx prisma generate
```

#### 3. OAuth2 Authentication Fails
- Verify `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` in `.env`
- Check redirect URI matches exactly: `http://localhost:3000/api/v1/auth/callback`
- Ensure Authentik is accessible at `http://localhost:9000`
- Verify scopes include: `openid`, `profile`, `email`

#### 4. JWT Token Issues
- Ensure `JWT_SECRET` is set and at least 32 characters
- Check token expiration with `JWT_EXPIRES_IN`
- Verify Authorization header format: `Bearer <token>`

#### 5. CORS Issues
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- For development, you can set `CORS_ORIGIN=*` temporarily

### Docker Issues
```bash
# Reset Docker state
docker-compose -f authentik/docker-compose.yml down -v
docker-compose -f authentik/docker-compose.yml up -d

# Clear Docker cache
docker system prune -f
```

## 📚 Additional Resources

- [Authentik Documentation](https://goauthentik.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

- **Authentik** - Self-hosted authentication platform
- **Prisma** - Next-generation ORM for Node.js and TypeScript
- **Express.js** - Fast, unopinionated, minimalist web framework
- **TypeScript** - Typed JavaScript at any scale
