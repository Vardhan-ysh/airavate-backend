# Authentik Setup Script for Airavate Backend
# Run this step by step

Write-Host "🚀 Airavate Authentik Setup Script" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Step 1: Check Docker services
Write-Host "`n📋 Step 1: Checking Docker services..." -ForegroundColor Cyan
docker-compose ps

# Step 2: Wait for services to be ready
Write-Host "`n⏳ Step 2: Waiting for Authentik to start (this may take 2-3 minutes)..." -ForegroundColor Cyan
Write-Host "Services need to be 'healthy' before proceeding."

# Function to check service health
function Wait-ForServices {
    $maxAttempts = 30
    $attempt = 0
    
    do {
        $attempt++
        Write-Host "Attempt $attempt/$maxAttempts - Checking service status..." -ForegroundColor Yellow
        
        $status = docker-compose ps --format json | ConvertFrom-Json
        $healthyServices = ($status | Where-Object { $_.Health -eq "healthy" }).Count
        $totalServices = $status.Count
        
        Write-Host "Healthy services: $healthyServices/$totalServices" -ForegroundColor Yellow
        
        if ($healthyServices -eq $totalServices) {
            Write-Host "✅ All services are healthy!" -ForegroundColor Green
            return $true
        }
        
        Start-Sleep 10
    } while ($attempt -lt $maxAttempts)
    
    Write-Host "❌ Services did not become healthy in time. Check logs with: docker-compose logs" -ForegroundColor Red
    return $false
}

# Check if services are healthy
if (Wait-ForServices) {
    Write-Host "`n🎉 Services are ready!" -ForegroundColor Green
    
    # Step 3: Show next steps
    Write-Host "`n📝 Step 3: Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Open your browser and go to: http://localhost:9000/if/flow/initial-setup/" -ForegroundColor White
    Write-Host "2. Create your admin account" -ForegroundColor White
    Write-Host "3. Login to the admin interface" -ForegroundColor White
    Write-Host "4. Follow the configuration guide in the README.md" -ForegroundColor White
    
    # Step 4: Show useful URLs
    Write-Host "`n🔗 Important URLs:" -ForegroundColor Cyan
    Write-Host "• Initial Setup: http://localhost:9000/if/flow/initial-setup/" -ForegroundColor White
    Write-Host "• Admin Interface: http://localhost:9000/if/admin/" -ForegroundColor White
    Write-Host "• User Interface: http://localhost:9000/" -ForegroundColor White
    
    # Step 5: Show what to do after setup
    Write-Host "`n⚙️  After Initial Setup:" -ForegroundColor Cyan
    Write-Host "1. Create an OAuth2/OpenID Provider" -ForegroundColor White
    Write-Host "2. Create an Application for Airavate Backend" -ForegroundColor White
    Write-Host "3. Copy Client ID and Secret to your .env file" -ForegroundColor White
    Write-Host "4. Test the integration" -ForegroundColor White
} else {
    Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Red
    Write-Host "If services are not starting, try:" -ForegroundColor White
    Write-Host "• docker-compose down && docker-compose up -d" -ForegroundColor White
    Write-Host "• docker-compose logs authentik-server" -ForegroundColor White
    Write-Host "• docker-compose logs postgresql" -ForegroundColor White
}

Write-Host "`n📖 For detailed instructions, see: authentik/README.md" -ForegroundColor Cyan
