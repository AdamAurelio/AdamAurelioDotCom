# Development Environment Setup Script for Windows
# Run this with PowerShell

Write-Host "🚀 Setting up AdamAurelio.com Development Environment" -ForegroundColor Green
Write-Host "=====================================================`n" -ForegroundColor Green

# Check if required tools are installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan

$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
    Write-Host "❌ Docker is required but not installed. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Host "❌ Python is required but not installed. Please install Python 3.11+." -ForegroundColor Red
    exit 1
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "❌ Node.js is required but not installed. Please install Node.js 18+." -ForegroundColor Red
    exit 1
}

Write-Host "✅ All prerequisites are installed`n" -ForegroundColor Green

# Create environment file if it doesn't exist
if (-not (Test-Path .env.dev)) {
    Write-Host "📝 Creating .env.dev file..." -ForegroundColor Cyan
    Copy-Item .env.dev.example .env.dev
    Write-Host "⚠️  Please edit .env.dev and add your configuration values" -ForegroundColor Yellow
    Read-Host "Press Enter to continue after editing .env.dev"
}

# Build and start Docker containers
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml up -d --build

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py migrate

# Create superuser
Write-Host "👤 Creating superuser..." -ForegroundColor Cyan
$superuserScript = @"
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@adamaurelio.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
"@

$superuserScript | docker-compose -f docker-compose.dev.yml exec -T backend python manage.py shell

# Load initial data
Write-Host "📊 Loading sample data..." -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py loaddata initial_data.json 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "No initial data to load" -ForegroundColor Yellow
}

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

Write-Host "`n✅ Development environment setup complete!`n" -ForegroundColor Green
Write-Host "🌐 Access your application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend API: http://localhost:8000"
Write-Host "   Django Admin: http://localhost:8000/admin (admin/admin123)`n"
Write-Host "📝 Useful commands:" -ForegroundColor Cyan
Write-Host "   Start: docker-compose -f docker-compose.dev.yml up"
Write-Host "   Stop:  docker-compose -f docker-compose.dev.yml down"
Write-Host "   Logs:  docker-compose -f docker-compose.dev.yml logs -f`n"
Write-Host "Happy coding! 🎉" -ForegroundColor Green
