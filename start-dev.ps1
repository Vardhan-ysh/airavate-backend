# Automated Development Startup Script
Write-Host "Starting Airavate Development Environment..." -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker --version > $null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker is available" -ForegroundColor Green
    }
    else {
        Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check Authentik status
Write-Host "Checking Authentik status..." -ForegroundColor Yellow

Push-Location authentik
try {
    $output = docker-compose ps 2>$null
    if ($output -match "Up") {
        Write-Host "Authentik is already running!" -ForegroundColor Green
    }
    else {
        Write-Host "Starting Authentik services..." -ForegroundColor Yellow
        docker-compose up -d
        Write-Host "Waiting for Authentik to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
        Write-Host "Authentik started successfully!" -ForegroundColor Green
    }
    Write-Host "Authentik Admin: http://localhost:9000" -ForegroundColor Cyan
}
catch {
    Write-Host "Could not start Authentik: $_" -ForegroundColor Yellow
}
finally {
    Pop-Location
}

# Check Monitoring status
Write-Host "Checking Monitoring services (Prometheus + Grafana)..." -ForegroundColor Yellow

Push-Location monitoring
try {
    $output = docker-compose ps 2>$null
    if ($output -match "Up") {
        Write-Host "Monitoring services are already running!" -ForegroundColor Green
    }
    else {
        Write-Host "Starting Monitoring services..." -ForegroundColor Yellow
        docker-compose up -d
        Write-Host "Waiting for monitoring services to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        Write-Host "Monitoring services started successfully!" -ForegroundColor Green
    }
    Write-Host "Prometheus: http://localhost:9090" -ForegroundColor Cyan
    Write-Host "Grafana: http://localhost:3001 (admin/admin123)" -ForegroundColor Cyan
}
catch {
    Write-Host "Could not start monitoring services: $_" -ForegroundColor Yellow
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "Starting backend development server..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:3000/api/v1/docs" -ForegroundColor Cyan
Write-Host "Metrics Endpoint: http://localhost:3000/metrics" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoring Dashboard:" -ForegroundColor Yellow
Write-Host "  Prometheus: http://localhost:9090" -ForegroundColor Cyan
Write-Host "  Grafana: http://localhost:3001 (admin/admin123)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Yellow
