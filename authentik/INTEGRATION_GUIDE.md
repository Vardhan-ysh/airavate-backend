# 🔐 Authentik Integration Guide for Airavate Backend

## Overview

This guide will walk you through setting up Authentik as your self-hosted authentication provider for the Airavate backend. Authentik provides OAuth2/OpenID Connect authentication with a modern web interface.

## Prerequisites

- Docker and Docker Compose installed
- Airavate backend running
- Basic understanding of OAuth2/OpenID Connect

---

## 📦 **Phase 1: Authentik Installation**

### Step 1: Start Authentik Services

```powershell
cd authentik
docker-compose up -d
```

### Step 2: Verify Services

```powershell
docker-compose ps
```

Wait until all services show "healthy" status (2-3 minutes).

### Step 3: Initial Setup

1. Open: http://localhost:9000/if/flow/initial-setup/
2. Create your admin account:
   - **Email**: your-admin@airavate.com
   - **Username**: admin
   - **Password**: Choose a strong password

3. Login to admin interface: http://localhost:9000/if/admin/

---

## ⚙️ **Phase 2: Configure OAuth2 Provider**

### Step 1: Create OAuth2/OpenID Provider

1. Go to **Applications** → **Providers**
2. Click **Create**
3. Select **OAuth2/OpenID Provider**
4. Configure:
   - **Name**: `Airavate Backend Provider`
   - **Authorization flow**: `authorization-code (recommended)`
   - **Client type**: `Confidential`
   - **Client ID**: Auto-generated (save this!)
   - **Client Secret**: Auto-generated (save this!)
   - **Redirect URIs**: 
     ```
     http://localhost:3000/auth/callback
     http://localhost:3001/auth/callback
     ```
   - **Signing Key**: Use the default
   - **Subject mode**: `Based on the User's ID`
   - **Include claims in id_token**: ✅ Checked
   - **Issuer mode**: `Each provider has a different issuer`

### Step 2: Configure Scopes

Ensure these scopes are available:
- `openid` (required)
- `profile`
- `email`
- `offline_access` (for refresh tokens)

---

## 🎯 **Phase 3: Create Application**

### Step 1: Create Application

1. Go to **Applications** → **Applications**
2. Click **Create**
3. Configure:
   - **Name**: `Airavate Backend API`
   - **Slug**: `airavate-backend`
   - **Provider**: Select the provider you created above
   - **Launch URL**: `http://localhost:3000`

---

## 🔧 **Phase 4: Backend Integration**

### Step 1: Update Environment Variables

After creating the provider, update your `.env` file:

```env
# Authentik OAuth2/OpenID Configuration
AUTHENTIK_ISSUER=http://localhost:9000/application/o/airavate-backend/
AUTHENTIK_CLIENT_ID=your_actual_client_id_from_authentik
AUTHENTIK_CLIENT_SECRET=your_actual_client_secret_from_authentik
AUTHENTIK_REDIRECT_URI=http://localhost:3000/auth/callback
AUTHENTIK_SCOPE=openid profile email offline_access
```

### Step 2: Test Authentik Service

Create a test endpoint to verify integration:

```typescript
// Add this to your routes for testing
app.get('/auth/test', async (req, res) => {
  try {
    await authentikService.initialize();
    const authUrl = authentikService.getAuthorizationUrl();
    res.json({ 
      status: 'success', 
      authUrl,
      config: authentikService.getOIDCConfig() 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
```

---

## 🚀 **Phase 5: Implementation Steps**

### Step 1: Initialize Authentik Service

Add to your app startup:

```typescript
// In your app.ts or server.ts
import { authentikService } from '@services/authentik.service';

// Initialize during startup
app.listen(port, async () => {
  try {
    await authentikService.initialize();
    console.log('✅ Authentik service initialized');
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Failed to initialize Authentik:', error);
  }
});
```

### Step 2: Create Authentication Routes

```typescript
// POST /auth/login - Start OAuth flow
app.get('/auth/login', (req, res) => {
  const authUrl = authentikService.getAuthorizationUrl();
  res.redirect(authUrl);
});

// GET /auth/callback - Handle OAuth callback
app.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const tokens = await authentikService.exchangeCodeForTokens(code, state);
    const user = await authentikService.getUserInfo(tokens.access_token);
    
    // Store user in database, create session, etc.
    res.json({ success: true, user, tokens });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /auth/logout - Logout user
app.post('/auth/logout', async (req, res) => {
  try {
    const { id_token } = req.body;
    const logoutUrl = await authentikService.logout(id_token);
    res.json({ logoutUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 🔍 **Phase 6: Testing & Verification**

### Step 1: Test Endpoints

```powershell
# Test Authentik service initialization
curl http://localhost:3000/auth/test

# Test login flow
curl http://localhost:3000/auth/login
```

### Step 2: Frontend Integration

For your frontend application:

```javascript
// Login
window.location.href = 'http://localhost:3000/auth/login';

// Handle callback (if using frontend routing)
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

if (code) {
  // Send to your backend's /auth/callback endpoint
  fetch('/auth/callback?code=' + code + '&state=' + state)
    .then(res => res.json())
    .then(data => console.log('Authenticated:', data));
}
```

---

## 🛠️ **Phase 7: Advanced Configuration**

### User Groups and Permissions

1. In Authentik admin: **Directory** → **Groups**
2. Create groups like: `admin`, `user`, `premium`
3. Assign users to groups
4. Access groups in your backend via `user.groups`

### Custom User Attributes

1. **Directory** → **Users** → Select user
2. Add custom attributes in the **Attributes** tab
3. Access via `authentikService.getUserInfo()`

### Branding and Customization

1. **Applications** → **Brands**
2. Customize logo, colors, and branding
3. Upload custom CSS and templates

---

## 🚨 **Troubleshooting**

### Common Issues

1. **Services not starting**:
   ```powershell
   docker-compose down -v
   docker-compose up -d
   ```

2. **Connection refused**:
   - Check if all containers are healthy: `docker-compose ps`
   - Check logs: `docker-compose logs authentik-server`

3. **Invalid redirect URI**:
   - Ensure redirect URI in Authentik matches your backend
   - Check for trailing slashes

4. **Token validation failed**:
   - Verify issuer URL matches exactly
   - Check system time synchronization

### Logs and Debugging

```powershell
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs authentik-server
docker-compose logs postgresql
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f authentik-server
```

---

## 🔒 **Security Best Practices**

1. **Change default passwords** in production
2. **Use HTTPS** in production (set up reverse proxy)
3. **Configure SMTP** for email notifications
4. **Regular database backups**
5. **Monitor authentication logs**
6. **Use environment-specific secrets**

---

## 📚 **Next Steps**

After completing this setup:

1. ✅ Authentik is running on http://localhost:9000
2. ✅ OAuth2 provider configured
3. ✅ Backend integration ready
4. ✅ Test authentication flow

**Ready for production?**
- Set up reverse proxy with SSL
- Configure email notifications
- Set up monitoring and backups
- Review security settings

---

## 📞 **Support & Resources**

- **Authentik Documentation**: https://docs.goauthentik.io/
- **OAuth2 Flow Guide**: https://docs.goauthentik.io/providers/oauth2/
- **API Reference**: https://docs.goauthentik.io/developer-docs/api/

Happy authenticating! 🎉
