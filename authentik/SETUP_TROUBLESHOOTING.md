# 🚀 Self-Hosted Authentik Setup for Airavate - Manual Installation

## Overview
This guide provides step-by-step instructions for setting up Authentik for your Airavate backend when Docker registry access is limited.

## 📋 **Method 1: GitHub Container Registry Setup**

### Step 1: Create GitHub Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens (classic)
2. Generate a new token with `packages:read` scope
3. Save the token securely

### Step 2: Login to GitHub Container Registry
```powershell
# Login with your GitHub credentials
docker login ghcr.io
# Username: your-github-username
# Password: your-personal-access-token
```

### Step 3: Use Official Latest Version
```powershell
cd "c:\aaaStuff\web full\airavate-backend\authentik"

# Pull the latest stable image
docker pull ghcr.io/goauthentik/authentik:2024.6.3

# Start services
docker-compose up -d
```

---

## 📋 **Method 2: Alternative Docker Hub Images**

If GitHub Container Registry doesn't work, use these alternative images:

### Update docker-compose.yml:
```yaml
# Replace the image lines with:
authentik-server:
  image: beryju/authentik:stable  # Alternative Docker Hub image
  
authentik-worker:
  image: beryju/authentik:stable  # Alternative Docker Hub image
```

### Start services:
```powershell
docker-compose down -v  # Clean start
docker-compose up -d
```

---

## 📋 **Method 3: Binary Installation (If Docker Issues Persist)**

### Step 1: Install Python Dependencies
```powershell
# Install Python 3.11+ if not available
# Download from: https://www.python.org/downloads/

# Create virtual environment
python -m venv authentik-venv
authentik-venv\Scripts\activate

# Install Authentik
pip install authentik
```

### Step 2: Configure Authentik
```powershell
# Create config directory
mkdir authentik-config
cd authentik-config

# Create environment file
cp .env.example .env
# Edit .env with your settings
```

### Step 3: Start Authentik
```powershell
# Initialize database
ak migrate

# Create superuser
ak create_admin_group
ak create_admin_user

# Start server
ak server --host 0.0.0.0 --port 9000
```

---

## 🔧 **Current Status & Next Steps**

Since we're experiencing Docker registry issues, here's what's ready:

### ✅ **Already Complete:**
1. **Authentik service integration** - `/src/services/authentik.service.ts`
2. **Environment configuration** - Updated `.env` with Authentik settings
3. **Docker configuration** - `authentik/docker-compose.yml`
4. **Comprehensive documentation** - `authentik/INTEGRATION_GUIDE.md`

### 🔄 **Docker Troubleshooting Steps:**

```powershell
# Step 1: Try GitHub Container Registry login
docker login ghcr.io

# Step 2: If that works, pull image manually
docker pull ghcr.io/goauthentik/authentik:2024.6.3

# Step 3: Start services
cd "c:\aaaStuff\web full\airavate-backend\authentik"
docker-compose up -d

# Step 4: Check status
docker-compose ps
docker-compose logs authentik-server
```

### 🎯 **What You Need to Do:**

1. **Choose your installation method** (Docker or Binary)
2. **Complete Authentik setup** following the integration guide
3. **Configure OAuth2 provider** in Authentik admin panel
4. **Update .env file** with actual Client ID and Secret
5. **Test integration** with your backend

---

## 🚦 **Ready to Proceed?**

### Option A: Continue with Docker (Recommended)
```powershell
# Try this first
docker login ghcr.io
# Then provide your GitHub username and personal access token

# If successful:
cd "c:\aaaStuff\web full\airavate-backend\authentik"
docker-compose down -v
docker-compose up -d
```

### Option B: Use Alternative Setup
I can help you set up Authentik using a different approach if Docker continues to have issues.

### Option C: Simplified Testing Setup
For development/testing, I can create a simplified JWT authentication system while you resolve the Authentik Docker issues.

---

## 📞 **What's Your Preference?**

Let me know which approach you'd like to take:

1. **Docker with GitHub Container Registry** (try authentication)
2. **Alternative installation method** (binary/manual)
3. **Simplified JWT auth** for immediate testing
4. **Different container registry** (Docker Hub alternatives)

The backend integration code is ready - we just need Authentik running!

---

## 📖 **Documentation Ready:**

- `authentik/README.md` - Quick setup guide
- `authentik/INTEGRATION_GUIDE.md` - Complete integration walkthrough
- `authentik/setup.ps1` - Automated setup script
- `src/services/authentik.service.ts` - Backend integration service

Everything is prepared for when Authentik is running! 🎉
