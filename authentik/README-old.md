# Authentik Setup for Airavate Backend

This directory contains the self-hosted Authentik configuration for user authentication and authorization.

## Quick Start

### 1. Start Authentik Services

```powershell
cd authentik
docker-compose up -d
```

### 2. Initial Setup

1. Wait for services to start (2-3 minutes)
2. Open http://localhost:9000/if/flow/initial-setup/
3. Create your admin account
4. Login to the admin interface

### 3. Create Application for Airavate Backend

1. Go to **Applications** → **Applications**
2. Click **Create**
3. Fill in:
   - **Name**: Airavate Backend API
   - **Slug**: airavate-backend
   - **Provider**: Create new OAuth2/OpenID Provider

### 4. Configure OAuth2/OpenID Provider

1. **Authorization flow**: `authorization-code (recommended)`
2. **Client type**: `Confidential`
3. **Client ID**: Will be auto-generated (save this)
4. **Client Secret**: Will be auto-generated (save this)
5. **Redirect URIs**: 
   ```
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   ```
6. **Signing Key**: Use the default
7. **Subject mode**: `Based on the User's ID`
8. **Include claims in id_token**: ✓ (checked)
9. **Issuer mode**: `Each provider has a different issuer`

### 5. Configure Scopes

Add these scopes to your provider:
- `openid` (required)
- `profile`
- `email`
- `offline_access` (for refresh tokens)

## Important URLs

- **Admin Interface**: http://localhost:9000/if/admin/
- **User Interface**: http://localhost:9000/
- **API Endpoints**: http://localhost:9000/api/v3/
- **OpenID Configuration**: http://localhost:9000/application/o/airavate-backend/.well-known/openid_configuration

## Integration with Backend

After setup, you'll need to update your backend `.env` file with:

```env
# Authentik Configuration
AUTHENTIK_ISSUER=http://localhost:9000/application/o/airavate-backend/
AUTHENTIK_CLIENT_ID=your_client_id_here
AUTHENTIK_CLIENT_SECRET=your_client_secret_here
AUTHENTIK_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Default Admin User

During initial setup, you'll create an admin user. This user will have full access to configure Authentik.

## Security Notes

1. **Change default passwords** in production
2. **Use HTTPS** in production (configure reverse proxy)
3. **Configure SMTP** for email notifications
4. **Regular backups** of PostgreSQL database
5. **Monitor logs** for security events

## Troubleshooting

### Services won't start
```powershell
docker-compose down
docker-compose pull
docker-compose up -d
```

### Check logs
```powershell
docker-compose logs authentik-server
docker-compose logs authentik-worker
```

### Reset database (WARNING: This will delete all data)
```powershell
docker-compose down -v
docker-compose up -d
```

## Production Considerations

1. **Use external PostgreSQL** for production
2. **Configure reverse proxy** (nginx/traefik) with SSL
3. **Set up monitoring** and alerting
4. **Configure backup strategy**
5. **Use environment-specific configuration**
