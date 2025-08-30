# Simple initialization script to set up basic backend
# This will create the core .env file and run initial setup

$envFile = ".env"
$envExampleFile = ".env.example"

Write-Host "🚀 Setting up Airavate Backend..." -ForegroundColor Green

# Copy .env.example to .env if it doesn't exist
if (-not (Test-Path $envFile)) {
    if (Test-Path $envExampleFile) {
        Copy-Item $envExampleFile $envFile
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    }
    else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Yellow
}

Write-Host "🔧 Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your database credentials" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000/health" -ForegroundColor White
